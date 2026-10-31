import nodemailer, { Transporter } from 'nodemailer';
import { env } from '../config/env.js';
import { logger } from '../config/logger.js';

export interface EmailOrderItem {
  name: string;
  flavour?: string;
  size?: string;
  qty: number;
  unitPricePaise: number;
  totalPricePaise: number;
  image?: string | null;
}

export interface EmailOrderPayload {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: {
    addressLine?: string;
    city?: string;
    state?: string;
    pinCode?: string;
  };
  totalPaise: number;
  paymentMethod: string;
  paymentStatus: string;
  items: EmailOrderItem[];
  trackingUrl?: string;
}

class EmailService {
  private transporter: Transporter | null = null;

  constructor() {
    this.initializeTransporter();
  }

  private initializeTransporter() {
    if (env.SMTP_USER && env.SMTP_PASS) {
      try {
        this.transporter = nodemailer.createTransport({
          host: env.SMTP_HOST || 'smtp.gmail.com',
          port: env.SMTP_PORT || 465,
          secure: env.SMTP_SECURE,
          auth: {
            user: env.SMTP_USER,
            pass: env.SMTP_PASS.replace(/\s+/g, ''), // Strip spaces from app password
          },
        });
        logger.info({ user: env.SMTP_USER }, '📧 Nodemailer SMTP Transporter initialized successfully');
      } catch (err) {
        logger.error({ err }, 'Failed to initialize Nodemailer transporter');
      }
    } else {
      logger.warn('Nodemailer SMTP_USER or SMTP_PASS not set in environment. Outgoing emails will be logged only.');
    }
  }

  public isConfigured(): boolean {
    return Boolean(env.SMTP_USER && env.SMTP_PASS);
  }

  /**
   * 1. Send Order Confirmation Email to Customer
   */
  public async sendCustomerOrderConfirmation(order: EmailOrderPayload): Promise<boolean> {
    if (!this.transporter || !this.isConfigured()) {
      logger.warn({ orderNumber: order.orderNumber }, 'Skipping customer email: SMTP credentials not configured');
      return false;
    }

    const trackingLink = order.trackingUrl || `${env.CLIENT_URL}/track-order?orderId=${order.id}`;
    const itemsHtml = order.items
      .map(
        (item) => `
        <tr style="border-bottom: 1px solid #e4e4e7;">
          <td style="padding: 12px 8px;">
            ${item.image ? `<img src="${item.image}" alt="${item.name}" style="width: 44px; height: 44px; object-fit: contain; border-radius: 6px; background-color: #f4f4f5; vertical-align: middle; margin-right: 10px;" />` : ''}
            <span style="font-weight: 600; color: #18181b; font-size: 14px;">${item.name}</span>
            <div style="font-size: 12px; color: #71717a; margin-top: 4px;">
              ${item.flavour || 'Standard'} | ${item.size || 'Standard'}
            </div>
          </td>
          <td style="padding: 12px 8px; text-align: center; color: #27272a; font-size: 14px; font-weight: 600;">${item.qty}</td>
          <td style="padding: 12px 8px; text-align: right; color: #18181b; font-size: 14px; font-weight: 700;">₹${(item.totalPricePaise / 100).toLocaleString('en-IN')}</td>
        </tr>
      `
      )
      .join('');

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Order Confirmation - Workout Nutrition</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f4f4f5; margin: 0; padding: 24px;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.06); border: 1px solid #e4e4e7;">
          <!-- Header -->
          <div style="background-color: #09090b; padding: 28px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 22px; font-weight: 900; letter-spacing: 1px; text-transform: uppercase;">
              WORKOUT<span style="color: #dc2626;">NUTRITION</span>
            </h1>
            <p style="color: #a1a1aa; font-size: 13px; margin: 6px 0 0 0;">Official Order Confirmation & Receipt</p>
          </div>

          <!-- Body -->
          <div style="padding: 28px;">
            <div style="background-color: #fef2f2; border: 1px solid #fecaca; border-radius: 12px; padding: 16px; text-align: center; margin-bottom: 24px;">
              <span style="color: #dc2626; font-size: 20px; font-weight: 800; display: block;">🎉 Order Placed Successfully!</span>
              <p style="color: #7f1d1d; font-size: 13px; margin: 6px 0 0 0;">
                Your order is currently <strong>Under Review (In Process)</strong>. You will receive an update once confirmed by our warehouse.
              </p>
            </div>

            <p style="color: #27272a; font-size: 15px; margin: 0 0 16px 0;">
              Hi <strong>${order.customerName}</strong>, thank you for your order! We have received your order details and are preparing it for shipment.
            </p>

            <!-- Order Summary Card -->
            <div style="background-color: #fafafa; border-radius: 10px; padding: 16px; margin-bottom: 24px; border: 1px solid #e4e4e7;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <span style="color: #71717a; font-size: 13px;">Order Number:</span>
                <span style="color: #09090b; font-weight: 700; font-size: 13px; font-family: monospace;">${order.orderNumber}</span>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <span style="color: #71717a; font-size: 13px;">Payment Method:</span>
                <span style="color: #09090b; font-weight: 600; font-size: 13px;">${order.paymentMethod === 'cod' ? 'Cash on Delivery (COD)' : 'Paid Online (Razorpay)'}</span>
              </div>
              <div style="display: flex; justify-content: space-between;">
                <span style="color: #71717a; font-size: 13px;">Delivery Address:</span>
                <span style="color: #09090b; font-size: 13px; max-width: 300px; text-align: right;">
                  ${order.shippingAddress.addressLine || ''}, ${order.shippingAddress.city || ''}, ${order.shippingAddress.state || ''} - ${order.shippingAddress.pinCode || ''}
                </span>
              </div>
            </div>

            <!-- Items Table -->
            <h3 style="font-size: 14px; text-transform: uppercase; color: #09090b; margin: 0 0 12px 0; letter-spacing: 0.5px;">Ordered Items</h3>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
              <thead>
                <tr style="border-bottom: 2px solid #e4e4e7; text-align: left;">
                  <th style="padding: 8px; font-size: 12px; color: #71717a; text-transform: uppercase;">Item</th>
                  <th style="padding: 8px; font-size: 12px; color: #71717a; text-transform: uppercase; text-align: center;">Qty</th>
                  <th style="padding: 8px; font-size: 12px; color: #71717a; text-transform: uppercase; text-align: right;">Total</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
            </table>

            <!-- Grand Total -->
            <div style="border-top: 2px solid #18181b; padding-top: 14px; display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 28px;">
              <span style="font-size: 16px; font-weight: 800; color: #09090b; text-transform: uppercase;">Total Amount:</span>
              <span style="font-size: 22px; font-weight: 900; color: #dc2626;">₹${(order.totalPaise / 100).toLocaleString('en-IN')}</span>
            </div>

            <!-- CTA Button -->
            <div style="text-align: center; margin-bottom: 24px;">
              <a href="${trackingLink}" style="display: inline-block; background-color: #dc2626; color: #ffffff; text-decoration: none; padding: 14px 28px; font-size: 14px; font-weight: 700; border-radius: 8px; text-transform: uppercase; letter-spacing: 0.5px;">
                Track Live Order Status →
              </a>
            </div>

            <p style="color: #71717a; font-size: 12px; text-align: center; margin: 0;">
              If you have any questions, reply directly to this email or contact support.
            </p>
          </div>

          <!-- Footer -->
          <div style="background-color: #f4f4f5; padding: 18px; text-align: center; border-top: 1px solid #e4e4e7;">
            <p style="color: #a1a1aa; font-size: 11px; margin: 0;">
              © ${new Date().getFullYear()} Workout Nutrition. All rights reserved.
            </p>
          </div>
        </div>
      </body>
      </html>
    `;

    try {
      await this.transporter.sendMail({
        from: env.SMTP_FROM || `Workout Nutrition <${env.SMTP_USER}>`,
        to: order.customerEmail,
        subject: `Order Placed Successfully! #${order.orderNumber} - Workout Nutrition`,
        html,
      });
      logger.info({ orderNumber: order.orderNumber, recipient: order.customerEmail }, '✅ Customer order receipt email sent successfully');
      return true;
    } catch (err: any) {
      logger.error({ err: err.message, orderNumber: order.orderNumber }, '❌ Failed to dispatch customer order confirmation email');
      return false;
    }
  }

  /**
   * 2. Send New Order Alert to Admin
   */
  public async sendAdminOrderAlert(order: EmailOrderPayload): Promise<boolean> {
    const adminEmail = env.ADMIN_NOTIFICATION_EMAIL || env.SMTP_USER;
    if (!this.transporter || !adminEmail || !this.isConfigured()) {
      logger.warn({ orderNumber: order.orderNumber }, 'Skipping admin alert email: SMTP or ADMIN_NOTIFICATION_EMAIL not set');
      return false;
    }

    const itemsSummary = order.items
      .map((i) => `<li><strong>${i.name}</strong> (${i.flavour || 'Standard'} / ${i.size || 'Standard'}) × ${i.qty} — ₹${(i.totalPricePaise / 100).toLocaleString('en-IN')}</li>`)
      .join('');

    const html = `
      <!DOCTYPE html>
      <html>
      <body style="font-family: Arial, sans-serif; background-color: #f4f4f5; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; background: #fff; border-radius: 12px; padding: 24px; border: 1px solid #e4e4e7;">
          <h2 style="color: #dc2626; margin-top: 0;">🚨 New Order Received! #${order.orderNumber}</h2>
          <p style="font-size: 15px; color: #18181b;">
            A new order worth <strong>₹${(order.totalPaise / 100).toLocaleString('en-IN')}</strong> has been placed on the storefront.
          </p>

          <div style="background: #fafafa; padding: 14px; border-radius: 8px; margin-bottom: 20px; font-size: 13px;">
            <p style="margin: 4px 0;"><strong>Customer Name:</strong> ${order.customerName}</p>
            <p style="margin: 4px 0;"><strong>Customer Email:</strong> <a href="mailto:${order.customerEmail}">${order.customerEmail}</a></p>
            <p style="margin: 4px 0;"><strong>Phone:</strong> ${order.customerPhone}</p>
            <p style="margin: 4px 0;"><strong>Payment Method:</strong> ${order.paymentMethod.toUpperCase()} (${order.paymentStatus})</p>
            <p style="margin: 4px 0;"><strong>Delivery Address:</strong> ${order.shippingAddress.addressLine || ''}, ${order.shippingAddress.city || ''}, ${order.shippingAddress.state || ''} - ${order.shippingAddress.pinCode || ''}</p>
          </div>

          <h4 style="margin-bottom: 8px;">Order Items:</h4>
          <ul style="font-size: 14px; color: #27272a; line-height: 1.6;">
            ${itemsSummary}
          </ul>

          <div style="margin-top: 24px; text-align: center;">
            <a href="${env.CLIENT_URL}/admin" style="background: #18181b; color: #fff; text-decoration: none; padding: 12px 24px; font-size: 14px; font-weight: bold; border-radius: 6px; display: inline-block;">
              Open Admin Portal to Confirm Order →
            </a>
          </div>
        </div>
      </body>
      </html>
    `;

    try {
      await this.transporter.sendMail({
        from: env.SMTP_FROM || `Workout Nutrition System <${env.SMTP_USER}>`,
        to: adminEmail,
        subject: `🚨 [New Order] #${order.orderNumber} - ₹${(order.totalPaise / 100).toLocaleString('en-IN')} (${order.customerName})`,
        html,
      });
      logger.info({ orderNumber: order.orderNumber, adminEmail }, '✅ Admin order alert email sent successfully');
      return true;
    } catch (err: any) {
      logger.error({ err: err.message, orderNumber: order.orderNumber }, '❌ Failed to dispatch admin order alert email');
      return false;
    }
  }

  /**
   * 3. Send Order Status Update to Customer (Confirmed / Shipped / Delivered)
   */
  public async sendOrderStatusUpdate(
    customerEmail: string,
    customerName: string,
    orderNumber: string,
    status: 'confirmed' | 'shipped' | 'delivered',
    estimatedDelivery?: string
  ): Promise<boolean> {
    if (!this.transporter || !this.isConfigured()) return false;

    let title = '';
    let description = '';

    if (status === 'confirmed') {
      title = '✓ Your Order Has Been Confirmed!';
      description = `Our team has reviewed and confirmed your order <strong>#${orderNumber}</strong>. Estimated delivery window: <strong>${estimatedDelivery || 'Within 3 days'}</strong>.`;
    } else if (status === 'shipped') {
      title = '🚚 Your Order Has Been Shipped!';
      description = `Your order <strong>#${orderNumber}</strong> is on its way via express courier.`;
    } else if (status === 'delivered') {
      title = '📦 Order Delivered Successfully!';
      description = `Your package for order <strong>#${orderNumber}</strong> has been delivered. Enjoy your fitness journey!`;
    }

    const html = `
      <!DOCTYPE html>
      <html>
      <body style="font-family: Arial, sans-serif; background: #f4f4f5; padding: 20px;">
        <div style="max-width: 550px; margin: 0 auto; background: #fff; border-radius: 12px; padding: 24px; border: 1px solid #e4e4e7;">
          <h2 style="color: #dc2626; margin-top: 0;">${title}</h2>
          <p style="font-size: 15px; color: #18181b;">Hi ${customerName},</p>
          <p style="font-size: 14px; color: #3f3f46; line-height: 1.6;">${description}</p>
          <div style="margin-top: 24px; text-align: center;">
            <a href="${env.CLIENT_URL}/account" style="background: #dc2626; color: #fff; text-decoration: none; padding: 12px 24px; font-size: 14px; font-weight: bold; border-radius: 6px; display: inline-block;">
              View in My Profile →
            </a>
          </div>
        </div>
      </body>
      </html>
    `;

    try {
      await this.transporter.sendMail({
        from: env.SMTP_FROM || `Workout Nutrition <${env.SMTP_USER}>`,
        to: customerEmail,
        subject: `Update on Order #${orderNumber}: ${status.toUpperCase()} - Workout Nutrition`,
        html,
      });
      logger.info({ orderNumber, status, customerEmail }, '✅ Order status update email sent to customer');
      return true;
    } catch (err: any) {
      logger.error({ err: err.message, orderNumber }, '❌ Failed to send status update email');
      return false;
    }
  }
}

export const emailService = new EmailService();
