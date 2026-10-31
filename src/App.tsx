/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { Suspense, lazy } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { AuthProvider } from './context/AuthContext';

import { Header } from './components/common/Header';
import { MobileBottomBar } from './components/common/MobileBottomBar';
import { Footer } from './components/common/Footer';
import { CartDrawer } from './components/common/CartDrawer';
import { SearchModal } from './components/common/SearchModal';
import { QuickViewModal } from './components/common/QuickViewModal';
import { FloatingWhatsApp } from './components/common/FloatingWhatsApp';
import { BackToTop } from './components/common/BackToTop';
import { ToastNotification } from './components/common/ToastNotification';
import { AuthModal } from './components/auth/AuthModal';

// Code-split pages for high performance and fast initial load
const HomePage = lazy(() => import('./components/pages/HomePage').then((m) => ({ default: m.HomePage })));
const ShopPage = lazy(() => import('./components/pages/ShopPage').then((m) => ({ default: m.ShopPage })));
const CategoryPage = lazy(() => import('./components/pages/CategoryPage').then((m) => ({ default: m.CategoryPage })));
const BrandPage = lazy(() => import('./components/pages/BrandPage').then((m) => ({ default: m.BrandPage })));
const GoalPage = lazy(() => import('./components/pages/GoalPage').then((m) => ({ default: m.GoalPage })));
const ProductDetailPage = lazy(() => import('./components/pages/ProductDetailPage').then((m) => ({ default: m.ProductDetailPage })));
const ArticlePage = lazy(() => import('./components/pages/ArticlePage').then((m) => ({ default: m.ArticlePage })));
const CartPage = lazy(() => import('./components/pages/CartPage').then((m) => ({ default: m.CartPage })));
const CheckoutPage = lazy(() => import('./components/pages/CheckoutPage').then((m) => ({ default: m.CheckoutPage })));
const OrderSuccessPage = lazy(() => import('./components/pages/OrderSuccessPage').then((m) => ({ default: m.OrderSuccessPage })));
const OrderCancelPage = lazy(() => import('./components/pages/OrderCancelPage').then((m) => ({ default: m.OrderCancelPage })));
const WishlistPage = lazy(() => import('./components/pages/WishlistPage').then((m) => ({ default: m.WishlistPage })));
const AccountPage = lazy(() => import('./components/pages/AccountPage').then((m) => ({ default: m.AccountPage })));
const OrderTrackingPage = lazy(() => import('./components/pages/OrderTrackingPage').then((m) => ({ default: m.OrderTrackingPage })));
const AdminProductsPage = lazy(() => import('./components/admin/AdminProductsPage').then((m) => ({ default: m.AdminProductsPage })));
const OurGymPage = lazy(() => import('./components/pages/OurGymPage').then((m) => ({ default: m.OurGymPage })));

const AboutPage = lazy(() => import('./components/pages/StaticPages').then((m) => ({ default: m.AboutPage })));
const ContactPage = lazy(() => import('./components/pages/StaticPages').then((m) => ({ default: m.ContactPage })));
const FAQPage = lazy(() => import('./components/pages/StaticPages').then((m) => ({ default: m.FAQPage })));
const PolicyPage = lazy(() => import('./components/pages/StaticPages').then((m) => ({ default: m.PolicyPage })));

const PageLoadingFallback: React.FC = () => (
  <div className="min-h-[60vh] flex flex-col items-center justify-center p-8">
    <div className="w-10 h-10 border-3 border-red-600 border-t-transparent rounded-full animate-spin mb-3" />
    <span className="text-xs font-mono uppercase tracking-wider text-zinc-400">Loading...</span>
  </div>
);

const MainRouter: React.FC = () => {
  const { currentPage } = useStore();

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage />;

      case 'shop':
        return <ShopPage />;

      case 'category':
        return <CategoryPage />;

      case 'brand':
        return <BrandPage />;

      case 'goal':
        return <GoalPage />;

      case 'product':
        return <ProductDetailPage />;

      case 'article':
        return <ArticlePage />;

      case 'cart':
        return <CartPage />;

      case 'checkout':
        return <CheckoutPage />;

      case 'order-success':
        return <OrderSuccessPage />;

      case 'order-cancel':
        return <OrderCancelPage />;

      case 'wishlist':
        return <WishlistPage />;

      case 'account':
        return <AccountPage />;

      case 'track-order':
        return <OrderTrackingPage />;

      case 'admin':
        return <AdminProductsPage />;

      case 'our-gym':
        return <OurGymPage />;

      case 'about':
        return <AboutPage />;

      case 'contact':
        return <ContactPage />;

      case 'faq':
        return <FAQPage />;

      case 'shipping-policy':
        return <PolicyPage type="shipping" />;

      case 'return-policy':
        return <PolicyPage type="return" />;

      case 'terms':
        return <PolicyPage type="terms" />;

      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-zinc-900 selection:bg-red-600 selection:text-white">
      {/* Website header on every page */}
      <Header />

      {/* Main page content with Suspense for lazy chunks */}
      <main className="flex-1 w-full">
        <Suspense fallback={<PageLoadingFallback />}>
          {renderPage()}
        </Suspense>
      </main>

      {/* Website Footer */}
      <Footer />

      {/* Mobile navigation */}
      <MobileBottomBar />

      {/* Overlays, modals and drawers */}
      <CartDrawer />
      <SearchModal />
      <QuickViewModal />
      <FloatingWhatsApp />
      <BackToTop />
      <ToastNotification />
      <AuthModal />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <StoreProvider>
        <MainRouter />
      </StoreProvider>
    </AuthProvider>
  );
}
