import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Zap,
  Droplets,
  Camera,
  Dumbbell,
  Sparkles,
  ArrowRight,
  Clock,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';

interface WhatShouldIDoNowCardProps {
  hydrationLiters: number;
  onAddHydration: (amount: number) => void;
  hasTrainedToday: boolean;
  unloggedMealsCount: number;
  onStartWorkout: (title: string) => void;
  onOpenMealScanner: () => void;
  onOpenAskZyro: (prompt?: string) => void;
  userEnergy: 'high' | 'med' | 'low';
}

export const WhatShouldIDoNowCard: React.FC<WhatShouldIDoNowCardProps> = ({
  hydrationLiters,
  onAddHydration,
  hasTrainedToday,
  unloggedMealsCount,
  onStartWorkout,
  onOpenMealScanner,
  onOpenAskZyro,
  userEnergy,
}) => {
  const [selectedAvailableMinutes, setSelectedAvailableMinutes] = useState<number>(20);
  const [justCompletedAction, setJustCompletedAction] = useState(false);

  // Dynamic recommendation algorithm
  const determineNextAction = () => {
    // 1. Critical Hydration Deficit
    if (hydrationLiters < 1.25) {
      return {
        type: 'hydration',
        badge: 'HYDRATION LAG DETECTED',
        badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
        title: 'Drink 500 ml of fresh water',
        subtitle: `You're currently at ${hydrationLiters.toFixed(1)}L / 2.5L. Cellular hydration drives 12% higher power output.`,
        ctaLabel: 'Log +500ml Water Now (+30 XP)',
        ctaIcon: Droplets,
        ctaColor: 'bg-cyan-400 text-black shadow-[0_0_20px_#22d3ee]',
        action: () => {
          onAddHydration(0.5);
          triggerMicroCelebration();
        },
      };
    }

    // 2. Unlogged Nutrition Gap
    if (unloggedMealsCount > 1) {
      return {
        type: 'nutrition',
        badge: 'NUTRITION GAP',
        badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
        title: 'Scan your next plate with AI',
        subtitle: 'You have unlogged meals today. Keep your daily calorie & protein metrics accurate.',
        ctaLabel: 'Scan Food AI (+50 XP)',
        ctaIcon: Camera,
        ctaColor: 'bg-emerald-400 text-black shadow-[0_0_20px_#10B981]',
        action: onOpenMealScanner,
      };
    }

    // 3. Already trained -> Recovery & Mobility
    if (hasTrainedToday || userEnergy === 'low') {
      return {
        type: 'mobility',
        badge: 'RECOVERY & MOBILITY',
        badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
        title: '10-Minute Hip & Thoracic Mobility Reset',
        subtitle: 'You’ve trained today. Decompress spine discs, reduce cortisol, and accelerate tomorrow’s recovery.',
        ctaLabel: 'Start 10m Mobility Flow (+40 XP)',
        ctaIcon: Sparkles,
        ctaColor: 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-[0_0_20px_#a855f7]',
        action: () => onStartWorkout('Joint Decompression, McGill Big 3 & Mobility'),
      };
    }

    // 4. Free time window cardio / training
    if (selectedAvailableMinutes <= 15) {
      return {
        type: 'quick_hiit',
        badge: 'EXPRESS PROTOCOL',
        badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
        title: `15-Min Express Dorm HIIT & Core Flush`,
        subtitle: 'High-density micro-workout to elevate metabolic rate without heavy barbell setup.',
        ctaLabel: 'Launch 15m Express (+60 XP)',
        ctaIcon: Dumbbell,
        ctaColor: 'bg-amber-400 text-black shadow-[0_0_20px_#f59e0b]',
        action: () => onStartWorkout('Dorm Room Bodyweight Circuit'),
      };
    }

    return {
      type: 'cardio',
      badge: 'PEAK TRAINING WINDOW',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      title: `${selectedAvailableMinutes}-Min Athletic Ascend & Squat Flow`,
      subtitle: `You have ${selectedAvailableMinutes} mins available with ${userEnergy} energy. Optimal window to build strength.`,
      ctaLabel: `Launch Workout Protocol (+80 XP)`,
      ctaIcon: Dumbbell,
      ctaColor: 'bg-emerald-500 text-black shadow-[0_0_20px_#10B981]',
      action: () => onStartWorkout('Power Squat & Athletic Ascend Circuit'),
    };
  };

  const nextAction = determineNextAction();
  const CtaIcon = nextAction.ctaIcon;

  const triggerMicroCelebration = () => {
    setJustCompletedAction(true);
    setTimeout(() => {
      setJustCompletedAction(false);
    }, 1500);
  };

  return (
    <div className="relative bg-gradient-to-br from-[#121A16] via-[#10141D] to-[#0A0D13] border border-emerald-500/30 rounded-3xl p-5 sm:p-7 shadow-2xl space-y-4 overflow-hidden group">
      {/* Subtle background glow */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header with AI indicator */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-purple-500/20 border border-purple-500/30 text-purple-300 flex items-center justify-center font-black">
            <Zap size={16} />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-black text-white tracking-wider uppercase">
              ⚡ WHAT SHOULD I DO NOW?
            </h2>
            <span className="text-[11px] text-gray-400">
              ZYRO real-time telemetry recommendation
            </span>
          </div>
        </div>

        {/* Free Time Selector Buttons */}
        <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/5 self-start sm:self-auto">
          <Clock size={12} className="text-gray-400 ml-1 mr-1" />
          {[15, 20, 30, 45].map((mins) => (
            <button
              key={mins}
              type="button"
              onClick={() => setSelectedAvailableMinutes(mins)}
              className={`px-2 py-0.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                selectedAvailableMinutes === mins
                  ? 'bg-emerald-500 text-black shadow-xs font-black'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {mins}m
            </button>
          ))}
        </div>
      </div>

      {/* Dynamic Recommendation Card Body */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span
            className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${nextAction.badgeColor}`}
          >
            {nextAction.badge}
          </span>
          <span className="text-[11px] text-gray-400">Personalized to your biometric state</span>
        </div>

        <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
          {nextAction.title}
        </h3>
        <p className="text-xs sm:text-sm text-gray-300 leading-relaxed max-w-2xl">
          {nextAction.subtitle}
        </p>
      </div>

      {/* Action CTA with Micro-Interaction Feedback */}
      <div className="flex flex-wrap items-center gap-3 pt-1">
        <button
          type="button"
          onClick={nextAction.action}
          className={`px-6 sm:px-8 py-3.5 rounded-2xl font-black text-xs sm:text-sm uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98] ${nextAction.ctaColor}`}
        >
          {justCompletedAction ? (
            <>
              <CheckCircle2 size={16} />
              <span>LOGGED & ADAPTED!</span>
            </>
          ) : (
            <>
              <CtaIcon size={16} />
              <span>{nextAction.ctaLabel}</span>
              <ArrowRight size={14} />
            </>
          )}
        </button>

        <button
          type="button"
          onClick={() => onOpenAskZyro('What should I do right now for my fitness and energy?')}
          className="px-4 sm:px-5 py-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-gray-300 hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <Sparkles size={14} className="text-purple-400" />
          <span>Ask ZYRO Alternatives</span>
        </button>
      </div>
    </div>
  );
};
