import React, { useState, useEffect } from 'react';
import { NextLevelLogo } from './NextLevelLogo';
import { ThemeSelector } from './ThemeSelector';
import { ThemeMode } from './types';
import { Menu, X, Phone, MessageCircle } from 'lucide-react';

interface NavbarProps {
  currentTheme: ThemeMode;
  onThemeChange: (theme: ThemeMode) => void;
  onJoinClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTheme,
  onThemeChange,
  onJoinClick,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'HOME', href: '#home' },
    { label: 'ABOUT', href: '#about' },
    { label: 'TRAINING', href: '#training' },
    { label: 'FACILITIES', href: '#facilities' },
    { label: 'MEMBERSHIP', href: '#membership' },
    { label: 'GALLERY', href: '#gallery' },
    { label: 'REVIEWS', href: '#reviews' },
    { label: 'CONTACT', href: '#contact' },
  ];

  return (
    <>
      <header
        className={`sticky top-0 left-0 right-0 z-30 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md py-2.5 shadow-sm border-b border-neutral-200/80 dark:border-neutral-800'
            : 'bg-white/90 dark:bg-neutral-900/90 backdrop-blur-xs py-3 border-b border-neutral-100 dark:border-neutral-800/60'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Left: Brand Logo */}
            <a
              href="#home"
              className="flex items-center group transition-transform active:scale-98"
              aria-label="Next Level Fitness Home"
            >
              <NextLevelLogo size={isScrolled ? 46 : 52} />
            </a>

            {/* Center: Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-7 text-xs tracking-wider font-semibold text-neutral-700 dark:text-neutral-300">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="relative py-1 font-heading hover:text-[#D91B24] dark:hover:text-[#E11D2A] transition-colors after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#D91B24] hover:after:w-full after:transition-all after:duration-200"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            {/* Right: Actions */}
            <div className="flex items-center gap-3">
              {/* Theme Switcher Button */}
              <ThemeSelector
                currentTheme={currentTheme}
                onThemeChange={onThemeChange}
              />

              {/* Call Link on Medium Screens */}
              <a
                href="tel:+918264325436"
                className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-800 dark:text-neutral-200 hover:text-[#D91B24] dark:hover:text-[#E11D2A] px-2.5 py-1.5 transition-colors"
                title="Call Next Level Fitness"
              >
                <Phone className="w-3.5 h-3.5 text-[#D91B24]" />
                <span className="hidden xl:inline">+91-8264325436</span>
              </a>

              {/* Primary CTA */}
              <button
                onClick={onJoinClick}
                className="hidden sm:inline-flex items-center justify-center font-heading text-xs tracking-wider uppercase font-bold text-white bg-[#D91B24] hover:bg-[#B8141D] active:scale-98 px-5 py-2.5 rounded-lg shadow-sm transition-all duration-200 whitespace-nowrap cursor-pointer"
              >
                JOIN NOW
              </button>

              {/* Mobile Hamburger Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white rounded-lg focus:outline-none cursor-pointer"
                aria-label="Toggle mobile menu"
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-30 lg:hidden bg-neutral-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="fixed inset-y-0 right-0 w-full max-w-xs bg-white dark:bg-neutral-900 shadow-2xl p-6 flex flex-col justify-between overflow-y-auto border-l border-neutral-200 dark:border-neutral-800">
            <div className="space-y-6 pt-16">
              <div className="pb-4 border-b border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
                <span className="text-xs uppercase font-heading font-bold text-neutral-500 dark:text-neutral-400 tracking-wider">
                  Menu
                </span>
                <span className="text-xs text-[#D91B24] font-bold font-heading">
                  STRENGTH & FITNESS
                </span>
              </div>

              <nav className="flex flex-col space-y-3">
                {navLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="font-heading text-lg font-bold text-neutral-800 dark:text-neutral-100 hover:text-[#D91B24] dark:hover:text-[#E11D2A] py-1.5 transition-colors border-b border-neutral-50 dark:border-neutral-800/40"
                  >
                    {link.label}
                  </a>
                ))}
              </nav>
            </div>

            <div className="space-y-3 pt-6 border-t border-neutral-100 dark:border-neutral-800">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onJoinClick();
                }}
                className="w-full font-heading text-sm uppercase font-bold text-white bg-[#D91B24] hover:bg-[#B8141D] py-3 rounded-lg shadow-sm text-center cursor-pointer"
              >
                JOIN NOW
              </button>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <a
                  href="tel:+918264325436"
                  className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 text-xs font-semibold hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-[#D91B24]" />
                  <span>Call Us</span>
                </a>
                <a
                  href="https://wa.me/918264325436?text=Hello%20Next%20Level%20Fitness%2C%20I%20am%20interested%20in%20joining%20the%20gym."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg bg-[#25D366]/10 text-[#128C7E] dark:text-[#25D366] text-xs font-semibold hover:bg-[#25D366]/20 transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
