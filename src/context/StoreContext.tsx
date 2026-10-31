import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, CartItem, Order, ProductVariant } from '../types';
import { productsService } from '../lib/products.service';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

export type PageRoute =
  | 'home'
  | 'shop'
  | 'categories'
  | 'product'
  | 'category'
  | 'brand'
  | 'goal'
  | 'cart'
  | 'checkout'
  | 'order-success'
  | 'order-cancel'
  | 'wishlist'
  | 'account'
  | 'track-order'
  | 'about'
  | 'our-gym'
  | 'contact'
  | 'article'
  | 'faq'
  | 'shipping-policy'
  | 'return-policy'
  | 'terms'
  | 'demo-orders'
  | 'admin';

export interface RouteParams {
  productId?: string;
  categorySlug?: string;
  brandSlug?: string;
  goalSlug?: string;
  orderId?: string;
  sessionId?: string;
  searchQuery?: string;
  articleSlug?: string;
}

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  type?: 'success' | 'info' | 'error';
}

interface StoreContextType {
  // Products
  products: Product[];
  refreshProducts: () => Promise<void>;
  isLoadingProducts: boolean;

  // Navigation
  currentPage: PageRoute;
  routeParams: RouteParams;
  navigate: (page: PageRoute, params?: RouteParams) => void;

  // Cart
  cart: CartItem[];
  addToCart: (
    product: Product,
    quantity?: number,
    flavour?: string,
    size?: string,
    variant?: ProductVariant
  ) => void;
  removeFromCart: (itemId: string) => void;
  updateCartQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  cartCount: number;
  cartSubtotal: number;
  shippingFee: number;
  discountAmount: number;
  appliedCoupon: string | null;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
  freeShippingThreshold: number;

  // Wishlist
  wishlist: Product[];
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;
  moveToCartFromWishlist: (product: Product) => void;

  // Search & Modals
  searchOpen: boolean;
  setSearchOpen: (open: boolean) => void;
  quickViewProduct: Product | null;
  setQuickViewProduct: (product: Product | null) => void;

  // Orders & Checkout
  orders: Order[];
  refreshOrders: () => Promise<void>;
  placeOrder: (orderData: Omit<Order, 'id' | 'date' | 'status' | 'trackingNumber'>) => Order;

  // Toasts
  toasts: ToastMessage[];
  addToast: (title: string, description?: string, type?: 'success' | 'info' | 'error') => void;
  removeToast: (id: string) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const FREE_SHIPPING_THRESHOLD = 999;
const STANDARD_SHIPPING_FEE = 99;

const getInitialPageFromUrl = (): PageRoute => {
  if (typeof window === 'undefined') return 'home';
  const path = window.location.pathname.replace(/^\/+|\/+$/g, '').toLowerCase();
  const hash = window.location.hash.replace(/^#\/?/, '').toLowerCase();
  if (path === 'admin' || hash === 'admin') return 'admin';
  if (path === 'shop' || hash === 'shop') return 'shop';
  if (path === 'our-gym' || hash === 'our-gym') return 'our-gym';
  if (path === 'account' || hash === 'account') return 'account';
  if (path === 'cart' || hash === 'cart') return 'cart';
  if (path === 'checkout' || hash === 'checkout') return 'checkout';
  if (path === 'wishlist' || hash === 'wishlist') return 'wishlist';
  if (path === 'order/success' || path === 'order-success' || hash === 'order-success') return 'order-success';
  if (path === 'order/cancel' || path === 'order-cancel' || hash === 'order-cancel') return 'order-cancel';
  
  return 'home';
};

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user, openAuthModal } = useAuth();
  // Live Products State
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);

  const loadProducts = async () => {
    setIsLoadingProducts(true);
    const { products: fetched } = await productsService.getProducts();
    setProducts(fetched);
    setIsLoadingProducts(false);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  // Navigation State
  const [currentPage, setCurrentPage] = useState<PageRoute>(getInitialPageFromUrl);
  const [routeParams, setRouteParams] = useState<RouteParams>({});

  // Keep the browser Back/Forward buttons in sync with this React SPA.
  useEffect(() => {
    const initialState = window.history.state;
    const urlPage = getInitialPageFromUrl();

    if (urlPage !== 'home') {
      setCurrentPage(urlPage);
      window.history.replaceState(
        { appRoute: true, page: urlPage, params: {} },
        '',
        window.location.href
      );
    } else if (initialState?.appRoute && initialState.page) {
      setCurrentPage(initialState.page as PageRoute);
      setRouteParams(initialState.params || {});
    } else {
      window.history.replaceState(
        { appRoute: true, page: 'home', params: {} },
        '',
        window.location.href
      );
    }

    const handlePopState = (event: PopStateEvent) => {
      const state = event.state;

      if (state?.appRoute && state.page) {
        setCurrentPage(state.page as PageRoute);
        setRouteParams(state.params || {});
        window.scrollTo({ top: 0, behavior: 'auto' });
      } else {
        setCurrentPage(getInitialPageFromUrl());
      }
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  // Cart State (Persisted)
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('ironforge_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Wishlist State (Persisted)
  const [wishlist, setWishlist] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('ironforge_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Orders State (Fetched from Supabase)
  const [orders, setOrders] = useState<Order[]>([]);

  const loadOrders = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setOrders([]);
        return;
      }

      const { data, error } = await supabase
        .from('orders')
        .select('*, order_items(*)')
        .order('created_at', { ascending: false });

      if (error || !data) {
        return;
      }

      const mappedOrders: Order[] = data.map((o) => ({
        id: o.id,
        orderNumber: o.order_number,
        date: new Date(o.created_at).toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        }),
        items: (o.order_items || []).map((item: any) => ({
          id: item.id,
          product: {
            id: item.product_id,
            name: item.product_name,
            brand: item.product_brand,
            price: item.unit_price_paise / 100,
            originalPrice: item.unit_price_paise / 100,
            discount: 0,
            rating: 4.8,
            reviewCount: 1,
            category: 'Supplements',
            images: item.product_image ? [item.product_image] : [],
            flavours: [item.selected_flavour],
            sizes: [item.selected_size],
            inStock: true,
            stock: 10,
            description: '',
            features: [],
            nutritionFacts: {},
          },
          quantity: item.quantity,
          selectedFlavour: item.selected_flavour,
          selectedSize: item.selected_size,
        })),
        subtotal: o.subtotal_paise / 100,
        discount: o.discount_paise / 100,
        shipping: o.shipping_paise / 100,
        total: o.total_paise / 100,
        status: o.status,
        trackingNumber:
          o.tracking_number ||
          (o.status === 'processing' || o.status === 'paid'
            ? 'Pending Courier Pickup'
            : 'N/A'),
        shippingAddress: o.shipping_address,
        paymentMethod:
          o.payment_method === 'stripe' || o.payment_method === 'razorpay'
            ? 'Online Payment (Razorpay)'
            : 'Cash on Delivery (COD)',
        paymentStatus:
          o.payment_status === 'paid'
            ? 'Paid'
            : o.payment_status === 'cod_pending'
            ? 'Pending COD'
            : o.payment_status,
        notes: o.notes,
        estimatedDelivery: (() => {
          try {
            if (o.notes) {
              const parsed = JSON.parse(o.notes);
              return parsed.estimated_delivery_text || parsed.estimated_delivery;
            }
          } catch {}
          return null;
        })(),
      }));

      setOrders(mappedOrders);
    } catch (err) {
      console.warn('Failed to load user orders:', err);
    }
  };

  useEffect(() => {
    loadOrders();
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      loadOrders();
    });
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // UI Drawer / Modals
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Persist Cart
  useEffect(() => {
    try {
      localStorage.setItem('ironforge_cart', JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart]);

  // Persist Wishlist
  useEffect(() => {
    try {
      localStorage.setItem('ironforge_wishlist', JSON.stringify(wishlist));
    } catch (e) {
      console.error(e);
    }
  }, [wishlist]);

  // Persist Orders
  useEffect(() => {
    try {
      localStorage.setItem('ironforge_orders', JSON.stringify(orders));
    } catch (e) {
      console.error(e);
    }
  }, [orders]);

  // Toast Helper
  const addToast = (title: string, description?: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, title, description, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 3800);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Navigation Helper
  const navigate = (page: PageRoute, params: RouteParams = {}) => {
    const newUrl = page === 'home' ? '/' : `/${page}`;
    window.history.pushState(
      { appRoute: true, page, params },
      '',
      newUrl
    );

    setCurrentPage(page);
    setRouteParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Cart Functions
  const addToCart = (
    product: Product,
    quantity = 1,
    flavour?: string,
    size?: string,
    variant?: ProductVariant
  ) => {
    if (!user) {
      addToast('Sign In Required', 'Please sign in to add products to your cart and place orders.', 'error');
      openAuthModal('login', 'Please sign in to add items to your cart & place orders');
      return;
    }

    const selectedFlavour = flavour || variant?.flavour || product.flavours[0] || 'Standard';
    const selectedSize = size || variant?.weight || product.sizes[0] || 'Standard';
    const variantId = variant?.id;
    const variantPrice =
      variant?.price !== undefined
        ? Number(variant.price)
        : Number(product.price);

    // Differentiate items by unique variantId or flavour+size
    const itemId = variantId
      ? `${product.id}-${variantId}`
      : `${product.id}-${selectedFlavour}-${selectedSize}`;

    setCart((prev) => {
      const existing = prev.find((item) => item.id === itemId);
      if (existing) {
        return prev.map((item) =>
          item.id === itemId ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [
        ...prev,
        {
          id: itemId,
          product: {
            ...product,
            price: variantPrice,
          },
          quantity,
          selectedFlavour,
          selectedSize,
          variantId,
          variantPrice,
        },
      ];
    });

    addToast(
      `Added to Cart`,
      `${product.name} (${selectedFlavour}, ${selectedSize}) - ₹${variantPrice.toLocaleString('en-IN')}`,
      'success'
    );
    setCartOpen(true);
  };

  const removeFromCart = (itemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== itemId));
    addToast('Removed from cart', undefined, 'info');
  };

  const updateCartQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cart.reduce((sum, item) => {
    const price = item.variantPrice !== undefined ? item.variantPrice : item.product.price;
    return sum + price * item.quantity;
  }, 0);

  // Discount Calculation
  let discountAmount = 0;
  if (appliedCoupon === 'WORKOUT10' || appliedCoupon === 'IRON10') {
    discountAmount = Math.round(cartSubtotal * 0.1);
  } else if (appliedCoupon === 'FITINDIA') {
    discountAmount = Math.min(cartSubtotal, 250);
  } else if (appliedCoupon === 'BULK500') {
    discountAmount = cartSubtotal >= 5000 ? 500 : 0;
  }

  const shippingFee = cartSubtotal === 0 || cartSubtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_FEE;

  const applyCoupon = (code: string): boolean => {
    const formatted = code.trim().toUpperCase();
    if (formatted === 'WORKOUT10' || formatted === 'IRON10') {
      setAppliedCoupon('WORKOUT10');
      addToast('Coupon Applied!', '10% instant discount applied to your order', 'success');
      return true;
    }
    if (formatted === 'FITINDIA') {
      setAppliedCoupon('FITINDIA');
      addToast('Coupon Applied!', 'Flat ₹250 discount applied', 'success');
      return true;
    }
    if (formatted === 'BULK500') {
      if (cartSubtotal >= 5000) {
        setAppliedCoupon('BULK500');
        addToast('Coupon Applied!', '₹500 off applied on bulk order', 'success');
        return true;
      } else {
        addToast('Coupon Invalid', 'Requires minimum cart value of ₹5,000', 'error');
        return false;
      }
    }
    addToast('Invalid Coupon', 'Please check promo code or try "IRON10"', 'error');
    return false;
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    addToast('Coupon removed', undefined, 'info');
  };

  // Wishlist Functions
  const isInWishlist = (productId: string) => {
    return wishlist.some((p) => p.id === productId);
  };

  const toggleWishlist = (product: Product) => {
    if (isInWishlist(product.id)) {
      setWishlist((prev) => prev.filter((p) => p.id !== product.id));
      addToast('Removed from Wishlist', product.name, 'info');
    } else {
      setWishlist((prev) => [...prev, product]);
      addToast('Added to Wishlist', product.name, 'success');
    }
  };

  const moveToCartFromWishlist = (product: Product) => {
    addToCart(product);
    setWishlist((prev) => prev.filter((p) => p.id !== product.id));
  };

  // Order Creation
  const placeOrder = (orderData: Omit<Order, 'id' | 'date' | 'status' | 'trackingNumber'>): Order => {
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    const newOrder: Order = {
      ...orderData,
      id: `IF-${randomNum}`,
      date: 'Just now',
      status: 'Processing',
      trackingNumber: `DELHIVERY-${Math.floor(100000000 + Math.random() * 900000000)}`,
    };
    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    setAppliedCoupon(null);
    return newOrder;
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        refreshProducts: loadProducts,
        isLoadingProducts,
        currentPage,
        routeParams,
        navigate,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartOpen,
        setCartOpen,
        cartCount,
        cartSubtotal,
        shippingFee,
        discountAmount,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
        wishlist,
        toggleWishlist,
        isInWishlist,
        moveToCartFromWishlist,
        searchOpen,
        setSearchOpen,
        quickViewProduct,
        setQuickViewProduct,
        orders,
        refreshOrders: loadOrders,
        placeOrder,
        toasts,
        addToast,
        removeToast,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = (): StoreContextType => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
