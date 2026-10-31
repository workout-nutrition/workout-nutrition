import React, { useState, useMemo, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { formatCurrency } from '../../utils/formatters';
import { VegTag } from './VegTag';
import { X, Star, Heart, ShoppingBag, ArrowRight } from 'lucide-react';

export const QuickViewModal: React.FC = () => {
  const {
    quickViewProduct,
    setQuickViewProduct,
    addToCart,
    toggleWishlist,
    isInWishlist,
    navigate,
  } = useStore();

  const [selectedFlavour, setSelectedFlavour] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState(1);

  const product = quickViewProduct;

  const hasDynamicVariants = Array.isArray(product?.variants) && product!.variants.length > 0;

  // Available flavours
  const availableFlavours = useMemo(() => {
    if (!product) return [];
    if (hasDynamicVariants) {
      const unique = Array.from(
        new Set(product.variants!.map((v) => v.flavour.trim()).filter(Boolean))
      );
      if (unique.length > 0) return unique;
    }
    return product.flavours.length > 0 ? product.flavours : ['Standard'];
  }, [product, hasDynamicVariants]);

  // Current flavour
  const currentFlavour = selectedFlavour || availableFlavours[0] || 'Standard';

  // Variants under current flavour
  const flavourVariants = useMemo(() => {
    if (!product || !hasDynamicVariants) return [];
    return product.variants!.filter(
      (v) => v.flavour.trim().toLowerCase() === currentFlavour.trim().toLowerCase()
    );
  }, [product, hasDynamicVariants, currentFlavour]);

  // Available weights/sizes
  const availableWeights = useMemo(() => {
    if (!product) return [];
    if (hasDynamicVariants) {
      return flavourVariants.map((v) => v.weight);
    }
    return product.sizes.length > 0 ? product.sizes : ['Standard'];
  }, [product, hasDynamicVariants, flavourVariants]);

  // Current size
  const currentSize = selectedSize || availableWeights[0] || 'Standard';

  // Sync size when flavour changes
  useEffect(() => {
    if (availableWeights.length > 0 && !availableWeights.some((w) => w.toLowerCase() === currentSize.toLowerCase())) {
      setSelectedSize(availableWeights[0]);
    }
  }, [availableWeights, currentSize]);

  // Active Variant & Pricing
  const activeVariant = useMemo(() => {
    if (!hasDynamicVariants) return undefined;
    return (
      flavourVariants.find(
        (v) => v.weight.trim().toLowerCase() === currentSize.trim().toLowerCase()
      ) || flavourVariants[0]
    );
  }, [hasDynamicVariants, flavourVariants, currentSize]);

  const sizeVariant = product?.sizeVariants?.find(
    (v) => v.size.trim().toLowerCase() === currentSize.trim().toLowerCase()
  );

  const activePrice = activeVariant
    ? activeVariant.price
    : sizeVariant?.price && sizeVariant.price > 0
    ? sizeVariant.price
    : product?.price || 0;

  const activeOriginalPrice =
    activeVariant?.originalPrice && activeVariant.originalPrice > 0
      ? activeVariant.originalPrice
      : sizeVariant?.originalPrice && sizeVariant.originalPrice > 0
      ? sizeVariant.originalPrice
      : product?.originalPrice || 0;

  const activeDiscount =
    activeOriginalPrice > activePrice && activeOriginalPrice > 0
      ? Math.round(((activeOriginalPrice - activePrice) / activeOriginalPrice) * 100)
      : product?.discount || 0;

  const isOutOfStock = activeVariant
    ? activeVariant.stock <= 0 || activeVariant.isActive === false
    : product?.stock === 0;

  if (!product) return null;

  const isWishlisted = isInWishlist(product.id);

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    const productToAdd = {
      ...product,
      price: activePrice,
      originalPrice: activeOriginalPrice,
      discount: activeDiscount,
    };
    addToCart(productToAdd, quantity, currentFlavour, currentSize, activeVariant);
    setQuickViewProduct(null);
  };

  const handleViewFullDetails = () => {
    setQuickViewProduct(null);
    navigate('product', { productId: product.id });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl relative max-h-[90vh] flex flex-col md:flex-row">
        {/* Close Button */}
        <button
          onClick={() => setQuickViewProduct(null)}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-600 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Product Image Area */}
        <div className="w-full md:w-1/2 bg-zinc-50 p-6 flex items-center justify-center relative border-b md:border-b-0 md:border-r border-zinc-100">
          <img
            src={product.images[0]}
            alt={product.name}
            className={`max-h-72 object-contain rounded-xl hover:scale-105 transition-transform duration-300 ${isOutOfStock ? 'grayscale-40' : ''}`}
            referrerPolicy="no-referrer"
          />
          {isOutOfStock ? (
            <span className="absolute top-4 left-4 bg-zinc-900 text-white font-mono font-bold text-xs px-2.5 py-1 rounded-md uppercase tracking-wider">
              OUT OF STOCK
            </span>
          ) : activeDiscount > 0 ? (
            <span className="absolute top-4 left-4 bg-red-600 text-white font-mono font-bold text-xs px-2.5 py-1 rounded-md">
              {activeDiscount}% OFF
            </span>
          ) : null}
        </div>

        {/* Details & Actions Area */}
        <div className="w-full md:w-1/2 p-6 flex flex-col justify-between overflow-y-auto">
          <div>
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className="text-[11px] uppercase font-bold text-red-600 tracking-wider">
                {product.brand}
              </span>
              <VegTag type={product.dietary} size="sm" />
            </div>

            <h3 className="font-product-name text-lg text-zinc-900 leading-tight mb-2">
              {product.name}
            </h3>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-3 text-xs">
              <div className="flex items-center gap-1 text-amber-500 font-bold bg-amber-50 px-2 py-0.5 rounded">
                <Star className="w-3.5 h-3.5 fill-current" />
                <span>{product.rating}</span>
              </div>
              <span className="text-zinc-400">({product.reviewCount} Verified Reviews)</span>
            </div>

            {/* Dynamic Price Display */}
            <div className="flex items-baseline gap-2.5 mb-4">
              <span className="font-price text-2xl text-zinc-950 tabular-nums">
                {formatCurrency(activePrice)}
              </span>
              {activeOriginalPrice > activePrice && (
                <span className="font-mono text-sm line-through text-zinc-400 tabular-nums">
                  {formatCurrency(activeOriginalPrice)}
                </span>
              )}
              {activeOriginalPrice > activePrice && (
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                  Save {formatCurrency(activeOriginalPrice - activePrice)}
                </span>
              )}
            </div>

            {/* Flavour Options */}
            {availableFlavours.length > 0 && (
              <div className="mb-3">
                <div className="text-xs font-bold text-zinc-700 mb-1.5">
                  Flavour: <span className="font-semibold text-red-600">{currentFlavour}</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {availableFlavours.map((flv) => (
                    <button
                      key={flv}
                      onClick={() => setSelectedFlavour(flv)}
                      className={`text-xs px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                        currentFlavour.toLowerCase() === flv.toLowerCase()
                          ? 'border-red-600 bg-red-50 text-red-700 font-bold'
                          : 'border-zinc-200 text-zinc-600 hover:border-zinc-300'
                      }`}
                    >
                      {flv}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size Options (with dynamic price indicator) */}
            {availableWeights.length > 0 && (
              <div className="mb-4">
                <div className="text-xs font-bold text-zinc-700 mb-1.5">
                  Size: <span className="font-semibold text-red-600">{currentSize}</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {availableWeights.map((sz) => {
                    const isSelected = currentSize.toLowerCase() === sz.toLowerCase();
                    const vMatch = hasDynamicVariants
                      ? flavourVariants.find((v) => v.weight.trim().toLowerCase() === sz.trim().toLowerCase())
                      : undefined;
                    const legMatch = !hasDynamicVariants
                      ? product.sizeVariants?.find((v) => v.size.trim().toLowerCase() === sz.trim().toLowerCase())
                      : undefined;
                    const szPrice = vMatch ? vMatch.price : legMatch?.price && legMatch.price > 0 ? legMatch.price : product.price;

                    return (
                      <button
                        key={sz}
                        onClick={() => setSelectedSize(sz)}
                        className={`text-xs px-3 py-1.5 rounded-lg border transition-all cursor-pointer flex items-center gap-1.5 ${
                          isSelected
                            ? 'border-red-600 bg-red-50 text-red-700 font-bold shadow-xs'
                            : 'border-zinc-200 text-zinc-600 hover:border-zinc-300'
                        }`}
                      >
                        <span>{sz}</span>
                        <span className={`text-[10px] font-mono ${isSelected ? 'text-red-700' : 'text-zinc-400'}`}>
                          ({formatCurrency(szPrice)})
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quick Benefits */}
            <div className="border-t border-zinc-100 pt-3 mb-4 space-y-1">
              {product.benefits.slice(0, 2).map((benefit, i) => (
                <div key={i} className="text-xs text-zinc-600 flex items-start gap-1.5">
                  <span className="text-emerald-600 font-bold shrink-0">✓</span>
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Row */}
          <div className="space-y-3 pt-2">
            <div className="flex gap-2.5">
              {isOutOfStock ? (
                <button
                  disabled
                  className="flex-1 bg-zinc-200 text-zinc-400 font-btn text-xs uppercase tracking-wider py-3 px-4 rounded-xl cursor-not-allowed text-center"
                >
                  Out of Stock
                </button>
              ) : (
                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white font-btn text-xs uppercase tracking-wider py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-md shadow-red-600/20 transition-colors cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Cart ({formatCurrency(activePrice)})</span>
                </button>
              )}

              <button
                onClick={() => toggleWishlist(product)}
                className={`p-3 rounded-xl border transition-colors cursor-pointer ${
                  isWishlisted
                    ? 'border-red-600 bg-red-50 text-red-600'
                    : 'border-zinc-200 text-zinc-500 hover:border-zinc-400'
                }`}
                title="Wishlist"
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
              </button>
            </div>

            <button
              onClick={handleViewFullDetails}
              className="w-full text-xs text-zinc-500 hover:text-zinc-900 font-semibold flex items-center justify-center gap-1 cursor-pointer"
            >
              <span>View Full Nutrition Facts & Verified Reviews</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
