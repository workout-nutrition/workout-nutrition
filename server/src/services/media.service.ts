import { supabaseAdmin } from '../lib/supabase.js';
import { AppError } from '../middleware/errorHandler.js';
import { logger } from '../config/logger.js';

const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/svg+xml',
]);

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

export interface UploadImageInput {
  fileName: string;
  fileType: string;
  base64Data: string;
}

export interface UploadImageResult {
  url: string;
  filePath: string;
  sizeBytes: number;
  mimeType: string;
}

export class MediaService {
  private bucketName = 'product-images';

  /**
   * Upload an image buffer or base64 to Supabase Storage bucket 'product-images'
   */
  async uploadImage(input: UploadImageInput): Promise<UploadImageResult> {
    const { fileName, fileType, base64Data } = input;

    if (!fileName || !fileType || !base64Data) {
      throw new AppError('fileName, fileType, and base64Data are required', 400);
    }

    const cleanMimeType = fileType.toLowerCase().trim();
    if (!ALLOWED_MIME_TYPES.has(cleanMimeType)) {
      throw new AppError(
        `Invalid file format (${cleanMimeType}). Allowed formats: JPEG, PNG, WEBP, GIF, SVG`,
        400
      );
    }

    // Strip data URL prefix if present (e.g. data:image/png;base64,...)
    const cleanBase64 = base64Data.replace(/^data:image\/[a-z+]+;base64,/, '');
    const buffer = Buffer.from(cleanBase64, 'base64');

    if (buffer.length > MAX_FILE_SIZE_BYTES) {
      throw new AppError(
        `Image size exceeds maximum limit of 5 MB (Current size: ${(buffer.length / (1024 * 1024)).toFixed(2)} MB)`,
        400
      );
    }

    // Ensure bucket exists in Supabase
    try {
      const { data: buckets } = await supabaseAdmin.storage.listBuckets();
      const bucketExists = (buckets || []).some((b) => b.id === this.bucketName || b.name === this.bucketName);
      if (!bucketExists) {
        await supabaseAdmin.storage.createBucket(this.bucketName, { public: true });
        logger.info(`Created Supabase storage bucket "${this.bucketName}"`);
      }
    } catch (bErr) {
      // Non-fatal if already created or managed
      logger.debug({ bErr }, 'Checked storage bucket');
    }

    const rawExt = fileName.split('.').pop() || 'webp';
    const ext = rawExt.toLowerCase().replace(/[^a-z0-9]/g, '');
    const safeUniqueName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${ext}`;
    const filePath = `products/${safeUniqueName}`;

    const { error: uploadError } = await supabaseAdmin.storage
      .from(this.bucketName)
      .upload(filePath, buffer, {
        contentType: cleanMimeType,
        cacheControl: '31536000', // 1 year cache
        upsert: false,
      });

    if (uploadError) {
      logger.error({ uploadError, filePath }, 'Supabase Storage upload failed');
      throw new AppError(`Failed to upload image to storage: ${uploadError.message}`, 500);
    }

    const { data: publicUrlData } = supabaseAdmin.storage
      .from(this.bucketName)
      .getPublicUrl(filePath);

    if (!publicUrlData?.publicUrl) {
      throw new AppError('Failed to generate public URL for uploaded image', 500);
    }

    logger.info({ filePath, url: publicUrlData.publicUrl }, 'Product image uploaded to Supabase Storage');

    return {
      url: publicUrlData.publicUrl,
      filePath,
      sizeBytes: buffer.length,
      mimeType: cleanMimeType,
    };
  }
}

export const mediaService = new MediaService();
