import React from 'react';
import { ThemeMode } from './types';
import { Sun, Moon, Sparkles } from 'lucide-react';

interface ThemeSelectorProps {
  currentTheme: ThemeMode;
  onThemeChange: (theme: ThemeMode) => void;
}

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  currentTheme,
  onThemeChange,
}) => {
  const isDark = currentTheme === 'dark';

  const toggleTheme = () => {
    onThemeChange(isDark ? 'light' : 'dark');
  };

  return (
    <button
      onClick={toggleTheme}
      type="button"
      className={`group relative flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#D91B24] cursor-pointer shadow-xs overflow-hidden select-none ${
        isDark
          ? 'bg-neutral-900 border-neutral-700 text-amber-300 hover:border-[#E11D2A] hover:bg-neutral-800 shadow-[0_0_12px_rgba(225,29,42,0.15)]'
          : 'bg-neutral-100 border-neutral-300 text-neutral-800 hover:border-[#D91B24] hover:bg-white shadow-[0_0_10px_rgba(217,27,36,0.1)]'
      }`}
      aria-label={`Switch to ${isDark ? 'Light' : 'Dark'} mode`}
      title={`Current: ${isDark ? 'Dark Mode' : 'Light Mode'} — Click to toggle`}
    >
      {/* Animated Icon Container */}
      <div className="relative w-5 h-5 flex items-center justify-center">
        {/* Sun Icon for Light Mode */}
        <Sun
          className={`w-4 h-4 transition-all duration-500 ease-out transform ${
            isDark
              ? 'opacity-0 rotate-180 scale-0 absolute pointer-events-none'
              : 'opacity-100 rotate-0 scale-100 text-[#D91B24]'
          }`}
        />
        {/* Moon Icon for Dark Mode */}
        <Moon
          className={`w-4 h-4 transition-all duration-500 ease-out transform ${
            isDark
              ? 'opacity-100 rotate-0 scale-100 text-amber-400'
              : 'opacity-0 -rotate-180 scale-0 absolute pointer-events-none'
          }`}
        />
      </div>

      {/* Mode Label */}
      <span className="font-heading text-[11px] font-bold uppercase tracking-wider hidden sm:inline-block">
        {isDark ? 'DARK' : 'LIGHT'}
      </span>

      {/* Subtle indicator dot with animated pulse */}
      <span
        className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
          isDark ? 'bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.8)]' : 'bg-[#D91B24] shadow-[0_0_6px_rgba(217,27,36,0.8)]'
        }`}
      />
    </button>
  );
};


