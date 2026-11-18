const WORKSPACE_FONTS_HREF =
  'https://fonts.googleapis.com/css2?family=Alex+Brush&family=Architects+Daughter&family=Bodoni+Moda:wght@500;700&family=Caveat:wght@500;700&family=Cinzel:wght@600;700&family=Dancing+Script:wght@600;700&family=EB+Garamond:wght@400;600&family=Great+Vibes&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&family=Lato:wght@400;700&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Lora:wght@400;600;700&family=Merriweather:wght@400;700&family=Montserrat:wght@400;600;700&family=Open+Sans:wght@400;600;700&family=Outfit:wght@400;600;700&family=Pacifico&family=Patrick+Hand&family=Playfair+Display:ital,wght@0,500;0,700;1,400&family=Plus+Jakarta+Sans:wght@400;600;700&family=Roboto:wght@400;500;700&family=Satisfy&family=Source+Sans+3:wght@400;600;700&display=swap';

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
