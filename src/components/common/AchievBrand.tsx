import React from 'react';

export interface AchievBrandProps {
  variant?: 'lockup' | 'compact' | 'inline' | 'emblem';
  isDarkMode?: boolean;
  showTagline?: boolean;
  className?: string;
  imgClassName?: string;
  emblemClassName?: string;
  title?: string;
}

const resolveAssetUrl = (relativePath: string): string => {
  const base = (import.meta as any).env?.BASE_URL || '/';
  const normalizedBase = base === './' ? './' : base.endsWith('/') ? base : `${base}/`;
  return `${normalizedBase}${relativePath.replace(/^\/+/, '')}`;
};

export const ACHIEV_LOGO_URL = resolveAssetUrl('android-chrome-192x192.png?v=2');
export const ACHIEV_EMBLEM_URL = resolveAssetUrl('android-chrome-192x192.png?v=2');
export const ACHIEV_WORDMARK_URL = resolveAssetUrl('android-chrome-512x512.png?v=2');
export const ACHIEV_LOCKUP_URL = resolveAssetUrl('android-chrome-512x512.png?v=2');
export const ACHIEV_LEATHER_HERO_URL = '';
export const ACHIEV_LEATHER_LOGIN_URL = '';

const GoldCrestEmblem: React.FC<{
  sizeClass: string;
  color?: string;
  metallicGradient?: boolean;
  ariaLabel?: string;
}> = ({ sizeClass, color = '#E5B84B', metallicGradient = false, ariaLabel = 'Achiev' }) => {
  const gradId = React.useId().replace(/:/g, '');
  const fillVal = metallicGradient ? `url(#${gradId})` : color;

  return (
    <svg
      viewBox="0 0 512 512"
      fill="none"
      role="img"
      aria-label={ariaLabel}
      className={`select-none shrink-0 bg-transparent ${sizeClass}`}
    >
      {metallicGradient && (
        <defs>
          <linearGradient id={gradId} x1="15%" y1="5%" x2="85%" y2="95%">
            <stop offset="0%" stopColor="#fff2c6" />
            <stop offset="35%" stopColor="#e5b75a" />
            <stop offset="68%" stopColor="#f5d481" />
            <stop offset="100%" stopColor="#a86d1c" />
          </linearGradient>
        </defs>
      )}
      <path
        fill={fillVal}
        d="M256 26 C268 26 276 37 276 50 C276 60 269 68 266 77 C281 108 308 117 328 106 C348 95 368 72 384 54 C390 48 395 52 391 61 C376 94 358 126 346 152 L166 152 C154 126 136 94 121 61 C117 52 122 48 128 54 C144 72 164 95 184 106 C204 117 231 108 246 77 C243 68 236 60 236 50 C236 37 244 26 256 26 Z"
      />
      <path
        fill={fillVal}
        fillRule="evenodd"
        d="M166 170 L346 170 C334 214 345 256 374 298 L260 484 C258 488 254 488 252 484 L138 298 C167 256 178 214 166 170 Z M256 268 C240 268 228 281 228 297 C228 310 237 321 249 324 L250 452 C250 456 253 459 256 459 C259 459 262 456 262 452 L263 324 C275 321 284 310 284 297 C284 281 272 268 256 268 Z"
      />
    </svg>
  );
};

export const AchievBrand: React.FC<AchievBrandProps> = ({
  variant = 'compact',
  isDarkMode,
  showTagline = true,
  className = '',
  imgClassName = '',
  emblemClassName = '',
  title = 'Achiev — Settle Ideas',
}) => {
  const emblemGoldColor = isDarkMode === false ? '#B6822A' : '#E5B84B';

  if (variant === 'emblem') {
    return (
      <GoldCrestEmblem
        sizeClass={imgClassName || 'w-7 h-7'}
        color={emblemGoldColor}
        ariaLabel="Achiev emblem"
      />
    );
  }

  if (variant === 'lockup') {
    return (
      <div
        className={`inline-flex items-center justify-center gap-3.5 sm:gap-4 bg-transparent select-none max-w-full ${className}`}
        title={title}
      >
        <GoldCrestEmblem
          sizeClass={emblemClassName || 'w-14 h-14 sm:w-[68px] sm:h-[68px]'}
          metallicGradient
          ariaLabel="Ach1ev emblem"
        />
        <div className="flex flex-col items-start text-left leading-none">
          <span
            className="font-serif font-extrabold tracking-[0.14em] uppercase bg-clip-text text-transparent"
            style={{
              fontSize: 'clamp(1.65rem, 3.2vw, 2.35rem)',
              backgroundImage: 'linear-gradient(135deg, #fff2c6 0%, #e5b75a 45%, #fff0bb 72%, #b57b24 100%)',
            }}
          >
            ACH1EV
          </span>
          {showTagline && (
            <span className="mt-1 text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.32em] text-[#d6ba8e]">
              SETTLE IDEAS
            </span>
          )}
        </div>
      </div>
    );
  }

  if (variant === 'inline') {
    return (
      <div className={`inline-flex items-center gap-2 bg-transparent select-none ${className}`} title={title}>
        <GoldCrestEmblem sizeClass={imgClassName || 'w-6 h-6'} color={emblemGoldColor} ariaLabel="Achiev" />
        <span className="font-serif font-extrabold tracking-[0.06em] text-sm text-[#8d6122] dark:text-[#eccb82]">
          Achiev
        </span>
      </div>
    );
  }

  // Default: 'compact' — Sidebar header brand restored to original transparent emblem + "Achiev"
  return (
    <div className={`flex items-center gap-2 bg-transparent select-none min-w-0 w-full py-0.5 ${className}`} title={title}>
      <GoldCrestEmblem
        sizeClass={imgClassName || 'w-[30px] h-[30px]'}
        color={emblemGoldColor}
        ariaLabel="Achiev emblem"
      />
      <div className="min-w-0 flex-1 flex flex-col justify-center leading-none">
        <span className="font-serif font-extrabold tracking-[0.04em] text-[15px] text-[#8d6122] dark:text-[#eccb82] truncate">
          Achiev
        </span>
        {showTagline && (
          <span className="mt-0.5 text-[8px] font-mono uppercase tracking-[0.22em] text-stone-500 dark:text-[#bfa37a] truncate">
            SETTLE IDEAS
          </span>
        )}
      </div>
    </div>
  );
};
