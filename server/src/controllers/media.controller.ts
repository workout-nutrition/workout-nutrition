import { Request, Response, NextFunction } from 'express';
import { mediaService } from '../services/media.service.js';
import { z } from 'zod';

const uploadSchema = z.object({
  fileName: z.string().min(1, 'File name is required'),
  fileType: z.string().min(1, 'File type is required'),
  base64Data: z.string().min(1, 'Base64 image data is required'),
});

/**
 * POST /api/media/upload
 * Secured endpoint (requires admin) to upload product images to Supabase Storage.
 */
export async function uploadMedia(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const input = uploadSchema.parse(req.body);
    const result = await mediaService.uploadImage(input);

    res.status(201).json({
      success: true,
      url: result.url,
      filePath: result.filePath,
      sizeBytes: result.sizeBytes,
      mimeType: result.mimeType,
    });
  } catch (err) {
    next(err);
  }
}
