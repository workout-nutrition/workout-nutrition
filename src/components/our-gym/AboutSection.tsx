import React from 'react';
import { ArrowRight, CheckCircle2, Shield, Users, Activity } from 'lucide-react';
import aboutGymInterior from "../../assets/images/about_gym_interior_1791208222000.jpg";

interface AboutSectionProps {
  onDiscoverClick: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ onDiscoverClick }) => {
  return (
    <section id="about" className="py-20 lg:py-28 bg-(--brand-surface) border-b border-(--brand-border) transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* LEFT: Large Gym Interior Image (col-span-6) */}
          <div className="lg:col-span-6 order-2 lg:order-1 relative">
            <div className="relative rounded-2xl overflow-hidden shadow-xl border-4 border-white dark:border-neutral-800 aspect-4/3 bg-neutral-200 dark:bg-neutral-800 group card-theme">
              <img
               src={aboutGymInterior}
                alt="Next Level Fitness spacious interior and modern machines"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center group-hover:scale-102 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
              
              {/* Bottom tag */}
              <div className="absolute bottom-5 left-5 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 shadow-md">
                <span className="text-xs font-bold text-neutral-900 dark:text-white font-heading block">
                  BIOMECHANICAL EXCELLENCE
                </span>
                <span className="text-[11px] text-neutral-500 dark:text-neutral-400">
                  Fully equipped strength stations & daily sanitized workout bays
                </span>
              </div>
            </div>

            {/* Subtle offset accent border */}
            <div className="absolute -top-3 -left-3 w-32 h-32 border-t-2 border-l-2 border-[#D91B24] rounded-tl-2xl pointer-events-none" />
          </div>

          {/* RIGHT: Editorial Content (col-span-6) */}
          <div className="lg:col-span-6 order-1 lg:order-2 space-y-6 text-left">
            
            {/* Small Label */}
            <div className="flex items-center gap-2">
              <span className="w-6 h-0.5 bg-[#D91B24]" />
              <span className="text-xs uppercase font-heading font-semibold tracking-widest text-[#D91B24]">
                WELCOME TO NEXT LEVEL
              </span>
            </div>

            {/* Large Heading */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-neutral-900 dark:text-white font-heading leading-tight">
              MORE THAN A GYM. <br />
              <span className="text-neutral-500 dark:text-neutral-400 font-normal">IT'S YOUR NEXT LEVEL.</span>
            </h2>

            {/* Natural Gym-Relatable Content (No address in text) */}
            <div className="space-y-4 text-neutral-600 dark:text-neutral-300 text-sm sm:text-base leading-relaxed font-normal">
              <p>
                Next Level Fitness is a premier fitness destination built for athletes, beginners,
                and everyday lifters who want to become stronger, leaner, and more disciplined.
              </p>
              <p>
                With advanced resistance equipment, dedicated power racks, expansive cardio suites,
                and knowledgeable trainer guidance, our facility provides a motivating environment
                designed to turn hard work into sustainable physical transformation.
              </p>
            </div>

            {/* Key Value Points (Clean unboxed format) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#D91B24] shrink-0 mt-0.5" />
                <span className="text-xs sm:text-sm font-medium text-neutral-800 dark:text-neutral-200">
                  Calibrated Olympic Barbells
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#D91B24] shrink-0 mt-0.5" />
                <span className="text-xs sm:text-sm font-medium text-neutral-800 dark:text-neutral-200">
                  Targeted Hypertrophy Machines
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#D91B24] shrink-0 mt-0.5" />
                <span className="text-xs sm:text-sm font-medium text-neutral-800 dark:text-neutral-200">
                  Form Correction & Coaching
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#D91B24] shrink-0 mt-0.5" />
                <span className="text-xs sm:text-sm font-medium text-neutral-800 dark:text-neutral-200">
                  Supportive Fitness Culture
                </span>
              </div>
            </div>

            {/* CTA */}
            <div className="pt-3">
              <button
                onClick={onDiscoverClick}
                className="group inline-flex items-center gap-2 font-heading text-xs uppercase tracking-wider font-semibold text-neutral-900 dark:text-white hover:text-[#D91B24] dark:hover:text-[#E11D2A] border-b-2 border-neutral-900 dark:border-white hover:border-[#D91B24] dark:hover:border-[#E11D2A] pb-1 transition-all cursor-pointer"
              >
                <span>DISCOVER NEXT LEVEL</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
              </button>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
