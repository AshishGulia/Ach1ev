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
  MessageSquareCode,
  Cat,
  Layers,
  Award,
  IndianRupee,
  ChevronDown,
  ChevronUp,
  Film,
} from 'lucide-react';
import { COMPETITOR_BENCHMARKS, SUBSCRIPTION_TIERS } from '../../data/subscriptionData';

export interface SeriesEpisode {
  id: string;
  epNumber: string;
  sidebarSegment: string;
  title: string;
  subtitle: string;
  durationSec: number;
  accent: string;
  accentSoft: string;
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
    | 'dev';
}

export const FEATURE_VIDEO_SERIES: SeriesEpisode[] = [
  {
    id: 'ep-01-dashboard-eye',
    epNumber: 'EP 01',
    sidebarSegment: '1. Dashboard · Cockpit',
    title: 'Cockpit Overview & 20-20-20 Eye Rest Timer',
    subtitle: 'Track live study momentum, quick-launch slabs, and configure the 20-20-20 Eye Rest Timer directly from the top bar.',
    durationSec: 10,
    accent: '#d97706',
    accentSoft: 'rgba(217, 119, 6, 0.22)',
    highlights: [
      'One-glance study hours, tasks & notebook progress',
      'Built-in 20-20-20 Eye Rest Timer inside the header button',
      'Customize break interval, snooze & gentle alert chimes',
    ],
    captions: [
      { atPct: 0, text: 'Open your Cockpit dashboard to view today’s clinical tasks and focus score.' },
      { atPct: 35, text: 'Click the Eye Timer button right in the header bar to configure break intervals.' },
      { atPct: 70, text: 'Automatic 20-20-20 eye rest prompts protect vision during marathon MBBS & PG study.' },
    ],
    iconKey: 'dashboard',
  },
  {
    id: 'ep-02-read-side-by-side',
    epNumber: 'EP 02',
    sidebarSegment: '2. Read · Textbook Desk',
    title: 'Side-by-Side Books Reading (PDF, Word & EPUB)',
    subtitle: 'Open and compare multiple medical textbooks, lecture slides, and guidelines side-by-side without switching tabs.',
    durationSec: 11,
    accent: '#0ea5e9',
    accentSoft: 'rgba(14, 165, 233, 0.2)',
    highlights: [
      'Upload PDF, Word (.docx) & EPUB documents directly',
      'Dual & multi-slab side-by-side book reading layout',
      'Pinch-zoom, highlight & snip textbook diagrams straight to notes',
    ],
    captions: [
      { atPct: 0, text: 'Click Upload Document in Read to open Harrison’s, Robbins, or class handouts.' },
      { atPct: 35, text: 'Open two books side-by-side to cross-reference pathology and clinical pharmacology.' },
      { atPct: 72, text: 'Capture any high-yield diagram slab and send it straight into your active notebook.' },
    ],
    iconKey: 'read',
  },
  {
    id: 'ep-03-notes-book-table',
    epNumber: 'EP 03',
    sidebarSegment: '3. Create Note · Studio',
    title: 'Book Open Beside Notes + Picture-to-Table Converter',
    subtitle: 'Keep a reference book from your Shelf or device open right beside your ruled note canvas, and turn photos into editable tables.',
    durationSec: 12,
    accent: '#10b981',
    accentSoft: 'rgba(16, 185, 129, 0.2)',
    highlights: [
      'Open a Book from Shelf or Upload right next to your note page',
      'Picture-to-Table AI converts textbook photos into clean tables',
      'Pinned bottom YouTube lecture dock while writing',
    ],
    captions: [
      { atPct: 0, text: 'Pick any book from your Shelf or Upload one directly beside your ruled note page.' },
      { atPct: 38, text: 'Snap or upload a textbook chart using Picture-to-Table to auto-generate editable rows.' },
      { atPct: 74, text: 'Watch lecture videos pinned cleanly at the bottom while taking crisp clinical notes.' },
    ],
    iconKey: 'note',
  },
  {
    id: 'ep-04-calendar-trackers',
    epNumber: 'EP 04',
    sidebarSegment: '4. Calendar · Trackers & Roster',
    title: 'Adding Trackers, Calendar Tasks & Clinical Schedules',
    subtitle: 'Organize ward postings, exam countdowns, daily study habit trackers, and scan timetable photos into scheduled tasks.',
    durationSec: 10,
    accent: '#8b5cf6',
    accentSoft: 'rgba(139, 92, 246, 0.22)',
    highlights: [
      'Add subject revision trackers & daily study checklists',
      'Smart Calendar Tasks for MBBS/NEET-PG/USMLE deadlines',
      'Scan printed ward schedules into instant calendar events',
    ],
    captions: [
      { atPct: 0, text: 'Create daily subject & MCQ habit trackers to keep revision streaks consistent.' },
      { atPct: 36, text: 'Add priority tasks & clinical posting schedules directly onto your smart calendar.' },
      { atPct: 72, text: 'Sync exam timelines and check off daily milestones with zero friction.' },
    ],
    iconKey: 'calendar',
  },
  {
    id: 'ep-05-shelf-cat',
    epNumber: 'EP 05',
    sidebarSegment: '5. Shelf · 3D Almirah',
    title: 'Creative Almirah Book Stacking & Petting the Cat',
    subtitle: 'Pick and drop books between clear-glass wood almirahs and the obsidian steel vault, switch Day/Night, and pet your study cat.',
    durationSec: 12,
    accent: '#f59e0b',
    accentSoft: 'rgba(245, 158, 11, 0.22)',
    highlights: [
      'Pick & drop books seamlessly across any shelf compartment',
      '5 distinct cabinets: Glass Wood Almirahs to Dark Steel Vault',
      'Click the floor cat to walk & click again to pet & purr ♥',
    ],
    captions: [
      { atPct: 0, text: 'Unlock glass doors on Walnut & Caramel almirahs or spin the Dark Steel Vault dial.' },
      { atPct: 36, text: 'Pick any book and drop it into a different shelf section or almirah compartment.' },
      { atPct: 72, text: 'Click the floor cat to roam slowly; pet her anywhere to settle and purr with hearts.' },
    ],
    iconKey: 'shelf',
  },
  {
    id: 'ep-06-mnemonics',
    epNumber: 'EP 06',
    sidebarSegment: '6. Mnemonics & Flowcharts',
    title: 'High-Yield Medical Mnemonics & Diagnostic Flowcharts',
    subtitle: 'Build branchable clinical algorithms and active-recall pharmacology or anatomy mnemonics in seconds.',
    durationSec: 9,
    accent: '#ec4899',
    accentSoft: 'rgba(236, 72, 153, 0.2)',
    highlights: [
      'Rapid active-recall cards for Anatomy, Path & Pharm',
      'Visual flowchart nodes for diagnostic workups',
      'One-click snip into study notebooks',
    ],
    captions: [
      { atPct: 0, text: 'Browse subject-tagged clinical mnemonics tailored for medical board exams.' },
      { atPct: 45, text: 'Build multi-step diagnostic flowcharts and insert them cleanly into notes.' },
    ],
    iconKey: 'mnemonics',
  },
  {
    id: 'ep-07-achievers-hub',
    epNumber: 'EP 07',
    sidebarSegment: "7. Achiever's Hub",
    title: "Achiever's Hub · Medical Community & Study Groups",
    subtitle: "Connect with classmates and peers inside Achiever's Hub to exchange clinical pearls, notes, and MCQ discussions.",
    durationSec: 10,
    accent: '#14b8a6',
    accentSoft: 'rgba(20, 184, 166, 0.2)',
    highlights: [
      "Share study notes & exam doubts inside Achiever's Hub",
      'Search fellow scholars by @username & add study friends',
      'Save shared community posts straight to your notebook',
    ],
    captions: [
      { atPct: 0, text: "Open Achiever's Hub from the sidebar to join live medical student circles." },
      { atPct: 45, text: 'Discuss high-yield cases, exchange memory tricks, and snip pearls into your notes.' },
    ],
    iconKey: 'hub',
  },
  {
    id: 'ep-08-themes-leisure',
    epNumber: 'EP 08',
    sidebarSegment: '8. Themes & Leisure',
    title: '5 Scenic Day/Night Themes & Cozy Leisure Reset',
    subtitle: 'Transform your entire workspace & shelf world across Marble, Forest, Coastal Beach, Monsoon Rain & Pistachio Obsidian.',
    durationSec: 10,
    accent: '#84cc16',
    accentSoft: 'rgba(132, 204, 22, 0.2)',
    highlights: [
      '5 hand-crafted themes with matching Day Sun & Night Moon skies',
      'Monsoon Rain ripples, Forest leaves, Coastal waves & Marble luxury',
      'Calming Leisure space with ambient peace sounds',
    ],
    captions: [
      { atPct: 0, text: 'Switch effortlessly between Marble, Forest Sanctuary, Coastal Balcony & Monsoon Rain.' },
      { atPct: 48, text: 'Toggle Day Sun & Night Moon modes—each shelf world adapts plants, lamps & fireflies.' },
    ],
    iconKey: 'themes',
  },
  {
    id: 'ep-09-settings-dev',
    epNumber: 'EP 09',
    sidebarSegment: '9. Settings · Talk to Developer',
    title: 'Smart Settings Sidebar, Cloud Drive & Talk to Developer',
    subtitle: 'Reorder sidebar sections, connect your own Google Drive library, or message the developer directly with visual feedback.',
    durationSec: 9,
    accent: '#eab308',
    accentSoft: 'rgba(234, 179, 8, 0.2)',
    highlights: [
      'Most-used to least-used prioritized Settings sidebar',
      'Offload heavy PDFs cleanly to personal Google Drive',
      'Direct Talk to Developer feedback desk from sidebar bottom',
    ],
    captions: [
      { atPct: 0, text: 'Customize typography, languages, themes & sidebar segment order in Settings.' },
      { atPct: 48, text: 'Send feature requests or UI screenshots straight to the developer in one click.' },
    ],
    iconKey: 'dev',
  },
];

const SEO_FAQS = [
  {
    q: 'Why is Achiev the cheapest note-making website for medical students?',
    a: 'Achiev gives MBBS, NEET-PG, USMLE, and nursing students a generous ₹0 Free Scholar plan and Clinical Starter at just ₹60/month (₹599/year)—up to 80% cheaper than GoodNotes, Notability, RemNote, Notion AI, or Evernote, with zero Apple hardware lock-in.',
  },
  {
    q: 'Can I keep a medical textbook open beside my notes while writing?',
    a: 'Yes! Open any PDF, Word (.docx), or EPUB textbook from your Shelf or upload a file right inside Create Note to read side-by-side with your ruled paper canvas and pin lecture videos at the bottom.',
  },
  {
    q: 'How does the Picture-to-Table feature help medical students?',
    a: 'Simply capture or upload a photo of a complex pharmacology, pathology, or microbiology table from a book or slide—Achiev converts the image into a crisp, editable structured table inside your notes.',
  },
  {
    q: 'Does Achiev work offline and across Android, Windows, iPad, and Mac?',
    a: 'Yes. Achiev is an installable cross-platform web app (PWA) with local offline caching, Supabase cloud sync, and personal Google Drive storage offloading.',
  },
];

function getEpisodeIcon(key: SeriesEpisode['iconKey']) {
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
    case 'dev':
      return MessageSquareCode;
  }
}

export const FeatureVideoSeriesShowcase: React.FC = () => {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [autoAdvance, setAutoAdvance] = useState(true);
  const [progressPct, setProgressPct] = useState(0);
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(0);
  const [exportingId, setExportingId] = useState<string | null>(null);
  const [exportMsg, setExportMsg] = useState<string | null>(null);
  const timerRef = useRef<number | null>(null);

  const episode = FEATURE_VIDEO_SERIES[activeIdx] || FEATURE_VIDEO_SERIES[0]!;

  useEffect(() => {
    if (!isPlaying) return;
    const stepMs = 80;
    const increment = (stepMs / (episode.durationSec * 1000)) * 100;

    timerRef.current = window.setInterval(() => {
      setProgressPct((prev) => {
        const next = prev + increment;
        if (next >= 100) {
          if (autoAdvance) {
            setActiveIdx((curr) => (curr + 1) % FEATURE_VIDEO_SERIES.length);
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
  }, [isPlaying, activeIdx, autoAdvance, episode.durationSec]);

  const currentCaption = useMemo(() => {
    let chosen = episode.captions[0]?.text || episode.subtitle;
    for (const c of episode.captions) {
      if (progressPct >= c.atPct) chosen = c.text;
    }
    return chosen;
  }, [episode, progressPct]);

  const selectEpisode = (idx: number) => {
    setActiveIdx(idx);
    setProgressPct(0);
    setIsPlaying(true);
  };

  const formatSec = (s: number) => {
    const whole = Math.max(0, Math.round(s));
    return `0:${String(whole).padStart(2, '0')}`;
  };

  // Real client-side HTML5 Canvas -> WebM video generator for any episode
  const handleDownloadEpisodeVideo = async () => {
    if (exportingId) return;
    if (typeof MediaRecorder === 'undefined') {
      setExportMsg('Video export requires a modern desktop/Android Chrome, Edge, or Firefox browser.');
      return;
    }

    const ep = episode;
    setExportingId(ep.id);
    setExportMsg(`Rendering HD video (${ep.epNumber}: ${ep.title})...`);

    try {
      const canvas = document.createElement('canvas');
      canvas.width = 1280;
      canvas.height = 720;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Canvas 2D unavailable');

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
      const totalFrames = 150; // 5s crisp 30fps walkthrough clip
      for (let f = 0; f <= totalFrames; f++) {
        const pct = (f / totalFrames) * 100;
        // Draw dark espresso HD frame
        const bgGrad = ctx.createRadialGradient(340, 200, 40, 640, 360, 820);
        bgGrad.addColorStop(0, '#2a150b');
        bgGrad.addColorStop(0.55, '#140804');
        bgGrad.addColorStop(1, '#080301');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, 1280, 720);

        // Header bar
        ctx.fillStyle = 'rgba(255, 240, 210, 0.08)';
        ctx.fillRect(48, 42, 1184, 62);
        ctx.fillStyle = ep.accent;
        ctx.fillRect(48, 42, 130, 62);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 22px system-ui, sans-serif';
        ctx.fillText(ep.epNumber, 82, 81);
        ctx.fillStyle = '#fef3c7';
        ctx.font = 'bold 24px system-ui, sans-serif';
        ctx.fillText(`Achiev · ${ep.sidebarSegment}`, 205, 81);

        // Main Card
        ctx.fillStyle = 'rgba(24, 12, 6, 0.9)';
        ctx.strokeStyle = ep.accent;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(64, 136, 1152, 430, 24);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#fffbeb';
        ctx.font = 'bold 40px system-ui, sans-serif';
        ctx.fillText(ep.title, 108, 212);

        ctx.fillStyle = '#d6c3a5';
        ctx.font = '24px system-ui, sans-serif';
        ctx.fillText(ep.subtitle.slice(0, 84), 108, 260);
        if (ep.subtitle.length > 84) {
          ctx.fillText(ep.subtitle.slice(84), 108, 294);
        }

        // Animated step highlights
        ep.highlights.forEach((hl, i) => {
          const activeStep = pct >= i * 33;
          ctx.fillStyle = activeStep ? ep.accentSoft : 'rgba(255,255,255,0.04)';
          ctx.beginPath();
          ctx.roundRect(108, 336 + i * 68, 1064, 52, 12);
          ctx.fill();
          ctx.fillStyle = activeStep ? '#fde68a' : '#78716c';
          ctx.font = 'bold 22px system-ui, sans-serif';
          ctx.fillText(`${activeStep ? '✓' : '•'}  ${hl}`, 130, 369 + i * 68);
        });

        // Bottom caption & progress
        let cap = ep.captions[0]?.text || '';
        for (const c of ep.captions) {
          if (pct >= c.atPct) cap = c.text;
        }
        ctx.fillStyle = '#fde68a';
        ctx.font = 'italic 22px system-ui, sans-serif';
        ctx.fillText(cap.slice(0, 96), 64, 625);

        ctx.fillStyle = 'rgba(255,255,255,0.14)';
        ctx.fillRect(64, 656, 1152, 10);
        ctx.fillStyle = ep.accent;
        ctx.fillRect(64, 656, (1152 * pct) / 100, 10);

        await new Promise((r) => setTimeout(r, 33));
      }

      recorder.stop();
      const blob = await donePromise;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Achiev-${ep.id}.webm`;
      a.click();
      URL.revokeObjectURL(url);
      setExportMsg(`Downloaded ${ep.epNumber} walkthrough video (.webm)!`);
    } catch {
      setExportMsg('Could not export video on this browser.');
    } finally {
      setExportingId(null);
      window.setTimeout(() => setExportMsg(null), 4000);
    }
  };

  return (
    <div id="medical-student-seo-guide" className="w-full max-w-6xl mx-auto mt-14 pt-10 border-t border-amber-500/20 space-y-16 text-[#efe4d4]">
      {/* ═══════════════ 1. SEO HERO VALUE PROPOSITION: CHEAPEST FOR MEDICAL STUDENTS ═══════════════ */}
      <section aria-labelledby="seo-hero-heading" className="text-center space-y-4 px-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/15 border border-amber-400/35 text-amber-200 text-xs font-semibold">
          <Award className="w-3.5 h-3.5 text-amber-300" />
          <span>Rated Best Budget Medical Note-Making Studio · MBBS · NEET-PG · USMLE · Nursing</span>
        </div>

        <h1
          id="seo-hero-heading"
          className="text-2xl sm:text-4xl font-bold tracking-tight text-amber-50 font-serif"
        >
          The Cheapest &amp; Best Note-Making Website Built Specifically for Medical Students
        </h1>

        <p className="max-w-3xl mx-auto text-sm sm:text-base text-[#d6c2a5] leading-relaxed">
          Stop paying ₹450–₹1,100/month across separate apps for PDF reading, note-taking, flashcards, habit trackers, and cloud sync.
          <strong className="text-amber-200"> Achiev (Settle Ideas)</strong> gives medical scholars a complete study workspace starting at{' '}
          <strong className="text-emerald-300">₹0 Free Forever</strong> and{' '}
          <strong className="text-emerald-300">₹60/month Pro</strong> — with side-by-side textbook desks, Picture-to-Table conversion,
          20-20-20 Eye Rest Timer, interactive 3D bookshelves, and Achiever&apos;s Hub community.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 max-w-4xl mx-auto">
          {[
            { label: 'Starting Price', val: '₹0 Free', sub: 'Starter ₹60/mo (80% Cheaper)' },
            { label: 'Split Reading + Notes', val: 'Side-by-Side', sub: 'PDF, DOCX & EPUB + Video Dock' },
            { label: 'Smart AI Tables', val: 'Pic → Table', sub: 'Instant Book Image to Table' },
            { label: 'Built-In Wellness', val: 'Eye Timer + Cat', sub: '20-20-20 Rest & Living Shelf' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl p-3.5 text-left border border-amber-500/20 bg-[#1a0d06]/70 backdrop-blur-md"
            >
              <div className="text-[11px] uppercase tracking-wider text-amber-300/80 font-semibold">{stat.label}</div>
              <div className="text-lg font-bold text-amber-50 mt-0.5">{stat.val}</div>
              <div className="text-[11px] text-[#c7b194] mt-0.5">{stat.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════ 2. SERIES-WISE FEATURE VIDEO TOUR (DASHBOARD TO LAST SIDEBAR SEGMENT) ═══════════════ */}
      <section aria-labelledby="video-series-heading" className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-300">
              <Film className="w-4 h-4" />
              <span>9-Part Interactive Video Walkthrough Series</span>
            </div>
            <h2 id="video-series-heading" className="text-xl sm:text-2xl font-bold text-amber-50 mt-1">
              Explore Every Feature: Dashboard to Last Sidebar Segment
            </h2>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <label className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs cursor-pointer select-none">
              <input
                type="checkbox"
                checked={autoAdvance}
                onChange={(e) => setAutoAdvance(e.target.checked)}
                className="accent-amber-500"
              />
              <span>Auto-Play Next Episode</span>
            </label>

            <button
              type="button"
              onClick={handleDownloadEpisodeVideo}
              disabled={exportingId !== null}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-600/90 hover:bg-amber-500 text-white text-xs font-bold transition cursor-pointer disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{exportingId ? 'Rendering WebM...' : `Export ${episode.epNumber} Video`}</span>
            </button>
          </div>
        </div>

        {exportMsg && (
          <div className="px-4 py-2 rounded-xl bg-amber-500/15 border border-amber-400/30 text-amber-200 text-xs font-medium">
            {exportMsg}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          {/* Left 7 Cols: 16:9 Live Animated Feature Theatre Player */}
          <div className="lg:col-span-7 flex flex-col rounded-3xl overflow-hidden border border-amber-500/25 bg-[#120804]/90 shadow-2xl">
            {/* Video Stage */}
            <div className="relative aspect-video w-full p-5 sm:p-6 flex flex-col justify-between overflow-hidden bg-gradient-to-br from-[#231108] via-[#130904] to-[#080301]">
              {/* Top Episode Badge */}
              <div className="relative z-10 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span
                    className="px-2.5 py-1 rounded-lg text-[11px] font-extrabold text-white shadow"
                    style={{ background: episode.accent }}
                  >
                    {episode.epNumber} / 09
                  </span>
                  <span className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-black/45 border border-white/10 text-amber-100">
                    {episode.sidebarSegment}
                  </span>
                </div>
                <span className="text-[11px] font-mono text-amber-200/80 bg-black/40 px-2 py-0.5 rounded">
                  {formatSec((progressPct / 100) * episode.durationSec)} / {formatSec(episode.durationSec)}
                </span>
              </div>

              {/* Animated Visual Mockup Scene Specific to Active Episode */}
              <div className="relative z-10 my-auto py-3">
                <EpisodeAnimatedViewport episode={episode} progressPct={progressPct} />
              </div>

              {/* Dynamic Subtitles / Voiceover Script Bar */}
              <div className="relative z-10 rounded-xl px-3.5 py-2 bg-black/65 border border-white/10 backdrop-blur-md">
                <p className="text-xs sm:text-[13px] text-amber-50 font-medium leading-snug">
                  {currentCaption}
                </p>
              </div>
            </div>

            {/* Video Scrubber & Transport Controls */}
            <div className="p-4 bg-[#170b05] border-t border-amber-500/15 space-y-3">
              {/* Clickable Seek Bar */}
              <div
                role="slider"
                aria-label="Episode playback timeline"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={Math.round(progressPct)}
                tabIndex={0}
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const pct = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
                  setProgressPct(pct);
                }}
                className="w-full h-2 rounded-full bg-white/10 cursor-pointer overflow-hidden"
              >
                <div
                  className="h-full rounded-full transition-all duration-100"
                  style={{ width: `${progressPct}%`, background: episode.accent }}
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => selectEpisode((activeIdx - 1 + FEATURE_VIDEO_SERIES.length) % FEATURE_VIDEO_SERIES.length)}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/15 transition cursor-pointer"
                    title="Previous Episode"
                  >
                    <SkipBack className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsPlaying((p) => !p)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-white flex items-center gap-1.5 transition cursor-pointer shadow"
                    style={{ background: episode.accent }}
                  >
                    {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    <span>{isPlaying ? 'Pause' : 'Play'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => selectEpisode((activeIdx + 1) % FEATURE_VIDEO_SERIES.length)}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/15 transition cursor-pointer"
                    title="Next Episode"
                  >
                    <SkipForward className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setProgressPct(0);
                      setIsPlaying(true);
                    }}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/15 transition cursor-pointer"
                    title="Replay Episode"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>

                <div className="text-xs text-[#cbb597] font-medium truncate max-w-[260px]">
                  {episode.title}
                </div>
              </div>

              {/* Episode Highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                {episode.highlights.map((h) => (
                  <div key={h} className="flex items-start gap-1.5 text-[11px] text-[#e7d6be] bg-white/[0.04] rounded-xl p-2 border border-white/5">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5" style={{ color: episode.accent }} />
                    <span>{h}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right 5 Cols: Series-Wise Playlist (Cockpit -> Last Sidebar Segment) */}
          <div className="lg:col-span-5 rounded-3xl border border-amber-500/20 bg-[#160b05]/85 p-3.5 flex flex-col gap-2 max-h-[540px] overflow-y-auto custom-scrollbar">
            <div className="px-2 py-1 text-xs font-bold uppercase tracking-wider text-amber-300/90 flex items-center justify-between">
              <span>Series Playlist (Sidebar Order)</span>
              <span>{FEATURE_VIDEO_SERIES.length} Episodes</span>
            </div>

            {FEATURE_VIDEO_SERIES.map((ep, idx) => {
              const Icon = getEpisodeIcon(ep.iconKey);
              const active = idx === activeIdx;
              return (
                <button
                  key={ep.id}
                  type="button"
                  onClick={() => selectEpisode(idx)}
                  className={`w-full text-left p-2.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                    active
                      ? 'bg-amber-500/15 border-amber-400/50 shadow-md'
                      : 'bg-white/[0.03] border-white/5 hover:bg-white/[0.07]'
                  }`}
                >
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 text-white shadow-xs"
                    style={{ background: active ? ep.accent : 'rgba(255,255,255,0.08)' }}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: ep.accent }}>
                        {ep.epNumber} · {ep.sidebarSegment}
                      </span>
                      <span className="text-[10px] font-mono text-[#bfa98c]">{formatSec(ep.durationSec)}</span>
                    </div>
                    <div className="text-xs sm:text-[13px] font-bold text-amber-50 leading-snug mt-0.5">
                      {ep.title}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════ 3. CHEAPEST MEDICAL STUDENT PRICING COMPARISON ═══════════════ */}
      <section aria-labelledby="pricing-comparison-heading" className="space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-300">
            <IndianRupee className="w-3.5 h-3.5" />
            <span>Transparent Student-First Pricing</span>
          </div>
          <h2 id="pricing-comparison-heading" className="text-xl sm:text-2xl font-bold text-amber-50">
            Why Medical Students Switch From Expensive Subscriptions to Achiev
          </h2>
          <p className="text-xs sm:text-sm text-[#ccb799] max-w-2xl mx-auto">
            Every tier unlocks cross-device medical reading &amp; note-making at a fraction of legacy app prices.
          </p>
        </div>

        {/* Achiev Plans Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {SUBSCRIPTION_TIERS.map((tier) => (
            <div
              key={tier.id}
              className={`rounded-2xl p-4 border flex flex-col justify-between ${
                tier.highlight
                  ? 'bg-gradient-to-b from-amber-900/35 to-[#160a05] border-amber-400/55 shadow-lg'
                  : 'bg-[#170c06]/80 border-amber-500/20'
              }`}
            >
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-amber-300">{tier.badge}</div>
                <h3 className="text-base font-bold text-amber-50 mt-1">{tier.name}</h3>
                <div className="text-2xl font-extrabold text-emerald-300 mt-1">
                  {tier.priceMonthly === 0 ? '₹0' : `₹${tier.priceMonthly}`}
                  <span className="text-xs font-normal text-[#cbb497]">/month</span>
                </div>
                <p className="text-xs text-[#d2bea1] mt-2 leading-relaxed">{tier.description}</p>
              </div>
              <ul className="mt-3 pt-3 border-t border-white/10 space-y-1.5">
                {tier.features.slice(0, 4).map((f) => (
                  <li key={f} className="flex items-start gap-1.5 text-[11px] text-[#eadbc6]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Competitor Comparison Table */}
        <div className="rounded-2xl border border-amber-500/20 bg-[#150a05]/85 overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[640px]">
            <thead>
              <tr className="border-b border-amber-500/20 text-[11px] uppercase tracking-wider text-amber-300 bg-black/25">
                <th className="py-3 px-4">Popular Note App</th>
                <th className="py-3 px-4">Their Typical Cost</th>
                <th className="py-3 px-4">Achiev Cost</th>
                <th className="py-3 px-4">Why Achiev Wins for Medical Students</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10 text-xs">
              {COMPETITOR_BENCHMARKS.map((row) => (
                <tr key={row.app} className="hover:bg-white/[0.03]">
                  <td className="py-3 px-4 font-bold text-amber-50">{row.app}</td>
                  <td className="py-3 px-4 text-rose-300/90 font-medium">{row.typicalPriceNote}</td>
                  <td className="py-3 px-4 text-emerald-300 font-bold">
                    ₹{row.achievPriceMonthlyInr}/mo ({row.matchedAchievTier})
                  </td>
                  <td className="py-3 px-4 text-[#e0cfb7]">{row.achievAdvantage}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ═══════════════ 4. MEDICAL STUDENT SEO FAQ ACCORDION ═══════════════ */}
      <section aria-labelledby="medical-faq-heading" className="max-w-4xl mx-auto space-y-3 pb-6">
        <h2 id="medical-faq-heading" className="text-lg sm:text-xl font-bold text-center text-amber-50 mb-4">
          Frequently Asked Questions · Medical Student Study Workspace
        </h2>
        {SEO_FAQS.map((item, i) => {
          const isOpen = openFaqIdx === i;
          return (
            <div
              key={item.q}
              className="rounded-2xl border border-amber-500/20 bg-[#180c06]/80 overflow-hidden"
            >
              <button
                type="button"
                onClick={() => setOpenFaqIdx(isOpen ? null : i)}
                className="w-full px-4 py-3.5 text-left flex items-center justify-between gap-3 cursor-pointer hover:bg-white/[0.03]"
              >
                <span className="text-xs sm:text-sm font-bold text-amber-100">{item.q}</span>
                {isOpen ? (
                  <ChevronUp className="w-4 h-4 text-amber-300 shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-amber-300 shrink-0" />
                )}
              </button>
              {isOpen && (
                <div className="px-4 pb-3.5 text-xs sm:text-[13px] text-[#d6c2a5] leading-relaxed border-t border-white/5 pt-2.5">
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

/* ───────────── ANIMATED LIVE SCENE RENDERER PER EPISODE ───────────── */
const EpisodeAnimatedViewport: React.FC<{ episode: SeriesEpisode; progressPct: number }> = ({
  episode,
  progressPct,
}) => {
  const step = progressPct < 33 ? 1 : progressPct < 68 ? 2 : 3;

  if (episode.iconKey === 'dashboard') {
    return (
      <div className="grid grid-cols-3 gap-2.5 items-center">
        <div className="col-span-2 rounded-2xl p-3 bg-white/[0.06] border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-[11px] font-bold text-amber-200">
            <span>Cockpit · MBBS Pharmacology &amp; Path</span>
            <span className="px-2 py-0.5 rounded bg-amber-500/25 text-amber-200 animate-pulse">Live Sync</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {['14 Notebooks', '8 Books Read', '92% Streak'].map((kpi, i) => (
              <div
                key={kpi}
                className={`rounded-xl p-2 text-[10px] font-semibold border transition-all duration-500 ${
                  step >= i + 1 ? 'bg-amber-500/20 border-amber-400/50 text-amber-50 scale-[1.03]' : 'bg-black/30 border-white/10 text-stone-400'
                }`}
              >
                {kpi}
              </div>
            ))}
          </div>
        </div>
        <div
          className={`rounded-2xl p-3 border text-center transition-all duration-500 ${
            step >= 2 ? 'bg-amber-500/25 border-amber-300 scale-105 shadow-lg' : 'bg-white/[0.05] border-white/10'
          }`}
        >
          <Eye className="w-6 h-6 mx-auto text-amber-300 mb-1" />
          <div className="text-[11px] font-bold text-amber-50">Eye Rest Timer</div>
          <div className="text-sm font-mono font-extrabold text-amber-300 mt-0.5">
            {step === 1 ? '20:00' : step === 2 ? '19:42' : 'Break: 20s ✨'}
          </div>
        </div>
      </div>
    );
  }

  if (episode.iconKey === 'read') {
    return (
      <div className="grid grid-cols-2 gap-3">
        {[
          { book: "Harrison's Internal Med", tag: 'PDF · Page 412', active: step >= 1 },
          { book: 'Robbins Pathology Notes', tag: 'EPUB / DOCX Side-by-Side', active: step >= 2 },
        ].map((pane, idx) => (
          <div
            key={pane.book}
            className={`rounded-2xl p-3 border transition-all duration-500 ${
              pane.active ? 'bg-sky-500/15 border-sky-400/45 translate-y-0 opacity-100' : 'bg-white/[0.04] border-white/10 opacity-60 translate-y-1'
            }`}
          >
            <div className="flex items-center justify-between text-[10px] font-bold text-sky-300 mb-1.5">
              <span>Slab {idx + 1} · {pane.tag}</span>
              <BookOpenText className="w-3.5 h-3.5" />
            </div>
            <div className="text-xs font-bold text-white">{pane.book}</div>
            <div className="mt-2 space-y-1">
              <div className="h-2 w-11/12 rounded bg-white/15" />
              <div className={`h-2 w-4/5 rounded transition-colors ${step === 3 ? 'bg-amber-400/70' : 'bg-white/15'}`} />
              <div className="h-2 w-3/4 rounded bg-white/10" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (episode.iconKey === 'note') {
    return (
      <div className="grid grid-cols-12 gap-2.5">
        <div className="col-span-5 rounded-2xl p-2.5 bg-emerald-500/10 border border-emerald-400/35">
          <div className="text-[10px] font-bold text-emerald-300 flex items-center gap-1 mb-1">
            <BookOpenText className="w-3 h-3" />
            <span>Open Book Beside Note</span>
          </div>
          <div className="text-[11px] font-semibold text-white">KDT Pharmacology</div>
          <div className="mt-2 p-2 rounded-lg bg-black/40 border border-dashed border-emerald-400/50 text-[10px] text-emerald-100">
            {step === 1 ? '📷 Textbook table image selected' : '✓ Converted via Picture-to-Table!'}
          </div>
        </div>
        <div className="col-span-7 rounded-2xl p-2.5 bg-[#fffdf7]/10 border border-white/15 flex flex-col justify-between">
          <div>
            <div className="text-[10px] font-bold text-amber-200 flex items-center justify-between">
              <span className="flex items-center gap-1"><PenTool className="w-3 h-3" /> Ruled Clinical Note</span>
              <Table2 className="w-3.5 h-3.5 text-emerald-300" />
            </div>
            <div className="mt-1.5 grid grid-cols-3 gap-1 text-[9px] font-mono">
              {['Drug', 'Mechanism', 'Key Side Effect', 'Atropine', 'M-Blocker', 'Dry mouth', 'Digoxin', 'Na/K ATPase', 'Yellow vision'].map(
                (cell, ci) => (
                  <div
                    key={cell}
                    className={`px-1.5 py-1 rounded border transition-all ${
                      ci < 3
                        ? 'bg-emerald-600/35 border-emerald-400/40 font-bold text-white'
                        : step >= 2
                          ? 'bg-white/10 border-white/15 text-amber-50'
                          : 'bg-white/[0.03] border-white/5 text-transparent'
                    }`}
                  >
                    {cell}
                  </div>
                )
              )}
            </div>
          </div>
          <div className="mt-2 px-2 py-1 rounded bg-black/50 text-[9px] text-amber-200 flex items-center justify-between">
            <span>▶ Lecture Video Docked at Bottom</span>
            <span>Pinned</span>
          </div>
        </div>
      </div>
    );
  }

  if (episode.iconKey === 'calendar') {
    return (
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl p-3 bg-violet-500/15 border border-violet-400/40 space-y-1.5">
          <div className="text-[11px] font-bold text-violet-200">Daily Trackers &amp; Tasks</div>
          {[
            { t: 'Revise 40 Anatomy MCQs', done: step >= 1 },
            { t: 'Medicine Ward Posting 8 AM', done: step >= 2 },
            { t: '20-min Anki Card Streak', done: step >= 3 },
          ].map((item) => (
            <div key={item.t} className="flex items-center gap-2 text-[11px] bg-black/30 rounded-lg px-2 py-1">
              <span className={item.done ? 'text-emerald-400 font-bold' : 'text-stone-500'}>
                {item.done ? '☑' : '☐'}
              </span>
              <span className={item.done ? 'line-through text-stone-300' : 'text-white'}>{item.t}</span>
            </div>
          ))}
        </div>
        <div className="rounded-2xl p-3 bg-white/[0.06] border border-white/15">
          <div className="text-[11px] font-bold text-amber-200 mb-2">Smart Clinical Schedule Grid</div>
          <div className="grid grid-cols-4 gap-1 text-center text-[9px]">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Surgery', 'Medicine', 'OBG', 'Peds'].map((c, idx) => (
              <div
                key={c}
                className={`p-1.5 rounded ${
                  idx < 4
                    ? 'bg-violet-500/30 text-violet-100 font-bold'
                    : step >= 2
                      ? 'bg-amber-500/25 text-amber-100'
                      : 'bg-white/5 text-stone-400'
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

  if (episode.iconKey === 'shelf') {
    return (
      <div className="rounded-2xl p-3 bg-[#1c1008]/90 border border-amber-500/35 space-y-2">
        <div className="flex items-center justify-between text-[11px] font-bold text-amber-200">
          <span>3D Almirah Bay · Glass Doors &amp; Black Steel Vault</span>
          <span className="text-pink-300">{step === 3 ? '🐱 Kitty Petted: purr~ ♥ ♥' : '🐱 Walking on Floor...'}</span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <div className="rounded-xl p-2 bg-amber-900/35 border border-white/25 text-[10px]">
            <div className="font-bold text-amber-100">Glass Walnut</div>
            <div className="flex gap-1 mt-1.5">
              <span className="h-7 w-2.5 rounded-xs bg-rose-700" />
              <span className="h-7 w-2.5 rounded-xs bg-sky-700" />
              <span className={`h-7 w-2.5 rounded-xs bg-amber-600 transition-transform ${step >= 2 ? 'translate-x-10 scale-110 ring-2 ring-amber-300' : ''}`} />
            </div>
          </div>
          <div className="rounded-xl p-2 bg-amber-800/30 border border-white/25 text-[10px]">
            <div className="font-bold text-amber-100">Glass Caramel</div>
            <div className="text-[9px] text-amber-200/80 mt-2">
              {step >= 2 ? '📥 Book Dropped!' : 'Crystal Sliding Glass'}
            </div>
          </div>
          <div className="rounded-xl p-2 bg-[#0a0c10] border border-stone-600 text-[10px]">
            <div className="font-bold text-stone-200">Obsidian Vault</div>
            <div className="w-6 h-6 rounded-full border-2 border-amber-400 mx-auto mt-1 bg-stone-900" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl p-4 border border-white/15 bg-white/[0.05] flex items-center justify-between gap-4">
      <div className="space-y-1.5">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold" style={{ color: episode.accent }}>
          <Sparkles className="w-3.5 h-3.5" />
          <span>{episode.sidebarSegment}</span>
        </div>
        <div className="text-sm sm:text-base font-bold text-white">{episode.title}</div>
        <div className="text-xs text-[#d6c2a5] max-w-md">{episode.subtitle}</div>
      </div>
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 shadow-lg transition-transform duration-500"
        style={{ background: episode.accentSoft, border: `1.5px solid ${episode.accent}`, transform: `scale(${step === 2 ? 1.08 : 1})` }}
      >
        {React.createElement(getEpisodeIcon(episode.iconKey), {
          className: 'w-8 h-8',
          style: { color: episode.accent },
        })}
      </div>
    </div>
  );
};

export default FeatureVideoSeriesShowcase;
