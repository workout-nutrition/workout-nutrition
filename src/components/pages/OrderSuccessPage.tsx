import React, { useEffect, useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { useAuth } from '../../context/AuthContext';
import { fetchOrderById, OrderDetailsResponse } from '../../lib/api';
import { formatCurrency } from '../../utils/formatters';
import {
  CheckCircle2,
  Package,
  Truck,
  ArrowRight,
  ShoppingBag,
  Clock,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';

export const OrderSuccessPage: React.FC = () => {
  const { routeParams, navigate, clearCart } = useStore();
  const { session } = useAuth();

  const [orderDetails, setOrderDetails] = useState<OrderDetailsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Extract orderId from routeParams or window.location.search
  const getOrderId = (): string | null => {
    if (routeParams.orderId) return routeParams.orderId;
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      return urlParams.get('order_id');
    }
    return null;
  };

  const orderId = getOrderId();

  useEffect(() => {
    // Clear cart once order is placed
    clearCart();

    if (!orderId) {
      setIsLoading(false);
      setErrorMessage('No order reference found.');
      return;
    }

    let isMounted = true;
    let pollCount = 0;
    const maxPolls = 4;

    const loadOrder = async () => {
      try {
        const data = await fetchOrderById(orderId, session?.access_token);
        if (!isMounted) return;
        setOrderDetails(data);
        setIsLoading(false);

        // If still pending, webhook might be in transit. Poll a few times.
        if (data.order.payment_status === 'unpaid' && pollCount < maxPolls) {
          pollCount++;
          setTimeout(loadOrder, 1500);
        }
      } catch (err: unknown) {
        if (!isMounted) return;
        setIsLoading(false);
        const msg = err instanceof Error ? err.message : 'Failed to load order';
        setErrorMessage(msg);
      }
    };

    loadOrder();

    return () => {
      isMounted = false;
    };
  }, [orderId, session?.access_token]);

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 bg-zinc-50">
        <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin mb-4" />
        <h2 className="text-xl font-bold font-display uppercase tracking-wider text-zinc-900">
          Confirming Your Order...
        </h2>
        <p className="text-xs text-zinc-500 mt-1">
          Verifying payment gateway response with server
        </p>
      </div>
    );
  }

  if (errorMessage || !orderDetails) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-6 bg-zinc-50">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-zinc-200 shadow-sm text-center">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black uppercase text-zinc-900 font-display">
            Order Notice
          </h2>
          <p className="text-xs text-zinc-600 mt-2 mb-6 leading-relaxed">
            {errorMessage || 'Unable to load order details.'}
          </p>
          <button
            onClick={() => navigate('shop')}
            className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  const { order, items } = orderDetails;
  const isPaid = order.payment_status === 'paid';
  const isCod = order.payment_method === 'cod';

  return (
    <div className="min-h-screen bg-zinc-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Success Card Header */}
        <div className="bg-white rounded-3xl border border-zinc-200/80 p-6 sm:p-10 shadow-sm text-center mb-6">
          <div className="w-16 h-16 rounded-3xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4 border border-emerald-100">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <span className="text-[11px] font-mono font-bold tracking-wider uppercase text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 inline-block mb-3">
            {isPaid ? 'Payment Confirmed' : isCod ? 'COD Order Booked' : 'Processing Order'}
          </span>

          <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-zinc-950 font-display">
            Thank You For Your Order!
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 mt-2 max-w-md mx-auto">
            Your order has been recorded in our system. A confirmation receipt has been sent to{' '}
            <strong className="text-zinc-900">{order.customer_email}</strong>.
          </p>

          <div className="mt-6 inline-flex flex-wrap items-center justify-center gap-4 text-xs font-mono bg-zinc-50 border border-zinc-200/80 rounded-2xl p-3 px-6">
            <div>
              <span className="text-zinc-400">Order ID: </span>
              <strong className="text-zinc-900">{order.order_number}</strong>
            </div>
            <div className="hidden sm:block text-zinc-300">|</div>
            <div>
              <span className="text-zinc-400">Date: </span>
              <span className="text-zinc-700">
                {new Date(order.created_at).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
              </span>
            </div>
          </div>
        </div>

        {/* Order Details & Summary */}
        <div className="bg-white rounded-3xl border border-zinc-200/80 p-6 sm:p-8 shadow-sm space-y-6 mb-6">
          <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
            <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-900 font-mono">
              Items In Your Order ({items.length})
            </h2>
            <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
              <ShieldCheck className="w-4 h-4" />
              <span>100% Authentic Guaranteed</span>
            </div>
          </div>

          {/* Items List */}
          <div className="divide-y divide-zinc-100">
            {items.map((item) => (
              <div key={item.id} className="py-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-14 h-14 rounded-xl bg-zinc-50 border border-zinc-200 p-1 flex items-center justify-center shrink-0 overflow-hidden">
                    {item.product_image ? (
                      <img
                        src={item.product_image}
                        alt=""
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="w-full h-full bg-zinc-100 flex items-center justify-center text-[10px] text-zinc-400 font-mono">
                        Item
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-red-600 font-mono">
                      {item.product_brand}
                    </div>
                    <div className="text-sm font-bold text-zinc-900 line-clamp-1">
                      {item.product_name}
                    </div>
                    <div className="text-xs text-zinc-500 mt-0.5">
                      {item.selected_flavour} • {item.selected_size} • Qty: {item.quantity}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-sm font-black text-zinc-900 font-mono">
                    {formatCurrency(item.total_price_paise / 100)}
                  </div>
                  <div className="text-[11px] text-zinc-400">
                    {formatCurrency(item.unit_price_paise / 100)} each
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Price Breakdown */}
          <div className="pt-4 border-t border-zinc-100 space-y-2 text-xs">
            <div className="flex justify-between text-zinc-600">
              <span>Subtotal:</span>
              <span className="font-mono font-medium">
                {formatCurrency(order.subtotal_paise / 100)}
              </span>
            </div>

            {order.discount_paise > 0 && (
              <div className="flex justify-between text-emerald-600 font-medium">
                <span>Coupon Discount ({order.coupon_code || 'PROMO'}):</span>
                <span className="font-mono">-{formatCurrency(order.discount_paise / 100)}</span>
              </div>
            )}

            <div className="flex justify-between text-zinc-600">
              <span>Pan-India Delivery:</span>
              <span className="font-mono">
                {order.shipping_paise === 0
                  ? 'FREE'
                  : formatCurrency(order.shipping_paise / 100)}
              </span>
            </div>

            <div className="flex justify-between text-zinc-400 text-[11px]">
              <span>Includes 18% GST:</span>
              <span className="font-mono">{formatCurrency(order.tax_paise / 100)}</span>
            </div>

            <div className="pt-3 border-t border-zinc-100 flex justify-between items-baseline text-sm">
              <span className="font-bold text-zinc-900 uppercase">Total Paid / Payable:</span>
              <span className="font-display font-black text-2xl text-zinc-950 font-mono">
                {formatCurrency(order.total_paise / 100)}
              </span>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="pt-4 border-t border-zinc-100 text-xs">
            <div className="flex items-center gap-1.5 text-zinc-500 uppercase font-mono font-bold mb-2">
              <Truck className="w-4 h-4 text-red-600" />
              <span>Delivering To</span>
            </div>
            <div className="bg-zinc-50 rounded-2xl p-4 border border-zinc-200/80 space-y-0.5 text-zinc-700">
              <div className="font-bold text-zinc-900">
                {order.shipping_address.fullName} ({order.shipping_address.phone})
              </div>
              <div>{order.shipping_address.addressLine}</div>
              <div>
                {order.shipping_address.city}, {order.shipping_address.state} –{' '}
                {order.shipping_address.pinCode}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={() => navigate('track-order', { orderId: order.id })}
            className="w-full sm:w-1/2 py-3.5 bg-zinc-900 hover:bg-black text-white text-xs font-bold uppercase tracking-wider rounded-2xl flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-sm"
          >
            <Package className="w-4 h-4 text-red-500" />
            <span>Track Live Shipment</span>
          </button>
          <button
            onClick={() => navigate('shop')}
            className="w-full sm:w-1/2 py-3.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider rounded-2xl flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-lg shadow-red-600/25"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Continue Shopping</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
