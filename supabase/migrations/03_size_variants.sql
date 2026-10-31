-- Migration: Add size_variants JSONB column to products table
-- This enables per-size pricing (e.g., 2kg = ₹1999, 4kg = ₹3499)
-- Each entry: { "size": "2 kg", "price": 1999, "originalPrice": 2499 }

ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS size_variants JSONB DEFAULT '[]'::jsonb;

COMMENT ON COLUMN public.products.size_variants IS
  'Per-size pricing variants. JSON array of { size, price, originalPrice }.
   If a size appears here, its price overrides the base product price.
   Example: [{"size":"2 kg","price":1999,"originalPrice":2499},{"size":"4 kg","price":3499,"originalPrice":4499}]';
