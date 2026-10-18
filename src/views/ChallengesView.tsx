import React, { useState } from 'react';
import { motion } from 'motion/react';
import { HunterRank } from '../types';
import {
  Trophy,
  Users,
  Flame,
  Award,
  Shield,
  Sparkles,
  ChevronRight,
  CheckCircle2,
  Lock,
  ArrowUpRight
} from 'lucide-react';

interface ChallengesViewProps {
  userXP: number;
  hunterRank: HunterRank;
  streakDays: number;
}

export const ChallengesView: React.FC<ChallengesViewProps> = ({
  userXP,
  hunterRank,
  streakDays,
}) => {
  const [activeTab, setActiveTab] = useState<'leaderboard' | 'challenges' | 'ranks'>('leaderboard');
  const [joinedChallenges, setJoinedChallenges] = useState<string[]>(['c1', 'c2']);

  const campusSquads = [
    { rank: 1, name: 'Faculty of Business & Finance', members: 342, totalXP: 184500, leadBy: '+420 XP' },
    { rank: 2, name: 'Engineering Ascendants (Your Squad)', members: 418, totalXP: 184080, leadBy: 'Current' },
    { rank: 3, name: 'Life Sciences & Medicine', members: 289, totalXP: 172900, leadBy: '-11,180 XP' },
    { rank: 4, name: 'School of Architecture & Design', members: 194, totalXP: 148200, leadBy: '-35,880 XP' },
    { rank: 5, name: 'Humanities & Social Arts', members: 215, totalXP: 139100, leadBy: '-44,980 XP' },
  ];

  const campusChallenges = [
    {
      id: 'c1',
      title: '100,000 Step Campus Clash',
      squad: 'Engineering vs Business',
      xpReward: 350,
      daysLeft: 4,
      progress: 68,
      desc: 'Accumulate collective steps across campus lecture halls and library quads.',
    },
    {
      id: 'c2',
      title: 'Night Owl Dorm Calisthenics Sprint',
      squad: 'All Squads',
      xpReward: 250,
      daysLeft: 2,
      progress: 85,
      desc: 'Complete 3 dorm workouts after 7 PM. Stay consistent during coursework!',
    },
    {
      id: 'c3',
      title: '7-Day Clean Dining Hall Nutrition Streak',
      squad: 'Campus Wide',
      xpReward: 400,
      daysLeft: 6,
      progress: 30,
      desc: 'Scan 2 meals daily with balanced protein ratios using Meal Scanner AI.',
    },
  ];

  const hunterRanksConfig: {
    rank: HunterRank;
    title: string;
    xpReq: string;
    perk: string;
    color: string;
  }[] = [
    { rank: 'E', title: 'Awakened Novice', xpReq: '0 XP', perk: 'Basic telemetry & daily quests', color: 'text-slate-400' },
    { rank: 'D', title: 'Apprentice Striver', xpReq: '300 XP', perk: 'Unlocks custom dorm workout splits', color: 'text-blue-400' },
    { rank: 'C', title: 'Campus Vanguard', xpReq: '800 XP', perk: '15% Store discount on sports nutrition', color: 'text-emerald-400' },
    { rank: 'B', title: 'Elite Striker', xpReq: '1,600 XP', perk: 'Exclusive Squad badge & coach chat access', color: 'text-amber-400' },
    { rank: 'A', title: 'Campus Shadow Sovereign', xpReq: '2,800 XP', perk: 'Priority access to gym varsity slots', color: 'text-violet-400' },
    { rank: 'S', title: 'Ascendant Monarch', xpReq: '4,500 XP', perk: 'Permanent campus leaderboard pedestal & ZYRO Gold Aura', color: 'text-yellow-300' },
  ];

  const toggleJoin = (id: string) => {
    setJoinedChallenges((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl sm:text-3xl font-black font-brand text-white tracking-tight">
            Squad Ascend & Challenges
          </h1>
          <span className="text-[10px] uppercase font-black px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
            Rank {hunterRank} Hunter
          </span>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Compete alongside your university department squad and rise from E-Rank to S-Rank.
        </p>
      </div>

      {/* Sub Tabs */}
      <div className="flex gap-2 border-b border-white/5 pb-2 text-xs">
        <button
          type="button"
          onClick={() => setActiveTab('leaderboard')}
          className={`px-3.5 py-1.5 rounded-xl font-bold transition-all ${
            activeTab === 'leaderboard'
              ? 'bg-amber-500 text-black shadow-md'
              : 'text-slate-400 hover:text-white bg-white/5'
          }`}
        >
          Department Squads
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('challenges')}
          className={`px-3.5 py-1.5 rounded-xl font-bold transition-all ${
            activeTab === 'challenges'
              ? 'bg-amber-500 text-black shadow-md'
              : 'text-slate-400 hover:text-white bg-white/5'
          }`}
        >
          Campus Challenges ({campusChallenges.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('ranks')}
          className={`px-3.5 py-1.5 rounded-xl font-bold transition-all ${
            activeTab === 'ranks'
              ? 'bg-amber-500 text-black shadow-md'
              : 'text-slate-400 hover:text-white bg-white/5'
          }`}
        >
          Solo Leveling Hunter Ranks (E → S)
        </button>
      </div>

      {/* LEADERBOARD VIEW */}
      {activeTab === 'leaderboard' && (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-amber-950/40 via-[#141822] to-[#10141c] border border-amber-500/30 rounded-3xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
            <div>
              <span className="text-[10px] uppercase font-bold text-amber-400 block tracking-wider">
                Active Weekly Campus Clash
              </span>
              <h3 className="text-lg font-bold text-white mt-0.5">Engineering Ascendants</h3>
              <p className="text-xs text-slate-300">
                You are in Rank #2, just <strong className="text-amber-300">420 XP</strong> behind Business & Finance!
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold text-emerald-400 block">Your Individual XP Contributed</span>
              <span className="text-2xl font-black text-white">{userXP} XP</span>
            </div>
          </div>

          <div className="space-y-2">
            {campusSquads.map((sq) => {
              const isUserSquad = sq.name.includes('Your Squad');
              return (
                <div
                  key={sq.rank}
                  className={`p-4 rounded-3xl border flex items-center justify-between transition-all ${
                    isUserSquad
                      ? 'bg-emerald-950/30 border-emerald-500/50 shadow-md'
                      : 'bg-[#121620] border-white/5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm ${
                        sq.rank === 1
                          ? 'bg-amber-500 text-black'
                          : sq.rank === 2
                          ? 'bg-slate-300 text-black'
                          : sq.rank === 3
                          ? 'bg-amber-800 text-white'
                          : 'bg-black/40 text-slate-400'
                      }`}
                    >
                      #{sq.rank}
                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                        {sq.name}
                        {isUserSquad && (
                          <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full">
                            You
                          </span>
                        )}
                      </h4>
                      <span className="text-xs text-slate-400">
                        {sq.members} Active Students • {sq.totalXP.toLocaleString()} Total XP
                      </span>
                    </div>
                  </div>

                  <span className="text-xs font-semibold text-slate-300">{sq.leadBy}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* CHALLENGES VIEW */}
      {activeTab === 'challenges' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {campusChallenges.map((ch) => {
            const isJoined = joinedChallenges.includes(ch.id);
            return (
              <div
                key={ch.id}
                className="bg-[#121620] border border-white/5 rounded-3xl p-5 flex flex-col justify-between shadow-xl space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                      {ch.squad}
                    </span>
                    <span className="text-xs text-slate-400">{ch.daysLeft} days left</span>
                  </div>

                  <h3 className="text-base font-bold text-white">{ch.title}</h3>
                  <p className="text-xs text-slate-400 mt-1">{ch.desc}</p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Challenge Progress</span>
                    <span className="font-bold text-emerald-400">{ch.progress}%</span>
                  </div>
                  <div className="w-full bg-black/40 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full"
                      style={{ width: `${ch.progress}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-white/5">
                  <span className="text-xs font-black text-amber-400">+{ch.xpReward} XP</span>
                  <button
                    type="button"
                    onClick={() => toggleJoin(ch.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      isJoined
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : 'bg-emerald-500 hover:bg-emerald-400 text-black'
                    }`}
                  >
                    {isJoined ? 'Joined ✓' : 'Join Challenge'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* HUNTER RANKS VIEW */}
      {activeTab === 'ranks' && (
        <div className="space-y-3">
          <div className="bg-[#121620] border border-emerald-500/30 rounded-3xl p-5 space-y-2">
            <h3 className="text-base font-bold text-white">Solo Leveling Hunter Progression</h3>
            <p className="text-xs text-slate-300">
              Inspired by Solo Leveling's hunter ranks. Earn XP across daily quests, Live Form Check sets,
              and meal scanning to ascend the campus hierarchy.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {hunterRanksConfig.map((item) => {
              const isCurrent = hunterRank === item.rank;
              return (
                <div
                  key={item.rank}
                  className={`p-4 rounded-3xl border flex items-start gap-3.5 transition-all ${
                    isCurrent
                      ? 'bg-emerald-950/30 border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.15)]'
                      : 'bg-[#121620] border-white/5'
                  }`}
                >
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl shrink-0 border border-white/10 ${
                      isCurrent
                        ? 'bg-emerald-500 text-black border-emerald-400'
                        : 'bg-black/40 text-slate-400'
                    }`}
                  >
                    {item.rank}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className={`text-sm font-bold ${isCurrent ? 'text-white' : item.color}`}>
                        Rank {item.rank}: {item.title}
                      </h4>
                      {isCurrent && (
                        <span className="text-[10px] bg-emerald-500 text-black font-black px-2 py-0.5 rounded-full">
                          Current Rank
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-slate-400 block mt-0.5">
                      Requirement: {item.xpReq}
                    </span>
                    <p className="text-xs text-slate-300 mt-1.5 font-medium">
                      Perk: <strong className="text-emerald-400">{item.perk}</strong>
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
