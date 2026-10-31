import React, { useState, useEffect } from 'react';

export const StatsSection: React.FC = () => {
  const [rating, setRating] = useState(0);
  const [reviews, setReviews] = useState(0);
  const [community, setCommunity] = useState(0);
  const [hours, setHours] = useState(0);

  useEffect(() => {
    let startTimestamp: number | null = null;
    const duration = 2000;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);

      setRating(parseFloat((ease * 4.9).toFixed(1)));
      setReviews(Math.floor(ease * 316));
      setCommunity(Math.floor(ease * 1200));
      setHours(Math.floor(ease * 16));

      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };

    const animFrame = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(animFrame);
  }, []);

  return (
    <section className="bg-white border-t border-b border-zinc-200/80 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 text-center">
          {/* Stat 1: Google Rating */}
          <div className="bg-zinc-50/90 border border-zinc-200/90 rounded-2xl p-5 hover:bg-white hover:border-red-500/50 transition-all text-left flex flex-col justify-between shadow-xs hover:shadow-md">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-zinc-500 font-heading block">
                GOOGLE RATING
              </span>
              <div className="flex items-baseline font-heading text-3xl sm:text-4xl font-bold text-zinc-950 tracking-tight tabular-nums mt-1">
                <span>{rating.toFixed(1)}</span>
                <span className="text-[#D91B24] ml-1 text-2xl sm:text-3xl">★</span>
              </div>
            </div>
            <p className="text-xs text-zinc-500 font-normal mt-2">
              Out of 5.0 stars
            </p>
          </div>

          {/* Stat 2: Real Reviews */}
          <div className="bg-zinc-50/90 border border-zinc-200/90 rounded-2xl p-5 hover:bg-white hover:border-red-500/50 transition-all text-left flex flex-col justify-between shadow-xs hover:shadow-md">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-zinc-500 font-heading block">
                REAL REVIEWS
              </span>
              <div className="flex items-baseline font-heading text-3xl sm:text-4xl font-bold text-zinc-950 tracking-tight tabular-nums mt-1">
                <span>{reviews}</span>
                <span className="text-[#D91B24] ml-0.5 text-2xl sm:text-3xl">+</span>
              </div>
            </div>
            <p className="text-xs text-zinc-500 font-normal mt-2">
              Verified member ratings
            </p>
          </div>

          {/* Stat 3: Active Athletes */}
          <div className="bg-zinc-50/90 border border-zinc-200/90 rounded-2xl p-5 hover:bg-white hover:border-red-500/50 transition-all text-left flex flex-col justify-between shadow-xs hover:shadow-md">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-zinc-500 font-heading block">
                ACTIVE ATHLETES
              </span>
              <div className="flex items-baseline font-heading text-3xl sm:text-4xl font-bold text-zinc-950 tracking-tight tabular-nums mt-1">
                <span>{community.toLocaleString()}</span>
                <span className="text-[#D91B24] ml-0.5 text-2xl sm:text-3xl">+</span>
              </div>
            </div>
            <p className="text-xs text-zinc-500 font-normal mt-2">
              Dedicated fitness community
            </p>
          </div>

          {/* Stat 4: Daily Access */}
          <div className="bg-zinc-50/90 border border-zinc-200/90 rounded-2xl p-5 hover:bg-white hover:border-red-500/50 transition-all text-left flex flex-col justify-between shadow-xs hover:shadow-md">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-zinc-500 font-heading block">
                DAILY ACCESS
              </span>
              <div className="flex items-baseline font-heading text-3xl sm:text-4xl font-bold text-zinc-950 tracking-tight tabular-nums mt-1">
                <span>{hours}</span>
                <span className="text-[#D91B24] ml-1 text-xl sm:text-2xl font-semibold">HRS</span>
              </div>
            </div>
            <p className="text-xs text-zinc-500 font-normal mt-2">
              06:00 AM – 10:00 PM (7 Days)
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

