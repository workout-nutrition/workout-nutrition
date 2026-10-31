import React from 'react';
import { Phone, MessageCircle } from 'lucide-react';

export const FloatingCTAs: React.FC = () => {
  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col gap-2.5 items-end select-none">
      {/* WhatsApp CTA */}
      <a
        href="https://wa.me/918264325436?text=Hello%20Next%20Level%20Fitness%2C%20I%20would%20like%20to%20enquire%20about%20gym%20membership."
        target="_blank"
        rel="noopener noreferrer"
        className="group relative flex items-center justify-center w-12 h-12 rounded-full bg-[#25D366] hover:bg-[#20BD5A] text-white shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95"
        aria-label="Chat on WhatsApp"
        title="Chat on WhatsApp"
      >
        <MessageCircle className="w-6 h-6 fill-white" />
        <span className="hidden group-hover:block absolute right-14 whitespace-nowrap bg-neutral-900 text-white text-xs px-2.5 py-1 rounded-md shadow-md font-heading font-medium">
          Chat on WhatsApp
        </span>
      </a>

      {/* Call CTA */}
      <a
        href="tel:+918264325436"
        className="group relative flex items-center justify-center w-12 h-12 rounded-full bg-[#D91B24] hover:bg-[#B8141D] text-white shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95 animate-pulse-subtle"
        aria-label="Call Next Level Fitness"
        title="Call +91-8264325436"
      >
        <Phone className="w-5 h-5 fill-white" />
        <span className="hidden group-hover:block absolute right-14 whitespace-nowrap bg-neutral-900 text-white text-xs px-2.5 py-1 rounded-md shadow-md font-heading font-medium">
          Call +91-8264325436
        </span>
      </a>
    </div>
  );
};
