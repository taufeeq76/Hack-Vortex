import { DailyQuest, MotivationalNotification, NotificationTone } from '../types';

const STORAGE_KEYS = {
  LAST_VISIT_DATE: 'zyro_last_visit_date',
  FIRST_OPEN_TODAY: 'zyro_first_open_today',
  NOTIFICATION_PERMISSION: 'zyro_notification_permission',
  HAS_REQUESTED_PERMISSION: 'zyro_has_requested_permission',
  SIMULATED_MISSED_APP: 'zyro_simulated_missed_app',
};

export const getTodayDateKey = (): string => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

export interface AppActivityState {
  hasOpenedToday: boolean;
  completedTasksCount: number;
  totalTasksCount: number;
  hasStartedTask: boolean;
  permissionStatus: 'default' | 'granted' | 'denied' | 'unsupported';
  isSimulatedMissed: boolean;
}

/**
 * Checks and records user visit for today.
 */
export const checkAndRecordAppOpen = (): { isFirstOpenToday: boolean; missedPreviousDays: boolean } => {
  const today = getTodayDateKey();
  const lastVisit = localStorage.getItem(STORAGE_KEYS.LAST_VISIT_DATE);

  let isFirstOpenToday = false;
  let missedPreviousDays = false;

  if (!lastVisit) {
    // First time ever
    isFirstOpenToday = true;
    localStorage.setItem(STORAGE_KEYS.LAST_VISIT_DATE, today);
  } else if (lastVisit !== today) {
    isFirstOpenToday = true;
    // Calculate if they missed a day or more
    const lastDate = new Date(lastVisit);
    const currDate = new Date(today);
    const diffDays = Math.round((currDate.getTime() - lastDate.getTime()) / (1000 * 3600 * 24));
    if (diffDays >= 1) {
      missedPreviousDays = true;
    }
    localStorage.setItem(STORAGE_KEYS.LAST_VISIT_DATE, today);
  }

  return { isFirstOpenToday, missedPreviousDays };
};

/**
 * Returns current browser notification permission status safely.
 */
export const getBrowserNotificationPermission = (): 'default' | 'granted' | 'denied' | 'unsupported' => {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'unsupported';
  }
  return Notification.permission as 'default' | 'granted' | 'denied';
};

/**
 * Requests browser notification permission.
 */
export const requestBrowserNotificationPermission = async (): Promise<'granted' | 'denied' | 'unsupported'> => {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'unsupported';
  }

  try {
    const permission = await Notification.requestPermission();
    localStorage.setItem(STORAGE_KEYS.NOTIFICATION_PERMISSION, permission);
    localStorage.setItem(STORAGE_KEYS.HAS_REQUESTED_PERMISSION, 'true');
    return permission as 'granted' | 'denied';
  } catch (err) {
    console.warn('Could not request notification permission:', err);
    return 'denied';
  }
};

/**
 * Sends a native browser notification if granted.
 */
export const sendNativeNotification = (title: string, body: string, iconEmoji: string = '😊'): boolean => {
  if (getBrowserNotificationPermission() !== 'granted') {
    return false;
  }

  try {
    // Create a mini data URL for the emoji icon or fallback
    new Notification(`${iconEmoji} ${title}`, {
      body,
      badge: 'favicon.ico',
      silent: false,
    });
    return true;
  } catch (err) {
    console.warn('Failed to send native notification:', err);
    return false;
  }
};

/**
 * Playful, emotional Duolingo-style notification library.
 * Changes based on exact user activity.
 */
export const MOTIVATIONAL_PRESETS = {
  missed_app: [
    {
      emoji: '😔',
      title: 'We missed you today!',
      message: 'Come back and complete your first task! Your athletic streak misses you.',
      actionLabel: 'Return & Start',
    },
    {
      emoji: '🥺',
      title: 'Hey… are you there?',
      message: 'Your tasks are waiting for you! Just one quick task to get back on track.',
      actionLabel: 'Check My Quests',
    },
    {
      emoji: '😢',
      title: 'ZYRO was waiting for you…',
      message: 'A 3-minute stretch or hydration goal is all it takes to keep your momentum alive!',
      actionLabel: 'Do a Quick Task',
    },
  ],
  no_tasks: [
    {
      emoji: '🙂',
      title: 'You’re already here!',
      message: 'Why not complete one quick task? It only takes a couple of minutes to get that green checkmark!',
      actionLabel: 'Pick First Task',
    },
    {
      emoji: '🥺',
      title: 'Hey… your tasks are waiting for you!',
      message: 'Just one task to get started and keep your daily streak glowing.',
      actionLabel: 'Get Started',
    },
    {
      emoji: '🌱',
      title: 'Every champion starts with one rep!',
      message: 'Log a meal, do 10 pushups, or drink some water to kick off today’s progress.',
      actionLabel: 'Start Now',
    },
  ],
  task_started: [
    {
      emoji: '😊',
      title: 'Great start!',
      message: 'You’re already in motion! Keep going and complete another task to earn bonus XP.',
      actionLabel: 'Keep Going',
    },
    {
      emoji: '💪',
      title: 'The momentum is building!',
      message: 'You took the first step! Finish strong and secure your daily warrior streak.',
      actionLabel: 'Finish Strong',
    },
  ],
  task_completed: [
    {
      emoji: '🥳',
      title: 'Yesss! You did it!',
      message: 'You completed your task! Keep the momentum going and conquer the day! 🔥',
      actionLabel: 'Next Quest',
    },
    {
      emoji: '🎉',
      title: 'That felt great, didn’t it?',
      message: 'First quest locked in! You’re building an unstoppable habit today.',
      actionLabel: 'View Progress',
    },
  ],
  multi_completed: [
    {
      emoji: '🤩',
      title: 'Unstoppable Energy!',
      message: 'Multiple tasks crushed today! Your discipline is paying off in massive XP! 🏆🔥',
      actionLabel: 'Celebrate',
    },
    {
      emoji: '🔥',
      title: 'Streak Master in action!',
      message: 'All daily milestones are locked down! You are officially an elite athlete today!',
      actionLabel: 'Review Rewards',
    },
  ],
};

/**
 * Evaluates the user's activity and picks the most suitable emotional motivational notification.
 */
export const getMotivationalNotificationForActivity = (
  quests: DailyQuest[],
  options?: {
    isSimulatedMissed?: boolean;
    isTaskInProgress?: boolean;
    randomSeed?: number;
  }
): MotivationalNotification => {
  const completedCount = quests.filter((q) => q.completed).length;
  const totalCount = quests.length;
  const seed = options?.randomSeed ?? 0;

  let tone: NotificationTone = 'no_tasks';

  if (options?.isSimulatedMissed) {
    tone = 'missed_app';
  } else if (completedCount === 0) {
    if (options?.isTaskInProgress) {
      tone = 'task_started';
    } else {
      tone = 'no_tasks';
    }
  } else if (completedCount === 1) {
    tone = 'task_completed';
  } else {
    tone = 'multi_completed';
  }

  const list = MOTIVATIONAL_PRESETS[tone];
  const selected = list[seed % list.length];

  return {
    id: `notif-${tone}-${Date.now()}`,
    emoji: selected.emoji,
    title: selected.title,
    message: selected.message,
    tone,
    timestamp: 'Just now',
    actionLabel: selected.actionLabel,
  };
};

/**
 * Plays a pleasant Web Audio synthesizer chime for notifications.
 */
export const playMotivationalChime = (tone: NotificationTone) => {
  if (typeof window === 'undefined') return;

  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();
    const now = ctx.currentTime;

    if (tone === 'multi_completed' || tone === 'task_completed') {
      // Upbeat celebratory arpeggio: C5 -> E5 -> G5 -> C6
      const freqs = [523.25, 659.25, 783.99, 1046.5];
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);

        gain.gain.setValueAtTime(0.001, now + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.15, now + idx * 0.08 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.25);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.28);
      });
    } else {
      // Gentle soft two-tone reminder chime: F4 -> A4
      const freqs = [349.23, 440.0];
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.12);

        gain.gain.setValueAtTime(0.001, now + idx * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.08, now + idx * 0.12 + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.12 + 0.35);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.12);
        osc.stop(now + idx * 0.12 + 0.38);
      });
    }
  } catch (e) {
    // Audio may be blocked by autoplay policies until user gesture
  }
};
