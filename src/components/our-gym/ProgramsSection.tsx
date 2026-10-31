import React, { useState } from 'react';
import { TrainingProgram } from './types';
import { ArrowRight, CheckCircle2, X } from 'lucide-react';

// Images that are confirmed to exist in the project
import facilityWeightsZone from "../../assets/images/facility_weights_zone_1791208282025.jpg";
import progCardioZone from "../../assets/images/prog_cardio_zone_1791208243398.jpg";
import progPersonalCoach from "../../assets/images/prog_personal_coach_1791208257005.jpg";
import aboutGymInterior from "../../assets/images/about_gym_interior_1791208222000.jpg";
import progFunctionalTurf from "../../assets/images/prog_functional_turf_1791208271039.jpg";
import heroAthleteTraining from "../../assets/images/hero_athlete_training_1791208210587.jpg";

interface ProgramsSectionProps {
  onSelectProgram: (programName: string) => void;
}

export const programsData: TrainingProgram[] = [
  {
    id: 'prog-01',
    number: 'PROGRAM 01',
    title: 'STRENGTH TRAINING',
    tagline: 'Power & Muscle Development',
    description: 'Build strength, improve performance and develop a stronger physique.',
    image: facilityWeightsZone,
    highlights: [
      'Progressive barbell compound lifting',
      'Free weight & plate-loaded machine zones',
      'Hypertrophy and functional strength splits',
      'Technique corrections for safe lifting',
    ],
  },
  {
    id: 'prog-02',
    number: 'PROGRAM 02',
    title: 'CARDIO TRAINING',
    tagline: 'Endurance & Heart Health',
    description: 'Improve stamina, endurance and overall fitness.',
    image: progCardioZone,
    highlights: [
      'Commercial-grade treadmills & ellipticals',
      'Heart rate zone conditioning',
      'High-energy endurance training',
      'Low-impact stamina routines',
    ],
  },
  {
    id: 'prog-03',
    number: 'PROGRAM 03',
    title: 'PERSONAL TRAINING',
    tagline: '1-on-1 Dedicated Guidance',
    description: 'Get focused guidance and structured workout support.',
    image: progPersonalCoach,
    highlights: [
      'Custom workout programming for your goals',
      'Dedicated trainer supervision every set',
      'Posture, form, and injury prevention',
      'Accountability and weekly milestone tracking',
    ],
  },
  {
    id: 'prog-04',
    number: 'PROGRAM 04',
    title: 'WEIGHT MANAGEMENT',
    tagline: 'Sustainable Body Composition',
    description: 'Build healthier routines through consistent training and activity.',
    image: aboutGymInterior,
    highlights: [
      'Metabolic conditioning & caloric burn circuits',
      'Sustainable daily activity habit formation',
      'Body composition progress tracking',
      'Guidance on consistency and lifestyle balance',
    ],
  },
  {
    id: 'prog-05',
    number: 'PROGRAM 05',
    title: 'FUNCTIONAL FITNESS',
    tagline: 'Agility, Mobility & Core',
    description: 'Improve movement, strength, balance and everyday performance.',
    image: progFunctionalTurf,
    highlights: [
      'Kettlebell and medicine ball circuits',
      'Turf drills for athletic agility',
      'Joint stability and core engagement',
      'Multi-planar functional strength',
    ],
  },
  {
    id: 'prog-06',
    number: 'PROGRAM 06',
    title: 'BEGINNER TRAINING',
    tagline: 'Comfortable & Guided Start',
    description: 'Start your fitness journey in a supportive environment.',
    image: heroAthleteTraining,
    highlights: [
      'Step-by-step equipment orientation',
      'Confidence-building foundational routines',
      'Non-intimidating, supportive atmosphere',
      'Paced progression according to your level',
    ],
  },
];

export const ProgramsSection: React.FC<ProgramsSectionProps> = ({
  onSelectProgram,
}) => {
  const [activeModalProgram, setActiveModalProgram] =
    useState<TrainingProgram | null>(null);

  return (
    <section
      id="training"
      className="py-20 lg:py-28 bg-(--brand-surface) border-b border-(--brand-border) transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6 text-left">
          <div className="space-y-3 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="w-6 h-0.5 bg-[#D91B24]" />

              <span className="text-xs uppercase font-heading font-semibold tracking-wider text-[#D91B24]">
                STRUCTURED TRAINING
              </span>
            </div>

            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-neutral-950 dark:text-white font-heading">
              TRAIN FOR YOUR GOAL.
            </h2>

            <p className="text-neutral-600 dark:text-neutral-300 text-sm sm:text-base font-normal">
              Whether you are striving for heavy compound strength, athletic
              stamina, or starting your first week, we have a targeted training
              framework designed for real physical progress.
            </p>
          </div>

          <div className="text-sm font-semibold text-neutral-500 dark:text-neutral-400">
            <span>6 Target Disciplines</span>
            <span className="mx-2">·</span>
            <span className="text-[#D91B24] font-heading font-semibold">
              ALL FITNESS LEVELS
            </span>
          </div>
        </div>

        {/* 6 Visual Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {programsData.map((prog) => (
            <div
              key={prog.id}
              className="group card-theme rounded-2xl overflow-hidden flex flex-col justify-between text-left"
            >

              {/* Image Container */}
              <div className="relative aspect-4/3 overflow-hidden bg-neutral-100 dark:bg-neutral-800">
                <img
                  src={prog.image}
                  alt={prog.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-500"
                />

                {/* Program Number */}
                <div className="absolute top-4 left-4 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md px-3 py-1 rounded-md text-[11px] font-heading font-semibold tracking-wider text-neutral-900 dark:text-white border border-neutral-200 dark:border-neutral-700">
                  {prog.number}
                </div>

                {/* Scrim Overlay */}
                <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity pointer-events-none" />
              </div>

              {/* Body Content */}
              <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between space-y-5">
                <div className="space-y-2">

                  <span className="text-xs uppercase font-heading tracking-wider font-semibold text-[#D91B24] block">
                    {prog.tagline}
                  </span>

                  <h3 className="font-heading text-xl sm:text-2xl font-semibold text-neutral-900 dark:text-white group-hover:text-[#D91B24] transition-colors">
                    {prog.title}
                  </h3>

                  <p className="text-sm text-neutral-600 dark:text-neutral-400 font-normal leading-relaxed">
                    {prog.description}
                  </p>

                </div>

                {/* Action Buttons */}
                <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between">

                  <button
                    onClick={() => setActiveModalProgram(prog)}
                    className="text-xs font-heading font-semibold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 hover:text-[#D91B24] dark:hover:text-[#E11D2A] transition-colors cursor-pointer"
                  >
                    View Details
                  </button>

                  <button
                    onClick={() => onSelectProgram(prog.title)}
                    className="inline-flex items-center gap-1.5 text-xs font-heading font-semibold uppercase tracking-wider text-[#D91B24] hover:text-[#B8141D] group-hover:translate-x-0.5 transition-all cursor-pointer"
                  >
                    <span>Enquire</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Program Details Modal */}
      {activeModalProgram && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">

          <div className="relative w-full max-w-lg bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden text-left animate-in zoom-in-95 duration-200">

            {/* Header Image */}
            <div className="relative h-48 bg-neutral-100 dark:bg-neutral-800">

              <img
                src={activeModalProgram.image}
                alt={activeModalProgram.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />

              <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-transparent" />

              <button
                onClick={() => setActiveModalProgram(null)}
                className="absolute top-3.5 right-3.5 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="absolute bottom-4 left-5 right-5 text-white">

                <span className="text-[11px] font-heading font-semibold uppercase tracking-widest text-[#D91B24] bg-white px-2 py-0.5 rounded-sm">
                  {activeModalProgram.number}
                </span>

                <h4 className="text-xl sm:text-2xl font-semibold font-heading text-white mt-1">
                  {activeModalProgram.title}
                </h4>

              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5">

              <p className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed font-normal">
                {activeModalProgram.description}
              </p>

              <div>

                <h5 className="text-xs font-semibold uppercase tracking-wider font-heading text-neutral-900 dark:text-white mb-3">
                  What This Program Includes:
                </h5>

                <ul className="space-y-2">

                  {activeModalProgram.highlights.map((item, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2.5 text-xs text-neutral-700 dark:text-neutral-300 font-normal"
                    >
                      <CheckCircle2 className="w-4 h-4 text-[#D91B24] shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}

                </ul>
              </div>

              <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center gap-3">

                <button
                  onClick={() => {
                    const name = activeModalProgram.title;
                    setActiveModalProgram(null);
                    onSelectProgram(name);
                  }}
                  className="flex-1 font-heading text-xs font-semibold uppercase tracking-wider text-white bg-[#D91B24] hover:bg-[#B8141D] py-3 rounded-lg shadow-sm text-center cursor-pointer"
                >
                  Enquire About This Program
                </button>

                <button
                  onClick={() => setActiveModalProgram(null)}
                  className="px-4 py-3 text-xs font-semibold text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white border border-neutral-200 dark:border-neutral-700 rounded-lg cursor-pointer"
                >
                  Close
                </button>

              </div>
            </div>
          </div>
        </div>
      )}

    </section>
  );
};