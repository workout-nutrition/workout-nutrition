import React from 'react';
import { useStore } from '../../context/StoreContext';
import { GOALS } from '../../data/goals';
import { Product } from '../../types';
import { ProductCard } from '../common/ProductCard';
import { Target, Lightbulb } from 'lucide-react';
import { usePageSEO } from '../../utils/seo';

const normalizeCategory = (value?: string): string =>
  (value || '').toLowerCase().replace(/[^a-z0-9]/g, '');

const GOAL_PRODUCT_CATEGORIES: Record<
  string,
  { categories: string[]; keywords: string[]; excludedCategories?: string[] }
> = {
  'lose-fat': {
    categories: ['Fat Burner'],
    keywords: ['fat burner', 'cla', 'carnitine', 'shred', 'thermogenic', 'weight loss', 'svelte', 'buster', 'viper'],
    excludedCategories: ['Whey Protein', 'Mass Gainer', 'Breakfast', 'Creatine'],
  },
  'gain-weight': {
    categories: ['Mass Gainer'],
    keywords: ['mass gainer', 'weight gainer', 'anabolic gainer'],
    excludedCategories: ['Fat Burner'],
  },
  'build-muscle': {
    categories: ['Whey Protein', 'Whey Isolate', 'Plant Protein', 'Protein'],
    keywords: ['whey', 'isolate', 'protein', 'allwhey', 'isoflex'],
    excludedCategories: ['Fat Burner'],
  },
  'increase-strength': {
    categories: ['Creatine'],
    keywords: ['creatine', 'strength', 'power'],
    excludedCategories: ['Fat Burner'],
  },
  'boost-energy': {
    categories: ['Pre Workout'],
    keywords: ['pre workout', 'c4', 'energy', 'stim free preworkout'],
    excludedCategories: ['Mass Gainer'],
  },
  recovery: {
    categories: ['BCAA', 'EAA', 'BCAA & EAA', 'Glutamine & Aminos', 'Carbohydrates & Recovery', 'ZMA'],
    keywords: ['bcaa', 'eaa', 'recovery', 'amino', 'zma'],
    excludedCategories: ['Mass Gainer', 'Fat Burner'],
  },
  'health-wellness': {
    categories: ['Multivitamins', 'Fish Oil', 'Health & Wellness', 'Liver Support', 'Others'],
    keywords: ['multivitamin', 'fish oil', 'omega', 'tudca', 'ashwagandha', 'wellness', 'oats'],
    excludedCategories: ['Fat Burner'],
  },
};

export const GoalPage: React.FC = () => {
  const { products, routeParams, navigate } = useStore();

  const slug = routeParams.goalSlug || 'build-muscle';
  const goal = GOALS.find((g) => g.slug === slug) || GOALS[0];

  usePageSEO({
    title: `Supplements for ${goal.title} – Best Fitness Nutrition`,
    description: `Target your fitness goal: ${goal.title}. Discover recommended proteins, creatine, and recovery supplements tailored for maximum results at Workout Nutrition.`,
  });

  const rule = GOAL_PRODUCT_CATEGORIES[goal.slug] || {
    categories: [],
    keywords: [],
  };

  const allowedCategories = rule.categories.map(normalizeCategory);
  const excludedCategories = (rule.excludedCategories || []).map(normalizeCategory);

  const goalProducts = products.filter((product) => {
    const category = normalizeCategory(product.category);
    const subcategory = normalizeCategory(product.subcategory);

    // 1. Strict Exclusion (e.g. Mass Gainer / Whey in Fat Loss)
    if (excludedCategories.includes(category) && !rule.keywords.some((kw) => product.name.toLowerCase().includes(kw))) {
      return false;
    }

    // 2. Strict Lose Fat logic: ONLY genuine fat loss supplements
    if (goal.slug === 'lose-fat') {
      const isFatBurnerCat = ['fatburner', 'fatburners'].includes(category);
      const isFatLossTerm = [product.name, product.subcategory, ...(product.tags || [])].some((t) =>
        /(fat\s*burner|cla|carnitine|shred|thermogenic|weight\s*loss|svelte|buster|viper)/i.test(t || '')
      );
      return isFatBurnerCat || isFatLossTerm;
    }

    // 3. Strict Gain Weight logic: ONLY Mass/Weight Gainers
    if (goal.slug === 'gain-weight') {
      const isGainerCat = ['massgainer', 'weightgainer'].includes(category);
      const isGainerTerm = [product.name, product.subcategory, ...(product.tags || [])].some((t) =>
        /(mass\s*gainer|weight\s*gainer|anabolic\s*gainer|bulk)/i.test(t || '')
      );
      return isGainerCat || isGainerTerm;
    }

    // 4. Match by allowed category
    const matchesByCategory =
      allowedCategories.includes(category) ||
      allowedCategories.includes(subcategory);

    // 5. Match by explicit keyword in product name
    const matchesByKeyword = rule.keywords.some((kw) =>
      product.name.toLowerCase().includes(kw)
    );

    // 6. Match by product goals array
    const matchesByGoal =
      Array.isArray(product.goals) && product.goals.includes(goal.id as any);

    return matchesByCategory || matchesByKeyword || matchesByGoal;
  }).sort((a, b) => {
    const getPriority = (product: Product) => {
      const categories = [
        normalizeCategory(product.category),
        normalizeCategory(product.subcategory),
      ];

      const matchedIndexes = categories
        .map((category) => allowedCategories.indexOf(category))
        .filter((index) => index !== -1);

      return matchedIndexes.length
        ? Math.min(...matchedIndexes)
        : Number.MAX_SAFE_INTEGER;
    };

    const priorityDifference = getPriority(a) - getPriority(b);

    if (priorityDifference !== 0) return priorityDifference;

    return (b.rating ?? 0) - (a.rating ?? 0);
  });

  return (
    <div className="bg-zinc-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center gap-2 text-xs text-zinc-500 mb-6">
          <button
            onClick={() => navigate('home')}
            className="hover:text-red-600 cursor-pointer"
          >
            Home
          </button>
          <span>/</span>
          <button
            onClick={() => navigate('shop')}
            className="hover:text-red-600 cursor-pointer"
          >
            Goals
          </button>
          <span>/</span>
          <span className="text-zinc-900 font-semibold">{goal.title}</span>
        </div>

        <div className="relative rounded-3xl overflow-hidden bg-zinc-950 text-white p-8 sm:p-12 mb-8 shadow-xl">
          <img
            src={goal.heroImage}
            alt={goal.title}
            className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-overlay"
            referrerPolicy="no-referrer"
          />

          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-red-400 uppercase tracking-widest mb-2 font-mono bg-red-600/20 px-3 py-1 rounded-full border border-red-500/30">
              <Target className="w-3.5 h-3.5" />
              <span>{goal.subtitle}</span>
            </div>

            <h1 className="font-display font-normal text-4xl sm:text-5xl lg:text-6xl text-white uppercase tracking-wide mb-3">
              {goal.title}
            </h1>

            <p className="font-body text-sm sm:text-base text-zinc-300 font-normal leading-relaxed mb-6">
              {goal.description}
            </p>

            <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-4 sm:p-5 backdrop-blur-md">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400 uppercase tracking-wider mb-2.5">
                <Lightbulb className="w-4 h-4" />
                <span>NUTRITIONIST PROTOCOL TIPS</span>
              </div>

              <ul className="space-y-1.5 text-xs text-zinc-300">
                {goal.tips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-red-500 font-bold shrink-0">✓</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mb-6 flex items-center justify-between gap-4">
          <h2 className="font-heading font-black text-lg text-zinc-900 uppercase">
            RECOMMENDED STACK SUPPLEMENTS ({goalProducts.length})
          </h2>

          <button
            onClick={() => navigate('shop')}
            className="text-xs font-bold text-red-600 hover:underline shrink-0"
          >
            Browse All Products →
          </button>
        </div>

        {goalProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {goalProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-zinc-200 bg-white p-8 text-center">
            <h3 className="text-lg font-bold text-zinc-900 mb-2">
              No matching products found
            </h3>
            <p className="text-sm text-zinc-500 mb-4">
              No products currently match the categories configured for this goal.
              Check the category names in products.ts.
            </p>
            <button
              onClick={() => navigate('shop')}
              className="bg-red-600 text-white rounded-lg px-5 py-2.5 text-sm font-bold hover:bg-red-700"
            >
              Browse All Products
            </button>
          </div>
        )}
      </div>
    </div>
  );
};