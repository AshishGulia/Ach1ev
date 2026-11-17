import { useEffect, useRef, useState } from 'react';
import type { CSSProperties, FormEvent, ReactNode } from 'react';
import {
  BookOpen,
  Plus,
  Upload,
  FileText,
  Cloud,
  Trash2,
  Move,
  Check,
  X,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Palette,
  DoorClosed,
  DoorOpen,
  Eye,
  Sliders,
  FolderPlus,
  RefreshCw,
  Search,
  Lock,
  Unlock,
  Pencil,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Settings,
  Share2,
  Folder,
  Stethoscope,
  HeartPulse,
  Brain,
  Microscope,
  Pill,
  Syringe,
  Dna,
  FlaskConical,
  Bookmark,
  Star,
  GraduationCap,
  Shield,
} from 'lucide-react';
import type { BookThumbnailConfig, Notebook, MedicalBook, DesignId } from '../../types';
import { BookLogoBadge } from './BookLogoBadge';
import { BookThumbnailEditorModal } from './BookThumbnailEditorModal';
import { getDefaultThumbnail } from '../../data/thumbnailMeta';
import {
  resolveShelfThemeId,
  resolveShelfAssetCssUrl,
  getThemeAdaptedLook,
  getThemeAlmirahTrim,
  DayButterflies,
  ShelfTheme1BayWall,
  ForestSanctuaryBackdrop,
  BeachBalconyBackdrop,
  MonsoonRainBackdrop,
  PistachioObsidianBackdrop,
  ShelfThemeCarpet,
  ShelfThemeLamp,
  ShelfThemePlant,
  type ShelfThemeId,
} from './ShelfRoomWorlds';

/* ───────────── TYPES & DATA MODELS ───────────── */

export type Book = {
  id: string;
  title: string;
  cover: string;
  author?: string;
  edition?: string;
  pagesCount?: number;
  thumbnail?: BookThumbnailConfig;
};

export type ShelfFolder = {
  id: string;
  name: string;
  color: string;
  logoId: string;
  books: Book[];
  createdAt: string;
};

export type ShelfT = {
  id: string;
  name: string;
  books: Book[];
  folders?: ShelfFolder[];
};

export const FOLDER_COLORS = [
  '#9a3412',
  '#b45309',
  '#991b1b',
  '#1e3a8a',
  '#065f46',
  '#0f766e',
  '#6d28d9',
  '#be185d',
  '#334155',
  '#7c2d12',
  '#1d4ed8',
  '#18181b',
] as const;

export const FOLDER_LOGOS = [
  { id: 'folder', label: 'Folder', Icon: Folder },
  { id: 'book', label: 'Textbook', Icon: BookOpen },
  { id: 'stethoscope', label: 'Clinical', Icon: Stethoscope },
  { id: 'heart', label: 'Cardiology', Icon: HeartPulse },
  { id: 'brain', label: 'Neuro', Icon: Brain },
  { id: 'microscope', label: 'Pathology', Icon: Microscope },
  { id: 'pill', label: 'Pharma', Icon: Pill },
  { id: 'syringe', label: 'Surgery', Icon: Syringe },
  { id: 'dna', label: 'Genetics', Icon: Dna },
  { id: 'flask', label: 'Biochem', Icon: FlaskConical },
  { id: 'notes', label: 'Notes', Icon: FileText },
  { id: 'bookmark', label: 'Bookmark', Icon: Bookmark },
  { id: 'star', label: 'High-Yield', Icon: Star },
  { id: 'grad', label: 'MBBS', Icon: GraduationCap },
  { id: 'shield', label: 'Vault', Icon: Shield },
  { id: 'sparkles', label: 'Custom', Icon: Sparkles },
] as const;

export function getFolderLogoMeta(logoId: string) {
  return FOLDER_LOGOS.find((item) => item.id === logoId) || FOLDER_LOGOS[0]!;
}

export type AlmirahT = {
  id: string;
  name: string;
  design: string;
  shelves: ShelfT[];
  hasUpperDoor?: boolean;
};

export const DESIGNS = [
  'Dark Chocolate',
  'Creamy Caramel',
  'Vanilla White',
  'Mocha Espresso',
  'Vault',
] as const;

export type DesignName = (typeof DESIGNS)[number];

export const COVERS = [
  'Maroon',
  'Navy',
  'Forest',
  'Ochre',
  'Slate',
  'Cream',
  'Crimson',
  'Emerald',
  'Amber',
  'RoyalBlue',
  'Obsidian',
] as const;

export type UpperDoorType =
  | 'none'
  | 'fancy-walnut-glass'
  | 'fancy-caramel-glass'
  | 'arched-glass'
  | 'frameless-glass'
  | 'french-swing'
  | 'bypass-slide'
  | 'bifold-fold'
  | 'flip-up'
  | 'vault-dial';
export type LowerDoorType =
  | 'solid-wood-door'
  | 'none'
  | 'diamond-swing'
  | 'pocket-fluted'
  | 'classified-shutter'
  | 'drop-down'
  | 'bunker-slide';

export type Look = {
  name: string;
  frame: string;
  dark: string;
  back: string;
  plank: string;
  door: 'glass' | 'window' | 'solid' | 'rattan' | 'split-glass' | 'wood' | 'translucent-glass' | 'vault';
  upperDoorType: UpperDoorType;
  lowerDoorType: LowerDoorType;
  face: string;
  handle: string;
  knob: boolean;
  light: boolean;
  grain: number;
  wallType: 'charcoal-slats' | 'cream-panel' | 'dark-taupe' | 'warm-taupe' | 'classic-oak';
  legs: 'tapered-wood' | 'metal-pin' | 'peg-walnut' | 'block-base';
  accentDesc: string;
  hasUpperDoor: boolean;
  isVault?: boolean;
  opaque?: boolean;
  isWoodDoors?: boolean;
  hasSlideBars?: boolean;
  isClassifiedShutter?: boolean;
  isCapsule?: boolean;
  isArched?: boolean;
};

const LOOK_DARK_CHOCOLATE: Look = {
  name: 'Classic Walnut',
  frame: '#512d18',
  dark: '#2b1509',
  back: '#221007',
  plank: '#653a1f',
  door: 'glass',
  upperDoorType: 'none',
  lowerDoorType: 'none',
  face: '#512d18',
  handle: '#d4af37',
  knob: false,
  light: false,
  grain: 0.44,
  wallType: 'dark-taupe',
  legs: 'block-base',
  accentDesc: 'Polished Royal Walnut · Smooth rounded-corner open bookcase with dark plinth base & zero doors',
  hasUpperDoor: false,
  hasSlideBars: true,
  isCapsule: true,
};

const LOOK_CREAMY_CARAMEL: Look = {
  name: 'Creamy Caramel',
  frame: '#9b6234',
  dark: '#5e3516',
  back: '#7a4923',
  plank: '#b47642',
  door: 'glass',
  upperDoorType: 'bifold-fold',
  lowerDoorType: 'solid-wood-door',
  face: '#8e572b',
  handle: '#4b2a17',
  knob: true,
  light: false,
  grain: 0.28,
  wallType: 'charcoal-slats',
  legs: 'tapered-wood',
  accentDesc: 'Asymmetric Natural Caramel · Organic wavy CSS grain (lower solid wood) & crystal clear bi-fold glass doors (upper)',
  hasUpperDoor: true,
  hasSlideBars: true,
  isCapsule: true,
};

const LOOK_VANILLA_WHITE: Look = {
  name: 'Vanilla White',
  frame: '#f4f0e8',
  dark: '#d5cdc0',
  back: '#ebe5d8',
  plank: '#e6dfd1',
  door: 'glass',
  upperDoorType: 'bifold-fold',
  lowerDoorType: 'classified-shutter',
  face: '#f9f7f2',
  handle: '#78716c',
  knob: false,
  light: true,
  grain: 0,
  wallType: 'cream-panel',
  legs: 'tapered-wood',
  accentDesc: 'Smooth matte vanilla cream · Bi-fold clear glass doors (upper) & clean rolling shutter (lower)',
  hasUpperDoor: true,
  hasSlideBars: true,
  isClassifiedShutter: true,
};

const LOOK_MOCHA_ESPRESSO: Look = {
  name: 'Mocha Espresso',
  frame: '#333640',
  dark: '#1b1d24',
  back: '#12141a',
  plank: '#434856',
  door: 'split-glass',
  upperDoorType: 'arched-glass',
  lowerDoorType: 'drop-down',
  face: '#2b2e37',
  handle: '#e5d4bc',
  knob: false,
  light: false,
  grain: 0,
  wallType: 'warm-taupe',
  legs: 'peg-walnut',
  accentDesc: 'Roman Arched Basalt Slate · Curved arched glass doors (upper), drop-down slate glass (lower) & peg legs',
  hasUpperDoor: true,
  hasSlideBars: true,
  isArched: true,
};

const LOOK_VAULT: Look = {
  name: 'Vault',
  frame: '#101217',
  dark: '#050608',
  back: '#030406',
  plank: '#161920',
  door: 'vault',
  upperDoorType: 'vault-dial',
  lowerDoorType: 'bunker-slide',
  face: '#0b0d11',
  handle: '#d4af37',
  knob: true,
  light: false,
  grain: 0.0,
  wallType: 'classic-oak',
  legs: 'block-base',
  accentDesc: 'Deep obsidian forged black steel bank vault · Combination dial vault door (upper) & armored bunker panels (lower)',
  hasUpperDoor: true,
  isVault: true,
  opaque: true,
  hasSlideBars: true,
};

export const LOOKS: Record<string, Look> = {
  'Dark Chocolate': LOOK_DARK_CHOCOLATE,
  'Creamy Caramel': LOOK_CREAMY_CARAMEL,
  'Vanilla White': LOOK_VANILLA_WHITE,
  'Mocha Espresso': LOOK_MOCHA_ESPRESSO,
  Vault: LOOK_VAULT,
  'Smoked Onyx': LOOK_VAULT,
  // Backward-compatibility aliases for older saved storage:
  'Dark wood classic': LOOK_DARK_CHOCOLATE,
  'Natural oak wood': LOOK_CREAMY_CARAMEL,
  'Paige frosty white': LOOK_VANILLA_WHITE,
  'Steel bank vault': LOOK_VAULT,
  'Teakwood glass': LOOK_DARK_CHOCOLATE,
  'White glass doors': LOOK_VANILLA_WHITE,
  'Twin dark wood': LOOK_MOCHA_ESPRESSO,
  'Oak and white': LOOK_CREAMY_CARAMEL,
  'Amber teak classic': LOOK_CREAMY_CARAMEL,
};

export const COVER: Record<string, { from: string; to: string; edge: string; ink: string }> = {
  Maroon: { from: '#881337', to: '#4c0519', edge: '#330310', ink: '#ffe4e6' },
  Navy: { from: '#1e3a8a', to: '#0f172a', edge: '#090d16', ink: '#e0f2fe' },
  Forest: { from: '#064e3b', to: '#022c22', edge: '#011a14', ink: '#d1fae5' },
  Ochre: { from: '#9a3412', to: '#431407', edge: '#2b0c04', ink: '#ffedd5' },
  Slate: { from: '#334155', to: '#0f172a', edge: '#090d16', ink: '#f1f5f9' },
  Cream: { from: '#fef3c7', to: '#d97706', edge: '#92400e', ink: '#451a03' },
  Crimson: { from: '#991b1b', to: '#5a0a0a', edge: '#380606', ink: '#fef2f2' },
  Emerald: { from: '#047857', to: '#064e3b', edge: '#022c22', ink: '#ecfdf5' },
  Amber: { from: '#b45309', to: '#78350f', edge: '#451a03', ink: '#fffbeb' },
  RoyalBlue: { from: '#1d4ed8', to: '#1e3a8a', edge: '#172554', ink: '#eff6ff' },
  Obsidian: { from: '#27272a', to: '#09090b', edge: '#000000', ink: '#fafafa' },
};

let counter = 0;
export const uid = () => `${Date.now().toString(36)}${(counter += 1)}`;

export const mk = (
  name: string,
  titles: Array<[string, string]>,
  folders?: ShelfFolder[]
): ShelfT => ({
  id: uid(),
  name,
  books: titles.map(([title, cover]) => ({ id: uid(), title, cover })),
  folders: folders ?? [],
});

export const seed = (): AlmirahT[] => [
  {
    id: 'alm-dark-chocolate',
    name: 'Classic Walnut',
    design: 'Dark Chocolate',
    hasUpperDoor: false,
    shelves: [
      mk('Section 1', []),
      mk('Section 2', []),
      mk('Lower Section', []),
    ],
  },
];

export const KEY = 'medden_shelf_room_v6';

function migrateAlmirah(a: AlmirahT): AlmirahT {
  const isLegacyOnyx = a.design === 'Smoked Onyx' || a.id === 'alm-smoked-onyx';
  const resolvedDesign = isLegacyOnyx ? 'Vault' : a.design;
  const designDefaultDoor = LOOKS[resolvedDesign]?.hasUpperDoor ?? true;
  return {
    ...a,
    id: a.id === 'alm-smoked-onyx' ? 'alm-vault' : a.id,
    name: a.name === 'Smoked Onyx' ? 'Vault' : a.name,
    design: resolvedDesign,
    hasUpperDoor: resolvedDesign === 'Dark Chocolate' ? false : (a.hasUpperDoor !== undefined ? a.hasUpperDoor : designDefaultDoor),
    shelves: (a.shelves || [])
      .filter(
        (s) =>
          !(
            s.name === 'Section 3' &&
            (!s.books || s.books.length === 0) &&
            (!s.folders || s.folders.length === 0)
          )
      )
      .map((s, idx) => {
        const legacyNames = new Set([
          'Lower Vault Section',
          'Lower Classified Section',
          'Lower Espresso Bay',
          'Lower Security Bay',
          'Vault Chamber 1',
          'Vault Chamber 2',
          'Vault Chamber 3',
        ]);
        const folderList = Array.isArray(s.folders) ? s.folders : [];
        if (legacyNames.has(s.name)) {
          return {
            id: s.id,
            name: s.name.startsWith('Lower') ? 'Lower Section' : `Section ${idx + 1}`,
            books: s.books || [],
            folders: folderList,
          };
        }
        return {
          id: s.id,
          name: s.name,
          books: s.books || [],
          folders: folderList,
        };
      }),
  };
}

export function useStored(): [AlmirahT[], (next: AlmirahT[]) => void] {
  const [value, setValue] = useState<AlmirahT[]>(seed);
  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY) ?? localStorage.getItem('medden_shelf_room_v5');
      if (raw !== null) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          let migrated = (parsed as AlmirahT[]).map(migrateAlmirah);
          const legacySeedIds = new Set([
            'alm-dark-chocolate',
            'alm-creamy-caramel',
            'alm-vanilla-white',
            'alm-mocha-espresso',
            'alm-vault',
          ]);
          const isOldFiveSeeds =
            migrated.length === 5 && migrated.every((m) => legacySeedIds.has(m.id));
          if (isOldFiveSeeds) {
            const nonEmptyExtra = migrated
              .slice(1)
              .filter((m) =>
                m.shelves.some((s) => s.books.length > 0 || (s.folders?.length ?? 0) > 0)
              );
            migrated = [migrated[0]!, ...nonEmptyExtra];
          }
          setValue(migrated);
          localStorage.setItem(KEY, JSON.stringify(migrated));
        }
      }
    } catch {
      /* keep seed */
    }
  }, []);

  return [
    value,
    (next) => {
      setValue(next);
      try {
        localStorage.setItem(KEY, JSON.stringify(next));
      } catch (err) {
        console.error('Failed to save almirahs to localStorage', err);
      }
    },
  ];
}

/* ───────────── STYLES & ANIMATIONS ───────────── */

export const FLOOR = 130;

const WOOD_SWIRL_SVG = encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="180" height="120" viewBox="0 0 180 120"><g fill="none" stroke-linecap="round"><path d="M0 12 Q42 4 86 15 T180 10" stroke="rgba(0,0,0,0.42)" stroke-width="1.6"/><path d="M0 26 Q55 38 102 22 T180 28" stroke="rgba(255,228,196,0.16)" stroke-width="1.2"/><path d="M0 44 Q38 28 78 46 T180 42" stroke="rgba(0,0,0,0.38)" stroke-width="2"/><ellipse cx="64" cy="60" rx="22" ry="7" stroke="rgba(0,0,0,0.45)" stroke-width="1.5"/><ellipse cx="64" cy="60" rx="11" ry="3.2" stroke="rgba(255,228,196,0.18)" stroke-width="1.1"/><path d="M0 78 Q48 92 96 74 T180 80" stroke="rgba(0,0,0,0.4)" stroke-width="1.7"/><path d="M0 98 Q40 84 90 100 T180 95" stroke="rgba(255,228,196,0.15)" stroke-width="1.3"/><path d="M0 112 Q60 104 120 114 T180 110" stroke="rgba(0,0,0,0.34)" stroke-width="1.5"/><ellipse cx="142" cy="36" rx="16" ry="5.5" stroke="rgba(0,0,0,0.36)" stroke-width="1.2"/></g></svg>`
);

const NON_WOOD_STONE_SVG = encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 60 60"><g fill="none" stroke="rgba(255,255,255,0.055)" stroke-width="0.7"><path d="M0 15 H60 M0 30 H60 M0 45 H60 M15 0 V60 M30 0 V60 M45 0 V60"/><circle cx="20" cy="20" r="1.1" fill="rgba(255,255,255,0.06)"/><circle cx="48" cy="40" r="0.9" fill="rgba(0,0,0,0.22)"/></g></svg>`
);

function hexAlpha(hex: string, alpha: number): string {
  const clean = hex.trim().replace('#', '');
  if (clean.length === 3) {
    const r = parseInt(clean[0]! + clean[0]!, 16);
    const g = parseInt(clean[1]! + clean[1]!, 16);
    const b = parseInt(clean[2]! + clean[2]!, 16);
    return `rgba(${r},${g},${b},${alpha})`;
  }
  if (clean.length >= 6) {
    const r = parseInt(clean.slice(0, 2), 16);
    const g = parseInt(clean.slice(2, 4), 16);
    const b = parseInt(clean.slice(4, 6), 16);
    return `rgba(${r},${g},${b},${alpha})`;
  }
  return hex;
}

export function grain(alpha: number, isBasalt = false): string {
  if (isBasalt) {
    return `url("data:image/svg+xml,${NON_WOOD_STONE_SVG}"), radial-gradient(circle at 25% 30%, rgba(255,255,255,0.07), transparent 55%), `;
  }
  if (alpha <= 0) return '';
  return `url("data:image/svg+xml,${WOOD_SWIRL_SVG}"), repeating-linear-gradient(92deg, rgba(0,0,0,${(alpha * 0.55).toFixed(2)}) 0 1px, transparent 1px 11px, rgba(255,235,205,${(alpha * 0.22).toFixed(2)}) 11px 12px, transparent 12px 24px), `;
}

export function getWoodSurfaceStyle(
  look: Pick<Look, 'name' | 'grain' | 'frame' | 'dark' | 'plank' | 'back' | 'isVault'>,
  orientation: 'h' | 'v' | 'panel' = 'h',
  variant: 'frame' | 'plank' | 'back' | 'door' | 'plinth' = 'frame',
  gradDir = '180deg',
): CSSProperties {
  if (look.isVault) {
    const steelFile =
      orientation === 'v'
        ? 'vault-steel-v.jpg'
        : orientation === 'panel'
          ? 'vault-steel-panel.jpg'
          : 'vault-steel-h.jpg';
    const steelUrl = resolveShelfAssetCssUrl(steelFile);

    if (variant === 'back') {
      return {
        backgroundColor: look.back,
        backgroundImage: `linear-gradient(180deg, rgba(2,3,5,0.88) 0%, rgba(8,10,14,0.72) 45%, rgba(1,2,3,0.92) 100%), ${steelUrl}`,
        backgroundSize: '100% 100%, 420px auto',
        backgroundRepeat: 'no-repeat, repeat',
        backgroundPosition: 'center, center top',
      };
    }

    if (variant === 'plank') {
      return {
        backgroundColor: look.plank,
        backgroundImage: `linear-gradient(180deg, rgba(148,163,184,0.12) 0%, rgba(14,17,22,0.78) 24%, rgba(3,4,6,0.92) 100%), ${steelUrl}`,
        backgroundSize: '100% 100%, 420px 100%',
        backgroundRepeat: 'no-repeat, repeat-x',
        backgroundPosition: 'center, left center',
      };
    }

    const metalSheen =
      orientation === 'v'
        ? `linear-gradient(${gradDir}, rgba(148,163,184,0.08) 0%, rgba(12,14,18,0.74) 42%, rgba(3,4,6,0.9) 100%)`
        : variant === 'door'
          ? `linear-gradient(${gradDir}, rgba(148,163,184,0.09) 0%, rgba(10,12,16,0.72) 46%, rgba(2,3,5,0.9) 100%)`
          : `linear-gradient(${gradDir}, rgba(148,163,184,0.09) 0%, rgba(12,14,19,0.76) 46%, rgba(3,4,6,0.92) 100%)`;

    return {
      backgroundColor: look.frame,
      backgroundImage: `${metalSheen}, ${steelUrl}`,
      backgroundSize:
        orientation === 'v'
          ? '100% 100%, 100% 340px'
          : variant === 'door'
            ? '100% 100%, 360px 260px'
            : '100% 100%, 480px 100%',
      backgroundRepeat:
        orientation === 'v'
          ? 'no-repeat, repeat-y'
          : variant === 'door'
            ? 'no-repeat, repeat'
            : 'no-repeat, repeat-x',
      backgroundPosition: 'center, center center',
    };
  }

  if (look.grain <= 0) {
    const baseA = variant === 'plank' ? look.plank : variant === 'back' ? look.back : look.frame;
    return {
      backgroundColor: baseA,
      backgroundImage: `${grain(look.grain, look.name === 'Mocha Espresso')}linear-gradient(${gradDir}, ${baseA}, ${look.dark})`,
      backgroundSize: '100% 100%',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
    };
  }

  /* Almira 2 (Creamy Caramel): Asymmetric Natural Burl & Organic Flowing Wood Pattern */
  if (look.name === 'Creamy Caramel') {
    const isVert = orientation === 'v';
    const isPanel = orientation === 'panel';
    const angleA = isVert ? '84deg' : isPanel ? '17deg' : '-6deg';
    const angleB = isVert ? '98deg' : isPanel ? '-11deg' : '8deg';
    const asymRings =
      'radial-gradient(ellipse 31% 69% at 19% 27%, rgba(78,34,9,0.22) 0%, rgba(162,92,38,0.10) 44%, transparent 74%), ' +
      'radial-gradient(ellipse 46% 52% at 79% 66%, rgba(68,28,7,0.19) 0%, rgba(238,184,116,0.13) 48%, transparent 76%), ' +
      'radial-gradient(ellipse 24% 82% at 44% 83%, rgba(96,46,16,0.15) 0%, transparent 68%), ' +
      'radial-gradient(ellipse 38% 36% at 86% 18%, rgba(252,212,158,0.14) 0%, transparent 72%)';
    const organicWaveA = `repeating-linear-gradient(${angleA}, rgba(66,30,8,0.12) 0px, rgba(66,30,8,0.12) 1.5px, transparent 1.5px, transparent 11px, rgba(246,198,136,0.09) 11px, rgba(246,198,136,0.09) 15px, transparent 15px, transparent 27px)`;
    const organicWaveB = `repeating-linear-gradient(${angleB}, rgba(112,56,20,0.09) 0px, transparent 6px, rgba(255,224,182,0.07) 19px, rgba(56,24,6,0.09) 31px, transparent 41px)`;
    if (variant === 'back') {
      return {
        backgroundColor: look.back,
        backgroundImage: `linear-gradient(172deg, rgba(42,18,5,0.54) 0%, rgba(128,76,36,0.20) 44%, rgba(38,16,4,0.58) 100%), ${asymRings}, ${organicWaveA}`,
        backgroundSize: '100% 100%, 310px 265px, 100% 100%',
        backgroundRepeat: 'no-repeat, repeat, no-repeat',
        backgroundPosition: 'center, 14% 28%, center',
      };
    }
    if (variant === 'plank') {
      return {
        backgroundColor: look.plank,
        backgroundImage: `linear-gradient(178deg, rgba(255,246,226,0.36) 0%, rgba(255,226,184,0.12) 24%, transparent 52%, rgba(56,26,8,0.34) 100%), ${asymRings}, ${organicWaveA}, ${organicWaveB}`,
        backgroundSize: '100% 100%, 340px 180px, 100% 100%, 100% 100%',
        backgroundRepeat: 'no-repeat, repeat, no-repeat, no-repeat',
        backgroundPosition: 'center, 22% 50%, center, center',
      };
    }
    return {
      backgroundColor: look.frame,
      backgroundImage: `linear-gradient(${gradDir}, rgba(255,240,214,0.22) 0%, transparent 48%, rgba(48,20,5,0.30) 100%), ${asymRings}, ${organicWaveA}, ${organicWaveB}`,
      backgroundSize: '100% 100%, 330px 290px, 100% 100%, 100% 100%',
      backgroundRepeat: 'no-repeat, repeat, no-repeat, no-repeat',
      backgroundPosition: 'center, 27% 63%, center, center',
    };
  }

  const isCaramelOak = look.grain <= 0.34;
  const imgFile = isCaramelOak
    ? orientation === 'v'
      ? 'wood-oak-v.jpg'
      : orientation === 'panel'
        ? 'wood-oak-panel.jpg'
        : 'wood-oak-h.jpg'
    : orientation === 'v'
      ? 'wood-walnut-v.jpg'
      : orientation === 'panel'
        ? 'wood-walnut-panel.jpg'
        : 'wood-walnut-h.jpg';

  const photoUrl = resolveShelfAssetCssUrl(imgFile);

  if (variant === 'back') {
    const topShade = hexAlpha(look.back, isCaramelOak ? 0.38 : 0.46);
    const edgeShade = hexAlpha(look.dark, isCaramelOak ? 0.52 : 0.68);
    const innerGloss = isCaramelOak ? 'rgba(255, 240, 212, 0.14)' : 'rgba(255, 224, 180, 0.10)';
    return {
      backgroundColor: look.back,
      backgroundImage: `linear-gradient(135deg, ${innerGloss} 0%, transparent 38%, rgba(0,0,0,0.22) 100%), linear-gradient(180deg, ${edgeShade} 0%, ${topShade} 36%, ${edgeShade} 100%), ${photoUrl}`,
      backgroundSize: '100% 100%, 100% 100%, 420px auto',
      backgroundRepeat: 'no-repeat, no-repeat, repeat',
      backgroundPosition: 'center, center, center top',
      filter: 'contrast(1.06) saturate(1.1)',
    };
  }

  if (variant === 'plank') {
    const lacquerHighlight = isCaramelOak
      ? 'linear-gradient(180deg, rgba(255,248,232,0.44) 0%, rgba(255,235,200,0.16) 18%, transparent 45%, rgba(0,0,0,0.28) 100%)'
      : 'linear-gradient(180deg, rgba(255,238,210,0.34) 0%, rgba(255,220,175,0.12) 18%, transparent 46%, rgba(0,0,0,0.36) 100%)';
    const sheenSweep =
      'linear-gradient(105deg, transparent 15%, rgba(255,250,235,0.16) 36%, rgba(255,250,235,0.03) 54%, transparent 78%)';
    const tintTop = hexAlpha(look.plank, isCaramelOak ? 0.14 : 0.18);
    const tintBot = hexAlpha(look.dark, isCaramelOak ? 0.28 : 0.36);
    return {
      backgroundColor: look.plank,
      backgroundImage: `${lacquerHighlight}, ${sheenSweep}, linear-gradient(180deg, ${tintTop} 0%, ${tintBot} 100%), ${photoUrl}`,
      backgroundSize: '100% 100%, 100% 100%, 100% 100%, 440px 100%',
      backgroundRepeat: 'no-repeat, no-repeat, no-repeat, repeat-x',
      backgroundPosition: 'center, center, center, left center',
      filter: 'contrast(1.09) saturate(1.15)',
    };
  }

  const tintA = hexAlpha(look.frame, isCaramelOak ? 0.16 : 0.22);
  const tintB = hexAlpha(look.dark, isCaramelOak ? 0.30 : 0.42);
  const satinPolish =
    orientation === 'v'
      ? `linear-gradient(${gradDir}, rgba(255,246,228,0.26) 0%, rgba(255,236,204,0.07) 26%, transparent 52%, rgba(0,0,0,0.28) 100%)`
      : `linear-gradient(${gradDir}, rgba(255,246,228,0.28) 0%, rgba(255,236,204,0.09) 28%, transparent 54%, rgba(0,0,0,0.3) 100%)`;
  const glaze = `linear-gradient(${gradDir}, ${tintA} 0%, ${tintB} 100%)`;

  return {
    backgroundColor: look.frame,
    backgroundImage: `${satinPolish}, ${glaze}, ${photoUrl}`,
    backgroundSize:
      orientation === 'v'
        ? '100% 100%, 100% 100%, 100% 340px'
        : variant === 'door'
          ? '100% 100%, 100% 100%, 340px 220px'
          : '100% 100%, 100% 100%, 480px 100%',
    backgroundRepeat:
      orientation === 'v'
        ? 'no-repeat, no-repeat, repeat-y'
        : variant === 'door'
          ? 'no-repeat, no-repeat, repeat'
          : 'no-repeat, no-repeat, repeat-x',
    backgroundPosition: 'center, center, center center',
    filter: 'contrast(1.08) saturate(1.14)',
  };
}

export const CSS = `
.sh-scroll { scrollbar-width: thin; scrollbar-color: rgba(180,140,85,0.45) transparent; }
.sh-scroll::-webkit-scrollbar { height: 5px; }
.sh-scroll::-webkit-scrollbar-track { background: transparent; }
.sh-scroll::-webkit-scrollbar-thumb { background: rgba(180,140,85,0.45); border-radius: 99px; }
.sh-scroll::-webkit-scrollbar-thumb:hover { background: rgba(180,140,85,0.8); }

.sh-scroll-v { scrollbar-width: thin; scrollbar-color: rgba(180,140,85,0.5) rgba(0,0,0,0.12); }
.sh-scroll-v::-webkit-scrollbar { width: 6px; }
.sh-scroll-v::-webkit-scrollbar-track { background: rgba(0,0,0,0.08); border-radius: 99px; }
.sh-scroll-v::-webkit-scrollbar-thumb { background: rgba(180,140,85,0.55); border-radius: 99px; }
.sh-scroll-v::-webkit-scrollbar-thumb:hover { background: rgba(180,140,85,0.85); }

.sh-slide-range {
  -webkit-appearance: none;
  appearance: none;
  height: 4px;
  border-radius: 999px;
  outline: none;
  cursor: pointer;
}
.sh-slide-range::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 14px;
  height: 10px;
  border-radius: 4px;
  background: linear-gradient(180deg, #fef08a 0%, #d4af37 60%, #92400e 100%);
  border: 1px solid rgba(0,0,0,0.55);
  box-shadow: 0 1px 3px rgba(0,0,0,0.45);
  cursor: grab;
}

.sh-cat {
  position: absolute;
  bottom: 20px;
  width: 118px;
  height: 70px;
  z-index: 24;
  cursor: pointer;
  user-select: none;
  transition: left 9.2s cubic-bezier(0.22, 0.1, 0.25, 1), transform 0.55s ease;
}
.sh-cat:hover {
  filter: drop-shadow(0 6px 12px rgba(217, 119, 6, 0.42));
}
.sh-leg {
  transform-box: fill-box;
  transform-origin: 50% 0;
  animation: sh-leg 1.1s ease-in-out infinite alternate;
}
.sh-leg.b {
  animation-delay: -0.55s;
}
@keyframes sh-leg {
  from { transform: rotate(22deg); }
  to { transform: rotate(-22deg); }
}
.sh-tail {
  transform-box: fill-box;
  transform-origin: 100% 100%;
  animation: sh-tail 2s ease-in-out infinite alternate;
}
@keyframes sh-tail {
  from { transform: rotate(-10deg); }
  to { transform: rotate(14deg); }
}
.sh-bob {
  animation: sh-bob 0.55s ease-in-out infinite alternate;
}
@keyframes sh-bob {
  to { transform: translateY(-2px); }
}

.sh-book-item {
  transition: transform 0.22s cubic-bezier(0.2, 0.9, 0.3, 1), box-shadow 0.22s, filter 0.22s;
}
.sh-book-item:hover {
  transform: translateY(-8px) scale(1.04);
  box-shadow: 0 12px 18px -4px rgba(0,0,0,0.65), inset -2px 0 0 rgba(255,255,255,0.45);
  filter: brightness(1.12);
  z-index: 15;
}

.sh-folder-item {
  transition: transform 0.22s cubic-bezier(0.2, 0.9, 0.3, 1), filter 0.22s;
}
.sh-folder-item:hover {
  transform: translateY(-6px) scale(1.03);
  filter: drop-shadow(0 10px 14px rgba(0,0,0,0.48));
  z-index: 16;
}

.sh-zoom-stage {
  width: 100%;
  overflow: auto;
  touch-action: pan-x pan-y pinch-zoom;
  -webkit-overflow-scrolling: touch;
}

.sh-almirah-wrap {
  position: relative;
  margin: 0 auto;
  width: min(23.8rem, 44%);
  pointer-events: auto;
  transition: filter .7s, width .25s ease;
}

.sh-stile {
  width: 19px;
  flex: none;
}

.sh-world-shell {
  min-height: 540px;
  padding-top: 40px;
}

@media (max-width: 768px) {
  .sh-world-shell {
    min-height: 430px !important;
    padding-top: 44px !important;
  }
  .sh-celestial-orb {
    top: 14px !important;
    transform: scale(0.62);
    transform-origin: top center;
  }
  .sh-almirah-wrap {
    width: 70% !important;
  }
  .sh-stile {
    width: 9px !important;
  }
  .sh-room-lamp {
    left: 1.5% !important;
    transform: scale(0.46);
    transform-origin: bottom left;
    opacity: 0.72;
  }
  .sh-room-plant {
    right: -2% !important;
    transform: scale(0.48);
    transform-origin: bottom right;
    opacity: 0.78;
  }
}
`;

/* ───────────── BEIGE FUR-LIKE CARPET (SINGLE TONE WOODEN SHADE) ───────────── */

export function BeigeFurCarpet({
  night,
  lit,
  themeId = '1',
}: {
  night: boolean;
  lit: boolean;
  themeId?: ShelfThemeId;
}) {
  return <ShelfThemeCarpet night={night} lit={lit} themeId={themeId} />;
}

/* ───────────── ULTRA-REALISTIC ROOM DETAILS ───────────── */

export function Room({
  night,
  lit,
  pulled,
  onPull,
  design: _design,
  bayIdx = 0,
  themeId = '1',
  children,
}: {
  night: boolean;
  lit: boolean;
  pulled: boolean;
  onPull: () => void;
  design: string;
  bayIdx?: number;
  themeId?: ShelfThemeId;
  children: ReactNode;
}) {
  const abs = (s: CSSProperties): CSSProperties => ({ position: 'absolute', ...s });

  const floorBg = (() => {
    switch (themeId) {
      case '2':
        return night
          ? 'linear-gradient(180deg, rgba(0,0,0,0.68), rgba(0,0,0,0.32) 35%), repeating-linear-gradient(90deg, #151c17 0 130px, #0b100d 130px 132px)'
          : 'linear-gradient(180deg, rgba(0,0,0,0.24), transparent 35%), repeating-linear-gradient(90deg, #6d6146 0 130px, #584e37 130px 132px)';
      case '3':
        return night
          ? 'linear-gradient(180deg, rgba(0,0,0,0.52), rgba(0,0,0,0.2) 35%), repeating-linear-gradient(90deg, #27323c 0 130px, #1b242c 130px 132px)'
          : 'linear-gradient(180deg, rgba(0,0,0,0.14), transparent 35%), repeating-linear-gradient(90deg, #d7cbb8 0 130px, #c2b49d 130px 132px)';
      case '4':
        return night
          ? 'linear-gradient(180deg, rgba(8,14,24,0.62), rgba(0,0,0,0.26) 40%), repeating-linear-gradient(90deg, #252e3a 0 110px, #19202a 110px 113px)'
          : 'linear-gradient(180deg, rgba(35,45,58,0.3), rgba(255,255,255,0.06) 35%, transparent 60%), repeating-linear-gradient(90deg, #6b727d 0 110px, #545b65 110px 113px)';
      case '5':
        return night
          ? 'linear-gradient(180deg, rgba(0,0,0,0.62), rgba(0,0,0,0.26) 35%), repeating-linear-gradient(90deg, #16171a 0 120px, #0c0d0f 120px 122px)'
          : 'linear-gradient(180deg, rgba(0,0,0,0.12), transparent 35%), repeating-linear-gradient(90deg, #e2ecd3 0 120px, #ceddb8 120px 122px)';
      default:
        return night
          ? 'linear-gradient(180deg, rgba(0,0,0,0.55), rgba(0,0,0,0.2) 35%), repeating-linear-gradient(90deg, #573a21 0 130px, #422915 130px 132px)'
          : 'linear-gradient(180deg, rgba(0,0,0,0.3), transparent 35%), repeating-linear-gradient(90deg, #996939 0 130px, #7c5127 130px 132px)';
    }
  })();

  const baseboardBg = (() => {
    if (night) {
      if (themeId === '4') return 'linear-gradient(#263140, #121821)';
      if (themeId === '2') return 'linear-gradient(#111a14, #070b08)';
      if (themeId === '5') return 'linear-gradient(#1a1b1f, #0b0c0e)';
      return 'linear-gradient(#3a332d, #1c1815)';
    }
    if (themeId === '4') return 'linear-gradient(#e5edf5, #b8c6d6)';
    if (themeId === '2') return 'linear-gradient(#ebf2ec, #c2d1c6)';
    if (themeId === '5') return 'linear-gradient(#f7faef, #dce7ca)';
    return 'linear-gradient(#f7f2eb, #d6cbba)';
  })();

  return (
    <div
      className="shelf-world-root sh-world-shell"
      style={{
        position: 'relative',
        isolation: 'isolate',
        overflow: 'hidden',
        borderRadius: 12,
        border: '1px solid rgba(0,0,0,.2)',
        paddingBottom: FLOOR - 32,
        background: '#111418',
        boxShadow: 'inset 0 0 100px rgba(0,0,0,0.5)',
        touchAction: 'pan-x pan-y pinch-zoom',
      }}
    >
      {/* 1. ROOM WALL / WORLD BACKDROP (5 Themes x 5 Almirah Bays = 25 Zero-Repeat Backdrops) */}
      {themeId === '1' ? (
        <ShelfTheme1BayWall night={night} variantIdx={bayIdx} />
      ) : themeId === '2' ? (
        <ForestSanctuaryBackdrop night={night} variantIdx={bayIdx} />
      ) : themeId === '3' ? (
        <BeachBalconyBackdrop night={night} variantIdx={bayIdx} />
      ) : themeId === '4' ? (
        <MonsoonRainBackdrop night={night} variantIdx={bayIdx} />
      ) : (
        <PistachioObsidianBackdrop night={night} variantIdx={bayIdx} />
      )}

      {/* 2. REALISTIC HARDWOOD / VERANDA FLOOR */}
      <div
        style={abs({
          left: 0,
          right: 0,
          bottom: 0,
          height: FLOOR,
          zIndex: -20,
          backgroundImage: floorBg,
          boxShadow: 'inset 0 10px 24px rgba(0,0,0,0.4)',
        })}
      />

      {/* Baseboard Skirting */}
      <div
        style={abs({
          left: 0,
          right: 0,
          bottom: FLOOR,
          height: 16,
          zIndex: -20,
          background: baseboardBg,
          boxShadow: '0 3px 6px rgba(0,0,0,0.3)',
        })}
      />

      {/* 1b. ARCHITECTURAL 3D ROOM DEPTH (Wainscoting chair rail, corner shadows & warm ambient bounce) */}
      <div
        style={abs({
          inset: 0,
          bottom: FLOOR,
          zIndex: -26,
          pointerEvents: 'none',
          background: night
            ? 'radial-gradient(ellipse 72% 65% at 50% 42%, transparent 45%, rgba(0,0,0,0.68) 100%), linear-gradient(90deg, rgba(0,0,0,0.42), transparent 14%, transparent 86%, rgba(0,0,0,0.48))'
            : 'radial-gradient(ellipse 78% 70% at 48% 40%, rgba(255,250,235,0.22) 0%, transparent 55%, rgba(35,20,8,0.26) 100%), linear-gradient(90deg, rgba(25,14,6,0.22), transparent 14%, transparent 86%, rgba(25,14,6,0.28))',
        })}
      />
      {/* Traditional Wainscoting Chair Rail Molding */}
      <div
        style={abs({
          left: 0,
          right: 0,
          bottom: FLOOR + 145,
          height: 8,
          zIndex: -25,
          pointerEvents: 'none',
          background: night
            ? 'linear-gradient(180deg, rgba(255,245,230,0.08), rgba(0,0,0,0.45))'
            : 'linear-gradient(180deg, rgba(255,255,255,0.4), rgba(65,40,18,0.25))',
          boxShadow: '0 4px 10px rgba(0,0,0,0.22)',
        })}
      />

      {/* 3. PLUSH CARPET */}
      <BeigeFurCarpet night={night} lit={lit} themeId={themeId} />

      {/* 4. SOFT DAYTIME SUNLIGHT BEAMS (Suppressed on rainy monsoon veranda '4') */}
      {!night && themeId !== '4' && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            zIndex: -8,
            overflow: 'hidden',
          }}
        >
          {/* Angular morning sunbeam */}
          <div
            style={{
              position: 'absolute',
              top: -60,
              left: 0,
              width: '125%',
              height: 400,
              transformOrigin: 'top left',
              transform: 'rotate(22deg)',
              background:
                'linear-gradient(180deg, rgba(255,253,240,0.22) 0%, rgba(254,240,138,0.12) 45%, transparent 100%)',
              filter: 'blur(20px)',
              opacity: 0.65,
            }}
          />
          {/* Floor golden sunlight patch */}
          <div
            style={{
              position: 'absolute',
              left: '8%',
              bottom: 0,
              width: '65%',
              height: FLOOR,
              background:
                'radial-gradient(ellipse at 40% 50%, rgba(254,240,138,0.26) 0%, rgba(253,224,71,0.08) 55%, transparent 80%)',
              filter: 'blur(14px)',
            }}
          />
        </div>
      )}

      {/* 5. THEME-DISTINCT ARCHITECTURAL FLOOR LAMP (Positioned on the Left Side) */}
      <div
        className="sh-room-lamp"
        style={abs({
          left: '11.5%',
          bottom: FLOOR - 16,
          zIndex: 11,
          pointerEvents: 'none',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        })}
      >
        <ShelfThemeLamp night={night} themeId={themeId} />
      </div>

      {/* 6. THEME-DISTINCT REALISTIC BOTANICAL PLANT (Positioned on the Right Side) */}
      <div
        className="sh-room-plant"
        style={abs({
          right: '0.6%',
          bottom: FLOOR - 20,
          zIndex: 13,
          pointerEvents: 'none',
          transformOrigin: 'bottom center',
          animation: 'plantBreezeSway 6.5s ease-in-out infinite alternate',
        })}
      >
        <ShelfThemePlant night={night} themeId={themeId} />
      </div>

      {/* Scenic panoramic backdrop stays open behind left & right lamp/plant wings */}

      {/* 8. INTERACTIVE PULL CORD (Daylight shows helpful sunlight dialog; Night toggles almirah spotlight) */}
      <div
        style={abs({
          top: 0,
          left: '89.5%',
          zIndex: 25,
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        })}
      >
        <button
          type="button"
          aria-label="Pull rope to toggle almirah interior spotlight"
          title={night ? 'Pull cord to toggle almirah spotlights' : 'Pull cord'}
          onClick={onPull}
          style={{
            all: 'unset',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            transition: 'transform 0.16s ease-out',
            transform: pulled ? 'translateY(16px)' : 'none',
          }}
        >
          <span
            style={{
              width: 2.5,
              height: 110,
              background: 'repeating-linear-gradient(180deg, #f5f5f4 0 4px, #d6d3d1 4px 6px)',
              boxShadow: '1px 1px 2px rgba(0,0,0,0.45)',
            }}
          />
          <span
            style={{
              width: 14,
              height: 26,
              borderRadius: '0 0 7px 7px',
              background: 'linear-gradient(90deg, #d4af37 0%, #a16207 100%)',
              boxShadow: '0 3px 5px rgba(0,0,0,0.45)',
            }}
          />
        </button>
        <span
          style={{
            marginTop: 4,
            fontSize: 8.5,
            fontWeight: 700,
            letterSpacing: 0.8,
            textTransform: 'uppercase',
            color: night ? '#fef3c7' : '#ffffff',
            backgroundColor: night ? 'transparent' : 'rgba(28, 20, 14, 0.55)',
            padding: night ? 0 : '1px 5px',
            borderRadius: 6,
            textShadow: '0 1px 3px rgba(0,0,0,0.9)',
          }}
        >
          {night ? (lit ? 'Almirah Light ON' : 'Pull for Light') : 'Pull for Light'}
        </span>
      </div>

      {/* 9. NIGHT TIME SUBTLE AMBIENCE (Lightly blends lamp glow with real night vistas) */}
      <div
        style={abs({
          inset: 0,
          zIndex: 0,
          pointerEvents: 'none',
          transition: 'background-color 0.7s',
          backgroundColor: `rgba(6, 7, 24, ${night ? 0.14 : 0})`,
          mixBlendMode: 'multiply',
        })}
      />
      {night && (
        <div
          style={abs({
            inset: 0,
            zIndex: 0,
            pointerEvents: 'none',
            background:
              'radial-gradient(ellipse 36% 46% at 15% 58%, rgba(253,230,138,0.18), transparent 72%)',
            mixBlendMode: 'screen',
          })}
        />
      )}

      {/* Randomized Floating Glowing Jugnoos (Fireflies) at fresh positions each time */}
      {night && <NightJugnoos bayIdx={bayIdx} themeId={themeId} />}

      {/* Daytime Fluttering Butterflies (Themes 1 & 2 Day Mode) */}
      {!night && (themeId === '1' || themeId === '2') && (
        <DayButterflies forestTone={themeId === '2'} />
      )}

      {/* Almirah Children Container (pointerEvents none so side elements remain unobstructed) */}
      <div style={{ position: 'relative', zIndex: 10, pointerEvents: 'none' }}>{children}</div>

      {/* Charming Animated Cat on Floor */}
      <Cat dim={night && !lit} />
    </div>
  );
}

/* ───────────── RANDOMIZED FLOATING NIGHT JUGNOOS (FIREFLIES) ───────────── */

interface JugnooSpec {
  id: number;
  topPct: number;
  leftPct: number;
  size: number;
  floatDur: number;
  glowDur: number;
  delay: number;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  x3: number;
  y3: number;
}

function createRandomJugnooSpot(id: number): JugnooSpec {
  // Spread across left sky/lamp wing, upper sky, and right foliage wing cleanly
  const zoneRoll = Math.random();
  const leftPct =
    zoneRoll < 0.42
      ? 5 + Math.random() * 24
      : zoneRoll < 0.84
        ? 71 + Math.random() * 23
        : 28 + Math.random() * 44;
  const topPct =
    zoneRoll >= 0.84 ? 9 + Math.random() * 14 : 14 + Math.random() * 58;
  const rndSigned = (min: number, max: number) =>
    (Math.random() < 0.5 ? -1 : 1) * Math.round(min + Math.random() * (max - min));

  return {
    id,
    topPct: Math.round(topPct * 10) / 10,
    leftPct: Math.round(leftPct * 10) / 10,
    size: 6 + Math.floor(Math.random() * 4),
    floatDur: Math.round((5.2 + Math.random() * 4.4) * 10) / 10,
    glowDur: Math.round((1.7 + Math.random() * 1.6) * 10) / 10,
    delay: Math.round(Math.random() * 2.6 * 10) / 10,
    x1: rndSigned(10, 26),
    y1: rndSigned(10, 24),
    x2: rndSigned(10, 24),
    y2: rndSigned(8, 22),
    x3: rndSigned(12, 28),
    y3: rndSigned(8, 22),
  };
}

function generateJugnooBatch(): JugnooSpec[] {
  return Array.from({ length: 4 }, (_, idx) => createRandomJugnooSpot(idx));
}

function NightJugnoos({ bayIdx, themeId }: { bayIdx: number; themeId: ShelfThemeId }) {
  const [fireflies, setFireflies] = useState<JugnooSpec[]>(() => generateJugnooBatch());

  useEffect(() => {
    setFireflies(generateJugnooBatch());
    const timer = window.setInterval(() => {
      setFireflies((prev) =>
        prev.map((f) => {
          const next = createRandomJugnooSpot(f.id);
          return {
            ...f,
            topPct: next.topPct,
            leftPct: next.leftPct,
            x1: next.x1,
            y1: next.y1,
            x2: next.x2,
            y2: next.y2,
            x3: next.x3,
            y3: next.y3,
          };
        })
      );
    }, 9500);
    return () => window.clearInterval(timer);
  }, [bayIdx, themeId]);

  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 12 }}>
      {fireflies.map((j) => (
        <div
          key={j.id}
          style={
            {
              position: 'absolute',
              top: `${j.topPct}%`,
              left: `${j.leftPct}%`,
              width: j.size,
              height: j.size,
              borderRadius: '50%',
              background: '#fef08a',
              boxShadow: `0 0 ${Math.round(j.size * 1.25)}px ${Math.max(2, Math.round(j.size * 0.52))}px rgba(250, 204, 21, 0.64), 0 0 ${Math.round(j.size * 2.38)}px ${Math.round((j.size + 4) * 0.7)}px rgba(234, 179, 8, 0.31)`,
              transition: 'top 5.5s ease-in-out, left 5.5s ease-in-out',
              animation: `jugnooFloat ${j.floatDur}s ease-in-out infinite alternate, jugnooGlow ${j.glowDur}s ease-in-out infinite alternate`,
              animationDelay: `${j.delay}s`,
              '--jf-x1': `${j.x1}px`,
              '--jf-y1': `${j.y1}px`,
              '--jf-x2': `${j.x2}px`,
              '--jf-y2': `${j.y2}px`,
              '--jf-x3': `${j.x3}px`,
              '--jf-y3': `${j.y3}px`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}

/* ───────────── INTERACTIVE ANIMATED CAT (SLOW PROWL, MEOW BUBBLE & SOFT VOICE) ───────────── */

function playCuteMeowSound() {
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const triggerMeow = (startOffset: number, pitchPeak: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();
      osc.type = 'triangle';
      const t0 = ctx.currentTime + startOffset;
      osc.frequency.setValueAtTime(520, t0);
      osc.frequency.exponentialRampToValueAtTime(pitchPeak, t0 + 0.08);
      osc.frequency.exponentialRampToValueAtTime(440, t0 + 0.24);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1600, t0);

      gain.gain.setValueAtTime(0.0001, t0);
      gain.gain.linearRampToValueAtTime(0.065, t0 + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0008, t0 + 0.25);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t0);
      osc.stop(t0 + 0.27);
    };
    triggerMeow(0, 760);
    triggerMeow(0.32, 820);
    window.setTimeout(() => {
      try {
        ctx.close();
      } catch {}
    }, 900);
  } catch {}
}

export function Cat({ dim }: { dim: boolean }) {
  const catRef = useRef<HTMLDivElement>(null);
  const [isRoaming, setIsRoaming] = useState(false);
  const [isAlertPaused, setIsAlertPaused] = useState(false);
  const [isPetted, setIsPetted] = useState(false);
  const [posX, setPosX] = useState(48);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [bubble, setBubble] = useState<string | null>('meow meow');
  const [stalkTrigger, setStalkTrigger] = useState(0);
  const posXRef = useRef(posX);
  posXRef.current = posX;
  const petTimerRef = useRef<number | undefined>(undefined);

  const pickRandomNextTarget = (currX: number): { nextX: number; nextDir: 1 | -1 } => {
    const canGoLeft = currX - 16 >= 10;
    const canGoRight = 80 - currX >= 16;
    let chosenDir: 1 | -1;
    if (canGoLeft && canGoRight) {
      chosenDir = Math.random() < 0.5 ? -1 : 1;
    } else if (canGoLeft) {
      chosenDir = -1;
    } else {
      chosenDir = 1;
    }

    const span = chosenDir === -1 ? currX - 10 : 80 - currX;
    const stepDist = 16 + Math.random() * Math.max(6, span - 16);
    const rawTarget = currX + chosenDir * stepDist;
    const nextX = Math.round(Math.max(10, Math.min(80, rawTarget)));
    return { nextX, nextDir: nextX >= currX ? 1 : -1 };
  };

  const captureCurrentPctX = (): number => {
    const catEl = catRef.current;
    const roomEl = catEl?.parentElement;
    if (catEl && roomEl) {
      const catRect = catEl.getBoundingClientRect();
      const roomRect = roomEl.getBoundingClientRect();
      if (roomRect.width > 0) {
        const pct = ((catRect.left - roomRect.left) / roomRect.width) * 100;
        return Math.max(8, Math.min(82, Math.round(pct * 10) / 10));
      }
    }
    return posXRef.current;
  };

  useEffect(() => {
    return () => {
      if (petTimerRef.current !== undefined) window.clearTimeout(petTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (!isRoaming) {
      setIsAlertPaused(false);
      return;
    }

    let cancelled = false;
    let timerId: number | undefined;

    const runCadenceLoop = () => {
      if (cancelled) return;
      setIsAlertPaused(true);
      setBubble('meow meow');

      timerId = window.setTimeout(() => {
        if (cancelled) return;
        const { nextX, nextDir } = pickRandomNextTarget(posXRef.current);
        setIsAlertPaused(false);
        setDirection(nextDir);
        setPosX(nextX);
        setBubble('meow meow');

        timerId = window.setTimeout(runCadenceLoop, 9600);
      }, 3000);
    };

    timerId = window.setTimeout(runCadenceLoop, 9400);

    return () => {
      cancelled = true;
      if (timerId !== undefined) window.clearTimeout(timerId);
    };
  }, [isRoaming, stalkTrigger]);

  const settleHereWithPet = () => {
    const exactHereX = captureCurrentPctX();
    setPosX(exactHereX);
    setIsRoaming(false);
    setIsAlertPaused(false);
    setIsPetted(true);
    setBubble('purr~ ♥');
    if (petTimerRef.current !== undefined) window.clearTimeout(petTimerRef.current);
    petTimerRef.current = window.setTimeout(() => {
      setIsPetted(false);
      setBubble('meow meow');
    }, 2800);
  };

  const handleCatClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    playCuteMeowSound();
    if (!isRoaming) {
      if (petTimerRef.current !== undefined) window.clearTimeout(petTimerRef.current);
      setIsPetted(false);
      const { nextX, nextDir } = pickRandomNextTarget(posXRef.current);
      setIsRoaming(true);
      setIsAlertPaused(false);
      setDirection(nextDir);
      setPosX(nextX);
      setStalkTrigger((c) => c + 1);
      setBubble('meow meow');
    } else {
      settleHereWithPet();
    }
  };

  const handleRestClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    playCuteMeowSound();
    settleHereWithPet();
  };

  return (
    <div
      ref={catRef}
      role="button"
      tabIndex={0}
      onClick={handleCatClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleCatClick(e as unknown as React.MouseEvent);
        }
      }}
      title={isRoaming ? 'Pet kitty again to stay & purr right here ♥' : 'Click kitty to make her move'}
      className={`sh-cat group ${isRoaming ? 'is-roaming' : ''}`}
      style={{
        left: `${posX}%`,
        transform: `scaleX(${direction})`,
        filter: dim ? 'brightness(0.55)' : 'none',
        transition: isRoaming
          ? 'left 9.2s cubic-bezier(0.22, 0.1, 0.25, 1), transform 0.55s ease'
          : 'transform 0.55s ease',
      }}
    >
      {/* Floating Affectionate Hearts when Petted Right Here */}
      {isPetted && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            transform: `scaleX(${direction})`,
            zIndex: 40,
          }}
        >
          {[
            { left: '24%', top: -10, delay: '0s', size: 13 },
            { left: '54%', top: -18, delay: '0.28s', size: 15 },
            { left: '72%', top: -8, delay: '0.55s', size: 12 },
          ].map((h, idx) => (
            <span
              key={idx}
              style={{
                position: 'absolute',
                left: h.left,
                top: h.top,
                fontSize: h.size,
                color: '#fb7185',
                textShadow: '0 2px 6px rgba(244, 63, 94, 0.55)',
                animation: 'kittyHeartFloat 1.5s ease-out infinite',
                animationDelay: h.delay,
              }}
            >
              ♥
            </span>
          ))}
        </div>
      )}

      {/* Quiet Pet / Stay-Here Heart Button visible on hover while moving */}
      {isRoaming && (
        <button
          type="button"
          onClick={handleRestClick}
          title="Pet & rest right here"
          className="opacity-0 group-hover:opacity-95 transition-opacity"
          style={{
            position: 'absolute',
            top: -10,
            right: -6,
            transform: `scaleX(${direction})`,
            width: 22,
            height: 22,
            borderRadius: '50%',
            background: 'rgba(28, 25, 23, 0.88)',
            border: '1px solid rgba(251, 113, 133, 0.75)',
            color: '#fda4af',
            fontSize: 10.5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 2px 6px rgba(0,0,0,0.45)',
            zIndex: 38,
          }}
        >
          ♥
        </button>
      )}

      {/* Meow / Purr Stealth Thought Bubble */}
      {bubble && (
        <div
          style={{
            position: 'absolute',
            bottom: '100%',
            left: '50%',
            transform: `translateX(-50%) scaleX(${direction})`,
            marginBottom: 8,
            padding: '3px 9px',
            borderRadius: 14,
            background: isPetted ? 'rgba(255, 241, 242, 0.97)' : 'rgba(255, 255, 255, 0.96)',
            border: `1.5px solid ${isPetted ? '#f43f5e' : '#d97706'}`,
            color: isPetted ? '#be123c' : '#78350f',
            fontSize: 10.5,
            fontWeight: 700,
            whiteSpace: 'nowrap',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            pointerEvents: 'none',
            zIndex: 35,
          }}
        >
          {bubble}
          {/* Comic thought bubbles tail */}
          <div
            style={{
              position: 'absolute',
              top: '100%',
              left: '50%',
              transform: 'translateX(-50%)',
              width: 5,
              height: 5,
              borderRadius: '50%',
              background: '#ffffff',
              border: `1px solid ${isPetted ? '#f43f5e' : '#d97706'}`,
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: '100%',
              left: '42%',
              transform: 'translateY(5px)',
              width: 3,
              height: 3,
              borderRadius: '50%',
              background: '#ffffff',
              border: `1px solid ${isPetted ? '#f43f5e' : '#d97706'}`,
            }}
          />
        </div>
      )}

      {/* Hyper-Realistic & Super Cute Cat SVG Illustration (Plush Resting Kitten vs Sleek Prowling Tabby) */}
      {!isRoaming ? (
        /* HYPER-REALISTIC SUPER CUTE RESTING KITTEN (Big Glossy Soulful Eyes, Fluffy Chest, Soft Tabby Coat) */
        <svg
          viewBox="0 0 156 96"
          width="116"
          height="70"
          className="transition-transform group-hover:scale-105 active:scale-95"
          style={{ filter: 'drop-shadow(0 6px 10px rgba(0,0,0,0.34))', overflow: 'visible' }}
        >
          <defs>
            <radialGradient id="catRestBody" cx="42%" cy="34%" r="68%">
              <stop offset="0%" stopColor="#ffc875" />
              <stop offset="48%" stopColor="#e88c34" />
              <stop offset="85%" stopColor="#b85914" />
              <stop offset="100%" stopColor="#803809" />
            </radialGradient>
            <radialGradient id="catRestHead" cx="45%" cy="38%" r="64%">
              <stop offset="0%" stopColor="#ffd48a" />
              <stop offset="55%" stopColor="#ea9138" />
              <stop offset="100%" stopColor="#a84e10" />
            </radialGradient>
            <radialGradient id="catRestCream" cx="50%" cy="35%" r="68%">
              <stop offset="0%" stopColor="#fffdf7" />
              <stop offset="65%" stopColor="#fef0d5" />
              <stop offset="100%" stopColor="#ebd0a7" />
            </radialGradient>
            <radialGradient id="catRestEye" cx="45%" cy="40%" r="60%">
              <stop offset="0%" stopColor="#a3e635" />
              <stop offset="55%" stopColor="#3f8f3d" />
              <stop offset="100%" stopColor="#1b4322" />
            </radialGradient>
            <linearGradient id="catRestEarPink" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#fda4af" />
              <stop offset="100%" stopColor="#fb7185" />
            </linearGradient>
          </defs>

          {/* Soft Ground Contact Shadow */}
          <ellipse cx="78" cy="86" rx="54" ry="7.5" fill="rgba(0,0,0,0.36)" />

          <g className="sh-bob">
            {/* Fluffy Ringed Tail Curled Cozily Around Haunch */}
            <path
              d="M108 77 C132 78 144 64 139 48 C135 37 121 41 124 51 C126 57 121 63 113 64"
              fill="none"
              stroke="#b85914"
              strokeWidth="11"
              strokeLinecap="round"
            />
            <path
              d="M108 77 C132 78 144 64 139 48 C135 37 121 41 124 51"
              fill="none"
              stroke="#f5a54b"
              strokeWidth="7.2"
              strokeLinecap="round"
            />
            {/* Tail Ring Stripes & Fluffy Cream Tip */}
            <path d="M126 73 L130 66 M135 64 L141 59" stroke="#7c3208" strokeWidth="2.4" strokeLinecap="round" opacity="0.7" />
            <circle cx="124" cy="48" r="4.8" fill="#fff7ea" />

            {/* Lush Rounded Resting Loaf Body with Soft Back Fur Contours */}
            <path
              d="M36 78 C30 56 46 38 78 38 C108 38 122 55 117 75 C114 84 96 86 74 86 C52 86 39 84 36 78 Z"
              fill="url(#catRestBody)"
            />
            {/* Soft Ginger Tabby Coat Markings Along Back */}
            <path
              d="M68 41 C72 47 71 55 66 60 M82 40 C86 48 85 57 80 63 M96 42 C100 49 98 58 93 63"
              fill="none"
              stroke="#8c3b0a"
              strokeWidth="3.2"
              strokeLinecap="round"
              opacity="0.48"
            />

            {/* Fluffy Cream Chest Bib with Tufted Fur Silhouette */}
            <path
              d="M37 52 C33 65 39 81 51 82 C61 83 66 71 62 56 C58 48 42 46 37 52 Z"
              fill="url(#catRestCream)"
            />
            <path
              d="M42 74 L44 79 M50 75 L51 81 M57 73 L59 78"
              stroke="#ebd0a7"
              strokeWidth="1.5"
              strokeLinecap="round"
            />

            {/* Chubby Tucked White Mitten Front Paws + Tiny Toe Separation Lines */}
            <g>
              <ellipse cx="44" cy="82" rx="10" ry="5.5" fill="url(#catRestCream)" stroke="#c27a3e" strokeWidth="0.9" />
              <path d="M40 83 V86 M44 83.5 V86.5 M48 83 V86" stroke="#c7a57d" strokeWidth="0.85" strokeLinecap="round" />
              <ellipse cx="62" cy="83" rx="9.5" ry="5.2" fill="url(#catRestCream)" stroke="#c27a3e" strokeWidth="0.9" />
              <path d="M58 84 V87 M62 84.5 V87.5 M66 84 V87" stroke="#c7a57d" strokeWidth="0.85" strokeLinecap="round" />
            </g>

            {/* Sculpted Kitten Head with Soft Fluffy Cheek Tufts */}
            <g transform="translate(0, 1)">
              {/* Outer Plush Ears */}
              <path d="M31 28 L25 6 C25 4 28 3 31 5 L45 19 Z" fill="#c9681c" />
              <path d="M32 25 L28 9 L42 19 Z" fill="url(#catRestEarPink)" opacity="0.82" />
              <path d="M31 22 C33 17 36 15 39 18" fill="none" stroke="#fff7ea" strokeWidth="1.4" strokeLinecap="round" />

              <path d="M54 19 L68 5 C71 3 74 4 74 6 L68 28 Z" fill="#c9681c" />
              <path d="M57 19 L71 9 L67 25 Z" fill="url(#catRestEarPink)" opacity="0.82" />
              <path d="M60 18 C63 15 66 17 68 22" fill="none" stroke="#fff7ea" strokeWidth="1.4" strokeLinecap="round" />

              {/* Chubby Cheeked Feline Head */}
              <path
                d="M27 36 C25 22 36 15 50 15 C64 15 74 22 72 36 C73 45 64 53 50 53 C35 53 26 45 27 36 Z"
                fill="url(#catRestHead)"
              />

              {/* Classic Cute Tabby "M" Forehead Stripes + Cheek Whisker Stripes */}
              <path
                d="M44 18 L46 25 M50 17 L50 26 M56 18 L54 25"
                fill="none"
                stroke="#8c3b0a"
                strokeWidth="1.9"
                strokeLinecap="round"
                opacity="0.62"
              />
              <path
                d="M29 33 Q33 34 36 35 M70 33 Q66 34 63 35"
                fill="none"
                stroke="#9a440d"
                strokeWidth="1.6"
                strokeLinecap="round"
                opacity="0.52"
              />

              {/* Fluffy Cream Muzzle Blaze & Rounded Whisker Pads */}
              <path
                d="M50 26 C46 31 44 35 37 38 C32 41 33 49 42 51 C47 52 53 52 58 51 C66 49 67 41 62 38 C55 35 54 31 50 26 Z"
                fill="url(#catRestCream)"
              />

              {/* Soft Warm Rosy Cheek Blush */}
              <ellipse cx="34" cy="40" rx="4.2" ry="2.2" fill="#fb7185" opacity="0.28" />
              <ellipse cx="66" cy="40" rx="4.2" ry="2.2" fill="#fb7185" opacity="0.28" />

              {/* BIG SOULFUL GLOSSY KITTEN EYES WITH TWIN CATCHLIGHTS */}
              <g>
                {/* Left Eye */}
                <ellipse cx="39.5" cy="33" rx="5.2" ry="5.6" fill="#2c1810" />
                <ellipse cx="39.5" cy="33.2" rx="4.5" ry="4.9" fill="url(#catRestEye)" />
                <ellipse cx="39.8" cy="33.4" rx="2.7" ry="3.4" fill="#14110f" />
                <circle cx="38.2" cy="31.3" r="1.65" fill="#ffffff" />
                <circle cx="41.4" cy="35.0" r="0.7" fill="#ffffff" opacity="0.9" />

                {/* Right Eye */}
                <ellipse cx="60.5" cy="33" rx="5.2" ry="5.6" fill="#2c1810" />
                <ellipse cx="60.5" cy="33.2" rx="4.5" ry="4.9" fill="url(#catRestEye)" />
                <ellipse cx="60.2" cy="33.4" rx="2.7" ry="3.4" fill="#14110f" />
                <circle cx="58.8" cy="31.3" r="1.65" fill="#ffffff" />
                <circle cx="62.0" cy="35.0" r="0.7" fill="#ffffff" opacity="0.9" />
              </g>

              {/* Velvety Pink Heart-Triangle Nose with Gloss Specular */}
              <path d="M47.6 39.2 Q50 38.2 52.4 39.2 Q51.5 41.8 50 42.3 Q48.5 41.8 47.6 39.2 Z" fill="#f43f5e" />
              <ellipse cx="49.2" cy="39.6" rx="0.9" ry="0.45" fill="#ffe4e6" opacity="0.85" />

              {/* Cute Soft ":3" Kitten Smile & Tiny Chin */}
              <path
                d="M50 42.3 V44 M45 43.8 Q47.5 46.2 50 44 Q52.5 46.2 55 43.8"
                fill="none"
                stroke="#6e3619"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Delicate Curved Tapered Whiskers */}
              <g fill="none" stroke="#fffbeb" strokeWidth="0.9" strokeLinecap="round" opacity="0.92">
                <path d="M36 40 Q24 38 15 40" />
                <path d="M36 42.5 Q24 43 16 47" />
                <path d="M37 44.5 Q27 47 20 51" />
                <path d="M64 40 Q76 38 85 40" />
                <path d="M64 42.5 Q76 43 84 47" />
                <path d="M63 44.5 Q73 47 80 51" />
              </g>
            </g>
          </g>
        </svg>
      ) : (
        /* HYPER-REALISTIC SUPER CUTE PROWLING & ALERT TABBY KITTEN */
        <svg
          viewBox="0 0 182 96"
          width="132"
          height="70"
          className="transition-transform group-hover:scale-105 active:scale-95"
          style={{ filter: 'drop-shadow(0 6px 10px rgba(0,0,0,0.36))', overflow: 'visible' }}
        >
          <defs>
            <linearGradient id="catProwlCoat" x1="0" y1="0" x2="0.2" y2="1">
              <stop offset="0%" stopColor="#ffc875" />
              <stop offset="52%" stopColor="#e88c34" />
              <stop offset="100%" stopColor="#a84e10" />
            </linearGradient>
            <linearGradient id="catProwlShade" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#c96c1d" />
              <stop offset="100%" stopColor="#7a3209" />
            </linearGradient>
            <radialGradient id="catProwlCream" cx="50%" cy="45%" r="65%">
              <stop offset="0%" stopColor="#fffdf7" />
              <stop offset="70%" stopColor="#fef0d5" />
              <stop offset="100%" stopColor="#e6c89e" />
            </radialGradient>
            <radialGradient id="catProwlEye" cx="40%" cy="40%" r="60%">
              <stop offset="0%" stopColor="#bef264" />
              <stop offset="60%" stopColor="#3f8f3d" />
              <stop offset="100%" stopColor="#1b4322" />
            </radialGradient>
          </defs>

          {/* Ground Contact Shadow */}
          <ellipse cx="94" cy="86" rx="64" ry="6.5" fill="rgba(0,0,0,0.35)" />

          {/* Plush Ringed Sinuous Tail */}
          <g className="sh-cat-tail">
            <path
              d="M36 56 C16 58 9 47 7 34 C6 28 11 26 14 31"
              fill="none"
              stroke="#b85914"
              strokeWidth="9.5"
              strokeLinecap="round"
            />
            <path
              d="M36 56 C16 58 9 47 7 34"
              fill="none"
              stroke="#f5a54b"
              strokeWidth="6"
              strokeLinecap="round"
            />
            <path d="M22 52 L24 58 M13 46 L17 50" stroke="#7c3208" strokeWidth="2" strokeLinecap="round" opacity="0.65" />
            <circle cx="7.5" cy="32" r="4.2" fill="#fff7ea" />
          </g>

          {/* Far-Side Articulated Haunch & Front Stepping Leg */}
          <g className={isAlertPaused ? undefined : 'sh-cat-sneak-a'}>
            <path d="M44 58 C41 68 42 78 44 83 L52 83 C52 75 54 66 56 58 Z" fill="url(#catProwlShade)" />
            <ellipse cx="48.5" cy="83.5" rx="6" ry="3.2" fill="url(#catProwlCream)" />
          </g>
          <g className={isAlertPaused ? undefined : 'sh-cat-sneak-b'}>
            <path d="M112 58 C113 68 114 78 116 83 L123 83 C122 75 121 66 121 58 Z" fill="url(#catProwlShade)" />
            <ellipse cx="120.5" cy="83.5" rx="6" ry="3.2" fill="url(#catProwlCream)" />
          </g>

          {/* Sleek Contoured Low-Slung Torso & Haunch Curve */}
          <path
            d="M36 56 C38 41 64 38 92 41 C114 43 128 48 130 57 C131 66 112 69 86 68 C58 68 35 67 36 56 Z"
            fill="url(#catProwlCoat)"
          />
          {/* Fluffy Cream Belly & Bib */}
          <path
            d="M52 64 C66 69 102 70 120 63 C122 57 108 56 90 58 C72 59 56 58 52 64 Z"
            fill="url(#catProwlCream)"
          />
          {/* Realistic Soft Tiger Tabby Shoulder Stripes */}
          <path
            d="M62 43 Q65 51 60 56 M76 42 Q79 50 74 56 M90 42 Q93 50 88 56 M104 44 Q106 52 102 56"
            fill="none"
            stroke="#8c3b0a"
            strokeWidth="2.6"
            strokeLinecap="round"
            opacity="0.52"
          />

          {/* Foreground Sculpted Legs with White Sock Paws */}
          <g className={isAlertPaused ? undefined : 'sh-cat-sneak-b'}>
            <path d="M53 56 C48 66 51 77 53 84 L62 84 C61 75 63 65 65 56 Z" fill="url(#catProwlCoat)" />
            <ellipse cx="58" cy="84" rx="6.5" ry="3.4" fill="url(#catProwlCream)" stroke="#c27a3e" strokeWidth="0.7" />
            <path d="M56 84.5 V87 M60 84.5 V87" stroke="#c7a57d" strokeWidth="0.8" strokeLinecap="round" />
          </g>
          <g className={isAlertPaused ? undefined : 'sh-cat-sneak-a'}>
            <path d="M120 56 C121 66 123 77 125 84 L133 84 C132 75 131 65 130 56 Z" fill="url(#catProwlCoat)" />
            <ellipse cx="130" cy="84" rx="6.5" ry="3.4" fill="url(#catProwlCream)" stroke="#c27a3e" strokeWidth="0.7" />
            <path d="M128 84.5 V87 M132 84.5 V87" stroke="#c7a57d" strokeWidth="0.8" strokeLinecap="round" />
          </g>

          {/* Expressive Forward-Alert Kitten Head */}
          <g transform="translate(8, 3)">
            {/* Back Radar Ear */}
            <g className="sh-cat-ear">
              <path d="M122 30 L121 12 C121 10 124 9 126 11 L136 25 Z" fill="#b85914" />
              <path d="M123 27 L123 14 L133 24 Z" fill="#fda4af" opacity="0.78" />
            </g>

            {/* Head Contour with Cute Cheek Fluff */}
            <path
              d="M116 39 C114 25 126 20 137 21 C148 22 155 30 154 41 C153 49 144 54 133 54 C122 54 116 47 116 39 Z"
              fill="url(#catProwlCoat)"
            />

            {/* Front Radar Ear */}
            <g className="sh-cat-ear" style={{ animationDelay: '-0.8s' }}>
              <path d="M132 25 L143 10 C145 8 148 9 148 12 L145 31 Z" fill="#d97524" />
              <path d="M135 24 L144 13 L143 28 Z" fill="#fda4af" opacity="0.82" />
            </g>

            {/* Forehead Tabby Stripes */}
            <path d="M131 23 L133 28 M137 23 L137 29" fill="none" stroke="#8c3b0a" strokeWidth="1.6" strokeLinecap="round" opacity="0.6" />

            {/* Soft Cream Muzzle Pad */}
            <ellipse cx="144" cy="44.5" rx="9.5" ry="6.8" fill="url(#catProwlCream)" />

            {/* Big Glistening Scanning Eye with Twin Specular Catchlights */}
            <ellipse cx="141.5" cy="36.5" rx="4.8" ry="4.5" fill="#2c1810" />
            <ellipse cx="141.5" cy="36.5" rx="4.2" ry="3.9" fill="url(#catProwlEye)" />
            <g className="sh-cat-pupil">
              <ellipse cx="141.9" cy="36.6" rx="1.9" ry="2.9" fill="#14110f" />
              <circle cx="140.6" cy="35.1" r="1.25" fill="#ffffff" />
              <circle cx="142.8" cy="37.8" r="0.55" fill="#ffffff" opacity="0.9" />
            </g>

            {/* Subtle Rosy Cheek Tint */}
            <ellipse cx="133" cy="43" rx="3.4" ry="1.9" fill="#fb7185" opacity="0.26" />

            {/* Glossy Pink Nose & Cute Mouth */}
            <path d="M151.2 40.5 Q153.5 39.8 154.6 41.2 Q153.6 43.2 152 43.2 Z" fill="#f43f5e" />
            <path d="M148 45.5 Q151 47.4 153 45.5" fill="none" stroke="#6e3619" strokeWidth="1.1" strokeLinecap="round" />

            {/* Delicate Fine Whiskers */}
            <g fill="none" stroke="#fffbeb" strokeWidth="0.9" strokeLinecap="round" opacity="0.92">
              <path d="M145 43.5 Q158 41 167 42" />
              <path d="M145 45.5 Q158 45 166 48" />
              <path d="M144 47 Q155 49 162 52.5" />
            </g>
          </g>
        </svg>
      )}
    </div>
  );
}

/* ───────────── INTERACTIVE SHELF FOLDERS (SETTINGS GEAR ON TOP) ───────────── */

export function ShelfFolderTile({
  folder,
  accessible,
  onOpenFolder,
  onOpenFolderSettings,
  onDropBookIntoFolder,
}: {
  folder: ShelfFolder;
  accessible: boolean;
  onOpenFolder: () => void;
  onOpenFolderSettings: () => void;
  onDropBookIntoFolder?: (explicitSource?: { fromShelfId: string; bookId: string }) => void;
}) {
  const [isDragOver, setIsDragOver] = useState(false);
  const { Icon } = getFolderLogoMeta(folder.logoId);

  return (
    <div
      className={`sh-folder-item relative flex-none select-none ${isDragOver ? 'scale-105 ring-2 ring-amber-400 rounded-lg' : ''}`}
      style={{ width: 88, paddingTop: 14 }}
      onDragOver={(e) => {
        if (!accessible) return;
        e.preventDefault();
        e.stopPropagation();
        if (!isDragOver) setIsDragOver(true);
      }}
      onDragLeave={(e) => {
        e.stopPropagation();
        if (isDragOver) setIsDragOver(false);
      }}
      onDrop={(e) => {
        if (!accessible) return;
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(false);
        try {
          const raw = e.dataTransfer.getData('application/json');
          if (raw) {
            const parsed = JSON.parse(raw);
            if (parsed?.fromShelfId && parsed?.bookId) {
              onDropBookIntoFolder?.(parsed);
              return;
            }
          }
        } catch {}
        onDropBookIntoFolder?.();
      }}
    >
      {/* SETTINGS BUTTON PLACED DIRECTLY ON TOP OF THE FOLDER */}
      {accessible && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onOpenFolderSettings();
          }}
          title="Folder Settings (Trash Delete, Share, Rename, Colour, Logo)"
          aria-label={`Settings for ${folder.name}`}
          style={{
            position: 'absolute',
            top: -1,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 28,
            boxShadow: '0 3px 8px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.28)',
          }}
          className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-stone-950 hover:bg-amber-600 text-amber-200 hover:text-stone-950 border border-amber-400/75 text-[9.5px] font-bold transition cursor-pointer whitespace-nowrap"
        >
          <Settings className="w-2.5 h-2.5 shrink-0" />
          <span>Settings</span>
        </button>
      )}

      {/* TACTILE FOLDER BODY */}
      <div
        role="button"
        tabIndex={0}
        onClick={() => accessible && onOpenFolder()}
        onKeyDown={(e) => {
          if ((e.key === 'Enter' || e.key === ' ') && accessible) {
            e.preventDefault();
            onOpenFolder();
          }
        }}
        title={`${folder.name} (${folder.books.length} items) · Click to open folder`}
        style={{
          position: 'relative',
          width: '100%',
          height: 100,
          cursor: accessible ? 'pointer' : 'default',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
        }}
      >
        {/* Top Manila-Style Back Folder Tab */}
        <div
          style={{
            position: 'absolute',
            top: 2,
            left: 4,
            width: 38,
            height: 12,
            borderRadius: '5px 6px 0 0',
            backgroundColor: folder.color,
            filter: 'brightness(0.84)',
            border: '1px solid rgba(255,255,255,0.24)',
            borderBottom: 'none',
            boxShadow: '0 -1px 3px rgba(0,0,0,0.3)',
          }}
        />
        {/* Back Folder Sheet */}
        <div
          style={{
            position: 'absolute',
            top: 9,
            left: 2,
            right: 2,
            bottom: 4,
            borderRadius: '3px 6px 5px 5px',
            backgroundColor: folder.color,
            filter: 'brightness(0.76)',
            border: '1px solid rgba(255,255,255,0.18)',
          }}
        />
        {/* Inner White Document Peek */}
        <div
          style={{
            position: 'absolute',
            top: 12,
            left: 7,
            right: 7,
            height: 16,
            borderRadius: '2px 2px 0 0',
            background: 'linear-gradient(180deg, #fffdf9, #e7decb)',
            boxShadow: '0 -1px 2px rgba(0,0,0,0.2)',
            opacity: folder.books.length > 0 ? 0.96 : 0.45,
          }}
        />
        {/* Front Folder Cover Plate */}
        <div
          style={{
            position: 'relative',
            zIndex: 5,
            height: 82,
            borderRadius: '4px 6px 6px 6px',
            background: `linear-gradient(145deg, ${folder.color} 0%, rgba(12, 10, 9, 0.48) 100%)`,
            backgroundColor: folder.color,
            border: '1.5px solid rgba(254, 243, 199, 0.34)',
            boxShadow: '4px 6px 12px rgba(0,0,0,0.52), inset 0 1.5px 0 rgba(255,255,255,0.28)',
            padding: '7px 6px 6px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-between',
            color: '#fffbeb',
          }}
        >
          {/* Logo Medallion */}
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              background: 'rgba(15, 11, 8, 0.36)',
              border: '1px solid rgba(254, 240, 138, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.45)',
            }}
          >
            <Icon className="w-4 h-4 text-amber-100" />
          </div>

          <div className="w-full text-center">
            <div className="text-[10px] font-bold leading-tight truncate px-0.5 drop-shadow">
              {folder.name}
            </div>
            <div className="text-[8.5px] font-mono opacity-85 mt-0.5">
              {folder.books.length} {folder.books.length === 1 ? 'doc' : 'docs'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ───────────── DUKAAN ROLLING SHUTTER (Vanilla White Lower Compartment) ───────────── */

export function DukaanRollingShutter({
  open,
  onToggle,
}: {
  look: Look;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      className="select-none"
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 25,
        overflow: 'hidden',
        pointerEvents: open ? 'none' : 'auto',
      }}
    >
      {/* Clean Top Pelmet Casing (Text-free, clickable to toggle) */}
      <div
        role="button"
        tabIndex={0}
        onClick={(e) => {
          e.stopPropagation();
          onToggle();
        }}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), onToggle())}
        title={open ? 'Click pelmet or shutter rail to close door' : 'Click pelmet or shutter rail to open door'}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 16,
          zIndex: 28,
          cursor: 'pointer',
          pointerEvents: 'auto',
          background: 'linear-gradient(180deg, #1e293b 0%, #334155 45%, #0f172a 100%)',
          boxShadow: '0 4px 10px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.2)',
          borderBottom: '2px solid #090d14',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 14px',
        }}
      >
        <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#94a3b8' }} />
        <span style={{ width: 64, height: 2, borderRadius: 2, background: 'rgba(255,255,255,0.22)' }} />
        <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#94a3b8' }} />
      </div>

      {/* Left & Right Vertical Steel Guide Channels */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 0,
          width: 12,
          zIndex: 22,
          background: 'linear-gradient(90deg, #090d14 0%, #334155 50%, #1e293b 80%, #090d14 100%)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          right: 0,
          width: 12,
          zIndex: 22,
          background: 'linear-gradient(270deg, #090d14 0%, #334155 50%, #1e293b 80%, #090d14 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* Main Corrugated Metal Shutter Curtain (Clean surface, zero label text) */}
      <div
        role="button"
        tabIndex={0}
        onClick={(e) => {
          e.stopPropagation();
          onToggle();
        }}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), onToggle())}
        title={open ? 'Click shutter rail to close door' : 'Click shutter to open door'}
        style={{
          position: 'absolute',
          left: 12,
          right: 12,
          top: 0,
          bottom: 0,
          zIndex: 18,
          cursor: 'pointer',
          pointerEvents: 'auto',
          transform: open ? 'translateY(-100%)' : 'translateY(0%)',
          transition: 'transform 1.65s cubic-bezier(0.22, 1, 0.36, 1)',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: open ? '0 12px 24px rgba(0,0,0,0.65)' : 'none',
        }}
      >
        <div
          style={{
            flex: 1,
            width: '100%',
            background: 'linear-gradient(180deg, #475569 0%, #334155 45%, #1e293b 85%, #0f172a 100%)',
            backgroundImage:
              'repeating-linear-gradient(180deg, rgba(255,255,255,0.20) 0px, rgba(255,255,255,0.06) 2px, rgba(0,0,0,0.16) 6px, rgba(0,0,0,0.48) 12px, rgba(0,0,0,0.72) 14px)',
            boxShadow: 'inset 0 0 36px rgba(0,0,0,0.45)',
            position: 'relative',
          }}
        />

        {/* Clean Bottom Threshold Handle Rail (Zero border text) */}
        <div
          style={{
            height: 24,
            width: '100%',
            background: 'linear-gradient(180deg, #1e293b 0%, #0f172a 60%, #020617 100%)',
            borderTop: '2px solid #64748b',
            borderBottom: '3px solid #000000',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 18px',
          }}
        >
          <div style={{ width: 28, height: 8, borderRadius: 3, border: '1.5px solid #d4af37', background: '#111827' }} />
          <div style={{ width: 56, height: 4, borderRadius: 99, background: '#d4af37', opacity: 0.78 }} />
          <div style={{ width: 28, height: 8, borderRadius: 3, border: '1.5px solid #d4af37', background: '#111827' }} />
        </div>
      </div>

      {/* Unified Bottom-Center Lock / Unlock Button */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onToggle();
        }}
        style={{
          position: 'absolute',
          bottom: 4,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 36,
          pointerEvents: 'auto',
          padding: '3px 11px',
          borderRadius: 999,
          background: 'rgba(15, 11, 8, 0.88)',
          border: '1px solid rgba(212, 175, 55, 0.55)',
          color: '#ffffff',
          font: '700 10px/1.2 system-ui',
          boxShadow: '0 3px 10px rgba(0,0,0,0.55)',
        }}
        className="flex items-center gap-1 cursor-pointer hover:bg-amber-700 transition"
        title={open ? 'Close shutter door' : 'Open shutter door'}
      >
        {open ? <DoorClosed className="w-3 h-3 text-amber-300" /> : <DoorOpen className="w-3 h-3 text-amber-300" />}
        <span>{open ? 'Close' : 'Open'}</span>
      </button>
    </div>
  );
}

/* ───────────── COAL-BLACK TIJORI / BANK VAULT DOOR (UPPER) ───────────── */

export function BankVaultDoor({
  look,
  open,
  onToggle,
}: {
  look: Look;
  open: boolean;
  onToggle: () => void;
}) {
  const [dialSpinning, setDialSpinning] = useState(false);

  const handleDialClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!open) {
      setDialSpinning(true);
      setTimeout(() => {
        onToggle();
      }, 420);
      setTimeout(() => setDialSpinning(false), 900);
    } else {
      onToggle();
    }
  };

  const steelSurface = getWoodSurfaceStyle(look, 'panel', 'door', '135deg');

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: open ? 35 : 25,
        perspective: 2200,
        perspectiveOrigin: 'left center',
        overflow: 'visible',
        pointerEvents: open ? 'none' : 'auto',
      }}
    >
      <div
        role="button"
        tabIndex={0}
        onClick={handleDialClick}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), handleDialClick(e as any))}
        title={open ? 'Click vault door to close' : 'Click vault door to open'}
        style={{
          position: 'absolute',
          inset: 0,
          cursor: 'pointer',
          pointerEvents: 'auto',
          transformOrigin: 'left center',
          transform: `translateX(${open ? -28 : 0}px) rotateY(${open ? -150 : 0}deg)`,
          transition: 'transform 1.75s cubic-bezier(0.22, 1, 0.36, 1)',
          boxShadow: open ? '0 18px 40px rgba(0,0,0,0.88)' : 'none',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            ...steelSurface,
            border: '7px solid #121418',
            boxShadow:
              'inset 0 0 42px rgba(0,0,0,0.92), inset 2px 2px 0 rgba(148,163,184,0.14), inset -2px -2px 0 rgba(0,0,0,0.85), 0 8px 22px rgba(0,0,0,0.75)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
          }}
        >
          {/* Inner Armored Bevel Seam Frame */}
          <div
            style={{
              position: 'absolute',
              inset: 12,
              border: '2px solid rgba(148, 163, 184, 0.14)',
              boxShadow: 'inset 0 0 0 2px rgba(0,0,0,0.82), 0 1px 0 rgba(255,255,255,0.06)',
              borderRadius: 4,
              pointerEvents: 'none',
            }}
          />

          {/* Heavy Forged Steel Hinges Along Left Edge */}
          {[20, 50, 80].map((topPct) => (
            <div
              key={topPct}
              style={{
                position: 'absolute',
                left: 3,
                top: `${topPct}%`,
                transform: 'translateY(-50%)',
                width: 10,
                height: 28,
                borderRadius: 3,
                background: 'linear-gradient(90deg, #475569 0%, #1e242c 50%, #090b0e 100%)',
                border: '1px solid #050608',
                boxShadow: '0 2px 6px rgba(0,0,0,0.85)',
                pointerEvents: 'none',
              }}
            />
          ))}

          {/* Solid Dark Steel Locking Bolts Along Right Edge */}
          {[24, 42, 58, 76].map((topPct) => (
            <div
              key={topPct}
              style={{
                position: 'absolute',
                right: 3,
                top: `${topPct}%`,
                transform: 'translateY(-50%)',
                width: 10,
                height: 16,
                borderRadius: '3px 0 0 3px',
                background: 'linear-gradient(180deg, #94a3b8 0%, #475569 55%, #1e242c 100%)',
                boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.5), -2px 2px 5px rgba(0,0,0,0.85)',
                pointerEvents: 'none',
              }}
            />
          ))}

          {/* Machined Armor Perimeter Hex Rivets */}
          {[
            { top: 18, left: 18 },
            { top: 18, right: 18 },
            { bottom: 18, left: 18 },
            { bottom: 18, right: 18 },
            { top: '50%', left: 18 },
            { top: '50%', right: 18 },
          ].map((pos, idx) => (
            <span
              key={idx}
              style={{
                position: 'absolute',
                ...pos,
                width: 7,
                height: 7,
                borderRadius: '50%',
                background: 'radial-gradient(circle at 30% 30%, #94a3b8 0%, #334155 65%, #090b0f 100%)',
                boxShadow: '0 1px 3px rgba(0,0,0,0.9)',
                pointerEvents: 'none',
              }}
            />
          ))}

          {/* Authentic Circular Vault Handwheel & Graduated Combination Dial */}
          <div
            style={{
              position: 'relative',
              width: 112,
              height: 112,
              borderRadius: '50%',
              background:
                'radial-gradient(circle at 35% 30%, #262b34 0%, #0e1015 58%, #040507 100%)',
              border: '4px solid #333944',
              boxShadow:
                '0 12px 28px rgba(0,0,0,0.92), inset 0 2px 4px rgba(255,255,255,0.16), inset 0 -4px 8px rgba(0,0,0,0.9)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transform: dialSpinning ? 'rotate(240deg)' : 'rotate(0deg)',
              transition: 'transform 0.7s cubic-bezier(0.22, 1, 0.36, 1)',
            }}
          >
            {/* Outer Precision Graduated Dial Ring */}
            <div
              style={{
                position: 'absolute',
                inset: 5,
                borderRadius: '50%',
                background:
                  'repeating-conic-gradient(from 0deg, rgba(203,213,225,0.42) 0deg 2deg, transparent 2deg 15deg)',
                WebkitMaskImage: 'radial-gradient(circle, transparent 66%, black 67%)',
                maskImage: 'radial-gradient(circle, transparent 66%, black 67%)',
              }}
            />
            <div
              style={{
                position: 'absolute',
                inset: 14,
                borderRadius: '50%',
                border: '1.5px solid rgba(212, 175, 55, 0.42)',
                boxShadow: 'inset 0 4px 12px rgba(0,0,0,0.92)',
                background: 'radial-gradient(circle at 40% 35%, #161920, #040507)',
              }}
            />
            {/* Three-Spoke Bank Vault Capstan Handwheel */}
            {[0, 120, 240].map((deg) => (
              <div
                key={deg}
                style={{
                  position: 'absolute',
                  width: 7,
                  height: 82,
                  borderRadius: 4,
                  background: 'linear-gradient(90deg, #94a3b8 0%, #f1f5f9 45%, #475569 100%)',
                  boxShadow: '0 2px 5px rgba(0,0,0,0.75)',
                  transform: `rotate(${deg}deg)`,
                }}
              />
            ))}
            {/* Central Brass & Polished Steel Combination Tumbler Hub */}
            <div
              style={{
                position: 'relative',
                width: 34,
                height: 34,
                borderRadius: '50%',
                background: 'radial-gradient(circle at 35% 30%, #fef08a 0%, #d4af37 55%, #78350f 100%)',
                border: '2px solid #cbd5e1',
                boxShadow: '0 4px 10px rgba(0,0,0,0.85), inset 0 1px 2px rgba(255,255,255,0.6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <div
                style={{
                  width: 14,
                  height: 14,
                  borderRadius: '50%',
                  background: 'radial-gradient(circle at 30% 30%, #f8fafc, #64748b)',
                  boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.7)',
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Unified Bottom-Center Lock / Unlock Button */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onToggle();
        }}
        style={{
          position: 'absolute',
          bottom: 4,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 36,
          pointerEvents: 'auto',
          padding: '3px 11px',
          borderRadius: 999,
          background: 'rgba(12, 10, 9, 0.9)',
          border: '1px solid rgba(212, 175, 55, 0.55)',
          color: '#ffffff',
          font: '700 10px/1.2 system-ui',
          boxShadow: '0 3px 10px rgba(0,0,0,0.55)',
        }}
        className="flex items-center gap-1 cursor-pointer hover:bg-amber-700 transition"
        title={open ? 'Close Vault Door' : 'Open Vault Door'}
      >
        {open ? <DoorClosed className="w-3 h-3 text-amber-300" /> : <DoorOpen className="w-3 h-3 text-amber-300" />}
        <span>{open ? 'Close' : 'Open'}</span>
      </button>
    </div>
  );
}

/* ───────────── 5 DISTINCT ARCHITECTURAL DOOR SYSTEMS (ACCESS-GATED GLASS & VAULT) ───────────── */

export function CabinetDoors({
  look,
  doorKind,
  open,
  onToggle,
}: {
  look: Look;
  doorKind: UpperDoorType | LowerDoorType;
  open: boolean;
  onToggle: () => void;
}) {
  if (doorKind === 'none') {
    return null;
  }
  if (doorKind === 'frameless-glass') {
    // Architectural frameless tempered crystal glass pane over upper shelves ONLY (zero door frames/handles/locks)
    const clampTint = look.name === 'Creamy Caramel' ? '#fef3c7' : '#e5c158';
    return (
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 22,
          pointerEvents: 'none',
          backgroundImage:
            'linear-gradient(124deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.03) 20%, rgba(226,248,255,0.16) 42%, rgba(255,255,255,0.01) 50%, rgba(255,255,255,0.13) 74%, rgba(226,248,255,0.04) 90%, rgba(255,255,255,0.16) 100%)',
          backgroundColor: 'rgba(220, 242, 255, 0.045)',
          boxShadow:
            'inset 0 0 0 1px rgba(220, 245, 255, 0.32), inset 0 2px 0 rgba(255,255,255,0.42), inset 0 -1.5px 0 rgba(190, 232, 245, 0.24), inset 3px 0 10px rgba(255,255,255,0.06), inset -3px 0 10px rgba(255,255,255,0.06)',
        }}
      >
        {/* Minimalist precision brass/gold corner glass standoffs */}
        {[
          { top: 6, left: 6 },
          { top: 6, right: 6 },
          { bottom: 6, left: 6 },
          { bottom: 6, right: 6 },
        ].map((pos, idx) => (
          <span
            key={idx}
            style={{
              position: 'absolute',
              ...pos,
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: `radial-gradient(circle at 30% 30%, #fffbeb, ${clampTint} 65%, #78350f)`,
              boxShadow: '0 1px 3px rgba(0,0,0,0.55)',
              opacity: 0.85,
            }}
          />
        ))}
      </div>
    );
  }
  if (doorKind === 'classified-shutter') {
    return <DukaanRollingShutter look={look} open={open} onToggle={onToggle} />;
  }
  if (doorKind === 'vault-dial') {
    return <BankVaultDoor look={look} open={open} onToggle={onToggle} />;
  }

  const glassSheen =
    'linear-gradient(125deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.03) 36%, rgba(255,255,255,0.14) 55%, rgba(255,255,255,0.02) 78%, rgba(255,255,255,0.12) 100%)';
  const clearTransparentGlassSheen =
    'linear-gradient(126deg, rgba(255,255,255,0.28) 0%, rgba(255,255,255,0.03) 22%, rgba(255,255,255,0.22) 45%, rgba(255,255,255,0.02) 52%, rgba(255,255,255,0.16) 76%, rgba(255,255,255,0.04) 92%, rgba(255,255,255,0.18) 100%)';
  const bevel = `inset 0 0 0 1.5px ${look.dark}, inset 2px 2px 0 2px rgba(255,255,255,0.16), inset -2px -2px 0 2px rgba(0,0,0,0.22)`;

  // Unified Lock / Unlock pill at exact bottom-center across ALL 5 Almirahs
  const lockToggleBtn = (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onToggle();
      }}
      style={{
        position: 'absolute',
        bottom: 4,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 36,
        pointerEvents: 'auto',
        padding: '3px 11px',
        borderRadius: 999,
        background: 'rgba(15, 11, 8, 0.88)',
        border: '1px solid rgba(212, 175, 55, 0.55)',
        color: '#ffffff',
        font: '700 10px/1.2 system-ui',
        whiteSpace: 'nowrap',
        boxShadow: '0 3px 10px rgba(0,0,0,0.55)',
      }}
      className="flex items-center gap-1 cursor-pointer hover:bg-amber-700 transition"
      title={open ? 'Close door' : 'Open door'}
    >
      {open ? <DoorClosed className="w-3 h-3 text-amber-300" /> : <DoorOpen className="w-3 h-3 text-amber-300" />}
      <span>{open ? 'Close' : 'Open'}</span>
    </button>
  );

  // 0A-ARCH. STRAIGHT-ON ROMAN ARCHED GLASS DOUBLE DOORS (Almirah 4 Mocha Espresso Silhouette)
  if (doorKind === 'arched-glass') {
    const champagne = look.handle || '#e5d4bc';
    return (
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: open ? 35 : 25,
          perspective: 1950,
          overflow: 'visible',
          pointerEvents: open ? 'none' : 'auto',
        }}
      >
        {(['left', 'right'] as const).map((side) => {
          const left = side === 'left';
          return (
            <div
              key={side}
              role="button"
              tabIndex={0}
              onClick={(e) => {
                e.stopPropagation();
                onToggle();
              }}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), onToggle())}
              title={open ? 'Click arched glass door to close' : 'Click arched glass door to open'}
              style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                width: '50%',
                [left ? 'left' : 'right']: 0,
                cursor: 'pointer',
                pointerEvents: 'auto',
                transformOrigin: left ? 'left center' : 'right center',
                transform: `translateX(${open ? (left ? -26 : 26) : 0}px) rotateY(${open ? (left ? -148 : 148) : 0}deg)`,
                transition: 'transform 1.5s cubic-bezier(0.22, 1, 0.36, 1)',
                padding: 8,
                background: `linear-gradient(135deg, ${look.frame} 0%, ${look.dark} 100%)`,
                borderTopLeftRadius: left ? 160 : 2,
                borderTopRightRadius: left ? 2 : 160,
                borderBottomLeftRadius: 3,
                borderBottomRightRadius: 3,
                boxShadow: `${bevel}, inset 0 0 0 1px rgba(229, 212, 188, 0.16), 0 8px 18px rgba(0,0,0,0.48)`,
              }}
            >
              {/* Inner Curved Crystal Pane + Delicate Cathedral Mullion Ribs */}
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  height: '100%',
                  backgroundImage: clearTransparentGlassSheen,
                  backgroundColor: 'rgba(218, 230, 245, 0.065)',
                  borderTopLeftRadius: left ? 150 : 2,
                  borderTopRightRadius: left ? 2 : 150,
                  borderBottomLeftRadius: 2,
                  borderBottomRightRadius: 2,
                  overflow: 'hidden',
                  boxShadow:
                    'inset 0 0 0 1.5px rgba(255,255,255,0.28), inset 0 3px 12px rgba(0,0,0,0.45)',
                }}
              >
                <svg
                  viewBox="0 0 160 360"
                  preserveAspectRatio="none"
                  style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
                >
                  {/* Signature Roman Arch Mullion Curve + Slim Vertical Divider (matching Almira 4 shape) */}
                  <line x1="78" y1="74" x2="78" y2="356" stroke={look.frame} strokeWidth="5.5" strokeOpacity="0.92" />
                  <line x1="78" y1="74" x2="78" y2="356" stroke={champagne} strokeWidth="0.9" strokeOpacity="0.32" />
                  {left ? (
                    <path
                      d="M78 356 L78 135 Q78 82 156 76"
                      fill="none"
                      stroke={look.frame}
                      strokeWidth="6"
                      strokeOpacity="0.95"
                    />
                  ) : (
                    <path
                      d="M82 356 L82 135 Q82 82 4 76"
                      fill="none"
                      stroke={look.frame}
                      strokeWidth="6"
                      strokeOpacity="0.95"
                    />
                  )}
                  <path
                    d={left ? 'M158 6 Q76 14 14 102' : 'M2 6 Q84 14 146 102'}
                    fill="none"
                    stroke={champagne}
                    strokeOpacity="0.28"
                    strokeWidth="1.2"
                  />
                </svg>

                {/* Hinges */}
                {[24, 58, 88].map((topPct) => (
                  <span
                    key={topPct}
                    style={{
                      position: 'absolute',
                      top: `${topPct}%`,
                      [left ? 'left' : 'right']: 0,
                      width: 5,
                      height: 15,
                      borderRadius: 2,
                      background: `linear-gradient(180deg, ${champagne}, #78716c)`,
                      opacity: 0.85,
                    }}
                  />
                ))}
              </div>

              {/* Vertical Champagne Brass Bar Pull */}
              <span
                style={{
                  position: 'absolute',
                  top: '45%',
                  [left ? 'right' : 'left']: 4,
                  width: 5,
                  height: 44,
                  borderRadius: 5,
                  background: `linear-gradient(180deg, #fffbeb 0%, ${champagne} 55%, #78716c 100%)`,
                  border: '1px solid rgba(0,0,0,0.45)',
                  boxShadow: '0 3px 6px rgba(0,0,0,0.6)',
                }}
              />
            </div>
          );
        })}
        {lockToggleBtn}
      </div>
    );
  }

  // 0A. FANCY DESIGNER WOOD-FRAMED GLASS DOORS (Almirah 1 Cathedral Walnut & Almirah 2 Mid-Century Rounded Caramel Upper)
  if (doorKind === 'fancy-walnut-glass' || doorKind === 'fancy-caramel-glass') {
    const isCaramel = doorKind === 'fancy-caramel-glass';
    const doorWoodStyle = getWoodSurfaceStyle(look, 'v', 'door', '135deg');
    const goldTrim = isCaramel ? '#fef08a' : '#e5c158';
    const brassDeep = isCaramel ? '#92400e' : '#78350f';

    return (
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: open ? 35 : 25,
          perspective: 1950,
          overflow: 'visible',
          pointerEvents: open ? 'none' : 'auto',
        }}
      >
        {(['left', 'right'] as const).map((side) => {
          const left = side === 'left';
          return (
            <div
              key={side}
              role="button"
              tabIndex={0}
              onClick={(e) => {
                e.stopPropagation();
                onToggle();
              }}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), onToggle())}
              title={open ? 'Click glass door to close & lock' : 'Click glass door to open'}
              style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                width: '50%',
                [left ? 'left' : 'right']: 0,
                cursor: 'pointer',
                pointerEvents: 'auto',
                transformOrigin: left ? 'left center' : 'right center',
                transform: `translateX(${open ? (left ? -26 : 26) : 0}px) rotateY(${open ? (left ? -148 : 148) : 0}deg)`,
                transition: 'transform 1.5s cubic-bezier(0.22, 1, 0.36, 1)',
                padding: isCaramel ? 10 : 9,
                borderRadius: isCaramel ? (left ? '14px 2px 2px 10px' : '2px 14px 10px 2px') : 2,
                ...doorWoodStyle,
                boxShadow: `${bevel}, inset 0 0 0 1px rgba(254, 240, 138, 0.22), 0 8px 18px rgba(0,0,0,0.46)`,
              }}
            >
              {/* Inner Carved Beveled Lip Around Crystal-Clear Glass Pane */}
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  height: '100%',
                  backgroundImage: isCaramel
                    ? 'linear-gradient(126deg, rgba(255,255,255,0.18) 0%, transparent 18%, rgba(255,255,255,0.12) 44%, transparent 52%, rgba(255,255,255,0.09) 76%, transparent 94%)'
                    : clearTransparentGlassSheen,
                  backgroundColor: isCaramel ? 'rgba(255, 255, 255, 0.015)' : 'rgba(218, 238, 255, 0.075)',
                  borderRadius: isCaramel ? 12 : 3,
                  overflow: 'hidden',
                  boxShadow: isCaramel
                    ? 'inset 0 0 0 1.5px rgba(255,255,255,0.34), inset 0 0 0 2.5px rgba(212,175,55,0.22)'
                    : 'inset 0 0 0 1.5px rgba(255,255,255,0.42), inset 0 0 0 2.5px rgba(212,175,55,0.24), inset 0 3px 12px rgba(0,0,0,0.34)',
                }}
              >
                {isCaramel ? (
                  <svg
                    viewBox="0 0 160 320"
                    preserveAspectRatio="none"
                    style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
                  >
                    <rect x="4" y="4" width="152" height="312" rx="16" fill="none" stroke={goldTrim} strokeOpacity="0.45" strokeWidth="1.5" />
                    <path d="M12 22 Q80 6 148 22" fill="none" stroke={goldTrim} strokeWidth="1.1" strokeOpacity="0.45" />
                  </svg>
                ) : (
                  <svg
                    viewBox="0 0 160 320"
                    preserveAspectRatio="none"
                    style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
                  >
                    <path d="M6 58 Q80 -6 154 58" fill="none" stroke={look.frame} strokeWidth="7" strokeOpacity="0.95" />
                    <path d="M6 58 Q80 -6 154 58" fill="none" stroke={goldTrim} strokeWidth="1.4" strokeOpacity="0.65" />
                    <rect x="5" y="5" width="150" height="310" rx="8" fill="none" stroke={goldTrim} strokeOpacity="0.4" strokeWidth="1.4" />
                  </svg>
                )}

                {[14, 50, 86].map((topPct) => (
                  <span
                    key={topPct}
                    style={{
                      position: 'absolute',
                      top: `${topPct}%`,
                      [left ? 'left' : 'right']: 0,
                      width: 5,
                      height: 18,
                      borderRadius: 2,
                      background: `linear-gradient(180deg, ${goldTrim}, ${brassDeep})`,
                      boxShadow: '0 1px 3px rgba(0,0,0,0.65)',
                      opacity: 0.9,
                    }}
                  />
                ))}
              </div>

              {/* Sculpted Vertical Wood/Brass Door Grip Pull (matching Almira 2 vertical seam pulls) */}
              <span
                style={{
                  position: 'absolute',
                  top: '41%',
                  [left ? 'right' : 'left']: 4,
                  width: 7,
                  height: 48,
                  borderRadius: 6,
                  background: isCaramel
                    ? `linear-gradient(180deg, ${look.plank} 0%, ${look.frame} 55%, ${look.dark} 100%)`
                    : `linear-gradient(180deg, ${goldTrim} 0%, #d4af37 52%, ${brassDeep} 100%)`,
                  border: `1px solid ${isCaramel ? 'rgba(254, 240, 138, 0.45)' : 'rgba(0,0,0,0.45)'}`,
                  boxShadow: '0 3px 6px rgba(0,0,0,0.62), inset 0 1px 1px rgba(255,255,255,0.45)',
                }}
              />
            </div>
          );
        })}
        {lockToggleBtn}
      </div>
    );
  }

  // 0B. SOLID CARVED POLISHED WOOD DOUBLE DOORS (Lower Section of Almirah 1 & Almirah 2 — ZERO GLASS)
  if (doorKind === 'solid-wood-door') {
    const doorWoodStyle = getWoodSurfaceStyle(look, 'v', 'door', '135deg');
    const isCaramel = look.name === 'Creamy Caramel';
    const trimGold = isCaramel ? '#fef08a' : '#e5c158';
    return (
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: open ? 35 : 25,
          perspective: 1900,
          overflow: 'visible',
          pointerEvents: open ? 'none' : 'auto',
        }}
      >
        {(['left', 'right'] as const).map((side) => {
          const left = side === 'left';
          return (
            <div
              key={side}
              role="button"
              tabIndex={0}
              onClick={(e) => {
                e.stopPropagation();
                onToggle();
              }}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), onToggle())}
              title={open ? 'Click solid wood door to close' : 'Click solid wood door to open'}
              style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                width: '50%',
                [left ? 'left' : 'right']: 0,
                cursor: 'pointer',
                pointerEvents: 'auto',
                transformOrigin: left ? 'left center' : 'right center',
                transform: `translateX(${open ? (left ? -24 : 24) : 0}px) rotateY(${open ? (left ? -146 : 146) : 0}deg)`,
                transition: 'transform 1.5s cubic-bezier(0.22, 1, 0.36, 1)',
                padding: 10,
                ...doorWoodStyle,
                boxShadow: `${bevel}, inset 0 0 0 1px ${look.dark}, 0 8px 18px rgba(0,0,0,0.48)`,
                display: 'flex',
                flexDirection: 'column',
                gap: 6,
              }}
            >
              {/* Raised Solid Wood Carving Panels (Zero Glass) */}
              <div
                style={{
                  flex: 1,
                  borderRadius: 3,
                  ...getWoodSurfaceStyle(look, 'panel', 'door', '150deg'),
                  border: `1.5px solid ${look.dark}`,
                  boxShadow:
                    'inset 2px 2px 0 rgba(255,244,218,0.22), inset -2px -2px 0 rgba(0,0,0,0.45), 0 2px 6px rgba(0,0,0,0.38)',
                  position: 'relative',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    inset: 8,
                    border: `1px solid ${isCaramel ? 'rgba(254,240,138,0.34)' : 'rgba(212,175,55,0.26)'}`,
                    borderRadius: 2,
                    pointerEvents: 'none',
                  }}
                />
              </div>

              {/* Brass Pull / Turned Wood Knob */}
              <span
                style={{
                  position: 'absolute',
                  top: '44%',
                  [left ? 'right' : 'left']: 5,
                  width: isCaramel ? 11 : 6,
                  height: isCaramel ? 11 : 34,
                  borderRadius: isCaramel ? '50%' : 5,
                  background: `radial-gradient(circle at 35% 30%, ${trimGold} 0%, #d4af37 58%, #78350f 100%)`,
                  border: '1px solid rgba(0,0,0,0.48)',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.65)',
                }}
              />
            </div>
          );
        })}
        {lockToggleBtn}
      </div>
    );
  }

  // 1. FRENCH CLEAR-GLASS SWING (Dark Chocolate Upper) & FULL CLEAR DOUBLE GLASS (Dark Chocolate Lower)
  if (doorKind === 'french-swing' || doorKind === 'diamond-swing') {
    const isWoodDoor = look.grain > 0;
    const isUpperClearWood = isWoodDoor && doorKind === 'french-swing';
    const doorWoodStyle = isWoodDoor ? getWoodSurfaceStyle(look, 'v', 'door', '135deg') : undefined;
    return (
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: open ? 35 : 25,
          perspective: 1900,
          overflow: 'visible',
          pointerEvents: open ? 'none' : 'auto',
        }}
      >
        {(['left', 'right'] as const).map((side) => {
          const left = side === 'left';
          return (
            <div
              key={side}
              role="button"
              tabIndex={0}
              onClick={(e) => {
                e.stopPropagation();
                onToggle();
              }}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), onToggle())}
              title={open ? 'Click glass door to close' : 'Click glass door to open'}
              style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                width: '50%',
                [left ? 'left' : 'right']: 0,
                cursor: 'pointer',
                pointerEvents: 'auto',
                transformOrigin: left ? 'left center' : 'right center',
                transform: `translateX(${open ? (left ? -26 : 26) : 0}px) rotateY(${open ? (left ? -148 : 148) : 0}deg)`,
                transition: 'transform 1.5s cubic-bezier(0.22, 1, 0.36, 1)',
                ...(isWoodDoor
                  ? {
                      padding: 7,
                      ...doorWoodStyle,
                      boxShadow: `${bevel}, 0 6px 14px rgba(0,0,0,0.42)`,
                    }
                  : {
                      border: `8px solid ${look.frame}`,
                      backgroundImage: glassSheen,
                      backgroundColor: 'rgba(255, 255, 255, 0.04)',
                      boxShadow: bevel,
                    }),
              }}
            >
              {isWoodDoor && (
                <div
                  style={{
                    position: 'relative',
                    width: '100%',
                    height: '100%',
                    backgroundImage: isUpperClearWood ? clearTransparentGlassSheen : glassSheen,
                    backgroundColor: isUpperClearWood ? 'rgba(218, 238, 255, 0.08)' : 'rgba(255, 255, 255, 0.06)',
                    boxShadow: isUpperClearWood
                      ? 'inset 0 0 0 1.5px rgba(255,255,255,0.38), inset 2px 2px 10px rgba(255,255,255,0.14), inset 0 0 0 3px rgba(0,0,0,0.28)'
                      : 'inset 0 0 0 1px rgba(0,0,0,0.52), inset 0 2px 8px rgba(0,0,0,0.32)',
                  }}
                />
              )}
              {/* Curved brass pull */}
              <span
                style={{
                  position: 'absolute',
                  top: '42%',
                  [left ? 'right' : 'left']: 7,
                  width: 5,
                  height: 36,
                  borderRadius: 4,
                  background: 'linear-gradient(180deg, #fef08a 0%, #d4af37 55%, #854d0e 100%)',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.6)',
                }}
              />
            </div>
          );
        })}
        {lockToggleBtn}
      </div>
    );
  }

  // 2. BYPASS SLIDING GLASS (Creamy Caramel Upper) & POCKET FLUTED SLIDING GLASS (Creamy Caramel Lower)
  if (doorKind === 'bypass-slide' || doorKind === 'pocket-fluted') {
    const isFluted = doorKind === 'pocket-fluted';
    const isWoodDoor = look.grain > 0;
    const isUpperClearWood = isWoodDoor && !isFluted;
    const doorWoodStyle = isWoodDoor ? getWoodSurfaceStyle(look, 'v', 'door', '135deg') : undefined;
    return (
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 25,
          overflow: 'hidden',
          pointerEvents: open ? 'none' : 'auto',
        }}
      >
        {/* Top brass glide rail */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 6,
            zIndex: 29,
            background: 'linear-gradient(90deg, #78350f, #fef08a, #b45309, #78350f)',
            pointerEvents: 'none',
          }}
        />
        {(['left', 'right'] as const).map((side) => {
          const left = side === 'left';
          const shift = left ? '-100%' : '100%';
          const glassBg = isFluted
            ? `repeating-linear-gradient(90deg, rgba(255,255,255,0.28) 0 2px, rgba(255,255,255,0.04) 2px 7px), ${glassSheen}`
            : isUpperClearWood
              ? clearTransparentGlassSheen
              : glassSheen;
          return (
            <div
              key={side}
              role="button"
              tabIndex={0}
              onClick={(e) => {
                e.stopPropagation();
                onToggle();
              }}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), onToggle())}
              title={open ? 'Click sliding door leaf to close' : 'Click to slide glass doors open'}
              style={{
                position: 'absolute',
                top: 4,
                bottom: 0,
                width: '50.5%',
                [left ? 'left' : 'right']: 0,
                cursor: 'pointer',
                pointerEvents: 'auto',
                transform: open ? `translateX(${shift})` : 'translateX(0%)',
                transition: 'transform 1.45s cubic-bezier(0.22, 1, 0.36, 1)',
                ...(isWoodDoor
                  ? {
                      padding: 7,
                      ...doorWoodStyle,
                      boxShadow: `${bevel}, 0 4px 12px rgba(0,0,0,0.35)`,
                    }
                  : {
                      border: `7px solid ${look.frame}`,
                      backgroundImage: glassBg,
                      backgroundColor: isFluted ? 'rgba(255, 248, 235, 0.18)' : 'rgba(255, 255, 255, 0.05)',
                      backdropFilter: isFluted ? 'blur(1.5px)' : 'none',
                      boxShadow: `${bevel}, 0 4px 12px rgba(0,0,0,0.35)`,
                    }),
              }}
            >
              {isWoodDoor && (
                <div
                  style={{
                    position: 'relative',
                    width: '100%',
                    height: '100%',
                    backgroundImage: glassBg,
                    backgroundColor: isFluted
                      ? 'rgba(255, 248, 235, 0.18)'
                      : isUpperClearWood
                        ? 'rgba(218, 238, 255, 0.09)'
                        : 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: isFluted ? 'blur(1.5px)' : 'none',
                    boxShadow: isUpperClearWood
                      ? 'inset 0 0 0 1.5px rgba(255,255,255,0.4), inset 2px 2px 10px rgba(255,255,255,0.14), inset 0 0 0 3px rgba(92,52,18,0.28)'
                      : 'inset 0 0 0 1px rgba(92,52,18,0.45), inset 0 2px 6px rgba(0,0,0,0.22)',
                  }}
                />
              )}
              {/* Recessed brass finger pull */}
              <div
                style={{
                  position: 'absolute',
                  top: '44%',
                  [left ? 'left' : 'right']: 8,
                  width: 9,
                  height: 28,
                  borderRadius: 4,
                  background: 'rgba(120, 53, 15, 0.65)',
                  border: '1.5px solid #fef3c7',
                  boxShadow: '0 2px 5px rgba(0,0,0,0.5)',
                }}
              />
            </div>
          );
        })}
        {lockToggleBtn}
      </div>
    );
  }

  // 3. BI-FOLD ACCORDION CLEAR-GLASS DOORS (Vanilla White Upper — ZERO horizontal middle white bar!)
  if (doorKind === 'bifold-fold') {
    return (
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 25,
          overflow: 'hidden',
          pointerEvents: open ? 'none' : 'auto',
        }}
      >
        {(['left', 'right'] as const).map((side) => {
          const left = side === 'left';
          return (
            <div
              key={side}
              role="button"
              tabIndex={0}
              onClick={(e) => {
                e.stopPropagation();
                onToggle();
              }}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), onToggle())}
              title={open ? 'Click folded glass panel to close' : 'Click to fold crystal glass doors open'}
              style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                width: '50%',
                [left ? 'left' : 'right']: 0,
                cursor: 'pointer',
                pointerEvents: 'auto',
                transformOrigin: left ? 'left center' : 'right center',
                transform: open ? `translateX(${left ? '-100%' : '100%'}) scaleX(0.05)` : 'translateX(0%) scaleX(1)',
                transition: 'transform 1.65s cubic-bezier(0.22, 1, 0.36, 1)',
                border: look.name === 'Creamy Caramel' ? `4px solid ${look.frame}` : `7px solid ${look.frame}`,
                backgroundImage: glassSheen,
                backgroundColor: 'rgba(255, 255, 255, 0.04)',
                boxShadow: bevel,
              }}
            >
              {/* Center vertical accordion fold seam only — NO horizontal middle bar */}
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  bottom: 0,
                  left: '50%',
                  width: 3,
                  background: look.dark,
                  opacity: 0.45,
                }}
              />
              {/* Satin nickel minimalist handle */}
              <span
                style={{
                  position: 'absolute',
                  top: '44%',
                  [left ? 'right' : 'left']: 6,
                  width: 5,
                  height: 32,
                  borderRadius: 3,
                  background: 'linear-gradient(180deg, #e2e8f0, #94a3b8)',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.45)',
                }}
              />
            </div>
          );
        })}
        {lockToggleBtn}
      </div>
    );
  }

  // 4. FLIP-UP AWNING GLASS (Mocha Espresso Upper) & DROP-DOWN GLASS FLAP (Mocha Espresso Lower)
  if (doorKind === 'flip-up' || doorKind === 'drop-down') {
    const isFlipUp = doorKind === 'flip-up';
    return (
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 25,
          perspective: 1800,
          overflow: 'hidden',
          pointerEvents: open ? 'none' : 'auto',
        }}
      >
        <div
          role="button"
          tabIndex={0}
          onClick={(e) => {
            e.stopPropagation();
            onToggle();
          }}
          onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), onToggle())}
          title={open ? 'Click glass panel to close' : 'Click glass panel to open'}
          style={{
            position: 'absolute',
            inset: 0,
            cursor: 'pointer',
            pointerEvents: 'auto',
            transformOrigin: isFlipUp ? 'top center' : 'bottom center',
            transform: open
              ? isFlipUp
                ? 'translateY(-100%) rotateX(78deg)'
                : 'translateY(100%) rotateX(-78deg)'
              : 'translateY(0%) rotateX(0deg)',
            transition: 'transform 1.45s cubic-bezier(0.22, 1, 0.36, 1)',
            border: `8px solid ${look.frame}`,
            backgroundImage: glassSheen,
            backgroundColor: isFlipUp ? 'rgba(180, 120, 60, 0.08)' : 'rgba(60, 35, 22, 0.14)',
            boxShadow: `${bevel}, 0 8px 18px rgba(0,0,0,0.45)`,
          }}
        >
          {/* Horizontal Espresso Bar Pull */}
          <span
            style={{
              position: 'absolute',
              left: '50%',
              transform: 'translateX(-50%)',
              [isFlipUp ? 'bottom' : 'top']: 8,
              width: 72,
              height: 5,
              borderRadius: 3,
              background: 'linear-gradient(90deg, #a8a29e, #f5f5f4, #a8a29e)',
              boxShadow: '0 2px 5px rgba(0,0,0,0.6)',
            }}
          />
        </div>
        {lockToggleBtn}
      </div>
    );
  }

  // 5. ARMORED STEEL BUNKER SLIDING PANELS (Vault Lower — Real Forged Steel Plate + Corner Rivets + Bar Handles)
  const bunkerSteel = getWoodSurfaceStyle(look, 'panel', 'door', '155deg');
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 25,
        overflow: 'hidden',
        pointerEvents: open ? 'none' : 'auto',
      }}
    >
      {(['left', 'right'] as const).map((side) => {
        const left = side === 'left';
        return (
          <div
            key={side}
            role="button"
            tabIndex={0}
            onClick={(e) => {
              e.stopPropagation();
              onToggle();
            }}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), onToggle())}
            title={open ? 'Click panel edge to close' : 'Click to slide armored steel vault panels open'}
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              width: '50%',
              [left ? 'left' : 'right']: 0,
              cursor: 'pointer',
              pointerEvents: 'auto',
              transform: open ? `translateX(${left ? '-100%' : '100%'})` : 'translateX(0%)',
              transition: 'transform 1.5s cubic-bezier(0.22, 1, 0.36, 1)',
              border: '5px solid #121418',
              ...bunkerSteel,
              boxShadow:
                'inset 0 0 32px rgba(0,0,0,0.92), inset 1px 1px 0 rgba(148,163,184,0.14), inset -1px -1px 0 rgba(0,0,0,0.85)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {/* Armored Inner Plate Frame */}
            <div
              style={{
                position: 'relative',
                width: '78%',
                height: '66%',
                border: '1.5px solid rgba(203, 213, 225, 0.2)',
                boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.65), 0 1px 0 rgba(255,255,255,0.1)',
                borderRadius: 3,
              }}
            >
              {/* 4 Corner Armor Rivets */}
              {[
                { top: 5, left: 5 },
                { top: 5, right: 5 },
                { bottom: 5, left: 5 },
                { bottom: 5, right: 5 },
              ].map((pos, rIdx) => (
                <span
                  key={rIdx}
                  style={{
                    position: 'absolute',
                    ...pos,
                    width: 5,
                    height: 5,
                    borderRadius: '50%',
                    background: 'radial-gradient(circle at 30% 30%, #e2e8f0, #64748b 65%, #1e293b)',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.85)',
                  }}
                />
              ))}
            </div>
            {/* Heavy Brushed Steel & Brass Bar Handle */}
            <span
              style={{
                position: 'absolute',
                top: '50%',
                transform: 'translateY(-50%)',
                [left ? 'right' : 'left']: 9,
                width: 6,
                height: 38,
                borderRadius: 3,
                background: 'linear-gradient(180deg, #e2e8f0 0%, #94a3b8 55%, #475569 100%)',
                border: '1px solid #0f172a',
                boxShadow: '0 2px 6px rgba(0,0,0,0.8), inset 0 1px 1px rgba(255,255,255,0.65)',
              }}
            />
          </div>
        );
      })}
      {lockToggleBtn}
    </div>
  );
}

/* ───────────── SINGLE SHELF ROW WITH BIG COVER THUMBS, PINNED + ADD, SLIDE BAR & RENAME ───────────── */

function ShelfRow({
  shelf,
  shelfIdx,
  bayIdx: _bayIdx,
  totalShelves: _totalShelves,
  look,
  ink,
  night,
  lit,
  open,
  renderDoors,
  isClassifiedBottom = false,
  onMoveShelf,
  onRenameShelf,
  onAddBook,
  onRemoveBook,
  onEditBookThumbnail,
  onSelectBook,
  pickedBook,
  onPickBook,
  onDropBook,
  onCreateFolder,
  onOpenFolder,
  onOpenFolderSettings,
  onDropBookToFolder,
}: {
  shelf: ShelfT;
  shelfIdx: number;
  bayIdx: number;
  totalShelves: number;
  look: Look;
  ink: string;
  night: boolean;
  lit: boolean;
  open: boolean;
  renderDoors: boolean;
  isClassifiedBottom?: boolean;
  onMoveShelf: (i: number, d: -1 | 1) => void;
  onRenameShelf: (shelfId: string, newName: string) => void;
  onAddBook: (shelfId: string) => void;
  onRemoveBook: (shelfId: string, bookId: string) => void;
  onEditBookThumbnail?: (shelfId: string, book: Book) => void;
  onSelectBook?: (book: Book) => void;
  pickedBook?: { fromShelfId: string; book: Book } | null;
  onPickBook?: (shelfId: string, book: Book) => void;
  onDropBook?: (targetShelfId: string, explicitSource?: { fromShelfId: string; bookId: string }) => void;
  onCreateFolder: (shelfId: string) => void;
  onOpenFolder: (shelfId: string, folder: ShelfFolder) => void;
  onOpenFolderSettings: (shelfId: string, folder: ShelfFolder) => void;
  onDropBookToFolder?: (targetShelfId: string, folderId: string, explicitSource?: { fromShelfId: string; bookId: string }) => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [slidePct, setSlidePct] = useState(0);
  const [isEditingName, setIsEditingName] = useState(false);
  const [draftName, setDraftName] = useState(shelf.name);
  const [isDragOver, setIsDragOver] = useState(false);

  useEffect(() => {
    setDraftName(shelf.name);
  }, [shelf.name]);

  const handleTrackScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setSlidePct(max > 1 ? Math.round((el.scrollLeft / max) * 100) : 0);
  };

  const handleSliderChange = (pct: number) => {
    setSlidePct(pct);
    const el = scrollRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    if (max > 0) {
      el.scrollLeft = (pct / 100) * max;
    }
  };

  const scrollByDelta = (delta: number) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: delta, behavior: 'smooth' });
  };

  const commitRename = () => {
    const cleaned = draftName.trim();
    if (cleaned && cleaned !== shelf.name) {
      onRenameShelf(shelf.id, cleaned);
    } else {
      setDraftName(shelf.name);
    }
    setIsEditingName(false);
  };

  const accessible = open || !renderDoors;
  const mutedInk = look.light ? 'rgba(65,50,38,0.65)' : 'rgba(235,222,205,0.58)';
  const canDropPickedHere = Boolean(accessible && pickedBook && pickedBook.fromShelfId !== shelf.id);

  return (
    <div
      style={{
        position: 'relative',
        padding: isClassifiedBottom ? '24px 12px 0' : '8px 12px 0',
        minWidth: 0,
        outline: isDragOver ? '2px dashed rgba(245, 158, 11, 0.9)' : 'none',
        outlineOffset: -3,
        backgroundColor: isDragOver ? 'rgba(245, 158, 11, 0.12)' : undefined,
        borderRadius: isDragOver ? 8 : undefined,
        transition: 'background-color 150ms ease, outline 150ms ease',
      }}
      onDragOver={(e) => {
        if (!accessible) return;
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        if (!isDragOver) setIsDragOver(true);
      }}
      onDragLeave={() => {
        if (isDragOver) setIsDragOver(false);
      }}
      onDrop={(e) => {
        if (!accessible) return;
        e.preventDefault();
        setIsDragOver(false);
        try {
          const raw = e.dataTransfer.getData('application/json');
          if (raw) {
            const parsed = JSON.parse(raw);
            if (parsed?.fromShelfId && parsed?.bookId) {
              onDropBook?.(shelf.id, parsed);
              return;
            }
          }
        } catch {}
        onDropBook?.(shelf.id);
      }}
    >
      {/* Interior Cove Spotlight Glow */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 0,
          height: night && lit ? 60 : 34,
          pointerEvents: 'none',
          background:
            night && lit
              ? 'linear-gradient(180deg, rgba(254,240,138,0.68), rgba(253,224,71,0.16) 60%, transparent)'
              : 'linear-gradient(180deg, rgba(0,0,0,0.28), transparent)',
        }}
      />

      {/* Shelf Header: Editable Section Title + Book Count + Controls */}
      <div
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 6,
          paddingBottom: 4,
        }}
      >
        <div className="flex items-center gap-1.5 min-w-0 flex-1">
          {isEditingName ? (
            <input
              type="text"
              autoFocus
              value={draftName}
              onChange={(e) => setDraftName(e.target.value)}
              onBlur={commitRename}
              onKeyDown={(e) => {
                if (e.key === 'Enter') commitRename();
                if (e.key === 'Escape') {
                  setDraftName(shelf.name);
                  setIsEditingName(false);
                }
              }}
              className="px-2 py-0.5 rounded bg-black/30 border border-amber-400/70 text-[11px] font-semibold uppercase tracking-wider outline-none max-w-[190px]"
              style={{ color: '#fffbeb' }}
            />
          ) : (
            <button
              type="button"
              onClick={() => accessible && setIsEditingName(true)}
              className="flex items-center gap-1 text-left min-w-0 group cursor-pointer"
              title={accessible ? 'Click to rename section' : 'Open door to edit section name'}
            >
              <span
                style={{
                  font: '700 10.5px/1.2 system-ui',
                  letterSpacing: 0.7,
                  textTransform: 'uppercase',
                  color: ink,
                }}
                className="truncate"
              >
                {shelf.name}
              </span>
              {accessible && (
                <Pencil
                  className="w-2.5 h-2.5 shrink-0 opacity-45 group-hover:opacity-100 transition-opacity"
                  style={{ color: ink }}
                />
              )}
            </button>
          )}
        </div>

        <span style={{ display: 'flex', gap: 5, alignItems: 'center', flexShrink: 0 }}>
          {canDropPickedHere && pickedBook && (
            <button
              type="button"
              onClick={() =>
                onDropBook?.(shelf.id, {
                  fromShelfId: pickedBook.fromShelfId,
                  bookId: pickedBook.book.id,
                })
              }
              style={{
                boxShadow: '0 3px 8px rgba(0,0,0,0.48), inset 0 1px 0 rgba(255,255,255,0.45)',
              }}
              className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-stone-950 hover:bg-amber-400 transition cursor-pointer animate-pulse"
              title={`Drop "${pickedBook.book.title}" into ${shelf.name}`}
            >
              Drop Here
            </button>
          )}
          <span style={{ font: '500 10.5px system-ui', color: mutedInk }}>
            {shelf.books.length} {shelf.books.length === 1 ? 'book' : 'books'}
          </span>

          <span
            style={{
              display: 'flex',
              gap: 4,
              opacity: accessible ? 1 : 0.35,
              pointerEvents: accessible ? 'auto' : 'none',
            }}
          >
            <button
              type="button"
              onClick={() => onCreateFolder(shelf.id)}
              className="p-1.5 rounded-lg flex items-center justify-center hover:brightness-110 active:translate-y-px transition cursor-pointer"
              style={{
                background: look.light ? 'rgba(180,83,9,0.16)' : 'rgba(245,158,11,0.22)',
                color: look.light ? '#78350f' : '#fde68a',
                border: look.light ? '1px solid rgba(180,83,9,0.32)' : '1px solid rgba(251,191,36,0.4)',
                boxShadow:
                  '0 2px 5px rgba(0,0,0,0.42), 0 1px 2px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.22)',
              }}
              aria-label="Create custom folder in this section"
              title="Create a custom folder inside this section"
            >
              <FolderPlus className="w-4 h-4" />
            </button>
            <button
              type="button"
              disabled={shelfIdx === 0}
              onClick={() => onMoveShelf(shelfIdx, -1)}
              className="px-1.5 py-0.5 rounded text-[10px] font-bold hover:brightness-110 active:translate-y-px transition disabled:opacity-30 cursor-pointer"
              style={{
                background: look.light ? 'rgba(56,34,20,0.16)' : 'rgba(68,64,60,0.68)',
                color: ink,
                border: look.light ? '1px solid rgba(56,34,20,0.25)' : '1px solid rgba(255,255,255,0.2)',
                boxShadow:
                  '0 2px 5px rgba(0,0,0,0.45), 0 1px 2px rgba(0,0,0,0.32), inset 0 1px 0 rgba(255,255,255,0.22)',
              }}
              title="Move section up"
            >
              ↑
            </button>
            <button
              type="button"
              disabled={shelfIdx === _totalShelves - 1}
              onClick={() => onMoveShelf(shelfIdx, 1)}
              className="px-1.5 py-0.5 rounded text-[10px] font-bold hover:brightness-110 active:translate-y-px transition disabled:opacity-30 cursor-pointer"
              style={{
                background: look.light ? 'rgba(56,34,20,0.16)' : 'rgba(68,64,60,0.68)',
                color: ink,
                border: look.light ? '1px solid rgba(56,34,20,0.25)' : '1px solid rgba(255,255,255,0.2)',
                boxShadow:
                  '0 2px 5px rgba(0,0,0,0.45), 0 1px 2px rgba(0,0,0,0.32), inset 0 1px 0 rgba(255,255,255,0.22)',
              }}
              title="Move section down"
            >
              ↓
            </button>
          </span>
        </span>
      </div>

      {/* Main Shelf Display Track + Always-Visible Pinned + Add Button */}
      <div
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'flex-end',
          gap: 10,
          minWidth: 0,
          pointerEvents: accessible ? 'auto' : 'none',
        }}
      >
        {/* Scrollable Books & Folders Row */}
        <div
          ref={scrollRef}
          onScroll={handleTrackScroll}
          className="sh-scroll"
          style={{
            flex: 1,
            minWidth: 0,
            display: 'flex',
            alignItems: 'flex-end',
            gap: 8,
            minHeight: 100,
            overflowX: 'auto',
            padding: '6px 4px 6px',
          }}
        >
          {/* Empty Shelf Visual Guide */}
          {shelf.books.length === 0 && (shelf.folders?.length ?? 0) === 0 && (
            <div
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: 74,
                borderRadius: 6,
                border: `1px dashed ${look.light ? 'rgba(80,60,40,0.22)' : 'rgba(255,235,205,0.18)'}`,
                color: mutedInk,
                fontSize: 10,
                fontStyle: 'italic',
                padding: '0 8px',
                textAlign: 'center',
              }}
            >
              {accessible ? 'Empty compartment · Upload Document or Create Folder' : 'Empty shelf'}
            </div>
          )}

          {/* Prominent Front-Cover Book Thumbnails (Logo-Only Default or Concise Name) */}
          {shelf.books.map((b, n) => {
            const c = COVER[b.cover] ?? COVER.Amber!;
            const bookHeight = 82 + ((n + shelfIdx) % 3) * 3;
            const hasCustomBg = Boolean(b.thumbnail?.bgColor);
            const isPicked = pickedBook?.book.id === b.id && pickedBook?.fromShelfId === shelf.id;
            return (
              <div
                key={b.id}
                role="button"
                tabIndex={0}
                draggable={accessible}
                onDragStart={(e) => {
                  if (!accessible) return;
                  e.dataTransfer.setData(
                    'application/json',
                    JSON.stringify({ fromShelfId: shelf.id, bookId: b.id })
                  );
                  e.dataTransfer.effectAllowed = 'move';
                  onPickBook?.(shelf.id, b);
                }}
                title={`${b.title} · Drag or Pick & Drop to move between sections · Click to open in Read Studio`}
                onClick={() => onSelectBook?.(b)}
                onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onSelectBook?.(b)}
                className={`sh-book-item group ${isPicked ? 'ring-2 ring-amber-400 opacity-75 scale-95' : ''}`}
                style={{
                  flex: 'none',
                  width: 60,
                  height: bookHeight,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  padding: '6px 6px 6px 10px',
                  boxSizing: 'border-box',
                  borderRadius: '2px 5px 5px 2px',
                  backgroundImage: hasCustomBg
                    ? `linear-gradient(145deg, ${b.thumbnail!.bgColor} 0%, rgba(15,12,10,0.42) 100%)`
                    : `linear-gradient(145deg, ${c.from} 0%, ${c.to} 100%)`,
                  backgroundColor: b.thumbnail?.bgColor || c.from,
                  borderLeft: `6px solid ${c.edge}`,
                  boxShadow:
                    '4px 6px 10px rgba(0,0,0,0.52), inset -3px 0 0 rgba(255,255,255,0.32), inset 0 1px 0 rgba(255,255,255,0.2)',
                  color: b.thumbnail?.fgColor || c.ink,
                  cursor: accessible ? 'grab' : 'pointer',
                  position: 'relative',
                }}
              >
                {/* Edit Cover Logo / 100 Icons button on hover/mobile */}
                {accessible && onEditBookThumbnail && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditBookThumbnail(shelf.id, b);
                    }}
                    title="Edit Cover Logo, Font, Colors or 100 Icons"
                    style={{ boxShadow: '0 3px 8px rgba(0,0,0,0.62), 0 1px 2px rgba(0,0,0,0.45)' }}
                    className="opacity-85 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity absolute -top-1.5 -left-1.5 w-5 h-5 rounded-full bg-amber-500 text-stone-950 border border-amber-200 flex items-center justify-center z-20 cursor-pointer"
                  >
                    <Palette className="w-2.5 h-2.5" />
                  </button>
                )}

                {/* Pick & Drop button for moving between shelf sections */}
                {accessible && onPickBook && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onPickBook(shelf.id, b);
                    }}
                    title={isPicked ? 'Cancel pick up' : 'Pick up book to move to another section'}
                    style={{ boxShadow: '0 3px 8px rgba(0,0,0,0.62), 0 1px 2px rgba(0,0,0,0.45)' }}
                    className={`${
                      isPicked ? 'opacity-100 bg-amber-400 text-stone-950' : 'opacity-85 sm:opacity-0 sm:group-hover:opacity-100 bg-stone-900 text-amber-200'
                    } transition-opacity absolute -bottom-1.5 -left-1.5 w-5 h-5 rounded-full border border-amber-300/70 flex items-center justify-center z-20 cursor-pointer`}
                  >
                    <Move className="w-2.5 h-2.5" />
                  </button>
                )}

                {/* Remove button on hover/mobile */}
                {accessible && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveBook(shelf.id, b.id);
                    }}
                    title="Remove book from shelf"
                    style={{ boxShadow: '0 3px 8px rgba(0,0,0,0.62), 0 1px 2px rgba(0,0,0,0.45)' }}
                    className="opacity-85 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-stone-950 text-amber-300 border border-amber-400/50 flex items-center justify-center z-20 cursor-pointer"
                  >
                    <X className="w-2.5 h-2.5" />
                  </button>
                )}

                {/* Inlaid Gold Cover Border */}
                <div
                  style={{
                    position: 'absolute',
                    inset: '4px 4px 4px 8px',
                    border: '1px solid rgba(254, 240, 138, 0.28)',
                    borderRadius: 2,
                    pointerEvents: 'none',
                  }}
                />

                {/* Top Cover Spine Dot */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                  <span
                    style={{
                      width: 14,
                      height: 2,
                      borderRadius: 1,
                      background: 'rgba(254, 240, 138, 0.5)',
                    }}
                  />
                </div>

                {/* Prominent Logo Monogram / Icon (No full title clutter by default!) */}
                <BookLogoBadge
                  title={b.title}
                  thumbnail={b.thumbnail}
                  fallbackBg={c.from}
                  fallbackInk={c.ink}
                  shelfMode={true}
                />

                {/* Bottom Cover Foil Accent */}
                <div
                  style={{
                    height: 2,
                    width: '65%',
                    margin: '0 auto',
                    background: 'rgba(254, 240, 138, 0.5)',
                    borderRadius: 1,
                  }}
                />
              </div>
            );
          })}

          {/* Folders on this Shelf (Settings button right ON TOP of each folder) */}
          {shelf.folders?.map((fld) => (
            <ShelfFolderTile
              key={fld.id}
              folder={fld}
              accessible={accessible}
              onOpenFolder={() => onOpenFolder(shelf.id, fld)}
              onOpenFolderSettings={() => onOpenFolderSettings(shelf.id, fld)}
              onDropBookIntoFolder={(explicit) => onDropBookToFolder?.(shelf.id, fld.id, explicit)}
            />
          ))}
        </div>

        {/* ALWAYS-VISIBLE Pinned Upload Document Button */}
        <button
          type="button"
          onClick={() => onAddBook(shelf.id)}
          aria-label="Upload document to this shelf"
          title="Upload Document (PDF, Word, EPUB, Notes, Drive)"
          style={{
            flex: 'none',
            width: 56,
            height: 82,
            marginBottom: 6,
            borderRadius: 5,
            border: `1.5px dashed ${look.light ? '#785a3a' : '#d4af37'}`,
            background: look.light ? 'rgba(120,90,58,0.1)' : 'rgba(255,255,255,0.08)',
            boxShadow:
              '0 4px 10px rgba(0,0,0,0.38), 0 1px 3px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.16)',
            color: ink,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 4,
            padding: '0 4px',
            cursor: 'pointer',
          }}
          className="hover:scale-105 hover:bg-amber-500/15 transition shrink-0"
        >
          <Upload className="w-4 h-4" />
          <span style={{ fontSize: 8.5, fontWeight: 700, textAlign: 'center', lineHeight: 1.15 }}>
            Upload Document
          </span>
        </button>
      </div>

      {/* Interactive Per-Section Slide Bar (Present on ALL 5 Almirahs) */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          padding: '2px 2px 5px',
          pointerEvents: accessible ? 'auto' : 'none',
          opacity: accessible ? 0.92 : 0.45,
        }}
      >
        <button
          type="button"
          onClick={() => scrollByDelta(-150)}
          className="px-1.5 py-0.5 rounded text-[10px] font-bold hover:brightness-110 active:translate-y-px transition cursor-pointer"
          style={{
            color: ink,
            background: look.light ? 'rgba(56,34,20,0.16)' : 'rgba(15,15,18,0.52)',
            border: look.light ? '1px solid rgba(56,34,20,0.24)' : '1px solid rgba(255,255,255,0.18)',
            boxShadow:
              '0 2px 5px rgba(0,0,0,0.45), 0 1px 2px rgba(0,0,0,0.32), inset 0 1px 0 rgba(255,255,255,0.18)',
          }}
          title="Slide books left"
        >
          ◄
        </button>
        <input
          type="range"
          min={0}
          max={100}
          value={slidePct}
          onChange={(e) => handleSliderChange(Number(e.target.value))}
          aria-label={`Slide books in ${shelf.name}`}
          className="sh-slide-range flex-1"
          style={{
            background: 'linear-gradient(90deg, rgba(146,64,14,0.65), rgba(212,175,55,0.85), rgba(146,64,14,0.65))',
          }}
        />
        <button
          type="button"
          onClick={() => scrollByDelta(150)}
          className="px-1.5 py-0.5 rounded text-[10px] font-bold hover:brightness-110 active:translate-y-px transition cursor-pointer"
          style={{
            color: ink,
            background: look.light ? 'rgba(56,34,20,0.16)' : 'rgba(15,15,18,0.52)',
            border: look.light ? '1px solid rgba(56,34,20,0.24)' : '1px solid rgba(255,255,255,0.18)',
            boxShadow:
              '0 2px 5px rgba(0,0,0,0.45), 0 1px 2px rgba(0,0,0,0.32), inset 0 1px 0 rgba(255,255,255,0.18)',
          }}
          title="Slide books right"
        >
          ►
        </button>
      </div>

      {/* Real Photographic Polished Wood / Steel Vault / Honed Basalt Shelf Plank */}
      <div
        style={{
          margin: '0 -12px',
          height: look.grain > 0 || look.isVault ? 15 : 13,
          ...getWoodSurfaceStyle(look, 'h', 'plank', '180deg'),
          boxShadow: look.isVault
            ? '0 6px 10px rgba(0,0,0,0.68), inset 0 1.5px 0 rgba(226,232,240,0.38), inset 0 -2px 3px rgba(0,0,0,0.72)'
            : look.grain > 0
              ? '0 7px 12px rgba(0,0,0,0.52), inset 0 2px 0 rgba(255,244,218,0.46), inset 0 -2px 4px rgba(0,0,0,0.48)'
              : '0 4px 7px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.32)',
        }}
      />
    </div>
  );
}

/* ───────────── COMPARTMENT BAY (UPPER SWING/SLIDE/FOLD/FLIP/VAULT OR LOWER BAY) ───────────── */

export function Compartment({
  shelves,
  offset,
  total,
  look,
  night,
  lit,
  open,
  onToggle,
  onMoveShelf,
  onRenameShelf,
  onAddBook,
  onRemoveBook,
  onEditBookThumbnail,
  onSelectBook,
  pickedBook,
  onPickBook,
  onDropBook,
  onCreateFolder,
  onOpenFolder,
  onOpenFolderSettings,
  onDropBookToFolder,
  isBottomShutter = false,
  renderDoors = true,
}: {
  shelves: ShelfT[];
  offset: number;
  total: number;
  look: Look;
  night: boolean;
  lit: boolean;
  open: boolean;
  onToggle: () => void;
  onMoveShelf: (i: number, d: -1 | 1) => void;
  onRenameShelf: (shelfId: string, newName: string) => void;
  onAddBook: (shelfId: string) => void;
  onRemoveBook: (shelfId: string, bookId: string) => void;
  onEditBookThumbnail?: (shelfId: string, book: Book) => void;
  onSelectBook?: (book: Book) => void;
  pickedBook?: { fromShelfId: string; book: Book } | null;
  onPickBook?: (shelfId: string, book: Book) => void;
  onDropBook?: (targetShelfId: string, explicitSource?: { fromShelfId: string; bookId: string }) => void;
  onCreateFolder: (shelfId: string) => void;
  onOpenFolder: (shelfId: string, folder: ShelfFolder) => void;
  onOpenFolderSettings: (shelfId: string, folder: ShelfFolder) => void;
  onDropBookToFolder?: (targetShelfId: string, folderId: string, explicitSource?: { fromShelfId: string; bookId: string }) => void;
  isBottomShutter?: boolean;
  renderDoors?: boolean;
}) {
  const ink = look.light ? '#382214' : '#f5ede0';
  const doorKind = isBottomShutter ? look.lowerDoorType : look.upperDoorType;
  const hasInteractiveDoor =
    renderDoors && doorKind !== 'none' && doorKind !== 'frameless-glass';
  const shouldRenderOverlay = renderDoors && doorKind !== 'none';
  const scrollableUpper = !isBottomShutter && shelves.length > 2;

  const clipDoorsToBay =
    doorKind === 'classified-shutter' ||
    doorKind === 'bypass-slide' ||
    doorKind === 'pocket-fluted' ||
    doorKind === 'bunker-slide';

  return (
    <div style={{ position: 'relative', perspective: 2100, minWidth: 0, overflow: clipDoorsToBay ? 'hidden' : 'visible' }}>
      {/* Compartment Back Panel & Depth Shadow */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          overflow: 'hidden',
          ...(look.grain > 0 || look.isVault
            ? (() => {
                const backMat = getWoodSurfaceStyle(look, 'panel', 'back');
                return {
                  backgroundColor: backMat.backgroundColor,
                  backgroundImage:
                    night && lit
                      ? `radial-gradient(ellipse at 50% 0%, rgba(254,240,138,0.52), transparent 72%), ${backMat.backgroundImage}`
                      : backMat.backgroundImage,
                  backgroundSize:
                    night && lit
                      ? `100% 100%, ${backMat.backgroundSize}`
                      : backMat.backgroundSize,
                  backgroundRepeat:
                    night && lit
                      ? `no-repeat, ${backMat.backgroundRepeat}`
                      : backMat.backgroundRepeat,
                  backgroundPosition:
                    night && lit
                      ? `center, ${backMat.backgroundPosition}`
                      : backMat.backgroundPosition,
                  filter: backMat.filter,
                };
              })()
            : {
                backgroundColor: look.back,
                backgroundImage:
                  night && lit
                    ? 'radial-gradient(ellipse at 50% 0%, rgba(254,240,138,0.58), transparent 75%)'
                    : 'none',
                backgroundSize: '100% 100%',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                filter: 'none',
              }),
          boxShadow:
            'inset 0 10px 22px rgba(0,0,0,0.48), inset 10px 0 16px rgba(0,0,0,0.3), inset -10px 0 16px rgba(0,0,0,0.3)',
        }}
      />

      {/* Vertically Scrollable Compartment List when user adds >2 upper sections */}
      <div
        className={scrollableUpper ? 'sh-scroll-v' : undefined}
        style={{
          position: 'relative',
          maxHeight: scrollableUpper ? 330 : undefined,
          overflowY: scrollableUpper ? 'auto' : 'visible',
          overflowX: 'hidden',
          minWidth: 0,
        }}
      >
        {shelves.map((shelf, k) => (
          <ShelfRow
            key={shelf.id}
            shelf={shelf}
            shelfIdx={offset + k}
            bayIdx={k}
            totalShelves={total}
            look={look}
            ink={ink}
            night={night}
            lit={lit}
            open={open}
            renderDoors={hasInteractiveDoor}
            isClassifiedBottom={isBottomShutter && look.lowerDoorType === 'classified-shutter'}
            onMoveShelf={onMoveShelf}
            onRenameShelf={onRenameShelf}
            onAddBook={onAddBook}
            onRemoveBook={onRemoveBook}
            onEditBookThumbnail={onEditBookThumbnail}
            onSelectBook={onSelectBook}
            pickedBook={pickedBook}
            onPickBook={onPickBook}
            onDropBook={onDropBook}
            onCreateFolder={onCreateFolder}
            onOpenFolder={onOpenFolder}
            onOpenFolderSettings={onOpenFolderSettings}
            onDropBookToFolder={onDropBookToFolder}
          />
        ))}
      </div>

      {/* Distinct Door Mechanism or Frameless Upper Crystal Glass */}
      {shouldRenderOverlay && (
        <CabinetDoors
          look={look}
          doorKind={doorKind}
          open={open}
          onToggle={onToggle}
        />
      )}
    </div>
  );
}

/* ───────────── PROMINENT ALMIRAH WITH FLOOR-PLINTH HARDWARE SWITCHER ───────────── */

export function Almirah({
  a,
  idx,
  totalAlmirahs,
  onPrevAlmirah,
  onNextAlmirah,
  onAddShelf,
  onOpenNewAlmirah,
  onRenameAlmirah,
  night,
  lit,
  openMap,
  toggle,
  onMoveShelf,
  onRenameShelf,
  onAddBook,
  onRemoveBook,
  onEditBookThumbnail,
  onSelectBook,
  pickedBook,
  onPickBook,
  onDropBook,
  onCreateFolder,
  onOpenFolder,
  onOpenFolderSettings,
  onDropBookToFolder,
  themeId = '1',
}: {
  a: AlmirahT;
  idx: number;
  totalAlmirahs: number;
  onPrevAlmirah: () => void;
  onNextAlmirah: () => void;
  onAddShelf: () => void;
  onOpenNewAlmirah: () => void;
  onRenameAlmirah?: (newName: string) => void;
  night: boolean;
  lit: boolean;
  openMap: Record<string, boolean>;
  toggle: (key: string) => void;
  onMoveShelf: (i: number, d: -1 | 1) => void;
  onRenameShelf: (shelfId: string, newName: string) => void;
  onAddBook: (shelfId: string) => void;
  onRemoveBook: (shelfId: string, bookId: string) => void;
  onEditBookThumbnail?: (shelfId: string, book: Book) => void;
  onSelectBook?: (book: Book) => void;
  pickedBook?: { fromShelfId: string; book: Book } | null;
  onPickBook?: (shelfId: string, book: Book) => void;
  onDropBook?: (targetShelfId: string, explicitSource?: { fromShelfId: string; bookId: string }) => void;
  onCreateFolder: (shelfId: string) => void;
  onOpenFolder: (shelfId: string, folder: ShelfFolder) => void;
  onOpenFolderSettings: (shelfId: string, folder: ShelfFolder) => void;
  onDropBookToFolder?: (targetShelfId: string, folderId: string, explicitSource?: { fromShelfId: string; bookId: string }) => void;
  themeId?: ShelfThemeId;
}) {
  const [isEditingBannerName, setIsEditingBannerName] = useState(false);
  const [bannerDraftName, setBannerDraftName] = useState(a.name);
  useEffect(() => {
    setBannerDraftName(a.name);
  }, [a.name]);

  const look = getThemeAdaptedLook(LOOKS[a.design] ?? LOOKS['Dark Chocolate']!, themeId);
  const hasUpperDoor = a.hasUpperDoor !== undefined ? a.hasUpperDoor : (look.hasUpperDoor ?? true);
  const bottom = a.shelves[a.shelves.length - 1];
  const upper = a.shelves.slice(0, -1);

  const wood = (dir: string): CSSProperties =>
    getWoodSurfaceStyle(look, 'h', 'frame', dir);

  const stile = (dir: string): CSSProperties =>
    getWoodSurfaceStyle(look, 'v', 'frame', dir);

  const shadow = night
    ? '0 20px 44px rgba(0,0,0,0.78)'
    : '26px 18px 42px rgba(35,18,0,0.38)';

  const common = {
    look,
    total: a.shelves.length,
    night,
    lit,
    onMoveShelf,
    onRenameShelf,
    onAddBook,
    onRemoveBook,
    onEditBookThumbnail,
    onSelectBook,
    pickedBook,
    onPickBook,
    onDropBook,
    onCreateFolder,
    onOpenFolder,
    onOpenFolderSettings,
    onDropBookToFolder,
  };

  const trim = getThemeAlmirahTrim(themeId);
  const plinthInk = look.light ? '#292524' : '#f5ede0';

  return (
    <div
      className="sh-almirah-wrap"
      style={{
        filter: night && !lit ? 'brightness(.82)' : 'none',
      }}
    >
      {/* Floor Drop Shadow Under Almirah */}
      <div
        style={{
          position: 'absolute',
          left: 20,
          right: 20,
          bottom: -16,
          height: 28,
          borderRadius: '50%',
          background: 'radial-gradient(ellipse, rgba(0,0,0,0.68), transparent 75%)',
          filter: 'blur(5px)',
        }}
      />

      {/* Polished Stand Nameplate Banner Sitting Cleanly on Top of the Almirah */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginBottom: -1,
          position: 'relative',
          zIndex: 14,
          pointerEvents: 'auto',
        }}
      >
        <div
          style={{
            minWidth: 168,
            maxWidth: '72%',
            padding: '5px 18px',
            borderRadius: '10px 10px 4px 4px',
            border: `1.5px solid ${trim.accentHex}70`,
            boxShadow:
              '0 6px 14px rgba(0,0,0,0.42), inset 0 1.5px 0 rgba(255,244,220,0.34), inset 0 -1px 2px rgba(0,0,0,0.35)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            ...wood('90deg'),
          }}
        >
          {isEditingBannerName ? (
            <input
              type="text"
              autoFocus
              value={bannerDraftName}
              onChange={(e) => setBannerDraftName(e.target.value)}
              onBlur={() => {
                const cleaned = bannerDraftName.trim();
                if (cleaned && cleaned !== a.name) onRenameAlmirah?.(cleaned);
                else setBannerDraftName(a.name);
                setIsEditingBannerName(false);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const cleaned = bannerDraftName.trim();
                  if (cleaned && cleaned !== a.name) onRenameAlmirah?.(cleaned);
                  setIsEditingBannerName(false);
                } else if (e.key === 'Escape') {
                  setBannerDraftName(a.name);
                  setIsEditingBannerName(false);
                }
              }}
              style={{
                background: 'rgba(0,0,0,0.32)',
                color: look.light ? '#291a0d' : '#fdf6e7',
                border: `1px solid ${trim.accentHex}`,
                borderRadius: 5,
                padding: '1px 7px',
                fontSize: 12,
                fontWeight: 700,
                textAlign: 'center',
                outline: 'none',
                width: 150,
              }}
            />
          ) : (
            <button
              type="button"
              onClick={() => {
                setBannerDraftName(a.name);
                setIsEditingBannerName(true);
              }}
              title="Click to name / rename this Almirah"
              className="flex items-center gap-1.5 cursor-pointer hover:opacity-90 transition"
              style={{
                color: look.light ? '#2d1c0d' : '#faeed7',
                fontFamily: 'Georgia, serif',
                fontSize: 12.5,
                fontWeight: 700,
                letterSpacing: '0.03em',
                textShadow: look.light ? 'none' : '0 1px 2px rgba(0,0,0,0.65)',
              }}
            >
              <span style={{ color: trim.accentHex, fontSize: 10 }}>✦</span>
              <span className="truncate max-w-[200px]">{a.name}</span>
              <Pencil className="w-2.5 h-2.5 opacity-60 shrink-0" />
            </button>
          )}
        </div>
        {/* Small Polished Support Pedestals Under Banner */}
        <div style={{ display: 'flex', justifyContent: 'space-between', width: 96, height: 5 }}>
          <span
            style={{
              width: 12,
              height: 5,
              background: look.dark,
              borderLeft: `1px solid ${trim.accentHex}55`,
              borderRight: `1px solid ${trim.accentHex}55`,
            }}
          />
          <span
            style={{
              width: 12,
              height: 5,
              background: look.dark,
              borderLeft: `1px solid ${trim.accentHex}55`,
              borderRight: `1px solid ${trim.accentHex}55`,
            }}
          />
        </div>
      </div>

      <div
        style={{
          position: 'relative',
          boxShadow: shadow,
          borderRadius: look.isArched ? '190px 190px 10px 10px' : look.isCapsule ? 24 : 3,
        }}
      >
        {/* Top Silhouette: Roman Arch Crown (Almirah 4), Flush Capsule Crown (Almirah 1 & 2), or Cornice Molding */}
        {look.isArched ? (
          <div
            style={{
              height: 54,
              borderRadius: '999px 999px 0 0',
              background: `linear-gradient(180deg, ${look.frame} 0%, ${look.dark} 100%)`,
              boxShadow: 'inset 0 2px 0 rgba(255,255,255,0.22), inset 0 -3px 6px rgba(0,0,0,0.55)',
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'center',
              paddingBottom: 6,
              position: 'relative',
            }}
          >
            <div
              style={{
                width: '78%',
                height: 30,
                borderTopLeftRadius: 999,
                borderTopRightRadius: 999,
                background: look.back,
                borderTop: '2px solid rgba(229,212,188,0.26)',
                borderLeft: '2px solid rgba(229,212,188,0.2)',
                borderRight: '2px solid rgba(229,212,188,0.2)',
                boxShadow: 'inset 0 6px 14px rgba(0,0,0,0.65)',
              }}
            />
          </div>
        ) : (
          <div
            style={{
              margin: look.isCapsule ? '0' : '0 -8px',
              height: look.isCapsule ? 20 : 26,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              borderRadius: look.isCapsule ? '24px 24px 0 0' : '4px 4px 0 0',
              boxShadow:
                look.grain > 0
                  ? '0 5px 10px rgba(0,0,0,.45), inset 0 2px 0 rgba(255,245,220,.45), inset 0 -2px 3px rgba(0,0,0,.35)'
                  : '0 4px 6px rgba(0,0,0,.4), inset 0 2px 0 rgba(255,255,255,.3)',
              ...wood('90deg'),
            }}
          >
            <div
              style={{
                width: look.isCapsule ? '88%' : '94%',
                height: 3,
                borderRadius: 1,
                background: look.isVault
                  ? 'linear-gradient(90deg, transparent, rgba(203,213,225,0.55), transparent)'
                  : trim.corniceInlay,
                borderBottom: '1px solid rgba(255,255,255,0.18)',
              }}
            />
            {look.isVault && (
              <>
                <span style={{ position: 'absolute', left: 10, width: 6, height: 6, borderRadius: '50%', background: 'radial-gradient(circle at 30% 30%, #e2e8f0, #475569)', boxShadow: '0 1px 2px rgba(0,0,0,0.85)' }} />
                <span style={{ position: 'absolute', right: 10, width: 6, height: 6, borderRadius: '50%', background: 'radial-gradient(circle at 30% 30%, #e2e8f0, #475569)', boxShadow: '0 1px 2px rgba(0,0,0,0.85)' }} />
              </>
            )}
          </div>
        )}

        {/* Almirah Body with Side Stiles and Compartments */}
        <div style={{ display: 'flex', minWidth: 0 }}>
          {/* Left Vertical Stile */}
          <div
            style={{
              ...stile('90deg'),
              position: 'relative',
              zIndex: 1,
              boxShadow: look.isVault
                ? 'inset -2px 0 6px rgba(0,0,0,0.75), inset 1px 0 0 rgba(226,232,240,0.22)'
                : look.grain > 0
                  ? 'inset 2px 0 0 rgba(255,244,220,0.32), inset -2px 0 6px rgba(0,0,0,0.45)'
                  : undefined,
            }}
            className="sh-stile flex items-center justify-center pointer-events-none"
          >
            <div style={{ width: 1, height: '70%', background: 'rgba(255,255,255,0.15)' }} />
            {look.isVault && (
              <div style={{ position: 'absolute', inset: '22px 0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center' }}>
                {[0, 1, 2, 3, 4].map((r) => (
                  <span key={r} style={{ width: 5, height: 5, borderRadius: '50%', background: 'radial-gradient(circle at 30% 30%, #e2e8f0, #475569)', boxShadow: '0 1px 2px rgba(0,0,0,0.85)' }} />
                ))}
              </div>
            )}
          </div>

          {/* Center Bays Column (zIndex: 8 + overflow: visible lets hinged vault/glass doors swing edge-to-edge) */}
          <div style={{ flex: 1, minWidth: 0, position: 'relative', zIndex: 8, overflow: 'visible' }}>
            {bottom === undefined ? (
              <div style={{ padding: '96px 16px', textAlign: 'center', background: look.back }}>
                No sections yet. Click + Section below.
              </div>
            ) : (
              <>
                {upper.length > 0 && (
                  <>
                    <Compartment
                      {...common}
                      shelves={upper}
                      offset={0}
                      open={openMap[`${a.id}:top`] === true}
                      onToggle={() => toggle(`${a.id}:top`)}
                      isBottomShutter={false}
                      renderDoors={hasUpperDoor}
                    />
                    {/* Horizontal Divider Rail between Upper 3 Bays & Lower Bay */}
                    <div
                      style={{
                        height: 14,
                        boxShadow:
                          look.grain > 0
                            ? '0 5px 8px rgba(0,0,0,.46), inset 0 2px 0 rgba(255,244,220,0.38), inset 0 -2px 3px rgba(0,0,0,0.42)'
                            : '0 4px 6px rgba(0,0,0,.42), inset 0 1px 0 rgba(255,255,255,0.22)',
                        ...wood('90deg'),
                      }}
                    />
                  </>
                )}

                <Compartment
                  {...common}
                  shelves={[bottom]}
                  offset={upper.length}
                  open={openMap[`${a.id}:bottom`] === true}
                  onToggle={() => toggle(`${a.id}:bottom`)}
                  isBottomShutter={true}
                  renderDoors={true}
                />
              </>
            )}
          </div>

          {/* Right Vertical Stile */}
          <div
            style={{
              ...stile('270deg'),
              position: 'relative',
              zIndex: 1,
              boxShadow: look.isVault
                ? 'inset 2px 0 6px rgba(0,0,0,0.75), inset -1px 0 0 rgba(226,232,240,0.22)'
                : look.grain > 0
                  ? 'inset 2px 0 6px rgba(0,0,0,0.45), inset -2px 0 0 rgba(255,244,220,0.32)'
                  : undefined,
            }}
            className="sh-stile flex items-center justify-center pointer-events-none"
          >
            <div style={{ width: 1, height: '70%', background: 'rgba(0,0,0,0.2)' }} />
            {look.isVault && (
              <div style={{ position: 'absolute', inset: '22px 0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center' }}>
                {[0, 1, 2, 3, 4].map((r) => (
                  <span key={r} style={{ width: 5, height: 5, borderRadius: '50%', background: 'radial-gradient(circle at 30% 30%, #e2e8f0, #475569)', boxShadow: '0 1px 2px rgba(0,0,0,0.85)' }} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Almirah Bottom Plinth (Touching Floor) with Embedded Switcher & Controls */}
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            position: 'relative',
            zIndex: 45,
            pointerEvents: 'auto',
            margin: look.isCapsule || look.isArched ? '0' : '0 -6px',
            minHeight: 44,
            padding: '6px 12px',
            borderRadius: look.isCapsule ? '0 0 22px 22px' : look.isArched ? '0 0 10px 10px' : '0 0 4px 4px',
            boxShadow:
              look.grain > 0
                ? '0 7px 14px rgba(0,0,0,.48), inset 0 2px 0 rgba(255,244,220,0.36), inset 0 -2px 4px rgba(0,0,0,0.45)'
                : '0 5px 10px rgba(0,0,0,.42)',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 8,
            ...wood('90deg'),
          }}
        >
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onPrevAlmirah();
              }}
              className="p-1.5 rounded-lg bg-black/25 hover:bg-black/40 border border-white/20 transition cursor-pointer"
              style={{ color: plinthInk, boxShadow: '0 2px 6px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.18)' }}
              title="Previous Almirah Style"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onNextAlmirah();
              }}
              className="px-3 py-1 rounded-lg bg-black/25 hover:bg-black/40 border text-[11px] font-bold flex items-center gap-2 transition cursor-pointer"
              style={{
                color: plinthInk,
                borderColor: `${trim.accentHex}66`,
                boxShadow: '0 2px 6px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.18)',
              }}
              title="Click to switch to the next Almirah style"
            >
              <span>{look.name}</span>
              <span className="opacity-70 font-mono text-[10px]">
                ({idx + 1}/{totalAlmirahs})
              </span>
              <span
                className="flex items-center gap-0.5 text-[10px]"
                style={{ color: look.light ? '#5a3a18' : trim.accentHex }}
              >
                <span>Switch</span>
                <ChevronRight className="w-3 h-3" />
              </span>
            </button>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={onAddShelf}
              className="px-2.5 py-1 rounded-lg bg-black/25 hover:bg-black/40 border border-white/20 text-[10.5px] font-semibold flex items-center gap-1 transition cursor-pointer"
              style={{ color: plinthInk, boxShadow: '0 2px 6px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.18)' }}
              title="Add an extra compartment inside this almirah"
            >
              <Plus className="w-3 h-3" style={{ color: look.light ? '#5a3a18' : trim.accentHex }} />
              <span>Section</span>
            </button>

            <button
              type="button"
              onClick={onOpenNewAlmirah}
              className="px-2.5 py-1 rounded-lg text-[10.5px] font-bold flex items-center gap-1 transition cursor-pointer hover:brightness-110"
              style={{
                background: trim.plinthAccentBg,
                color: trim.plinthText,
                boxShadow: '0 3px 8px rgba(0,0,0,0.48), inset 0 1px 0 rgba(255,255,255,0.28)',
              }}
              title="Create a new custom almirah"
            >
              <FolderPlus className="w-3 h-3" />
              <span>New Cabinet</span>
            </button>
          </div>
        </div>

        {/* Feet / Legs / Plinth Base on Floor Matching Uploaded Photos */}
        {look.legs === 'block-base' ? (
          <div
            style={{
              position: 'relative',
              margin: '0 30px',
              height: 15,
              background: look.isVault
                ? 'linear-gradient(180deg, #050608 0%, #0d1016 100%)'
                : 'linear-gradient(180deg, #1b1512 0%, #0f0b09 100%)',
              borderRadius: '0 0 8px 8px',
              boxShadow: '0 4px 10px rgba(0,0,0,0.68), inset 0 2px 4px rgba(0,0,0,0.75)',
            }}
          />
        ) : look.legs === 'tapered-wood' ? (
          <>
            <div
              style={{
                position: 'absolute',
                bottom: -18,
                left: 24,
                width: 13,
                height: 20,
                transform: 'rotate(11deg)',
                transformOrigin: 'top center',
                ...(look.grain > 0
                  ? getWoodSurfaceStyle(look, 'v', 'frame', '90deg')
                  : {
                      backgroundColor: look.dark,
                      backgroundImage: 'none',
                      backgroundSize: '100% 100%',
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'center',
                    }),
                borderRadius: '0 0 5px 5px',
                boxShadow: 'inset 0 2px 3px rgba(0,0,0,0.45), 0 3px 6px rgba(0,0,0,0.5)',
              }}
            />
            <div
              style={{
                position: 'absolute',
                bottom: -18,
                right: 24,
                width: 13,
                height: 20,
                transform: 'rotate(-11deg)',
                transformOrigin: 'top center',
                ...(look.grain > 0
                  ? getWoodSurfaceStyle(look, 'v', 'frame', '270deg')
                  : {
                      backgroundColor: look.dark,
                      backgroundImage: 'none',
                      backgroundSize: '100% 100%',
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'center',
                    }),
                borderRadius: '0 0 5px 5px',
                boxShadow: 'inset 0 2px 3px rgba(0,0,0,0.45), 0 3px 6px rgba(0,0,0,0.5)',
              }}
            />
          </>
        ) : look.legs === 'metal-pin' ? (
          <>
            <div style={{ position: 'absolute', bottom: -14, left: 16, width: 8, height: 14, backgroundColor: '#a1a1aa', borderRadius: '0 0 2px 2px' }} />
            <div style={{ position: 'absolute', bottom: -14, right: 16, width: 8, height: 14, backgroundColor: '#a1a1aa', borderRadius: '0 0 2px 2px' }} />
          </>
        ) : (
          <>
            <div
              style={{
                position: 'absolute',
                bottom: -18,
                left: 22,
                width: 15,
                height: 18,
                ...(look.grain > 0
                  ? getWoodSurfaceStyle(look, 'v', 'frame', '90deg')
                  : {
                      backgroundColor: look.dark,
                      backgroundImage: `linear-gradient(90deg, ${look.frame}, ${look.dark})`,
                      backgroundSize: '100% 100%',
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'center',
                    }),
                borderRadius: '0 0 8px 8px',
                boxShadow: 'inset 0 2px 3px rgba(0,0,0,0.5), 0 2px 5px rgba(0,0,0,0.45)',
              }}
            />
            <div
              style={{
                position: 'absolute',
                bottom: -18,
                right: 22,
                width: 15,
                height: 18,
                ...(look.grain > 0
                  ? getWoodSurfaceStyle(look, 'v', 'frame', '270deg')
                  : {
                      backgroundColor: look.dark,
                      backgroundImage: `linear-gradient(90deg, ${look.frame}, ${look.dark})`,
                      backgroundSize: '100% 100%',
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'center',
                    }),
                borderRadius: '0 0 8px 8px',
                boxShadow: 'inset 0 2px 3px rgba(0,0,0,0.5), 0 2px 5px rgba(0,0,0,0.45)',
              }}
            />
          </>
        )}
      </div>
    </div>
  );
}

/* ───────────── COMPREHENSIVE ADD BOOK / MEDIA MODAL ───────────── */

export function AddBookModal({
  isOpen,
  onClose,
  shelfName,
  notebooks = [],
  driveBooks = [],
  onAddBook,
}: {
  isOpen: boolean;
  onClose: () => void;
  shelfName: string;
  notebooks?: Notebook[];
  driveBooks?: MedicalBook[];
  onAddBook: (title: string, cover: string, thumbnail?: BookThumbnailConfig) => void;
}) {
  const [activeTab, setActiveTab] = useState<'upload' | 'quick' | 'notes' | 'drive'>('upload');
  const [title, setTitle] = useState('');
  const [cover, setCover] = useState<string>(COVERS[0]);
  const [customThumb, setCustomThumb] = useState<BookThumbnailConfig | undefined>(undefined);
  const [isThumbEditorOpen, setIsThumbEditorOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const cleanName = file.name.replace(/\.[^/.]+$/, '');
      onAddBook(cleanName, cover, customThumb || getDefaultThumbnail(cleanName, COVER[cover]?.from));
      setCustomThumb(undefined);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-2xl bg-[#faf6ee] dark:bg-[#18110c] border border-[#d6c7b0] dark:border-[#382518] rounded-2xl shadow-2xl overflow-hidden text-[#1c140e] dark:text-[#efe4d4] flex flex-col max-h-[85vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#d6c7b0] dark:border-[#382518] bg-[#f2eadb] dark:bg-[#140e0a]/90">
          <div>
            <h3 className="text-lg font-bold text-[#1c140e] dark:text-[#efe4d4] flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-amber-600 dark:text-amber-500" />
              <span>Add Book to {shelfName}</span>
            </h3>
            <p className="text-xs text-[#6f5d4d] dark:text-[#a69079]">
              Upload your PDFs, import study notes, connect Google Drive, or add a custom book.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-[#6f5d4d] dark:text-[#a69079] hover:text-[#1c140e] dark:hover:text-[#efe4d4] hover:bg-black/5 dark:hover:bg-[#2a1d14] transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#d6c7b0] dark:border-[#382518] bg-[#f5efe2] dark:bg-[#140e0a]/60 px-6 gap-2 text-xs font-semibold overflow-x-auto">
          {[
            { id: 'upload', label: 'Upload Document', icon: Upload },
            { id: 'notes', label: 'Import Notes', icon: FileText },
            { id: 'drive', label: 'Google Drive', icon: Cloud },
            { id: 'quick', label: 'Quick Custom', icon: Plus },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1.5 py-3 px-3 border-b-2 transition whitespace-nowrap cursor-pointer ${
                  active
                    ? 'border-amber-600 dark:border-amber-500 text-amber-700 dark:text-amber-400'
                    : 'border-transparent text-[#6f5d4d] dark:text-[#a69079] hover:text-[#1c140e] dark:hover:text-[#efe4d4]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* TAB 1: UPLOAD LOCAL DOCUMENT */}
          {activeTab === 'upload' && (
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-[#d6c7b0] dark:border-[#382518] rounded-2xl p-8 text-center space-y-4 hover:border-amber-500/50 bg-[#f4ede0] dark:bg-[#140e0a]/50 transition">
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.epub,.docx,.doc,.txt"
                onChange={handleFileUpload}
                className="hidden"
              />
              <div className="w-14 h-14 rounded-full bg-amber-500/15 flex items-center justify-center text-amber-700 dark:text-amber-400">
                <Upload className="w-7 h-7" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#1c140e] dark:text-[#efe4d4]">
                  Select a Medical PDF, Word, or EPUB document
                </p>
                <p className="text-xs text-[#6f5d4d] dark:text-[#a69079] mt-1">
                  Supports .pdf, .epub, .docx, .doc up to 250MB
                </p>
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white dark:text-[#110c09] text-xs font-bold transition shadow-lg cursor-pointer"
              >
                Upload Document
              </button>
            </div>
          )}

          {/* TAB 3: IMPORT NOTES FROM USER NOTEBOOKS */}
          {activeTab === 'notes' && (
            notebooks.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-80 overflow-y-auto pr-1">
                {notebooks.map((nb) => (
                  <div
                    key={nb.id}
                    className="flex items-center justify-between p-2.5 rounded-xl border border-[#d6c7b0] dark:border-[#382518] hover:border-amber-500/50 bg-white dark:bg-[#140e0a]/80 hover:bg-[#f5efe2] dark:hover:bg-[#231912] transition group gap-2"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <BookLogoBadge
                        title={nb.title}
                        thumbnail={nb.thumbnail}
                        fallbackBg={nb.coverColor || '#1e3a8a'}
                        compact
                      />
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-[#1c140e] dark:text-[#efe4d4] truncate">{nb.title}</p>
                        <span className="text-[10px] text-amber-700 dark:text-amber-400/80 uppercase font-mono tracking-wider">
                          {nb.subject} · {nb.pages.length}p
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        onAddBook(nb.title, 'Navy', nb.thumbnail || getDefaultThumbnail(nb.title, nb.coverColor || '#1e3a8a'));
                        onClose();
                      }}
                      className="px-2.5 py-1 text-xs rounded-lg bg-amber-500/15 hover:bg-amber-500 text-amber-800 dark:text-amber-300 hover:text-white dark:hover:text-[#110c09] font-bold transition shrink-0 cursor-pointer"
                    >
                      ＋ Shelve
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#d6c7b0] dark:border-[#382518] bg-[#f4ede0] dark:bg-[#140e0a]/50 p-8 text-center space-y-3">
                <FileText className="w-8 h-8 text-amber-700 dark:text-amber-400/70" />
                <p className="text-xs font-semibold text-[#1c140e] dark:text-[#efe4d4]">No notebooks available to import</p>
                <p className="text-[11px] text-[#6f5d4d] dark:text-[#a69079] max-w-sm">
                  Create a notebook in Create Note or upload a local file directly into this shelf compartment.
                </p>
                <button
                  type="button"
                  onClick={() => setActiveTab('upload')}
                  className="px-3.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white dark:text-[#110c09] text-xs font-bold transition cursor-pointer"
                >
                  Upload Document
                </button>
              </div>
            )
          )}

          {/* TAB 4: GOOGLE DRIVE PDF VAULT */}
          {activeTab === 'drive' && (
            driveBooks.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-80 overflow-y-auto pr-1">
                {driveBooks.map((dk) => (
                  <div
                    key={dk.id}
                    className="flex items-center justify-between p-2.5 rounded-xl border border-[#d6c7b0] dark:border-[#382518] hover:border-amber-500/50 bg-white dark:bg-[#140e0a]/80 hover:bg-[#f5efe2] dark:hover:bg-[#231912] transition group gap-2"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <BookLogoBadge
                        title={dk.title}
                        thumbnail={dk.thumbnail}
                        fallbackBg={dk.coverColor || '#7c4521'}
                        compact
                      />
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-[#1c140e] dark:text-[#efe4d4] truncate">{dk.title}</p>
                        <span className="text-[10px] text-amber-700 dark:text-amber-400/80 uppercase font-mono tracking-wider">
                          {dk.subject} · Drive PDF
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        onAddBook(dk.title, 'Amber', dk.thumbnail || getDefaultThumbnail(dk.title, dk.coverColor || '#7c4521'));
                        onClose();
                      }}
                      className="px-2.5 py-1 text-xs rounded-lg bg-amber-500/15 hover:bg-amber-500 text-amber-800 dark:text-amber-300 hover:text-white dark:hover:text-[#110c09] font-bold transition shrink-0 cursor-pointer"
                    >
                      ＋ Shelve
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#d6c7b0] dark:border-[#382518] bg-[#f4ede0] dark:bg-[#140e0a]/50 p-8 text-center space-y-3">
                <Cloud className="w-8 h-8 text-amber-700 dark:text-amber-400/70" />
                <p className="text-xs font-semibold text-[#1c140e] dark:text-[#efe4d4]">Google Drive Folder</p>
                <p className="text-[11px] text-[#6f5d4d] dark:text-[#a69079] max-w-sm">
                  Switch to Upload Document or Quick Custom to shelve your own books.
                </p>
                <button
                  type="button"
                  onClick={() => setActiveTab('upload')}
                  className="px-3.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white dark:text-[#110c09] text-xs font-bold transition cursor-pointer"
                >
                  Upload Document
                </button>
              </div>
            )
          )}

          {/* TAB 5: QUICK CUSTOM ADD */}
          {activeTab === 'quick' && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (title.trim()) {
                  onAddBook(
                    title.trim(),
                    cover,
                    customThumb || getDefaultThumbnail(title.trim(), COVER[cover]?.from)
                  );
                  setTitle('');
                  setCustomThumb(undefined);
                  onClose();
                }
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-bold text-[#4a3728] dark:text-[#d8c7b0] mb-1.5">Book Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Current Medical Diagnosis & Treatment 2025"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white dark:bg-[#110c09] border border-[#d6c7b0] dark:border-[#382518] rounded-lg text-[#1c140e] dark:text-[#efe4d4] focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#4a3728] dark:text-[#d8c7b0] mb-1.5">
                  Spine Leather Tone
                </label>
                <div className="grid grid-cols-6 gap-2">
                  {COVERS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setCover(c)}
                      className={`h-9 rounded-lg border-2 flex items-center justify-center transition cursor-pointer ${
                        cover === c ? 'border-amber-500 scale-105' : 'border-transparent opacity-80'
                      }`}
                      style={{ background: COVER[c]?.from ?? '#5c2c16' }}
                    >
                      {cover === c && <Check className="w-3.5 h-3.5 text-white" />}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between gap-3 p-2.5 rounded-xl bg-white dark:bg-[#110c09] border border-[#d6c7b0] dark:border-[#382518]">
                <div className="flex items-center gap-2.5 min-w-0">
                  <BookLogoBadge
                    title={title.trim() || 'Book'}
                    thumbnail={customThumb}
                    fallbackBg={COVER[cover]?.from}
                    compact
                  />
                  <div className="min-w-0">
                    <span className="text-[11px] font-bold block text-[#1c140e] dark:text-[#efe4d4]">
                      Cover Logo / Icon
                    </span>
                    <span className="text-[10px] text-[#6f5d4d] dark:text-[#a69079] block truncate">
                      Default shows monogram only on shelf
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsThumbEditorOpen(true)}
                  className="px-2.5 py-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-800 dark:text-amber-300 text-[11px] font-semibold flex items-center gap-1 cursor-pointer shrink-0"
                >
                  <Palette className="w-3 h-3" />
                  <span>Customize</span>
                </button>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-lg bg-[#e8dfd0] hover:bg-[#ddd1bd] dark:bg-[#231912] dark:hover:bg-[#2f2117] border border-[#d6c7b0] dark:border-[#382518] text-[#1c140e] dark:text-[#d8c7b0] text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white dark:text-[#110c09] text-xs font-bold cursor-pointer"
                >
                  Add to Shelf
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      <BookThumbnailEditorModal
        isOpen={isThumbEditorOpen}
        itemTitle={title.trim() || 'New Volume'}
        initialConfig={customThumb}
        defaultBgHex={COVER[cover]?.from}
        onClose={() => setIsThumbEditorOpen(false)}
        onSave={(cfg) => {
          setCustomThumb(cfg);
          setIsThumbEditorOpen(false);
        }}
      />
    </div>
  );
}

/* ───────────── MINI ALMIRAH PREVIEW PILL ───────────── */

export function Mini({ design, themeId = '1' }: { design: string; themeId?: ShelfThemeId }) {
  const l = getThemeAdaptedLook(LOOKS[design] ?? LOOKS['Dark Chocolate']!, themeId);
  const topRadius = l.isArched ? '24px 24px 3px 3px' : l.isCapsule ? '9px 9px 7px 7px' : '3px';
  const showGlassUpper = l.upperDoorType !== 'none';
  return (
    <span
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        margin: '0 auto',
        flexShrink: 0,
      }}
    >
      <span
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          padding: 3.5,
          width: 48,
          height: 62,
          boxSizing: 'border-box',
          ...(l.grain > 0 || l.isVault
            ? getWoodSurfaceStyle(l, 'v', 'frame', '180deg')
            : {
                backgroundColor: l.frame,
                backgroundImage: `linear-gradient(180deg, ${l.frame}, ${l.dark})`,
                backgroundSize: '100% 100%',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
              }),
          boxShadow: '1px 3px 6px rgba(0,0,0,.42)',
          borderRadius: topRadius,
          border: `1px solid ${l.dark}`,
          overflow: 'hidden',
        }}
      >
        {/* Upper 2 Sections Preview */}
        <span
          style={{
            flex: 1.55,
            display: 'flex',
            gap: 1.5,
            position: 'relative',
          }}
        >
          {[0, 1].map((k) => (
            <span
              key={k}
              style={{
                flex: 1,
                position: 'relative',
                borderRadius: l.isArched
                  ? k === 0
                    ? '16px 0 1px 1px'
                    : '0 16px 1px 1px'
                  : l.isCapsule
                    ? 3
                    : 1.5,
                ...(l.isVault
                  ? getWoodSurfaceStyle(l, 'panel', 'door', '135deg')
                  : {
                      backgroundColor: showGlassUpper ? 'transparent' : l.back,
                      backgroundImage: showGlassUpper
                        ? 'linear-gradient(125deg, rgba(255,255,255,0.42) 0%, rgba(255,255,255,0.12) 55%, rgba(0,0,0,0.18) 100%)'
                        : 'none',
                      backgroundSize: '100% 100%',
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'center',
                    }),
                boxShadow: `inset 0 0 0 1px ${l.dark}`,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-evenly',
                padding: '2px 2px',
              }}
            >
              {!l.isVault && (
                <span style={{ height: 1.5, width: '100%', backgroundColor: l.plank, opacity: 0.78 }} />
              )}
              {l.isVault && k === 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    border: '1.5px solid #94a3b8',
                    backgroundColor: '#d4af37',
                  }}
                />
              )}
            </span>
          ))}
        </span>

        {/* Lower Single Section Preview */}
        <span
          style={{
            flex: 0.9,
            borderRadius: l.isCapsule ? '2px 2px 5px 5px' : 1.5,
            position: 'relative',
            ...(l.lowerDoorType === 'classified-shutter'
              ? {
                  backgroundColor: '#1e293b',
                  backgroundImage:
                    'repeating-linear-gradient(180deg, #475569 0px, #475569 2.5px, #1e293b 2.5px, #1e293b 4.5px)',
                  backgroundSize: '100% 100%',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'center',
                }
              : l.lowerDoorType === 'drop-down'
                ? {
                    backgroundColor: l.face,
                    backgroundImage: `linear-gradient(180deg, rgba(255,255,255,0.22), ${l.face})`,
                    backgroundSize: '100% 100%',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center',
                  }
                : getWoodSurfaceStyle(l, 'panel', 'door', '135deg')),
            boxShadow: `inset 0 0 0 1px ${l.dark}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {l.lowerDoorType === 'solid-wood-door' && (
            <span style={{ width: 1.5, height: '82%', background: l.dark, opacity: 0.75 }} />
          )}
        </span>
      </span>

      {/* Mini Legs / Plinth Footprint */}
      {l.legs === 'block-base' ? (
        <span style={{ width: 34, height: 3, background: l.dark, borderRadius: '0 0 2px 2px' }} />
      ) : (
        <span style={{ display: 'flex', justifyContent: 'space-between', width: 36, paddingTop: 0.5 }}>
          <span style={{ width: 3.5, height: 5, background: l.dark, transform: 'rotate(8deg)', borderRadius: '0 0 2px 2px' }} />
          <span style={{ width: 3.5, height: 5, background: l.dark, transform: 'rotate(-8deg)', borderRadius: '0 0 2px 2px' }} />
        </span>
      )}
    </span>
  );
}

/* ───────────── MAIN SHELFROOM CONTAINER ───────────── */

export interface ShelfRoomProps {
  onSelectBook?: (book: Book) => void;
  onOpenEagleView?: () => void;
  onOpenFlowcharts?: () => void;
  nightMode?: boolean;
  onToggleNight?: () => void;
  activeDesign?: DesignId | string;
  notebooks?: Notebook[];
  driveBooks?: MedicalBook[];
}

export default function ShelfRoom({
  onSelectBook,
  nightMode,
  activeDesign,
  notebooks = [],
  driveBooks = [],
}: ShelfRoomProps) {
  const [data, save] = useStored();
  const [internalNight, setInternalNight] = useState<boolean>(() => {
    try {
      if (typeof document !== 'undefined') {
        return (
          document.documentElement.classList.contains('dark') ||
          localStorage.getItem('medden_theme') === 'dark'
        );
      }
    } catch {}
    return false;
  });

  useEffect(() => {
    if (nightMode !== undefined) return;
    const checkTheme = () => {
      const isDark =
        document.documentElement.classList.contains('dark') ||
        localStorage.getItem('medden_theme') === 'dark';
      setInternalNight(isDark);
    };
    checkTheme();
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    window.addEventListener('storage', checkTheme);
    return () => {
      observer.disconnect();
      window.removeEventListener('storage', checkTheme);
    };
  }, [nightMode]);

  const [observedDesign, setObservedDesign] = useState<string>(() => {
    try {
      if (typeof document !== 'undefined') {
        return document.documentElement.getAttribute('data-design') || localStorage.getItem('medden_active_design') || '1';
      }
    } catch {}
    return '1';
  });

  useEffect(() => {
    if (activeDesign !== undefined) return;
    const syncDesign = () => {
      const d = document.documentElement.getAttribute('data-design') || localStorage.getItem('medden_active_design') || '1';
      setObservedDesign(d);
    };
    syncDesign();
    const obs = new MutationObserver(syncDesign);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-design'] });
    return () => obs.disconnect();
  }, [activeDesign]);

  const themeId: ShelfThemeId = resolveShelfThemeId(activeDesign ?? observedDesign);
  const night = nightMode !== undefined ? nightMode : internalNight;

  const [lit, setLit] = useState(false);
  const [pulled, setPulled] = useState(false);
  const [at, setAt] = useState(0);

  /* Doors start closed so books appear behind glass (or opaque steel) and unlock when opened */
  const [openMap, setOpenMap] = useState<Record<string, boolean>>({});

  /* Modals, Folder Management & Book Pick/Drop */
  const [activeAddShelfId, setActiveAddShelfId] = useState<string | null>(null);
  const [activeAddTargetFolder, setActiveAddTargetFolder] = useState<{ shelfId: string; folderId: string } | null>(null);
  const [editingShelfBook, setEditingShelfBook] = useState<{ shelfId: string; book: Book } | null>(null);
  const [pickedBook, setPickedBook] = useState<{ fromShelfId: string; book: Book } | null>(null);
  const [creatingFolderShelfId, setCreatingFolderShelfId] = useState<string | null>(null);
  const [newFolderName, setNewFolderName] = useState('');
  const [newFolderColor, setNewFolderColor] = useState<string>(FOLDER_COLORS[0]);
  const [newFolderLogo, setNewFolderLogo] = useState<string>(FOLDER_LOGOS[0].id);
  const [folderSettingsCtx, setFolderSettingsCtx] = useState<{ shelfId: string; folderId: string } | null>(null);
  const [folderSettingsNameDraft, setFolderSettingsNameDraft] = useState('');
  const [folderShareNotice, setFolderShareNotice] = useState<string | null>(null);
  const [openFolderCtx, setOpenFolderCtx] = useState<{ shelfId: string; folderId: string } | null>(null);
  const [isNewAlmirahModalOpen, setIsNewAlmirahModalOpen] = useState(false);
  const [newAlmirahName, setNewAlmirahName] = useState('');
  const [selectedDesign, setSelectedDesign] = useState<string>(DESIGNS[0]);

  const idx = Math.min(at, Math.max(data.length - 1, 0));
  const current = data[idx] ?? data[0];

  const [shelfZoom, setShelfZoom] = useState<number>(() => {
    try {
      const saved = parseInt(
        localStorage.getItem('achiev_shelf_zoom_pct') ?? localStorage.getItem('ach1ev_shelf_zoom_pct') ?? '100',
        10
      );
      if (Number.isFinite(saved) && saved >= 60 && saved <= 160) return saved;
    } catch {}
    return 100;
  });

  useEffect(() => {
    try {
      localStorage.setItem('achiev_shelf_zoom_pct', String(shelfZoom));
    } catch {}
  }, [shelfZoom]);

  const patch = (id: string, fn: (a: AlmirahT) => AlmirahT) =>
    save(data.map((a) => (a.id === id ? fn(a) : a)));

  const [daylightRopeDialogOpen, setDaylightRopeDialogOpen] = useState(false);

  const pull = () => {
    setPulled(true);
    window.setTimeout(() => setPulled(false), 180);
    if (!night) {
      setDaylightRopeDialogOpen(true);
      return;
    }
    setLit((v) => !v);
  };

  const moveShelf = (a: AlmirahT, i: number, d: -1 | 1) => {
    const sList = [...a.shelves];
    const other = sList[i + d];
    const me = sList[i];
    if (!other || !me) return;
    sList[i + d] = me;
    sList[i] = other;
    patch(a.id, (x) => ({ ...x, shelves: sList }));
  };

  const handleRenameShelf = (shelfId: string, newName: string) => {
    save(
      data.map((a) => ({
        ...a,
        shelves: a.shelves.map((s) => (s.id === shelfId ? { ...s, name: newName } : s)),
      }))
    );
  };

  const handleAddShelfToAlmirah = (almirahId: string) => {
    patch(almirahId, (a) => ({
      ...a,
      shelves: [
        ...a.shelves.slice(0, -1),
        mk(`Section ${a.shelves.length}`, []),
        ...a.shelves.slice(-1),
      ],
    }));
  };

  const handleAddBookToShelf = (
    shelfId: string,
    title: string,
    cover: string,
    thumbnail?: BookThumbnailConfig
  ) => {
    const resolvedThumb = thumbnail || getDefaultThumbnail(title, COVER[cover]?.from);
    save(
      data.map((a) => ({
        ...a,
        shelves: a.shelves.map((s) =>
          s.id === shelfId
            ? { ...s, books: [...s.books, { id: uid(), title, cover, thumbnail: resolvedThumb }] }
            : s
        ),
      }))
    );
  };

  const handleUpdateBookThumbnail = (
    shelfId: string,
    bookId: string,
    thumbnail: BookThumbnailConfig
  ) => {
    save(
      data.map((a) => ({
        ...a,
        shelves: a.shelves.map((s) =>
          s.id === shelfId
            ? {
                ...s,
                books: s.books.map((b) => (b.id === bookId ? { ...b, thumbnail } : b)),
              }
            : s
        ),
      }))
    );
  };

  const handleRemoveBookFromShelf = (shelfId: string, bookId: string) => {
    if (pickedBook?.book.id === bookId && pickedBook.fromShelfId === shelfId) {
      setPickedBook(null);
    }
    save(
      data.map((a) => ({
        ...a,
        shelves: a.shelves.map((s) =>
          s.id === shelfId
            ? { ...s, books: s.books.filter((b) => b.id !== bookId) }
            : s
        ),
      }))
    );
  };

  const handleTogglePickBook = (shelfId: string, book: Book) => {
    setPickedBook((prev) =>
      prev && prev.book.id === book.id && prev.fromShelfId === shelfId
        ? null
        : { fromShelfId: shelfId, book }
    );
  };

  const handleDropBookToShelf = (
    targetShelfId: string,
    explicitSource?: { fromShelfId: string; bookId: string }
  ) => {
    const srcShelfId = explicitSource?.fromShelfId ?? pickedBook?.fromShelfId;
    const srcBookId = explicitSource?.bookId ?? pickedBook?.book.id;
    if (!srcShelfId || !srcBookId || srcShelfId === targetShelfId) {
      setPickedBook(null);
      return;
    }

    let movedBook: Book | undefined;
    const stripped = data.map((a) => ({
      ...a,
      shelves: a.shelves.map((s) => {
        if (s.id !== srcShelfId) return s;
        const found = s.books.find((b) => b.id === srcBookId);
        if (found) movedBook = found;
        return { ...s, books: s.books.filter((b) => b.id !== srcBookId) };
      }),
    }));

    if (!movedBook) {
      setPickedBook(null);
      return;
    }

    const updated = stripped.map((a) => ({
      ...a,
      shelves: a.shelves.map((s) =>
        s.id === targetShelfId
          ? { ...s, books: [...s.books, movedBook!] }
          : s
      ),
    }));

    save(updated);
    setPickedBook(null);
  };

  const handleOpenCreateFolder = (shelfId: string) => {
    setCreatingFolderShelfId(shelfId);
    setNewFolderName('');
    setNewFolderColor(FOLDER_COLORS[Math.floor(Math.random() * FOLDER_COLORS.length)]!);
    setNewFolderLogo(FOLDER_LOGOS[0].id);
  };

  const handleConfirmCreateFolder = (e: FormEvent) => {
    e.preventDefault();
    if (!creatingFolderShelfId) return;
    const folder: ShelfFolder = {
      id: uid(),
      name: newFolderName.trim() || 'Study Folder',
      color: newFolderColor,
      logoId: newFolderLogo,
      books: [],
      createdAt: new Date().toISOString(),
    };
    save(
      data.map((a) => ({
        ...a,
        shelves: a.shelves.map((s) =>
          s.id === creatingFolderShelfId ? { ...s, folders: [...(s.folders || []), folder] } : s
        ),
      }))
    );
    setCreatingFolderShelfId(null);
    setNewFolderName('');
  };

  const updateShelfFolder = (
    shelfId: string,
    folderId: string,
    updater: (f: ShelfFolder) => ShelfFolder
  ) => {
    save(
      data.map((a) => ({
        ...a,
        shelves: a.shelves.map((s) =>
          s.id === shelfId
            ? {
                ...s,
                folders: (s.folders || []).map((f) => (f.id === folderId ? updater(f) : f)),
              }
            : s
        ),
      }))
    );
  };

  const handleDeleteFolder = (shelfId: string, folderId: string) => {
    save(
      data.map((a) => ({
        ...a,
        shelves: a.shelves.map((s) =>
          s.id === shelfId
            ? { ...s, folders: (s.folders || []).filter((f) => f.id !== folderId) }
            : s
        ),
      }))
    );
    if (folderSettingsCtx?.folderId === folderId) setFolderSettingsCtx(null);
    if (openFolderCtx?.folderId === folderId) setOpenFolderCtx(null);
  };

  const handleShareFolder = async (folder: ShelfFolder) => {
    const summary = `Achiev Folder: "${folder.name}" (${folder.books.length} documents) — ${
      typeof window !== 'undefined' ? window.location.origin : 'https://achiev.com'
    }`;
    try {
      if (typeof navigator !== 'undefined' && navigator.share) {
        await navigator.share({ title: `Achiev Folder — ${folder.name}`, text: summary });
        setFolderShareNotice('Folder shared successfully!');
      } else if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(summary);
        setFolderShareNotice('Folder link & summary copied to clipboard!');
      } else {
        setFolderShareNotice('Share summary ready!');
      }
    } catch {
      try {
        await navigator.clipboard?.writeText(summary);
        setFolderShareNotice('Folder link & summary copied to clipboard!');
      } catch {
        setFolderShareNotice('Could not copy share link.');
      }
    }
    window.setTimeout(() => setFolderShareNotice(null), 2600);
  };

  const handleDropBookToFolder = (
    targetShelfId: string,
    folderId: string,
    explicitSource?: { fromShelfId: string; bookId: string }
  ) => {
    const srcShelfId = explicitSource?.fromShelfId ?? pickedBook?.fromShelfId;
    const srcBookId = explicitSource?.bookId ?? pickedBook?.book.id;
    if (!srcShelfId || !srcBookId) return;

    let movedBook: Book | undefined;
    const stripped = data.map((a) => ({
      ...a,
      shelves: a.shelves.map((s) => {
        if (s.id !== srcShelfId) return s;
        const found = s.books.find((b) => b.id === srcBookId);
        if (found) movedBook = found;
        return { ...s, books: s.books.filter((b) => b.id !== srcBookId) };
      }),
    }));
    if (!movedBook) return;

    save(
      stripped.map((a) => ({
        ...a,
        shelves: a.shelves.map((s) =>
          s.id === targetShelfId
            ? {
                ...s,
                folders: (s.folders || []).map((f) =>
                  f.id === folderId ? { ...f, books: [...f.books, movedBook!] } : f
                ),
              }
            : s
        ),
      }))
    );
    setPickedBook(null);
  };

  const handleAddBookToFolder = (
    shelfId: string,
    folderId: string,
    title: string,
    cover: string,
    thumbnail?: BookThumbnailConfig
  ) => {
    const resolvedThumb = thumbnail || getDefaultThumbnail(title, COVER[cover]?.from);
    updateShelfFolder(shelfId, folderId, (f) => ({
      ...f,
      books: [...f.books, { id: uid(), title, cover, thumbnail: resolvedThumb }],
    }));
  };

  const handleRemoveBookFromFolder = (shelfId: string, folderId: string, bookId: string) => {
    updateShelfFolder(shelfId, folderId, (f) => ({
      ...f,
      books: f.books.filter((b) => b.id !== bookId),
    }));
  };

  const handleMoveFolderBookToShelf = (shelfId: string, folderId: string, bookId: string) => {
    let bookToMove: Book | undefined;
    save(
      data.map((a) => ({
        ...a,
        shelves: a.shelves.map((s) => {
          if (s.id !== shelfId) return s;
          const nextFolders = (s.folders || []).map((f) => {
            if (f.id !== folderId) return f;
            bookToMove = f.books.find((b) => b.id === bookId);
            return { ...f, books: f.books.filter((b) => b.id !== bookId) };
          });
          return bookToMove
            ? { ...s, folders: nextFolders, books: [...s.books, bookToMove] }
            : { ...s, folders: nextFolders };
        }),
      }))
    );
  };

  const findFolder = (ctx: { shelfId: string; folderId: string } | null): { shelf: ShelfT; folder: ShelfFolder } | null => {
    if (!ctx) return null;
    for (const a of data) {
      const sh = a.shelves.find((s) => s.id === ctx.shelfId);
      if (sh) {
        const fl = (sh.folders || []).find((f) => f.id === ctx.folderId);
        if (fl) return { shelf: sh, folder: fl };
      }
    }
    return null;
  };

  const activeSettingsFolderObj = findFolder(folderSettingsCtx);
  const activeOpenFolderObj = findFolder(openFolderCtx);
  const activeShelfObj =
    current?.shelves.find((s) => s.id === activeAddShelfId) ||
    data.flatMap((a) => a.shelves).find((s) => s.id === activeAddTargetFolder?.shelfId);

  return (
    <div style={{ maxWidth: 1180, margin: '0 auto', padding: '6px 6px', font: '14px system-ui', position: 'relative' }}>
      <style>{CSS}</style>

      {/* Floating Shelf Pick-and-Drop Banner + Zoom Control Bar */}
      <div
        className="flex flex-wrap items-center justify-between gap-2 mb-2 px-1"
        style={{ position: 'relative', zIndex: 25 }}
      >
        {pickedBook ? (
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border shadow-sm backdrop-blur-md text-xs font-semibold"
            style={{
              background: night ? 'rgba(68, 42, 16, 0.9)' : 'rgba(254, 243, 199, 0.95)',
              borderColor: 'rgba(245, 158, 11, 0.7)',
              color: night ? '#fef3c7' : '#78350f',
            }}
          >
            <Move className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span className="truncate max-w-[230px]">
              Picked &ldquo;{pickedBook.book.title}&rdquo; · Drag or click Drop Here on any open section
            </span>
            <button
              type="button"
              onClick={() => setPickedBook(null)}
              className="px-2 py-0.5 rounded-full bg-black/15 hover:bg-black/25 text-[10.5px] font-bold cursor-pointer"
            >
              Cancel
            </button>
          </div>
        ) : (
          <span />
        )}
        <div
          className="inline-flex items-center gap-1 px-2 py-1 rounded-full border shadow-sm backdrop-blur-md"
          style={{
            background: night ? 'rgba(20, 14, 10, 0.78)' : 'rgba(253, 250, 244, 0.85)',
            borderColor: night ? 'rgba(212, 175, 55, 0.3)' : 'rgba(139, 98, 45, 0.25)',
            color: night ? '#efe4d4' : '#2b2118',
          }}
        >
          <button
            type="button"
            onClick={() => setShelfZoom((z) => Math.max(60, z - 10))}
            disabled={shelfZoom <= 60}
            className="p-1 rounded-full hover:bg-black/10 dark:hover:bg-white/10 disabled:opacity-35 cursor-pointer"
            title="Zoom out Shelf"
            aria-label="Zoom out shelf"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setShelfZoom(100)}
            className="px-1.5 py-0.5 rounded-full text-[11px] font-mono font-bold hover:bg-black/10 dark:hover:bg-white/10 cursor-pointer flex items-center gap-1"
            title="Reset Shelf Zoom to 100%"
          >
            <span>Shelf {shelfZoom}%</span>
            {shelfZoom !== 100 && <RotateCcw className="w-2.5 h-2.5 opacity-70" />}
          </button>
          <button
            type="button"
            onClick={() => setShelfZoom((z) => Math.min(160, z + 10))}
            disabled={shelfZoom >= 160}
            className="p-1 rounded-full hover:bg-black/10 dark:hover:bg-white/10 disabled:opacity-35 cursor-pointer"
            title="Zoom in Shelf"
            aria-label="Zoom in shelf"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ULTRA REALISTIC ROOM ENVIRONMENT (Pinch-Zoom & Interactive Scale Container) */}
      <div className="sh-zoom-stage sh-scroll">
        <div style={{ zoom: shelfZoom / 100 }}>
          <Room
            night={night}
            lit={lit}
            pulled={pulled}
            onPull={pull}
            design={current ? current.design : DESIGNS[0]}
            bayIdx={idx}
            themeId={themeId}
          >
            {data.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#fff', textShadow: '0 1px 3px #000', pointerEvents: 'auto' }}>
                No almirah in your room yet. Click New Cabinet to create one.
              </p>
            ) : (
              <div style={{ overflow: 'hidden', pointerEvents: 'none' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'flex-end',
                    transition: 'transform .75s cubic-bezier(0.25, 1, 0.3, 1)',
                    transform: `translateX(-${idx * 100}%)`,
                    pointerEvents: 'none',
                  }}
                >
                  {data.map((a) => (
                    <div
                      key={a.id}
                      style={{ width: '100%', flex: 'none', padding: '0 2px', boxSizing: 'border-box', pointerEvents: 'none' }}
                    >
                      <Almirah
                        a={a}
                        idx={idx}
                        totalAlmirahs={data.length}
                        onPrevAlmirah={() => {
                          setOpenMap((m) => {
                            const next = { ...m };
                            delete next[`${a.id}:top`];
                            delete next[`${a.id}:bottom`];
                            return next;
                          });
                          if (data.length > 1) {
                            setAt((i) => (i - 1 + data.length) % data.length);
                          } else {
                            const curPos = DESIGNS.indexOf(a.design as DesignName);
                            const prevPos = (curPos <= 0 ? DESIGNS.length - 1 : curPos - 1);
                            const nextDesign = DESIGNS[prevPos]!;
                            const nextLook = LOOKS[nextDesign];
                            patch(a.id, (x) => ({
                              ...x,
                              design: nextDesign,
                              name: nextLook?.name || nextDesign,
                              hasUpperDoor: nextLook?.hasUpperDoor ?? true,
                            }));
                          }
                        }}
                        onNextAlmirah={() => {
                          setOpenMap((m) => {
                            const next = { ...m };
                            delete next[`${a.id}:top`];
                            delete next[`${a.id}:bottom`];
                            return next;
                          });
                          if (data.length > 1) {
                            setAt((i) => (i + 1) % data.length);
                          } else {
                            const curPos = DESIGNS.indexOf(a.design as DesignName);
                            const nextPos = ((curPos < 0 ? 0 : curPos) + 1) % DESIGNS.length;
                            const nextDesign = DESIGNS[nextPos]!;
                            const nextLook = LOOKS[nextDesign];
                            patch(a.id, (x) => ({
                              ...x,
                              design: nextDesign,
                              name: nextLook?.name || nextDesign,
                              hasUpperDoor: nextLook?.hasUpperDoor ?? true,
                            }));
                          }
                        }}
                        onAddShelf={() => handleAddShelfToAlmirah(a.id)}
                        onOpenNewAlmirah={() => setIsNewAlmirahModalOpen(true)}
                        onRenameAlmirah={(newName) => patch(a.id, (x) => ({ ...x, name: newName }))}
                        night={night}
                        lit={lit}
                        openMap={openMap}
                        toggle={(k) => setOpenMap((m) => ({ ...m, [k]: !m[k] }))}
                        onMoveShelf={(i, d) => moveShelf(a, i, d)}
                        onRenameShelf={handleRenameShelf}
                        onAddBook={(shelfId) => setActiveAddShelfId(shelfId)}
                        onRemoveBook={handleRemoveBookFromShelf}
                        onEditBookThumbnail={(shelfId, book) => setEditingShelfBook({ shelfId, book })}
                        onSelectBook={onSelectBook}
                        pickedBook={pickedBook}
                        onPickBook={handleTogglePickBook}
                        onDropBook={handleDropBookToShelf}
                        onCreateFolder={handleOpenCreateFolder}
                        onOpenFolder={(shelfId, folder) => setOpenFolderCtx({ shelfId, folderId: folder.id })}
                        onOpenFolderSettings={(shelfId, folder) => {
                          setFolderSettingsCtx({ shelfId, folderId: folder.id });
                          setFolderSettingsNameDraft(folder.name);
                          setFolderShareNotice(null);
                        }}
                        onDropBookToFolder={handleDropBookToFolder}
                        themeId={themeId}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Room>
        </div>
      </div>

      {/* COMPREHENSIVE UPLOAD DOCUMENT / ADD BOOK MODAL */}
      <AddBookModal
        isOpen={activeAddShelfId !== null || activeAddTargetFolder !== null}
        onClose={() => {
          setActiveAddShelfId(null);
          setActiveAddTargetFolder(null);
        }}
        shelfName={
          activeAddTargetFolder
            ? findFolder(activeAddTargetFolder)?.folder.name || 'Folder'
            : activeShelfObj?.name || 'Shelf'
        }
        notebooks={notebooks}
        driveBooks={driveBooks}
        onAddBook={(bookTitle, bookCover, thumbCfg) => {
          if (activeAddTargetFolder) {
            handleAddBookToFolder(
              activeAddTargetFolder.shelfId,
              activeAddTargetFolder.folderId,
              bookTitle,
              bookCover,
              thumbCfg
            );
          } else if (activeAddShelfId) {
            handleAddBookToShelf(activeAddShelfId, bookTitle, bookCover, thumbCfg);
          }
        }}
      />

      {/* CREATE FOLDER MODAL */}
      {creatingFolderShelfId && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn"
          onClick={() => setCreatingFolderShelfId(null)}
        >
          <form
            onSubmit={handleConfirmCreateFolder}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-[#faf6ee] dark:bg-[#18110c] border border-[#d6c7b0] dark:border-[#382518] rounded-2xl p-5 shadow-2xl text-[#1c140e] dark:text-[#efe4d4] space-y-4 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold flex items-center gap-2">
                <FolderPlus className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span>Create Shelf Folder</span>
              </h3>
              <button
                type="button"
                onClick={() => setCreatingFolderShelfId(null)}
                className="p-1 rounded-lg text-[#6f5d4d] dark:text-[#a69079] hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold mb-1">Folder Name</label>
              <input
                type="text"
                autoFocus
                placeholder="e.g. Pharmacology High-Yield Notes"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white dark:bg-[#110c09] border border-[#d6c7b0] dark:border-[#382518] rounded-xl focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold mb-1.5">Folder Colour</label>
              <div className="flex flex-wrap gap-2">
                {FOLDER_COLORS.map((col) => (
                  <button
                    key={col}
                    type="button"
                    onClick={() => setNewFolderColor(col)}
                    className={`w-7 h-7 rounded-lg border-2 flex items-center justify-center transition cursor-pointer ${
                      newFolderColor === col ? 'border-amber-400 scale-110 shadow' : 'border-transparent opacity-85'
                    }`}
                    style={{ backgroundColor: col }}
                  >
                    {newFolderColor === col && <Check className="w-3.5 h-3.5 text-white" />}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold mb-1.5">Folder Logo</label>
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5">
                {FOLDER_LOGOS.map(({ id, label, Icon }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setNewFolderLogo(id)}
                    title={label}
                    className={`p-2 rounded-lg border flex items-center justify-center transition cursor-pointer ${
                      newFolderLogo === id
                        ? 'bg-amber-600 text-white border-amber-400 shadow'
                        : 'bg-white dark:bg-[#110c09] border-[#d6c7b0] dark:border-[#382518] hover:border-amber-500/60'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setCreatingFolderShelfId(null)}
                className="px-4 py-2 rounded-xl bg-[#e8dfd0] dark:bg-[#231912] text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white dark:text-[#110c09] text-xs font-bold cursor-pointer"
              >
                Create Folder
              </button>
            </div>
          </form>
        </div>
      )}

      {/* FOLDER SETTINGS MODAL — RED TRASH/DELETE RIGHT AT THE TOP, THEN SHARE, RENAME, COLOUR, LOGO */}
      {activeSettingsFolderObj && folderSettingsCtx && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn"
          onClick={() => setFolderSettingsCtx(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-[#faf6ee] dark:bg-[#18110c] border border-[#d6c7b0] dark:border-[#382518] rounded-2xl p-5 shadow-2xl text-[#1c140e] dark:text-[#efe4d4] space-y-4 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between border-b border-[#d6c7b0] dark:border-[#382518] pb-3">
              <div className="flex items-center gap-2 min-w-0">
                <Settings className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                <h3 className="text-base font-bold truncate">
                  Folder Settings · {activeSettingsFolderObj.folder.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setFolderSettingsCtx(null)}
                className="p-1 rounded-lg text-[#6f5d4d] dark:text-[#a69079] hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* 1. FRONT & CENTER RED TRASH / DELETE OPTION */}
            <button
              type="button"
              onClick={() => handleDeleteFolder(folderSettingsCtx.shelfId, folderSettingsCtx.folderId)}
              className="w-full py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-700 active:scale-[0.99] text-white text-xs font-extrabold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg border border-red-400/50 transition cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
              <span>Trash · Delete Folder</span>
            </button>

            {folderShareNotice && (
              <div className="px-3 py-2 rounded-xl bg-emerald-600/20 border border-emerald-500/40 text-emerald-700 dark:text-emerald-300 text-xs font-semibold text-center">
                {folderShareNotice}
              </div>
            )}

            {/* 2. SHARE FOLDER */}
            <div className="flex items-center justify-between gap-2 p-3 rounded-xl bg-white dark:bg-[#110c09] border border-[#d6c7b0] dark:border-[#382518]">
              <div>
                <div className="text-xs font-bold">Share Folder</div>
                <div className="text-[10px] text-[#6f5d4d] dark:text-[#a69079]">
                  Share link &amp; folder summary with classmates
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleShareFolder(activeSettingsFolderObj.folder)}
                className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer shrink-0"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share</span>
              </button>
            </div>

            {/* 3. RENAME FOLDER */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold">Rename Folder</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={folderSettingsNameDraft}
                  onChange={(e) => setFolderSettingsNameDraft(e.target.value)}
                  className="flex-1 px-3 py-2 text-xs bg-white dark:bg-[#110c09] border border-[#d6c7b0] dark:border-[#382518] rounded-xl focus:outline-none focus:border-amber-500"
                />
                <button
                  type="button"
                  onClick={() => {
                    const clean = folderSettingsNameDraft.trim();
                    if (clean) {
                      updateShelfFolder(folderSettingsCtx.shelfId, folderSettingsCtx.folderId, (f) => ({
                        ...f,
                        name: clean,
                      }));
                    }
                  }}
                  className="px-3 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold cursor-pointer shrink-0"
                >
                  Rename
                </button>
              </div>
            </div>

            {/* 4. CHANGE COLOUR */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold">Change Colour</label>
              <div className="flex flex-wrap gap-2">
                {FOLDER_COLORS.map((col) => {
                  const selected = activeSettingsFolderObj.folder.color === col;
                  return (
                    <button
                      key={col}
                      type="button"
                      onClick={() =>
                        updateShelfFolder(folderSettingsCtx.shelfId, folderSettingsCtx.folderId, (f) => ({
                          ...f,
                          color: col,
                        }))
                      }
                      className={`w-7 h-7 rounded-lg border-2 flex items-center justify-center transition cursor-pointer ${
                        selected ? 'border-amber-400 scale-110 shadow' : 'border-transparent opacity-85'
                      }`}
                      style={{ backgroundColor: col }}
                    >
                      {selected && <Check className="w-3.5 h-3.5 text-white" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 5. CHANGE LOGO OF FOLDER */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold">Change Logo of Folder</label>
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5">
                {FOLDER_LOGOS.map(({ id, label, Icon }) => {
                  const selected = activeSettingsFolderObj.folder.logoId === id;
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() =>
                        updateShelfFolder(folderSettingsCtx.shelfId, folderSettingsCtx.folderId, (f) => ({
                          ...f,
                          logoId: id,
                        }))
                      }
                      title={label}
                      className={`p-2 rounded-lg border flex items-center justify-center transition cursor-pointer ${
                        selected
                          ? 'bg-amber-600 text-white border-amber-400 shadow'
                          : 'bg-white dark:bg-[#110c09] border-[#d6c7b0] dark:border-[#382518] hover:border-amber-500/60'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-end pt-1">
              <button
                type="button"
                onClick={() => setFolderSettingsCtx(null)}
                className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FOLDER CONTENTS MODAL (VIEW, UPLOAD DOCUMENT OR MOVE TO SHELF) */}
      {activeOpenFolderObj && openFolderCtx && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn"
          onClick={() => setOpenFolderCtx(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg bg-[#faf6ee] dark:bg-[#18110c] border border-[#d6c7b0] dark:border-[#382518] rounded-2xl shadow-2xl text-[#1c140e] dark:text-[#efe4d4] overflow-hidden flex flex-col max-h-[85vh]"
          >
            <div className="px-5 py-3.5 border-b border-[#d6c7b0] dark:border-[#382518] flex items-center justify-between gap-2 bg-[#f2eadb] dark:bg-[#140e0a]">
              <div className="flex items-center gap-2.5 min-w-0">
                {(() => {
                  const { Icon } = getFolderLogoMeta(activeOpenFolderObj.folder.logoId);
                  return (
                    <span
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-white shrink-0 shadow"
                      style={{ backgroundColor: activeOpenFolderObj.folder.color }}
                    >
                      <Icon className="w-4 h-4" />
                    </span>
                  );
                })()}
                <div className="min-w-0">
                  <h3 className="text-base font-bold truncate">{activeOpenFolderObj.folder.name}</h3>
                  <p className="text-[10.5px] text-[#6f5d4d] dark:text-[#a69079]">
                    {activeOpenFolderObj.shelf.name} · {activeOpenFolderObj.folder.books.length}{' '}
                    {activeOpenFolderObj.folder.books.length === 1 ? 'document' : 'documents'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setFolderSettingsCtx({
                      shelfId: openFolderCtx.shelfId,
                      folderId: openFolderCtx.folderId,
                    });
                    setFolderSettingsNameDraft(activeOpenFolderObj.folder.name);
                  }}
                  className="px-2.5 py-1.5 rounded-lg bg-black/10 dark:bg-white/10 hover:bg-amber-600 hover:text-white text-xs font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <Settings className="w-3.5 h-3.5" />
                  <span>Settings</span>
                </button>
                <button
                  type="button"
                  onClick={() => setOpenFolderCtx(null)}
                  className="p-1.5 rounded-lg text-[#6f5d4d] dark:text-[#a69079] hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="p-5 overflow-y-auto space-y-3">
              {activeOpenFolderObj.folder.books.length === 0 ? (
                <div className="p-6 rounded-xl border border-dashed border-[#d6c7b0] dark:border-[#382518] text-center space-y-2">
                  <p className="text-xs font-semibold">This folder is empty</p>
                  <p className="text-[11px] text-[#6f5d4d] dark:text-[#a69079]">
                    Upload a document inside or drag any book from your shelf onto this folder.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {activeOpenFolderObj.folder.books.map((bk) => (
                    <div
                      key={bk.id}
                      className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-white dark:bg-[#120c08] border border-[#d6c7b0] dark:border-[#382518]"
                    >
                      <button
                        type="button"
                        onClick={() => {
                          onSelectBook?.(bk);
                          setOpenFolderCtx(null);
                        }}
                        className="flex items-center gap-2.5 min-w-0 text-left flex-1 cursor-pointer"
                      >
                        <BookLogoBadge
                          title={bk.title}
                          thumbnail={bk.thumbnail}
                          fallbackBg={COVER[bk.cover]?.from || '#7c4521'}
                          compact
                        />
                        <span className="text-xs font-bold truncate hover:underline">{bk.title}</span>
                      </button>
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() =>
                            handleMoveFolderBookToShelf(
                              openFolderCtx.shelfId,
                              openFolderCtx.folderId,
                              bk.id
                            )
                          }
                          title="Move back onto shelf row"
                          className="px-2 py-1 rounded-lg bg-amber-500/15 hover:bg-amber-600 text-amber-800 dark:text-amber-300 hover:text-white text-[10px] font-semibold cursor-pointer"
                        >
                          To Shelf
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            handleRemoveBookFromFolder(
                              openFolderCtx.shelfId,
                              openFolderCtx.folderId,
                              bk.id
                            )
                          }
                          title="Remove from folder"
                          className="p-1.5 rounded-lg bg-red-600/15 hover:bg-red-600 text-red-600 hover:text-white cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="px-5 py-3 border-t border-[#d6c7b0] dark:border-[#382518] bg-[#f2eadb] dark:bg-[#140e0a] flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => {
                  setActiveAddTargetFolder({
                    shelfId: openFolderCtx.shelfId,
                    folderId: openFolderCtx.folderId,
                  });
                }}
                className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Document</span>
              </button>
              <button
                type="button"
                onClick={() => setOpenFolderCtx(null)}
                className="px-4 py-2 rounded-xl bg-black/10 dark:bg-white/10 text-xs font-semibold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SHELF BOOK THUMBNAIL / LOGO / 100 ICONS EDITOR MODAL */}
      <BookThumbnailEditorModal
        isOpen={editingShelfBook !== null}
        itemTitle={editingShelfBook?.book.title || ''}
        initialConfig={editingShelfBook?.book.thumbnail}
        defaultBgHex={
          editingShelfBook ? (COVER[editingShelfBook.book.cover]?.from || '#5C351C') : '#5C351C'
        }
        onClose={() => setEditingShelfBook(null)}
        onSave={(cfg) => {
          if (editingShelfBook) {
            handleUpdateBookThumbnail(editingShelfBook.shelfId, editingShelfBook.book.id, cfg);
          }
          setEditingShelfBook(null);
        }}
      />

      {/* CREATE NEW ALMIRAH MODAL */}
      {isNewAlmirahModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-[#faf6ee] dark:bg-[#18110c] border border-[#d6c7b0] dark:border-[#382518] rounded-2xl p-6 shadow-2xl text-[#1c140e] dark:text-[#efe4d4] max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-[#1c140e] dark:text-[#efe4d4] mb-3 flex items-center gap-2">
              <FolderPlus className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span>Add New Almirah</span>
            </h3>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const autoName =
                  newAlmirahName.trim() || LOOKS[selectedDesign]?.name || selectedDesign;
                const newAlmirah: AlmirahT = {
                  id: uid(),
                  name: autoName,
                  design: selectedDesign,
                  hasUpperDoor: LOOKS[selectedDesign]?.hasUpperDoor ?? true,
                  shelves: [
                    mk('Section 1', []),
                    mk('Section 2', []),
                    mk('Lower Section', []),
                  ],
                };
                save([...data, newAlmirah]);
                setAt(data.length);
                setNewAlmirahName('');
                setIsNewAlmirahModalOpen(false);
              }}
              className="space-y-4"
            >
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {DESIGNS.map((d) => {
                  const isSelected = selectedDesign === d;
                  return (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setSelectedDesign(d)}
                      aria-pressed={isSelected}
                      className={`flex flex-col items-center justify-center gap-2 p-3 rounded-xl border-2 text-center transition-all cursor-pointer ${
                        isSelected
                          ? '!bg-[#8f5f2c] !text-white !border-[#d4af37] shadow-lg scale-[1.02]'
                          : 'border-[#d6c7b0] dark:border-[#382518] bg-white dark:bg-[#140e0a]/70 text-[#4a3728] dark:text-[#d8c7b0] hover:border-amber-500/60'
                      }`}
                    >
                      <Mini design={d} themeId={themeId} />
                      <p className={`text-xs font-bold leading-tight ${isSelected ? 'text-white' : ''}`}>
                        {LOOKS[d]?.name}
                      </p>
                    </button>
                  );
                })}
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsNewAlmirahModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-[#e8dfd0] hover:bg-[#ddd1bd] dark:bg-[#231912] dark:hover:bg-[#2f2117] border border-[#d6c7b0] dark:border-[#382518] text-[#1c140e] dark:text-[#d8c7b0] text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#8f5f2c] hover:bg-[#784b18] text-white text-xs font-bold shadow-md cursor-pointer"
                >
                  Create Almirah
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DAYLIGHT BULB ROPE DIALOG */}
      {daylightRopeDialogOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/55 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => setDaylightRopeDialogOpen(false)}
        >
          <div
            className="w-full max-w-sm rounded-2xl bg-[#fdfaf4] dark:bg-[#18110c] border border-amber-500/40 shadow-2xl p-5 text-center space-y-3 text-[#1c140e] dark:text-[#efe4d4]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-11 h-11 rounded-full bg-amber-400/25 border border-amber-500/40 flex items-center justify-center mx-auto text-amber-600 dark:text-amber-400 text-xl">
              ☀️
            </div>
            <h4 className="font-serif font-bold text-base text-[#1c140e] dark:text-[#efe4d4]">
              No need right now, use sunlight
            </h4>
            <p className="text-xs text-[#6f5d4d] dark:text-[#a69079]">
              Your study sanctuary is already lit by natural daytime sunlight. Switch to Night Mode to illuminate the almirah spotlights.
            </p>
            <button
              type="button"
              onClick={() => setDaylightRopeDialogOpen(false)}
              className="px-5 py-2 rounded-xl bg-[#A47C43] hover:bg-[#8e6834] text-white text-xs font-bold shadow-xs cursor-pointer"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
