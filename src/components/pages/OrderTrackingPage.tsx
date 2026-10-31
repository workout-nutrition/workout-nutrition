import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { supabase } from '../../lib/supabase';
import { formatCurrency } from '../../utils/formatters';
import { Package, Search, Truck, CheckCircle2, Clock, MapPin, ArrowRight, Loader2 } from 'lucide-react';

export const OrderTrackingPage: React.FC = () => {
  const { routeParams, orders, navigate } = useStore();
  const [searchId, setSearchId] = useState(routeParams.orderId || (orders[0]?.id || ''));
  const [searchedOrder, setSearchedOrder] = useState<any>(
    orders.find((o) => o.id === searchId || o.orderNumber === searchId) || orders[0] || null
  );
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (routeParams.orderId) {
      setSearchId(routeParams.orderId);
      const local = orders.find((o) => o.id === routeParams.orderId || o.orderNumber === routeParams.orderId);
      if (local) {
        setSearchedOrder(local);
      } else {
        performDbLookup(routeParams.orderId);
      }
    }
  }, [routeParams.orderId, orders]);

  const performDbLookup = async (query: string) => {
    const clean = query.trim();
    if (!clean) return;
    setIsSearching(true);

    try {
      // Look up by id or order_number
      let builder = supabase.from('orders').select('*, order_items(*)');
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(clean);
      if (isUuid) {
        builder = builder.or(`id.eq.${clean},order_number.eq.${clean}`);
      } else {
        builder = builder.eq('order_number', clean);
      }

      const { data, error } = await builder.maybeSingle();

      if (!error && data) {
        setSearchedOrder({
          id: data.id,
          orderNumber: data.order_number,
          date: new Date(data.created_at).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          }),
          items: (data.order_items || []).map((i: any) => ({
            id: i.id,
            product: {
              id: i.product_id,
              name: i.product_name,
              brand: i.product_brand,
              price: i.unit_price_paise / 100,
            },
            quantity: i.quantity,
            selectedFlavour: i.selected_flavour,
            selectedSize: i.selected_size,
          })),
          subtotal: data.subtotal_paise / 100,
          discount: data.discount_paise / 100,
          shipping: data.shipping_paise / 100,
          total: data.total_paise / 100,
          status: data.status,
          trackingNumber:
            data.tracking_number ||
            (data.status === 'processing' || data.status === 'paid'
              ? 'Pending Logistics Assignment'
              : 'N/A'),
          shippingAddress: data.shipping_address,
          paymentMethod:
            data.payment_method === 'stripe' || data.payment_method === 'razorpay'
              ? 'Online Payment (Razorpay)'
              : 'Cash on Delivery (COD)',
          paymentStatus: data.payment_status === 'paid' ? 'Paid' : data.payment_status,
        });
      } else {
        setSearchedOrder(null);
      }
    } catch {
      setSearchedOrder(null);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const clean = searchId.trim();
    if (!clean) return;

    const found = orders.find(
      (o) =>
        o.id.toLowerCase() === clean.toLowerCase() ||
        (o.orderNumber && o.orderNumber.toLowerCase() === clean.toLowerCase()) ||
        o.trackingNumber.toLowerCase() === clean.toLowerCase()
    );

    if (found) {
      setSearchedOrder(found);
    } else {
      await performDbLookup(clean);
    }
  };

  const currentStatus = (searchedOrder?.status || 'pending').toLowerCase();
  const isConfirmed = ['confirmed', 'shipped', 'delivered'].includes(currentStatus);
  const isShipped = ['shipped', 'delivered'].includes(currentStatus);
  const isDelivered = currentStatus === 'delivered';

  const steps = [
    {
      title: 'Order Placed',
      desc: 'Received & In Process',
      completed: true,
    },
    {
      title: 'Admin Confirmed',
      desc: isConfirmed
        ? searchedOrder?.estimatedDelivery
          ? `Delivery by ${searchedOrder.estimatedDelivery}`
          : 'Approved for 3-Day Delivery'
        : 'Awaiting Store Review',
      completed: isConfirmed,
    },
    {
      title: 'Dispatched with Courier',
      desc: isShipped ? 'In Transit with Express Logistics' : 'Preparing dispatch',
      completed: isShipped,
    },
    {
      title: 'Out for Delivery',
      desc: isDelivered ? 'Delivered successfully' : isShipped ? 'At local delivery station' : 'Upcoming',
      completed: isShipped || isDelivered,
    },
    {
      title: 'Delivered',
      desc: isDelivered ? 'Handed over to customer' : 'Pending doorstep delivery',
      completed: isDelivered,
    },
  ];

  return (
    <div className="bg-zinc-50 min-h-screen py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-zinc-500 mb-6">
          <button onClick={() => navigate('home')} className="hover:text-red-600 cursor-pointer">
            Home
          </button>
          <span>/</span>
          <span className="text-zinc-900 font-semibold">Live Order Tracking</span>
        </div>

        {/* Search Order Bar */}
        <div className="bg-white border border-zinc-200/80 rounded-3xl p-6 sm:p-8 mb-8 shadow-sm">
          <div className="text-center max-w-xl mx-auto mb-6">
            <h1 className="font-display font-normal text-3xl sm:text-4xl lg:text-5xl text-zinc-950 uppercase tracking-wide">
              TRACK YOUR SHIPMENT
            </h1>
            <p className="font-body text-xs sm:text-sm text-zinc-600 font-normal mt-1 leading-relaxed">
              Enter your Workout Nutrition Order ID or Tracking Number.
            </p>
          </div>

          <form onSubmit={handleSearch} className="flex gap-2 max-w-lg mx-auto">
            <input
              type="text"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              placeholder="Enter Order ID or Tracking Number"
              className="flex-1 bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-xs sm:text-sm outline-none focus:border-red-600 focus:bg-white uppercase font-mono"
            />
            <button
              type="submit"
              className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase px-6 py-3 rounded-xl transition-colors cursor-pointer"
            >
              Track
            </button>
          </form>
        </div>

        {/* Tracking Status Card */}
        {searchedOrder ? (
          <div className="bg-white border border-zinc-200/80 rounded-3xl p-6 sm:p-8 shadow-sm space-y-8">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-zinc-100">
              <div>
                <div className="text-xs text-zinc-400">Order Reference:</div>
                <div className="font-heading font-black text-xl text-zinc-900 font-mono">
                  {searchedOrder.id}
                </div>
              </div>

              <div>
                <div className="text-xs text-zinc-400">Airway Bill / Tracking:</div>
                <div className="font-mono font-bold text-sm text-red-600">
                  {searchedOrder.trackingNumber}
                </div>
              </div>

              <div>
                <div className="text-xs text-zinc-400">Status:</div>
                <span className="inline-block bg-amber-50 text-amber-800 border border-amber-200 font-mono font-bold text-xs px-2.5 py-1 rounded-full uppercase">
                  {searchedOrder.status}
                </span>
              </div>
            </div>

            {/* Stepper Pipeline */}
            <div>
              <h3 className="font-heading font-black text-sm uppercase text-zinc-900 mb-6">
                DELIVERY PROGRESS PIPELINE
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 relative">
                {steps.map((st, idx) => (
                  <div key={idx} className="flex sm:flex-col items-center gap-3 text-left sm:text-center">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 font-bold text-xs ${
                        st.completed
                          ? 'bg-emerald-500 text-white shadow-md'
                          : 'bg-zinc-200 text-zinc-500'
                      }`}
                    >
                      {st.completed ? '✓' : idx + 1}
                    </div>
                    <div>
                      <div className="font-heading font-bold text-xs text-zinc-900">{st.title}</div>
                      <div className="text-[10px] text-zinc-400 mt-0.5">{st.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipment details */}
            <div className="bg-zinc-50 rounded-2xl p-4 sm:p-5 border border-zinc-200 text-xs space-y-2">
              <div className="flex items-center gap-2 font-bold text-zinc-900">
                <MapPin className="w-4 h-4 text-red-600" />
                <span>Destination Address</span>
              </div>
              <p className="text-zinc-600 pl-6">
                {searchedOrder.shippingAddress.fullName} · {searchedOrder.shippingAddress.phone}
                <br />
                {searchedOrder.shippingAddress.addressLine}, {searchedOrder.shippingAddress.city},{' '}
                {searchedOrder.shippingAddress.pinCode}
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-12 text-center text-zinc-500 text-xs border border-zinc-200">
            No shipment found matching "{searchId}". Please verify your order number.
          </div>
        )}
      </div>
    </div>
  );
};
