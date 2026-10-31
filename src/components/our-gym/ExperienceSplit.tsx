import React, { useState, useEffect, useRef } from 'react';
import facilityStretchingZone from "../../assets/images/facility_stretching_zone_1791208347610.jpg";
import { Dumbbell, Clock, ShieldCheck, Activity, Award } from 'lucide-react';

export const ExperienceSplit: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section
      ref={sectionRef}
      className="py-16 sm:py-20 lg:py-24 bg-(--brand-bg) border-b border-(--brand-border) overflow-hidden transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* LEFT: Typography & Gym Pillars (col-span-6) */}
          <div className="lg:col-span-6 space-y-7 text-left">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-6 h-0.5 bg-[#D91B24]" />
                <span className="text-xs uppercase font-heading font-semibold tracking-widest text-[#D91B24]">
                  ELEVATED FITNESS EXPERIENCE
                </span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-neutral-900 dark:text-white font-heading leading-tight">
                YOUR WORKOUT. <br />
                YOUR DISCIPLINE. <br />
                <span className="text-[#D91B24]">YOUR NEXT LEVEL.</span>
              </h2>

              <p className="text-neutral-600 dark:text-neutral-300 text-sm sm:text-base leading-relaxed font-normal pt-1">
                A serious fitness routine requires an environment free from distractions.
                At Next Level Fitness, every zone is engineered for focused execution, biomechanical
                safety, and consistent physical progression.
              </p>
            </div>

            {/* 4 Performance Metric Cards - Refined typography & alignment */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              
              {/* Stat 1: Hypertrophy */}
              <div className="card-theme p-5 rounded-2xl flex flex-col justify-between">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-heading text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white tabular-nums tracking-tight">
                      100%
                    </span>
                    <span className="text-xs uppercase font-heading font-semibold tracking-wider text-red-600 dark:text-red-400 block mt-1">
                      HYPERTROPHY FOCUS
                    </span>
                  </div>
                  <div className="w-8 h-8 rounded-lg bg-red-50 dark:bg-red-950/50 text-[#D91B24] flex items-center justify-center shrink-0">
                    <Dumbbell className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 font-normal leading-relaxed mt-2.5">
                  Targeted muscle stimulation and biomechanical resistance lines.
                </p>
              </div>

              {/* Stat 2: Stations */}
              <div className="card-theme p-5 rounded-2xl flex flex-col justify-between">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-heading text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white tabular-nums tracking-tight">
                      50+
                    </span>
                    <span className="text-xs uppercase font-heading font-semibold tracking-wider text-red-600 dark:text-red-400 block mt-1">
                      WORKOUT STATIONS
                    </span>
                  </div>
                  <div className="w-8 h-8 rounded-lg bg-red-50 dark:bg-red-950/50 text-[#D91B24] flex items-center justify-center shrink-0">
                    <Activity className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 font-normal leading-relaxed mt-2.5">
                  Comprehensive free weights, power cages, and commercial cardio.
                </p>
              </div>

              {/* Stat 3: 16 HRS Daily */}
              <div className="card-theme p-5 rounded-2xl flex flex-col justify-between">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-heading text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white tabular-nums tracking-tight">
                      06 AM &ndash; 10 PM
                    </span>
                    <span className="text-xs uppercase font-heading font-semibold tracking-wider text-red-600 dark:text-red-400 block mt-1">
                      OPEN DAILY
                    </span>
                  </div>
                  <div className="w-8 h-8 rounded-lg bg-red-50 dark:bg-red-950/50 text-[#D91B24] flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 font-normal leading-relaxed mt-2.5">
                  Open 7 days a week from early morning to late evening sessions.
                </p>
              </div>

              {/* Stat 4: Form Guidance */}
              <div className="card-theme p-5 rounded-2xl flex flex-col justify-between">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-heading text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white tracking-tight">
                      PRO COACHING
                    </span>
                    <span className="text-xs uppercase font-heading font-semibold tracking-wider text-red-600 dark:text-red-400 block mt-1">
                      FORM CORRECTION
                    </span>
                  </div>
                  <div className="w-8 h-8 rounded-lg bg-red-50 dark:bg-red-950/50 text-[#D91B24] flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 font-normal leading-relaxed mt-2.5">
                  Biomechanical safety, proper posture, and injury prevention on every set.
                </p>
              </div>

            </div>

          </div>

          {/* RIGHT: Large Premium Gym Image (col-span-6) */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-2xl overflow-hidden shadow-xl border-4 border-white dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900 aspect-4/3 sm:aspect-16/11 group card-theme">
              <img
                src={facilityStretchingZone}
                alt="Next Level Fitness facility floor"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

              {/* Overlay card */}
              <div className="absolute bottom-5 left-5 right-5 sm:right-auto sm:max-w-sm bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md p-4 rounded-xl border border-neutral-200 dark:border-neutral-700 shadow-md text-left">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#D91B24] text-white flex items-center justify-center shrink-0">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold text-neutral-900 dark:text-white font-heading tracking-wide uppercase">
                      STANDARDS OF EXCELLENCE
                    </h3>
                    <p className="text-[11px] text-neutral-600 dark:text-neutral-400 leading-tight mt-0.5 font-normal">
                      Biomechanical equipment, attentive coaches & daily sanitation
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Subtle red accent outline offset */}
            <div className="absolute -bottom-3 -right-3 w-40 h-40 border-b-2 border-r-2 border-[#D91B24] rounded-br-2xl pointer-events-none" />
          </div>

        </div>
      </div>
    </section>
  );
};
