import React from 'react';
import { Camera, Sparkles, Plus, ArrowRight, Target, Flame, Dumbbell } from 'lucide-react';

interface NutritionIntelligenceCardProps {
  targetCalories: number;
  consumedCalories: number;
  targetProtein: number;
  consumedProtein: number;
  consumedCarbs: number;
  consumedFats: number;
  onOpenMealScanner: () => void;
  onNavigateToDiet: () => void;
}

export const NutritionIntelligenceCard: React.FC<NutritionIntelligenceCardProps> = ({
  targetCalories,
  consumedCalories,
  targetProtein,
  consumedProtein,
  consumedCarbs,
  consumedFats,
  onOpenMealScanner,
  onNavigateToDiet,
}) => {
  const remainingCalories = Math.max(0, targetCalories - consumedCalories);
  const remainingProtein = Math.max(0, targetProtein - consumedProtein);

  const calPercentage = Math.min(100, Math.round((consumedCalories / targetCalories) * 100));
  const proteinPercentage = Math.min(100, Math.round((consumedProtein / targetProtein) * 100));

  return (
    <div className="bg-[#121620] border border-white/10 rounded-3xl p-5 sm:p-7 shadow-2xl space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-3.5">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              NUTRITION INTELLIGENCE
            </h2>
            <span className="text-[10px] uppercase font-black px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              Live Ecosystem
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-0.5">
            Calibrated to your metabolic rate and body recomposition goals.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenMealScanner}
            className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer shadow-[0_0_15px_rgba(16,185,129,0.3)]"
          >
            <Camera size={14} />
            <span>Scan Food AI</span>
          </button>
          <button
            type="button"
            onClick={onNavigateToDiet}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
            title="Full Diet Dashboard"
          >
            <ArrowRight size={16} />
          </button>
        </div>
      </div>

      {/* Main Calories & Protein Dual Primary Displays */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Calories Card */}
        <div className="bg-[#151B26] p-4.5 rounded-2xl border border-white/5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
              <Flame size={14} className="text-amber-400" />
              Daily Calorie Budget
            </span>
            <span className="text-xs font-mono font-bold text-emerald-400">
              {remainingCalories} kcal left
            </span>
          </div>

          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-2xl sm:text-3xl font-black text-white">
                {consumedCalories.toLocaleString()}
              </span>
              <span className="text-xs text-gray-400 font-bold ml-1">/ {targetCalories.toLocaleString()} kcal</span>
            </div>
            <span className="text-xs font-black text-gray-300 font-mono">
              {calPercentage}% Hit
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-black/60 h-2 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-emerald-500 to-amber-400 h-full rounded-full transition-all duration-700"
              style={{ width: `${calPercentage}%` }}
            />
          </div>
        </div>

        {/* Protein Card */}
        <div className="bg-[#151B26] p-4.5 rounded-2xl border border-white/5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
              <Dumbbell size={14} className="text-emerald-400" />
              Protein Synthesis Target
            </span>
            <span className="text-xs font-mono font-bold text-emerald-400">
              {remainingProtein}g remaining
            </span>
          </div>

          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-2xl sm:text-3xl font-black text-emerald-400">
                {consumedProtein}g
              </span>
              <span className="text-xs text-gray-400 font-bold ml-1">/ {targetProtein}g target</span>
            </div>
            <span className="text-xs font-black text-gray-300 font-mono">
              {proteinPercentage}% Target
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-black/60 h-2 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-emerald-500 to-teal-300 h-full rounded-full transition-all duration-700"
              style={{ width: `${proteinPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Carbs, Fat, Fiber Micro Strip */}
      <div className="grid grid-cols-3 gap-2.5 text-center">
        <div className="bg-black/30 p-2.5 rounded-xl border border-white/5">
          <span className="text-[10px] uppercase font-bold text-gray-400 block">Consumed Carbs</span>
          <span className="text-sm font-black text-amber-400 mt-0.5 block">{consumedCarbs}g</span>
        </div>
        <div className="bg-black/30 p-2.5 rounded-xl border border-white/5">
          <span className="text-[10px] uppercase font-bold text-gray-400 block">Consumed Fats</span>
          <span className="text-sm font-black text-cyan-400 mt-0.5 block">{consumedFats}g</span>
        </div>
        <div className="bg-black/30 p-2.5 rounded-xl border border-white/5">
          <span className="text-[10px] uppercase font-bold text-gray-400 block">Logged Status</span>
          <span className="text-sm font-black text-emerald-400 mt-0.5 block">Synced</span>
        </div>
      </div>
    </div>
  );
};
