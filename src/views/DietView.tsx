import React, { useState } from 'react';
import { motion } from 'motion/react';
import { MonthlyDietPlan, UserHealthProfile, MealItem } from '../types';
import { useLanguage } from '../i18n/LanguageContext';
import {
  Utensils,
  Camera,
  Sparkles,
  ChevronRight,
  Clock,
  CheckCircle2,
  Droplets,
  Moon,
  TrendingUp,
  Calendar,
  Layers,
  Info,
  Plus,
  MessageSquare,
  Bot,
  Zap
} from 'lucide-react';

interface DietViewProps {
  dietPlan: MonthlyDietPlan;
  userProfile: UserHealthProfile;
  hydrationLiters: number;
  onAddHydration: (amount: number) => void;
  sleepHours: number;
  onLogSleep: (hours: number) => void;
  onOpenMealScanner: () => void;
  onOpenZyroChat?: (prompt?: string) => void;
}

export const DietView: React.FC<DietViewProps> = ({
  dietPlan,
  userProfile,
  hydrationLiters,
  onAddHydration,
  sleepHours,
  onLogSleep,
  onOpenMealScanner,
  onOpenZyroChat,
}) => {
  const { t } = useLanguage();
  const [activeSubTab, setActiveSubTab] = useState<'current_plan' | 'history' | 'formula_working'>('current_plan');
  const [loggedMealIds, setLoggedMealIds] = useState<string[]>(['m1', 'm2']);

  // Formula derivation calculations
  const weight = userProfile?.weightKg ?? 72;
  const height = userProfile?.heightCm ?? 178;
  const bmrCalc = Math.round(10 * weight + 6.25 * height - 5 * 21 + 5);
  const activityMultiplier = (userProfile?.dailyWorkoutMinutes ?? 45) >= 45 ? 1.55 : 1.375;
  const tdeeCalc = Math.round(bmrCalc * activityMultiplier);
  const goalAdjustment =
    userProfile?.primaryGoal === 'gain_muscle_posture'
      ? +250
      : userProfile?.primaryGoal === 'lose_weight_fat'
      ? -350
      : 0;
  const finalCalorieTarget = tdeeCalc + goalAdjustment;

  const toggleMealLog = (id: string) => {
    setLoggedMealIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const pastMonthsHistory = [
    {
      month: 'August 2026',
      calories: 2500,
      protein: 140,
      adherence: 91,
      loggedWeight: '71.2 kg',
      summary: 'Summer hypertrophy block completed. Added 1.4kg lean muscle baseline.',
    },
    {
      month: 'July 2026',
      calories: 2450,
      protein: 135,
      adherence: 86,
      loggedWeight: '70.5 kg',
      summary: 'Dorm mobility and agility endurance focus.',
    },
    {
      month: 'June 2026',
      calories: 2400,
      protein: 130,
      adherence: 82,
      loggedWeight: '69.8 kg',
      summary: 'Initial baseline setup and campus dining hall calorie calibration.',
    },
  ];

  return (
    <div className="space-y-6 pb-20">
      {/* Top Banner & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black font-brand text-white tracking-tight">
              VYLO {t('diet', 'Diet')}
            </h1>
            <span className="text-[10px] uppercase font-black px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              {t('aiNutritionEngine', 'AI Nutrition Engine')}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Dynamic monthly macros tailored to your biometrics, campus mess options, and workout split.
          </p>
        </div>

        {/* Action Buttons: Scan Meal + Ask Diet AI */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            id="diet-ai-consult-btn"
            type="button"
            onClick={() => onOpenZyroChat?.("Act as my specialized Sports Nutritionist and Diet AI. Analyze my daily calories and suggest optimal meals for my goal.")}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs tracking-wider border border-white/10 transition-all cursor-pointer"
          >
            <Bot size={16} className="text-emerald-400" />
            <span>Ask Diet AI</span>
          </button>

          <button
            id="diet-ai-scanner-btn"
            type="button"
            onClick={onOpenMealScanner}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 text-black font-black text-xs tracking-wider uppercase shadow-[0_0_20px_rgba(16,185,129,0.35)] hover:opacity-95 transition-all cursor-pointer"
          >
            <Camera size={16} />
            <span>{t('scanMeal', 'Scan a Meal')}</span>
          </button>
        </div>
      </div>

      {/* Interactive ZYRO Diet AI Copilot Pill Bar */}
      <div className="bg-[#0D1219] border border-emerald-500/30 rounded-3xl p-4 space-y-3 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-emerald-400" />
            <h3 className="text-xs font-black uppercase tracking-wider text-emerald-300">
              ZYRO Diet AI Copilot & Smart Nutritionist
            </h3>
          </div>
          <span className="text-[10px] font-mono text-gray-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
            Gemini Vision & Nutrition Models Active
          </span>
        </div>

        <p className="text-xs text-slate-300">
          Have questions about campus mess food, protein targets, or nutrient timing? Select an instant prompt below or open the AI assistant:
        </p>

        <div className="flex flex-wrap gap-2 pt-1">
          {[
            { label: '🍗 How to hit 140g+ protein on campus', prompt: 'Give me practical campus dining hall strategies to hit 140g+ protein daily on a budget.' },
            { label: '🥗 Cheap dorm high-protein recipes', prompt: 'What are 3 quick, affordable, high-protein dorm room meals requiring minimal cooking equipment?' },
            { label: '⏱️ Pre vs Post-workout timing', prompt: 'Explain the optimal meal and nutrient timing around my training sessions for glycogen replenishment.' },
            { label: '🔥 Healthy snack ideas for studying', prompt: 'Recommend high-protein, brain-boosting snacks to eat while studying that avoid sugar crashes.' },
          ].map((item, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => onOpenZyroChat?.(item.prompt)}
              className="text-[11px] font-bold px-3 py-1.5 rounded-xl bg-white/5 hover:bg-emerald-500/20 text-slate-300 hover:text-emerald-300 border border-white/5 hover:border-emerald-500/30 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <span>{item.label}</span>
              <ChevronRight size={11} />
            </button>
          ))}
        </div>
      </div>

      {/* Monthly Update Notice Banner */}
      <div className="bg-gradient-to-r from-emerald-950/40 via-[#141822] to-[#10141c] border border-emerald-500/30 rounded-3xl p-4 sm:p-5 space-y-2 relative overflow-hidden shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <h3 className="text-xs sm:text-sm font-extrabold text-emerald-300 uppercase tracking-wider">
              {dietPlan.updateNotice.title}
            </h3>
          </div>
          <span className="text-[10px] font-semibold text-slate-400">
            Adherence: {dietPlan.adherencePercentage}%
          </span>
        </div>
        <p className="text-xs text-slate-200">{dietPlan.updateNotice.reason}</p>
        <div className="flex flex-wrap gap-2 pt-1 text-[11px] text-emerald-300">
          {dietPlan.updateNotice.highlights.map((item, i) => (
            <span key={i} className="bg-emerald-950/70 border border-emerald-500/20 px-2.5 py-0.5 rounded-lg">
              ✓ {item}
            </span>
          ))}
        </div>
      </div>

      {/* Daily Macro Target Bar */}
      <div className="bg-[#121620] border border-white/5 rounded-3xl p-5 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
              {t('dailyTargetCalories', 'Daily Target Calories')} ({dietPlan.month})
            </span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-3xl font-black text-white">{finalCalorieTarget}</span>
              <span className="text-xs font-bold text-emerald-400">kcal / day</span>
            </div>
          </div>

          <button
            onClick={() => setActiveSubTab('formula_working')}
            className="text-xs text-slate-300 hover:text-emerald-400 bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-xl border border-white/5 transition-colors flex items-center gap-1.5"
          >
            <Info size={14} /> {t('viewFormula', 'View Formula Working')}
          </button>
        </div>

        {/* 3 Macro Cards */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-black/30 border border-emerald-500/30 rounded-2xl p-3 text-center">
            <span className="text-[11px] font-semibold text-slate-400 block">{t('protein', 'Protein')}</span>
            <span className="text-xl font-black text-emerald-400 mt-0.5 block">
              {dietPlan.targetMacros.protein}g
            </span>
            <span className="text-[10px] text-slate-500">2.15g / kg</span>
          </div>

          <div className="bg-black/30 border border-amber-500/30 rounded-2xl p-3 text-center">
            <span className="text-[11px] font-semibold text-slate-400 block">{t('carbs', 'Carbs')}</span>
            <span className="text-xl font-black text-amber-400 mt-0.5 block">
              {dietPlan.targetMacros.carbs}g
            </span>
            <span className="text-[10px] text-slate-500">Glycogen recharge</span>
          </div>

          <div className="bg-black/30 border border-cyan-500/30 rounded-2xl p-3 text-center">
            <span className="text-[11px] font-semibold text-slate-400 block">{t('fats', 'Healthy Fats')}</span>
            <span className="text-xl font-black text-cyan-400 mt-0.5 block">
              {dietPlan.targetMacros.fats}g
            </span>
            <span className="text-[10px] text-slate-500">Hormone baseline</span>
          </div>
        </div>
      </div>

      {/* Sub-tabs: Current Daily Meals vs Formula Working vs Past Diet History */}
      <div className="flex gap-2 border-b border-white/5 pb-2 text-xs">
        <button
          type="button"
          onClick={() => setActiveSubTab('current_plan')}
          className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
            activeSubTab === 'current_plan'
              ? 'bg-emerald-500 text-black'
              : 'text-slate-400 hover:text-white bg-white/5'
          }`}
        >
          {t('todaysMealPlan', 'Today’s Meal Plan')}
        </button>
        <button
          type="button"
          onClick={() => setActiveSubTab('formula_working')}
          className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
            activeSubTab === 'formula_working'
              ? 'bg-emerald-500 text-black'
              : 'text-slate-400 hover:text-white bg-white/5'
          }`}
        >
          {t('formulaWorking', 'Formula Working (Transparent)')}
        </button>
        <button
          type="button"
          onClick={() => setActiveSubTab('history')}
          className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
            activeSubTab === 'history'
              ? 'bg-emerald-500 text-black'
              : 'text-slate-400 hover:text-white bg-white/5'
          }`}
        >
          {t('dietHistory', 'Diet History')} ({pastMonthsHistory.length} Months)
        </button>
      </div>

      {/* CURRENT MEAL PLAN VIEW */}
      {activeSubTab === 'current_plan' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Tap checkbox to log meal consumption</span>
            <span>{loggedMealIds.length} of {dietPlan.meals.length} meals logged</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {dietPlan.meals.map((meal) => {
              const isLogged = loggedMealIds.includes(meal.id);
              return (
                <div
                  key={meal.id}
                  onClick={() => toggleMealLog(meal.id)}
                  className={`p-4 rounded-3xl border transition-all cursor-pointer flex flex-col justify-between ${
                    isLogged
                      ? 'bg-emerald-950/25 border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.1)]'
                      : 'bg-[#121620] border-white/5 hover:border-white/20'
                  }`}
                >
                  <div>
                    {/* Header */}
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black uppercase tracking-wider text-emerald-400">
                          {meal.type}
                        </span>
                        <span className="text-[11px] text-slate-500 flex items-center gap-1">
                          <Clock size={11} /> {meal.recommendedTime}
                        </span>
                      </div>
                      <button
                        type="button"
                        className={`w-6 h-6 rounded-lg flex items-center justify-center border transition-all ${
                          isLogged
                            ? 'bg-emerald-500 border-emerald-400 text-black'
                            : 'border-white/20 bg-black/40 text-transparent'
                        }`}
                      >
                        <CheckCircle2 size={16} />
                      </button>
                    </div>

                    <h4 className="text-sm font-bold text-white mb-1">{meal.title}</h4>
                    <p className="text-xs text-slate-400 leading-relaxed mb-3">
                      {meal.description}
                    </p>
                  </div>

                  {/* Macros & Tags */}
                  <div>
                    <div className="flex flex-wrap gap-1.5 mb-2.5">
                      {meal.tags.map((tag, i) => (
                        <span
                          key={i}
                          className="text-[10px] bg-black/40 text-slate-300 border border-white/5 px-2 py-0.5 rounded-md"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="bg-black/40 rounded-xl p-2 flex items-center justify-around text-xs border border-white/5">
                      <span className="font-bold text-white">{meal.macros.calories} kcal</span>
                      <span className="text-slate-500">•</span>
                      <span className="font-bold text-emerald-400">{meal.macros.protein}g P</span>
                      <span className="text-slate-500">•</span>
                      <span className="font-bold text-amber-400">{meal.macros.carbs}g C</span>
                      <span className="text-slate-500">•</span>
                      <span className="font-bold text-cyan-400">{meal.macros.fats}g F</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* FORMULA WORKING VIEW (Transparent calculations) */}
      {activeSubTab === 'formula_working' && (
        <div className="bg-[#121620] border border-white/5 rounded-3xl p-5 space-y-4">
          <div>
            <h3 className="text-base font-bold text-white">Transparent BMR & TDEE Mathematical Derivation</h3>
            <p className="text-xs text-slate-400">
              VYLO does not use a black-box algorithm. Here is the exact clinical formula derived from your body profile.
            </p>
          </div>

          <div className="space-y-3 text-xs text-slate-300">
            {/* Step 1: Mifflin-St Jeor Formula */}
            <div className="bg-black/30 border border-white/5 rounded-2xl p-3.5 space-y-1">
              <span className="font-bold text-emerald-400 block">1. Basal Metabolic Rate (BMR)</span>
              <p className="font-mono text-slate-300">
                BMR = (10 × {weight}kg) + (6.25 × {height}cm) - (5 × 21 yrs) + 5
              </p>
              <p className="font-mono text-emerald-300 font-bold">
                BMR = {bmrCalc} kcal / day (resting energy requirement)
              </p>
            </div>

            {/* Step 2: Activity Multiplier */}
            <div className="bg-black/30 border border-white/5 rounded-2xl p-3.5 space-y-1">
              <span className="font-bold text-emerald-400 block">2. Total Daily Energy Expenditure (TDEE)</span>
              <p className="text-slate-400">
                Activity Multiplier based on {userProfile.dailyWorkoutMinutes} min daily target + campus commute:{' '}
                <strong className="text-white">×{activityMultiplier}</strong>
              </p>
              <p className="font-mono text-emerald-300 font-bold">
                TDEE = {bmrCalc} × {activityMultiplier} = {tdeeCalc} kcal / day
              </p>
            </div>

            {/* Step 3: Goal adjustment */}
            <div className="bg-black/30 border border-white/5 rounded-2xl p-3.5 space-y-1">
              <span className="font-bold text-emerald-400 block">3. Goal Adjustment & Macronutrient Split</span>
              <p className="text-slate-400">
                Objective: <strong className="text-white capitalize">{userProfile.primaryGoal.replace(/_/g, ' ')}</strong> ({goalAdjustment > 0 ? `+${goalAdjustment}` : goalAdjustment} kcal lean surplus)
              </p>
              <p className="font-mono text-emerald-300 font-bold">
                Target Daily Calories: {finalCalorieTarget} kcal
              </p>
              <p className="text-slate-400 pt-1">
                • Protein: {dietPlan.targetMacros.protein}g ({dietPlan.targetMacros.protein * 4} kcal = {Math.round((dietPlan.targetMacros.protein * 4 / finalCalorieTarget) * 100)}%)<br />
                • Carbohydrates: {dietPlan.targetMacros.carbs}g ({dietPlan.targetMacros.carbs * 4} kcal = {Math.round((dietPlan.targetMacros.carbs * 4 / finalCalorieTarget) * 100)}%)<br />
                • Healthy Fats: {dietPlan.targetMacros.fats}g ({dietPlan.targetMacros.fats * 9} kcal = {Math.round((dietPlan.targetMacros.fats * 9 / finalCalorieTarget) * 100)}%)
              </p>
            </div>
          </div>
        </div>
      )}

      {/* DIET HISTORY VIEW */}
      {activeSubTab === 'history' && (
        <div className="space-y-3">
          {pastMonthsHistory.map((hist, idx) => (
            <div
              key={idx}
              className="bg-[#121620] border border-white/5 rounded-3xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-white">{hist.month}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300">
                    {hist.adherence}% Adherence
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">{hist.summary}</p>
                <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-2">
                  <span>Logged Weight: <strong className="text-slate-300">{hist.loggedWeight}</strong></span>
                  <span>Target: <strong className="text-slate-300">{hist.calories} kcal</strong></span>
                  <span>Protein: <strong className="text-slate-300">{hist.protein}g</strong></span>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                  <TrendingUp size={14} /> Trajectory on Track
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Hydration & Sleep Trackers (Tied with Home Dashboard) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
        {/* Hydration */}
        <div className="bg-[#121620] border border-white/5 rounded-3xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-cyan-400">
              <Droplets size={18} />
              <span className="text-xs font-bold uppercase tracking-wider text-white">Hydration Tracker</span>
            </div>
            <span className="text-sm font-extrabold text-cyan-400">{hydrationLiters.toFixed(1)} / 2.5 L</span>
          </div>

          <div className="w-full bg-black/40 h-2 rounded-full overflow-hidden">
            <div
              className="bg-cyan-400 h-full rounded-full transition-all"
              style={{ width: `${Math.min(100, (hydrationLiters / 2.5) * 100)}%` }}
            />
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => onAddHydration(0.25)}
              className="flex-1 py-1.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 text-xs font-bold transition-colors"
            >
              +1 Glass (250ml)
            </button>
            <button
              type="button"
              onClick={() => onAddHydration(0.5)}
              className="flex-1 py-1.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 text-xs font-bold transition-colors"
            >
              +Bottle (500ml)
            </button>
          </div>
        </div>

        {/* Sleep */}
        <div className="bg-[#121620] border border-white/5 rounded-3xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-indigo-400">
              <Moon size={18} />
              <span className="text-xs font-bold uppercase tracking-wider text-white">Sleep & Recovery</span>
            </div>
            <span className="text-sm font-extrabold text-indigo-400">{sleepHours} hrs logged</span>
          </div>

          <div className="w-full bg-black/40 h-2 rounded-full overflow-hidden">
            <div
              className="bg-indigo-400 h-full rounded-full transition-all"
              style={{ width: `${Math.min(100, (sleepHours / 8) * 100)}%` }}
            />
          </div>

          <div className="flex gap-2">
            {[6.5, 7.5, 8.0].map((hrs) => (
              <button
                key={hrs}
                type="button"
                onClick={() => onLogSleep(hrs)}
                className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                  sleepHours === hrs
                    ? 'bg-indigo-500 text-black'
                    : 'bg-indigo-500/15 text-indigo-300 hover:bg-indigo-500/25'
                }`}
              >
                {hrs}h
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
