import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  UserHealthProfile,
  DailyQuest,
  HunterRank,
  MascotMoodState,
  MonthlyDietPlan
} from '../types';
import { Mascot } from '../components/Mascot';
import { useLanguage } from '../i18n/LanguageContext';
import {
  Flame,
  Zap,
  Droplets,
  Moon,
  Camera,
  Dumbbell,
  Sparkles,
  Award,
  ArrowRight,
  Clock,
  Heart,
  Target
} from 'lucide-react';
import { WhatShouldIDoNowCard } from '../components/home/WhatShouldIDoNowCard';
import { YourDayPlanCard } from '../components/home/YourDayPlanCard';
import { AskZyroEntryCard } from '../components/home/AskZyroEntryCard';
import { NutritionIntelligenceCard } from '../components/home/NutritionIntelligenceCard';
import { AliveProgressRankCard } from '../components/home/AliveProgressRankCard';

interface HomeViewProps {
  userProfile: UserHealthProfile;
  userName?: string;
  quests: DailyQuest[];
  onToggleQuest: (id: string) => void;
  streakDays: number;
  streakFreezeAvailable: number;
  onUseStreakFreeze: () => void;
  userXP: number;
  hunterRank: HunterRank;
  hydrationLiters: number;
  onAddHydration: (amount: number) => void;
  sleepHours: number;
  dietPlan: MonthlyDietPlan;
  consumedCalories?: number;
  consumedProtein?: number;
  consumedCarbs?: number;
  consumedFats?: number;
  hasTrainedToday?: boolean;
  onNavigateTab: (tab: string) => void;
  onOpenLiveFormCheck: (workoutTitle?: string) => void;
  onStartActiveWorkout?: (workoutTitle: string) => void;
  onOpenMealScanner: () => void;
  onOpenAskAi: (prompt?: string) => void;
  onOpenBodyProfile: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  userProfile,
  userName = 'Athlete',
  quests,
  onToggleQuest,
  streakDays,
  streakFreezeAvailable,
  onUseStreakFreeze,
  userXP,
  hunterRank,
  hydrationLiters,
  onAddHydration,
  sleepHours,
  dietPlan,
  consumedCalories = 1740,
  consumedProtein = 108,
  consumedCarbs = 184,
  consumedFats = 52,
  hasTrainedToday = false,
  onNavigateTab,
  onOpenLiveFormCheck,
  onStartActiveWorkout,
  onOpenMealScanner,
  onOpenAskAi,
  onOpenBodyProfile,
}) => {
  const { t } = useLanguage();

  // User energy/mindset state (Prompt: "13. ADAPT TO USER MINDSET")
  const [selectedMindset, setSelectedMindset] = useState<
    'hyped' | 'pumped' | 'focus' | 'tired' | 'stressed' | 'chill'
  >('hyped');

  // Dynamic Time of Day Greeting
  const greetingText = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  }, []);

  // Contextual Subtitle & Motivational Nudge
  const contextualMessage = useMemo(() => {
    if (streakDays >= 7) {
      return `🔥 You're on a ${streakDays}-day streak. Don't break the chain.`;
    }
    if (quests.every((q) => q.completed)) {
      return '🏆 All daily missions completed! Outstanding discipline today.';
    }
    if (selectedMindset === 'tired') {
      return '😌 Keep it light. Try a recovery or joint mobility session.';
    }
    if (selectedMindset === 'stressed') {
      return '🧘 A short mobility or breathwork session may be a great reset.';
    }
    if (selectedMindset === 'hyped' || selectedMindset === 'pumped') {
      return "🔥 You're crushing it. Let's level up your strength and power.";
    }
    return '🌱 Fresh start today. Let’s complete your first mission.';
  }, [streakDays, quests, selectedMindset]);

  // Derived mascot state
  const mascotState: MascotMoodState =
    selectedMindset === 'tired'
      ? 'tired'
      : selectedMindset === 'hyped' || selectedMindset === 'pumped'
      ? 'competitive'
      : selectedMindset === 'stressed'
      ? 'encouraging'
      : 'motivating';

  const unloggedMealsCount = quests.find((q) => q.id === 'quest-2')?.completed ? 0 : 2;

  const handleStartWorkoutFlow = (title: string) => {
    if (onStartActiveWorkout) {
      onStartActiveWorkout(title);
    } else {
      onOpenLiveFormCheck(title);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 pb-28">
      {/* 1. TOP GREETING & MASCOT COMMAND CENTER BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-black uppercase tracking-[0.2em] text-emerald-400">
              Personal Intelligent Fitness OS
            </span>
            <span className="text-gray-600">•</span>
            <button
              type="button"
              onClick={onOpenBodyProfile}
              className="text-[11px] font-bold text-gray-400 hover:text-emerald-400 transition-colors cursor-pointer"
            >
              {(userProfile?.bodyShape || 'mesomorph').toUpperCase()} Profile ({userProfile?.weightKg ?? 72}kg)
            </button>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            👋 {greetingText}, {userName}
          </h1>

          <p className="text-xs sm:text-sm text-gray-300 font-medium flex items-center gap-2">
            <span>{contextualMessage}</span>
          </p>
        </div>

        {/* Mascot & Mindset Selector Pill */}
        <div className="flex items-center gap-3 self-start sm:self-auto">
          {/* Mindset Picker Chips */}
          <div className="bg-[#121620] border border-white/10 rounded-2xl p-1.5 flex items-center gap-1 text-[11px] font-bold">
            {[
              { id: 'hyped', label: '🔥 Hyped' },
              { id: 'pumped', label: '⚡ Pump' },
              { id: 'focus', label: '🎯 Focus' },
              { id: 'tired', label: '😴 Tired' },
              { id: 'stressed', label: '🧘 Reset' },
            ].map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setSelectedMindset(m.id as any)}
                className={`px-2.5 py-1 rounded-xl transition-all cursor-pointer ${
                  selectedMindset === m.id
                    ? 'bg-emerald-500 text-black font-black shadow-[0_0_10px_#10B981]'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>

          {/* ZYRO Mascot */}
          <Mascot state={mascotState} size="md" />
        </div>
      </div>

      {/* 2. HERO COMPONENT: ⚡ WHAT SHOULD I DO NOW? (Directly from Prompt Requirement 5) */}
      <WhatShouldIDoNowCard
        hydrationLiters={hydrationLiters}
        onAddHydration={onAddHydration}
        hasTrainedToday={hasTrainedToday}
        unloggedMealsCount={unloggedMealsCount}
        onStartWorkout={handleStartWorkoutFlow}
        onOpenMealScanner={onOpenMealScanner}
        onOpenAskZyro={onOpenAskAi}
        userEnergy={selectedMindset === 'tired' ? 'low' : selectedMindset === 'focus' ? 'med' : 'high'}
      />

      {/* 3. YOUR DAY • TODAY'S PLAN SECTION (Directly from Prompt Requirement 4 & 12) */}
      <YourDayPlanCard
        quests={quests}
        onToggleQuest={onToggleQuest}
        onStartWorkout={handleStartWorkoutFlow}
        onOpenMealScanner={onOpenMealScanner}
        onAddHydration={onAddHydration}
        onOpenSleepLog={() => onNavigateTab('diet')}
      />

      {/* 4. PROMINENT "⚡ ASK ZYRO" AI INTELLIGENCE LAYER (Prompt Requirement 6) */}
      <AskZyroEntryCard onOpenWithPrompt={onOpenAskAi} />

      {/* 5. CONNECTED NUTRITION INTELLIGENCE (Prompt Requirement 8) */}
      <NutritionIntelligenceCard
        targetCalories={dietPlan.targetDailyCalories || 2600}
        consumedCalories={consumedCalories}
        targetProtein={dietPlan.targetMacros.protein || 155}
        consumedProtein={consumedProtein}
        consumedCarbs={consumedCarbs}
        consumedFats={consumedFats}
        onOpenMealScanner={onOpenMealScanner}
        onNavigateToDiet={() => onNavigateTab('diet')}
      />

      {/* 6. ALIVE HUNTER RANK & LIVING TELEMETRY (Prompt Requirement 10 & 11) */}
      <AliveProgressRankCard
        userProfile={userProfile}
        totalXP={userXP}
        streakDays={streakDays}
        onOpenAchievements={() => onNavigateTab('challenges')}
      />

      {/* 7. QUICK BIOMETRIC HYDRATION & RECOVERY TELEMETRY ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        {/* Hydration Widget */}
        <div className="bg-[#121620] border border-white/10 rounded-3xl p-5 sm:p-6 space-y-3.5 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-cyan-400">
              <Droplets size={18} />
              <span className="text-xs font-black uppercase tracking-[0.2em] text-white">
                Hydration Telemetry
              </span>
            </div>
            <span className="text-sm font-black text-cyan-400 font-mono">
              {hydrationLiters.toFixed(1)} / 2.5 L
            </span>
          </div>

          <div className="w-full bg-black/60 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-cyan-400 h-full rounded-full transition-all duration-500 shadow-[0_0_10px_#22d3ee]"
              style={{ width: `${Math.min(100, (hydrationLiters / 2.5) * 100)}%` }}
            />
          </div>

          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={() => onAddHydration(0.25)}
              className="flex-1 py-2.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 text-xs font-black uppercase tracking-wider transition-colors cursor-pointer border border-cyan-500/20 text-center"
            >
              +250ml Glass
            </button>
            <button
              type="button"
              onClick={() => onAddHydration(0.5)}
              className="flex-1 py-2.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 text-xs font-black uppercase tracking-wider transition-colors cursor-pointer border border-cyan-500/20 text-center"
            >
              +500ml Bottle (+30 XP)
            </button>
          </div>
        </div>

        {/* Sleep & CNS Recovery Widget */}
        <div className="bg-[#121620] border border-white/10 rounded-3xl p-5 sm:p-6 space-y-3.5 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-purple-400">
              <Moon size={18} />
              <span className="text-xs font-black uppercase tracking-[0.2em] text-white">
                Sleep & CNS Adaptation
              </span>
            </div>
            <span className="text-sm font-black text-purple-400 font-mono">
              {sleepHours} hrs logged
            </span>
          </div>

          <div className="w-full bg-black/60 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-purple-400 h-full rounded-full transition-all duration-500 shadow-[0_0_10px_#c084fc]"
              style={{ width: `${Math.min(100, (sleepHours / 8) * 100)}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-xs text-gray-400 pt-1">
            <span>Stage 4 Deep REM Recovery</span>
            <button
              type="button"
              onClick={() => onNavigateTab('diet')}
              className="text-emerald-400 hover:text-emerald-300 font-bold uppercase tracking-wider text-[11px] cursor-pointer"
            >
              Log Sleep Routine →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
