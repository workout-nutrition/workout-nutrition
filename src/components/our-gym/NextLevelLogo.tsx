import React from 'react';
import nextLevelLogo from '../../assets/images/next-level-logo.png';

interface LogoProps {
  className?: string;
  size?: number;
  showTextBeside?: boolean;
  inverted?: boolean;
}

export const NextLevelLogo: React.FC<LogoProps> = ({
  className = '',
  size = 56,
  showTextBeside = true,
  inverted = false,
}) => {
  return (
    <div
      className={`flex items-center gap-3.5 select-none ${className}`}
    >
      {/* Logo Image */}
      <div
        className="relative shrink-0 overflow-hidden rounded-full bg-white flex items-center justify-center"
        style={{
          width: size,
          height: size,
        }}
      >
        <img
          src={nextLevelLogo}
          alt="Next Level Fitness Logo"
          className="w-full h-full object-contain"
        />
      </div>

      {/* Brand Text Beside Logo */}
      {showTextBeside && (
        <div className="flex flex-col text-left leading-none">
          <div className="flex items-center gap-1.5">
            <span
              className="font-heading text-xl md:text-2xl font-bold tracking-tight text-[#D91B24]"
              style={{ fontFamily: "'Oswald', sans-serif" }}
            >
              NEXT LEVEL
            </span>

            <span
              className={`font-heading text-xl md:text-2xl font-bold tracking-tight ${
                inverted
                  ? 'text-white'
                  : 'text-neutral-900'
              }`}
              style={{ fontFamily: "'Oswald', sans-serif" }}
            >
              FITNESS
            </span>
          </div>

          <span
            className={`text-[10px] tracking-widest uppercase font-semibold mt-0.5 ${
              inverted
                ? 'text-neutral-400'
                : 'text-neutral-500 dark:text-neutral-400'
            }`}
          >
            STRENGTH & PERFORMANCE
          </span>
        </div>
      )}
    </div>
  );
};