import React from 'react';
import { useStore } from '../../context/StoreContext';
import { AlertCircle, ShoppingBag, RotateCcw } from 'lucide-react';

export const OrderCancelPage: React.FC = () => {
  const { navigate, cartCount } = useStore();

  return (
    <div className="min-h-[75vh] flex items-center justify-center p-6 bg-zinc-50">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-zinc-200/80 shadow-xl text-center">
        <div className="w-16 h-16 rounded-3xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4 border border-amber-200">
          <AlertCircle className="w-8 h-8" />
        </div>

        <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200 inline-block mb-3">
          Checkout Incomplete
        </span>

        <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-zinc-950 font-display">
          Payment Cancelled
        </h1>

        <p className="text-xs sm:text-sm text-zinc-600 mt-2 mb-6 leading-relaxed">
          Your payment was not completed, and your card was not charged. All your items ({cartCount} in total) remain saved in your cart. You can retry with another payment method or choose Cash on Delivery.
        </p>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => navigate('checkout')}
            className="w-full py-3.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-red-600/25 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Return to Checkout</span>
          </button>

          <button
            onClick={() => navigate('cart')}
            className="w-full py-3 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Review Cart Items</span>
          </button>
        </div>
      </div>
    </div>
  );
};
