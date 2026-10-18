import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Plus,
  X,
  Dumbbell,
  Camera,
  Droplets,
  Sparkles,
  Target,
  TrendingUp,
  Zap
} from 'lucide-react';

interface UniversalQuickActionFabProps {
  onOpenWorkout: () => void;
  onOpenScanFood: () => void;
  onLogWater: () => void;
  onOpenAskZyro: () => void;
  onOpenGoals: () => void;
  onOpenProgress: () => void;
}

export const UniversalQuickActionFab: React.FC<UniversalQuickActionFabProps> = ({
  onOpenWorkout,
  onOpenScanFood,
  onLogWater,
  onOpenAskZyro,
  onOpenGoals,
  onOpenProgress,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const actions = [
    {
      id: 'workout',
      label: 'Start Workout',
      icon: Dumbbell,
      color: 'bg-emerald-500 text-black shadow-[0_0_15px_#10B981]',
      onClick: () => {
        setIsOpen(false);
        onOpenWorkout();
      },
    },
    {
      id: 'scan_food',
      label: 'Scan Food AI',
      icon: Camera,
      color: 'bg-teal-400 text-black shadow-[0_0_15px_#2dd4bf]',
      onClick: () => {
        setIsOpen(false);
        onOpenScanFood();
      },
    },
    {
      id: 'water',
      label: 'Log 500ml Water',
      icon: Droplets,
      color: 'bg-cyan-400 text-black shadow-[0_0_15px_#22d3ee]',
      onClick: () => {
        setIsOpen(false);
        onLogWater();
      },
    },
    {
      id: 'zyro',
      label: 'Ask ZYRO AI',
      icon: Sparkles,
      color: 'bg-purple-500 text-white shadow-[0_0_15px_#a855f7]',
      onClick: () => {
        setIsOpen(false);
        onOpenAskZyro();
      },
    },
    {
      id: 'goals',
      label: 'Today’s Missions',
      icon: Target,
      color: 'bg-amber-400 text-black shadow-[0_0_15px_#f59e0b]',
      onClick: () => {
        setIsOpen(false);
        onOpenGoals();
      },
    },
    {
      id: 'progress',
      label: 'View Progress',
      icon: TrendingUp,
      color: 'bg-blue-400 text-black shadow-[0_0_15px_#60a5fa]',
      onClick: () => {
        setIsOpen(false);
        onOpenProgress();
      },
    },
  ];

  return (
    <div className="fixed bottom-20 right-4 sm:bottom-24 sm:right-8 z-40">
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-30" onClick={() => setIsOpen(false)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, y: 20 }}
              className="absolute bottom-24 right-4 sm:bottom-28 sm:right-8 flex flex-col items-end gap-2.5 z-40 pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-[#10141C] border border-white/10 rounded-2xl p-2 shadow-2xl space-y-1 w-52 sm:w-56">
                <div className="px-3 py-1.5 border-b border-white/5 flex items-center justify-between text-[11px] font-black uppercase tracking-wider text-emerald-400">
                  <span>Quick Ecosystem Actions</span>
                  <Zap size={12} />
                </div>

                {actions.map((act) => {
                  const Icon = act.icon;
                  return (
                    <button
                      key={act.id}
                      type="button"
                      onClick={act.onClick}
                      className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 transition-all text-left group cursor-pointer"
                    >
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${act.color}`}>
                        <Icon size={16} />
                      </div>
                      <span className="text-xs font-bold text-gray-200 group-hover:text-white transition-colors">
                        {act.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Primary Trigger Button */}
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="relative z-40 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-tr from-emerald-500 via-teal-400 to-cyan-400 text-black flex items-center justify-center shadow-[0_0_25px_rgba(16,185,129,0.5)] border-2 border-emerald-300 cursor-pointer"
        title="Universal Quick Actions"
      >
        <motion.div animate={{ rotate: isOpen ? 45 : 0 }} transition={{ duration: 0.2 }}>
          <Plus size={24} className="font-black" />
        </motion.div>
      </motion.button>
    </div>
  );
};
