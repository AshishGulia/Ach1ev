import {
  BookOpenText,
  CalendarDays,
  Cat,
  Eye,
  Layers,
  PenTool,
  Palette,
  Settings,
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
  rows: string[];
}

export interface DemoScene {
  section: DemoSection;
  title: string;
  caption: string;
  hint: string;
  tablet: { heading: string; cards: [string, string, string]; anchor: DemoAnchor };
  laptop: { heading: string; panels: [DemoPanel, DemoPanel, DemoPanel]; anchor: DemoAnchor };
}

const cockpit: DemoSection = { key: 'cockpit', label: 'Cockpit', icon: Eye, accent: '#B45309' };
const read: DemoSection = { key: 'read', label: 'Read', icon: BookOpenText, accent: '#0369A1' };
const notes: DemoSection = { key: 'notes', label: 'Notes', icon: PenTool, accent: '#047857' };
const calendar: DemoSection = { key: 'calendar', label: 'Calendar', icon: CalendarDays, accent: '#0F766E' };
const shelf: DemoSection = { key: 'shelf', label: 'Shelf', icon: Cat, accent: '#A16207' };
const mnemonics: DemoSection = { key: 'mnemonics', label: 'Mnemonics', icon: Layers, accent: '#BE123C' };
const hub: DemoSection = { key: 'hub', label: "Achiever's Hub", icon: Users, accent: '#0E7490' };
const themes: DemoSection = { key: 'themes', label: 'Themes', icon: Palette, accent: '#9A3412' };
const settings: DemoSection = { key: 'settings', label: 'Settings', icon: Settings, accent: '#57534E' };

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
    title: 'Your Cockpit at a glance',
    caption:
      "Open Cockpit to see today's study hours, notebook progress and streak in one view. Use the Eye Timer in the header to set 20-20-20 breaks.",
    hint: 'Set your Eye Timer break',
    tablet: { heading: 'Today', cards: ['Study time: 3h 40m', 'Notebooks: 14 active', 'Streak: 92%'], anchor: 'header' },
    laptop: {
      heading: 'Cockpit overview',
      panels: [
        { title: 'Study momentum', rows: ['Pharmacology: 2h 10m', 'Pathology: 1h 30m', 'Clinical notes: 12 pages'] },
        { title: 'Eye Rest Timer', rows: ['Next break in 19:42', 'Gentle chime is on'] },
        { title: 'Quick launch', rows: ['Create a note', 'Open Read', 'Calendar tasks'] },
      ],
      anchor: 'header',
    },
  },
  {
    section: read,
    title: 'Read two books side by side',
    caption:
      'Upload PDF, Word or EPUB textbooks in Read, then open two side by side to compare pathology and pharmacology without switching tabs.',
    hint: 'Open a second book beside it',
    tablet: {
      heading: 'Textbook desk',
      cards: ["Harrison's Internal Medicine (PDF)", 'Robbins Pathology (EPUB)', 'Lecture slides (DOCX)'],
      anchor: 'nav',
    },
    laptop: {
      heading: 'Read, side by side',
      panels: [
        { title: "Harrison's, page 412", rows: ['Heart failure section', 'Zoom and highlight'] },
        { title: 'Robbins, chapter 6', rows: ['Cardiac pathology', 'Figure ready to snip'] },
        { title: 'Highlights', rows: ['3 yellow highlights', 'Send to notes'] },
      ],
      anchor: 1,
    },
  },
  {
    section: notes,
    title: 'Keep a book beside your notes',
    caption:
      'Open a book from your Shelf right beside your ruled note page. Use Picture-to-Table to turn a textbook photo into an editable table.',
    hint: 'Picture-to-Table makes a table',
    tablet: {
      heading: 'New note',
      cards: ['Ruled page: Pharmacology', 'Book open beside note', 'Picture-to-Table ready'],
      anchor: 2,
    },
    laptop: {
      heading: 'Create note',
      panels: [
        { title: 'From your Shelf', rows: ['KDT Pharmacology', 'Open beside the note'] },
        { title: 'Ruled note', rows: ['Drug, mechanism, side effect', 'Atropine: dry mouth'] },
        { title: 'Lecture dock', rows: ['Pinned at the bottom', 'Keeps playing while you write'] },
      ],
      anchor: 1,
    },
  },
  {
    section: calendar,
    title: 'Plan trackers and clinical postings',
    caption:
      'Add subject revision trackers, daily habit checklists and ward postings to your calendar. Keep exam dates on the same page as your day.',
    hint: 'Add a habit tracker',
    tablet: {
      heading: 'Calendar',
      cards: ['Revise 40 anatomy MCQs', 'Medicine ward posting: 8 AM', 'NEET-PG: 42 days to go'],
      anchor: 0,
    },
    laptop: {
      heading: 'Calendar and trackers',
      panels: [
        { title: 'Habit trackers', rows: ['Anatomy MCQs: 5 day streak', 'Anki cards: 20 min'] },
        { title: 'This week', rows: ['Mon: Surgery', 'Tue: Medicine', 'Wed: OBG'] },
        { title: 'Deadlines', rows: ['NEET-PG: 42 days', 'Ward posting: Friday'] },
      ],
      anchor: 0,
    },
  },
  {
    section: shelf,
    title: 'Stack books on a 3D almirah',
    caption:
      'Pick up a book and drop it into another compartment. Unlock the glass doors or open the steel vault, and pet the study cat when you need a break.',
    hint: 'Pick and drop a book',
    tablet: {
      heading: 'Almirah bay',
      cards: ['Glass Walnut: 3 books', 'Glass Caramel: open', 'Obsidian Vault: locked'],
      anchor: 1,
    },
    laptop: {
      heading: 'Shelf, 3D almirah',
      panels: [
        { title: 'Glass Walnut', rows: ['3 books on the shelf', 'Glass door unlocked'] },
        { title: 'Glass Caramel', rows: ['Book dropped here', 'Sliding glass front'] },
        { title: 'Obsidian Vault', rows: ['Turn the dial to open', 'Study cat is resting'] },
      ],
      anchor: 1,
    },
  },
  {
    section: mnemonics,
    title: 'Active-recall mnemonics and flowcharts',
    caption:
      'Browse subject-tagged mnemonics for anatomy, pathology and pharmacology. Build diagnostic flowcharts and drop them into your notes.',
    hint: 'Test yourself on this deck',
    tablet: {
      heading: 'Mnemonics: Pharmacology',
      cards: ['Autonomic drugs: 12 cards', 'Brachial plexus recall', 'Chest pain flowchart'],
      anchor: 0,
    },
    laptop: {
      heading: 'Mnemonics and flowcharts',
      panels: [
        { title: 'Recall deck', rows: ['Autonomic drugs: 12 cards', 'Due today: 5'] },
        { title: 'Flowchart', rows: ['Chest pain workup', '3 decision nodes'] },
        { title: 'Snip to notes', rows: ['One-click insert', 'Saved to your notebook'] },
      ],
      anchor: 0,
    },
  },
  {
    section: hub,
    title: "Study with classmates in Achiever's Hub",
    caption:
      "Open Achiever's Hub from the sidebar to join student circles, share clinical pearls and ask questions. Save useful posts straight into your notebook.",
    hint: 'Save this post to your notebook',
    tablet: {
      heading: "Achiever's Hub",
      cards: ['Pharmacology circle: 128 members', 'Pearl: beta-blocker tricks', 'Question: Kussmaul breathing'],
      anchor: 2,
    },
    laptop: {
      heading: "Achiever's Hub",
      panels: [
        { title: 'Circles', rows: ['Pharmacology: 128 members', 'Pathology: 84 members'] },
        { title: 'Discussion', rows: ['Clinical pearl by @studentdoc', '3 replies'] },
        { title: 'Study friends', rows: ['Search by @username', '2 new requests'] },
      ],
      anchor: 1,
    },
  },
  {
    section: themes,
    title: 'Five scenic themes, day or night',
    caption:
      'Pick from Marble, Twilight Sunset, Oceanic Horizon, Slate Grey and Cobalt, or Forest Emerald and Gold, then switch between Day Sun and Night Moon.',
    hint: 'Switch Day Sun and Night Moon',
    tablet: {
      heading: 'Themes',
      cards: ['Oceanic Horizon', 'Twilight Sunset', 'Forest Emerald and Gold'],
      anchor: 1,
    },
    laptop: {
      heading: 'Themes and leisure',
      panels: [
        { title: 'Palettes', rows: ['Marble', 'Twilight Sunset', 'Oceanic Horizon'] },
        { title: 'Mode', rows: ['Day Sun', 'Night Moon'] },
        { title: 'Leisure', rows: ['Ambient peace sounds', 'Plants and fireflies'] },
      ],
      anchor: 1,
    },
  },
  {
    section: settings,
    title: 'Tune your workspace and reach the developer',
    caption:
      'Reorder sidebar sections, connect your own Google Drive for large PDFs, or send feedback to the developer from the sidebar in one click.',
    hint: 'Send feedback in one click',
    tablet: {
      heading: 'Settings',
      cards: ['Sidebar order: most used first', 'Google Drive: connected', 'Talk to Developer'],
      anchor: 2,
    },
    laptop: {
      heading: 'Settings',
      panels: [
        { title: 'Sidebar order', rows: ['Most used first', 'Drag to reorder'] },
        { title: 'Cloud drive', rows: ['Google Drive connected', 'Offload large PDFs'] },
        { title: 'Feedback', rows: ['Talk to Developer', 'Attach a screenshot'] },
      ],
      anchor: 2,
    },
  },
];
