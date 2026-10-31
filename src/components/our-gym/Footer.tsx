import React from 'react';
import { NextLevelLogo } from './NextLevelLogo';
import { MapPin, Phone, Clock, Mail, Instagram, ArrowUp } from 'lucide-react';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-neutral-950 text-white pt-16 pb-12 border-t border-neutral-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-12 border-b border-neutral-900 text-left">
          
          {/* Brand Info (col-span-4) */}
          <div className="lg:col-span-4 space-y-4">
            <NextLevelLogo size={56} inverted={true} />
            <p className="text-neutral-400 text-sm font-normal max-w-sm leading-relaxed italic pt-1">
              "Train hard. Become stronger."
            </p>
            <p className="text-xs text-neutral-400 leading-relaxed max-w-sm">
              Next Level Fitness is an elite athletic club dedicated to serious strength development, metabolic conditioning, and personal physical transformation with modern equipment and certified guidance.
            </p>

            <div className="pt-2">
              <a
                href="https://www.instagram.com/next_level_fitneses/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-300 text-xs font-heading font-semibold tracking-wider transition-colors border border-neutral-800"
              >
                <Instagram className="w-3.5 h-3.5 text-[#D91B24]" />
                <span>@next_level_fitneses</span>
              </a>
            </div>
          </div>

          {/* Quick Links (col-span-3) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="font-heading text-sm font-bold uppercase tracking-wider text-white">
              QUICK LINKS
            </h4>
            <ul className="space-y-2.5 text-xs text-neutral-400">
              <li>
                <a href="#home" className="hover:text-white transition-colors">Home</a>
              </li>
              <li>
                <a href="#about" className="hover:text-white transition-colors">About</a>
              </li>
              <li>
                <a href="#training" className="hover:text-white transition-colors">Training Programs</a>
              </li>
              <li>
                <a href="#facilities" className="hover:text-white transition-colors">Gym Facilities</a>
              </li>
              <li>
                <a href="#membership" className="hover:text-white transition-colors">Membership Options</a>
              </li>
              <li>
                <a href="#gallery" className="hover:text-white transition-colors">Photo Gallery</a>
              </li>
              <li>
                <a href="#reviews" className="hover:text-white transition-colors">Member Reviews</a>
              </li>
              <li>
                <a href="#contact" className="hover:text-white transition-colors">Contact & Location</a>
              </li>
            </ul>
          </div>

          {/* Opening Hours & Campus (col-span-2) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="font-heading text-sm font-bold uppercase tracking-wider text-white">
              HOURS
            </h4>
            <div className="space-y-3 text-xs text-neutral-400">
              <div className="flex items-start gap-2">
                <Clock className="w-3.5 h-3.5 text-[#D91B24] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-neutral-200 block font-heading">
                    06:00 AM – 10:00 PM
                  </span>
                  <span className="text-[11px] text-neutral-500">Open Daily (7 Days)</span>
                </div>
              </div>

              <div className="pt-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm bg-emerald-950/60 border border-emerald-800/60 text-emerald-400 text-[10px] font-heading font-bold uppercase tracking-wider">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>Open 7 Days</span>
                </span>
              </div>
            </div>
          </div>

          {/* Contact Details (col-span-3) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="font-heading text-sm font-bold uppercase tracking-wider text-white">
              CONTACT
            </h4>
            <div className="space-y-3 text-xs text-neutral-400">
              <div className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-[#D91B24] shrink-0 mt-0.5" />
                <a
                  href="tel:+918264325436"
                  className="font-bold text-white hover:text-[#D91B24] transition-colors"
                >
                  +91-8264325436
                </a>
              </div>

              <div className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-[#D91B24] shrink-0 mt-0.5" />
                <span className="text-neutral-400 font-mono text-[11px]">
                  workoutnutrition.inquires@gmail.com
                </span>
              </div>

              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#D91B24] shrink-0 mt-0.5" />
                <span className="text-neutral-400 leading-relaxed">
                  Sector 119, Balongi, Sahibzada Ajit Singh Nagar, Punjab 160055, India
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <p>© 2026 Next Level Fitness. All Rights Reserved.</p>

          <div className="flex items-center gap-4">
            <span>Balongi · Sector 119 · Mohali</span>
            <button
              onClick={scrollToTop}
              className="inline-flex items-center gap-1 text-neutral-400 hover:text-white transition-colors cursor-pointer"
              aria-label="Back to top"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
