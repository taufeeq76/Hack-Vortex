import React from 'react';

interface LogoProps {
  variant?: 'gradient' | 'monochrome-white' | 'monochrome-dark';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({
  variant = 'gradient',
  size = 'md',
  showTagline = false,
  className = '',
}) => {
  const sizeClasses = {
    sm: { text: 'text-xl', emblem: 24, gap: 'gap-1' },
    md: { text: 'text-2xl', emblem: 30, gap: 'gap-1.5' },
    lg: { text: 'text-4xl', emblem: 44, gap: 'gap-2' },
    xl: { text: 'text-5xl sm:text-6xl', emblem: 60, gap: 'gap-3' },
  }[size];

  const isMonochromeWhite = variant === 'monochrome-white';
  const isMonochromeDark = variant === 'monochrome-dark';

  return (
    <div className={`inline-flex flex-col items-center select-none ${className}`}>
      <div className={`inline-flex items-center ${sizeClasses.gap} font-brand font-black tracking-tighter`}>
        {/* V Y L */}
        <span
          className={`${sizeClasses.text} font-black tracking-tighter ${
            isMonochromeWhite
              ? 'text-white'
              : isMonochromeDark
              ? 'text-slate-900'
              : 'bg-gradient-to-r from-white via-emerald-400 to-emerald-600 bg-clip-text text-transparent drop-shadow-[0_0_12px_rgba(16,185,129,0.45)]'
          }`}
        >
          VYL
        </span>

        {/* Circular Emblem replacing O */}
        <div
          className="relative inline-flex items-center justify-center transition-transform hover:scale-105 duration-300"
          style={{
            width: sizeClasses.emblem,
            height: sizeClasses.emblem,
          }}
        >
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full overflow-visible"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="emblemOrbitGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={isMonochromeWhite ? '#ffffff' : isMonochromeDark ? '#0f172a' : '#059669'} />
                <stop offset="70%" stopColor={isMonochromeWhite ? '#ffffff' : isMonochromeDark ? '#0f172a' : '#10b981'} />
                <stop offset="100%" stopColor={isMonochromeWhite ? '#ffffff' : isMonochromeDark ? '#0f172a' : '#34d399'} />
              </linearGradient>
              <filter id="emblemGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Glowing background halo */}
            {!isMonochromeWhite && !isMonochromeDark && (
              <circle
                cx="50"
                cy="50"
                r="38"
                className="fill-emerald-500/10 filter blur-sm"
              />
            )}

            {/* Orbit Ring with break for rocket launch at top right */}
            <path
              d="M 72 26 A 36 36 0 1 0 78 40"
              stroke="url(#emblemOrbitGrad)"
              strokeWidth="9"
              strokeLinecap="round"
              filter={!isMonochromeWhite && !isMonochromeDark ? "url(#emblemGlow)" : undefined}
            />

            {/* Motion trail dot breaking out */}
            <circle
              cx="82"
              cy="31"
              r="3.5"
              fill={isMonochromeWhite ? '#ffffff' : isMonochromeDark ? '#0f172a' : '#34d399'}
            />
            <circle
              cx="88"
              cy="23"
              r="2.5"
              fill={isMonochromeWhite ? '#ffffff' : isMonochromeDark ? '#0f172a' : '#6ee7b7'}
            />

            {/* Mini Ascending Rocket breaking out top-right */}
            <g transform="translate(86, 12) rotate(45)">
              {/* Rocket body */}
              <path
                d="M 0 -8 C 3.5 -5, 3.5 4, 0 8 C -3.5 4, -3.5 -5, 0 -8 Z"
                fill={isMonochromeWhite ? '#ffffff' : isMonochromeDark ? '#0f172a' : '#10b981'}
              />
              {/* Wings */}
              <path
                d="M -3 3 L -6 7 L -2 7 Z"
                fill={isMonochromeWhite ? '#e2e8f0' : isMonochromeDark ? '#334155' : '#34d399'}
              />
              <path
                d="M 3 3 L 6 7 L 2 7 Z"
                fill={isMonochromeWhite ? '#e2e8f0' : isMonochromeDark ? '#334155' : '#34d399'}
              />
              {/* Thruster exhaust dot */}
              <circle
                cx="0"
                cy="10"
                r="2"
                fill={isMonochromeWhite ? '#ffffff' : '#f59e0b'}
              />
            </g>

            {/* White Silhouette of Runner inside the orbit */}
            <g
              transform="translate(24, 23) scale(0.53)"
              fill={isMonochromeWhite ? '#ffffff' : isMonochromeDark ? '#0f172a' : '#ffffff'}
            >
              {/* Head */}
              <circle cx="58" cy="22" r="9" />
              {/* Torso leaning forward */}
              <path
                d="M 52 33 L 42 62 L 49 64 L 59 36 Z"
                rx="3"
              />
              {/* Front Arm swinging forward */}
              <path
                d="M 54 36 L 68 45 L 77 41"
                stroke={isMonochromeWhite ? '#ffffff' : isMonochromeDark ? '#0f172a' : '#ffffff'}
                strokeWidth="6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Back Arm swinging backwards */}
              <path
                d="M 52 38 L 38 48 L 29 46"
                stroke={isMonochromeWhite ? '#ffffff' : isMonochromeDark ? '#0f172a' : '#ffffff'}
                strokeWidth="5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Front Leg in forward stride */}
              <path
                d="M 44 60 L 60 72 L 74 72"
                stroke={isMonochromeWhite ? '#ffffff' : isMonochromeDark ? '#0f172a' : '#ffffff'}
                strokeWidth="6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Back Leg kicking back */}
              <path
                d="M 43 60 L 26 71 L 18 84"
                stroke={isMonochromeWhite ? '#ffffff' : isMonochromeDark ? '#0f172a' : '#ffffff'}
                strokeWidth="6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>
          </svg>
        </div>
      </div>

      {showTagline && (
        <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.28em] text-emerald-400/90 mt-1">
          Thrive. Ascend. Evolve.
        </span>
      )}
    </div>
  );
};
