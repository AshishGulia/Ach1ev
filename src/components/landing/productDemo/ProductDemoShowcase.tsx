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
import studentsStudyPhoto from '../../../assets/images/students_study_discussion_1794823058129.jpg';

const SCENE_MS = 6500;

const PRODUCT_FAQS = [
  {
    q: 'Can I read medical textbooks beside my notes while keeping lectures docked?',
    a: 'Yes. Open any PDF, Word (.docx), or EPUB file right next to your ruled clinical note sheet, snip diagrams directly in, and keep your study lecture pinned cleanly.',
  },
  {
    q: 'How does Picture-to-Table speed up pharmacology and pathology revision?',
    a: 'Upload or snap a photo of a classification table from a textbook or slide, and Ach1ev structures the rows into an editable grid directly on your note page.',
  },
  {
    q: 'Can I save directly from Google Drive or sync across my laptop and iPad?',
    a: 'Yes. Connect your personal Google Drive vault for heavy medical PDFs and textbooks while keeping all ruled notebooks, tasks, flowcharts, and themes synced across devices.',
  },
  {
    q: 'Can I customize fonts, line spacing, paper color, and themes across the whole app?',
    a: 'Yes. Choose from Handwriting, Sans-Serif, and Serif fonts across every view, customize sepia or custom paper shades and ruled line spacing, and switch between 5 curated themes and 10 abstract wallpapers.',
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
  .pds-faq-btn {
    background: linear-gradient(180deg, #ecd4ac 0%, #e1bf8b 100%) !important;
    background-color: #e6c99a !important;
    color: #3b1e0d !important;
    border: none !important;
    box-shadow: none !important;
  }
  .pds-faq-btn:hover {
    background: linear-gradient(180deg, #e5c899 0%, #d8b279 100%) !important;
    background-color: #deb984 !important;
    color: #2c1408 !important;
  }
`;

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const ProductDemoShowcase: React.FC = () => {
  const total = DEMO_SCENES.length;
  const [laptopIdx, setLaptopIdx] = useState(0);
  const [tabletIdx, setTabletIdx] = useState(1 % total);
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(0);
  const [photoLoadError, setPhotoLoadError] = useState(false);

  const laptopScene = DEMO_SCENES[laptopIdx]!;
  const tabletScene = DEMO_SCENES[tabletIdx]!;

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const id = window.setInterval(() => {
      setLaptopIdx((i) => (i + 1) % total);
      setTabletIdx((i) => (i + 1) % total);
    }, SCENE_MS);
    return () => window.clearInterval(id);
  }, [total]);

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
        fontFamily: "'Libre Baskerville', Baskerville, Georgia, serif",
        background:
          'linear-gradient(180deg, #0b0402 0%, #110602 5%, #180904 10%, #210c05 15%, #2b1207 20%, #37180a 25%, #46200e 30%, #572a14 35%, #6a361b 40%, #7f4424 45%, #955530 50%, #ab693f 55%, #c17e51 59%, #d49668 63%, #e3af81 67%, #eec699 71%, #f4d8b3 74%, #f6e6cb 77%, #f2dfc0 88%, #ecd3ab 100%)',
      }}
    >
      <style>{SHOWCASE_CSS}</style>

      {/* ═══════════════ 0. SEO INTRO IN DEEP GLOOMY DARK CHOCOLATE ZONE ═══════════════ */}
      <div className="w-full px-4 sm:px-8 pt-4 pb-16 sm:pb-20">
        <div className="max-w-4xl mx-auto text-center px-3 space-y-3">
          <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.22em] text-[#f5d093] drop-shadow-[0_1px_6px_rgba(6,2,0,0.85)]">
            Cheapest Medical Note-Making &amp; Focus Study Platform · ₹0 Free, ₹100 Pro &amp; ₹300 Master
          </p>
          <h2 className="text-2xl sm:text-4xl font-bold text-[#fffaf0] leading-tight text-balance drop-shadow-[0_2px_12px_rgba(6,2,0,0.85)]">
            Side-by-Side Textbooks, Ruled Notes, 3D Almirahs &amp; Focus Timers in One Workspace
          </h2>
          <p className="text-sm sm:text-base text-[#f7e5ca] max-w-2xl mx-auto leading-relaxed drop-shadow-[0_1px_6px_rgba(6,2,0,0.8)]">
            Built for MBBS, NEET-PG, USMLE, Nursing, and deep learners: read PDFs/DOCX beside handwriting or serif notes, pin timestamped YouTube lectures, build multi-level flowcharts, and organize every file neatly.
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
            <LaptopFrame scene={laptopScene} />
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

      {/* ═══════════════ 2. EDITORIAL PRAISE STRIP BELOW LAPTOP (BLURRY DARK COCOA GLASS FOR HIGH CONTRAST OVER MID-MERGE) ═══════════════ */}
      <div
        className="max-w-4xl mx-auto py-7 sm:py-9 px-5 sm:px-9 rounded-3xl border border-[#f5d093]/20 shadow-[0_24px_60px_rgba(12,4,1,0.36)]"
        style={{
          background:
            'linear-gradient(155deg, rgba(28, 11, 4, 0.72) 0%, rgba(16, 6, 2, 0.80) 100%)',
          backdropFilter: 'blur(26px) saturate(140%)',
          WebkitBackdropFilter: 'blur(26px) saturate(140%)',
        }}
      >
        <div className="text-center space-y-3 max-w-2xl mx-auto px-2">
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#f4cd90]">
            Why Scholars Switch to Ach1ev
          </p>
          <h3 className="text-xl sm:text-3xl font-bold text-[#fffaf0] leading-snug text-balance">
            One quiet desk where your textbooks, clinical tables, and revision memory finally live together.
          </h3>
          <p className="text-sm sm:text-[15px] text-[#f3dfc1] leading-relaxed">
            Built specifically for long library hours and ward postings—Ach1ev pairs paper-calm reading comfort with
            instant diagram capture, tactile 3D bookshelves, and clinical flowcharts so nothing breaks your focus.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 pt-6 border-t border-[#f5d093]/20 text-left px-2">
          <div className="space-y-1.5">
            <h4 className="text-base font-bold text-[#fff5e2]">Textbooks Beside Living Notes</h4>
            <p className="text-xs sm:text-[13px] text-[#eed8b8] leading-relaxed">
              Keep Harrison or Robbins open right beside ruled sepia pages, snip charts cleanly, and pin your lecture at
              the bottom without juggling five windows.
            </p>
          </div>
          <div className="space-y-1.5">
            <h4 className="text-base font-bold text-[#fff5e2]">Effortless Table &amp; Flowchart Recall</h4>
            <p className="text-xs sm:text-[13px] text-[#eed8b8] leading-relaxed">
              Turn dense pharmacology photographs into structured editable tables and zoom effortlessly through branching
              clinical pathways before exams.
            </p>
          </div>
          <div className="space-y-1.5">
            <h4 className="text-base font-bold text-[#fff5e2]">Laptop Depth, iPad Fluidity</h4>
            <p className="text-xs sm:text-[13px] text-[#eed8b8] leading-relaxed">
              Start an outline on your MacBook at the library and review flashcards or ward rosters seamlessly on your iPad—zero hardware lock-in.
            </p>
          </div>
        </div>
      </div>

      {/* ═══════════════ 3. IPAD PRO SHOWCASE (HIGH-CONTRAST FROSTED CREAM HEADER OVER GOLDEN MERGE) ═══════════════ */}
      <div>
        <div
          className="space-y-1.5 text-center mb-6 sm:mb-8 max-w-2xl mx-auto px-5 py-4 rounded-2xl border border-[#8c5621]/25 shadow-[0_12px_32px_rgba(32,14,4,0.12)]"
          style={{
            background: 'rgba(255, 248, 235, 0.84)',
            backdropFilter: 'blur(18px)',
            WebkitBackdropFilter: 'blur(18px)',
          }}
        >
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#6b3810]">
            Bedside &amp; Companion · iPad Pro View
          </p>
          <h3 className="text-lg sm:text-2xl font-bold text-[#190802] leading-[1.25] text-balance">
            {tabletScene.title}
          </h3>
          <p className="text-sm font-medium text-[#2c1206] leading-relaxed max-w-xl mx-auto">
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
            <TabletFrame scene={tabletScene} />
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

      {/* ═══════════════ 4. DSLR COZY STUDY TABLE PHOTO BELOW TABLET ═══════════════ */}
      <div className="max-w-5xl mx-auto">
        <div className="relative rounded-3xl overflow-hidden border border-[#6E411A]/35 shadow-[0_24px_60px_rgba(32,16,6,0.22)] bg-[#1f1008]">
          {!photoLoadError ? (
            <img
              src={studentsStudyPhoto}
              alt="Three medical students in a cozy espresso-toned library lounge naturally discussing clinical tables and notes opened across a laptop and tablet"
              referrerPolicy="no-referrer"
              onError={() => setPhotoLoadError(true)}
              className="w-full aspect-[16/9] object-cover object-center block"
            />
          ) : (
            <div className="w-full aspect-[16/9] flex flex-col items-center justify-center p-8 text-center bg-gradient-to-br from-[#2a1409] via-[#1c0c05] to-[#0f0603] text-[#efe4d4]">
              <p className="font-serif text-xl font-semibold">Built for Real Study Tables</p>
              <p className="text-xs text-[#d6ba8e] mt-1 max-w-md">
                Discuss pharmacology mechanisms, compare flowcharts, and revise together seamlessly across laptop and tablet.
              </p>
            </div>
          )}

          {/* Subtle Warm Espresso Bottom Scrim for High-Contrast Editorial Caption */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#140803]/88 via-[#140803]/22 to-transparent"
          />

          <div className="absolute inset-x-0 bottom-0 p-5 sm:p-8 flex flex-col sm:flex-row sm:items-end justify-between gap-3 text-[#f8efe2]">
            <div className="max-w-2xl space-y-1">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#e5be76]">
                Shared Study Tables · Ward Prep Together
              </p>
              <h3 className="font-serif text-lg sm:text-2xl font-bold leading-snug">
                When notes, flowcharts, and reference books open together—every group discussion moves twice as fast.
              </h3>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════ 5. ACH1EV ACADEMIC PRICING PLANS & COMPARISON TABLE ═══════════════ */}
      <div aria-labelledby="achiev-pricing-heading" className="space-y-8 max-w-5xl mx-auto">
        <div className="text-center space-y-2">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#6b3810]">
            Simple Student Pricing
          </p>
          <h3 id="achiev-pricing-heading" className="text-xl sm:text-3xl font-bold text-[#190802] font-serif">
            Ach1ev Academic Plans
          </h3>
          <p className="text-xs sm:text-sm font-medium text-[#2c1206] max-w-xl mx-auto leading-relaxed">
            Start free forever or unlock complete clinical extraction, all 5 3D almirahs, and Drive vault sync via UPI QR, Debit/Credit Card, or Net Banking.
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

      {/* ═══════════════ 6. FREQUENTLY ASKED QUESTIONS — HIGH-CONTRAST CHOCOLATE BROWN ═══════════════ */}
      <div className="max-w-4xl mx-auto space-y-3">
        <h3 className="text-xl sm:text-2xl font-bold text-center text-[#190802] font-serif mb-4">
          Frequently Asked Questions
        </h3>
        {PRODUCT_FAQS.map((item, i) => {
          const isOpen = openFaqIdx === i;
          return (
            <div
              key={item.q}
              className="rounded-2xl border border-[#9e6e3c] bg-[#F4E2C2] overflow-hidden shadow-[0_6px_18px_rgba(68,36,12,0.10)]"
            >
              <button
                type="button"
                onClick={() => setOpenFaqIdx(isOpen ? null : i)}
                className="pds-faq-btn raw-icon-btn w-full px-4 py-3.5 text-left flex items-center justify-between gap-3 cursor-pointer transition-colors"
              >
                <span className="text-xs sm:text-sm font-bold text-[#220d04]">{item.q}</span>
                {isOpen ? (
                  <ChevronUp className="w-4 h-4 text-[#220d04] shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-[#220d04] shrink-0" />
                )}
              </button>
              {isOpen && (
                <div className="px-4 pb-3.5 text-xs sm:text-[13px] font-medium text-[#2c1206] bg-[#faf0dc] leading-relaxed border-t border-[#9e6e3c]/35 pt-2.5">
                  {item.a}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ═══════════════ 7. QUIET LEGAL & PRIVACY FOOTER ═══════════════ */}
      <footer className="max-w-4xl mx-auto pt-4 border-t border-[#6b3810]/30 flex flex-wrap items-center justify-between gap-3 text-xs text-[#2c1206]">
        <span className="font-bold">© {new Date().getFullYear()} Ach1ev — Settle Ideas</span>
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
