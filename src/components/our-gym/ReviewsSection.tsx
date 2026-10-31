import React, { useState, useEffect } from 'react';
import { Star, ShieldCheck, ExternalLink, Quote, ChevronLeft, ChevronRight, CheckCircle2, ThumbsUp, Sparkles, MessageSquare } from 'lucide-react';

interface ExtendedReviewItem {
  id: string;
  author: string;
  role: string;
  category: 'all' | 'coaching' | 'equipment' | 'community' | 'value';
  rating: number;
  highlight: string;
  text: string;
  date: string;
  tag: string;
  initials: string;
  color: string;
  initialHelpful: number;
}

export const reviewsData: ExtendedReviewItem[] = [
  {
    id: 'rev-1',
    author: 'Jaspreet Singh',
    role: 'Strength & Hypertrophy Athlete · 2 Years Member',
    category: 'coaching',
    rating: 5,
    highlight: 'Cooperative trainers & great compound lift guidance',
    text: 'Best place to workout. All trainers are very good and guided me for all workouts. Especially helped me correct my barbell deadlift and squat form. The environment pushes you to train harder every session.',
    date: 'Verified on Google · 2 weeks ago',
    tag: 'COACHING & FORM',
    initials: 'JS',
    color: 'from-[#D91B24] to-rose-700',
    initialHelpful: 24,
  },
  {
    id: 'rev-2',
    author: 'Rohit Sharma',
    role: 'Morning Conditioning & Cardio Member',
    category: 'value',
    rating: 5,
    highlight: 'Fits in budget with top-tier equipment',
    text: 'Good gym that fits perfectly in budget. Membership packages at reasonable rates with good staff and clean atmosphere. Commercial machines are smooth and well maintained.',
    date: 'Verified on Google · 3 weeks ago',
    tag: 'BUDGET & VALUE',
    initials: 'RS',
    color: 'from-amber-600 to-red-600',
    initialHelpful: 19,
  },
  {
    id: 'rev-3',
    author: 'Simranjit Kaur',
    role: 'Personal Training & Transformation Member',
    category: 'community',
    rating: 5,
    highlight: 'Safe, clean environment & motivating community',
    text: 'Excellent gym facilities, great atmosphere and motivating community. The coaches are very supportive for women and beginners. Lost 7kg in 3 months through consistent workout routines.',
    date: 'Verified on Google · 1 month ago',
    tag: 'COMMUNITY & RESULTS',
    initials: 'SK',
    color: 'from-rose-600 to-pink-700',
    initialHelpful: 31,
  },
  {
    id: 'rev-4',
    author: 'Harinder Gill',
    role: 'Powerlifter & Heavy Compound Lifter',
    category: 'equipment',
    rating: 5,
    highlight: 'Proper workout environment & heavy dumbells',
    text: 'Very cooperative trainers and proper workout environment. Heavy dumbbells rack with paired increments, clean rubber impact flooring, and solid power racks that handle heavy weight safely.',
    date: 'Verified on Google · 1 month ago',
    tag: 'EQUIPMENT EXCELLENCE',
    initials: 'HG',
    color: 'from-neutral-800 to-red-700',
    initialHelpful: 27,
  },
  {
    id: 'rev-5',
    author: 'Amit Kumar',
    role: 'Evening Strength Routine Member',
    category: 'coaching',
    rating: 5,
    highlight: 'Attentive trainers and encouraging vibe',
    text: 'Coaches are always on the floor ready to spot you and teach proper biomechanics. You never feel lost or intimidated even on your very first day.',
    date: 'Verified on Google · 2 months ago',
    tag: 'COACHING SUPPORT',
    initials: 'AK',
    color: 'from-red-700 to-neutral-900',
    initialHelpful: 16,
  },
  {
    id: 'rev-6',
    author: 'Vikram Verma',
    role: 'Functional & Weight Management Member',
    category: 'equipment',
    rating: 5,
    highlight: 'Spacious floor with continuous daily maintenance',
    text: 'Air circulation is great, machines are cleaned on schedule, and you never wait too long for equipment. Easily the top gym in the region.',
    date: 'Verified on Google · 2 months ago',
    tag: 'CLEAN FLOOR',
    initials: 'VV',
    color: 'from-neutral-900 to-red-600',
    initialHelpful: 22,
  },
];

export const ReviewsSection: React.FC = () => {
  const [helpfulCounts, setHelpfulCounts] = useState<{ [id: string]: number }>(() => {
    const initial: { [id: string]: number } = {};
    reviewsData.forEach(r => { initial[r.id] = r.initialHelpful; });
    return initial;
  });
  const [votedReviews, setVotedReviews] = useState<{ [id: string]: boolean }>({});

  const toggleHelpful = (id: string) => {
    if (votedReviews[id]) {
      setHelpfulCounts(prev => ({ ...prev, [id]: prev[id] - 1 }));
      setVotedReviews(prev => ({ ...prev, [id]: false }));
    } else {
      setHelpfulCounts(prev => ({ ...prev, [id]: prev[id] + 1 }));
      setVotedReviews(prev => ({ ...prev, [id]: true }));
    }
  };

  return (
    <section id="reviews" className="py-20 lg:py-28 bg-(--brand-surface) border-b border-(--brand-border) transition-colors duration-300 relative overflow-hidden">
      {/* Background athletic red light accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#D91B24]/5 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-14">
          <div className="inline-flex items-center gap-2">
            <span className="w-6 h-0.5 bg-[#D91B24]" />
            <span className="text-xs uppercase font-heading font-semibold tracking-wider text-[#D91B24]">
              VERIFIED GOOGLE REVIEWS
            </span>
            <span className="w-6 h-0.5 bg-[#D91B24]" />
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-neutral-950 dark:text-white font-heading">
            WHAT OUR MEMBERS SAY
          </h2>
          <p className="text-neutral-600 dark:text-neutral-300 text-sm sm:text-base font-normal">
            Real feedback from local lifters, athletes, and fitness enthusiasts who train at Next Level Fitness daily.
          </p>
        </div>

        {/* Premium Google Trust Banner Card */}
        <div className="max-w-5xl mx-auto mb-12 card-theme rounded-2xl p-6 sm:p-8 shadow-sm border border-neutral-200 dark:border-neutral-800 relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Google G Logo & Overall Rating (col-span-5) */}
            <div className="lg:col-span-5 flex items-center gap-5 border-b lg:border-b-0 lg:border-r border-neutral-200 dark:border-neutral-800 pb-6 lg:pb-0 lg:pr-8 text-left">
              {/* Official Google G SVG */}
              <div className="w-16 h-16 rounded-2xl bg-white dark:bg-neutral-850 p-3 shadow-md border border-neutral-200 dark:border-neutral-700 shrink-0 flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-full h-full">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3h3.88c2.27-2.09 3.66-5.17 3.66-9.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.27v3.09C3.25 21.3 7.31 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.32c-.25-.72-.38-1.49-.38-2.32s.13-1.6.38-2.32V6.59H1.27C.46 8.2.01 10.04.01 12s.45 3.8 1.26 5.41l4.01-3.09z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.25 2.7 1.27 6.59l4.01 3.09c.95-2.83 3.6-4.93 6.72-4.93z"
                  />
                </svg>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="font-heading text-4xl sm:text-5xl font-bold text-neutral-950 dark:text-white tabular-nums tracking-tight">
                    4.9
                  </span>
                  <div className="flex flex-col">
                    <div className="flex items-center text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-[#D91B24] font-heading mt-0.5">
                      EXCELLENT SCORE
                    </span>
                  </div>
                </div>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 font-medium mt-1">
                  Based on <strong>316+ verified reviews</strong> on Google Maps
                </p>
              </div>
            </div>

            {/* Rating Breakdown & Quick Highlights (col-span-7) */}
            <div className="lg:col-span-7 flex flex-col sm:flex-row items-center justify-between gap-6 text-left">
              <div className="space-y-2 w-full sm:w-auto flex-1">
                {/* 5 Stars Bar */}
                <div className="flex items-center gap-2 text-xs">
                  <span className="w-12 text-neutral-600 dark:text-neutral-300 font-medium font-heading">5 Star</span>
                  <div className="flex-1 h-2.5 rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
                    <div className="w-[96%] h-full bg-[#D91B24] rounded-full shadow-[0_0_8px_#D91B24]" />
                  </div>
                  <span className="w-9 text-right font-semibold text-neutral-800 dark:text-neutral-200 tabular-nums">96%</span>
                </div>
                {/* 4 Stars Bar */}
                <div className="flex items-center gap-2 text-xs">
                  <span className="w-12 text-neutral-600 dark:text-neutral-300 font-medium font-heading">4 Star</span>
                  <div className="flex-1 h-2.5 rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
                    <div className="w-[4%] h-full bg-neutral-400 dark:bg-neutral-600 rounded-full" />
                  </div>
                  <span className="w-9 text-right font-semibold text-neutral-800 dark:text-neutral-200 tabular-nums">4%</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap sm:flex-col gap-2 shrink-0 w-full sm:w-auto">
                <a
                  href="https://www.google.com/maps/search/Next+Level+Fitness+Balongi"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#D91B24] hover:bg-[#B8141D] text-white text-xs font-heading font-semibold uppercase tracking-wider shadow-sm hover:shadow-md transition-all cursor-pointer"
                >
                  <span>WRITE A REVIEW</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <div className="inline-flex items-center gap-1.5 text-[11px] text-neutral-600 dark:text-neutral-400 font-medium justify-center sm:justify-start">
                  <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>100% Authentic Gym Members</span>
                </div>
              </div>

            </div>

          </div>
        </div>

        {/* Continuous Smooth Auto-Scrolling Reviews Track (Sliding to Right Side) */}
        <div className="relative overflow-hidden w-full select-none py-2">
          {/* Edge fade gradient masks for smooth entry and exit */}
          <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-24 bg-linear-to-r from-(--brand-surface) to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-24 bg-linear-to-l from-(--brand-surface) to-transparent z-10 pointer-events-none" />

          {/* Marquee track moving towards the right side */}
          <div className="animate-review-scroll-right flex items-stretch gap-6">
            {[...reviewsData, ...reviewsData].map((rev, index) => (
              <div
                key={`${rev.id}-${index}`}
                className="w-[300px] sm:w-[360px] md:w-[400px] shrink-0 card-theme rounded-2xl p-6 sm:p-7 flex flex-col justify-between relative overflow-hidden group border border-neutral-200 dark:border-neutral-800 hover:border-[#D91B24] dark:hover:border-[#E11D2A] shadow-md hover:shadow-xl transition-all duration-300 text-left"
              >
                {/* Subtle athletic top accent line on hover */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-transparent via-[#D91B24] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                {/* Watermark Quote Icon in corner */}
                <Quote className="absolute -bottom-2 -right-2 w-16 h-16 text-neutral-100 dark:text-neutral-800/40 pointer-events-none group-hover:text-[#D91B24]/10 transition-colors" />

                <div className="space-y-3.5 relative z-10">
                  {/* Header row: Stars & Tag */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-amber-400">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>

                    <span className="text-[10px] font-heading font-semibold uppercase tracking-wider text-[#D91B24] bg-[#D91B24]/10 dark:bg-[#D91B24]/20 px-2 py-0.5 rounded-md">
                      {rev.tag}
                    </span>
                  </div>

                  {/* Bold Highlight Statement */}
                  <h3 className="font-heading text-base sm:text-lg font-semibold text-neutral-900 dark:text-white leading-snug group-hover:text-[#D91B24] transition-colors line-clamp-2">
                    "{rev.highlight}"
                  </h3>

                  {/* Main Review Body */}
                  <p className="text-neutral-600 dark:text-neutral-300 text-xs sm:text-sm leading-relaxed font-normal line-clamp-4">
                    {rev.text}
                  </p>
                </div>

                {/* Author & Verification Footer */}
                <div className="pt-4 mt-4 border-t border-neutral-100 dark:border-neutral-800/80 flex flex-col gap-2.5 relative z-10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-9 h-9 rounded-full bg-linear-to-br ${rev.color} text-white flex items-center justify-center font-heading font-semibold text-xs shadow-sm shrink-0 border border-white/20`}>
                        {rev.initials}
                      </div>
                      <div>
                        <div className="flex items-center gap-1">
                          <span className="font-heading text-xs sm:text-sm font-semibold text-neutral-900 dark:text-white">
                            {rev.author}
                          </span>
                          <span title="Verified Member on Google">
                            <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                          </span>
                        </div>
                        <span className="text-[10px] text-neutral-500 dark:text-neutral-400 block truncate max-w-[150px] sm:max-w-[190px]">
                          {rev.role}
                        </span>
                      </div>
                    </div>

                    <span className="text-[10px] text-neutral-400 dark:text-neutral-500 font-medium">
                      {rev.date.split('·')[1]?.trim() || 'Verified'}
                    </span>
                  </div>

                  {/* Helpful counter button */}
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[10px] text-neutral-400 dark:text-neutral-500 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span>Verified Google Review</span>
                    </span>

                    <button
                      onClick={() => toggleHelpful(rev.id)}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-heading font-semibold transition-all cursor-pointer ${
                        votedReviews[rev.id]
                          ? 'bg-[#D91B24] text-white shadow-xs'
                          : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                      }`}
                    >
                      <ThumbsUp className={`w-3 h-3 ${votedReviews[rev.id] ? 'fill-white' : ''}`} />
                      <span>Helpful ({helpfulCounts[rev.id] || 0})</span>
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        </div>

        {/* Subtle hover note */}
        <p className="text-center text-[11px] text-neutral-400 dark:text-neutral-500 mt-6 font-medium">
          • Hover over any card to pause auto-scrolling •
        </p>

      </div>
    </section>
  );
};
