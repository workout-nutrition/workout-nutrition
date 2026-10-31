import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from '../common/ProductCard';
import { Sparkles, MessageCircle, ArrowRight, CheckCircle2, RotateCcw, HelpCircle } from 'lucide-react';

export const ProductRecommendationSection: React.FC = () => {
  const { products, addToCart } = useStore();

  const [selectedGoal, setSelectedGoal] = useState<
    'build-muscle' | 'gain-weight' | 'lose-fat' | 'increase-strength' | 'boost-energy' | 'recovery' | 'health-wellness'
  >('build-muscle');
  const [experienceLevel, setExperienceLevel] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Intermediate');
  const [showResults, setShowResults] = useState(false);

  // Recommend relevant products dynamically from the actual product catalog
  const getRecommendedProducts = () => {
    return products.filter((p) => (p.goals as string[]).includes(selectedGoal)).slice(0, 3);
  };

  const handleGetRecommendations = () => {
    setShowResults(true);
  };

  const handleReset = () => {
    setShowResults(false);
  };

  const handleWhatsAppConsultation = () => {
    const text = encodeURIComponent(
      `Hi Workout Nutrition Team! I would like guidance choosing supplements for my goal: ${selectedGoal.replace('-', ' ')} (${experienceLevel}).`
    );
    window.open(`https://wa.me/918264325436?text=${text}`, '_blank');
  };

  const recommendedList = getRecommendedProducts();

  return (
    <section className="py-16 bg-zinc-950 text-white relative overflow-hidden select-none">
      <div className="absolute top-0 right-10 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-red-400 uppercase tracking-widest mb-2 font-mono bg-red-600/20 border border-red-500/30 px-3 py-1 rounded-full">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>SUPPLEMENT ADVISOR</span>
            </div>
            <h2 className="font-display font-normal text-3xl sm:text-4xl lg:text-5xl text-white uppercase tracking-wide">
              NOT SURE WHAT TO TAKE?
            </h2>
            <p className="font-body text-sm sm:text-base text-zinc-300 font-normal mt-1 leading-relaxed">
              Find the right supplement for your goal.
            </p>
          </div>

          {!showResults ? (
            /* Interactive Questionnaire */
            <div className="bg-zinc-900/90 border border-zinc-800 rounded-3xl p-6 sm:p-8 backdrop-blur-md space-y-6">
              {/* Question 1: Goal */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-red-400 block mb-3 font-mono">
                  1. WHAT IS YOUR PRIMARY GOAL?
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {[
                    { id: 'build-muscle', label: 'Build Muscle' },
                    { id: 'gain-weight', label: 'Gain Weight' },
                    { id: 'lose-fat', label: 'Lose Fat' },
                    { id: 'increase-strength', label: 'Improve Strength' },
                    { id: 'boost-energy', label: 'Increase Energy' },
                    { id: 'recovery', label: 'Improve Recovery' },
                    { id: 'health-wellness', label: 'General Wellness' },
                  ].map((g) => (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => setSelectedGoal(g.id as any)}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        selectedGoal === g.id
                          ? 'border-red-600 bg-red-600/20 text-white font-bold shadow-md'
                          : 'border-zinc-800 bg-zinc-950/70 text-zinc-400 hover:border-zinc-700 hover:text-white'
                      }`}
                    >
                      <div className="text-xs sm:text-sm font-semibold">{g.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Question 2: Experience */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-red-400 block mb-3 font-mono">
                  2. TRAINING EXPERIENCE (OPTIONAL):
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  {[
                    { id: 'Beginner', desc: '< 1 Year Lifting' },
                    { id: 'Intermediate', desc: '1–3 Years' },
                    { id: 'Advanced', desc: '3+ Years Heavy Training' },
                  ].map((exp) => (
                    <button
                      key={exp.id}
                      type="button"
                      onClick={() => setExperienceLevel(exp.id as any)}
                      className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                        experienceLevel === exp.id
                          ? 'border-red-600 bg-red-600/20 text-white font-bold shadow-md'
                          : 'border-zinc-800 bg-zinc-950/70 text-zinc-400 hover:border-zinc-700 hover:text-white'
                      }`}
                    >
                      <div className="text-xs sm:text-sm font-semibold">{exp.id}</div>
                      <div className="text-[10px] text-zinc-400 mt-0.5">{exp.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={handleWhatsAppConsultation}
                  className="w-full sm:w-auto text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center justify-center gap-1.5 cursor-pointer py-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Talk with Certified Sports Nutritionist on WhatsApp</span>
                </button>

                <button
                  type="button"
                  onClick={handleGetRecommendations}
                  className="w-full sm:w-auto bg-red-600 hover:bg-red-700 active:scale-95 text-white font-bold text-xs uppercase tracking-wider py-3.5 px-8 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-red-600/30 transition-all cursor-pointer"
                >
                  <span>GET RECOMMENDATIONS</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Disclaimer */}
              <p className="text-[11px] text-zinc-500 italic text-center pt-2">
                * Supplement recommendations are for general informational purposes and are not medical advice.
              </p>
            </div>
          ) : (
            /* Recommendations View */
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="flex items-center justify-between bg-zinc-900 border border-zinc-800 p-4 rounded-2xl">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  <span className="text-xs sm:text-sm font-semibold text-zinc-200">
                    Recommended Products for <strong className="text-white uppercase">{selectedGoal.replace('-', ' ')}</strong> ({experienceLevel})
                  </span>
                </div>
                <button
                  onClick={handleReset}
                  className="text-xs text-zinc-400 hover:text-white flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Options</span>
                </button>
              </div>

              {/* Recommended Product Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {recommendedList.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              <div className="text-center pt-4">
                <button
                  onClick={() => {
                    recommendedList.forEach((p) => addToCart(p, 1));
                  }}
                  className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider py-3.5 px-8 rounded-xl shadow-lg transition-all cursor-pointer"
                >
                  Add All Recommended Products To Cart
                </button>
                <p className="text-[11px] text-zinc-500 italic mt-3">
                  * Supplement recommendations are for general informational purposes and are not medical advice.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
