import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { useAuth } from '../../context/AuthContext';
import { formatCurrency } from '../../utils/formatters';
import { Trash2, Plus, Minus, ArrowRight, ShieldCheck, Truck, ShoppingBag, Tag, Sparkles, Lock } from 'lucide-react';
import { usePageSEO } from '../../utils/seo';

export const CartPage: React.FC = () => {
  usePageSEO({
    title: 'Your Shopping Cart',
    description: 'Review your selected authentic sports nutrition products, apply discount coupons, and proceed to checkout.',
  });
  const {
    cart,
    removeFromCart,
    updateCartQuantity,
    cartSubtotal,
    shippingFee,
    discountAmount,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    freeShippingThreshold,
    navigate,
  } = useStore();

  const { user, openAuthModal } = useAuth();

  const [couponInput, setCouponInput] = useState('');

  const total = cartSubtotal - discountAmount + shippingFee;
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - cartSubtotal);
  const progressPercent = Math.min(100, Math.round((cartSubtotal / freeShippingThreshold) * 100));

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponInput.trim()) {
      applyCoupon(couponInput);
      setCouponInput('');
    }
  };

  const handleProceedToCheckout = () => {
    if (!user) {
      openAuthModal('login', 'Please sign in or create an account to proceed to checkout');
      return;
    }
    navigate('checkout');
  };

  return (
    <div className="bg-zinc-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <h1 className="font-display font-normal text-3xl sm:text-4xl lg:text-5xl text-zinc-950 uppercase tracking-wide mb-8">
          SHOPPING CART ({cart.reduce((s, i) => s + i.quantity, 0)} ITEMS)
        </h1>

        {cart.length === 0 ? (
          <div className="bg-white border border-zinc-200/80 rounded-3xl p-16 text-center max-w-xl mx-auto shadow-sm">
            <div className="w-20 h-20 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingBag className="w-10 h-10" />
            </div>
            <h2 className="font-heading font-black text-xl text-zinc-900 mb-2">
              Your Cart is Currently Empty
            </h2>
            <p className="text-xs sm:text-sm text-zinc-500 mb-6">
              Looks like you haven't added any fitness supplements to your cart yet.
            </p>
            <button
              onClick={() => navigate('shop')}
              className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider py-3.5 px-8 rounded-xl shadow-lg shadow-red-600/25 transition-all cursor-pointer"
            >
              Explore Best Sellers
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left: Cart Items (8 cols) */}
            <div className="lg:col-span-8 space-y-4">
              {/* Free Shipping Progress Card */}
              <div className="bg-white border border-zinc-200/80 rounded-2xl p-4 shadow-sm">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-semibold text-zinc-700 flex items-center gap-1.5">
                    <Truck className="w-4 h-4 text-red-600" />
                    {remainingForFreeShipping > 0 ? (
                      <>
                        Add <span className="text-red-600 font-bold font-mono">{formatCurrency(remainingForFreeShipping)}</span> more for FREE SHIPPING
                      </>
                    ) : (
                      <span className="text-emerald-700 font-bold flex items-center gap-1">
                        <Sparkles className="w-4 h-4 text-emerald-600" />
                        You have unlocked FREE Pan-India Shipping!
                      </span>
                    )}
                  </span>
                  <span className="font-mono text-xs font-bold text-zinc-500">{progressPercent}%</span>
                </div>
                <div className="w-full bg-zinc-100 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${
                      remainingForFreeShipping === 0 ? 'bg-emerald-500' : 'bg-red-600'
                    }`}
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Items Card */}
              <div className="bg-white border border-zinc-200/80 rounded-2xl divide-y divide-zinc-100 shadow-sm overflow-hidden">
                {cart.map((item) => {
                  const unitPrice = item.variantPrice !== undefined ? item.variantPrice : item.product.price;
                  return (
                  <div key={item.id} className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-20 h-20 bg-zinc-50 border border-zinc-200 rounded-xl p-2 shrink-0 flex items-center justify-center">
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                          className="w-full h-full object-contain"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div>
                        <div className="text-[10px] font-bold uppercase text-red-600 tracking-wider font-mono">
                          {item.product.brand}
                        </div>
                        <h3 className="font-heading font-bold text-sm sm:text-base text-zinc-900">
                          {item.product.name}
                        </h3>
                        <div className="text-xs text-zinc-500 mt-0.5">
                          {item.selectedFlavour} · {item.selectedSize}
                        </div>
                        <div className="font-mono font-bold text-sm text-zinc-900 mt-1 sm:hidden">
                          {formatCurrency(unitPrice)}
                        </div>
                      </div>
                    </div>

                    {/* Quantity Stepper, Price & Remove */}
                    <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                      <div className="flex items-center border border-zinc-200 rounded-lg bg-zinc-50">
                        <button
                          onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                          className="p-1.5 px-2.5 text-zinc-500 hover:text-black cursor-pointer"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-3 text-xs font-mono font-bold text-zinc-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                          className="p-1.5 px-2.5 text-zinc-500 hover:text-black cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="font-mono font-bold text-base text-zinc-950 tabular-nums hidden sm:block">
                        {formatCurrency(unitPrice * item.quantity)}
                      </div>

                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-zinc-400 hover:text-red-600 transition-colors p-1 cursor-pointer"
                        title="Remove Item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
                })}
              </div>
            </div>

            {/* Right: Order Summary (4 cols) */}
            <div className="lg:col-span-4 space-y-4">
              <div className="bg-white border border-zinc-200/80 rounded-2xl p-6 shadow-sm space-y-4">
                <h3 className="font-heading font-black text-base uppercase text-zinc-950 pb-3 border-b border-zinc-100">
                  ORDER SUMMARY
                </h3>

                {/* Coupon Box */}
                <div>
                  {appliedCoupon ? (
                    <div className="flex items-center justify-between p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs">
                      <div className="flex items-center gap-1.5 text-emerald-800 font-medium">
                        <Tag className="w-4 h-4 text-emerald-600" />
                        <span>Coupon <strong>{appliedCoupon}</strong> Applied</span>
                      </div>
                      <button onClick={removeCoupon} className="text-emerald-700 font-bold hover:underline cursor-pointer">
                        Remove
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleApply} className="flex gap-2">
                      <input
                        type="text"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value)}
                        placeholder="Coupon code (IRON10)"
                        className="flex-1 text-xs bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2.5 outline-none uppercase font-mono placeholder:normal-case focus:border-red-600"
                      />
                      <button
                        type="submit"
                        className="bg-zinc-900 hover:bg-black text-white text-xs font-bold px-4 py-2.5 rounded-xl uppercase transition-colors cursor-pointer"
                      >
                        Apply
                      </button>
                    </form>
                  )}
                </div>

                {/* Calculations */}
                <div className="space-y-2 text-xs text-zinc-600 pt-2 border-t border-zinc-100">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-mono font-semibold text-zinc-900 tabular-nums">
                      {formatCurrency(cartSubtotal)}
                    </span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-600 font-medium">
                      <span>Promotional Discount</span>
                      <span className="font-mono tabular-nums">-{formatCurrency(discountAmount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Shipping Charges</span>
                    <span className="font-mono font-semibold text-zinc-900 tabular-nums">
                      {shippingFee === 0 ? <span className="text-emerald-600">FREE</span> : formatCurrency(shippingFee)}
                    </span>
                  </div>
                  <div className="flex justify-between text-base font-bold text-zinc-950 pt-3 border-t border-zinc-100">
                    <span>Total Amount</span>
                    <span className="font-mono text-xl text-red-600 tabular-nums font-black">
                      {formatCurrency(total)}
                    </span>
                  </div>
                </div>

                {/* Checkout CTA */}
                <button
                  onClick={handleProceedToCheckout}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider py-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-red-600/25 transition-all cursor-pointer"
                >
                  {!user && <Lock className="w-4 h-4" />}
                  <span>PROCEED TO CHECKOUT</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <div className="flex items-center justify-center gap-2 text-[11px] text-zinc-400 pt-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>256-Bit Encrypted Secure Checkout</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
