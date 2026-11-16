import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { DEMO_SCENES } from './productDemoData';
import { LaptopFrame, TabletFrame } from './ProductDemoDevices';

const SCENE_MS = 6500;

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
`;

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const ProductDemoShowcase: React.FC = () => {
  const [sceneIndex, setSceneIndex] = useState(0);

  const total = DEMO_SCENES.length;
  const scene = DEMO_SCENES[sceneIndex]!;

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const id = window.setInterval(() => {
      setSceneIndex((i) => (i + 1) % total);
    }, SCENE_MS);
    return () => window.clearInterval(id);
  }, [sceneIndex, total]);

  const goPrev = () => setSceneIndex((i) => (i - 1 + total) % total);
  const goNext = () => setSceneIndex((i) => (i + 1) % total);

  return (
    <section
      aria-labelledby="product-demo-heading"
      className="w-full max-w-6xl mx-auto pb-16 sm:pb-20"
    >
      <style>{SHOWCASE_CSS}</style>

      <div className="space-y-1.5 text-center mb-6 sm:mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8f5f2c]">
          Product showcase
        </p>
        <h2
          id="product-demo-heading"
          className="text-xl sm:text-3xl font-bold text-[#1E1007] font-serif leading-[1.2]"
        >
          {scene.title}
        </h2>
        <p className="text-sm text-[#4E3721] leading-relaxed max-w-2xl mx-auto">
          {scene.caption}
        </p>
      </div>

      {/* Full-Height Transparent Left & Right Arrow Columns flanking Stacked MacBook + iPad */}
      <div className="grid grid-cols-[44px_minmax(0,1fr)_44px] sm:grid-cols-[76px_minmax(0,1fr)_76px] items-stretch">
        <button
          type="button"
          onClick={goPrev}
          aria-label="Previous section preview"
          className="pds-arrow-col flex items-center justify-center cursor-pointer select-none text-[#4E3211]/65 hover:text-[#1E1007]"
        >
          <ChevronLeft className="w-9 h-24 sm:w-12 sm:h-32 shrink-0" strokeWidth={1.1} aria-hidden="true" />
        </button>

        <div className="flex flex-col items-center gap-7 sm:gap-10 min-w-0 py-2">
          <div className="w-full">
            <LaptopFrame scene={scene} />
          </div>
          <div className="w-full">
            <TabletFrame scene={scene} />
          </div>
        </div>

        <button
          type="button"
          onClick={goNext}
          aria-label="Next section preview"
          className="pds-arrow-col flex items-center justify-center cursor-pointer select-none text-[#4E3211]/65 hover:text-[#1E1007]"
        >
          <ChevronRight className="w-9 h-24 sm:w-12 sm:h-32 shrink-0" strokeWidth={1.1} aria-hidden="true" />
        </button>
      </div>
    </section>
  );
};

export default ProductDemoShowcase;
