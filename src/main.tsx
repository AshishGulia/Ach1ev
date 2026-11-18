import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { ErrorBoundary } from './components/common/ErrorBoundary.tsx';
import { AuthProvider } from './contexts/AuthContext.tsx';
import { initPwaSupport } from './utils/pwaInstall.ts';
import './index.css';

initPwaSupport();

const BOOT_FONT_MAP: Record<string, string> = {
  // Handwriting (9)
  'Annie Use Your Telescope': "'Annie Use Your Telescope', cursive",
  'Caveat Brush': "'Caveat Brush', cursive",
  'Comic Neue': "'Comic Neue', cursive",
  Delius: "'Delius', cursive",
  'Indie Flower': "'Indie Flower', cursive",
  'Lobster Two': "'Lobster Two', cursive",
  'Dancing Script': "'Dancing Script', cursive",
  'Patrick Hand': "'Patrick Hand', cursive",
  Jojoba: "'Jojoba', 'Patrick Hand', cursive",

  // Casual (9)
  Urbanist: "'Urbanist', sans-serif",
  Calibri: "Calibri, 'Urbanist', sans-serif",
  Alata: "'Alata', sans-serif",
  Bahnschrift: "'Bahnschrift', 'Afacad', sans-serif",
  'Century Gothic': "'Century Gothic', CenturyGothic, AppleGothic, 'Urbanist', sans-serif",
  'Zen Maru Gothic': "'Zen Maru Gothic', sans-serif",
  Afacad: "'Afacad', sans-serif",
  Arsenal: "'Arsenal', sans-serif",
  'Cascadia Mono': "'Cascadia Mono', monospace",

  // Official (10 + Libre Baskerville default)
  'Times New Roman': "'Times New Roman', Times, serif",
  'Amiri Quran': "'Amiri Quran', serif",
  'Abhaya Libre': "'Abhaya Libre', serif",
  Antic: "'Antic', sans-serif",
  Didone: "'Didone', 'Antic Didone', 'Bodoni Moda', 'Didot', serif",
  Bellefair: "'Bellefair', serif",
  'Bodoni Moda': "'Bodoni Moda', 'Bodoni MT', serif",
  'Bona Nova': "'Bona Nova', serif",
  Caudex: "'Caudex', serif",
  Domine: "'Domine', serif",
  Baskerville: "'Libre Baskerville', Baskerville, Georgia, serif",
};

// Apply saved user font family & size spectrum (Default: Baskerville)
try {
  const savedFont = localStorage.getItem('medden_app_font') || 'Baskerville';
  const savedScale = localStorage.getItem('medden_font_scale') || '100%';
  const cssFamily = BOOT_FONT_MAP[savedFont] || `'${savedFont}', 'Libre Baskerville', Baskerville, Georgia, serif`;
  document.documentElement.style.setProperty('--app-font-family', cssFamily);
  document.documentElement.style.setProperty('--app-font-scale', savedScale);
} catch {}

createRoot(document.getElementById('root')!).render(
  <ErrorBoundary>
    <AuthProvider>
      <App />
    </AuthProvider>
  </ErrorBoundary>
);
