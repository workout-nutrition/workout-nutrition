import React from 'react';
import { useStore } from '../../context/StoreContext';
import { BRANDS } from '../../data/brands';
import { ArrowRight, ShieldCheck } from 'lucide-react';

interface BrandMegaMenuProps {
  onClose: () => void;
}

export const BrandMegaMenu: React.FC<BrandMegaMenuProps> = ({ onClose }) => {
  const { navigate } = useStore();

  const handleBrandClick = (brandSlug: string) => {
    navigate('brand', { brandSlug });
    onClose();
  };

  return (
    <div
      onMouseLeave={onClose}
      className="absolute top-full left-0 w-full bg-white text-zinc-900 border-b border-zinc-200 shadow-2xl z-50 animate-in fade-in slide-in-from-top-1 duration-200"
    >
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-zinc-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-600" />
              <h3 className="font-heading font-black text-base uppercase tracking-wider text-zinc-900">
                100% AUTHORIZED BRAND PARTNERS
              </h3>
            </div>
            <p className="text-xs text-zinc-500 mt-0.5">
              Every supplement imported directly from verified brand manufacturers with original importer authenticity hologram.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-zinc-600 bg-zinc-50 px-3 py-1.5 rounded-lg border border-zinc-200/80">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Batch Scratch-Code Guarantee</span>
          </div>
        </div>

        {/* Brands Grid (5 columns x 4 rows = 20 brands) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {BRANDS.map((brand) => (
            <button
              key={brand.id}
              onClick={() => handleBrandClick(brand.slug)}
              className="group p-3 rounded-xl border border-zinc-100 bg-zinc-50/70 hover:bg-white hover:border-red-600/40 hover:shadow-md transition-all duration-200 text-left flex flex-col justify-between cursor-pointer"
            >
              <div className="flex items-start justify-between gap-1 mb-1.5">
                <span className="font-heading font-bold text-xs sm:text-sm text-zinc-900 group-hover:text-red-600 transition-colors">
                  {brand.name}
                </span>
                <span className="text-[10px] font-mono text-zinc-400 uppercase">
                  {brand.origin}
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-zinc-500">
                <span className="truncate pr-1 group-hover:text-zinc-700 transition-colors">
                  {brand.badge || 'Verified Brand'}
                </span>
                <ArrowRight className="w-3 h-3 text-zinc-300 group-hover:text-red-600 group-hover:translate-x-0.5 transition-all shrink-0" />
              </div>
            </button>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t border-zinc-100 flex items-center justify-between text-xs">
          <span className="text-zinc-500">
            Showing all {BRANDS.length} brands from your stock list.
          </span>
          <button
            onClick={() => {
              navigate('shop');
              onClose();
            }}
            className="text-red-600 font-bold hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>Browse Complete Marketplace Catalog</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
