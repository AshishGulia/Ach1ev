import {
  BookOpen,
  BookOpenText,
  CalendarDays,
  Cat,
  Layers,
  PenTool,
  Palette,
  Settings,
  Sparkles,
  Users,
  type LucideIcon,
} from 'lucide-react';

export interface DemoSection {
  key: string;
  label: string;
  icon: LucideIcon;
  accent: string;
}

export type DemoAnchor = 'nav' | 'header' | number;

export interface DemoPanel {
  title: string;
  badge?: string;
  kind?: 'tracker' | 'calendar' | 'sticky' | 'reminders' | 'split-left' | 'split-right' | 'note-paper' | 'almirah' | 'tree' | 'feed' | 'themes' | 'settings';
  rows: string[];
}

export interface DemoScene {
  section: DemoSection;
  title: string;
  caption: string;
  hint: string;
  tablet: { heading: string; subheading: string; cards: [string, string, string]; anchor: DemoAnchor };
  laptop: { heading: string; crumb: string; panels: [DemoPanel, DemoPanel, DemoPanel]; anchor: DemoAnchor };
}

/* Default Theme 1 Sidebar & Accent Palette (Walnut #18110c + Heritage Brass #A47C43 + Archival Sage #5B6D5B) */
const cockpit: DemoSection = { key: 'cockpit', label: 'Cockpit', icon: Sparkles, accent: '#A47C43' };
const read: DemoSection = { key: 'read', label: 'Read', icon: BookOpenText, accent: '#8F5F2C' };
const notes: DemoSection = { key: 'notes', label: 'Create Note', icon: PenTool, accent: '#7D552A' };
const calendar: DemoSection = { key: 'calendar', label: 'Calendar', icon: CalendarDays, accent: '#5B6D5B' };
const shelf: DemoSection = { key: 'shelf', label: 'Shelf', icon: Cat, accent: '#A47C43' };
const mnemonics: DemoSection = { key: 'mnemonics', label: 'Mnemonics', icon: Layers, accent: '#8F5F2C' };
const hub: DemoSection = { key: 'hub', label: "Achiever's Hub", icon: Users, accent: '#5B6D5B' };
const themes: DemoSection = { key: 'themes', label: 'Themes', icon: Palette, accent: '#A47C43' };
const settings: DemoSection = { key: 'settings', label: 'Settings', icon: Settings, accent: '#775734' };

export const DEMO_SECTIONS: DemoSection[] = [
  cockpit,
  read,
  notes,
  calendar,
  shelf,
  mnemonics,
  hub,
  themes,
  settings,
];

export const DEMO_SCENES: DemoScene[] = [
  {
    section: cockpit,
    title: 'Default Theme 1 · Cockpit Dashboard',
    caption: 'Trackers, Academic Calendar, 3D yellow Tasks sticky note, Reminders, and Favourites on Heritage Ivory.',
    hint: 'Click + to log tracker progress',
    tablet: {
      heading: 'Cockpit · Today',
      subheading: 'Daily MCQ · Image Qs · 05:00:00',
      cards: ['Daily MCQ · 32 / 40 logged', 'Image Questions · 14 / 20 logged', 'Tasks sticky note · 2 / 4 done'],
      anchor: 1,
    },
    laptop: {
      heading: 'Today',
      crumb: 'Cockpit · Heritage Ivory',
      panels: [
        {
          title: 'Academic Calendar',
          badge: '2 sessions',
          kind: 'calendar',
          rows: ['08:30 AM — Medicine Ward Rounds', '02:00 PM — Pharmacology Seminar', 'Thu 16 · Internal Exam Prep'],
        },
        {
          title: 'Tasks',
          badge: '2 / 4',
          kind: 'sticky',
          rows: ['Revise Brachial Plexus branches', 'Finish KDT NSAIDs summary', 'Solve 30 Pathology PYQs'],
        },
        {
          title: 'Reminders',
          badge: '+ New',
          kind: 'reminders',
          rows: ['09:00 AM · Eye Rest 20-20-20', '06:00 PM · Clinical Case Log', '09:30 PM · Night Revision'],
        },
      ],
      anchor: 1,
    },
  },
  {
    section: read,
    title: 'Side-by-Side Reading Studio',
    caption: 'Compare your main textbook beside an attached PDF, EPUB, or Drive file with the live resize joystick.',
    hint: 'Snip quote straight into Create Note',
    tablet: {
      heading: 'Read Studio · Split View',
      subheading: 'Day · Sepia · Night · Ink controls',
      cards: ["MAIN · Harrison's Ch. 14", 'ATTACHED · Robbins Path PDF', 'Snip quote to active notebook'],
      anchor: 0,
    },
    laptop: {
      heading: 'Dual Textbook Desk',
      crumb: 'Read Studio · 50% | 50%',
      panels: [
        {
          title: 'MAIN BOOK · Medicine',
          badge: 'Ch 14 / 42',
          kind: 'split-left',
          rows: ['Heart Failure Pathophysiology', 'Frank-Starling curve & preload', 'Core Pearl: ACEi lowers mortality'],
        },
        {
          title: 'ATTACHED · PDF',
          badge: 'Google Drive',
          kind: 'split-right',
          rows: ['Robbins Pathology Ch. 6', 'Myocardial necrosis timeline', 'Drag center joystick to resize'],
        },
        {
          title: 'Reading Controls',
          badge: 'Theme 1',
          kind: 'themes',
          rows: ['Day / Sepia / Night modes', 'Ink / White / Sepia text tint', 'One-click Add to Note'],
        },
      ],
      anchor: 1,
    },
  },
  {
    section: notes,
    title: 'Create Note · Book Beside Ruled Paper',
    caption: 'Write on continuous full-page thin-ruled ivory paper with shelf reference open beside you and Picture-to-Table.',
    hint: 'Save Note directly to your cloud notebooks',
    tablet: {
      heading: 'Create Note',
      subheading: 'Ruled Thin · Domine & Caveat Brush',
      cards: ['Autonomic Drugs Comparison', 'Lines: Full page continuous', 'Save Note to Shelf'],
      anchor: 2,
    },
    laptop: {
      heading: 'Untitled Clinical Note',
      crumb: 'Create Note · Ruled Paper',
      panels: [
        {
          title: 'Shelf Book Reference',
          badge: 'Open beside note',
          kind: 'split-left',
          rows: ['KDT Essentials Pharmacology', 'Ch. 8 · Cholinergic Antagonists', 'Snip diagram onto paper'],
        },
        {
          title: 'Ruled Sheet',
          badge: 'Save Note',
          kind: 'note-paper',
          rows: ['Atropine · M1-M5 competitive block', 'Mydriasis, dry mouth, tachycardia', 'Antidote: Physostigmine passes BBB'],
        },
        {
          title: 'Smart Tools',
          badge: 'Ribbon',
          kind: 'settings',
          rows: ['Font & Highlight palette', 'Lines & Red Margin toggle', 'Picture-to-Table extractor'],
        },
      ],
      anchor: 1,
    },
  },
  {
    section: calendar,
    title: 'Academic Calendar & Habit Trackers',
    caption: 'Keep clinical ward postings, subject revision goals, and countdown deadlines unified inside Cockpit.',
    hint: 'Switch weekly date pills or add new task',
    tablet: {
      heading: 'Calendar & Trackers',
      subheading: 'NEET-PG Countdown · 42 days',
      cards: ['Mon · Surgery Ward Posting', 'Tue · Pharmacology Revision', '5-day MCQ streak active'],
      anchor: 0,
    },
    laptop: {
      heading: 'Calendar & Trackers',
      crumb: 'Roster · Trackers',
      panels: [
        {
          title: 'Daily Trackers',
          badge: '3 active',
          kind: 'tracker',
          rows: ['Daily MCQ: 32 / 40 done (80%)', 'Image Questions: 14 / 20 done', 'Focus Timer: 05:00:00 target'],
        },
        {
          title: 'Clinical Postings',
          badge: 'This week',
          kind: 'calendar',
          rows: ['08:00 AM · General Medicine', '11:30 AM · Case Presentation', '04:00 PM · ECG Interpretation'],
        },
        {
          title: 'Exam Countdown',
          badge: 'Pinned',
          kind: 'reminders',
          rows: ['Final Proff · 42 days left', 'Grand Test 04 · Sunday 9 AM', 'Daily Study Goal · 6.5 hrs'],
        },
      ],
      anchor: 0,
    },
  },
  {
    section: shelf,
    title: '3D Bookshelf · Almirah Bay',
    caption: 'Open Classic Walnut, Creamy Caramel glass doors, Vanilla bi-fold, or the Obsidian vault with your walking study cat.',
    hint: 'Click glass door to unlock and open shelf',
    tablet: {
      heading: 'Shelf · Classic Walnut',
      subheading: 'Upper 2 sections · Lower cabinet',
      cards: ['Classic Walnut · Open plinth', 'Creamy Caramel · Clear glass', 'Library Catalog & Flowcharts'],
      anchor: 1,
    },
    laptop: {
      heading: '3D Almirah Room',
      crumb: 'Shelf · Classic Walnut',
      panels: [
        {
          title: 'Upper Section I',
          badge: 'Unlocked',
          kind: 'almirah',
          rows: ['BD Chaurasia Anatomy', 'Guyton Physiology', 'Harper Biochemistry'],
        },
        {
          title: 'Upper Section II',
          badge: 'Clear Glass',
          kind: 'almirah',
          rows: ['Robbins Pathology', 'KDT Pharmacology', 'Custom Folder · PYQs'],
        },
        {
          title: 'Cabinet Controls',
          badge: '5 Designs',
          kind: 'themes',
          rows: ['Creamy Caramel Wood Doors', 'Natural Slow Door Hinge', 'Library · Flowcharts'],
        },
      ],
      anchor: 1,
    },
  },
  {
    section: mnemonics,
    title: 'Mnemonics & Diagnostic Flowcharts',
    caption: 'Organize high-yield recall folders and zoomable clinical algorithm trees with peer-reviewed source links.',
    hint: 'Switch between Tree canvas and Info view',
    tablet: {
      heading: 'Mnemonics & Flowcharts',
      subheading: 'Tree canvas · Pinch-zoomable',
      cards: ['Chest Pain Clinical Workup', 'Brachial Plexus Branches', 'PubMed & Harrison links'],
      anchor: 0,
    },
    laptop: {
      heading: 'Flowchart & Recall Studio',
      crumb: 'Mnemonics · Tree View',
      panels: [
        {
          title: 'Folder Decks',
          badge: 'Icon folders',
          kind: 'feed',
          rows: ['Pharmacology · Sympathomimetics', 'Anatomy · Cranial Nerves', 'Pathology · Vasculitides'],
        },
        {
          title: 'Algorithm Tree',
          badge: 'Expandable',
          kind: 'tree',
          rows: ['Acute Chest Pain → ECG 10 min', 'STEMI vs NSTEMI → Troponin I', 'Verified Source: AHA Guidelines'],
        },
        {
          title: 'Active Recall',
          badge: 'Info View',
          kind: 'note-paper',
          rows: ['Node Pearl & Drug Dose', 'One-click Save to Notebook', 'Expand Fullscreen Canvas'],
        },
      ],
      anchor: 1,
    },
  },
  {
    section: hub,
    title: "Achiever's Hub · Study Circles",
    caption: 'Collaborate inside subject circles, post high-yield clinical pearls, and save classmates notes straight to yours.',
    hint: 'Save clinical pearl to your notebook',
    tablet: {
      heading: "Achiever's Hub",
      subheading: 'Medical study circles',
      cards: ['Pharmacology Circle · 128 peers', 'Clinical Pearl · Beta-blockers', 'Save note to active sheet'],
      anchor: 2,
    },
    laptop: {
      heading: "Achiever's Hub",
      crumb: 'Community · Study Circles',
      panels: [
        {
          title: 'Subject Circles',
          badge: 'Joined',
          kind: 'feed',
          rows: ['Pharmacology · 128 members', 'Internal Medicine · 96 members', 'Surgery · 74 members'],
        },
        {
          title: 'Clinical Discussion',
          badge: 'Verified',
          kind: 'note-paper',
          rows: ['Beta-1 selective: A-B-E-A-M rule', 'DKA vs HHS anion gap pearl', 'Click Snip to save in Note'],
        },
        {
          title: 'Study Partners',
          badge: 'Circles',
          kind: 'reminders',
          rows: ['Evening 15-MCQ group sprint', 'Share Shelf folder links', 'Bookmark high-yield threads'],
        },
      ],
      anchor: 1,
    },
  },
  {
    section: themes,
    title: '5 Scenic Themes & 10 Abstract Wallpapers',
    caption: 'Pair Default Theme 1 Walnut & Ivory or 4 curated palettes with 5 Dark and 5 Light abstract wallpapers.',
    hint: 'Preview Day Sun or Night Moon backdrop',
    tablet: {
      heading: 'Themes & Wallpapers',
      subheading: '5 Dark · 5 Light abstract presets',
      cards: ['Theme 1 · Heritage Walnut (Default)', 'Warm Caramel Cloud Wallpaper', 'Espresso Ripple Dark Wallpaper'],
      anchor: 1,
    },
    laptop: {
      heading: 'Appearance & Leisure',
      crumb: 'Settings · Themes & Wallpapers',
      panels: [
        {
          title: 'Curated Themes',
          badge: '5 Palettes',
          kind: 'themes',
          rows: ['Theme 1 · Walnut & Ivory (Default)', 'Theme 2 · Twilight Sunset', 'Theme 4 · Slate & Cobalt'],
        },
        {
          title: 'Abstract Wallpapers',
          badge: '10 Presets',
          kind: 'feed',
          rows: ['Dark: Espresso Ripple · Nebula', 'Light: Warm Caramel · Rose Marble', 'Visible on Cockpit & Read'],
        },
        {
          title: 'Font Library',
          badge: '28 Fonts',
          kind: 'settings',
          rows: [
            'Handwriting: Annie · Caveat Brush · Patrick Hand',
            'Casual: Urbanist · Zen Maru Gothic · Cascadia Mono',
            'Official: Bodoni Moda · Bona Nova · Domine',
          ],
        },
      ],
      anchor: 1,
    },
  },
  {
    section: settings,
    title: 'Settings, Google Drive & Plans',
    caption: 'Customize sidebar order, connect Google Drive for large medical PDFs, and manage Achiev Pro via UPI or Card.',
    hint: 'Manage Profile, Cloud, Sidebar & Plans',
    tablet: {
      heading: 'Settings',
      subheading: 'Profile · Cloud · Sidebar · Goals · Plans',
      cards: ['Google Drive PDF Sync connected', 'Reorder sidebar sections', 'UPI QR · Cards · NetBanking'],
      anchor: 2,
    },
    laptop: {
      heading: 'Workspace Settings',
      crumb: 'Settings · Default Theme 1',
      panels: [
        {
          title: 'Navigation & Profile',
          badge: '5 Tabs',
          kind: 'settings',
          rows: ['Profile & Typography font', 'Sidebar · Drag to reorder', 'Goals · Study hours & breaks'],
        },
        {
          title: 'Cloud & Google Drive',
          badge: 'Synced',
          kind: 'split-right',
          rows: ['Personal PDF Vault connected', 'Notebook JSON cloud backup', 'Instant device sync'],
        },
        {
          title: 'Achiev Plans',
          badge: 'UPI · Card',
          kind: 'reminders',
          rows: ['UPI QR with Achiev emblem', 'NetBanking & Debit/Credit Card', 'Razorpay · Cashfree ready'],
        },
      ],
      anchor: 2,
    },
  },
];

export const HEADER_BOOK_ICON = BookOpen;
