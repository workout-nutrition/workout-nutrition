import React from 'react';
import { useStore } from '../../context/StoreContext';
import { ArrowRight, MapPin, Dumbbell } from 'lucide-react';

export const NextLevelGymSection: React.FC = () => {
  const { navigate } = useStore();

  return (
    <section className="bg-zinc-950 py-10 sm:py-14 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-2xl overflow-hidden min-h-[320px] sm:min-h-[360px] flex items-center shadow-xl border border-zinc-800/80">
          <img
            src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1800&q=85"
            alt="Next Level Fitness gym"
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/80 to-black/30" />

          <div className="relative z-10 max-w-2xl p-6 sm:p-10 lg:p-12 space-y-3.5">
            <span className="inline-flex items-center gap-1.5 text-red-500 text-xs font-bold uppercase tracking-wider bg-red-950/40 px-3 py-1 rounded-full border border-red-800/40">
              <Dumbbell className="w-3.5 h-3.5" />
              More Than A Workout
            </span>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase tracking-tight text-white leading-tight">
              MEET <span className="text-red-600">NEXT LEVEL</span> FITNESS
            </h2>

            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed max-w-lg">
              Discover Next Level Fitness, where your fitness journey meets motivation,
              strength and consistency. Explore our gym, elite equipment, and certified coaches.
            </p>

            <div className="flex items-center gap-2 text-xs text-zinc-400 pt-0.5">
              <MapPin className="w-4 h-4 shrink-0 text-red-500" />
              <span>Sector 119, Balongi, Mohali, Punjab</span>
            </div>

            <div className="pt-2">
              <button
                onClick={() => navigate('our-gym')}
                className="inline-flex items-center gap-2 rounded-xl bg-red-600 hover:bg-red-700 active:scale-98 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-md shadow-red-600/30 transition-all cursor-pointer"
              >
                <span>Explore Our Gym</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
