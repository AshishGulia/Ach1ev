import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  RotateCcw,
  Download,
  CheckCircle2,
  Eye,
  BookOpenText,
  PenTool,
  Table2,
  CalendarDays,
  Sparkles,
  Palette,
  Users,
  Settings as SettingsIcon,
  Cat,
  Layers,
  Award,
  ChevronDown,
  ChevronUp,
  Sun,
  Moon,
  Laptop,
  Tablet,
  ArrowRight,
  MousePointer,
} from 'lucide-react';
import { SUBSCRIPTION_TIERS } from '../../data/subscriptionData';

export interface ShowcaseSection {
  id: string;
  stepNum: string;
  sectionName: string;
  title: string;
  subtitle: string;
  durationSec: number;
  accent: string;
  accentSoft: string;
  tooltipTitle: string;
  tooltipBody: string;
  cursorStops: Array<{ atPct: number; xPct: number; yPct: number }>;
  highlights: string[];
  captions: Array<{ atPct: number; text: string }>;
  iconKey:
    | 'dashboard'
    | 'read'
    | 'note'
    | 'calendar'
    | 'shelf'
    | 'mnemonics'
    | 'hub'
    | 'themes'
    | 'settings';
}

export const PRODUCT_DEMO_SECTIONS: ShowcaseSection[] = [
  {
    id: 'sec-01-cockpit',
    stepNum: '01',
    sectionName: 'Cockpit Dashboard',
    title: 'Cockpit Dashboard & 20-20-20 Eye Rest Timer',
    subtitle: 'Track live study momentum, quick-launch subject slabs, daily task streaks, and built-in eye rest breaks from one sleek command desk.',
    durationSec: 9,
    accent: '#d97706',
    accentSoft: 'rgba(217, 119, 6, 0.22)',
    tooltipTitle: '20-20-20 Eye Rest Guard',
    tooltipBody: 'Gentle vision breaks calibrated for marathon study blocks.',
    cursorStops: [
      { atPct: 0, xPct: 26, yPct: 38 },
      { atPct: 45, xPct: 74, yPct: 30 },
      { atPct: 80, xPct: 54, yPct: 68 },
    ],
    highlights: [
      'Subject slab launcher & daily streak velocity',
      'Header 20-20-20 Eye Rest Timer with snooze control',
      'Live daily checklists synced across desktop & tablet',
    ],
    captions: [
      { atPct: 0, text: 'Launch subjects, track focus hours, and manage daily clinical tasks in your Cockpit Dashboard.' },
      { atPct: 45, text: 'Monitor your live 20-20-20 Eye Rest countdown right in the minimalist top bar.' },
    ],
    iconKey: 'dashboard',
  },
  {
    id: 'sec-02-reading',
    stepNum: '02',
    sectionName: 'Side-by-Side Reading',
    title: 'Side-by-Side PDF, DOCX & EPUB Reading Desk',
    subtitle: 'Open textbooks, class handouts, and pathology atlases beside each other without flipping windows.',
    durationSec: 10,
    accent: '#0ea5e9',
    accentSoft: 'rgba(14, 165, 233, 0.20)',
    tooltipTitle: 'Dual-Pane Textbook Sync',
    tooltipBody: 'Cross-reference Harrison’s & Robbins side by side and snip directly to notes.',
    cursorStops: [
      { atPct: 0, xPct: 30, yPct: 44 },
      { atPct: 45, xPct: 72, yPct: 46 },
      { atPct: 80, xPct: 50, yPct: 26 },
    ],
    highlights: [
      'Open PDF, Word (.docx) & EPUB textbooks directly',
      'Adjustable dual split panes for cross-referencing',
      'One-tap diagram capture sent straight into your notebook',
    ],
    captions: [
      { atPct: 0, text: 'Open two reference books simultaneously to verify pathology alongside clinical pharmacology.' },
      { atPct: 50, text: 'Snip high-yield textbook figures and lock them onto any study sheet.' },
    ],
    iconKey: 'read',
  },
  {
    id: 'sec-03-notes',
    stepNum: '03',
    sectionName: 'Smart Notes & Tables',
    title: 'Smart Notes, Custom Lines, Lockable Boxes & Picture-to-Table',
    subtitle: 'Ruled, dotted, or gridded paper with adjustable line spacing, lockable floating text boxes, image lock/delete handles, and Picture-to-Table capture.',
    durationSec: 11,
    accent: '#10b981',
    accentSoft: 'rgba(16, 185, 129, 0.20)',
    tooltipTitle: 'AI Picture-to-Table + Lock Handles',
    tooltipBody: 'Snap textbook charts into editable rows and lock boxes or photos in place.',
    cursorStops: [
      { atPct: 0, xPct: 28, yPct: 48 },
      { atPct: 42, xPct: 68, yPct: 42 },
      { atPct: 78, xPct: 64, yPct: 72 },
    ],
    highlights: [
      '30 Handwriting, Sans-Serif & Serif fonts + custom line gaps',
      'Movable floating text boxes & photos with Position Lock',
      'Picture-to-Table extracts printed charts into structured grids',
    ],
    captions: [
      { atPct: 0, text: 'Customize line spacing, color, and paper rhythm while keeping a reference book open beside your canvas.' },
      { atPct: 48, text: 'Extract textbook tables from photos and lock floating callout boxes cleanly on the sheet.' },
    ],
    iconKey: 'note',
  },
  {
    id: 'sec-04-calendar',
    stepNum: '04',
    sectionName: 'Calendar Trackers',
    title: 'Calendar Trackers, Habit Streaks & Timetable Scanner',
    subtitle: 'Organize ward postings, subject revision targets, and scan printed lecture schedules straight onto your interactive calendar.',
    durationSec: 9,
    accent: '#8b5cf6',
    accentSoft: 'rgba(139, 92, 246, 0.22)',
    tooltipTitle: 'Smart Timetable Scanner',
    tooltipBody: 'Convert timetable screenshots into recurring ward & exam blocks.',
    cursorStops: [
      { atPct: 0, xPct: 34, yPct: 36 },
      { atPct: 48, xPct: 68, yPct: 58 },
      { atPct: 82, xPct: 44, yPct: 74 },
    ],
    highlights: [
      'Daily MCQ & subject revision habit heatmaps',
      'Quick bottom-centered task entry on every dashboard',
      'Scan printed clinical duty rosters into calendar events',
    ],
    captions: [
      { atPct: 0, text: 'Track daily question bank streaks alongside exam countdown milestones.' },
      { atPct: 50, text: 'Drop ward postings and lecture blocks directly onto your weekly study grid.' },
    ],
    iconKey: 'calendar',
  },
  {
    id: 'sec-05-shelf',
    stepNum: '05',
    sectionName: '3D Bookshelf',
    title: 'Interactive 3D Almirah Library & Study Companion',
    subtitle: 'Arrange textbooks and notebooks inside glass-door wooden almirahs, steel vaults, backlit shelves, and unlock ambient study companionship.',
    durationSec: 10,
    accent: '#f59e0b',
    accentSoft: 'rgba(245, 158, 11, 0.22)',
    tooltipTitle: 'Drag & Drop 3D Cabinets',
    tooltipBody: 'Move volumes between Walnut, Caramel, Roman Arch & Steel vaults.',
    cursorStops: [
      { atPct: 0, xPct: 30, yPct: 42 },
      { atPct: 48, xPct: 56, yPct: 48 },
      { atPct: 82, xPct: 76, yPct: 76 },
    ],
    highlights: [
      '5 detailed cabinets with brass name banners',
      'Drag books across shelves or slide crystal glass doors',
      'Custom subject folders right inside your library space',
    ],
    captions: [
      { atPct: 0, text: 'Slide open glass doors on warm hardwood almirahs or unlock obsidian steel vaults.' },
      { atPct: 50, text: 'Move textbooks cleanly between compartments with instant cloud persistence.' },
    ],
    iconKey: 'shelf',
  },
  {
    id: 'sec-06-mnemonics',
    stepNum: '06',
    sectionName: 'Mnemonics & Flowcharts',
    title: 'Active-Recall Mnemonics & Expandable Diagnostic Flowcharts',
    subtitle: 'Sketch pan-and-zoom differential workup trees on a touch-friendly canvas and save high-yield memory triggers by subject.',
    durationSec: 9,
    accent: '#ec4899',
    accentSoft: 'rgba(236, 72, 153, 0.20)',
    tooltipTitle: 'Pinch-Zoom Algorithm Canvas',
    tooltipBody: 'Expand fullscreen to map complex clinical pathways without crowding.',
    cursorStops: [
      { atPct: 0, xPct: 38, yPct: 34 },
      { atPct: 48, xPct: 62, yPct: 54 },
      { atPct: 80, xPct: 48, yPct: 72 },
    ],
    highlights: [
      'Single streamlined ribbon on an expandable flowchart canvas',
      'Touch pinch-zoom & omnidirectional pan across mobile/tablet',
      'One-click export of clinical pathways into any study note',
    ],
    captions: [
      { atPct: 0, text: 'Group pharmacology and pathology memory hooks inside organized subject folders.' },
      { atPct: 50, text: 'Expand the flowchart canvas edge-to-edge to trace multi-branch diagnostic algorithms.' },
    ],
    iconKey: 'mnemonics',
  },
  {
    id: 'sec-07-hub',
    stepNum: '07',
    sectionName: "Achiever's Hub",
    title: "Achiever's Hub & Leisure Reset Wings",
    subtitle: "Collaborate with fellow medical scholars in Achiever's Hub or unwind inside curated Leisure wings with live Gemini world & medical news.",
    durationSec: 9,
    accent: '#14b8a6',
    accentSoft: 'rgba(20, 184, 166, 0.20)',
    tooltipTitle: 'Favorite Wings + Live Pulse',
    tooltipBody: 'Pin your top 3 Leisure wings and browse concise Inshorts-style news cards.',
    cursorStops: [
      { atPct: 0, xPct: 32, yPct: 40 },
      { atPct: 48, xPct: 66, yPct: 48 },
      { atPct: 82, xPct: 52, yPct: 70 },
    ],
    highlights: [
      "Peer notes, MCQ threads & study circles in Achiever's Hub",
      'Top-3 favorite Leisure wings bar + More Wings drawer',
      'Auto-updated Gemini medical & world briefings with sources',
    ],
    captions: [
      { atPct: 0, text: "Exchange high-yield pearls and shared clinical summaries inside Achiever's Hub." },
      { atPct: 48, text: 'Take mindful breaks with concise sourced news cards, reading journals, and ambient audio.' },
    ],
    iconKey: 'hub',
  },
  {
    id: 'sec-08-themes',
    stepNum: '08',
    sectionName: 'Custom Themes',
    title: 'Curated Day/Night Themes & Abstract Wallpapers',
    subtitle: 'Personalize every pixel with Forest Emerald & Gold, Ocean Horizon, Royal Blush & Plum, Muted Slate & Cobalt, plus 10 abstract wallpapers.',
    durationSec: 9,
    accent: '#84cc16',
    accentSoft: 'rgba(132, 204, 22, 0.20)',
    tooltipTitle: '5 Master Themes · 10 Wallpapers',
    tooltipBody: 'Switch light/dark atmospheres and crisp typography across every button.',
    cursorStops: [
      { atPct: 0, xPct: 28, yPct: 42 },
      { atPct: 48, xPct: 56, yPct: 36 },
      { atPct: 80, xPct: 72, yPct: 64 },
    ],
    highlights: [
      'Signature themes tuned with crisp contrast in Day & Night',
      '10 curated Dark & Light abstract workspace wallpapers',
      'Live opacity & surface harmony across mobile and desktop',
    ],
    captions: [
      { atPct: 0, text: 'Pick any curated color combo—from Forest Emerald & Gold to Muted Slate & Cobalt.' },
      { atPct: 50, text: 'Layer subtle dark or light abstract wallpapers with adjustable frosted opacity.' },
    ],
    iconKey: 'themes',
  },
  {
    id: 'sec-09-settings',
    stepNum: '09',
    sectionName: 'Settings',
    title: 'Typography Engine, Drive Vault & Settings Controls',
    subtitle: 'Apply 30 Handwriting, Sans-Serif & Serif fonts site-wide, connect Google Drive storage, and customize sidebar flow effortlessly.',
    durationSec: 9,
    accent: '#eab308',
    accentSoft: 'rgba(234, 179, 8, 0.20)',
    tooltipTitle: '30 Curated Fonts · Cloud Sync',
    tooltipBody: 'Change interface typography globally—from headers down to every badge.',
    cursorStops: [
      { atPct: 0, xPct: 28, yPct: 36 },
      { atPct: 48, xPct: 68, yPct: 46 },
      { atPct: 80, xPct: 54, yPct: 68 },
    ],
    highlights: [
      '30 categorized fonts applied universally across the app',
      'Personal Google Drive offloading for large medical PDFs',
      'Fast local-first PWA performance on mobile & desktop',
    ],
    captions: [
      { atPct: 0, text: 'Switch between Playfair Display, Lora, Inter, or Caveat across every view and button.' },
      { atPct: 50, text: 'Manage cloud backups, sidebar item ordering, and membership directly in Settings.' },
    ],
    iconKey: 'settings',
  },
];

const STUDY_FAQS = [
  {
    q: 'Can I read medical textbooks beside my notes while keeping lectures docked?',
    a: 'Yes. Open any PDF, Word (.docx), or EPUB file right next to your ruled clinical note sheet, snip diagrams directly in, and keep your study lecture pinned cleanly.',
  },
  {
    q: 'How does Picture-to-Table speed up pharmacology and pathology revision?',
    a: 'Upload or snap a photo of a classification table from a textbook or slide, and Ach1ev structures the rows into an editable grid directly on your note page.',
  },
  {
    q: 'Can I customize fonts, line spacing, and themes on mobile and desktop?',
    a: 'Yes. Choose from 30 Handwriting, Sans-Serif, and Serif fonts that propagate across every control, adjust paper line spacing and style, and switch among 5 signature Day/Night themes plus 10 abstract wallpapers.',
  },
  {
    q: 'Can I try Create Note immediately before signing up?',
    a: 'Yes. Click "Skip and create note" right below the login form to open a blank clinical sheet immediately, then sign in anytime to save and sync your notebooks.',
  },
];

function getSectionIcon(key: ShowcaseSection['iconKey']) {
  switch (key) {
    case 'dashboard':
      return Eye;
    case 'read':
      return BookOpenText;
    case 'note':
      return Table2;
    case 'calendar':
      return CalendarDays;
    case 'shelf':
      return Cat;
    case 'mnemonics':
      return Layers;
    case 'hub':
      return Users;
    case 'themes':
      return Palette;
    case 'settings':
      return SettingsIcon;
  }
}

export const FeatureVideoSeriesShowcase: React.FC = () => {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [autoAdvance, setAutoAdvance] = useState(true);
  const [uiThemeDark, setUiThemeDark] = useState(true);
  const [progressPct, setProgressPct] = useState(0);
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(0);
  const [exportingId, setExportingId] = useState<string | null>(null);
  const [exportMsg, setExportMsg] = useState<string | null>(null);
  const timerRef = useRef<number | null>(null);

  const section = PRODUCT_DEMO_SECTIONS[activeIdx] || PRODUCT_DEMO_SECTIONS[0]!;

  useEffect(() => {
    if (!isPlaying) return;
    const stepMs = 70;
    const increment = (stepMs / (section.durationSec * 1000)) * 100;

    timerRef.current = window.setInterval(() => {
      setProgressPct((prev) => {
        const next = prev + increment;
        if (next >= 100) {
          if (autoAdvance) {
            setActiveIdx((curr) => (curr + 1) % PRODUCT_DEMO_SECTIONS.length);
            return 0;
          }
          setIsPlaying(false);
          return 100;
        }
        return next;
      });
    }, stepMs);

    return () => {
      if (timerRef.current !== null) window.clearInterval(timerRef.current);
    };
  }, [isPlaying, activeIdx, autoAdvance, section.durationSec]);

  const currentCaption = useMemo(() => {
    let chosen = section.captions[0]?.text || section.subtitle;
    for (const c of section.captions) {
      if (progressPct >= c.atPct) chosen = c.text;
    }
    return chosen;
  }, [section, progressPct]);

  const activeCursor = useMemo(() => {
    let pos = section.cursorStops[0] || { xPct: 50, yPct: 50 };
    for (const stop of section.cursorStops) {
      if (progressPct >= stop.atPct) pos = stop;
    }
    return pos;
  }, [section, progressPct]);

  const selectSection = (idx: number) => {
    setActiveIdx(idx);
    setProgressPct(0);
    setIsPlaying(true);
  };

  const formatSec = (s: number) => {
    const whole = Math.max(0, Math.round(s));
    return `0:${String(whole).padStart(2, '0')}`;
  };

  const handleDownloadDemoClip = async () => {
    if (exportingId) return;
    if (typeof MediaRecorder === 'undefined') {
      setExportMsg('Showcase clip export requires a modern desktop or Android browser.');
      return;
    }

    const sec = section;
    setExportingId(sec.id);
    setExportMsg(`Rendering demo clip (${sec.stepNum}: ${sec.sectionName})...`);

    try {
      const canvas = document.createElement('canvas');
      canvas.width = 1280;
      canvas.height = 720;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Canvas unavailable');

      const stream = canvas.captureStream(30);
      const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
        ? 'video/webm;codecs=vp9'
        : 'video/webm';
      const recorder = new MediaRecorder(stream, { mimeType, videoBitsPerSecond: 2_500_000 });
      const chunks: BlobPart[] = [];
      recorder.ondataavailable = (ev) => {
        if (ev.data.size > 0) chunks.push(ev.data);
      };

      const donePromise = new Promise<Blob>((resolve) => {
        recorder.onstop = () => resolve(new Blob(chunks, { type: 'video/webm' }));
      });

      recorder.start();
      const totalFrames = 120;
      for (let f = 0; f <= totalFrames; f++) {
        const pct = (f / totalFrames) * 100;
        const grad = ctx.createLinearGradient(0, 0, 1280, 720);
        grad.addColorStop(0, '#1e1008');
        grad.addColorStop(1, '#0b0502');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 1280, 720);

        ctx.fillStyle = sec.accent;
        ctx.fillRect(64, 56, 84, 44);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 20px system-ui, sans-serif';
        ctx.fillText(sec.stepNum, 92, 85);

        ctx.fillStyle = '#fef3c7';
        ctx.font = 'bold 24px system-ui, sans-serif';
        ctx.fillText(`Ach1ev · ${sec.sectionName}`, 168, 86);

        ctx.fillStyle = 'rgba(255,255,255,0.06)';
        ctx.strokeStyle = sec.accent;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(64, 130, 1152, 460, 22);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#fffbeb';
        ctx.font = 'bold 34px system-ui, sans-serif';
        ctx.fillText(sec.title, 102, 200);

        ctx.fillStyle = '#d6c3a5';
        ctx.font = '21px system-ui, sans-serif';
        ctx.fillText(sec.subtitle.slice(0, 92), 102, 246);

        sec.highlights.forEach((hl, i) => {
          const active = pct >= i * 33;
          ctx.fillStyle = active ? sec.accentSoft : 'rgba(255,255,255,0.04)';
          ctx.beginPath();
          ctx.roundRect(102, 304 + i * 74, 1076, 56, 12);
          ctx.fill();
          ctx.fillStyle = active ? '#fde68a' : '#8a7a69';
          ctx.font = 'bold 20px system-ui, sans-serif';
          ctx.fillText(`${active ? '✓' : '•'}  ${hl}`, 128, 339 + i * 74);
        });

        ctx.fillStyle = 'rgba(255,255,255,0.16)';
        ctx.fillRect(64, 636, 1152, 8);
        ctx.fillStyle = sec.accent;
        ctx.fillRect(64, 636, (1152 * pct) / 100, 8);

        await new Promise((r) => setTimeout(r, 30));
      }

      recorder.stop();
      const blob = await donePromise;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Ach1ev-${sec.id}.webm`;
      a.click();
      URL.revokeObjectURL(url);
      setExportMsg(`Exported ${sec.sectionName} demo clip.`);
    } catch {
      setExportMsg('Could not render demo clip on this browser.');
    } finally {
      setExportingId(null);
      window.setTimeout(() => setExportMsg(null), 3500);
    }
  };

  return (
    <div id="medical-student-seo-guide" className="w-full max-w-6xl mx-auto space-y-14 sm:space-y-18 text-[#23140A]">
      {/* ═══════════════ 1. ROYAL CARAMEL-CREAM FROSTED HERO ═══════════════ */}
      <section aria-labelledby="seo-hero-heading" className="text-center space-y-4 px-2 sm:px-6 pt-2">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FBF4E6]/75 backdrop-blur-md border border-[#C9A060]/45 text-[#4E3211] text-[11px] sm:text-xs font-semibold shadow-2xs tracking-wide">
          <Award className="w-3.5 h-3.5 text-[#8E5B13] shrink-0" />
          <span>Ach1ev · Notes &amp; Focus Study Platform · Desktop &amp; Tablet</span>
        </div>

        <h1
          id="seo-hero-heading"
          className="text-3xl sm:text-5xl font-bold tracking-tight text-[#190D05] font-serif leading-[1.12] max-w-4xl mx-auto"
        >
          Tame your textbooks. Settle every clinical idea in one studio.
        </h1>

        <p className="max-w-3xl mx-auto text-sm sm:text-base text-[#4B341E] leading-relaxed">
          Unite ruled clinical notes, side-by-side reference books, Picture-to-Table extraction,
          interactive 3D almirahs, and 20-20-20 vision breaks inside one calm workspace built for focused study.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 max-w-4xl mx-auto">
          {[
            { label: 'Focus Command', val: 'Cockpit + Eye Rest', sub: 'Daily tasks, streaks & vision timer' },
            { label: 'Split Reading Desk', val: 'Side-by-Side', sub: 'PDF, DOCX & EPUB side-by-side' },
            { label: 'Smart Studio', val: 'Pic → Table', sub: '30 fonts, lockable boxes & lines' },
            { label: 'Calm Workspace', val: '3D Shelf + Themes', sub: '5 themes, 10 wallpapers & Leisure' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl p-4 text-left border border-[#D4B47C]/55 bg-[#FFFBF2]/72 backdrop-blur-md shadow-[0_8px_24px_rgba(72,46,14,0.07)] hover:border-[#B98537] transition-colors"
            >
              <div className="text-[10px] uppercase tracking-wider text-[#8E5B13] font-bold">{stat.label}</div>
              <div className="text-base sm:text-lg font-bold text-[#190D05] mt-1 font-serif">{stat.val}</div>
              <div className="text-[11px] text-[#6B5038] mt-1">{stat.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════ 2. DUAL-DEVICE (LAPTOP + TABLET) 9-SECTION PRODUCT DEMO SHOWCASE ═══════════════ */}
      <section aria-labelledby="video-series-heading" className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#8E5B13]">
              <Laptop className="w-3.5 h-3.5" />
              <Tablet className="w-3.5 h-3.5" />
              <span>Interactive 9-Section Product Demo</span>
            </div>
            <h2 id="video-series-heading" className="text-xl sm:text-2xl font-bold text-[#1E1007] mt-1 font-serif">
              Live Laptop &amp; Tablet Workspace Walkthrough
            </h2>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => setUiThemeDark((d) => !d)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FFFBF2]/80 backdrop-blur-md border border-[#D4B47C]/60 text-[#3E2816] text-xs font-semibold cursor-pointer shadow-2xs hover:bg-[#FFF7E6]"
            >
              {uiThemeDark ? <Moon className="w-3.5 h-3.5 text-amber-700" /> : <Sun className="w-3.5 h-3.5 text-amber-600" />}
              <span>{uiThemeDark ? 'Dark Tech UI' : 'Light Tech UI'}</span>
            </button>

            <label className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#FFFBF2]/80 backdrop-blur-md border border-[#D4B47C]/60 text-[#3E2816] text-xs font-medium cursor-pointer select-none shadow-2xs">
              <input
                type="checkbox"
                checked={autoAdvance}
                onChange={(e) => setAutoAdvance(e.target.checked)}
                className="accent-amber-600"
              />
              <span>Auto-Cycle</span>
            </label>

            <button
              type="button"
              onClick={handleDownloadDemoClip}
              disabled={exportingId !== null}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#9B6A1F] hover:bg-[#825614] text-white text-xs font-bold transition cursor-pointer disabled:opacity-50 shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{exportingId ? 'Rendering...' : `Save Clip ${section.stepNum}`}</span>
            </button>
          </div>
        </div>

        {exportMsg && (
          <div className="px-4 py-2 rounded-xl bg-[#FBF2DF]/85 backdrop-blur-md border border-[#D4B47C] text-[#5C3D18] text-xs font-medium">
            {exportMsg}
          </div>
        )}

        {/* Section Pills Navigation Strip (All 9 Sections at a Glance) */}
        <div className="flex flex-wrap gap-1.5 p-2 rounded-2xl bg-[#FFFBF2]/70 backdrop-blur-md border border-[#D4B47C]/55 shadow-sm">
          {PRODUCT_DEMO_SECTIONS.map((sec, idx) => {
            const Icon = getSectionIcon(sec.iconKey);
            const isActive = idx === activeIdx;
            return (
              <button
                key={sec.id}
                type="button"
                onClick={() => selectSection(idx)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'text-white shadow-sm scale-[1.02]'
                    : 'text-[#4B341E] bg-[#F7EBD2]/75 hover:bg-[#EEDBB5]/80'
                }`}
                style={isActive ? { backgroundColor: sec.accent } : undefined}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                <span>
                  {sec.stepNum}. {sec.sectionName}
                </span>
              </button>
            );
          })}
        </div>

        {/* Dual Realistic Device Stage (Sleek Laptop Frame + Tablet Frame Side-by-Side) */}
        <div className="rounded-3xl border border-[#CFAF75]/65 bg-[#FFF9EE]/65 backdrop-blur-xl p-4 sm:p-6 shadow-[0_18px_48px_rgba(78,50,15,0.12)] space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
            {/* SLEEK LAPTOP FRAME (8 Cols) */}
            <div className="lg:col-span-8 flex flex-col items-center">
              {/* Lid & Screen Bezel */}
              <div className="w-full rounded-t-2xl border-[3px] border-[#261a12] bg-[#160f0a] p-2 sm:p-2.5 shadow-2xl relative">
                {/* Webcam dot */}
                <div className="w-2 h-2 rounded-full bg-[#3a2a1e] border border-[#523d2d] mx-auto mb-1.5" />

                {/* Screen Viewport */}
                <div
                  className={`relative rounded-xl overflow-hidden border transition-colors duration-300 h-[270px] sm:h-[325px] flex ${
                    uiThemeDark
                      ? 'bg-gradient-to-br from-[#1b1009] via-[#120a05] to-[#0a0502] border-white/10 text-[#efe4d4]'
                      : 'bg-gradient-to-br from-[#fffdf9] via-[#faf2e2] to-[#f2e2c6] border-[#d6be93] text-[#221308]'
                  }`}
                >
                  {/* Simulated App Sidebar inside Laptop */}
                  <div
                    className={`w-28 sm:w-36 shrink-0 p-2 border-r flex flex-col justify-between ${
                      uiThemeDark
                        ? 'bg-black/30 border-white/10'
                        : 'bg-[#f4e7cf]/75 border-[#dcc49a]'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="px-1.5 py-1 text-[9px] font-extrabold uppercase tracking-wider opacity-70">
                        Ach1ev Studio
                      </div>
                      {PRODUCT_DEMO_SECTIONS.slice(0, 7).map((item, sIdx) => {
                        const ItemIcon = getSectionIcon(item.iconKey);
                        const active = sIdx === activeIdx;
                        return (
                          <div
                            key={item.id}
                            className={`flex items-center gap-1.5 px-1.5 py-1 rounded-lg text-[9.5px] font-semibold transition-all ${
                              active
                                ? 'text-white shadow-2xs'
                                : uiThemeDark
                                ? 'text-[#c9b497]/75'
                                : 'text-[#5b4128]/80'
                            }`}
                            style={active ? { backgroundColor: section.accent } : undefined}
                          >
                            <ItemIcon className="w-3 h-3 shrink-0" />
                            <span className="truncate">{item.sectionName}</span>
                          </div>
                        );
                      })}
                    </div>
                    <div
                      className={`p-1.5 rounded-lg text-[9px] font-semibold flex items-center gap-1 ${
                        activeIdx >= 7
                          ? 'text-white'
                          : uiThemeDark
                          ? 'bg-white/5 text-[#c9b497]'
                          : 'bg-[#ead6b2] text-[#4b341e]'
                      }`}
                      style={activeIdx >= 7 ? { backgroundColor: section.accent } : undefined}
                    >
                      <Palette className="w-3 h-3 shrink-0" />
                      <span className="truncate">Themes &amp; Settings</span>
                    </div>
                  </div>

                  {/* Main Auto-Scrolling Workspace Canvas */}
                  <div className="flex-1 p-3 sm:p-4 relative overflow-hidden flex flex-col justify-between">
                    {/* Minimalist Top Bar */}
                    <div className="flex items-center justify-between gap-2 pb-2 border-b border-current/10 shrink-0">
                      <div className="flex items-center gap-1.5">
                        <span
                          className="px-2 py-0.5 rounded-md text-[9.5px] font-bold text-white"
                          style={{ backgroundColor: section.accent }}
                        >
                          {section.stepNum} / 09
                        </span>
                        <span className="text-[11px] font-bold truncate">{section.sectionName}</span>
                      </div>
                      <div className="text-[9.5px] font-mono opacity-75">
                        20:00 Eye Rest · Synced
                      </div>
                    </div>

                    {/* Smoothly Auto-Scrolling Card Stack */}
                    <div className="flex-1 overflow-hidden relative py-2">
                      <div
                        className="transition-transform duration-300 ease-out"
                        style={{
                          transform: `translateY(-${Math.round((progressPct / 100) * 18)}px)`,
                        }}
                      >
                        <LaptopSectionCanvas
                          section={section}
                          progressPct={progressPct}
                          uiThemeDark={uiThemeDark}
                        />
                      </div>

                      {/* Contextual Hover Tooltip Callout */}
                      <div
                        className={`mt-2.5 rounded-xl p-2 border backdrop-blur-md shadow-md transition-all duration-300 ${
                          uiThemeDark
                            ? 'bg-black/60 border-white/15 text-amber-50'
                            : 'bg-white/80 border-[#d6be93] text-[#221308]'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[10px] font-bold" style={{ color: section.accent }}>
                            {section.tooltipTitle}
                          </span>
                          <span className="text-[9px] font-mono opacity-65">LIVE PREVIEW</span>
                        </div>
                        <p className="text-[10px] opacity-85 mt-0.5 leading-snug">
                          {section.tooltipBody}
                        </p>
                      </div>
                    </div>

                    {/* Bottom Dynamic Subtitles Strip */}
                    <div
                      className={`px-2.5 py-1.5 rounded-lg text-[10px] font-medium truncate border shrink-0 ${
                        uiThemeDark
                          ? 'bg-black/50 border-white/10 text-amber-100'
                          : 'bg-[#f6ebd4]/90 border-[#dec599] text-[#3a2512]'
                      }`}
                    >
                      {currentCaption}
                    </div>

                    {/* Minimalist Animated Cursor Highlight */}
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute z-20 transition-all duration-700 ease-in-out flex items-center gap-1"
                      style={{
                        left: `${activeCursor.xPct}%`,
                        top: `${activeCursor.yPct}%`,
                        transform: 'translate(-50%, -50%)',
                      }}
                    >
                      <span
                        className="w-5 h-5 rounded-full animate-ping opacity-40"
                        style={{ backgroundColor: section.accent }}
                      />
                      <span
                        className="absolute w-3.5 h-3.5 rounded-full border-2 border-white shadow-md flex items-center justify-center"
                        style={{ backgroundColor: section.accent }}
                      >
                        <MousePointer className="w-2 h-2 text-white" />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              {/* Laptop Base Lip */}
              <div className="w-[104%] h-3 rounded-b-xl bg-gradient-to-b from-[#4a372a] to-[#231811] border-t border-[#6e5442]/40 shadow-lg flex items-center justify-center">
                <div className="w-16 h-1 rounded-full bg-[#150e09]/80" />
              </div>
            </div>

            {/* COMPANION TABLET FRAME (4 Cols) */}
            <div className="lg:col-span-4 flex flex-col items-center">
              <div className="w-full max-w-[260px] rounded-[24px] border-[3px] border-[#261a12] bg-[#160f0a] p-2.5 shadow-2xl">
                <div
                  className={`rounded-[18px] p-3 h-[285px] sm:h-[315px] flex flex-col justify-between border overflow-hidden transition-colors duration-300 ${
                    uiThemeDark
                      ? 'bg-gradient-to-b from-[#1f130b] to-[#0d0603] border-white/10 text-[#efe4d4]'
                      : 'bg-gradient-to-b from-[#fffdf8] to-[#f4e5c8] border-[#d6be93] text-[#221308]'
                  }`}
                >
                  <div className="flex items-center justify-between text-[9.5px] font-bold border-b border-current/10 pb-1.5">
                    <span>Tablet Companion</span>
                    <span
                      className="px-1.5 py-0.5 rounded text-white text-[9px]"
                      style={{ backgroundColor: section.accent }}
                    >
                      {section.stepNum}
                    </span>
                  </div>

                  <div className="my-auto space-y-2 py-1">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                        style={{ backgroundColor: section.accentSoft, color: section.accent }}
                      >
                        {React.createElement(getSectionIcon(section.iconKey), { className: 'w-4 h-4' })}
                      </div>
                      <div className="min-w-0">
                        <div className="text-[11px] font-bold leading-tight truncate">{section.sectionName}</div>
                        <div className="text-[9.5px] opacity-70">Touch &amp; Stylus Ready</div>
                      </div>
                    </div>

                    <div className="space-y-1.5 pt-1">
                      {section.highlights.map((hl, i) => {
                        const lit = progressPct >= i * 32;
                        return (
                          <div
                            key={hl}
                            className={`rounded-xl px-2.5 py-1.5 text-[10px] border transition-all duration-300 flex items-start gap-1.5 ${
                              lit
                                ? uiThemeDark
                                  ? 'bg-white/10 border-white/20 text-amber-50'
                                  : 'bg-white/85 border-[#cfa868] text-[#1e1007] shadow-2xs'
                                : 'opacity-50 border-transparent'
                            }`}
                          >
                            <CheckCircle2
                              className="w-3 h-3 shrink-0 mt-0.5"
                              style={{ color: section.accent }}
                            />
                            <span className="leading-snug">{hl}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-current/10 flex items-center justify-between text-[9.5px] opacity-75">
                    <span>Offline PWA Ready</span>
                    <span>9-Section Tour</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Scrubber + Playback Bar */}
          <div className="pt-2 border-t border-[#DEC79E]/70 space-y-2.5">
            <div
              role="slider"
              aria-label="Product demo playback progress"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(progressPct)}
              tabIndex={0}
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const pct = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
                setProgressPct(pct);
              }}
              className="w-full h-2 rounded-full bg-[#E3CFA8] cursor-pointer overflow-hidden"
            >
              <div
                className="h-full rounded-full transition-all duration-100"
                style={{ width: `${progressPct}%`, backgroundColor: section.accent }}
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() =>
                    selectSection((activeIdx - 1 + PRODUCT_DEMO_SECTIONS.length) % PRODUCT_DEMO_SECTIONS.length)
                  }
                  className="p-2 rounded-xl bg-[#EFE0C2] hover:bg-[#E4CF9F] text-[#2A170B] transition cursor-pointer"
                  title="Previous Section"
                >
                  <SkipBack className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsPlaying((p) => !p)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white flex items-center gap-1.5 transition cursor-pointer shadow"
                  style={{ backgroundColor: section.accent }}
                >
                  {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  <span>{isPlaying ? 'Pause' : 'Play'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => selectSection((activeIdx + 1) % PRODUCT_DEMO_SECTIONS.length)}
                  className="p-2 rounded-xl bg-[#EFE0C2] hover:bg-[#E4CF9F] text-[#2A170B] transition cursor-pointer"
                  title="Next Section"
                >
                  <SkipForward className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setProgressPct(0);
                    setIsPlaying(true);
                  }}
                  className="p-2 rounded-xl bg-[#EFE0C2] hover:bg-[#E4CF9F] text-[#2A170B] transition cursor-pointer"
                  title="Replay"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>

              <div className="text-xs font-semibold text-[#5C3F23] flex items-center gap-2">
                <span>{section.title}</span>
                <span className="font-mono opacity-75">
                  {formatSec((progressPct / 100) * section.durationSec)} / {formatSec(section.durationSec)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ 3. ACH1EV MEMBERSHIP TIERS (CLEAN, NO COMPETITOR TABLES) ═══════════════ */}
      <section aria-labelledby="achiev-plans-heading" className="space-y-5">
        <div className="text-center space-y-1.5">
          <h2 id="achiev-plans-heading" className="text-xl sm:text-2xl font-bold text-[#1E1007] font-serif">
            Ach1ev Academic Plans
          </h2>
          <p className="text-xs sm:text-sm text-[#5C4128] max-w-xl mx-auto">
            Start free or unlock complete clinical extraction, all 3D almirahs, and cloud sync via UPI, Card, or Net Banking.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl mx-auto">
          {SUBSCRIPTION_TIERS.map((tier) => (
            <div
              key={tier.id}
              className={`rounded-2xl p-5 border flex flex-col justify-between transition-all backdrop-blur-md ${
                tier.highlight
                  ? 'bg-[#FFF8E6]/88 border-[#C89336] ring-1 ring-[#D7A648]/40 shadow-[0_14px_32px_rgba(142,91,19,0.14)]'
                  : 'bg-[#FFFBF2]/78 border-[#D4B47C]/55 shadow-[0_6px_18px_rgba(78,50,15,0.06)]'
              }`}
            >
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-[#9B6A1F]">{tier.badge}</div>
                <h3 className="text-lg font-bold text-[#1E1007] mt-1 font-serif">{tier.name}</h3>
                <div className="flex items-baseline gap-2 mt-1.5">
                  <span className="text-3xl font-extrabold text-[#1E1007]">
                    {tier.priceAnnual === 0 ? '₹0' : `₹${tier.priceAnnual.toLocaleString('en-IN')}`}
                  </span>
                  <span className="text-xs font-semibold text-[#6E5238]">
                    {tier.priceAnnual === 0 ? 'Free Forever' : `/ year · ₹${tier.priceMonthly}/mo`}
                  </span>
                </div>
                <p className="text-xs text-[#594028] mt-2 leading-relaxed">{tier.description}</p>
              </div>
              <div className="mt-4 pt-3 border-t border-[#DEC79E]/75 space-y-3">
                <ul className="space-y-2">
                  {tier.features.slice(0, 5).map((f) => (
                    <li key={f} className="flex items-start gap-1.5 text-[11.5px] text-[#3C2715]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#8E5B13] shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  onClick={() => window.dispatchEvent(new CustomEvent('achiev_skip_create_note'))}
                  className="w-full py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 bg-[#9B6A1F] hover:bg-[#825614] text-white transition cursor-pointer"
                >
                  <span>{tier.priceAnnual === 0 ? 'Start Free Note' : 'Explore Inside Studio'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════ 4. STUDY WORKSPACE FAQ ACCORDION ═══════════════ */}
      <section aria-labelledby="medical-faq-heading" className="max-w-4xl mx-auto space-y-3 pb-4">
        <h2 id="medical-faq-heading" className="text-lg sm:text-xl font-bold text-center text-[#241106] font-serif mb-4">
          Frequently Asked Questions
        </h2>
        {STUDY_FAQS.map((item, i) => {
          const isOpen = openFaqIdx === i;
          return (
            <div
              key={item.q}
              className="rounded-2xl border border-[#8C5621] bg-[#B67A3B] overflow-hidden shadow-[0_6px_18px_rgba(44,22,8,0.14)]"
            >
              <button
                type="button"
                onClick={() => setOpenFaqIdx(isOpen ? null : i)}
                className="w-full px-4 py-3.5 text-left flex items-center justify-between gap-3 cursor-pointer bg-[#B67A3B] hover:bg-[#A66C30] transition-colors"
              >
                <span className="text-xs sm:text-sm font-bold text-[#221006]">{item.q}</span>
                {isOpen ? (
                  <ChevronUp className="w-4 h-4 text-[#221006] shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-[#221006] shrink-0" />
                )}
              </button>
              {isOpen && (
                <div className="px-4 pb-3.5 text-xs sm:text-[13px] font-medium text-[#2A1508] bg-[#C98E4E]/45 leading-relaxed border-t border-[#8C5621]/50 pt-2.5">
                  {item.a}
                </div>
              )}
            </div>
          );
        })}
      </section>
    </div>
  );
};

/* ───────────── ANIMATED MINI UI INSIDE LAPTOP SCREEN PER SECTION ───────────── */
const LaptopSectionCanvas: React.FC<{
  section: ShowcaseSection;
  progressPct: number;
  uiThemeDark: boolean;
}> = ({ section, progressPct, uiThemeDark }) => {
  const step = progressPct < 34 ? 1 : progressPct < 68 ? 2 : 3;
  const cardSurface = uiThemeDark
    ? 'bg-white/[0.06] border-white/10'
    : 'bg-white/75 border-[#dcc49a]';

  if (section.iconKey === 'dashboard') {
    return (
      <div className="grid grid-cols-3 gap-2">
        <div className={`col-span-2 rounded-xl p-2.5 border ${cardSurface} space-y-2`}>
          <div className="text-[10px] font-bold flex items-center justify-between">
            <span>Daily Clinical Slabs</span>
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400">Active</span>
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            {['Pharmacology', 'Pathology', 'Medicine'].map((s, i) => (
              <div
                key={s}
                className={`p-2 rounded-lg text-[9.5px] font-semibold border transition-all ${
                  step >= i + 1 ? 'bg-amber-500/20 border-amber-400/50 scale-[1.03]' : 'border-current/10 opacity-70'
                }`}
              >
                {s}
              </div>
            ))}
          </div>
        </div>
        <div className={`rounded-xl p-2.5 border text-center flex flex-col justify-center ${cardSurface}`}>
          <Eye className="w-4 h-4 mx-auto text-amber-400 mb-1" />
          <div className="text-[9.5px] font-bold">Eye Rest</div>
          <div className="text-xs font-mono font-extrabold text-amber-400">
            {step === 1 ? '20:00' : step === 2 ? '19:45' : 'Rest 20s'}
          </div>
        </div>
      </div>
    );
  }

  if (section.iconKey === 'read') {
    return (
      <div className="grid grid-cols-2 gap-2.5">
        {['Harrison Internal Medicine · PDF', 'Robbins Pathology · EPUB'].map((title, idx) => (
          <div key={title} className={`rounded-xl p-2.5 border ${cardSurface} space-y-1.5`}>
            <div className="text-[10px] font-bold truncate" style={{ color: section.accent }}>
              Pane {idx + 1} · {title}
            </div>
            <div className="space-y-1">
              <div className="h-2 w-11/12 rounded bg-current/15" />
              <div
                className="h-2 w-4/5 rounded transition-colors"
                style={{ backgroundColor: step >= idx + 2 ? section.accentSoft : 'rgba(128,128,128,0.2)' }}
              />
              <div className="h-2 w-2/3 rounded bg-current/10" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (section.iconKey === 'note') {
    return (
      <div className="grid grid-cols-12 gap-2">
        <div className={`col-span-5 rounded-xl p-2 border ${cardSurface}`}>
          <div className="text-[9.5px] font-bold text-emerald-400 flex items-center gap-1">
            <PenTool className="w-3 h-3" />
            <span>Lockable Box + Image</span>
          </div>
          <div className="mt-1.5 p-1.5 rounded-lg border border-dashed border-emerald-400/50 text-[9px]">
            {step >= 2 ? '🔒 Position Locked on Sheet' : 'Drag & Resize Text Box'}
          </div>
        </div>
        <div className={`col-span-7 rounded-xl p-2 border ${cardSurface}`}>
          <div className="text-[9.5px] font-bold mb-1 flex items-center justify-between">
            <span>Picture-to-Table Grid</span>
            <Table2 className="w-3 h-3 text-emerald-400" />
          </div>
          <div className="grid grid-cols-3 gap-1 text-[8.5px] font-mono">
            {['Drug', 'Class', 'Use', 'Atropine', 'Antimus.', 'Bradycardia'].map((c, ci) => (
              <div
                key={c}
                className={`px-1 py-0.5 rounded border ${
                  ci < 3 || step >= 2 ? 'border-emerald-400/35 bg-emerald-500/15' : 'border-current/10 opacity-40'
                }`}
              >
                {c}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`rounded-xl p-3 border ${cardSurface} flex items-center justify-between gap-3`}>
      <div className="space-y-1 min-w-0">
        <div className="text-[10px] font-bold uppercase tracking-wider" style={{ color: section.accent }}>
          {section.sectionName}
        </div>
        <div className="text-xs font-bold leading-snug truncate">{section.title}</div>
        <div className="flex flex-wrap gap-1 pt-0.5">
          {section.highlights.slice(0, 2).map((h, i) => (
            <span
              key={h}
              className={`text-[9px] px-2 py-0.5 rounded-md border ${
                step >= i + 1 ? 'border-current/25 bg-current/10 font-semibold' : 'border-current/10 opacity-65'
              }`}
            >
              {h}
            </span>
          ))}
        </div>
      </div>
      <div
        className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border"
        style={{ backgroundColor: section.accentSoft, borderColor: section.accent }}
      >
        {React.createElement(getSectionIcon(section.iconKey), {
          className: 'w-6 h-6',
          style: { color: section.accent },
        })}
      </div>
    </div>
  );
};

export default FeatureVideoSeriesShowcase;
