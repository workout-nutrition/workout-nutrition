import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { CATEGORIES } from '../../data/categories';
import { ProductCard } from '../common/ProductCard';
import { ArrowLeft, Tag, Layers, ArrowUpDown } from 'lucide-react';
import { usePageSEO } from '../../utils/seo';

export const CategoryPage: React.FC = () => {
  const { products: allProducts, routeParams, navigate } = useStore();
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState('featured');

  const slug = routeParams.categorySlug || 'whey-protein';
  
  // Find category by slug, normalized name, or fallback
  const normalize = (value: string) =>
    (value || '').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

  const category =
    CATEGORIES.find((c) => c.slug === slug || normalize(c.name) === normalize(slug)) ||
    CATEGORIES.find((c) => normalize(c.slug).includes(normalize(slug)) || normalize(slug).includes(normalize(c.slug))) ||
    CATEGORIES[0];

  usePageSEO({
    title: `Buy ${category.name} Online – 100% Genuine Supplements`,
    description: `Shop authentic ${category.name} in India. Browse top certified brands with verified importer batch hologram seals and best prices at Workout Nutrition.`,
  });

  const products = allProducts.filter((p) => {
    const normCategory = normalize(p.category || '');
    const normCatName = normalize(category.name);
    const normCatSlug = normalize(category.slug);
    const normSubcategory = normalize(p.subcategory || '');

    const matchesCategory =
      normCategory === normCatName ||
      normCategory === normCatSlug ||
      normCategory.replace(/s$/, '') === normCatName.replace(/s$/, '') ||
      normSubcategory === normCatName ||
      normSubcategory === normCatSlug;

    if (!matchesCategory) return false;
    if (selectedSubcategory && p.subcategory !== selectedSubcategory) return false;
    return true;
  }).sort((a, b) => {
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
            Collections
          </button>
          <span>/</span>
          <span className="text-zinc-900 font-semibold">{category.name}</span>
        </div>

        {/* Hero Category Banner */}
        <div className="relative rounded-3xl overflow-hidden bg-zinc-950 text-white p-8 sm:p-12 mb-8 shadow-xl">
          <img
            src={category.image}
            alt={category.name}
            className="absolute inset-0 w-full h-full object-cover opacity-25 mix-blend-overlay"
            referrerPolicy="no-referrer"
          />
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-red-400 uppercase tracking-widest mb-2 font-mono bg-red-600/20 px-3 py-1 rounded-full border border-red-500/30">
              <Layers className="w-3.5 h-3.5" />
              <span>{category.group} DEPARTMENT</span>
            </div>
            <h1 className="font-display font-normal text-4xl sm:text-5xl lg:text-6xl text-white uppercase tracking-wide mb-3">
              {category.name}
            </h1>
            <p className="font-body text-sm sm:text-base text-zinc-300 font-normal leading-relaxed">
              {category.description}
            </p>
          </div>
        </div>

        {/* Subcategories Filter Chips */}
        {category.subcategories.length > 0 && (
          <div className="bg-white border border-zinc-200/80 rounded-2xl p-4 mb-8 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              <span className="text-xs font-bold text-zinc-500 mr-1">Subcategory:</span>
              <button
                onClick={() => setSelectedSubcategory(null)}
                className={`text-xs px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                  selectedSubcategory === null
                    ? 'bg-red-600 text-white'
                    : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
                }`}
              >
                All
              </button>
              {category.subcategories.map((sub) => (
                <button
                  key={sub}
                  onClick={() => setSelectedSubcategory(sub)}
                  className={`text-xs px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                    selectedSubcategory === sub
                      ? 'bg-red-600 text-white'
                      : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
                  }`}
                >
                  {sub}
                </button>
              ))}
            </div>

            {/* Sort */}
            <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
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
        )}

        {/* Products Grid */}
        {products.length === 0 ? (
          <div className="bg-white rounded-2xl p-16 text-center border border-zinc-200/80">
            <h3 className="font-heading font-bold text-lg text-zinc-900 mb-2">
              No products found in this subcategory
            </h3>
            <button
              onClick={() => setSelectedSubcategory(null)}
              className="bg-red-600 text-white font-bold text-xs uppercase px-6 py-2.5 rounded-xl cursor-pointer"
            >
              Show All {category.name}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
