import React, { useState } from 'react';
import { GalleryItem } from './types';
import { ChevronLeft, ChevronRight, X, Maximize2 } from 'lucide-react';
import aboutGymInterior from "../../assets/images/about_gym_interior_1791208222000.jpg";
import facilityWeightsZone from "../../assets/images/facility_weights_zone_1791208282025.jpg";
import heroAthleteTraining from "../../assets/images/hero_athlete_training_1791208210587.jpg";
import ctaDisciplineLifter from "../../assets/images/cta_discipline_lifter_1791208304162.jpg";
import progCardioZone from "../../assets/images/prog_cardio_zone_1791208243398.jpg";
import progPersonalCoach from "../../assets/images/prog_personal_coach_1791208257005.jpg";
import facilityStretchingZone from "../../assets/images/facility_stretching_zone_1791208347610.jpg";
import progFunctionalTurf from "../../assets/images/prog_functional_turf_1791208271039.jpg";

export const galleryItems: GalleryItem[] = [
  {
    id: 'gal-1',
    title: 'Spacious Main Workout Floor',
    category: 'gym',
    image: aboutGymInterior,
    caption: 'Clean, well-ventilated training premises with ample space between stations.',
  },
  {
    id: 'gal-2',
    title: 'Free Weights & Dumbbells Bay',
    category: 'equipment',
    image: facilityWeightsZone,
    caption: 'Calibrated chrome and urethane dumbbells with heavy lifting benches.',
  },
  {
    id: 'gal-3',
    title: 'Barbell Compound Lifting',
    category: 'training',
    image: heroAthleteTraining,
    caption: 'Olympic deadlift and squat platforms for serious strength development.',
  },
  {
    id: 'gal-4',
    title: 'Supportive Gym Community',
    category: 'community',
    image: ctaDisciplineLifter,
    caption: 'Welcoming members and energetic daily training atmosphere.',
  },
  {
    id: 'gal-5',
    title: 'Cardio Endurance Zone',
    category: 'equipment',
    image: progCardioZone,
    caption: 'Commercial treadmills and ellipticals with individual workout displays.',
  },
  {
    id: 'gal-6',
    title: 'Dedicated Trainer Coaching',
    category: 'training',
    image: progPersonalCoach,
    caption: 'Experienced coaches providing real-time biomechanical guidance.',
  },
  {
    id: 'gal-7',
    title: 'Mobility & Recovery Floor',
    category: 'gym',
    image: facilityStretchingZone,
    caption: 'Quiet dedicated space for pre-workout warmup and post-workout mobility.',
  },
  {
    id: 'gal-8',
    title: 'Functional Conditioning Turf',
    category: 'training',
    image: progFunctionalTurf,
    caption: 'Kettlebells, medicine balls, and athletic agility equipment.',
  },
];

export const GallerySection: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'gym' | 'equipment' | 'training' | 'community'>('all');
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  const categories = [
    { id: 'all', label: 'ALL' },
    { id: 'gym', label: 'GYM' },
    { id: 'equipment', label: 'EQUIPMENT' },
    { id: 'training', label: 'TRAINING' },
    { id: 'community', label: 'COMMUNITY' },
  ] as const;

  const filteredItems = activeCategory === 'all'
    ? galleryItems
    : galleryItems.filter((item) => item.category === activeCategory);

  const handlePrev = () => {
    if (selectedImageIndex === null) return;
    setSelectedImageIndex((selectedImageIndex - 1 + filteredItems.length) % filteredItems.length);
  };

  const handleNext = () => {
    if (selectedImageIndex === null) return;
    setSelectedImageIndex((selectedImageIndex + 1) % filteredItems.length);
  };

  return (
    <section id="gallery" className="py-20 lg:py-28 bg-(--brand-surface) border-b border-(--brand-border) transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 text-left">
          <div className="space-y-3 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="w-6 h-0.5 bg-[#D91B24]" />
              <span className="text-xs uppercase font-heading font-bold tracking-widest text-[#D91B24]">
                PHOTO SHOWCASE
              </span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-neutral-950 dark:text-white font-heading">
              THE NEXT LEVEL EXPERIENCE
            </h2>
            <p className="text-neutral-600 dark:text-neutral-300 text-sm sm:text-base font-normal">
              Take a visual tour inside our gym floor, machines, and authentic workout atmosphere.
            </p>
          </div>

          {/* Interactive Category Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl overflow-x-auto">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setActiveCategory(cat.id);
                  setSelectedImageIndex(null);
                }}
                className={`px-3.5 py-1.5 text-xs font-heading font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                  activeCategory === cat.id
                    ? 'bg-neutral-900 dark:bg-[#D91B24] text-white shadow-xs'
                    : 'text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-50 dark:hover:bg-neutral-700'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredItems.map((item, index) => (
            <div
              key={item.id}
              onClick={() => setSelectedImageIndex(index)}
              className="group relative rounded-2xl overflow-hidden aspect-4/3 bg-neutral-200 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 shadow-xs hover:shadow-xl transition-all duration-300 cursor-pointer text-left card-theme"
            >
              <img
                src={item.image}
                alt={item.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />

              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-between">
                <div className="flex justify-end">
                  <span className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center text-white">
                    <Maximize2 className="w-4 h-4" />
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] uppercase tracking-wider font-heading font-bold text-[#D91B24] bg-white px-2 py-0.5 rounded-sm">
                    {item.category}
                  </span>
                  <h3 className="font-heading text-sm font-bold text-white leading-tight">
                    {item.title}
                  </h3>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Lightbox Modal */}
      {selectedImageIndex !== null && filteredItems[selectedImageIndex] && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in duration-200">
          
          {/* Close button */}
          <button
            onClick={() => setSelectedImageIndex(null)}
            className="absolute top-6 right-6 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer z-50"
            aria-label="Close lightbox"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Prev button */}
          <button
            onClick={handlePrev}
            className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer z-50"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Next button */}
          <button
            onClick={handleNext}
            className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer z-50"
            aria-label="Next image"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Lightbox Content Container */}
          <div className="max-w-4xl max-h-[85vh] w-full flex flex-col items-center">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/20 bg-neutral-900 max-h-[70vh] flex items-center justify-center">
              <img
                src={filteredItems[selectedImageIndex].image}
                alt={filteredItems[selectedImageIndex].title}
                referrerPolicy="no-referrer"
                className="max-h-[70vh] w-auto object-contain animate-in zoom-in-95 duration-200"
              />
            </div>

            <div className="mt-4 text-center text-white space-y-1 max-w-xl">
              <div className="flex items-center justify-center gap-2">
                <span className="text-xs uppercase font-heading font-bold text-[#D91B24]">
                  {filteredItems[selectedImageIndex].category}
                </span>
                <span className="text-neutral-500">·</span>
                <span className="text-xs text-neutral-400">
                  {selectedImageIndex + 1} of {filteredItems.length}
                </span>
              </div>
              <h4 className="text-lg font-bold font-heading">
                {filteredItems[selectedImageIndex].title}
              </h4>
              <p className="text-xs text-neutral-300">
                {filteredItems[selectedImageIndex].caption}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
