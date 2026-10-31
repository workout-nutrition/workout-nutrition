import React, { useState, useEffect } from 'react';
import { Product, CategoryType, GoalType, SizeVariant, ProductVariant } from '../../types';
import { productsService } from '../../lib/products.service';
import {
  X,
  Upload,
  Plus,
  Trash2,
  Check,
  AlertCircle,
  Sparkles,
  Layers,
  Image as ImageIcon,
} from 'lucide-react';

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  productToEdit?: Product | null;
  onSaved: () => void;
}

const CATEGORIES: CategoryType[] = [
  'BCAA',
  'BCAA & EAA',
  'Breakfast',
  'Creatine',
  'EAA',
  'Fat Burner',
  'Fish Oil',
  'Gaining Formula',
  'Glutamine',
  'L- Carnitine',
  'L-Citrulline',
  'Liver Support',
  'Mass Gainer',
  'Multivitamin',
  'Multivitamins',
  'Others',
  'Peanut Butter',
  'Pre Workout',
  'Pre Workouts',
  'TAN',
  'TEST Booster',
  'Whey Protein',
  'Whey Isolate',
  'ZMA',
];



const ALL_GOALS: { id: GoalType; label: string }[] = [
  { id: 'build-muscle', label: 'Build Muscle' },
  { id: 'gain-weight', label: 'Gain Weight' },
  { id: 'lose-fat', label: 'Lose Fat' },
  { id: 'increase-strength', label: 'Increase Strength' },
  { id: 'boost-energy', label: 'Boost Energy' },
  { id: 'recovery', label: 'Recovery' },
  { id: 'health-wellness', label: 'Health & Wellness' },
];

export const ProductFormModal: React.FC<ProductFormModalProps> = ({
  isOpen,
  onClose,
  productToEdit,
  onSaved,
}) => {
  const [activeTab, setActiveTab] = useState<'basic' | 'variants' | 'nutrition' | 'media'>('basic');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form Fields
  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState<CategoryType>('Whey Protein');
  const [subcategory, setSubcategory] = useState('');
  const [price, setPrice] = useState<number | ''>('');
  const [originalPrice, setOriginalPrice] = useState<number | ''>('');
  const [stock, setStock] = useState<number | ''>('');
  const [servings, setServings] = useState<number | ''>('');
  const [dietary, setDietary] = useState<'Vegetarian' | 'Non-Vegetarian' | 'Vegan' | 'Gluten-Free'>('Vegetarian');
  const [isBestSeller, setIsBestSeller] = useState(false);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isNew, setIsNew] = useState(false);

  // Lists & Arrays
  const [flavours, setFlavours] = useState<string[]>([]);
  const [newFlavour, setNewFlavour] = useState('');
  const [sizes, setSizes] = useState<string[]>([]);
  const [sizeVariants, setSizeVariants] = useState<SizeVariant[]>([]);
  const [newSize, setNewSize] = useState('');
  const [newSizePrice, setNewSizePrice] = useState<number | ''>('');
  const [newSizeOriginalPrice, setNewSizeOriginalPrice] = useState<number | ''>('');
  const [images, setImages] = useState<string[]>([]);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [selectedGoals, setSelectedGoals] = useState<GoalType[]>([]);
  const [benefits, setBenefits] = useState<string[]>([]);
  const [newBenefit, setNewBenefit] = useState('');
  const [nutritionFacts, setNutritionFacts] = useState<{ nutrient: string; amountPerServing: string }[]>([]);

  // Dynamic Flavour & Variant Management State
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [flavoursList, setFlavoursList] = useState<string[]>([]);
  const [newFlavourInput, setNewFlavourInput] = useState('');
  const [editingFlavourIndex, setEditingFlavourIndex] = useState<number | null>(null);
  const [editingFlavourText, setEditingFlavourText] = useState('');
  const [newWeightForms, setNewWeightForms] = useState<
    Record<string, { weight: string; price: number | ''; originalPrice: number | ''; stock: number | '' }>
  >({});

  const [description, setDescription] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [howToUse, setHowToUse] = useState('');
  const [whoIsItForText, setWhoIsItForText] = useState('');
  const [goalSupportedText, setGoalSupportedText] = useState('');

  // Upload state
  const [uploadingImage, setUploadingImage] = useState(false);

  const handleAddFlavour = () => {
    const trimmed = newFlavourInput.trim();
    if (!trimmed) return;
    if (!flavoursList.some((f) => f.toLowerCase() === trimmed.toLowerCase())) {
      setFlavoursList((prev) => [...prev, trimmed]);
    }
    setNewFlavourInput('');
  };

  const handleSaveEditFlavour = (flvIdx: number, oldFlavour: string) => {
    const trimmed = editingFlavourText.trim();
    if (!trimmed) {
      setEditingFlavourIndex(null);
      return;
    }
    setFlavoursList((prev) => prev.map((f, i) => (i === flvIdx ? trimmed : f)));
    setVariants((prev) =>
      prev.map((v) =>
        v.flavour.trim().toLowerCase() === oldFlavour.trim().toLowerCase()
          ? { ...v, flavour: trimmed }
          : v
      )
    );
    if (newWeightForms[oldFlavour]) {
      setNewWeightForms((prev) => {
        const next = { ...prev };
        next[trimmed] = next[oldFlavour];
        delete next[oldFlavour];
        return next;
      });
    }
    setEditingFlavourIndex(null);
  };

  const handleDeleteFlavour = (flavour: string) => {
    setFlavoursList((prev) =>
      prev.filter((f) => f.trim().toLowerCase() !== flavour.trim().toLowerCase())
    );
    setVariants((prev) =>
      prev.filter((v) => v.flavour.trim().toLowerCase() !== flavour.trim().toLowerCase())
    );
  };

  const handleWeightFormChange = (
    flavour: string,
    field: 'weight' | 'price' | 'originalPrice' | 'stock',
    value: any
  ) => {
    setNewWeightForms((prev) => ({
      ...prev,
      [flavour]: {
        weight: prev[flavour]?.weight || '',
        price: prev[flavour]?.price ?? '',
        originalPrice: prev[flavour]?.originalPrice ?? '',
        stock: prev[flavour]?.stock ?? '',
        [field]: value,
      },
    }));
  };

  const handleAddWeightToFlavour = (flavour: string) => {
    const form = newWeightForms[flavour];
    if (!form || !form.weight.trim()) return;

    const trimmedWeight = form.weight.trim();
    const sellingPrice =
      form.price !== '' ? Number(form.price) : typeof price === 'number' ? price : 0;
    const mrpPrice = form.originalPrice !== '' ? Number(form.originalPrice) : sellingPrice;
    const stockQty = form.stock !== '' ? Number(form.stock) : 0;

    const existing = variants.find(
      (v) =>
        v.flavour.trim().toLowerCase() === flavour.trim().toLowerCase() &&
        v.weight.trim().toLowerCase() === trimmedWeight.toLowerCase()
    );

    if (existing) {
      alert(`Weight "${trimmedWeight}" is already configured under ${flavour}. Please update its row directly.`);
      return;
    }

    const newVar: ProductVariant = {
      id: `var-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      flavour,
      weight: trimmedWeight,
      price: sellingPrice,
      originalPrice: mrpPrice,
      stock: stockQty,
      isActive: stockQty > 0,
    };

    setVariants((prev) => [...prev, newVar]);

    setNewWeightForms((prev) => ({
      ...prev,
      [flavour]: { weight: '', price: '', originalPrice: '', stock: '' },
    }));
  };

  const handleUpdateVariantField = (
    variantId: string,
    field: keyof ProductVariant,
    value: any
  ) => {
    setVariants((prev) =>
      prev.map((v) => {
        if (v.id === variantId) {
          const updated = { ...v, [field]: value };
          if (field === 'stock') {
            const num = Number(value);
            if (num <= 0) {
              updated.isActive = false;
            } else if (!v.isActive && num > 0) {
              updated.isActive = true;
            }
          }
          return updated;
        }
        return v;
      })
    );
  };

  const handleToggleVariantActive = (variantId: string, newActive: boolean) => {
    setVariants((prev) =>
      prev.map((v) => (v.id === variantId ? { ...v, isActive: newActive } : v))
    );
  };

  const handleDeleteVariant = (variantId: string) => {
    setVariants((prev) => prev.filter((v) => v.id !== variantId));
  };

  useEffect(() => {
    if (productToEdit) {
      setId(productToEdit.id);
      setName(productToEdit.name);
      setBrand(productToEdit.brand);
      setCategory(productToEdit.category);
      setSubcategory(productToEdit.subcategory || '');
      setPrice(productToEdit.price);
      setOriginalPrice(productToEdit.originalPrice);
      setStock(productToEdit.stock);
      setServings(productToEdit.servings || '');
      setDietary(productToEdit.dietary);
      setIsBestSeller(Boolean(productToEdit.isBestSeller));
      setIsFeatured(Boolean(productToEdit.isFeatured));
      setIsNew(Boolean(productToEdit.isNew));
      setFlavours(productToEdit.flavours || []);
      setSizes(productToEdit.sizes || []);
      setSizeVariants(productToEdit.sizeVariants || []);

      const existingVariants = Array.isArray(productToEdit.variants) ? productToEdit.variants : [];
      setVariants(existingVariants);
      if (existingVariants.length > 0) {
        const uniqueFlavours = Array.from(
          new Set(existingVariants.map((v) => v.flavour.trim()).filter(Boolean))
        );
        setFlavoursList(uniqueFlavours);
      } else if (productToEdit.flavours && productToEdit.flavours.length > 0) {
        setFlavoursList(productToEdit.flavours);
      } else {
        setFlavoursList([]);
      }

      setImages(productToEdit.images || []);
      setSelectedGoals(productToEdit.goals || []);
      setBenefits(productToEdit.benefits || []);
      setNutritionFacts(productToEdit.nutritionFacts || []);
      setDescription(productToEdit.description || '');
      setIngredients(productToEdit.ingredients || '');
      setHowToUse(productToEdit.howToUse || '');
      setWhoIsItForText((productToEdit.whoIsItFor || []).join(', '));
      setGoalSupportedText(productToEdit.whatGoalDoesItSupport || productToEdit.goalSupported || '');
    } else {
      // Clean blank state with helpful placeholders
      const genId = 'prod-' + Math.random().toString(36).substring(2, 8);
      setId(genId);
      setName('');
      setBrand('');
      setCategory('Whey Protein');
      setSubcategory('');
      setPrice('');
      setOriginalPrice('');
      setStock('');
      setServings('');
      setDietary('Vegetarian');
      setIsBestSeller(false);
      setIsFeatured(false);
      setIsNew(false);
      setFlavours([]);
      setSizes([]);
      setSizeVariants([]);
      setVariants([]);
      setFlavoursList([]);
      setNewWeightForms({});
      setImages([]);
      setSelectedGoals([]);
      setBenefits([]);
      setNutritionFacts([]);
      setDescription('');
      setIngredients('');
      setHowToUse('');
      setWhoIsItForText('');
      setGoalSupportedText('');
    }
    setErrorMsg(null);
  }, [productToEdit, isOpen]);

  if (!isOpen) return null;

  const numPrice = typeof price === 'number' ? price : 0;
  const numOriginalPrice = typeof originalPrice === 'number' ? originalPrice : 0;
  const discount =
    numOriginalPrice > numPrice && numOriginalPrice > 0
      ? Math.round(((numOriginalPrice - numPrice) / numOriginalPrice) * 100)
      : 0;
  const slug = name ? name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : id;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    const { url, error } = await productsService.uploadImage(file);
    setUploadingImage(false);

    if (error) {
      alert(`Upload note: ${error.message}. You can also enter an image URL directly.`);
    } else if (url) {
      setImages((prev) => [...prev, url]);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !brand.trim()) {
      setErrorMsg('Name and Brand are required');
      return;
    }

    if (price === '' || Number(price) < 0) {
      setErrorMsg('Valid Selling Price is required');
      return;
    }

    const numPrice = Number(price);
    const numOriginalPrice = originalPrice === '' ? numPrice : Number(originalPrice);
    const numStock = stock === '' ? 0 : Number(stock);
    const numServings = servings === '' ? 0 : Number(servings);

    // Filter out blank nutrition fact rows
    const validNutritionFacts = nutritionFacts
      .filter((f) => f.nutrient.trim() !== '')
      .map((f) => ({
        nutrient: f.nutrient.trim(),
        amountPerServing: f.amountPerServing.trim(),
      }));

    const hasVariants = variants.length > 0;
    const computedStock = hasVariants
      ? variants.reduce((sum, v) => sum + (Number(v.stock) || 0), 0)
      : numStock;

    // Use minimum active variant price as the displayed starting price if variants exist
    const activeVariants = variants.filter((v) => v.isActive && Number(v.price) > 0);
    const computedPrice =
      activeVariants.length > 0
        ? Math.min(...activeVariants.map((v) => Number(v.price)))
        : numPrice;

    const computedOriginalPrice =
      activeVariants.length > 0
        ? activeVariants.find((v) => v.price === computedPrice)?.originalPrice || numOriginalPrice
        : numOriginalPrice;

    const distinctFlavours = hasVariants
      ? Array.from(new Set(variants.map((v) => v.flavour.trim()).filter(Boolean)))
      : flavours.length > 0
      ? flavours
      : ['Standard'];

    const distinctSizes = hasVariants
      ? Array.from(new Set(variants.map((v) => v.weight.trim()).filter(Boolean)))
      : sizes.length > 0
      ? sizes
      : ['Standard'];

    const productPayload: Product = {
      id: id || slug,
      slug,
      name: name.trim(),
      brand: brand.trim(),
      category,
      subcategory: subcategory.trim() || category,
      price: computedPrice,
      originalPrice: computedOriginalPrice,
      discount,
      rating: productToEdit?.rating ?? 4.8,
      reviewCount: productToEdit?.reviewCount ?? 120,
      stock: computedStock,
      servings: numServings,
      dietary,
      isBestSeller,
      isFeatured,
      isNew,
      flavours: distinctFlavours,
      sizes: distinctSizes,
      sizeVariants: sizeVariants.length > 0 ? sizeVariants : undefined,
      variants: hasVariants ? variants : undefined,
      images: images.length > 0 ? images : [],
      goals: selectedGoals,
      benefits: benefits.filter(Boolean),
      nutritionFacts: validNutritionFacts,
      description: description.trim(),
      ingredients: ingredients.trim(),
      howToUse: howToUse.trim(),
      tags: [category.toLowerCase(), brand.toLowerCase(), ...selectedGoals],
      whoIsItFor: whoIsItForText ? whoIsItForText.split(/[,\n]/).map((item) => item.trim()).filter(Boolean) : [],
      whenToUse: howToUse.trim() || 'Follow package directions',
      goalSupported: goalSupportedText.trim(),
      whatGoalDoesItSupport: goalSupportedText.trim(),
    };

    try {
      if (productToEdit) {
        const { error } = await productsService.updateProduct(productToEdit.id, productPayload);
        if (error) throw error;
      } else {
        const { error } = await productsService.createProduct(productPayload);
        if (error) throw error;
      }
      onSaved();
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to save product in database');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden my-auto border border-zinc-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-100 bg-zinc-50">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-widest text-red-600 font-mono">
              Admin Inventory
            </span>
            <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-zinc-900 font-display">
              {productToEdit ? `Edit: ${productToEdit.name}` : 'Add New Product'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-zinc-700 rounded-full hover:bg-zinc-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-zinc-200 px-6 bg-white overflow-x-auto">
          {[
            { id: 'basic', label: 'Basic Info & Pricing' },
            { id: 'variants', label: 'Flavour & Variant Management' },
            { id: 'nutrition', label: 'Nutrition & Details' },
            { id: 'media', label: 'Images & Media' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-3.5 px-4 text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all border-b-2 ${
                activeTab === tab.id
                  ? 'border-red-600 text-red-600'
                  : 'border-transparent text-zinc-500 hover:text-zinc-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-6 max-h-[70vh] overflow-y-auto space-y-6">
          {errorMsg && (
            <div className="p-3.5 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-2.5 text-xs text-red-700">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* TAB 1: BASIC INFO */}
          {activeTab === 'basic' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Gold Standard 100% Whey"
                    className="w-full px-3.5 py-2.5 text-sm bg-zinc-50 border border-zinc-200 rounded-xl outline-none focus:border-red-600 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1">
                    Brand *
                  </label>
                  <input
                    type="text"
                    required
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    placeholder="e.g. Optimum Nutrition"
                    className="w-full px-3.5 py-2.5 text-sm bg-zinc-50 border border-zinc-200 rounded-xl outline-none focus:border-red-600 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1">
                    Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as CategoryType)}
                    className="w-full px-3.5 py-2.5 text-sm bg-zinc-50 border border-zinc-200 rounded-xl outline-none focus:border-red-600 focus:bg-white"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1">
                    Subcategory
                  </label>
                  <input
                    type="text"
                    value={subcategory}
                    onChange={(e) => setSubcategory(e.target.value)}
                    placeholder="e.g. Blended Whey"
                    className="w-full px-3.5 py-2.5 text-sm bg-zinc-50 border border-zinc-200 rounded-xl outline-none focus:border-red-600 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1">
                    Selling Price (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={price === '' ? '' : price}
                    onChange={(e) => setPrice(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="e.g. 1999"
                    className="w-full px-3.5 py-2.5 text-sm bg-zinc-50 border border-zinc-200 rounded-xl outline-none focus:border-red-600 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1">
                    Original MRP (₹) *
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={originalPrice === '' ? '' : originalPrice}
                    onChange={(e) => setOriginalPrice(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="e.g. 2999"
                    className="w-full px-3.5 py-2.5 text-sm bg-zinc-50 border border-zinc-200 rounded-xl outline-none focus:border-red-600 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1">
                    Discount
                  </label>
                  <div className="px-3.5 py-2.5 text-sm bg-zinc-100 rounded-xl font-bold text-red-600">
                    {discount > 0 ? `${discount}% OFF` : '0% OFF'}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1">
                    Units in Stock *
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={stock === '' ? '' : stock}
                    onChange={(e) => setStock(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="e.g. 50"
                    className="w-full px-3.5 py-2.5 text-sm bg-zinc-50 border border-zinc-200 rounded-xl outline-none focus:border-red-600 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1">
                    Dietary Type
                  </label>
                  <select
                    value={dietary}
                    onChange={(e) => setDietary(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 text-sm bg-zinc-50 border border-zinc-200 rounded-xl outline-none focus:border-red-600 focus:bg-white"
                  >
                    <option value="Vegetarian">Vegetarian (Green mark)</option>
                    <option value="Non-Vegetarian">Non-Vegetarian (Red mark)</option>
                    <option value="Vegan">Vegan</option>
                    <option value="Gluten-Free">Gluten-Free</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1">
                    Servings Count
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={servings === '' ? '' : servings}
                    onChange={(e) => setServings(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="e.g. 30"
                    className="w-full px-3.5 py-2.5 text-sm bg-zinc-50 border border-zinc-200 rounded-xl outline-none focus:border-red-600 focus:bg-white"
                  />
                </div>
              </div>

              {/* Badges / Toggles */}
              <div className="flex flex-wrap gap-4 pt-3 border-t border-zinc-100">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-zinc-700">
                  <input
                    type="checkbox"
                    checked={isBestSeller}
                    onChange={(e) => setIsBestSeller(e.target.checked)}
                    className="w-4 h-4 rounded text-red-600 focus:ring-red-500"
                  />
                  <span>Mark as Best Seller</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-zinc-700">
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="w-4 h-4 rounded text-red-600 focus:ring-red-500"
                  />
                  <span>Featured on Home Page</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-zinc-700">
                  <input
                    type="checkbox"
                    checked={isNew}
                    onChange={(e) => setIsNew(e.target.checked)}
                    className="w-4 h-4 rounded text-red-600 focus:ring-red-500"
                  />
                  <span>New Arrival</span>
                </label>
              </div>
            </div>
          )}

          {/* TAB 2: FLAVOUR & VARIANT MANAGEMENT */}
          {activeTab === 'variants' && (
            <div className="space-y-6">
              {/* Header Box */}
              <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200/80 rounded-2xl p-4 sm:p-5">
                <div className="flex items-center gap-2 mb-1">
                  <Layers className="w-5 h-5 text-red-600" />
                  <h3 className="font-heading font-black text-sm uppercase tracking-wider text-zinc-900">
                    FLAVOUR & VARIANT MANAGEMENT
                  </h3>
                </div>
                <p className="text-xs text-zinc-600 leading-relaxed">
                  Configure independent flavours and their respective weights, prices, and live stock quantities.
                  Customers will only see the weights available for their selected flavour.
                </p>
              </div>

              {/* Add New Flavour Form */}
              <div className="bg-white border border-zinc-200 rounded-2xl p-4 shadow-2xs">
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-800 mb-2 font-mono">
                  + Add New Flavour
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newFlavourInput}
                    onChange={(e) => setNewFlavourInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddFlavour();
                      }
                    }}
                    placeholder="e.g. Chocolate, Pista Kulfi, Vanilla Ice Cream"
                    className="flex-1 px-3.5 py-2.5 text-xs sm:text-sm bg-zinc-50 border border-zinc-200 rounded-xl outline-none focus:border-red-600 focus:bg-white"
                  />
                  <button
                    type="button"
                    onClick={handleAddFlavour}
                    className="px-5 py-2.5 bg-red-600 hover:bg-red-700 active:scale-98 text-white text-xs font-bold uppercase tracking-wider rounded-xl cursor-pointer flex items-center gap-1.5 shadow-sm shadow-red-600/20"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Flavour</span>
                  </button>
                </div>
              </div>

              {/* Flavours List */}
              {flavoursList.length === 0 ? (
                <div className="border-2 border-dashed border-zinc-200 rounded-2xl p-8 text-center bg-zinc-50/50">
                  <div className="w-12 h-12 rounded-2xl bg-zinc-100 text-zinc-400 flex items-center justify-center mx-auto mb-3">
                    <Layers className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-bold text-zinc-800 mb-1">No Flavours Added Yet</h4>
                  <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                    Type a flavour name above (e.g. "Chocolate" or "Pista Kulfi") and click Add Flavour to begin configuring weights, prices, and stock.
                  </p>
                </div>
              ) : (
                <div className="space-y-5">
                  {flavoursList.map((flavour, flvIdx) => {
                    const currentVariants = variants.filter(
                      (v) => v.flavour.trim().toLowerCase() === flavour.trim().toLowerCase()
                    );
                    const isEditingThisFlavour = editingFlavourIndex === flvIdx;
                    const weightForm = newWeightForms[flavour] || {
                      weight: '',
                      price: '',
                      originalPrice: '',
                      stock: '',
                    };

                    return (
                      <div
                        key={flavour}
                        className="bg-zinc-50 border border-zinc-200 rounded-2xl p-4 sm:p-5 shadow-2xs space-y-4"
                      >
                        {/* Flavour Title & Header Actions */}
                        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-zinc-200/80">
                          {isEditingThisFlavour ? (
                            <div className="flex items-center gap-2 flex-1 max-w-md">
                              <input
                                type="text"
                                value={editingFlavourText}
                                onChange={(e) => setEditingFlavourText(e.target.value)}
                                className="px-3 py-1.5 text-xs font-bold bg-white border border-red-500 rounded-lg outline-none focus:ring-2 focus:ring-red-500/20 flex-1"
                                autoFocus
                              />
                              <button
                                type="button"
                                onClick={() => handleSaveEditFlavour(flvIdx, flavour)}
                                className="px-3 py-1.5 bg-emerald-600 text-white text-[11px] font-bold rounded-lg hover:bg-emerald-700 cursor-pointer"
                              >
                                Save
                              </button>
                              <button
                                type="button"
                                onClick={() => setEditingFlavourIndex(null)}
                                className="px-3 py-1.5 bg-zinc-200 text-zinc-700 text-[11px] font-bold rounded-lg hover:bg-zinc-300 cursor-pointer"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2.5">
                              <span className="w-2.5 h-2.5 rounded-full bg-red-600" />
                              <h4 className="font-heading font-black text-sm uppercase tracking-wide text-zinc-950">
                                FLAVOUR: <span className="text-red-600">{flavour}</span>
                              </h4>
                              <span className="text-[10px] font-mono text-zinc-500 bg-white border border-zinc-200 px-2 py-0.5 rounded-md">
                                {currentVariants.length}{' '}
                                {currentVariants.length === 1 ? 'Weight' : 'Weights'}
                              </span>
                            </div>
                          )}

                          <div className="flex items-center gap-2">
                            {!isEditingThisFlavour && (
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingFlavourIndex(flvIdx);
                                  setEditingFlavourText(flavour);
                                }}
                                className="px-2.5 py-1 text-[11px] font-semibold text-zinc-600 hover:text-zinc-950 bg-white border border-zinc-200 rounded-lg hover:bg-zinc-100 transition-colors cursor-pointer"
                              >
                                Rename
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => handleDeleteFlavour(flavour)}
                              className="px-2.5 py-1 text-[11px] font-semibold text-red-600 hover:text-red-700 bg-white border border-red-200 rounded-lg hover:bg-red-50 transition-colors cursor-pointer flex items-center gap-1"
                            >
                              <Trash2 className="w-3 h-3" />
                              <span>Delete Flavour</span>
                            </button>
                          </div>
                        </div>

                        {/* Weights Table for this Flavour */}
                        {currentVariants.length === 0 ? (
                          <div className="p-4 bg-white/80 border border-dashed border-zinc-200 rounded-xl text-center text-xs text-zinc-500">
                            No weight options added under{' '}
                            <strong className="text-zinc-800">{flavour}</strong> yet. Add weights
                            below (e.g. 1 KG, 2 KG).
                          </div>
                        ) : (
                          <div className="overflow-x-auto bg-white rounded-xl border border-zinc-200">
                            <table className="w-full text-left text-xs">
                              <thead>
                                <tr className="border-b border-zinc-200 bg-zinc-100/70 text-[10px] font-mono uppercase font-bold text-zinc-600">
                                  <th className="py-2.5 px-3">Weight / Size</th>
                                  <th className="py-2.5 px-3">Selling Price (₹)</th>
                                  <th className="py-2.5 px-3">MRP (₹)</th>
                                  <th className="py-2.5 px-3">Stock Units</th>
                                  <th className="py-2.5 px-3 text-center">Status</th>
                                  <th className="py-2.5 px-3 text-right">Action</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-zinc-100">
                                {currentVariants.map((variant) => {
                                  return (
                                    <tr
                                      key={variant.id}
                                      className="hover:bg-zinc-50/70 transition-colors"
                                    >
                                      {/* Weight Name */}
                                      <td className="py-2.5 px-3">
                                        <input
                                          type="text"
                                          value={variant.weight}
                                          onChange={(e) =>
                                            handleUpdateVariantField(
                                              variant.id,
                                              'weight',
                                              e.target.value
                                            )
                                          }
                                          className="w-28 px-2 py-1 font-bold text-zinc-900 bg-zinc-50 border border-zinc-200 rounded-lg outline-none focus:border-red-600 focus:bg-white"
                                          placeholder="e.g. 1 KG"
                                        />
                                      </td>

                                      {/* Price */}
                                      <td className="py-2.5 px-3">
                                        <div className="flex items-center gap-1">
                                          <span className="text-zinc-400 font-mono">₹</span>
                                          <input
                                            type="number"
                                            min={0}
                                            value={variant.price || ''}
                                            onChange={(e) =>
                                              handleUpdateVariantField(
                                                variant.id,
                                                'price',
                                                e.target.value === '' ? 0 : Number(e.target.value)
                                              )
                                            }
                                            className="w-24 px-2 py-1 font-mono font-bold text-zinc-900 bg-zinc-50 border border-zinc-200 rounded-lg outline-none focus:border-red-600 focus:bg-white"
                                            placeholder="999"
                                          />
                                        </div>
                                      </td>

                                      {/* Original MRP */}
                                      <td className="py-2.5 px-3">
                                        <div className="flex items-center gap-1">
                                          <span className="text-zinc-400 font-mono">₹</span>
                                          <input
                                            type="number"
                                            min={0}
                                            value={variant.originalPrice || ''}
                                            onChange={(e) =>
                                              handleUpdateVariantField(
                                                variant.id,
                                                'originalPrice',
                                                e.target.value === '' ? 0 : Number(e.target.value)
                                              )
                                            }
                                            className="w-24 px-2 py-1 font-mono text-zinc-600 bg-zinc-50 border border-zinc-200 rounded-lg outline-none focus:border-red-600 focus:bg-white"
                                            placeholder="1499"
                                          />
                                        </div>
                                      </td>

                                      {/* Stock */}
                                      <td className="py-2.5 px-3">
                                        <input
                                          type="number"
                                          min={0}
                                          value={variant.stock === ('' as any) ? '' : variant.stock}
                                          onChange={(e) => {
                                            const newStockVal =
                                              e.target.value === '' ? 0 : Number(e.target.value);
                                            handleUpdateVariantField(
                                              variant.id,
                                              'stock',
                                              newStockVal
                                            );
                                          }}
                                          className="w-20 px-2 py-1 font-mono font-bold text-zinc-900 bg-zinc-50 border border-zinc-200 rounded-lg outline-none focus:border-red-600 focus:bg-white"
                                          placeholder="10"
                                        />
                                      </td>

                                      {/* Status Toggle & Auto Out of Stock */}
                                      <td className="py-2.5 px-3 text-center whitespace-nowrap">
                                        <button
                                          type="button"
                                          onClick={() =>
                                            handleToggleVariantActive(variant.id, !variant.isActive)
                                          }
                                          className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase transition-all cursor-pointer ${
                                            variant.stock === 0
                                              ? 'bg-red-100 text-red-700 border border-red-200'
                                              : variant.isActive
                                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                              : 'bg-zinc-200 text-zinc-600 border border-zinc-300'
                                          }`}
                                        >
                                          {variant.stock === 0
                                            ? 'Out of Stock'
                                            : variant.isActive
                                            ? 'Active'
                                            : 'Disabled'}
                                        </button>
                                      </td>

                                      {/* Delete Action */}
                                      <td className="py-2.5 px-3 text-right">
                                        <button
                                          type="button"
                                          onClick={() => handleDeleteVariant(variant.id)}
                                          className="p-1 text-zinc-400 hover:text-red-600 transition-colors cursor-pointer"
                                          title="Remove this weight option"
                                        >
                                          <Trash2 className="w-4 h-4" />
                                        </button>
                                      </td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
                        )}

                        {/* Add Weight Row Form under this Flavour */}
                        <div className="bg-white border border-zinc-200 rounded-xl p-3">
                          <span className="block text-[11px] font-bold uppercase tracking-wider text-zinc-700 mb-2 font-mono">
                            + Add Weight Under {flavour}
                          </span>
                          <div className="flex flex-wrap items-center gap-2">
                            <input
                              type="text"
                              value={weightForm.weight}
                              onChange={(e) =>
                                handleWeightFormChange(flavour, 'weight', e.target.value)
                              }
                              placeholder="Weight (e.g. 1 KG)"
                              className="w-32 px-3 py-1.5 text-xs bg-zinc-50 border border-zinc-200 rounded-lg outline-none focus:border-red-600 focus:bg-white"
                            />
                            <input
                              type="number"
                              min={0}
                              value={weightForm.price}
                              onChange={(e) =>
                                handleWeightFormChange(
                                  flavour,
                                  'price',
                                  e.target.value === '' ? '' : Number(e.target.value)
                                )
                              }
                              placeholder="₹ Price (e.g. 999)"
                              className="w-32 px-3 py-1.5 text-xs bg-zinc-50 border border-zinc-200 rounded-lg outline-none focus:border-red-600 focus:bg-white"
                            />
                            <input
                              type="number"
                              min={0}
                              value={weightForm.originalPrice}
                              onChange={(e) =>
                                handleWeightFormChange(
                                  flavour,
                                  'originalPrice',
                                  e.target.value === '' ? '' : Number(e.target.value)
                                )
                              }
                              placeholder="₹ MRP (e.g. 1499)"
                              className="w-32 px-3 py-1.5 text-xs bg-zinc-50 border border-zinc-200 rounded-lg outline-none focus:border-red-600 focus:bg-white"
                            />
                            <input
                              type="number"
                              min={0}
                              value={weightForm.stock}
                              onChange={(e) =>
                                handleWeightFormChange(
                                  flavour,
                                  'stock',
                                  e.target.value === '' ? '' : Number(e.target.value)
                                )
                              }
                              placeholder="Stock (e.g. 15)"
                              className="w-24 px-3 py-1.5 text-xs bg-zinc-50 border border-zinc-200 rounded-lg outline-none focus:border-red-600 focus:bg-white"
                            />
                            <button
                              type="button"
                              onClick={() => handleAddWeightToFlavour(flavour)}
                              className="px-4 py-1.5 bg-zinc-900 hover:bg-black text-white text-xs font-bold rounded-lg cursor-pointer transition-colors"
                            >
                              Add Weight
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Fitness Goals */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-2">
                  Supported Fitness Goals
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {ALL_GOALS.map((goal) => {
                    const selected = selectedGoals.includes(goal.id);
                    return (
                      <button
                        type="button"
                        key={goal.id}
                        onClick={() => {
                          if (selected) {
                            setSelectedGoals(selectedGoals.filter((g) => g !== goal.id));
                          } else {
                            setSelectedGoals([...selectedGoals, goal.id]);
                          }
                        }}
                        className={`py-2 px-3 text-xs font-bold rounded-xl border text-left transition-all cursor-pointer ${
                          selected
                            ? 'bg-red-50 border-red-500 text-red-600'
                            : 'bg-zinc-50 border-zinc-200 text-zinc-600 hover:bg-zinc-100'
                        }`}
                      >
                        {selected ? '✓ ' : '+ '} {goal.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Key Benefits */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-2">
                  Key Benefits Bullet Points
                </label>
                {benefits.length === 0 ? (
                  <p className="text-xs text-zinc-400 italic mb-3">No key benefits added yet. Add formula advantages below:</p>
                ) : (
                  <div className="space-y-2 mb-3">
                    {benefits.map((b, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-zinc-800 bg-zinc-50 p-2 rounded-xl border border-zinc-200">
                        <span className="flex-1">{b}</span>
                        <button
                          type="button"
                          onClick={() => setBenefits(benefits.filter((_, i) => i !== idx))}
                          className="text-zinc-400 hover:text-red-600 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newBenefit}
                    onChange={(e) => setNewBenefit(e.target.value)}
                    placeholder="e.g. 24g pure whey isolate per scoop"
                    className="flex-1 px-3.5 py-2 text-sm bg-zinc-50 border border-zinc-200 rounded-xl outline-none focus:border-red-600 focus:bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (newBenefit.trim()) {
                        setBenefits([...benefits, newBenefit.trim()]);
                        setNewBenefit('');
                      }
                    }}
                    className="px-4 py-2 bg-zinc-900 text-white text-xs font-bold rounded-xl hover:bg-zinc-800 cursor-pointer"
                  >
                    Add Benefit
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: NUTRITION & DETAILS */}
          {activeTab === 'nutrition' && (
            <div className="space-y-6">
              {/* Nutrition Facts Table */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-700">
                    Nutrition Facts (Per Serving)
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      setNutritionFacts([...nutritionFacts, { nutrient: '', amountPerServing: '' }])
                    }
                    className="text-xs font-bold text-red-600 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Row
                  </button>
                </div>

                {nutritionFacts.length === 0 ? (
                  <div className="p-4 bg-zinc-50 border border-dashed border-zinc-300 rounded-2xl text-center text-xs text-zinc-500">
                    No nutrition facts added. Click <strong className="text-red-600">+ Add Row</strong> to add nutrients (or leave empty if this product does not have a nutrition facts label).
                  </div>
                ) : (
                  <div className="space-y-2">
                    {nutritionFacts.map((fact, idx) => (
                      <div key={idx} className="flex gap-2 items-center">
                        <input
                          type="text"
                          value={fact.nutrient}
                          onChange={(e) => {
                            const updated = [...nutritionFacts];
                            updated[idx].nutrient = e.target.value;
                            setNutritionFacts(updated);
                          }}
                          placeholder="Nutrient (e.g. Total Protein)"
                          className="flex-1 px-3 py-2 text-xs bg-zinc-50 border border-zinc-200 rounded-xl outline-none focus:border-red-600 focus:bg-white"
                        />
                        <input
                          type="text"
                          value={fact.amountPerServing}
                          onChange={(e) => {
                            const updated = [...nutritionFacts];
                            updated[idx].amountPerServing = e.target.value;
                            setNutritionFacts(updated);
                          }}
                          placeholder="Amount (e.g. 24 g)"
                          className="w-32 px-3 py-2 text-xs bg-zinc-50 border border-zinc-200 rounded-xl outline-none focus:border-red-600 focus:bg-white"
                        />
                        <button
                          type="button"
                          onClick={() => setNutritionFacts(nutritionFacts.filter((_, i) => i !== idx))}
                          className="p-2 text-zinc-400 hover:text-red-600 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1">
                  Product Description
                </label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. Enter detailed clinical formulation and product summary..."
                  className="w-full px-3.5 py-2.5 text-sm bg-zinc-50 border border-zinc-200 rounded-xl outline-none focus:border-red-600 focus:bg-white"
                />
              </div>

              {/* Fitness guidance fields shown on the product detail page */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1">
                    Who Is This Product For?
                  </label>
                  <textarea
                    rows={3}
                    value={whoIsItForText}
                    onChange={(e) => setWhoIsItForText(e.target.value)}
                    placeholder="e.g. Athletes and fitness enthusiasts"
                    className="w-full px-3.5 py-2.5 text-sm bg-zinc-50 border border-zinc-200 rounded-xl outline-none focus:border-red-600 focus:bg-white"
                  />
                  <p className="text-[11px] text-zinc-500 mt-1">Separate multiple audiences with commas.</p>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1">
                    What Goal Does It Support?
                  </label>
                  <textarea
                    rows={3}
                    value={goalSupportedText}
                    onChange={(e) => setGoalSupportedText(e.target.value)}
                    placeholder="e.g. Supports muscle repair, tissue synthesis, and exercise recovery."
                    className="w-full px-3.5 py-2.5 text-sm bg-zinc-50 border border-zinc-200 rounded-xl outline-none focus:border-red-600 focus:bg-white"
                  />
                </div>
              </div>

              {/* Ingredients & How to use */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1">
                    Ingredients List
                  </label>
                  <textarea
                    rows={3}
                    value={ingredients}
                    onChange={(e) => setIngredients(e.target.value)}
                    placeholder="e.g. Whey protein isolate, cocoa, lecithin, stevia..."
                    className="w-full px-3.5 py-2.5 text-sm bg-zinc-50 border border-zinc-200 rounded-xl outline-none focus:border-red-600 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1">
                    How To Use Instructions
                  </label>
                  <textarea
                    rows={3}
                    value={howToUse}
                    onChange={(e) => setHowToUse(e.target.value)}
                    placeholder="e.g. Mix 1 scoop with 200ml cold water or milk."
                    className="w-full px-3.5 py-2.5 text-sm bg-zinc-50 border border-zinc-200 rounded-xl outline-none focus:border-red-600 focus:bg-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: MEDIA & IMAGES */}
          {activeTab === 'media' && (
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-2">
                  Product Images
                </label>
                {images.length === 0 ? (
                  <div className="p-6 bg-zinc-50 border border-dashed border-zinc-300 rounded-2xl text-center text-xs text-zinc-500 mb-4">
                    No product images added yet. Upload an image file below or enter an image URL.
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                    {images.map((img, idx) => (
                      <div key={idx} className="relative group rounded-2xl overflow-hidden border border-zinc-200 aspect-square bg-zinc-100 flex items-center justify-center">
                        <img src={img} alt="" className="w-full h-full object-contain p-2" />
                        <button
                          type="button"
                          onClick={() => setImages(images.filter((_, i) => i !== idx))}
                          className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-full opacity-90 hover:opacity-100 shadow cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex gap-2 mb-4">
                  <input
                    type="text"
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    placeholder="Paste image CDN URL (https://...)"
                    className="flex-1 px-3.5 py-2 text-sm bg-zinc-50 border border-zinc-200 rounded-xl outline-none focus:border-red-600 focus:bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (newImageUrl.trim()) {
                        setImages([...images, newImageUrl.trim()]);
                        setNewImageUrl('');
                      }
                    }}
                    className="px-4 py-2 bg-zinc-900 text-white text-xs font-bold rounded-xl hover:bg-zinc-800 cursor-pointer"
                  >
                    Add URL
                  </button>
                </div>

                {/* Direct Upload to Supabase Storage */}
                <div className="border-2 border-dashed border-zinc-200 rounded-2xl p-6 text-center bg-zinc-50 hover:bg-zinc-100/60 transition-colors">
                  <Upload className="w-8 h-8 text-zinc-400 mx-auto mb-2" />
                  <p className="text-xs font-bold text-zinc-700 uppercase tracking-wide">
                    {uploadingImage ? 'Uploading Image to Supabase...' : 'Upload Image File'}
                  </p>
                  <p className="text-[11px] text-zinc-400 mt-1 mb-3">PNG, JPG, WEBP up to 5MB</p>
                  <label className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-zinc-300 rounded-xl text-xs font-bold text-zinc-700 hover:border-red-600 hover:text-red-600 cursor-pointer shadow-sm">
                    <span>Browse Files</span>
                    <input
                      type="file"
                      accept="image/*"
                      disabled={uploadingImage}
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Footer Submit Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-100">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-lg shadow-red-600/25 flex items-center gap-2 cursor-pointer"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Check className="w-4 h-4" />
              )}
              <span>{productToEdit ? 'Save Changes' : 'Create Product'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
