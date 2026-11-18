import React, { useEffect, useState } from 'react';
import {
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Minus,
} from 'lucide-react';
import { DEMO_SCENES } from './productDemoData';
import { LaptopFrame, TabletFrame } from './ProductDemoDevices';
import { SUBSCRIPTION_TIERS } from '../../../data/subscriptionData';
import studentsStudyPhoto from '../../../assets/images/students_study_discussion_1794823058129.webp';
import studentNotesReaderPhoto from '../../../assets/images/student_notes_reader_1794933139826.webp';
import studentShelfFlowchartsPhoto from '../../../assets/images/student_shelf_flowcharts_1794933139670.webp';
import studentTablesLibraryPhoto from '../../../assets/images/student_tables_library_1794933140110.webp';
import studentFocusTimersPhoto from '../../../assets/images/student_focus_timers_1794933140912.webp';

const SCENE_MS = 6500;
const PHOTO_MS = 4500;

interface StudyEnvironmentPhoto {
  id: string;
  src: string;
  alt: string;
  eyebrow: string;
  featureLabel: string;
  environment: string;
  headline: string;
  description: string;
}

const STUDY_GALLERY_PHOTOS: StudyEnvironmentPhoto[] = [
  {
    id: 'notes-reader',
    src: studentNotesReaderPhoto,
    alt: 'Single medical student at an oak desk beside a rainy arched library window reading a textbook PDF side-by-side with lined clinical notes and a pinned lecture video',
    eyebrow: '01 · Rainy Library Window · Split Textbook & Notes',
    featureLabel: 'Dual PDF + Lined Notes',
    environment: 'Oak Library Alcove',
    headline: 'Read Harrison beside lined handwriting or serif notes with your lecture pinned in the corner.',
    description: 'Zero tab-switching—highlight textbooks on the left while capturing recall pearls and docked video timestamps on the right.',
  },
  {
    id: 'shelf-flowcharts',
    src: studentShelfFlowchartsPhoto,
    alt: 'Single scholar studying at night by a warm amber banker lamp in a mahogany wood study nook surrounded by indoor plants while viewing a 3D bookshelf almirah and branching flowchart on tablet',
    eyebrow: '02 · Amber Lamp Timber Nook · 3D Almirah & Flowcharts',
    featureLabel: '3D Shelf & Flowcharts',
    environment: 'Evening Mahogany Study',
    headline: 'Carry up to 5 backlit 3D bookshelf almirahs paired with interactive multi-level clinical flowcharts.',
    description: 'Pull books off tactile shelves straight into split-screen reading and map pathology cascades cleanly.',
  },
  {
    id: 'tables-library',
    src: studentTablesLibraryPhoto,
    alt: 'Single university student at a sunlit Scandinavian pine loft desk typing on an ultrabook showing extracted classification tables beside an organized file explorer folder list',
    eyebrow: '03 · Sunlit Pine Loft · Picture-to-Table & File Explorer',
    featureLabel: 'Tables & Recent Files',
    environment: 'Morning Nordic Loft',
    headline: 'Turn textbook photographs into editable tables and browse every PDF or note in one scrollable vault.',
    description: 'Organize class rosters, schedules, DOCX handouts, and subject folders with instant multi-select download, move, and share.',
  },
  {
    id: 'focus-timers',
    src: studentFocusTimersPhoto,
    alt: 'Single young scholar relaxing in a cognac leather armchair beside a twilight bookshop window holding a tablet displaying habit trackers, a 20-20-20 eye rest countdown, and calm leisure soundscapes',
    eyebrow: '04 · Twilight Bookshop Corner · Habit Trackers & Eye Rest Timer',
    featureLabel: 'Trackers & Eye Wellness',
    environment: 'Café Reading Armchair',
    headline: 'Track study hours, MCQs, 20-20-20 eye rest breaks, and peaceful rain soundscapes without leaving focus.',
    description: 'Stay fresh through marathon revision blocks with gentle ocular rest alerts and 15-minute leisure resets.',
  },
  {
    id: 'group-study',
    src: studentsStudyPhoto,
    alt: 'Students seated around a cozy espresso-toned lounge table collaborating across laptops and tablets on clinical tables and revision flowcharts',
    eyebrow: '05 · Shared Study Lounge · Study Circle & Mnemonics',
    featureLabel: 'Collaborative Revision',
    environment: 'Espresso Study Table',
    headline: 'When notes, flowcharts, and reference books open together—every group discussion moves twice as fast.',
    description: 'Compare shared mnemonic decks, revise high-yield tables together, and sync progress seamlessly across Mac, Windows, and iPad.',
  },
];

const PRODUCT_FAQS = [
  {
    q: 'Can I read medical textbooks beside my notes while keeping lectures docked?',
    a: 'Yes. Open any PDF, Word (.docx), or EPUB file right next to your ruled clinical note sheet, snip diagrams directly in, and keep your study lecture pinned cleanly.',
  },
  {
    q: 'How does Picture-to-Table speed up pharmacology and pathology revision?',
    a: 'Upload or snap a photo of a classification table from a textbook or slide, and Achiev structures the rows into an editable grid directly on your note page.',
  },
  {
    q: 'Can I save directly from Google Drive or sync across my laptop and iPad?',
    a: 'Yes. Connect your personal Google Drive vault for heavy medical PDFs and textbooks while keeping all ruled notebooks, tasks, flowcharts, and themes synced across devices.',
  },
  {
    q: 'Can I customize fonts, line spacing, paper color, and themes across the whole app?',
    a: 'Yes. Choose from a curated bag of Handwriting, Casual, and Official fonts across every view, customize sepia or custom paper shades and ruled line spacing, and switch between 5 curated themes and 10 abstract wallpapers.',
  },
  {
    q: 'Can I try Create Note immediately before signing up?',
    a: 'Yes. Click "Skip and create note" right below the login form to open a ruled sheet immediately, then sign in anytime to save and sync your notebooks.',
  },
];

const PLAN_COMPARISON_ROWS: Array<{
  feature: string;
  free: string | boolean;
  pro: string | boolean;
  master: string | boolean;
}> = [
  { feature: 'Cockpit Dashboard, Habit Trackers & Eye Rest Timer', free: true, pro: true, master: true },
  { feature: 'Side-by-Side PDF, DOCX & EPUB Reader + Book-Beside-Notes', free: true, pro: true, master: true },
  { feature: 'Ruled, Dotted & Custom Sepia Paper Studio', free: true, pro: true, master: true },
  { feature: '3D Bookshelf Almirahs', free: '1 Classic', pro: 'All 5 Designs', master: 'All 5 + Unlimited Backlight' },
  { feature: 'AI Picture-to-Table Extractor & Schedule Scanner', free: false, pro: true, master: true },
  { feature: '5 Curated Light/Dark Themes + 10 Abstract Wallpapers', free: 'Standard', pro: true, master: true },
  { feature: 'Interactive Clinical Flowcharts & Mind Maps', free: 'Starter', pro: 'Full Builder', master: 'Multi-Level Unlimited' },
  { feature: 'Personal Google Drive Vault & Cross-Platform Import', free: false, pro: 'Basic Sync', master: 'Unlimited Vault + Hotline' },
  { feature: 'Academic Membership Pricing', free: '₹0 Forever', pro: '₹100/mo · ₹1,200/yr', master: '₹300/mo · ₹3,600/yr' },
];

const SHOWCASE_CSS = `
  @keyframes pdsFade {
    from { opacity: 0; transform: translateY(6px); }
    to { opacity: 1; transform: none; }
  }
  .pds-arrow-col,
  .pds-arrow-col:hover,
  .pds-arrow-col:active,
  .pds-arrow-col:focus,
  .pds-arrow-col:focus-visible {
    background: transparent !important;
    background-color: transparent !important;
    background-image: none !important;
    border: none !important;
    box-shadow: none !important;
    outline: none !important;
    transform: none !important;
    filter: none !important;
    -webkit-tap-highlight-color: transparent !important;
  }
  .pds-faq-btn,
  .pds-faq-btn:hover,
  .pds-faq-btn:focus,
  .pds-faq-btn:active {
    background: transparent !important;
    background-color: transparent !important;
    background-image: none !important;
    color: #2c1206 !important;
    border: none !important;
    box-shadow: none !important;
    outline: none !important;
  }
`;

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const ProductDemoShowcase: React.FC = () => {
  const total = DEMO_SCENES.length;
  const [laptopIdx, setLaptopIdx] = useState(0);
  const [tabletIdx, setTabletIdx] = useState(1 % total);
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(0);
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);
  const [failedPhotoIds, setFailedPhotoIds] = useState<Record<string, boolean>>({});

  const laptopScene = DEMO_SCENES[laptopIdx]!;
  const tabletScene = DEMO_SCENES[tabletIdx]!;
  const activePhoto = STUDY_GALLERY_PHOTOS[activePhotoIdx] || STUDY_GALLERY_PHOTOS[0]!;

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const id = window.setInterval(() => {
      setLaptopIdx((i) => (i + 1) % total);
      setTabletIdx((i) => (i + 1) % total);
    }, SCENE_MS);
    return () => window.clearInterval(id);
  }, [total]);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const id = window.setTimeout(() => {
      setActivePhotoIdx((i) => (i + 1) % STUDY_GALLERY_PHOTOS.length);
    }, PHOTO_MS);
    return () => window.clearTimeout(id);
  }, [activePhotoIdx]);

  const prevLaptop = () => setLaptopIdx((i) => (i - 1 + total) % total);
  const nextLaptop = () => setLaptopIdx((i) => (i + 1) % total);
  const prevTablet = () => setTabletIdx((i) => (i - 1 + total) % total);
  const nextTablet = () => setTabletIdx((i) => (i + 1) % total);

  const renderPlanCell = (val: string | boolean) => {
    if (val === true) {
      return (
        <span className="inline-flex items-center justify-center text-[#784614]" aria-label="Included">
          <Check className="w-4 h-4 stroke-[2.5]" />
        </span>
      );
    }
    if (val === false) {
      return (
        <span className="inline-flex items-center justify-center text-[#8B6B4A]/50" aria-label="Not included">
          <Minus className="w-4 h-4" />
        </span>
      );
    }
    return <span className="text-[11.5px] font-semibold text-[#3b1e0d] tabular-nums">{val}</span>;
  };

  return (
    <section
      aria-labelledby="product-demo-heading"
      className="w-full pb-16 sm:pb-24"
      style={{
        fontFamily: "'Urbanist', -apple-system, BlinkMacSystemFont, sans-serif",
        background:
          'linear-gradient(180deg, #0b0402 0%, #110602 5%, #180904 10%, #210c05 15%, #2b1207 20%, #37180a 25%, #46200e 30%, #572a14 35%, #6a361b 40%, #7f4424 45%, #955530 50%, #ab693f 55%, #c17e51 59%, #d49668 63%, #e3af81 67%, #eec699 71%, #f4d8b3 74%, #f6e6cb 77%, #f2dfc0 88%, #ecd3ab 100%)',
      }}
    >
      <style>{SHOWCASE_CSS}</style>

      {/* ═══════════════ 0. CONCISE INTRO IN DEEP COCOA ZONE ═══════════════ */}
      <div className="w-full px-4 sm:px-8 pt-16 sm:pt-24 pb-12 sm:pb-16">
        <div className="max-w-3xl mx-auto text-center px-3 space-y-3">
          <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.2em] text-[#f5d093] drop-shadow-[0_1px_6px_rgba(6,2,0,0.85)]">
            Luxury &amp; Customisable Study Sanctuary · ₹0 Free, ₹100 Pro &amp; ₹300 Master
          </p>
          <h2 className="text-2xl sm:text-4xl font-bold text-[#fffaf0] leading-tight text-balance drop-shadow-[0_2px_12px_rgba(6,2,0,0.85)]">
            High-End Note Maker &amp; Focus Workspace for Global Students
          </h2>
          <p className="text-sm sm:text-base text-[#f7e5ca] max-w-2xl mx-auto leading-relaxed drop-shadow-[0_1px_6px_rgba(6,2,0,0.8)]">
            One calm desk compiling your notes, textbooks, and lecture videos without heavy bags or distraction.
          </p>
        </div>
      </div>

      {/* Main Content Container Stretching Smoothly Through the 6× Merge Band */}
      <div className="max-w-6xl mx-auto px-4 sm:px-8 space-y-16 sm:space-y-24">

      {/* ═══════════════ 1. MACBOOK PRO SHOWCASE (HIGH-CONTRAST IVORY TEXT ON ROASTED COCOA) ═══════════════ */}
      <div>
        <div className="space-y-2 text-center mb-6 sm:mb-8">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#f4cd90] drop-shadow-[0_1px_6px_rgba(10,3,0,0.7)]">
            Desktop Studio · MacBook View
          </p>
          <h2
            id="product-demo-heading"
            className="text-xl sm:text-3xl font-bold text-[#fffaf0] leading-[1.25] text-balance drop-shadow-[0_2px_12px_rgba(10,3,0,0.75)]"
          >
            {laptopScene.title}
          </h2>
          <p className="text-sm font-normal text-[#f5e3c6] leading-relaxed max-w-2xl mx-auto drop-shadow-[0_1px_6px_rgba(10,3,0,0.7)]">
            {laptopScene.caption}
          </p>
        </div>

        <div className="grid grid-cols-[44px_minmax(0,1fr)_44px] sm:grid-cols-[76px_minmax(0,1fr)_76px] items-stretch">
          <button
            type="button"
            onClick={prevLaptop}
            aria-label="Previous laptop section preview"
            className="pds-arrow-col flex items-center justify-center cursor-pointer select-none text-[#f7e1be]/85 hover:text-white drop-shadow-[0_2px_8px_rgba(10,3,0,0.8)]"
          >
            <ChevronLeft className="w-9 h-24 sm:w-12 sm:h-32 shrink-0" strokeWidth={1.35} aria-hidden="true" />
          </button>

          <div className="min-w-0 py-2">
            <LaptopFrame scene={laptopScene} onSelectSection={setLaptopIdx} />
          </div>

          <button
            type="button"
            onClick={nextLaptop}
            aria-label="Next laptop section preview"
            className="pds-arrow-col flex items-center justify-center cursor-pointer select-none text-[#f7e1be]/85 hover:text-white drop-shadow-[0_2px_8px_rgba(10,3,0,0.8)]"
          >
            <ChevronRight className="w-9 h-24 sm:w-12 sm:h-32 shrink-0" strokeWidth={1.35} aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* ═══════════════ 2. CLEAN SCANNABLE HIGHLIGHTS BELOW LAPTOP ═══════════════ */}
      <div className="max-w-5xl mx-auto py-4 px-2 sm:px-4">
        <div className="text-center space-y-2.5 max-w-2xl mx-auto px-2">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#f5d093] drop-shadow-[0_1px_6px_rgba(8,2,0,0.85)]">
            Why Scholars Choose Achiev
          </p>
          <h3 className="text-xl sm:text-3xl font-bold text-[#fffaf0] leading-snug text-balance drop-shadow-[0_2px_12px_rgba(8,2,0,0.85)]">
            A luxury, cozy &amp; customisable study room designed for deep focus.
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-5 mt-8 pt-7 border-t border-[#f5d093]/25 text-left px-2">
          {[
            {
              num: '01',
              title: '1st Ever Luxury, Cozy & Customisable Study Vibe',
              body: 'Tailor every theme, sepia paper shade, font, and layout so your desk feels calm and personal.',
            },
            {
              num: '02',
              title: 'Notes, Books & Lecture Videos in One Place',
              body: 'Read textbooks beside lined notes while pinning lecture videos—no heavy books required.',
            },
            {
              num: '03',
              title: 'Homely 3D Almirah Bookshelf Setup',
              body: 'Organize books inside wooden & glass almirahs with custom designs of your choice.',
            },
            {
              num: '04',
              title: 'Gemini Flowcharts to Organise Theory',
              body: 'Convert sprawling chapters into structured multi-level flowcharts for rapid recall.',
            },
            {
              num: '05',
              title: 'Eye Rest Timer for Healthy Study Hours',
              body: 'Built-in 20-20-20 ocular rest alerts protect your eyes so you stay fresh and excel.',
            },
            {
              num: '06',
              title: 'Study Groups Without Social Media',
              body: 'Connect with classmates in focused study circles with zero social media distraction.',
            },
            {
              num: '07',
              title: 'Leisure Mode & Smart Break Reminders',
              body: 'Explore scenic relaxation breaks when bored while keeping track of your break timer.',
            },
            {
              num: '08',
              title: 'Talk to Developer & Earn Idea Credits',
              body: 'Suggest improvements directly; implemented ideas receive public credit with full privacy.',
            },
            {
              num: '09',
              title: 'Handwriting, Casual & Official Font Bag',
              body: 'Switch freely across curated Handwriting, Casual, and Official typography styles.',
            },
            {
              num: '10',
              title: 'Customised Goal & Habit Trackers',
              body: 'Monitor daily focus hours, MCQs, and habits on one clear dashboard.',
            },
          ].map((item) => (
            <div key={item.num} className="pt-3.5 border-t border-[#f5d093]/15 flex items-start gap-3">
              <span className="text-xs font-mono font-bold text-[#f5d093] pt-0.5 shrink-0 tabular-nums drop-shadow-[0_1px_4px_rgba(8,2,0,0.8)]">
                {item.num}
              </span>
              <div className="space-y-0.5">
                <h4 className="text-sm sm:text-[15px] font-bold text-[#fff8ea] leading-snug drop-shadow-[0_1px_6px_rgba(8,2,0,0.8)]">
                  {item.title}
                </h4>
                <p className="text-xs sm:text-[13px] text-[#f3dfc1] leading-relaxed drop-shadow-[0_1px_4px_rgba(8,2,0,0.75)]">
                  {item.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ═══════════════ 3. IPAD PRO SHOWCASE (DYNAMIC TEXT WITHOUT BOX WRAPPER) ═══════════════ */}
      <div>
        <div className="space-y-1.5 text-center mb-6 sm:mb-8 max-w-2xl mx-auto px-3">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#f8dca8] drop-shadow-[0_1px_8px_rgba(10,3,0,0.85)]">
            Bedside &amp; Companion · iPad Pro View
          </p>
          <h3 className="text-lg sm:text-2xl font-bold text-[#fffaf0] leading-[1.25] text-balance drop-shadow-[0_2px_10px_rgba(10,3,0,0.85)]">
            {tabletScene.title}
          </h3>
          <p className="text-sm font-medium text-[#f5e3c6] leading-relaxed max-w-xl mx-auto drop-shadow-[0_1px_8px_rgba(10,3,0,0.8)]">
            {tabletScene.tablet.heading} — {tabletScene.tablet.subheading}
          </p>
        </div>

        <div className="grid grid-cols-[44px_minmax(0,1fr)_44px] sm:grid-cols-[76px_minmax(0,1fr)_76px] items-stretch">
          <button
            type="button"
            onClick={prevTablet}
            aria-label="Previous tablet section preview"
            className="pds-arrow-col flex items-center justify-center cursor-pointer select-none text-[#190802]/85 hover:text-[#0d0401] drop-shadow-[0_1px_8px_rgba(255,248,236,0.92)]"
          >
            <ChevronLeft className="w-9 h-24 sm:w-12 sm:h-32 shrink-0" strokeWidth={1.5} aria-hidden="true" />
          </button>

          <div className="min-w-0 py-2">
            <TabletFrame scene={tabletScene} onSelectSection={setTabletIdx} />
          </div>

          <button
            type="button"
            onClick={nextTablet}
            aria-label="Next tablet section preview"
            className="pds-arrow-col flex items-center justify-center cursor-pointer select-none text-[#190802]/85 hover:text-[#0d0401] drop-shadow-[0_1px_8px_rgba(255,248,236,0.92)]"
          >
            <ChevronRight className="w-9 h-24 sm:w-12 sm:h-32 shrink-0" strokeWidth={1.5} aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* ═══════════════ 4. 5 DSLR COZY STUDY ROOMS & SINGLE-STUDENT FEATURE SHOWCASE ═══════════════ */}
      <div className="max-w-5xl mx-auto space-y-5">
        <div className="text-center space-y-1.5 max-w-2xl mx-auto px-2">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#5c2c09]">
            Inside Everyday Study Environments · 5 Real Desk Stories
          </p>
          <h3 className="text-xl sm:text-3xl font-bold text-[#190802] leading-snug">
            Every study corner—paired with a dedicated Achiev tool.
          </h3>
        </div>

        {/* Main Active DSLR 16:9 Scene */}
        <div className="relative rounded-3xl overflow-hidden border border-[#6E411A]/35 shadow-[0_24px_60px_rgba(32,16,6,0.22)] bg-[#1f1008]">
          {!failedPhotoIds[activePhoto.id] ? (
            <img
              key={activePhoto.id}
              src={activePhoto.src}
              alt={activePhoto.alt}
              width={1100}
              height={614}
              loading="lazy"
              decoding="async"
              fetchPriority="low"
              referrerPolicy="no-referrer"
              onError={() =>
                setFailedPhotoIds((prev) => ({ ...prev, [activePhoto.id]: true }))
              }
              className="w-full aspect-[16/9] object-cover object-center block transition-opacity duration-300"
            />
          ) : (
            <div className="w-full aspect-[16/9] flex flex-col items-center justify-center p-8 text-center bg-gradient-to-br from-[#2a1409] via-[#1c0c05] to-[#0f0603] text-[#efe4d4]">
              <p className="font-serif text-xl font-semibold">{activePhoto.featureLabel}</p>
              <p className="text-xs text-[#d6ba8e] mt-1 max-w-md">{activePhoto.description}</p>
            </div>
          )}

          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#140803]/90 via-[#140803]/22 to-transparent"
          />

          {/* Photo index indicators + Prev / Next arrows on photo */}
          <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1.5 mr-1 px-2.5 py-1.5 rounded-full bg-[#140803]/70 border border-[#f5d093]/25">
              {STUDY_GALLERY_PHOTOS.map((photo, idx) => (
                <button
                  key={photo.id}
                  type="button"
                  onClick={() => setActivePhotoIdx(idx)}
                  aria-label={`View study environment ${idx + 1}: ${photo.featureLabel}`}
                  className={`h-1.5 rounded-full transition-all cursor-pointer ${
                    idx === activePhotoIdx
                      ? 'w-5 bg-[#f5d093]'
                      : 'w-1.5 bg-[#f5d093]/40 hover:bg-[#f5d093]/75'
                  }`}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={() =>
                setActivePhotoIdx((i) => (i - 1 + STUDY_GALLERY_PHOTOS.length) % STUDY_GALLERY_PHOTOS.length)
              }
              aria-label="Previous study room photo"
              className="w-9 h-9 rounded-full bg-[#140803]/75 hover:bg-[#140803] text-[#fff6e8] border border-[#f5d093]/35 flex items-center justify-center cursor-pointer transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setActivePhotoIdx((i) => (i + 1) % STUDY_GALLERY_PHOTOS.length)}
              aria-label="Next study room photo"
              className="w-9 h-9 rounded-full bg-[#140803]/75 hover:bg-[#140803] text-[#fff6e8] border border-[#f5d093]/35 flex items-center justify-center cursor-pointer transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="absolute inset-x-0 bottom-0 p-5 sm:p-8 flex flex-col sm:flex-row sm:items-end justify-between gap-3 text-[#f8efe2]">
            <div className="max-w-2xl space-y-1.5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#e5be76]">
                {activePhoto.eyebrow}
              </p>
              <h3 className="font-serif text-lg sm:text-2xl font-bold leading-snug">
                {activePhoto.headline}
              </h3>
              <p className="text-xs sm:text-[13px] text-[#f3dfc1]/95 leading-relaxed">
                {activePhoto.description}
              </p>
            </div>
          </div>
        </div>

        {/* All 5 Cozy Study Spaces & Distinct App Features Selector Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {STUDY_GALLERY_PHOTOS.map((photo, idx) => {
            const isSelected = idx === activePhotoIdx;
            return (
              <button
                key={photo.id}
                type="button"
                onClick={() => setActivePhotoIdx(idx)}
                className={`group rounded-2xl overflow-hidden border text-left transition-all cursor-pointer flex flex-col ${
                  isSelected
                    ? 'border-[#6b3810] ring-2 ring-[#a66c24]/45 shadow-md bg-[#fff9ee]'
                    : 'border-[#6b3810]/25 hover:border-[#6b3810]/60 bg-[#fffaf2]/80'
                }`}
              >
                <div className="relative w-full aspect-[16/10] bg-[#1f1008] overflow-hidden">
                  {!failedPhotoIds[photo.id] ? (
                    <img
                      src={photo.src}
                      alt={photo.alt}
                      width={1100}
                      height={614}
                      loading="lazy"
                      decoding="async"
                      fetchPriority="low"
                      referrerPolicy="no-referrer"
                      onError={() =>
                        setFailedPhotoIds((prev) => ({ ...prev, [photo.id]: true }))
                      }
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#2a1409] to-[#120703]" />
                  )}
                </div>
                <div className="p-2.5 space-y-0.5">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#85532d] truncate">
                    {photo.environment}
                  </p>
                  <p className="text-xs font-bold text-[#1e0b03] leading-tight line-clamp-1">
                    {photo.featureLabel}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ═══════════════ 5. ACHIEV ACADEMIC PRICING PLANS & COMPARISON TABLE ═══════════════ */}
      <div aria-labelledby="achiev-pricing-heading" className="space-y-8 max-w-5xl mx-auto">
        <div className="text-center space-y-2">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#6b3810]">
            Simple Student Pricing
          </p>
          <h3 id="achiev-pricing-heading" className="text-xl sm:text-3xl font-bold text-[#190802]">
            Achiev Academic Plans
          </h3>
          <p className="text-xs sm:text-sm font-medium text-[#2c1206] max-w-xl mx-auto leading-relaxed">
            Start free forever or unlock clinical extraction, all 5 3D almirahs, and Drive sync via UPI QR, Card, or Net Banking.
          </p>
        </div>

        {/* 3 Tier Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch">
          {SUBSCRIPTION_TIERS.map((tier) => (
            <div
              key={tier.id}
              className={`rounded-2xl p-5 sm:p-6 border flex flex-col justify-between transition-all ${
                tier.highlight
                  ? 'bg-[#FFF8E8]/96 border-[#A66C24] ring-1 ring-[#C98A32]/45 shadow-[0_18px_38px_rgba(92,50,12,0.16)]'
                  : 'bg-[#FFFBF4]/92 border-[#C7A474]/70 shadow-[0_8px_22px_rgba(78,50,15,0.08)]'
              }`}
            >
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#6b3810]">
                  {tier.badge}
                </p>
                <h4 className="text-xl font-bold text-[#190802] mt-1 font-serif">{tier.name}</h4>
                <div className="flex items-baseline gap-2 mt-2 tabular-nums">
                  <span className="text-3xl font-extrabold text-[#190802]">
                    {tier.priceAnnual === 0 ? '₹0' : `₹${tier.priceMonthly}`}
                  </span>
                  <span className="text-xs font-semibold text-[#3b1b0a]">
                    {tier.priceAnnual === 0
                      ? 'Free Forever'
                      : `/ mo · ₹${tier.priceAnnual.toLocaleString('en-IN')}/yr`}
                  </span>
                </div>
                <p className="text-xs font-medium text-[#2c1206] mt-2.5 leading-relaxed">{tier.description}</p>
              </div>

              <div className="mt-5 pt-4 border-t border-[#DEC79E]/75 space-y-4">
                <ul className="space-y-2">
                  {tier.features.slice(0, 5).map((f) => (
                    <li key={f} className="flex items-start gap-2 text-xs font-medium text-[#1e0b03] leading-snug">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#6b3810] shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                <button
                  type="button"
                  onClick={() => window.dispatchEvent(new CustomEvent('achiev_skip_create_note'))}
                  className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                    tier.highlight
                      ? 'bg-[#6b3810] hover:bg-[#52290a] text-white shadow-sm'
                      : 'bg-[#2c1206] hover:bg-[#190802] text-[#fff6e5]'
                  }`}
                >
                  <span>{tier.priceAnnual === 0 ? 'Start Free Note' : 'Explore Studio Free'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Clean Tabular Feature & Pricing Comparison Table */}
        <div className="rounded-2xl border border-[#B8905E]/65 bg-[#FFF9EE]/92 overflow-hidden shadow-[0_10px_28px_rgba(78,50,15,0.08)]">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="bg-[#DFBE92]/70 border-b border-[#B8905E]/60 text-[#190802]">
                  <th className="py-3 px-4 font-serif text-xs sm:text-sm font-bold">Workspace Capability</th>
                  <th className="py-3 px-4 font-serif text-xs sm:text-sm font-bold text-center">Free Scholar</th>
                  <th className="py-3 px-4 font-serif text-xs sm:text-sm font-bold text-center text-[#5c2c09]">
                    Clinical Scholar Pro
                  </th>
                  <th className="py-3 px-4 font-serif text-xs sm:text-sm font-bold text-center">Chief Fellow Master</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D7B789]/55">
                {PLAN_COMPARISON_ROWS.map((row, idx) => (
                  <tr
                    key={row.feature}
                    className={idx % 2 === 1 ? 'bg-[#F5E7CC]/55' : 'bg-transparent'}
                  >
                    <td className="py-2.5 px-4 text-xs sm:text-[13px] font-semibold text-[#1e0b03]">
                      {row.feature}
                    </td>
                    <td className="py-2.5 px-4 text-center">{renderPlanCell(row.free)}</td>
                    <td className="py-2.5 px-4 text-center bg-[#C98E4E]/12">{renderPlanCell(row.pro)}</td>
                    <td className="py-2.5 px-4 text-center">{renderPlanCell(row.master)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ═══════════════ 6. FREQUENTLY ASKED QUESTIONS — PLAIN CHOCOLATE BROWN TEXT WITHOUT BUTTON CHROME ═══════════════ */}
      <div className="max-w-4xl mx-auto">
        <h3 className="text-xl sm:text-2xl font-bold text-center text-[#190802] font-serif mb-6">
          Frequently Asked Questions
        </h3>
        <div className="divide-y divide-[#6b3810]/25 border-t border-b border-[#6b3810]/25">
          {PRODUCT_FAQS.map((item, i) => {
            const isOpen = openFaqIdx === i;
            return (
              <div key={item.q} className="py-1">
                <button
                  type="button"
                  onClick={() => setOpenFaqIdx(isOpen ? null : i)}
                  className="pds-faq-btn raw-icon-btn w-full px-1 py-3.5 text-left flex items-center justify-between gap-3 cursor-pointer"
                >
                  <span className="text-xs sm:text-sm font-bold text-[#3b1e0d] hover:text-[#1f0b03]">
                    {item.q}
                  </span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-[#3b1e0d] shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[#3b1e0d] shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-1 pb-4 text-xs sm:text-[13px] font-medium text-[#3b1e0d] leading-relaxed">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ═══════════════ 7. QUIET LEGAL & PRIVACY FOOTER ═══════════════ */}
      <footer className="max-w-4xl mx-auto pt-4 border-t border-[#6b3810]/30 flex flex-wrap items-center justify-between gap-3 text-xs text-[#2c1206]">
        <span className="font-bold">© {new Date().getFullYear()} Achiev — Settle Ideas</span>
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => window.dispatchEvent(new CustomEvent('achiev_open_privacy_policy'))}
            className="font-bold text-[#190802] hover:underline underline-offset-4 cursor-pointer"
          >
            Privacy Policy
          </button>
          <button
            type="button"
            onClick={() => window.dispatchEvent(new CustomEvent('achiev_skip_create_note'))}
            className="font-bold text-[#190802] hover:underline underline-offset-4 cursor-pointer"
          >
            Open Studio
          </button>
        </div>
      </footer>
      </div>
    </section>
  );
};

export default ProductDemoShowcase;
