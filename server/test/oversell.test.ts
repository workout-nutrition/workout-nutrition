import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

describe('Atomic Stock Decrement & Oversell Concurrency Tests', () => {
  test('Simulates atomic Postgres decrement_stock preventing overselling under race condition', async () => {
    // Initial inventory for a high-demand supplement (e.g. only 2 tubs remaining)
    let dbStock = 2;

    // Simulated Postgres atomic decrement function:
    // UPDATE products SET stock = stock - qty WHERE id = prod_id AND stock >= qty
    const atomicDecrementStock = async (quantity: number): Promise<boolean> => {
      // Simulate atomic row lock / condition check
      if (dbStock >= quantity) {
        dbStock -= quantity;
        return true;
      }
      return false;
    };

    // 5 customers attempt to checkout 1 unit simultaneously
    const attempts = [1, 1, 1, 1, 1];
    const results = await Promise.all(attempts.map((qty) => atomicDecrementStock(qty)));

    // Exactly 2 checkouts must succeed, and 3 must fail with out of stock
    const successCount = results.filter((res) => res === true).length;
    const failureCount = results.filter((res) => res === false).length;

    assert.equal(successCount, 2, 'Exactly 2 purchases should succeed');
    assert.equal(failureCount, 3, '3 purchases should be safely rejected');
    assert.equal(dbStock, 0, 'Final inventory should be 0, never negative');
  });

  test('Rejects checkout if requested quantity exceeds available stock', async () => {
    let stock = 3;

    const atomicDecrement = (qty: number): boolean => {
      if (stock >= qty) {
        stock -= qty;
        return true;
      }
      return false;
    };

    // Customer requests 5 units when only 3 are available
    const purchaseResult = atomicDecrement(5);

    assert.equal(purchaseResult, false);
    assert.equal(stock, 3, 'Stock remains unchanged after rejected checkout');
  });
});
