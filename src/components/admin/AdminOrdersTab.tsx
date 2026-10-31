import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useStore } from '../../context/StoreContext';
import { fetchAdminOrdersApi, updateOrderStatusApi } from '../../lib/api';
import { formatCurrency } from '../../utils/formatters';
import {
  Package,
  CheckCircle2,
  Clock,
  Truck,
  RefreshCw,
  Search,
  Filter,
  User,
  Phone,
  Mail,
  MapPin,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';

export const AdminOrdersTab: React.FC = () => {
  const { session } = useAuth();
  const { addToast } = useStore();

  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const loadOrders = async () => {
    setIsLoading(true);
    try {
      const res = await fetchAdminOrdersApi(session?.access_token);
      setOrders(res.orders || []);
    } catch (err: any) {
      addToast('Error Loading Orders', err.message || 'Could not fetch orders', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, [session?.access_token]);

  const handleUpdateStatus = async (orderId: string, newStatus: string, defaultTracking?: string) => {
    let tracking = defaultTracking;
    if (newStatus === 'shipped') {
      const entered = window.prompt('Enter Courier Airway Bill / Tracking Number (Optional):', 'DELHIVERY-' + Math.floor(10000000 + Math.random() * 90000000));
      if (entered === null) return; // User cancelled
      tracking = entered.trim();
    }

    setUpdatingId(orderId);
    try {
      await updateOrderStatusApi(orderId, newStatus, tracking, session?.access_token);
      addToast(
        'Status Updated',
        `Order marked as "${newStatus.toUpperCase()}"! Customer notification triggered.`,
        'success'
      );
      await loadOrders();
    } catch (err: any) {
      addToast('Update Failed', err.message || 'Could not update status', 'error');
    } finally {
      setUpdatingId(null);
    }
  };

  // Filter orders
  const filteredOrders = orders.filter((o) => {
    const s = (o.status || '').toLowerCase();
    const matchesFilter =
      filterStatus === 'all'
        ? true
        : filterStatus === 'in_process'
        ? ['pending', 'processing', 'cod_pending'].includes(s)
        : s === filterStatus;

    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      o.order_number?.toLowerCase().includes(q) ||
      o.customer_name?.toLowerCase().includes(q) ||
      o.customer_email?.toLowerCase().includes(q) ||
      o.customer_phone?.includes(q);

    return matchesFilter && matchesSearch;
  });

  const pendingCount = orders.filter((o) => ['pending', 'processing', 'cod_pending'].includes((o.status || '').toLowerCase())).length;
  const confirmedCount = orders.filter((o) => (o.status || '').toLowerCase() === 'confirmed').length;
  const deliveredCount = orders.filter((o) => (o.status || '').toLowerCase() === 'delivered').length;

  return (
    <div className="space-y-6">
      {/* Overview Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-zinc-200/80 shadow-sm">
          <div className="flex items-center justify-between text-zinc-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider font-mono">Total Orders</span>
            <Package className="w-4 h-4 text-zinc-400" />
          </div>
          <div className="text-2xl font-black text-zinc-950 font-heading">{orders.length}</div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-amber-200/80 shadow-sm bg-gradient-to-br from-white to-amber-50/30">
          <div className="flex items-center justify-between text-amber-700 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider font-mono">Needs Approval</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-amber-700 font-heading">{pendingCount}</div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-purple-200/80 shadow-sm bg-gradient-to-br from-white to-purple-50/30">
          <div className="flex items-center justify-between text-purple-700 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider font-mono">Confirmed (3-Day)</span>
            <Truck className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-black text-purple-700 font-heading">{confirmedCount}</div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-emerald-200/80 shadow-sm bg-gradient-to-br from-white to-emerald-50/30">
          <div className="flex items-center justify-between text-emerald-700 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider font-mono">Delivered</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-700 font-heading">{deliveredCount}</div>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white rounded-2xl p-4 border border-zinc-200/80 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1 max-w-md bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2">
          <Search className="w-4 h-4 text-zinc-400 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by order #, customer, email, or phone..."
            className="w-full bg-transparent text-xs outline-none text-zinc-800 placeholder-zinc-400"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: 'all', label: `All (${orders.length})` },
            { id: 'in_process', label: `Awaiting Review (${pendingCount})` },
            { id: 'confirmed', label: `Confirmed (${confirmedCount})` },
            { id: 'delivered', label: `Delivered (${deliveredCount})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterStatus(tab.id)}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                filterStatus === tab.id
                  ? 'bg-zinc-900 text-white shadow-sm'
                  : 'bg-zinc-50 hover:bg-zinc-100 text-zinc-600'
              }`}
            >
              {tab.label}
            </button>
          ))}

          <button
            onClick={loadOrders}
            disabled={isLoading}
            className="p-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 rounded-xl transition-colors cursor-pointer"
            title="Refresh Orders"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Orders List */}
      {isLoading ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-zinc-200/80">
          <RefreshCw className="w-8 h-8 text-red-600 animate-spin mx-auto mb-3" />
          <p className="text-xs text-zinc-500 font-mono uppercase">Fetching customer orders...</p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-zinc-200/80">
          <Package className="w-12 h-12 text-zinc-300 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-zinc-800 uppercase font-heading">No Orders Found</h3>
          <p className="text-xs text-zinc-500 mt-1">No orders match the selected filter or search query.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const rawStatus = (order.status || 'pending').toLowerCase();
            const isInProcess = ['pending', 'processing', 'cod_pending'].includes(rawStatus);
            const isConfirmed = rawStatus === 'confirmed';
            const isShipped = rawStatus === 'shipped';
            const isDelivered = rawStatus === 'delivered';
            const isUpdating = updatingId === order.id;

            let deliveryNote = null;
            try {
              if (order.notes) deliveryNote = JSON.parse(order.notes);
            } catch {}

            return (
              <div
                key={order.id}
                className="bg-white rounded-3xl p-6 border border-zinc-200/80 shadow-sm space-y-5 transition-all hover:border-zinc-300"
              >
                {/* Header row */}
                <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-zinc-100">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-heading font-black text-base text-zinc-950 font-mono">
                        {order.order_number}
                      </span>
                      <span className="text-zinc-300">·</span>
                      <span className="text-xs text-zinc-500">
                        {new Date(order.created_at).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 mt-1.5 text-xs text-zinc-600">
                      <span className="inline-flex items-center gap-1 font-semibold text-zinc-900">
                        <User className="w-3.5 h-3.5 text-zinc-400" />
                        {order.customer_name}
                      </span>
                      <span className="text-zinc-300">|</span>
                      <span className="inline-flex items-center gap-1">
                        <Phone className="w-3.5 h-3.5 text-zinc-400" />
                        {order.customer_phone}
                      </span>
                      <span className="text-zinc-300">|</span>
                      <span className="inline-flex items-center gap-1">
                        <Mail className="w-3.5 h-3.5 text-zinc-400" />
                        {order.customer_email}
                      </span>
                    </div>
                  </div>

                  {/* Status Badges & Quick Action */}
                  <div className="flex items-center gap-3">
                    {isInProcess && (
                      <span className="px-3 py-1 rounded-full text-xs font-bold uppercase font-mono bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                        In Process (Pending Review)
                      </span>
                    )}

                    {isConfirmed && (
                      <span className="px-3 py-1 rounded-full text-xs font-bold uppercase font-mono bg-purple-50 text-purple-700 border border-purple-200 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-purple-600" />
                        Confirmed (3-Day Window)
                      </span>
                    )}

                    {isShipped && (
                      <span className="px-3 py-1 rounded-full text-xs font-bold uppercase font-mono bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-1.5">
                        <Truck className="w-3.5 h-3.5 text-blue-600" />
                        Shipped
                      </span>
                    )}

                    {isDelivered && (
                      <span className="px-3 py-1 rounded-full text-xs font-bold uppercase font-mono bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        Delivered
                      </span>
                    )}

                    <div className="text-right">
                      <div className="text-xs text-zinc-400 uppercase font-mono">Grand Total</div>
                      <div className="text-lg font-black text-zinc-950 font-mono">
                        {formatCurrency(order.total_amount || (order.total_paise ? order.total_paise / 100 : 0))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3-Day Delivery Notification Alert if confirmed */}
                {isConfirmed && deliveryNote && (
                  <div className="bg-purple-50/80 border border-purple-200 rounded-2xl p-3 flex items-center justify-between text-xs text-purple-900">
                    <div className="flex items-center gap-2">
                      <Truck className="w-4 h-4 text-purple-600 shrink-0" />
                      <span>
                        Order confirmed! 3-day delivery timeline active. Expected delivery:{' '}
                        <strong>{deliveryNote.estimated_delivery_text}</strong>.
                      </span>
                    </div>
                  </div>
                )}

                {/* Grid with Details and Actions */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                  {/* Delivery Address & Payment (4 cols) */}
                  <div className="md:col-span-4 bg-zinc-50 rounded-2xl p-4 border border-zinc-200/80 text-xs space-y-2">
                    <div className="flex items-center gap-1.5 font-bold text-zinc-900 uppercase tracking-wider font-mono">
                      <MapPin className="w-3.5 h-3.5 text-red-600" />
                      <span>Shipping Address</span>
                    </div>
                    <p className="text-zinc-600 leading-relaxed">
                      {order.shipping_address?.addressLine || 'Address not provided'}
                      <br />
                      {order.shipping_address?.city}, {order.shipping_address?.state} - {order.shipping_address?.pinCode}
                    </p>
                    <div className="pt-2 border-t border-zinc-200 flex items-center justify-between text-zinc-500">
                      <span>Payment:</span>
                      <strong className="text-zinc-800">
                        {order.payment_method === 'cod' ? 'Cash on Delivery (COD)' : 'Razorpay Online'} (
                        {order.payment_status})
                      </strong>
                    </div>
                    {order.tracking_number && (
                      <div className="flex items-center justify-between text-zinc-500">
                        <span>Airway Bill:</span>
                        <strong className="text-red-600 font-mono">{order.tracking_number}</strong>
                      </div>
                    )}
                  </div>

                  {/* Items snapshot (5 cols) */}
                  <div className="md:col-span-5 space-y-2 text-xs">
                    <div className="font-bold text-zinc-700 uppercase tracking-wider font-mono mb-2">
                      Order Items ({(order.order_items || []).length})
                    </div>
                    {(order.order_items || []).map((it: any) => (
                      <div
                        key={it.id}
                        className="flex items-center justify-between p-2 rounded-xl bg-zinc-50 border border-zinc-200/60"
                      >
                        <div className="flex items-center gap-2.5">
                          {it.product_image && (
                            <img
                              src={it.product_image}
                              alt={it.product_name}
                              className="w-8 h-8 object-contain rounded bg-white p-0.5 border"
                            />
                          )}
                          <div>
                            <div className="font-bold text-zinc-900 leading-tight">{it.product_name}</div>
                            <div className="text-[10px] text-zinc-500">
                              Qty: {it.quantity} · Price: {formatCurrency(it.unit_price || 0)}
                            </div>
                          </div>
                        </div>
                        <div className="font-mono font-bold text-zinc-900">
                          {formatCurrency(it.line_total || it.unit_price * it.quantity || 0)}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Actions Column (3 cols) */}
                  <div className="md:col-span-3 flex flex-col gap-2">
                    <div className="font-bold text-zinc-700 uppercase tracking-wider font-mono text-xs mb-1">
                      Admin Actions
                    </div>

                    {isInProcess && (
                      <button
                        onClick={() => handleUpdateStatus(order.id, 'confirmed')}
                        disabled={isUpdating}
                        className="w-full py-2.5 px-3 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md shadow-purple-600/20 transition-all cursor-pointer flex items-center justify-center gap-2"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Confirm Order (3-Day)</span>
                      </button>
                    )}

                    {isConfirmed && (
                      <button
                        onClick={() => handleUpdateStatus(order.id, 'shipped')}
                        disabled={isUpdating}
                        className="w-full py-2.5 px-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md shadow-blue-600/20 transition-all cursor-pointer flex items-center justify-center gap-2"
                      >
                        <Truck className="w-4 h-4" />
                        <span>Dispatch / Ship</span>
                      </button>
                    )}

                    {(isConfirmed || isShipped) && (
                      <button
                        onClick={() => handleUpdateStatus(order.id, 'delivered')}
                        disabled={isUpdating}
                        className="w-full py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Mark Delivered</span>
                      </button>
                    )}

                    {isDelivered && (
                      <div className="text-center py-2 px-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-bold font-mono">
                        ✓ Delivery Complete
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

