import React from 'react';
import { motion } from 'motion/react';
import {
  Home,
  Dumbbell,
  Utensils,
  Trophy,
  MapPin,
  ShoppingBag,
  TrendingUp,
  MessageSquare,
  Sparkles
} from 'lucide-react';
import { AppTab } from '../types';
import { useLanguage } from '../i18n/LanguageContext';

interface BottomNavProps {
  activeTab: AppTab;
  onSelectTab: (tab: AppTab) => void;
  onOpenAskAi: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onSelectTab,
  onOpenAskAi,
}) => {
  const { t } = useLanguage();

  const tabs = [
    { id: 'home' as AppTab, label: t('home', 'Home'), icon: Home },
    { id: 'workouts' as AppTab, label: t('workouts', 'Workouts'), icon: Dumbbell },
    { id: 'diet' as AppTab, label: t('diet', 'Diet'), icon: Utensils, badge: 'AI' },
    { id: 'challenges' as AppTab, label: t('squad', 'Squad'), icon: Trophy },
    { id: 'campus' as AppTab, label: t('campus', 'Campus'), icon: MapPin },
    { id: 'store' as AppTab, label: t('store', 'Store'), icon: ShoppingBag },
    { id: 'progress' as AppTab, label: t('progress', 'Progress'), icon: TrendingUp },
  ];

  return (
    <div className="fixed bottom-0 inset-x-0 z-40 px-2 sm:px-6 pb-3 pt-1 pointer-events-none">
      <div className="max-w-2xl mx-auto flex items-center justify-between gap-3 pointer-events-auto">
        {/* Main Dock Container */}
        <div className="flex-1 bg-[#0F0F0F]/95 backdrop-blur-2xl border border-emerald-900/40 rounded-2xl sm:rounded-3xl p-1.5 shadow-[0_10px_35px_rgba(0,0,0,0.9)] flex items-center justify-around">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onSelectTab(tab.id)}
                className={`relative py-1.5 px-2 sm:px-3 rounded-xl flex flex-col items-center gap-0.5 transition-all cursor-pointer ${
                  isActive
                    ? 'text-emerald-400 font-black scale-105'
                    : 'text-gray-500 hover:text-white'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTabGlow"
                    className="absolute inset-0 bg-emerald-500/10 border border-emerald-500/30 rounded-xl"
                    transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                  />
                )}
                <div className="relative">
                  <Icon size={17} className={isActive ? 'text-emerald-400 drop-shadow-[0_0_8px_#10B981]' : ''} />
                  {tab.badge && (
                    <span className="absolute -top-1.5 -right-2 bg-emerald-500 text-black text-[8px] font-black px-1 rounded-full shadow-[0_0_6px_#10B981]">
                      {tab.badge}
                    </span>
                  )}
                </div>
                <span className="text-[10px] font-black uppercase tracking-tighter whitespace-nowrap">
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Floating Ask ZYRO AI Button */}
        <button
          type="button"
          onClick={onOpenAskAi}
          title="Ask ZYRO AI Universal Sports Scientist"
          className="relative shrink-0 w-12 h-12 rounded-full bg-emerald-500 text-black flex items-center justify-center shadow-[0_0_15px_#10B981] hover:scale-105 active:scale-95 transition-all cursor-pointer group"
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ repeat: Infinity, duration: 4, repeatDelay: 2 }}
          >
            <MessageSquare size={20} className="fill-black" />
          </motion.div>
          <span className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-white border-2 border-emerald-600 animate-ping" />
        </button>
      </div>
    </div>
  );
};
