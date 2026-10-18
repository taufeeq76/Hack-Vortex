import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, ArrowRight, Dumbbell, Camera, TrendingUp, Zap, Moon, MessageSquare } from 'lucide-react';

interface AskZyroEntryCardProps {
  onOpenWithPrompt: (prompt: string) => void;
}

export const AskZyroEntryCard: React.FC<AskZyroEntryCardProps> = ({ onOpenWithPrompt }) => {
  const suggestions = [
    { label: '💪 Build me a workout', prompt: 'Build me a customized strength and mobility workout protocol based on my profile' },
    { label: '🥗 Analyze my food', prompt: 'How should I structure my macronutrients today for optimal recovery and energy?' },
    { label: '📊 Analyze my progress', prompt: 'Analyze my recent fitness progress, streaks, and areas for improvement' },
    { label: '🏃 Improve my running', prompt: 'Give me biomechanical and pacing tips to improve my 5k run pace safely' },
    { label: '😴 Help my recovery', prompt: 'Recommend a recovery protocol and sleep routine to lower cortisol' },
    { label: '❓ Ask anything', prompt: 'What should I do today to maximize my physical and mental energy?' },
  ];

  return (
    <div className="relative bg-gradient-to-br from-[#1A1226] via-[#121522] to-[#0A0D15] border border-purple-500/30 rounded-3xl p-5 sm:p-7 shadow-2xl space-y-4 overflow-hidden">
      {/* Subtle animated neural ambient glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/5 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-500 to-cyan-400 text-white flex items-center justify-center shadow-[0_0_20px_rgba(168,85,247,0.4)]">
              <Sparkles size={20} className="animate-spin-slow" />
            </div>
            <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-cyan-400 border-2 border-black animate-ping" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-black text-white tracking-tight flex items-center gap-1.5">
                ⚡ ASK ZYRO
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] font-black uppercase tracking-wider">
                Multimodal AI OS
              </span>
            </div>
            <span className="text-xs text-gray-400">“What should I do today?”</span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onOpenWithPrompt('What should I do today to optimize my fitness?')}
          className="px-3.5 py-1.5 rounded-xl bg-purple-500/20 hover:bg-purple-500 text-purple-200 hover:text-white border border-purple-500/30 text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer shadow-[0_0_15px_rgba(168,85,247,0.2)]"
        >
          <span>Launch AI</span>
          <ArrowRight size={13} />
        </button>
      </div>

      {/* Quick Suggestion Chips */}
      <div className="space-y-2">
        <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 block">
          Quick Strategic Prompts:
        </span>
        <div className="flex flex-wrap gap-2">
          {suggestions.map((item, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => onOpenWithPrompt(item.prompt)}
              className="px-3 py-2 rounded-xl bg-black/40 border border-purple-500/20 hover:border-cyan-400/60 hover:bg-purple-950/30 text-xs font-bold text-gray-200 hover:text-cyan-200 transition-all cursor-pointer flex items-center gap-1.5 hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
