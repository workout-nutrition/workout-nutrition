import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { formatCurrency } from '../../utils/formatters';
import { ArrowRight, ShieldCheck, Zap, Award } from 'lucide-react';
import heroVisual from '../../assets/images/hero_athlete_training_1791377063699.jpg';

export const HeroSection: React.FC = () => {
  const { products, navigate } = useStore();

  // Showcase items directly from live Supabase products
  const wheyProduct =
    products.find((p) => (p.category || '').toLowerCase().includes('whey') || (p.category || '').toLowerCase().includes('protein')) ||
    products[0];

  const creatineProduct =
    products.find((p) => (p.category || '').toLowerCase().includes('creatine')) ||
    products[1] ||
    products[0];

  const preWorkoutProduct =
    products.find((p) => (p.category || '').toLowerCase().includes('pre')) ||
    products[2] ||
    products[0];

  const showcaseProducts = [
    { label: 'Whey Protein', product: wheyProduct },
    { label: 'Creatine', product: creatineProduct },
    { label: 'Pre-Workout', product: preWorkoutProduct },
  ].filter((item) => Boolean(item.product));

  const [activeIdx, setActiveIdx] = useState(0);
  const activeProduct = showcaseProducts[activeIdx]?.product || products[0];

  const scrollToGoal = () => {
    const el = document.getElementById('shop-by-goal');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    else navigate('goal', { goalSlug: 'build-muscle' });
  };

  return (
    <section className="relative bg-zinc-950 text-white overflow-hidden py-12 lg:py-20 border-b border-zinc-900 select-none">
      {/* Subtle ambient lighting */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-red-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* LEFT: Headline & Value Proposition (7 cols) */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-red-600/20 text-red-400 border border-red-500/30 text-[11px] font-mono font-bold px-3 py-1 rounded-full uppercase tracking-wider backdrop-blur-sm">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>100% AUTHENTIC SPORTS NUTRITION</span>
            </div>

            <h1 className="font-heading font-black text-4xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-[1.08] uppercase text-balance">
              FUEL YOUR TRAINING.{' '}
              <span className="text-red-500 drop-shadow-md block sm:inline">
                BUILD YOUR BEST.
              </span>
            </h1>

            <p className="text-sm sm:text-base lg:text-lg text-zinc-300 font-medium leading-relaxed max-w-xl mx-auto lg:mx-0 text-balance">
              Authentic sports nutrition products designed to support training, performance, recovery and fitness goals. Direct importer batch verification on every unit.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3.5 pt-2">
              <button
                onClick={() => navigate('shop')}
                className="bg-red-600 hover:bg-red-700 active:scale-95 text-white font-bold text-xs sm:text-sm uppercase tracking-wider py-4 px-8 rounded-xl shadow-xl shadow-red-600/30 transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>SHOP PRODUCTS</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={scrollToGoal}
                className="bg-white/10 hover:bg-white/15 active:scale-95 text-white font-bold text-xs sm:text-sm uppercase tracking-wider py-4 px-8 rounded-xl backdrop-blur-md border border-white/20 transition-all cursor-pointer"
              >
                FIND YOUR GOAL
              </button>
            </div>

            {/* Trust Proof Micro-Strip */}
            <div className="pt-6 border-t border-zinc-800/80 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-zinc-400">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-red-500" />
                <span className="font-medium">Direct Authorized Importers (GMC, Glanbia, Bright)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-medium">Pan-India Express Dispatch with Live Tracking</span>
              </div>
            </div>
          </div>

          {/* RIGHT: Realistic High-Quality Fitness Visual & Real Supplement Highlight (5 cols) */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden border border-zinc-800 shadow-2xl bg-zinc-900 group">
              <img
                src={heroVisual}
                alt="Athletic training and sports nutrition"
                className="w-full h-[400px] sm:h-[480px] object-cover object-center group-hover:scale-103 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />

              {/* Real Product Showcase Tabs at Top of Visual */}
              <div className="absolute top-4 left-4 right-4 flex items-center justify-center gap-1.5 z-20 bg-black/60 backdrop-blur-md p-1 rounded-xl border border-white/10">
                {showcaseProducts.map((sp, idx) => (
                  <button
                    key={sp.label}
                    onClick={() => setActiveIdx(idx)}
                    className={`text-[11px] font-bold py-1.5 px-3 rounded-lg transition-all cursor-pointer ${
                      activeIdx === idx
                        ? 'bg-red-600 text-white shadow-sm'
                        : 'text-zinc-300 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {sp.label}
                  </button>
                ))}
              </div>

              {/* Real Floating Product Card with Actual Product Data & Image */}
              {activeProduct && (
                <div
                  onClick={() => navigate('product', { productId: activeProduct.id })}
                  className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-xl text-zinc-900 flex items-center justify-between gap-3 cursor-pointer hover:bg-white transition-all hover:scale-[1.02] z-20"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-xl bg-zinc-50 border border-zinc-200 p-1 shrink-0 flex items-center justify-center">
                      <img
                        src={activeProduct.images?.[0] || ''}
                        alt={activeProduct.name}
                        className="w-full h-full object-contain"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div>
                      <div className="text-[10px] font-bold uppercase text-red-600 font-mono tracking-wider">
                        {activeProduct.brand} · 100% GENUINE
                      </div>
                      <div className="font-heading font-black text-xs sm:text-sm text-zinc-900 line-clamp-1">
                        {activeProduct.name}
                      </div>
                      <div className="flex items-center gap-2 text-xs mt-0.5">
                        <span className="font-mono font-black text-zinc-900">
                          {formatCurrency(activeProduct.price)}
                        </span>
                        {activeProduct.discount > 0 && (
                          <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.2 rounded">
                            {activeProduct.discount}% OFF
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-xl shrink-0">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
