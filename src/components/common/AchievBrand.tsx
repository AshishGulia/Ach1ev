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

export const ACHIEV_DEFAULT_LOGO_URL = resolveAssetUrl('assets/aistudio/Final_Logo_webp_1000_x_350_e6e85d30.PNG');
export const ACHIEV_LOGO_URL = resolveAssetUrl('assets/aistudio/Final_Logo_webp_1000_x_350_e6e85d30.PNG');
export const ACHIEV_EMBLEM_URL = resolveAssetUrl('assets/aistudio/Final_Logo_webp_1000_x_350_e6e85d30.PNG');
export const ACHIEV_WORDMARK_URL = resolveAssetUrl('assets/aistudio/Final_Logo_webp_1000_x_350_e6e85d30.PNG');
export const ACHIEV_LOCKUP_URL = resolveAssetUrl('assets/aistudio/Final_Logo_webp_1000_x_350_e6e85d30.PNG');
export const ACHIEV_LEATHER_HERO_URL = '';
export const ACHIEV_LEATHER_LOGIN_URL = '';

const GoldEmblem3D: React.FC<{
  sizeClass: string;
  isDarkMode?: boolean;
  ariaLabel?: string;
}> = ({ sizeClass, isDarkMode = true, ariaLabel = 'ACH1EV logo' }) => (
  <img
    src={ACHIEV_EMBLEM_URL}
    alt={ariaLabel}
    draggable={false}
    className={`select-none shrink-0 bg-transparent object-contain ${sizeClass}`}
    style={{
      filter: isDarkMode
        ? 'drop-shadow(0 4px 10px rgba(0, 0, 0, 0.55))'
        : 'drop-shadow(0 2px 6px rgba(42, 22, 6, 0.25))',
    }}
  />
);

export const AchievBrand: React.FC<AchievBrandProps> = ({
  variant = 'compact',
  isDarkMode,
  className = '',
  imgClassName = '',
  title = 'ACH1EV — Settle Ideas',
}) => {
  const darkFlag = isDarkMode ?? true;

  if (variant === 'emblem') {
    return (
      <GoldEmblem3D
        sizeClass={imgClassName || 'h-8 w-auto max-w-[120px]'}
        isDarkMode={darkFlag}
        ariaLabel="ACH1EV logo"
      />
    );
  }

  if (variant === 'lockup') {
    return (
      <div
        className={`inline-flex items-center justify-center bg-transparent select-none max-w-full ${className}`}
        title={title}
      >
        <img
          src={ACHIEV_DEFAULT_LOGO_URL}
          alt={title}
          draggable={false}
          className={
            imgClassName ||
            'h-[84px] sm:h-[104px] w-auto max-w-full object-contain bg-transparent select-none'
          }
          style={{
            filter: 'drop-shadow(0 6px 16px rgba(0, 0, 0, 0.45))',
          }}
        />
      </div>
    );
  }

  if (variant === 'inline') {
    return (
      <div className={`inline-flex items-center gap-1.5 bg-transparent select-none ${className}`} title={title}>
        <img
          src={ACHIEV_DEFAULT_LOGO_URL}
          alt="ACH1EV"
          draggable={false}
          className={imgClassName || 'h-6 w-auto object-contain bg-transparent select-none'}
        />
      </div>
    );
  }

  // Default: 'compact' — Sidebar header brand displaying the crisp full ACH1EV Settle Ideas logo
  return (
    <div className={`flex items-center justify-start bg-transparent select-none min-w-0 w-full py-0.5 ${className}`} title={title}>
      <img
        src={ACHIEV_DEFAULT_LOGO_URL}
        alt={title}
        draggable={false}
        className={imgClassName || 'h-[36px] max-w-[165px] w-auto object-contain bg-transparent select-none'}
        style={{
          filter: darkFlag
            ? 'drop-shadow(0 3px 8px rgba(0, 0, 0, 0.5))'
            : 'drop-shadow(0 2px 6px rgba(42, 22, 6, 0.22))',
        }}
      />
    </div>
  );
};
