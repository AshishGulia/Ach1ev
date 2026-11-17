export interface NoteTemplateFloatingBox {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  text: string;
  shape: 'rect' | 'rounded' | 'pill' | 'sticky' | 'banner';
  bgColor: string;
  textColor: string;
  locked: boolean;
}

export interface AutoNoteTemplate {
  id: string;
  title: string;
  subtitle: string;
  fontCategory: 'Handwriting' | 'Sans-Serif' | 'Serif';
  fontKey: string;
  fontLabel: string;
  fontFamilyPreview: string;
  paperColor: string;
  accentHex: string;
  benefitTag: string;
  youtubeId: string;
  youtubeTitle: string;
  timestampSec: number;
  timestampLabel: string;
  youtubeUrl: string;
  resourceId: string;
  previewImageSrc: string;
  htmlContent: string;
  floatingBoxes: NoteTemplateFloatingBox[];
}

const makeDiagramDataUrl = (
  bg: string,
  border: string,
  title: string,
  subtitle: string,
  boxes: Array<{ label: string; value: string; fill: string; ink: string }>
): string => {
  const cardWidth = 175;
  const gap = 16;
  const startX = 28;
  const cardsSvg = boxes
    .map((b, i) => {
      const x = startX + i * (cardWidth + gap);
      return `
        <g>
          <rect x="${x}" y="76" width="${cardWidth}" height="76" rx="12" fill="${b.fill}" stroke="${border}" stroke-width="1.4" />
          <text x="${x + 14}" y="102" font-family="system-ui, sans-serif" font-size="11" font-weight="700" fill="${b.ink}" opacity="0.8">${b.label}</text>
          <text x="${x + 14}" y="128" font-family="system-ui, sans-serif" font-size="14" font-weight="800" fill="${b.ink}">${b.value}</text>
        </g>
      `;
    })
    .join('');

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="178" viewBox="0 0 600 178">
    <rect width="600" height="178" rx="16" fill="${bg}" stroke="${border}" stroke-width="2" />
    <text x="28" y="34" font-family="system-ui, sans-serif" font-size="16" font-weight="800" fill="#3e1e0e">${title}</text>
    <text x="28" y="54" font-family="system-ui, sans-serif" font-size="11.5" font-weight="600" fill="#7c5234">${subtitle}</text>
    ${cardsSvg}
  </svg>`;

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
};

const imgCornell = makeDiagramDataUrl(
  '#FEF7E6',
  '#B45309',
  'Ach1ev Dual-Pane + Active Recall Engine',
  'Read textbook side-by-side · Stamp lecture timestamps · Test via cloze blocks',
  [
    { label: 'STEP 01 · CAPTURE', value: 'Split PDF + Note', fill: '#FFFFFF', ink: '#451A03' },
    { label: 'STEP 02 · LINK', value: 'Live YT Timestamp', fill: '#FDE68A', ink: '#451A03' },
    { label: 'STEP 03 · RECALL', value: 'Checklist + Cloze', fill: '#FFFFFF', ink: '#451A03' },
  ]
);

const imgFocus = makeDiagramDataUrl(
  '#ECFDF5',
  '#047857',
  'Ach1ev Sustainable Eye-Safe Focus Architecture',
  '20-20-20 micro-eye breaks · Rain & Zen acoustics · Zero burnout',
  [
    { label: 'EYECARE CADENCE', value: '20m Focus · 20s Look', fill: '#FFFFFF', ink: '#064E3B' },
    { label: 'AUDIO SHIELD', value: 'Peaceful Soundscape', fill: '#A7F3D0', ink: '#064E3B' },
    { label: 'LEISURE RESET', value: '15m Mind Refresh', fill: '#FFFFFF', ink: '#064E3B' },
  ]
);

const imgLibrary = makeDiagramDataUrl(
  '#EFF6FF',
  '#1D4ED8',
  'Ach1ev HD Almira Shelf & Recent Files Matrix',
  'Upload rosters, syllabi & high-yield PDFs directly into your side-by-side workspace',
  [
    { label: 'VIRTUAL ALMIRA', value: 'Cover & PDF Reader', fill: '#FFFFFF', ink: '#1E3A8A' },
    { label: 'RECENT FILES', value: '1-Tap Move & Share', fill: '#BFDBFE', ink: '#1E3A8A' },
    { label: 'MULTI-PANE', value: '3 Docs Simultaneously', fill: '#FFFFFF', ink: '#1E3A8A' },
  ]
);

const imgFlow = makeDiagramDataUrl(
  '#FDF2F8',
  '#BE185D',
  'Ach1ev 4-Level Study Flowchart & Mnemonics',
  'Plan goals → Dual-pane execution → Eye rest → Restored focus sprints',
  [
    { label: 'VISUAL CANVAS', value: '4-Level Focus Map', fill: '#FFFFFF', ink: '#831843' },
    { label: 'MNEMONIC BANK', value: 'Memory Hooks', fill: '#FBCFE8', ink: '#831843' },
    { label: 'SMART ROSTER', value: 'Instant Day Sync', fill: '#FFFFFF', ink: '#831843' },
  ]
);

const imgExecutive = makeDiagramDataUrl(
  '#F5F3FF',
  '#5B21B6',
  'Ach1ev Unified Exam & Career Command Dossier',
  'Trackers, sticky priorities, reminders, Study Circle peer posts & Gemini synthesis',
  [
    { label: 'DAILY TRACKERS', value: 'Habit & Scoreboard', fill: '#FFFFFF', ink: '#4C1D95' },
    { label: 'STUDY CIRCLE', value: 'Peer Case Threads', fill: '#DDD6FE', ink: '#4C1D95' },
    { label: 'GEMINI SYNTHESIS', value: 'Board Pearls & Quiz', fill: '#FFFFFF', ink: '#4C1D95' },
  ]
);

export const AUTO_NOTE_TEMPLATES: AutoNoteTemplate[] = [
  {
    id: 'tpl-handwriting-cornell',
    title: 'Active Recall & Cornell Study Guide (Ach1ev)',
    subtitle: 'Handwritten script with lecture video timestamp, visual diagram & stacked sticky + rounded cards.',
    fontCategory: 'Handwriting',
    fontKey: 'caveat',
    fontLabel: 'Caveat (Handwriting)',
    fontFamilyPreview: "'Caveat', cursive",
    paperColor: 'sepia',
    accentHex: '#B45309',
    benefitTag: 'Split Screen + Timestamps',
    youtubeId: 'ukLnPbIffxE',
    youtubeTitle: 'Evidence-Based Active Recall Revision — Ali Abdaal',
    timestampSec: 125,
    timestampLabel: '02:05',
    youtubeUrl: 'https://www.youtube.com/watch?v=ukLnPbIffxE&t=125s',
    resourceId: 'tpl-yt-cornell',
    previewImageSrc: imgCornell,
    floatingBoxes: [
      {
        id: 'tb-cornell-sticky',
        x: 340,
        y: 34,
        width: 245,
        height: 112,
        text: 'Sticky Reminder: Click the 02:05 timestamp badge inside this note anytime to jump right back to the key Active Recall segment!',
        shape: 'sticky',
        bgColor: '#FEF08A',
        textColor: '#451A03',
        locked: false,
      },
      {
        id: 'tb-cornell-rounded',
        x: 340,
        y: 168,
        width: 245,
        height: 98,
        text: 'Why Ach1ev Wins: Split your PDF textbook on the left, jot handwritten cues on the right, and keep YouTube docked below.',
        shape: 'rounded',
        bgColor: '#FFEDD5',
        textColor: '#7C2D12',
        locked: false,
      },
    ],
    htmlContent: `
      <h2>Why Ach1ev Transforms Active Recall</h2>
      <p><strong>Core Advantage:</strong> Instead of juggling four separate apps, <em>Ach1ev</em> unifies your textbook shelf, handwritten paper sheet, clickable video timestamps, and interactive checklists on a single calm desk.</p>
      <figure style="margin:14px 0;">
        <img src="${imgCornell}" alt="Ach1ev Dual-Pane Active Recall Diagram" style="width:100%;max-width:560px;border-radius:12px;border:1.5px solid #d97706;" />
        <figcaption style="font-size:12px;opacity:0.75;margin-top:4px;">Figure 1 — Ach1ev 3-Step Dual-Pane Capture & Recall Cycle</figcaption>
      </figure>
      <div class="callout" style="border-left:4px solid #b45309;padding:10px 14px;background:rgba(251,191,36,0.14);border-radius:8px;margin:12px 0;">
        <strong>Embedded Timestamped Lecture:</strong>
        <a href="https://www.youtube.com/watch?v=ukLnPbIffxE&t=125s" target="_blank" rel="noopener noreferrer" style="color:#92400e;font-weight:700;text-decoration:underline;margin-left:6px;">Watch Evidence-Based Revision @ 02:05 ↗</a>
        &nbsp;
        <button class="ts" contenteditable="false" data-res="tpl-yt-cornell" data-t="125" data-vid="ukLnPbIffxE">▶ 02:05</button>
      </div>
      <h3>Self-Test Checklist</h3>
      <div class="chk"><span class="box" contenteditable="false" role="checkbox" aria-checked="false" tabindex="0"></span><span>Open core textbook in Left Split Window</span></div>
      <div class="chk"><span class="box" contenteditable="false" role="checkbox" aria-checked="false" tabindex="0"></span><span>Stamp key YouTube explanation @ 02:05</span></div>
      <div class="chk"><span class="box" contenteditable="false" role="checkbox" aria-checked="false" tabindex="0"></span><span>Convert weak concepts into Cloze hide cards</span></div>
    `,
  },
  {
    id: 'tpl-handwriting-focus',
    title: 'Mindful Eye Care & Acoustic Focus Journal',
    subtitle: 'Flowing cursive handwriting format featuring the 20-20-20 rest box, YouTube link & pill/banner callouts.',
    fontCategory: 'Handwriting',
    fontKey: 'dancing-script',
    fontLabel: 'Dancing Script (Handwriting)',
    fontFamilyPreview: "'Dancing Script', cursive",
    paperColor: 'mint',
    accentHex: '#047857',
    benefitTag: 'Eye Timer + Peace Sounds',
    youtubeId: 'Hu4Yvq-g7_Y',
    youtubeTitle: 'How to Get Your Brain to Focus — Chris Bailey (TEDx)',
    timestampSec: 180,
    timestampLabel: '03:00',
    youtubeUrl: 'https://www.youtube.com/watch?v=Hu4Yvq-g7_Y&t=180s',
    resourceId: 'tpl-yt-focus',
    previewImageSrc: imgFocus,
    floatingBoxes: [
      {
        id: 'tb-focus-banner',
        x: 335,
        y: 30,
        width: 255,
        height: 92,
        text: '20-20-20 EYE CARE BOX: Every 20 min, rest your eyes 20 ft away for 20 sec while Rain Ambience keeps cortisol low.',
        shape: 'banner',
        bgColor: '#D1FAE5',
        textColor: '#064E3B',
        locked: false,
      },
      {
        id: 'tb-focus-pill',
        x: 335,
        y: 142,
        width: 240,
        height: 76,
        text: 'Leisure Rule: Enjoy 15m Mind Reset, then return automatically to your active study sprint.',
        shape: 'pill',
        bgColor: '#E0F2FE',
        textColor: '#0C4A6E',
        locked: false,
      },
    ],
    htmlContent: `
      <h2>Sustained Focus Without Eye Strain</h2>
      <p>Long marathon sessions fail when visual fatigue builds up. <strong>Ach1ev</strong> weaves built-in Eye Care reminders and calibrated ambient soundscapes directly into your notebook and leisure desk.</p>
      <figure style="margin:14px 0;">
        <img src="${imgFocus}" alt="Ach1ev Eye-Safe Focus Architecture" style="width:100%;max-width:560px;border-radius:12px;border:1.5px solid #059669;" />
        <figcaption style="font-size:12px;opacity:0.75;margin-top:4px;">Figure 1 — Eye Protection & Acoustic Flow Loop inside Ach1ev</figcaption>
      </figure>
      <div class="callout" style="border-left:4px solid #047857;padding:10px 14px;background:rgba(16,185,129,0.12);border-radius:8px;margin:12px 0;">
        <strong>Featured Deep-Focus Talk:</strong>
        <a href="https://www.youtube.com/watch?v=Hu4Yvq-g7_Y&t=180s" target="_blank" rel="noopener noreferrer" style="color:#065f46;font-weight:700;text-decoration:underline;margin-left:6px;">How to Get Your Brain to Focus @ 03:00 ↗</a>
        &nbsp;
        <button class="ts" contenteditable="false" data-res="tpl-yt-focus" data-t="180" data-vid="Hu4Yvq-g7_Y">▶ 03:00</button>
      </div>
      <ul>
        <li><strong>Sound Shield:</strong> Block room distractions using Rain, Forest, or Zen Singing Bowls.</li>
        <li><strong>Eye Guardian:</strong> Automatic 20-20-20 micro-prompts protect retinal tear film.</li>
        <li><strong>Guilt-Free Break:</strong> 15-minute Leisure Wing refresh timer calls you back to work.</li>
      </ul>
    `,
  },
  {
    id: 'tpl-sans-library',
    title: 'Split-Screen Library & Recent Files Blueprint',
    subtitle: 'Crisp Inter Sans layout detailing Almira shelves, PDF thumbnails, Web View & sharp rectangular + pill text boxes.',
    fontCategory: 'Sans-Serif',
    fontKey: 'inter',
    fontLabel: 'Inter (Sans-Serif)',
    fontFamilyPreview: "'Inter', sans-serif",
    paperColor: 'ice-blue',
    accentHex: '#1D4ED8',
    benefitTag: 'Almira Shelf + PDF Web View',
    youtubeId: 'Z-zNHHpXoMM',
    youtubeTitle: 'How I Ranked 1st — Organized Digital Library Tips',
    timestampSec: 95,
    timestampLabel: '01:35',
    youtubeUrl: 'https://www.youtube.com/watch?v=Z-zNHHpXoMM&t=95s',
    resourceId: 'tpl-yt-library',
    previewImageSrc: imgLibrary,
    floatingBoxes: [
      {
        id: 'tb-lib-rect',
        x: 335,
        y: 34,
        width: 252,
        height: 105,
        text: 'RECENT FILES RIBBON: Upload once → click 3 dots → move to any subject folder or open in HD Web View with Share, Save & ★ Favourite.',
        shape: 'rect',
        bgColor: '#DBEAFE',
        textColor: '#1E3A8A',
        locked: false,
      },
      {
        id: 'tb-lib-pill',
        x: 335,
        y: 158,
        width: 235,
        height: 76,
        text: 'Virtual Almira: Custom covers + instant side-by-side book reader!',
        shape: 'pill',
        bgColor: '#EDE9FE',
        textColor: '#4C1D95',
        locked: false,
      },
    ],
    htmlContent: `
      <h2>Digital Almira Shelf & Instant Web View</h2>
      <p>Never lose a syllabus, lecture roster, or reference PDF again. Ach1ev’s Library workspace keeps your <strong>Recent Files</strong> one click away and opens every document inside a distraction-free <strong>Web View Window</strong>.</p>
      <figure style="margin:14px 0;">
        <img src="${imgLibrary}" alt="Ach1ev HD Almira Shelf and Recent Files Matrix" style="width:100%;max-width:560px;border-radius:12px;border:1.5px solid #2563eb;" />
        <figcaption style="font-size:12px;opacity:0.75;margin-top:4px;">Figure 1 — Seamless Upload, Move-to-Folder & Multi-Book Reader Flow</figcaption>
      </figure>
      <div class="callout" style="border-left:4px solid #1d4ed8;padding:10px 14px;background:rgba(59,130,246,0.12);border-radius:8px;margin:12px 0;">
        <strong>Study Systems Timestamp:</strong>
        <a href="https://www.youtube.com/watch?v=Z-zNHHpXoMM&t=95s" target="_blank" rel="noopener noreferrer" style="color:#1e40af;font-weight:700;text-decoration:underline;margin-left:6px;">Organized Digital Library Workflow @ 01:35 ↗</a>
        &nbsp;
        <button class="ts" contenteditable="false" data-res="tpl-yt-library" data-t="95" data-vid="Z-zNHHpXoMM">▶ 01:35</button>
      </div>
      <table>
        <thead><tr><th>Library Feature</th><th>Benefit in Daily Prep</th></tr></thead>
        <tbody>
          <tr><td>Recent Files 3-Dots</td><td>Move uploaded PDFs straight into subject folders</td></tr>
          <tr><td>Web View Top Ribbon</td><td>Share, Save to Device & Mark ★ Favourite in 1 click</td></tr>
          <tr><td>Almira Custom Covers</td><td>Recognize high-yield volumes visually at a glance</td></tr>
        </tbody>
      </table>
    `,
  },
  {
    id: 'tpl-sans-flowchart',
    title: '4-Level Focus Flowchart & Mnemonic Brief',
    subtitle: 'Clean Open Sans framework mapping Ach1ev flowcharts, mnemonics & roster sync with banner + sticky boxes.',
    fontCategory: 'Sans-Serif',
    fontKey: 'open-sans',
    fontLabel: 'Open Sans (Sans-Serif)',
    fontFamilyPreview: "'Open Sans', sans-serif",
    paperColor: 'white',
    accentHex: '#BE185D',
    benefitTag: 'Flowchart + Mnemonics',
    youtubeId: 'IlU-zDU6aQ0',
    youtubeTitle: 'Study Less Study Smart — Marty Lobdell Lecture',
    timestampSec: 60,
    timestampLabel: '01:00',
    youtubeUrl: 'https://www.youtube.com/watch?v=IlU-zDU6aQ0&t=60s',
    resourceId: 'tpl-yt-flowchart',
    previewImageSrc: imgFlow,
    floatingBoxes: [
      {
        id: 'tb-flow-banner',
        x: 335,
        y: 28,
        width: 254,
        height: 102,
        text: 'LEVELS 1 → 4 PIPELINE: Set Goal Note → Split PDF + YouTube → Eye Rest & Study Circle → Return in 15 min.',
        shape: 'banner',
        bgColor: '#FCE7F3',
        textColor: '#831843',
        locked: false,
      },
      {
        id: 'tb-flow-sticky',
        x: 335,
        y: 150,
        width: 245,
        height: 92,
        text: 'Mnemonic Tip: Turn dense pharmacology lists into punchy memory hooks & pin them straight to your note!',
        shape: 'sticky',
        bgColor: '#FEF9C3',
        textColor: '#713F12',
        locked: false,
      },
    ],
    htmlContent: `
      <h2>Visual Flowcharts + High-Yield Mnemonics</h2>
      <p>Complex exam roadmaps become effortless when broken into clear visual stages. Combine <strong>Ach1ev Flowchart Studio</strong> with personal mnemonic decks and automatic calendar roster scanning.</p>
      <figure style="margin:14px 0;">
        <img src="${imgFlow}" alt="Ach1ev 4-Level Study Flowchart Diagram" style="width:100%;max-width:560px;border-radius:12px;border:1.5px solid #db2777;" />
        <figcaption style="font-size:12px;opacity:0.75;margin-top:4px;">Figure 1 — End-to-End 4-Level Study Pipeline</figcaption>
      </figure>
      <div class="callout" style="border-left:4px solid #be185d;padding:10px 14px;background:rgba(236,72,153,0.1);border-radius:8px;margin:12px 0;">
        <strong>Classic Psychology Lecture:</strong>
        <a href="https://www.youtube.com/watch?v=IlU-zDU6aQ0&t=60s" target="_blank" rel="noopener noreferrer" style="color:#9d174d;font-weight:700;text-decoration:underline;margin-left:6px;">Study Less Study Smart @ 01:00 ↗</a>
        &nbsp;
        <button class="ts" contenteditable="false" data-res="tpl-yt-flowchart" data-t="60" data-vid="IlU-zDU6aQ0">▶ 01:00</button>
      </div>
      <ol>
        <li><strong>Level 1 · Plan:</strong> Define daily tracker targets & upload lecture roster.</li>
        <li><strong>Level 2 · Deep Work:</strong> Split-screen PDF + Note + embedded lecture video.</li>
        <li><strong>Level 3 · Rest:</strong> Glance away for Eye Timer, play soft soundscapes & read Study Circle posts.</li>
        <li><strong>Level 4 · Re-engage:</strong> Return automatically after a 15-minute reset.</li>
      </ol>
    `,
  },
  {
    id: 'tpl-serif-executive',
    title: 'Executive Revision & Achiev Mastery Dossier',
    subtitle: 'Editorial Playfair Display Serif dossier covering Trackers, Study Circle, Gemini AI & 3 stacked box formats.',
    fontCategory: 'Serif',
    fontKey: 'playfair',
    fontLabel: 'Playfair Display (Serif)',
    fontFamilyPreview: "'Playfair Display', serif",
    paperColor: 'sepia',
    accentHex: '#5B21B6',
    benefitTag: 'Full Ecosystem Mastery',
    youtubeId: '5MgBikgcWnY',
    youtubeTitle: 'The First 20 Hours — How to Learn Anything | Josh Kaufman',
    timestampSec: 210,
    timestampLabel: '03:30',
    youtubeUrl: 'https://www.youtube.com/watch?v=5MgBikgcWnY&t=210s',
    resourceId: 'tpl-yt-executive',
    previewImageSrc: imgExecutive,
    floatingBoxes: [
      {
        id: 'tb-exec-rounded',
        x: 335,
        y: 26,
        width: 252,
        height: 88,
        text: 'ACHIEVER CLUB & GEMINI: Upgrade to Master Ultimate (₹300/mo) for unlimited PDFs, Gemini AI concepts & all 5 Almirah cabinets.',
        shape: 'rounded',
        bgColor: '#EDE9FE',
        textColor: '#4C1D95',
        locked: false,
      },
      {
        id: 'tb-exec-rect',
        x: 335,
        y: 128,
        width: 252,
        height: 78,
        text: 'COCKPIT SYNC: 4 Horizontal Trackers + Pending/Due/Completed Stickies + Smart Reminders.',
        shape: 'rect',
        bgColor: '#F3E8FF',
        textColor: '#3B0764',
        locked: false,
      },
      {
        id: 'tb-exec-sticky',
        x: 335,
        y: 220,
        width: 252,
        height: 76,
        text: 'Quote: "Focus beats hours — structured revision compounds every single morning."',
        shape: 'sticky',
        bgColor: '#FEF08A',
        textColor: '#422006',
        locked: false,
      },
    ],
    htmlContent: `
      <h2>The Ach1ev Complete Exam Mastery Dossier</h2>
      <blockquote>“Clarity of workflow creates clarity of memory. When notes, books, schedule, and wellness live together, excellence becomes habitual.”</blockquote>
      <figure style="margin:14px 0;">
        <img src="${imgExecutive}" alt="Ach1ev Unified Exam & Career Command Dossier" style="width:100%;max-width:560px;border-radius:12px;border:1.5px solid #6d28d9;" />
        <figcaption style="font-size:12px;opacity:0.75;margin-top:4px;">Figure 1 — Unified Trackers, Study Circle & Gemini Revision Architecture</figcaption>
      </figure>
      <div class="callout" style="border-left:4px solid #5b21b6;padding:10px 14px;background:rgba(139,92,246,0.1);border-radius:8px;margin:12px 0;">
        <strong>Rapid Skill Acquisition Video:</strong>
        <a href="https://www.youtube.com/watch?v=5MgBikgcWnY&t=210s" target="_blank" rel="noopener noreferrer" style="color:#5b21b6;font-weight:700;text-decoration:underline;margin-left:6px;">The First 20 Hours Method @ 03:30 ↗</a>
        &nbsp;
        <button class="ts" contenteditable="false" data-res="tpl-yt-executive" data-t="210" data-vid="5MgBikgcWnY">▶ 03:30</button>
      </div>
      <h3>Daily Revision Rubric</h3>
      <p>Review your <strong>4 Horizontal Trackers</strong> at sunrise, resolve <strong>Due & Pending Sticky Tasks</strong> before noon, collaborate with peers in the <strong>Achiever Study Circle</strong>, and call on <strong>Gemini AI</strong> whenever an intractable clinical mechanism needs crystal-clear breakdown.</p>
    `,
  },
];
