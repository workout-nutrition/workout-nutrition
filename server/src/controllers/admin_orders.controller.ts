import { Request, Response, NextFunction } from 'express';
import { supabaseAdmin } from '../lib/supabase.js';
import { emailService } from '../services/email.service.js';
import { logger } from '../config/logger.js';
import { AppError } from '../middleware/errorHandler.js';

/**
 * GET /api/orders/admin/all
 * Returns all customer orders sorted by latest, including item snapshots.
 */
export async function getAllAdminOrders(
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { data: orders, error } = await supabaseAdmin
      .from('orders')
      .select('*, order_items(*)')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    res.status(200).json({
      success: true,
      orders: orders || [],
    });
  } catch (err) {
    next(err);
  }
}

/**
 * PATCH /api/orders/admin/:id/status
 * Updates order status (e.g. confirmed, shipped, delivered) and triggers customer status email.
 */
export async function updateAdminOrderStatus(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params;
    const { status, trackingNumber } = req.body;

    const validStatuses = ['pending', 'processing', 'confirmed', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      throw new AppError(`Invalid status. Must be one of: ${validStatuses.join(', ')}`, 400);
    }

    const { data: existingOrder, error: findErr } = await supabaseAdmin
      .from('orders')
      .select('*')
      .eq('id', id)
      .single();

    if (findErr || !existingOrder) {
      throw new AppError('Order not found', 404);
    }

    const updatePayload: Record<string, any> = {
      status,
      updated_at: new Date().toISOString(),
    };

    if (trackingNumber) {
      updatePayload.tracking_number = trackingNumber;
    }

    let estimatedDeliveryStr = '';
    if (status === 'confirmed') {
      const deliveryDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);
      estimatedDeliveryStr = deliveryDate.toLocaleDateString('en-IN', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
      // Store delivery note in notes column
      updatePayload.notes = JSON.stringify({
        confirmed_at: new Date().toISOString(),
        estimated_delivery: deliveryDate.toISOString(),
        estimated_delivery_text: estimatedDeliveryStr,
      });
    }

    const { data: updatedOrder, error: updateErr } = await supabaseAdmin
      .from('orders')
      .update(updatePayload)
      .eq('id', id)
      .select('*, order_items(*)')
      .single();

    if (updateErr) {
      throw updateErr;
    }

    // Non-blocking status notification email to customer
    if (status === 'confirmed' || status === 'shipped' || status === 'delivered') {
      setImmediate(async () => {
        try {
          await emailService.sendOrderStatusUpdate(
            updatedOrder.customer_email,
            updatedOrder.customer_name,
            updatedOrder.order_number,
            status,
            estimatedDeliveryStr
          );
        } catch (mailErr) {
          logger.error({ mailErr }, 'Failed to dispatch status update email to customer');
        }
      });
    }

    logger.info({ orderId: id, newStatus: status }, 'Admin updated order status');

    res.status(200).json({
      success: true,
      message: `Order status updated to ${status}`,
      order: updatedOrder,
    });
  } catch (err) {
    next(err);
  }
}

