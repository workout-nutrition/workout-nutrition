import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from '../common/ProductCard';
import { VegTag } from '../common/VegTag';
import { formatCurrency } from '../../utils/formatters';
import { usePageSEO } from '../../utils/seo';
import {
  Star,
  ShieldCheck,
  Truck,
  CreditCard,
  Heart,
  ShoppingBag,
  Zap,
  Plus,
  Minus,
  Check,
  Clock,
  ArrowRight,
  HelpCircle,
  Award,
  Layers,
  Sparkles,
  Info,
  AlertTriangle,
  MapPin,
  Package,
  Send,
  User,
  MessageSquare,
} from 'lucide-react';

/* ── Pincode Delivery Estimation Helper ─────────────────────────── */
const PINCODE_ZONES: Record<string, { days: string; label: string }> = {
  '1': { days: '2–3', label: 'North India (Delhi NCR, UP, Haryana, Punjab)' },
  '2': { days: '4–5', label: 'West India (Rajasthan, Gujarat)' },
  '3': { days: '3–4', label: 'West India (Maharashtra, Goa)' },
  '4': { days: '3–5', label: 'South-West India (Maharashtra, Karnataka)' },
  '5': { days: '4–6', label: 'South India (Telangana, Andhra Pradesh)' },
  '6': { days: '5–7', label: 'South India (Tamil Nadu, Kerala)' },
  '7': { days: '5–7', label: 'East India (West Bengal, Odisha, NE States)' },
  '8': { days: '5–7', label: 'East India (Bihar, Jharkhand)' },
  '9': { days: '6–8', label: 'Army / Remote Regions' },
};

function getDeliveryEstimate(pincode: string): { days: string; label: string } | null {
  if (!/^\d{6}$/.test(pincode)) return null;
  const zone = pincode[0];
  return PINCODE_ZONES[zone] || { days: '5–7', label: 'Standard Delivery Zone' };
}

/* ── Product Reviews Helpers ─────────────────────────────────────── */
interface ProductReview {
  id: string;
  productId: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
  verified: boolean;
}

function getStoredReviews(productId: string): ProductReview[] {
  try {
    const all = JSON.parse(localStorage.getItem('wn_product_reviews') || '[]') as ProductReview[];
    return all.filter((r) => r.productId === productId);
  } catch {
    return [];
  }
}

function saveReview(review: ProductReview): void {
  try {
    const all = JSON.parse(localStorage.getItem('wn_product_reviews') || '[]') as ProductReview[];
    all.unshift(review);
    localStorage.setItem('wn_product_reviews', JSON.stringify(all));
  } catch {
    // ignore
  }
}

export const ProductDetailPage: React.FC = () => {
  const { products, routeParams, addToCart, toggleWishlist, isInWishlist, navigate } = useStore();

  const productId = routeParams.productId;
  const product = products.find((p) => p.id === productId || p.slug === productId) || products[0];

  if (!product) {
    return (
      <div className="bg-zinc-50 min-h-screen py-20 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-zinc-600 text-sm font-medium">Loading live product from database...</p>
        </div>
      </div>
    );
  }

  const hasDynamicVariants = Array.isArray(product.variants) && product.variants.length > 0;

  // Available flavours from dynamic variants or fallback to product.flavours
  const availableFlavours = useMemo(() => {
    if (hasDynamicVariants) {
      const unique = Array.from(
        new Set(product.variants!.map((v) => v.flavour.trim()).filter(Boolean))
      );
      if (unique.length > 0) return unique;
    }
    return product.flavours.length > 0 ? product.flavours : ['Standard'];
  }, [product, hasDynamicVariants]);

  const [selectedFlavour, setSelectedFlavour] = useState(
    () => availableFlavours[0] || 'Standard'
  );

  // Sync selected flavour if product changes
  useEffect(() => {
    if (!availableFlavours.some((f) => f.toLowerCase() === selectedFlavour.toLowerCase())) {
      setSelectedFlavour(availableFlavours[0] || 'Standard');
    }
  }, [availableFlavours, selectedFlavour]);

  // Dynamic variants under currently selected flavour
  const flavourVariants = useMemo(() => {
    if (!hasDynamicVariants) return [];
    return product.variants!.filter(
      (v) => v.flavour.trim().toLowerCase() === selectedFlavour.trim().toLowerCase()
    );
  }, [product.variants, hasDynamicVariants, selectedFlavour]);

  // Available weights/sizes specifically under selected flavour
  const availableWeights = useMemo(() => {
    if (hasDynamicVariants) {
      return flavourVariants.map((v) => v.weight);
    }
    return product.sizes.length > 0 ? product.sizes : ['Standard'];
  }, [hasDynamicVariants, flavourVariants, product.sizes]);

  const [selectedSize, setSelectedSize] = useState(
    () => availableWeights[0] || 'Standard'
  );

  // Sync selected weight when flavour or product changes
  useEffect(() => {
    if (!availableWeights.some((w) => w.toLowerCase() === selectedSize.toLowerCase())) {
      setSelectedSize(availableWeights[0] || 'Standard');
    }
  }, [availableWeights, selectedSize]);

  const handleFlavourChange = (newFlavour: string) => {
    setSelectedFlavour(newFlavour);
    if (hasDynamicVariants) {
      const nextFlavourVariants = product.variants!.filter(
        (v) => v.flavour.trim().toLowerCase() === newFlavour.trim().toLowerCase()
      );
      const stillValid = nextFlavourVariants.some(
        (v) => v.weight.trim().toLowerCase() === selectedSize.trim().toLowerCase()
      );
      if (!stillValid && nextFlavourVariants.length > 0) {
        setSelectedSize(nextFlavourVariants[0].weight);
      }
    }
  };

  // Active Variant
  const activeVariant = useMemo(() => {
    if (!hasDynamicVariants) return undefined;
    return (
      flavourVariants.find(
        (v) => v.weight.trim().toLowerCase() === selectedSize.trim().toLowerCase()
      ) || flavourVariants[0]
    );
  }, [hasDynamicVariants, flavourVariants, selectedSize]);

  // Per-size pricing fallback (legacy)
  const sizeVariant = product.sizeVariants?.find(
    (v) => v.size.trim().toLowerCase() === selectedSize.trim().toLowerCase()
  );

  const activePrice = activeVariant
    ? activeVariant.price
    : sizeVariant?.price && sizeVariant.price > 0
    ? sizeVariant.price
    : product.price;

  const activeOriginalPrice =
    activeVariant?.originalPrice && activeVariant.originalPrice > 0
      ? activeVariant.originalPrice
      : sizeVariant?.originalPrice && sizeVariant.originalPrice > 0
      ? sizeVariant.originalPrice
      : product.originalPrice;

  const activeDiscount =
    activeOriginalPrice > activePrice && activeOriginalPrice > 0
      ? Math.round(((activeOriginalPrice - activePrice) / activeOriginalPrice) * 100)
      : product.discount;

  const activeStock = activeVariant ? activeVariant.stock : product.stock;

  const isVariantOutOfStock = activeVariant
    ? activeVariant.stock <= 0 || activeVariant.isActive === false
    : product.stock === 0;

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isZoomed, setIsZoomed] = useState(false);

  const isWishlisted = isInWishlist(product.id);

  /* ── Pincode Estimation State ── */
  const [pincodeInput, setPincodeInput] = useState('');
  const [pincodeEstimate, setPincodeEstimate] = useState<{ days: string; label: string } | null>(null);
  const [pincodeError, setPincodeError] = useState<string | null>(null);

  const handleCheckPincode = () => {
    if (!/^\d{6}$/.test(pincodeInput)) {
      setPincodeError('Please enter a valid 6-digit postal pincode');
      setPincodeEstimate(null);
      return;
    }
    setPincodeError(null);
    const est = getDeliveryEstimate(pincodeInput);
    setPincodeEstimate(est);
  };

  /* ── Product Reviews State ── */
  const defaultReviews: ProductReview[] = useMemo(
    () => [
      {
        id: 'seed-1',
        productId: product.id,
        author: 'Satheesh',
        rating: 5,
        comment: 'Good Taste with good protein profile. Mixability is smooth and no bloating after heavy workouts.',
        date: 'Oct 5, 2026',
        verified: true,
      },
      {
        id: 'seed-2',
        productId: product.id,
        author: 'Afzal Zatkal',
        rating: 5,
        comment: 'Super product with great taste and genuine batch seal verified online directly.',
        date: 'Oct 15, 2026',
        verified: true,
      },
      {
        id: 'seed-3',
        productId: product.id,
        author: 'Anonymous',
        rating: 5,
        comment: 'It was actually the original product. Fast delivery and happy with my purchase.',
        date: 'Sep 14, 2026',
        verified: true,
      },
      {
        id: 'seed-4',
        productId: product.id,
        author: 'Arun K.',
        rating: 4,
        comment: 'Good recovery after intense training sessions. Highly recommended for daily fitness.',
        date: 'Oct 23, 2026',
        verified: true,
      },
    ],
    [product.id]
  );

  const [reviews, setReviews] = useState<ProductReview[]>(() => {
    const stored = getStoredReviews(product.id);
    return [...stored, ...defaultReviews];
  });

  useEffect(() => {
    const stored = getStoredReviews(product.id);
    setReviews([...stored, ...defaultReviews]);
  }, [product.id, defaultReviews]);

  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewerName, setReviewerName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewFormSuccess, setReviewFormSuccess] = useState(false);

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewerName.trim() || !reviewComment.trim()) return;

    const newRev: ProductReview = {
      id: `rev-${Date.now()}`,
      productId: product.id,
      author: reviewerName.trim(),
      rating: reviewRating,
      comment: reviewComment.trim(),
      date: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      verified: true,
    };

    saveReview(newRev);
    setReviews((prev) => [newRev, ...prev]);
    setReviewerName('');
    setReviewComment('');
    setReviewRating(5);
    setReviewFormSuccess(true);
    setTimeout(() => {
      setReviewFormSuccess(false);
      setShowReviewForm(false);
    }, 2000);
  };

  usePageSEO({
    title: `${product.name} (${product.brand}) – ₹${activePrice.toLocaleString('en-IN')}`,
    description: `Buy 100% authentic ${product.name} by ${product.brand} online in India at ₹${activePrice}. Genuine importer seal, lab-tested quality, fast dispatch.`,
    image: product.images?.[0],
    type: 'product',
  });

  const handleAddToCart = () => {
    if (isVariantOutOfStock) return;
    const productToAdd = {
      ...product,
      price: activePrice,
      originalPrice: activeOriginalPrice,
      discount: activeDiscount,
    };
    addToCart(productToAdd, quantity, selectedFlavour, selectedSize, activeVariant);
  };

  const handleBuyNow = () => {
    if (isVariantOutOfStock) return;
    const productToAdd = {
      ...product,
      price: activePrice,
      originalPrice: activeOriginalPrice,
      discount: activeDiscount,
    };
    addToCart(productToAdd, quantity, selectedFlavour, selectedSize, activeVariant);
    navigate('checkout');
  };

  // Related products from same category or brand
  const relatedProducts = products.filter(
    (p) => p.id !== product.id && (p.category === product.category || p.brand === product.brand)
  ).slice(0, 4);

  // Fallback fitness guidance if not explicitly on product
  const whoIsItFor = product.whoIsItFor || [
    'Muscle building & recovery',
    'Strength & resistance training',
    'Meeting daily high-protein targets',
    'Active fitness lifestyle support',
  ];
  const whenToUse = product.howToUse || product.whenToUse || 'Follow the instructions printed on the product packaging.';
  const whenToUseLines = whenToUse.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  const goalSupported = product.goalSupported || 'Supports muscle repair, tissue synthesis, and exercise recovery.';
  const authenticityInfo = product.authenticityDetails || 'Tamper-evident holographic importer seal with unique scratch-off SMS verification code directly on official brand portal.';

  const hasNutritionFacts =
    Array.isArray(product.nutritionFacts) &&
    product.nutritionFacts.some((f) => Boolean(f.nutrient?.trim() || f.amountPerServing?.trim()));
  const validNutritionFacts = hasNutritionFacts
    ? product.nutritionFacts.filter((f) => Boolean(f.nutrient?.trim() || f.amountPerServing?.trim()))
    : [];
  const hasIngredients = Boolean(product.ingredients && product.ingredients.trim());
  const hasBenefits =
    Array.isArray(product.benefits) &&
    product.benefits.some((b) => Boolean(b && b.trim()));
  const validBenefits = hasBenefits ? product.benefits.filter((b) => Boolean(b && b.trim())) : [];
  const servingsLabel =
    product.servings && product.servings > 0 ? ` (${product.servings} SERVINGS PER PACK)` : '';

  return (
    <div className="bg-zinc-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs text-zinc-500 mb-6 overflow-x-auto whitespace-nowrap">
          <button onClick={() => navigate('home')} className="hover:text-red-600 cursor-pointer">
            Home
          </button>
          <span>/</span>
          <button onClick={() => navigate('shop')} className="hover:text-red-600 cursor-pointer">
            Supplements
          </button>
          <span>/</span>
          <button
            onClick={() => navigate('category', { categorySlug: product.category.toLowerCase().replace(/\s+/g, '-') })}
            className="hover:text-red-600 cursor-pointer"
          >
            {product.category}
          </button>
          <span>/</span>
          <span className="text-zinc-900 font-semibold truncate max-w-xs">{product.name}</span>
        </div>

        {/* TOP SECTION: Gallery Left (5 cols) & Purchase Module Right (7 cols) */}
        <div className="bg-white border border-zinc-200/80 rounded-3xl p-6 sm:p-8 lg:p-10 mb-10 shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            {/* LEFT: Image Gallery */}
            <div className="lg:col-span-5 space-y-4">
              <div
                className="relative aspect-square bg-zinc-50 rounded-2xl border border-zinc-200/80 p-6 sm:p-8 flex items-center justify-center overflow-hidden group select-none"
                onMouseEnter={() => setIsZoomed(true)}
                onMouseLeave={() => setIsZoomed(false)}
              >
                {product.discount > 0 && (
                  <div className="absolute top-4 left-4 z-10 bg-red-600 text-white font-mono font-bold text-xs px-2.5 py-1 rounded shadow-xs">
                    SAVE {product.discount}%
                  </div>
                )}

                <button
                  onClick={() => toggleWishlist(product)}
                  aria-label="Wishlist"
                  className={`absolute top-4 right-4 z-10 p-2.5 rounded-full backdrop-blur-md transition-all cursor-pointer ${
                    isWishlisted
                      ? 'bg-red-50 text-red-600 shadow-sm'
                      : 'bg-white/90 text-zinc-400 hover:text-red-600 shadow-xs'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
                </button>

                <img
                  src={product.images[selectedImageIndex] || product.images[0]}
                  alt={product.name}
                  className={`w-full h-full object-contain mix-blend-multiply transition-transform duration-300 ease-out ${
                    isZoomed ? 'scale-125 cursor-zoom-in' : 'scale-100'
                  }`}
                  referrerPolicy="no-referrer"
                />

                <span className="absolute bottom-3 right-3 text-[10px] text-zinc-400 bg-white/80 px-2 py-0.5 rounded font-mono hidden sm:inline">
                  Hover to zoom
                </span>
              </div>

              {/* Thumbnails */}
              {product.images.length > 1 && (
                <div className="flex gap-3">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`w-20 h-20 rounded-xl bg-zinc-50 border p-2 overflow-hidden transition-all cursor-pointer ${
                        selectedImageIndex === idx
                          ? 'border-red-600 ring-2 ring-red-600/20 shadow-xs'
                          : 'border-zinc-200 hover:border-zinc-300'
                      }`}
                    >
                      <img
                        src={img}
                        alt={`Thumbnail ${idx + 1}`}
                        className="w-full h-full object-contain"
                        referrerPolicy="no-referrer"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* RIGHT: Product Details & Purchase Module */}
            <div className="lg:col-span-7 flex flex-col justify-between">
              <div>
                {/* Brand Link & Dietary Tag */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <button
                    onClick={() => navigate('brand', { brandSlug: product.brand.toLowerCase().replace(/\s+/g, '-') })}
                    className="text-xs uppercase font-mono font-bold tracking-wider text-red-600 hover:underline cursor-pointer"
                  >
                    {product.brand} · OFFICIAL STORE
                  </button>

                  {/* Veg / Non-Veg Tag */}
                  <VegTag type={product.dietary} size="md" />
                </div>

                {/* Name: Montserrat 600 weight */}
                <h1 className="font-product-name text-2xl sm:text-3xl lg:text-4xl text-zinc-950 font-semibold tracking-tight leading-tight mb-3">
                  {product.name}
                </h1>

                {/* Rating & Stock Status */}
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <div className="flex items-center gap-1 text-amber-500 bg-amber-50 px-2.5 py-1 rounded-lg font-semibold text-xs">
                    <Star className="w-4 h-4 fill-current" />
                    <span>{product.rating}</span>
                  </div>
                  <span className="text-xs text-zinc-500 font-normal">
                    <strong className="font-semibold text-zinc-800">{product.reviewCount}</strong> Verified Customer Reviews
                  </span>
                  <span className="text-zinc-300">·</span>
                  {isVariantOutOfStock ? (
                    <span className="text-xs font-semibold text-red-600 bg-red-50 px-2.5 py-1 rounded-lg flex items-center gap-1 border border-red-200">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      OUT OF STOCK ({selectedFlavour} · {selectedSize})
                    </span>
                  ) : (
                    <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" />
                      IN STOCK ({activeStock} units available)
                    </span>
                  )}
                </div>

                {/* Price Box: Montserrat 700 weight */}
                <div className="bg-zinc-50 border border-zinc-200/80 rounded-2xl p-4 mb-6 flex flex-wrap items-baseline gap-3">
                  <span className="font-price text-3xl sm:text-4xl font-bold text-zinc-950 tabular-nums">
                    {formatCurrency(activePrice)}
                  </span>
                  <span className="font-price text-base line-through text-zinc-400 font-normal tabular-nums">
                    MRP: {formatCurrency(activeOriginalPrice)}
                  </span>
                  {activeDiscount > 0 && (
                    <span className="text-xs font-semibold text-emerald-700 bg-emerald-100/80 px-2.5 py-1 rounded-lg">
                      SAVE {formatCurrency(activeOriginalPrice - activePrice)} ({activeDiscount}% OFF)
                    </span>
                  )}
                  <div className="w-full text-[11px] text-zinc-500 mt-1">
                    Inclusive of all GST. Free Pan-India delivery on orders above ₹4999.
                  </div>
                </div>

                {/* Short Overview */}
                <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed mb-6">
                  {product.description}
                </p>

                {/* Flavour Selector */}
                {availableFlavours.length > 0 && (
                  <div className="mb-4">
                    <label className="text-xs font-bold uppercase tracking-wider text-zinc-800 block mb-2 font-mono">
                      FLAVOUR: <span className="text-red-600 font-bold">{selectedFlavour}</span>
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {availableFlavours.map((flv) => {
                        const isSelected = selectedFlavour.toLowerCase() === flv.toLowerCase();
                        return (
                          <button
                            key={flv}
                            type="button"
                            onClick={() => handleFlavourChange(flv)}
                            className={`text-xs px-4 py-2.5 rounded-xl font-bold border transition-all cursor-pointer ${
                              isSelected
                                ? 'border-red-600 bg-red-50 text-red-700 shadow-sm ring-2 ring-red-600/20'
                                : 'border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300'
                            }`}
                          >
                            {flv}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Size / Weight Selector (Dynamic & Flavour-Specific) */}
                {availableWeights.length > 0 && (
                  <div className="mb-6">
                    <label className="text-xs font-bold uppercase tracking-wider text-zinc-800 block mb-2 font-mono">
                      WEIGHT / SIZE: <span className="text-red-600 font-bold">{selectedSize}</span>
                      {activePrice > 0 && (
                        <span className="ml-2 text-emerald-700 normal-case font-semibold">
                          — {formatCurrency(activePrice)}
                        </span>
                      )}
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {availableWeights.map((weightOption) => {
                        const variantMatch = hasDynamicVariants
                          ? flavourVariants.find(
                              (v) =>
                                v.weight.trim().toLowerCase() === weightOption.trim().toLowerCase()
                            )
                          : undefined;

                        const legacySv = !hasDynamicVariants
                          ? product.sizeVariants?.find(
                              (v) =>
                                v.size.trim().toLowerCase() === weightOption.trim().toLowerCase()
                            )
                          : undefined;

                        const isSelected =
                          selectedSize.trim().toLowerCase() === weightOption.trim().toLowerCase();
                        const isWeightOut = variantMatch
                          ? variantMatch.stock <= 0 || variantMatch.isActive === false
                          : product.stock === 0;

                        const weightPrice = variantMatch
                          ? variantMatch.price
                          : legacySv?.price && legacySv.price > 0
                          ? legacySv.price
                          : product.price;

                        return (
                          <button
                            key={weightOption}
                            type="button"
                            onClick={() => setSelectedSize(weightOption)}
                            className={`flex flex-col items-start text-xs px-4 py-2 rounded-xl font-bold border transition-all cursor-pointer min-w-[90px] ${
                              isSelected
                                ? 'border-red-600 bg-red-50 text-red-700 shadow-sm ring-2 ring-red-600/20'
                                : isWeightOut
                                ? 'border-zinc-200 bg-zinc-50 text-zinc-400 hover:border-zinc-300'
                                : 'border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300'
                            }`}
                          >
                            <span className="flex items-center gap-1.5">
                              {weightOption}
                              {isWeightOut && (
                                <span className="text-[9px] font-bold uppercase bg-red-100 text-red-700 px-1 py-0.2 rounded font-mono">
                                  Sold Out
                                </span>
                              )}
                            </span>
                            <span
                              className={`text-[11px] font-mono font-bold mt-0.5 ${
                                isSelected
                                  ? 'text-red-600'
                                  : isWeightOut
                                  ? 'text-zinc-400'
                                  : 'text-zinc-900'
                              }`}
                            >
                              {formatCurrency(weightPrice)}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Quantity Stepper & Buy Actions */}
                {isVariantOutOfStock ? (
                  <div className="pt-2 mb-6 space-y-3">
                    <div className="p-4 bg-zinc-100 border border-zinc-200 rounded-2xl flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-zinc-900 block">
                          {selectedFlavour} ({selectedSize}) is Currently Sold Out
                        </span>
                        <span className="text-zinc-500">
                          Try choosing another flavour or weight option.
                        </span>
                      </div>
                      <button
                        onClick={() => navigate('contact')}
                        className="bg-zinc-900 hover:bg-black text-white px-3.5 py-2 rounded-xl font-btn text-xs uppercase cursor-pointer"
                      >
                        Notify Me
                      </button>
                    </div>

                    <div className="flex gap-3">
                      <button
                        disabled
                        className="w-full bg-zinc-200 text-zinc-400 font-bold text-xs uppercase tracking-wider py-3.5 px-6 rounded-xl cursor-not-allowed text-center"
                      >
                        VARIANT OUT OF STOCK
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row items-center gap-3.5 pt-2 mb-6">
                    {/* Quantity Stepper */}
                    <div className="flex items-center border border-zinc-200 rounded-xl bg-white p-1 shrink-0 w-full sm:w-auto justify-between sm:justify-start">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="p-2 text-zinc-500 hover:text-black hover:bg-zinc-100 rounded-lg cursor-pointer"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="px-4 font-mono font-bold text-sm text-zinc-900 tabular-nums">
                        {quantity}
                      </span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="p-2 text-zinc-500 hover:text-black hover:bg-zinc-100 rounded-lg cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Add to Cart */}
                    <button
                      onClick={handleAddToCart}
                      className="flex-1 w-full bg-red-600 hover:bg-red-700 active:scale-98 text-white font-btn text-xs uppercase tracking-wider py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-red-600/25 transition-all cursor-pointer"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>ADD TO CART</span>
                    </button>

                    {/* Buy Now */}
                    <button
                      onClick={handleBuyNow}
                      className="flex-1 w-full bg-zinc-950 hover:bg-black active:scale-98 text-white font-btn text-xs uppercase tracking-wider py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
                    >
                      <Zap className="w-4 h-4 text-red-500 fill-current" />
                      <span>BUY NOW</span>
                    </button>
                  </div>
                )}

                {/* Trust Badges */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-4 border-t border-zinc-100 text-[11px] text-zinc-600">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>100% Authentic</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CreditCard className="w-4 h-4 text-zinc-700 shrink-0" />
                    <span>COD Available</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Truck className="w-4 h-4 text-zinc-700 shrink-0" />
                    <span>Pan-India Shipping</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-zinc-700 shrink-0" />
                    <span>7 Days Return</span>
                  </div>
                </div>

                {/* Pincode Delivery Estimator */}
                <div className="mt-5 p-4 bg-zinc-50/80 border border-zinc-200/90 rounded-2xl space-y-2.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-zinc-900 flex items-center gap-1.5 font-mono text-xs">
                      <MapPin className="w-4 h-4 text-red-600" />
                      ESTIMATE DELIVERY TIMELINE
                    </span>
                    {pincodeEstimate && (
                      <span className="text-emerald-700 font-bold bg-emerald-100/70 px-2.5 py-0.5 rounded-full text-[11px]">
                        Arrives in {pincodeEstimate.days} Days
                      </span>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      maxLength={6}
                      placeholder="Enter 6-digit PIN code (e.g. 160055)"
                      value={pincodeInput}
                      onChange={(e) => setPincodeInput(e.target.value.replace(/\D/g, ''))}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleCheckPincode();
                        }
                      }}
                      className="flex-1 bg-white border border-zinc-200 px-3.5 py-2.5 rounded-xl text-xs outline-none focus:border-red-600 font-mono"
                    />
                    <button
                      type="button"
                      onClick={handleCheckPincode}
                      className="bg-zinc-900 hover:bg-black active:scale-98 text-white text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded-xl transition-all cursor-pointer"
                    >
                      Check
                    </button>
                  </div>

                  {pincodeError && (
                    <div className="text-[11px] text-red-600 font-medium">{pincodeError}</div>
                  )}

                  {pincodeEstimate ? (
                    <div className="text-[11px] text-zinc-700 bg-white p-2.5 rounded-xl border border-zinc-200/60 space-y-1">
                      <div className="font-semibold text-zinc-900 flex items-center gap-1.5">
                        <Package className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Delivering to: {pincodeEstimate.label}</span>
                      </div>
                      <div className="text-zinc-500 text-[10px]">
                        Dispatched via express air/surface courier from Mohali Central Hub.
                      </div>
                    </div>
                  ) : (
                    <div className="text-[10px] text-zinc-500">
                      Enter your delivery postal pincode to check estimated dispatch and transit duration.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FITNESS GUIDANCE SECTION (WHO IS THIS FOR / WHEN TO USE) */}
        <div className="bg-white border border-zinc-200/80 rounded-3xl p-6 sm:p-8 mb-10 shadow-xs">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600" />
            <h3 className="font-heading font-black text-lg text-zinc-950 uppercase tracking-tight">
              FITNESS GUIDANCE & USAGE SUITABILITY
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Box 1: Who is it for? */}
            <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-200/80">
              <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-zinc-900 mb-2 text-red-600 font-mono">
                WHO IS THIS PRODUCT FOR?
              </h4>
              <p className="text-[11px] text-zinc-500 mb-2">Designed for active lifters and athletes seeking:</p>
              <ul className="space-y-1.5 text-xs text-zinc-700">
                {whoIsItFor.map((item, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Box 2: When to use? */}
            <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-200/80">
              <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-zinc-900 mb-2 text-red-600 font-mono">
                WHEN TO USE?
              </h4>
              <ol className="list-decimal pl-4 space-y-1 text-xs text-zinc-700 leading-relaxed">
                {whenToUseLines.map((line, index) => (
                  <li key={index}>{line.replace(/^\d+[.)]\s*/, '')}</li>
                ))}
              </ol>
              <p className="text-[11px] text-zinc-500 mt-2">
                Tip: Mix with 200–250ml chilled water or skimmed milk in a shaker cup.
              </p>
            </div>

            {/* Box 3: What goal does it support? */}
            <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-200/80">
              <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-zinc-900 mb-2 text-red-600 font-mono">
                WHAT GOAL DOES IT SUPPORT?
              </h4>
              <p className="text-xs text-zinc-700 leading-relaxed whitespace-pre-line">
                {goalSupported}
              </p>
              <p className="text-[10px] text-zinc-400 italic mt-2">
                * Dietary supplements support training adaptation and are intended for use alongside a balanced diet.
              </p>
            </div>
          </div>
        </div>

        {/* DETAILED INFORMATION ACCORDION / TABS */}
        <div className="bg-white border border-zinc-200/80 rounded-3xl p-6 sm:p-8 lg:p-10 mb-12 shadow-xs space-y-8">
          {/* Key Benefits (Responsible phrasing) */}
          {hasBenefits && (
            <div>
              <h3 className="font-heading font-black text-base uppercase text-zinc-950 mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-red-600" />
                <span>KEY BENEFITS & FORMULA ADVANTAGES</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm text-zinc-700">
                {validBenefits.map((b, i) => (
                  <div key={i} className="flex items-start gap-2.5 p-3 rounded-xl bg-zinc-50 border border-zinc-100">
                    <span className="text-emerald-600 font-bold shrink-0">✓</span>
                    <span>{b}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Conditional Ingredients & Nutrition Facts / Authenticity */}
          {hasNutritionFacts || hasIngredients ? (
            <div className={hasBenefits ? 'pt-6 border-t border-zinc-100' : ''}>
              <h3 className="font-heading font-black text-base uppercase text-zinc-950 mb-4 flex items-center gap-2">
                <Layers className="w-4 h-4 text-red-600" />
                <span>
                  {hasNutritionFacts && hasIngredients
                    ? `INGREDIENTS & NUTRITION FACTS${servingsLabel}`
                    : hasNutritionFacts
                    ? `NUTRITION FACTS${servingsLabel}`
                    : `INGREDIENTS & FORMULATION`}
                </span>
              </h3>

              {hasNutritionFacts && hasIngredients ? (
                // Both Nutrition and Ingredients available -> 7/5 split
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                  {/* Table */}
                  <div className="md:col-span-7">
                    <div className="border border-zinc-200 rounded-xl overflow-hidden divide-y divide-zinc-200 text-xs">
                      <div className="bg-zinc-100 p-2.5 font-bold text-zinc-800 flex justify-between font-mono">
                        <span>Active Nutrient</span>
                        <span>Amount Per Serving</span>
                      </div>
                      {validNutritionFacts.map((fact, i) => (
                        <div key={i} className="p-2.5 flex justify-between text-zinc-700 bg-white">
                          <span>{fact.nutrient}</span>
                          <span className="font-mono font-bold text-red-600">{fact.amountPerServing}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Ingredients & Authenticity */}
                  <div className="md:col-span-5 space-y-4">
                    <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-200 text-xs space-y-1.5">
                      <h4 className="font-bold text-zinc-900 font-mono text-[11px] uppercase">
                        COMPREHENSIVE INGREDIENTS LIST
                      </h4>
                      <p className="text-zinc-600 leading-relaxed font-mono text-[11px]">
                        {product.ingredients}
                      </p>
                    </div>

                    <div className="bg-emerald-50/60 p-4 rounded-xl border border-emerald-200 text-xs space-y-1">
                      <div className="flex items-center gap-1.5 text-emerald-800 font-bold">
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        <span>AUTHENTICITY & VERIFICATION</span>
                      </div>
                      <p className="text-zinc-600 text-[11px] leading-relaxed">
                        {authenticityInfo}
                      </p>
                    </div>
                  </div>
                </div>
              ) : hasNutritionFacts ? (
                // Only Nutrition facts available -> Table on left, Authenticity on right
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                  <div className="md:col-span-7">
                    <div className="border border-zinc-200 rounded-xl overflow-hidden divide-y divide-zinc-200 text-xs">
                      <div className="bg-zinc-100 p-2.5 font-bold text-zinc-800 flex justify-between font-mono">
                        <span>Active Nutrient</span>
                        <span>Amount Per Serving</span>
                      </div>
                      {validNutritionFacts.map((fact, i) => (
                        <div key={i} className="p-2.5 flex justify-between text-zinc-700 bg-white">
                          <span>{fact.nutrient}</span>
                          <span className="font-mono font-bold text-red-600">{fact.amountPerServing}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="md:col-span-5">
                    <div className="bg-emerald-50/60 p-4 rounded-xl border border-emerald-200 text-xs space-y-1">
                      <div className="flex items-center gap-1.5 text-emerald-800 font-bold">
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        <span>AUTHENTICITY & VERIFICATION</span>
                      </div>
                      <p className="text-zinc-600 text-[11px] leading-relaxed">
                        {authenticityInfo}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                // Only Ingredients available -> Ingredients on left, Authenticity on right
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-200 text-xs space-y-1.5">
                    <h4 className="font-bold text-zinc-900 font-mono text-[11px] uppercase">
                      COMPREHENSIVE INGREDIENTS LIST
                    </h4>
                    <p className="text-zinc-600 leading-relaxed font-mono text-[11px]">
                      {product.ingredients}
                    </p>
                  </div>

                  <div className="bg-emerald-50/60 p-4 rounded-xl border border-emerald-200 text-xs space-y-1">
                    <div className="flex items-center gap-1.5 text-emerald-800 font-bold">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>AUTHENTICITY & VERIFICATION</span>
                    </div>
                    <p className="text-zinc-600 text-[11px] leading-relaxed">
                      {authenticityInfo}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            // Neither Nutrition Facts nor Ingredients provided -> show Authenticity card
            <div className={hasBenefits ? 'pt-6 border-t border-zinc-100' : ''}>
              <div className="bg-emerald-50/60 p-4 rounded-xl border border-emerald-200 text-xs space-y-1">
                <div className="flex items-center gap-1.5 text-emerald-800 font-bold">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>AUTHENTICITY & VERIFICATION</span>
                </div>
                <p className="text-zinc-600 text-[11px] leading-relaxed">
                  {authenticityInfo}
                </p>
              </div>
            </div>
          )}

          {/* Shipping & Returns */}
          <div className="pt-6 border-t border-zinc-100 text-xs text-zinc-600 space-y-2">
            <h3 className="font-heading font-black text-base uppercase text-zinc-950 flex items-center gap-2">
              <Truck className="w-4 h-4 text-red-600" />
              <span>SHIPPING & TRANSIT GUARANTEE</span>
            </h3>
            <p>
              Dispatched same business day if ordered before 2:00 PM IST. Shipped in discreet, heavy-duty tamper-proof packaging.
            </p>
          </div>
        </div>

        {/* CUSTOMER REVIEWS SECTION (Matching User Design) */}
        <div className="bg-white border border-zinc-200/80 rounded-3xl p-6 sm:p-10 mb-12 shadow-xs">
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <h2 className="text-3xl sm:text-4xl font-black text-zinc-950 font-display tracking-tight">
              What customers say<span className="text-amber-400">.</span>
            </h2>

            <button
              onClick={() => setShowReviewForm(!showReviewForm)}
              className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 active:scale-98 text-white font-bold text-xs uppercase tracking-wider px-5 py-3 rounded-xl shadow-md shadow-red-600/20 transition-all cursor-pointer self-start sm:self-auto"
            >
              <MessageSquare className="w-4 h-4" />
              <span>{showReviewForm ? 'Cancel Review' : 'Write a Review'}</span>
            </button>
          </div>

          {/* Rating Summary Breakdown Box */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center pb-8 border-b border-zinc-100">
            {/* Left Score: 4.6 */}
            <div className="md:col-span-4 flex items-center gap-4">
              <div className="text-5xl sm:text-6xl font-black text-zinc-950 flex items-center gap-2 tracking-tight">
                <span className="text-amber-400 text-4xl sm:text-5xl">★</span>
                <span>{product.rating}</span>
              </div>
              <div className="text-xs text-zinc-500 space-y-0.5">
                <div className="font-bold text-zinc-900 text-sm">{reviews.length + 31} Reviews</div>
                <div>Based on verified buyer ratings across India</div>
              </div>
            </div>

            {/* Right Distribution Bars */}
            <div className="md:col-span-8 space-y-2 max-w-lg">
              {[
                { stars: 5, count: 28, pct: '80%' },
                { stars: 4, count: 4, pct: '11%' },
                { stars: 3, count: 1, pct: '3%' },
                { stars: 2, count: 1, pct: '3%' },
                { stars: 1, count: 1, pct: '3%' },
              ].map((row) => (
                <div key={row.stars} className="flex items-center gap-3 text-xs text-zinc-500">
                  <span className="w-6 font-semibold text-right text-zinc-700">{row.stars} ★</span>
                  <div className="flex-1 h-2 bg-zinc-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-400 rounded-full"
                      style={{ width: row.pct }}
                    />
                  </div>
                  <span className="w-6 text-zinc-400 font-mono text-[11px]">{row.count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Review Submission Form Drawer */}
          {showReviewForm && (
            <form onSubmit={handleSubmitReview} className="my-8 p-6 bg-zinc-50 rounded-2xl border border-zinc-200 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm uppercase text-zinc-900 font-mono">
                  Write Your Review For {product.name}
                </h3>
                {reviewFormSuccess && (
                  <span className="text-emerald-700 font-bold text-xs bg-emerald-100 px-3 py-1 rounded-full flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" />
                    Review Published!
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">Your Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Satheesh Kumar"
                    value={reviewerName}
                    onChange={(e) => setReviewerName(e.target.value)}
                    className="w-full bg-white border border-zinc-200 p-2.5 rounded-xl text-xs outline-none focus:border-red-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">Your Rating *</label>
                  <div className="flex items-center gap-1.5 pt-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button
                        type="button"
                        key={s}
                        onClick={() => setReviewRating(s)}
                        className="cursor-pointer text-xl text-amber-400 hover:scale-125 transition-transform"
                      >
                        {s <= reviewRating ? '★' : '☆'}
                      </button>
                    ))}
                    <span className="ml-2 text-xs font-bold text-zinc-600 font-mono">{reviewRating} of 5 Stars</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">Your Feedback & Experience *</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Share details about flavor taste, mixability, workout energy, recovery results..."
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  className="w-full bg-white border border-zinc-200 p-3 rounded-xl text-xs outline-none focus:border-red-600"
                />
              </div>

              <button
                type="submit"
                className="bg-red-600 hover:bg-red-700 active:scale-98 text-white font-bold text-xs uppercase px-6 py-2.5 rounded-xl transition-all cursor-pointer shadow-md shadow-red-600/20 flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Verified Review</span>
              </button>
            </form>
          )}

          {/* Reviews Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-8">
            {reviews.map((rev) => {
              const initials = rev.author
                .split(' ')
                .map((n) => n[0])
                .join('')
                .slice(0, 2)
                .toUpperCase() || 'U';

              return (
                <div
                  key={rev.id}
                  className="bg-white border border-zinc-200/90 rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-3.5 hover:border-zinc-300 transition-all"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-full bg-zinc-950 text-white font-black text-xs flex items-center justify-center shrink-0">
                        {initials}
                      </div>
                      <div>
                        <div className="font-bold text-xs text-zinc-900 leading-tight">
                          {rev.author}
                        </div>
                        <div className="text-[10px] text-zinc-400 mt-0.5">
                          {rev.date}
                        </div>
                      </div>
                    </div>

                    {rev.verified && (
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0">
                        <Check className="w-3 h-3 text-emerald-600" />
                        <span>Verified Buyer</span>
                      </span>
                    )}
                  </div>

                  {/* Stars */}
                  <div className="flex items-center text-amber-400 text-xs tracking-widest">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i}>{i < rev.rating ? '★' : '☆'}</span>
                    ))}
                  </div>

                  {/* Comment */}
                  <p className="text-xs text-zinc-700 leading-relaxed font-normal">
                    {rev.comment}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-heading font-black text-xl sm:text-2xl text-zinc-950 uppercase tracking-tight">
                FREQUENTLY BOUGHT TOGETHER
              </h2>
              <button
                onClick={() => navigate('shop')}
                className="text-xs font-bold text-red-600 hover:underline"
              >
                Browse All Supplements →
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
