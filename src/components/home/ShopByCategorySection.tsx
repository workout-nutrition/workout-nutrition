import React from 'react';
import { useStore } from '../../context/StoreContext';
import { ArrowRight, Layers } from 'lucide-react';

export const ShopByCategorySection: React.FC = () => {
  const { navigate } = useStore();

  const categories = [
    {
      id: 'protein',
      name: 'PROTEIN',
      slug: 'whey-protein',
      tagline: 'Whey, Isolate & Blends',
      image: 'https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 'creatine',
      name: 'CREATINE',
      slug: 'creatine',
      tagline: 'Monohydrate & Creapure',
      image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 'pre-workout',
      name: 'PRE-WORKOUT',
      slug: 'pre-workouts',
      tagline: 'High-Stim & Pump Formulas',
      image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 'mass-gainer',
      name: 'MASS GAINER',
      slug: 'mass-gainer',
      tagline: 'High Calorie & Lean Mass',
      image: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 'fish-oil',
      name: 'FISH OIL',
      slug: 'fish-oil',
      tagline: 'Triple Strength Omega-3',
      image: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 'multivitamins',
      name: 'MULTIVITAMINS',
      slug: 'multivitamin',
      tagline: 'Daily Athlete Micronutrients',
      image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 'bcaa-eaa',
      name: 'BCAA / EAA',
      slug: 'bcaa',
      tagline: 'Intra-Workout Aminos',
      image: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 'wellness',
      name: 'WELLNESS',
      slug: 'fat-burner',
      tagline: 'Fat Burners & Vitality',
      image: 'https://images.unsplash.com/photo-1505576399279-565b52d4ac71?auto=format&fit=crop&w=600&q=80',
    },
  ];

  return (
    <section className="py-14 bg-white border-b border-zinc-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-red-600 uppercase tracking-widest mb-1.5 font-mono">
              <Layers className="w-4 h-4" />
              <span>PRODUCT CATEGORIES</span>
            </div>
            <h2 className="font-display font-normal text-3xl sm:text-4xl lg:text-5xl text-zinc-950 uppercase tracking-wide">
              EXPLORE BY SUPPLEMENT CATEGORY
            </h2>
            <p className="font-body text-xs sm:text-sm text-zinc-600 font-normal mt-1 leading-relaxed">
              Clinically formulated nutrition departments tailored for muscle hypertrophy, ATP power, and recovery.
            </p>
          </div>

          <button
            onClick={() => navigate('shop')}
            className="text-xs font-semibold uppercase tracking-wider text-red-600 hover:text-red-700 flex items-center gap-1 cursor-pointer self-start sm:self-auto"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 8 Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-5">
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => navigate('category', { categorySlug: cat.slug })}
              className="group bg-zinc-50 hover:bg-white rounded-2xl border border-zinc-200/80 hover:border-red-600/50 p-4 transition-all duration-300 card-hover hover:shadow-xl cursor-pointer flex flex-col justify-between select-none"
            >
              <div>
                <div className="w-full aspect-square rounded-xl overflow-hidden bg-zinc-100 mb-3.5 relative">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 ease-out"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&w=600&q=80';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>

                <h3 className="font-heading font-bold text-sm sm:text-base text-zinc-950 group-hover:text-red-600 transition-colors uppercase tracking-tight">
                  {cat.name}
                </h3>
                <p className="text-[11px] text-zinc-500 mt-0.5 truncate">
                  {cat.tagline}
                </p>
              </div>

              <div className="pt-3 mt-3 border-t border-zinc-200/60 flex items-center justify-between text-[11px] font-bold text-zinc-700 group-hover:text-red-600 transition-colors">
                <span>Browse Products</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
