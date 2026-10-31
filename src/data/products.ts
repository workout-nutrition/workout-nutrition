import { Product } from '../types';

/**
 * All products are now fetched dynamically and strictly from the Supabase Database.
 * No hardcoded fallback products are stored here.
 */
export const PRODUCTS: Product[] = [];
