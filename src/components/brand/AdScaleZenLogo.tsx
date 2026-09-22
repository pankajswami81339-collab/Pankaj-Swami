import React from 'react';

export interface AdScaleZenLogoProps {
  variant?: 'full' | 'compact' | 'icon' | 'monogram' | 'wordmark';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  theme?: 'dark' | 'light' | 'auto';
  showDomain?: boolean;
  domainText?: string;
  showTagline?: boolean;
  taglineText?: string;
  imageSrc?: string;
  className?: string;
  id?: string;
}

export const AdScaleZenLogo: React.FC<AdScaleZenLogoProps> = ({
  variant = 'compact',
  size = 'md',
  theme = 'auto',
  showDomain = false,
  domainText = 'app.adscalezen.online',
  showTagline = false,
  taglineText = 'WhatsApp & Business Automation Platform',
  imageSrc,
  className = '',
  id = 'adscale-zen-logo',
}) => {
  const [imageError, setImageError] = React.useState(false);

  // Dimension mapping for icon mark
  const sizeMap = {
    xs: { px: 26, text: 'text-sm', badge: 'text-[9px]', iconSize: 26 },
    sm: { px: 32, text: 'text-base', badge: 'text-[9px]', iconSize: 32 },
    md: { px: 40, text: 'text-lg sm:text-xl', badge: 'text-[10px]', iconSize: 40 },
    lg: { px: 48, text: 'text-xl sm:text-2xl', badge: 'text-xs', iconSize: 48 },
    xl: { px: 64, text: 'text-3xl sm:text-4xl', badge: 'text-xs', iconSize: 64 },
  };

  const { px, text, badge } = sizeMap[size];

  // Theme text styling
  const isDark = theme === 'dark';
  const textColor = isDark ? 'text-white' : theme === 'light' ? 'text-slate-900' : 'text-slate-900 dark:text-white';
  const subtextColor = isDark ? 'text-slate-400' : theme === 'light' ? 'text-slate-500' : 'text-slate-500 dark:text-slate-400';

  // SVG Geometric Icon Mark (with fallback/image handling)
  const renderIconMark = () => {
    // If an imageSrc is passed or available and hasn't errored, render it
    if (imageSrc && !imageError) {
      return (
        <img
          src={imageSrc}
          alt="ADSCALE ZEN Logo"
          className="object-contain rounded-xl"
          style={{ width: px, height: px }}
          onError={() => setImageError(true)}
          referrerPolicy="no-referrer"
        />
      );
    }

    return (
      <div
        className="relative shrink-0 flex items-center justify-center transition-transform hover:scale-105 duration-200"
        style={{ width: px, height: px }}
      >
        <svg
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-md"
        >
          <defs>
            {/* Deep Tech Canvas Backing */}
            <linearGradient id={`bgGrad-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0B132B" />
              <stop offset="60%" stopColor="#090E1A" />
              <stop offset="100%" stopColor="#030712" />
            </linearGradient>

            {/* Scale Blade: Cyber Teal to Electric Cyan */}
            <linearGradient id={`scaleBeam-${id}`} x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#0284C7" />
              <stop offset="50%" stopColor="#0EA5E9" />
              <stop offset="100%" stopColor="#38BDF8" />
            </linearGradient>

            {/* Zen Blade: Radiant Jade to Emerald */}
            <linearGradient id={`zenBeam-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#34D399" />
              <stop offset="60%" stopColor="#10B981" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>

            {/* Traverse Automation Synapse */}
            <linearGradient id={`synapseGrad-${id}`} x1="0%" y1="50%" x2="100%" y2="50%">
              <stop offset="0%" stopColor="#06B6D4" />
              <stop offset="100%" stopColor="#10B981" />
            </linearGradient>

            {/* Ambient Glow */}
            <filter id={`ambientGlow-${id}`} x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Outer Geometric Beveled Shield */}
          <rect
            x="1"
            y="1"
            width="62"
            height="62"
            rx="16"
            fill={`url(#bgGrad-${id})`}
          />
          <rect
            x="1.5"
            y="1.5"
            width="61"
            height="61"
            rx="15.5"
            stroke="#10B981"
            strokeWidth="1.2"
            strokeOpacity="0.3"
            fill="none"
          />

          {/* ASCENT BEAM: The 'A' Vector (Scale / Growth) */}
          <path
            d="M17 46L29 15H37L25 46H17Z"
            fill={`url(#scaleBeam-${id})`}
          />

          {/* ZEN TOP WING: The 'Z' Horizon (Equilibrium) */}
          <path
            d="M26 15H48V21H32L26 15Z"
            fill={`url(#zenBeam-${id})`}
          />

          {/* ZEN FOUNDATION WING: (Grounding & Stability) */}
          <path
            d="M16 40H38V46H16V40Z"
            fill={`url(#zenBeam-${id})`}
          />

          {/* HARMONIC TRAVERSE SYNAPSE (Connecting Scale with Zen) */}
          <path
            d="M44 21L27 42H35L48 26V21H44Z"
            fill={`url(#synapseGrad-${id})`}
            filter={`url(#ambientGlow-${id})`}
          />

          {/* AI AUTOMATION PULSE CORE: Central Node */}
          <circle cx="32" cy="30" r="3.2" fill="#FFFFFF" />
          <circle
            cx="32"
            cy="30"
            r="6"
            stroke="#34D399"
            strokeWidth="1.4"
            strokeOpacity="0.8"
            strokeDasharray="3 2"
            className="animate-spin"
            style={{ transformOrigin: '32px 30px', animationDuration: '8s' }}
          />
        </svg>
      </div>
    );
  };

  if (variant === 'icon' || variant === 'monogram') {
    return (
      <div id={id} className={`inline-flex items-center ${className}`}>
        {renderIconMark()}
      </div>
    );
  }

  // Wordmark typography
  const renderWordmark = () => (
    <div className="flex flex-col min-w-0">
      <div className="flex items-center gap-2 flex-wrap">
        <div className="flex items-baseline">
          <span className={`font-black tracking-tight ${textColor} ${text} font-sans`}>
            ADSCALE
          </span>
          <span className={`ml-1.5 font-black tracking-wider ${text} bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent font-sans`}>
            ZEN
          </span>
          {/* Active automation beacon */}
          <span className="ml-1 inline-block h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
        </div>

        {showDomain && (
          <span className={`inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 font-mono font-bold ${badge} ${
            isDark
              ? 'bg-slate-800/80 text-emerald-400 border border-emerald-500/30'
              : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
          }`}>
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            {domainText}
          </span>
        )}
      </div>

      {showTagline && (
        <p className={`mt-0.5 text-[11px] font-medium tracking-tight ${subtextColor} truncate max-w-xs`}>
          {taglineText}
        </p>
      )}
    </div>
  );

  if (variant === 'wordmark') {
    return (
      <div id={id} className={`inline-flex items-center ${className}`}>
        {renderWordmark()}
      </div>
    );
  }

  // Full & Compact Variants
  return (
    <div id={id} className={`inline-flex items-center gap-3 select-none ${className}`}>
      {renderIconMark()}
      {renderWordmark()}
    </div>
  );
};
