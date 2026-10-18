import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MascotMoodState } from '../types';

interface MascotProps {
  state?: MascotMoodState;
  customMessage?: string;
  size?: 'sm' | 'md' | 'lg';
  showBubble?: boolean;
  interactive?: boolean;
  onTap?: () => void;
  className?: string;
}

const DEFAULT_MESSAGES: Record<MascotMoodState, string[]> = {
  happy: [
    "Let's go! You crushed it! 🔥",
    "Pushed your limits today! Legendary work!",
    "That workout was pure fire! Keep ascending! ⚡",
    "Level unlocked! Look at that form! 🎉",
  ],
  motivating: [
    "Ready to move today? 💪",
    "15 minutes today keeps the energy unstoppable!",
    "Your future self is thanking you right now! Let's get it!",
    "Time to ignite that workout streak! 🚀",
  ],
  tired: [
    "Low energy today? Let's keep it light with a gentle stretch. 🌙",
    "Rest and active recovery are part of the journey. Take it easy!",
    "Even 5 minutes of mobility counts. Breathe deep.",
    "Listen to your body today — let's recharge! 🍃",
  ],
  encouraging: [
    "That's okay. Every day is a new opportunity! 🌱",
    "Consistency isn't about perfection, it's about showing up again tomorrow.",
    "Streak frozen safely! Ready for your comeback? ✨",
    "Growth isn't linear. You've got this! 💚",
  ],
  competitive: [
    "Your squad needs you! Time to move! 🔥",
    "Engineering squad is only 400 XP ahead! Let's pass them!",
    "Campus leaderboard is heating up! Claim your spot! 🏆",
    "Solo Leveling Hunter Rank ascending! S-Rank is in sight!",
  ],
};

export const Mascot: React.FC<MascotProps> = ({
  state = 'motivating',
  customMessage,
  size = 'md',
  showBubble = true,
  interactive = true,
  onTap,
  className = '',
}) => {
  const [clickCount, setClickCount] = useState(0);
  const [bubbleVisible, setBubbleVisible] = useState(showBubble);

  const messages = DEFAULT_MESSAGES[state];
  const activeMessage = customMessage || messages[clickCount % messages.length];

  const handleMascotClick = () => {
    setClickCount((prev) => prev + 1);
    setBubbleVisible(true);
    if (onTap) onTap();
  };

  const dimensions = {
    sm: { sprite: 46, bubbleText: 'text-xs', maxWidth: 'max-w-[180px]' },
    md: { sprite: 68, bubbleText: 'text-xs sm:text-sm', maxWidth: 'max-w-[240px]' },
    lg: { sprite: 96, bubbleText: 'text-sm', maxWidth: 'max-w-[280px]' },
  }[size];

  // Color schemes based on mood state
  const stateAura = {
    happy: 'from-emerald-400 via-emerald-500 to-teal-400 shadow-[0_0_25px_rgba(16,185,129,0.5)]',
    motivating: 'from-emerald-500 via-green-500 to-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.4)]',
    tired: 'from-teal-600 via-cyan-700 to-emerald-800 shadow-[0_0_15px_rgba(20,184,166,0.3)]',
    encouraging: 'from-green-500 via-emerald-600 to-lime-500 shadow-[0_0_20px_rgba(34,197,94,0.4)]',
    competitive: 'from-emerald-400 via-amber-400 to-emerald-500 shadow-[0_0_30px_rgba(245,158,11,0.5)]',
  }[state];

  return (
    <div className={`relative inline-flex items-center gap-3 ${className}`}>
      {/* Speech Bubble */}
      <AnimatePresence>
        {bubbleVisible && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className={`relative bg-[#131720]/95 backdrop-blur-md border border-emerald-500/30 text-slate-200 px-3.5 py-2.5 rounded-2xl ${dimensions.maxWidth} shadow-xl text-left z-10`}
          >
            {/* Bubble Tail */}
            <div className="absolute right-[-6px] top-1/2 -translate-y-1/2 w-3 h-3 bg-[#131720] border-t border-r border-emerald-500/30 rotate-45" />

            <div className="flex items-center gap-1.5 mb-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-[10px] font-bold tracking-wider uppercase text-emerald-400">
                ZYRO AI
              </span>
            </div>
            <p className={`${dimensions.bubbleText} font-medium leading-snug`}>
              {activeMessage}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Vyo Sprite */}
      <motion.div
        whileHover={interactive ? { scale: 1.08, rotate: [0, -3, 3, 0] } : {}}
        whileTap={interactive ? { scale: 0.92 } : {}}
        onClick={handleMascotClick}
        className={`relative cursor-pointer select-none`}
        style={{ width: dimensions.sprite, height: dimensions.sprite }}
      >
        {/* Glowing aura */}
        <motion.div
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.6, 0.9, 0.6],
          }}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
          className={`absolute inset-0 rounded-full bg-gradient-to-tr ${stateAura} blur-sm opacity-70`}
        />

        {/* SVG Character Vyo */}
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full relative z-10 drop-shadow-md"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="zyroBodyGrad" x1="20%" y1="0%" x2="80%" y2="100%">
              <stop offset="0%" stopColor="#34d399" />
              <stop offset="60%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#047857" />
            </linearGradient>
            <linearGradient id="zyroHeadband" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#090a0d" />
              <stop offset="50%" stopColor="#1e293b" />
              <stop offset="100%" stopColor="#090a0d" />
            </linearGradient>
          </defs>

          {/* Jetpack / Rocket fin with motion dots on back */}
          <g transform="translate(18, 22) rotate(-20)">
            <path
              d="M 0 0 C 8 2, 10 16, 4 24 C 0 20, -4 10, 0 0 Z"
              fill="#064e3b"
              stroke="#34d399"
              strokeWidth="1.5"
            />
            {/* Thruster fire */}
            {state !== 'tired' && (
              <motion.circle
                animate={{ r: [3, 5, 3], opacity: [0.8, 1, 0.8] }}
                transition={{ repeat: Infinity, duration: 0.6 }}
                cx="2"
                cy="26"
                r="3"
                fill="#34d399"
              />
            )}
          </g>

          {/* Body: Rounded organic kinetic bean/droplet */}
          <motion.path
            animate={
              state === 'happy'
                ? { y: [0, -6, 0] }
                : state === 'tired'
                ? { y: [0, 2, 0] }
                : { y: [0, -3, 0] }
            }
            transition={{ repeat: Infinity, duration: state === 'happy' ? 0.8 : 2, ease: 'easeInOut' }}
            d="M 50 18 C 72 18, 78 38, 76 60 C 74 76, 64 84, 50 84 C 36 84, 26 76, 24 60 C 22 38, 28 18, 50 18 Z"
            fill="url(#zyroBodyGrad)"
            stroke="#6ee7b7"
            strokeWidth="2"
          />

          {/* Athletic Headband across brow */}
          <path
            d="M 30 35 Q 50 31 70 35 L 71 41 Q 50 37 29 41 Z"
            fill="url(#zyroHeadband)"
            stroke="#10b981"
            strokeWidth="1"
          />
          {/* Headband emblem (mini logo runner silhouette) */}
          <circle cx="50" cy="36" r="2.8" fill="#34d399" />

          {/* Eyes according to state */}
          {state === 'happy' ? (
            // Curved closed joyful happy eyes (^ ^)
            <g stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round">
              <path d="M 40 48 Q 45 43 49 48" />
              <path d="M 55 48 Q 60 43 65 48" />
            </g>
          ) : state === 'tired' ? (
            // Droopy tired eyes (- -)
            <g stroke="#ffffff" strokeWidth="2" strokeLinecap="round">
              <path d="M 40 49 L 48 50" />
              <path d="M 56 50 L 64 49" />
              {/* Sweat drop */}
              <path
                d="M 69 44 C 71 44, 72 47, 70 48 C 68 48, 68 46, 69 44 Z"
                fill="#38bdf8"
              />
            </g>
          ) : state === 'competitive' ? (
            // Fierce focused eyes with fiery shine
            <g fill="#ffffff">
              <polygon points="40,46 48,44 46,51 39,49" />
              <polygon points="56,44 64,46 65,49 58,51" />
              <circle cx="45" cy="47" r="1.5" fill="#f59e0b" />
              <circle cx="59" cy="47" r="1.5" fill="#f59e0b" />
            </g>
          ) : (
            // Motivating / encouraging: big bright expressive eyes with highlight
            <g>
              <ellipse cx="43" cy="48" rx="4" ry="5.5" fill="#0f172a" />
              <ellipse cx="61" cy="48" rx="4" ry="5.5" fill="#0f172a" />
              {/* White specular shine */}
              <circle cx="41.5" cy="46" r="2" fill="#ffffff" />
              <circle cx="59.5" cy="46" r="2" fill="#ffffff" />
              <circle cx="44.5" cy="50" r="1" fill="#6ee7b7" />
              <circle cx="62.5" cy="50" r="1" fill="#6ee7b7" />
            </g>
          )}

          {/* Cheeks blush */}
          <ellipse cx="36" cy="54" rx="3" ry="1.8" fill="#f43f5e" opacity="0.45" />
          <ellipse cx="68" cy="54" rx="3" ry="1.8" fill="#f43f5e" opacity="0.45" />

          {/* Mouth */}
          {state === 'happy' || state === 'competitive' ? (
            // Open joyful/excited mouth
            <path
              d="M 46 56 Q 52 64 58 56 Z"
              fill="#064e3b"
              stroke="#ffffff"
              strokeWidth="1.2"
            />
          ) : state === 'tired' ? (
            // Small wavy tired mouth
            <path
              d="M 47 57 Q 52 55 57 58"
              stroke="#064e3b"
              strokeWidth="2"
              strokeLinecap="round"
            />
          ) : (
            // Confident friendly smile
            <path
              d="M 46 56 Q 52 62 58 56"
              stroke="#ffffff"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
          )}

          {/* Athletic energetic arms/hands */}
          {state === 'happy' ? (
            // Both hands high in victory
            <g stroke="#34d399" strokeWidth="4" strokeLinecap="round">
              <path d="M 28 54 Q 18 42 16 34" />
              <circle cx="16" cy="33" r="3.5" fill="#34d399" />
              <path d="M 72 54 Q 82 42 84 34" />
              <circle cx="84" cy="33" r="3.5" fill="#34d399" />
            </g>
          ) : state === 'competitive' ? (
            // Flexing bicep pose
            <g stroke="#34d399" strokeWidth="4.5" strokeLinecap="round">
              <path d="M 72 56 L 82 50 L 78 40" />
              <circle cx="78" cy="40" r="3.5" fill="#34d399" />
              <path d="M 28 58 L 22 66" />
            </g>
          ) : (
            // Friendly thumbs-up gesture
            <g stroke="#34d399" strokeWidth="4" strokeLinecap="round">
              <path d="M 72 56 Q 80 54 82 48" />
              <circle cx="82" cy="46" r="3" fill="#34d399" />
              <path d="M 28 58 Q 22 64 20 70" />
            </g>
          )}

          {/* Running sneakers */}
          <g>
            {/* Left Shoe */}
            <path
              d="M 37 81 L 43 81 C 45 81, 46 86, 44 88 L 33 88 C 32 85, 34 81, 37 81 Z"
              fill="#ffffff"
              stroke="#0f172a"
              strokeWidth="1.2"
            />
            {/* Right Shoe */}
            <path
              d="M 58 81 L 64 81 C 67 81, 69 85, 68 88 L 56 88 C 55 85, 56 81, 58 81 Z"
              fill="#ffffff"
              stroke="#0f172a"
              strokeWidth="1.2"
            />
            <path d="M 35 85 L 43 85" stroke="#10b981" strokeWidth="1.5" />
            <path d="M 58 85 L 66 85" stroke="#10b981" strokeWidth="1.5" />
          </g>
        </svg>

        {/* Floating pulse spark */}
        <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500"></span>
        </span>
      </motion.div>
    </div>
  );
};
