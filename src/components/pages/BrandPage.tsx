import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { BRANDS } from '../../data/brands';
import { ProductCard } from '../common/ProductCard';
import { ShieldCheck, Award, Globe, ArrowUpDown, ChevronDown } from 'lucide-react';
import { usePageSEO } from '../../utils/seo';

export const BrandPage: React.FC = () => {
  const { products, routeParams, navigate } = useStore();
  const [sortBy, setSortBy] = useState('featured');

  const slug = routeParams.brandSlug || 'optimum-nutrition';
  const foundBrand = BRANDS.find(
    (b) => b.slug === slug || b.name.toLowerCase().replace(/\s+/g, '-') === slug.toLowerCase()
  );
  const brand = foundBrand || {
    id: slug,
    name:
      products.find((p) => p.brand.toLowerCase().replace(/\s+/g, '-') === slug.toLowerCase())?.brand ||
      slug.replace(/-/g, ' ').toUpperCase(),
    slug,
    origin: 'Authorized Global / Indian',
    tagline: '100% Authentic Sports Nutrition',
    description:
      'Directly sourced authentic fitness nutrition products with verified batch screening and original importer authenticity stamps.',
    authorizedDistributor: 'Official Importers (GMC / Glanbia / Bright / MusclePro)',
  };

  usePageSEO({
    title: `${brand.name} Supplements Online – 100% Genuine Products India`,
    description: `Shop authentic ${brand.name} supplements in India. Official importer-verified batch codes, original hologram seal, fast delivery at Workout Nutrition.`,
  });

  // Brand's products
  const brandProducts = products.filter(
    (p) =>
      p.brand.toLowerCase() === brand.name.toLowerCase() ||
      p.brand.toLowerCase().replace(/\s+/g, '-') === slug.toLowerCase()
  ).sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    return (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0);
  });

  return (
    <div className="bg-zinc-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-zinc-500 mb-6">
          <button onClick={() => navigate('home')} className="hover:text-red-600 cursor-pointer">
            Home
          </button>
          <span>/</span>
          <button onClick={() => navigate('shop')} className="hover:text-red-600 cursor-pointer">
            Brands
          </button>
          <span>/</span>
          <span className="text-zinc-900 font-semibold">{brand.name}</span>
        </div>

        {/* Brand Header Banner */}
        <div className="bg-white border border-zinc-200/80 rounded-3xl p-6 sm:p-10 mb-8 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 mb-6 border-b border-zinc-100">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-zinc-950 text-white flex items-center justify-center font-display font-normal text-2xl sm:text-3xl tracking-wider uppercase p-2 text-center border-2 border-red-600">
                {brand.name.substring(0, 3)}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="font-display font-normal text-3xl sm:text-4xl lg:text-5xl text-zinc-950 uppercase tracking-wide">
                    {brand.name}
                  </h1>
                  <span className="text-[10px] font-mono uppercase bg-red-50 text-red-600 border border-red-200 font-bold px-2 py-0.5 rounded">
                    {brand.origin}
                  </span>
                </div>
                <div className="text-xs sm:text-sm font-semibold text-red-600 font-body">
                  {brand.tagline}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-xs font-bold text-zinc-700 bg-zinc-50 px-3.5 py-2 rounded-xl border border-zinc-200">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Authorized Importer Hologram</span>
              </div>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-zinc-600 max-w-3xl leading-relaxed">
            {brand.description}
          </p>
        </div>

        {/* Controls & Counts Bar */}
        <div className="bg-white border border-zinc-200/80 rounded-2xl p-4 mb-8 shadow-sm flex items-center justify-between gap-4">
          <div className="text-xs font-bold text-zinc-700">
            SHOWING {brandProducts.length} AUTHENTIC {brand.name.toUpperCase()} PRODUCTS
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-zinc-500">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-zinc-50 border border-zinc-200 text-xs font-bold py-1.5 px-3 rounded-lg outline-none cursor-pointer"
            >
              <option value="featured">Best Sellers</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>

        {/* Product Grid */}
        {brandProducts.length === 0 ? (
          <div className="bg-white rounded-2xl p-16 text-center border border-zinc-200/80">
            <h3 className="font-heading font-bold text-lg text-zinc-900 mb-2">
              No products found for this brand in stock
            </h3>
            <button
              onClick={() => navigate('shop')}
              className="bg-red-600 text-white font-bold text-xs uppercase px-6 py-2.5 rounded-xl cursor-pointer"
            >
              Browse All Supplements
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {brandProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
