-- ==============================================================================
-- 03_RAZORPAY_MIGRATION.SQL
-- Add Razorpay payment gateway columns and constraints
-- ==============================================================================

-- 1. Modify payments provider CHECK constraint to include 'razorpay'
ALTER TABLE public.payments DROP CONSTRAINT IF EXISTS payments_provider_check;
ALTER TABLE public.payments ADD CONSTRAINT payments_provider_check 
  CHECK (provider IN ('stripe', 'cod', 'razorpay'));

-- 2. Modify orders payment_method CHECK constraint to include 'razorpay'
ALTER TABLE public.orders DROP CONSTRAINT IF EXISTS orders_payment_method_check;
ALTER TABLE public.orders ADD CONSTRAINT orders_payment_method_check 
  CHECK (payment_method IN ('stripe', 'cod', 'razorpay'));

-- 3. Add explicit razorpay columns to payments table if they don't already exist
ALTER TABLE public.payments ADD COLUMN IF NOT EXISTS razorpay_order_id TEXT;
ALTER TABLE public.payments ADD COLUMN IF NOT EXISTS razorpay_payment_id TEXT;
ALTER TABLE public.payments ADD COLUMN IF NOT EXISTS razorpay_signature TEXT;

CREATE INDEX IF NOT EXISTS idx_payments_razorpay_order ON public.payments(razorpay_order_id);
CREATE INDEX IF NOT EXISTS idx_payments_razorpay_payment ON public.payments(razorpay_payment_id);

