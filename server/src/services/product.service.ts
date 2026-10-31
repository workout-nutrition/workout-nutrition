import { supabaseAdmin } from '../lib/supabase.js';
import { AppError } from '../middleware/errorHandler.js';
import { logger } from '../config/logger.js';

export interface ProductDbRow {
  id: string;
  slug: string;
  brand: string;
  name: string;
  category: string;
  subcategory?: string;
  price: number;
  original_price: number;
  discount?: number;
  rating?: number;
  review_count?: number;
  images?: string[];
  description?: string;
  benefits?: string[];
  ingredients?: string;
  servings?: number;
  flavours?: string[];
  sizes?: string[];
  stock: number;
  is_best_seller?: boolean;
  is_featured?: boolean;
  is_new?: boolean;
  tags?: string[];
  goals?: string[];
  dietary?: string;
  nutrition_facts?: any;
  how_to_use?: string;
  who_is_it_for?: string[];
  when_to_use?: string;
  goal_supported?: string;
  what_goal_does_it_support?: string;
  authenticity_details?: string;
  variants?: any;
  created_at?: string;
  updated_at?: string;
}

export class ProductService {
  /**
   * List all products with optional search and category filters
   */
  async listProducts(filters?: { category?: string; search?: string; limit?: number }) {
    let query = supabaseAdmin.from('products').select('*');

    if (filters?.category && filters.category !== 'all') {
      query = query.eq('category', filters.category);
    }

    if (filters?.search) {
      const term = filters.search.trim();
      query = query.or(`name.ilike.%${term}%,brand.ilike.%${term}%,category.ilike.%${term}%`);
    }

    query = query.order('name', { ascending: true });

    if (filters?.limit) {
      query = query.limit(filters.limit);
    }

    const { data, error } = await query;
    if (error) {
      logger.error({ error }, 'Failed to list products from database');
      throw new AppError('Failed to fetch products', 500);
    }

    return data || [];
  }

  /**
   * Fetch a single product by ID or slug
   */
  async getProductByIdOrSlug(idOrSlug: string) {
    const { data, error } = await supabaseAdmin
      .from('products')
      .select('*')
      .or(`id.eq.${idOrSlug},slug.eq.${idOrSlug}`)
      .maybeSingle();

    if (error) {
      logger.error({ error, idOrSlug }, 'Error fetching product');
      throw new AppError('Error retrieving product', 500);
    }

    if (!data) {
      throw new AppError('Product not found', 404);
    }

    return data;
  }

  /**
   * Create a new product (Admin)
   */
  async createProduct(productData: Partial<ProductDbRow>) {
    if (!productData.name || !productData.brand || !productData.category) {
      throw new AppError('Product name, brand, and category are required', 400);
    }

    // Auto-generate slug if missing
    const slug = productData.slug ||
      productData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    // Ensure id
    const id = productData.id || slug;

    // Calculate discount percentage if not provided
    const price = Number(productData.price) || 0;
    const originalPrice = Number(productData.original_price) || price;
    const discount = originalPrice > price
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : 0;

    const rowToInsert = {
      ...productData,
      id,
      slug,
      price,
      original_price: originalPrice,
      discount,
      rating: productData.rating ?? 4.8,
      review_count: productData.review_count ?? 0,
      images: Array.isArray(productData.images) && productData.images.length > 0
        ? productData.images
        : ['/products/on-gold-standard.jpg'],
      stock: Number(productData.stock ?? 0),
      servings: Number(productData.servings ?? 1),
      variants: Array.isArray(productData.variants) ? productData.variants : [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabaseAdmin
      .from('products')
      .insert([rowToInsert])
      .select()
      .single();

    if (error) {
      logger.error({ error, productData }, 'Failed to insert product');
      throw new AppError(`Failed to create product: ${error.message}`, 400);
    }

    if (Array.isArray(productData.variants) && productData.variants.length > 0) {
      await this.syncProductVariants(data.id, productData.variants);
    }

    logger.info({ productId: data.id, name: data.name }, 'Product created successfully');
    return data;
  }

  /**
   * Sync variants to dedicated product_variants table
   */
  async syncProductVariants(productId: string, variants: any[]) {
    try {
      await supabaseAdmin.from('product_variants').delete().eq('product_id', productId);
      if (variants.length > 0) {
        const rows = variants.map((v, i) => ({
          id: v.id || `var-${productId}-${i + 1}-${Date.now().toString(36)}`,
          product_id: productId,
          flavour: v.flavour || 'Standard',
          weight: v.weight || 'Standard',
          price: Number(v.price) || 0,
          original_price: Number(v.originalPrice) || 0,
          stock: Number(v.stock) || 0,
          is_active: v.isActive !== false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }));
        await supabaseAdmin.from('product_variants').insert(rows);
      }
    } catch (err) {
      logger.warn({ err, productId }, 'Error syncing product_variants table (non-fatal)');
    }
  }

  /**
   * Update an existing product (Admin)
   */
  async updateProduct(id: string, updates: Partial<ProductDbRow>) {
    // Check existence
    await this.getProductByIdOrSlug(id);

    const rowToUpdate: any = {
      ...updates,
      updated_at: new Date().toISOString(),
    };

    if (updates.price !== undefined || updates.original_price !== undefined) {
      const price = Number(updates.price);
      const originalPrice = Number(updates.original_price);
      if (!isNaN(price) && !isNaN(originalPrice) && originalPrice > price) {
        rowToUpdate.discount = Math.round(((originalPrice - price) / originalPrice) * 100);
      }
    }

    const { data, error } = await supabaseAdmin
      .from('products')
      .update(rowToUpdate)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      logger.error({ error, id }, 'Failed to update product');
      throw new AppError(`Failed to update product: ${error.message}`, 400);
    }

    if (Array.isArray(updates.variants)) {
      await this.syncProductVariants(id, updates.variants);
    }

    logger.info({ productId: id }, 'Product updated successfully');
    return data;
  }

  /**
   * Delete a product (Admin)
   */
  async deleteProduct(id: string) {
    // Check if product is in pending/processing orders
    const { data: orderItemRefs } = await supabaseAdmin
      .from('order_items')
      .select('id, order_id')
      .eq('product_id', id)
      .limit(1);

    if (orderItemRefs && orderItemRefs.length > 0) {
      throw new AppError(
        'Cannot delete product as it is referenced by existing customer order records. Consider setting stock to 0 instead.',
        409
      );
    }

    const { data, error } = await supabaseAdmin
      .from('products')
      .delete()
      .eq('id', id)
      .select('id');

    if (error) {
      logger.error({ error, id }, 'Failed to delete product');
      throw new AppError(`Failed to delete product: ${error.message}`, 500);
    }

    if (!data || data.length === 0) {
      throw new AppError('Product not found or already deleted', 404);
    }

    logger.info({ productId: id }, 'Product deleted successfully');
    return { success: true, deletedId: id };
  }
}

export const productService = new ProductService();
