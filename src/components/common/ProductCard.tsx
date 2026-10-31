import React from 'react';
import { Product } from '../../types';
import { useStore } from '../../context/StoreContext';
import { formatCurrency } from '../../utils/formatters';
import { VegTag } from './VegTag';
import { Star, Heart, Eye, ShoppingBag, ShieldCheck } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  compact?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, toggleWishlist, isInWishlist, setQuickViewProduct, navigate } = useStore();
  const wishlisted = isInWishlist(product.id);
  const isOutOfStock = product.stock === 0;

  const handleCardClick = () => {
    navigate('product', { productId: product.id });
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.stopPropagation();
    setQuickViewProduct(product);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isOutOfStock) return;
    if (product.variants && product.variants.length > 0) {
      const defaultVariant =
        product.variants.find((v) => v.isActive !== false && v.stock > 0) || product.variants[0];
      addToCart(product, 1, defaultVariant.flavour, defaultVariant.weight, defaultVariant);
      return;
    }
    addToCart(product, 1);
  };

  return (
    <div
      onClick={handleCardClick}
      className={`group relative bg-white rounded-2xl border border-zinc-200/90 p-3 sm:p-4 transition-all duration-300 card-hover hover:border-red-600/50 flex flex-col justify-between cursor-pointer select-none ${
        isOutOfStock ? 'opacity-90' : ''
      }`}
    >
      {/* Top Badges & Wishlist */}
      <div className="relative w-full aspect-square bg-zinc-50 rounded-xl overflow-hidden mb-3 flex items-center justify-center p-3">
        {/* Out of Stock OR Discount Badge */}
        {isOutOfStock ? (
          <div className="absolute top-2.5 left-2.5 z-10 bg-zinc-900 text-white font-bold text-[10px] sm:text-[11px] px-2 py-0.5 rounded shadow-sm tracking-wider uppercase">
            OUT OF STOCK
          </div>
        ) : product.discount > 0 ? (
          <div className="absolute top-2.5 left-2.5 z-10 bg-red-600 text-white font-bold text-[11px] px-2 py-0.5 rounded shadow-sm uppercase">
            {product.discount}% OFF
          </div>
        ) : null}

        {/* 100% Authentic Micro Tag - Hide on quick view hover to prevent any overlap */}
        <div className="absolute bottom-2 left-2.5 z-10 hidden sm:flex items-center gap-1 bg-white/95 backdrop-blur-sm text-[10px] font-semibold text-zinc-700 px-1.5 py-0.5 rounded border border-zinc-200/80 shadow-2xs group-hover:opacity-0 transition-opacity">
          <ShieldCheck className="w-3 h-3 text-emerald-600" />
          <span>100% Genuine</span>
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlist}
          aria-label="Toggle Wishlist"
          className={`absolute top-2.5 right-2.5 z-10 p-2 rounded-full backdrop-blur-md transition-all duration-200 cursor-pointer ${
            wishlisted
              ? 'bg-red-50 text-red-600 shadow-sm'
              : 'bg-white/85 text-zinc-400 hover:text-red-600 hover:bg-white shadow-xs'
          }`}
        >
          <Heart className={`w-4 h-4 ${wishlisted ? 'fill-current' : ''}`} />
        </button>

        {/* Product Image */}
        <img
          src={product.images[0]}
          alt={product.name}
          className={`w-full h-full object-contain mix-blend-multiply group-hover:scale-108 transition-transform duration-300 ease-out ${
            isOutOfStock ? 'grayscale-40' : ''
          }`}
          referrerPolicy="no-referrer"
          loading="lazy"
        />

        {/* Quick View Hover Overlay Button */}
        <div className="absolute inset-x-3 bottom-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hidden md:block">
          <button
            onClick={handleQuickView}
            className="w-full bg-zinc-900/90 hover:bg-black text-white text-xs font-btn py-2 rounded-lg backdrop-blur-sm flex items-center justify-center gap-1.5 transition-colors shadow-lg cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Quick View</span>
          </button>
        </div>
      </div>

      {/* Info Area */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          {/* Top Line: Brand + Veg/Non-Veg Tag (Every Product) */}
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-zinc-500 truncate">
              <span className="text-red-600 font-bold truncate">{product.brand}</span>
              <span aria-hidden="true" className="text-zinc-300">·</span>
              <span className="truncate">{product.category}</span>
            </div>

            {/* Veg / Non-Veg Tag from image 5 on EVERY product */}
            <VegTag type={product.dietary} size="sm" />
          </div>

          {/* Product Name (Josefin Sans / Montserrat Bold ALL CAPS) - Uniform height prevents jagged cards */}
          <h3 className="font-card font-bold text-xs sm:text-sm text-zinc-950 group-hover:text-red-600 transition-colors line-clamp-2 leading-snug mb-1.5 uppercase min-h-[2.5rem]">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mb-2">
            <div className="flex items-center gap-0.5 text-amber-500 text-xs font-bold">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span>{product.rating}</span>
            </div>
            <span className="text-[11px] text-zinc-400">({product.reviewCount})</span>
          </div>

          {/* Form / Flavor / Size Badge */}
          {product.variants && product.variants.length > 0 ? (
            <div className="mb-2.5">
              <span className="inline-block text-[10px] font-medium text-zinc-600 bg-zinc-100 border border-zinc-200/80 px-2 py-0.5 rounded truncate max-w-full">
                {Array.from(new Set(product.variants.map((v) => v.flavour))).length} Flavours • {product.variants.length} Options
              </span>
            </div>
          ) : product.flavours?.length > 0 || product.sizes?.length > 0 ? (
            <div className="mb-2.5">
              <span className="inline-block text-[10px] font-medium text-zinc-600 bg-zinc-100 border border-zinc-200/80 px-2 py-0.5 rounded truncate max-w-full">
                {product.flavours?.[0] ? `${product.flavours[0]} • ` : ''}
                {product.sizes?.[0] || 'Standard'}
              </span>
            </div>
          ) : null}
        </div>

        {/* Price & Add to Cart — Clean spacing and no wrapping overlap */}
        <div className="pt-2 border-t border-zinc-100 flex items-center justify-between gap-2">
          <div className="min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-baseline sm:gap-1.5">
              {/* Price in Montserrat Bold */}
              <span className="font-price text-sm sm:text-base text-zinc-950 tabular-nums font-bold">
                {product.variants && product.variants.length > 1 && (
                  <span className="text-[10px] font-normal text-zinc-500 mr-1">From</span>
                )}
                {formatCurrency(
                  product.variants && product.variants.length > 0
                    ? Math.min(...product.variants.filter((v) => v.price > 0).map((v) => v.price))
                    : product.price
                )}
              </span>
              {product.originalPrice > product.price && (
                <span className="font-mono text-[10px] sm:text-xs line-through text-zinc-400 tabular-nums">
                  {formatCurrency(product.originalPrice)}
                </span>
              )}
            </div>
          </div>

          {isOutOfStock ? (
            <button
              disabled
              className="bg-zinc-200 text-zinc-500 text-xs font-btn py-2 px-2.5 rounded-lg flex items-center gap-1 cursor-not-allowed shrink-0"
            >
              <span>Sold Out</span>
            </button>
          ) : (
            <button
              onClick={handleAddToCart}
              className="bg-red-600 hover:bg-red-700 active:scale-95 text-white text-xs font-btn py-2 px-3 sm:px-3.5 rounded-lg flex items-center gap-1.5 transition-all shadow-sm shadow-red-600/20 cursor-pointer shrink-0"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Add</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
