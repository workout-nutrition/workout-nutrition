import { supabaseAdmin } from '../lib/supabase.js';
import { AppError } from '../middleware/errorHandler.js';

export interface CheckoutItemInput {
  productId: string;
  flavour: string;
  size: string;
  qty: number;
  variantId?: string;
}

export interface CouponData {
  id: string;
  code: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  min_order_amount_paise: number;
  max_discount_paise: number | null;
  is_active: boolean;
  valid_until: string | null;
  usage_limit: number | null;
  times_used: number;
}

export interface CalculatedOrderItem {
  productId: string;
  name: string;
  brand: string;
  image: string;
  flavour: string;
  size: string;
  qty: number;
  unitPricePaise: number;
  totalPricePaise: number;
  variantId?: string;
}

export interface PricingCalculationResult {
  orderItems: CalculatedOrderItem[];
  subtotalPaise: number;
  discountPaise: number;
  shippingPaise: number;
  taxPaise: number;
  totalPaise: number;
  coupon: CouponData | null;
}

// Shipping rule: Free shipping on orders >= ₹999 (99,900 paise); otherwise ₹99 (9,900 paise)
export const SHIPPING_FREE_THRESHOLD_PAISE = 99900;
export const STANDARD_SHIPPING_PAISE = 9900;

/**
 * Pure calculation function for order pricing.
 * All monetary amounts are strictly in integer paise.
 */
export function calculateTotals(
  items: CalculatedOrderItem[],
  coupon: CouponData | null
): {
  subtotalPaise: number;
  discountPaise: number;
  shippingPaise: number;
  taxPaise: number;
  totalPaise: number;
} {
  // 1. Subtotal
  const subtotalPaise = items.reduce((sum, item) => sum + item.totalPricePaise, 0);

  // 2. Discount
  let discountPaise = 0;
  if (coupon && coupon.is_active) {
    if (subtotalPaise >= coupon.min_order_amount_paise) {
      if (coupon.discount_type === 'percentage') {
        const rawDiscount = Math.round((subtotalPaise * coupon.discount_value) / 100);
        discountPaise = coupon.max_discount_paise
          ? Math.min(rawDiscount, coupon.max_discount_paise)
          : rawDiscount;
      } else if (coupon.discount_type === 'fixed') {
        // discount_value in INR * 100 = paise
        const fixedPaise = Math.round(coupon.discount_value * 100);
        discountPaise = coupon.max_discount_paise
          ? Math.min(fixedPaise, coupon.max_discount_paise)
          : fixedPaise;
      }
      // Cannot discount more than subtotal
      discountPaise = Math.min(discountPaise, subtotalPaise);
    }
  }

  // 3. Shipping
  const netBeforeShipping = subtotalPaise - discountPaise;
  const shippingPaise =
    netBeforeShipping >= SHIPPING_FREE_THRESHOLD_PAISE ? 0 : STANDARD_SHIPPING_PAISE;

  // 4. Tax (18% GST embedded in Indian supplement retail price)
  const taxPaise = Math.round((netBeforeShipping * 18) / 118);

  // 5. Total
  const totalPaise = netBeforeShipping + shippingPaise;

  return {
    subtotalPaise,
    discountPaise,
    shippingPaise,
    taxPaise,
    totalPaise,
  };
}

/**
 * Resolves prices and stock from Supabase database, validates coupon,
 * and computes authoritative server-side pricing in integer paise.
 */
export async function resolveAndPriceOrder(
  items: CheckoutItemInput[],
  couponCode?: string
): Promise<PricingCalculationResult> {
  if (!items || items.length === 0) {
    throw new AppError('Cart cannot be empty', 400);
  }

  const productIds = Array.from(new Set(items.map((i) => i.productId)));

  // Load latest verified products from database (including variants & size_variants)
  const { data: dbProducts, error: prodErr } = await supabaseAdmin
    .from('products')
    .select('id, name, brand, price, stock, images, variants, size_variants')
    .in('id', productIds);

  if (prodErr || !dbProducts) {
    throw new AppError('Failed to verify products with database', 500);
  }

  const productMap = new Map(dbProducts.map((p) => [p.id, p]));

  const orderItems: CalculatedOrderItem[] = [];

  for (const item of items) {
    const product: any = productMap.get(item.productId);
    if (!product) {
      throw new AppError(`Product "${item.productId}" not found`, 404);
    }

    if (item.qty <= 0 || !Number.isInteger(item.qty)) {
      throw new AppError(`Invalid quantity for product "${product.name}"`, 400);
    }

    const variants: any[] = Array.isArray(product.variants) ? product.variants : [];

    // Find variant by variantId OR (flavour + weight/size)
    const matchingVariant = variants.find((v: any) => {
      if (item.variantId && v.id === item.variantId) return true;
      const flvMatch =
        (v.flavour || '').trim().toLowerCase() === (item.flavour || '').trim().toLowerCase();
      const wtMatch =
        (v.weight || '').trim().toLowerCase() === (item.size || '').trim().toLowerCase();
      return flvMatch && wtMatch;
    });

    let unitPrice = Number(product.price);
    let availableStock = Number(product.stock);

    if (matchingVariant) {
      if (matchingVariant.isActive === false) {
        throw new AppError(
          `Selected variant (${item.flavour}, ${item.size}) for "${product.name}" is currently unavailable`,
          400
        );
      }
      unitPrice = Number(matchingVariant.price);
      availableStock = Number(matchingVariant.stock);

      if (availableStock < item.qty) {
        throw new AppError(
          `Insufficient stock for "${product.name}" (${item.flavour}, ${item.size}). Available: ${availableStock}, requested: ${item.qty}`,
          400
        );
      }
    } else {
      // Fallback: check legacy sizeVariants
      const legacySizeVariants: any[] = Array.isArray(product.size_variants)
        ? product.size_variants
        : [];
      const legacySize = legacySizeVariants.find(
        (sv: any) => (sv.size || '').trim().toLowerCase() === (item.size || '').trim().toLowerCase()
      );
      if (legacySize && Number(legacySize.price) > 0) {
        unitPrice = Number(legacySize.price);
      }

      if (availableStock < item.qty) {
        throw new AppError(
          `Insufficient stock for "${product.name}". Available: ${availableStock}, requested: ${item.qty}`,
          400
        );
      }
    }

    // Convert price to integer paise (e.g. ₹2,999 -> 299900 paise)
    const unitPricePaise = Math.round(unitPrice * 100);
    const totalPricePaise = unitPricePaise * item.qty;

    orderItems.push({
      productId: product.id,
      name: product.name,
      brand: product.brand,
      image: (product.images && product.images[0]) || '',
      flavour: item.flavour || 'Standard',
      size: item.size || 'Standard',
      qty: item.qty,
      unitPricePaise,
      totalPricePaise,
      variantId: matchingVariant?.id || item.variantId || undefined,
    });
  }

  // Verify coupon if provided
  let coupon: CouponData | null = null;

  if (couponCode && couponCode.trim()) {
    const cleanCode = couponCode.trim().toUpperCase();
    const { data: couponRecord, error: couponErr } = await supabaseAdmin
      .from('coupons')
      .select('*')
      .eq('code', cleanCode)
      .single();

    if (couponErr || !couponRecord) {
      throw new AppError(`Coupon code "${cleanCode}" is invalid`, 400);
    }

    if (!couponRecord.is_active) {
      throw new AppError(`Coupon "${cleanCode}" is no longer active`, 400);
    }

    if (couponRecord.valid_until && new Date(couponRecord.valid_until) < new Date()) {
      throw new AppError(`Coupon "${cleanCode}" has expired`, 400);
    }

    if (
      couponRecord.usage_limit !== null &&
      couponRecord.times_used >= couponRecord.usage_limit
    ) {
      throw new AppError(`Coupon "${cleanCode}" usage limit has been reached`, 400);
    }

    coupon = couponRecord as CouponData;
  }

  const totals = calculateTotals(orderItems, coupon);

  if (coupon && totals.subtotalPaise < coupon.min_order_amount_paise) {
    const minRupees = Math.round(coupon.min_order_amount_paise / 100);
    throw new AppError(
      `Coupon "${coupon.code}" requires a minimum order of ₹${minRupees}`,
      400
    );
  }

  return {
    orderItems,
    ...totals,
    coupon,
  };
}
