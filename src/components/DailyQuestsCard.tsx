import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { DailyQuest, HunterRank } from '../types';
import { useLanguage } from '../i18n/LanguageContext';
import {
  Flame,
  CheckCircle2,
  Circle,
  Sparkles,
  ShieldAlert,
  Snowflake,
  Bell,
  ChevronRight,
  Trophy,
  Zap,
  X
} from 'lucide-react';
import { Mascot } from './Mascot';

interface DailyQuestsCardProps {
  quests: DailyQuest[];
  onToggleQuest: (id: string) => void;
  streakDays: number;
  streakFreezeAvailable: number;
  onUseStreakFreeze: () => void;
  userXP: number;
  hunterRank: HunterRank;
  onOpenMoodToMove?: () => void;
  onOpenMealScanner?: () => void;
}

const ENCOURAGING_FEEDBACK_POOL = [
  'Crushed it! You are forging undeniable momentum! 🔥',
  'Quest cleared! One step closer to S-Rank! ⚡',
  'Discipline beats motivation every single time! 💪',
  'Ascending higher! Your college squad is proud! ✨',
  'Boom! That XP is banked. Keep pushing! 🚀',
  'Every rep and every logged meal stacks compound gains! 🌱',
];

export const DailyQuestsCard: React.FC<DailyQuestsCardProps> = ({
  quests,
  onToggleQuest,
  streakDays,
  streakFreezeAvailable,
  onUseStreakFreeze,
  userXP,
  hunterRank,
  onOpenMoodToMove,
  onOpenMealScanner,
}) => {
  const { t } = useLanguage();
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [showFreezeModal, setShowFreezeModal] = useState(false);
  const [showNotificationSimulation, setShowNotificationSimulation] = useState(false);

  const completedCount = quests.filter((q) => q.completed).length;
  const allCompleted = completedCount === quests.length && quests.length > 0;

  // Streak flame appearance based on streak depth
  const getStreakFlameStyle = (days: number) => {
    if (days >= 30) {
      return {
        color: 'text-violet-400',
        glow: 'shadow-[0_0_20px_rgba(167,139,250,0.6)]',
        bg: 'bg-violet-950/40 border-violet-500/40',
        label: 'Cosmic Overdrive',
      };
    }
    if (days >= 14) {
      return {
        color: 'text-emerald-400',
        glow: 'shadow-[0_0_20px_rgba(16,185,129,0.5)]',
        bg: 'bg-emerald-950/40 border-emerald-500/40',
        label: 'Ascendant Emerald',
      };
    }
    if (days >= 7) {
      return {
        color: 'text-amber-400',
        glow: 'shadow-[0_0_15px_rgba(245,158,11,0.4)]',
        bg: 'bg-amber-950/40 border-amber-500/40',
        label: 'Golden Flare',
      };
    }
    return {
      color: 'text-orange-400',
      glow: 'shadow-[0_0_12px_rgba(249,115,22,0.3)]',
      bg: 'bg-orange-950/40 border-orange-500/40',
      label: 'Warm Ember',
    };
  };

  const streakStyle = getStreakFlameStyle(streakDays);

  const handleQuestClick = (quest: DailyQuest) => {
    onToggleQuest(quest.id);
    if (!quest.completed) {
      // Pick random encouraging feedback
      const randomMsg = ENCOURAGING_FEEDBACK_POOL[Math.floor(Math.random() * ENCOURAGING_FEEDBACK_POOL.length)];
      setFeedbackToast(randomMsg);
      setTimeout(() => setFeedbackToast(null), 3000);

      // Check if this completes all quests
      if (completedCount + 1 === quests.length) {
        setTimeout(() => {
          setShowCelebration(true);
        }, 500);
      }
    }
  };

  // Rank progression thresholds
  const rankThresholds: Record<HunterRank, { minXP: number; maxXP: number; next: HunterRank | null }> = {
    E: { minXP: 0, maxXP: 300, next: 'D' },
    D: { minXP: 300, maxXP: 800, next: 'C' },
    C: { minXP: 800, maxXP: 1600, next: 'B' },
    B: { minXP: 1600, maxXP: 2800, next: 'A' },
    A: { minXP: 2800, maxXP: 4500, next: 'S' },
    S: { minXP: 4500, maxXP: 10000, next: null },
  };

  const currentRankInfo = rankThresholds[hunterRank];
  const rankProgress = Math.min(
    100,
    Math.max(
      0,
      ((userXP - currentRankInfo.minXP) / (currentRankInfo.maxXP - currentRankInfo.minXP)) * 100
    )
  );

  return (
    <div className="space-y-4">
      {/* Top Streak & Solo Leveling Rank Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Streak Flame Card */}
        <div
          onClick={() => setShowFreezeModal(true)}
          className="bg-[#161616] border border-emerald-900/40 hover:border-emerald-500/30 p-4 rounded-3xl flex items-center justify-between cursor-pointer transition-all hover:scale-[1.01] shadow-lg"
        >
          <div className="flex items-center gap-3.5">
            <div
              className={`w-12 h-12 rounded-2xl bg-black/60 flex items-center justify-center border border-white/10 ${streakStyle.glow}`}
            >
              <motion.div
                animate={{ scale: [1, 1.15, 1], rotate: [-2, 2, -2] }}
                transition={{ repeat: Infinity, duration: 1.8 }}
              >
                <Flame size={26} className={streakStyle.color} />
              </motion.div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base sm:text-lg font-black text-white uppercase tracking-tight">
                  {streakDays} {t('streak', 'DAY STREAK')}
                </span>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                  {streakStyle.label}
                </span>
              </div>
              <span className="text-xs text-gray-400 font-medium">
                {streakFreezeAvailable} {t('streakFreeze', 'Streak Freeze')}
              </span>
            </div>
          </div>
          <ChevronRight size={18} className="text-gray-500" />
        </div>

        {/* Solo Leveling Hunter Rank Card */}
        <div className="bg-[#161616] border border-emerald-900/40 p-4 rounded-3xl flex flex-col justify-between shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-500 text-black flex items-center justify-center font-black text-sm shadow-[0_0_10px_#10B981]">
                {hunterRank}
              </div>
              <div>
                <span className="text-[10px] uppercase font-black text-emerald-400 tracking-[0.2em] block">
                  {t('rank', 'HUNTER RANK')} • {userXP} XP
                </span>
                <span className="text-xs font-bold text-white">
                  {t('rank', 'Rank')} {hunterRank} • {userXP} XP
                </span>
              </div>
            </div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
              {currentRankInfo.next ? `Next: Rank ${currentRankInfo.next}` : 'Max S-Rank 👑'}
            </span>
          </div>

          {/* Level Up Progress Bar */}
          <div className="w-full bg-gray-800 h-2 rounded-full mt-3 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${rankProgress}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="bg-emerald-500 h-full rounded-full shadow-[0_0_10px_#10B981]"
            />
          </div>
        </div>
      </div>

      {/* Main Daily Quests Panel */}
      <div className="bg-[#161616] border border-emerald-900/30 rounded-3xl p-5 sm:p-6 space-y-4 shadow-xl relative overflow-hidden">
        {/* Ambient top highlight */}
        <div className="absolute top-0 right-0 w-64 h-32 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-emerald-500">
              {t('dailyQuests', 'Daily Quests')}
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Complete daily challenges to earn Hunter XP & maintain streak.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 tracking-wider">
              {completedCount}/{quests.length} {t('completed', 'Done')}
            </span>

            {/* Notification sequence simulator button */}
            <button
              type="button"
              onClick={() => setShowNotificationSimulation(true)}
              className="text-[11px] text-gray-400 hover:text-emerald-400 flex items-center gap-1 bg-white/5 hover:bg-white/10 px-2.5 py-1 rounded-xl transition-colors font-semibold"
            >
              <Bell size={13} /> Alert
            </button>
          </div>
        </div>

        {/* Feedback Toast Banner */}
        <AnimatePresence>
          {feedbackToast && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="p-3 rounded-2xl bg-emerald-950/80 border border-emerald-400/50 text-emerald-200 text-xs font-bold flex items-center gap-2 shadow-lg"
            >
              <Sparkles size={16} className="text-emerald-400 shrink-0" />
              <span>{feedbackToast}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Quests Checklist */}
        <div className="space-y-3">
          {quests.map((quest) => (
            <div
              key={quest.id}
              onClick={() => handleQuestClick(quest)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between group ${
                quest.completed
                  ? 'bg-emerald-500/5 border-emerald-500/20 text-white'
                  : 'bg-white/5 border-white/5 hover:border-emerald-500/30 text-white'
              }`}
            >
              <div className="flex items-center gap-3.5 pr-2">
                <div
                  className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center text-xs font-black shrink-0 transition-all ${
                    quest.completed
                      ? 'border-emerald-500 bg-emerald-500 text-black shadow-[0_0_8px_#10B981]'
                      : 'border-gray-600 text-transparent group-hover:border-emerald-400'
                  }`}
                >
                  ✓
                </div>
                <div>
                  <span
                    className={`text-sm font-bold block tracking-tight ${
                      quest.completed ? 'line-through text-gray-400' : 'text-white'
                    }`}
                  >
                    {quest.title}
                  </span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">
                      +{quest.xpReward} XP • {quest.completed ? 'COMPLETE' : 'IN PROGRESS'}
                    </span>
                    {quest.progress && (
                      <span className="text-[10px] font-semibold text-emerald-400">
                        ({quest.progress.current}/{quest.progress.target} {quest.progress.unit})
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="shrink-0 flex items-center gap-1.5 bg-black/50 px-3 py-1.5 rounded-xl border border-white/5 text-xs font-black text-emerald-400 shadow-sm">
                <Zap size={13} className="text-emerald-400" />
                +{quest.xpReward} XP
              </div>
            </div>
          ))}
        </div>

        {/* Complete All Reward Card */}
        <div className="mt-2 p-3.5 rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-800 text-black font-black text-xs text-center uppercase tracking-widest shadow-[0_4px_20px_rgba(16,185,129,0.3)]">
          {allCompleted ? '🎉 ALL QUESTS CLEARED • BONUS XP BANKED' : 'COMPLETE ALL FOR S-RANK REWARD'}
        </div>

        {/* Quick Launchers for mood checkin and meal logging */}
        <div className="flex gap-2 pt-1">
          {onOpenMoodToMove && (
            <button
              type="button"
              onClick={onOpenMoodToMove}
              className="flex-1 py-2.5 px-3 rounded-2xl bg-[#0A0A0A] hover:bg-emerald-500/10 border border-emerald-900/40 text-emerald-400 text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Zap size={14} /> Mood-to-Move AI
            </button>
          )}
          {onOpenMealScanner && (
            <button
              type="button"
              onClick={onOpenMealScanner}
              className="flex-1 py-2.5 px-3 rounded-2xl bg-[#0A0A0A] hover:bg-emerald-500/10 border border-emerald-900/40 text-emerald-400 text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              📸 Scan Meal Macros
            </button>
          )}
        </div>
      </div>

      {/* Full Screen Daily Quest Celebration Modal */}
      <AnimatePresence>
        {showCelebration && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-md bg-gradient-to-b from-[#141824] to-[#0d1017] border border-emerald-500/40 rounded-3xl p-6 text-center space-y-5 shadow-2xl overflow-hidden"
            >
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500 animate-pulse" />

              {/* Animated Mascot Celebration */}
              <div className="flex justify-center pt-2">
                <Mascot
                  state="happy"
                  customMessage="DAILY QUEST COMPLETE! You dominated every objective! 🔥"
                  size="lg"
                />
              </div>

              <div className="space-y-1">
                <h2 className="text-2xl font-black font-brand text-white tracking-tight">
                  Daily Quest Mastered!
                </h2>
                <p className="text-xs text-slate-300 max-w-xs mx-auto">
                  All tailored quests completed. Bonus streak XP granted to your squad!
                </p>
              </div>

              {/* Reward pill */}
              <div className="bg-emerald-500/15 border border-emerald-500/40 rounded-2xl p-4 flex items-center justify-around">
                <div>
                  <span className="text-[11px] text-slate-400 block uppercase font-bold">XP Harvest</span>
                  <span className="text-xl font-black text-emerald-400">+250 XP</span>
                </div>
                <div className="h-8 w-[1px] bg-white/10" />
                <div>
                  <span className="text-[11px] text-slate-400 block uppercase font-bold">Streak Milestone</span>
                  <span className="text-xl font-black text-amber-400">{streakDays} Days 🔥</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowCelebration(false)}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 text-black font-extrabold text-sm tracking-wider uppercase shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:opacity-95 transition-opacity cursor-pointer"
              >
                Claim Rewards & Continue →
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Streak Freeze / Recovery Mechanic Modal */}
      <AnimatePresence>
        {showFreezeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-md bg-[#12161f] border border-emerald-500/30 rounded-3xl p-6 space-y-4 shadow-2xl"
            >
              <div className="flex items-center justify-between pb-2 border-b border-white/5">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-cyan-500/15 text-cyan-400">
                    <Snowflake size={20} />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">Streak Freeze & Recovery</h3>
                    <span className="text-[11px] text-slate-400">Never lose hard-earned progress to exams</span>
                  </div>
                </div>
                <button
                  onClick={() => setShowFreezeModal(false)}
                  className="p-1 rounded-full text-slate-400 hover:text-white"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="space-y-3 text-xs text-slate-300">
                <p>
                  College life has heavy project deadlines and midterms. VYLO provides{' '}
                  <strong className="text-emerald-400">2 streak freeze saves per month</strong> so you can pause
                  your streak without anxiety.
                </p>
                <div className="bg-black/40 border border-white/5 rounded-2xl p-3 flex items-center justify-between">
                  <span>Freeze Saves Remaining:</span>
                  <span className="font-extrabold text-cyan-400 text-sm">
                    {streakFreezeAvailable} / 2 this month
                  </span>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowFreezeModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold text-slate-300 transition-colors"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onUseStreakFreeze();
                    setShowFreezeModal(false);
                  }}
                  disabled={streakFreezeAvailable <= 0}
                  className="flex-1 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-extrabold transition-colors disabled:opacity-50"
                >
                  Activate Streak Freeze
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Escalating Notification Sequence Simulator Modal */}
      <AnimatePresence>
        {showNotificationSimulation && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-md bg-[#12161f] border border-emerald-500/30 rounded-3xl p-6 space-y-4 shadow-2xl"
            >
              <div className="flex items-center justify-between pb-2 border-b border-white/5">
                <div className="flex items-center gap-2">
                  <Bell size={18} className="text-amber-400" />
                  <h3 className="text-sm font-bold text-white">Smart Escalating Nudge Sequence</h3>
                </div>
                <button
                  onClick={() => setShowNotificationSimulation(false)}
                  className="p-1 rounded-full text-slate-400 hover:text-white"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="space-y-3">
                {/* Stage 1: Friendly afternoon nudge */}
                <div className="bg-black/30 border border-white/5 rounded-2xl p-3 space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-emerald-400">Stage 1: Friendly Nudge (2:30 PM)</span>
                    <span className="text-slate-500">Between Classes</span>
                  </div>
                  <p className="text-xs text-slate-300">
                    "Hey Alex! Ready to move today? A quick 10-minute mobility break will refresh your focus for afternoon labs! 🌿"
                  </p>
                </div>

                {/* Stage 2: Stronger evening alert */}
                <div className="bg-black/30 border border-amber-500/30 rounded-2xl p-3 space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-amber-400">Stage 2: Stronger Alert (8:15 PM)</span>
                    <span className="text-slate-500">Dorm Hour</span>
                  </div>
                  <p className="text-xs text-slate-300">
                    "⚠️ Don't lose your {streakDays}-day streak! 2 daily quests are waiting. Even a 5-minute stretch saves your flame!"
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowNotificationSimulation(false)}
                className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-bold text-white transition-colors"
              >
                Dismiss Simulation
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
