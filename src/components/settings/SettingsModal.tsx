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
import { ThemeAppStorePreviews } from './ThemeAppStorePreviews';
import { useAuth } from '../../contexts/AuthContext';
import {
  DRIVE_APP_FOLDER_NAME,
} from '../../services/googleDriveService';
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
  Zap,
  ExternalLink,
  Copy,
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
  LogOut,
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
  onOpenAIStudioModal?: () => void;
  isWorkspaceView?: boolean;
  initialTab?: SettingsTabId;
  onSyncNow?: () => Promise<void> | void;
  onLogout?: () => void;
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
    badge: 'Theme 1 · Default',
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
    badge: 'Theme 2 · Plum, Blush & Coral',
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
    badge: 'Theme 3 · Pastel Beige-Pink',
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
    badge: 'Theme 4 · Matte Architectural Grey-Blue',
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
    badge: 'Theme 5 · Evergreen, Champagne & Gold',
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
  category: string;
  fontType: 'handwriting' | 'sans' | 'serif';
  cssFamily: string;
  description: string;
  sample: string;
}

export const APP_FONTS: FontOption[] = [
  // 10 HANDWRITING FONTS
  { id: 'pacifico', name: 'Pacifico', category: 'Handwriting', fontType: 'handwriting', cssFamily: "'Pacifico', cursive", description: 'Expressive brush script for warm personal headers.', sample: 'High-Yield Ward Pearl: Check Airway, Breathing & SpO2 first!' },
  { id: 'dancing-script', name: 'Dancing Script', category: 'Handwriting', fontType: 'handwriting', cssFamily: "'Dancing Script', cursive", description: 'Fluid calligraphic strokes for memorable study anchors.', sample: 'Important: Discontinue Metformin 48 hrs prior to IV contrast.' },
  { id: 'caveat', name: 'Caveat', category: 'Handwriting', fontType: 'handwriting', cssFamily: "'Caveat', cursive", description: 'Natural rapid medical student notebook cursive.', sample: 'Differential Diagnosis: Pneumothorax vs Cardiac Tamponade.' },
  { id: 'architects-daughter', name: 'Architects Daughter', category: 'Handwriting', fontType: 'handwriting', cssFamily: "'Architects Daughter', cursive", description: 'Grid-aligned blueprint hand lettering for diagrams.', sample: 'Formula: MAP = DBP + 1/3 (SBP - DBP) >= 65 mmHg.' },
  { id: 'brush-script', name: 'Brush Script', category: 'Handwriting', fontType: 'handwriting', cssFamily: "'Brush Script MT', 'Great Vibes', cursive", description: 'Classic painterly fountain script feel.', sample: 'Clinical Round Notes — Cardiology Morning Posting.' },
  { id: 'marker-felt', name: 'Marker Felt', category: 'Handwriting', fontType: 'handwriting', cssFamily: "'Marker Felt', 'Comic Sans MS', 'Patrick Hand', cursive", description: 'Bold felt-tip whiteboard highlight lettering.', sample: 'Remember triad: Beck’s Triad -> Hypotension, JVD, Muffled heart sounds.' },
  { id: 'chalkduster', name: 'Chalkduster', category: 'Handwriting', fontType: 'handwriting', cssFamily: "'Chalkduster', 'Patrick Hand', cursive", description: 'Textured lecture blackboard chalk lettering.', sample: 'Cranial Nerve Exam: CN I to XII Quick Recall.' },
  { id: 'alex-brush', name: 'Alex Brush', category: 'Handwriting', fontType: 'handwriting', cssFamily: "'Alex Brush', cursive", description: 'Elegant flowing ink cursive for refined titles.', sample: 'The Art & Science of Physical Examination.' },
  { id: 'great-vibes', name: 'Great Vibes', category: 'Handwriting', fontType: 'handwriting', cssFamily: "'Great Vibes', cursive", description: 'Formal royal calligraphy penmanship.', sample: 'Certificate of Clinical Distinction & Focus.' },
  { id: 'satisfy', name: 'Satisfy', category: 'Handwriting', fontType: 'handwriting', cssFamily: "'Satisfy', cursive", description: 'Clean effortless cursive signature strokes.', sample: 'Rx: Tab. Amoxicillin-Clavulanate 625mg PO TDS x 7d.' },

  // 10 SANS-SERIF FONTS
  { id: 'helvetica', name: 'Helvetica', category: 'Sans-Serif', fontType: 'sans', cssFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif", description: 'Iconic Swiss clinical precision typography.', sample: 'Cardiovascular Hemodynamics & Clinical Triage' },
  { id: 'arial', name: 'Arial', category: 'Sans-Serif', fontType: 'sans', cssFamily: "Arial, Helvetica, sans-serif", description: 'Clean universal medical chart sans-serif.', sample: 'Arterial Blood Gas Analysis & Anion Gap Synthesis' },
  { id: 'calibri', name: 'Calibri', category: 'Sans-Serif', fontType: 'sans', cssFamily: "Calibri, 'Source Sans 3', 'Open Sans', sans-serif", description: 'Soft warm modern humanist sans-serif.', sample: 'Pharmacokinetics: Volume of Distribution & Half-Life' },
  { id: 'inter', name: 'Inter', category: 'Sans-Serif', fontType: 'sans', cssFamily: "'Inter', sans-serif", description: 'High x-height UI font built for dense lab tables.', sample: 'Glasgow Coma Scale (GCS) Assessment in Trauma' },
  { id: 'roboto', name: 'Roboto', category: 'Sans-Serif', fontType: 'sans', cssFamily: "'Roboto', sans-serif", description: 'Geometric Android-native friendly clarity.', sample: 'Systemic Vascular Resistance & Cardiac Output' },
  { id: 'open-sans', name: 'Open Sans', category: 'Sans-Serif', fontType: 'sans', cssFamily: "'Open Sans', sans-serif", description: 'Neutral ultra-legible humanist lecture typography.', sample: 'Renal Clearance & Glomerular Filtration Curves' },
  { id: 'lato', name: 'Lato', category: 'Sans-Serif', fontType: 'sans', cssFamily: "'Lato', sans-serif", description: 'Balanced semi-rounded warmth and seriousness.', sample: 'Pediatric Immunization & Developmental Milestones' },
  { id: 'montserrat', name: 'Montserrat', category: 'Sans-Serif', fontType: 'sans', cssFamily: "'Montserrat', sans-serif", description: 'Wide geometric modernist headlines & labels.', sample: 'ACLS & Emergency Trauma Protocol Summary' },
  { id: 'source-sans-3', name: 'Source Sans 3', category: 'Sans-Serif', fontType: 'sans', cssFamily: "'Source Sans 3', sans-serif", description: 'Adobe editorial sans calibrated for long screens.', sample: 'Evidence-Based Internal Medicine Pocket Guide' },
  { id: 'futura', name: 'Futura', category: 'Sans-Serif', fontType: 'sans', cssFamily: "Futura, 'Plus Jakarta Sans', 'Outfit', sans-serif", description: 'Clean architectural Bauhaus geometric sans.', sample: 'Neuroanatomy Tracts & Brainstem Cross-Sections' },

  // 10 SERIF FONTS
  { id: 'times-new-roman', name: 'Times New Roman', category: 'Serif', fontType: 'serif', cssFamily: "'Times New Roman', Times, serif", description: 'Timeless academic paper & medical journal standard.', sample: 'Harrison’s Principles of Internal Medicine — Review Notes' },
  { id: 'georgia', name: 'Georgia', category: 'Serif', fontType: 'serif', cssFamily: "Georgia, serif", description: 'Wide generous screen serif built for clarity.', sample: 'Differential Diagnosis of Acute Abdomen & Peritonitis' },
  { id: 'garamond', name: 'Garamond', category: 'Serif', fontType: 'serif', cssFamily: "Garamond, 'EB Garamond', serif", description: 'Graceful Old-Style scholarly print elegance.', sample: 'Classical Materia Medica & Pathophysiology Essays' },
  { id: 'baskerville', name: 'Baskerville', category: 'Serif', fontType: 'serif', cssFamily: "Baskerville, 'Libre Baskerville', serif", description: 'Transitional high-contrast British academic serif.', sample: 'Oxford Handbook of Clinical Medicine Notes' },
  { id: 'merriweather', name: 'Merriweather', category: 'Serif', fontType: 'serif', cssFamily: "'Merriweather', serif", description: 'Robust condensed serif designed for deep textbook study.', sample: 'Diagnostic Criteria for Acute Coronary Syndromes' },
  { id: 'playfair-display', name: 'Playfair Display', category: 'Serif', fontType: 'serif', cssFamily: "'Playfair Display', serif", description: 'Signature royal editorial serif (Default Ach1ev Style).', sample: 'Ach1ev Editorial Study — Clinical Journal Synthesis' },
  { id: 'bodoni', name: 'Bodoni', category: 'Serif', fontType: 'serif', cssFamily: "'Bodoni Moda', 'Bodoni MT', Didot, serif", description: 'Dramatic hairline Didone contrast for headers.', sample: 'Grand Rounds Case Compendium & Therapeutics' },
  { id: 'palatino', name: 'Palatino', category: 'Serif', fontType: 'serif', cssFamily: "'Palatino Linotype', 'Book Antiqua', Palatino, serif", description: 'Broad sculptural Renaissance humanist serif.', sample: 'Physiological Basis of Medical Practice' },
  { id: 'lora', name: 'Lora', category: 'Serif', fontType: 'serif', cssFamily: "'Lora', serif", description: 'Calligraphic contemporary serif with subtle curves.', sample: 'Integrated Pathology & Pharmacology Compendium' },
  { id: 'cinzel', name: 'Cinzel', category: 'Serif', fontType: 'serif', cssFamily: "'Cinzel', serif", description: 'Regal engraved Roman inscription proportions.', sample: 'HIPPOCRATIC CLINICAL ARCHIVE & NOTES' },
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
  onOpenAIStudioModal,
  isWorkspaceView = false,
  initialTab = 'profile',
  onSyncNow,
  onLogout,
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
    signOut,
  } = useAuth();

  const [activeTab, setActiveTab] = useState<SettingsTabId>(initialTab);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(true);
  const [driveConnecting, setDriveConnecting] = useState(false);
  const [driveOpError, setDriveOpError] = useState<string | null>(null);
  const [driveOpSuccess, setDriveOpSuccess] = useState<string | null>(null);
  const [syncingManual, setSyncingManual] = useState(false);

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
      'https://fonts.googleapis.com/css2?family=Alex+Brush&family=Architects+Daughter&family=Bodoni+Moda:wght@500;700&family=Caveat:wght@500;700&family=Cinzel:wght@600;700&family=Dancing+Script:wght@600;700&family=EB+Garamond:wght@400;600&family=Great+Vibes&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&family=Lato:wght@400;700&family=Libre+Baskerville:wght@400;700&family=Lora:wght@400;600;700&family=Merriweather:wght@400;700&family=Montserrat:wght@400;600;700&family=Open+Sans:wght@400;600;700&family=Outfit:wght@400;600;700&family=Pacifico&family=Patrick+Hand&family=Playfair+Display:ital,wght@0,500;0,700;1,400&family=Plus+Jakarta+Sans:wght@400;600;700&family=Roboto:wght@400;500;700&family=Satisfy&family=Source+Sans+3:wght@400;600;700&display=swap';
    if (!document.getElementById('achiev-google-fonts-30')) {
      const link = document.createElement('link');
      link.id = 'achiev-google-fonts-30';
      link.rel = 'stylesheet';
      link.href = href;
      document.head.appendChild(link);
    }
  }, []);

  const BASE_SIDEBAR_DEFAULTS: SidebarSettings = {
    showMySpace: true,
    showRead: true,
    showCreateNote: true,
    showCalendar: true,
    showLibrary: true,
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

  const handleSettingsLogout = async () => {
    if (onLogout) {
      await onLogout();
    } else {
      await signOut();
    }
    onClose?.();
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
  const [autoSaveFreq, setAutoSaveFreq] = useState<string>(() => localStorage.getItem('medden_autosave_freq') || 'instant');
  const [dailyHoursGoal, setDailyHoursGoal] = useState<number>(() => Number(localStorage.getItem('medden_daily_hours')) || 5);
  const [dailyQBankGoal, setDailyQBankGoal] = useState<number>(() => Number(localStorage.getItem('medden_daily_qbank')) || 40);
  const [distractionFree, setDistractionFree] = useState<boolean>(() => localStorage.getItem('medden_distraction_free') === 'true');
  const [currentFont, setCurrentFont] = useState<string>(() => {
    return localStorage.getItem('medden_app_font') || 'Playfair Display';
  });
  const [fontScale, setFontScale] = useState<number>(() => {
    const saved = localStorage.getItem('medden_font_scale');
    return saved ? parseInt(saved, 10) : 100;
  });
  const [fontCategoryFilter, setFontCategoryFilter] = useState<'all' | 'handwriting' | 'sans' | 'serif'>('all');
  const [copiedAppletId, setCopiedAppletId] = useState<boolean>(false);

  // Receiving / Payout Account Settings stored in localStorage for instant UPI QR & Payment routing
  const [payoutConfig, setPayoutConfig] = useState<{
    accountName: string;
    upiId: string;
    bankName: string;
    accountNumber: string;
    ifscCode: string;
  }>(() => {
    try {
      const saved = localStorage.getItem('achiev_merchant_payout_v1');
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      accountName: 'Ach1ev Official Study Platform',
      upiId: 'achiev@okicici',
      bankName: 'ICICI Bank Ltd.',
      accountNumber: '004201528491',
      ifscCode: 'ICIC0000042',
    };
  });
  const [payoutSavedMsg, setPayoutSavedMsg] = useState<string | null>(null);

  const handleSavePayoutConfig = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      localStorage.setItem('achiev_merchant_payout_v1', JSON.stringify(payoutConfig));
      window.dispatchEvent(new Event('achiev_payout_updated'));
      setPayoutSavedMsg('Receiving account updated! UPI QR, Card & Net Banking checkout now route here.');
      setTimeout(() => setPayoutSavedMsg(null), 3200);
    } catch {}
  };

  const handleCopyAppletId = () => {
    navigator.clipboard.writeText('0087218c-d7d0-4ad0-b0df-2e515051e7a0');
    setCopiedAppletId(true);
    setTimeout(() => setCopiedAppletId(false), 2000);
  };

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

  const handleUpdateAutoSave = (freq: string) => {
    setAutoSaveFreq(freq);
    localStorage.setItem('medden_autosave_freq', freq);
    setSavedFeedback(true);
    setTimeout(() => setSavedFeedback(false), 1500);
  };

  const handleToggleDistractionFree = () => {
    const nextVal = !distractionFree;
    setDistractionFree(nextVal);
    localStorage.setItem('medden_distraction_free', String(nextVal));
    setSavedFeedback(true);
    setTimeout(() => setSavedFeedback(false), 1500);
  };

  const handleUpdateDailyHours = (hrs: number) => {
    setDailyHoursGoal(hrs);
    localStorage.setItem('medden_daily_hours', String(hrs));
    setSavedFeedback(true);
    setTimeout(() => setSavedFeedback(false), 1500);
  };

  const handleUpdateDailyQBank = (q: number) => {
    setDailyQBankGoal(q);
    localStorage.setItem('medden_daily_qbank', String(q));
    setSavedFeedback(true);
    setTimeout(() => setSavedFeedback(false), 1500);
  };

  const modalContent = (
    <div className={isWorkspaceView ? "themed-workspace-surface w-full h-full flex flex-col overflow-hidden text-stone-900 dark:text-stone-100 bg-[#fbf9f4] dark:bg-[#110c09] transition-colors" : "themed-glass-card bg-[#fcfbf8] dark:bg-[#18110c] border border-stone-200/90 dark:border-[#382518] rounded-3xl shadow-2xl max-w-4xl w-full h-[88vh] flex flex-col overflow-hidden relative text-stone-900 dark:text-stone-100 transition-colors"}>
      
      {/* Header ribbon shown only in popup modal mode; Workspace view already displays Settings in the top panel */}
      {!isWorkspaceView && (
        <div className="bg-stone-50 dark:bg-[#140e0a] px-6 py-3.5 border-b border-stone-200/80 dark:border-[#382518] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-600/15 text-amber-700 dark:text-amber-400 flex items-center justify-center border border-amber-600/25">
              <Settings className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xl font-bold font-serif text-stone-900 dark:text-stone-100 flex items-center gap-2">
                <span>Settings</span>
                {savedFeedback && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30 animate-pulse">
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
            <div className="themed-glass-bar sm:hidden w-11 border-r border-stone-200/80 dark:border-[#382518] bg-stone-50/90 dark:bg-[#140e0a] py-1.5 px-1 flex flex-col items-center justify-between gap-1.5 shrink-0 z-10">
              <div className="flex flex-col items-center gap-1 w-full">
                <button
                  type="button"
                  onClick={() => setIsMobileSidebarOpen(true)}
                  title="Expand Settings Menu"
                  aria-label="Expand Settings Menu"
                  className="w-8 h-8 rounded-xl flex items-center justify-center bg-stone-200/80 hover:bg-stone-300/80 dark:bg-[#241911] dark:hover:bg-[#312116] text-stone-800 dark:text-[#efe4d4] border border-stone-300/80 dark:border-[#3e291b] cursor-pointer transition-all"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex flex-col items-center gap-1 overflow-y-auto flex-1 w-full py-1 custom-scrollbar">
                {(
                  [
                    { id: 'profile', label: 'Student Profile', icon: User },
                    { id: 'designs', label: 'Themes', icon: Palette },
                    { id: 'wallpaper', label: 'Wallpaper', icon: ImageIcon, iconClass: 'text-amber-600 dark:text-amber-400' },
                    { id: 'typography', label: 'Fonts', icon: Type },
                    { id: 'cloud-sync', label: 'Cloud & Drive', icon: Cloud, iconClass: 'text-amber-600 dark:text-amber-400' },
                    { id: 'import-notes', label: 'Import Notes', icon: UploadCloud, iconClass: 'text-amber-600 dark:text-amber-400' },
                    { id: 'sidebar-buttons', label: 'Sidebar Customizer', icon: SlidersHorizontal, iconClass: 'text-amber-600 dark:text-amber-400' },
                    { id: 'customizer', label: 'Student Customizer', icon: Sparkles, iconClass: 'text-amber-500' },
                    { id: 'languages', label: 'Languages', icon: Globe, iconClass: 'text-amber-600 dark:text-amber-400' },
                    { id: 'subscription', label: 'Plans & Pricing', icon: Crown, iconClass: 'text-amber-500' },
                    { id: 'defaults', label: 'Backup & Reset', icon: RotateCcw },
                  ] as Array<{ id: SettingsTabId; label: string; icon: React.ComponentType<any>; iconClass?: string }>
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
                      className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all cursor-pointer shrink-0 ${
                        isActive
                          ? 'themed-tab-active bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 shadow-xs'
                          : 'text-stone-600 dark:text-stone-400 hover:bg-stone-200/60 dark:hover:bg-[#251a12]'
                      }`}
                    >
                      <TabIcon className={`w-4 h-4 shrink-0 ${isActive ? '' : tab.iconClass || ''}`} />
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={handleSettingsLogout}
                title={user?.email ? `Log out (${user.email})` : 'Log out / Switch Account'}
                aria-label="Log Out"
                className="w-8 h-8 rounded-xl flex items-center justify-center bg-[#7f1d1d]/12 hover:bg-[#7f1d1d]/22 dark:bg-[#6e171b]/30 dark:hover:bg-[#6e171b]/50 text-[#7f1d1d] dark:text-[#e49b9e] border border-[#7f1d1d]/25 dark:border-[#962d32]/45 cursor-pointer shrink-0"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Left Vertical Settings Sidebar (Expanded Drawer on Mobile matching Dashboard Sidebar, Static Column on Desktop) */}
          <div
            className={`themed-glass-bar border-r border-stone-200/80 dark:border-[#382518] bg-stone-50/95 dark:bg-[#140e0a] p-1.5 flex-col justify-between gap-2 shrink-0 ${
              isMobileSidebarOpen
                ? 'flex absolute inset-y-0 left-0 z-30 w-[200px] shadow-2xl sm:static sm:w-48 sm:shadow-none animate-in slide-in-from-left-4 duration-150'
                : 'hidden sm:flex sm:w-48'
            }`}
          >
            {/* Top Arrow Action Matching Main Dashboard Sidebar (No "Back" label) */}
            <div className="pb-1.5 border-b border-stone-200/80 dark:border-[#382518] shrink-0 flex items-center justify-end gap-1">
              {onClose && (
                <button
                  type="button"
                  onClick={onClose}
                  title="Return to Dashboard"
                  aria-label="Return to Dashboard"
                  className="hidden sm:flex w-8 h-8 rounded-xl items-center justify-center transition-all hover:brightness-110 active:scale-[0.95] cursor-pointer bg-stone-200/75 hover:bg-stone-300/80 dark:bg-[#241911] dark:hover:bg-[#312116] text-stone-800 dark:text-[#efe4d4] border border-stone-300/80 dark:border-[#3e291b]"
                >
                  <ArrowLeft className="w-4 h-4 stroke-[2.2]" />
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsMobileSidebarOpen(false)}
                title="Collapse Settings Sidebar"
                aria-label="Collapse Settings Sidebar"
                className="sm:hidden w-8 h-8 rounded-xl flex items-center justify-center bg-stone-200/75 hover:bg-stone-300/80 dark:bg-[#241911] dark:hover:bg-[#312116] text-stone-700 dark:text-[#efe4d4] border border-stone-300/80 dark:border-[#3e291b] cursor-pointer shrink-0"
              >
                <ArrowLeft className="w-4 h-4 stroke-[2.2]" />
              </button>
            </div>

            {/* Vertical Section Container styled identically to Dashboard Sidebar (.rounded-xl p-1 space-y-0.5) */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              <div className="rounded-xl p-1 space-y-0.5 bg-stone-100/70 dark:bg-[#1a110b] border border-stone-200/75 dark:border-[#2e1e13]">
                {(
                  [
                    { id: 'profile', label: 'Student Profile', icon: User },
                    { id: 'designs', label: 'Themes', icon: Palette },
                    { id: 'wallpaper', label: 'Wallpaper', icon: ImageIcon, iconClass: 'text-amber-600 dark:text-amber-400' },
                    { id: 'typography', label: 'Fonts', icon: Type },
                    { id: 'cloud-sync', label: 'Cloud & Drive', icon: Cloud, iconClass: 'text-amber-600 dark:text-amber-400' },
                    { id: 'import-notes', label: 'Import Notes', icon: UploadCloud, iconClass: 'text-amber-600 dark:text-amber-400' },
                    { id: 'sidebar-buttons', label: 'Sidebar Customizer', icon: SlidersHorizontal, iconClass: 'text-amber-600 dark:text-amber-400' },
                    { id: 'customizer', label: 'Student Customizer', icon: Sparkles, iconClass: 'text-amber-500' },
                    { id: 'languages', label: 'Languages', icon: Globe, iconClass: 'text-amber-600 dark:text-amber-400' },
                    { id: 'subscription', label: 'Plans & Pricing', icon: Crown, iconClass: 'text-amber-500' },
                    { id: 'defaults', label: 'Backup & Reset', icon: RotateCcw },
                  ] as Array<{ id: SettingsTabId; label: string; icon: React.ComponentType<any>; iconClass?: string }>
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
                      className={`w-full min-h-[36px] sm:min-h-[32px] h-auto flex items-center gap-2 px-2 py-1.5 rounded-lg text-[12px] sm:text-xs font-medium transition-all cursor-pointer text-left ${
                        isActive
                          ? 'themed-tab-active bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 shadow-xs font-semibold'
                          : 'text-stone-700 dark:text-stone-300 hover:bg-stone-200/70 dark:hover:bg-[#251a12] hover:text-stone-900 dark:hover:text-stone-100'
                      }`}
                    >
                      <div className="w-4 h-4 flex items-center justify-center shrink-0">
                        <TabIcon className={`w-3.5 h-3.5 shrink-0 ${isActive ? '' : tab.iconClass || ''}`} />
                      </div>
                      <span className="leading-tight break-words whitespace-normal flex-1 min-w-0">
                        {tab.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Bottom-pinned Log Out button */}
            <div className="pt-1.5 border-t border-stone-200/80 dark:border-[#382518] shrink-0">
              <button
                type="button"
                onClick={handleSettingsLogout}
                title={user?.email ? `Log out (${user.email})` : 'Log out / Switch Account'}
                className="w-full min-h-[36px] sm:min-h-[32px] flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer bg-[#7f1d1d]/12 hover:bg-[#7f1d1d]/22 dark:bg-[#6e171b]/30 dark:hover:bg-[#6e171b]/50 text-[#7f1d1d] dark:text-[#e49b9e] border border-[#7f1d1d]/25 dark:border-[#962d32]/45"
              >
                <LogOut className="w-4 h-4 shrink-0" />
                <span className="truncate">Log Out</span>
              </button>
            </div>
          </div>

          {/* Right Detail Content Viewport */}
          <div className="p-3 sm:p-6 overflow-y-auto space-y-5 flex-1 min-w-0 custom-scrollbar">
            {/* Mobile Settings Bar to reopen full vertical Settings Sidebar anytime */}
            <div className="sm:hidden flex items-center justify-between gap-2 pb-2 border-b border-stone-200/80 dark:border-[#382518]">
              <button
                type="button"
                onClick={() => setIsMobileSidebarOpen((v) => !v)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-stone-200/75 dark:bg-[#241911] text-stone-800 dark:text-[#efe4d4] border border-stone-300/80 dark:border-[#3e291b] cursor-pointer"
              >
                <Menu className="w-3.5 h-3.5" />
                <span>Settings Menu</span>
              </button>
              <span className="text-[11px] font-semibold text-stone-600 dark:text-stone-400 truncate">
                {
                  (
                    {
                      profile: 'Student Profile',
                      designs: 'Themes',
                      wallpaper: 'Wallpaper',
                      typography: 'Fonts',
                      'cloud-sync': 'Cloud & Drive',
                      'import-notes': 'Import Notes',
                      'sidebar-buttons': 'Sidebar Customizer',
                      customizer: 'Student Customizer',
                      languages: 'Languages',
                      subscription: 'Plans & Pricing',
                      defaults: 'Backup & Reset',
                    } as Record<SettingsTabId, string>
                  )[activeTab]
                }
              </span>
            </div>
          {/* ========================================================================= */}
          {/* TAB 1: THEMES (COMPACT MOBILE + LIGHT/DARK SCREENSHOT TOGGLE BESIDE APPLY)*/}
          {/* ========================================================================= */}
          {activeTab === 'designs' && (
            <div className="space-y-4 sm:space-y-6">
              <div className="space-y-3 sm:space-y-4">
                <div className="pb-2 border-b border-stone-200 dark:border-[#382518] flex items-center justify-between gap-2">
                  <h4 className="text-base sm:text-lg font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                    <Palette className="w-4 h-4 text-amber-600 dark:text-amber-400" />
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
                        className={`p-2.5 sm:p-4 rounded-xl sm:rounded-2xl border transition-all cursor-pointer relative ${
                          isSelected
                            ? 'themed-glass-card bg-amber-50/70 dark:bg-[#231912] border-[#A47C43] ring-2 ring-[#A47C43]/25 shadow-md'
                            : 'themed-glass-card bg-white dark:bg-[#18110c] border-stone-200/90 dark:border-[#382518] hover:border-stone-300 dark:hover:border-[#4b3322]'
                        }`}
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5 sm:mb-2">
                          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap min-w-0">
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
              <div className="pb-2 border-b border-stone-200 dark:border-[#382518] flex flex-wrap items-center justify-between gap-2">
                <h4 className="text-lg font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-amber-600 dark:text-amber-400" />
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
                  <label className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold cursor-pointer flex items-center gap-1.5 shadow-sm">
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
                    className="flex-1 accent-amber-600 cursor-pointer"
                  />
                </div>
              </div>

              {/* 10 Curated Abstract Designs: 5 Dark + 5 Light */}
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h5 className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                    10 Abstract Wallpaper Designs (5 Dark · 5 Light)
                  </h5>
                  <button
                    type="button"
                    onClick={() => applyCustomWallpaper('', customWallpaperOpacity)}
                    className={`px-3 py-1 rounded-xl text-[11px] font-bold border transition-all cursor-pointer ${
                      customWallpaper === ''
                        ? 'border-amber-500 bg-amber-500/15 text-amber-800 dark:text-amber-300'
                        : 'border-stone-200 dark:border-[#382518] text-stone-600 dark:text-stone-300 hover:border-amber-400'
                    }`}
                  >
                    Use Theme Default
                  </button>
                </div>

                {/* 5 DARK ABSTRACT WALLPAPERS */}
                <div className="space-y-2">
                  <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-stone-500 dark:text-amber-300/90 flex items-center gap-1.5">
                    <Moon className="w-3.5 h-3.5" />
                    <span>5 Dark Abstract Wallpapers</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {[
                      {
                        id: 'dark-abs-1',
                        title: 'Espresso Ripple Silk',
                        desc: 'Layered deep cocoa ribbons & brass light',
                        uri: 'radial-gradient(ellipse 75% 55% at 18% 22%, rgba(212,158,72,0.22), transparent 60%), conic-gradient(from 210deg at 78% 72%, rgba(111,66,37,0.34), rgba(14,7,3,0.95) 45%, rgba(164,124,67,0.18) 78%, rgba(14,7,3,0.98))',
                      },
                      {
                        id: 'dark-abs-2',
                        title: 'Velvet Plum Aurora',
                        desc: 'Abstract plum & orchid dusk waves',
                        uri: 'radial-gradient(circle at 22% 75%, rgba(212,154,166,0.24), transparent 52%), conic-gradient(from 145deg at 68% 26%, rgba(110,66,83,0.44), rgba(22,12,16,0.96) 52%, rgba(71,62,102,0.34) 80%, rgba(16,9,13,0.98))',
                      },
                      {
                        id: 'dark-abs-3',
                        title: 'Muted Cobalt Facets',
                        desc: 'Architectural geometric slate shards',
                        uri: 'linear-gradient(125deg, rgba(125,154,181,0.14) 0%, transparent 44%), repeating-linear-gradient(135deg, rgba(86,114,143,0.09) 0px, rgba(86,114,143,0.09) 28px, transparent 28px, transparent 62px), radial-gradient(circle at 80% 24%, rgba(86,114,143,0.28), transparent 50%), linear-gradient(145deg, #0d131a 0%, #16202b 54%, #0c1016 100%)',
                      },
                      {
                        id: 'dark-abs-4',
                        title: 'Emerald Gold Nebula',
                        desc: 'Deep botanical canopy & molten gold arc',
                        uri: 'radial-gradient(ellipse 68% 48% at 72% 22%, rgba(209,168,84,0.20), transparent 55%), radial-gradient(circle at 20% 80%, rgba(14,119,82,0.26), transparent 52%), conic-gradient(from 90deg at 35% 35%, rgba(0,42,35,0.9), #051612 58%, rgba(209,168,84,0.14) 85%, #070d0c)',
                      },
                      {
                        id: 'dark-abs-5',
                        title: 'Obsidian Contour Grid',
                        desc: 'Minimalist nocturnal contour rings',
                        uri: 'repeating-radial-gradient(circle at 75% 30%, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 2px, transparent 2px, transparent 28px), radial-gradient(circle at 25% 25%, rgba(180,140,85,0.16), transparent 55%), linear-gradient(160deg, #0c0c0f 0%, #17171c 58%, #09090b 100%)',
                      },
                    ].map((preset) => {
                      const isSelected = customWallpaper === preset.uri;
                      return (
                        <button
                          key={preset.id}
                          type="button"
                          onClick={() => applyCustomWallpaper(preset.uri, customWallpaperOpacity)}
                          className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col gap-2 ${
                            isSelected
                              ? 'border-amber-500 ring-2 ring-amber-500/25 bg-amber-50/60 dark:bg-[#231912]'
                              : 'border-stone-200 dark:border-[#382518] bg-white dark:bg-[#18110c] hover:border-amber-500/50'
                          }`}
                        >
                          <div
                            className="h-20 w-full rounded-xl border border-black/15 dark:border-white/10 shadow-inner"
                            style={{ background: preset.uri }}
                          />
                          <div className="flex items-center justify-between gap-2">
                            <div className="min-w-0">
                              <div className="text-xs font-bold text-stone-900 dark:text-stone-100 truncate">
                                {preset.title}
                              </div>
                              <div className="text-[10.5px] text-stone-500 dark:text-stone-400 truncate">
                                {preset.desc}
                              </div>
                            </div>
                            {isSelected && <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 5 LIGHT ABSTRACT WALLPAPERS */}
                <div className="space-y-2 pt-2">
                  <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-stone-500 dark:text-amber-200/80 flex items-center gap-1.5">
                    <Sun className="w-3.5 h-3.5 text-amber-500" />
                    <span>5 Light Abstract Wallpapers</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {[
                      {
                        id: 'light-abs-1',
                        title: 'Warm Caramel Cloud',
                        desc: 'Creamy parchment with amber silk swirl',
                        uri: 'radial-gradient(ellipse 70% 55% at 22% 20%, rgba(217,155,67,0.22), transparent 60%), conic-gradient(from 195deg at 75% 75%, rgba(242,222,192,0.9), rgba(252,248,240,0.98) 52%, rgba(226,198,151,0.55) 82%, #fdfaf3)',
                      },
                      {
                        id: 'light-abs-2',
                        title: 'Royal Rose Marble',
                        desc: 'Soft pastel blush & ivory organic waves',
                        uri: 'radial-gradient(circle at 76% 24%, rgba(212,154,166,0.28), transparent 52%), radial-gradient(circle at 20% 78%, rgba(229,190,194,0.34), transparent 54%), linear-gradient(135deg, #fdf7f6 0%, #f7eaeb 52%, #f1dede 100%)',
                      },
                      {
                        id: 'light-abs-3',
                        title: 'Nordic Slate Prisms',
                        desc: 'Airy architectural cool grey & cobalt mist',
                        uri: 'repeating-linear-gradient(120deg, rgba(86,114,143,0.06) 0px, rgba(86,114,143,0.06) 34px, transparent 34px, transparent 74px), radial-gradient(circle at 78% 22%, rgba(125,154,181,0.26), transparent 50%), linear-gradient(145deg, #f8fafc 0%, #edf2f7 55%, #e2e8f0 100%)',
                      },
                      {
                        id: 'light-abs-4',
                        title: 'Champagne Dune Curves',
                        desc: 'Warm sunlit ripples on antique sand',
                        uri: 'repeating-radial-gradient(circle at 18% 82%, rgba(182,140,82,0.06) 0px, rgba(182,140,82,0.06) 2px, transparent 2px, transparent 32px), radial-gradient(circle at 80% 18%, rgba(216,194,170,0.45), transparent 55%), linear-gradient(135deg, #faf6ee 0%, #efe5d2 55%, #e6d7be 100%)',
                      },
                      {
                        id: 'light-abs-5',
                        title: 'Pearl Sage Origami',
                        desc: 'Serene botanical ivory geometric facets',
                        uri: 'conic-gradient(from 40deg at 65% 32%, rgba(132,169,140,0.16), rgba(249,250,246,0.96) 45%, rgba(216,226,214,0.65) 75%, #f5f7f2), linear-gradient(155deg, #f8faf7 0%, #edf2eb 58%, #e4ebe2 100%)',
                      },
                    ].map((preset) => {
                      const isSelected = customWallpaper === preset.uri;
                      return (
                        <button
                          key={preset.id}
                          type="button"
                          onClick={() => applyCustomWallpaper(preset.uri, customWallpaperOpacity)}
                          className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col gap-2 ${
                            isSelected
                              ? 'border-amber-500 ring-2 ring-amber-500/25 bg-amber-50/60 dark:bg-[#231912]'
                              : 'border-stone-200 dark:border-[#382518] bg-white dark:bg-[#18110c] hover:border-amber-500/50'
                          }`}
                        >
                          <div
                            className="h-20 w-full rounded-xl border border-black/10 dark:border-white/10 shadow-inner"
                            style={{ background: preset.uri }}
                          />
                          <div className="flex items-center justify-between gap-2">
                            <div className="min-w-0">
                              <div className="text-xs font-bold text-stone-900 dark:text-stone-100 truncate">
                                {preset.title}
                              </div>
                              <div className="text-[10.5px] text-stone-500 dark:text-stone-400 truncate">
                                {preset.desc}
                              </div>
                            </div>
                            {isSelected && <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB: CLOUD & DRIVE (CONNECT ANY DRIVE WEBSITE, NO ENV SETTINGS BLOCK)    */}
          {/* ========================================================================= */}
          {activeTab === 'cloud-sync' && (
            <div className="space-y-5">
              <div className="pb-2 border-b border-stone-200 dark:border-[#382518]">
                <h4 className="text-lg font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                  <Cloud className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <span>Cloud &amp; Drive</span>
                </h4>
              </div>

              {driveOpError && (
                <div className="p-3 rounded-xl bg-[#7f1d1d]/12 dark:bg-[#6e171b]/30 border border-[#7f1d1d]/30 dark:border-[#962d32]/50 text-[#6e1418] dark:text-[#e49b9e] text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{driveOpError}</span>
                </div>
              )}

              {driveOpSuccess && (
                <div className="p-3 rounded-xl bg-amber-500/15 border border-amber-500/35 text-amber-900 dark:text-amber-200 text-xs flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
                  <span>{driveOpSuccess}</span>
                </div>
              )}

              {/* Card 1: Authenticated Account & Multi-Device Sync */}
              <div className="p-4 rounded-2xl bg-white dark:bg-[#1a120d] border border-stone-200 dark:border-[#382518] space-y-3">
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-700 dark:text-amber-400 flex items-center justify-center border border-amber-500/30">
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
                      <p className="text-[11px] text-stone-500 dark:text-stone-400">
                        {user
                          ? `Provider: ${String(user.app_metadata?.provider || 'account').toUpperCase()}${
                              lastSyncedAt ? ` · Last synced ${new Date(lastSyncedAt).toLocaleTimeString()}` : ''
                            }`
                          : googleUser
                          ? 'Provider: GOOGLE OAUTH2 · Signed in & Drive-ready'
                          : phoneUser
                          ? 'Provider: MOBILE OTP VERIFIED · Instant Study Session'
                          : 'Sign in with Email, Phone OTP, or Google to sync across devices.'}
                      </p>
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
                        <button
                          type="button"
                          onClick={signOut}
                          className="px-3 py-1.5 rounded-xl bg-[#7f1d1d]/12 hover:bg-[#7f1d1d]/20 dark:bg-[#6e171b]/30 dark:hover:bg-[#6e171b]/45 text-[#6e1418] dark:text-[#d97074] border border-[#7f1d1d]/25 dark:border-[#962d32]/45 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span>Sign Out</span>
                        </button>
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
                    <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center border border-amber-500/30">
                      <HardDrive className="w-5 h-5" />
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                        <span>Personal Google Drive PDF Vault</span>
                        <span
                          className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                            driveAccount.connected
                              ? 'bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-500/30'
                              : 'bg-stone-100 dark:bg-[#251a12] text-stone-500 dark:text-stone-400'
                          }`}
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
                    <Link2 className="w-4 h-4 text-amber-600 dark:text-amber-400" />
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
                        className={`p-2.5 rounded-xl border flex flex-col justify-between gap-2 ${
                          isLinked
                            ? 'border-amber-500/60 bg-amber-50/40 dark:bg-[#231912]'
                            : 'border-stone-200 dark:border-[#352317] bg-stone-50/60 dark:bg-[#140e0a]'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-xs font-bold text-stone-800 dark:text-stone-100 truncate">
                            {provider.name}
                          </span>
                          {isLinked && <Check className="w-3.5 h-3.5 text-amber-600 shrink-0" />}
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
              <div className="pb-2 border-b border-stone-200 dark:border-[#382518]">
                <h4 className="text-lg font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                  <Type className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <span>Fonts</span>
                </h4>
              </div>

              {/* Font Size Spectrum Slider */}
              <div className="p-4 rounded-xl bg-stone-50 dark:bg-[#18110c] border border-stone-200/80 dark:border-[#382518] space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-stone-800 dark:text-stone-200 flex items-center gap-1.5">
                    <span>Font Size Spectrum:</span>
                    <span className="text-amber-700 dark:text-amber-400 font-mono font-black">{fontScale}%</span>
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
                  className="w-full accent-amber-600 cursor-pointer h-2 bg-stone-200 dark:bg-[#251a12] rounded-lg"
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
                      { key: 'sans', label: `Sans-Serif (${APP_FONTS.filter(f => f.fontType === 'sans').length})`, count: APP_FONTS.filter(f => f.fontType === 'sans').length },
                      { key: 'serif', label: `Serif (${APP_FONTS.filter(f => f.fontType === 'serif').length})`, count: APP_FONTS.filter(f => f.fontType === 'serif').length },
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

                {/* Font Options Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {APP_FONTS
                    .filter((f) => fontCategoryFilter === 'all' || f.fontType === fontCategoryFilter)
                    .map((font) => {
                      const isSelected = currentFont === font.name;
                      const isHandwriting = font.fontType === 'handwriting';
                      return (
                        <div
                          key={font.id}
                          onClick={() => handleSelectFont(font)}
                          className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between group ${
                            isSelected
                              ? 'border-[#A47C43] bg-amber-50/50 dark:bg-[#231912] ring-2 ring-[#A47C43]/30 shadow-xs'
                              : isHandwriting
                              ? 'border-amber-200/90 dark:border-[#4b3322] bg-amber-50/20 dark:bg-[#1a120d] hover:border-amber-400'
                              : 'border-stone-200/90 dark:border-[#382518] bg-white dark:bg-[#18110c] hover:border-amber-500'
                          }`}
                        >
                          <div className="space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                                <span
                                  data-font-sample=""
                                  style={
                                    {
                                      fontFamily: font.cssFamily,
                                      '--sample-font': font.cssFamily,
                                      fontSize: isHandwriting ? '1.25rem' : '1.05rem',
                                      fontStyle: 'normal',
                                    } as React.CSSProperties
                                  }
                                >
                                  {font.name}
                                </span>
                                {isHandwriting && (
                                  <span className="px-1.5 py-0.2 rounded text-[8.5px] font-mono font-bold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                                    ✍️ Handwriting
                                  </span>
                                )}
                                {isSelected && <Check className="w-3.5 h-3.5 text-amber-500" />}
                              </span>
                              <span className="text-[9.5px] font-mono px-1.5 py-0.2 rounded bg-stone-100 dark:bg-[#251a12] text-stone-600 dark:text-stone-300">
                                {font.category}
                              </span>
                            </div>
                          </div>

                          {/* Live Font Sample */}
                          <div
                            data-font-sample=""
                            className={`mt-2.5 p-3 rounded-lg border text-stone-900 dark:text-stone-100 transition-colors ${
                              isHandwriting
                                ? 'bg-amber-50/60 dark:bg-[#1d1810] border-amber-200/60 dark:border-[#4b3322]'
                                : 'bg-stone-50 dark:bg-[#120c08] border-stone-100 dark:border-[#352317]'
                            }`}
                            style={
                              {
                                fontFamily: font.cssFamily,
                                '--sample-font': font.cssFamily,
                                fontStyle: 'normal',
                              } as React.CSSProperties
                            }
                          >
                            <div className={`font-semibold leading-snug ${isHandwriting ? 'text-base sm:text-lg text-amber-950 dark:text-amber-200' : 'text-sm'}`}>
                              {font.sample}
                            </div>
                          </div>
                        </div>
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
                  className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all relative ${
                    isSelected
                      ? 'border-amber-600 bg-amber-500/10 dark:bg-[#231912] ring-2 ring-amber-500/40 shadow-xs'
                      : 'border-stone-200/90 dark:border-[#382518] bg-white dark:bg-[#18110c] hover:border-amber-400'
                  }`}
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
                      {isSelected && <Check className="w-4 h-4 text-amber-600 dark:text-amber-400 stroke-[3]" />}
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
                <div className="pb-2 border-b border-stone-200 dark:border-[#382518]">
                  <h4 className="text-lg font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                    <Globe className="w-4 h-4 text-amber-600 dark:text-amber-400" />
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
              <div className="pb-2 border-b border-stone-200 dark:border-[#382518]">
                <h4 className="text-lg font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                  <UploadCloud className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <span>Import Notes</span>
                </h4>
              </div>

              {importStatus && (
                <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-[#231912] border border-amber-300 dark:border-[#4b3322] text-amber-900 dark:text-amber-300 text-xs font-semibold flex items-center gap-2">
                  <Sparkles className="w-4 h-4 animate-spin text-amber-600 dark:text-amber-400" />
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
            <div className="space-y-6">
              <div className="pb-2 border-b border-stone-200 dark:border-[#382518]">
                <h4 className="text-lg font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <span>Sidebar Customizer</span>
                </h4>
              </div>

              <div className="p-4 rounded-2xl bg-stone-50 dark:bg-[#18110c] border border-stone-200 dark:border-[#382518] divide-y divide-stone-200 dark:divide-[#382518]">
                {[...ALL_SIDEBAR_BUTTON_ITEMS]
                  .sort((a, b) => {
                    const idxA = sidebarOrder.indexOf(a.id);
                    const idxB = sidebarOrder.indexOf(b.id);
                    return (idxA === -1 ? 99 : idxA) - (idxB === -1 ? 99 : idxB);
                  })
                  .map((item, idx, arr) => (
                    <div key={item.key} className="py-2.5 flex items-center justify-between gap-4 first:pt-0 last:pb-0">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-0.5">
                          <button
                            type="button"
                            onClick={() => handleShiftSidebarItem(item.id, -1)}
                            disabled={idx === 0}
                            title="Move segment Up in Sidebar"
                            className="p-1 rounded hover:bg-stone-200 dark:hover:bg-[#251a12] disabled:opacity-30 disabled:pointer-events-none text-stone-600 dark:text-stone-300 transition-colors cursor-pointer"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleShiftSidebarItem(item.id, 1)}
                            disabled={idx === arr.length - 1}
                            title="Move segment Down in Sidebar"
                            className="p-1 rounded hover:bg-stone-200 dark:hover:bg-[#251a12] disabled:opacity-30 disabled:pointer-events-none text-stone-600 dark:text-stone-300 transition-colors cursor-pointer"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <span className="font-bold text-xs text-stone-900 dark:text-stone-100">
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
                        <div className="w-9 h-5 bg-stone-300 peer-focus:outline-none rounded-full peer dark:bg-[#322318] peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-600"></div>
                      </label>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB: SUBSCRIPTION & PAYMENT PLANS (4 TIERS)                               */}
          {/* ========================================================================= */}
          {activeTab === 'subscription' && (
            <div className="space-y-6">
              <div className="pb-2 border-b border-stone-200 dark:border-[#382518]">
                <h4 className="text-lg font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                  <Crown className="w-4 h-4 text-amber-500" />
                  <span>Plans &amp; Pricing</span>
                </h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {SUBSCRIPTION_TIERS.map((tier) => (
                  <div
                    key={tier.id}
                    className={`p-4 rounded-xl border flex flex-col justify-between ${
                      tier.highlight
                        ? 'border-amber-500 bg-amber-500/10 dark:bg-[#231912] ring-2 ring-amber-500/20'
                        : 'border-stone-200 dark:border-[#382518] bg-white dark:bg-[#18110c]'
                    }`}
                  >
                    <div>
                      <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-stone-100 dark:bg-[#251a12] text-stone-700 dark:text-stone-300 uppercase">
                        {tier.badge}
                      </span>
                      <h5 className="font-bold text-sm text-stone-900 dark:text-stone-100 mt-2">
                        {tier.name}
                      </h5>
                      <div className="my-2">
                        <div className="text-lg font-black font-mono text-stone-900 dark:text-stone-100">
                          {tier.priceAnnual === 0 ? '₹0 / Free' : `₹${tier.priceAnnual.toLocaleString('en-IN')} / yr`}
                        </div>
                        <div className="text-[11px] font-mono font-bold text-amber-700 dark:text-amber-400">
                          {tier.priceMonthly === 0 ? 'Forever Free Core Suite' : `Only ₹${tier.priceMonthly} / month`}
                        </div>
                      </div>
                      <p className="text-[11px] text-stone-500 dark:text-stone-400 line-clamp-2 mb-3">
                        {tier.description}
                      </p>
                      <ul className="space-y-1.5 text-[10.5px]">
                        {tier.features.slice(0, 6).map((f, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <Check className="w-3 h-3 text-amber-600 shrink-0 mt-0.5" />
                            <span className="text-stone-700 dark:text-stone-300">{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                      <button
                        type="button"
                        onClick={() => {
                          localStorage.setItem('medden_user_tier', tier.id);
                          setSavedFeedback(true);
                          setTimeout(() => setSavedFeedback(false), 1500);
                        }}
                        className={`mt-4 w-full py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          tier.highlight
                            ? 'themed-accent-btn bg-amber-600 hover:bg-amber-700 text-white'
                            : 'bg-stone-200 dark:bg-[#251a12] hover:bg-stone-300 dark:hover:bg-[#322318] text-stone-800 dark:text-stone-200'
                        }`}
                      >
                        {tier.priceMonthly === 0 ? 'Current Free' : `Select ${tier.name}`}
                      </button>
                    </div>
                  ))}
              </div>

              {/* Receiving Payout Account Configuration (Direct UPI, Net Banking & Card Settlement) */}
              <form
                onSubmit={handleSavePayoutConfig}
                className="rounded-2xl border border-stone-200 dark:border-[#382518] bg-white dark:bg-[#1a120d] p-4 sm:p-5 space-y-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-200/80 dark:border-[#352317] pb-3">
                  <div>
                    <h5 className="text-xs sm:text-sm font-bold text-stone-900 dark:text-stone-100">
                      Creator Receiving Account &amp; Direct Settlement Setup
                    </h5>
                    <p className="text-[11px] text-stone-500 dark:text-stone-400">
                      Payments via UPI QR (with Ach1ev logo), Debit/Credit Card, and Net Banking route directly to these details.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => window.dispatchEvent(new CustomEvent('achiev_open_subscription'))}
                    className="themed-accent-btn px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold cursor-pointer shrink-0"
                  >
                    Open Payment Checkout
                  </button>
                </div>

                {payoutSavedMsg && (
                  <div className="p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/35 text-emerald-700 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>{payoutSavedMsg}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-stone-600 dark:text-stone-300 block mb-1">
                      Account Holder / Beneficiary Name
                    </label>
                    <input
                      type="text"
                      required
                      value={payoutConfig.accountName}
                      onChange={(e) => setPayoutConfig((p) => ({ ...p, accountName: e.target.value }))}
                      className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-[#382518] bg-stone-50 dark:bg-[#120c08] text-xs outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-stone-600 dark:text-stone-300 block mb-1">
                      Receiving UPI ID (Used for live QR &amp; UPI Apps)
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="yourname@okicici"
                      value={payoutConfig.upiId}
                      onChange={(e) => setPayoutConfig((p) => ({ ...p, upiId: e.target.value }))}
                      className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-[#382518] bg-stone-50 dark:bg-[#120c08] text-xs font-mono outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-stone-600 dark:text-stone-300 block mb-1">
                      Bank Name
                    </label>
                    <input
                      type="text"
                      value={payoutConfig.bankName}
                      onChange={(e) => setPayoutConfig((p) => ({ ...p, bankName: e.target.value }))}
                      className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-[#382518] bg-stone-50 dark:bg-[#120c08] text-xs outline-none focus:border-amber-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[11px] font-semibold text-stone-600 dark:text-stone-300 block mb-1">
                        Account Number
                      </label>
                      <input
                        type="text"
                        value={payoutConfig.accountNumber}
                        onChange={(e) => setPayoutConfig((p) => ({ ...p, accountNumber: e.target.value }))}
                        className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-[#382518] bg-stone-50 dark:bg-[#120c08] text-xs font-mono outline-none focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-stone-600 dark:text-stone-300 block mb-1">
                        IFSC Code
                      </label>
                      <input
                        type="text"
                        value={payoutConfig.ifscCode}
                        onChange={(e) => setPayoutConfig((p) => ({ ...p, ifscCode: e.target.value.toUpperCase() }))}
                        className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-[#382518] bg-stone-50 dark:bg-[#120c08] text-xs font-mono outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="themed-accent-btn px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold cursor-pointer shadow-xs"
                  >
                    Save Receiving Account
                  </button>
                </div>
              </form>
            </div>
          )}
          {/* ========================================================================= */}
          {activeTab === 'customizer' && (
            <div className="space-y-6">
              <div className="pb-2 border-b border-stone-200 dark:border-[#382518]">
                <h4 className="text-lg font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>Student Customizer</span>
                </h4>
              </div>

              {/* Deep Study & Distraction Controls */}
              <div className="p-4 rounded-2xl bg-stone-50/80 dark:bg-[#18110c] border border-stone-200/90 dark:border-[#382518] space-y-4">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <span className="text-xs font-bold text-stone-800 dark:text-stone-200">
                    Deep Study & Focus Protections
                  </span>
                </div>

                {/* Distraction Free Toggle */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-[#140e0a] border border-stone-200/80 dark:border-[#352317]">
                  <div className="pr-4">
                    <div className="text-xs font-semibold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-amber-500" />
                      <span>Distraction-Free Deep Note Mode</span>
                    </div>
                    <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
                      Automatically soft-dim non-essential side panels and widgets while actively taking medical notes.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleToggleDistractionFree}
                    className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer shrink-0 ${
                      distractionFree ? 'bg-[#A47C43]' : 'bg-stone-300 dark:bg-[#322318]'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-white transition-transform transform shadow-2xs absolute top-1 ${
                        distractionFree ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                {/* Auto-Save Frequency */}
                <div>
                  <label className="block text-[11px] font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
                    Note Auto-Save Cadence:
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { id: 'instant', label: 'Instant (Keystroke)' },
                      { id: '30s', label: 'Every 30 Seconds' },
                      { id: '60s', label: 'Every 60 Seconds' },
                      { id: 'manual', label: 'Manual Only (⌘S)' },
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => handleUpdateAutoSave(opt.id)}
                        className={`p-2 rounded-xl text-xs font-medium border text-center transition-all cursor-pointer ${
                          autoSaveFreq === opt.id
                            ? 'themed-accent-btn bg-[#A47C43] text-white border-[#A47C43] shadow-2xs font-semibold'
                            : 'bg-white dark:bg-[#140e0a] text-stone-700 dark:text-stone-300 border-stone-200 dark:border-[#352317] hover:border-stone-400 dark:hover:border-[#4b3322]'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* 3. Daily Clinical Target Goals */}
              <div className="p-4 rounded-2xl bg-stone-50/80 dark:bg-[#18110c] border border-stone-200/90 dark:border-[#382518] space-y-4">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <span className="text-xs font-bold text-stone-800 dark:text-stone-200">
                    Clinical Exam & Daily Target Goals
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Daily Study Hours */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-[11px] font-semibold text-stone-700 dark:text-stone-300">
                        Daily Focus Hours Target:
                      </label>
                      <span className="text-xs font-bold font-mono text-amber-700 dark:text-amber-400">{dailyHoursGoal} hrs/day</span>
                    </div>
                    <div className="grid grid-cols-5 gap-1.5">
                      {[3, 4, 5, 6, 8].map((h) => (
                        <button
                          key={h}
                          type="button"
                          onClick={() => handleUpdateDailyHours(h)}
                          className={`py-1.5 rounded-lg text-xs font-medium border text-center transition-all cursor-pointer ${
                            dailyHoursGoal === h
                              ? 'themed-tab-active bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 font-bold shadow-2xs'
                              : 'bg-white dark:bg-[#140e0a] text-stone-700 dark:text-stone-300 border-stone-200 dark:border-[#352317] hover:border-stone-400 dark:hover:border-[#4b3322]'
                          }`}
                        >
                          {h}h
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Daily QBank Questions */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-[11px] font-semibold text-stone-700 dark:text-stone-300">
                        Daily USMLE / MCQ Questions:
                      </label>
                      <span className="text-xs font-bold font-mono text-amber-600 dark:text-amber-400">{dailyQBankGoal} Qs</span>
                    </div>
                    <div className="grid grid-cols-5 gap-1.5">
                      {[20, 40, 60, 80, 100].map((q) => (
                        <button
                          key={q}
                          type="button"
                          onClick={() => handleUpdateDailyQBank(q)}
                          className={`py-1.5 rounded-lg text-xs font-medium border text-center transition-all cursor-pointer ${
                            dailyQBankGoal === q
                              ? 'themed-accent-btn bg-amber-600 text-white font-bold shadow-2xs'
                              : 'bg-white dark:bg-[#140e0a] text-stone-700 dark:text-stone-300 border-stone-200 dark:border-[#352317] hover:border-stone-400 dark:hover:border-[#4b3322]'
                          }`}
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* 4. Keyboard Shortcuts Cheatsheet */}
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
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 4: STUDENT PROFILE (AVATAR UPLOAD + @USERNAME SLAB)                   */}
          {/* ========================================================================= */}
          {activeTab === 'profile' && (
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="pb-2 border-b border-stone-200 dark:border-[#382518]">
                <h4 className="text-lg font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                  <User className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <span>Student Profile</span>
                </h4>
              </div>

              {/* Profile Picture Upload Card */}
              <div className="p-4 rounded-2xl bg-stone-50 dark:bg-[#18110c] border border-stone-200 dark:border-[#382518] flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  {profileForm.avatarUrl ? (
                    <img
                      src={profileForm.avatarUrl}
                      alt={profileForm.name}
                      className="w-16 h-16 rounded-2xl object-cover ring-2 ring-amber-500/40 shadow-sm"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-2xl bg-amber-600/15 text-amber-800 dark:text-amber-300 font-bold text-xl flex items-center justify-center border border-amber-500/30">
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
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-mono font-bold text-amber-700 dark:text-amber-400">
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
              <div className="pb-2 border-b border-stone-200 dark:border-[#382518]">
                <h4 className="text-lg font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                  <RotateCcw className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <span>Backup &amp; Reset</span>
                </h4>
              </div>
              {/* Google AI Studio Export Card */}
              <div className="p-4 rounded-xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/90 dark:border-amber-900/50 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-lg bg-amber-500/20 text-amber-700 dark:text-amber-300">
                      <Sparkles className="w-4 h-4" />
                    </span>
                    <div>
                      <h4 className="text-xs font-bold text-amber-950 dark:text-amber-200">
                        Export to Google AI Studio
                      </h4>
                      <p className="text-[11px] text-amber-800/80 dark:text-amber-300/80">
                        Full-stack workspace bundle with server, Flowcharts, Leisure Atelier & Gemini API
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-200/60 dark:bg-amber-900/60 text-amber-900 dark:text-amber-300 font-semibold">
                    Applet Ready
                  </span>
                </div>

                <div className="p-2.5 rounded-lg bg-white/70 dark:bg-[#1a1714] border border-amber-200/60 dark:border-amber-900/40 text-[11px] font-mono flex items-center justify-between">
                  <div className="truncate">
                    <span className="text-stone-500 dark:text-stone-400">Applet ID: </span>
                    <span className="font-semibold text-stone-800 dark:text-amber-200">0087218c-d7d0-4ad0-b0df-2e515051e7a0</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyAppletId}
                    title="Copy Applet ID"
                    className="ml-2 px-2 py-1 rounded bg-stone-100 hover:bg-stone-200 dark:bg-[#251a12] dark:hover:bg-[#322318] text-stone-700 dark:text-stone-300 flex items-center gap-1 text-[10px] transition-colors cursor-pointer"
                  >
                    {copiedAppletId ? <Check className="w-3 h-3 text-amber-600 dark:text-amber-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedAppletId ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <a
                    href="/api/export/aistudio"
                    download="MedDen-AI-Studio-Export.zip"
                    className="px-3.5 py-1.5 bg-amber-700 hover:bg-amber-800 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download AI Studio Bundle (.zip)</span>
                  </a>

                  <a
                    href="https://aistudio.google.com/app/applet/0087218c-d7d0-4ad0-b0df-2e515051e7a0"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-1.5 bg-stone-200 dark:bg-[#251a12] hover:bg-stone-300 dark:hover:bg-[#322318] text-stone-800 dark:text-stone-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Open in AI Studio ↗</span>
                  </a>

                  {onOpenAIStudioModal && (
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onOpenAIStudioModal();
                      }}
                      className="px-3.5 py-1.5 bg-amber-500/15 hover:bg-amber-500/25 text-amber-800 dark:text-amber-300 rounded-xl text-xs font-semibold flex items-center gap-1.5 border border-amber-500/40 transition-colors cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      <span>Share Center & Links</span>
                    </button>
                  )}
                </div>

                <div className="text-[10px] text-stone-600 dark:text-stone-400 space-y-1 bg-amber-500/5 p-2 rounded-lg border border-amber-500/10">
                  <p className="font-semibold text-stone-700 dark:text-stone-300">How to use in Google AI Studio:</p>
                  <ol className="list-decimal list-inside space-y-0.5">
                    <li>Download the <strong>MedDen-AI-Studio-Export.zip</strong> bundle above.</li>
                    <li>Go to <a href="https://aistudio.google.com" target="_blank" rel="noreferrer" className="underline font-medium text-amber-700 dark:text-amber-400">Google AI Studio</a>.</li>
                    <li>Click <strong>New Applet</strong> or import project archive, then upload the ZIP.</li>
                    <li>All modules (Atelier, Flowcharts, 10 Peace Sounds, Notes) are immediately active.</li>
                  </ol>
                </div>
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
                    Account &amp; Workspace Session
                  </h4>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400">
                    {user?.email ? `Signed in as ${user.email}` : 'Local browser session · Sign out to return to Login screen'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleSettingsLogout}
                  className="px-4 py-1.5 rounded-xl bg-[#7f1d1d] hover:bg-[#962d32] text-[#fdf2f2] text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Log Out</span>
                </button>
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
