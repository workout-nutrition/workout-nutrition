import { Router } from 'express';
import { requireAuth, requireAdmin } from '../middleware/auth.js';
import { uploadMedia } from '../controllers/media.controller.js';

export const mediaRouter = Router();

// POST /api/media/upload (Admin only)
mediaRouter.post('/upload', requireAuth, requireAdmin, uploadMedia);
