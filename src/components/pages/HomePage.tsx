
import React from 'react';
import { HeroSlider } from '../home/HeroSlider';
import { TrustBenefitsStrip } from '../home/TrustBenefitsStrip';
import { ShopByGoalSection } from '../home/ShopByGoalSection';
import { BestSellersSection } from '../home/BestSellersSection';
import { ShopByCategorySection } from '../home/ShopByCategorySection';
import { ShopTopBrandsSection } from '../home/ShopTopBrandsSection';
import { DealsSection } from '../home/DealsSection';
import { FitnessEducationSection } from '../home/FitnessEducationSection';
import { ProductRecommendationSection } from '../home/ProductRecommendationSection';
import { CustomerReviewsSection } from '../home/CustomerReviewsSection';
import { FAQSection } from '../home/FAQSection';
import { SocialGridSection } from '../home/SocialGridSection';
import { NewsletterSection } from '../home/NewsletterSection';
import { NextLevelGymSection } from '../home/NextLevelGymSection';
import { usePageSEO } from '../../utils/seo';

export const HomePage: React.FC = () => {
  usePageSEO({
    title: 'WORKOUT NUTRITION | 100% Authentic Sports Supplements & Fitness Store India',
    description:
      "India's premier authentic sports nutrition store. Shop whey protein, creatine, pre-workout, mass gainers, and wellness supplements with verified batch authenticity and fast Pan-India delivery.",
  });

  return (
    <div className="w-full">
      <HeroSlider />
      <TrustBenefitsStrip />
      <ShopByGoalSection />
      <BestSellersSection />
      <ShopByCategorySection />
      <DealsSection />
      <ShopTopBrandsSection />

      <div id="fitness-knowledge">
        <FitnessEducationSection />
      </div>

      <ProductRecommendationSection />
      <CustomerReviewsSection />
      <FAQSection />

      {/* Instagram section */}
      <SocialGridSection />

      {/* NEW: Next Level Fitness Gym section */}
      <NextLevelGymSection />

      {/* Existing newsletter */}
      <NewsletterSection />
    </div>
  );
};