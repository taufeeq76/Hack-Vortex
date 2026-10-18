import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  CheckCircle2,
  Circle,
  Clock,
  Sparkles,
  ArrowRight,
  Flame,
  Award,
  Plus,
  Play,
  Camera,
  Droplets,
  Moon
} from 'lucide-react';
import { DailyQuest } from '../../types';

interface YourDayPlanCardProps {
  quests: DailyQuest[];
  onToggleQuest: (id: string) => void;
  onStartWorkout: (title: string) => void;
  onOpenMealScanner: () => void;
  onAddHydration: (amount: number) => void;
  onOpenSleepLog: () => void;
}

export const YourDayPlanCard: React.FC<YourDayPlanCardProps> = ({
  quests,
  onToggleQuest,
  onStartWorkout,
  onOpenMealScanner,
  onAddHydration,
  onOpenSleepLog,
}) => {
  const completedCount = quests.filter((q) => q.completed).length;
  const totalCount = quests.length;
  const isDayComplete = completedCount === totalCount && totalCount > 0;
  const totalPossibleXP = quests.reduce((acc, q) => acc + q.xpReward, 0);
  const earnedXP = quests.filter((q) => q.completed).reduce((acc, q) => acc + q.xpReward, 0);

  // Dynamic quick action mapper for each item
  const getQuickAction = (quest: DailyQuest) => {
    if (quest.completed) {
      return {
        label: 'Completed',
        icon: CheckCircle2,
        action: () => onToggleQuest(quest.id),
        color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
      };
    }

    if (quest.id === 'quest-1' || quest.category === 'workout') {
      return {
        label: 'Start (20m)',
        icon: Play,
        action: () => onStartWorkout('Power Squat & Athletic Ascend Circuit'),
        color: 'text-emerald-300 bg-emerald-500/20 hover:bg-emerald-500 hover:text-black',
      };
    }

    if (quest.id === 'quest-2' || quest.category === 'nutrition') {
      return {
        label: 'Scan Food',
        icon: Camera,
        action: onOpenMealScanner,
        color: 'text-teal-300 bg-teal-500/20 hover:bg-teal-400 hover:text-black',
      };
    }

    if (quest.id === 'quest-3' || quest.category === 'hydration') {
      return {
        label: '+500ml Water',
        icon: Droplets,
        action: () => onAddHydration(0.5),
        color: 'text-cyan-300 bg-cyan-500/20 hover:bg-cyan-400 hover:text-black',
      };
    }

    if (quest.category === 'ai_checkin') {
      return {
        label: 'Start (10m)',
        icon: Sparkles,
        action: () => onStartWorkout('Joint Decompression, McGill Big 3 & Mobility'),
        color: 'text-purple-300 bg-purple-500/20 hover:bg-purple-500 hover:text-white',
      };
    }

    return {
      label: 'Log Activity',
      icon: Plus,
      action: () => onToggleQuest(quest.id),
      color: 'text-gray-300 bg-white/10 hover:bg-white/20',
    };
  };

  return (
    <div className="bg-[#121620] border border-white/10 rounded-3xl p-5 sm:p-7 shadow-2xl space-y-5">
      {/* Header & Day Progress */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              YOUR DAY • TODAY’S PLAN
            </h2>
            <span className="text-[10px] uppercase font-black px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              Interactive
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-0.5">
            Complete actions directly from your command center to build streak momentum and claim rank XP.
          </p>
        </div>

        {/* Progress Pill */}
        <div className="flex items-center gap-3 bg-black/40 px-4 py-2 rounded-2xl border border-white/5 self-start sm:self-auto">
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-gray-400 block">Progress</span>
            <span className="text-xs sm:text-sm font-black text-emerald-400">
              {completedCount} / {totalCount} COMPLETE
            </span>
          </div>
          <div className="w-10 h-10 rounded-full border-2 border-emerald-500/30 flex items-center justify-center font-black text-xs text-white">
            {Math.round((completedCount / Math.max(1, totalCount)) * 100)}%
          </div>
        </div>
      </div>

      {/* Day Complete Bonus Celebration Banner */}
      <AnimatePresence>
        {isDayComplete && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/20 via-emerald-500/20 to-cyan-500/20 border border-amber-500/40 flex items-center justify-between gap-3 shadow-[0_0_25px_rgba(245,158,11,0.2)]"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-400 text-black flex items-center justify-center font-black">
                <Award size={22} />
              </div>
              <div>
                <h4 className="text-sm font-black text-white">🏆 DAY COMPLETE</h4>
                <span className="text-xs text-gray-300">
                  All daily targets hit! You’ve earned the full +{totalPossibleXP} XP daily pool.
                </span>
              </div>
            </div>
            <div className="text-sm font-black text-amber-400 shrink-0 font-mono">
              +{totalPossibleXP} XP CLAIMED
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Actionable Mission Items List */}
      <div className="space-y-2.5">
        {quests.map((quest) => {
          const quick = getQuickAction(quest);
          const QuickIcon = quick.icon;

          return (
            <div
              key={quest.id}
              className={`p-3.5 sm:p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                quest.completed
                  ? 'bg-emerald-950/20 border-emerald-500/30'
                  : 'bg-[#151B26] border-white/5 hover:border-white/20'
              }`}
            >
              {/* Left Title & Status Checkbox */}
              <div className="flex items-start gap-3">
                <button
                  type="button"
                  onClick={() => onToggleQuest(quest.id)}
                  className="mt-0.5 text-gray-400 hover:text-emerald-400 transition-colors cursor-pointer"
                  title={quest.completed ? 'Mark incomplete' : 'Mark completed'}
                >
                  {quest.completed ? (
                    <CheckCircle2 size={22} className="text-emerald-400 fill-emerald-500/20" />
                  ) : (
                    <Circle size={22} className="text-gray-500 hover:text-emerald-400" />
                  )}
                </button>

                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <h4
                      className={`text-sm font-bold transition-all ${
                        quest.completed ? 'line-through text-gray-400 font-medium' : 'text-white'
                      }`}
                    >
                      {quest.title}
                    </h4>
                    <span className="text-[10px] font-black font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      +{quest.xpReward} XP
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 leading-relaxed max-w-xl">
                    {quest.description}
                  </p>
                </div>
              </div>

              {/* Right Quick Action Button */}
              <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                <button
                  type="button"
                  onClick={quick.action}
                  className={`px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer border border-transparent ${quick.color}`}
                >
                  <QuickIcon size={14} />
                  <span>{quick.label}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
