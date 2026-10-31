import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { useAuth } from '../../context/AuthContext';
import { formatCurrency } from '../../utils/formatters';
import {
  createCheckoutSession,
  createCodOrder,
  verifyRazorpayPaymentApi,
  CheckoutItemPayload,
  ShippingAddressPayload,
} from '../../lib/api';
import {
  ShieldCheck,
  Truck,
  CreditCard,
  Lock,
  LogIn,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { usePageSEO } from '../../utils/seo';

export const CheckoutPage: React.FC = () => {
  usePageSEO({
    title: 'Secure Checkout | 100% Genuine Sports Nutrition',
    description: 'Encrypted checkout with Cash on Delivery & Stripe card payments. Verified authentic fitness supplements delivered Pan-India.',
  });
  const {
    cart,
    cartSubtotal,
    shippingFee,
    discountAmount,
    appliedCoupon,
    clearCart,
    navigate,
  } = useStore();

  const { user, profile, session, openAuthModal } = useAuth();

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    addressLine: '',
    city: '',
    state: '',
    pinCode: '',
  });

  const [paymentMethod, setPaymentMethod] = useState<'online' | 'cod'>('online');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Auto-fill from authenticated user profile
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        email: user.email || prev.email,
        fullName: profile?.fullName || prev.fullName || '',
        phone: profile?.phone || prev.phone || '',
        addressLine: profile?.addressLine || prev.addressLine || '',
        city: profile?.city || prev.city || '',
        state: profile?.state || prev.state || '',
        pinCode: profile?.pinCode || prev.pinCode || '',
      }));
    }
  }, [user, profile]);

  const estimatedTotal = Math.max(0, cartSubtotal - discountAmount) + shippingFee;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCompleteOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!user) {
      openAuthModal('login', 'Please sign in or create an account to complete your purchase');
      return;
    }

    if (cart.length === 0) {
      setErrorMessage('Your cart is empty. Please add items before checking out.');
      return;
    }

    setIsSubmitting(true);

    try {
      const itemsPayload: CheckoutItemPayload[] = cart.map((item) => ({
        productId: item.product.id,
        flavour: item.selectedFlavour || 'Standard',
        size: item.selectedSize || 'Standard',
        qty: item.quantity,
        variantId: item.variantId,
      }));

      const shippingPayload: ShippingAddressPayload = {
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        addressLine: formData.addressLine.trim(),
        city: formData.city.trim(),
        state: formData.state.trim(),
        pinCode: formData.pinCode.trim(),
      };

      if (paymentMethod === 'cod') {
        const result = await createCodOrder(
          itemsPayload,
          shippingPayload,
          appliedCoupon || undefined,
          session?.access_token
        );
        clearCart();
        navigate('order-success', { orderId: result.orderId });
      } else {
        const result = await createCheckoutSession(
          itemsPayload,
          shippingPayload,
          appliedCoupon || undefined,
          session?.access_token
        );

        if (typeof (window as any).Razorpay === 'undefined') {
          throw new Error('Razorpay SDK failed to load. Please refresh and check your internet connection.');
        }

        const options = {
          key: result.razorpayKeyId || import.meta.env.VITE_RAZORPAY_KEY_ID,
          amount: result.totalPaise,
          currency: result.currency || 'INR',
          name: 'WORKOUT NUTRITION',
          description: `Order #${result.orderNumber}`,
          order_id: result.razorpayOrderId,
          handler: async (response: {
            razorpay_payment_id: string;
            razorpay_order_id: string;
            razorpay_signature: string;
          }) => {
            try {
              setIsSubmitting(true);
              await verifyRazorpayPaymentApi(
                {
                  orderId: result.orderId,
                  razorpayOrderId: response.razorpay_order_id,
                  razorpayPaymentId: response.razorpay_payment_id,
                  razorpaySignature: response.razorpay_signature,
                },
                session?.access_token
              );
              clearCart();
              navigate('order-success', { orderId: result.orderId });
            } catch (verifyErr: unknown) {
              const msg =
                verifyErr instanceof Error
                  ? verifyErr.message
                  : 'Payment verification failed. Please contact support.';
              setErrorMessage(msg);
              setIsSubmitting(false);
            }
          },
          prefill: {
            name: shippingPayload.fullName,
            email: shippingPayload.email,
            contact: shippingPayload.phone,
          },
          theme: {
            color: '#DC2626',
          },
          modal: {
            ondismiss: () => {
              setIsSubmitting(false);
            },
          },
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.on('payment.failed', (response: any) => {
          setErrorMessage(response.error?.description || 'Payment was unsuccessful.');
          setIsSubmitting(false);
        });
        rzp.open();
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Checkout processing failed';
      setErrorMessage(message);
      setIsSubmitting(false);
    }
  };

  // Mandatory Auth Guard: User must be signed in to access Checkout
  if (!user) {
    return (
      <div className="bg-zinc-50 min-h-[70vh] flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-zinc-200/80 shadow-xl text-center">
          <div className="w-16 h-16 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black uppercase tracking-tight text-zinc-900 font-display">
            Sign In Required
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500 mt-2 mb-6">
            Please sign in to your account to review your order, enter delivery address, and proceed with payment.
          </p>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => openAuthModal('login', 'Sign in to complete your checkout')}
              className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-red-600/25 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In to Continue</span>
            </button>
            <button
              onClick={() => openAuthModal('register', 'Create an account to complete your checkout')}
              className="w-full py-2.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer"
            >
              Create New Account
            </button>
          </div>
        </div>
      </div>
    );
  }

  // If cart is empty
  if (cart.length === 0) {
    return (
      <div className="bg-zinc-50 min-h-screen py-16">
        <div className="max-w-md mx-auto bg-white border border-zinc-200/80 rounded-3xl p-8 text-center shadow-sm">
          <h2 className="font-heading font-black text-xl text-zinc-900 mb-2">
            No items in cart
          </h2>
          <p className="text-xs text-zinc-500 mb-6">
            Please add products to your cart before proceeding to checkout.
          </p>
          <button
            onClick={() => navigate('shop')}
            className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase px-6 py-3 rounded-xl cursor-pointer transition-colors shadow-lg shadow-red-600/20"
          >
            Go to Shop
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-zinc-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-zinc-500 mb-6">
          <button onClick={() => navigate('home')} className="hover:text-red-600 cursor-pointer">
            Home
          </button>
          <span>/</span>
          <button onClick={() => navigate('cart')} className="hover:text-red-600 cursor-pointer">
            Cart
          </button>
          <span>/</span>
          <span className="text-zinc-900 font-semibold">Secure Checkout</span>
        </div>

        <div className="mb-6">
          <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-zinc-950 font-display">
            Secure Checkout
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 mt-1">
            256-bit encrypted checkout with Razorpay Payments & Pan-India courier delivery.
          </p>
        </div>

        {/* Auth prompt banner if not logged in */}
        {!user && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center shrink-0">
                <LogIn className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs sm:text-sm font-bold text-zinc-900">
                  Have an account or want live order tracking?
                </div>
                <div className="text-[11px] text-zinc-600">
                  Sign in to auto-fill your saved address and view order receipts in your dashboard.
                </div>
              </div>
            </div>
            <button
              onClick={() => openAuthModal('login')}
              className="py-2.5 px-4 bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer whitespace-nowrap shadow-sm"
            >
              Sign In Now
            </button>
          </div>
        )}

        {/* Error notification */}
        {errorMessage && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 p-4 rounded-2xl text-xs flex items-center gap-2.5">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT: Checkout Form (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <form onSubmit={handleCompleteOrder} className="space-y-6">
              {/* Shipping Address */}
              <div className="bg-white border border-zinc-200/80 rounded-2xl p-6 shadow-sm space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-zinc-100">
                  <Truck className="w-4 h-4 text-red-600" />
                  <h2 className="font-heading font-black text-sm uppercase text-zinc-900">
                    1. Shipping & Contact Information
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="sm:col-span-2">
                    <label className="block text-zinc-600 font-medium mb-1">Full Name *</label>
                    <input
                      type="text"
                      name="fullName"
                      required
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full bg-zinc-50 border border-zinc-200 p-3 rounded-xl outline-none focus:border-red-600 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-600 font-medium mb-1">Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="rahul@example.com"
                      className="w-full bg-zinc-50 border border-zinc-200 p-3 rounded-xl outline-none focus:border-red-600 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-600 font-medium mb-1">Phone Number *</label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      pattern="[0-9]{10}"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="10-digit mobile number"
                      className="w-full bg-zinc-50 border border-zinc-200 p-3 rounded-xl outline-none focus:border-red-600 focus:bg-white"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-zinc-600 font-medium mb-1">Street Address *</label>
                    <input
                      type="text"
                      name="addressLine"
                      required
                      value={formData.addressLine}
                      onChange={handleInputChange}
                      placeholder="Flat, House no., Building, Apartment, Street"
                      className="w-full bg-zinc-50 border border-zinc-200 p-3 rounded-xl outline-none focus:border-red-600 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-600 font-medium mb-1">City *</label>
                    <input
                      type="text"
                      name="city"
                      required
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="e.g. Mumbai"
                      className="w-full bg-zinc-50 border border-zinc-200 p-3 rounded-xl outline-none focus:border-red-600 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-600 font-medium mb-1">State *</label>
                    <input
                      type="text"
                      name="state"
                      required
                      value={formData.state}
                      onChange={handleInputChange}
                      placeholder="e.g. Maharashtra"
                      className="w-full bg-zinc-50 border border-zinc-200 p-3 rounded-xl outline-none focus:border-red-600 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-600 font-medium mb-1">PIN Code *</label>
                    <input
                      type="text"
                      name="pinCode"
                      required
                      pattern="[0-9]{6}"
                      value={formData.pinCode}
                      onChange={handleInputChange}
                      placeholder="6-digit postal code"
                      className="w-full bg-zinc-50 border border-zinc-200 p-3 rounded-xl outline-none focus:border-red-600 focus:bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method Selection */}
              <div className="bg-white border border-zinc-200/80 rounded-2xl p-6 shadow-sm space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-zinc-100">
                  <CreditCard className="w-4 h-4 text-red-600" />
                  <h2 className="font-heading font-black text-sm uppercase text-zinc-900">
                    2. Payment Method
                  </h2>
                </div>

                <div className="space-y-3">
                  {/* Razorpay Online */}
                  <label
                    className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                      paymentMethod === 'online'
                        ? 'border-red-600 bg-red-50/50 shadow-sm'
                        : 'border-zinc-200 hover:bg-zinc-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === 'online'}
                        onChange={() => setPaymentMethod('online')}
                        className="text-red-600 focus:ring-red-500"
                      />
                      <div>
                        <div className="font-bold text-xs sm:text-sm text-zinc-900">
                          Online Payment (UPI, Credit/Debit Cards, NetBanking via Razorpay)
                        </div>
                        <div className="text-[11px] text-zinc-500 mt-0.5">
                          Instant UPI, Google Pay, PhonePe, Cards & NetBanking via 256-bit encrypted Razorpay gateway.
                        </div>
                      </div>
                    </div>
                    <CreditCard className="w-5 h-5 text-zinc-600" />
                  </label>

                  {/* Cash on Delivery */}
                  <label
                    className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                      paymentMethod === 'cod'
                        ? 'border-red-600 bg-red-50/50 shadow-sm'
                        : 'border-zinc-200 hover:bg-zinc-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === 'cod'}
                        onChange={() => setPaymentMethod('cod')}
                        className="text-red-600 focus:ring-red-500"
                      />
                      <div>
                        <div className="font-bold text-xs sm:text-sm text-zinc-900">
                          Cash on Delivery (COD)
                        </div>
                        <div className="text-[11px] text-zinc-500 mt-0.5">
                          Pay cash or UPI directly to courier delivery agent upon parcel arrival.
                        </div>
                      </div>
                    </div>
                    <Truck className="w-5 h-5 text-zinc-600" />
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-red-600 hover:bg-red-700 active:scale-98 text-white font-bold text-xs uppercase tracking-wider py-4 rounded-xl flex items-center justify-center gap-2 shadow-xl shadow-red-600/30 transition-all cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Processing Secure Order...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>
                      {paymentMethod === 'online'
                        ? `Proceed to Payment (${formatCurrency(estimatedTotal)})`
                        : `Place COD Order (${formatCurrency(estimatedTotal)})`}
                    </span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* RIGHT: Order Summary Sidebar (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white border border-zinc-200/80 rounded-2xl p-6 shadow-sm space-y-4">
              <h3 className="font-heading font-black text-base uppercase text-zinc-950 pb-3 border-b border-zinc-100">
                Cart Summary ({cart.length} Items)
              </h3>

              {/* Items List Preview */}
              <div className="max-h-60 overflow-y-auto divide-y divide-zinc-100 pr-1">
                {cart.map((item) => (
                  <div key={item.id} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2.5 overflow-hidden">
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-10 h-10 object-contain rounded bg-zinc-50 border border-zinc-200 shrink-0"
                      />
                      <div className="overflow-hidden">
                        <div className="font-semibold text-zinc-900 truncate">{item.product.name}</div>
                        <div className="text-[10px] text-zinc-500">
                          Qty: {item.quantity} · {item.selectedFlavour} ({item.selectedSize})
                        </div>
                      </div>
                    </div>
                    <div className="font-mono font-bold text-zinc-900 shrink-0">
                      {formatCurrency(
                        (item.variantPrice !== undefined ? item.variantPrice : item.product.price) *
                          item.quantity
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-2 text-xs text-zinc-600 pt-3 border-t border-zinc-100">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-mono font-semibold text-zinc-900 tabular-nums">
                    {formatCurrency(cartSubtotal)}
                  </span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-medium">
                    <span>Discount ({appliedCoupon})</span>
                    <span className="font-mono tabular-nums">-{formatCurrency(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Delivery Charges</span>
                  <span className="font-mono font-semibold text-zinc-900 tabular-nums">
                    {shippingFee === 0 ? (
                      <span className="text-emerald-600 font-bold">FREE</span>
                    ) : (
                      formatCurrency(shippingFee)
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-base font-bold text-zinc-950 pt-3 border-t border-zinc-100">
                  <span>Estimated Total</span>
                  <span className="font-mono text-xl text-red-600 tabular-nums font-black">
                    {formatCurrency(estimatedTotal)}
                  </span>
                </div>
                <p className="text-[10px] text-zinc-400">
                  Final prices, coupons, and stock verified authoritatively by backend server.
                </p>
              </div>

              {/* Trust Box */}
              <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200/80 space-y-1.5 text-[11px] text-zinc-600">
                <div className="flex items-center gap-1.5 text-zinc-800 font-bold">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Workout Nutrition Authenticity Guarantee</span>
                </div>
                <div>100% Genuine with official importer hologram & full GST tax invoice.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
