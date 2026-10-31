import { Router } from 'express';
import { requireAuth, requireAdmin } from '../middleware/auth.js';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/product.controller.js';

export const productsRouter = Router();

// Public routes
productsRouter.get('/', getProducts);
productsRouter.get('/:id', getProductById);

// Admin-only mutation routes
productsRouter.post('/', requireAuth, requireAdmin, createProduct);
productsRouter.put('/:id', requireAuth, requireAdmin, updateProduct);
productsRouter.delete('/:id', requireAuth, requireAdmin, deleteProduct);
