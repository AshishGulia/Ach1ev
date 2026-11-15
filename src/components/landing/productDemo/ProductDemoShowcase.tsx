import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Film, Pause, Play } from 'lucide-react';
import { DEMO_SCENES } from './productDemoData';
import { LaptopFrame, TabletFrame } from './ProductDemoDevices';

const SCENE_MS = 7000;
const TICK_MS = 100;

const KEYFRAMES = '@keyframes pdsFade{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}';

const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const ProductDemoShowcase: React.FC = () => {
  const [sceneIndex, setSceneIndex] = useState(0);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [isPlaying, setIsPlaying] = useState(() => !prefersReducedMotion());

  const total = DEMO_SCENES.length;
  const scene = DEMO_SCENES[sceneIndex]!;
  const progress = Math.min(1, elapsedMs / SCENE_MS);

  useEffect(() => {
    if (!isPlaying) return;
    const id = window.setInterval(() => setElapsedMs((ms) => ms + TICK_MS), TICK_MS);
    return () => window.clearInterval(id);
  }, [isPlaying]);

  useEffect(() => {
    if (elapsedMs < SCENE_MS) return;
    setSceneIndex((i) => (i + 1) % total);
    setElapsedMs(0);
  }, [elapsedMs, total]);

  const goTo = (index: number) => {
    setSceneIndex((index + total) % total);
    setElapsedMs(0);
  };

  return (
    <section aria-labelledby="product-demo-heading" className="w-full max-w-6xl mx-auto space-y-6 sm:space-y-8 pb-16 sm:pb-20">
      <style>{KEYFRAMES}</style>

      <div className="space-y-2 text-center sm:text-left">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#9B6A1F]">
          <Film className="w-4 h-4" aria-hidden="true" />
          <span>Product tour</span>
        </div>
        <h2 id="product-demo-heading" className="text-xl sm:text-3xl font-bold text-[#1E1007] font-serif leading-[1.2]">
          See Achiev on your laptop and tablet
        </h2>
        <p className="text-sm sm:text-base text-[#4E3721] leading-relaxed max-w-2xl mx-auto sm:mx-0">
          Follow one feature at a time, or jump straight to the part you care about.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 items-end gap-6">
        <div className="lg:col-span-7">
          <LaptopFrame scene={scene} />
        </div>
        <div className="mx-auto w-full max-w-xs sm:max-w-sm lg:col-span-5 lg:max-w-none">
          <TabletFrame scene={scene} />
        </div>
      </div>

      <div className="rounded-3xl border border-[#DFCCA8] bg-[#FFFDF8] p-5 sm:p-6 space-y-5 shadow-[0_10px_30px_rgba(78,50,15,0.07)]">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div aria-live="polite" key={scene.title} className="space-y-1.5 min-w-0 animate-[pdsFade_500ms_ease-out] motion-reduce:animate-none">
            <p className="text-xs font-bold uppercase tracking-wider" style={{ color: scene.section.accent }}>
              {String(sceneIndex + 1).padStart(2, '0')} / {String(total).padStart(2, '0')} · {scene.section.label}
            </p>
            <h3 className="text-lg font-bold text-[#1E1007] font-serif">{scene.title}</h3>
            <p className="text-sm text-[#4E3721] leading-relaxed max-w-2xl">{scene.caption}</p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => goTo(sceneIndex - 1)}
              aria-label="Previous feature"
              className="p-2.5 rounded-xl bg-[#EFE4CC] hover:bg-[#E5D4B2] text-[#2A170B] transition cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => setIsPlaying((p) => !p)}
              aria-label={isPlaying ? 'Pause product tour' : 'Play product tour'}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-white transition cursor-pointer shadow hover:brightness-110 motion-reduce:transition-none"
              style={{ background: scene.section.accent }}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" aria-hidden="true" /> : <Play className="w-3.5 h-3.5" aria-hidden="true" />}
              <span>{isPlaying ? 'Pause' : 'Play'}</span>
            </button>
            <button
              type="button"
              onClick={() => goTo(sceneIndex + 1)}
              aria-label="Next feature"
              className="p-2.5 rounded-xl bg-[#EFE4CC] hover:bg-[#E5D4B2] text-[#2A170B] transition cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </div>

        <div role="group" aria-label="Jump to a feature" className="grid grid-cols-3 sm:grid-cols-9 gap-2">
          {DEMO_SCENES.map((item, i) => {
            const Icon = item.section.icon;
            const active = i === sceneIndex;
            const fill = active ? progress : i < sceneIndex ? 1 : 0;
            return (
              <button
                key={item.section.key}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Jump to ${item.section.label}: ${item.title}`}
                aria-current={active ? 'step' : undefined}
                title={item.title}
                className="relative overflow-hidden rounded-xl border px-2 py-2 text-left text-[11px] font-semibold text-[#4E3721] bg-[#FFFDF8] hover:border-[#C99B48] transition-colors cursor-pointer motion-reduce:transition-none"
                style={active ? { borderColor: item.section.accent, background: '#FBF1DA', color: '#23140A' } : { borderColor: '#E3D2B1' }}
              >
                <span className="relative flex items-center gap-1.5">
                  <Icon className="w-3.5 h-3.5 shrink-0" style={{ color: item.section.accent }} aria-hidden="true" />
                  <span className="truncate">{item.section.label}</span>
                </span>
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 bottom-0 h-1 origin-left transition-transform duration-100 motion-reduce:transition-none"
                  style={{ background: item.section.accent, transform: `scaleX(${fill})` }}
                />
              </button>
            );
          })}
        </div>

        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setElapsedMs(0)}
            className="text-xs font-semibold text-[#6B5038] hover:text-[#23140A] cursor-pointer"
          >
            Restart this feature
          </button>
          <span className="text-[11px] text-[#6B5038]">{isPlaying ? 'Tour is playing' : 'Tour is paused'}</span>
        </div>
      </div>
    </section>
  );
};

export default ProductDemoShowcase;
