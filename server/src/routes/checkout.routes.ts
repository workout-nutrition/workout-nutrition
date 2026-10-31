import { Router } from 'express';
import { rateLimit } from 'express-rate-limit';
import { optionalAuth } from '../middleware/auth.js';
import {
  createCheckoutSession,
  verifyRazorpayPayment,
} from '../controllers/checkout.controller.js';

export const checkoutRouter = Router();

const checkoutLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 30,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { error: 'Too many checkout attempts. Please wait a few minutes.' },
});

// POST /api/checkout/session - creates razorpay order & db order
checkoutRouter.post('/session', checkoutLimiter, optionalAuth, createCheckoutSession);

// POST /api/checkout/verify - verifies razorpay signature & marks paid
checkoutRouter.post('/verify', optionalAuth, verifyRazorpayPayment);

