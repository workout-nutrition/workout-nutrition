import React, { useState, useEffect } from 'react';
import heroAthleteTraining from '../../assets/images/hero_athlete_training_1791208210587.jpg';
import { Phone, ArrowRight, ShieldCheck, Flame, Dumbbell } from 'lucide-react';

interface HeroProps {
  onJoinClick: () => void;
  onExploreClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onJoinClick }) => {
  return (
    <section
      id="home"
      className="relative min-h-[90vh] lg:min-h-[95vh] flex items-center justify-center overflow-hidden bg-black text-white"
    >
      {/* Background Video with Gym Workout / Exercise */}
      <video
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        poster={heroAthleteTraining}
        className="absolute inset-0 w-full h-full object-cover object-center scale-105"
      >
        <source
          src={`${import.meta.env.BASE_URL}videos/reel-1.mp4`}
          type="video/mp4"
        />
      </video>

      {/* Cinematic Dark Fade Overlays for crystal-clear readability */}
      <div className="absolute inset-0 bg-black/65 backdrop-blur-[0.5px]" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/70" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/40" />

      {/* Subtle Laser Accent Lines */}
      <div className="absolute top-[18%] left-0 w-full h-[1.5px] overflow-hidden pointer-events-none z-10 opacity-70">
        <div className="w-1/3 h-full bg-gradient-to-r from-transparent via-[#D91B24] to-transparent animate-laser-left-right shadow-[0_0_12px_#D91B24]" />
      </div>

      {/* Hero Foreground Content */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24 lg:py-28">
        <div className="max-w-3xl text-left space-y-6 sm:space-y-7">
          
          {/* Top Trust Badge */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs text-white shadow-sm">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D91B24] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#D91B24]" />
            </span>
            <span className="font-heading uppercase tracking-widest text-xs font-semibold text-white">
              PREMIUM ATHLETIC CLUB
            </span>
            <span className="text-white/40">|</span>
            <div className="flex items-center gap-1.5 text-red-400 font-medium text-[11px] uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5 text-[#D91B24]" />
              <span>CERTIFIED COACHING &middot; SECTOR 119</span>
            </div>
          </div>

          {/* Main Headline */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-8 h-1 bg-[#D91B24] rounded-full inline-block" />
              <span className="text-xs uppercase font-heading font-semibold tracking-widest text-[#D91B24]">
                NEXT LEVEL FITNESS
              </span>
            </div>

            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white font-heading leading-[1.05]">
              TRAIN HARD. <br />
              <span className="text-[#D91B24]">LIVE STRONG.</span>
            </h1>
          </div>

          {/* Subtitle / Copy - Clean font weight and spacing */}
          <p className="text-base sm:text-lg md:text-xl text-zinc-200 font-normal max-w-2xl leading-relaxed">
            Step into an elite training ground engineered for progressive strength,
            explosive conditioning, and continuous physical transformation. Powered by
            competition-grade barbells, calibrated resistance machines, and expert guidance.
          </p>

          {/* Feature Pills */}
          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-zinc-200 font-medium">
            <span className="px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15">
              Heavy Free Weights
            </span>
            <span className="px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15">
              Cardio Fleet
            </span>
            <span className="px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15">
              Hypertrophy Bays
            </span>
            <span className="px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15">
              1-on-1 Coaching
            </span>
          </div>

          {/* CTA Buttons */}
          <div className="pt-2 flex flex-wrap items-center gap-3 sm:gap-4">
            <button
              onClick={onJoinClick}
              className="group inline-flex items-center justify-center font-heading text-xs sm:text-sm uppercase tracking-wider font-semibold text-white bg-[#D91B24] hover:bg-[#B8141D] active:scale-98 px-7 py-3.5 rounded-xl shadow-lg hover:shadow-red-600/30 transition-all cursor-pointer"
            >
              <span>JOIN NOW</span>
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </button>

            <a
              href="tel:+918264325436"
              className="inline-flex items-center justify-center font-heading text-xs sm:text-sm uppercase tracking-wider font-semibold text-white bg-white/10 hover:bg-white/20 active:scale-98 border border-white/20 px-6 py-3.5 rounded-xl backdrop-blur-md transition-all"
            >
              <Phone className="w-4 h-4 mr-2 text-[#D91B24]" />
              <span>CALL: +91-8264325436</span>
            </a>
          </div>

        </div>

      </div>
    </section>
  );
};
