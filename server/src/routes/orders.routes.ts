import { Router } from 'express';
import { rateLimit } from 'express-rate-limit';
import { optionalAuth, requireAuth, requireAdmin } from '../middleware/auth.js';
import { createCodOrder, getOrderById } from '../controllers/checkout.controller.js';
import { getAllAdminOrders, updateAdminOrderStatus } from '../controllers/admin_orders.controller.js';

export const ordersRouter = Router();

const orderLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 30,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { error: 'Too many order requests. Please wait a few minutes.' },
});

// Admin orders management endpoints
ordersRouter.get('/admin/all', requireAuth, requireAdmin, getAllAdminOrders);
ordersRouter.patch('/admin/:id/status', requireAuth, requireAdmin, updateAdminOrderStatus);
ordersRouter.put('/admin/:id/status', requireAuth, requireAdmin, updateAdminOrderStatus);
ordersRouter.post('/admin/:id/status', requireAuth, requireAdmin, updateAdminOrderStatus);

// POST /api/orders/cod
ordersRouter.post('/cod', orderLimiter, optionalAuth, createCodOrder);

// GET /api/orders/:id
ordersRouter.get('/:id', requireAuth, getOrderById);
