import React, { useEffect, useState } from 'react';
import {
  Bell,
  BookOpen,
  Check,
  Clock,
  Eye,
  FileText,
  FolderOpen,
  GitBranch,
  Lock,
  Moon,
  MousePointer2,
  QrCode,
  Sliders,
  Sparkles,
  Table2,
  Timer,
  Users,
} from 'lucide-react';
import { DEMO_SECTIONS, type DemoAnchor, type DemoPanel, type DemoScene } from './productDemoData';
import { ACHIEV_EMBLEM_URL } from '../../common/AchievBrand';

const THEME1_THUMB_URL = '/assets/aistudio/theme1_preview_thumb.webp';

type Point = { x: number; y: number };

function anchorPoint(device: 'tablet' | 'laptop', anchor: DemoAnchor, navIndex: number): Point {
  if (anchor === 'nav') return { x: device === 'tablet' ? 14 : 9, y: 21 + navIndex * 7.5 };
  if (anchor === 'header') return device === 'tablet' ? { x: 86, y: 8 } : { x: 88, y: 7 };
  if (device === 'tablet') return { x: 64, y: 36 + anchor * 19 };
  return { x: [28, 56, 84][anchor] ?? 56, y: 58 };
}

const DEVICE_ANIM_CSS = `
  @keyframes pdsCatPatrol {
    0% { transform: translateX(-28px) scaleX(1); }
    46% { transform: translateX(34px) scaleX(1); }
    50% { transform: translateX(34px) scaleX(-1); }
    96% { transform: translateX(-28px) scaleX(-1); }
    100% { transform: translateX(-28px) scaleX(1); }
  }
  @keyframes pdsButterflyFloat {
    0%, 100% { transform: translate(0px, 0px) rotate(-6deg); }
    33% { transform: translate(-8px, -10px) rotate(8deg); }
    66% { transform: translate(7px, -5px) rotate(-10deg); }
  }
`;

interface MiniAlmirahSpec {
  id: string;
  label: string;
  frame: string;
  innerBg: string;
  plank: string;
  trim: string;
  lowerBg: string;
  hasGlassUpper: boolean;
  isArched?: boolean;
  isBiFold?: boolean;
  isVault?: boolean;
  lightText?: boolean;
}

const MINI_ALMIRAH_SPECS: MiniAlmirahSpec[] = [
  {
    id: 'walnut',
    label: 'Classic Walnut',
    frame: '#512d18',
    innerBg: '#271308',
    plank: '#693c21',
    trim: '#d4af37',
    lowerBg: '#3a1f10',
    hasGlassUpper: false,
  },
  {
    id: 'caramel',
    label: 'Creamy Caramel · Clear Glass',
    frame: '#9b6234',
    innerBg: '#6b3f1d',
    plank: '#b47642',
    trim: '#4b2a17',
    lowerBg: 'repeating-linear-gradient(165deg, #8e572b 0px, #9c6233 9px, #7b4821 16px)',
    hasGlassUpper: true,
    isBiFold: true,
  },
  {
    id: 'vanilla',
    label: 'Vanilla White · Bi-Fold',
    frame: '#ede6d8',
    innerBg: '#d8cfbe',
    plank: '#f4efe5',
    trim: '#8a8175',
    lowerBg: '#e4dccd',
    hasGlassUpper: true,
    isBiFold: true,
    lightText: true,
  },
  {
    id: 'mocha',
    label: 'Mocha Espresso · Arch Glass',
    frame: '#333640',
    innerBg: '#171920',
    plank: '#474c5b',
    trim: '#e5d4bc',
    lowerBg: '#23262f',
    hasGlassUpper: true,
    isArched: true,
  },
  {
    id: 'vault',
    label: 'Obsidian Steel Vault',
    frame: '#14161c',
    innerBg: '#07080a',
    plank: '#1f232c',
    trim: '#d4af37',
    lowerBg: '#0c0e12',
    hasGlassUpper: false,
    isVault: true,
  },
];

/* Animated Mini 3D Shelf Room (Cycling All 5 Almirahs + Desk Lamp + Plant + Butterfly + Walking Cat) */
const ShelfShowcaseRoom: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const [almirahIdx, setAlmirahIdx] = useState(0);

  useEffect(() => {
    const reduced =
      typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;
    const timer = window.setInterval(() => {
      setAlmirahIdx((prev) => (prev + 1) % MINI_ALMIRAH_SPECS.length);
    }, 1250);
    return () => window.clearInterval(timer);
  }, []);

  const spec = MINI_ALMIRAH_SPECS[almirahIdx]!;
  const bookSpines = [
    { color: '#881337', h: compact ? 15 : 20, w: compact ? 5 : 6 },
    { color: '#1e3a8a', h: compact ? 17 : 22, w: compact ? 5 : 7 },
    { color: '#065f46', h: compact ? 14 : 18, w: compact ? 4.5 : 6 },
    { color: '#b45309', h: compact ? 16 : 21, w: compact ? 5 : 6.5 },
    { color: '#334155', h: compact ? 15 : 19, w: compact ? 5 : 6 },
  ];

  return (
    <div
      className="relative flex-1 min-h-0 rounded-xl border border-[#d6c7b0] overflow-hidden flex flex-col justify-between"
      style={{
        backgroundImage:
          'linear-gradient(180deg, #efe5d3 0%, #e7d7bd 64%, #b58453 64.5%, #8f6036 100%)',
      }}
    >
      <style>{DEVICE_ANIM_CSS}</style>

      {/* Sunlit Arch Window Glow Behind Almirah */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-3 left-1/2 -translate-x-1/2 w-[56%] h-[50%] rounded-t-full border border-[#d8c4a0]/70"
        style={{
          backgroundImage: 'linear-gradient(180deg, #fffaf0 0%, #f5e6c8 100%)',
          opacity: 0.72,
        }}
      />

      {/* Top Clean Shelf Ribbon: Library + Flowcharts on Left + Active Almirah Counter */}
      <div className="relative z-10 flex items-center justify-between px-2.5 py-1.5 border-b border-[#d6c7b0]/75 bg-[#faf6ee]/85 backdrop-blur-xs">
        <div className="flex items-center gap-1">
          <span className="inline-flex items-center gap-1 rounded-md bg-[#18110c] px-1.5 py-0.5 text-[8px] font-semibold text-[#efe4d4]">
            <BookOpen className="h-2.5 w-2.5 text-[#d4af37]" aria-hidden="true" />
            Library
          </span>
          <span className="inline-flex items-center gap-1 rounded-md border border-[#ccb79a] bg-[#f7efe0] px-1.5 py-0.5 text-[8px] font-semibold text-[#3f2918]">
            <GitBranch className="h-2.5 w-2.5 text-[#8f5f2c]" aria-hidden="true" />
            Flowcharts
          </span>
        </div>

        <span
          key={spec.id}
          className="rounded-md border border-[#c8ab7e] bg-[#fff8ea] px-1.5 py-0.5 text-[8px] font-bold text-[#5c3614] animate-[pdsFade_260ms_ease-out]"
        >
          {almirahIdx + 1}/5 · {spec.label}
        </span>
      </div>

      {/* Main Cozy Study Stage: Brass Desk Lamp (Left) · Cycling Almirah (Center) · Plant & Butterfly (Right) */}
      <div className="relative z-10 flex-1 min-h-0 flex items-end justify-between px-2 sm:px-3 pb-3 pt-1">
        {/* Warm Glow Desk Lamp on Side Table */}
        <div className="flex flex-col items-center shrink-0 mb-0.5" title="Warm Study Lamp">
          <div
            className="relative flex flex-col items-center"
            style={{
              filter: 'drop-shadow(0 4px 8px rgba(217,155,61,0.45))',
            }}
          >
            <div
              className={compact ? 'w-6 h-4 rounded-t-full border border-[#8f6020]/50' : 'w-8 h-5 rounded-t-full border border-[#8f6020]/50'}
              style={{
                backgroundImage: 'linear-gradient(180deg, #fff5cc 0%, #f1c46d 100%)',
              }}
            />
            <div className={compact ? 'w-[2px] h-6 bg-[#9b7130]' : 'w-[2.5px] h-9 bg-[#9b7130]'} />
            <div className={compact ? 'w-5 h-1 rounded-full bg-[#7c561f]' : 'w-6 h-1.5 rounded-full bg-[#7c561f]'} />
          </div>
          <div className={compact ? 'w-7 h-5 rounded-t-sm border-t-2 border-[#7c4d28] bg-[#5c3518]' : 'w-9 h-7 rounded-t-sm border-t-2 border-[#7c4d28] bg-[#5c3518]'} />
        </div>

        {/* Center Cycling 3D Almirah Cabinet */}
        <div
          key={spec.id}
          className={`relative flex flex-col items-center animate-[pdsFade_320ms_ease-out] motion-reduce:animate-none ${
            compact ? 'w-[54%] h-[92%]' : 'w-[46%] h-[94%]'
          }`}
        >
          {/* Cabinet Outer Shell */}
          <div
            className={`w-full flex-1 flex flex-col p-[4px] shadow-[0_12px_22px_rgba(24,10,3,0.36)] border transition-colors duration-300 ${
              spec.isArched ? 'rounded-t-[2.2rem] rounded-b-sm' : 'rounded-t-md rounded-b-sm'
            }`}
            style={{
              backgroundColor: spec.frame,
              borderColor: spec.trim,
            }}
          >
            {/* Brass Top Crest Banner */}
            <div className="flex justify-center pb-[2px]">
              <span
                className="px-2 py-[1px] rounded-[2px] text-[6.5px] font-bold tracking-wider uppercase"
                style={{
                  backgroundColor: spec.isVault ? '#d4af37' : '#e6c57a',
                  color: '#221006',
                }}
              >
                {spec.label.split(' · ')[0]}
              </span>
            </div>

            {/* Upper Section (Bookshelf Bays OR Steel Vault Dial Door) */}
            <div
              className={`relative flex-1 flex flex-col justify-between p-1 overflow-hidden border ${
                spec.isArched ? 'rounded-t-[1.7rem]' : 'rounded-[3px]'
              }`}
              style={{
                backgroundColor: spec.innerBg,
                borderColor: 'rgba(255,255,255,0.12)',
              }}
            >
              {spec.isVault ? (
                <div className="flex-1 flex flex-col items-center justify-center gap-1">
                  <div className="w-8 h-8 rounded-full border-2 border-[#d4af37] bg-[#161922] flex items-center justify-center shadow-inner">
                    <Lock className="w-3.5 h-3.5 text-[#f2cf6c]" aria-hidden="true" />
                  </div>
                  <span className="text-[7px] font-mono font-bold tracking-widest text-[#d4af37]">
                    VAULT
                  </span>
                </div>
              ) : (
                <>
                  {/* Shelf Row 1 */}
                  <div
                    className="flex items-end gap-[2px] px-1 pt-1 border-b-[3px]"
                    style={{ borderColor: spec.plank }}
                  >
                    {bookSpines.map((sp, sIdx) => (
                      <div
                        key={sIdx}
                        className="rounded-t-[1.5px] border-t border-white/25"
                        style={{
                          backgroundColor: sp.color,
                          height: `${sp.h}px`,
                          width: `${sp.w}px`,
                        }}
                      />
                    ))}
                  </div>
                  {/* Shelf Row 2 */}
                  <div
                    className="flex items-end justify-end gap-[2px] px-1 pt-1 border-b-[3px]"
                    style={{ borderColor: spec.plank }}
                  >
                    {bookSpines.slice(0, 4).reverse().map((sp, sIdx) => (
                      <div
                        key={sIdx}
                        className="rounded-t-[1.5px] border-t border-white/25"
                        style={{
                          backgroundColor: sp.color,
                          height: `${sp.h - 2}px`,
                          width: `${sp.w}px`,
                        }}
                      />
                    ))}
                  </div>

                  {/* Translucent Crystal Glass Doors Overlay for Caramel / Vanilla / Mocha */}
                  {spec.hasGlassUpper && (
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 grid grid-cols-2"
                    >
                      <div
                        className="border-r border-white/35"
                        style={{
                          backgroundImage:
                            'linear-gradient(135deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.03) 65%)',
                        }}
                      />
                      <div
                        style={{
                          backgroundImage:
                            'linear-gradient(135deg, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0.02) 70%)',
                        }}
                      />
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Lower Solid Wood / Steel Cabinet Doors */}
            <div
              className="mt-[3px] h-[28%] grid grid-cols-2 gap-[2px] p-[2px] rounded-b-[2px]"
              style={{ backgroundImage: spec.lowerBg.startsWith('repeating') ? spec.lowerBg : undefined, backgroundColor: spec.lowerBg.startsWith('repeating') ? undefined : spec.lowerBg }}
            >
              <div className="border border-black/20 rounded-[1px] flex items-center justify-end pr-0.5">
                <span className="w-[2px] h-2 rounded-full" style={{ backgroundColor: spec.trim }} />
              </div>
              <div className="border border-black/20 rounded-[1px] flex items-center justify-start pl-0.5">
                <span className="w-[2px] h-2 rounded-full" style={{ backgroundColor: spec.trim }} />
              </div>
            </div>
          </div>

          {/* Cabinet Feet / Plinth */}
          <div className="w-[88%] flex justify-between px-1">
            <span className="w-2 h-1.5 rounded-b-xs" style={{ backgroundColor: spec.frame }} />
            <span className="w-2 h-1.5 rounded-b-xs" style={{ backgroundColor: spec.frame }} />
          </div>
        </div>

        {/* Lush Botanical Fiddle-Leaf Fig Plant + Fluttering Butterfly on Right */}
        <div className="relative flex flex-col items-center shrink-0 mb-0.5" title="Botanical Study Plant & Butterfly">
          {/* Fluttering Butterfly */}
          <span
            aria-hidden="true"
            className="absolute -top-2 -left-2 text-[9px] select-none animate-[pdsButterflyFloat_2.8s_ease-in-out_infinite] motion-reduce:animate-none"
          >
            🦋
          </span>
          <svg
            viewBox="0 0 44 58"
            className={compact ? 'w-7 h-9' : 'w-9 h-12'}
            aria-hidden="true"
          >
            <path d="M22 36 Q18 22 12 14" stroke="#4f3926" strokeWidth="1.6" fill="none" />
            <path d="M22 36 Q26 20 32 13" stroke="#4f3926" strokeWidth="1.6" fill="none" />
            <path d="M22 36 V10" stroke="#5b432c" strokeWidth="1.8" fill="none" />
            <ellipse cx="14" cy="17" rx="7" ry="4.5" transform="rotate(-28 14 17)" fill="#3b7343" />
            <ellipse cx="30" cy="16" rx="7" ry="4.5" transform="rotate(26 30 16)" fill="#4c8c53" />
            <ellipse cx="22" cy="10" rx="5.5" ry="7" fill="#68a767" />
            <ellipse cx="16" cy="25" rx="6" ry="3.5" transform="rotate(-15 16 25)" fill="#589657" />
            <ellipse cx="28" cy="25" rx="6" ry="3.5" transform="rotate(15 28 25)" fill="#407846" />
            {/* Matte Cream Ceramic Pot + Wood Legs */}
            <path d="M13 35 L15 49 Q22 52 29 49 L31 35 Z" fill="#efe6d6" stroke="#c2b093" strokeWidth="0.9" />
            <line x1="16" y1="49" x2="14" y2="56" stroke="#6c4327" strokeWidth="1.8" strokeLinecap="round" />
            <line x1="28" y1="49" x2="30" y2="56" stroke="#6c4327" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </div>
      </div>

      {/* Woven Persian Carpet Strip + Animated Walking Tabby Cat */}
      <div
        aria-hidden="true"
        className="pointer-events-none relative z-20 mx-auto mb-1 w-[72%] h-3 rounded-full border border-[#d4af37]/50 flex items-center justify-center"
        style={{
          backgroundImage: 'linear-gradient(90deg, #6d1f1f 0%, #8f2d27 50%, #6d1f1f 100%)',
        }}
      >
        <div
          className="flex items-center gap-0.5 animate-[pdsCatPatrol_5.5s_ease-in-out_infinite] motion-reduce:animate-none"
          title="Walking Study Cat"
        >
          <svg viewBox="0 0 36 22" className="w-6 h-3.5 drop-shadow">
            {/* Curled Tail */}
            <path d="M7 13 Q2 6 6 3" stroke="#d9873d" strokeWidth="2.3" fill="none" strokeLinecap="round" />
            {/* Legs */}
            <line x1="12" y1="15" x2="11" y2="21" stroke="#c4742d" strokeWidth="2" strokeLinecap="round" />
            <line x1="17" y1="15" x2="17" y2="21" stroke="#d9873d" strokeWidth="2" strokeLinecap="round" />
            <line x1="23" y1="15" x2="24" y2="21" stroke="#c4742d" strokeWidth="2" strokeLinecap="round" />
            {/* Ginger Tabby Torso */}
            <ellipse cx="17" cy="13" rx="8.5" ry="4.5" fill="#e59b50" />
            {/* Head + Pointed Ears */}
            <polygon points="22,8 24,2 27,7" fill="#d9873d" />
            <polygon points="27,7 30,2 31,8" fill="#d9873d" />
            <circle cx="27" cy="9.5" r="4.3" fill="#eca65e" />
            <circle cx="28.5" cy="9" r="0.8" fill="#1a0d05" />
          </svg>
        </div>
      </div>

      {/* Tiny 5-Cabinet Carousel Dots at Floor Center */}
      <div className="relative z-20 flex items-center justify-center gap-1 pb-1">
        {MINI_ALMIRAH_SPECS.map((m, idx) => (
          <span
            key={m.id}
            className={`h-1 rounded-full transition-all duration-300 ${
              idx === almirahIdx ? 'w-3.5 bg-[#5c3614]' : 'w-1 bg-[#8f6a40]/45'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

const DemoPointer: React.FC<{ point: Point; accent: string; hint: string }> = ({ point, accent, hint }) => {
  const pos = { left: `${point.x}%`, top: `${point.y}%` };
  const tooltipSide = point.x > 66 ? 'right-0' : 'left-3';

  return (
    <>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute z-20 h-8 w-8 -translate-x-1/2 -translate-y-1/2 transition-[left,top] duration-[850ms] ease-in-out motion-reduce:transition-none"
        style={pos}
      >
        <span
          className="absolute inset-0 rounded-full border-[1.5px] opacity-80 animate-ping motion-reduce:animate-none"
          style={{ borderColor: accent }}
        />
        <span className="absolute inset-1 rounded-full border" style={{ borderColor: accent }} />
      </div>
      <div
        className="pointer-events-none absolute z-30 transition-[left,top] duration-[850ms] ease-in-out motion-reduce:transition-none"
        style={pos}
      >
        <MousePointer2 className="h-3.5 w-3.5 fill-white text-[#18110c] drop-shadow-md" aria-hidden="true" />
        <span
          key={hint}
          className={`absolute top-4 whitespace-nowrap rounded-md bg-[#18110c] px-2 py-0.5 text-[9.5px] font-semibold text-[#f8f2e8] border border-[#A47C43]/50 shadow-lg animate-[pdsFade_360ms_ease-out] motion-reduce:animate-none ${tooltipSide}`}
        >
          {hint}
        </span>
      </div>
    </>
  );
};

/* Default Theme 1 Top Utility Bar (Heritage Ivory #f8f4eb + Centered 12h Clock & Day + Focus Timer + Eye Rest) */
const ThemeOneTopBar: React.FC<{ compact?: boolean }> = ({ compact = false }) => (
  <div
    className={`grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center border-b border-[#e2d7c5] bg-[#f8f4eb]/95 text-[#1c140e] shrink-0 gap-1 ${
      compact ? 'h-8 px-2' : 'h-9 px-3'
    }`}
  >
    <div className="flex items-center gap-1.5 min-w-0">
      <span className="text-[9.5px] font-medium text-[#6b5340] truncate">
        {compact ? 'Pharmacology' : 'All Subjects · Default Theme 1'}
      </span>
    </div>
    <div className="flex items-center justify-center shrink-0">
      <span className="rounded-md border border-[#d6c7b0] bg-[#fdfbf7] px-2 py-0.5 text-[9px] font-semibold text-[#2a1f18] tabular-nums whitespace-nowrap">
        10:42 AM · Mon
      </span>
    </div>
    <div className="flex items-center justify-end gap-1 shrink-0">
      {!compact && (
        <span className="inline-flex items-center gap-1 rounded-md border border-[#d6c7b0] bg-[#fdfbf7] px-1.5 py-0.5 text-[8.5px] font-semibold text-[#6f4225] tabular-nums">
          <Timer className="h-2.5 w-2.5 text-[#a47c43]" aria-hidden="true" />
          05:00:00
        </span>
      )}
      <span className="inline-flex items-center gap-1 rounded-md border border-[#d6c7b0] bg-[#fdfbf7] px-1.5 py-0.5 text-[8.5px] font-semibold text-[#3f2918] tabular-nums">
        <Eye className="h-2.5 w-2.5 text-[#A47C43]" aria-hidden="true" />
        19:42
      </span>
      <span className="inline-flex items-center rounded-md border border-[#d6c7b0] bg-[#efe4d4] px-1.5 py-0.5 text-[8.5px] font-semibold text-[#4c3b31]">
        <Moon className="h-2.5 w-2.5 text-[#6f4225]" aria-hidden="true" />
      </span>
    </div>
  </div>
);

/* Default Theme 1 Panel Card Renderer inside MacBook */
const renderLaptopPanel = (
  panel: DemoPanel,
  idx: number,
  accent: string,
  checkedRows: Record<number, boolean>,
  onToggleRow: (rowIdx: number) => void
) => {
  if (panel.kind === 'sticky') {
    const doneCount = panel.rows.reduce((acc, _, i) => acc + (checkedRows[i] ? 1 : 0), 0);
    return (
      <div
        key={`${panel.title}-${idx}`}
        className="relative flex min-w-0 flex-col gap-1.5 rounded-[3px] border border-[#8a6c24]/40 bg-[#f4e4a2] p-2.5 text-[#3D3420] shadow-[0_8px_18px_-10px_rgba(42,28,4,0.42)] -rotate-[0.6deg]"
      >
        <div
          aria-hidden="true"
          className="absolute -top-1.5 left-1/2 h-3 w-12 -translate-x-1/2 -rotate-2 bg-[#fffdf4]/75 border-x border-dashed border-[#5a4820]/25"
        />
        <div className="flex items-center justify-between gap-1 pt-0.5">
          <span className="text-[11px] font-serif font-semibold">{panel.title}</span>
          <span className="text-[8.5px] font-semibold text-[#5a4820]">
            {doneCount} / {panel.rows.length}
          </span>
        </div>
        <div className="space-y-1">
          {panel.rows.map((row, rIdx) => {
            const isChecked = Boolean(checkedRows[rIdx]);
            return (
              <button
                key={row}
                type="button"
                onClick={() => onToggleRow(rIdx)}
                className="w-full text-left flex items-center gap-1.5 border-b border-[#5a4614]/20 pb-0.5 text-[9.5px] leading-tight cursor-pointer hover:bg-black/5 rounded-xs transition-colors"
              >
                <span
                  className={`flex h-3 w-3 shrink-0 items-center justify-center rounded-full border border-[#3D3420] ${
                    isChecked ? 'bg-[#3D3420] text-[#f4e4a2]' : ''
                  }`}
                >
                  {isChecked && <Check className="h-2 w-2" aria-hidden="true" />}
                </span>
                <span className={`truncate ${isChecked ? 'line-through opacity-60' : ''}`}>{row}</span>
              </button>
            );
          })}
        </div>
        <div className="mt-auto pt-1 flex justify-center">
          <span className="inline-flex items-center gap-1 rounded-full bg-[#3D3420] px-2.5 py-0.5 text-[8.5px] font-semibold text-[#f4e4a2]">
            + Add Task
          </span>
        </div>
      </div>
    );
  }

  if (panel.kind === 'note-paper') {
    return (
      <div
        key={`${panel.title}-${idx}`}
        className="flex min-w-0 flex-col rounded-xl border border-[#dfd2bc] bg-[#f7efe0] p-2.5 text-[#1c140e] shadow-xs"
        style={{
          backgroundImage: 'linear-gradient(to bottom, rgba(120,135,145,0.18) 1px, transparent 1px)',
          backgroundSize: '100% 18px',
        }}
      >
        <div className="flex items-center justify-between border-b border-[#d6c7b0] pb-1 mb-1.5">
          <span className="text-[10.5px] font-serif font-semibold truncate">{panel.title}</span>
          {panel.badge && (
            <span className="rounded bg-[#A47C43] px-1.5 py-0.5 text-[8px] font-semibold text-white">
              {panel.badge}
            </span>
          )}
        </div>
        <div className="space-y-1.5 pl-2 border-l-2 border-[#b46e5f]/35">
          {panel.rows.map((row) => (
            <p key={row} className="text-[9.5px] leading-[17px] text-[#2c2119] truncate">
              {row}
            </p>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      key={`${panel.title}-${idx}`}
      className="flex min-w-0 flex-col gap-1.5 rounded-xl border border-[#e3dbcf] bg-[#fdfaf4] p-2.5 text-[#1e2622] shadow-[0_8px_18px_-14px_rgba(54,40,20,0.3)]"
    >
      <div className="flex items-center justify-between gap-1 border-b border-[#ebe3d5] pb-1">
        <span className="flex items-center gap-1.5 min-w-0 text-[10.5px] font-serif font-semibold text-[#1c140e]">
          {panel.kind === 'calendar' && <Clock className="h-3 w-3 shrink-0 text-[#A47C43]" aria-hidden="true" />}
          {panel.kind === 'reminders' && <Bell className="h-3 w-3 shrink-0 text-[#A47C43]" aria-hidden="true" />}
          {panel.kind === 'feed' && <FolderOpen className="h-3 w-3 shrink-0 text-[#A47C43]" aria-hidden="true" />}
          {!['calendar', 'reminders', 'feed'].includes(panel.kind || '') && (
            <Sparkles className="h-3 w-3 shrink-0" style={{ color: accent }} aria-hidden="true" />
          )}
          <span className="truncate">{panel.title}</span>
        </span>
        {panel.badge && <span className="text-[8.5px] font-medium text-[#6b5340] shrink-0">{panel.badge}</span>}
      </div>

      <div className="space-y-1">
        {panel.rows.map((row) => (
          <div
            key={row}
            className="rounded-md border border-[#ebe3d5] bg-[#f7f2e8] px-2 py-1 text-[9.5px] font-medium text-[#3b291b] truncate"
          >
            {row}
          </div>
        ))}
      </div>
    </div>
  );
};

/* Faithful App-Matched iPad Content Renderer per Section */
const TabletAppContent: React.FC<{
  scene: DemoScene;
  checkedTasks: Record<number, boolean>;
  onToggleTask: (idx: number) => void;
}> = ({ scene, checkedTasks, onToggleTask }) => {
  const { section, tablet } = scene;

  if (section.key === 'shelf') {
    return <ShelfShowcaseRoom compact />;
  }

  if (section.key === 'cockpit') {
    const tabletItems = ['Brachial Plexus', 'KDT NSAIDs', '30 Path PYQs'];
    const doneCount = tabletItems.reduce((acc, _, i) => acc + (checkedTasks[i] ? 1 : 0), 0);
    return (
      <div className="flex-1 min-h-0 flex flex-col gap-2">
        <div className="grid grid-cols-2 gap-2 flex-1 min-h-0">
          {/* Mini Academic Calendar */}
          <div className="rounded-xl border border-[#e3dbcf] bg-[#fdfbf7]/92 p-2 flex flex-col gap-1.5">
            <div className="flex items-center justify-between border-b border-[#ebe3d5] pb-1">
              <span className="flex items-center gap-1 text-[9.5px] font-serif font-semibold text-[#1c140e]">
                <Clock className="h-2.5 w-2.5 text-[#A47C43]" aria-hidden="true" />
                Calendar
              </span>
              <span className="text-[8px] font-semibold text-[#8f5f2c]">Today</span>
            </div>
            <div className="space-y-1 text-[8.5px]">
              <div className="rounded border border-[#ebe3d5] bg-[#f7f2e8] px-1.5 py-1 truncate font-medium">
                08:30 · Medicine Rounds
              </div>
              <div className="rounded border border-[#ebe3d5] bg-[#f7f2e8] px-1.5 py-1 truncate font-medium">
                02:00 · Pharma Seminar
              </div>
            </div>
          </div>

          {/* Real Yellow 3D Tasks Sticky Note with Clickable Items */}
          <div className="relative rounded-[3px] border border-[#8a6c24]/45 bg-[#f4e4a2] p-2 text-[#3D3420] shadow-sm -rotate-[0.6deg] flex flex-col justify-between">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[9.5px] font-serif font-bold">Tasks</span>
                <span className="text-[8px] font-semibold">
                  {doneCount}/{tabletItems.length}
                </span>
              </div>
              {tabletItems.map((item, idx) => {
                const isChecked = Boolean(checkedTasks[idx]);
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => onToggleTask(idx)}
                    className="w-full text-left flex items-center gap-1 border-b border-[#5a4614]/20 pb-0.5 text-[8.5px] cursor-pointer hover:bg-black/5 rounded-xs transition-colors"
                  >
                    <span
                      className={`h-2.5 w-2.5 rounded-full border border-[#3D3420] flex items-center justify-center shrink-0 ${
                        isChecked ? 'bg-[#3D3420] text-[#f4e4a2]' : ''
                      }`}
                    >
                      {isChecked && <Check className="h-1.5 w-1.5" aria-hidden="true" />}
                    </span>
                    <span className={`truncate ${isChecked ? 'line-through opacity-60' : ''}`}>{item}</span>
                  </button>
                );
              })}
            </div>
            <div className="flex justify-center pt-1">
              <span className="rounded-full bg-[#3D3420] px-2 py-0.5 text-[7.5px] font-semibold text-[#f4e4a2]">
                + Add
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Trackers Row */}
        <div className="rounded-xl border border-[#e3dbcf] bg-[#fdfbf7]/92 px-2.5 py-1.5 flex items-center justify-between gap-2 text-[8.5px]">
          <span className="font-semibold text-[#1c140e] truncate">Daily MCQ 32/40 · Image Qs 14/20</span>
          <div className="w-20 h-1.5 rounded-full bg-[#e8dcc7] overflow-hidden shrink-0">
            <div className="h-full w-4/5 rounded-full bg-[#A47C43]" />
          </div>
        </div>
      </div>
    );
  }

  if (section.key === 'read') {
    return (
      <div className="flex-1 min-h-0 flex flex-col gap-1.5">
        <div className="flex items-center justify-between rounded-lg border border-[#dfd2bc] bg-[#faf6ee] px-2 py-1 text-[8px] font-semibold text-[#4a3728]">
          <span>Day · Sepia · Night</span>
          <span>50% | 50% Split · Snip</span>
        </div>
        <div className="flex-1 min-h-0 grid grid-cols-2 gap-1.5 relative">
          <div className="rounded-xl border border-[#e3dbcf] bg-[#fdfaf4] p-2 flex flex-col justify-between">
            <div>
              <p className="text-[8px] font-bold text-[#8f5f2c] uppercase">MAIN · Harrison&apos;s</p>
              <p className="text-[9.5px] font-serif font-semibold mt-0.5">Heart Failure Pearl</p>
            </div>
            <div className="space-y-1 my-auto">
              <div className="h-1.5 w-full rounded bg-[#ded4c2]" />
              <div className="h-1.5 w-5/6 rounded bg-[#e8c670]" />
              <div className="h-1.5 w-3/4 rounded bg-[#ded4c2]" />
            </div>
            <span className="text-[7.5px] text-[#6b5340]">Ch 14 · p. 1124</span>
          </div>
          <div className="rounded-xl border border-[#e3dbcf] bg-[#f7efe0] p-2 flex flex-col justify-between">
            <div>
              <p className="text-[8px] font-bold text-[#5b6d5b] uppercase">ATTACHED · Robbins</p>
              <p className="text-[9.5px] font-serif font-semibold mt-0.5">Myocardial Infarct</p>
            </div>
            <div className="space-y-1 my-auto">
              <div className="h-1.5 w-11/12 rounded bg-[#d5c6ab]" />
              <div className="h-1.5 w-4/5 rounded bg-[#d5c6ab]" />
              <div className="h-1.5 w-2/3 rounded bg-[#d5c6ab]" />
            </div>
            <span className="text-[7.5px] text-[#6b5340]">Drive Synced PDF</span>
          </div>
        </div>
      </div>
    );
  }

  if (section.key === 'notes') {
    return (
      <div className="flex-1 min-h-0 flex flex-col gap-1.5">
        {/* Compact Create Note Ribbon with Paper Color Folded-Page Icon & Prominent Save Note */}
        <div className="flex items-center justify-between rounded-lg border border-[#dfd2bc] bg-[#faf5ea] px-2 py-1 text-[8px] text-[#3f2918]">
          <div className="flex items-center gap-2 font-semibold">
            <span>B</span>
            <span className="italic">I</span>
            <span className="inline-flex items-center gap-0.5">
              <FileText className="w-2.5 h-2.5 text-[#8f5f2c]" aria-hidden="true" />
              Sepia
            </span>
            <span className="inline-flex items-center gap-0.5">
              <Table2 className="w-2.5 h-2.5 text-[#8f5f2c]" aria-hidden="true" />
              Table
            </span>
          </div>
          <span className="rounded-md bg-[#A47C43] px-2 py-0.5 text-[8px] font-bold text-white shadow-2xs">
            Save Note
          </span>
        </div>

        {/* Continuous Ruled Sepia Paper Sheet */}
        <div
          className="flex-1 min-h-0 rounded-xl border border-[#d6c7b0] p-2.5 pl-4 relative overflow-hidden"
          style={{
            backgroundColor: '#f7efe0',
            backgroundImage: 'linear-gradient(to bottom, rgba(120,135,145,0.2) 1px, transparent 1px)',
            backgroundSize: '100% 17px',
          }}
        >
          <div aria-hidden="true" className="absolute inset-y-0 left-3 w-[1.5px] bg-[#b46e5f]/45" />
          <div className="pl-1.5 space-y-1">
            <p className="font-serif text-[10px] font-bold text-[#221409]">Autonomic Pharmacology</p>
            <p className="text-[8.5px] leading-[17px] text-[#3a2716]">Atropine — competitive M1-M5 antagonist</p>
            <p className="text-[8.5px] leading-[17px] text-[#3a2716]">Antidote: Physostigmine crosses BBB</p>
            <div className="grid grid-cols-3 gap-1 pt-1 text-[7.5px] font-mono text-[#2e1c0e]">
              <span className="rounded bg-[#eadbb8] px-1 py-0.5 font-bold">Drug</span>
              <span className="rounded bg-[#eadbb8] px-1 py-0.5 font-bold">Receptor</span>
              <span className="rounded bg-[#eadbb8] px-1 py-0.5 font-bold">Pearl</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (section.key === 'mnemonics') {
    return (
      <div className="flex-1 min-h-0 flex flex-col gap-1.5">
        <div className="flex items-center justify-between text-[8px] font-semibold">
          <div className="inline-flex rounded-md border border-[#d6c7b0] overflow-hidden">
            <span className="bg-[#18110c] text-[#f6eee3] px-2 py-0.5">Tree</span>
            <span className="bg-[#fdfaf4] text-[#4a3728] px-2 py-0.5">Info</span>
          </div>
          <span className="text-[#6b5340]">Ctrl + Scroll Zoom</span>
        </div>
        <div
          className="flex-1 min-h-0 rounded-xl border border-[#dfd2bc] p-2.5 flex flex-col items-center justify-center gap-1.5"
          style={{
            backgroundColor: '#fcf9f2',
            backgroundImage: 'radial-gradient(rgba(143, 95, 44, 0.22) 1px, transparent 1px)',
            backgroundSize: '12px 12px',
          }}
        >
          <div className="rounded-lg border border-[#A47C43] bg-[#fff7e6] px-3 py-1 text-[9px] font-serif font-bold text-[#241307] shadow-2xs">
            Acute Chest Pain
          </div>
          <div className="h-2.5 w-[1.5px] bg-[#A47C43]" />
          <div className="grid grid-cols-2 gap-2 w-full">
            <div className="rounded-lg border border-[#d6c7b0] bg-white px-2 py-1 text-center text-[8px] font-semibold text-[#7c2d12]">
              STEMI → PCI
            </div>
            <div className="rounded-lg border border-[#d6c7b0] bg-white px-2 py-1 text-center text-[8px] font-semibold text-[#1e3a8a]">
              NSTEMI → Troponin I
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (section.key === 'themes') {
    return (
      <div className="flex-1 min-h-0 flex flex-col gap-2">
        <div className="grid grid-cols-5 gap-1">
          {[
            { name: 'Walnut', bg: '#512d18' },
            { name: 'Sunset', bg: '#c06a38' },
            { name: 'Ocean', bg: '#2b6b7d' },
            { name: 'Cobalt', bg: '#334e7c' },
            { name: 'Emerald', bg: '#1e4a38' },
          ].map((sw, idx) => (
            <div key={sw.name} className="flex flex-col items-center gap-0.5">
              <div
                className={`w-full h-7 rounded-md border ${idx === 0 ? 'ring-2 ring-[#A47C43] border-white' : 'border-black/15'}`}
                style={{ backgroundColor: sw.bg }}
              />
              <span className="text-[7px] font-medium text-[#4a3728]">{sw.name}</span>
            </div>
          ))}
        </div>
        <div className="rounded-xl border border-[#e3dbcf] bg-[#fdfaf4] p-2 flex-1 flex flex-col justify-between text-[8.5px]">
          <div className="flex items-center justify-between">
            <span className="font-serif font-semibold">10 Abstract Wallpapers</span>
            <span className="text-[#8f5f2c] font-semibold">5 Dark · 5 Light</span>
          </div>
          <div className="text-[8px] text-[#5e4733]">
            Handwriting · Sans-Serif · Editorial Serif applied globally
          </div>
        </div>
      </div>
    );
  }

  if (section.key === 'settings') {
    return (
      <div className="flex-1 min-h-0 grid grid-cols-[68px_minmax(0,1fr)] gap-1.5">
        <div className="rounded-xl border border-[#dfd2bc] bg-[#f3ece0] p-1.5 flex flex-col gap-1 text-[8px] font-medium text-[#3b291b]">
          <span className="rounded bg-[#18110c] text-[#f6eee3] px-1.5 py-1 font-semibold">Profile</span>
          <span className="px-1.5 py-0.5">Cloud</span>
          <span className="px-1.5 py-0.5">Sidebar</span>
          <span className="px-1.5 py-0.5">Goals</span>
          <span className="px-1.5 py-0.5">Backup</span>
        </div>
        <div className="rounded-xl border border-[#e3dbcf] bg-[#fdfaf4] p-2 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-[#ebe3d5] pb-1">
            <span className="text-[9px] font-serif font-bold text-[#1c140e]">UPI · Card · NetBanking</span>
            <QrCode className="w-3 h-3 text-[#A47C43]" aria-hidden="true" />
          </div>
          <div className="space-y-1 text-[8px] text-[#4a3728]">
            <div className="rounded border border-[#ebe3d5] bg-[#f7f2e8] px-1.5 py-1 flex items-center justify-between">
              <span>Google Drive Vault</span>
              <span className="font-bold text-[#065f46]">Synced</span>
            </div>
            <div className="rounded border border-[#ebe3d5] bg-[#f7f2e8] px-1.5 py-1 flex items-center justify-between">
              <span>Clinical Scholar Pro</span>
              <span className="font-bold text-[#8f5f2c]">₹100/mo</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Calendar / Achiever's Hub structured cards matching Theme 1
  return (
    <div className="flex-1 min-h-0 flex flex-col justify-between gap-1.5">
      {tablet.cards.map((card, cIdx) => (
        <div
          key={card}
          className={`rounded-xl border px-2.5 py-2 text-[9.5px] font-medium shadow-2xs flex items-center justify-between gap-2 ${
            cIdx === 0 && section.key === 'hub'
              ? 'bg-[#f4e4a2]/65 border-[#c9a84c] text-[#3D3420]'
              : 'bg-[#fdfaf4] border-[#e3dbcf] text-[#2a1d14]'
          }`}
        >
          <span className="flex items-center gap-1.5 truncate">
            {section.key === 'hub' ? (
              <Users className="h-3 w-3 shrink-0 text-[#8f5f2c]" aria-hidden="true" />
            ) : (
              <Sliders className="h-3 w-3 shrink-0 text-[#5B6D5B]" aria-hidden="true" />
            )}
            <span className="truncate">{card}</span>
          </span>
          <span className="text-[8px] font-semibold text-[#8f5f2c] shrink-0">Theme 1</span>
        </div>
      ))}
    </div>
  );
};

/* Latest Apple MacBook Pro Frame matching Default Theme 1 Light Mode */
export const LaptopFrame: React.FC<{
  scene: DemoScene;
  onSelectSection?: (idx: number) => void;
}> = ({ scene, onSelectSection }) => {
  const { section, laptop } = scene;
  const point = anchorPoint('laptop', laptop.anchor, DEMO_SECTIONS.indexOf(section));
  const isShelfScene = section.key === 'shelf';
  const [checkedRows, setCheckedRows] = useState<Record<number, boolean>>({ 0: true });

  const toggleRow = (rIdx: number) => {
    setCheckedRows((prev) => ({ ...prev, [rIdx]: !prev[rIdx] }));
  };

  return (
    <div className="w-full max-w-[680px] mx-auto flex flex-col items-center select-none">
      {/* Lid / Matte Graphite Aluminum Display Shell with Ultra-Thin Bezel */}
      <div className="w-[93%] rounded-t-[1.1rem] bg-[#141416] p-[7px] sm:p-[9px] ring-1 ring-white/15 shadow-[0_26px_54px_rgba(24,14,7,0.3)] relative">
        {/* Authentic MacBook Pro Camera Notch */}
        <div
          aria-hidden="true"
          className="absolute top-[7px] sm:top-[9px] left-1/2 -translate-x-1/2 z-30 w-16 sm:w-20 h-[10px] sm:h-[12px] rounded-b-[6px] bg-[#141416] flex items-center justify-center"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-[#101815] ring-1 ring-[#30473a]" />
        </div>

        {/* Display Viewport: Default Theme 1 Light Mode (Parchment Sidebar + Walnut Active Pill + Highland Stillness Wallpaper) */}
        <div className="relative aspect-[16/10] overflow-hidden rounded-[0.65rem] bg-[#f6f2ea] text-[#1c140e] flex flex-col">
          {/* Default Theme 1 Light Mode Highland Stillness Wallpaper layer */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage: `url(${THEME1_THUMB_URL})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center center',
              opacity: 0.42,
            }}
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              background: 'linear-gradient(180deg, rgba(246,242,234,0.68) 0%, rgba(246,242,234,0.84) 100%)',
            }}
          />

          <div className="relative z-10 flex flex-1 min-h-0">
            {/* Authentic Default Theme 1 Light Mode Parchment Sidebar */}
            <aside
              className="w-[18.5%] border-r border-[#dcd0bd] text-[#2a1f18] flex flex-col justify-between py-2.5 px-1.5 shrink-0 backdrop-blur-[6px]"
              style={{
                background:
                  'linear-gradient(180deg, rgba(250,246,238,0.92) 0%, rgba(241,232,218,0.92) 55%, rgba(232,220,201,0.95) 100%)',
              }}
            >
              <div className="space-y-1.5">
                <div className="px-1.5 pb-1.5 border-b border-[#dcd0bd] flex items-center gap-1.5">
                  <img
                    src={ACHIEV_EMBLEM_URL}
                    alt="ACH1EV"
                    width={928}
                    height={324}
                    loading="lazy"
                    decoding="async"
                    className="h-4 w-4 object-contain shrink-0 bg-transparent"
                  />
                  <span className="font-serif text-[10px] font-bold tracking-[0.08em] text-[#522e18] uppercase">
                    ACH1EV
                  </span>
                </div>

                <nav aria-label="Theme 1 sidebar preview" className="space-y-0.5 pt-0.5">
                  {DEMO_SECTIONS.map((item, sIdx) => {
                    const Icon = item.icon;
                    const active = item === section;
                    return (
                      <button
                        key={item.key}
                        type="button"
                        onClick={() => onSelectSection?.(sIdx)}
                        className={`w-full text-left flex items-center gap-1.5 rounded-md px-1.5 py-[3px] text-[8.5px] font-medium transition-all duration-200 cursor-pointer ${
                          active
                            ? 'text-white font-semibold shadow-xs border border-[#7f4c2a]'
                            : 'text-[#4c3b31] hover:bg-[#e7dac4]/60'
                        }`}
                        style={
                          active
                            ? {
                                background: 'linear-gradient(155deg, #6f4225 0%, #522e18 100%)',
                              }
                            : undefined
                        }
                      >
                        <Icon
                          className="h-2.5 w-2.5 shrink-0"
                          style={{ color: active ? '#ffd899' : '#6c4830' }}
                          aria-hidden="true"
                        />
                        <span className="truncate">{item.label}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>
              <div className="px-1.5 pt-1 border-t border-[#dcd0bd] text-[8px] text-[#6b5340] truncate">
                MBBS Year III
              </div>
            </aside>

            {/* Right Main Viewport */}
            <div className="flex-1 min-w-0 flex flex-col bg-transparent">
              <ThemeOneTopBar />

              <div
                key={scene.title}
                className="flex-1 min-h-0 flex flex-col gap-2 p-2.5 sm:p-3 animate-[pdsFade_420ms_ease-out] motion-reduce:animate-none"
              >
                {!isShelfScene && (
                  <div className="flex items-baseline justify-between gap-2 border-b border-[#d8c8b0]/80 pb-1.5">
                    <div className="min-w-0">
                      <p className="text-[8.5px] font-medium text-[#8f5f2c] truncate">{laptop.crumb}</p>
                      <h4 className="font-serif text-xs sm:text-sm font-semibold text-[#1c140e] truncate">
                        {laptop.heading}
                      </h4>
                    </div>
                    <span className="text-[9px] font-medium text-[#6b5340] shrink-0">Theme 1 · Light</span>
                  </div>
                )}

                {isShelfScene ? (
                  <ShelfShowcaseRoom />
                ) : (
                  <div className="grid flex-1 min-h-0 grid-cols-3 gap-2">
                    {laptop.panels.map((panel, idx) =>
                      renderLaptopPanel(panel, idx, section.accent, checkedRows, toggleRow)
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          <DemoPointer point={point} accent={section.accent} hint={scene.hint} />
        </div>
      </div>

      {/* Brushed Aluminum MacBook Lower Chassis + Center Thumb Scoop */}
      <div
        aria-hidden="true"
        className="relative w-full h-[11px] sm:h-[14px] rounded-b-[14px] bg-gradient-to-b from-[#dcd7cf] via-[#bdb7ae] to-[#8f8980] shadow-[0_14px_26px_rgba(32,18,8,0.22)] flex justify-center"
      >
        <div className="w-20 sm:w-28 h-[4px] sm:h-[5px] rounded-b-md bg-gradient-to-b from-[#6f6a63] to-[#9b958d]" />
      </div>
    </div>
  );
};

/* Latest Apple iPad Pro Frame matching Default Theme 1 Light Mode */
export const TabletFrame: React.FC<{
  scene: DemoScene;
  onSelectSection?: (idx: number) => void;
}> = ({ scene, onSelectSection }) => {
  const { section, tablet } = scene;
  const point = anchorPoint('tablet', tablet.anchor, DEMO_SECTIONS.indexOf(section));
  const isShelfScene = section.key === 'shelf';
  const [checkedTasks, setCheckedTasks] = useState<Record<number, boolean>>({ 0: true });

  const toggleTask = (idx: number) => {
    setCheckedTasks((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  return (
    <div className="w-full max-w-[440px] mx-auto select-none">
      {/* Uniform Thin Matte-Black Aluminum Unibody Frame */}
      <div className="relative rounded-[1.5rem] bg-[#141416] p-[9px] sm:p-[11px] ring-1 ring-white/15 shadow-[0_24px_50px_rgba(24,14,7,0.28)]">
        {/* Landscape Top-Bezel Center Stage Camera Dot */}
        <div
          aria-hidden="true"
          className="absolute top-[3.5px] sm:top-[4px] left-1/2 -translate-x-1/2 h-1.5 w-1.5 rounded-full bg-[#1a2420] ring-1 ring-[#354840]"
        />

        {/* iPad Screen: Default Theme 1 Light Mode Compact Rail + Highland Stillness Wallpaper */}
        <div className="relative aspect-[4/3] overflow-hidden rounded-[0.95rem] bg-[#f6f2ea] text-[#1c140e] flex flex-col">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage: `url(${THEME1_THUMB_URL})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center center',
              opacity: 0.42,
            }}
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              background: 'linear-gradient(180deg, rgba(246,242,234,0.68) 0%, rgba(246,242,234,0.85) 100%)',
            }}
          />

          <div className="relative z-10 flex flex-1 min-h-0">
            {/* Compact Default Theme 1 Light Parchment Icon Rail */}
            <aside
              className="w-[14%] border-r border-[#dcd0bd] flex flex-col items-center gap-1 py-2 shrink-0 backdrop-blur-[6px]"
              style={{
                background:
                  'linear-gradient(180deg, rgba(250,246,238,0.92) 0%, rgba(232,220,201,0.95) 100%)',
              }}
            >
              <div className="mb-1 flex items-center justify-center">
                <img
                  src={ACHIEV_EMBLEM_URL}
                  alt="ACH1EV"
                  width={928}
                  height={324}
                  loading="lazy"
                  decoding="async"
                  className="h-4 w-4 object-contain bg-transparent"
                />
              </div>
              {DEMO_SECTIONS.map((item, sIdx) => {
                const Icon = item.icon;
                const active = item === section;
                return (
                  <button
                    key={item.key}
                    type="button"
                    aria-label={item.label}
                    onClick={() => onSelectSection?.(sIdx)}
                    className={`flex h-5 w-5 items-center justify-center rounded-md transition-all duration-200 cursor-pointer ${
                      active
                        ? 'text-white shadow-xs border border-[#7f4c2a]'
                        : 'text-[#6c4830] hover:bg-[#e7dac4]/70'
                    }`}
                    style={
                      active
                        ? {
                            background: 'linear-gradient(155deg, #6f4225 0%, #522e18 100%)',
                          }
                        : undefined
                    }
                  >
                    <Icon
                      className="h-2.5 w-2.5"
                      style={{ color: active ? '#ffd899' : '#6c4830' }}
                      aria-hidden="true"
                    />
                  </button>
                );
              })}
            </aside>

            <div className="flex-1 min-w-0 flex flex-col">
              <ThemeOneTopBar compact />

              <div
                key={scene.title}
                className="flex-1 min-h-0 flex flex-col gap-1.5 p-2.5 animate-[pdsFade_420ms_ease-out] motion-reduce:animate-none"
              >
                {!isShelfScene && (
                  <div className="border-b border-[#d8c8b0]/80 pb-1">
                    <p className="text-[8.5px] font-medium text-[#8f5f2c]">{tablet.subheading}</p>
                    <h4 className="font-serif text-xs sm:text-[13px] font-semibold text-[#1c140e] truncate">
                      {tablet.heading}
                    </h4>
                  </div>
                )}

                <TabletAppContent scene={scene} checkedTasks={checkedTasks} onToggleTask={toggleTask} />
              </div>
            </div>
          </div>

          {/* iPadOS Home Bar */}
          <div aria-hidden="true" className="relative z-10 pb-1.5 pt-0.5 flex justify-center bg-transparent">
            <span className="h-[3px] w-20 rounded-full bg-[#1c140e]/30" />
          </div>

          <DemoPointer point={point} accent={section.accent} hint={scene.hint} />
        </div>
      </div>
    </div>
  );
};
