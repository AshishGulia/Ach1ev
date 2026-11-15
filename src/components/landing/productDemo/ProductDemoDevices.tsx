import React from 'react';
import { Eye, MousePointer2 } from 'lucide-react';
import { DEMO_SECTIONS, type DemoAnchor, type DemoScene } from './productDemoData';

type Point = { x: number; y: number };

function anchorPoint(device: 'tablet' | 'laptop', anchor: DemoAnchor, navIndex: number): Point {
  if (anchor === 'nav') return { x: device === 'tablet' ? 12 : 3, y: 22 + navIndex * 8 };
  if (anchor === 'header') return device === 'tablet' ? { x: 88, y: 7 } : { x: 90, y: 6 };
  if (device === 'tablet') return { x: 63, y: 34 + anchor * 19 };
  return { x: [23, 53, 83][anchor] ?? 53, y: 56 };
}

const DemoPointer: React.FC<{ point: Point; accent: string; hint: string }> = ({ point, accent, hint }) => {
  const pos = { left: `${point.x}%`, top: `${point.y}%` };
  const tooltipSide = point.x > 70 ? 'right-0' : 'left-3';

  return (
    <>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute z-10 h-9 w-9 -translate-x-1/2 -translate-y-1/2 transition-[left,top] duration-[900ms] ease-in-out motion-reduce:transition-none"
        style={pos}
      >
        <span className="absolute inset-0 rounded-full border-2 animate-ping motion-reduce:animate-none" style={{ borderColor: accent }} />
        <span className="absolute inset-0 rounded-full border-2" style={{ borderColor: accent }} />
      </div>
      <div
        className="pointer-events-none absolute z-20 transition-[left,top] duration-[900ms] ease-in-out motion-reduce:transition-none"
        style={pos}
      >
        <MousePointer2 className="h-4 w-4 fill-white text-[#1E1007] drop-shadow-md" aria-hidden="true" />
        <span
          key={hint}
          className={`absolute top-5 whitespace-nowrap rounded-md bg-[#23140A] px-2 py-1 text-[10px] font-semibold text-amber-50 shadow-lg animate-[pdsFade_400ms_ease-out] motion-reduce:animate-none ${tooltipSide}`}
        >
          {hint}
        </span>
      </div>
    </>
  );
};

const ScreenHeader: React.FC<{ className: string; labelClass: string }> = ({ className, labelClass }) => (
  <div className={`absolute inset-x-0 top-0 flex items-center justify-between border-b border-[#E3D2B1] bg-[#F5EBD4] ${className}`}>
    <span className={`font-serif font-bold text-[#190D05] ${labelClass}`}>Achiev</span>
    <span className="flex items-center gap-1 rounded-full border border-[#D4B87E] bg-[#FFFDF8] px-2 py-0.5 text-[9px] font-semibold text-[#4E3211]">
      <Eye className="h-3 w-3" aria-hidden="true" />
      Eye Timer
    </span>
  </div>
);

export const TabletFrame: React.FC<{ scene: DemoScene }> = ({ scene }) => {
  const { section, tablet } = scene;
  const point = anchorPoint('tablet', tablet.anchor, DEMO_SECTIONS.indexOf(section));

  return (
    <div className="rounded-[1.75rem] bg-[#1E1007] p-2.5 shadow-[0_24px_50px_rgba(35,20,10,0.28)]">
      <div className="relative aspect-[4/3] overflow-hidden rounded-[1.1rem] bg-[#FFFDF8] text-[#23140A]">
        <ScreenHeader className="h-[14%] px-3" labelClass="text-[11px]" />
        <div className="absolute inset-x-0 bottom-0 top-[14%] flex">
          <nav aria-label="Sidebar preview" className="flex w-[26%] flex-col gap-0.5 border-r border-[#E3D2B1] bg-[#F5EBD4]/60 p-1.5">
            {DEMO_SECTIONS.map((item) => {
              const Icon = item.icon;
              const active = item === section;
              return (
                <div
                  key={item.key}
                  className="flex items-center gap-1 rounded-md px-1.5 py-[3px] text-[9px] font-semibold transition-colors duration-500 motion-reduce:transition-none"
                  style={active ? { background: section.accent, color: '#ffffff' } : { color: '#5E4224' }}
                >
                  <Icon className="h-2.5 w-2.5 shrink-0" aria-hidden="true" />
                  <span className="truncate">{item.label}</span>
                </div>
              );
            })}
          </nav>
          <div key={scene.title} className="flex min-w-0 flex-1 flex-col gap-2 p-2.5 animate-[pdsFade_500ms_ease-out] motion-reduce:animate-none">
            <p className="text-[11px] font-bold text-[#23140A]">{tablet.heading}</p>
            {tablet.cards.map((card) => (
              <div
                key={card}
                className="rounded-lg border border-l-[3px] border-[#E6D7B9] bg-white px-2 py-1.5 text-[10px] font-semibold text-[#3F2918]"
                style={{ borderLeftColor: section.accent }}
              >
                {card}
              </div>
            ))}
          </div>
        </div>
        <DemoPointer point={point} accent={section.accent} hint={scene.hint} />
      </div>
    </div>
  );
};

export const LaptopFrame: React.FC<{ scene: DemoScene }> = ({ scene }) => {
  const { section, laptop } = scene;
  const point = anchorPoint('laptop', laptop.anchor, DEMO_SECTIONS.indexOf(section));

  return (
    <div className="flex flex-col items-center">
      <div className="w-full rounded-t-2xl bg-[#1E1007] p-2 sm:p-2.5 shadow-[0_24px_50px_rgba(35,20,10,0.28)]">
        <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-[#FFFDF8] text-[#23140A]">
          <ScreenHeader className="h-[12%] px-4" labelClass="text-xs" />
          <div className="absolute bottom-0 left-0 top-[12%] flex w-[6%] flex-col items-center gap-1 border-r border-[#E3D2B1] bg-[#F5EBD4]/60 pt-1.5">
            {DEMO_SECTIONS.map((item) => {
              const Icon = item.icon;
              const active = item === section;
              return (
                <div
                  key={item.key}
                  className="flex h-6 w-6 items-center justify-center rounded-md transition-colors duration-500 motion-reduce:transition-none"
                  style={active ? { background: section.accent, color: '#ffffff' } : { color: '#5E4224' }}
                >
                  <Icon className="h-3 w-3" aria-hidden="true" />
                </div>
              );
            })}
          </div>
          <div className="absolute bottom-0 left-[6%] right-0 top-[12%] flex flex-col gap-2.5 p-3">
            <div key={scene.title} className="flex min-h-0 flex-1 flex-col gap-2.5 animate-[pdsFade_500ms_ease-out] motion-reduce:animate-none">
              <p className="text-xs font-bold text-[#23140A]">{laptop.heading}</p>
              <div className="grid min-h-0 flex-1 grid-cols-3 gap-2.5">
                {laptop.panels.map((panel) => (
                  <div key={panel.title} className="flex min-w-0 flex-col gap-1.5 rounded-xl border border-[#E3D2B1] bg-white p-2 sm:p-2.5">
                    <p className="flex items-center gap-1 text-[10px] font-bold text-[#4E3211] sm:text-[11px]">
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: section.accent }} aria-hidden="true" />
                      <span className="truncate">{panel.title}</span>
                    </p>
                    {panel.rows.map((row) => (
                      <div key={row} className="rounded-md bg-[#FAF4E6] px-1.5 py-1 text-[9px] text-[#3F2918] sm:text-[10px]">
                        {row}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DemoPointer point={point} accent={section.accent} hint={scene.hint} />
        </div>
      </div>
      <div className="h-2.5 w-[106%] rounded-b-2xl bg-[#CDBB99] shadow-[0_10px_20px_rgba(35,20,10,0.2)]" aria-hidden="true" />
    </div>
  );
};
