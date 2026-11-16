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

export const ACHIEV_LOGO_URL = resolveAssetUrl('android-chrome-192x192.png');
export const ACHIEV_EMBLEM_URL = resolveAssetUrl('android-chrome-192x192.png');
export const ACHIEV_WORDMARK_URL = resolveAssetUrl('android-chrome-512x512.png');
export const ACHIEV_LOCKUP_URL = resolveAssetUrl('android-chrome-512x512.png');
export const ACHIEV_LEATHER_HERO_URL = '';
export const ACHIEV_LEATHER_LOGIN_URL = '';

export const AchievBrand: React.FC<AchievBrandProps> = ({
  variant = 'compact',
  showTagline = true,
  className = '',
  imgClassName = '',
  emblemClassName = '',
  title = 'Ach1ev — Settle Ideas',
}) => {
  const EmblemMark = ({ sizeClass, alt = 'Ach1ev' }: { sizeClass: string; alt?: string }) => (
    <img
      src={ACHIEV_EMBLEM_URL}
      alt={alt}
      title={title}
      draggable={false}
      className={`object-contain rounded-xl select-none shrink-0 shadow-sm ${sizeClass}`}
    />
  );

  if (variant === 'emblem') {
    return <EmblemMark sizeClass={imgClassName || 'w-7 h-7'} alt="Ach1ev" />;
  }

  if (variant === 'lockup') {
    return (
      <div
        className={`inline-flex items-center justify-center gap-3.5 sm:gap-4 bg-transparent select-none max-w-full ${className}`}
        title={title}
      >
        <EmblemMark
          sizeClass={emblemClassName || 'w-14 h-14 sm:w-[68px] sm:h-[68px]'}
          alt="Ach1ev emblem"
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
        <EmblemMark sizeClass={imgClassName || 'w-6 h-6'} alt="" />
        <span className="font-serif font-extrabold tracking-[0.1em] uppercase text-sm text-[#c7953c] dark:text-[#ecd08b]">
          ACH1EV
        </span>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 bg-transparent select-none min-w-0 w-full py-0.5 ${className}`} title={title}>
      <EmblemMark sizeClass={imgClassName || 'w-[34px] h-[34px]'} alt="Ach1ev emblem" />
      <div className="min-w-0 flex-1 flex flex-col justify-center leading-none">
        <span className="font-serif font-extrabold tracking-[0.12em] uppercase text-[14px] text-[#8d6122] dark:text-[#eccb82] truncate">
          ACH1EV
        </span>
        {showTagline && (
          <span className="mt-0.5 text-[8.5px] font-mono uppercase tracking-[0.24em] text-stone-500 dark:text-[#bfa37a] truncate">
            SETTLE IDEAS
          </span>
        )}
      </div>
    </div>
  );
};
