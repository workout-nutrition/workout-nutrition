import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';

export const FloatingWhatsApp: React.FC = () => {
  const [showTooltip, setShowTooltip] = useState(true);

  const handleWhatsAppClick = () => {
    const message = encodeURIComponent(
      'Hi IronForge Nutrition team! I need expert guidance choosing the right supplement stack for my fitness goals.'
    );
    window.open(`https://wa.me/918264325436?text=${message}`, '_blank');
  };

  return (
    <div className="fixed bottom-20 md:bottom-6 right-6 z-40 flex items-center gap-3 select-none">
      {/* Tooltip banner */}
      {showTooltip && (
        <div className="hidden sm:flex items-center gap-2 bg-white text-zinc-800 text-xs py-2 px-3.5 rounded-xl shadow-xl border border-zinc-200 animate-in fade-in slide-in-from-right duration-300">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <span className="font-medium">Need help choosing a supplement?</span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowTooltip(false);
            }}
            className="text-zinc-400 hover:text-zinc-600 p-0.5 ml-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={handleWhatsAppClick}
        aria-label="Chat on WhatsApp with Nutritionist"
        className="group relative flex items-center justify-center w-13 h-13 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white shadow-xl shadow-emerald-600/30 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
      >
        <MessageCircle className="w-6 h-6 fill-current text-white" />
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-400" />
        </span>
      </button>
    </div>
  );
};
