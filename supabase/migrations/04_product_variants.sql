-- ==============================================================================
-- 04_PRODUCT_VARIANTS.SQL - Dynamic Flavour & Weight Variants with Stock Management
-- ==============================================================================
-- Run this script in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/_/sql/new
-- ==============================================================================

-- 1. Add variants JSONB column to products for lightning-fast single-query fetches
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS variants JSONB DEFAULT '[]'::jsonb;

COMMENT ON COLUMN public.products.variants IS
  'Array of flavour-based product variants: [{ id, flavour, weight, price, originalPrice, stock, isActive }]';

-- 2. Add variant_id column to order_items to track purchased variant
ALTER TABLE public.order_items
  ADD COLUMN IF NOT EXISTS variant_id TEXT;

-- 3. Dedicated relational product_variants table for direct indexing and relational queries
CREATE TABLE IF NOT EXISTS public.product_variants (
  id TEXT PRIMARY KEY,
  product_id TEXT NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  flavour TEXT NOT NULL,
  weight TEXT NOT NULL,
  price NUMERIC NOT NULL CHECK (price >= 0),
  original_price NUMERIC DEFAULT 0,
  stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_product_flavour_weight UNIQUE (product_id, flavour, weight)
);

CREATE INDEX IF NOT EXISTS idx_product_variants_product_id ON public.product_variants(product_id);
CREATE INDEX IF NOT EXISTS idx_product_variants_lookup ON public.product_variants(product_id, flavour, weight);

-- 4. Enable Row Level Security (RLS) for product_variants
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;

-- Anyone can view active product variants
DROP POLICY IF EXISTS "Anyone can view product variants" ON public.product_variants;
CREATE POLICY "Anyone can view product variants"
  ON public.product_variants FOR SELECT
  USING (true);

-- Only admins can insert/update/delete product variants
DROP POLICY IF EXISTS "Admins can manage product variants" ON public.product_variants;
CREATE POLICY "Admins can manage product variants"
  ON public.product_variants FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- 5. Atomic Stock Decrement RPC for Flavour-Specific Variants
CREATE OR REPLACE FUNCTION public.decrement_variant_stock(
  p_product_id TEXT,
  p_variant_id TEXT,
  p_flavour TEXT,
  p_weight TEXT,
  p_quantity INT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_found BOOLEAN := false;
  v_product RECORD;
  v_updated_variants JSONB;
BEGIN
  -- A. Try to update relational product_variants table if present
  IF p_variant_id IS NOT NULL AND p_variant_id != '' THEN
    UPDATE public.product_variants
    SET stock = stock - p_quantity,
        is_active = CASE WHEN (stock - p_quantity) > 0 THEN is_active ELSE false END,
        updated_at = NOW()
    WHERE id = p_variant_id
      AND stock >= p_quantity;
    IF FOUND THEN
      v_found := true;
    END IF;
  END IF;

  IF NOT v_found AND p_flavour IS NOT NULL AND p_weight IS NOT NULL AND p_flavour != '' AND p_weight != '' THEN
    UPDATE public.product_variants
    SET stock = stock - p_quantity,
        is_active = CASE WHEN (stock - p_quantity) > 0 THEN is_active ELSE false END,
        updated_at = NOW()
    WHERE product_id = p_product_id
      AND LOWER(TRIM(flavour)) = LOWER(TRIM(p_flavour))
      AND LOWER(TRIM(weight)) = LOWER(TRIM(p_weight))
      AND stock >= p_quantity;
    IF FOUND THEN
      v_found := true;
    END IF;
  END IF;

  -- B. Update JSONB variants array and overall stock on products table
  SELECT * INTO v_product FROM public.products WHERE id = p_product_id FOR UPDATE;
  IF FOUND THEN
    IF v_product.variants IS NOT NULL AND jsonb_array_length(v_product.variants) > 0 THEN
      SELECT jsonb_agg(
        CASE
          WHEN (p_variant_id IS NOT NULL AND p_variant_id != '' AND elem->>'id' = p_variant_id)
               OR (LOWER(TRIM(COALESCE(elem->>'flavour', ''))) = LOWER(TRIM(COALESCE(p_flavour, '')))
                   AND LOWER(TRIM(COALESCE(elem->>'weight', ''))) = LOWER(TRIM(COALESCE(p_weight, ''))))
          THEN jsonb_set(
                 jsonb_set(
                   elem,
                   '{stock}',
                   to_jsonb(GREATEST(0, (COALESCE(elem->>'stock', '0'))::int - p_quantity))
                 ),
                 '{isActive}',
                 to_jsonb(
                   CASE
                     WHEN ((COALESCE(elem->>'stock', '0'))::int - p_quantity) > 0
                     THEN (COALESCE(elem->>'isActive', 'true'))::boolean
                     ELSE false
                   END
                 )
               )
          ELSE elem
        END
      )
      INTO v_updated_variants
      FROM jsonb_array_elements(v_product.variants) elem;

      UPDATE public.products
      SET variants = COALESCE(v_updated_variants, variants),
          stock = GREATEST(0, stock - p_quantity),
          updated_at = NOW()
      WHERE id = p_product_id;
    ELSE
      -- Fallback: Decrement standard product stock
      UPDATE public.products
      SET stock = GREATEST(0, stock - p_quantity),
          updated_at = NOW()
      WHERE id = p_product_id AND stock >= p_quantity;
    END IF;
  END IF;

  RETURN true;
END;
$$;
