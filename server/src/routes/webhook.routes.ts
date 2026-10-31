import { Router } from 'express';
import { handleRazorpayWebhook } from '../controllers/webhook.controller.js';

export const webhookRouter = Router();

// POST /api/webhooks/razorpay
webhookRouter.post('/razorpay', handleRazorpayWebhook);
