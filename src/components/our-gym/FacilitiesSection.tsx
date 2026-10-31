import React from 'react';
import facilityWeightsZone from "../../assets/images/facility_weights_zone_1791208282025.jpg";
import { Dumbbell, Activity, ShieldCheck, Sparkles, LayoutGrid, CheckCircle } from 'lucide-react';

export const FacilitiesSection: React.FC = () => {
  const verifiedFacilities = [
    {
      title: 'STRENGTH EQUIPMENT',
      tag: 'HEAVY COMPOUND & MACHINES',
      description: 'Olympic barbells, power cages, plate-loaded machines, and cable crossover systems.',
      icon: Dumbbell,
      items: ['Olympic Barbell Racks', 'Plate-Loaded Stations', 'Adjustable Benches'],
    },
    {
      title: 'CARDIO EQUIPMENT',
      tag: 'STAMINA & ENDURANCE',
      description: 'Commercial-grade treadmills, stationary exercise bikes, and elliptical trainers.',
      icon: Activity,
      items: ['Commercial Treadmills', 'Indoor Exercise Bikes', 'Elliptical Trainers'],
    },
    {
      title: 'WORKOUT AREA',
      tag: 'SPACIOUS FLOORING',
      description: 'Generous floor space with shock-absorbing rubber mats for heavy deadlifts and clean movements.',
      icon: LayoutGrid,
      items: ['Rubberized Impact Flooring', 'Uncongested Lifting Bays', 'Full-Length Mirrors'],
    },
    {
      title: 'TRAINING SPACE',
      tag: 'FUNCTIONAL & MOBILITY',
      description: 'Dedicated functional training floor for agility drills, core conditioning, and stretching routines.',
      icon: Dumbbell,
      items: ['Kettlebell Stations', 'Agility & Core Space', 'Stretching Mats'],
    },
    {
      title: 'FITNESS EQUIPMENT',
      tag: 'EXPANSIVE FREE WEIGHTS',
      description: 'Complete dumbbell racks with paired increments, resistance bands, and targeted accessories.',
      icon: Dumbbell,
      items: ['Complete Dumbbell Racks', 'Targeted Resistance Accessories', 'Standard Weight Plates'],
    },
    {
      title: 'CLEAN ENVIRONMENT',
      tag: 'DAILY SANITIZED & FRESH',
      description: 'Meticulously cleaned equipment, climate control, and fresh air circulation for healthy training.',
      icon: Sparkles,
      items: ['Scheduled Daily Sanitization', 'Air Circulation & Fans', 'Filtered Drinking Water'],
    },
  ];

  return (
    <section id="facilities" className="py-20 lg:py-28 bg-(--brand-surface) border-b border-(--brand-border) transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
          <div className="inline-flex items-center gap-2">
            <span className="w-6 h-0.5 bg-[#D91B24]" />
            <span className="text-xs uppercase font-heading font-semibold tracking-wider text-[#D91B24]">
              GYM INFRASTRUCTURE
            </span>
            <span className="w-6 h-0.5 bg-[#D91B24]" />
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-neutral-950 dark:text-white font-heading">
            BUILT FOR BETTER WORKOUTS.
          </h2>
          <p className="text-neutral-600 dark:text-neutral-300 text-sm sm:text-base font-normal">
            Every square foot is planned around biomechanical flow, quality maintenance, and genuine lifting results.
          </p>
        </div>

        {/* Feature Showcase Grid with Perfect Height Alignment */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch mb-12">
          
          {/* Marquee Facility Image (col-span-5) - Stretches flush with the 6 cards */}
          <div className="lg:col-span-5 flex flex-col h-full relative">
            <div className="relative rounded-2xl overflow-hidden shadow-xl border-4 border-white dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900 h-full min-h-[420px] lg:min-h-full group card-theme flex flex-col justify-between p-6">
              {/* Full-bleed background image */}
              <img
                src={facilityWeightsZone}
                alt="Next Level Fitness weight zone equipment"
                referrerPolicy="no-referrer"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-104 transition-transform duration-700 ease-out"
              />

              {/* Gradient scrims for text legibility */}
              <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/30 to-black/60 pointer-events-none" />

              {/* Top info badge */}
              <div className="relative z-10 flex items-center justify-between">
                <span className="text-[11px] uppercase tracking-wider font-heading bg-[#D91B24] text-white px-3 py-1 rounded-md font-semibold shadow-sm">
                  VERIFIED LIFTING PREMISES
                </span>
                <span className="text-[10px] uppercase tracking-wider font-heading font-semibold text-white/90 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-md border border-white/20">
                  OLYMPIC GRADE
                </span>
              </div>

              {/* Bottom detail card */}
              <div className="relative z-10 space-y-2 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md p-5 rounded-xl border border-neutral-200/90 dark:border-neutral-700 shadow-xl text-left">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#D91B24] animate-pulse" />
                  <span className="text-[11px] uppercase font-semibold tracking-wider text-[#D91B24] font-heading">
                    UNCONGESTED WORKOUT FLOW
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-semibold font-heading text-neutral-900 dark:text-white leading-snug">
                  High-Caliber Training Floor & Compound Bays
                </h3>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  Engineered with shock-absorbing vulcanized rubber flooring, calibrated dumbbells, and precision barbell racks for serious performance.
                </p>
              </div>
            </div>
          </div>

          {/* 6 Clean Facility Spec Blocks (col-span-7) */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4 h-full">
            {verifiedFacilities.map((fac, idx) => {
              const Icon = fac.icon;
              return (
                <div
                  key={idx}
                  className="card-theme p-5 rounded-2xl text-left flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-semibold tracking-wider text-[#D91B24] font-heading">
                        {fac.tag}
                      </span>
                      <Icon className="w-4 h-4 text-neutral-400" />
                    </div>
                    <h3 className="font-heading text-base font-semibold text-neutral-900 dark:text-white tracking-wide">
                      {fac.title}
                    </h3>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed font-normal">
                      {fac.description}
                    </p>
                  </div>

                  <div className="pt-3 mt-3 border-t border-neutral-100 dark:border-neutral-800 space-y-1">
                    {fac.items.map((it, i) => (
                      <div key={i} className="flex items-center gap-1.5 text-[11px] text-neutral-500 dark:text-neutral-400 font-medium">
                        <CheckCircle className="w-3 h-3 text-[#D91B24] shrink-0" />
                        <span>{it}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
};
