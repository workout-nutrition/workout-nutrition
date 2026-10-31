
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useStore } from '../../context/StoreContext';
import { useAuth } from '../../context/AuthContext';
import { CategoriesMegaMenu } from './CategoriesMegaMenu';
import { GOALS } from '../../data/goals';
import {
  Search,
  User,
  Heart,
  ShoppingBag,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
  Dumbbell,
  ShieldCheck,
  Truck,
  Phone,
  MessageCircle,
  HelpCircle,
  ArrowRight,
  ShieldAlert,
  LogOut,
} from 'lucide-react';

const LOGO_PATH = '/products/logo.png';

export const Header: React.FC = () => {
  const {
    currentPage,
    navigate,
    cartCount,
    setCartOpen,
    setSearchOpen,
    wishlist,
  } = useStore();

  const { user, isAdmin, openAuthModal, signOut } = useAuth();

  const [visible, setVisible] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [categoriesMenuOpen, setCategoriesMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [mobileActiveTab, setMobileActiveTab] = useState<
    'pages' | 'categories' | 'brands' | 'goals'
  >('pages');

  const [prevScrollY, setPrevScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > 70 && currentScrollY > prevScrollY) {
        setVisible(false);
        setCategoriesMenuOpen(false);
      } else {
        setVisible(true);
      }

      setPrevScrollY(currentScrollY);
      setIsScrolled(currentScrollY > 15);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [prevScrollY]);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';

    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const handleNavClick = (page: any, params?: any) => {
    setCategoriesMenuOpen(false);
    setMobileMenuOpen(false);
    navigate(page, params);
  };

  const navButtonClass = (active: boolean) =>
    `px-3.5 py-1.5 rounded-full transition-all cursor-pointer hover:text-red-600 hover:bg-zinc-100/70 ${
      active ? 'bg-red-50 text-red-600 font-semibold' : 'text-zinc-700'
    }`;

  const LogoImage = ({ mobile = false }: { mobile?: boolean }) => (
    <img
      src={LOGO_PATH}
      alt="Workout Nutrition"
      className={
        mobile
          ? 'h-8 w-auto max-w-[120px] object-contain'
          : 'h-10 w-auto max-w-[180px] object-contain'
      }
      onError={(event) => {
        event.currentTarget.style.display = 'none';
      }}
    />
  );

  const BrandText = ({ mobile = false }: { mobile?: boolean }) => (
    <div className="min-w-0">
      <div className={`flex items-baseline ${mobile ? 'leading-none' : ''}`}>
        <span
          className={`font-display font-normal tracking-wide text-zinc-950 uppercase ${
            mobile ? 'text-xs sm:text-sm' : 'text-xl tracking-wider'
          }`}
        >
          WORKOUT
        </span>
        <span
          className={`font-display font-normal tracking-wide text-red-600 ml-1 uppercase ${
            mobile ? 'text-xs sm:text-sm' : 'text-xl tracking-wider'
          }`}
        >
          NUTRITION
        </span>
      </div>

      <div
        className={`font-medium tracking-widest uppercase text-zinc-400 ${
          mobile ? 'text-[7px] mt-0.5 truncate' : 'text-[8px] -mt-0.5'
        }`}
      >
        {mobile ? 'AUTHENTIC SUPPLEMENTS' : 'AUTHENTIC SPORTS SUPPLEMENTS'}
      </div>
    </div>
  );

  const LogoButton = ({ mobile = false }: { mobile?: boolean }) => (
    <button
      onClick={() => handleNavClick('home')}
      className={`flex items-center ${
        mobile ? 'gap-2 min-w-0' : 'gap-2.5 shrink-0'
      } group text-left cursor-pointer select-none`}
      aria-label="Workout Nutrition Home"
    >
      <LogoImage mobile={mobile} />
      <BrandText mobile={mobile} />
    </button>
  );

  const mobileCategories = [
    { slug: 'whey-protein', label: 'Whey Protein', desc: 'Fast-absorbing protein' },
    { slug: 'whey-isolate', label: 'Whey Isolate', desc: 'High purity isolate' },
    { slug: 'creatine', label: 'Creatine', desc: 'Strength and power' },
    { slug: 'pre-workout', label: 'Pre-Workout', desc: 'Energy and pump' },
    { slug: 'mass-gainer', label: 'Mass Gainer', desc: 'High-calorie blends' },
    { slug: 'fish-oil', label: 'Fish Oil', desc: 'Omega-3 support' },
    { slug: 'multivitamins', label: 'Multivitamins', desc: 'Vitamins and minerals' },
  ];

  const mobileBrands = [
    { slug: 'muscleblaze', name: 'MuscleBlaze', origin: 'India', desc: 'Sports nutrition products' },
    { slug: 'optimum-nutrition', name: 'Optimum Nutrition', origin: 'USA', desc: 'Gold Standard range' },
    { slug: 'dymatize', name: 'Dymatize', origin: 'USA', desc: 'Protein supplements' },
    { slug: 'muscletech', name: 'MuscleTech', origin: 'USA', desc: 'Performance nutrition' },
    { slug: 'bsn', name: 'BSN', origin: 'USA', desc: 'Sports supplements' },
    { slug: 'applied-nutrition', name: 'Applied Nutrition', origin: 'UK', desc: 'Workout nutrition' },
  ];

  const mobilePages = [
    {
      page: 'track-order',
      title: 'Track Live Order',
      desc: 'Courier and dispatch status',
      icon: <Truck className="w-4 h-4" />,
    },
    {
      page: 'about',
      title: 'About Us',
      desc: 'About our store',
      icon: <ShieldCheck className="w-4 h-4" />,
    },
    {
      page: 'our-gym',
      title: 'Our Gym',
      desc: 'Explore Next Level Fitness',
      icon: <Dumbbell className="w-4 h-4" />,
    },
    {
      page: 'contact',
      title: 'Contact Us',
      desc: 'Support and enquiries',
      icon: <Phone className="w-4 h-4" />,
    },
    {
      page: 'faq',
      title: 'FAQs and Guidance',
      desc: 'Shipping, payment and orders',
      icon: <HelpCircle className="w-4 h-4" />,
    },
    {
      page: 'account',
      title: user ? 'My Account' : 'Sign In / Register',
      desc: user ? user.email || 'View profile' : 'Login to save orders',
      icon: <User className="w-4 h-4" />,
    },
  ];

  return (
    <header
      className={`sticky top-0 z-40 w-full px-2.5 sm:px-6 pt-2 pb-2 md:pt-2.5 md:pb-2 transition-all duration-300 ease-in-out ${
        visible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
      }`}
    >
      {/* DESKTOP NAVBAR */}
      <div className="hidden md:block">
        <div
          className={`max-w-7xl mx-auto rounded-full transition-all duration-300 border ${
            isScrolled
              ? 'bg-white/90 backdrop-blur-xl border-white/70 shadow-[0_10px_35px_rgba(0,0,0,0.08)] py-2 px-6'
              : 'bg-white/90 backdrop-blur-lg border-white/60 shadow-[0_4px_24px_rgba(0,0,0,0.05)] py-2.5 px-6'
          }`}
        >
          <div className="flex items-center justify-between gap-4">
            <LogoButton />

            <nav className="flex items-center gap-1 lg:gap-1.5 text-xs lg:text-[13px] font-medium">
              <button onClick={() => handleNavClick('home')} className={navButtonClass(currentPage === 'home')}>
                Home
              </button>

              <button onClick={() => handleNavClick('shop')} className={navButtonClass(currentPage === 'shop')}>
                Shop
              </button>

              <div
                className="relative"
                onMouseEnter={() => setCategoriesMenuOpen(true)}
                onMouseLeave={() => setCategoriesMenuOpen(false)}
              >
                <button
                  onClick={() => setCategoriesMenuOpen((open) => !open)}
                  className={navButtonClass(categoriesMenuOpen || currentPage === 'category')}
                  aria-expanded={categoriesMenuOpen}
                >
                  Categories
                  <ChevronDown
                    className={`inline-block ml-1 w-3.5 h-3.5 transition-transform ${
                      categoriesMenuOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {categoriesMenuOpen && (
                  <div className="fixed left-0 right-0 top-[58px] z-50">
                    <CategoriesMegaMenu onClose={() => setCategoriesMenuOpen(false)} />
                  </div>
                )}
              </div>

              <button onClick={() => handleNavClick('about')} className={navButtonClass(currentPage === 'about')}>
                About Us
              </button>

              <button onClick={() => handleNavClick('our-gym')} className={navButtonClass(currentPage === 'our-gym')}>
                Our Gym
              </button>

              <button onClick={() => handleNavClick('contact')} className={navButtonClass(currentPage === 'contact')}>
                Contact
              </button>
            </nav>

            <div className="flex items-center gap-1.5 shrink-0">
              {isAdmin && (
                <button
                  onClick={() => handleNavClick('admin')}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 border transition-all ${
                    currentPage === 'admin'
                      ? 'bg-red-600 text-white border-red-600 shadow-md shadow-red-600/20'
                      : 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100'
                  }`}
                  title="Admin Inventory Dashboard"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                  Admin
                </button>
              )}

              <button
                onClick={() => setSearchOpen(true)}
                aria-label="Search supplements"
                className="w-9 h-9 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-700 hover:text-red-600 flex items-center justify-center transition-all cursor-pointer"
              >
                <Search className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  if (user) handleNavClick('account');
                  else openAuthModal('login');
                }}
                aria-label="My account"
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                  user
                    ? 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200'
                    : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700 hover:text-red-600'
                }`}
                title={user ? `Signed in as ${user.email}` : 'Sign in to account'}
              >
                <User className="w-4 h-4" />
              </button>

              <button
                onClick={() => handleNavClick('wishlist')}
                aria-label="My wishlist"
                className="relative w-9 h-9 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-700 hover:text-red-600 flex items-center justify-center transition-all cursor-pointer"
              >
                <Heart className="w-4 h-4" />
                {wishlist.length > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-red-600 text-white font-bold text-[9px] flex items-center justify-center">
                    {wishlist.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setCartOpen(true)}
                aria-label="Shopping cart"
                className="flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white py-2 px-3.5 rounded-full font-bold transition-all shadow-md shadow-red-600/20 active:scale-95 ml-1 cursor-pointer"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span className="text-xs font-mono">{cartCount}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE NAVBAR */}
      <div className="block md:hidden">
        <div
          className={`w-full rounded-2xl transition-all duration-300 border ${
            isScrolled
              ? 'bg-white/95 backdrop-blur-xl border-zinc-200 shadow-[0_6px_25px_rgba(0,0,0,0.08)] py-2 px-3'
              : 'bg-white/95 backdrop-blur-lg border-zinc-200/70 shadow-[0_2px_15px_rgba(0,0,0,0.04)] py-2 px-3'
          }`}
        >
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <button
                onClick={() => {
                  setMobileActiveTab('pages');
                  setMobileMenuOpen(true);
                }}
                className="w-10 h-10 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-900 flex items-center justify-center shrink-0 border border-zinc-200"
                aria-label="Open navigation menu"
              >
                <Menu className="w-5 h-5" />
              </button>
              <LogoButton mobile />
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              {isAdmin && (
                <button
                  onClick={() => handleNavClick('admin')}
                  className="px-2.5 py-1 rounded-lg bg-red-600 text-white text-[10px] font-bold uppercase tracking-wider"
                >
                  Admin
                </button>
              )}

              <button
                onClick={() => setSearchOpen(true)}
                className="w-9 h-9 rounded-xl bg-zinc-100 flex items-center justify-center text-zinc-700"
                aria-label="Search"
              >
                <Search className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  if (user) handleNavClick('account');
                  else openAuthModal('login');
                }}
                className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                  user ? 'bg-red-50 text-red-600' : 'bg-zinc-100 text-zinc-700'
                }`}
                aria-label="Account"
              >
                <User className="w-4 h-4" />
              </button>

              <button
                onClick={() => setCartOpen(true)}
                className="flex items-center gap-1 bg-red-600 text-white py-1.5 px-3 rounded-xl font-bold"
                aria-label="Cart"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span className="text-xs font-mono">{cartCount}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE DRAWER */}
      {mobileMenuOpen &&
        createPortal(
          <div className="fixed inset-0 z-50 flex md:hidden">
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
              onClick={() => setMobileMenuOpen(false)}
            />

            <div className="relative w-[85%] max-w-[340px] bg-white h-full shadow-2xl flex flex-col justify-between z-10 animate-in slide-in-from-left duration-300">
              {/* DRAWER HEADER */}
              <div className="p-4 border-b border-zinc-200 flex items-center justify-between shrink-0 bg-zinc-50">
                <LogoButton mobile />
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-8 h-8 rounded-lg bg-zinc-200/70 hover:bg-zinc-200 flex items-center justify-center text-zinc-600"
                  aria-label="Close menu"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* DRAWER TABS */}
              <div className="grid grid-cols-4 p-2 bg-zinc-100 border-b border-zinc-200 text-center gap-1 shrink-0">
                {(
                  [
                    { id: 'pages', label: 'Explore' },
                    { id: 'categories', label: 'Categories' },
                    { id: 'brands', label: 'Brands' },
                    { id: 'goals', label: 'Goals' },
                  ] as const
                ).map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setMobileActiveTab(tab.id)}
                    className={`py-2 px-1 text-[11px] font-bold rounded-lg transition-all ${
                      mobileActiveTab === tab.id
                        ? 'bg-white text-red-600 shadow-sm'
                        : 'text-zinc-600 hover:text-zinc-950'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* DRAWER CONTENT */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {mobileActiveTab === 'pages' && (
                  <div className="space-y-2">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 px-1 pb-1">
                      Store services and pages
                    </p>

                    {isAdmin && (
                      <button
                        onClick={() => handleNavClick('admin')}
                        className="w-full flex items-center justify-between p-3 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 text-left mb-2"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-red-600 text-white">
                            <ShieldAlert className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-xs font-bold uppercase text-red-700">
                              Admin Product Management
                            </div>
                            <div className="text-[10px] text-red-500">
                              Live database CRUD operations
                            </div>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-red-400" />
                      </button>
                    )}

                    {mobilePages.map((item) => (
                      <button
                        key={item.page}
                        onClick={() => {
                          if (item.page === 'account' && !user) {
                            setMobileMenuOpen(false);
                            openAuthModal('login');
                          } else {
                            handleNavClick(item.page);
                          }
                        }}
                        className="w-full flex items-center justify-between p-3 rounded-xl border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 text-left"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-white border border-zinc-200 text-zinc-700">
                            {item.icon}
                          </div>
                          <div>
                            <div className="text-xs font-bold uppercase text-zinc-900">
                              {item.title}
                            </div>
                            <div className="text-[10px] text-zinc-500">
                              {item.desc}
                            </div>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-zinc-400" />
                      </button>
                    ))}

                    {user && (
                      <button
                        onClick={async () => {
                          await signOut();
                          setMobileMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-2 p-3 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-xs font-bold text-zinc-600 text-left"
                      >
                        <LogOut className="w-4 h-4 text-red-600" />
                        <span>Sign Out ({user.email})</span>
                      </button>
                    )}

                    <div className="pt-3 border-t border-zinc-200">
                      <p className="text-[10px] font-bold uppercase text-zinc-400 mb-2">
                        Quick access
                      </p>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { page: 'home', label: 'Home' },
                          { page: 'shop', label: 'Shop' },
                          { page: 'wishlist', label: 'Wishlist' },
                        ].map((item) => (
                          <button
                            key={item.page}
                            onClick={() => handleNavClick(item.page)}
                            className="p-2.5 rounded-lg border border-zinc-200 bg-white text-xs font-bold"
                          >
                            {item.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {mobileActiveTab === 'categories' && (
                  <div className="space-y-2">
                    <p className="text-[10px] font-bold uppercase text-zinc-400">
                      Supplement categories
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {mobileCategories.map((category) => (
                        <button
                          key={category.slug}
                          onClick={() =>
                            handleNavClick('category', {
                              categorySlug: category.slug,
                            })
                          }
                          className="p-3 rounded-xl border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 text-left"
                        >
                          <div className="text-xs font-bold uppercase text-zinc-900">
                            {category.label}
                          </div>
                          <div className="text-[10px] text-zinc-500 mt-1">
                            {category.desc}
                          </div>
                          <div className="text-[10px] font-bold text-red-600 mt-2">
                            View items →
                          </div>
                        </button>
                      ))}
                    </div>
                    <button
                      onClick={() => handleNavClick('shop')}
                      className="w-full py-3 rounded-xl bg-zinc-950 text-white text-xs font-bold uppercase"
                    >
                      Browse all products →
                    </button>
                  </div>
                )}

                {mobileActiveTab === 'brands' && (
                  <div className="space-y-2">
                    <p className="text-[10px] font-bold uppercase text-zinc-400">
                      Brand partners
                    </p>
                    {mobileBrands.map((brand) => (
                      <button
                        key={brand.slug}
                        onClick={() =>
                          handleNavClick('brand', {
                            brandSlug: brand.slug,
                          })
                        }
                        className="w-full p-3 rounded-xl border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 text-left flex items-center justify-between gap-2"
                      >
                        <div>
                          <div className="text-xs font-bold uppercase text-zinc-900">
                            {brand.name}
                            <span className="ml-2 text-[9px] bg-zinc-200 px-1.5 py-0.5 rounded">
                              {brand.origin}
                            </span>
                          </div>
                          <div className="text-[10px] text-zinc-500 mt-1">
                            {brand.desc}
                          </div>
                        </div>
                        <span className="text-[10px] font-bold text-red-600">
                          Shop →
                        </span>
                      </button>
                    ))}
                    <button
                      onClick={() => handleNavClick('shop')}
                      className="w-full py-3 rounded-xl border border-zinc-300 bg-white text-xs font-bold uppercase"
                    >
                      Browse all products →
                    </button>
                  </div>
                )}

                {mobileActiveTab === 'goals' && (
                  <div className="space-y-2">
                    <p className="text-[10px] font-bold uppercase text-zinc-400">
                      Shop by fitness goal
                    </p>
                    {GOALS.map((goal) => (
                      <button
                        key={goal.id}
                        onClick={() =>
                          handleNavClick('goal', {
                            goalSlug: goal.slug,
                          })
                        }
                        className="group relative w-full rounded-xl overflow-hidden min-h-[90px] flex items-end p-3 text-left border border-zinc-800/20"
                      >
                        <img
                          src={goal.heroImage}
                          alt=""
                          className="absolute inset-0 w-full h-full object-cover"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/85 to-zinc-950/40" />
                        <div className="relative z-10 text-white flex items-center justify-between w-full">
                          <div className="min-w-0 pr-2">
                            <div className="text-[9px] font-bold uppercase text-red-400">
                              {goal.subtitle}
                            </div>
                            <h4 className="text-xs font-bold uppercase mt-1">
                              {goal.title}
                            </h4>
                            <p className="text-[10px] text-zinc-300 line-clamp-1 mt-1">
                              {goal.description}
                            </p>
                          </div>
                          <ChevronRight className="w-4 h-4 shrink-0 text-zinc-300" />
                        </div>
                      </button>
                    ))}
                    <button
                      onClick={() => handleNavClick('shop')}
                      className="w-full py-3 rounded-xl border border-zinc-300 bg-white text-xs font-bold uppercase flex items-center justify-center gap-2"
                    >
                      Explore all goals
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* DRAWER FOOTER */}
              <div className="p-3.5 bg-zinc-50 border-t border-zinc-200 space-y-2 shrink-0">
                <a
                  href="https://wa.me/918264325436"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold uppercase"
                >
                  <MessageCircle className="w-4 h-4" />
                  Chat on WhatsApp
                </a>

                <a
                  href="tel:+918264325436"
                  className="flex items-center justify-center gap-1.5 text-[11px] font-bold text-zinc-700 py-1"
                >
                  <Phone className="w-3 h-3 text-red-600" />
                  Call Us: +91-8264325436
                </a>

                <div className="flex items-center justify-center gap-1 text-[9px] font-semibold text-zinc-400 uppercase pt-2 border-t border-zinc-200">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  Direct importer · Batch verified
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
    </header>
  );
};