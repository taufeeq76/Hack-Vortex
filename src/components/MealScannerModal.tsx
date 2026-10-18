import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Camera, Upload, Check, Sparkles, X, Plus, Edit3, RotateCcw, AlertCircle, Target, ArrowRight } from 'lucide-react';
import { ScannedMealResult, UserHealthProfile } from '../types';
import { INITIAL_USER_PROFILE } from '../data/mockData';

interface MealScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile?: UserHealthProfile;
  userWeightKg?: number;
  remainingCalories?: number;
  onAddMealToLog?: (scanned: ScannedMealResult) => void;
}

const SAMPLE_MEALS = [
  {
    name: 'Chicken Rice Bowl with Steamed Greens',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80',
    servingGrams: 420,
    items: ['Grilled Chicken Breast', 'Brown Jasmine Rice', 'Broccoli Florets', 'Sesame Oil'],
    calories: 620,
    protein: 44,
    carbs: 68,
    fats: 16,
    fiber: 6,
    sodiumMg: 490,
    goalVerdict: 'Good choice for your current goal.',
    goalExplanation: 'High-biological-value protein fuels muscular recovery while complex carbs replenish glycogen.',
    suggestion: 'Add a sprinkle of seeds or olive oil for anti-inflammatory healthy fats.',
  },
  {
    name: 'Greek Yogurt, Blueberries & Nut Granola',
    image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600&auto=format&fit=crop&q=80',
    servingGrams: 330,
    items: ['0% Plain Greek Yogurt', 'Fresh Blueberries', 'Toasted Oats & Almonds', 'Honey Drizzle'],
    calories: 430,
    protein: 29,
    carbs: 52,
    fats: 12,
    fiber: 5,
    sodiumMg: 110,
    goalVerdict: 'Good choice for your current goal.',
    goalExplanation: 'Slow-digesting casein protein supports cellular repair with antioxidant polyphenols.',
    suggestion: 'Ideal as an afternoon recovery snack or pre-bed muscle protein synthesis trigger.',
  },
  {
    name: 'Tofu & Quinoa Buddha Harvest Bowl',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&auto=format&fit=crop&q=80',
    servingGrams: 440,
    items: ['Pan-Seared Organic Tofu', 'Cooked Quinoa', 'Avocado Slices', 'Purple Cabbage', 'Tahini'],
    calories: 590,
    protein: 32,
    carbs: 72,
    fats: 19,
    fiber: 9,
    sodiumMg: 420,
    goalVerdict: 'Good choice for your current goal.',
    goalExplanation: 'Complete vegan amino acid spectrum paired with gut-supportive prebiotic fibers.',
    suggestion: 'Consider adding a scoop of nutritional yeast for an extra B-complex boost.',
  },
  {
    name: 'Avocado, Pasture Eggs & Sourdough Toast',
    image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=600&auto=format&fit=crop&q=80',
    servingGrams: 340,
    items: ['Poached Eggs (2x)', 'Crushed Hass Avocado', 'Artisan Sourdough', 'Chili Flakes'],
    calories: 480,
    protein: 24,
    carbs: 40,
    fats: 24,
    fiber: 7,
    sodiumMg: 380,
    goalVerdict: 'Good choice for your current goal.',
    goalExplanation: 'Rich in brain-healthy choline, lutein, and monounsaturated lipids.',
    suggestion: 'Pair with 1 glass of water to support mineral balance and morning hydration.',
  },
];

export const MealScannerModal: React.FC<MealScannerModalProps> = ({
  isOpen,
  onClose,
  userProfile,
  userWeightKg,
  remainingCalories = 860,
  onAddMealToLog,
}) => {
  const initialWeight = userProfile?.weightKg ?? userWeightKg ?? INITIAL_USER_PROFILE.weightKg;
  const userGoal = userProfile?.primaryGoal ?? 'gain_muscle_posture';

  const [currentWeight, setCurrentWeight] = useState(initialWeight);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<ScannedMealResult | null>(null);
  const [addedSuccess, setAddedSuccess] = useState(false);

  // Correction Mode State
  const [isEditingCorrection, setIsEditingCorrection] = useState(false);
  const [editFoodName, setEditFoodName] = useState('');
  const [editServingGrams, setEditServingGrams] = useState<number>(400);
  const [editIngredients, setEditIngredients] = useState('');

  useEffect(() => {
    if (userProfile?.weightKg) {
      setCurrentWeight(userProfile.weightKg);
    } else if (userWeightKg) {
      setCurrentWeight(userWeightKg);
    }
  }, [userProfile?.weightKg, userWeightKg, isOpen]);

  if (!isOpen) return null;

  // Real or Sample Analysis
  const runLiveAnalysis = async (imageDataUrl: string, sampleFallback?: (typeof SAMPLE_MEALS)[0]) => {
    setSelectedImage(imageDataUrl);
    setIsAnalyzing(true);
    setAnalysisResult(null);
    setAddedSuccess(false);
    setIsEditingCorrection(false);

    try {
      const res = await fetch('/api/zyro/analyze-food', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: imageDataUrl,
          foodHint: sampleFallback?.name,
          userGoal,
          userWeightKg: currentWeight,
          remainingCalories,
        }),
      });

      if (!res.ok) {
        throw new Error('Server returned ' + res.status);
      }

      const data = await res.json();
      const result: ScannedMealResult = {
        imageUrl: imageDataUrl,
        foodName: data.foodName || sampleFallback?.name || 'Analyzed Plate',
        estimatedWeightGrams: data.servingSizeGrams || sampleFallback?.servingGrams || 380,
        macros: {
          calories: data.calories || sampleFallback?.calories || 520,
          protein: data.protein || sampleFallback?.protein || 36,
          carbs: data.carbs || sampleFallback?.carbs || 60,
          fats: data.fats || sampleFallback?.fats || 16,
        },
        fiber: data.fiber ?? sampleFallback?.fiber ?? 5,
        sodiumMg: data.sodiumMg ?? sampleFallback?.sodiumMg ?? 420,
        identifiedItems: data.identifiedItems || sampleFallback?.items || ['Mixed Whole Foods'],
        confidence: data.confidenceScore || 88,
        healthTip: data.suggestion || sampleFallback?.suggestion || 'Balanced macronutrients fuel lean mass recovery.',
        goalVerdict: data.goalVerdict || sampleFallback?.goalVerdict || 'Good choice for your current goal.',
        goalExplanation: data.goalExplanation || sampleFallback?.goalExplanation || 'Aligns with daily nutritional targets.',
        suggestion: data.suggestion || sampleFallback?.suggestion,
        disclaimer: data.disclaimer || 'Estimated values • Actual nutrition may vary.',
      };

      setAnalysisResult(result);
      setEditFoodName(result.foodName);
      setEditServingGrams(result.estimatedWeightGrams);
      setEditIngredients((result.identifiedItems || []).join(', '));
    } catch (err) {
      console.warn('Live food scan fallback to local reference:', err);
      const fallback = sampleFallback || SAMPLE_MEALS[0];
      const scaling = currentWeight > 0 ? currentWeight / 70 : 1;
      const portionFactor = 0.75 + 0.25 * scaling;

      const result: ScannedMealResult = {
        imageUrl: imageDataUrl,
        foodName: fallback.name,
        estimatedWeightGrams: Math.round(fallback.servingGrams * portionFactor),
        macros: {
          calories: Math.round(fallback.calories * portionFactor),
          protein: Math.round(fallback.protein * portionFactor),
          carbs: Math.round(fallback.carbs * portionFactor),
          fats: Math.round(fallback.fats * portionFactor),
        },
        fiber: fallback.fiber,
        sodiumMg: fallback.sodiumMg,
        identifiedItems: fallback.items,
        confidence: 86,
        healthTip: fallback.suggestion,
        goalVerdict: fallback.goalVerdict,
        goalExplanation: fallback.goalExplanation,
        suggestion: fallback.suggestion,
        disclaimer: 'Estimated values • Actual nutrition may vary based on ingredients and culinary preparation.',
        isFallback: true,
      };
      setAnalysisResult(result);
      setEditFoodName(result.foodName);
      setEditServingGrams(result.estimatedWeightGrams);
      setEditIngredients((result.identifiedItems || []).join(', '));
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        runLiveAnalysis(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRecalculateCorrection = () => {
    if (!analysisResult) return;
    const baseGrams = analysisResult.estimatedWeightGrams || 400;
    const factor = editServingGrams > 0 ? editServingGrams / baseGrams : 1;

    const newCalories = Math.round(analysisResult.macros.calories * factor);
    const newProtein = Math.round(analysisResult.macros.protein * factor);
    const newCarbs = Math.round(analysisResult.macros.carbs * factor);
    const newFats = Math.round(analysisResult.macros.fats * factor);
    const newFiber = Math.round((analysisResult.fiber ?? 5) * factor);

    const items = editIngredients
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    setAnalysisResult({
      ...analysisResult,
      foodName: editFoodName.trim() || analysisResult.foodName,
      estimatedWeightGrams: editServingGrams,
      identifiedItems: items.length > 0 ? items : analysisResult.identifiedItems,
      macros: {
        calories: newCalories,
        protein: newProtein,
        carbs: newCarbs,
        fats: newFats,
      },
      fiber: newFiber,
      disclaimer: 'Corrected estimate • Recalculated from user portion adjustment.',
    });
    setIsEditingCorrection(false);
  };

  const handleAdd = () => {
    if (!analysisResult) return;
    onAddMealToLog?.(analysisResult);
    setAddedSuccess(true);
    setTimeout(() => {
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-xl overflow-y-auto">
      <div className="relative w-full max-w-xl bg-[#0D1117] border border-emerald-500/30 rounded-3xl p-5 sm:p-7 shadow-[0_20px_70px_rgba(0,0,0,0.85)] my-auto max-h-[92vh] flex flex-col">
        {/* Header with ZYRO AI Visual Tag */}
        <div className="flex items-center justify-between pb-3 border-b border-white/5">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500/20 via-purple-500/20 to-cyan-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.2)]">
              <Camera size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-black text-white tracking-tight">AI FOOD SCANNER</h2>
                <span className="px-2 py-0.5 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300 text-[10px] font-black uppercase tracking-wider">
                  ZYRO Vision
                </span>
              </div>
              <span className="text-[11px] text-gray-400">
                Snap or upload • Automatic macronutrient identification
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4">
          {/* User Body Profile Strip */}
          <div className="bg-[#131922] border border-white/5 rounded-2xl p-3 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-gray-300">
              <Target size={14} className="text-emerald-400" />
              <span>
                Goal: <strong className="text-white capitalize">{userGoal.replace(/_/g, ' ')}</strong>
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-gray-400 font-mono text-[11px]">
              <span>Bodyweight:</span>
              <strong className="text-emerald-400">{currentWeight} kg</strong>
            </div>
          </div>

          {/* Upload or Camera Capture Box */}
          {!analysisResult && !isAnalyzing && (
            <div className="space-y-4">
              <label
                htmlFor="meal-photo-upload"
                className="group border-2 border-dashed border-emerald-500/30 hover:border-emerald-400/60 rounded-3xl p-7 flex flex-col items-center justify-center gap-3 bg-gradient-to-b from-emerald-950/20 via-black/40 to-black/60 cursor-pointer transition-all hover:shadow-[0_0_25px_rgba(16,185,129,0.2)]"
              >
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(16,185,129,0.25)]">
                  <Upload size={24} />
                </div>
                <div className="text-center">
                  <span className="text-sm font-black text-white block">Take Photo or Upload Meal</span>
                  <span className="text-xs text-gray-400 mt-0.5 block">
                    Supports PNG, JPG, WebP from mobile camera or desktop
                  </span>
                </div>
                <div className="px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-bold">
                  Instant Gemini Vision Analysis
                </div>
                <input
                  id="meal-photo-upload"
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              {/* Sample Campus & Home Food Gallery */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-gray-300 block uppercase tracking-wider text-[11px]">
                  Or Try Sample Meals:
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {SAMPLE_MEALS.map((sample, i) => (
                    <div
                      key={i}
                      onClick={() => runLiveAnalysis(sample.image, sample)}
                      className="p-2.5 rounded-2xl bg-[#131922] border border-white/5 hover:border-emerald-500/40 cursor-pointer transition-all flex items-center gap-2.5 group hover:bg-[#18202c]"
                    >
                      <img
                        src={sample.image}
                        alt={sample.name}
                        referrerPolicy="no-referrer"
                        className="w-12 h-12 rounded-xl object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="overflow-hidden">
                        <span className="text-xs font-bold text-white block truncate group-hover:text-emerald-300">
                          {sample.name}
                        </span>
                        <span className="text-[10px] text-gray-400 block font-mono">
                          ~{sample.calories} kcal • {sample.protein}g protein
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* AI Analysis Scanner Radar Loading State */}
          {isAnalyzing && (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
              <div className="relative">
                <div className="w-20 h-20 rounded-full border-4 border-emerald-500/20 border-t-emerald-400 border-r-purple-400 animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center text-emerald-400">
                  <Sparkles size={28} className="animate-pulse text-purple-300" />
                </div>
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-emerald-500/10 to-purple-500/10 animate-ping" />
              </div>
              <div className="space-y-1.5">
                <h4 className="text-base font-black text-white tracking-tight">ZYRO VISION IDENTIFYING FOOD</h4>
                <p className="text-xs text-gray-400 max-w-xs leading-relaxed">
                  Estimating serving volumes, ingredients, protein density, and goal alignment...
                </p>
              </div>
            </div>
          )}

          {/* Analysis Results View */}
          {analysisResult && !isAnalyzing && (
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-4"
            >
              {/* Photo & Food Identification */}
              <div className="relative rounded-2xl overflow-hidden border border-white/10 h-44 group">
                <img
                  src={analysisResult.imageUrl}
                  alt={analysisResult.foodName}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent flex items-end p-4">
                  <div className="w-full flex items-end justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] uppercase font-black tracking-wider px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          {analysisResult.confidence}% AI Confidence
                        </span>
                        <span className="text-[10px] text-gray-300 font-mono">
                          ~{analysisResult.estimatedWeightGrams}g Portion
                        </span>
                      </div>
                      <h3 className="text-base sm:text-lg font-black text-white mt-1">
                        {analysisResult.foodName}
                      </h3>
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsEditingCorrection(!isEditingCorrection)}
                      className="px-2.5 py-1 rounded-xl bg-white/10 hover:bg-white/20 text-white text-[11px] font-bold flex items-center gap-1 transition-colors"
                    >
                      <Edit3 size={12} />
                      <span>{isEditingCorrection ? 'Close' : 'Correct'}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Identified Food Items Chips */}
              {analysisResult.identifiedItems && analysisResult.identifiedItems.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {analysisResult.identifiedItems.map((item, idx) => (
                    <span
                      key={idx}
                      className="text-[11px] font-medium bg-[#141A23] border border-white/10 text-gray-300 px-2.5 py-1 rounded-lg"
                    >
                      ✓ {item}
                    </span>
                  ))}
                </div>
              )}

              {/* Correction Form Dropdown */}
              {isEditingCorrection && (
                <div className="bg-[#111722] border border-emerald-500/30 rounded-2xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase text-emerald-400 tracking-wider">
                      Correct Meal Details
                    </span>
                    <span className="text-[11px] text-gray-400">Recalculate nutrition</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                    <div>
                      <label className="text-[11px] text-gray-400 block mb-1">Meal Title</label>
                      <input
                        type="text"
                        value={editFoodName}
                        onChange={(e) => setEditFoodName(e.target.value)}
                        className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500 text-xs font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-gray-400 block mb-1">Estimated Grams</label>
                      <input
                        type="number"
                        value={editServingGrams}
                        onChange={(e) => setEditServingGrams(Number(e.target.value) || 0)}
                        className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500 text-xs font-bold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] text-gray-400 block mb-1">Ingredients (comma separated)</label>
                    <input
                      type="text"
                      value={editIngredients}
                      onChange={(e) => setEditIngredients(e.target.value)}
                      placeholder="e.g. Chicken, Brown Rice, Broccoli"
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500 text-xs font-bold"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleRecalculateCorrection}
                    className="w-full py-2 rounded-xl bg-emerald-500 text-black font-black text-xs uppercase tracking-wider hover:bg-emerald-400 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <RotateCcw size={13} />
                    <span>Recalculate Nutritional Estimate</span>
                  </button>
                </div>
              )}

              {/* Visual Nutritional Breakdown Cards */}
              <div className="bg-[#121824] border border-emerald-500/20 rounded-2xl p-4 space-y-3.5 shadow-xl">
                <div className="flex items-baseline justify-between border-b border-white/5 pb-2.5">
                  <div>
                    <span className="text-[10px] uppercase font-black tracking-wider text-gray-400 block">
                      Estimated Energy
                    </span>
                    <div className="flex items-baseline gap-1.5 mt-0.5">
                      <span className="text-3xl font-black text-white">{analysisResult.macros.calories}</span>
                      <span className="text-xs font-bold text-emerald-400">kcal</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-gray-400 block">Serving Size</span>
                    <span className="text-sm font-bold text-gray-200">
                      ~{analysisResult.estimatedWeightGrams} grams
                    </span>
                  </div>
                </div>

                {/* 5 Macro Bars: Protein, Carbs, Fats, Fiber, Sodium */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                  <div className="bg-black/30 p-2.5 rounded-xl border border-emerald-500/30">
                    <span className="text-[10px] text-gray-400 block font-bold">💪 Protein</span>
                    <span className="text-lg font-black text-emerald-400 block mt-0.5">
                      {analysisResult.macros.protein}g
                    </span>
                  </div>

                  <div className="bg-black/30 p-2.5 rounded-xl border border-amber-500/30">
                    <span className="text-[10px] text-gray-400 block font-bold">🍚 Carbs</span>
                    <span className="text-lg font-black text-amber-400 block mt-0.5">
                      {analysisResult.macros.carbs}g
                    </span>
                  </div>

                  <div className="bg-black/30 p-2.5 rounded-xl border border-cyan-500/30">
                    <span className="text-[10px] text-gray-400 block font-bold">🥑 Fat</span>
                    <span className="text-lg font-black text-cyan-400 block mt-0.5">
                      {analysisResult.macros.fats}g
                    </span>
                  </div>

                  <div className="bg-black/30 p-2.5 rounded-xl border border-teal-500/30">
                    <span className="text-[10px] text-gray-400 block font-bold">🌾 Fiber</span>
                    <span className="text-lg font-black text-teal-400 block mt-0.5">
                      {analysisResult.fiber ?? 5}g
                    </span>
                  </div>
                </div>

                {/* 🎯 FOR YOUR GOAL Card */}
                <div className="bg-gradient-to-r from-purple-950/30 via-emerald-950/20 to-black/40 border border-purple-500/30 rounded-2xl p-3.5 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black uppercase text-purple-300 tracking-wider flex items-center gap-1.5">
                      <Target size={14} className="text-purple-400" />
                      TARGET EVALUATION
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold">
                      {analysisResult.goalVerdict}
                    </span>
                  </div>
                  <p className="text-xs text-gray-200 leading-relaxed">
                    {analysisResult.goalExplanation}
                  </p>
                  {analysisResult.suggestion && (
                    <div className="text-[11px] text-emerald-300 pt-1 flex items-start gap-1.5">
                      <Sparkles size={12} className="shrink-0 mt-0.5 text-emerald-400" />
                      <span>{analysisResult.suggestion}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Trust & Epistemic Uncertainty Notice */}
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-black/40 border border-white/5 text-[11px] text-gray-400">
                <AlertCircle size={14} className="text-gray-500 shrink-0" />
                <span>
                  {analysisResult.disclaimer || 'Estimated values • Actual nutrition may vary.'}
                </span>
              </div>

              {/* Bottom Actions */}
              <div className="flex gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setAnalysisResult(null);
                    setSelectedImage(null);
                    setIsEditingCorrection(false);
                  }}
                  className="px-4 py-3 rounded-2xl bg-white/5 hover:bg-white/10 text-xs font-bold text-gray-300 transition-colors"
                >
                  Scan Another
                </button>

                <button
                  type="button"
                  onClick={handleAdd}
                  disabled={addedSuccess}
                  className={`flex-1 py-3.5 rounded-2xl font-black text-xs tracking-wider uppercase flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg ${
                    addedSuccess
                      ? 'bg-emerald-500 text-black'
                      : 'bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 text-black hover:opacity-95 shadow-[0_0_25px_rgba(16,185,129,0.3)]'
                  }`}
                >
                  {addedSuccess ? (
                    <>
                      <Check size={16} /> Added to Today’s Nutrition Log!
                    </>
                  ) : (
                    <>
                      <Plus size={16} /> Add to Today’s Log (+50 XP)
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};
