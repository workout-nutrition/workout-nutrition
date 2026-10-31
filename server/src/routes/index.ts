import { Router } from 'express';
import { checkoutRouter } from './checkout.routes.js';
import { ordersRouter } from './orders.routes.js';
import { productsRouter } from './products.routes.js';
import { mediaRouter } from './media.routes.js';

export const apiRouter = Router();

// Storefront & Checkout routes
apiRouter.use('/checkout', checkoutRouter);
apiRouter.use('/orders', ordersRouter);

// Products catalog & Admin CRUD routes
apiRouter.use('/products', productsRouter);

// Media / Image upload routes
apiRouter.use('/media', mediaRouter);
