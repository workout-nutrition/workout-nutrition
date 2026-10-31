import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { useAuth } from '../../context/AuthContext';
import { Product } from '../../types';
import { productsService } from '../../lib/products.service';
import { formatCurrency } from '../../utils/formatters';
import { ProductFormModal } from './ProductFormModal';
import { AdminOrdersTab } from './AdminOrdersTab';
import {
  ShieldAlert,
  Plus,
  Search,
  Edit2,
  Trash2,
  Package,
  Star,
  Flame,
  RefreshCw,
  AlertTriangle,
} from 'lucide-react';

export const AdminProductsPage: React.FC = () => {
  const { products, refreshProducts, addToast, navigate } = useStore();
  const { user, profile, isAdmin, openAuthModal } = useAuth();
  const [adminSection, setAdminSection] = useState<'orders' | 'products'>('orders');

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // If not admin, show guard screen
  if (!isAdmin) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-6 bg-zinc-50">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-zinc-200/80 shadow-xl text-center">
          <div className="w-16 h-16 rounded-3xl bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-4">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black uppercase tracking-tight text-zinc-900 font-display">
            Admin Access Required
          </h2>
          <p className="text-sm text-zinc-600 mt-2 leading-relaxed">
            {user
              ? `Signed in as ${user.email} (Role: "${profile?.role || 'customer'}"). You do not have administrator permissions.`
              : 'Please sign in with your administrator account to access product management.'}
          </p>

          <div className="mt-6 flex flex-col gap-3">
            {!user && (
              <button
                onClick={() => openAuthModal('login', 'Please sign in with your administrator account')}
                className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-red-600/25 transition-all cursor-pointer"
              >
                Sign In as Admin
              </button>
            )}
            <button
              onClick={() => navigate('home')}
              className="w-full py-2.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer"
            >
              Back to Storefront
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Filter products
  const filteredProducts = products.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCategory = selectedCategory === 'all' || p.category === selectedCategory;
    return matchSearch && matchCategory;
  });

  const totalStock = products.reduce((acc, p) => acc + p.stock, 0);
  const outOfStockCount = products.filter((p) => p.stock === 0).length;
  const bestSellersCount = products.filter((p) => p.isBestSeller).length;

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshProducts();
    setIsRefreshing(false);
    addToast('Inventory refreshed', 'Loaded latest products from Supabase', 'info');
  };

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (product: Product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to permanently delete "${name}"?`)) {
      return;
    }
    setDeletingId(id);
    const { error } = await productsService.deleteProduct(id);
    setDeletingId(null);

    if (error) {
      addToast('Delete Failed', error.message, 'error');
    } else {
      addToast('Product Deleted', `"${name}" removed from database`, 'success');
      await refreshProducts();
    }
  };

  const handleToggleBestSeller = async (p: Product) => {
    const newVal = !p.isBestSeller;
    const { error } = await productsService.updateProduct(p.id, { isBestSeller: newVal });
    if (!error) {
      addToast('Updated', `${p.name} bestseller status updated`, 'success');
      await refreshProducts();
    }
  };

  const handleToggleFeatured = async (p: Product) => {
    const newVal = !p.isFeatured;
    const { error } = await productsService.updateProduct(p.id, { isFeatured: newVal });
    if (!error) {
      addToast('Updated', `${p.name} featured status updated`, 'success');
      await refreshProducts();
    }
  };

  return (
    <div className="bg-zinc-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold font-mono uppercase tracking-wider mb-2">
              <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
              Live Supabase Database • Admin Mode
            </div>
            <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-zinc-950 font-display">
              Product Catalog Management
            </h1>
            <p className="text-xs sm:text-sm text-zinc-600 mt-1">
              Add new products, edit details, or delete items directly in your Supabase backend.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="p-3 bg-white border border-zinc-200 text-zinc-700 hover:text-zinc-950 rounded-2xl shadow-sm hover:shadow transition-all cursor-pointer flex items-center justify-center"
              title="Refresh Products"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={handleOpenAdd}
              className="py-3 px-5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider rounded-2xl shadow-lg shadow-red-600/25 transition-all cursor-pointer flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Product</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 bg-zinc-200/70 p-1.5 rounded-2xl max-w-md mb-8">
          <button
            type="button"
            onClick={() => setAdminSection('orders')}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
              adminSection === 'orders'
                ? 'bg-white text-zinc-950 shadow-sm'
                : 'text-zinc-600 hover:text-zinc-950'
            }`}
          >
            <Package className="w-4 h-4 text-purple-600" />
            <span>Orders & Approvals</span>
          </button>
          <button
            type="button"
            onClick={() => setAdminSection('products')}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
              adminSection === 'products'
                ? 'bg-white text-zinc-950 shadow-sm'
                : 'text-zinc-600 hover:text-zinc-950'
            }`}
          >
            <Edit2 className="w-4 h-4 text-red-600" />
            <span>Products Catalog</span>
          </button>
        </div>

        {adminSection === 'orders' ? (
          <AdminOrdersTab />
        ) : (
          <>
            {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-5 border border-zinc-200/80 shadow-sm">
            <div className="flex items-center justify-between text-zinc-500 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Total Products</span>
              <Package className="w-4 h-4 text-zinc-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-zinc-900 font-display">
              {products.length}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-zinc-200/80 shadow-sm">
            <div className="flex items-center justify-between text-zinc-500 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Total Units</span>
              <Package className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-zinc-900 font-display">
              {totalStock}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-zinc-200/80 shadow-sm">
            <div className="flex items-center justify-between text-zinc-500 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Out of Stock</span>
              <AlertTriangle className="w-4 h-4 text-red-500" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-red-600 font-display">
              {outOfStockCount}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-zinc-200/80 shadow-sm">
            <div className="flex items-center justify-between text-zinc-500 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Best Sellers</span>
              <Flame className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-zinc-900 font-display">
              {bestSellersCount}
            </div>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="bg-white rounded-2xl p-4 border border-zinc-200/80 shadow-sm mb-6 flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, brand, category..."
              className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-zinc-50 border border-zinc-200 rounded-xl outline-none focus:border-red-600 focus:bg-white"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full sm:w-auto px-3.5 py-2.5 text-xs font-bold uppercase tracking-wider bg-zinc-50 border border-zinc-200 rounded-xl outline-none focus:border-red-600 focus:bg-white"
            >
              <option value="all">All Categories ({products.length})</option>
              {Array.from(new Set(products.map((p) => p.category))).map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Product Table */}
        <div className="bg-white rounded-3xl border border-zinc-200/80 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-200/80 bg-zinc-50 text-[11px] font-bold uppercase tracking-wider text-zinc-500 font-mono">
                  <th className="py-4 px-6">Product</th>
                  <th className="py-4 px-4">Category</th>
                  <th className="py-4 px-4">Price</th>
                  <th className="py-4 px-4">Stock</th>
                  <th className="py-4 px-4 text-center">Bestseller</th>
                  <th className="py-4 px-4 text-center">Featured</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 text-sm">
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-zinc-400 text-sm">
                      No products match your search.
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((p) => {
                    const isOut = p.stock === 0;
                    return (
                      <tr key={p.id} className="hover:bg-zinc-50/60 transition-colors">
                        {/* Product Info */}
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3.5">
                            <div className="w-12 h-12 rounded-xl bg-zinc-100 border border-zinc-200 p-1 flex items-center justify-center shrink-0 overflow-hidden">
                              <img
                                src={p.images[0] || '/products/on-gold-standard.jpg'}
                                alt=""
                                className="w-full h-full object-contain"
                              />
                            </div>
                            <div>
                              <div className="text-[10px] font-bold uppercase tracking-wider text-red-600 font-mono">
                                {p.brand}
                              </div>
                              <div className="font-bold text-zinc-900 line-clamp-1">{p.name}</div>
                              <div className="text-[11px] text-zinc-400">
                                {p.flavours.length} flavours • {p.sizes.length} sizes
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="py-4 px-4 whitespace-nowrap">
                          <span className="inline-block px-2.5 py-1 rounded-lg bg-zinc-100 text-zinc-700 text-xs font-medium">
                            {p.category}
                          </span>
                        </td>

                        {/* Price */}
                        <td className="py-4 px-4 whitespace-nowrap">
                          <div className="font-bold text-zinc-900">{formatCurrency(p.price)}</div>
                          {p.originalPrice > p.price && (
                            <div className="text-[11px] text-zinc-400 line-through">
                              {formatCurrency(p.originalPrice)}
                            </div>
                          )}
                        </td>

                        {/* Stock */}
                        <td className="py-4 px-4 whitespace-nowrap">
                          {isOut ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-50 text-red-700 text-xs font-bold">
                              <span className="w-1.5 h-1.5 rounded-full bg-red-600" />
                              Out of stock
                            </span>
                          ) : p.stock < 20 ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-bold">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                              Low: {p.stock}
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                              {p.stock} units
                            </span>
                          )}
                        </td>

                        {/* Bestseller Toggle */}
                        <td className="py-4 px-4 text-center">
                          <button
                            type="button"
                            onClick={() => handleToggleBestSeller(p)}
                            className={`p-1.5 rounded-xl transition-all cursor-pointer ${
                              p.isBestSeller
                                ? 'bg-amber-100 text-amber-700'
                                : 'bg-zinc-100 text-zinc-300 hover:text-zinc-500'
                            }`}
                            title="Toggle Bestseller"
                          >
                            <Flame className="w-4 h-4" />
                          </button>
                        </td>

                        {/* Featured Toggle */}
                        <td className="py-4 px-4 text-center">
                          <button
                            type="button"
                            onClick={() => handleToggleFeatured(p)}
                            className={`p-1.5 rounded-xl transition-all cursor-pointer ${
                              p.isFeatured
                                ? 'bg-red-100 text-red-600'
                                : 'bg-zinc-100 text-zinc-300 hover:text-zinc-500'
                            }`}
                            title="Toggle Featured"
                          >
                            <Star className="w-4 h-4" />
                          </button>
                        </td>

                        {/* Actions */}
                        <td className="py-4 px-6 text-right whitespace-nowrap">
                          <div className="inline-flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleOpenEdit(p)}
                              className="px-3 py-1.5 text-xs font-bold text-zinc-700 bg-zinc-100 hover:bg-zinc-200 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
                              title="Edit product"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                              <span>Edit</span>
                            </button>
                            <button
                              type="button"
                              disabled={deletingId === p.id}
                              onClick={() => handleDelete(p.id, p.name)}
                              className="px-3 py-1.5 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
                              title="Delete product"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
        </>
        )}

        {/* Modal */}
        <ProductFormModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          productToEdit={editingProduct}
          onSaved={refreshProducts}
        />
      </div>
    </div>
  );
};
