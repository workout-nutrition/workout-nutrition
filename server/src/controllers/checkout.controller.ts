import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import crypto from 'crypto';
import { supabaseAdmin } from '../lib/supabase.js';
import { razorpay } from '../lib/razorpay.js';
import { env } from '../config/env.js';
import { logger } from '../config/logger.js';
import { AppError } from '../middleware/errorHandler.js';
import { resolveAndPriceOrder } from '../services/pricing.service.js';
import { emailService } from '../services/email.service.js';

const shippingAddressSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().min(10, 'Valid 10-digit phone number is required'),
  addressLine: z.string().min(5, 'Address is required'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  pinCode: z.string().regex(/^\d{6}$/, 'PIN Code must be a 6-digit number'),
});

const checkoutSessionSchema = z.object({
  items: z
    .array(
      z.object({
        productId: z.string().min(1),
        flavour: z.string().default('Standard'),
        size: z.string().default('Standard'),
        qty: z.number().int().positive('Quantity must be at least 1'),
        variantId: z.string().optional(),
      })
    )
    .min(1, 'At least one item is required'),
  couponCode: z.string().optional(),
  shippingAddress: shippingAddressSchema,
});

const verifyPaymentSchema = z.object({
  orderId: z.string().min(1, 'Order ID is required'),
  razorpayOrderId: z.string().min(1, 'Razorpay Order ID is required'),
  razorpayPaymentId: z.string().min(1, 'Razorpay Payment ID is required'),
  razorpaySignature: z.string().min(1, 'Razorpay Signature is required'),
});

/**
 * POST /api/checkout/session
 * Computes server-side pricing, records pending order, and creates Razorpay Order.
 */
export async function createCheckoutSession(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { items, couponCode, shippingAddress } = checkoutSessionSchema.parse(req.body);
    const userId = req.user?.id || null;

    // 1. Authoritative server-side pricing calculation
    const pricing = await resolveAndPriceOrder(items, couponCode);

    // 2. Generate unique order number
    const orderNumber = `WN-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

    // 3. Create pending order in database
    const { data: order, error: orderErr } = await supabaseAdmin
      .from('orders')
      .insert({
        order_number: orderNumber,
        user_id: userId,
        customer_name: shippingAddress.fullName,
        customer_email: shippingAddress.email,
        customer_phone: shippingAddress.phone,
        shipping_address: shippingAddress,
        subtotal: Math.round(pricing.subtotalPaise / 100),
        shipping_charge: Math.round(pricing.shippingPaise / 100),
        total_amount: Math.round(pricing.totalPaise / 100),
        subtotal_paise: pricing.subtotalPaise,
        discount_paise: pricing.discountPaise,
        shipping_paise: pricing.shippingPaise,
        tax_paise: pricing.taxPaise,
        total_paise: pricing.totalPaise,
        coupon_id: pricing.coupon?.id || null,
        coupon_code: pricing.coupon?.code || null,
        currency: 'inr',
        payment_method: 'stripe', // Kept for backwards DB check constraint compatibility
        status: 'pending',
        payment_status: 'unpaid',
      })
      .select('id, order_number')
      .single();

    if (orderErr || !order) {
      logger.error({ orderErr }, 'Failed to insert pending order');
      throw new AppError('Failed to create order record', 500);
    }

    // 4. Create order items snapshots
    const orderItemsPayload = pricing.orderItems.map((item) => ({
      order_id: order.id,
      product_id: item.productId,
      product_name: item.name,
      product_image: item.image || null,
      quantity: item.qty,
      unit_price: Math.round(item.unitPricePaise / 100),
      line_total: Math.round(item.totalPricePaise / 100),
    }));

    const { error: itemsErr } = await supabaseAdmin
      .from('order_items')
      .insert(orderItemsPayload);

    if (itemsErr) {
      logger.error({ itemsErr }, 'Failed to insert order items');
      throw new AppError('Failed to record order items', 500);
    }

    // 5. Create Razorpay Order
    // Minimum 100 paise (₹1) for Razorpay orders
    const amountInPaise = Math.max(100, pricing.totalPaise);
    const rzpOrder = await razorpay.orders.create({
      amount: amountInPaise,
      currency: 'INR',
      receipt: order.order_number,
      notes: {
        order_id: order.id,
        order_number: order.order_number,
        user_id: userId || '',
      },
    });

    // 6. Track initiated payment record
    try {
      await supabaseAdmin.from('payments').insert({
        order_id: order.id,
        provider: 'stripe', // Kept compliant with existing DB check constraint
        stripe_checkout_session_id: rzpOrder.id, // Store razorpay order ID
        amount_paise: pricing.totalPaise,
        currency: 'inr',
        status: 'initiated',
      });
    } catch (payErr) {
      logger.warn({ payErr }, 'Could not record initial payment record, non-fatal');
    }

    logger.info(
      { orderId: order.id, razorpayOrderId: rzpOrder.id, totalPaise: pricing.totalPaise },
      'Razorpay order initialized'
    );

    res.status(200).json({
      orderId: order.id,
      orderNumber: order.order_number,
      razorpayOrderId: rzpOrder.id,
      totalPaise: pricing.totalPaise,
      razorpayKeyId: env.RAZORPAY_KEY_ID,
      currency: 'INR',
    });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/checkout/verify
 * Verifies Razorpay payment signature and completes order atomically.
 */
export async function verifyRazorpayPayment(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature } =
      verifyPaymentSchema.parse(req.body);

    // 1. Verify HMAC SHA256 Signature
    const expectedSignature = crypto
      .createHmac('sha256', env.RAZORPAY_KEY_SECRET)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest('hex');

    if (expectedSignature !== razorpaySignature) {
      logger.error(
        { orderId, razorpayOrderId, razorpayPaymentId },
        'Razorpay signature verification mismatch'
      );
      throw new AppError('Invalid payment signature verification failed', 400);
    }

    // 2. Fetch order to verify state
    const { data: order, error: orderErr } = await supabaseAdmin
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (orderErr || !order) {
      throw new AppError('Order not found', 404);
    }

    if (order.payment_status === 'paid') {
      res.status(200).json({ success: true, message: 'Order already paid', orderId });
      return;
    }

    // 3. Atomically decrement stock for all order items
    const { data: items } = await supabaseAdmin
      .from('order_items')
      .select('product_id, quantity, product_name')
      .eq('order_id', orderId);

    if (items) {
      for (const item of items) {
        const { error: decErr } = await supabaseAdmin.rpc('decrement_stock', {
          p_product_id: item.product_id,
          p_quantity: item.quantity,
        });

        if (decErr) {
          logger.warn(
            { item, decErr },
            `Stock decrement warning for item ${item.product_name}`
          );
        }
      }
    }

    // 4. Update order status to paid / processing
    await supabaseAdmin
      .from('orders')
      .update({
        status: 'processing',
        payment_status: 'paid',
        updated_at: new Date().toISOString(),
      })
      .eq('id', orderId);

    // 5. Update payments record
    await supabaseAdmin
      .from('payments')
      .upsert({
        order_id: orderId,
        provider: 'stripe',
        stripe_checkout_session_id: razorpayOrderId,
        stripe_payment_intent_id: razorpayPaymentId,
        amount_paise: 0,
        currency: 'inr',
        status: 'succeeded',
        updated_at: new Date().toISOString(),
      });

    // 6. Increment coupon usage if used
    if (order.coupon_id) {
      const { data: c } = await supabaseAdmin
        .from('coupons')
        .select('times_used')
        .eq('id', order.coupon_id)
        .single();

      if (c) {
        await supabaseAdmin
          .from('coupons')
          .update({ times_used: c.times_used + 1 })
          .eq('id', order.coupon_id);
      }
    }

    logger.info({ orderId, razorpayPaymentId }, 'Razorpay payment verified and order updated to paid');

    // 7. Non-blocking asynchronous dual email notification (Customer + Admin)
    setImmediate(async () => {
      try {
        const emailPayload = {
          id: order.id,
          orderNumber: order.order_number,
          customerName: order.customer_name,
          customerEmail: order.customer_email,
          customerPhone: order.customer_phone,
          shippingAddress: order.shipping_address || {},
          totalPaise: order.total_paise || (order.total_amount ? order.total_amount * 100 : 0),
          paymentMethod: 'Online Payment (Razorpay)',
          paymentStatus: 'Paid',
          items: (items || []).map((it) => ({
            name: it.product_name,
            qty: it.quantity,
            unitPricePaise: 0,
            totalPricePaise: 0,
            image: null,
          })),
        };

        await Promise.allSettled([
          emailService.sendCustomerOrderConfirmation(emailPayload),
          emailService.sendAdminOrderAlert(emailPayload),
        ]);
      } catch (emailErr) {
        logger.error({ emailErr }, 'Async order confirmation email dispatch error (non-fatal)');
      }
    });

    res.status(200).json({
      success: true,
      message: 'Payment verified successfully',
      orderId,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/orders/cod
 * Handles Cash on Delivery orders with server-side validation and atomic stock deduction.
 */
export async function createCodOrder(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { items, couponCode, shippingAddress } = checkoutSessionSchema.parse(req.body);
    const userId = req.user?.id || null;

    // 1. Authoritative server pricing
    const pricing = await resolveAndPriceOrder(items, couponCode);

    // 2. Atomically decrement stock for all items
    for (const item of pricing.orderItems) {
      const { data: success, error: decErr } = await supabaseAdmin.rpc('decrement_variant_stock', {
        p_product_id: item.productId,
        p_variant_id: item.variantId || '',
        p_flavour: item.flavour,
        p_weight: item.size,
        p_quantity: item.qty,
      });

      if (decErr) {
        // Fallback to classic decrement_stock if RPC does not exist
        const { data: fallbackSuccess } = await supabaseAdmin.rpc('decrement_stock', {
          p_product_id: item.productId,
          p_quantity: item.qty,
        });

        if (!fallbackSuccess) {
          throw new AppError(
            `Product "${item.name}" ran out of stock during checkout. Please adjust your cart.`,
            409
          );
        }
      } else if (!success) {
        throw new AppError(
          `Variant (${item.flavour}, ${item.size}) of "${item.name}" is out of stock. Please adjust your cart.`,
          409
        );
      }
    }

    // 3. Increment coupon usage if applied
    if (pricing.coupon) {
      await supabaseAdmin
        .from('coupons')
        .update({
          times_used: pricing.coupon.times_used + 1,
          updated_at: new Date().toISOString(),
        })
        .eq('id', pricing.coupon.id);
    }

    // 4. Create COD order
    const orderNumber = `WN-COD-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const { data: order, error: orderErr } = await supabaseAdmin
      .from('orders')
      .insert({
        order_number: orderNumber,
        user_id: userId,
        customer_name: shippingAddress.fullName,
        customer_email: shippingAddress.email,
        customer_phone: shippingAddress.phone,
        shipping_address: shippingAddress,
        subtotal: Math.round(pricing.subtotalPaise / 100),
        shipping_charge: Math.round(pricing.shippingPaise / 100),
        total_amount: Math.round(pricing.totalPaise / 100),
        subtotal_paise: pricing.subtotalPaise,
        discount_paise: pricing.discountPaise,
        shipping_paise: pricing.shippingPaise,
        tax_paise: pricing.taxPaise,
        total_paise: pricing.totalPaise,
        coupon_id: pricing.coupon?.id || null,
        coupon_code: pricing.coupon?.code || null,
        currency: 'inr',
        payment_method: 'cod',
        status: 'cod_pending',
        payment_status: 'cod_pending',
      })
      .select('id, order_number')
      .single();

    if (orderErr || !order) {
      throw new AppError('Failed to record COD order', 500);
    }

    // 5. Create order items
    const orderItemsPayload = pricing.orderItems.map((item) => ({
      order_id: order.id,
      product_id: item.productId,
      product_name: item.name,
      product_image: item.image || null,
      quantity: item.qty,
      unit_price: Math.round(item.unitPricePaise / 100),
      line_total: Math.round(item.totalPricePaise / 100),
    }));

    await supabaseAdmin.from('order_items').insert(orderItemsPayload);

    // 6. Record payment row
    await supabaseAdmin.from('payments').insert({
      order_id: order.id,
      provider: 'cod',
      amount_paise: pricing.totalPaise,
      currency: 'inr',
      status: 'initiated',
    });

    logger.info({ orderId: order.id, orderNumber }, 'COD Order placed successfully');

    // 7. Non-blocking asynchronous dual email notification (Customer + Admin)
    setImmediate(async () => {
      try {
        const emailPayload = {
          id: order.id,
          orderNumber: order.order_number,
          customerName: shippingAddress.fullName,
          customerEmail: shippingAddress.email,
          customerPhone: shippingAddress.phone,
          shippingAddress: shippingAddress,
          totalPaise: pricing.totalPaise,
          paymentMethod: 'Cash on Delivery (COD)',
          paymentStatus: 'Pending Payment at Delivery',
          items: pricing.orderItems.map((item) => ({
            name: item.name,
            flavour: item.flavour,
            size: item.size,
            qty: item.qty,
            unitPricePaise: item.unitPricePaise,
            totalPricePaise: item.totalPricePaise,
            image: item.image,
          })),
        };

        await Promise.allSettled([
          emailService.sendCustomerOrderConfirmation(emailPayload),
          emailService.sendAdminOrderAlert(emailPayload),
        ]);
      } catch (emailErr) {
        logger.error({ emailErr }, 'Async COD confirmation email dispatch error (non-fatal)');
      }
    });

    res.status(201).json({
      orderId: order.id,
      orderNumber: order.order_number,
      status: 'cod_pending',
      totalPaise: pricing.totalPaise,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/orders/:id
 * Fetches order details with strict owner or admin authorization check.
 */
export async function getOrderById(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params;
    if (!id) {
      throw new AppError('Order ID is required', 400);
    }

    const { data: order, error: orderErr } = await supabaseAdmin
      .from('orders')
      .select('*')
      .eq('id', id)
      .single();

    if (orderErr || !order) {
      throw new AppError('Order not found', 404);
    }

    // Verify ownership: must match authenticated user ID, or user is admin
    if (order.user_id && req.user?.id !== order.user_id && req.user?.role !== 'admin') {
      throw new AppError('Forbidden: You do not have permission to view this order', 403);
    }

    const { data: items } = await supabaseAdmin
      .from('order_items')
      .select('*')
      .eq('order_id', id);

    res.status(200).json({
      order,
      items: items || [],
    });
  } catch (err) {
    next(err);
  }
}
