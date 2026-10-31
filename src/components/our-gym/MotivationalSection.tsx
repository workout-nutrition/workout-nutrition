import React from 'react';
import ctaDisciplineLifter from "../../assets/images/cta_discipline_lifter_1791208304162.jpg";
import { ArrowRight, Flame } from 'lucide-react';

interface MotivationalSectionProps {
  onJoinClick: () => void;
}

export const MotivationalSection: React.FC<MotivationalSectionProps> = ({ onJoinClick }) => {
  return (
    <section className="py-20 lg:py-28 bg-(--brand-bg) border-b border-(--brand-border) overflow-hidden transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Editorial Big Typography (col-span-6) */}
          <div className="lg:col-span-6 space-y-6 text-left">
            <div className="flex items-center gap-2">
              <span className="w-6 h-0.5 bg-[#D91B24]" />
              <span className="text-xs uppercase font-heading font-bold tracking-widest text-[#D91B24]">
                PHILOSOPHY & MINDSET
              </span>
            </div>

            <h2 className="text-5xl sm:text-6xl xl:text-7xl font-bold tracking-tight text-neutral-950 dark:text-white font-heading leading-none">
              DISCIPLINE <br />
              <span className="text-[#D91B24]">BUILDS</span> <br />
              RESULTS.
            </h2>

            <div className="space-y-2 text-neutral-600 dark:text-neutral-300 text-lg sm:text-xl font-medium border-l-2 border-neutral-200 dark:border-neutral-700 pl-4">
              <p>Every workout counts.</p>
              <p>Every rep matters.</p>
              <p>Every day is another opportunity to improve.</p>
            </div>

            <p className="text-neutral-500 dark:text-neutral-400 text-sm leading-relaxed max-w-md pt-2">
              Motivation gets you started. Habit and disciplined consistency in the right
              gym environment keep you going long after enthusiasm fades.
            </p>

            <div className="pt-4">
              <button
                onClick={onJoinClick}
                className="group inline-flex items-center gap-2.5 font-heading text-xs uppercase tracking-wider font-bold text-white bg-neutral-900 dark:bg-neutral-800 hover:bg-[#D91B24] dark:hover:bg-[#E11D2A] px-7 py-3.5 rounded-lg shadow-sm transition-colors cursor-pointer"
              >
                <span>START YOUR JOURNEY TODAY</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Bright Fitness Image (col-span-6) */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900 aspect-16/11 group card-theme">
              <img
               src={ctaDisciplineLifter}
                alt="Next Level Fitness discipline lifter"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent pointer-events-none" />

              <div className="absolute bottom-5 left-5 right-5 text-white">
                <span className="text-[10px] uppercase font-heading font-bold tracking-widest text-[#D91B24] bg-white px-2 py-0.5 rounded-sm">
                  NEXT LEVEL MINDSET
                </span>
                <p className="text-sm font-bold font-heading mt-1">
                  Consistency Beats Intensity Every Time
                </p>
              </div>
            </div>

            {/* Offset frame decoration */}
            <div className="absolute -bottom-3 -right-3 w-48 h-48 border-b-2 border-r-2 border-[#D91B24] rounded-br-2xl pointer-events-none" />
          </div>

        </div>
      </div>
    </section>
  );
};
