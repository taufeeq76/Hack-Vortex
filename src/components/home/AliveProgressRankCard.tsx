import React from 'react';
import { motion } from 'motion/react';
import {
  Flame,
  Award,
  Zap,
  TrendingUp,
  Dumbbell,
  Heart,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { UserHealthProfile } from '../../types';

interface AliveProgressRankCardProps {
  userProfile: UserHealthProfile;
  totalXP: number;
  streakDays: number;
  onOpenAchievements?: () => void;
}

export const AliveProgressRankCard: React.FC<AliveProgressRankCardProps> = ({
  userProfile,
  totalXP,
  streakDays,
  onOpenAchievements,
}) => {
  // Rank calculations
  const rankTiers = [
    { rank: 'E', minXP: 0, maxXP: 500 },
    { rank: 'D', minXP: 500, maxXP: 1000 },
    { rank: 'C', minXP: 1000, maxXP: 2000 },
    { rank: 'B', minXP: 2000, maxXP: 3500 },
    { rank: 'A', minXP: 3500, maxXP: 5500 },
    { rank: 'S', minXP: 5500, maxXP: 10000 },
  ];

  const currentTier =
    rankTiers.find((t) => totalXP >= t.minXP && totalXP < t.maxXP) || rankTiers[2];
  const nextTier =
    rankTiers[rankTiers.indexOf(currentTier) + 1] || rankTiers[rankTiers.length - 1];

  const xpInCurrentTier = totalXP - currentTier.minXP;
  const xpSpan = nextTier.maxXP - currentTier.minXP;
  const progressPercent = Math.min(100, Math.max(0, Math.round((xpInCurrentTier / xpSpan) * 100)));
  const xpToNextRank = Math.max(0, nextTier.minXP - totalXP);

  // Alive performance metrics
  const livingStats = [
    { label: 'Strength', value: 88, icon: Dumbbell, color: 'text-emerald-400' },
    { label: 'Endurance', value: 84, icon: Zap, color: 'text-cyan-400' },
    { label: 'Mobility', value: 79, icon: ShieldCheck, color: 'text-purple-400' },
    { label: 'Consistency', value: 94, icon: Heart, color: 'text-amber-400' },
  ];

  return (
    <div className="bg-[#121620] border border-white/10 rounded-3xl p-5 sm:p-7 shadow-2xl space-y-5">
      {/* Header with Level & Rank */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              HUNTER RANK & LIVING TELEMETRY
            </h2>
            <span className="text-[10px] uppercase font-black px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400">
              Live Adaptive
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-0.5">
            Your physiological adaptation engine and global ascendance tier.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Streak Badge */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-black">
            <Flame size={15} className="fill-amber-400 animate-pulse" />
            <span>{streakDays} DAY STREAK</span>
          </div>

          {/* Rank Badge */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-black">
            <Award size={15} />
            <span>RANK {currentTier.rank}</span>
          </div>
        </div>
      </div>

      {/* Main Animated XP Bar & Rank Progression */}
      <div className="bg-[#151B26] p-4 sm:p-5 rounded-2xl border border-white/5 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-gray-400 block tracking-wider">
              TOTAL EXPERIENCE
            </span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-2xl sm:text-3xl font-black text-white font-mono">
                {totalXP.toLocaleString()}
              </span>
              <span className="text-xs font-black text-emerald-400">XP</span>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-gray-400 block">
              NEXT ASCENDANCE
            </span>
            <span className="text-xs sm:text-sm font-black text-amber-400 font-mono">
              {xpToNextRank} XP to Rank {nextTier.rank}
            </span>
          </div>
        </div>

        {/* Animated XP Progression Bar */}
        <div className="w-full bg-black/70 h-3 rounded-full overflow-hidden p-0.5 border border-white/5">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-400 h-full rounded-full shadow-[0_0_15px_rgba(16,185,129,0.5)]"
          />
        </div>

        <div className="flex justify-between text-[11px] text-gray-400 font-mono">
          <span>Rank {currentTier.rank} ({currentTier.minXP} XP)</span>
          <span>{progressPercent}% Completed</span>
          <span>Rank {nextTier.rank} ({nextTier.minXP} XP)</span>
        </div>
      </div>

      {/* 4 Living Biometric Attributes */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {livingStats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className="bg-black/30 p-3 rounded-2xl border border-white/5 space-y-2 hover:border-white/10 transition-all"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-300">{stat.label}</span>
                <Icon size={14} className={stat.color} />
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-xl font-black text-white">{stat.value}</span>
                <span className="text-[10px] text-gray-400 font-mono">/100</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    stat.label === 'Strength'
                      ? 'bg-emerald-400'
                      : stat.label === 'Endurance'
                      ? 'bg-cyan-400'
                      : stat.label === 'Mobility'
                      ? 'bg-purple-400'
                      : 'bg-amber-400'
                  }`}
                  style={{ width: `${stat.value}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Completed Milestones Strip */}
      <div className="p-3 bg-[#151B26] rounded-2xl border border-white/5 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2 text-gray-300">
          <Award size={15} className="text-amber-400" />
          <span className="font-bold">Active Hunter Badges:</span>
          <span className="text-gray-400">🏆 First Workout • 🔥 14-Day Streak • 💪 Overload Master</span>
        </div>
        <span className="text-[11px] font-mono text-emerald-400 font-bold">5 Unlocked</span>
      </div>
    </div>
  );
};
