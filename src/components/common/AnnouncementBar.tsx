import React, { useState, useEffect } from 'react';
import { ShieldCheck, Truck, CreditCard, Flame, Clock } from 'lucide-react';

const MESSAGES = [
  { text: '100% Authentic Supplements · Batch Verified Direct Sourcing', icon: ShieldCheck },
  { text: 'Free Express Shipping Pan-India on Orders Above ₹999', icon: Truck },
  { text: 'Cash on Delivery (COD) Available Across 19,000+ Pin Codes', icon: CreditCard },
  { text: 'Exclusive Deals: Use Code WORKOUT10 for 10% Instant Discount', icon: Flame },
  { text: 'Fast Pan-India Delivery · Same-Day Dispatch Before 2 PM', icon: Clock },
];

export const AnnouncementBar: React.FC = () => {
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % MESSAGES.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [isPaused]);

  const CurrentIcon = MESSAGES[index].icon;

  return (
    <div
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="bg-black text-white text-xs font-medium py-2 px-4 transition-colors duration-200 border-b border-red-900/40 relative z-50 select-none"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="hidden md:flex items-center gap-2 text-zinc-400">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>GST Verified Store</span>
        </div>

        <div className="flex-1 flex items-center justify-center overflow-hidden h-5">
          <div
            key={index}
            className="flex items-center gap-2 text-zinc-200 transition-all duration-300 ease-out transform animate-fade-in"
          >
            <CurrentIcon className="w-3.5 h-3.5 text-red-500 shrink-0" />
            <span className="tracking-wide text-[11px] sm:text-xs text-center font-medium">
              {MESSAGES[index].text}
            </span>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-4 text-zinc-400 text-xs">
          <a href="tel:+918264325436" className="hover:text-white transition-colors cursor-pointer">
            Support: +91-8264325436
          </a>
          <span className="text-zinc-600">|</span>
          <span className="text-red-400 font-semibold">100% Genuine</span>
        </div>
      </div>
    </div>
  );
};
