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

export const ACHIEV_LOGO_URL = resolveAssetUrl('achiev-emblem-3d.png?v=1');
export const ACHIEV_EMBLEM_URL = resolveAssetUrl('achiev-emblem-3d.png?v=1');
export const ACHIEV_WORDMARK_URL = resolveAssetUrl('android-chrome-512x512.png?v=2');
export const ACHIEV_LOCKUP_URL = resolveAssetUrl('android-chrome-512x512.png?v=2');
export const ACHIEV_LEATHER_HERO_URL = '';
export const ACHIEV_LEATHER_LOGIN_URL = '';

const GoldEmblem3D: React.FC<{
  sizeClass: string;
  isDarkMode?: boolean;
  ariaLabel?: string;
}> = ({ sizeClass, isDarkMode = true, ariaLabel = 'ACH1EV emblem' }) => (
  <img
    src={ACHIEV_EMBLEM_URL}
    alt={ariaLabel}
    draggable={false}
    className={`select-none shrink-0 bg-transparent object-contain ${sizeClass}`}
    style={{
      filter: isDarkMode
        ? 'drop-shadow(0 4px 10px rgba(0, 0, 0, 0.55))'
        : 'drop-shadow(0 2px 6px rgba(42, 22, 6, 0.28))',
    }}
  />
);

export const AchievBrand: React.FC<AchievBrandProps> = ({
  variant = 'compact',
  isDarkMode,
  showTagline = true,
  className = '',
  imgClassName = '',
  emblemClassName = '',
  title = 'ACH1EV — Settle Ideas',
}) => {
  const darkFlag = isDarkMode ?? true;

  if (variant === 'emblem') {
    return (
      <GoldEmblem3D
        sizeClass={imgClassName || 'w-7 h-7'}
        isDarkMode={darkFlag}
        ariaLabel="ACH1EV emblem"
      />
    );
  }

  if (variant === 'lockup') {
    return (
      <div
        className={`inline-flex items-center justify-center gap-3.5 sm:gap-4 bg-transparent select-none max-w-full ${className}`}
        title={title}
      >
        <GoldEmblem3D
          sizeClass={emblemClassName || 'w-14 h-14 sm:w-[70px] sm:h-[70px]'}
          isDarkMode={true}
          ariaLabel="ACH1EV crown nib emblem"
        />
        <div className="flex flex-col items-start text-left leading-none">
          <span
            className="font-serif font-extrabold tracking-[0.14em] uppercase bg-clip-text text-transparent"
            style={{
              fontSize: 'clamp(1.7rem, 3.3vw, 2.45rem)',
              backgroundImage:
                'linear-gradient(165deg, #fff5cf 0%, #f1c86e 38%, #c98c2b 68%, #ffe59e 100%)',
              filter: 'drop-shadow(0 3px 8px rgba(0, 0, 0, 0.55))',
            }}
          >
            ACH1EV
          </span>
          {showTagline && (
            <span className="mt-1.5 text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.34em] text-[#dec295]">
              SETTLE IDEAS
            </span>
          )}
        </div>
      </div>
    );
  }

  if (variant === 'inline') {
    return (
      <div className={`inline-flex items-center gap-1.5 bg-transparent select-none ${className}`} title={title}>
        <GoldEmblem3D sizeClass={imgClassName || 'w-5 h-5'} isDarkMode={darkFlag} ariaLabel="ACH1EV" />
        <span className="font-serif font-extrabold tracking-[0.1em] text-[13px] text-[#7c5318] dark:text-[#eccb82] uppercase">
          ACH1EV
        </span>
      </div>
    );
  }

  // Default: 'compact' — Sidebar header brand with transparent 3D gold emblem + original ACH1EV name
  return (
    <div className={`flex items-center gap-2 bg-transparent select-none min-w-0 w-full py-0.5 ${className}`} title={title}>
      <GoldEmblem3D
        sizeClass={imgClassName || 'w-[30px] h-[30px]'}
        isDarkMode={darkFlag}
        ariaLabel="ACH1EV emblem"
      />
      <div className="min-w-0 flex-1 flex flex-col justify-center leading-none">
        <span className="font-serif font-extrabold tracking-[0.11em] text-[14.5px] text-[#7c5318] dark:text-[#eccb82] uppercase truncate">
          ACH1EV
        </span>
        {showTagline && (
          <span className="mt-0.5 text-[7.5px] font-mono uppercase tracking-[0.22em] text-stone-500 dark:text-[#bfa37a] truncate">
            SETTLE IDEAS
          </span>
        )}
      </div>
    </div>
  );
};
