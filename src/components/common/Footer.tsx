import React from 'react';
import { useStore } from '../../context/StoreContext';
import { PaymentMethodBadges } from './PaymentIcons';
import {
  Instagram,
  Facebook,
  Youtube,
  Phone,
  Mail,
  MapPin,
  Clock,
} from 'lucide-react';

const LOGO_PATH = '/products/logo.png';

export const Footer: React.FC = () => {
  const { navigate } = useStore();

  return (
    <footer className="bg-zinc-950 text-white border-t border-zinc-900 pt-16 pb-24 lg:pb-12 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* 4-Column Navigation Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10 pb-12 border-b border-zinc-900 text-xs">
          {/* Column 1: Brand Logo, Description, Address, Social */}
          <div className="lg:col-span-5 space-y-5 lg:pr-6">
            <button
              onClick={() => navigate('home')}
              className="flex items-center gap-3 group text-left cursor-pointer"
            >
              <img
                src={LOGO_PATH}
                alt="Workout Nutrition Logo"
                className="w-10 h-10 rounded-xl object-contain bg-zinc-900/60 p-1 border border-zinc-800"
              />
              <div>
                <div className="flex items-baseline">
                  <span className="font-display font-normal text-2xl tracking-wider text-white uppercase">
                    WORKOUT
                  </span>
                  <span className="font-display font-normal text-2xl tracking-wider text-red-600 ml-1.5 uppercase">
                    NUTRITION
                  </span>
                </div>
                <div className="font-medium tracking-widest uppercase text-zinc-500 text-[8px] -mt-0.5">
                  AUTHENTIC SPORTS SUPPLEMENTS
                </div>
              </div>
            </button>

            <p className="font-body text-zinc-400 font-normal leading-relaxed text-[11px] max-w-sm">
              India's premier sports supplements destination. We stock only batch-verified, 100% authentic dietary supplements sourced directly from official brand importers.
            </p>

            {/* Registered Shop Address */}
            <div className="pt-1 space-y-2 border-t border-zinc-900/80 text-[11px] text-zinc-300 font-body">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <span className="leading-snug">
                  <strong className="text-white block font-body font-semibold text-[10px] uppercase text-red-400 tracking-wider">Registered Shop Address:</strong>
                  PMHW+3RX, Sector 119, Balongi, Sahibzada Ajit Singh Nagar, Punjab 160055
                </span>
              </div>
              <div className="flex items-center gap-2 text-zinc-400">
                <Phone className="w-3.5 h-3.5 text-zinc-500" />
                <a href="tel:+918264325436" className="hover:text-white transition-colors">
                  +91-8264325436
                </a>
              </div>
              <div className="flex items-center gap-2 text-zinc-400">
                <Mail className="w-3.5 h-3.5 text-zinc-500" />
                <a href="mailto:workoutnutrition.inquires@gmail.com" className="hover:text-white transition-colors">
                  workoutnutrition.inquires@gmail.com
                </a>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2 text-zinc-400">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="hover:text-red-500 transition-colors p-2 bg-zinc-900 rounded-lg"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="hover:text-red-500 transition-colors p-2 bg-zinc-900 rounded-lg"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="hover:text-red-500 transition-colors p-2 bg-zinc-900 rounded-lg"
              >
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 2: SHOP (col-span-2) */}
          <div className="lg:col-span-2 lg:pl-2">
            <h5 className="font-body font-semibold text-xs uppercase tracking-wider text-white mb-4">
              SHOP
            </h5>
            <ul className="space-y-2.5 text-zinc-400 font-body text-xs">
              <li>
                <button onClick={() => navigate('shop')} className="hover:text-red-500 transition-colors text-left cursor-pointer">
                  Shop All Supplements
                </button>
              </li>
              <li>
                <button onClick={() => navigate('category', { categorySlug: 'whey-protein' })} className="hover:text-red-500 transition-colors text-left cursor-pointer">
                  Protein
                </button>
              </li>
              <li>
                <button onClick={() => navigate('category', { categorySlug: 'creatine' })} className="hover:text-red-500 transition-colors text-left cursor-pointer">
                  Creatine
                </button>
              </li>
              <li>
                <button onClick={() => navigate('category', { categorySlug: 'pre-workout' })} className="hover:text-red-500 transition-colors text-left cursor-pointer">
                  Pre-Workout
                </button>
              </li>
              <li>
                <button onClick={() => navigate('category', { categorySlug: 'mass-gainer' })} className="hover:text-red-500 transition-colors text-left cursor-pointer">
                  Mass Gainer
                </button>
              </li>
              <li>
                <button onClick={() => navigate('category', { categorySlug: 'health-wellness' })} className="hover:text-red-500 transition-colors text-left cursor-pointer">
                  Wellness
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: COMPANY (col-span-2) */}
          <div className="lg:col-span-2">
            <h5 className="font-body font-semibold text-xs uppercase tracking-wider text-white mb-4">
              COMPANY
            </h5>
            <ul className="space-y-2.5 text-zinc-400 font-body text-xs">
              <li>
                <button onClick={() => navigate('about')} className="hover:text-red-500 transition-colors text-left cursor-pointer">
                  About Us
                </button>
              </li>
              <li>
                <button onClick={() => navigate('contact')} className="hover:text-red-500 transition-colors text-left cursor-pointer">
                  Contact
                </button>
              </li>
              <li>
                <button onClick={() => navigate('about')} className="hover:text-red-500 transition-colors text-left cursor-pointer">
                  Our Mission
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    navigate('home');
                    setTimeout(() => {
                      const el = document.getElementById('fitness-knowledge');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                  }}
                  className="hover:text-red-500 transition-colors text-left cursor-pointer"
                >
                  Fitness Knowledge
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: CUSTOMER SUPPORT (col-span-3) */}
          <div className="lg:col-span-3">
            <h5 className="font-body font-semibold text-xs uppercase tracking-wider text-white mb-4">
              CUSTOMER SUPPORT
            </h5>
            <ul className="space-y-2.5 text-zinc-400 font-body text-xs">
              <li>
                <button onClick={() => navigate('track-order')} className="hover:text-red-500 transition-colors text-left font-semibold text-zinc-200 cursor-pointer">
                  Track Order
                </button>
              </li>
              <li>
                <button onClick={() => navigate('shipping-policy')} className="hover:text-red-500 transition-colors text-left cursor-pointer">
                  Shipping Policy
                </button>
              </li>
              <li>
                <button onClick={() => navigate('return-policy')} className="hover:text-red-500 transition-colors text-left cursor-pointer">
                  Returns & Authenticity
                </button>
              </li>
              <li>
                <button onClick={() => navigate('faq')} className="hover:text-red-500 transition-colors text-left cursor-pointer">
                  FAQs
                </button>
              </li>
              <li>
                <button onClick={() => navigate('contact')} className="hover:text-red-500 transition-colors text-left cursor-pointer">
                  Contact Support
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* PAYMENT METHODS SECTION with SVG Logos matching Image 8 */}
        <div className="py-8 border-b border-zinc-900 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-xs font-mono text-zinc-400 uppercase tracking-wider">
            100% SECURE & ENCRYPTED PAYMENT PARTNERS
          </div>

          {/* SVG Payment badges */}
          <PaymentMethodBadges />
        </div>

        {/* BOTTOM SECTION: Copyright & Legal Policies */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-zinc-500">
          <div>
            © 2026 WORKOUT NUTRITION INDIA. All rights reserved.
          </div>
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-zinc-400">
            <button onClick={() => navigate('terms')} className="hover:text-white transition-colors cursor-pointer">
              Privacy Policy
            </button>
            <button onClick={() => navigate('terms')} className="hover:text-white transition-colors cursor-pointer">
              Terms & Conditions
            </button>
            <button onClick={() => navigate('return-policy')} className="hover:text-white transition-colors cursor-pointer">
              Refund Policy
            </button>
            <button onClick={() => navigate('shipping-policy')} className="hover:text-white transition-colors cursor-pointer">
              Shipping Policy
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
