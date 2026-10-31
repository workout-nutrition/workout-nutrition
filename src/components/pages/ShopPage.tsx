import React, { useState, useMemo } from 'react';
import { useStore } from '../../context/StoreContext';
import { BRANDS } from '../../data/brands';
import { CATEGORIES } from '../../data/categories';
import { ProductCard } from '../common/ProductCard';
import { formatCurrency } from '../../utils/formatters';
import { Filter, X, ChevronDown, Check, SlidersHorizontal, ArrowUpDown, Star } from 'lucide-react';
import { usePageSEO } from '../../utils/seo';

export const ShopPage: React.FC = () => {
  const { products, routeParams, navigate } = useStore();

  usePageSEO({
    title: 'Shop All 100% Authentic Supplements Online India',
    description:
      'Explore certified whey protein, pre-workouts, mass gainers, creatine, and wellness vitamins at Workout Nutrition. Batch verified authenticity with fast delivery.',
  });

  // Filters State
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    routeParams.categorySlug ? [CATEGORIES.find((c) => c.slug === routeParams.categorySlug)?.name || routeParams.categorySlug] : []
  );
  const [selectedBrands, setSelectedBrands] = useState<string[]>(
    routeParams.brandSlug ? [routeParams.brandSlug] : []
  );
  const [selectedPriceRanges, setSelectedPriceRanges] = useState<string[]>([]);
  const [selectedGoals, setSelectedGoals] = useState<string[]>(
    routeParams.goalSlug ? [routeParams.goalSlug] : []
  );
  const [selectedDietary, setSelectedDietary] = useState<string[]>([]);
  const [minRating, setMinRating] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<string>('featured');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Category options are shared with the Excel-based category catalogue.
  const categoriesList = CATEGORIES.map((category) => category.name);

  const priceRanges = [
    { id: 'under-1000', label: 'Under ₹1,000', min: 0, max: 1000 },
    { id: '1000-2500', label: '₹1,000 – ₹2,500', min: 1000, max: 2500 },
    { id: '2500-5000', label: '₹2,500 – ₹5,000', min: 2500, max: 5000 },
    { id: 'above-5000', label: '₹5,000 & Above', min: 5000, max: 999999 },
  ];

  const goalsList = [
    { id: 'build-muscle', label: 'Build Muscle' },
    { id: 'lose-fat', label: 'Lose Fat' },
    { id: 'increase-strength', label: 'Increase Strength' },
    { id: 'improve-performance', label: 'Improve Performance' },
    { id: 'increase-energy', label: 'Increase Energy' },
    { id: 'recovery', label: 'Muscle Recovery' },
    { id: 'general-wellness', label: 'General Wellness' },
  ];

  const dietaryList = ['Vegetarian', 'Vegan', 'Gluten-Free'];

  // Toggle helpers
  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const toggleBrand = (brandName: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brandName) ? prev.filter((b) => b !== brandName) : [...prev, brandName]
    );
  };

  const togglePriceRange = (rangeId: string) => {
    setSelectedPriceRanges((prev) =>
      prev.includes(rangeId) ? prev.filter((r) => r !== rangeId) : [...prev, rangeId]
    );
  };

  const toggleGoal = (goalId: string) => {
    setSelectedGoals((prev) =>
      prev.includes(goalId) ? prev.filter((g) => g !== goalId) : [...prev, goalId]
    );
  };

  const toggleDietary = (item: string) => {
    setSelectedDietary((prev) =>
      prev.includes(item) ? prev.filter((d) => d !== item) : [...prev, item]
    );
  };

  const clearAllFilters = () => {
    setSelectedCategories([]);
    setSelectedBrands([]);
    setSelectedPriceRanges([]);
    setSelectedGoals([]);
    setSelectedDietary([]);
    setMinRating(null);
  };

  // Filter and Sort Processing
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Search query filter
      if (routeParams.searchQuery) {
        const q = routeParams.searchQuery.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(q);
        const matchesBrand = product.brand.toLowerCase().includes(q);
        const matchesCategory = product.category.toLowerCase().includes(q);
        if (!matchesName && !matchesBrand && !matchesCategory) return false;
      }

      // Category filter
      if (selectedCategories.length > 0) {
        const matchesCat = selectedCategories.some((c) => {
          const normalize = (value: string) => value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
          return normalize(product.category) === normalize(c) || normalize(product.subcategory) === normalize(c);
        });
        if (!matchesCat) return false;
      }

      // Brand filter
      if (selectedBrands.length > 0) {
        const matchesBrand = selectedBrands.some(
          (b) => product.brand.toLowerCase() === b.toLowerCase()
        );
        if (!matchesBrand) return false;
      }

      // Price filter
      if (selectedPriceRanges.length > 0) {
        const matchesPrice = selectedPriceRanges.some((rangeId) => {
          const config = priceRanges.find((r) => r.id === rangeId);
          if (!config) return false;
          return product.price >= config.min && product.price <= config.max;
        });
        if (!matchesPrice) return false;
      }

      // Goal filter
      if (selectedGoals.length > 0) {
        const matchesGoal = selectedGoals.some((g) => (product.goals as string[]).includes(g));
        if (!matchesGoal) return false;
      }

      // Dietary filter
      if (selectedDietary.length > 0) {
        if (!selectedDietary.includes(product.dietary)) return false;
      }

      // Rating filter
      if (minRating !== null && product.rating < minRating) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'discount') return b.discount - a.discount;
      if (sortBy === 'bestseller') return (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0);
      return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
    });
  }, [
    products,
    selectedCategories,
    selectedBrands,
    selectedPriceRanges,
    selectedGoals,
    selectedDietary,
    minRating,
    sortBy,
    routeParams.searchQuery,
  ]);

  const hasActiveFilters =
    selectedCategories.length > 0 ||
    selectedBrands.length > 0 ||
    selectedPriceRanges.length > 0 ||
    selectedGoals.length > 0 ||
    selectedDietary.length > 0 ||
    minRating !== null;

  return (
    <div className="bg-zinc-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-zinc-500 mb-4">
          <button onClick={() => navigate('home')} className="hover:text-red-600 cursor-pointer">
            Home
          </button>
          <span>/</span>
          <span className="text-zinc-900 font-semibold">Shop All Supplements</span>
        </div>

        {/* Page Header */}
        <div className="bg-white border border-zinc-200/80 rounded-2xl p-6 sm:p-8 mb-8 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="font-display font-normal text-3xl sm:text-4xl lg:text-5xl text-zinc-950 uppercase tracking-wide">
                SHOP ALL SPORTS NUTRITION
              </h1>
              <p className="font-body text-xs sm:text-sm text-zinc-600 font-normal mt-1 leading-relaxed">
                Explore our complete range of certified authentic supplements. Guaranteed fresh batches with original manufacturer seals.
              </p>
            </div>
            <div className="text-xs font-mono font-bold text-zinc-500 bg-zinc-100 px-3.5 py-1.5 rounded-lg shrink-0 self-start md:self-auto">
              SHOWING {filteredProducts.length} PRODUCTS
            </div>
          </div>
        </div>

        {/* Layout Grid: Left Sidebar + Right Product Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Mobile Filter Toggle Button */}
          <div className="lg:hidden flex items-center justify-between gap-3">
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="flex-1 bg-white border border-zinc-200 text-zinc-800 text-xs font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-sm"
            >
              <SlidersHorizontal className="w-4 h-4 text-red-600" />
              <span>Filter Catalog ({hasActiveFilters ? 'Active' : 'All'})</span>
            </button>

            {/* Mobile Sort Dropdown */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-white border border-zinc-200 text-zinc-800 text-xs font-bold py-3 px-3 rounded-xl appearance-none outline-none pr-8 cursor-pointer shadow-sm"
              >
                <option value="featured">Sort: Featured</option>
                <option value="bestseller">Sort: Best Sellers</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="discount">Biggest Discount</option>
              </select>
              <ChevronDown className="w-4 h-4 text-zinc-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Desktop Left Sidebar Filters */}
          <div className="hidden lg:block space-y-6 sticky top-1 self-start">
            <div className="bg-white border border-zinc-200/80 rounded-2xl p-5 shadow-sm space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
                <span className="font-heading font-black text-sm uppercase tracking-wider text-zinc-900 flex items-center gap-1.5">
                  <Filter className="w-4 h-4 text-red-600" />
                  <span>FILTERS</span>
                </span>
                {hasActiveFilters && (
                  <button
                    onClick={clearAllFilters}
                    className="text-xs font-bold text-red-600 hover:underline cursor-pointer"
                  >
                    Clear All
                  </button>
                )}
              </div>

              {/* 1. Category Filter */}
              <div>
                <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-zinc-900 mb-3">
                  CATEGORY
                </h4>
                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  {categoriesList.map((cat) => (
                    <label
                      key={cat}
                      className="flex items-center gap-2.5 text-xs text-zinc-700 hover:text-black cursor-pointer py-0.5"
                    >
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(cat)}
                        onChange={() => toggleCategory(cat)}
                        className="rounded border-zinc-300 text-red-600 focus:ring-red-500 w-3.5 h-3.5"
                      />
                      <span>{cat}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* 2. Brand Filter */}
              <div className="pt-4 border-t border-zinc-100">
                <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-zinc-900 mb-3">
                  BRAND
                </h4>
                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  {BRANDS.map((b) => (
                    <label
                      key={b.id}
                      className="flex items-center gap-2.5 text-xs text-zinc-700 hover:text-black cursor-pointer py-0.5"
                    >
                      <input
                        type="checkbox"
                        checked={selectedBrands.includes(b.name)}
                        onChange={() => toggleBrand(b.name)}
                        className="rounded border-zinc-300 text-red-600 focus:ring-red-500 w-3.5 h-3.5"
                      />
                      <span>{b.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* 3. Price Filter */}
              <div className="pt-4 border-t border-zinc-100">
                <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-zinc-900 mb-3">
                  PRICE
                </h4>
                <div className="space-y-1.5">
                  {priceRanges.map((r) => (
                    <label
                      key={r.id}
                      className="flex items-center gap-2.5 text-xs text-zinc-700 hover:text-black cursor-pointer py-0.5"
                    >
                      <input
                        type="checkbox"
                        checked={selectedPriceRanges.includes(r.id)}
                        onChange={() => togglePriceRange(r.id)}
                        className="rounded border-zinc-300 text-red-600 focus:ring-red-500 w-3.5 h-3.5"
                      />
                      <span>{r.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* 4. Fitness Goal Filter */}
              <div className="pt-4 border-t border-zinc-100">
                <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-zinc-900 mb-3">
                  FITNESS GOAL
                </h4>
                <div className="space-y-1.5">
                  {goalsList.map((g) => (
                    <label
                      key={g.id}
                      className="flex items-center gap-2.5 text-xs text-zinc-700 hover:text-black cursor-pointer py-0.5"
                    >
                      <input
                        type="checkbox"
                        checked={selectedGoals.includes(g.id)}
                        onChange={() => toggleGoal(g.id)}
                        className="rounded border-zinc-300 text-red-600 focus:ring-red-500 w-3.5 h-3.5"
                      />
                      <span>{g.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* 5. Dietary Preference */}
              <div className="pt-4 border-t border-zinc-100">
                <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-zinc-900 mb-3">
                  DIETARY PREFERENCE
                </h4>
                <div className="space-y-1.5">
                  {dietaryList.map((d) => (
                    <label
                      key={d}
                      className="flex items-center gap-2.5 text-xs text-zinc-700 hover:text-black cursor-pointer py-0.5"
                    >
                      <input
                        type="checkbox"
                        checked={selectedDietary.includes(d)}
                        onChange={() => toggleDietary(d)}
                        className="rounded border-zinc-300 text-red-600 focus:ring-red-500 w-3.5 h-3.5"
                      />
                      <span>{d}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* 6. Customer Rating */}
              <div className="pt-4 border-t border-zinc-100">
                <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-zinc-900 mb-3">
                  MINIMUM RATING
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {[4.8, 4.7, 4.5].map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setMinRating(minRating === r ? null : r)}
                      className={`text-xs px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                        minRating === r
                          ? 'border-red-600 bg-red-50 text-red-700 font-bold'
                          : 'border-zinc-200 text-zinc-600 hover:border-zinc-300'
                      }`}
                    >
                      ★ {r}+
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Product Grid Area */}
          <div className="lg:col-span-3">
            {/* Desktop Sort Bar & Active Filter Chips */}
            <div className="bg-white border border-zinc-200/80 rounded-2xl p-4 mb-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
              {/* Active Filter Chips */}
              <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
                {hasActiveFilters ? (
                  <>
                    <span className="text-xs font-bold text-zinc-500 mr-1">Active:</span>
                    {selectedCategories.map((c) => (
                      <span
                        key={c}
                        className="text-[11px] bg-red-50 text-red-700 border border-red-200 px-2.5 py-0.5 rounded-lg flex items-center gap-1"
                      >
                        {c}
                        <button onClick={() => toggleCategory(c)} className="hover:text-red-900">
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                    {selectedBrands.map((b) => (
                      <span
                        key={b}
                        className="text-[11px] bg-red-50 text-red-700 border border-red-200 px-2.5 py-0.5 rounded-lg flex items-center gap-1"
                      >
                        {b}
                        <button onClick={() => toggleBrand(b)} className="hover:text-red-900">
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                    <button
                      onClick={clearAllFilters}
                      className="text-xs text-red-600 hover:underline font-bold ml-1 cursor-pointer"
                    >
                      Clear All
                    </button>
                  </>
                ) : (
                  <span className="text-xs text-zinc-500 font-medium">
                    Showing all products sorted by popularity
                  </span>
                )}
              </div>

              {/* Desktop Sort Dropdown */}
              <div className="hidden sm:flex items-center gap-2 shrink-0">
                <span className="text-xs font-bold text-zinc-600 flex items-center gap-1">
                  <ArrowUpDown className="w-3.5 h-3.5" />
                  Sort By:
                </span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-zinc-50 border border-zinc-200 text-xs font-bold py-1.5 px-3 rounded-lg outline-none cursor-pointer focus:border-red-600"
                >
                  <option value="featured">Featured</option>
                  <option value="bestseller">Best Selling</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                  <option value="discount">Biggest Discount</option>
                </select>
              </div>
            </div>

            {/* Product Cards Grid: 3 columns desktop, 2 columns mobile */}
            {filteredProducts.length === 0 ? (
              <div className="bg-white border border-zinc-200/80 rounded-2xl p-16 text-center shadow-sm">
                <h3 className="font-heading font-bold text-lg text-zinc-900 mb-1">
                  No products matched your active filters
                </h3>
                <p className="text-xs text-zinc-500 mb-6 max-w-sm mx-auto">
                  Try unchecking some filter categories or clearing the brand filter to browse all supplements.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider py-2.5 px-6 rounded-xl transition-colors cursor-pointer"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Sheet Modal — Full Filter Suite (Price, Brand, Category, Dietary, Rating, Goal) */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm lg:hidden animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-white h-full p-5 overflow-y-auto flex flex-col justify-between shadow-2xl">
            <div className="space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
                <span className="font-heading font-bold text-base uppercase text-zinc-950 flex items-center gap-2">
                  <Filter className="w-4 h-4 text-red-600" />
                  <span>FILTER PRODUCTS</span>
                </span>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-1.5 text-zinc-400 hover:text-black rounded-full hover:bg-zinc-100 cursor-pointer"
                  aria-label="Close filters"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* 1. Price Filter */}
              <div>
                <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-zinc-900 mb-2.5">
                  PRICE RANGE
                </h4>
                <div className="space-y-1.5">
                  {priceRanges.map((r) => (
                    <label key={r.id} className="flex items-center gap-2.5 text-xs text-zinc-700 py-1 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedPriceRanges.includes(r.id)}
                        onChange={() => togglePriceRange(r.id)}
                        className="rounded border-zinc-300 text-red-600 focus:ring-red-500 w-4 h-4"
                      />
                      <span>{r.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* 2. Brand Filter */}
              <div className="pt-4 border-t border-zinc-100">
                <div className="flex items-center justify-between mb-2.5">
                  <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-zinc-900">
                    BRAND
                  </h4>
                  {selectedBrands.length > 0 && (
                    <span className="text-[10px] text-red-600 font-bold">{selectedBrands.length} selected</span>
                  )}
                </div>
                <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1">
                  {BRANDS.map((b) => (
                    <label key={b.id} className="flex items-center gap-2.5 text-xs text-zinc-700 py-1 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedBrands.includes(b.name)}
                        onChange={() => toggleBrand(b.name)}
                        className="rounded border-zinc-300 text-red-600 focus:ring-red-500 w-4 h-4"
                      />
                      <span>{b.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* 3. Category Filter */}
              <div className="pt-4 border-t border-zinc-100">
                <div className="flex items-center justify-between mb-2.5">
                  <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-zinc-900">
                    CATEGORY
                  </h4>
                  {selectedCategories.length > 0 && (
                    <span className="text-[10px] text-red-600 font-bold">{selectedCategories.length} selected</span>
                  )}
                </div>
                <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1">
                  {categoriesList.map((c) => (
                    <label key={c} className="flex items-center gap-2.5 text-xs text-zinc-700 py-1 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(c)}
                        onChange={() => toggleCategory(c)}
                        className="rounded border-zinc-300 text-red-600 focus:ring-red-500 w-4 h-4"
                      />
                      <span>{c}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* 4. Dietary Preference */}
              <div className="pt-4 border-t border-zinc-100">
                <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-zinc-900 mb-2.5">
                  DIETARY PREFERENCE
                </h4>
                <div className="space-y-1.5">
                  {dietaryList.map((d) => (
                    <label key={d} className="flex items-center gap-2.5 text-xs text-zinc-700 py-1 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedDietary.includes(d)}
                        onChange={() => toggleDietary(d)}
                        className="rounded border-zinc-300 text-red-600 focus:ring-red-500 w-4 h-4"
                      />
                      <span>{d}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* 5. Minimum Rating */}
              <div className="pt-4 border-t border-zinc-100">
                <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-zinc-900 mb-2.5">
                  MINIMUM RATING
                </h4>
                <div className="space-y-1.5">
                  {[4.5, 4.0, 3.5].map((stars) => (
                    <label key={stars} className="flex items-center gap-2.5 text-xs text-zinc-700 py-1 cursor-pointer">
                      <input
                        type="radio"
                        name="mobileRating"
                        checked={minRating === stars}
                        onChange={() => setMinRating(minRating === stars ? null : stars)}
                        className="text-red-600 focus:ring-red-500"
                      />
                      <span className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{stars} Stars &amp; Above</span>
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* 6. Fitness Goals */}
              <div className="pt-4 border-t border-zinc-100">
                <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-zinc-900 mb-2.5">
                  FITNESS GOAL
                </h4>
                <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                  {goalsList.map((g) => (
                    <label key={g.id} className="flex items-center gap-2.5 text-xs text-zinc-700 py-1 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedGoals.includes(g.id)}
                        onChange={() => toggleGoal(g.id)}
                        className="rounded border-zinc-300 text-red-600 focus:ring-red-500 w-4 h-4"
                      />
                      <span>{g.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-5 mt-5 border-t border-zinc-100 space-y-2 sticky bottom-0 bg-white">
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase py-3.5 rounded-xl shadow-md shadow-red-600/20 cursor-pointer"
              >
                Show {filteredProducts.length} Results
              </button>
              {hasActiveFilters && (
                <button
                  onClick={clearAllFilters}
                  className="w-full bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-bold text-xs uppercase py-3 rounded-xl cursor-pointer"
                >
                  Clear All Filters
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
