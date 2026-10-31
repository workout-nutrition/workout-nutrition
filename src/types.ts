export type GoalType =
  | 'build-muscle'
  | 'gain-weight'
  | 'lose-fat'
  | 'increase-strength'
  | 'boost-energy'
  | 'increase-energy'
  | 'improve-performance'
  | 'recovery'
  | 'health-wellness'
  | 'general-wellness';

export type CategoryType =
  | 'BCAA'
  | 'BCAA & EAA'
  | 'Breakfast'
  | 'Creatine'
  | 'EAA'
  | 'Fat Burner'
  | 'Fish Oil'
  | 'Gaining Formula'
  | 'Glutamine'
  | 'L- Carnitine'
  | 'L-Citrulline'
  | 'Liver Support'
  | 'Mass Gainer'
  | 'Multivitamin'
  | 'Multivitamins'
  | 'Others'
  | 'Peanut Butter'
  | 'Pre Workout'
  | 'Pre Workouts'
  | 'TAN'
  | 'TEST Booster'
  | 'Whey Protein'
  | 'Whey Isolate'
  | 'ZMA';


export interface NutritionFact {
  nutrient: string;
  amountPerServing: string;
  dailyValue?: string;
}

export interface SizeVariant {
  size: string;
  price: number;
  originalPrice: number;
}

export interface ProductVariant {
  id: string;
  productId?: string;
  flavour: string;
  weight: string;
  price: number;
  originalPrice?: number;
  stock: number;
  isActive: boolean;
}

export interface Product {
  id: string;
  slug: string;
  brand: string;
  name: string;
  category: CategoryType;
  subcategory: string;
  price: number;
  originalPrice: number;
  discount: number;
  rating: number;
  reviewCount: number;
  images: string[];
  description: string;
  benefits: string[];
  ingredients: string;
  servings: number;
  flavours: string[];
  sizes: string[];
  sizeVariants?: SizeVariant[]; // Optional per-size pricing (legacy)
  variants?: ProductVariant[]; // Dynamic flavour-based weight variants with individual price & stock
  stock: number;
  isBestSeller?: boolean;
  isFeatured?: boolean;
  isNew?: boolean;
  tags: string[];
  goals: GoalType[];
  dietary: 'Vegetarian' | 'Non-Vegetarian' | 'Vegan' | 'Gluten-Free';
  nutritionFacts: NutritionFact[];
  howToUse: string;
  flavourNotes?: string;
  whoIsItFor?: string[];
  whenToUse?: string;
  goalSupported?: string;
  whatGoalDoesItSupport?: string;
  authenticityDetails?: string;
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  origin: string;
  tagline: string;
  description: string;
  featured?: boolean;
  productCount?: number;
  badge?: string;
}

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  selectedFlavour: string;
  selectedSize: string; // weight / size
  variantId?: string;
  variantPrice?: number; // individual variant price
}

export interface Order {
  id: string;
  orderNumber?: string;
  date: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  status: string;
  trackingNumber: string;
  shippingAddress: {
    fullName: string;
    phone: string;
    addressLine: string;
    city: string;
    state: string;
    pinCode: string;
  };
  paymentMethod: string;
  paymentStatus: string;
  notes?: string;
  estimatedDelivery?: string;
}

export interface Review {
  id: string;
  author: string;
  city: string;
  rating: number;
  date: string;
  verified: boolean;
  comment: string;
  productName: string;
}

export interface Article {
  id: string;
  slug: string;
  category: string;
  title: string;
  shortDescription: string;
  readTime: string;
  image: string;
  author: string;
  date: string;
  content: string[];
  keyTakeaways: string[];
  relatedCategorySlug?: string;
}

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  phone: string;
  role: 'customer' | 'admin';
  addressLine?: string;
  city?: string;
  state?: string;
  pinCode?: string;
  createdAt?: string;
}
