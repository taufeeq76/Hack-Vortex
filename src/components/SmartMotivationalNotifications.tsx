import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { DailyQuest, MotivationalNotification, NotificationTone } from '../types';
import {
  getBrowserNotificationPermission,
  requestBrowserNotificationPermission,
  sendNativeNotification,
  getMotivationalNotificationForActivity,
  playMotivationalChime,
  checkAndRecordAppOpen,
} from '../services/notificationService';
import {
  Bell,
  BellRing,
  CheckCircle2,
  Sparkles,
  X,
  ChevronDown,
  ChevronUp,
  Settings2,
  Heart,
  Flame,
  Volume2,
  VolumeX,
} from 'lucide-react';

interface SmartMotivationalNotificationsProps {
  quests: DailyQuest[];
  onCompleteQuest: (id: string) => void;
  onOpenZyroChat: (prompt?: string) => void;
  onNavigateToTab?: (tab: string) => void;
}

export const SmartMotivationalNotifications: React.FC<SmartMotivationalNotificationsProps> = ({
  quests,
  onCompleteQuest,
  onOpenZyroChat,
  onNavigateToTab,
}) => {
  const [permission, setPermission] = useState<'default' | 'granted' | 'denied' | 'unsupported'>('default');
  const [isDismissed, setIsDismissed] = useState(false);
  const [showSimPanel, setShowSimPanel] = useState(false);
  const [simulatedTone, setSimulatedTone] = useState<NotificationTone | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showPermissionPrompt, setShowPermissionPrompt] = useState(false);

  // Track task completion count changes
  const prevCompletedCountRef = useRef<number | null>(null);
  const completedQuests = quests.filter((q) => q.completed);
  const incompleteQuests = quests.filter((q) => !q.completed);
  const completedCount = completedQuests.length;
  const totalCount = quests.length;

  // Record app open on mount
  useEffect(() => {
    checkAndRecordAppOpen();
    const perm = getBrowserNotificationPermission();
    setPermission(perm);
    if (perm === 'default') {
      // Show gentle permission invitation after 2 seconds
      const timer = setTimeout(() => setShowPermissionPrompt(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  // Monitor task completion state changes to trigger real-time motivational reactions
  useEffect(() => {
    if (prevCompletedCountRef.current !== null) {
      if (completedCount > prevCompletedCountRef.current) {
        // User just completed a task! Reset dismissed state to show excitement
        setIsDismissed(false);
        const tone: NotificationTone = completedCount >= 2 ? 'multi_completed' : 'task_completed';
        if (soundEnabled) {
          playMotivationalChime(tone);
        }
        // If native permission granted, send system notification
        if (permission === 'granted') {
          if (completedCount === 1) {
            sendNativeNotification('Yesss! You did it! 🥳', 'You completed your task! Keep the momentum going! 🔥', '🥳');
          } else {
            sendNativeNotification('Unstoppable Energy! 🤩', 'Multiple tasks crushed today! Streak champion!', '🤩');
          }
        }
      }
    }
    prevCompletedCountRef.current = completedCount;
  }, [completedCount, permission, soundEnabled]);

  // Handle requesting permission
  const handleRequestPermission = async () => {
    const res = await requestBrowserNotificationPermission();
    setPermission(res);
    setShowPermissionPrompt(false);
    if (res === 'granted') {
      sendNativeNotification('Notifications Active! 🔔', 'ZYRO will send you friendly reminders to keep your streak alive!', '😊');
      if (soundEnabled) playMotivationalChime('task_started');
    }
  };

  // Determine current active notification
  const activeNotification: MotivationalNotification = simulatedTone
    ? getMotivationalNotificationForActivity(quests, {
        isSimulatedMissed: simulatedTone === 'missed_app',
        isTaskInProgress: simulatedTone === 'task_started',
        randomSeed: Math.floor(Date.now() / 10000),
      })
    : getMotivationalNotificationForActivity(quests, {
        randomSeed: 0,
      });

  const nextIncomplete = incompleteQuests[0];

  // Visual theming based on emotion tone (NO danger, NO warning, NO red-alert symbols!)
  const getThemeStyles = (tone: NotificationTone) => {
    switch (tone) {
      case 'missed_app':
        return {
          container: 'bg-gradient-to-r from-[#1c1a24] via-[#1a1728] to-[#161421] border-indigo-500/30 shadow-[0_4px_25px_rgba(99,102,241,0.15)]',
          avatarBg: 'bg-indigo-500/20 border-indigo-400/30 text-indigo-300',
          badge: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
          badgeText: 'Gentle Check-in',
          buttonPrimary: 'bg-indigo-500 hover:bg-indigo-400 text-white shadow-[0_0_12px_rgba(99,102,241,0.3)]',
          glowColor: 'from-indigo-500/10 via-purple-500/5 to-transparent',
        };
      case 'no_tasks':
        return {
          container: 'bg-gradient-to-r from-[#131b17] via-[#111915] to-[#0d1411] border-emerald-500/30 shadow-[0_4px_25px_rgba(16,185,129,0.15)]',
          avatarBg: 'bg-emerald-500/20 border-emerald-400/30 text-emerald-300',
          badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
          badgeText: 'Daily Momentum',
          buttonPrimary: 'bg-emerald-500 hover:bg-emerald-400 text-black font-black shadow-[0_0_12px_rgba(16,185,129,0.3)]',
          glowColor: 'from-emerald-500/10 via-teal-500/5 to-transparent',
        };
      case 'task_started':
        return {
          container: 'bg-gradient-to-r from-[#1c1710] via-[#181510] to-[#12100d] border-amber-500/30 shadow-[0_4px_25px_rgba(245,158,11,0.15)]',
          avatarBg: 'bg-amber-500/20 border-amber-400/30 text-amber-300',
          badge: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
          badgeText: 'Great Momentum',
          buttonPrimary: 'bg-amber-500 hover:bg-amber-400 text-black font-black shadow-[0_0_12px_rgba(245,158,11,0.3)]',
          glowColor: 'from-amber-500/10 via-orange-500/5 to-transparent',
        };
      case 'task_completed':
      case 'multi_completed':
        return {
          container: 'bg-gradient-to-r from-[#181e14] via-[#141b12] to-[#0d140e] border-emerald-400/40 shadow-[0_4px_30px_rgba(52,211,153,0.2)]',
          avatarBg: 'bg-emerald-400/20 border-emerald-400/40 text-emerald-300',
          badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30',
          badgeText: tone === 'multi_completed' ? 'Crushing Goals! 🏆' : 'Task Victory! 🎉',
          buttonPrimary: 'bg-gradient-to-r from-emerald-400 to-teal-400 hover:brightness-110 text-black font-black shadow-[0_0_15px_rgba(52,211,153,0.4)]',
          glowColor: 'from-emerald-400/15 via-teal-500/5 to-transparent',
        };
    }
  };

  const currentTheme = getThemeStyles(activeNotification.tone);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 pt-3">
      {/* Optional Notification Permission Invite Banner */}
      <AnimatePresence>
        {showPermissionPrompt && permission === 'default' && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mb-2.5 overflow-hidden"
          >
            <div className="bg-gradient-to-r from-emerald-950/40 via-[#101914] to-black border border-emerald-500/30 rounded-2xl p-3 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                  <BellRing size={16} className="animate-bounce" />
                </div>
                <div>
                  <span className="font-bold text-white block">
                    Get friendly motivation from ZYRO! 🔔
                  </span>
                  <span className="text-gray-400 text-[11px]">
                    We’ll send gentle reminders if you ever miss a day or forget your daily quest.
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={handleRequestPermission}
                  className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs cursor-pointer transition-all shadow-sm"
                >
                  Enable Nudges
                </button>
                <button
                  type="button"
                  onClick={() => setShowPermissionPrompt(false)}
                  className="p-1 rounded-lg text-gray-400 hover:text-white cursor-pointer"
                  title="Maybe later"
                >
                  <X size={14} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Motivational Notification Toast/Card */}
      <AnimatePresence>
        {!isDismissed && (
          <motion.div
            initial={{ y: -15, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -15, opacity: 0 }}
            className={`relative overflow-hidden rounded-2xl border p-3.5 sm:p-4 transition-all duration-300 ${currentTheme.container}`}
          >
            {/* Soft ambient background glow */}
            <div className={`absolute -top-12 -left-12 w-48 h-48 bg-gradient-to-br ${currentTheme.glowColor} rounded-full blur-2xl pointer-events-none`} />

            <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-3.5">
              {/* Left Side: Animated Emoji Character & Message */}
              <div className="flex items-start sm:items-center gap-3.5">
                {/* Expressive Emoji Avatar */}
                <motion.div
                  animate={{
                    y: [0, -3, 0],
                    scale: activeNotification.tone === 'task_completed' || activeNotification.tone === 'multi_completed' ? [1, 1.12, 1] : 1,
                  }}
                  transition={{ repeat: Infinity, duration: 2.8, ease: 'easeInOut' }}
                  className={`w-11 h-11 rounded-2xl border flex items-center justify-center text-2xl shrink-0 shadow-inner select-none ${currentTheme.avatarBg}`}
                >
                  {activeNotification.emoji}
                </motion.div>

                <div>
                  {/* Category Pill & Progress Tracker */}
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${currentTheme.badge}`}>
                      {currentTheme.badgeText}
                    </span>

                    <span className="text-[11px] text-gray-400 font-medium">
                      {completedCount === 0
                        ? '0 / ' + totalCount + ' tasks done today'
                        : `${completedCount} of ${totalCount} daily tasks conquered`}
                    </span>

                    {permission === 'granted' && (
                      <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                        <Bell size={10} /> Active
                      </span>
                    )}
                  </div>

                  {/* Motivational Message */}
                  <h4 className="text-sm font-bold text-white tracking-tight leading-snug">
                    {activeNotification.title}
                  </h4>
                  <p className="text-xs text-gray-300 mt-0.5 max-w-2xl leading-relaxed">
                    {activeNotification.message}
                  </p>
                </div>
              </div>

              {/* Right Side: Motivational Actions */}
              <div className="flex items-center gap-2 self-end md:self-center shrink-0 flex-wrap">
                {/* Primary Action Button */}
                {incompleteQuests.length > 0 && nextIncomplete && (
                  <button
                    type="button"
                    onClick={() => {
                      onCompleteQuest(nextIncomplete.id);
                    }}
                    className={`px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer transition-all active:scale-95 ${currentTheme.buttonPrimary}`}
                  >
                    <CheckCircle2 size={15} />
                    <span>
                      {completedCount === 0 ? 'Complete 1st Task' : 'Complete Next Task'}
                    </span>
                  </button>
                )}

                {/* Ask ZYRO Motivational Coach */}
                <button
                  type="button"
                  onClick={() =>
                    onOpenZyroChat(
                      completedCount === 0
                        ? "I haven't started my daily fitness quests yet today. Give me an ultra-fast, fun 3-minute motivation drill to get going!"
                        : `I completed ${completedCount} task(s) today! Give me a quick power-up boost to keep ascending!`
                    )
                  }
                  className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="Ask ZYRO for an instant motivational boost"
                >
                  <Sparkles size={13} className="text-emerald-400" />
                  <span className="hidden sm:inline">Ask ZYRO</span>
                </button>

                {/* Sound toggle button */}
                <button
                  type="button"
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className={`p-2 rounded-xl border text-xs transition-colors cursor-pointer ${
                    soundEnabled
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                      : 'bg-black/30 border-white/10 text-gray-500'
                  }`}
                  title={soundEnabled ? 'Chime sound on' : 'Chime sound muted'}
                >
                  {soundEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
                </button>

                {/* Tester / Simulator Toggle */}
                <button
                  type="button"
                  onClick={() => setShowSimPanel(!showSimPanel)}
                  className="p-2 rounded-xl bg-black/40 hover:bg-white/10 text-gray-400 hover:text-white border border-white/5 transition-colors cursor-pointer"
                  title="Motivational Notification Simulator"
                >
                  <Settings2 size={14} />
                </button>

                {/* Friendly Dismiss / Snooze */}
                <button
                  type="button"
                  onClick={() => setIsDismissed(true)}
                  className="p-2 rounded-xl bg-black/40 hover:bg-white/10 text-gray-400 hover:text-white border border-white/5 transition-colors cursor-pointer"
                  title="I'll do it later"
                >
                  <X size={14} />
                </button>
              </div>
            </div>

            {/* In-App Interactive Notification Simulator (Allows evaluating all emotional stages) */}
            <AnimatePresence>
              {showSimPanel && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="mt-3 pt-3 border-t border-white/10 text-xs"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-1.5 text-gray-300 font-bold text-[11px]">
                      <Settings2 size={13} className="text-emerald-400" />
                      <span>Smart Notification Playground (Experience All Emotional States):</span>
                    </div>
                    {permission !== 'granted' && (
                      <button
                        type="button"
                        onClick={handleRequestPermission}
                        className="text-[11px] text-emerald-400 hover:underline flex items-center gap-1"
                      >
                        <Bell size={11} /> Enable Web Push
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        setSimulatedTone('missed_app');
                        if (soundEnabled) playMotivationalChime('missed_app');
                        if (permission === 'granted') {
                          sendNativeNotification('We missed you today! 😔', 'Come back and complete your first task.', '😔');
                        }
                      }}
                      className={`p-2 rounded-xl border text-left transition-all cursor-pointer ${
                        activeNotification.tone === 'missed_app'
                          ? 'bg-indigo-950/60 border-indigo-400 text-white shadow-sm'
                          : 'bg-black/40 border-white/10 text-gray-400 hover:text-white'
                      }`}
                    >
                      <span className="text-sm block mb-0.5">😔 🥺</span>
                      <span className="font-bold text-[11px] block">No App Open</span>
                      <span className="text-[9px] text-gray-400 block truncate">Slightly sad</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setSimulatedTone('no_tasks');
                        if (soundEnabled) playMotivationalChime('no_tasks');
                        if (permission === 'granted') {
                          sendNativeNotification('You’re already here! 🙂', 'Why not complete one quick task?', '🙂');
                        }
                      }}
                      className={`p-2 rounded-xl border text-left transition-all cursor-pointer ${
                        activeNotification.tone === 'no_tasks'
                          ? 'bg-emerald-950/60 border-emerald-400 text-white shadow-sm'
                          : 'bg-black/40 border-white/10 text-gray-400 hover:text-white'
                      }`}
                    >
                      <span className="text-sm block mb-0.5">🙂 🥺</span>
                      <span className="font-bold text-[11px] block">0 Tasks Done</span>
                      <span className="text-[9px] text-gray-400 block truncate">Gentle nudge</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setSimulatedTone('task_started');
                        if (soundEnabled) playMotivationalChime('task_started');
                        if (permission === 'granted') {
                          sendNativeNotification('Great start! 😊', 'You are in motion, keep going!', '😊');
                        }
                      }}
                      className={`p-2 rounded-xl border text-left transition-all cursor-pointer ${
                        activeNotification.tone === 'task_started'
                          ? 'bg-amber-950/60 border-amber-400 text-white shadow-sm'
                          : 'bg-black/40 border-white/10 text-gray-400 hover:text-white'
                      }`}
                    >
                      <span className="text-sm block mb-0.5">😊 💪</span>
                      <span className="font-bold text-[11px] block">Task Started</span>
                      <span className="text-[9px] text-gray-400 block truncate">Encouraging</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setSimulatedTone('task_completed');
                        if (soundEnabled) playMotivationalChime('task_completed');
                        if (permission === 'granted') {
                          sendNativeNotification('Yesss! 🥳', 'You completed your task! Keep momentum going! 🔥', '🥳');
                        }
                      }}
                      className={`p-2 rounded-xl border text-left transition-all cursor-pointer ${
                        activeNotification.tone === 'task_completed'
                          ? 'bg-emerald-950/60 border-emerald-400 text-white shadow-sm'
                          : 'bg-black/40 border-white/10 text-gray-400 hover:text-white'
                      }`}
                    >
                      <span className="text-sm block mb-0.5">🥳 🎉</span>
                      <span className="font-bold text-[11px] block">1 Task Done</span>
                      <span className="text-[9px] text-gray-400 block truncate">Happy / Excited</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setSimulatedTone('multi_completed');
                        if (soundEnabled) playMotivationalChime('multi_completed');
                        if (permission === 'granted') {
                          sendNativeNotification('Unstoppable! 🤩', 'Multiple tasks crushed today! 🏆🔥', '🤩');
                        }
                      }}
                      className={`p-2 rounded-xl border text-left transition-all cursor-pointer ${
                        activeNotification.tone === 'multi_completed'
                          ? 'bg-emerald-950/60 border-emerald-400 text-white shadow-sm'
                          : 'bg-black/40 border-white/10 text-gray-400 hover:text-white'
                      }`}
                    >
                      <span className="text-sm block mb-0.5">🤩 🏆</span>
                      <span className="font-bold text-[11px] block">Multi Tasks</span>
                      <span className="text-[9px] text-gray-400 block truncate">Celebratory</span>
                    </button>
                  </div>

                  <div className="mt-2 flex items-center justify-between text-[10px] text-gray-400">
                    <span>
                      {simulatedTone
                        ? `Viewing preview state: ${simulatedTone}`
                        : 'Real-time automatic state detection is active'}
                    </span>
                    {simulatedTone && (
                      <button
                        type="button"
                        onClick={() => setSimulatedTone(null)}
                        className="text-emerald-400 hover:underline font-bold"
                      >
                        Reset to Live Auto Detection
                      </button>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Re-open pill if dismissed */}
      {isDismissed && (
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => setIsDismissed(false)}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#161616] hover:bg-white/10 border border-white/10 text-gray-400 hover:text-white text-xs transition-colors cursor-pointer shadow-sm"
            title="View daily motivation reminder"
          >
            <span>{activeNotification.emoji}</span>
            <span className="text-[11px] font-bold">Daily Motivation</span>
          </button>
        </div>
      )}
    </div>
  );
};
