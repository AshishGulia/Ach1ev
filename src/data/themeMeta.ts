import { DesignId } from '../types';

export type ThemeId = DesignId;

const svgUri = (svg: string): string => `url("data:image/svg+xml,${encodeURIComponent(svg.trim())}")`;

const resolvePublicAsset = (relativePath: string): string => {
  const base =
    typeof import.meta !== 'undefined' && (import.meta as any).env?.BASE_URL
      ? (import.meta as any).env.BASE_URL
      : '/';
  const normalizedBase = base === './' ? './' : base.endsWith('/') ? base : `${base}/`;
  return `url("${normalizedBase}${relativePath.replace(/^\/+/, '')}")`;
};

export const THEME_ONE_MARBLE_URI = resolvePublicAsset('assets/themes/marble-gold-light.jpg?v=1');

/** Whitish-cream Calacatta marble with subtle warm gold veins — SVG fallback */
export const CALACATTA_MARBLE_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" width="520" height="520" viewBox="0 0 520 520">
  <defs>
    <radialGradient id="cmSoft" cx="35%" cy="30%" r="75%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.55"/>
      <stop offset="60%" stop-color="#f7efe2" stop-opacity="0.25"/>
      <stop offset="100%" stop-color="#ebd9bd" stop-opacity="0.2"/>
    </radialGradient>
  </defs>
  <rect width="520" height="520" fill="url(#cmSoft)"/>
  <path d="M-25 82 C90 118 190 42 308 82 C402 114 460 56 545 92" stroke="#c89e4b" stroke-width="1.45" fill="none" opacity="0.26"/>
  <path d="M35 -18 C126 104 232 184 330 286 C398 358 446 420 530 525" stroke="#d5b166" stroke-width="1.2" fill="none" opacity="0.22"/>
  <path d="M-18 342 C96 296 196 355 304 312 C406 272 460 320 538 282" stroke="#b98a35" stroke-width="1.05" fill="none" opacity="0.21"/>
  <path d="M188 532 C226 422 290 374 378 220 C425 136 472 82 516 -14" stroke="#dac084" stroke-width="0.9" fill="none" opacity="0.22"/>
  <path d="M16 198 C108 226 164 176 248 202 C310 222 365 186 438 198" stroke="#c49d52" stroke-width="0.75" fill="none" opacity="0.18"/>
  <path d="M72 436 C168 416 250 452 340 422 C412 398 464 426 518 408" stroke="#ceb072" stroke-width="0.8" fill="none" opacity="0.18"/>
</svg>`;

export const CALACATTA_MARBLE_DATA_URI = svgUri(CALACATTA_MARBLE_SVG);

export interface ThemeMeta {
  id: ThemeId;
  name: string;
  tagline: string;
  lightBg: string;
  lightSurface: string;
  lightRaised: string;
  lightHeader: string;
  lightBorder: string;
  lightInk: string;
  lightMuted: string;
  lightAccent: string;
  lightAccentSoft: string;
  darkBg: string;
  darkSurface: string;
  darkRaised: string;
  darkHeader: string;
  darkBorder: string;
  darkInk: string;
  darkMuted: string;
  darkAccent: string;
  darkAccentSoft: string;
  // Sober button shape descriptor
  shapeName: string;
  buttonRadius: string;
  // Light & Dark non-repetitive organic abstract SVGs (Theme 1 = none so Theme 1 stays pure study)
  lightWallpaperUri?: string;
  darkWallpaperUri?: string;
  // Sidebar theming (light & dark)
  sidebar: {
    light: {
      railBg: string;
      railBorder: string;
      railText: string;
      brandSectionBg: string;
      navSectionBg: string;
      thoughtSectionBg: string;
      footerSectionBg: string;
      sectionBorder: string;
      activeBtnBg: string;
      activeBtnBorder: string;
      activeBtnText: string;
      idleBtnBg: string;
      idleBtnText: string;
      activeIconColor: string;
      idleIconColor: string;
      toggleBtnBg: string;
      toggleBtnText: string;
      toggleBtnBorder: string;
      mutedLabelColor: string;
      thoughtColor: string;
      authorColor: string;
      trashTextColor: string;
      trashIconColor: string;
    };
    dark: {
      railBg: string;
      railBorder: string;
      railText: string;
      brandSectionBg: string;
      navSectionBg: string;
      thoughtSectionBg: string;
      footerSectionBg: string;
      sectionBorder: string;
      activeBtnBg: string;
      activeBtnBorder: string;
      activeBtnText: string;
      idleBtnBg: string;
      idleBtnText: string;
      activeIconColor: string;
      idleIconColor: string;
      toggleBtnBg: string;
      toggleBtnText: string;
      toggleBtnBorder: string;
      mutedLabelColor: string;
      thoughtColor: string;
      authorColor: string;
      trashTextColor: string;
      trashIconColor: string;
    };
  };
}

/* Sober, crisp, architectural non-repetitive abstract compositions for Themes 1–5 (Light & Dark) */
const espressoDarkWall = svgUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice">
  <defs>
    <linearGradient id="edBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#070301"/>
      <stop offset="50%" stop-color="#110703"/>
      <stop offset="100%" stop-color="#050201"/>
    </linearGradient>
    <radialGradient id="edGlow1" cx="18%" cy="18%" r="54%">
      <stop offset="0%" stop-color="#6b3b1a" stop-opacity="0.44"/>
      <stop offset="55%" stop-color="#2b1307" stop-opacity="0.22"/>
      <stop offset="100%" stop-color="#070301" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="edGlow2" cx="84%" cy="78%" r="50%">
      <stop offset="0%" stop-color="#8c5527" stop-opacity="0.32"/>
      <stop offset="100%" stop-color="#070301" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="edArc" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#2b1408" stop-opacity="0.72"/>
      <stop offset="50%" stop-color="#4e2611" stop-opacity="0.36"/>
      <stop offset="100%" stop-color="#b88446" stop-opacity="0.16"/>
    </linearGradient>
    <filter id="edBlur" x="-15%" y="-15%" width="130%" height="130%"><feGaussianBlur stdDeviation="24"/></filter>
  </defs>
  <rect width="1600" height="1000" fill="url(#edBg)"/>
  <rect width="1600" height="1000" fill="url(#edGlow1)"/>
  <rect width="1600" height="1000" fill="url(#edGlow2)"/>
  <path d="M-80 820 C260 560 620 740 980 460 C1280 225 1470 350 1690 160 L1690 1060 L-80 1060 Z" fill="url(#edArc)"/>
  <path d="M-60 320 C340 160 680 390 1080 180 C1340 45 1510 150 1690 30" fill="none" stroke="#c89454" stroke-width="2" opacity="0.24"/>
  <path d="M120 960 C460 720 820 830 1240 530 C1420 400 1560 440 1690 360" fill="none" stroke="#9e6d36" stroke-width="1.4" opacity="0.20"/>
  <ellipse cx="1220" cy="240" rx="340" ry="180" transform="rotate(-14 1220 240)" fill="#3b1b0b" opacity="0.45" filter="url(#edBlur)"/>
</svg>`);

const twilightLightWall = svgUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice">
  <defs>
    <linearGradient id="twlBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fdf4f6"/>
      <stop offset="48%" stop-color="#f5d7db"/>
      <stop offset="100%" stop-color="#edd0df"/>
    </linearGradient>
    <radialGradient id="twlSun" cx="80%" cy="18%" r="50%">
      <stop offset="0%" stop-color="#f1916d" stop-opacity="0.45"/>
      <stop offset="55%" stop-color="#bd83b8" stop-opacity="0.22"/>
      <stop offset="100%" stop-color="#f5d7db" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="twlRib" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#473e66" stop-opacity="0.22"/>
      <stop offset="55%" stop-color="#bd83b8" stop-opacity="0.30"/>
      <stop offset="100%" stop-color="#f1916d" stop-opacity="0.26"/>
    </linearGradient>
    <filter id="twlBlur" x="-15%" y="-15%" width="130%" height="130%"><feGaussianBlur stdDeviation="24"/></filter>
  </defs>
  <rect width="1600" height="1000" fill="url(#twlBg)"/>
  <rect width="1600" height="1000" fill="url(#twlSun)"/>
  <path d="M-80 740 C260 510 600 800 980 540 C1280 335 1470 500 1690 360 L1690 1060 L-80 1060 Z" fill="url(#twlRib)"/>
  <path d="M-60 440 C340 290 700 490 1120 310 C1380 198 1520 290 1690 210" fill="none" stroke="#ffffff" stroke-width="2.2" opacity="0.52"/>
  <ellipse cx="280" cy="240" rx="320" ry="170" transform="rotate(-14 280 240)" fill="#bd83b8" opacity="0.24" filter="url(#twlBlur)"/>
</svg>`);

const twilightDarkWall = svgUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice">
  <defs>
    <linearGradient id="twdBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0b1326"/>
      <stop offset="52%" stop-color="#171630"/>
      <stop offset="100%" stop-color="#0d0b1a"/>
    </linearGradient>
    <radialGradient id="twdGlow" cx="76%" cy="22%" r="52%">
      <stop offset="0%" stop-color="#f1916d" stop-opacity="0.34"/>
      <stop offset="48%" stop-color="#bd83b8" stop-opacity="0.22"/>
      <stop offset="100%" stop-color="#171630" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="twdArc" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#473e66" stop-opacity="0.56"/>
      <stop offset="60%" stop-color="#bd83b8" stop-opacity="0.24"/>
      <stop offset="100%" stop-color="#f1916d" stop-opacity="0.18"/>
    </linearGradient>
    <filter id="twdBlur" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="28"/></filter>
  </defs>
  <rect width="1600" height="1000" fill="url(#twdBg)"/>
  <rect width="1600" height="1000" fill="url(#twdGlow)"/>
  <path d="M-80 820 C280 560 620 770 1000 495 C1280 290 1460 420 1690 235 L1690 1060 L-80 1060 Z" fill="url(#twdArc)"/>
  <path d="M-40 540 C360 390 740 570 1160 365 C1400 248 1540 320 1690 250" fill="none" stroke="#f5d7db" stroke-width="1.6" opacity="0.22"/>
  <ellipse cx="320" cy="240" rx="340" ry="180" transform="rotate(-14 320 240)" fill="#473e66" opacity="0.46" filter="url(#twdBlur)"/>
</svg>`);

const oceanicLightWall = svgUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice">
  <defs>
    <linearGradient id="oclBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#eaffff"/>
      <stop offset="50%" stop-color="#d7f3ff"/>
      <stop offset="100%" stop-color="#c2e8ff"/>
    </linearGradient>
    <radialGradient id="oclSun" cx="82%" cy="18%" r="48%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.95"/>
      <stop offset="55%" stop-color="#c2e8ff" stop-opacity="0.45"/>
      <stop offset="100%" stop-color="#eaffff" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="oclSurf" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#7298af" stop-opacity="0.34"/>
      <stop offset="55%" stop-color="#365c73" stop-opacity="0.22"/>
      <stop offset="100%" stop-color="#004671" stop-opacity="0.16"/>
    </linearGradient>
    <filter id="oclBlur" x="-15%" y="-15%" width="130%" height="130%"><feGaussianBlur stdDeviation="22"/></filter>
  </defs>
  <rect width="1600" height="1000" fill="url(#oclBg)"/>
  <rect width="1600" height="1000" fill="url(#oclSun)"/>
  <path d="M-100 580 C260 410 580 680 990 465 C1270 320 1450 475 1700 335 L1700 1060 L-100 1060 Z" fill="url(#oclSurf)"/>
  <path d="M-80 790 C340 635 700 870 1140 695 C1390 595 1530 680 1700 610 L1700 1060 L-80 1060 Z" fill="#7298af" opacity="0.28" filter="url(#oclBlur)"/>
  <path d="M-40 435 C380 315 760 515 1190 365 C1420 285 1560 345 1700 290" fill="none" stroke="#ffffff" stroke-width="2.6" opacity="0.65"/>
  <ellipse cx="320" cy="220" rx="340" ry="170" transform="rotate(-14 320 220)" fill="#c2e8ff" opacity="0.58" filter="url(#oclBlur)"/>
</svg>`);

const oceanicDarkWall = svgUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice">
  <defs>
    <linearGradient id="ocdBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#021826"/>
      <stop offset="52%" stop-color="#042a41"/>
      <stop offset="100%" stop-color="#01121d"/>
    </linearGradient>
    <radialGradient id="ocdMoon" cx="76%" cy="20%" r="48%">
      <stop offset="0%" stop-color="#7298af" stop-opacity="0.46"/>
      <stop offset="55%" stop-color="#004671" stop-opacity="0.34"/>
      <stop offset="100%" stop-color="#021826" stop-opacity="0"/>
    </radialGradient>
    <filter id="ocdBlur" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="26"/></filter>
  </defs>
  <rect width="1600" height="1000" fill="url(#ocdBg)"/>
  <rect width="1600" height="1000" fill="url(#ocdMoon)"/>
  <path d="M-80 640 C280 445 640 740 1040 505 C1320 345 1480 490 1700 365 L1700 1060 L-80 1060 Z" fill="#004671" opacity="0.58"/>
  <path d="M-60 830 C360 685 760 905 1180 725 C1420 625 1560 730 1700 665 L1700 1060 L-60 1060 Z" fill="#365c73" opacity="0.42" filter="url(#ocdBlur)"/>
  <path d="M-40 500 C360 365 760 555 1190 385 C1420 295 1560 360 1700 300" fill="none" stroke="#c2e8ff" stroke-width="1.8" opacity="0.28"/>
  <ellipse cx="360" cy="280" rx="300" ry="160" transform="rotate(19 360 280)" fill="#365c73" opacity="0.32" filter="url(#ocdBlur)"/>
</svg>`);

const kabulLightWall = svgUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice">
  <defs>
    <linearGradient id="kblBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f1f5f9"/>
      <stop offset="52%" stop-color="#e2e8f0"/>
      <stop offset="100%" stop-color="#dbeafe"/>
    </linearGradient>
    <radialGradient id="kblGlow" cx="78%" cy="22%" r="48%">
      <stop offset="0%" stop-color="#3b82f6" stop-opacity="0.22"/>
      <stop offset="60%" stop-color="#64748b" stop-opacity="0.12"/>
      <stop offset="100%" stop-color="#f1f5f9" stop-opacity="0"/>
    </radialGradient>
    <filter id="kblBlur" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="24"/></filter>
  </defs>
  <rect width="1600" height="1000" fill="url(#kblBg)"/>
  <rect width="1600" height="1000" fill="url(#kblGlow)"/>
  <path d="M-80 780 C300 540 700 790 1120 535 C1380 380 1540 490 1700 390 L1700 1060 L-80 1060 Z" fill="#475569" opacity="0.12"/>
  <path d="M-50 470 C360 350 760 510 1180 360 C1400 282 1540 340 1680 290" fill="none" stroke="#2563eb" stroke-width="2.4" opacity="0.34"/>
  <ellipse cx="380" cy="260" rx="320" ry="165" transform="rotate(-16 380 260)" fill="#3b82f6" opacity="0.14" filter="url(#kblBlur)"/>
</svg>`);

const kabulDarkWall = svgUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice">
  <defs>
    <linearGradient id="kbdBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#111419"/>
      <stop offset="56%" stop-color="#1b2029"/>
      <stop offset="100%" stop-color="#0d1015"/>
    </linearGradient>
    <radialGradient id="kbdTurq" cx="76%" cy="28%" r="46%">
      <stop offset="0%" stop-color="#3b82f6" stop-opacity="0.28"/>
      <stop offset="55%" stop-color="#334155" stop-opacity="0.26"/>
      <stop offset="100%" stop-color="#111419" stop-opacity="0"/>
    </radialGradient>
    <filter id="kbdBlur" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="28"/></filter>
  </defs>
  <rect width="1600" height="1000" fill="url(#kbdBg)"/>
  <rect width="1600" height="1000" fill="url(#kbdTurq)"/>
  <path d="M-80 740 C300 475 680 760 1080 505 C1340 345 1500 460 1700 335 L1700 1060 L-80 1060 Z" fill="#1e293b" opacity="0.54"/>
  <path d="M-40 520 C360 390 740 540 1160 380 C1400 288 1540 345 1680 280" fill="none" stroke="#60a5fa" stroke-width="2" opacity="0.30"/>
  <ellipse cx="340" cy="240" rx="340" ry="180" transform="rotate(-19 340 240)" fill="#2563eb" opacity="0.22" filter="url(#kbdBlur)"/>
</svg>`);

const emeraldGoldLightWall = svgUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice">
  <defs>
    <linearGradient id="eglBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f7f1e8"/>
      <stop offset="50%" stop-color="#ebe0d0"/>
      <stop offset="100%" stop-color="#d8c2aa"/>
    </linearGradient>
    <radialGradient id="eglSun" cx="78%" cy="18%" r="50%">
      <stop offset="0%" stop-color="#fff8e8" stop-opacity="0.92"/>
      <stop offset="55%" stop-color="#d8c2aa" stop-opacity="0.40"/>
      <stop offset="100%" stop-color="#ebe0d0" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="eglSweep" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#002a23" stop-opacity="0.22"/>
      <stop offset="55%" stop-color="#0f4d40" stop-opacity="0.16"/>
      <stop offset="100%" stop-color="#c49a45" stop-opacity="0.18"/>
    </linearGradient>
    <filter id="eglBlur" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="24"/></filter>
  </defs>
  <rect width="1600" height="1000" fill="url(#eglBg)"/>
  <rect width="1600" height="1000" fill="url(#eglSun)"/>
  <path d="M-80 680 C280 425 640 730 1060 445 C1340 260 1500 410 1700 275 L1700 1060 L-80 1060 Z" fill="url(#eglSweep)"/>
  <path d="M-60 360 C340 230 720 420 1150 250 C1400 152 1540 225 1680 170" fill="none" stroke="#b48735" stroke-width="2" opacity="0.34"/>
  <ellipse cx="320" cy="240" rx="340" ry="180" transform="rotate(-14 320 240)" fill="#d8c2aa" opacity="0.58" filter="url(#eglBlur)"/>
  <ellipse cx="1180" cy="240" rx="300" ry="160" transform="rotate(18 1180 240)" fill="#ffffff" opacity="0.56" filter="url(#eglBlur)"/>
</svg>`);

const emeraldGoldDarkWall = svgUri(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice">
  <defs>
    <linearGradient id="egdBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#040c0b"/>
      <stop offset="52%" stop-color="#002a23"/>
      <stop offset="100%" stop-color="#090e0e"/>
    </linearGradient>
    <radialGradient id="egdGold" cx="76%" cy="22%" r="48%">
      <stop offset="0%" stop-color="#d1a854" stop-opacity="0.28"/>
      <stop offset="55%" stop-color="#002a23" stop-opacity="0.32"/>
      <stop offset="100%" stop-color="#090e0e" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="egdArc" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#002a23" stop-opacity="0.82"/>
      <stop offset="60%" stop-color="#0b463b" stop-opacity="0.45"/>
      <stop offset="100%" stop-color="#c49a45" stop-opacity="0.22"/>
    </linearGradient>
    <filter id="egdBlur" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="28"/></filter>
  </defs>
  <rect width="1600" height="1000" fill="url(#egdBg)"/>
  <rect width="1600" height="1000" fill="url(#egdGold)"/>
  <path d="M-80 740 C300 475 680 760 1080 485 C1340 310 1500 430 1700 295 L1700 1060 L-80 1060 Z" fill="url(#egdArc)"/>
  <path d="M-40 460 C380 320 760 510 1190 340 C1420 248 1560 315 1680 260" fill="none" stroke="#d1a854" stroke-width="1.6" opacity="0.30"/>
  <ellipse cx="340" cy="260" rx="340" ry="180" transform="rotate(-16 340 260)" fill="#002a23" opacity="0.62" filter="url(#egdBlur)"/>
</svg>`);

export const THEME_META_MAP: Record<ThemeId, ThemeMeta> = {
  '1': {
    id: '1',
    name: 'Heritage Atelier Study',
    tagline: 'Original Walnut & Brass Linen Study · Espresso Night · Calacatta Marble Leisure',
    lightBg: '#f6f2ea',
    lightSurface: 'rgba(253, 251, 247, 0.84)',
    lightRaised: 'rgba(239, 228, 212, 0.88)',
    lightHeader: 'rgba(248, 244, 235, 0.82)',
    lightBorder: '#e2d7c5',
    lightInk: '#1c140e',
    lightMuted: '#6b5340',
    lightAccent: '#a47c43',
    lightAccentSoft: 'rgba(164, 124, 67, 0.14)',
    darkBg: '#080402',
    darkSurface: 'rgba(17, 8, 4, 0.88)',
    darkRaised: 'rgba(27, 13, 6, 0.9)',
    darkHeader: 'rgba(12, 6, 3, 0.88)',
    darkBorder: '#2e180c',
    darkInk: '#efe4d4',
    darkMuted: '#b79a79',
    darkAccent: '#d4a373',
    darkAccentSoft: 'rgba(212, 163, 115, 0.16)',
    shapeName: 'Soft Pill',
    buttonRadius: '11px',
    lightWallpaperUri: THEME_ONE_MARBLE_URI,
    darkWallpaperUri: espressoDarkWall,
    sidebar: {
      light: {
        railBg: 'linear-gradient(180deg, rgba(250,246,238,0.84) 0%, rgba(241,232,218,0.82) 55%, rgba(232,220,201,0.86) 100%)',
        railBorder: '#dcd0bd',
        railText: '#2a1f18',
        brandSectionBg: 'linear-gradient(155deg, rgba(255,251,243,0.9) 0%, rgba(238,224,202,0.82) 100%)',
        navSectionBg: 'linear-gradient(180deg, rgba(248,241,229,0.75) 0%, rgba(238,227,210,0.68) 100%)',
        thoughtSectionBg: 'linear-gradient(160deg, rgba(246,236,220,0.86) 0%, rgba(232,216,192,0.78) 100%)',
        footerSectionBg: 'linear-gradient(180deg, rgba(239,228,211,0.84) 0%, rgba(227,212,190,0.92) 100%)',
        sectionBorder: 'rgba(176,144,104,0.28)',
        activeBtnBg: 'linear-gradient(155deg, #6f4225 0%, #522e18 100%)',
        activeBtnBorder: '#7f4c2a',
        activeBtnText: '#ffffff',
        idleBtnBg: 'transparent',
        idleBtnText: '#4c3b31',
        activeIconColor: '#ffd899',
        idleIconColor: '#6c4830',
        toggleBtnBg: 'linear-gradient(180deg, rgba(242,232,216,0.92) 0%, rgba(227,214,193,0.92) 100%)',
        toggleBtnText: '#554236',
        toggleBtnBorder: '#d6c7b0',
        mutedLabelColor: '#8a6851',
        thoughtColor: '#35251c',
        authorColor: '#85532d',
        trashTextColor: '#6e1418',
        trashIconColor: '#7f1d1d',
      },
      dark: {
        railBg: 'linear-gradient(180deg, #120904 0%, #0b0502 58%, #070301 100%)',
        railBorder: '#2a160b',
        railText: '#efe4d4',
        brandSectionBg: 'transparent',
        navSectionBg: 'rgba(19, 9, 4, 0.62)',
        thoughtSectionBg: 'transparent',
        footerSectionBg: 'linear-gradient(180deg, #120904 0%, #090402 100%)',
        sectionBorder: '#2a160b',
        activeBtnBg: 'linear-gradient(155deg, #9c623d 0%, #7d4b2c 52%, #5e351c 100%)',
        activeBtnBorder: '#cf8e63',
        activeBtnText: '#ffffff',
        idleBtnBg: 'linear-gradient(180deg, rgba(48, 28, 16, 0.72) 0%, rgba(26, 14, 7, 0.88) 100%)',
        idleBtnText: '#f4e2cb',
        activeIconColor: '#ffecc9',
        idleIconColor: '#dbb88e',
        toggleBtnBg: 'linear-gradient(180deg, #3c2415 0%, #29170c 58%, #1a0e06 100%)',
        toggleBtnText: '#faebd6',
        toggleBtnBorder: '#5c3821',
        mutedLabelColor: '#b7946e',
        thoughtColor: '#ede0cc',
        authorColor: '#d4a373',
        trashTextColor: '#e27477',
        trashIconColor: '#e0585c',
      },
    },
  },
  '2': {
    id: '2',
    name: 'Twilight Sunset',
    tagline: 'Twilight Plum #473E66 · Orchid Mauve #BD83B8 · Rose Blush #F5D7DB · Coral Peach #F1916D',
    lightBg: '#fdf3f5',
    lightSurface: 'rgba(255, 247, 249, 0.88)',
    lightRaised: 'rgba(245, 215, 219, 0.90)',
    lightHeader: 'rgba(253, 241, 244, 0.88)',
    lightBorder: '#e2becb',
    lightInk: '#2a1d3d',
    lightMuted: '#473e66',
    lightAccent: '#c95d38',
    lightAccentSoft: 'rgba(241, 145, 109, 0.16)',
    darkBg: '#100d1d',
    darkSurface: 'rgba(26, 22, 48, 0.90)',
    darkRaised: 'rgba(45, 37, 80, 0.92)',
    darkHeader: 'rgba(18, 14, 34, 0.92)',
    darkBorder: '#473e66',
    darkInk: '#f8e8ec',
    darkMuted: '#cfaed0',
    darkAccent: '#f1916d',
    darkAccentSoft: 'rgba(241, 145, 109, 0.18)',
    shapeName: 'Sunset Contour',
    buttonRadius: '15px 4px 15px 4px',
    lightWallpaperUri: twilightLightWall,
    darkWallpaperUri: twilightDarkWall,
    sidebar: {
      light: {
        railBg: 'linear-gradient(180deg, rgba(253,242,245,0.90) 0%, rgba(245,215,219,0.88) 58%, rgba(235,204,224,0.92) 100%)',
        railBorder: '#dfb9c8',
        railText: '#2a1d3d',
        brandSectionBg: 'linear-gradient(155deg, rgba(255,248,250,0.90) 0%, rgba(245,215,219,0.80) 100%)',
        navSectionBg: 'linear-gradient(180deg, rgba(252,238,242,0.78) 0%, rgba(244,218,229,0.72) 100%)',
        thoughtSectionBg: 'linear-gradient(155deg, rgba(248,225,232,0.86) 0%, rgba(232,202,226,0.78) 100%)',
        footerSectionBg: 'linear-gradient(180deg, rgba(245,215,219,0.84) 0%, rgba(232,198,218,0.90) 100%)',
        sectionBorder: 'rgba(71,62,102,0.22)',
        activeBtnBg: 'linear-gradient(145deg, #473e66 0%, #7d5382 58%, #c9684b 100%)',
        activeBtnBorder: '#8d5b8c',
        activeBtnText: '#ffffff',
        idleBtnBg: 'rgba(255,255,255,0.42)',
        idleBtnText: '#382a52',
        activeIconColor: '#ffd4c2',
        idleIconColor: '#694e80',
        toggleBtnBg: 'linear-gradient(180deg, rgba(253,240,243,0.92) 0%, rgba(245,215,219,0.92) 100%)',
        toggleBtnText: '#3b2d56',
        toggleBtnBorder: '#d7b2c3',
        mutedLabelColor: '#6d5480',
        thoughtColor: '#2d2042',
        authorColor: '#b95331',
        trashTextColor: '#8c2228',
        trashIconColor: '#a3282f',
      },
      dark: {
        railBg: 'linear-gradient(180deg, rgba(22,19,44,0.94) 0%, rgba(16,13,32,0.96) 58%, rgba(11,9,22,0.98) 100%)',
        railBorder: '#473e66',
        railText: '#f8e8ec',
        brandSectionBg: 'linear-gradient(155deg, rgba(44,36,74,0.72) 0%, rgba(20,16,38,0.88) 100%)',
        navSectionBg: 'linear-gradient(180deg, rgba(32,26,56,0.62) 0%, rgba(16,13,30,0.78) 100%)',
        thoughtSectionBg: 'linear-gradient(155deg, rgba(44,36,74,0.72) 0%, rgba(18,15,35,0.88) 100%)',
        footerSectionBg: 'linear-gradient(180deg, rgba(28,22,48,0.80) 0%, rgba(12,10,24,0.94) 100%)',
        sectionBorder: 'rgba(189,131,184,0.22)',
        activeBtnBg: 'linear-gradient(155deg, #e07651 0%, #b86292 52%, #6d4785 100%)',
        activeBtnBorder: '#f1916d',
        activeBtnText: '#ffffff',
        idleBtnBg: 'linear-gradient(180deg, rgba(50, 42, 82, 0.78) 0%, rgba(28, 22, 50, 0.90) 100%)',
        idleBtnText: '#f5d7db',
        activeIconColor: '#fff1eb',
        idleIconColor: '#d4a3d0',
        toggleBtnBg: 'linear-gradient(180deg, #352b59 0%, #241d40 58%, #161129 100%)',
        toggleBtnText: '#f5d7db',
        toggleBtnBorder: '#5d4f88',
        mutedLabelColor: '#bd83b8',
        thoughtColor: '#f5d7db',
        authorColor: '#f1916d',
        trashTextColor: '#f5989b',
        trashIconColor: '#f17c80',
      },
    },
  },
  '3': {
    id: '3',
    name: 'Oceanic Horizon',
    tagline: 'Ice Mist #EAFFFF · Glacial Sky #C2E8FF · Cerulean #7298AF · Abyssal Navy #042A41 · Deep Ocean #004671',
    lightBg: '#f0fcff',
    lightSurface: 'rgba(246, 254, 255, 0.88)',
    lightRaised: 'rgba(194, 232, 255, 0.78)',
    lightHeader: 'rgba(234, 255, 255, 0.88)',
    lightBorder: '#9cc5de',
    lightInk: '#042a41',
    lightMuted: '#365c73',
    lightAccent: '#004671',
    lightAccentSoft: 'rgba(0, 70, 113, 0.13)',
    darkBg: '#021521',
    darkSurface: 'rgba(4, 42, 65, 0.88)',
    darkRaised: 'rgba(6, 59, 92, 0.90)',
    darkHeader: 'rgba(3, 30, 48, 0.90)',
    darkBorder: '#1d5678',
    darkInk: '#eaffff',
    darkMuted: '#9fc6de',
    darkAccent: '#7ec8eb',
    darkAccentSoft: 'rgba(194, 232, 255, 0.16)',
    shapeName: 'Oceanic Pebble',
    buttonRadius: '13px 19px 11px 17px',
    lightWallpaperUri: oceanicLightWall,
    darkWallpaperUri: oceanicDarkWall,
    sidebar: {
      light: {
        railBg: 'linear-gradient(180deg, rgba(234,255,255,0.90) 0%, rgba(214,244,255,0.88) 58%, rgba(194,232,255,0.92) 100%)',
        railBorder: '#9cc5de',
        railText: '#042a41',
        brandSectionBg: 'linear-gradient(155deg, rgba(248,255,255,0.90) 0%, rgba(194,232,255,0.78) 100%)',
        navSectionBg: 'linear-gradient(180deg, rgba(234,255,255,0.76) 0%, rgba(206,238,255,0.70) 100%)',
        thoughtSectionBg: 'linear-gradient(155deg, rgba(224,248,255,0.86) 0%, rgba(194,232,255,0.78) 100%)',
        footerSectionBg: 'linear-gradient(180deg, rgba(212,240,255,0.86) 0%, rgba(186,224,248,0.92) 100%)',
        sectionBorder: 'rgba(54,92,115,0.22)',
        activeBtnBg: 'linear-gradient(145deg, #004671 0%, #042a41 100%)',
        activeBtnBorder: '#1f6a96',
        activeBtnText: '#eaffff',
        idleBtnBg: 'rgba(255,255,255,0.44)',
        idleBtnText: '#042a41',
        activeIconColor: '#c2e8ff',
        idleIconColor: '#365c73',
        toggleBtnBg: 'linear-gradient(180deg, rgba(234,255,255,0.94) 0%, rgba(194,232,255,0.92) 100%)',
        toggleBtnText: '#042a41',
        toggleBtnBorder: '#8db8d4',
        mutedLabelColor: '#365c73',
        thoughtColor: '#042a41',
        authorColor: '#004671',
        trashTextColor: '#8e242a',
        trashIconColor: '#a62a31',
      },
      dark: {
        railBg: 'linear-gradient(180deg, rgba(4,42,65,0.92) 0%, rgba(3,30,48,0.94) 58%, rgba(2,18,30,0.96) 100%)',
        railBorder: '#1d5678',
        railText: '#eaffff',
        brandSectionBg: 'linear-gradient(155deg, rgba(0,70,113,0.68) 0%, rgba(4,34,54,0.84) 100%)',
        navSectionBg: 'linear-gradient(180deg, rgba(4,42,65,0.58) 0%, rgba(2,24,38,0.74) 100%)',
        thoughtSectionBg: 'linear-gradient(155deg, rgba(6,52,80,0.70) 0%, rgba(3,28,44,0.86) 100%)',
        footerSectionBg: 'linear-gradient(180deg, rgba(4,38,60,0.78) 0%, rgba(2,20,33,0.92) 100%)',
        sectionBorder: 'rgba(114,152,175,0.24)',
        activeBtnBg: 'linear-gradient(155deg, #2b7ea8 0%, #00588c 52%, #004671 100%)',
        activeBtnBorder: '#72b8db',
        activeBtnText: '#eaffff',
        idleBtnBg: 'linear-gradient(180deg, rgba(16, 66, 98, 0.72) 0%, rgba(6, 36, 56, 0.88) 100%)',
        idleBtnText: '#c2e8ff',
        activeIconColor: '#eaffff',
        idleIconColor: '#98c7e0',
        toggleBtnBg: 'linear-gradient(180deg, #0d4b70 0%, #06324d 58%, #042133 100%)',
        toggleBtnText: '#eaffff',
        toggleBtnBorder: '#286f99',
        mutedLabelColor: '#7298af',
        thoughtColor: '#eaffff',
        authorColor: '#c2e8ff',
        trashTextColor: '#f08285',
        trashIconColor: '#eb6c70',
      },
    },
  },
  '4': {
    id: '4',
    name: 'Slate & Cobalt Loft',
    tagline: 'Dark Slate Grey #1F242D · Cobalt Blue #2563EB / #3B82F6 · Cool Ice Mist Light',
    lightBg: '#eef2f7',
    lightSurface: 'rgba(248, 250, 252, 0.90)',
    lightRaised: 'rgba(226, 232, 240, 0.92)',
    lightHeader: 'rgba(241, 245, 249, 0.90)',
    lightBorder: '#cbd5e1',
    lightInk: '#1e293b',
    lightMuted: '#475569',
    lightAccent: '#2563eb',
    lightAccentSoft: 'rgba(37, 99, 235, 0.14)',
    darkBg: '#13161c',
    darkSurface: 'rgba(24, 28, 36, 0.92)',
    darkRaised: 'rgba(36, 42, 54, 0.94)',
    darkHeader: 'rgba(19, 22, 28, 0.92)',
    darkBorder: '#374151',
    darkInk: '#f1f5f9',
    darkMuted: '#94a3b8',
    darkAccent: '#3b82f6',
    darkAccentSoft: 'rgba(59, 130, 246, 0.20)',
    shapeName: 'Architectural Loft',
    buttonRadius: '15px 15px 15px 4px',
    lightWallpaperUri: kabulLightWall,
    darkWallpaperUri: kabulDarkWall,
    sidebar: {
      light: {
        railBg: 'linear-gradient(180deg, rgba(248,250,252,0.92) 0%, rgba(241,245,249,0.90) 58%, rgba(226,232,240,0.94) 100%)',
        railBorder: '#cbd5e1',
        railText: '#1e293b',
        brandSectionBg: 'linear-gradient(155deg, rgba(255,255,255,0.92) 0%, rgba(226,232,240,0.82) 100%)',
        navSectionBg: 'linear-gradient(180deg, rgba(241,245,249,0.78) 0%, rgba(226,232,240,0.72) 100%)',
        thoughtSectionBg: 'linear-gradient(155deg, rgba(239,246,255,0.88) 0%, rgba(226,232,240,0.80) 100%)',
        footerSectionBg: 'linear-gradient(180deg, rgba(241,245,249,0.88) 0%, rgba(226,232,240,0.94) 100%)',
        sectionBorder: 'rgba(51,65,85,0.18)',
        activeBtnBg: 'linear-gradient(145deg, #2563eb 0%, #1d4ed8 54%, #1e3a8a 100%)',
        activeBtnBorder: '#60a5fa',
        activeBtnText: '#ffffff',
        idleBtnBg: 'rgba(255,255,255,0.52)',
        idleBtnText: '#1e293b',
        activeIconColor: '#dbeafe',
        idleIconColor: '#475569',
        toggleBtnBg: 'linear-gradient(180deg, rgba(248,250,252,0.94) 0%, rgba(226,232,240,0.94) 100%)',
        toggleBtnText: '#1e293b',
        toggleBtnBorder: '#cbd5e1',
        mutedLabelColor: '#64748b',
        thoughtColor: '#1e293b',
        authorColor: '#1d4ed8',
        trashTextColor: '#8e242a',
        trashIconColor: '#a62a31',
      },
      dark: {
        railBg: 'linear-gradient(180deg, rgba(22,26,34,0.94) 0%, rgba(17,20,27,0.96) 58%, rgba(12,15,20,0.98) 100%)',
        railBorder: '#374151',
        railText: '#f1f5f9',
        brandSectionBg: 'linear-gradient(155deg, rgba(36,42,54,0.72) 0%, rgba(20,24,31,0.90) 100%)',
        navSectionBg: 'linear-gradient(180deg, rgba(30,35,45,0.68) 0%, rgba(18,21,28,0.82) 100%)',
        thoughtSectionBg: 'linear-gradient(155deg, rgba(34,40,52,0.72) 0%, rgba(20,24,31,0.88) 100%)',
        footerSectionBg: 'linear-gradient(180deg, rgba(28,33,42,0.82) 0%, rgba(15,18,24,0.96) 100%)',
        sectionBorder: 'rgba(59,130,246,0.22)',
        activeBtnBg: 'linear-gradient(155deg, #3b82f6 0%, #2563eb 55%, #1d4ed8 100%)',
        activeBtnBorder: '#93c5fd',
        activeBtnText: '#ffffff',
        idleBtnBg: 'linear-gradient(180deg, rgba(43, 50, 64, 0.80) 0%, rgba(27, 31, 41, 0.92) 100%)',
        idleBtnText: '#e2e8f0',
        activeIconColor: '#eff6ff',
        idleIconColor: '#60a5fa',
        toggleBtnBg: 'linear-gradient(180deg, #2d3544 0%, #202632 58%, #151922 100%)',
        toggleBtnText: '#f1f5f9',
        toggleBtnBorder: '#475569',
        mutedLabelColor: '#94a3b8',
        thoughtColor: '#f1f5f9',
        authorColor: '#60a5fa',
        trashTextColor: '#f08285',
        trashIconColor: '#eb6c70',
      },
    },
  },
  '5': {
    id: '5',
    name: 'Forest Emerald & Gold',
    tagline: 'Deep Forest #002a23 · Champagne #d8c2aa · Brushed Gold · Obsidian #090e0e',
    lightBg: '#f5ede2',
    lightSurface: 'rgba(252, 248, 242, 0.88)',
    lightRaised: 'rgba(216, 194, 170, 0.72)',
    lightHeader: 'rgba(246, 238, 227, 0.88)',
    lightBorder: '#cab095',
    lightInk: '#002a23',
    lightMuted: '#2b5248',
    lightAccent: '#002a23',
    lightAccentSoft: 'rgba(0, 42, 35, 0.12)',
    darkBg: '#090e0e',
    darkSurface: 'rgba(5, 32, 27, 0.90)',
    darkRaised: 'rgba(0, 42, 35, 0.94)',
    darkHeader: 'rgba(6, 18, 16, 0.92)',
    darkBorder: '#134c40',
    darkInk: '#f2e7d9',
    darkMuted: '#d8c2aa',
    darkAccent: '#d1a854',
    darkAccentSoft: 'rgba(209, 168, 84, 0.16)',
    shapeName: 'Emerald Tab',
    buttonRadius: '8px 14px 8px 14px',
    lightWallpaperUri: emeraldGoldLightWall,
    darkWallpaperUri: emeraldGoldDarkWall,
    sidebar: {
      light: {
        railBg: 'linear-gradient(180deg, rgba(248,242,233,0.90) 0%, rgba(235,222,206,0.88) 58%, rgba(216,194,170,0.90) 100%)',
        railBorder: '#c8ad8f',
        railText: '#002a23',
        brandSectionBg: 'linear-gradient(155deg, rgba(253,250,245,0.90) 0%, rgba(232,216,198,0.80) 100%)',
        navSectionBg: 'linear-gradient(180deg, rgba(246,238,227,0.76) 0%, rgba(228,211,192,0.72) 100%)',
        thoughtSectionBg: 'linear-gradient(155deg, rgba(242,232,218,0.86) 0%, rgba(222,202,179,0.78) 100%)',
        footerSectionBg: 'linear-gradient(180deg, rgba(234,220,202,0.84) 0%, rgba(216,194,170,0.90) 100%)',
        sectionBorder: 'rgba(0,42,35,0.20)',
        activeBtnBg: 'linear-gradient(145deg, #003b31 0%, #002a23 100%)',
        activeBtnBorder: '#b48735',
        activeBtnText: '#f5ead9',
        idleBtnBg: 'rgba(255,255,255,0.44)',
        idleBtnText: '#002a23',
        activeIconColor: '#e4c173',
        idleIconColor: '#1f4f45',
        toggleBtnBg: 'linear-gradient(180deg, rgba(248,242,233,0.92) 0%, rgba(227,211,191,0.92) 100%)',
        toggleBtnText: '#002a23',
        toggleBtnBorder: '#bfa17f',
        mutedLabelColor: '#365e54',
        thoughtColor: '#002a23',
        authorColor: '#986e22',
        trashTextColor: '#8e242a',
        trashIconColor: '#a62a31',
      },
      dark: {
        railBg: 'linear-gradient(180deg, rgba(4,34,28,0.94) 0%, rgba(4,22,19,0.96) 58%, rgba(6,12,12,0.98) 100%)',
        railBorder: '#134c40',
        railText: '#f2e7d9',
        brandSectionBg: 'linear-gradient(155deg, rgba(0,42,35,0.82) 0%, rgba(6,14,13,0.90) 100%)',
        navSectionBg: 'linear-gradient(180deg, rgba(0,36,30,0.68) 0%, rgba(7,15,14,0.82) 100%)',
        thoughtSectionBg: 'linear-gradient(155deg, rgba(0,42,35,0.78) 0%, rgba(8,16,15,0.88) 100%)',
        footerSectionBg: 'linear-gradient(180deg, rgba(0,32,27,0.84) 0%, rgba(6,11,11,0.95) 100%)',
        sectionBorder: 'rgba(209,168,84,0.22)',
        activeBtnBg: 'linear-gradient(155deg, #d8b15e 0%, #b48632 55%, #8c621d 100%)',
        activeBtnBorder: '#ecd08c',
        activeBtnText: '#090e0e',
        idleBtnBg: 'linear-gradient(180deg, rgba(8, 56, 46, 0.78) 0%, rgba(3, 30, 25, 0.90) 100%)',
        idleBtnText: '#d8c2aa',
        activeIconColor: '#090e0e',
        idleIconColor: '#d1a854',
        toggleBtnBg: 'linear-gradient(180deg, #064035 0%, #032a23 58%, #021a16 100%)',
        toggleBtnText: '#e8d8c5',
        toggleBtnBorder: '#1c5f51',
        mutedLabelColor: '#b5a28c',
        thoughtColor: '#f2e7d9',
        authorColor: '#d1a854',
        trashTextColor: '#f28b8d',
        trashIconColor: '#ee6f73',
      },
    },
  },
};

export function getThemeMeta(designId?: string | null): ThemeMeta {
  const key = (designId || '1') as ThemeId;
  return THEME_META_MAP[key] || THEME_META_MAP['1'];
}
