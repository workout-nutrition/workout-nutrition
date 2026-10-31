import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
}

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs: FaqItem[] = [
    {
      question: 'What are the operating hours of Next Level Fitness?',
      answer: 'Next Level Fitness is open daily from 06:00 AM to 10:00 PM, 7 days a week. You can train early in the morning before your daily schedule or in the evening according to your routine.',
    },
    {
      question: 'Where can I find the gym and parking facilities?',
      answer: 'We are situated in Sector 119, Balongi, Sahibzada Ajit Singh Nagar, Punjab 160055, with easy access, prominent road frontage, and ample space for vehicle parking.',
    },
    {
      question: 'Is trainer guidance available for beginners?',
      answer: 'Yes! Whether you are stepping into a gym for the first time or returning after a break, our trainers provide initial orientation, posture corrections, and workout guidance so you can exercise safely and build consistency.',
    },
    {
      question: 'What types of equipment do you have on the gym floor?',
      answer: 'We provide modern strength equipment (Olympic barbells, power cages, plate-loaded machines, adjustable benches, complete dumbbell racks) and commercial cardio equipment (treadmills, ellipticals, stationary bikes), alongside a functional agility and turf zone.',
    },
    {
      question: 'Can I visit for a workout floor tour before taking a membership?',
      answer: 'Absolutely. You are welcome to walk in anytime between 06:00 AM and 10:00 PM to view the workout floor, check out the machines, and speak directly with our team.',
    },
  ];

  return (
    <section className="py-20 lg:py-24 bg-(--brand-surface) border-b border-(--brand-border) transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center space-y-3 mb-14">
          <div className="inline-flex items-center gap-2">
            <span className="w-6 h-0.5 bg-[#D91B24]" />
            <span className="text-xs uppercase font-heading font-semibold tracking-wider text-[#D91B24]">
              FREQUENTLY ASKED QUESTIONS
            </span>
            <span className="w-6 h-0.5 bg-[#D91B24]" />
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-neutral-950 dark:text-white font-heading">
            COMMON QUESTIONS
          </h2>
          <p className="text-neutral-600 dark:text-neutral-300 text-sm sm:text-base font-normal">
            Answers to common questions regarding workout programs, training hours, coaching support, and gym amenities.
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-4 text-left">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="card-theme rounded-xl overflow-hidden shadow-xs transition-colors"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer focus:outline-none"
                >
                  <span className="font-heading text-base sm:text-lg font-semibold text-neutral-900 dark:text-white">
                    {faq.question}
                  </span>
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 ${
                      isOpen
                        ? 'rotate-180 bg-[#D91B24] text-white'
                        : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-6 pb-6 pt-1 text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed border-t border-neutral-100 dark:border-neutral-800 animate-in fade-in duration-150">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
