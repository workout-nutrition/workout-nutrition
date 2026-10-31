import { Request, Response, NextFunction } from 'express';
import { productService } from '../services/product.service.js';
import { z } from 'zod';

const productSchema = z.object({
  id: z.string().optional(),
  slug: z.string().optional(),
  brand: z.string().min(1, 'Brand is required'),
  name: z.string().min(1, 'Name is required'),
  category: z.string().min(1, 'Category is required'),
  subcategory: z.string().optional(),
  price: z.coerce.number().positive('Price must be greater than 0'),
  originalPrice: z.coerce.number().positive().optional(),
  original_price: z.coerce.number().positive().optional(),
  stock: z.coerce.number().int().nonnegative('Stock cannot be negative').default(0),
  servings: z.coerce.number().int().positive().default(30),
  dietary: z.string().optional().default('Vegetarian'),
  description: z.string().default(''),
  ingredients: z.string().optional().default(''),
  how_to_use: z.string().optional(),
  howToUse: z.string().optional(),
  isBestSeller: z.boolean().optional(),
  is_best_seller: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  is_featured: z.boolean().optional(),
  isNew: z.boolean().optional(),
  is_new: z.boolean().optional(),
  flavours: z.array(z.string()).default(['Standard']),
  sizes: z.array(z.string()).default(['Standard']),
  images: z.array(z.string()).min(1, 'At least one image is required'),
  benefits: z.array(z.string()).optional().default([]),
  goals: z.array(z.string()).optional().default([]),
  tags: z.array(z.string()).optional().default([]),
  nutrition_facts: z.any().optional(),
  nutritionFacts: z.any().optional(),
  who_is_it_for: z.array(z.string()).optional(),
  whoIsItFor: z.array(z.string()).optional(),
  when_to_use: z.string().optional(),
  whenToUse: z.string().optional(),
  goal_supported: z.string().optional(),
  goalSupported: z.string().optional(),
  what_goal_does_it_support: z.string().optional(),
  whatGoalDoesItSupport: z.string().optional(),
});

/**
 * GET /api/products
 * Public list of products
 */
export async function getProducts(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const category = req.query.category as string | undefined;
    const search = req.query.search as string | undefined;
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : undefined;

    const products = await productService.listProducts({ category, search, limit });
    res.status(200).json(products);
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/products/:id
 * Public single product fetch
 */
export async function getProductById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    const product = await productService.getProductByIdOrSlug(id);
    res.status(200).json(product);
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/products
 * Admin-only product creation
 */
export async function createProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = productSchema.parse(req.body);
    const normalizedData = {
      ...data,
      original_price: data.originalPrice ?? data.original_price ?? data.price,
      how_to_use: data.howToUse ?? data.how_to_use ?? '',
      is_best_seller: data.isBestSeller ?? data.is_best_seller ?? false,
      is_featured: data.isFeatured ?? data.is_featured ?? false,
      is_new: data.isNew ?? data.is_new ?? false,
      nutrition_facts: data.nutritionFacts ?? data.nutrition_facts ?? [],
      who_is_it_for: data.whoIsItFor ?? data.who_is_it_for ?? [],
      when_to_use: data.whenToUse ?? data.when_to_use ?? '',
      goal_supported: data.goalSupported ?? data.goal_supported ?? '',
      what_goal_does_it_support: data.whatGoalDoesItSupport ?? data.what_goal_does_it_support ?? '',
    };

    const newProduct = await productService.createProduct(normalizedData);
    res.status(201).json(newProduct);
  } catch (err) {
    next(err);
  }
}

/**
 * PUT /api/products/:id
 * Admin-only product update
 */
export async function updateProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    const partialSchema = productSchema.partial();
    const data = partialSchema.parse(req.body);

    const normalizedData: any = { ...data };
    if (data.originalPrice !== undefined) normalizedData.original_price = data.originalPrice;
    if (data.howToUse !== undefined) normalizedData.how_to_use = data.howToUse;
    if (data.isBestSeller !== undefined) normalizedData.is_best_seller = data.isBestSeller;
    if (data.isFeatured !== undefined) normalizedData.is_featured = data.isFeatured;
    if (data.isNew !== undefined) normalizedData.is_new = data.isNew;
    if (data.nutritionFacts !== undefined) normalizedData.nutrition_facts = data.nutritionFacts;
    if (data.whoIsItFor !== undefined) normalizedData.who_is_it_for = data.whoIsItFor;
    if (data.whenToUse !== undefined) normalizedData.when_to_use = data.whenToUse;
    if (data.goalSupported !== undefined) normalizedData.goal_supported = data.goalSupported;
    if (data.whatGoalDoesItSupport !== undefined) normalizedData.what_goal_does_it_support = data.whatGoalDoesItSupport;

    const updated = await productService.updateProduct(id, normalizedData);
    res.status(200).json(updated);
  } catch (err) {
    next(err);
  }
}

/**
 * DELETE /api/products/:id
 * Admin-only product deletion
 */
export async function deleteProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    const result = await productService.deleteProduct(id);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}
