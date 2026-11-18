const WORKSPACE_FONTS_HREF =
  'https://fonts.googleapis.com/css2?family=Abhaya+Libre:wght@400;600;700&family=Afacad:wght@400;500;600;700&family=Alata&family=Amiri+Quran&family=Annie+Use+Your+Telescope&family=Antic&family=Antic+Didone&family=Arsenal:wght@400;700&family=Bellefair&family=Bodoni+Moda:wght@500;700&family=Bona+Nova:wght@400;700&family=Cascadia+Mono:wght@400;600&family=Caudex:wght@400;700&family=Caveat+Brush&family=Comic+Neue:wght@400;700&family=Dancing+Script:wght@600;700&family=Delius&family=Domine:wght@400;600;700&family=Indie+Flower&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Lobster+Two:wght@400;700&family=Patrick+Hand&family=Urbanist:wght@400;600;700&family=Zen+Maru+Gothic:wght@400;700&display=swap';

export function ensureWorkspaceFontsLoaded(): void {
  if (typeof document === 'undefined') return;
  if (document.getElementById('achiev-workspace-fonts') || document.getElementById('achiev-google-fonts-30')) {
    return;
  }
  const link = document.createElement('link');
  link.id = 'achiev-workspace-fonts';
  link.rel = 'stylesheet';
  link.href = WORKSPACE_FONTS_HREF;
  document.head.appendChild(link);
}
