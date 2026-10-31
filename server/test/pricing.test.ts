import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateTotals,
  CalculatedOrderItem,
  CouponData,
  SHIPPING_FREE_THRESHOLD_PAISE,
  STANDARD_SHIPPING_PAISE,
} from '../src/services/pricing.service.js';

describe('Pricing Engine Unit Tests (Integer Paise)', () => {
  const sampleItem1: CalculatedOrderItem = {
    productId: 'prod-1',
    name: 'Optimum Nutrition Gold Standard 100% Whey',
    brand: 'Optimum Nutrition',
    image: '',
    flavour: 'Double Rich Chocolate',
    size: '2 kg',
    qty: 1,
    unitPricePaise: 349900, // ₹3,499.00
    totalPricePaise: 349900,
  };

  const sampleItemLowCost: CalculatedOrderItem = {
    productId: 'prod-2',
    name: 'Shaker Bottle Pro 700ml',
    brand: 'IronForge',
    image: '',
    flavour: 'Standard',
    size: '700ml',
    qty: 1,
    unitPricePaise: 49900, // ₹499.00 (< ₹999 threshold)
    totalPricePaise: 49900,
  };

  test('Subtotal >= ₹999 qualifies for free shipping (0 paise shipping)', () => {
    const result = calculateTotals([sampleItem1], null);

    assert.equal(result.subtotalPaise, 349900);
    assert.equal(result.discountPaise, 0);
    assert.equal(result.shippingPaise, 0); // Free shipping
    assert.equal(result.totalPaise, 349900);
    // 18% embedded tax on ₹3,499: round(349900 * 18 / 118) = 53375 paise
    assert.equal(result.taxPaise, Math.round((349900 * 18) / 118));
  });

  test('Subtotal < ₹999 charges standard shipping (9,900 paise = ₹99)', () => {
    const result = calculateTotals([sampleItemLowCost], null);

    assert.equal(result.subtotalPaise, 49900);
    assert.equal(result.discountPaise, 0);
    assert.equal(result.shippingPaise, STANDARD_SHIPPING_PAISE); // 9900 paise
    assert.equal(result.totalPaise, 49900 + STANDARD_SHIPPING_PAISE); // 59800 paise
  });

  test('Applies 10% percentage coupon correctly with max discount cap', () => {
    const coupon10: CouponData = {
      id: 'coupon-1',
      code: 'WORKOUT10',
      discount_type: 'percentage',
      discount_value: 10,
      min_order_amount_paise: 0,
      max_discount_paise: 25000, // ₹250 cap (25000 paise)
      is_active: true,
      valid_until: null,
      usage_limit: null,
      times_used: 0,
    };

    // Subtotal = ₹3,499. 10% would be 34990 paise (₹349.90), but capped at 25000 paise (₹250.00)
    const result = calculateTotals([sampleItem1], coupon10);

    assert.equal(result.subtotalPaise, 349900);
    assert.equal(result.discountPaise, 25000); // capped at 25000
    assert.equal(result.totalPaise, 349900 - 25000);
  });

  test('Applies flat coupon correctly', () => {
    const flatCoupon: CouponData = {
      id: 'coupon-2',
      code: 'FITINDIA',
      discount_type: 'fixed',
      discount_value: 250, // ₹250
      min_order_amount_paise: 150000, // ₹1,500 minimum
      max_discount_paise: 25000,
      is_active: true,
      valid_until: null,
      usage_limit: null,
      times_used: 0,
    };

    const result = calculateTotals([sampleItem1], flatCoupon);

    assert.equal(result.discountPaise, 25000);
    assert.equal(result.totalPaise, 349900 - 25000);
  });

  test('Coupon discount causing total to drop below ₹999 applies shipping fee', () => {
    const item1050: CalculatedOrderItem = {
      productId: 'prod-3',
      name: 'Creatine Monohydrate 250g',
      brand: 'MuscleBlaze',
      image: '',
      flavour: 'Unflavoured',
      size: '250g',
      qty: 1,
      unitPricePaise: 105000, // ₹1,050 (above ₹999)
      totalPricePaise: 105000,
    };

    const flatDiscount200: CouponData = {
      id: 'coupon-3',
      code: 'SAVE200',
      discount_type: 'fixed',
      discount_value: 200, // ₹200 off -> net becomes ₹850 (< ₹999)
      min_order_amount_paise: 0,
      max_discount_paise: null,
      is_active: true,
      valid_until: null,
      usage_limit: null,
      times_used: 0,
    };

    const result = calculateTotals([item1050], flatDiscount200);

    assert.equal(result.subtotalPaise, 105000);
    assert.equal(result.discountPaise, 20000);
    // Net is 85000 paise (< 99900), so shipping fee MUST apply!
    assert.equal(result.shippingPaise, STANDARD_SHIPPING_PAISE);
    assert.equal(result.totalPaise, 85000 + STANDARD_SHIPPING_PAISE);
  });

  test('Guarantees all outputs are non-negative integer paise', () => {
    const result = calculateTotals([sampleItem1], null);

    assert(Number.isInteger(result.subtotalPaise));
    assert(Number.isInteger(result.discountPaise));
    assert(Number.isInteger(result.shippingPaise));
    assert(Number.isInteger(result.taxPaise));
    assert(Number.isInteger(result.totalPaise));

    assert(result.subtotalPaise >= 0);
    assert(result.discountPaise >= 0);
    assert(result.shippingPaise >= 0);
    assert(result.taxPaise >= 0);
    assert(result.totalPaise >= 0);
  });
});
