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

export const ACHIEV_DEFAULT_LOGO_URL = resolveAssetUrl('assets/aistudio/achiev-logo-login.webp');
export const ACHIEV_LOGIN_LOGO_URL = resolveAssetUrl('assets/aistudio/Transparent_result_fff796aa.webp');
export const ACHIEV_LOGO_URL = resolveAssetUrl('assets/aistudio/achiev-logo-login.webp');
export const ACHIEV_EMBLEM_URL = resolveAssetUrl('assets/aistudio/transparent_512x512_264954dc.png');
export const ACHIEV_WORDMARK_URL = resolveAssetUrl('assets/aistudio/achiev-logo-login.webp');
export const ACHIEV_LOCKUP_URL = ACHIEV_LOGIN_LOGO_URL;
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
    width={512}
    height={512}
    draggable={false}
    className={`select-none shrink-0 bg-transparent object-contain ${sizeClass}`}
    style={{
      filter: isDarkMode
        ? 'drop-shadow(0 4px 10px rgba(0, 0, 0, 0.55)) brightness(1.08)'
        : 'drop-shadow(0 2px 6px rgba(42, 22, 6, 0.28)) contrast(1.05)',
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
          src={ACHIEV_LOGIN_LOGO_URL}
          alt={title}
          width={1376}
          height={768}
          loading="eager"
          decoding="sync"
          fetchPriority="high"
          draggable={false}
          className={
            imgClassName ||
            'w-[330px] sm:w-[428px] max-w-full h-auto object-contain bg-transparent select-none -my-5 sm:-my-7'
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
          src={resolveAssetUrl('achiev-emblem-3d.png')}
          alt="ACH1EV"
          width={512}
          height={512}
          draggable={false}
          className={imgClassName || 'h-5 w-5 object-contain bg-transparent select-none'}
          style={{
            filter: darkFlag
              ? 'drop-shadow(0 2px 6px rgba(0, 0, 0, 0.45))'
              : 'drop-shadow(0 1px 4px rgba(42, 22, 6, 0.2))',
          }}
        />
      </div>
    );
  }

  // Default: 'compact' — Sidebar header brand displaying the crisp full ACH1EV Settle Ideas logo centered
  return (
    <div className={`flex items-center justify-center bg-transparent select-none min-w-0 w-full py-0.5 ${className}`} title={title}>
      <img
        src={ACHIEV_DEFAULT_LOGO_URL}
        alt={title}
        width={928}
        height={324}
        draggable={false}
        className={imgClassName || 'h-[43px] max-w-[190px] w-auto object-contain bg-transparent select-none'}
        style={{
          filter: darkFlag
            ? 'drop-shadow(0 3px 8px rgba(0, 0, 0, 0.5))'
            : 'drop-shadow(0 2px 6px rgba(42, 22, 6, 0.22))',
        }}
      />
    </div>
  );
};
