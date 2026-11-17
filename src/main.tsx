import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { ErrorBoundary } from './components/common/ErrorBoundary.tsx';
import { AuthProvider } from './contexts/AuthContext.tsx';
import { initPwaSupport } from './utils/pwaInstall.ts';
import './index.css';

initPwaSupport();

const BOOT_FONT_MAP: Record<string, string> = {
  Pacifico: "'Pacifico', cursive",
  'Dancing Script': "'Dancing Script', cursive",
  Caveat: "'Caveat', cursive",
  'Architects Daughter': "'Architects Daughter', cursive",
  'Brush Script': "'Brush Script MT', 'Alex Brush', cursive",
  'Marker Felt': "'Marker Felt', 'Patrick Hand', cursive",
  Chalkduster: "'Chalkduster', 'Architects Daughter', cursive",
  'Alex Brush': "'Alex Brush', cursive",
  'Great Vibes': "'Great Vibes', cursive",
  Satisfy: "'Satisfy', cursive",
  Helvetica: "'Helvetica Neue', Helvetica, Arial, sans-serif",
  Arial: 'Arial, Helvetica, sans-serif',
  Calibri: "Calibri, 'Plus Jakarta Sans', sans-serif",
  Inter: "'Inter', sans-serif",
  Roboto: "'Roboto', sans-serif",
  'Open Sans': "'Open Sans', sans-serif",
  Lato: "'Lato', sans-serif",
  Montserrat: "'Montserrat', sans-serif",
  'Source Sans 3': "'Source Sans 3', sans-serif",
  Futura: "Futura, 'Outfit', sans-serif",
  'Times New Roman': "'Times New Roman', Times, serif",
  Georgia: 'Georgia, serif',
  Garamond: "'EB Garamond', Garamond, serif",
  Baskerville: "'Libre Baskerville', Baskerville, Georgia, serif",
  Merriweather: "'Merriweather', serif",
  'Playfair Display': "'Playfair Display', 'Lora', Georgia, serif",
  Bodoni: "'Bodoni Moda', 'Bodoni MT', serif",
  Palatino: "'Palatino Linotype', Palatino, serif",
  Lora: "'Lora', serif",
  Cinzel: "'Cinzel', serif",
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
