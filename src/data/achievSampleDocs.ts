// Built-in Achiev Features Guide PDF & Scanned Roster Sample Data URLs

export const ACHIEV_GUIDE_DOC_ID = 'achiev-features-guide-pdf';
export const LECTURE_SCHEDULE_DOC_ID = 'achiev-lecture-schedule-roster';

export interface GuidePage {
  pageNumber: number;
  heading: string;
  subtitle: string;
  sections: { title: string; body: string }[];
  highlight?: string;
}

export const ACHIEV_FEATURES_GUIDE_PAGES: GuidePage[] = [
  {
    pageNumber: 1,
    heading: 'ACH1EV — Complete Medical & Focus Study Guide',
    subtitle: 'Settle Ideas · All-in-One Cockpit, Library, Notebook, Shelf & Flowcharts',
    sections: [
      {
        title: '1. Cockpit Dashboard & Daily Momentum',
        body: 'Track daily habits with horizontal streak trackers, plan ward/class sessions on your integrated calendar, organize sticky-note tasks across Pending, Due, and Completed lanes, and stay ahead with timely reminders.',
      },
      {
        title: '2. 20-20-20 Eye Rest & Study Rhythm',
        body: 'Built-in 20-minute focus intervals and 15-minute leisure rest alerts protect your eyes and prevent study burnout during marathon preparation.',
      },
      {
        title: '3. Library & Recent Files Vault',
        body: 'Upload PDFs, Word documents (.docx), EPUB books, and images into Recent Files, preview them inside the crisp Web View Window with Share, Save to Device, and Favourite star pinning, or move them neatly into folders.',
      },
    ],
    highlight: 'Tip: Star any document in Library or Web View to pin it straight into your Cockpit Favourites bar.',
  },
  {
    pageNumber: 2,
    heading: 'Deep Study Studio: Notes, Textbooks, 3D Shelf & Flowcharts',
    subtitle: 'Designed for MBBS, NEET-PG, USMLE, Nursing & High-Focus Learners',
    sections: [
      {
        title: '4. Create Note Studio & Smart Templates',
        body: 'Write on ruled, grid, blank, or clinical paper in Handwriting, Sans, and Serif fonts. Keep textbooks open side-by-side next to your notes, pin timestamped YouTube lecture links, drop images, and pick from 5 ready-to-use Achiev study templates.',
      },
      {
        title: '5. 3D Wooden Almirah Shelf & Custom Covers',
        body: 'Stack textbooks into customizable multi-tier wooden almirahs with glass doors, pulling cords, interactive pet cat, default PDF thumbnails, or personalized front covers.',
      },
      {
        title: '6. Mnemonics, Multi-Level Flowcharts & Leisure Lounge',
        body: 'Build 4-level decision flowcharts, test active recall mnemonics, browse Study Circle discussions in Achiever’s Club, and unwind with Peaceful Ambience sounds.',
      },
    ],
    highlight: 'Workflow: Plan in Cockpit -> Read beside Note -> Rest with Eye Timer -> Return refreshed in 15 min.',
  },
  {
    pageNumber: 3,
    heading: 'Subscription Details & Tier Limits (₹0 / ₹100 / ₹300)',
    subtitle: 'Transparent Student-Friendly Plans Powered by Razorpay & Supabase',
    sections: [
      {
        title: 'Free Scholar Plan — ₹0 / month',
        body: 'Includes Create Note (up to 10 notes), Shelf reading & Library (up to 5 PDF/document uploads), 1st 3D Almirah cabinet, 1 Peaceful Ambience sound (Gentle Rain), Cockpit trackers & Calendar. Excludes Achiever’s Club & Gemini AI.',
      },
      {
        title: 'Scholar Pro Plan — ₹100 / month (₹1,200 / year)',
        body: 'Unlocks up to 50 total uploaded documents, unlimited notes, first 3 3D Almirahs, all 10 Peaceful Ambience sounds, Achiever’s Club community, and up to 5 pinned Leisure Favourites.',
      },
      {
        title: 'Master Ultimate Plan — ₹300 / month (₹3,600 / year)',
        body: 'Unlocks full Gemini AI clinical tutor & Picture-to-Table, all 5 3D Almirahs, unlimited PDF/document uploads, unlimited Leisure Favourites, priority Google Drive vault sync, and direct Developer Hotline.',
      },
    ],
    highlight: 'Upgrade anytime in Plans & Subscriptions with instant Razorpay UPI, Card, or NetBanking verification.',
  },
];

export const ACHIEV_GUIDE_BOOK_PAGES = ACHIEV_FEATURES_GUIDE_PAGES.map((p) => ({
  pageNumber: p.pageNumber,
  title: p.heading,
  keyTopic: p.subtitle,
  summaryPearl: p.highlight || p.sections[0]?.body || '',
  contentHtml: `<div class="space-y-3"><p><strong>${p.subtitle}</strong></p>${p.sections
    .map((s) => `<h4>${s.title}</h4><p>${s.body}</p>`)
    .join('')}${p.highlight ? `<div class="callout">${p.highlight}</div>` : ''}</div>`,
}));

export const LECTURE_SCHEDULE_SAMPLE_ROWS = [
  {
    day: 'Monday',
    date: '09:00 AM – 10:30 AM',
    time: '09:00 AM – 10:30 AM',
    subject: 'Pharmacology',
    topic: 'Autonomic Nervous System & Cholinergic Agonists',
    room: 'Lecture Hall A',
    faculty: 'Dr. R. Menon',
    type: 'Lecture',
  },
  {
    day: 'Tuesday',
    date: '11:00 AM – 01:00 PM',
    time: '11:00 AM – 01:00 PM',
    subject: 'Pathology',
    topic: 'Cellular Injury, Necrosis vs Apoptosis Microscopy Lab',
    room: 'Histology Lab 2',
    faculty: 'Dr. S. Kulkarni',
    type: 'Practical',
  },
  {
    day: 'Wednesday',
    date: '08:30 AM – 11:30 AM',
    time: '08:30 AM – 11:30 AM',
    subject: 'Internal Medicine',
    topic: 'Ward 4B Morning Clinical Rounds — ECG & Heart Failure',
    room: 'Medicine Ward 4B',
    faculty: 'Prof. A. Verma',
    type: 'Clinical Ward',
  },
  {
    day: 'Thursday',
    date: '02:00 PM – 03:30 PM',
    time: '02:00 PM – 03:30 PM',
    subject: 'Microbiology',
    topic: 'Gram-Positive Cocci, MRSA Mechanisms & Culture Plates',
    room: 'Micro Demo Room',
    faculty: 'Dr. N. Kapoor',
    type: 'Lecture',
  },
  {
    day: 'Friday',
    date: '04:00 PM – 05:30 PM',
    time: '04:00 PM – 05:30 PM',
    subject: 'Pharmacology & Surgery',
    topic: 'Integrated Grand Quiz & Case Vignette Assessment',
    room: 'Main Auditorium',
    faculty: 'Panel Faculty',
    type: 'Exam / Review',
  },
];

// Create a crisp, multi-page HTML/SVG-backed printable Data URL (and downloadable valid minimal PDF blob helper)
export function buildAchievGuideHtmlDocument(): string {
  return `<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<title>Ach1ev Features & Subscription Guide</title>
<style>
  body { font-family: 'Georgia', serif; background: #faf4ea; color: #2b170b; margin: 0; padding: 32px; line-height: 1.6; }
  .page { max-width: 780px; margin: 0 auto 28px; background: #fffdf9; border: 1px solid #d9c2a3; border-radius: 14px; padding: 32px 36px; box-shadow: 0 8px 24px rgba(59,30,13,0.08); page-break-after: always; }
  .badge { font-family: monospace; font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase; color: #8c5523; margin-bottom: 8px; }
  h1 { margin: 0 0 6px; font-size: 24px; color: #3b1e0d; }
  .sub { margin: 0 0 22px; font-size: 13px; color: #6e4527; border-bottom: 1px solid #ecdcc5; padding-bottom: 12px; }
  .sec { margin-bottom: 16px; padding: 12px 14px; background: #fbf6ee; border: 1px solid #ead8bf; border-radius: 10px; }
  .sec h3 { margin: 0 0 4px; font-size: 14px; color: #4a2511; font-family: system-ui, sans-serif; }
  .sec p { margin: 0; font-size: 13px; color: #3e2414; font-family: system-ui, sans-serif; }
  .hl { margin-top: 16px; padding: 10px 14px; background: #f2e2c8; border-radius: 8px; font-size: 12px; font-weight: 600; color: #3b1e0d; font-family: system-ui, sans-serif; }
</style>
</head>
<body>
${ACHIEV_FEATURES_GUIDE_PAGES.map(
  (p) => `<section class="page">
  <div class="badge">ACH1EV · PAGE ${p.pageNumber} OF ${ACHIEV_FEATURES_GUIDE_PAGES.length}</div>
  <h1>${p.heading}</h1>
  <p class="sub">${p.subtitle}</p>
  ${p.sections.map((s) => `<div class="sec"><h3>${s.title}</h3><p>${s.body}</p></div>`).join('')}
  ${p.highlight ? `<div class="hl">${p.highlight}</div>` : ''}
</section>`
).join('')}
</body>
</html>`;
}

export function buildAchievGuideDataUrl(): string {
  const html = buildAchievGuideHtmlDocument();
  return `data:text/html;charset=utf-8,${encodeURIComponent(html)}`;
}

export function buildLectureScheduleHtmlDocument(): string {
  return `<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<title>Lecture schedule — Scanned Roster</title>
<style>
  body { font-family: system-ui, -apple-system, sans-serif; background: #f9f3e8; color: #2b170b; margin: 0; padding: 28px; }
  .sheet { max-width: 780px; margin: 0 auto; background: #fffdf8; border: 1px solid #d9c2a3; border-radius: 14px; padding: 28px; box-shadow: 0 8px 24px rgba(59,30,13,0.08); }
  .kicker { font-family: monospace; font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase; color: #8c5523; }
  h1 { margin: 6px 0 4px; font-size: 22px; color: #3b1e0d; }
  p.meta { margin: 0 0 18px; font-size: 13px; color: #6e4527; }
  table { width: 100%; border-collapse: collapse; font-size: 13px; }
  th { text-align: left; padding: 10px 12px; background: #4a2511; color: #f6ebd8; font-weight: 600; }
  td { padding: 10px 12px; border-bottom: 1px solid #ead8bf; color: #3b1e0d; }
  tr:nth-child(even) td { background: #fbf6ee; }
</style>
</head>
<body>
<div class="sheet">
  <div class="kicker">Scanned Academic Timetable · Recent Files Sample</div>
  <h1>Lecture schedule</h1>
  <p class="meta">Extracted clinical &amp; lecture roster ready for calendar sync inside Ach1ev.</p>
  <table>
    <thead>
      <tr><th>Day</th><th>Time</th><th>Subject</th><th>Session Topic</th><th>Type</th></tr>
    </thead>
    <tbody>
      ${LECTURE_SCHEDULE_SAMPLE_ROWS.map(
        (r) =>
          `<tr><td><strong>${r.day}</strong></td><td>${r.date}</td><td>${r.subject}</td><td>${r.topic}</td><td>${r.type}</td></tr>`
      ).join('')}
    </tbody>
  </table>
</div>
</body>
</html>`;
}

export function buildLectureScheduleDataUrl(): string {
  return `data:text/html;charset=utf-8,${encodeURIComponent(buildLectureScheduleHtmlDocument())}`;
}
