import React from 'react';
import { ArrowRight, Phone, Dumbbell } from 'lucide-react';

interface MembershipBannerProps {
  onJoinClick: () => void;
}

export const MembershipBanner: React.FC<MembershipBannerProps> = ({ onJoinClick }) => {
  return (
    <section className="relative py-16 sm:py-20 bg-[#D91B24] text-white overflow-hidden shadow-xl">
      {/* Subtle decorative background diagonal lines */}
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
      <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none">
        <Dumbbell className="w-80 h-80 text-white" />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/15 backdrop-blur-xs text-white text-xs font-heading font-semibold uppercase tracking-widest border border-white/20">
          <span>NEXT LEVEL FITNESS · ELEVATE YOUR PERFORMANCE</span>
        </div>

        <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight font-heading leading-tight uppercase">
          READY TO TAKE YOUR <br />
          FITNESS TO THE NEXT LEVEL?
        </h2>

        <p className="text-base sm:text-lg text-white/90 max-w-2xl mx-auto font-normal leading-relaxed">
          Join a motivating fitness environment built around progressive training, strength, and consistent discipline.
          Start today and build your strongest, most resilient self.
        </p>

        <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={onJoinClick}
            className="group inline-flex items-center justify-center font-heading text-sm uppercase tracking-wider font-bold text-neutral-900 bg-white hover:bg-neutral-100 active:scale-98 px-8 py-4 rounded-xl shadow-lg transition-all duration-200 cursor-pointer"
          >
            <span>JOIN NOW</span>
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform text-[#D91B24]" />
          </button>

          <a
            href="tel:+918264325436"
            className="inline-flex items-center justify-center font-heading text-sm uppercase tracking-wider font-bold text-white bg-black/30 hover:bg-black/40 border border-white/30 active:scale-98 px-7 py-4 rounded-xl transition-all duration-200"
          >
            <Phone className="w-4 h-4 mr-2" />
            <span>CALL +91-8264325436</span>
          </a>
        </div>
      </div>
    </section>
  );
};
