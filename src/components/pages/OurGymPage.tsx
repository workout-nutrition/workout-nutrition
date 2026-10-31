import React, { useState, useEffect } from 'react';
import { ThemeMode } from '../our-gym/types';
import { Hero } from '../our-gym/Hero';
import { StatsSection } from '../our-gym/StatsSection';
import { HoursStrip } from '../our-gym/HoursStrip';
import { AboutSection } from '../our-gym/AboutSection';
import { WhyUsSection } from '../our-gym/WhyUsSection';
import { ProgramsSection } from '../our-gym/ProgramsSection';
import { ExperienceSplit } from '../our-gym/ExperienceSplit';
import { FacilitiesSection } from '../our-gym/FacilitiesSection';
import { MembershipSection } from '../our-gym/MembershipSection';
import { MembershipBanner } from '../our-gym/MembershipBanner';
import { ReviewsSection } from '../our-gym/ReviewsSection';
import { InstagramSection } from '../our-gym/InstagramSection';
import { GallerySection } from '../our-gym/GallerySection';
import { MotivationalSection } from '../our-gym/MotivationalSection';
import { LocationSection } from '../our-gym/LocationSection';
import { ContactFormSection } from '../our-gym/ContactFormSection';
import { FaqSection } from '../our-gym/FaqSection';
import { usePageSEO } from '../../utils/seo';

export const OurGymPage: React.FC = () => {
  usePageSEO({
    title: 'Next Level Fitness Gym',
    description:
      'Train at Next Level Fitness Gym. Premium strength equipment, certified personal trainers, dynamic cardio zone, and integrated sports nutrition support in Mohali.',
  });

  const [currentTheme, setCurrentTheme] = useState<ThemeMode>(() => {
    try {
      const saved = localStorage.getItem('nlf_theme');
      if (saved === 'light' || saved === 'dark') {
        return saved;
      }
    } catch {
      // fallback
    }
    return 'light';
  });

  const [selectedGoal, setSelectedGoal] = useState<string>('General Fitness');
  const [selectedPlan, setSelectedPlan] = useState<string>('');

  useEffect(() => {
    try {
      localStorage.setItem('nlf_theme', currentTheme);
    } catch {
      // ignore
    }
  }, [currentTheme]);

  const scrollToContact = (goal?: string, plan?: string) => {
    if (goal) setSelectedGoal(goal);
    if (plan) setSelectedPlan(plan);
    const contactElem = document.getElementById('contact');
    if (contactElem) {
      contactElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div
      data-theme={currentTheme}
      className={`min-h-screen bg-(--brand-bg) text-neutral-900 transition-colors duration-300 relative selection:bg-[#D91B24] selection:text-white ${
        currentTheme === 'dark' ? 'dark text-neutral-100' : ''
      }`}
    >
      <main className="w-full">
        {/* Full-width Background Video Hero with Overlay Content */}
        <Hero
          onJoinClick={() => scrollToContact()}
          onExploreClick={() => scrollToSection('about')}
        />

        {/* Live Running Statistics Grid Overlay in Separate Section */}
        <StatsSection />

        {/* Real-time Opening Hours Strip */}
        <HoursStrip />

        {/* Editorial Introduction */}
        <AboutSection
          onDiscoverClick={() => scrollToSection('facilities')}
        />

        {/* Why Train At Next Level */}
        <WhyUsSection />

        {/* Training Programs Grid with preview modal */}
        <ProgramsSection
          onSelectProgram={(progName) => scrollToContact(progName)}
        />

        {/* Split Screen Fitness Experience & Animated Counters */}
        <ExperienceSplit />

        {/* Built For Better Workouts - Facilities */}
        <FacilitiesSection />

        {/* Membership Options */}
        <MembershipSection
          onEnquirePlan={(planName) =>
            scrollToContact('General Fitness', planName)
          }
        />

        {/* High-Energy Red CTA Banner */}
        <MembershipBanner
          onJoinClick={() => scrollToContact()}
        />

        {/* Google Reviews with automated ticker & category filters */}
        <ReviewsSection />

        {/* Instagram Feed Showcase with autoplaying video reels */}
        <InstagramSection />

        {/* Interactive Gallery with Lightbox modal */}
        <GallerySection />

        {/* Motivational Editorial */}
        <MotivationalSection
          onJoinClick={() => scrollToContact()}
        />

        {/* Location & Timings with interactive Google Map */}
        <LocationSection />

        {/* Contact & Lead Capture Form */}
        <ContactFormSection
          initialGoal={selectedGoal}
          initialPlan={selectedPlan}
        />

        {/* FAQ Section */}
        <FaqSection />
      </main>
    </div>
  );
};

export default OurGymPage;
