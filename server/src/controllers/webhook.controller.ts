import { Request, Response } from 'express';
import crypto from 'crypto';
import { supabaseAdmin } from '../lib/supabase.js';
import { env } from '../config/env.js';
import { logger } from '../config/logger.js';

/**
 * Razorpay Webhook Handler
 * Verifies X-Razorpay-Signature and handles payment.captured and order.paid events
 */
export async function handleRazorpayWebhook(req: Request, res: Response): Promise<void> {
  const webhookSignature = req.headers['x-razorpay-signature'];

  if (!webhookSignature || typeof webhookSignature !== 'string') {
    logger.warn('Razorpay webhook missing x-razorpay-signature header');
    res.status(400).send('Missing signature');
    return;
  }

  // Webhook secret validation if configured
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || env.RAZORPAY_KEY_SECRET;
  const bodyString = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);

  const expectedSignature = crypto
    .createHmac('sha256', webhookSecret)
    .update(bodyString)
    .digest('hex');

  if (expectedSignature !== webhookSignature) {
    logger.error('Razorpay webhook signature verification failed');
    res.status(400).send('Invalid signature');
    return;
  }

  const event = req.body;
  logger.info({ event: event?.event }, 'Razorpay webhook received');

  try {
    if (event.event === 'payment.captured' || event.event === 'order.paid') {
      const paymentEntity = event.payload?.payment?.entity;
      const orderId = paymentEntity?.notes?.order_id;

      if (orderId) {
        await supabaseAdmin
          .from('orders')
          .update({
            status: 'processing',
            payment_status: 'paid',
            updated_at: new Date().toISOString(),
          })
          .eq('id', orderId);

        logger.info({ orderId }, 'Order marked as paid via Razorpay webhook');
      }
    }

    res.status(200).json({ status: 'ok' });
  } catch (err) {
    logger.error({ err }, 'Error handling Razorpay webhook');
    res.status(500).json({ error: 'Webhook processing error' });
  }
}
