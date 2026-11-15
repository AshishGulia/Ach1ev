import { DesignId } from '../../types';

export interface MakeNoteThemeConfig {
  id: DesignId;
  name: string;
  badge: string;
  subtitle: string;
  workspaceBg: string;
  headerBg: string;
  headerBorder: string;
  windowBg: string;
  windowBorder: string;
  windowHeaderBg: string;
  windowHeaderBorder: string;
  accentHex: string;
  accentLightHex: string;
  fontFamily: string;
  fontFamilyTitle: string;
  paperDefaultBg: string;
  paperDefaultColor: string;
  toolbarBg: string;
  toolbarBorder: string;
  isGlass?: boolean;
  isBroadsheet?: boolean;
  isTerminal?: boolean;
}

const UNIFIED_FONT = "'Alata', system-ui, -apple-system, sans-serif";

export const MAKE_NOTE_THEMES: Record<DesignId, MakeNoteThemeConfig> = {
  '1': {
    id: '1',
    name: 'Default',
    badge: 'Reading Room Desk',
    subtitle: 'Warm Bear Caramel & Soft Alabaster Paper Desk',
    workspaceBg: '#edece8',
    headerBg: '#f4f3ef',
    headerBorder: '#dedbd2',
    windowBg: '#fcfbf8',
    windowBorder: '#d9d5cb',
    windowHeaderBg: '#f3f1eb',
    windowHeaderBorder: '#dedbd2',
    accentHex: '#8f5f2c',
    accentLightHex: '#f3e7d4',
    fontFamily: UNIFIED_FONT,
    fontFamilyTitle: UNIFIED_FONT,
    paperDefaultBg: '#fcfbf8',
    paperDefaultColor: '#1e2227',
    toolbarBg: '#eae7df',
    toolbarBorder: '#dad5ca',
  },
  '2': {
    id: '2',
    name: 'Twilight Sunset',
    badge: 'Twilight Plum & Coral Desk',
    subtitle: 'Twilight Plum #473E66, Orchid #BD83B8 & Coral Peach #F1916D Desk',
    workspaceBg: '#161229',
    headerBg: '#1f1938',
    headerBorder: '#473e66',
    windowBg: '#1a1530',
    windowBorder: '#473e66',
    windowHeaderBg: '#272047',
    windowHeaderBorder: '#5a4e80',
    accentHex: '#f1916d',
    accentLightHex: '#f5d7db',
    fontFamily: UNIFIED_FONT,
    fontFamilyTitle: UNIFIED_FONT,
    paperDefaultBg: '#fff8fa',
    paperDefaultColor: '#2a1d3d',
    toolbarBg: '#211b3b',
    toolbarBorder: '#473e66',
  },
  '3': {
    id: '3',
    name: 'Oceanic Horizon',
    badge: 'Deep Ocean Study Desk',
    subtitle: 'Ice Mist #EAFFFF & Deep Ocean #004671 Coastal Horizon Desk',
    workspaceBg: '#042a41',
    headerBg: '#032033',
    headerBorder: '#1d5678',
    windowBg: '#04253a',
    windowBorder: '#1d5678',
    windowHeaderBg: '#063754',
    windowHeaderBorder: '#286f99',
    accentHex: '#7298af',
    accentLightHex: '#c2e8ff',
    fontFamily: UNIFIED_FONT,
    fontFamilyTitle: UNIFIED_FONT,
    paperDefaultBg: '#f6feff',
    paperDefaultColor: '#042a41',
    toolbarBg: '#05314c',
    toolbarBorder: '#1d5678',
  },
  '4': {
    id: '4',
    name: 'Turquoise & Kabul Loft',
    badge: 'Turquoise & Bronze Desk',
    subtitle: 'Bright Turquoise #21DAEF & Kabul Bronze #58423E Architectural Desk',
    workspaceBg: '#181110',
    headerBg: '#241a18',
    headerBorder: '#58423e',
    windowBg: '#1e1614',
    windowBorder: '#58423e',
    windowHeaderBg: '#2e221f',
    windowHeaderBorder: '#6e524c',
    accentHex: '#21daef',
    accentLightHex: '#e9fbfd',
    fontFamily: UNIFIED_FONT,
    fontFamilyTitle: UNIFIED_FONT,
    paperDefaultBg: '#f7feff',
    paperDefaultColor: '#2b1f1c',
    toolbarBg: '#261c1a',
    toolbarBorder: '#58423e',
  },
  '5': {
    id: '5',
    name: 'Forest Emerald & Gold',
    badge: 'Forest Evergreen & Gold Desk',
    subtitle: 'Deep Forest #002a23, Champagne #d8c2aa & Brushed Gold Writing Desk',
    workspaceBg: '#090e0e',
    headerBg: '#05201b',
    headerBorder: '#134c40',
    windowBg: '#06241e',
    windowBorder: '#134c40',
    windowHeaderBg: '#002a23',
    windowHeaderBorder: '#1d6354',
    accentHex: '#d1a854',
    accentLightHex: '#f5ede2',
    fontFamily: UNIFIED_FONT,
    fontFamilyTitle: UNIFIED_FONT,
    paperDefaultBg: '#fdfaf5',
    paperDefaultColor: '#002a23',
    toolbarBg: '#041f1a',
    toolbarBorder: '#134c40',
  },
};

const THEME_1_DARK_OVERRIDE: MakeNoteThemeConfig = {
  id: '1',
  name: 'Default',
  badge: 'Reading Room Desk',
  subtitle: 'Coal Dark Burnt Wood & Warm Parchment Desk',
  workspaceBg: '#110c09',
  headerBg: '#18110c',
  headerBorder: '#352317',
  windowBg: '#1b130d',
  windowBorder: '#382518',
  windowHeaderBg: '#231912',
  windowHeaderBorder: '#3f2b1e',
  accentHex: '#c49257',
  accentLightHex: '#2c1e14',
  fontFamily: UNIFIED_FONT,
  fontFamilyTitle: UNIFIED_FONT,
  paperDefaultBg: '#1c140e',
  paperDefaultColor: '#f0e5d5',
  toolbarBg: '#18110c',
  toolbarBorder: '#352317',
};

export const getMakeNoteTheme = (id?: DesignId, isDarkMode?: boolean): MakeNoteThemeConfig => {
  const resolvedDark =
    isDarkMode !== undefined
      ? isDarkMode
      : typeof document !== 'undefined' && document.documentElement.classList.contains('dark');
  const targetId: DesignId = id && MAKE_NOTE_THEMES[id] ? id : '1';
  if (targetId === '1' && resolvedDark) {
    return THEME_1_DARK_OVERRIDE;
  }
  return MAKE_NOTE_THEMES[targetId];
};
