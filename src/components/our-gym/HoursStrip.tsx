import React, { useState, useEffect } from 'react';
import { Clock, Flame } from 'lucide-react';

export const HoursStrip: React.FC = () => {
  const [isOpenNow, setIsOpenNow] = useState(true);
  const [currentTimeStr, setCurrentTimeStr] = useState('');

  useEffect(() => {
    const updateStatus = () => {
      const now = new Date();
      const hours = now.getHours();
      
      // Gym hours: 06:00 AM (6) to 10:00 PM (22)
      const open = hours >= 6 && hours < 22;
      setIsOpenNow(open);

      // Formatted local time string
      const timeFormatted = now.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });
      setCurrentTimeStr(timeFormatted);
    };

    updateStatus();
    const interval = setInterval(updateStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full bg-zinc-50/90 text-zinc-950 border-b border-zinc-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-6 items-center text-left divide-y sm:divide-y-0 sm:divide-x divide-zinc-200">
          
          {/* Item 1: Schedule Mode */}
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-white border border-zinc-200 flex items-center justify-center text-[#D91B24] shrink-0 shadow-xs">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-zinc-500 block font-heading">
                SCHEDULE
              </span>
              <span className="text-sm sm:text-base font-bold text-zinc-950 font-heading tracking-wide">
                OPEN DAILY
              </span>
            </div>
          </div>

          {/* Item 2: Dynamic Live Status */}
          <div className="pt-3 sm:pt-0 sm:pl-6 flex items-center gap-3.5">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-zinc-500 block font-heading">
                CURRENT STATUS
              </span>
              <div className="flex items-center gap-2 mt-0.5">
                <span
                  className={`w-2.5 h-2.5 rounded-full inline-block ${
                    isOpenNow
                      ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse'
                      : 'bg-rose-500'
                  }`}
                />
                <span
                  className={`text-sm sm:text-base font-bold font-heading tracking-wide ${
                    isOpenNow ? 'text-emerald-700' : 'text-rose-700'
                  }`}
                >
                  {isOpenNow ? 'OPEN NOW' : 'CLOSED NOW'}
                </span>
                {currentTimeStr && (
                  <span className="text-xs text-zinc-500 tabular-nums font-medium">
                    ({currentTimeStr})
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Item 3: Training Atmosphere */}
          <div className="pt-3 sm:pt-0 sm:pl-6 flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-white border border-zinc-200 flex items-center justify-center text-[#D91B24] shrink-0 shadow-xs">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-zinc-500 block font-heading">
                TRAINING ATMOSPHERE
              </span>
              <span className="text-sm sm:text-base font-bold text-zinc-950 font-heading tracking-wide">
                HIGH-ENERGY & MOTIVATING
              </span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
