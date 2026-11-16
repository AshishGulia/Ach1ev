import React from 'react';
import { Bell, BookOpen, Check, Clock, Eye, FolderOpen, MousePointer2, Moon, Sparkles, Sun } from 'lucide-react';
import { DEMO_SECTIONS, type DemoAnchor, type DemoPanel, type DemoScene } from './productDemoData';

type Point = { x: number; y: number };

function anchorPoint(device: 'tablet' | 'laptop', anchor: DemoAnchor, navIndex: number): Point {
  if (anchor === 'nav') return { x: device === 'tablet' ? 14 : 9, y: 21 + navIndex * 7.5 };
  if (anchor === 'header') return device === 'tablet' ? { x: 86, y: 8 } : { x: 88, y: 7 };
  if (device === 'tablet') return { x: 64, y: 36 + anchor * 19 };
  return { x: [28, 56, 84][anchor] ?? 56, y: 58 };
}

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

/* Default Theme 1 Top Utility Bar (Heritage Ivory #f8f4eb + Walnut #1c140e + Brass #A47C43) */
const ThemeOneTopBar: React.FC<{ compact?: boolean }> = ({ compact = false }) => (
  <div
    className={`flex items-center justify-between border-b border-[#e2d7c5] bg-[#f8f4eb] text-[#1c140e] shrink-0 ${
      compact ? 'h-8 px-2.5' : 'h-9 px-3.5'
    }`}
  >
    <div className="flex items-center gap-2 min-w-0">
      <span className="text-[10px] font-medium text-[#6b5340] truncate">
        {compact ? 'Workspace' : 'All Subjects · Default Theme 1'}
      </span>
    </div>
    <div className="flex items-center gap-1.5 shrink-0">
      <span className="hidden sm:inline-flex items-center gap-1 rounded-md border border-[#d6c7b0] bg-[#fdfbf7] px-1.5 py-0.5 text-[9px] font-medium text-[#4a3728]">
        <Sun className="h-2.5 w-2.5 text-[#A47C43]" aria-hidden="true" />
        Day
      </span>
      <span className="inline-flex items-center gap-1 rounded-md border border-[#d6c7b0] bg-[#fdfbf7] px-1.5 py-0.5 text-[9px] font-semibold text-[#3f2918]">
        <Eye className="h-2.5 w-2.5 text-[#A47C43]" aria-hidden="true" />
        19:42
      </span>
      <span className="inline-flex items-center rounded-md bg-[#18110c] px-1.5 py-0.5 text-[8.5px] font-semibold text-[#efe4d4]">
        <Moon className="h-2.5 w-2.5 text-[#d4a373]" aria-hidden="true" />
      </span>
    </div>
  </div>
);

/* Default Theme 1 Panel Card Renderer inside MacBook */
const renderLaptopPanel = (panel: DemoPanel, idx: number, accent: string) => {
  if (panel.kind === 'sticky') {
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
          {panel.badge && (
            <span className="text-[8.5px] font-semibold text-[#5a4820]">{panel.badge}</span>
          )}
        </div>
        <div className="space-y-1">
          {panel.rows.map((row, rIdx) => (
            <div
              key={row}
              className="flex items-center gap-1.5 border-b border-[#5a4614]/20 pb-0.5 text-[9.5px] leading-tight"
            >
              <span
                className={`flex h-3 w-3 shrink-0 items-center justify-center rounded-full border border-[#3D3420] ${
                  rIdx === 0 ? 'bg-[#3D3420] text-[#f4e4a2]' : ''
                }`}
              >
                {rIdx === 0 && <Check className="h-2 w-2" aria-hidden="true" />}
              </span>
              <span className={`truncate ${rIdx === 0 ? 'line-through opacity-60' : ''}`}>{row}</span>
            </div>
          ))}
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
        className="flex min-w-0 flex-col rounded-xl border border-[#dfd2bc] bg-[#fdfaf2] p-2.5 text-[#1c140e] shadow-xs"
        style={{
          backgroundImage: 'linear-gradient(to bottom, rgba(120,135,145,0.16) 1px, transparent 1px)',
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

  if (panel.kind === 'almirah') {
    return (
      <div
        key={`${panel.title}-${idx}`}
        className="flex min-w-0 flex-col gap-1.5 rounded-xl border border-[#3a2417] bg-gradient-to-b from-[#512d18] to-[#2b1509] p-2.5 text-[#f6eee3] shadow-sm"
      >
        <div className="flex items-center justify-between gap-1 border-b border-[#d4af37]/30 pb-1">
          <span className="text-[10px] font-serif font-semibold truncate text-[#f6eee3]">{panel.title}</span>
          {panel.badge && <span className="text-[8px] text-[#e5c158]">{panel.badge}</span>}
        </div>
        <div className="flex items-end gap-1.5 pt-1 flex-1">
          {panel.rows.map((book, bIdx) => {
            const colors = ['#7c2d12', '#1e3a5f', '#365314'];
            return (
              <div
                key={book}
                className="flex-1 rounded-[3px] border border-white/20 p-1.5 flex flex-col justify-between min-h-[48px] shadow-md"
                style={{ backgroundColor: colors[bIdx % colors.length] }}
              >
                <BookOpen className="h-2.5 w-2.5 text-[#fef08a]/80" aria-hidden="true" />
                <span className="text-[8px] font-semibold leading-tight text-white line-clamp-2">{book}</span>
              </div>
            );
          })}
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

/* Latest Apple MacBook Pro Frame */
export const LaptopFrame: React.FC<{ scene: DemoScene }> = ({ scene }) => {
  const { section, laptop } = scene;
  const point = anchorPoint('laptop', laptop.anchor, DEMO_SECTIONS.indexOf(section));

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

        {/* Display Viewport: Default Theme 1 Workspace */}
        <div className="relative aspect-[16/10] overflow-hidden rounded-[0.65rem] bg-[#fbf9f5] text-[#1c140e] flex flex-col">
          {/* Default Theme 1 Walnut Sidebar + Main Area */}
          <div className="flex flex-1 min-h-0">
            {/* Authentic #18110c Walnut Sidebar */}
            <aside className="w-[18.5%] bg-[#18110c] text-[#efe4d4] border-r border-[#2d1e14] flex flex-col justify-between py-2.5 px-1.5 shrink-0">
              <div className="space-y-1.5">
                <div className="px-1.5 pb-1.5 border-b border-[#2d1e14] flex items-center gap-1.5">
                  <div className="h-3.5 w-3.5 rounded-[3px] bg-[#A47C43] flex items-center justify-center text-[8px] font-bold text-white">
                    A
                  </div>
                  <span className="font-serif text-[10px] font-bold tracking-tight text-[#f6eee3]">Achiev</span>
                </div>

                <nav aria-label="Theme 1 sidebar preview" className="space-y-0.5 pt-0.5">
                  {DEMO_SECTIONS.map((item) => {
                    const Icon = item.icon;
                    const active = item === section;
                    return (
                      <div
                        key={item.key}
                        className={`flex items-center gap-1.5 rounded-md px-1.5 py-[3px] text-[8.5px] font-medium transition-colors duration-300 ${
                          active
                            ? 'bg-gradient-to-r from-[#8f5f2c] to-[#A47C43] text-white font-semibold shadow-xs'
                            : 'text-[#cbbba6]/85'
                        }`}
                      >
                        <Icon className="h-2.5 w-2.5 shrink-0" aria-hidden="true" />
                        <span className="truncate">{item.label}</span>
                      </div>
                    );
                  })}
                </nav>
              </div>
              <div className="px-1.5 pt-1 border-t border-[#2d1e14] text-[8px] text-[#a69079] truncate">
                MBBS Year III
              </div>
            </aside>

            {/* Right Main Viewport */}
            <div className="flex-1 min-w-0 flex flex-col bg-[#f7f3ec]">
              <ThemeOneTopBar />

              <div
                key={scene.title}
                className="flex-1 min-h-0 flex flex-col gap-2 p-2.5 sm:p-3.5 animate-[pdsFade_420ms_ease-out] motion-reduce:animate-none"
              >
                <div className="flex items-baseline justify-between gap-2 border-b border-[#e3dbcf] pb-1.5">
                  <div className="min-w-0">
                    <p className="text-[8.5px] font-medium text-[#8f5f2c] truncate">{laptop.crumb}</p>
                    <h4 className="font-serif text-xs sm:text-sm font-semibold text-[#1c140e] truncate">
                      {laptop.heading}
                    </h4>
                  </div>
                  <span className="text-[9px] font-medium text-[#6b5340] shrink-0">Heritage Ivory</span>
                </div>

                <div className="grid flex-1 min-h-0 grid-cols-3 gap-2">
                  {laptop.panels.map((panel, idx) => renderLaptopPanel(panel, idx, section.accent))}
                </div>
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

/* Latest Apple iPad Pro Frame */
export const TabletFrame: React.FC<{ scene: DemoScene }> = ({ scene }) => {
  const { section, tablet } = scene;
  const point = anchorPoint('tablet', tablet.anchor, DEMO_SECTIONS.indexOf(section));

  return (
    <div className="w-full max-w-[440px] mx-auto select-none">
      {/* Uniform Thin Matte-Black Aluminum Unibody Frame */}
      <div className="relative rounded-[1.5rem] bg-[#141416] p-[9px] sm:p-[11px] ring-1 ring-white/15 shadow-[0_24px_50px_rgba(24,14,7,0.28)]">
        {/* Landscape Top-Bezel Center Stage Camera Dot */}
        <div
          aria-hidden="true"
          className="absolute top-[3.5px] sm:top-[4px] left-1/2 -translate-x-1/2 h-1.5 w-1.5 rounded-full bg-[#1a2420] ring-1 ring-[#354840]"
        />

        {/* iPad Screen: Default Theme 1 Compact Rail + Ivory Content */}
        <div className="relative aspect-[4/3] overflow-hidden rounded-[0.95rem] bg-[#f7f3ec] text-[#1c140e] flex flex-col">
          <div className="flex flex-1 min-h-0">
            {/* Compact #18110c Walnut Icon Rail */}
            <aside className="w-[14%] bg-[#18110c] border-r border-[#2d1e14] flex flex-col items-center gap-1 py-2 shrink-0">
              <div className="mb-1 h-4 w-4 rounded-[3px] bg-[#A47C43] flex items-center justify-center text-[8px] font-bold text-white">
                A
              </div>
              {DEMO_SECTIONS.map((item) => {
                const Icon = item.icon;
                const active = item === section;
                return (
                  <div
                    key={item.key}
                    className={`flex h-5 w-5 items-center justify-center rounded-md transition-colors duration-300 ${
                      active ? 'bg-[#A47C43] text-white' : 'text-[#b7a38e]'
                    }`}
                  >
                    <Icon className="h-2.5 w-2.5" aria-hidden="true" />
                  </div>
                );
              })}
            </aside>

            <div className="flex-1 min-w-0 flex flex-col">
              <ThemeOneTopBar compact />

              <div
                key={scene.title}
                className="flex-1 min-h-0 flex flex-col gap-2 p-3 animate-[pdsFade_420ms_ease-out] motion-reduce:animate-none"
              >
                <div className="border-b border-[#e3dbcf] pb-1.5">
                  <p className="text-[9px] font-medium text-[#8f5f2c]">{tablet.subheading}</p>
                  <h4 className="font-serif text-xs sm:text-sm font-semibold text-[#1c140e] truncate">
                    {tablet.heading}
                  </h4>
                </div>

                <div className="flex flex-1 flex-col justify-center gap-1.5">
                  {tablet.cards.map((card, cIdx) => (
                    <div
                      key={card}
                      className={`rounded-lg border px-2.5 py-2 text-[10px] font-medium shadow-2xs truncate ${
                        cIdx === 1 && section.key === 'cockpit'
                          ? 'bg-[#f4e4a2] border-[#b7963d] text-[#3D3420]'
                          : 'bg-[#fdfaf4] border-[#e3dbcf] text-[#2a1d14]'
                      }`}
                    >
                      {card}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* iPadOS Home Bar */}
          <div aria-hidden="true" className="pb-1.5 pt-0.5 flex justify-center bg-transparent">
            <span className="h-[3px] w-20 rounded-full bg-[#1c140e]/30" />
          </div>

          <DemoPointer point={point} accent={section.accent} hint={scene.hint} />
        </div>
      </div>
    </div>
  );
};
