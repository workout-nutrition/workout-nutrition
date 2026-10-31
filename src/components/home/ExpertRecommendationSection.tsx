import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from '../common/ProductCard';
import { Sparkles, MessageCircle, ArrowRight, CheckCircle2, RotateCcw } from 'lucide-react';

export const ExpertRecommendationSection: React.FC = () => {
  const { products, navigate, addToCart } = useStore();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedGoal, setSelectedGoal] = useState<'build-muscle' | 'lose-fat' | 'increase-strength' | 'general-wellness'>('build-muscle');
  const [experienceLevel, setExperienceLevel] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Intermediate');
  const [showResults, setShowResults] = useState(false);

  // Recommendations calculated based on user inputs
  const getRecommendedProducts = () => {
    return products.filter((p) => p.goals.includes(selectedGoal)).slice(0, 3);
  };

  const handleGetRecommendations = () => {
    setShowResults(true);
  };

  const handleReset = () => {
    setShowResults(false);
    setStep(1);
  };

  const handleWhatsAppConsultation = () => {
    const text = encodeURIComponent(
      `Hello IronForge! I need personalized supplement stack advice. My Goal: ${selectedGoal}, Experience: ${experienceLevel}. Please connect me with a certified sports nutritionist.`
    );
    window.open(`https://wa.me/918264325436?text=${text}`, '_blank');
  };

  const recommendedList = getRecommendedProducts();

  return (
    <section className="py-16 bg-white border-b border-zinc-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-gradient-to-br from-zinc-950 via-zinc-900 to-black rounded-3xl p-6 sm:p-10 lg:p-12 text-white shadow-2xl relative overflow-hidden">
          {/* Decorative ambient elements */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-red-600/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-4xl mx-auto">
            {/* Heading */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-red-400 uppercase tracking-widest mb-2 font-mono bg-red-600/20 border border-red-500/30 px-3 py-1 rounded-full">
                <Sparkles className="w-3.5 h-3.5" />
                <span>INTELLIGENT STACK ADVISOR</span>
              </div>
              <h2 className="font-heading font-black text-3xl sm:text-4xl text-white uppercase tracking-tight">
                NOT SURE WHAT TO CHOOSE?
              </h2>
              <p className="text-sm sm:text-base text-zinc-300 mt-2">
                Tell us your target athletic objective and training experience — we’ll prescribe the exact clinical stack.
              </p>
            </div>

            {!showResults ? (
              /* Mini Interactive Questionnaire */
              <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6 sm:p-8 backdrop-blur-md">
                {/* Step 1: Goal */}
                <div className="mb-8">
                  <div className="flex items-center gap-2 text-xs font-bold text-red-400 uppercase tracking-wider mb-3 font-mono">
                    <span className="w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center text-[10px]">1</span>
                    <span>WHAT IS YOUR PRIMARY GOAL?</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      { id: 'build-muscle', label: 'Build Muscle', desc: 'Hypertrophy & Mass' },
                      { id: 'lose-fat', label: 'Lose Fat', desc: 'Metabolic Shred' },
                      { id: 'increase-strength', label: 'Increase Strength', desc: 'Heavy Power & ATP' },
                      { id: 'general-wellness', label: 'General Health', desc: 'Immunity & Joints' },
                    ].map((g) => (
                      <button
                        key={g.id}
                        type="button"
                        onClick={() => setSelectedGoal(g.id as any)}
                        className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                          selectedGoal === g.id
                            ? 'border-red-600 bg-red-600/15 text-white shadow-md'
                            : 'border-zinc-800 bg-zinc-950/60 text-zinc-400 hover:border-zinc-700 hover:text-white'
                        }`}
                      >
                        <div className="font-heading font-bold text-sm text-white">{g.label}</div>
                        <div className="text-[11px] text-zinc-400 mt-0.5">{g.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Step 2: Experience */}
                <div className="mb-8">
                  <div className="flex items-center gap-2 text-xs font-bold text-red-400 uppercase tracking-wider mb-3 font-mono">
                    <span className="w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center text-[10px]">2</span>
                    <span>WHAT IS YOUR TRAINING EXPERIENCE?</span>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: 'Beginner', desc: '< 1 Year Lifting' },
                      { id: 'Intermediate', desc: '1–3 Years Consistent' },
                      { id: 'Advanced', desc: '3+ Years Serious Training' },
                    ].map((exp) => (
                      <button
                        key={exp.id}
                        type="button"
                        onClick={() => setExperienceLevel(exp.id as any)}
                        className={`p-3.5 rounded-xl border text-center transition-all cursor-pointer ${
                          experienceLevel === exp.id
                            ? 'border-red-600 bg-red-600/15 text-white shadow-md'
                            : 'border-zinc-800 bg-zinc-950/60 text-zinc-400 hover:border-zinc-700 hover:text-white'
                        }`}
                      >
                        <div className="font-heading font-bold text-sm text-white">{exp.id}</div>
                        <div className="text-[11px] text-zinc-400 mt-0.5">{exp.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Step 3: Get Recommendations & WhatsApp Consultation */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-zinc-800">
                  <button
                    onClick={handleWhatsAppConsultation}
                    className="w-full sm:w-auto text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center justify-center gap-2 cursor-pointer py-2.5"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Or chat 1-on-1 with Certified Nutritionist</span>
                  </button>

                  <button
                    onClick={handleGetRecommendations}
                    className="w-full sm:w-auto bg-red-600 hover:bg-red-700 active:scale-95 text-white font-bold text-xs uppercase tracking-wider py-3.5 px-8 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-red-600/30 transition-all cursor-pointer"
                  >
                    <span>GET MY CURATED STACK</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              /* Recommendation Results View */
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="flex items-center justify-between bg-zinc-900 border border-zinc-800 p-4 rounded-xl">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    <span className="text-xs sm:text-sm font-semibold text-zinc-200">
                      Recommended Stack for <strong className="text-white uppercase">{selectedGoal.replace('-', ' ')}</strong> ({experienceLevel})
                    </span>
                  </div>
                  <button
                    onClick={handleReset}
                    className="text-xs text-zinc-400 hover:text-white flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Change Choices</span>
                  </button>
                </div>

                {/* Recommended Products Grid */}
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
                    className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider py-3 px-8 rounded-xl shadow-lg transition-all cursor-pointer"
                  >
                    Add Entire 3-Product Stack To Cart
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
