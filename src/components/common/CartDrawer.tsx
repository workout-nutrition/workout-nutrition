import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { useAuth } from '../../context/AuthContext';
import { formatCurrency } from '../../utils/formatters';
import { X, Trash2, Plus, Minus, ArrowRight, ShieldCheck, Truck, Sparkles, Tag, Lock } from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    cartOpen,
    setCartOpen,
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

  if (!cartOpen) return null;

  const total = cartSubtotal - discountAmount + shippingFee;
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - cartSubtotal);
  const progressPercent = Math.min(100, Math.round((cartSubtotal / freeShippingThreshold) * 100));

  const handleCheckout = () => {
    if (!user) {
      openAuthModal('login', 'Please sign in or create an account to proceed to checkout');
      return;
    }
    setCartOpen(false);
    navigate('checkout');
  };

  const handleViewCart = () => {
    setCartOpen(false);
    navigate('cart');
  };

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponInput.trim()) {
      applyCoupon(couponInput);
      setCouponInput('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      {/* Background click */}
      <div className="flex-1 cursor-pointer" onClick={() => setCartOpen(false)} />

      {/* Cart Container */}
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300 relative z-10">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-zinc-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="font-display font-normal text-2xl uppercase tracking-wider text-zinc-900">
              YOUR CART
            </h3>
            <span className="text-xs font-semibold text-red-600 bg-red-50 px-2.5 py-0.5 rounded-full font-body">
              ({cart.reduce((s, i) => s + i.quantity, 0)})
            </span>
          </div>
          <button
            onClick={() => setCartOpen(false)}
            className="p-1.5 text-zinc-400 hover:text-zinc-800 hover:bg-zinc-100 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress Bar */}
        <div className="bg-zinc-50 px-4 py-3 border-b border-zinc-100">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-semibold text-zinc-700 flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5 text-red-600" />
              {remainingForFreeShipping > 0 ? (
                <>
                  Add <span className="text-red-600 font-bold tabular-nums font-mono">{formatCurrency(remainingForFreeShipping)}</span> more for FREE SHIPPING
                </>
              ) : (
                <span className="text-emerald-700 font-bold flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  You've Unlocked FREE Pan-India Shipping!
                </span>
              )}
            </span>
            <span className="font-mono text-[11px] font-bold text-zinc-500">{progressPercent}%</span>
          </div>
          <div className="w-full bg-zinc-200 h-1.5 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                remainingForFreeShipping === 0 ? 'bg-emerald-500' : 'bg-red-600'
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 divide-y divide-zinc-100 space-y-4">
          {cart.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="w-8 h-8" />
              </div>
              <h4 className="font-heading font-bold text-zinc-900 text-base mb-1">
                Your cart is currently empty
              </h4>
              <p className="text-xs text-zinc-500 max-w-xs mx-auto mb-6">
                Explore our authentic whey proteins, micronized creatines, and pre-workouts.
              </p>
              <button
                onClick={() => {
                  setCartOpen(false);
                  navigate('shop');
                }}
                className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold py-2.5 px-6 rounded-lg uppercase tracking-wider transition-colors cursor-pointer"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="pt-4 first:pt-0 flex gap-3.5">
                {/* Product Thumbnail */}
                <div className="w-20 h-20 rounded-lg bg-zinc-100 p-1 border border-zinc-200/60 shrink-0 overflow-hidden">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-full h-full object-cover rounded"
                    referrerPolicy="no-referrer"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-1">
                      <span className="text-[10px] uppercase font-bold text-red-600 tracking-wider">
                        {item.product.brand}
                      </span>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-zinc-400 hover:text-red-600 transition-colors p-0.5 cursor-pointer"
                        title="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <h5 className="text-xs sm:text-sm font-semibold text-zinc-900 line-clamp-1 leading-snug">
                      {item.product.name}
                    </h5>
                    <div className="text-[11px] text-zinc-500 mt-0.5">
                      {item.selectedFlavour} · {item.selectedSize}
                    </div>
                  </div>

                  {/* Price & Quantity Stepper */}
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center border border-zinc-200 rounded-lg bg-white overflow-hidden">
                      <button
                        onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                        className="p-1 px-2 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 transition-colors cursor-pointer"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2 text-xs font-bold font-mono text-zinc-800 tabular-nums">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                        className="p-1 px-2 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 transition-colors cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="text-right">
                      <span className="font-mono font-bold text-xs sm:text-sm text-zinc-900 tabular-nums">
                        {formatCurrency(
                          (item.variantPrice !== undefined ? item.variantPrice : item.product.price) *
                            item.quantity
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer & Checkout Area */}
        {cart.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-zinc-100 bg-white space-y-3">
            {/* Promo Code Input */}
            <div>
              {appliedCoupon ? (
                <div className="flex items-center justify-between p-2 bg-emerald-50 border border-emerald-200 rounded-lg text-xs">
                  <div className="flex items-center gap-1.5 text-emerald-800 font-medium">
                    <Tag className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Coupon <strong>{appliedCoupon}</strong> active</span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-emerald-700 hover:text-emerald-900 text-xs font-bold cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    placeholder="Promo code (try IRON10)"
                    className="flex-1 text-xs bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2 outline-none uppercase font-mono placeholder:normal-case focus:border-red-600 focus:bg-white"
                  />
                  <button
                    type="submit"
                    className="bg-zinc-900 hover:bg-black text-white text-xs font-bold px-3 py-2 rounded-lg transition-colors uppercase cursor-pointer"
                  >
                    Apply
                  </button>
                </form>
              )}
            </div>

            {/* Price Calculations */}
            <div className="space-y-1.5 text-xs text-zinc-600 pt-1">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-mono font-semibold text-zinc-900 tabular-nums">
                  {formatCurrency(cartSubtotal)}
                </span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 font-medium">
                  <span>Discount</span>
                  <span className="font-mono tabular-nums">-{formatCurrency(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="font-mono font-semibold text-zinc-900 tabular-nums">
                  {shippingFee === 0 ? <span className="text-emerald-600">FREE</span> : formatCurrency(shippingFee)}
                </span>
              </div>
              <div className="flex justify-between text-sm font-bold text-zinc-900 pt-2 border-t border-zinc-100">
                <span>Total Amount</span>
                <span className="font-mono text-base text-red-600 tabular-nums font-black">
                  {formatCurrency(total)}
                </span>
              </div>
            </div>

            {/* Buttons */}
            <div className="grid grid-cols-2 gap-2.5 pt-1">
              <button
                onClick={handleViewCart}
                className="w-full bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-bold py-3 px-4 rounded-xl transition-colors uppercase tracking-wider text-center cursor-pointer"
              >
                View Full Cart
              </button>
              <button
                onClick={handleCheckout}
                className="w-full bg-red-600 hover:bg-red-700 text-white text-xs font-bold py-3 px-4 rounded-xl transition-colors uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md shadow-red-600/20 cursor-pointer"
              >
                {!user && <Lock className="w-3.5 h-3.5" />}
                <span>Checkout</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Trust badge footer */}
            <div className="flex items-center justify-center gap-2 text-[10px] text-zinc-400 pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>100% Authentic Brand Seal Guaranteed</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
