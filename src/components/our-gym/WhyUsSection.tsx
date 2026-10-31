import React from 'react';
import { Dumbbell, Flame, Compass, Users2, Sparkles, Target } from 'lucide-react';

export const WhyUsSection: React.FC = () => {
  const reasons = [
    {
      number: '01',
      title: 'MODERN EQUIPMENT',
      description: 'Train with a wide range of modern and well-maintained workout equipment.',
      icon: Dumbbell,
    },
    {
      number: '02',
      title: 'STRENGTH & CARDIO',
      description: 'Build strength, improve endurance and create a balanced training routine.',
      icon: Flame,
    },
    {
      number: '03',
      title: 'EXPERIENCED GUIDANCE',
      description: 'Get support and workout guidance from knowledgeable trainers.',
      icon: Compass,
    },
    {
      number: '04',
      title: 'MOTIVATING ENVIRONMENT',
      description: 'Train in a positive atmosphere surrounded by a supportive fitness community.',
      icon: Users2,
    },
    {
      number: '05',
      title: 'CLEAN & COMFORTABLE',
      description: 'A clean and comfortable environment designed to make your workouts better.',
      icon: Sparkles,
    },
    {
      number: '06',
      title: 'FITNESS FOR EVERY LEVEL',
      description: "Whether you're starting out or already training regularly, build your routine at your own pace.",
      icon: Target,
    },
  ];

  return (
    <section className="py-20 lg:py-28 bg-(--brand-bg) border-b border-(--brand-border) transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
          <div className="inline-flex items-center gap-2">
            <span className="w-6 h-0.5 bg-[#D91B24]" />
            <span className="text-xs uppercase font-heading font-semibold tracking-widest text-[#D91B24]">
              THE NEXT LEVEL DIFFERENCE
            </span>
            <span className="w-6 h-0.5 bg-[#D91B24]" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900 dark:text-white font-heading">
            WHY TRAIN AT NEXT LEVEL?
          </h2>
          <p className="text-neutral-600 dark:text-neutral-300 text-sm sm:text-base font-normal">
            Everything you need to stay disciplined, make continuous progress, and enjoy your daily workout.
          </p>
        </div>

        {/* 6 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
          {reasons.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.number}
                className="group relative card-theme rounded-2xl p-7 text-left flex flex-col justify-between"
              >
                {/* Top: Number & Icon */}
                <div className="flex items-center justify-between mb-5">
                  <span className="font-heading text-xl font-semibold text-neutral-300 dark:text-neutral-600 group-hover:text-[#D91B24] transition-colors tabular-nums">
                    {item.number}
                  </span>
                  <div className="w-9 h-9 rounded-xl bg-neutral-100 dark:bg-neutral-800 group-hover:bg-[#D91B24]/10 text-neutral-700 dark:text-neutral-300 group-hover:text-[#D91B24] border border-neutral-200 dark:border-neutral-700 flex items-center justify-center transition-colors">
                    <Icon className="w-4 h-4" />
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-2">
                  <h3 className="font-heading text-base sm:text-lg font-semibold text-neutral-900 dark:text-white tracking-wide">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed font-normal">
                    {item.description}
                  </p>
                </div>

                {/* Subtle bottom indicator */}
                <div className="w-0 group-hover:w-full h-0.5 bg-[#D91B24] mt-6 transition-all duration-300" />
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
