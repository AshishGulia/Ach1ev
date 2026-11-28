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
    const wrapperSizeClass =
      imgClassName ||
      'w-[330px] sm:w-[428px] max-w-full h-auto select-none -my-5 sm:-my-7';

    return (
      <div
        className={`inline-flex items-center justify-center bg-transparent select-none max-w-full ${className}`}
        title={title}
      >
        <style>{`
          @keyframes achievOneUpwardShine {
            0% {
              top: 64%;
              opacity: 0;
            }
            8% {
              top: 61%;
              opacity: 0.95;
            }
            72% {
              top: 23%;
              opacity: 0.95;
            }
            84% {
              top: 19%;
              opacity: 0;
            }
            100% {
              top: 19%;
              opacity: 0;
            }
          }
        `}</style>
        <div
          className={`relative inline-block ${wrapperSizeClass}`}
          style={{
            filter: 'drop-shadow(0 6px 16px rgba(0, 0, 0, 0.45))',
          }}
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
            className="w-full h-auto block object-contain bg-transparent select-none"
          />

          {/* Strictly isolated to the '1' in ACH1EV: masked to the logo alpha + polygon-clipped to '1' only */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 overflow-hidden"
            style={{
              clipPath:
                'polygon(62.8% 24.5%, 72.3% 24.5%, 72.3% 63.2%, 63.7% 63.2%, 63.7% 58%, 64.2% 36.2%, 62.8% 35.5%)',
              WebkitMaskImage: `url(${ACHIEV_LOGIN_LOGO_URL})`,
              maskImage: `url(${ACHIEV_LOGIN_LOGO_URL})`,
              WebkitMaskSize: '100% 100%',
              maskSize: '100% 100%',
              WebkitMaskRepeat: 'no-repeat',
              maskRepeat: 'no-repeat',
              WebkitMaskPosition: 'center',
              maskPosition: 'center',
              mixBlendMode: 'screen',
            }}
          >
            <div
              style={{
                position: 'absolute',
                left: '62.5%',
                width: '10.2%',
                height: '13%',
                transform: 'translateY(-50%)',
                background:
                  'radial-gradient(ellipse 85% 60% at 55% 50%, rgba(255, 252, 235, 0.95) 0%, rgba(255, 223, 128, 0.72) 45%, rgba(245, 179, 66, 0.25) 75%, rgba(245, 179, 66, 0) 100%)',
                filter: 'blur(2px)',
                animation: 'achievOneUpwardShine 15s linear infinite',
                willChange: 'top, opacity',
              }}
            />
          </div>
        </div>
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
