import { supabase } from './supabase';
import { Product } from '../types';

// Helper to map DB row (snake_case) to Product interface (camelCase)
export function mapDbProductToProduct(row: any): Product {
  return {
    id: row.id,
    slug: row.slug,
    brand: row.brand,
    name: row.name,
    category: row.category,
    subcategory: row.subcategory,
    price: Number(row.price),
    originalPrice: Number(row.original_price),
    discount: Number(row.discount),
    rating: Number(row.rating ?? 5.0),
    reviewCount: Number(row.review_count ?? 0),
    images: Array.isArray(row.images) ? row.images : [],
    description: row.description || '',
    benefits: Array.isArray(row.benefits) ? row.benefits : [],
    ingredients: row.ingredients || '',
    servings: Number(row.servings ?? 1),
    flavours: Array.isArray(row.flavours) ? row.flavours : [],
    sizes: Array.isArray(row.sizes) ? row.sizes : [],
    stock: Number(row.stock ?? 0),
    isBestSeller: Boolean(row.is_best_seller),
    isFeatured: Boolean(row.is_featured),
    isNew: Boolean(row.is_new),
    tags: Array.isArray(row.tags) ? row.tags : [],
    goals: Array.isArray(row.goals) ? row.goals : [],
    dietary: row.dietary || 'Vegetarian',
    nutritionFacts: Array.isArray(row.nutrition_facts) ? row.nutrition_facts : [],
    howToUse: row.how_to_use || '',
    flavourNotes: row.flavour_notes,
    whoIsItFor: Array.isArray(row.who_is_it_for) ? row.who_is_it_for : [],
    whenToUse: row.when_to_use || '',
    goalSupported: row.goal_supported,
    whatGoalDoesItSupport: row.what_goal_does_it_support,
    authenticityDetails: row.authenticity_details,
    sizeVariants: Array.isArray(row.size_variants) ? row.size_variants : undefined,
    variants: Array.isArray(row.variants) ? row.variants : undefined,
  };
}

// Helper to map Product interface to DB row
export function mapProductToDbRow(product: Partial<Product>): any {
  const row: any = {};
  if (product.id !== undefined) row.id = product.id;
  if (product.slug !== undefined) row.slug = product.slug;
  if (product.brand !== undefined) row.brand = product.brand;
  if (product.name !== undefined) row.name = product.name;
  if (product.category !== undefined) row.category = product.category;
  if (product.subcategory !== undefined) row.subcategory = product.subcategory;
  if (product.price !== undefined) row.price = product.price;
  if (product.originalPrice !== undefined) row.original_price = product.originalPrice;
  if (product.discount !== undefined) row.discount = product.discount;
  if (product.rating !== undefined) row.rating = product.rating;
  if (product.reviewCount !== undefined) row.review_count = product.reviewCount;
  if (product.images !== undefined) row.images = product.images;
  if (product.description !== undefined) row.description = product.description;
  if (product.benefits !== undefined) row.benefits = product.benefits;
  if (product.ingredients !== undefined) row.ingredients = product.ingredients;
  if (product.servings !== undefined) row.servings = product.servings;
  if (product.flavours !== undefined) row.flavours = product.flavours;
  if (product.sizes !== undefined) row.sizes = product.sizes;
  if (product.stock !== undefined) row.stock = product.stock;
  if (product.isBestSeller !== undefined) row.is_best_seller = product.isBestSeller;
  if (product.isFeatured !== undefined) row.is_featured = product.isFeatured;
  if (product.isNew !== undefined) row.is_new = product.isNew;
  if (product.tags !== undefined) row.tags = product.tags;
  if (product.goals !== undefined) row.goals = product.goals;
  if (product.dietary !== undefined) row.dietary = product.dietary;
  if (product.nutritionFacts !== undefined) row.nutrition_facts = product.nutritionFacts;
  if (product.howToUse !== undefined) row.how_to_use = product.howToUse;
  if (product.flavourNotes !== undefined) row.flavour_notes = product.flavourNotes;
  if (product.whoIsItFor !== undefined) row.who_is_it_for = product.whoIsItFor;
  if (product.whenToUse !== undefined) row.when_to_use = product.whenToUse;
  if (product.goalSupported !== undefined) row.goal_supported = product.goalSupported;
  if (product.whatGoalDoesItSupport !== undefined) row.what_goal_does_it_support = product.whatGoalDoesItSupport;
  if (product.authenticityDetails !== undefined) row.authenticity_details = product.authenticityDetails;
  if (product.sizeVariants !== undefined) row.size_variants = product.sizeVariants;
  if (product.variants !== undefined) row.variants = product.variants;
  row.updated_at = new Date().toISOString();
  return row;
}

export const productsService = {
  /**
   * Fetch products only from Supabase.
   * An empty table returns an empty list; local demo products are not restored.
   */
  async getProducts(): Promise<{ products: Product[]; isFallback: boolean }> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('name', { ascending: true });

      if (error) {
        console.error('Failed to fetch products from Supabase:', error.message);
        return { products: [], isFallback: false };
      }

      return {
        products: (data ?? []).map(mapDbProductToProduct),
        isFallback: false,
      };
    } catch (err) {
      console.error('Error fetching products:', err);
      return { products: [], isFallback: false };
    }
  },

  /**
   * Insert a new product into database (attempts backend API first, then Supabase client)
   */
  async createProduct(product: Product): Promise<{ product: Product | null; error: Error | null }> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;

      // 1. Try Backend API first
      try {
        const { createProductApi } = await import('./api');
        const apiResult = await createProductApi(product, token);
        if (apiResult) {
          return { product: mapDbProductToProduct(apiResult), error: null };
        }
      } catch (apiErr: any) {
        console.warn('Backend API create failed, attempting direct Supabase insert:', apiErr.message);
      }

      // 2. Fallback to direct Supabase client
      const dbRow = mapProductToDbRow(product);
      const { data, error } = await supabase
        .from('products')
        .insert([dbRow])
        .select()
        .single();

      if (error) throw error;
      return { product: mapDbProductToProduct(data), error: null };
    } catch (err: any) {
      return { product: null, error: err instanceof Error ? err : new Error(err.message) };
    }
  },

  /**
   * Update an existing product in database
   */
  async updateProduct(id: string, updates: Partial<Product>): Promise<{ product: Product | null; error: Error | null }> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;

      // 1. Try Backend API first
      try {
        const { updateProductApi } = await import('./api');
        const apiResult = await updateProductApi(id, updates, token);
        if (apiResult) {
          return { product: mapDbProductToProduct(apiResult), error: null };
        }
      } catch (apiErr: any) {
        console.warn('Backend API update failed, attempting direct Supabase update:', apiErr.message);
      }

      // 2. Fallback to direct Supabase client
      const dbRow = mapProductToDbRow(updates);
      const { data, error } = await supabase
        .from('products')
        .update(dbRow)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return { product: mapDbProductToProduct(data), error: null };
    } catch (err: any) {
      return { product: null, error: err instanceof Error ? err : new Error(err.message) };
    }
  },

  /**
   * Delete a product from database
   */
  async deleteProduct(id: string): Promise<{ success: boolean; error: Error | null }> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;

      // 1. Try Backend API first
      try {
        const { deleteProductApi } = await import('./api');
        const apiResult = await deleteProductApi(id, token);
        if (apiResult?.success) {
          return { success: true, error: null };
        }
      } catch (apiErr: any) {
        console.warn('Backend API delete failed, attempting direct Supabase delete:', apiErr.message);
      }

      // 2. Fallback to direct Supabase client
      const { data, error } = await supabase
        .from('products')
        .delete()
        .eq('id', id)
        .select('id');

      if (error) throw error;
      if (!data || data.length === 0) {
        throw new Error(
          'No product was deleted. It may already be missing, or Supabase delete permissions (RLS) may block this action.'
        );
      }

      return { success: true, error: null };
    } catch (err: any) {
      return { success: false, error: err instanceof Error ? err : new Error(err.message) };
    }
  },

  /**
   * Upload an image to Supabase Storage:
   * First tries backend secure endpoint POST /api/media/upload,
   * with seamless fallback to client Supabase Storage SDK.
   */
  async uploadImage(file: File): Promise<{ url: string | null; error: Error | null }> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;

      // 1. Try Backend media endpoint first
      try {
        const { uploadProductImageApi } = await import('./api');
        const uploadResult = await uploadProductImageApi(file, token);
        if (uploadResult?.url) {
          return { url: uploadResult.url, error: null };
        }
      } catch (apiErr: any) {
        console.warn('Backend image upload failed, falling back to direct Supabase storage:', apiErr.message);
      }

      // 2. Direct Supabase Storage client fallback
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
      const filePath = `products/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);

      return { url: data.publicUrl, error: null };
    } catch (err: any) {
      return { url: null, error: err instanceof Error ? err : new Error(err.message) };
    }
  },
};

