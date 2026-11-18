import React, { useState, useEffect } from 'react';
import { UserProfile, BreakTimerConfig, DesignId, AppLanguage, SidebarSettings } from '../../types';
import {
  INDIAN_LANGUAGES,
  WORLD_LANGUAGES,
  getAllAvailableLanguages,
  getCustomLanguages,
  saveCustomLanguage,
  removeCustomLanguage,
  getCurrentLanguage,
  setAppLanguage,
} from '../../data/translations';
import { SUBSCRIPTION_TIERS } from '../../data/subscriptionData';
import { getThemeMeta } from '../../data/themeMeta';
import { ThemeAppStorePreviews } from './ThemeAppStorePreviews';
import { useAuth } from '../../contexts/AuthContext';
import {
  DRIVE_APP_FOLDER_NAME,
} from '../../services/googleDriveService';
import { persistSubscriptionToAuthProfile } from '../../services/supabaseSyncService';
import {
  buildSubscriptionRecord,
  getActivePlanId,
  getOwnerSubscriptionRecord,
  getStoredSubscription,
  isCurrentUserOwner,
  saveUserSubscription,
} from '../../utils/subscriptionLimits';
import {
  calculateDiscountedPrice,
  getSavedDiscountCode,
  saveDiscountCode,
  validateDiscountCode,
  type DiscountCodeResult,
} from '../../utils/discountCodes';
import {
  GOALS_UPDATED_EVENT,
  formatDurationWords,
  formatLogDateLabel,
  getDailyImageQGoal,
  getDailyMcqGoal,
  getFocusTargetConfig,
  getFocusTimerLogs,
  getLocalDateKey,
  getPracticeLogs,
  logTodayPracticeCount,
  setDailyImageQGoalValue,
  setDailyMcqGoalValue,
  setFocusTargetGoal,
} from '../../utils/studyGoalsStore';
import {
  User,
  Settings,
  Eye,
  Volume2,
  X,
  Check,
  CheckCircle2,
  Download,
  RotateCcw,
  Sparkles,
  Palette,
  ShieldCheck,
  Globe,
  UploadCloud,
  Crown,
  SlidersHorizontal,
  ArrowUp,
  ArrowDown,
  Cloud,
  HardDrive,
  RefreshCw,
  Database,
  LogIn,
  AlertCircle,
  Plus,
  Trash2,
  Search,
  Sun,
  Moon,
  Camera,
  Link2,
  Keyboard,
  Target,
  Type,
  ArrowLeft,
  ArrowRight,
  Menu,
  Timer,
  Clock,
  ExternalLink,
  Image as ImageIcon,
} from 'lucide-react';

export type SettingsTabId =
  | 'profile'
  | 'designs'
  | 'wallpaper'
  | 'typography'
  | 'cloud-sync'
  | 'import-notes'
  | 'sidebar-buttons'
  | 'customizer'
  | 'languages'
  | 'subscription'
  | 'defaults';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  onUpdateProfile: (profile: UserProfile) => void;
  breakTimerConfig: BreakTimerConfig;
  onUpdateBreakConfig: (cfg: BreakTimerConfig) => void;
  onExportNotes: () => void;
  onResetSession: () => void;
  activeDesign?: DesignId;
  onSelectDesign?: (design: DesignId) => void;
  isWorkspaceView?: boolean;
  initialTab?: SettingsTabId;
  onSyncNow?: () => Promise<void> | void;
}

export interface MasterEdition {
  id: DesignId;
  title: string;
  badge: string;
  category: string;
  tagline: string;
  description: string;
  paletteColors: string[];
  keyHighlights: string[];
}

export const MASTER_EDITIONS: MasterEdition[] = [
  {
    id: '1',
    title: 'Heritage Atelier Study',
    badge: 'Default',
    category: 'Linen & Walnut Atelier · Espresso Night',
    tagline: 'Calacatta marble Leisure (Light), warm walnut & espresso (Dark), Soft Pill buttons',
    description: 'Signature Heritage Study with warm linen Light Mode, smooth dark walnut & espresso Dark Mode, Soft Pill buttons, daytime butterflies & nighttime fireflies.',
    paletteColors: ['#f6f2ea', '#a47c43', '#6f4225', '#2a180d', '#160b05'],
    keyHighlights: [
      'Smooth walnut & espresso palette (Dark) & Calacatta marble Leisure (Light)',
      '5 unique indoor study walls + Soft Cream Chenille rug in Shelf',
      'Daytime butterflies & nighttime glowing fireflies',
      'Soft Pill buttons (11px) with gradient depth',
    ],
  },
  {
    id: '2',
    title: 'Twilight Sunset',
    badge: 'Plum, Blush & Coral',
    category: 'Twilight Plum #473E66 · Orchid #BD83B8 · Coral #F1916D',
    tagline: 'Twilight plum depth, orchid mauve mist, rose blush surfaces & coral peach glow accents',
    description: 'Signature atelier layout dressed in a serene twilight horizon palette: deep #473E66 plum, soft #BD83B8 orchid, airy #F5D7DB rose blush, and warm #F1916D sunset coral.',
    paletteColors: ['#f5d7db', '#f1916d', '#bd83b8', '#473e66', '#100d1d'],
    keyHighlights: [
      'Rose Blush (#F5D7DB) Light Mode & Twilight Plum (#473E66) Dark Mode',
      'Coral Peach (#F1916D) & Orchid Mauve (#BD83B8) gradient buttons',
      'Matching Twilight Sunset abstract backdrop & Leisure canvas',
      'Sunset Contour button silhouettes across all workspaces',
    ],
  },
  {
    id: '3',
    title: 'Royal Blush & Plum',
    badge: 'Pastel Beige-Pink',
    category: 'Royal Blush #FBF3F2 · Warm Beige #F5E6E7 · Plum Cocoa #6E4253',
    tagline: 'Cushioned royal baby-pink & warm beige by day, velvety deep plum by night',
    description: 'Royal pastel baby-pink & warm antique beige surfaces paired with refined plum-cocoa buttons and generous cushioned borders.',
    paletteColors: ['#fbf3f2', '#f5e6e7', '#d49aa6', '#6e4253', '#1c1115'],
    keyHighlights: [
      'Royal Baby-Pink & Antique Beige (#FBF3F2) Light Mode surfaces',
      'Velvety Deep Plum (#1C1115) Dark Mode & soft rose accents',
      'Cushioned Rounded (15px) button silhouettes across panels',
      'Full Light & Dark Royal Blush study & Shelf ambiance',
    ],
  },
  {
    id: '4',
    title: 'Muted Slate & Cobalt',
    badge: 'Matte Architectural Grey-Blue',
    category: 'Soft Mist #F1F5F8 · Matte Cobalt #56728F · Dark Slate #131921',
    tagline: 'Restrained matte slate & muted cobalt blue by day, deep charcoal slate by night',
    description: 'Calm architectural contrast pairing desaturated slate mist surfaces with muted matte cobalt accents and razor-crisp 90° geometric corners.',
    paletteColors: ['#f1f5f8', '#dbe4ee', '#7d9ab5', '#56728f', '#131921'],
    keyHighlights: [
      'Soft Muted Slate (#F1F5F8) Light Mode & Charcoal Slate (#131921) Dark Mode',
      'Restrained Matte Cobalt (#56728F / #7D9AB5) interactive controls',
      'Zero-radius architectural 90° sharp corner geometry',
      'Matching Slate & Cobalt Shelf ambiance without eye strain',
    ],
  },
  {
    id: '5',
    title: 'Forest Emerald & Gold',
    badge: 'Evergreen, Champagne & Gold',
    category: 'Forest #002a23 · Champagne #d8c2aa · Gold · Obsidian #090e0e',
    tagline: 'Deep forest evergreen #002a23, warm champagne #d8c2aa, brushed gold & obsidian #090e0e',
    description: 'Rich greenish forest study sanctuary pairing deep #002a23 evergreen and #090e0e obsidian night with warm #d8c2aa champagne sand and brushed metallic gold accents.',
    paletteColors: ['#d8c2aa', '#d1a854', '#002a23', '#05201b', '#090e0e'],
    keyHighlights: [
      'Deep Forest (#002a23) & Obsidian (#090e0e) greenhouse vibe',
      'Warm Champagne (#d8c2aa) paper surfaces & brushed metallic gold',
      'Gold-illuminated active controls & forest-green idle panels',
      'Crisp Emerald Tab (8px 14px) button silhouettes',
    ],
  },
];

export interface FontOption {
  id: string;
  name: string;
  category: 'Handwriting' | 'Casual' | 'Official';
  fontType: 'handwriting' | 'casual' | 'official';
  cssFamily: string;
  description: string;
  sample: string;
}

export const APP_FONTS: FontOption[] = [
  // 9 HANDWRITING FONTS
  { id: 'annie-use-your-telescope', name: 'Annie Use Your Telescope', category: 'Handwriting', fontType: 'handwriting', cssFamily: "'Annie Use Your Telescope', cursive", description: 'Tall airy fine-pen lettering ideal for cozy annotations.', sample: 'High-Yield Ward Pearl: Check Airway, Breathing & SpO2 first!' },
  { id: 'caveat-brush', name: 'Caveat Brush', category: 'Handwriting', fontType: 'handwriting', cssFamily: "'Caveat Brush', cursive", description: 'Bold expressive marker-brush stroke for standout headlines.', sample: 'Beck Triad -> Hypotension, JVD & Muffled Heart Sounds.' },
  { id: 'comic-neue', name: 'Comic Neue', category: 'Handwriting', fontType: 'handwriting', cssFamily: "'Comic Neue', cursive", description: 'Friendly crisp printed notebook hand with wide readability.', sample: 'Formula: MAP = DBP + 1/3 (SBP - DBP) >= 65 mmHg.' },
  { id: 'delius', name: 'Delius', category: 'Handwriting', fontType: 'handwriting', cssFamily: "'Delius', cursive", description: 'Neat rounded ballpoint print balanced for whole study pages.', sample: 'Differential Diagnosis: Pneumothorax vs Cardiac Tamponade.' },
  { id: 'indie-flower', name: 'Indie Flower', category: 'Handwriting', fontType: 'handwriting', cssFamily: "'Indie Flower', cursive", description: 'Playful upbeat student margin-note handwriting.', sample: 'Discontinue Metformin 48 hrs prior to iodinated IV contrast.' },
  { id: 'lobster-two', name: 'Lobster Two', category: 'Handwriting', fontType: 'handwriting', cssFamily: "'Lobster Two', cursive", description: 'Clean upright brush display script with warm editorial flair.', sample: 'Clinical Round Notes — Cardiology Morning Posting.' },
  { id: 'dancing-script', name: 'Dancing Script', category: 'Handwriting', fontType: 'handwriting', cssFamily: "'Dancing Script', cursive", description: 'Fluid calligraphic strokes for memorable study anchors.', sample: 'The Art & Science of Bedside Physical Examination.' },
  { id: 'patrick-hand', name: 'Patrick Hand', category: 'Handwriting', fontType: 'handwriting', cssFamily: "'Patrick Hand', cursive", description: 'Clean effortless everyday notebook penmanship.', sample: 'Cranial Nerve Exam: CN I to XII Quick Recall Sheet.' },
  { id: 'jojoba', name: 'Jojoba', category: 'Handwriting', fontType: 'handwriting', cssFamily: "'Jojoba', 'Patrick Hand', cursive", description: 'Organic studio hand-script style with gentle organic rhythm.', sample: 'Rx: Tab. Amoxicillin-Clavulanate 625mg PO TDS x 7d.' },

  // 9 CASUAL FONTS
  { id: 'urbanist', name: 'Urbanist', category: 'Casual', fontType: 'casual', cssFamily: "'Urbanist', sans-serif", description: 'Low-contrast geometric sans built for modern calm workspaces.', sample: 'Cardiovascular Hemodynamics & Clinical Triage' },
  { id: 'calibri', name: 'Calibri', category: 'Casual', fontType: 'casual', cssFamily: "Calibri, 'Urbanist', sans-serif", description: 'Soft warm modern humanist sans-serif for crisp documents.', sample: 'Pharmacokinetics: Volume of Distribution & Half-Life' },
  { id: 'alata', name: 'Alata', category: 'Casual', fontType: 'casual', cssFamily: "'Alata', sans-serif", description: 'Friendly clean humanist strokes calibrated for long sessions.', sample: 'Renal Clearance & Glomerular Filtration Curves' },
  { id: 'bahnschrift', name: 'Bahnschrift', category: 'Casual', fontType: 'casual', cssFamily: "'Bahnschrift', 'Afacad', sans-serif", description: 'Precision German DIN geometric clean technical lettering.', sample: 'Systemic Vascular Resistance & Cardiac Output' },
  { id: 'century-gothic', name: 'Century Gothic', category: 'Casual', fontType: 'casual', cssFamily: "'Century Gothic', CenturyGothic, AppleGothic, 'Urbanist', sans-serif", description: 'Open circular geometric sans with wide airy breathing room.', sample: 'Neuroanatomy Tracts & Brainstem Cross-Sections' },
  { id: 'zen-maru-gothic', name: 'Zen Maru Gothic', category: 'Casual', fontType: 'casual', cssFamily: "'Zen Maru Gothic', sans-serif", description: 'Rounded gentle minimalist studio sans with zero harsh corners.', sample: 'Pediatric Immunization & Developmental Milestones' },
  { id: 'afacad', name: 'Afacad', category: 'Casual', fontType: 'casual', cssFamily: "'Afacad', sans-serif", description: 'Warm contemporary editorial sans with subtle calligraphic curves.', sample: 'Arterial Blood Gas Analysis & Anion Gap Synthesis' },
  { id: 'arsenal', name: 'Arsenal', category: 'Casual', fontType: 'casual', cssFamily: "'Arsenal', sans-serif", description: 'Compact sharp humanist sans great for dense comparison charts.', sample: 'ACLS & Emergency Trauma Protocol Summary' },
  { id: 'cascadia-mono', name: 'Cascadia Mono', category: 'Casual', fontType: 'casual', cssFamily: "'Cascadia Mono', monospace", description: 'Crisp monospaced clarity ideal for lab ranges and formulas.', sample: 'Na+ 135-145 | K+ 3.5-5.0 | HCO3- 22-26 mEq/L' },

  // 10 OFFICIAL FONTS
  { id: 'times-new-roman', name: 'Times New Roman', category: 'Official', fontType: 'official', cssFamily: "'Times New Roman', Times, serif", description: 'Timeless academic paper & medical journal standard.', sample: 'Harrison’s Principles of Internal Medicine — Review Notes' },
  { id: 'amiri-quran', name: 'Amiri Quran', category: 'Official', fontType: 'official', cssFamily: "'Amiri Quran', serif", description: 'Classical Naskh & refined editorial scholarly proportions.', sample: 'Classical Materia Medica & Pathophysiology Compendium' },
  { id: 'abhaya-libre', name: 'Abhaya Libre', category: 'Official', fontType: 'official', cssFamily: "'Abhaya Libre', serif", description: 'High-contrast stately serif crafted for serious reading.', sample: 'Oxford Handbook of Clinical Medicine Synthesis' },
  { id: 'antic', name: 'Antic', category: 'Official', fontType: 'official', cssFamily: "'Antic', sans-serif", description: 'Formal clean newspaper & monograph display clarity.', sample: 'Diagnostic Criteria for Acute Coronary Syndromes' },
  { id: 'didone', name: 'Didone', category: 'Official', fontType: 'official', cssFamily: "'Didone', 'Antic Didone', 'Bodoni Moda', 'Didot', serif", description: 'Sculptural hairline-serif formality for distinguished titles.', sample: 'Grand Rounds Case Compendium & Therapeutics' },
  { id: 'bellefair', name: 'Bellefair', category: 'Official', fontType: 'official', cssFamily: "'Bellefair', serif", description: 'Poetic humanist classic serif with graceful open counters.', sample: 'Differential Diagnosis of Acute Abdomen & Peritonitis' },
  { id: 'bodoni-moda', name: 'Bodoni Moda', category: 'Official', fontType: 'official', cssFamily: "'Bodoni Moda', 'Bodoni MT', serif", description: 'Dramatic luxury editorial serif with sharp contrast.', sample: 'Achiev Editorial Study — Clinical Journal Archive' },
  { id: 'bona-nova', name: 'Bona Nova', category: 'Official', fontType: 'official', cssFamily: "'Bona Nova', serif", description: 'Structured contemporary academic book serif for deep focus.', sample: 'Physiological Basis of Medical Practice Notes' },
  { id: 'caudex', name: 'Caudex', category: 'Official', fontType: 'official', cssFamily: "'Caudex', serif", description: 'Inspired by medieval manuscripts with disciplined modern rhythm.', sample: 'Integrated Pathology & Pharmacology Compendium' },
  { id: 'domine', name: 'Domine', category: 'Official', fontType: 'official', cssFamily: "'Domine', serif", description: 'Sturdy authoritative serif tuned for razor-sharp on-screen body study.', sample: 'Evidence-Based Internal Medicine Pocket Guide' },
];

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  userProfile,
  onUpdateProfile,
  breakTimerConfig,
  onUpdateBreakConfig,
  onExportNotes,
  onResetSession,
  activeDesign = '1',
  onSelectDesign,
  isWorkspaceView = false,
  initialTab = 'profile',
  onSyncNow,
}) => {
  const {
    user,
    googleUser,
    phoneUser,
    syncStatus,
    lastSyncedAt,
    driveAccount,
    connectGoogleDrive,
    disconnectGoogleDrive,
    openAuthModal,
  } = useAuth();

  const [activeTab, setActiveTab] = useState<SettingsTabId>(initialTab);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(true);
  const [driveConnecting, setDriveConnecting] = useState(false);
  const [driveOpError, setDriveOpError] = useState<string | null>(null);
  const [driveOpSuccess, setDriveOpSuccess] = useState<string | null>(null);
  const [syncingManual, setSyncingManual] = useState(false);

  const [isNightMode, setIsNightMode] = useState<boolean>(() => {
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

  const [observedDesign, setObservedDesign] = useState<string>(() => {
    try {
      if (typeof document !== 'undefined') {
        return (
          document.documentElement.getAttribute('data-design') ||
          localStorage.getItem('medden_active_design') ||
          '1'
        );
      }
    } catch {}
    return '1';
  });

  useEffect(() => {
    if (typeof document === 'undefined') return;
    const syncRootTheme = () => {
      try {
        setIsNightMode(
          document.documentElement.classList.contains('dark') ||
            localStorage.getItem('medden_theme') === 'dark'
        );
        const d =
          document.documentElement.getAttribute('data-design') ||
          localStorage.getItem('medden_active_design') ||
          '1';
        setObservedDesign(d);
      } catch {}
    };
    syncRootTheme();
    const obs = new MutationObserver(syncRootTheme);
    obs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class', 'data-design'],
    });
    return () => obs.disconnect();
  }, []);

  const resolvedDesign = activeDesign || observedDesign || '1';
  const themeMeta = getThemeMeta(resolvedDesign);
  const sb = isNightMode ? themeMeta.sidebar.dark : themeMeta.sidebar.light;

  const getSettingsBtnStyle = (isActive: boolean): React.CSSProperties =>
    isActive
      ? {
          background: sb.activeBtnBg,
          border: `1px solid ${sb.activeBtnBorder}`,
          color: sb.activeBtnText,
          borderRadius: resolvedDesign === '1' ? '9px' : themeMeta.buttonRadius,
          fontWeight: 600,
          backdropFilter: 'blur(14px) saturate(1.25)',
          WebkitBackdropFilter: 'blur(14px) saturate(1.25)',
          boxShadow: isNightMode
            ? '0 0 0 1px rgba(255, 255, 255, 0.2), 0 8px 20px -4px rgba(0, 0, 0, 0.9), 0 2px 6px rgba(0, 0, 0, 0.65), inset 0 1px 0 rgba(255, 255, 255, 0.42), inset 0 -1px 0 rgba(0, 0, 0, 0.25)'
            : '0 4px 12px -2px rgba(36, 22, 10, 0.34), 0 2px 4px rgba(36, 22, 10, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.22)',
        }
      : {
          background: sb.idleBtnBg,
          border: '1px solid transparent',
          color: sb.idleBtnText,
          borderRadius: resolvedDesign === '1' ? '9px' : themeMeta.buttonRadius,
          boxShadow: isNightMode
            ? '0 3px 8px -2px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.05)'
            : undefined,
        };

  const settingsToggleBtnStyle: React.CSSProperties = {
    background: sb.toggleBtnBg,
    border: `1px solid ${sb.toggleBtnBorder}`,
    color: sb.toggleBtnText,
    borderRadius: resolvedDesign === '1' ? '9px' : themeMeta.buttonRadius,
    boxShadow: isNightMode
      ? '0 4px 10px -2px rgba(0, 0, 0, 0.65), inset 0 1px 0 rgba(255, 255, 255, 0.14)'
      : undefined,
  };

  const themeAccentIconStyle: React.CSSProperties = {
    color: 'var(--th-accent)',
  };

  const themeAccentSoftBadgeStyle: React.CSSProperties = {
    backgroundColor: 'var(--th-accent-soft)',
    color: 'var(--th-accent)',
    borderColor: 'color-mix(in srgb, var(--th-accent) 34%, transparent)',
  };

  // Per-theme Light / Dark screenshot preview toggle state
  const [themePreviewModes, setThemePreviewModes] = useState<Record<string, 'light' | 'dark'>>({});

  // Custom Workspace Wallpaper Studio state
  const [customWallpaper, setCustomWallpaper] = useState<string>(() => {
    try {
      return localStorage.getItem('achiev_custom_wallpaper_v1') || '';
    } catch {
      return '';
    }
  });
  const [customWallpaperOpacity, setCustomWallpaperOpacity] = useState<number>(() => {
    try {
      const n = Number(localStorage.getItem('achiev_custom_wallpaper_opacity_v1'));
      return Number.isFinite(n) && n >= 0.1 && n <= 1 ? n : 0.85;
    } catch {
      return 0.85;
    }
  });

  const applyCustomWallpaper = (uri: string, opacityVal: number) => {
    setCustomWallpaper(uri);
    setCustomWallpaperOpacity(opacityVal);
    try {
      if (uri) {
        localStorage.setItem('achiev_custom_wallpaper_v1', uri);
      } else {
        localStorage.removeItem('achiev_custom_wallpaper_v1');
      }
      localStorage.setItem('achiev_custom_wallpaper_opacity_v1', String(opacityVal));
      window.dispatchEvent(new Event('achiev_wallpaper_changed'));
    } catch {}
  };

  const handleUploadWallpaperFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = typeof reader.result === 'string' ? reader.result : '';
      if (!dataUrl) return;
      const img = new window.Image();
      img.onload = () => {
        const maxDim = 1600;
        let w = img.width;
        let h = img.height;
        if (w > maxDim || h > maxDim) {
          const ratio = Math.min(maxDim / w, maxDim / h);
          w = Math.round(w * ratio);
          h = Math.round(h * ratio);
        }
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, w, h);
          const compressed = canvas.toDataURL('image/jpeg', 0.84);
          applyCustomWallpaper(`url("${compressed}")`, customWallpaperOpacity);
        } else {
          applyCustomWallpaper(`url("${dataUrl}")`, customWallpaperOpacity);
        }
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  };

  // Connected Cloud & Drive websites
  interface ConnectedDriveItem {
    id: string;
    name: string;
    url: string;
    accountHint?: string;
    connectedAt: string;
  }
  const [connectedDrives, setConnectedDrives] = useState<ConnectedDriveItem[]>(() => {
    try {
      const saved =
        localStorage.getItem('achiev_connected_drives_v1') ??
        localStorage.getItem('ach1ev_connected_drives_v1');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [customDriveName, setCustomDriveName] = useState('');
  const [customDriveUrl, setCustomDriveUrl] = useState('');
  const [customDriveAccount, setCustomDriveAccount] = useState('');

  const [profileForm, setProfileForm] = useState<UserProfile>(userProfile);
  const [savedFeedback, setSavedFeedback] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen && initialTab) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

  useEffect(() => {
    setProfileForm(userProfile);
  }, [userProfile]);

  const persistConnectedDrives = (next: ConnectedDriveItem[]) => {
    setConnectedDrives(next);
    try {
      localStorage.setItem('achiev_connected_drives_v1', JSON.stringify(next));
    } catch {}
  };

  const handleTogglePresetDrive = (preset: { id: string; name: string; defaultUrl: string }) => {
    const exists = connectedDrives.some((d) => d.id === preset.id);
    if (exists) {
      persistConnectedDrives(connectedDrives.filter((d) => d.id !== preset.id));
      setDriveOpSuccess(`Disconnected ${preset.name}.`);
    } else {
      const item: ConnectedDriveItem = {
        id: preset.id,
        name: preset.name,
        url: preset.defaultUrl,
        connectedAt: new Date().toLocaleDateString(),
      };
      persistConnectedDrives([item, ...connectedDrives]);
      setDriveOpSuccess(`Connected ${preset.name} (${preset.defaultUrl}).`);
    }
  };

  const handleAddCustomDrive = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customDriveUrl.trim()) return;
    let normalizedUrl = customDriveUrl.trim();
    if (!/^https?:\/\//i.test(normalizedUrl)) {
      normalizedUrl = `https://${normalizedUrl}`;
    }
    const domainLabel = (() => {
      try {
        return new URL(normalizedUrl).hostname.replace(/^www\./, '');
      } catch {
        return 'External Drive';
      }
    })();
    const item: ConnectedDriveItem = {
      id: `drive-${Date.now()}`,
      name: customDriveName.trim() || domainLabel,
      url: normalizedUrl,
      accountHint: customDriveAccount.trim() || undefined,
      connectedAt: new Date().toLocaleDateString(),
    };
    persistConnectedDrives([item, ...connectedDrives]);
    setCustomDriveName('');
    setCustomDriveUrl('');
    setCustomDriveAccount('');
    setDriveOpError(null);
    setDriveOpSuccess(`Connected "${item.name}" to your Achiev Drive vault.`);
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const size = 256;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        const minSide = Math.min(img.width, img.height);
        const sx = (img.width - minSide) / 2;
        const sy = (img.height - minSide) / 2;
        ctx.drawImage(img, sx, sy, minSide, minSide, 0, 0, size, size);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.86);
        const nextProfile = { ...profileForm, avatarUrl: dataUrl };
        setProfileForm(nextProfile);
        onUpdateProfile(nextProfile);
        setSavedFeedback(true);
        setTimeout(() => setSavedFeedback(false), 1800);
      };
      img.src = String(reader.result || '');
    };
    reader.readAsDataURL(file);
  };

  const handleConnectDriveClick = async () => {
    setDriveOpError(null);
    setDriveOpSuccess(null);
    setDriveConnecting(true);
    try {
      const acct = await connectGoogleDrive();
      setDriveOpSuccess(
        `Connected personal Google Drive${acct.email ? ` (${acct.email})` : ''} · Folder "${acct.folderName || DRIVE_APP_FOLDER_NAME}" ready.`
      );
    } catch (err: any) {
      setDriveOpError(err?.message || 'Google Drive connection failed.');
    } finally {
      setDriveConnecting(false);
    }
  };

  const handleManualSyncClick = async () => {
    if (!onSyncNow) return;
    setSyncingManual(true);
    setDriveOpError(null);
    try {
      await onSyncNow();
      setSavedFeedback(true);
      setTimeout(() => setSavedFeedback(false), 1800);
    } catch (err: any) {
      setDriveOpError(err?.message || 'Cloud sync failed.');
    } finally {
      setSyncingManual(false);
    }
  };
  const [selectedLang, setSelectedLang] = useState<AppLanguage>(() => getCurrentLanguage());
  const [customLanguages, setCustomLanguages] = useState(() => getCustomLanguages());
  const [langSearchQuery, setLangSearchQuery] = useState('');
  const [langRegionFilter, setLangRegionFilter] = useState<'indian' | 'world'>('indian');
  const [newLangRegion, setNewLangRegion] = useState<'indian' | 'world'>('indian');
  const [showAddLangBuilder, setShowAddLangBuilder] = useState(false);
  const [newLangName, setNewLangName] = useState('');
  const [newLangNative, setNewLangNative] = useState('');
  const [newLangFlag, setNewLangFlag] = useState('🌐');
  const [newLangGreeting, setNewLangGreeting] = useState('');
  const [newLangNavMySpace, setNewLangNavMySpace] = useState('');
  const [newLangNavRead, setNewLangNavRead] = useState('');
  const [newLangNavCreateNote, setNewLangNavCreateNote] = useState('');
  const [newLangNavCalendar, setNewLangNavCalendar] = useState('');
  const [newLangNavShelf, setNewLangNavShelf] = useState('');
  const [importStatus, setImportStatus] = useState<string | null>(null);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    const href =
      'https://fonts.googleapis.com/css2?family=Abhaya+Libre:wght@400;600;700&family=Afacad:wght@400;500;600;700&family=Alata&family=Amiri+Quran&family=Annie+Use+Your+Telescope&family=Antic&family=Antic+Didone&family=Arsenal:wght@400;700&family=Bellefair&family=Bodoni+Moda:wght@500;700&family=Bona+Nova:wght@400;700&family=Cascadia+Mono:wght@400;600&family=Caudex:wght@400;700&family=Caveat+Brush&family=Comic+Neue:wght@400;700&family=Dancing+Script:wght@600;700&family=Delius&family=Domine:wght@400;600;700&family=Indie+Flower&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Lobster+Two:wght@400;700&family=Patrick+Hand&family=Urbanist:wght@400;600;700&family=Zen+Maru+Gothic:wght@400;700&display=swap';
    const existing = document.getElementById('achiev-google-fonts-30') as HTMLLinkElement | null;
    if (!existing) {
      const link = document.createElement('link');
      link.id = 'achiev-google-fonts-30';
      link.rel = 'stylesheet';
      link.href = href;
      document.head.appendChild(link);
    } else if (existing.href !== href) {
      existing.href = href;
    }
  }, []);

  const BASE_SIDEBAR_DEFAULTS: SidebarSettings = {
    showMySpace: true,
    showRead: true,
    showCreateNote: true,
    showCalendar: true,
    showLibrary: true,
    showMyLibrary: true,
    showMnemonics: false,
    showCommunity: true,
    showLeisure: false,
    showTalkToDev: true,
  };

  const [sidebarSettings, setSidebarSettings] = useState<SidebarSettings>(() => {
    try {
      const saved = localStorage.getItem('medden_sidebar_settings');
      if (saved) return { ...BASE_SIDEBAR_DEFAULTS, ...JSON.parse(saved) };
    } catch {}
    return BASE_SIDEBAR_DEFAULTS;
  });

  const toggleSidebarSetting = (key: keyof SidebarSettings) => {
    const updated = { ...sidebarSettings, [key]: sidebarSettings[key] === false };
    setSidebarSettings(updated);
    localStorage.setItem('medden_sidebar_settings', JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('medden_sidebar_settings_changed'));
  };

  const ALL_SIDEBAR_BUTTON_ITEMS: Array<{ id: string; key: keyof SidebarSettings; label: string }> = [
    { id: 'home', key: 'showMySpace', label: 'Cockpit' },
    { id: 'read', key: 'showRead', label: 'Read' },
    { id: 'make-note', key: 'showCreateNote', label: 'Create note' },
    { id: 'roster', key: 'showCalendar', label: 'Calendar' },
    { id: 'library', key: 'showLibrary', label: 'Shelf' },
    { id: 'my-library', key: 'showMyLibrary', label: 'Library' },
    { id: 'mnemonics', key: 'showMnemonics', label: 'Mnemonics' },
    { id: 'community', key: 'showCommunity', label: "Achiever's Hub" },
    { id: 'leisure', key: 'showLeisure', label: 'Leisure' },
    { id: 'talk-to-dev', key: 'showTalkToDev', label: 'Talk to Developer' },
  ];

  const [sidebarOrder, setSidebarOrder] = useState<string[]>(() => {
    const fallback = ALL_SIDEBAR_BUTTON_ITEMS.map((item) => item.id);
    try {
      const saved = localStorage.getItem('medden_sidebar_order');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const merged = [...parsed];
          fallback.forEach((id) => {
            if (!merged.includes(id)) merged.push(id);
          });
          return merged;
        }
      }
    } catch {}
    return fallback;
  });

  const handleShiftSidebarItem = (id: string, direction: -1 | 1) => {
    setSidebarOrder((prev) => {
      const idx = prev.indexOf(id);
      if (idx === -1) return prev;
      const targetIdx = idx + direction;
      if (targetIdx < 0 || targetIdx >= prev.length) return prev;
      const newOrder = [...prev];
      const [removed] = newOrder.splice(idx, 1);
      newOrder.splice(targetIdx, 0, removed);
      localStorage.setItem('medden_sidebar_order', JSON.stringify(newOrder));
      window.dispatchEvent(new CustomEvent('medden_sidebar_settings_changed'));
      return newOrder;
    });
  };

  const handleLanguageSelect = (langCode: AppLanguage) => {
    setSelectedLang(langCode);
    setAppLanguage(langCode);
    setSavedFeedback(true);
    setTimeout(() => setSavedFeedback(false), 1500);
  };

  const handleAddCustomLanguage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLangName.trim()) return;
    const saved = saveCustomLanguage(
      {
        code: newLangName.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 20) || `lang-${Date.now()}`,
        label: newLangName.trim(),
        nativeLabel: newLangNative.trim() || newLangName.trim(),
        flag: newLangFlag.trim() || (newLangRegion === 'indian' ? '🇮🇳' : '🌐'),
        region: newLangRegion,
        greeting: newLangGreeting.trim() || `Welcome in ${newLangName.trim()}`,
      },
      {
        'nav.mySpace': newLangNavMySpace,
        'nav.read': newLangNavRead,
        'nav.createNote': newLangNavCreateNote,
        'nav.calendar': newLangNavCalendar,
        'nav.myShelf': newLangNavShelf,
      }
    );
    setCustomLanguages(getCustomLanguages());
    setLangRegionFilter(newLangRegion);
    handleLanguageSelect(saved.code);
    setNewLangName('');
    setNewLangNative('');
    setNewLangFlag('🌐');
    setNewLangGreeting('');
    setNewLangNavMySpace('');
    setNewLangNavRead('');
    setNewLangNavCreateNote('');
    setNewLangNavCalendar('');
    setNewLangNavShelf('');
    setShowAddLangBuilder(false);
  };

  const handleDeleteCustomLanguage = (code: string, e: React.MouseEvent) => {
    e.stopPropagation();
    removeCustomLanguage(code);
    setCustomLanguages(getCustomLanguages());
    setSelectedLang(getCurrentLanguage());
  };

  const handleImportNotesFromApp = (appName: string) => {
    setImportStatus(`Importing notes from ${appName}...`);
    setTimeout(() => {
      const newNb = {
        id: `nb-imported-${Date.now()}`,
        title: `${appName} Clinical Notes`,
        subject: 'Internal Medicine',
        coverTheme: 'botany',
        coverTitle: `${appName.toUpperCase()} CLINICAL ARCHIVE`,
        coverSubtitle: 'Imported Notebook & Flashcards',
        coverColor: '#365314',
        paperType: 'ruled-thin',
        paperColor: 'beige',
        pages: [
          {
            id: `p-${Date.now()}`,
            title: `Imported from ${appName}: Cardiology & EKG Pearls`,
            contentHtml: `<h2>Imported ${appName} Note</h2><p>Successfully migrated clinical pearls, diagnostic criteria, and medication charts from ${appName}.</p><ul><li>ST-segment elevation criteria in V1-V4</li><li>Troponin-I serial kinetics & delta cutoffs</li><li>ACEi vs ARB in heart failure with reduced ejection fraction (HFrEF)</li></ul>`,
            inkStrokes: [],
            screenshots: [],
            date: new Date().toISOString().split('T')[0],
            updatedAt: new Date().toISOString(),
          },
        ],
        activePageIndex: 0,
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0],
      };
      try {
        const existing = JSON.parse(localStorage.getItem('medden_notebooks') || '[]');
        existing.unshift(newNb);
        localStorage.setItem('medden_notebooks', JSON.stringify(existing));
        window.dispatchEvent(new CustomEvent('medden_notebooks_updated'));
      } catch {}
      setImportStatus(`✓ Successfully imported 1 notebook & 3 clinical topics from ${appName}!`);
      setTimeout(() => setImportStatus(null), 3000);
    }, 1000);
  };
  const [accentTheme, setAccentTheme] = useState<string>(() => localStorage.getItem('medden_accent_theme') || '#A47C43');
  const [dailyHoursGoal, setDailyHoursGoal] = useState<number>(() => getFocusTargetConfig().hours);
  const [dailyMinutesGoal, setDailyMinutesGoal] = useState<number>(() => getFocusTargetConfig().minutes);
  const [dailyMcqGoal, setDailyMcqGoal] = useState<number>(() => getDailyMcqGoal());
  const [dailyMcqDraft, setDailyMcqDraft] = useState<string>(() => String(getDailyMcqGoal()));
  const [dailyImageQGoal, setDailyImageQGoal] = useState<number>(() => getDailyImageQGoal());
  const [dailyImageQDraft, setDailyImageQDraft] = useState<string>(() => String(getDailyImageQGoal()));
  const [todayMcqDone, setTodayMcqDone] = useState<number>(() => {
    const logs = getPracticeLogs('mcq');
    return logs[getLocalDateKey()]?.completed ?? 0;
  });
  const [todayImageQDone, setTodayImageQDone] = useState<number>(() => {
    const logs = getPracticeLogs('image');
    return logs[getLocalDateKey()]?.completed ?? 0;
  });
  const [mcqLogs, setMcqLogs] = useState<Record<string, { completed: number; target: number }>>(() =>
    getPracticeLogs('mcq')
  );
  const [imageQLogs, setImageQLogs] = useState<Record<string, { completed: number; target: number }>>(() =>
    getPracticeLogs('image')
  );
  const [focusTimerLogs, setFocusTimerLogs] = useState<Record<string, number>>(() => getFocusTimerLogs());
  const [currentFont, setCurrentFont] = useState<string>(() => {
    return localStorage.getItem('medden_app_font') || 'Urbanist';
  });

  useEffect(() => {
    const syncGoalsFromStore = () => {
      const cfg = getFocusTargetConfig();
      setDailyHoursGoal(cfg.hours);
      setDailyMinutesGoal(cfg.minutes);
      const mcq = getDailyMcqGoal();
      const imgQ = getDailyImageQGoal();
      setDailyMcqGoal(mcq);
      setDailyMcqDraft(String(mcq));
      setDailyImageQGoal(imgQ);
      setDailyImageQDraft(String(imgQ));
      const mLogs = getPracticeLogs('mcq');
      const iLogs = getPracticeLogs('image');
      setMcqLogs(mLogs);
      setImageQLogs(iLogs);
      const todayKey = getLocalDateKey();
      setTodayMcqDone(mLogs[todayKey]?.completed ?? 0);
      setTodayImageQDone(iLogs[todayKey]?.completed ?? 0);
      setFocusTimerLogs(getFocusTimerLogs());
    };
    window.addEventListener(GOALS_UPDATED_EVENT, syncGoalsFromStore);
    return () => window.removeEventListener(GOALS_UPDATED_EVENT, syncGoalsFromStore);
  }, []);
  const [fontScale, setFontScale] = useState<number>(() => {
    const saved = localStorage.getItem('medden_font_scale');
    return saved ? parseInt(saved, 10) : 100;
  });
  const [fontCategoryFilter, setFontCategoryFilter] = useState<'all' | 'handwriting' | 'casual' | 'official'>('all');
  const [discountInput, setDiscountInput] = useState<string>(() => getSavedDiscountCode()?.code || '');
  const [appliedDiscount, setAppliedDiscount] = useState<DiscountCodeResult | null>(() => getSavedDiscountCode());
  const [discountError, setDiscountError] = useState<string | null>(null);

  const activeAccountEmail = user?.email || googleUser?.email || profileForm.email || '';
  const isOwnerAccount = isCurrentUserOwner(activeAccountEmail);
  const currentSubscription = isOwnerAccount
    ? getOwnerSubscriptionRecord(activeAccountEmail || undefined)
    : userProfile.subscription || getStoredSubscription();
  const activePlanId = getActivePlanId(activeAccountEmail);

  const handleSelectFont = (font: FontOption) => {
    setCurrentFont(font.name);
    localStorage.setItem('medden_app_font', font.name);
    document.documentElement.style.setProperty('--app-font-family', font.cssFamily);
    setSavedFeedback(true);
    setTimeout(() => setSavedFeedback(false), 1500);
  };

  const handleUpdateFontScale = (scaleVal: number) => {
    setFontScale(scaleVal);
    const scaleStr = `${scaleVal}%`;
    localStorage.setItem('medden_font_scale', scaleStr);
    document.documentElement.style.setProperty('--app-font-scale', scaleStr);
    setSavedFeedback(true);
    setTimeout(() => setSavedFeedback(false), 1500);
  };

  // Global slab preferences stored in localStorage
  const [globalSlabSize, setGlobalSlabSize] = useState<'compact' | 'normal' | 'expanded'>(() => {
    return (localStorage.getItem('medden_global_slab_size') as any) || 'normal';
  });

  const [globalGridDensity, setGlobalGridDensity] = useState<'2' | '3' | '4'>(() => {
    return (localStorage.getItem('medden_grid_density') as any) || '3';
  });

  if (!isOpen) return null;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile(profileForm);
    setSavedFeedback(true);
    setTimeout(() => setSavedFeedback(false), 2000);
  };

  const handleSelectEdition = (editionId: DesignId) => {
    if (onSelectDesign) {
      onSelectDesign(editionId);
      setSavedFeedback(true);
      setTimeout(() => setSavedFeedback(false), 1500);
    }
  };

  const handleUpdateGlobalSlabSize = (sz: 'compact' | 'normal' | 'expanded') => {
    setGlobalSlabSize(sz);
    localStorage.setItem('medden_global_slab_size', sz);
  };

  const handleUpdateGridDensity = (density: '2' | '3' | '4') => {
    setGlobalGridDensity(density);
    localStorage.setItem('medden_grid_density', density);
  };

  const handleUpdateAccentTheme = (color: string) => {
    setAccentTheme(color);
    localStorage.setItem('medden_accent_theme', color);
    document.documentElement.style.setProperty('--app-accent-color', color);
    setSavedFeedback(true);
    setTimeout(() => setSavedFeedback(false), 1500);
  };

  const handleUpdateFocusTarget = (hrs: number, mins: number) => {
    const safeHrs = Math.max(0, Math.min(24, Math.floor(Number.isFinite(hrs) ? hrs : 0)));
    const safeMins = safeHrs === 24 ? 0 : Math.max(0, Math.min(59, Math.floor(Number.isFinite(mins) ? mins : 0)));
    setDailyHoursGoal(safeHrs);
    setDailyMinutesGoal(safeMins);
    setFocusTargetGoal(safeHrs, safeMins);
    setSavedFeedback(true);
    setTimeout(() => setSavedFeedback(false), 1500);
  };

  const handleUpdateDailyMcq = (q: number) => {
    const saved = setDailyMcqGoalValue(q);
    setDailyMcqGoal(saved);
    setDailyMcqDraft(String(saved));
    setMcqLogs(getPracticeLogs('mcq'));
    setSavedFeedback(true);
    setTimeout(() => setSavedFeedback(false), 1500);
  };

  const handleUpdateDailyImageQ = (q: number) => {
    const saved = setDailyImageQGoalValue(q);
    setDailyImageQGoal(saved);
    setDailyImageQDraft(String(saved));
    setImageQLogs(getPracticeLogs('image'));
    setSavedFeedback(true);
    setTimeout(() => setSavedFeedback(false), 1500);
  };

  const handleLogTodayMcq = (completed: number) => {
    const safe = Math.max(0, Math.min(5000, Math.round(completed) || 0));
    setTodayMcqDone(safe);
    logTodayPracticeCount('mcq', safe, dailyMcqGoal);
    setMcqLogs(getPracticeLogs('mcq'));
    setSavedFeedback(true);
    setTimeout(() => setSavedFeedback(false), 1500);
  };

  const handleLogTodayImageQ = (completed: number) => {
    const safe = Math.max(0, Math.min(5000, Math.round(completed) || 0));
    setTodayImageQDone(safe);
    logTodayPracticeCount('image', safe, dailyImageQGoal);
    setImageQLogs(getPracticeLogs('image'));
    setSavedFeedback(true);
    setTimeout(() => setSavedFeedback(false), 1500);
  };

  const modalContent = (
    <div className={isWorkspaceView ? "themed-workspace-surface w-full h-full flex flex-col overflow-hidden text-stone-900 dark:text-stone-100 bg-[#fbf9f4] dark:bg-[#110c09] transition-colors" : "themed-glass-card bg-[#fcfbf8] dark:bg-[#18110c] border border-stone-200/90 dark:border-[#382518] rounded-3xl shadow-2xl max-w-4xl w-full h-[88vh] flex flex-col overflow-hidden relative text-stone-900 dark:text-stone-100 transition-colors"}>
      
      {/* Header ribbon shown only in popup modal mode; Workspace view already displays Settings in the top panel */}
      {!isWorkspaceView && (
        <div
          className="themed-glass-bar px-6 py-3.5 border-b flex items-center justify-between shrink-0"
          style={{ borderColor: 'var(--th-border)' }}
        >
          <div className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center border"
              style={themeAccentSoftBadgeStyle}
            >
              <Settings className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xl font-bold font-serif flex items-center gap-2" style={{ color: 'var(--th-ink)' }}>
                <span>Settings</span>
                {savedFeedback && (
                  <span
                    className="text-[10px] font-mono px-2 py-0.5 rounded-full border animate-pulse"
                    style={themeAccentSoftBadgeStyle}
                  >
                    Saved
                  </span>
                )}
              </h3>
            </div>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-[#251a12] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      )}

        {/* Master-Detail Layout (Vertical Settings Sidebar on Mobile & Desktop matching Dashboard Sidebar) */}
        <div className="flex-1 flex flex-row overflow-hidden relative">
          {/* Mobile Drawer Backdrop when expanded vertical Settings Sidebar overlays content */}
          {isMobileSidebarOpen && (
            <div
              className="sm:hidden absolute inset-0 bg-black/50 backdrop-blur-[1px] z-20 animate-in fade-in duration-150"
              onClick={() => setIsMobileSidebarOpen(false)}
              aria-hidden="true"
            />
          )}

          {/* Collapsed Vertical Icon Rail on Mobile (<sm) matching minimized Dashboard Sidebar */}
          {!isMobileSidebarOpen && (
            <div
              className="sm:hidden w-11 py-1.5 px-1 flex flex-col items-center justify-between gap-1.5 shrink-0 z-10"
              style={{
                background: sb.railBg,
                borderRight: `1px solid ${sb.railBorder}`,
                color: sb.railText,
              }}
            >
              <div className="flex flex-col items-center gap-1 w-full">
                <button
                  type="button"
                  onClick={() => setIsMobileSidebarOpen(true)}
                  title="Expand Settings Menu"
                  aria-label="Expand Settings Menu"
                  style={settingsToggleBtnStyle}
                  className="raw-icon-btn w-8 h-8 flex items-center justify-center cursor-pointer transition-all hover:brightness-110"
                >
                  <ArrowRight className="w-3.5 h-3.5" style={{ color: sb.toggleBtnText }} />
                </button>
              </div>

              <div className="flex flex-col items-center gap-1 overflow-y-auto flex-1 w-full py-1 custom-scrollbar">
                {(
                  [
                    { id: 'profile', label: 'Profile', icon: User },
                    { id: 'designs', label: 'Themes', icon: Palette },
                    { id: 'wallpaper', label: 'Wallpaper', icon: ImageIcon },
                    { id: 'typography', label: 'Fonts', icon: Type },
                    { id: 'cloud-sync', label: 'Cloud', icon: Cloud },
                    { id: 'import-notes', label: 'Import Notes', icon: UploadCloud },
                    { id: 'sidebar-buttons', label: 'Sidebar', icon: SlidersHorizontal },
                    { id: 'customizer', label: 'Goals', icon: Sparkles },
                    { id: 'languages', label: 'Languages', icon: Globe },
                    { id: 'subscription', label: 'Plans', icon: Crown },
                    { id: 'defaults', label: 'Backup', icon: Download },
                  ] as Array<{ id: SettingsTabId; label: string; icon: React.ComponentType<any> }>
                ).map((tab) => {
                  const TabIcon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id)}
                      title={tab.label}
                      aria-label={tab.label}
                      style={getSettingsBtnStyle(isActive)}
                      className="raw-icon-btn w-8 h-8 flex items-center justify-center transition-all hover:brightness-110 cursor-pointer shrink-0"
                    >
                      <TabIcon
                        className="w-4 h-4 shrink-0"
                        style={{ color: isActive ? sb.activeIconColor : sb.idleIconColor }}
                      />
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Left Vertical Settings Sidebar (Slim Column matching Dashboard Sidebar) */}
          <div
            className={`p-1.5 flex-col justify-between gap-2 shrink-0 ${
              isMobileSidebarOpen
                ? 'flex absolute inset-y-0 left-0 z-30 w-[164px] shadow-2xl sm:static sm:w-[136px] sm:shadow-none animate-in slide-in-from-left-4 duration-150'
                : 'hidden sm:flex sm:w-[136px]'
            }`}
            style={{
              background: sb.railBg,
              borderRight: `1px solid ${sb.railBorder}`,
              color: sb.railText,
            }}
          >
            {/* Top Full-Width Arrow Action Matching Main Dashboard Sidebar (No "Back" label) */}
            <div className="pb-1.5 shrink-0" style={{ borderBottom: `1px solid ${sb.sectionBorder}` }}>
              {onClose && (
                <button
                  type="button"
                  onClick={onClose}
                  title="Return to Dashboard"
                  aria-label="Return to Dashboard"
                  style={settingsToggleBtnStyle}
                  className="raw-icon-btn hidden sm:flex w-full group items-center justify-center py-1 transition-all hover:brightness-110 active:scale-[0.97] cursor-pointer shadow-2xs"
                >
                  <ArrowLeft
                    className="w-3.5 h-3.5 stroke-[2.2] transition-transform duration-200 group-hover:-translate-x-1"
                    style={{ color: sb.toggleBtnText }}
                  />
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsMobileSidebarOpen(false)}
                title="Collapse Settings Sidebar"
                aria-label="Collapse Settings Sidebar"
                style={settingsToggleBtnStyle}
                className="raw-icon-btn sm:hidden w-full group flex items-center justify-center py-1 cursor-pointer transition-all hover:brightness-110"
              >
                <ArrowLeft
                  className="w-3.5 h-3.5 stroke-[2.2] transition-transform duration-200 group-hover:-translate-x-1"
                  style={{ color: sb.toggleBtnText }}
                />
              </button>
            </div>

            {/* Vertical Section Container styled identically to Dashboard Sidebar (.rounded-xl p-1 space-y-0.5) */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              <div
                className="rounded-xl p-1 space-y-0.5"
                style={{
                  background: sb.navSectionBg,
                  border: `1px solid ${sb.sectionBorder}`,
                }}
              >
                {(
                  [
                    { id: 'profile', label: 'Profile', icon: User },
                    { id: 'designs', label: 'Themes', icon: Palette },
                    { id: 'wallpaper', label: 'Wallpaper', icon: ImageIcon },
                    { id: 'typography', label: 'Fonts', icon: Type },
                    { id: 'cloud-sync', label: 'Cloud', icon: Cloud },
                    { id: 'import-notes', label: 'Import Notes', icon: UploadCloud },
                    { id: 'sidebar-buttons', label: 'Sidebar', icon: SlidersHorizontal },
                    { id: 'customizer', label: 'Goals', icon: Sparkles },
                    { id: 'languages', label: 'Languages', icon: Globe },
                    { id: 'subscription', label: 'Plans', icon: Crown },
                    { id: 'defaults', label: 'Backup', icon: Download },
                  ] as Array<{ id: SettingsTabId; label: string; icon: React.ComponentType<any> }>
                ).map((tab) => {
                  const TabIcon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => {
                        setActiveTab(tab.id);
                        setIsMobileSidebarOpen(false);
                      }}
                      style={getSettingsBtnStyle(isActive)}
                      className="raw-icon-btn w-full min-h-[34px] sm:min-h-[30px] h-auto flex items-center gap-1.5 px-1.5 py-1.5 text-[11.5px] sm:text-[11px] font-medium transition-all hover:brightness-110 cursor-pointer text-left"
                    >
                      <div className="w-3.5 h-3.5 flex items-center justify-center shrink-0">
                        <TabIcon
                          className="w-3.5 h-3.5 shrink-0"
                          style={{ color: isActive ? sb.activeIconColor : sb.idleIconColor }}
                        />
                      </div>
                      <span className="leading-tight break-words whitespace-normal flex-1 min-w-0">
                        {tab.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Detail Content Viewport */}
          <div className="p-3 sm:p-6 overflow-y-auto space-y-5 flex-1 min-w-0 custom-scrollbar">
            {/* Mobile Settings Bar to reopen full vertical Settings Sidebar anytime */}
            <div className="sm:hidden flex items-center justify-start gap-2 pb-2 border-b border-stone-200/80 dark:border-[#382518]">
              <button
                type="button"
                onClick={() => setIsMobileSidebarOpen((v) => !v)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-stone-200/75 dark:bg-[#241911] text-stone-800 dark:text-[#efe4d4] border border-stone-300/80 dark:border-[#3e291b] cursor-pointer"
              >
                <Menu className="w-3.5 h-3.5" />
                <span>Settings Menu</span>
              </button>
            </div>
          {/* ========================================================================= */}
          {/* TAB 1: THEMES (COMPACT MOBILE + LIGHT/DARK SCREENSHOT TOGGLE BESIDE APPLY)*/}
          {/* ========================================================================= */}
          {activeTab === 'designs' && (
            <div className="space-y-4 sm:space-y-6">
              <div className="space-y-3 sm:space-y-4">
                <div className="pb-2 border-b flex items-center justify-between gap-2" style={{ borderColor: 'var(--th-border)' }}>
                  <h4 className="text-base sm:text-lg font-bold flex items-center gap-2" style={{ color: 'var(--th-ink)' }}>
                    <Palette className="w-4 h-4" style={themeAccentIconStyle} />
                    <span>Themes</span>
                  </h4>
                  <span className="text-[10px] font-mono text-stone-500 dark:text-stone-400">
                    All 5 Editions · Light &amp; Dark Previews
                  </span>
                </div>
                <div className="grid grid-cols-1 gap-2.5 sm:gap-4">
                  {MASTER_EDITIONS.map((edition) => {
                    const isSelected = activeDesign === edition.id;
                    const pMode = themePreviewModes[edition.id] || 'light';

                    return (
                      <div
                        key={edition.id}
                        onClick={() => handleSelectEdition(edition.id)}
                        className={`p-2.5 sm:p-4 rounded-xl sm:rounded-2xl border transition-all cursor-pointer relative themed-glass-card ${
                          isSelected
                            ? 'shadow-md'
                            : 'hover:border-stone-300 dark:hover:border-[#4b3322]'
                        }`}
                        style={
                          isSelected
                            ? {
                                borderColor: 'var(--th-accent)',
                                backgroundColor: 'var(--th-accent-soft)',
                                boxShadow: '0 0 0 2px color-mix(in srgb, var(--th-accent) 26%, transparent)',
                              }
                            : undefined
                        }
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5 sm:mb-2">
                          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap min-w-0">
                            <span
                              className="inline-flex items-center justify-center w-5 h-5 rounded-full text-[11px] font-bold shrink-0"
                              style={themeAccentSoftBadgeStyle}
                            >
                              {edition.id}
                            </span>
                            <span className="text-xs sm:text-sm font-bold text-stone-900 dark:text-stone-100">
                              {edition.title}
                            </span>
                            <span className="text-[9px] sm:text-[10px] font-mono px-1.5 sm:px-2 py-0.5 rounded-full bg-stone-200/80 dark:bg-[#251a12] text-stone-700 dark:text-stone-300 font-semibold">
                              {edition.badge}
                            </span>
                          </div>

                          <div
                            className="flex items-center gap-1.5 sm:gap-2 shrink-0 ml-auto"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {/* Color Swatch Dots */}
                            <div className="hidden sm:flex items-center -space-x-1">
                              {edition.paletteColors.map((c, i) => (
                                <div
                                  key={i}
                                  className="w-3.5 h-3.5 rounded-full border border-white dark:border-[#110c09] shadow-2xs"
                                  style={{ backgroundColor: c }}
                                  title={c}
                                />
                              ))}
                            </div>

                            {/* Light / Dark Screenshot Preview Toggle beside Apply */}
                            <div className="flex items-center p-0.5 rounded-lg bg-stone-200/90 dark:bg-[#251a12] border border-stone-300/70 dark:border-[#382518]">
                              <button
                                type="button"
                                onClick={() =>
                                  setThemePreviewModes((prev) => ({ ...prev, [edition.id]: 'light' }))
                                }
                                title="View screenshots in Light mode"
                                className={`px-1.5 py-0.5 rounded-md text-[9.5px] font-bold flex items-center gap-1 cursor-pointer transition-colors ${
                                  pMode === 'light'
                                    ? 'bg-white text-stone-900 shadow-2xs'
                                    : 'text-stone-600 dark:text-stone-400'
                                }`}
                              >
                                <Sun className="w-2.5 h-2.5 text-amber-500" />
                                <span>Light</span>
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  setThemePreviewModes((prev) => ({ ...prev, [edition.id]: 'dark' }))
                                }
                                title="View screenshots in Dark mode"
                                className={`px-1.5 py-0.5 rounded-md text-[9.5px] font-bold flex items-center gap-1 cursor-pointer transition-colors ${
                                  pMode === 'dark'
                                    ? 'bg-amber-500 text-[#110c09] shadow-2xs'
                                    : 'text-stone-600 dark:text-stone-400'
                                }`}
                              >
                                <Moon className="w-2.5 h-2.5" />
                                <span>Dark</span>
                              </button>
                            </div>

                            {isSelected ? (
                              <div className="themed-accent-btn flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-lg bg-amber-700 text-white text-[11px] sm:text-xs font-bold shadow-2xs">
                                <Check className="w-3 h-3 stroke-[2.5]" />
                                <span>Active</span>
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleSelectEdition(edition.id)}
                                className="px-2.5 sm:px-3 py-1 rounded-lg bg-stone-200/80 dark:bg-[#251a12] text-stone-700 dark:text-stone-300 text-[11px] sm:text-xs font-semibold hover:bg-stone-300 dark:hover:bg-[#322318] transition-colors cursor-pointer"
                              >
                                Apply
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Section & Sidebar Screenshots Carousel */}
                        <ThemeAppStorePreviews
                          editionId={edition.id}
                          isSelected={isSelected}
                          previewMode={pMode}
                          onChangePreviewMode={(next) =>
                            setThemePreviewModes((prev) => ({ ...prev, [edition.id]: next }))
                          }
                          onApply={() => handleSelectEdition(edition.id)}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB: WALLPAPER STUDIO (CURATED BACKDROPS, CUSTOM IMAGE & OPACITY)         */}
          {/* ========================================================================= */}
          {activeTab === 'wallpaper' && (
            <div className="space-y-5">
              <div className="pb-2 border-b flex flex-wrap items-center justify-between gap-2" style={{ borderColor: 'var(--th-border)' }}>
                <h4 className="text-lg font-bold flex items-center gap-2" style={{ color: 'var(--th-ink)' }}>
                  <ImageIcon className="w-4 h-4" style={themeAccentIconStyle} />
                  <span>Workspace Wallpaper</span>
                </h4>
                {customWallpaper && (
                  <button
                    type="button"
                    onClick={() => applyCustomWallpaper('', 0.85)}
                    className="px-3 py-1 rounded-lg bg-stone-200 dark:bg-[#251a12] hover:bg-stone-300 dark:hover:bg-[#322318] text-xs font-semibold text-stone-800 dark:text-stone-200 cursor-pointer flex items-center gap-1"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reset to Theme Default</span>
                  </button>
                )}
              </div>

              {/* Upload Custom Wallpaper Image from Device */}
              <div className="p-4 rounded-2xl border border-stone-200 dark:border-[#382518] bg-white dark:bg-[#18110c] space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h5 className="text-sm font-bold text-stone-900 dark:text-stone-100">Custom Image Wallpaper</h5>
                    <p className="text-xs text-stone-500 dark:text-stone-400">
                      Upload any high-resolution photo from your device (resized cleanly for instant loading).
                    </p>
                  </div>
                  <label
                    className="themed-accent-btn px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold cursor-pointer flex items-center gap-1.5 shadow-sm"
                    style={{ background: sb.activeBtnBg, color: sb.activeBtnText }}
                  >
                    <UploadCloud className="w-4 h-4" />
                    <span>Upload Wallpaper</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleUploadWallpaperFile}
                      className="hidden"
                    />
                  </label>
                </div>

                <div className="pt-2 border-t border-stone-200/80 dark:border-[#2e1e13] flex items-center gap-3">
                  <span className="text-xs font-semibold text-stone-700 dark:text-stone-300 whitespace-nowrap">
                    Opacity: {Math.round(customWallpaperOpacity * 100)}%
                  </span>
                  <input
                    type="range"
                    min={15}
                    max={100}
                    value={Math.round(customWallpaperOpacity * 100)}
                    onChange={(e) =>
                      applyCustomWallpaper(customWallpaper, Math.max(0.15, Math.min(1, Number(e.target.value) / 100)))
                    }
                    className="flex-1 cursor-pointer"
                    style={{ accentColor: 'var(--th-accent)' }}
                  />
                </div>
              </div>

              {/* 20 Curated HD Photography Wallpapers (Landscape, Cosmic & Botanical) */}
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h5 className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                    20 HD Curated Wallpapers (Original Aspect · Zero Stretch)
                  </h5>
                  <button
                    type="button"
                    onClick={() => applyCustomWallpaper('', customWallpaperOpacity)}
                    className={`px-3 py-1 rounded-xl text-[11px] font-bold border transition-all cursor-pointer ${
                      customWallpaper === ''
                        ? 'themed-accent-btn'
                        : 'border-stone-200 dark:border-[#382518] text-stone-600 dark:text-stone-300'
                    }`}
                    style={customWallpaper === '' ? themeAccentSoftBadgeStyle : undefined}
                  >
                    Use Theme Default
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {[
                    {
                      id: 'wp-1',
                      title: 'Sunrise Mountains Mist',
                      desc: 'Golden mountain ridges at first light',
                      path: '/assets/aistudio/ahmetyuksek-sunrise-mountains-9821308_1920_result_fe248584.webp',
                    },
                    {
                      id: 'wp-2',
                      title: 'Artemis Moon & Earthrise',
                      desc: 'Orbital lunar horizon & Earth glow',
                      path: '/assets/aistudio/wallpaperswide.com-artemis-ii---moon-a-setting-earth-wallpaper-2560x1440_result_70398d70.webp',
                    },
                    {
                      id: 'wp-3',
                      title: 'Autumn Twilight Leaves',
                      desc: 'Deep amber foliage under dusk sky',
                      path: '/assets/aistudio/wallpaperswide.com-autumn-leaves-against-a-twilight-sky-wallpaper-2560x1440_result_4a72cf04.webp',
                    },
                    {
                      id: 'wp-4',
                      title: 'Midnight Stallion',
                      desc: 'Dramatic equestrian dark portrait',
                      path: '/assets/aistudio/wallpaperswide.com-black-horse-5-wallpaper-2560x1440_result_b109a16e.webp',
                    },
                    {
                      id: 'wp-5',
                      title: 'Milky Way Galactic Core',
                      desc: 'Crystal night sky starfields',
                      path: '/assets/aistudio/wallpaperswide.com-milky-way-galactic-core-across-the-night-sky-wallpaper-2560x1440_result_6dffa9c5.webp',
                    },
                    {
                      id: 'wp-6',
                      title: 'Coniferous Sun Rays',
                      desc: 'Warm forest road bathed in sunlight',
                      path: '/assets/aistudio/wallpaperswide.com-coniferous-forest-road-sun-rays-shines-through-trees-wallpaper-2560x1440_result_9e59136e.webp',
                    },
                    {
                      id: 'wp-7',
                      title: 'Brittany Sea Cliffs',
                      desc: 'Atlantic waves at Plougrescant coast',
                      path: '/assets/aistudio/wallpaperswide.com-le-gouffre-plougrescant-brittany-coast-wallpaper-2560x1440_result_b2864272.webp',
                    },
                    {
                      id: 'wp-8',
                      title: 'Aspen Autumn Avenue',
                      desc: 'Golden-leaf forest study sanctuary',
                      path: '/assets/aistudio/wallpaperswide.com-scenic-autumn-road-through-aspen-forest-wallpaper-2560x1440_result_85124750.webp',
                    },
                    {
                      id: 'wp-9',
                      title: 'Cathedral Valley Mesa',
                      desc: 'Utah sandstone peaks in soft desert sun',
                      path: '/assets/aistudio/wallpaperswide.com-cathedral-valley-capitol-reef-national-park-utah-us-wallpaper-2560x1440_result_59b95122.webp',
                    },
                    {
                      id: 'wp-10',
                      title: 'Alpine Serenity',
                      desc: 'Crisp high-altitude still horizon',
                      path: '/assets/aistudio/alena-ganzhela-_OLiar50J-A-unsplash_result_90183260.webp',
                    },
                    {
                      id: 'wp-11',
                      title: 'Coastal Horizon Calm',
                      desc: 'Balanced blue ocean & stone shore',
                      path: '/assets/aistudio/paul-carroll-pLD6UKygDCU-unsplash_result_7388935e.webp',
                    },
                    {
                      id: 'wp-12',
                      title: 'Warm Evening Peak',
                      desc: 'Quiet dusk light across high ridges',
                      path: '/assets/aistudio/kev-chan-KB9z4FsemnQ-unsplash_result_171fea34.webp',
                    },
                    {
                      id: 'wp-13',
                      title: 'Botanical Dew Shade',
                      desc: 'Deep natural green leaf close-up',
                      path: '/assets/aistudio/pexels-brenocardosofotografia-8240133_result_7894c6b8.webp',
                    },
                    {
                      id: 'wp-14',
                      title: 'Canyon Silence',
                      desc: 'Earth tones & warm mineral textures',
                      path: '/assets/aistudio/braden-egli-yHEKf0FkET4-unsplash_result_099169e8.webp',
                    },
                    {
                      id: 'wp-15',
                      title: 'Solitude Pass',
                      desc: 'Clean mountain silhouette vista',
                      path: '/assets/aistudio/daniel-stiel-FG1Ny76EO38-unsplash_result_2cd60d1b.webp',
                    },
                    {
                      id: 'wp-16',
                      title: 'Timber & Fog Valley',
                      desc: 'Low clouds gliding through pine hills',
                      path: '/assets/aistudio/victor-de-santiago-eW1YRNtb2No-unsplash_result_5138de46.webp',
                    },
                    {
                      id: 'wp-17',
                      title: 'Golden Meadow Breeze',
                      desc: 'Warm daylight over tranquil fields',
                      path: '/assets/aistudio/philipp-dusel-tEtVuxPBLNI-unsplash_result_bb8cf3f7.webp',
                    },
                    {
                      id: 'wp-18',
                      title: 'Highland Stillness',
                      desc: 'Atmospheric mist over slate cliffs',
                      path: '/assets/aistudio/kellen-riggin-GHyl3680YJs-unsplash_result_0db549ed.webp',
                    },
                    {
                      id: 'wp-19',
                      title: 'Terra Desert Glow',
                      desc: 'Rich burnt terracotta sunset dunes',
                      path: '/assets/aistudio/john-towner-JgOeRuGD_Y4-unsplash_result_6d8f7593.webp',
                    },
                    {
                      id: 'wp-20',
                      title: 'Emerald Woodland',
                      desc: 'Calm forest light for deep reading',
                      path: '/assets/aistudio/rebeca-trifan-dATa8H-S-NQ-unsplash_result_be2735e6.webp',
                    },
                  ].map((preset) => {
                    const uri = `url("${preset.path}")`;
                    const isSelected = customWallpaper === uri;
                    return (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => applyCustomWallpaper(uri, customWallpaperOpacity)}
                        className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col gap-2 themed-glass-card ${
                          isSelected ? 'shadow-sm' : ''
                        }`}
                        style={
                          isSelected
                            ? {
                                borderColor: 'var(--th-accent)',
                                backgroundColor: 'var(--th-accent-soft)',
                                boxShadow: '0 0 0 2px color-mix(in srgb, var(--th-accent) 26%, transparent)',
                              }
                            : undefined
                        }
                      >
                        <div className="h-24 w-full rounded-xl overflow-hidden border border-black/15 dark:border-white/10 shadow-inner bg-stone-900">
                          <img
                            src={preset.path}
                            alt={preset.title}
                            loading="lazy"
                            className="w-full h-full object-cover object-center"
                          />
                        </div>
                        <div className="flex items-center justify-between gap-2">
                          <div className="min-w-0">
                            <div className="text-xs font-bold text-stone-900 dark:text-stone-100 truncate">
                              {preset.title}
                            </div>
                            <div className="text-[10.5px] text-stone-500 dark:text-stone-400 truncate">
                              {preset.desc}
                            </div>
                          </div>
                          {isSelected && <CheckCircle2 className="w-4 h-4 shrink-0" style={themeAccentIconStyle} />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB: CLOUD & DRIVE (CONNECT ANY DRIVE WEBSITE, NO ENV SETTINGS BLOCK)    */}
          {/* ========================================================================= */}
          {activeTab === 'cloud-sync' && (
            <div className="space-y-5">
              <div className="pb-2 border-b" style={{ borderColor: 'var(--th-border)' }}>
                <h4 className="text-lg font-bold flex items-center gap-2" style={{ color: 'var(--th-ink)' }}>
                  <Cloud className="w-4 h-4" style={themeAccentIconStyle} />
                  <span>Cloud</span>
                </h4>
              </div>

              {driveOpError && (
                <div className="p-3 rounded-xl bg-[#7f1d1d]/12 dark:bg-[#6e171b]/30 border border-[#7f1d1d]/30 dark:border-[#962d32]/50 text-[#6e1418] dark:text-[#e49b9e] text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{driveOpError}</span>
                </div>
              )}

              {driveOpSuccess && (
                <div className="p-3 rounded-xl border text-xs flex items-start gap-2" style={themeAccentSoftBadgeStyle}>
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" style={themeAccentIconStyle} />
                  <span>{driveOpSuccess}</span>
                </div>
              )}

              {/* Card 1: Authenticated Account & Multi-Device Sync */}
              <div className="p-4 rounded-2xl bg-white dark:bg-[#1a120d] border border-stone-200 dark:border-[#382518] space-y-3">
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center border" style={themeAccentSoftBadgeStyle}>
                      <Database className="w-5 h-5" />
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-stone-900 dark:text-stone-100">
                        {user
                          ? user.email || user.phone || 'Authenticated Cloud Scholar'
                          : googleUser
                          ? googleUser.name
                            ? `${googleUser.name} (${googleUser.email})`
                            : googleUser.email
                          : phoneUser
                          ? `Mobile Scholar (${phoneUser.phone})`
                          : 'Not Signed In (Offline Browser Cache)'}
                      </h5>
                      {user && lastSyncedAt ? (
                        <p className="text-[11px] text-stone-500 dark:text-stone-400">
                          {`Last synced ${new Date(lastSyncedAt).toLocaleTimeString()}`}
                        </p>
                      ) : !(user || googleUser || phoneUser) ? (
                        <p className="text-[11px] text-stone-500 dark:text-stone-400">
                          Sign in with Email, Phone OTP, or Google to sync across devices.
                        </p>
                      ) : null}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {user || googleUser || phoneUser ? (
                      <>
                        {user && onSyncNow && (
                          <button
                            type="button"
                            onClick={handleManualSyncClick}
                            disabled={syncingManual}
                            className="themed-accent-btn px-3 py-1.5 rounded-xl bg-[#A47C43] hover:bg-[#8e6834] text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
                          >
                            <RefreshCw className={`w-3.5 h-3.5 ${syncingManual ? 'animate-spin' : ''}`} />
                            <span>{syncingManual ? 'Syncing...' : 'Sync Now'}</span>
                          </button>
                        )}
                      </>
                    ) : (
                      <button
                        type="button"
                        onClick={openAuthModal}
                        className="themed-accent-btn px-3.5 py-1.5 rounded-xl bg-amber-700 hover:bg-amber-800 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs cursor-pointer"
                      >
                        <LogIn className="w-3.5 h-3.5" />
                        <span>Sign In / Sign Up</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Card 2: Personal Google Drive OAuth PDF Vault */}
              <div className="p-4 rounded-2xl bg-white dark:bg-[#1a120d] border border-stone-200 dark:border-[#382518] space-y-3">
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center border" style={themeAccentSoftBadgeStyle}>
                      <HardDrive className="w-5 h-5" />
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                        <span>Personal Google Drive PDF Vault</span>
                        <span
                          className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                            driveAccount.connected
                              ? 'border'
                              : 'bg-stone-100 dark:bg-[#251a12] text-stone-500 dark:text-stone-400'
                          }`}
                          style={driveAccount.connected ? themeAccentSoftBadgeStyle : undefined}
                        >
                          {driveAccount.connected ? 'Connected' : 'Disconnected'}
                        </span>
                      </h5>
                      <p className="text-[11px] text-stone-500 dark:text-stone-400">
                        {driveAccount.connected
                          ? `Linked to ${driveAccount.email || 'your Google account'} · Folder: "${driveAccount.folderName || DRIVE_APP_FOLDER_NAME}"`
                          : 'Offload textbooks & large PDFs directly to your personal Google Drive.'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {driveAccount.connected ? (
                      <>
                        {driveAccount.folderId && (
                          <a
                            href={`https://drive.google.com/drive/folders/${driveAccount.folderId}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 rounded-xl bg-stone-100 dark:bg-[#251a12] hover:bg-stone-200 dark:hover:bg-[#322318] text-stone-700 dark:text-stone-200 text-xs font-semibold flex items-center gap-1.5"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            <span>Open Folder</span>
                          </a>
                        )}
                        <button
                          type="button"
                          onClick={disconnectGoogleDrive}
                          className="px-3 py-1.5 rounded-xl bg-[#7f1d1d]/12 hover:bg-[#7f1d1d]/20 dark:bg-[#6e171b]/30 text-[#6e1418] dark:text-[#d97074] border border-[#7f1d1d]/25 dark:border-[#962d32]/45 text-xs font-semibold cursor-pointer"
                        >
                          Disconnect
                        </button>
                      </>
                    ) : (
                      <button
                        type="button"
                        onClick={handleConnectDriveClick}
                        disabled={driveConnecting}
                        className="themed-accent-btn px-3.5 py-1.5 rounded-xl bg-amber-700 hover:bg-amber-800 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs cursor-pointer disabled:opacity-60"
                      >
                        <HardDrive className="w-3.5 h-3.5" />
                        <span>{driveConnecting ? 'Authorizing...' : 'Connect Google Drive'}</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Card 3: Connect Your Drive (Any Cloud Storage Website) */}
              <div className="p-4 rounded-2xl bg-white dark:bg-[#1a120d] border border-stone-200 dark:border-[#382518] space-y-4">
                <div>
                  <h5 className="text-xs font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                    <Link2 className="w-4 h-4" style={themeAccentIconStyle} />
                    <span>Connect Your Drive</span>
                  </h5>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
                    Link OneDrive, Dropbox, iCloud Drive, Box, pCloud, or any cloud storage website to access your study files.
                  </p>
                </div>

                {/* Quick Cloud Providers */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    { id: 'gdrive-web', name: 'Google Drive Web', defaultUrl: 'https://drive.google.com' },
                    { id: 'onedrive', name: 'Microsoft OneDrive', defaultUrl: 'https://onedrive.live.com' },
                    { id: 'dropbox', name: 'Dropbox', defaultUrl: 'https://www.dropbox.com/home' },
                    { id: 'icloud', name: 'iCloud Drive', defaultUrl: 'https://www.icloud.com/iclouddrive' },
                    { id: 'box', name: 'Box Cloud', defaultUrl: 'https://app.box.com' },
                    { id: 'pcloud', name: 'pCloud', defaultUrl: 'https://my.pcloud.com' },
                  ].map((provider) => {
                    const isLinked = connectedDrives.some((d) => d.id === provider.id);
                    return (
                      <div
                        key={provider.id}
                        className="p-2.5 rounded-xl border flex flex-col justify-between gap-2 themed-glass-card"
                        style={
                          isLinked
                            ? {
                                borderColor: 'var(--th-accent)',
                                backgroundColor: 'var(--th-accent-soft)',
                              }
                            : undefined
                        }
                      >
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-xs font-bold text-stone-800 dark:text-stone-100 truncate">
                            {provider.name}
                          </span>
                          {isLinked && <Check className="w-3.5 h-3.5 shrink-0" style={themeAccentIconStyle} />}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleTogglePresetDrive(provider)}
                            className={`flex-1 py-1 px-2 rounded-lg text-[10.5px] font-bold cursor-pointer transition-colors ${
                              isLinked
                                ? 'bg-stone-200 dark:bg-[#2a1d14] text-stone-700 dark:text-stone-300'
                                : 'themed-accent-btn bg-amber-700 hover:bg-amber-800 text-white'
                            }`}
                          >
                            {isLinked ? 'Disconnect' : 'Connect'}
                          </button>
                          {isLinked && (
                            <a
                              href={provider.defaultUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              title={`Open ${provider.name}`}
                              className="p-1.5 rounded-lg bg-stone-100 dark:bg-[#251a12] hover:bg-stone-200 text-stone-700 dark:text-stone-200"
                            >
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Connect Any Custom Drive Website URL */}
                <form
                  onSubmit={handleAddCustomDrive}
                  className="p-3 rounded-xl bg-stone-50 dark:bg-[#140e0a] border border-stone-200/80 dark:border-[#352317] space-y-2.5"
                >
                  <div className="text-[11px] font-bold text-stone-700 dark:text-stone-300">
                    Connect Any Other Drive / Cloud Website
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <input
                      type="text"
                      placeholder="Drive name (e.g. Nextcloud / Mega)"
                      value={customDriveName}
                      onChange={(e) => setCustomDriveName(e.target.value)}
                      className="px-3 py-1.5 rounded-lg border border-stone-200 dark:border-[#382518] bg-white dark:bg-[#1a120d] text-xs outline-none focus:border-amber-500"
                    />
                    <input
                      type="text"
                      required
                      placeholder="Drive website URL (e.g. https://mega.nz)"
                      value={customDriveUrl}
                      onChange={(e) => setCustomDriveUrl(e.target.value)}
                      className="px-3 py-1.5 rounded-lg border border-stone-200 dark:border-[#382518] bg-white dark:bg-[#1a120d] text-xs outline-none focus:border-amber-500"
                    />
                    <input
                      type="text"
                      placeholder="Account email / handle (optional)"
                      value={customDriveAccount}
                      onChange={(e) => setCustomDriveAccount(e.target.value)}
                      className="px-3 py-1.5 rounded-lg border border-stone-200 dark:border-[#382518] bg-white dark:bg-[#1a120d] text-xs outline-none focus:border-amber-500"
                    />
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="themed-accent-btn px-3.5 py-1.5 rounded-xl bg-amber-700 hover:bg-amber-800 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Connect Drive Website</span>
                    </button>
                  </div>
                </form>

                {/* List of Linked Drives */}
                {connectedDrives.length > 0 && (
                  <div className="space-y-1.5">
                    <div className="text-[10.5px] font-mono font-bold uppercase text-stone-500 dark:text-stone-400">
                      Connected Drives ({connectedDrives.length})
                    </div>
                    {connectedDrives.map((drv) => (
                      <div
                        key={drv.id}
                        className="p-2.5 rounded-xl bg-stone-50 dark:bg-[#140e0a] border border-stone-200 dark:border-[#352317] flex items-center justify-between gap-2 text-xs"
                      >
                        <div className="min-w-0">
                          <div className="font-bold text-stone-900 dark:text-stone-100 truncate">
                            {drv.name} {drv.accountHint ? `(${drv.accountHint})` : ''}
                          </div>
                          <div className="text-[10.5px] text-stone-500 dark:text-stone-400 truncate font-mono">
                            {drv.url}
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <a
                            href={drv.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-2.5 py-1 rounded-lg bg-stone-200/80 dark:bg-[#251a12] hover:bg-stone-300 text-stone-800 dark:text-stone-200 text-[11px] font-semibold flex items-center gap-1"
                          >
                            <ExternalLink className="w-3 h-3" />
                            <span>Open</span>
                          </a>
                          <button
                            type="button"
                            onClick={() => persistConnectedDrives(connectedDrives.filter((d) => d.id !== drv.id))}
                            className="p-1.5 rounded-lg text-stone-400 hover:text-[#7f1d1d] dark:hover:text-[#d97074] cursor-pointer"
                            title="Remove Drive"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB: 15 CURATED FONTS (6 HANDWRITING) & LIVE SIZING SPECTRUM              */}
          {/* ========================================================================= */}
          {activeTab === 'typography' && (
            <div className="space-y-6">
              <div className="pb-2 border-b" style={{ borderColor: 'var(--th-border)' }}>
                <h4 className="text-lg font-bold flex items-center gap-2" style={{ color: 'var(--th-ink)' }}>
                  <Type className="w-4 h-4" style={themeAccentIconStyle} />
                  <span>Fonts</span>
                </h4>
              </div>

              {/* Font Size Spectrum Slider */}
              <div className="p-4 rounded-xl bg-stone-50 dark:bg-[#18110c] border border-stone-200/80 dark:border-[#382518] space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-stone-800 dark:text-stone-200 flex items-center gap-1.5">
                    <span>Font Size Spectrum:</span>
                    <span className="font-mono font-black" style={themeAccentIconStyle}>{fontScale}%</span>
                    <span className="text-stone-400 font-normal">({Math.round(15 * (fontScale / 100))}px baseline)</span>
                  </span>
                </div>

                <input
                  type="range"
                  min="80"
                  max="135"
                  step="5"
                  value={fontScale}
                  onChange={(e) => handleUpdateFontScale(parseInt(e.target.value, 10))}
                  className="w-full cursor-pointer h-2 bg-stone-200 dark:bg-[#251a12] rounded-lg"
                  style={{ accentColor: 'var(--th-accent)' }}
                />

                {/* Preset spectrum quick buttons */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1">
                  {[
                    { label: 'Compact', val: 85 },
                    { label: 'Standard', val: 100 },
                    { label: 'Comfort', val: 110 },
                    { label: 'Expanded', val: 120 },
                    { label: 'Clinical Display', val: 130 },
                  ].map((pst) => (
                    <button
                      key={pst.val}
                      type="button"
                      onClick={() => handleUpdateFontScale(pst.val)}
                      className={`py-1.5 px-2 rounded-lg text-xs font-semibold border transition-all ${
                        fontScale === pst.val
                          ? 'themed-accent-btn bg-amber-700 text-white border-amber-700 shadow-xs'
                          : 'themed-glass-card bg-white dark:bg-[#140e0a] text-stone-700 dark:text-stone-300 border-stone-200 dark:border-[#382518] hover:border-amber-500'
                      }`}
                    >
                      {pst.label} ({pst.val}%)
                    </button>
                  ))}
                </div>
              </div>

              {/* Category Filter Pills & Counter */}
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="text-xs font-semibold text-stone-600 dark:text-stone-400">
                    Filter by Style & Function:
                  </div>
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                    {[
                      { key: 'all', label: `All (${APP_FONTS.length})`, count: APP_FONTS.length },
                      { key: 'handwriting', label: `Handwriting (${APP_FONTS.filter(f => f.fontType === 'handwriting').length})`, count: APP_FONTS.filter(f => f.fontType === 'handwriting').length },
                      { key: 'casual', label: `Casual (${APP_FONTS.filter(f => f.fontType === 'casual').length})`, count: APP_FONTS.filter(f => f.fontType === 'casual').length },
                      { key: 'official', label: `Official (${APP_FONTS.filter(f => f.fontType === 'official').length})`, count: APP_FONTS.filter(f => f.fontType === 'official').length },
                    ].map((btn) => (
                      <button
                        key={btn.key}
                        type="button"
                        onClick={() => setFontCategoryFilter(btn.key as any)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all shrink-0 ${
                          fontCategoryFilter === btn.key
                            ? 'themed-accent-btn bg-amber-700 text-white shadow-xs'
                            : 'themed-glass-card bg-stone-100 dark:bg-[#1a120d] text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-[#251a12]'
                        }`}
                      >
                        {btn.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Grouped Individual Category Font Sections (Handwriting · Casual · Official) */}
                <div className="space-y-6">
                  {(
                    [
                      {
                        key: 'handwriting',
                        title: 'Handwriting',
                        subtitle: 'Expressive cursive, brush, and studio notebook lettering',
                      },
                      {
                        key: 'casual',
                        title: 'Casual',
                        subtitle: 'Clean geometric, rounded, humanist, and monospace clarity',
                      },
                      {
                        key: 'official',
                        title: 'Official',
                        subtitle: 'Academic, classical serif, and distinguished journal typography',
                      },
                    ] as const
                  )
                    .filter((group) => fontCategoryFilter === 'all' || fontCategoryFilter === group.key)
                    .map((group) => {
                      const groupFonts = APP_FONTS.filter((f) => f.fontType === group.key);
                      if (groupFonts.length === 0) return null;
                      return (
                        <section key={group.key} className="space-y-3">
                          <div className="flex items-center justify-between gap-2 pb-1.5 border-b border-stone-200/80 dark:border-[#382518]">
                            <div>
                              <h5 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                                {group.title}
                              </h5>
                              <p className="text-[11px] text-stone-500 dark:text-stone-400">
                                {group.subtitle}
                              </p>
                            </div>
                            <span
                              className="text-[10.5px] font-mono font-bold px-2.5 py-0.5 rounded-full border shrink-0"
                              style={themeAccentSoftBadgeStyle}
                            >
                              {groupFonts.length} Fonts
                            </span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                            {groupFonts.map((font) => {
                              const isSelected = currentFont === font.name;
                              const isHandwriting = font.fontType === 'handwriting';
                              return (
                                <div
                                  key={font.id}
                                  onClick={() => handleSelectFont(font)}
                                  className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between group themed-glass-card ${
                                    isSelected ? 'shadow-xs' : ''
                                  }`}
                                  style={
                                    isSelected
                                      ? {
                                          borderColor: 'var(--th-accent)',
                                          backgroundColor: 'var(--th-accent-soft)',
                                          boxShadow: '0 0 0 2px color-mix(in srgb, var(--th-accent) 26%, transparent)',
                                        }
                                      : undefined
                                  }
                                >
                                  <div className="space-y-1">
                                    <div className="flex items-center justify-between gap-2">
                                      <span className="font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1.5 min-w-0">
                                        <span
                                          data-font-sample=""
                                          className="truncate"
                                          style={
                                            {
                                              fontFamily: font.cssFamily,
                                              '--sample-font': font.cssFamily,
                                              fontSize: isHandwriting ? '1.22rem' : '1.04rem',
                                              fontStyle: 'normal',
                                            } as React.CSSProperties
                                          }
                                        >
                                          {font.name}
                                        </span>
                                        {isSelected && <Check className="w-3.5 h-3.5 shrink-0" style={themeAccentIconStyle} />}
                                      </span>
                                      <span className="text-[9.5px] font-mono px-1.5 py-0.5 rounded bg-stone-100 dark:bg-[#251a12] text-stone-600 dark:text-stone-300 shrink-0">
                                        {font.category}
                                      </span>
                                    </div>
                                  </div>

                                  {/* Live Font Sample */}
                                  <div
                                    data-font-sample=""
                                    className="mt-2.5 p-3 rounded-lg border text-stone-900 dark:text-stone-100 transition-colors bg-stone-50/75 dark:bg-[#120c08] border-stone-200/70 dark:border-[#352317]"
                                    style={
                                      {
                                        fontFamily: font.cssFamily,
                                        '--sample-font': font.cssFamily,
                                        fontStyle: 'normal',
                                      } as React.CSSProperties
                                    }
                                  >
                                    <div className={`font-semibold leading-snug ${isHandwriting ? 'text-base sm:text-lg' : 'text-sm'}`}>
                                      {font.sample}
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </section>
                      );
                    })}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB: INDIAN (15) & WORLD (15) LANGUAGES + ADD MORE LANGUAGE BUILDER       */}
          {/* ========================================================================= */}
          {activeTab === 'languages' && (() => {
            const q = langSearchQuery.trim().toLowerCase();
            const matchLang = (l: { label: string; nativeLabel: string; code: string }) =>
              !q ||
              l.label.toLowerCase().includes(q) ||
              l.nativeLabel.toLowerCase().includes(q) ||
              l.code.toLowerCase().includes(q);

            const allLangsNow = getAllAvailableLanguages();
            const customIndian = customLanguages.filter((l) => l.region === 'indian').filter(matchLang);
            const customWorld = customLanguages.filter((l) => l.region !== 'indian').filter(matchLang);
            const filteredIndian = [...customIndian, ...INDIAN_LANGUAGES.filter(matchLang)];
            const filteredWorld = [...customWorld, ...WORLD_LANGUAGES.filter(matchLang)];

            const renderLangCard = (lang: (typeof allLangsNow)[number], removable = false) => {
              const isSelected = selectedLang === lang.code;
              return (
                <div
                  key={lang.code}
                  onClick={() => handleLanguageSelect(lang.code)}
                  className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all relative themed-glass-card ${
                    isSelected ? 'shadow-xs' : ''
                  }`}
                  style={
                    isSelected
                      ? {
                          borderColor: 'var(--th-accent)',
                          backgroundColor: 'var(--th-accent-soft)',
                          boxShadow: '0 0 0 2px color-mix(in srgb, var(--th-accent) 26%, transparent)',
                        }
                      : undefined
                  }
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="text-lg shrink-0">{lang.flag}</span>
                      <div className="min-w-0">
                        <span className="font-bold text-sm text-stone-900 dark:text-stone-100 block truncate">
                          {lang.nativeLabel}
                        </span>
                        <span className="text-[11px] text-stone-500 dark:text-stone-400 block truncate">
                          {lang.label}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      {isSelected && <Check className="w-4 h-4 stroke-[3]" style={themeAccentIconStyle} />}
                      {removable && (
                        <button
                          type="button"
                          onClick={(e) => handleDeleteCustomLanguage(lang.code, e)}
                          title="Remove custom language"
                          className="p-1 rounded-lg text-stone-400 hover:text-[#7f1d1d] dark:hover:text-[#d97074] hover:bg-stone-100 dark:hover:bg-[#251a12] cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="mt-2.5 p-2 rounded-lg bg-stone-50 dark:bg-[#120c08] border border-stone-200/60 dark:border-[#352317] text-xs text-stone-700 dark:text-stone-300">
                    <p className="italic font-medium leading-relaxed truncate">"{lang.greeting}"</p>
                  </div>
                </div>
              );
            };

            return (
              <div className="space-y-5">
                <div className="pb-2 border-b" style={{ borderColor: 'var(--th-border)' }}>
                  <h4 className="text-lg font-bold flex items-center gap-2" style={{ color: 'var(--th-ink)' }}>
                    <Globe className="w-4 h-4" style={themeAccentIconStyle} />
                    <span>Languages</span>
                  </h4>
                </div>

                {/* Indian & World Region Buttons */}
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setLangRegionFilter('indian');
                      setNewLangRegion('indian');
                    }}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      langRegionFilter === 'indian'
                        ? 'themed-accent-btn bg-[#5c351c] text-white border-[#5c351c] dark:bg-[#a47c43] dark:text-white dark:border-[#a47c43] shadow-xs'
                        : 'bg-white dark:bg-[#1a120d] text-stone-700 dark:text-stone-300 border-stone-200 dark:border-[#382518] hover:border-[#A47C43]'
                    }`}
                  >
                    Indian
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setLangRegionFilter('world');
                      setNewLangRegion('world');
                    }}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      langRegionFilter === 'world'
                        ? 'themed-accent-btn bg-[#5c351c] text-white border-[#5c351c] dark:bg-[#a47c43] dark:text-white dark:border-[#a47c43] shadow-xs'
                        : 'bg-white dark:bg-[#1a120d] text-stone-700 dark:text-stone-300 border-stone-200 dark:border-[#382518] hover:border-[#A47C43]'
                    }`}
                  >
                    World
                  </button>
                </div>

                {/* Search + Add More Language Bar */}
                <div className="flex flex-col sm:flex-row gap-2.5">
                  <div className="relative flex-1">
                    <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      value={langSearchQuery}
                      onChange={(e) => setLangSearchQuery(e.target.value)}
                      placeholder={langRegionFilter === 'indian' ? 'Search Indian languages...' : 'Search World languages...'}
                      className="w-full pl-8 pr-3 py-2 rounded-xl border border-stone-200 dark:border-[#382518] bg-white dark:bg-[#140e0a] text-xs text-stone-900 dark:text-stone-100 outline-none focus:border-amber-500"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setNewLangRegion(langRegionFilter);
                      setShowAddLangBuilder((v) => !v);
                    }}
                    className="themed-accent-btn px-3.5 py-2 rounded-xl bg-[#A47C43] hover:bg-[#8e6834] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add More Language</span>
                  </button>
                </div>

                {/* Custom Language Builder Panel */}
                {showAddLangBuilder && (
                  <form
                    onSubmit={handleAddCustomLanguage}
                    className="p-4 rounded-2xl border border-amber-500/40 bg-amber-50/40 dark:bg-[#1a120d] space-y-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-xs font-bold text-stone-900 dark:text-stone-100">
                        Create &amp; Save Custom Language
                      </span>
                      <div className="flex items-center gap-2">
                        <div className="inline-flex rounded-lg border border-stone-200 dark:border-[#382518] bg-white dark:bg-[#120c08] p-0.5 text-[11px]">
                          <button
                            type="button"
                            onClick={() => setNewLangRegion('indian')}
                            className={`px-2.5 py-0.5 rounded-md font-semibold cursor-pointer transition-colors ${
                              newLangRegion === 'indian'
                                ? 'bg-[#5c351c] text-white dark:bg-[#a47c43]'
                                : 'text-stone-600 dark:text-stone-400'
                            }`}
                          >
                            Indian List
                          </button>
                          <button
                            type="button"
                            onClick={() => setNewLangRegion('world')}
                            className={`px-2.5 py-0.5 rounded-md font-semibold cursor-pointer transition-colors ${
                              newLangRegion === 'world'
                                ? 'bg-[#5c351c] text-white dark:bg-[#a47c43]'
                                : 'text-stone-600 dark:text-stone-400'
                            }`}
                          >
                            World List
                          </button>
                        </div>
                        <button
                          type="button"
                          onClick={() => setShowAddLangBuilder(false)}
                          className="text-xs text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
                      <input
                        type="text"
                        required
                        placeholder="Language name (e.g. Nepali)"
                        value={newLangName}
                        onChange={(e) => setNewLangName(e.target.value)}
                        className="sm:col-span-2 px-3 py-1.5 rounded-xl border border-stone-200 dark:border-[#382518] bg-white dark:bg-[#120c08] text-xs outline-none focus:border-amber-500"
                      />
                      <input
                        type="text"
                        placeholder="Native script (e.g. नेपाली)"
                        value={newLangNative}
                        onChange={(e) => setNewLangNative(e.target.value)}
                        className="px-3 py-1.5 rounded-xl border border-stone-200 dark:border-[#382518] bg-white dark:bg-[#120c08] text-xs outline-none focus:border-amber-500"
                      />
                      <input
                        type="text"
                        placeholder="Flag (e.g. 🇳🇵)"
                        value={newLangFlag}
                        onChange={(e) => setNewLangFlag(e.target.value)}
                        className="px-3 py-1.5 rounded-xl border border-stone-200 dark:border-[#382518] bg-white dark:bg-[#120c08] text-xs outline-none focus:border-amber-500"
                      />
                    </div>
                    <input
                      type="text"
                      placeholder="Greeting preview sentence..."
                      value={newLangGreeting}
                      onChange={(e) => setNewLangGreeting(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-xl border border-stone-200 dark:border-[#382518] bg-white dark:bg-[#120c08] text-xs outline-none focus:border-amber-500"
                    />
                    <div className="pt-1">
                      <div className="text-[11px] font-semibold text-stone-600 dark:text-stone-400 mb-1.5">
                        Optional Custom Sidebar Labels:
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                        <input
                          type="text"
                          placeholder="Cockpit"
                          value={newLangNavMySpace}
                          onChange={(e) => setNewLangNavMySpace(e.target.value)}
                          className="px-2.5 py-1.5 rounded-lg border border-stone-200 dark:border-[#382518] bg-white dark:bg-[#120c08] text-[11px] outline-none focus:border-amber-500"
                        />
                        <input
                          type="text"
                          placeholder="Read"
                          value={newLangNavRead}
                          onChange={(e) => setNewLangNavRead(e.target.value)}
                          className="px-2.5 py-1.5 rounded-lg border border-stone-200 dark:border-[#382518] bg-white dark:bg-[#120c08] text-[11px] outline-none focus:border-amber-500"
                        />
                        <input
                          type="text"
                          placeholder="Create note"
                          value={newLangNavCreateNote}
                          onChange={(e) => setNewLangNavCreateNote(e.target.value)}
                          className="px-2.5 py-1.5 rounded-lg border border-stone-200 dark:border-[#382518] bg-white dark:bg-[#120c08] text-[11px] outline-none focus:border-amber-500"
                        />
                        <input
                          type="text"
                          placeholder="Calendar"
                          value={newLangNavCalendar}
                          onChange={(e) => setNewLangNavCalendar(e.target.value)}
                          className="px-2.5 py-1.5 rounded-lg border border-stone-200 dark:border-[#382518] bg-white dark:bg-[#120c08] text-[11px] outline-none focus:border-amber-500"
                        />
                        <input
                          type="text"
                          placeholder="Shelf"
                          value={newLangNavShelf}
                          onChange={(e) => setNewLangNavShelf(e.target.value)}
                          className="px-2.5 py-1.5 rounded-lg border border-stone-200 dark:border-[#382518] bg-white dark:bg-[#120c08] text-[11px] outline-none focus:border-amber-500"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="themed-accent-btn px-4 py-1.5 rounded-xl bg-amber-700 hover:bg-amber-800 text-white text-xs font-bold cursor-pointer"
                      >
                        Save &amp; Activate Language
                      </button>
                    </div>
                  </form>
                )}

                {/* Indian Languages List (Strict) */}
                {langRegionFilter === 'indian' && (
                  <div className="space-y-2.5">
                    <h5 className="text-xs font-bold uppercase tracking-wider font-mono text-stone-600 dark:text-stone-400">
                      Indian ({filteredIndian.length})
                    </h5>
                    {filteredIndian.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {filteredIndian.map((lang) => renderLangCard(lang, Boolean(lang.isCustom)))}
                      </div>
                    ) : (
                      <div className="text-xs text-stone-500 dark:text-stone-400 py-4">
                        No matching Indian languages found.
                      </div>
                    )}
                  </div>
                )}

                {/* World Languages List (Strict) */}
                {langRegionFilter === 'world' && (
                  <div className="space-y-2.5">
                    <h5 className="text-xs font-bold uppercase tracking-wider font-mono text-stone-600 dark:text-stone-400">
                      World ({filteredWorld.length})
                    </h5>
                    {filteredWorld.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {filteredWorld.map((lang) => renderLangCard(lang, Boolean(lang.isCustom)))}
                      </div>
                    ) : (
                      <div className="text-xs text-stone-500 dark:text-stone-400 py-4">
                        No matching World languages found.
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })()}

          {/* ========================================================================= */}
          {/* TAB: IMPORT NOTES FROM OTHER APPS                                         */}
          {/* ========================================================================= */}
          {activeTab === 'import-notes' && (
            <div className="space-y-6">
              <div className="pb-2 border-b" style={{ borderColor: 'var(--th-border)' }}>
                <h4 className="text-lg font-bold flex items-center gap-2" style={{ color: 'var(--th-ink)' }}>
                  <UploadCloud className="w-4 h-4" style={themeAccentIconStyle} />
                  <span>Import Notes</span>
                </h4>
              </div>

              {importStatus && (
                <div className="p-3.5 rounded-xl border text-xs font-semibold flex items-center gap-2" style={themeAccentSoftBadgeStyle}>
                  <Sparkles className="w-4 h-4 animate-spin" style={themeAccentIconStyle} />
                  <span>{importStatus}</span>
                </div>
              )}

              {/* Supported Apps Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {[
                  { name: 'Notion', format: '.md, .zip, HTML', desc: 'Pages, clinical tables, toggle lists & multi-column boards', color: '#000000', badge: 'Full Markdown' },
                  { name: 'Obsidian', format: '.md Vault folders', desc: 'Bidirectional links, frontmatter tags & canvas graphs', color: '#7c3aed', badge: 'Vault Sync' },
                  { name: 'Apple Notes', format: '.txt, PDF, iCloud', desc: 'Handwritten Apple Pencil sketches, checklists & text', color: '#f59e0b', badge: 'iOS Native' },
                  { name: 'GoodNotes / Notability', format: '.pdf, .goodnotes', desc: 'Digital ink annotations, margin notes & anatomical slides', color: '#0284c7', badge: 'Vector Ink' },
                  { name: 'Google Keep', format: 'Takeout .json, .txt', desc: 'Quick ward memos, clinical pearls & audio transcripts', color: '#eab308', badge: 'Google Sync' },
                  { name: 'OneNote / Word', format: '.docx, .pdf', desc: 'Clinical rotation handouts, journal clubs & syllabi', color: '#2563eb', badge: 'Office 365' },
                ].map((app) => (
                  <div
                    key={app.name}
                    className="p-4 rounded-xl border border-stone-200 dark:border-[#382518] bg-white dark:bg-[#18110c] flex flex-col justify-between space-y-3"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="font-bold text-xs text-stone-900 dark:text-stone-100">
                          {app.name}
                        </span>
                        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-stone-100 dark:bg-[#251a12] text-stone-600 dark:text-stone-300 font-semibold">
                          {app.badge}
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-500 dark:text-stone-400">
                        {app.desc}
                      </p>
                      <span className="text-[10px] font-mono text-stone-400 dark:text-stone-500 block mt-1">
                        Accepted: {app.format}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleImportNotesFromApp(app.name)}
                      className="w-full py-1.5 px-3 rounded-lg text-xs font-semibold bg-stone-100 hover:bg-stone-200 dark:bg-[#251a12] dark:hover:bg-[#322318] text-stone-800 dark:text-stone-200 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5 text-stone-600 dark:text-stone-400" />
                      <span>Import from {app.name}</span>
                    </button>
                  </div>
                ))}
              </div>

              {/* Upload Drop Zone */}
              <div className="p-6 rounded-2xl border-2 border-dashed border-stone-300 dark:border-[#4b3322] text-center bg-stone-50/50 dark:bg-[#160f0b] space-y-2">
                <UploadCloud className="w-8 h-8 text-stone-400 mx-auto" />
                <h5 className="text-xs font-bold text-stone-800 dark:text-stone-200">
                  Drag and drop your exported notes, markdown files or archives here
                </h5>
                <p className="text-[11px] text-stone-500 dark:text-stone-400">
                  Supports .zip, .md, .pdf, .json, and .html up to 50MB
                </p>
                <label className="inline-block px-4 py-2 bg-stone-800 hover:bg-stone-900 dark:bg-stone-200 dark:hover:bg-white text-white dark:text-stone-900 rounded-xl text-xs font-semibold cursor-pointer transition-colors shadow-xs">
                  <span>Browse Local Files</span>
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        handleImportNotesFromApp(e.target.files[0].name.replace(/\.[^/.]+$/, ''));
                      }
                    }}
                  />
                </label>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB: SIDEBAR BUTTONS CUSTOMIZER                                           */}
          {/* ========================================================================= */}
          {activeTab === 'sidebar-buttons' && (
            <div className="space-y-4">
              <div className="pb-2 border-b" style={{ borderColor: 'var(--th-border)' }}>
                <h4 className="text-lg font-bold flex items-center gap-2" style={{ color: 'var(--th-ink)' }}>
                  <SlidersHorizontal className="w-4 h-4" style={themeAccentIconStyle} />
                  <span>Sidebar</span>
                </h4>
              </div>

              <div className="max-w-xs w-full p-2.5 rounded-2xl bg-stone-50 dark:bg-[#18110c] border border-stone-200 dark:border-[#382518] divide-y divide-stone-200 dark:divide-[#382518]">
                {[...ALL_SIDEBAR_BUTTON_ITEMS]
                  .sort((a, b) => {
                    const idxA = sidebarOrder.indexOf(a.id);
                    const idxB = sidebarOrder.indexOf(b.id);
                    return (idxA === -1 ? 99 : idxA) - (idxB === -1 ? 99 : idxB);
                  })
                  .map((item, idx, arr) => (
                    <div key={item.key} className="py-1.5 px-1 flex items-center justify-between gap-2 first:pt-0 last:pb-0">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <div className="flex items-center gap-0.5 shrink-0">
                          <button
                            type="button"
                            onClick={() => handleShiftSidebarItem(item.id, -1)}
                            disabled={idx === 0}
                            title="Move segment Up in Sidebar"
                            className="p-0.5 rounded hover:bg-stone-200 dark:hover:bg-[#251a12] disabled:opacity-30 disabled:pointer-events-none text-stone-600 dark:text-stone-300 transition-colors cursor-pointer"
                          >
                            <ArrowUp className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleShiftSidebarItem(item.id, 1)}
                            disabled={idx === arr.length - 1}
                            title="Move segment Down in Sidebar"
                            className="p-0.5 rounded hover:bg-stone-200 dark:hover:bg-[#251a12] disabled:opacity-30 disabled:pointer-events-none text-stone-600 dark:text-stone-300 transition-colors cursor-pointer"
                          >
                            <ArrowDown className="w-3 h-3" />
                          </button>
                        </div>
                        <span className="font-bold text-xs text-stone-900 dark:text-stone-100 truncate">
                          {item.label}
                        </span>
                      </div>

                      <label className="relative inline-flex items-center cursor-pointer shrink-0">
                        <input
                          type="checkbox"
                          checked={sidebarSettings[item.key] !== false}
                          onChange={() => toggleSidebarSetting(item.key)}
                          className="sr-only peer"
                        />
                        <div
                          className="w-8 h-4 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all"
                          style={{
                            backgroundColor:
                              sidebarSettings[item.key] !== false
                                ? 'var(--th-accent)'
                                : isNightMode
                                ? '#322318'
                                : '#d6d3d1',
                          }}
                        />
                      </label>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB: SUBSCRIPTION & PAYMENT PLANS                                         */}
          {/* ========================================================================= */}
          {activeTab === 'subscription' && (
            <div className="space-y-6">
              <div className="pb-2 border-b flex flex-wrap items-center justify-between gap-2" style={{ borderColor: 'var(--th-border)' }}>
                <h4 className="text-lg font-bold flex items-center gap-2" style={{ color: 'var(--th-ink)' }}>
                  <Crown className="w-4 h-4" style={themeAccentIconStyle} />
                  <span>Plans</span>
                </h4>
                <button
                  type="button"
                  onClick={() => window.dispatchEvent(new CustomEvent('achiev_open_subscription'))}
                  className="themed-accent-btn px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold cursor-pointer shrink-0"
                >
                  Open Payment Window
                </button>
              </div>

              {/* Discount Code Column */}
              <div className="p-4 rounded-2xl border border-stone-200 dark:border-[#382518] bg-stone-50/80 dark:bg-[#1a120d] space-y-2.5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="text-xs font-bold text-stone-900 dark:text-stone-100">
                    Discount Code
                  </div>
                  {appliedDiscount && (
                    <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400">
                      {appliedDiscount.code} applied · {appliedDiscount.percentOff}% OFF active on plans below
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <input
                    type="text"
                    value={discountInput}
                    onChange={(e) => {
                      setDiscountInput(e.target.value.toUpperCase());
                      if (discountError) setDiscountError(null);
                    }}
                    placeholder="Enter discount code (e.g. ACHIEV20)"
                    className="flex-1 min-w-[180px] px-3 py-1.5 rounded-xl border border-stone-200 dark:border-[#382518] bg-white dark:bg-[#120c08] text-xs font-mono uppercase outline-none focus:border-amber-500"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const match = validateDiscountCode(discountInput);
                      if (!match) {
                        setDiscountError('Invalid code. Try ACHIEV20, STUDENT25, or SCHOLAR50.');
                        return;
                      }
                      setAppliedDiscount(match);
                      saveDiscountCode(match.code);
                      setDiscountError(null);
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold cursor-pointer"
                  >
                    Apply Code
                  </button>
                  {appliedDiscount && (
                    <button
                      type="button"
                      onClick={() => {
                        setAppliedDiscount(null);
                        setDiscountInput('');
                        saveDiscountCode(null);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-stone-200 dark:bg-[#251a12] text-stone-700 dark:text-stone-300 text-xs font-semibold cursor-pointer"
                    >
                      Clear
                    </button>
                  )}
                </div>
                {discountError && (
                  <p className="text-[11px] font-semibold text-rose-600 dark:text-rose-400">{discountError}</p>
                )}
              </div>

              {!isOwnerAccount && (
                <div className="p-4 rounded-2xl border border-stone-200 dark:border-[#382518] bg-stone-50/80 dark:bg-[#1a120d] flex flex-wrap items-center justify-between gap-3">
                  <div className="space-y-1 text-xs">
                    <div className="flex items-center gap-2 font-bold text-stone-900 dark:text-stone-100">
                      <ShieldCheck className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                      <span>Active Membership: {currentSubscription?.planName || 'Free Scholar Plan'}</span>
                    </div>
                    <div className="text-[11px] text-stone-600 dark:text-stone-400">
                      <span>
                        Type:{' '}
                        <strong className="capitalize">
                          {currentSubscription?.billingCycle || 'free'}
                        </strong>
                        {currentSubscription?.durationDays
                          ? ` (${currentSubscription.durationDays} Days)`
                          : ' (No Expiry)'}
                        {currentSubscription?.expiresAt
                          ? ` · Valid until ${new Date(currentSubscription.expiresAt).toLocaleDateString('en-IN', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                            })}`
                          : ''}
                        {activeAccountEmail ? ` · Attached to ${activeAccountEmail}` : ''}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {SUBSCRIPTION_TIERS.map((tier) => {
                  const isCurrentTier = activePlanId === tier.id;
                  const finalAnnual = appliedDiscount
                    ? calculateDiscountedPrice(tier.priceAnnual, appliedDiscount.percentOff)
                    : tier.priceAnnual;
                  const finalMonthly = appliedDiscount
                    ? calculateDiscountedPrice(tier.priceMonthly, appliedDiscount.percentOff)
                    : tier.priceMonthly;
                  const hasDiscount = Boolean(appliedDiscount && tier.priceAnnual > 0);
                  return (
                    <div
                      key={tier.id}
                      className="p-4 rounded-xl border flex flex-col justify-between themed-glass-card"
                      style={
                        tier.highlight || isCurrentTier
                          ? {
                              borderColor: 'var(--th-accent)',
                              backgroundColor: 'var(--th-accent-soft)',
                              boxShadow: '0 0 0 2px color-mix(in srgb, var(--th-accent) 22%, transparent)',
                            }
                          : undefined
                      }
                    >
                      <div>
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-stone-100 dark:bg-[#251a12] text-stone-700 dark:text-stone-300 uppercase">
                            {tier.badge}
                          </span>
                          {isCurrentTier && (
                            <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                              <Check className="w-3 h-3" /> Active
                            </span>
                          )}
                        </div>
                        <h5 className="font-bold text-sm text-stone-900 dark:text-stone-100 mt-2">
                          {tier.name}
                        </h5>
                        <div className="my-2">
                          <div className="flex items-baseline gap-2 flex-wrap">
                            {hasDiscount && (
                              <span className="text-xs line-through text-stone-400 font-mono">
                                ₹{tier.priceAnnual.toLocaleString('en-IN')}
                              </span>
                            )}
                            <span className="text-lg font-black font-mono text-stone-900 dark:text-stone-100">
                              {finalAnnual === 0 ? '₹0 / Free' : `₹${finalAnnual.toLocaleString('en-IN')} / yr`}
                            </span>
                          </div>
                          <div className="text-[11px] font-mono font-bold flex items-center gap-1.5 flex-wrap" style={themeAccentIconStyle}>
                            {hasDiscount && (
                              <span className="line-through opacity-60">₹{tier.priceMonthly}</span>
                            )}
                            <span>
                              {finalMonthly === 0 ? 'Forever Free Core Suite' : `Only ₹${finalMonthly} / month`}
                            </span>
                          </div>
                        </div>
                        <p className="text-[11px] text-stone-500 dark:text-stone-400 line-clamp-2 mb-3">
                          {tier.description}
                        </p>
                        <ul className="space-y-1.5 text-[10.5px]">
                          {tier.features.slice(0, 6).map((f, i) => (
                            <li key={i} className="flex items-start gap-1.5">
                              <Check className="w-3 h-3 shrink-0 mt-0.5" style={themeAccentIconStyle} />
                              <span className="text-stone-700 dark:text-stone-300">{f}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          if (tier.priceMonthly === 0) {
                            const freeRec = buildSubscriptionRecord({
                              planId: 'free',
                              planName: tier.name,
                              badge: tier.badge,
                              billingCycle: 'free',
                              amountInr: 0,
                              paymentMethod: 'Free Plan',
                              transactionId: `FREE-${Date.now().toString().slice(-6)}`,
                              attachedEmail: activeAccountEmail,
                              attachedName: profileForm.name !== 'User' ? profileForm.name : undefined,
                            });
                            saveUserSubscription(freeRec);
                            void persistSubscriptionToAuthProfile(freeRec);
                            setSavedFeedback(true);
                            setTimeout(() => setSavedFeedback(false), 1500);
                            return;
                          }
                          window.dispatchEvent(new CustomEvent('achiev_open_subscription'));
                        }}
                        className={`mt-4 w-full py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          tier.highlight
                            ? 'themed-accent-btn bg-amber-600 hover:bg-amber-700 text-white'
                            : 'bg-stone-200 dark:bg-[#251a12] hover:bg-stone-300 dark:hover:bg-[#322318] text-stone-800 dark:text-stone-200'
                        }`}
                      >
                        {isCurrentTier
                          ? 'Active Plan'
                          : finalMonthly === 0
                          ? 'Switch to Free'
                          : `Upgrade to ${tier.name} (₹${finalMonthly}/mo)`}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          {/* ========================================================================= */}
          {/* ========================================================================= */}
          {activeTab === 'customizer' && (
            <div className="space-y-6">
              <div className="pb-2 border-b" style={{ borderColor: 'var(--th-border)' }}>
                <h4 className="text-lg font-bold flex items-center gap-2" style={{ color: 'var(--th-ink)' }}>
                  <Sparkles className="w-4 h-4" style={themeAccentIconStyle} />
                  <span>Goals</span>
                </h4>
              </div>

              {/* Daily Focus Time Target (Hours + Minutes) */}
              <div className="p-4 rounded-2xl bg-stone-50/80 dark:bg-[#18110c] border border-stone-200/90 dark:border-[#382518] space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Timer className="w-4 h-4" style={themeAccentIconStyle} />
                    <span className="text-xs font-bold text-stone-800 dark:text-stone-200">
                      Daily Focus Target
                    </span>
                  </div>
                  <span className="text-xs font-bold font-mono" style={themeAccentIconStyle}>
                    {dailyHoursGoal}h {dailyMinutesGoal}m / day
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Hours selector */}
                  <div className="p-3 rounded-xl bg-white dark:bg-[#140e0a] border border-stone-200/80 dark:border-[#352317] space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] font-semibold text-stone-700 dark:text-stone-300">
                        Hours (0–24)
                      </label>
                      <input
                        type="number"
                        min={0}
                        max={24}
                        value={dailyHoursGoal}
                        onChange={(e) => handleUpdateFocusTarget(Number(e.target.value), dailyMinutesGoal)}
                        className="w-16 px-2 py-1 text-xs font-mono font-bold text-right rounded-lg border border-stone-200 dark:border-[#382518] bg-stone-50 dark:bg-[#1b120d] text-stone-900 dark:text-stone-100 outline-none"
                      />
                    </div>
                    <div className="grid grid-cols-5 gap-1.5">
                      {[2, 4, 5, 6, 8].map((h) => (
                        <button
                          key={h}
                          type="button"
                          onClick={() => handleUpdateFocusTarget(h, dailyMinutesGoal)}
                          className={`py-1.5 rounded-lg text-xs font-medium border text-center transition-all cursor-pointer ${
                            dailyHoursGoal === h
                              ? 'themed-tab-active bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 font-bold shadow-2xs'
                              : 'bg-stone-50 dark:bg-[#18110c] text-stone-700 dark:text-stone-300 border-stone-200 dark:border-[#352317] hover:border-stone-400 dark:hover:border-[#4b3322]'
                          }`}
                        >
                          {h}h
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Minutes selector */}
                  <div className="p-3 rounded-xl bg-white dark:bg-[#140e0a] border border-stone-200/80 dark:border-[#352317] space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] font-semibold text-stone-700 dark:text-stone-300">
                        Minutes (0–59)
                      </label>
                      <input
                        type="number"
                        min={0}
                        max={59}
                        value={dailyMinutesGoal}
                        disabled={dailyHoursGoal === 24}
                        onChange={(e) => handleUpdateFocusTarget(dailyHoursGoal, Number(e.target.value))}
                        className="w-16 px-2 py-1 text-xs font-mono font-bold text-right rounded-lg border border-stone-200 dark:border-[#382518] bg-stone-50 dark:bg-[#1b120d] text-stone-900 dark:text-stone-100 outline-none disabled:opacity-40"
                      />
                    </div>
                    <div className="grid grid-cols-4 gap-1.5">
                      {[0, 15, 30, 45].map((m) => (
                        <button
                          key={m}
                          type="button"
                          disabled={dailyHoursGoal === 24 && m > 0}
                          onClick={() => handleUpdateFocusTarget(dailyHoursGoal, m)}
                          className={`py-1.5 rounded-lg text-xs font-medium border text-center transition-all cursor-pointer disabled:opacity-40 ${
                            dailyMinutesGoal === m
                              ? 'themed-accent-btn bg-amber-600 text-white font-bold shadow-2xs'
                              : 'bg-stone-50 dark:bg-[#18110c] text-stone-700 dark:text-stone-300 border-stone-200 dark:border-[#352317] hover:border-stone-400 dark:hover:border-[#4b3322]'
                          }`}
                        >
                          {m}m
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-[11px] text-stone-500 dark:text-stone-400">
                  Your Focus Timer button stays active on the main dashboard ribbon with Pause &amp; Resume controls.
                </p>
              </div>

              {/* Daily MCQ & Image Questions Side-by-Side with Custom Numbers & Past Logs */}
              <div className="p-4 rounded-2xl bg-stone-50/80 dark:bg-[#18110c] border border-stone-200/90 dark:border-[#382518] space-y-4">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4" style={themeAccentIconStyle} />
                  <span className="text-xs font-bold text-stone-800 dark:text-stone-200">
                    Daily Question Targets
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Daily MCQ */}
                  <div className="p-3 rounded-xl bg-white dark:bg-[#140e0a] border border-stone-200/80 dark:border-[#352317] space-y-3 flex flex-col">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-stone-800 dark:text-stone-100">
                        Daily MCQ
                      </label>
                      <span className="text-xs font-bold font-mono" style={themeAccentIconStyle}>
                        {dailyMcqGoal} Qs
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <input
                        type="number"
                        min={1}
                        max={2000}
                        value={dailyMcqDraft}
                        onChange={(e) => {
                          setDailyMcqDraft(e.target.value);
                          const num = Number(e.target.value);
                          if (Number.isFinite(num) && num >= 1) {
                            handleUpdateDailyMcq(num);
                          }
                        }}
                        placeholder="Custom target"
                        className="flex-1 min-w-0 px-2.5 py-1.5 rounded-lg text-xs font-mono font-bold border border-stone-200 dark:border-[#382518] bg-stone-50 dark:bg-[#1b120d] text-stone-900 dark:text-stone-100 outline-none"
                      />
                      <span className="text-[11px] text-stone-500 dark:text-stone-400 shrink-0">target</span>
                    </div>

                    <div className="grid grid-cols-5 gap-1">
                      {[20, 40, 60, 80, 100].map((q) => (
                        <button
                          key={q}
                          type="button"
                          onClick={() => handleUpdateDailyMcq(q)}
                          className={`py-1 rounded-lg text-[11px] font-medium border text-center transition-all cursor-pointer ${
                            dailyMcqGoal === q
                              ? 'themed-accent-btn bg-amber-600 text-white font-bold shadow-2xs'
                              : 'bg-stone-50 dark:bg-[#18110c] text-stone-700 dark:text-stone-300 border-stone-200 dark:border-[#352317] hover:border-stone-400 dark:hover:border-[#4b3322]'
                          }`}
                        >
                          {q}
                        </button>
                      ))}
                    </div>

                    <div className="flex items-center justify-between gap-2 pt-1 border-t border-stone-200/70 dark:border-[#2a1c12]">
                      <span className="text-[11px] text-stone-600 dark:text-stone-300">Solved today</span>
                      <input
                        type="number"
                        min={0}
                        max={5000}
                        value={todayMcqDone}
                        onChange={(e) => handleLogTodayMcq(Number(e.target.value))}
                        className="w-20 px-2 py-1 rounded-lg text-xs font-mono font-bold text-right border border-stone-200 dark:border-[#382518] bg-stone-50 dark:bg-[#1b120d] text-stone-900 dark:text-stone-100 outline-none"
                      />
                    </div>

                    <div className="pt-1 border-t border-stone-200/70 dark:border-[#2a1c12] space-y-1">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                        Past Daily MCQ Logs
                      </div>
                      <div className="max-h-28 overflow-y-auto space-y-1 pr-1">
                        {Object.keys(mcqLogs).length === 0 ? (
                          <div className="text-[11px] text-stone-400 dark:text-stone-500 italic py-1">
                            No Daily MCQ logs recorded yet.
                          </div>
                        ) : (
                          Object.entries(mcqLogs)
                            .sort(([a], [b]) => b.localeCompare(a))
                            .map(([dateKey, entry]) => (
                              <div
                                key={dateKey}
                                className="flex items-center justify-between text-[11px] px-2 py-1 rounded-md bg-stone-50 dark:bg-[#1a120c] border border-stone-200/60 dark:border-[#2e2015]"
                              >
                                <span className="text-stone-600 dark:text-stone-300">{formatLogDateLabel(dateKey)}</span>
                                <span className="font-mono font-bold text-stone-900 dark:text-stone-100">
                                  {entry.completed} / {entry.target} Qs
                                </span>
                              </div>
                            ))
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Image Questions */}
                  <div className="p-3 rounded-xl bg-white dark:bg-[#140e0a] border border-stone-200/80 dark:border-[#352317] space-y-3 flex flex-col">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-stone-800 dark:text-stone-100 flex items-center gap-1.5">
                        <ImageIcon className="w-3.5 h-3.5" style={themeAccentIconStyle} />
                        <span>Image Questions</span>
                      </label>
                      <span className="text-xs font-bold font-mono" style={themeAccentIconStyle}>
                        {dailyImageQGoal} Qs
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <input
                        type="number"
                        min={1}
                        max={2000}
                        value={dailyImageQDraft}
                        onChange={(e) => {
                          setDailyImageQDraft(e.target.value);
                          const num = Number(e.target.value);
                          if (Number.isFinite(num) && num >= 1) {
                            handleUpdateDailyImageQ(num);
                          }
                        }}
                        placeholder="Custom target"
                        className="flex-1 min-w-0 px-2.5 py-1.5 rounded-lg text-xs font-mono font-bold border border-stone-200 dark:border-[#382518] bg-stone-50 dark:bg-[#1b120d] text-stone-900 dark:text-stone-100 outline-none"
                      />
                      <span className="text-[11px] text-stone-500 dark:text-stone-400 shrink-0">target</span>
                    </div>

                    <div className="grid grid-cols-5 gap-1">
                      {[10, 15, 25, 40, 60].map((q) => (
                        <button
                          key={q}
                          type="button"
                          onClick={() => handleUpdateDailyImageQ(q)}
                          className={`py-1 rounded-lg text-[11px] font-medium border text-center transition-all cursor-pointer ${
                            dailyImageQGoal === q
                              ? 'themed-accent-btn bg-amber-600 text-white font-bold shadow-2xs'
                              : 'bg-stone-50 dark:bg-[#18110c] text-stone-700 dark:text-stone-300 border-stone-200 dark:border-[#352317] hover:border-stone-400 dark:hover:border-[#4b3322]'
                          }`}
                        >
                          {q}
                        </button>
                      ))}
                    </div>

                    <div className="flex items-center justify-between gap-2 pt-1 border-t border-stone-200/70 dark:border-[#2a1c12]">
                      <span className="text-[11px] text-stone-600 dark:text-stone-300">Solved today</span>
                      <input
                        type="number"
                        min={0}
                        max={5000}
                        value={todayImageQDone}
                        onChange={(e) => handleLogTodayImageQ(Number(e.target.value))}
                        className="w-20 px-2 py-1 rounded-lg text-xs font-mono font-bold text-right border border-stone-200 dark:border-[#382518] bg-stone-50 dark:bg-[#1b120d] text-stone-900 dark:text-stone-100 outline-none"
                      />
                    </div>

                    <div className="pt-1 border-t border-stone-200/70 dark:border-[#2a1c12] space-y-1">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                        Past Image Question Logs
                      </div>
                      <div className="max-h-28 overflow-y-auto space-y-1 pr-1">
                        {Object.keys(imageQLogs).length === 0 ? (
                          <div className="text-[11px] text-stone-400 dark:text-stone-500 italic py-1">
                            No Image Question logs recorded yet.
                          </div>
                        ) : (
                          Object.entries(imageQLogs)
                            .sort(([a], [b]) => b.localeCompare(a))
                            .map(([dateKey, entry]) => (
                              <div
                                key={dateKey}
                                className="flex items-center justify-between text-[11px] px-2 py-1 rounded-md bg-stone-50 dark:bg-[#1a120c] border border-stone-200/60 dark:border-[#2e2015]"
                              >
                                <span className="text-stone-600 dark:text-stone-300">{formatLogDateLabel(dateKey)}</span>
                                <span className="font-mono font-bold text-stone-900 dark:text-stone-100">
                                  {entry.completed} / {entry.target} Qs
                                </span>
                              </div>
                            ))
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Keyboard Shortcuts Cheatsheet */}
              <div className="p-4 rounded-2xl bg-stone-50/80 dark:bg-[#18110c] border border-stone-200/90 dark:border-[#382518] space-y-3">
                <div className="flex items-center gap-2">
                  <Keyboard className="w-4 h-4 text-stone-500" />
                  <span className="text-xs font-bold text-stone-800 dark:text-stone-200">
                    High-Yield Keyboard Shortcuts
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {[
                    { key: '⌘ / Ctrl + K', action: 'Quick Command Palette / Search' },
                    { key: '⌘ / Ctrl + S', action: 'Instant Note Save' },
                    { key: '⌘ / Ctrl + B', action: 'Toggle Slim Sidebar Width' },
                    { key: '⌘ / Ctrl + F', action: 'Focus / Split Note View Mode' },
                    { key: '⌘ / Ctrl + E', action: 'Trigger Eye Rest 20-20-20 Timer' },
                    { key: '⌘ / Ctrl + P', action: 'Launch Peace Audio Synthesizer' },
                  ].map((sc, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-2 rounded-xl bg-white dark:bg-[#140e0a] border border-stone-200/70 dark:border-[#352317]"
                    >
                      <span className="text-[11px] text-stone-600 dark:text-stone-300">{sc.action}</span>
                      <kbd className="px-2 py-0.5 rounded-md bg-stone-100 dark:bg-[#251a12] border border-stone-300 dark:border-[#4b3322] text-[10px] font-mono text-stone-800 dark:text-stone-200 font-semibold shadow-2xs">
                        {sc.key}
                      </kbd>
                    </div>
                  ))}
                </div>
              </div>

              {/* Daily Focus Timer Activity Log List (bottom of Goals segment) */}
              <div className="p-4 rounded-2xl bg-stone-50/80 dark:bg-[#18110c] border border-stone-200/90 dark:border-[#382518] space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" style={themeAccentIconStyle} />
                    <span className="text-xs font-bold text-stone-800 dark:text-stone-200">
                      Daily Focus Timer Log
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-stone-500 dark:text-stone-400">
                    {Object.keys(focusTimerLogs).filter((k) => (focusTimerLogs[k] || 0) > 0).length} days logged
                  </span>
                </div>

                <div className="divide-y divide-stone-200/70 dark:divide-[#2e2015] rounded-xl bg-white dark:bg-[#140e0a] border border-stone-200/80 dark:border-[#352317] max-h-60 overflow-y-auto">
                  {Object.entries(focusTimerLogs).filter(([, secs]) => (secs || 0) > 0).length === 0 ? (
                    <div className="px-3.5 py-4 text-xs text-stone-500 dark:text-stone-400 text-center">
                      Start the Focus Timer from the top dashboard ribbon to record how long the timer runs each day.
                    </div>
                  ) : (
                    Object.entries(focusTimerLogs)
                      .filter(([, secs]) => (secs || 0) > 0)
                      .sort(([a], [b]) => b.localeCompare(a))
                      .map(([dateKey, secs]) => (
                        <div
                          key={dateKey}
                          className="px-3.5 py-2.5 flex items-center justify-between gap-3 text-xs"
                        >
                          <span className="font-medium text-stone-800 dark:text-stone-200">
                            {formatLogDateLabel(dateKey)}
                          </span>
                          <span className="font-mono font-bold" style={themeAccentIconStyle}>
                            {formatDurationWords(secs)}
                          </span>
                        </div>
                      ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 4: STUDENT PROFILE (AVATAR UPLOAD + @USERNAME SLAB)                   */}
          {/* ========================================================================= */}
          {activeTab === 'profile' && (
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="pb-2 border-b" style={{ borderColor: 'var(--th-border)' }}>
                <h4 className="text-lg font-bold flex items-center gap-2" style={{ color: 'var(--th-ink)' }}>
                  <User className="w-4 h-4" style={themeAccentIconStyle} />
                  <span>Profile</span>
                </h4>
              </div>

              {/* Profile Picture Upload Card */}
              <div className="p-4 rounded-2xl bg-stone-50 dark:bg-[#18110c] border border-stone-200 dark:border-[#382518] flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  {profileForm.avatarUrl ? (
                    <img
                      src={profileForm.avatarUrl}
                      alt={profileForm.name}
                      className="w-16 h-16 rounded-2xl object-cover shadow-sm"
                      style={{ border: '2px solid color-mix(in srgb, var(--th-accent) 45%, transparent)' }}
                    />
                  ) : (
                    <div
                      className="w-16 h-16 rounded-2xl font-bold text-xl flex items-center justify-center border"
                      style={themeAccentSoftBadgeStyle}
                    >
                      {(profileForm.name || 'S').slice(0, 2).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <div className="text-xs font-bold text-stone-900 dark:text-stone-100">
                      Profile Photo
                    </div>
                    <p className="text-[11px] text-stone-500 dark:text-stone-400">
                      Displayed across Achiever's Hub, chat &amp; your sidebar badge
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <label className="themed-accent-btn px-3 py-1.5 rounded-xl bg-amber-700 hover:bg-amber-800 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs">
                    <Camera className="w-3.5 h-3.5" />
                    <span>{profileForm.avatarUrl ? 'Change Photo' : 'Upload Photo'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      className="hidden"
                    />
                  </label>
                  {profileForm.avatarUrl && (
                    <button
                      type="button"
                      onClick={() => {
                        const cleared = { ...profileForm, avatarUrl: undefined };
                        setProfileForm(cleared);
                        onUpdateProfile(cleared);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-stone-200 dark:bg-[#251a12] hover:bg-stone-300 text-stone-700 dark:text-stone-300 text-xs font-semibold cursor-pointer"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Full Name &amp; Credentials:
                  </label>
                  <input
                    type="text"
                    value={profileForm.name}
                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                    className="w-full bg-stone-50 dark:bg-[#18110c] px-3 py-2 rounded-xl border border-stone-200 dark:border-[#382518] text-xs text-stone-800 dark:text-stone-200 outline-none focus:border-amber-500"
                  />
                </div>

                {/* Username Slab for Peer Search */}
                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Username (searchable by friends in Achiever's Hub):
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-mono font-bold" style={themeAccentIconStyle}>
                      @
                    </span>
                    <input
                      type="text"
                      value={profileForm.username || ''}
                      onChange={(e) =>
                        setProfileForm({
                          ...profileForm,
                          username: e.target.value.toLowerCase().replace(/[^a-z0-9_.]/g, ''),
                        })
                      }
                      placeholder="your_username"
                      className="w-full bg-stone-50 dark:bg-[#18110c] pl-7 pr-3 py-2 rounded-xl border border-stone-200 dark:border-[#382518] text-xs font-mono text-stone-800 dark:text-stone-200 outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Medical College / Institution:
                  </label>
                  <input
                    type="text"
                    value={profileForm.institution}
                    onChange={(e) => setProfileForm({ ...profileForm, institution: e.target.value })}
                    className="w-full bg-stone-50 dark:bg-[#18110c] px-3 py-2 rounded-xl border border-stone-200 dark:border-[#382518] text-xs text-stone-800 dark:text-stone-200 outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Contact Number:
                  </label>
                  <input
                    type="tel"
                    value={profileForm.phone || ''}
                    onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                    placeholder="+91 9876543210"
                    className="w-full bg-stone-50 dark:bg-[#18110c] px-3 py-2 rounded-xl border border-stone-200 dark:border-[#382518] text-xs text-stone-800 dark:text-stone-200 outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Year / Clinical Stage:
                  </label>
                  <input
                    type="text"
                    value={profileForm.currentYear}
                    onChange={(e) => setProfileForm({ ...profileForm, currentYear: e.target.value })}
                    className="w-full bg-stone-50 dark:bg-[#18110c] px-3 py-2 rounded-xl border border-stone-200 dark:border-[#382518] text-xs text-stone-800 dark:text-stone-200 outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Specialty Target:
                  </label>
                  <input
                    type="text"
                    value={profileForm.specialityGoal}
                    onChange={(e) => setProfileForm({ ...profileForm, specialityGoal: e.target.value })}
                    className="w-full bg-stone-50 dark:bg-[#18110c] px-3 py-2 rounded-xl border border-stone-200 dark:border-[#382518] text-xs text-stone-800 dark:text-stone-200 outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Attached Subscription Type & Duration Card on User Profile */}
              <div className="p-4 rounded-2xl bg-stone-50 dark:bg-[#18110c] border border-stone-200 dark:border-[#382518] space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-stone-900 dark:text-stone-100">
                    <Crown className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                    <span>Attached Subscription &amp; Duration</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => window.dispatchEvent(new CustomEvent('achiev_open_subscription'))}
                    className="px-2.5 py-1 rounded-lg bg-amber-600/15 hover:bg-amber-600/25 text-amber-900 dark:text-amber-300 text-[11px] font-bold cursor-pointer"
                  >
                    Manage Plan
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] pt-1">
                  <div className="p-2.5 rounded-xl bg-white dark:bg-[#140e0a] border border-stone-200/80 dark:border-[#352317]">
                    <div className="text-stone-500 dark:text-stone-400">Plan &amp; Type</div>
                    <div className="font-bold text-stone-900 dark:text-stone-100 mt-0.5">
                      {isOwnerAccount
                        ? 'Master Ultimate (Full Access)'
                        : `${currentSubscription?.planName || 'Free Scholar Plan'} (${
                            currentSubscription?.billingCycle === 'annual'
                              ? 'Annual'
                              : currentSubscription?.billingCycle === 'monthly'
                              ? 'Monthly'
                              : 'Free'
                          })`}
                    </div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white dark:bg-[#140e0a] border border-stone-200/80 dark:border-[#352317]">
                    <div className="text-stone-500 dark:text-stone-400">Duration &amp; Validity</div>
                    <div className="font-bold text-stone-900 dark:text-stone-100 mt-0.5">
                      {isOwnerAccount
                        ? 'Lifetime Unrestricted'
                        : currentSubscription?.expiresAt
                        ? `${currentSubscription.durationDays || 30} Days · Until ${new Date(
                            currentSubscription.expiresAt
                          ).toLocaleDateString('en-IN', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                          })}`
                        : 'Forever Free Core'}
                    </div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white dark:bg-[#140e0a] border border-stone-200/80 dark:border-[#352317]">
                    <div className="text-stone-500 dark:text-stone-400">Attached Account</div>
                    <div className="font-bold text-stone-900 dark:text-stone-100 mt-0.5 truncate">
                      {currentSubscription?.attachedEmail || activeAccountEmail || profileForm.name || 'Active Profile'}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-3">
                <button
                  type="submit"
                  className="themed-accent-btn px-4 py-2 rounded-xl bg-amber-700 hover:bg-amber-800 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                >
                  {savedFeedback && <Check className="w-3.5 h-3.5" />}
                  <span>{savedFeedback ? 'Saved!' : 'Save Profile'}</span>
                </button>
              </div>
            </form>
          )}

          {/* ========================================================================= */}
          {/* TAB 4: BACKUP & RESET                                                     */}
          {/* ========================================================================= */}
          {activeTab === 'defaults' && (
            <div className="space-y-4">
              <div className="pb-2 border-b" style={{ borderColor: 'var(--th-border)' }}>
                <h4 className="text-lg font-bold flex items-center gap-2" style={{ color: 'var(--th-ink)' }}>
                  <Download className="w-4 h-4" style={themeAccentIconStyle} />
                  <span>Backup</span>
                </h4>
              </div>

              <div className="p-4 rounded-xl bg-stone-50 dark:bg-[#18110c] border border-stone-200 dark:border-[#382518]">
                <h4 className="text-xs font-bold text-stone-800 dark:text-stone-200 mb-1">
                  Backup Study Notes:
                </h4>
                <p className="text-[11px] text-stone-500 dark:text-stone-400 mb-3">
                  Export all medical notebooks, drawings, snippets, and clinical pearl notes as JSON backup.
                </p>
                <button
                  type="button"
                  onClick={onExportNotes}
                  className="px-3.5 py-1.5 bg-stone-200 dark:bg-[#251a12] hover:bg-stone-300 dark:hover:bg-[#322318] text-stone-800 dark:text-stone-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export Notes Archive</span>
                </button>
              </div>

              <div className="p-4 rounded-xl bg-stone-50 dark:bg-[#18110c] border border-stone-200 dark:border-[#382518] flex items-center justify-between gap-3 flex-wrap">
                <div>
                  <h4 className="text-xs font-bold text-stone-800 dark:text-stone-200 mb-0.5">
                    Privacy Policy
                  </h4>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400">
                    View Achiev privacy terms or save as PDF inside the app.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => window.dispatchEvent(new CustomEvent('achiev_open_privacy_policy'))}
                    className="px-3.5 py-1.5 rounded-xl bg-stone-200 dark:bg-[#251a12] hover:bg-stone-300 dark:hover:bg-[#322318] text-stone-800 dark:text-stone-200 text-xs font-semibold transition-colors cursor-pointer"
                  >
                    Privacy Policy
                  </button>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#7f1d1d]/10 dark:bg-[#6e171b]/25 border border-[#7f1d1d]/25 dark:border-[#962d32]/50">
                <h4 className="text-xs font-bold text-[#6e1418] dark:text-[#d97074] mb-1">
                  Reset Den to Factory Default:
                </h4>
                <p className="text-[11px] text-[#7f1d1d] dark:text-[#c94a4f] mb-3">
                  Revert notebooks, timetable roster, and option slabs back to default Pharmacology demo dataset.
                </p>
                <button
                  type="button"
                  onClick={onResetSession}
                  className="px-3.5 py-1.5 bg-[#7f1d1d] hover:bg-[#962d32] text-[#fdf2f2] rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset All Data</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  if (isWorkspaceView) {
    return modalContent;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0e0907]/75 backdrop-blur-xs p-3 sm:p-4 animate-in fade-in duration-200">
      {modalContent}
    </div>
  );
};
