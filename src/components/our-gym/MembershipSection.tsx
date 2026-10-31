import React from 'react';
import { MembershipPlan } from './types';
import { Check, Phone, MessageSquare, ArrowRight, ShieldCheck } from 'lucide-react';

interface MembershipSectionProps {
  onEnquirePlan: (planTitle: string) => void;
  onCallClick?: () => void;
}

export const membershipPlans: MembershipPlan[] = [
  {
    id: 'starter',
    title: 'STARTER',
    subtitle: 'Foundation Routine',
    description: 'For members beginning their fitness journey.',
    features: [
      'Gym Access',
      'Strength & Cardio Training',
      'Basic Workout Guidance',
      'Access During Gym Hours (06 AM – 10 PM)',
      'Locker & Changing Area Access',
    ],
    recommended: false,
  },
  {
    id: 'fitness',
    title: 'FITNESS',
    badge: 'MOST POPULAR',
    subtitle: 'Consistent Conditioning',
    description: 'For regular fitness-focused members.',
    features: [
      'Full Gym Access',
      'Strength & Cardio Training',
      'Trainer Guidance',
      'Fitness Support',
      'Motivating Workout Environment',
      'Access 7 Days a Week',
    ],
    recommended: true,
  },
  {
    id: 'next-level',
    title: 'NEXT LEVEL',
    badge: 'ADVANCED SUPPORT',
    subtitle: 'Maximum Commitment',
    description: 'For members looking for more focused support.',
    features: [
      'All Gym Floor Access',
      'Training Guidance',
      'Personalized Support',
      'Strength & Cardio Training',
      'Fitness Goal Assistance',
      'Technique & Progression Reviews',
    ],
    recommended: false,
  },
];

export const MembershipSection: React.FC<MembershipSectionProps> = ({ onEnquirePlan }) => {
  return (
    <section id="membership" className="py-20 lg:py-28 bg-(--brand-bg) border-b border-(--brand-border) transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
          <div className="inline-flex items-center gap-2">
            <span className="w-6 h-0.5 bg-[#D91B24]" />
            <span className="text-xs uppercase font-heading font-semibold tracking-wider text-[#D91B24]">
              MEMBERSHIP TIERS
            </span>
            <span className="w-6 h-0.5 bg-[#D91B24]" />
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-neutral-950 dark:text-white font-heading">
            CHOOSE YOUR MEMBERSHIP
          </h2>
          <p className="text-neutral-600 dark:text-neutral-300 text-sm sm:text-base font-normal">
            Transparent, accessible fitness options designed to help you stay consistent and hit your physical targets.
          </p>
        </div>

        {/* 3 Tier Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch mb-12">
          {membershipPlans.map((plan) => (
            <div
              key={plan.id}
              className={`relative rounded-2xl p-8 flex flex-col justify-between transition-all duration-300 text-left ${
                plan.recommended
                  ? 'bg-neutral-900 dark:bg-black text-white shadow-2xl ring-2 ring-[#D91B24] lg:-translate-y-2'
                  : 'card-theme'
              }`}
            >
              {/* Top Badge */}
              {plan.badge && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#D91B24] text-white text-[10px] font-heading font-semibold uppercase tracking-wider px-3.5 py-1 rounded-full shadow-md whitespace-nowrap">
                  {plan.badge}
                </div>
              )}

              <div className="space-y-6">
                {/* Plan Header */}
                <div className="space-y-1">
                  <span
                    className="text-xs uppercase font-heading tracking-wider font-semibold text-[#D91B24]"
                  >
                    {plan.subtitle}
                  </span>
                  <h3
                    className={`font-heading text-2xl sm:text-3xl font-semibold ${
                      plan.recommended ? 'text-white' : 'text-neutral-900 dark:text-white'
                    }`}
                  >
                    {plan.title}
                  </h3>
                  <p
                    className={`text-xs leading-relaxed ${
                      plan.recommended ? 'text-neutral-300' : 'text-neutral-600 dark:text-neutral-400'
                    }`}
                  >
                    {plan.description}
                  </p>
                </div>

                {/* Pricing Placeholder Note */}
                <div
                  className={`p-3.5 rounded-xl border text-xs ${
                    plan.recommended
                      ? 'bg-neutral-800/80 dark:bg-neutral-900 border-neutral-700 text-neutral-300'
                      : 'bg-neutral-50 dark:bg-neutral-800/50 border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300'
                  }`}
                >
                  <span className="font-semibold text-xs block font-heading tracking-wide uppercase">
                    Affordable Monthly & Quarterly Packages
                  </span>
                  <span className="text-[11px] opacity-80">
                    Contact our desk for customized duration & seasonal specials
                  </span>
                </div>

                {/* Features List */}
                <div className="space-y-3 pt-2">
                  <span
                    className={`text-[11px] uppercase font-semibold tracking-wider font-heading block ${
                      plan.recommended ? 'text-neutral-400' : 'text-neutral-500 dark:text-neutral-400'
                    }`}
                  >
                    What's Included:
                  </span>
                  <ul className="space-y-2.5">
                    {plan.features.map((feat, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-xs">
                        <Check
                          className="w-4 h-4 shrink-0 mt-0.5 text-[#D91B24]"
                        />
                        <span className={plan.recommended ? 'text-neutral-200' : 'text-neutral-700 dark:text-neutral-300'}>
                          {feat}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-8 mt-6 border-t border-neutral-200/50 dark:border-neutral-800">
                <button
                  onClick={() => onEnquirePlan(plan.title)}
                  className={`w-full py-3.5 px-4 rounded-xl font-heading text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 ${
                    plan.recommended
                      ? 'bg-[#D91B24] hover:bg-[#B8141D] text-white shadow-md'
                      : 'bg-neutral-900 dark:bg-neutral-800 hover:bg-neutral-800 dark:hover:bg-neutral-700 text-white shadow-xs'
                  }`}
                >
                  <span>ENQUIRE NOW</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          ))}
        </div>

        {/* Bottom Contact Inquiry Bar */}
        <div className="card-theme rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 text-left">
          <div className="space-y-1">
            <h4 className="font-heading text-lg sm:text-xl font-semibold text-neutral-900 dark:text-white">
              LOOKING FOR EXACT MEMBERSHIP PRICING?
            </h4>
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 font-normal">
              Speak directly with our gym front desk for current packages, admission offers, and flexible duration.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <a
              href="tel:+918264325436"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white text-xs font-heading font-semibold uppercase tracking-wider hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-[#D91B24]" />
              <span>CALL: +91-8264325436</span>
            </a>

            <button
              onClick={() => onEnquirePlan('General Membership')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#D91B24] text-white text-xs font-heading font-semibold uppercase tracking-wider hover:bg-[#B8141D] transition-colors cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>SEND AN ENQUIRY</span>
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};
