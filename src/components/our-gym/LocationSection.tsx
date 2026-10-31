import React from 'react';
import { MapPin, Clock, Phone, Navigation, ExternalLink } from 'lucide-react';

export const LocationSection: React.FC = () => {
  const address = 'PMHW+3RX, Sector 119, Balongi, Sahibzada Ajit Singh Nagar, Punjab 160055, India';
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
    'Next Level Fitness, Sector 119, Balongi, Sahibzada Ajit Singh Nagar, Punjab 160055'
  )}`;

  return (
    <section className="py-20 lg:py-28 bg-(--brand-surface) border-b border-(--brand-border) transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
          <div className="inline-flex items-center gap-2">
            <span className="w-6 h-0.5 bg-[#D91B24]" />
            <span className="text-xs uppercase font-heading font-bold tracking-widest text-[#D91B24]">
              VISIT OUR PREMISES
            </span>
            <span className="w-6 h-0.5 bg-[#D91B24]" />
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-neutral-950 dark:text-white font-heading">
            FIND NEXT LEVEL FITNESS
          </h2>
          <p className="text-neutral-600 dark:text-neutral-300 text-sm sm:text-base font-normal">
            Visit our premier training floor in person. Experience our equipment, meet our coaching staff, and take the first step toward your fitness transformation.
          </p>
        </div>

        {/* Location Information Card & Map Embed with Equal Height Matching */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Details Card (col-span-5) */}
          <div className="lg:col-span-5 card-theme rounded-2xl p-7 sm:p-8 shadow-sm flex flex-col justify-between text-left h-full min-h-[460px] space-y-7">
            <div className="space-y-6">
              
              {/* Address Block */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-neutral-800 border border-red-100 dark:border-neutral-700 flex items-center justify-center text-[#D91B24] shrink-0 mt-0.5">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-semibold tracking-widest text-neutral-400 block font-heading">
                    GYM ADDRESS
                  </span>
                  <h3 className="font-heading text-base sm:text-lg font-semibold text-neutral-900 dark:text-white mt-0.5">
                    Sector 119, Balongi
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed mt-1 font-normal">
                    {address}
                  </p>
                </div>
              </div>

              {/* Hours Block */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-neutral-800 border border-red-100 dark:border-neutral-700 flex items-center justify-center text-[#D91B24] shrink-0 mt-0.5">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-semibold tracking-widest text-neutral-400 block font-heading">
                    OPENING HOURS
                  </span>
                  <h3 className="font-heading text-base sm:text-lg font-semibold text-neutral-900 dark:text-white mt-0.5">
                    06:00 AM &mdash; 10:00 PM
                  </h3>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 font-normal">
                    Open 7 days a week &middot; Early morning to evening sessions
                  </p>
                </div>
              </div>

              {/* Phone Block */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-neutral-800 border border-red-100 dark:border-neutral-700 flex items-center justify-center text-[#D91B24] shrink-0 mt-0.5">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-semibold tracking-widest text-neutral-400 block font-heading">
                    DIRECT PHONE
                  </span>
                  <a
                    href="tel:+918264325436"
                    className="font-heading text-base sm:text-lg font-semibold text-neutral-900 dark:text-white hover:text-[#D91B24] transition-colors mt-0.5 block"
                  >
                    +91-8264325436
                  </a>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5 font-normal">
                    Call for timings, facility tours & memberships
                  </p>
                </div>
              </div>

            </div>

            {/* Action Buttons */}
            <div className="pt-5 border-t border-neutral-100 dark:border-neutral-800 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <a
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-heading text-xs font-semibold uppercase tracking-wider text-white bg-[#D91B24] hover:bg-[#B8141D] shadow-sm transition-colors text-center"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>GET DIRECTIONS</span>
              </a>

              <a
                href="tel:+918264325436"
                className="inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-heading text-xs font-semibold uppercase tracking-wider text-neutral-900 dark:text-white bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 border border-neutral-300 dark:border-neutral-700 transition-colors text-center"
              >
                <Phone className="w-3.5 h-3.5 text-[#D91B24]" />
                <span>CALL NOW</span>
              </a>
            </div>

          </div>

          {/* Interactive Google Map Embed (col-span-7) - Stretches 100% to match card height */}
          <div className="lg:col-span-7 rounded-2xl overflow-hidden shadow-sm border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 min-h-[480px] h-full relative card-theme">
            <iframe
              title="Next Level Fitness Location Map"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              className="absolute inset-0 w-full h-full"
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              src="https://maps.google.com/maps?q=Balongi%2C%20Sector%20119%2C%20Sahibzada%20Ajit%20Singh%20Nagar%2C%20Punjab%20160055&t=&z=15&ie=UTF8&iwloc=&output=embed"
            />
          </div>

        </div>

      </div>
    </section>
  );
};
