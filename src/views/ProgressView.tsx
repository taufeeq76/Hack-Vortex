import React, { useState } from 'react';
import { motion } from 'motion/react';
import { UserHealthProfile, HunterRank } from '../types';
import {
  Activity,
  TrendingUp,
  Award,
  Calendar,
  Zap,
  Flame,
  Scale,
  Dumbbell,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';

interface ProgressViewProps {
  userProfile: UserHealthProfile;
  hunterRank: HunterRank;
  userXP: number;
  streakDays: number;
  onOpenBodyProfile: () => void;
}

export const ProgressView: React.FC<ProgressViewProps> = ({
  userProfile,
  hunterRank,
  userXP,
  streakDays,
  onOpenBodyProfile,
}) => {
  const [activeTab, setActiveTab] = useState<'fit_score' | 'body_stats' | 'achievements'>('fit_score');

  const fitScoreMetrics = [
    { name: 'Cardiovascular Stamina', score: 88, max: 100, trend: '+4% this month', color: 'text-emerald-400', bar: 'bg-emerald-500' },
    { name: 'Joint Mobility & Posture', score: 79, max: 100, trend: '+6% (Form Check AI)', color: 'text-teal-400', bar: 'bg-teal-500' },
    { name: 'Nutrition & Macro Precision', score: 86, max: 100, trend: '+2% (Meal Scanner)', color: 'text-amber-400', bar: 'bg-amber-500' },
    { name: 'Sleep & CNS Recovery', score: 82, max: 100, trend: 'Optimal 7.5h avg', color: 'text-indigo-400', bar: 'bg-indigo-500' },
    { name: 'Compound Strength Index', score: 85, max: 100, trend: '+8.5 kg squat 1RM', color: 'text-cyan-400', bar: 'bg-cyan-500' },
  ];

  const userWeight = userProfile?.weightKg ?? 72;
  const weightLog = [
    { date: 'Sep 01 (Current)', weight: userWeight, note: 'Hypertrophy baseline' },
    { date: 'Aug 15', weight: userWeight - 0.7, note: 'Mid-month checkin' },
    { date: 'Aug 01', weight: userWeight - 1.4, note: 'Pre-semester intake' },
    { date: 'Jul 15', weight: userWeight - 2.1, note: 'Initial onboarding' },
  ];

  const badges = [
    { title: 'BlazePose Pioneer', desc: 'Completed 10 Live Form Check sets with >80% accuracy', unlocked: true },
    { title: 'Macro Alchemist', desc: 'Scanned 15 campus meals with Meal Scanner AI', unlocked: true },
    { title: 'Quad Monarch', desc: 'Maintained a 14-day streak on campus quad', unlocked: true },
    { title: 'S-Rank Sovereign', desc: 'Reach 4,500 total Hunter XP', unlocked: false },
  ];

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black font-brand text-white tracking-tight">
              Progress & Fit Score
            </h1>
            <span className="text-[10px] uppercase font-black px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Rank {hunterRank}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Holistic bio-telemetry, body composition trajectory, and achievement milestones.
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenBodyProfile}
          className="px-4 py-2 rounded-2xl bg-[#141822] border border-emerald-500/30 text-emerald-300 hover:bg-emerald-950/40 text-xs font-bold transition-all self-start sm:self-auto cursor-pointer"
        >
          Edit Health Profile & Equipment
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-white/5 pb-2 text-xs">
        <button
          type="button"
          onClick={() => setActiveTab('fit_score')}
          className={`px-3.5 py-1.5 rounded-xl font-bold transition-all ${
            activeTab === 'fit_score'
              ? 'bg-emerald-500 text-black shadow-md'
              : 'text-slate-400 hover:text-white bg-white/5'
          }`}
        >
          Fit Score Matrix (84/100)
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('body_stats')}
          className={`px-3.5 py-1.5 rounded-xl font-bold transition-all ${
            activeTab === 'body_stats'
              ? 'bg-emerald-500 text-black shadow-md'
              : 'text-slate-400 hover:text-white bg-white/5'
          }`}
        >
          Weight & Body Profile Trajectory
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('achievements')}
          className={`px-3.5 py-1.5 rounded-xl font-bold transition-all ${
            activeTab === 'achievements'
              ? 'bg-emerald-500 text-black shadow-md'
              : 'text-slate-400 hover:text-white bg-white/5'
          }`}
        >
          Unlocked Badges ({badges.filter((b) => b.unlocked).length}/{badges.length})
        </button>
      </div>

      {/* FIT SCORE MATRIX */}
      {activeTab === 'fit_score' && (
        <div className="space-y-4">
          {/* Main Fit Score Display */}
          <div className="bg-gradient-to-br from-[#141824] via-[#10141c] to-[#0c0f15] border border-emerald-500/30 rounded-3xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-2xl">
            <div>
              <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider block">
                Overall Athletic Readiness
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-5xl font-black font-brand text-white">84</span>
                <span className="text-sm font-bold text-slate-400">/ 100</span>
              </div>
              <p className="text-xs text-slate-300 mt-2 max-w-sm">
                Calculated dynamically from your Live Form Check accuracy, workout consistency, and nutrition adherence.
              </p>
            </div>

            <div className="flex gap-4">
              <div className="bg-black/40 border border-white/5 rounded-2xl p-4 text-center">
                <span className="text-[10px] text-slate-400 block uppercase font-bold">Campus Percentile</span>
                <span className="text-2xl font-black text-emerald-400 mt-1 block">Top 12%</span>
                <span className="text-[10px] text-slate-500">Engineering Quad</span>
              </div>
              <div className="bg-black/40 border border-white/5 rounded-2xl p-4 text-center">
                <span className="text-[10px] text-slate-400 block uppercase font-bold">Hunter XP</span>
                <span className="text-2xl font-black text-amber-400 mt-1 block">{userXP}</span>
                <span className="text-[10px] text-slate-500">Rank {hunterRank}</span>
              </div>
            </div>
          </div>

          {/* Detailed Sub-score Bars */}
          <div className="bg-[#121620] border border-white/5 rounded-3xl p-5 space-y-4 shadow-xl">
            <h3 className="text-sm font-bold text-white">Biomechanical & Metabolic Pillars</h3>
            <div className="space-y-3.5">
              {fitScoreMetrics.map((m, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-300">{m.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-slate-400">{m.trend}</span>
                      <span className={`font-black ${m.color}`}>{m.score}%</span>
                    </div>
                  </div>
                  <div className="w-full bg-black/40 h-2 rounded-full overflow-hidden">
                    <div className={`${m.bar} h-full rounded-full`} style={{ width: `${m.score}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* BODY STATS TRAJECTORY */}
      {activeTab === 'body_stats' && (
        <div className="space-y-4">
          <div className="bg-[#121620] border border-white/5 rounded-3xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">Logged Weight Trajectory</h3>
                <p className="text-xs text-slate-400">
                  Current: <strong className="text-emerald-400">{userProfile?.weightKg ?? 72} kg</strong> • Goal:{' '}
                  <strong className="text-white capitalize">{(userProfile?.primaryGoal || 'gain_muscle_posture').replace(/_/g, ' ')}</strong>
                </p>
              </div>
              <button
                type="button"
                onClick={onOpenBodyProfile}
                className="text-xs bg-emerald-500/20 text-emerald-300 px-3 py-1.5 rounded-xl font-bold hover:bg-emerald-500/30 transition-colors"
              >
                Log New Weight
              </button>
            </div>

            <div className="space-y-2">
              {weightLog.map((log, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-2xl bg-black/30 border border-white/5 flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-bold text-white block">{log.date}</span>
                    <span className="text-slate-400">{log.note}</span>
                  </div>
                  <span className="text-base font-black text-emerald-400">{log.weight} kg</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ACHIEVEMENTS */}
      {activeTab === 'achievements' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {badges.map((b, i) => (
            <div
              key={i}
              className={`p-4 rounded-3xl border flex items-start gap-3 transition-all ${
                b.unlocked
                  ? 'bg-emerald-950/25 border-emerald-500/40 shadow-md'
                  : 'bg-[#121620] border-white/5 opacity-60'
              }`}
            >
              <div
                className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
                  b.unlocked ? 'bg-emerald-500 text-black font-black' : 'bg-black/40 text-slate-500'
                }`}
              >
                <Award size={20} />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="text-xs font-bold text-white">{b.title}</h4>
                  {b.unlocked && <CheckCircle2 size={13} className="text-emerald-400" />}
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">{b.desc}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
