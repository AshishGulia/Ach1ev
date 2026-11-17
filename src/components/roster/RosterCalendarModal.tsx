import React, { useState, useEffect, useRef } from 'react';
import { RosterEvent, StudyTask, SubjectCourse } from '../../types';
import {
  addUploadedDocument,
  ExtractedTableData,
  getSessionFileUrl,
  getUploadedDocuments,
  readFileAsDataUrl,
  registerSessionFileUrl,
  touchUploadedDocument,
  UploadedDocumentRecord,
} from '../../services/uploadedFilesStore';
import {
  Calendar as CalendarIcon,
  Sparkles,
  Upload,
  Clock,
  MapPin,
  User,
  Plus,
  Check,
  FileText,
  X,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Trash2,
  Bell,
  CheckSquare,
  Tag,
  Palette,
  Edit2,
  Sliders,
  History,
  Table2,
  FileSpreadsheet,
  FileImage,
} from 'lucide-react';
import {
  RoundColorColumnsPicker,
  UNIFIED_COLOR_COLUMNS,
} from '../common/RoundColorColumnsPicker';

interface RosterCalendarModalProps {
  isOpen: boolean;
  isFullView?: boolean;
  onClose: () => void;
  events: RosterEvent[];
  onAddEvents: (newEvents: RosterEvent[]) => void;
  onAddTasks: (newTasks: StudyTask[]) => void;
  currentSubject: SubjectCourse;
}

export interface UserCalendarItem {
  id: string;
  date: string;
  title: string;
  time: string;
  type: 'task' | 'reminder';
  completed: boolean;
  subject?: string;
}

export interface ColourCodeItem {
  id: string;
  label: string;
  meaning: string;
  hex: string;
  lightBg: string;
  darkBg: string;
  border: string;
}

const buildColourCodeEntry = (id: string, label: string, meaning: string, hex: string): ColourCodeItem => {
  if (hex === 'transparent') {
    return { id, label, meaning, hex, lightBg: 'transparent', darkBg: 'transparent', border: '#cbd5e1' };
  }
  return {
    id,
    label,
    meaning,
    hex,
    lightBg: `${hex}33`,
    darkBg: `${hex}48`,
    border: hex,
  };
};

export const DEFAULT_COLOUR_CODES: ColourCodeItem[] = [
  {
    id: 'yellow',
    label: 'Yellow',
    meaning: 'important',
    hex: '#eab308',
    lightBg: '#fef9c3',
    darkBg: 'rgba(234, 179, 8, 0.26)',
    border: '#ca8a04',
  },
  {
    id: 'red',
    label: 'Red',
    meaning: "don't attend the session",
    hex: '#ef4444',
    lightBg: '#fee2e2',
    darkBg: 'rgba(239, 68, 68, 0.26)',
    border: '#dc2626',
  },
];

export const DATE_BADGE_COLORS = [
  { id: 'none', label: 'Clear', meaning: 'Standard date without tint', hex: 'transparent', lightBg: 'transparent', darkBg: 'transparent', border: '#cbd5e1' },
  ...DEFAULT_COLOUR_CODES,
];

export const RosterCalendarModal: React.FC<RosterCalendarModalProps> = ({
  isOpen,
  isFullView = false,
  onClose,
  events,
  onAddEvents,
  onAddTasks,
  currentSubject,
}) => {
  const [viewMode, setViewMode] = useState<'calendar' | 'table' | 'upload-pdf'>('calendar');
  const [uploadedFileName, setUploadedFileName] = useState<string>('');

  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanStatus, setScanStatus] = useState<string | null>(null);
  const [viewYear, setViewYear] = useState<number>(() => new Date().getFullYear());
  const [viewMonth, setViewMonth] = useState<number>(() => new Date().getMonth());
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const d = String(now.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  });
  const [showArchiveDrawer, setShowArchiveDrawer] = useState<boolean>(false);

  // Date Color Badges (reset once cleanly so pre-colored sample dates start blank)
  const [dateColors, setDateColors] = useState<Record<string, string>>(() => {
    try {
      if (!localStorage.getItem('medden_calendar_colors_reset_v2')) {
        localStorage.removeItem('medden_calendar_date_colors');
        localStorage.setItem('medden_calendar_colors_reset_v2', '1');
        return {};
      }
      const saved = localStorage.getItem('medden_calendar_date_colors');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch {}
    return {};
  });

  // User-added tasks & reminders per date
  const [userItems, setUserItems] = useState<UserCalendarItem[]>(() => {
    try {
      const saved = localStorage.getItem('medden_calendar_date_items');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const seedItemIds = new Set(['u-1', 'u-2']);
          const cleaned = parsed.filter((item: any) => !seedItemIds.has(item?.id));
          if (cleaned.length !== parsed.length) {
            localStorage.setItem('medden_calendar_date_items', JSON.stringify(cleaned));
          }
          return cleaned;
        }
      }
    } catch {}
    return [];
  });

  // New task/reminder form state
  const [newItemTitle, setNewItemTitle] = useState('');
  const [newItemType, setNewItemType] = useState<'task' | 'reminder'>('task');
  const [newItemTime, setNewItemTime] = useState('09:00');

  // Uploaded files & extracted tables state (synced with uploadedFilesStore)
  const rosterFileInputRef = useRef<HTMLInputElement | null>(null);
  const [recentRosterFiles, setRecentRosterFiles] = useState<UploadedDocumentRecord[]>(() =>
    getUploadedDocuments()
  );
  const [scannedTables, setScannedTables] = useState<ExtractedTableData[]>(() => {
    const docs = getUploadedDocuments();
    const firstWithTables = docs.find((d) => Array.isArray(d.extractedTables) && d.extractedTables.length > 0);
    return firstWithTables?.extractedTables || [];
  });
  const [viewingRosterFile, setViewingRosterFile] = useState<UploadedDocumentRecord | null>(null);

  useEffect(() => {
    const syncDocs = () => setRecentRosterFiles(getUploadedDocuments());
    window.addEventListener('achiev_uploaded_files_changed', syncDocs);
    window.addEventListener('achiev_recent_files_changed', syncDocs);
    window.addEventListener('storage', syncDocs);
    return () => {
      window.removeEventListener('achiev_uploaded_files_changed', syncDocs);
      window.removeEventListener('achiev_recent_files_changed', syncDocs);
      window.removeEventListener('storage', syncDocs);
    };
  }, []);

  // Track dark mode so calendar cell tints stay comfortable in both themes
  const [isDarkTheme, setIsDarkTheme] = useState<boolean>(() =>
    typeof document !== 'undefined' ? document.documentElement.classList.contains('dark') : false
  );

  useEffect(() => {
    if (typeof document === 'undefined') return;
    const checkDark = () => setIsDarkTheme(document.documentElement.classList.contains('dark'));
    checkDark();
    const obs = new MutationObserver(checkDark);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => obs.disconnect();
  }, []);

  // Compact Date Studio width toggle & Date Color multi-column toggle
  const [studioCompact, setStudioCompact] = useState<boolean>(false);
  const [showDateColorColumns, setShowDateColorColumns] = useState<boolean>(false);

  // User Extensible Colour Code List (defaults strictly to ONLY 2 colors: Yellow & Red)
  const [colourCodes, setColourCodes] = useState<ColourCodeItem[]>(() => {
    try {
      const saved = localStorage.getItem('medden_calendar_colour_codes_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return DEFAULT_COLOUR_CODES;
  });

  useEffect(() => {
    try {
      localStorage.setItem('medden_calendar_colour_codes_v1', JSON.stringify(colourCodes));
    } catch {}
  }, [colourCodes]);

  const [editingCodeId, setEditingCodeId] = useState<string | null>(null);
  const [tempLabel, setTempLabel] = useState('');
  const [tempMeaning, setTempMeaning] = useState('');
  const [tempHex, setTempHex] = useState('#d97706');
  const [isAddingColour, setIsAddingColour] = useState(false);
  const [newColourHex, setNewColourHex] = useState('#d97706');
  const [newColourLabel, setNewColourLabel] = useState('');
  const [newColourMeaning, setNewColourMeaning] = useState('');

  const handleStartEditCode = (item: ColourCodeItem) => {
    setEditingCodeId(item.id);
    setTempLabel(item.label);
    setTempMeaning(item.meaning);
    setTempHex(item.hex);
  };

  const handleSaveCode = (id: string) => {
    setColourCodes((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c;
        const rebuilt = buildColourCodeEntry(
          c.id,
          tempLabel.trim() || c.label,
          tempMeaning.trim() || c.meaning,
          tempHex || c.hex
        );
        return rebuilt;
      })
    );
    setEditingCodeId(null);
  };

  const handleAddMoreColour = (e: React.FormEvent) => {
    e.preventDefault();
    const label = newColourLabel.trim() || 'Custom';
    const meaning = newColourMeaning.trim() || 'custom schedule note';
    const entry = buildColourCodeEntry(`cc-${Date.now()}`, label, meaning, newColourHex);
    setColourCodes((prev) => [...prev, entry]);
    setNewColourLabel('');
    setNewColourMeaning('');
    setIsAddingColour(false);
  };

  const handleDeleteColour = (id: string) => {
    setColourCodes((prev) => (prev.length > 1 ? prev.filter((c) => c.id !== id) : prev));
  };

  useEffect(() => {
    localStorage.setItem('medden_calendar_date_colors', JSON.stringify(dateColors));
  }, [dateColors]);

  useEffect(() => {
    localStorage.setItem('medden_calendar_date_items', JSON.stringify(userItems));
  }, [userItems]);

  if (!isOpen) return null;

  // Universal AI Document & Roster Parsing (PDF, Word, Excel, CSV, TXT, Images)
  const runDocumentScan = async (file: File) => {
    setIsScanning(true);
    setUploadedFileName(file.name);
    setScanStatus(`Scanning "${file.name}" & detecting tables...`);

    const ext = file.name.split('.').pop()?.toLowerCase() || 'file';
    const localUrl = URL.createObjectURL(file);
    let dataUrl = '';
    try {
      dataUrl = await readFileAsDataUrl(file);
    } catch {}
    const base64Data = dataUrl.includes(',') ? dataUrl.split(',')[1] : '';

    let plainText = '';
    if (ext === 'txt' || ext === 'md' || ext === 'csv' || file.type.includes('text')) {
      try {
        plainText = await file.text();
      } catch {}
    }

    try {
      const res = await fetch('/api/gemini/scan-document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filename: file.name,
          mimeType: file.type,
          base64Data,
          extractedText: plainText,
        }),
      });

      if (!res.ok) {
        throw new Error('Document scanner request failed.');
      }

      const data = await res.json();
      const eventsList: RosterEvent[] = Array.isArray(data.events) ? data.events : [];
      const tablesList: ExtractedTableData[] = Array.isArray(data.tables) ? data.tables : [];
      const detectedText: string = String(data.extractedText || plainText || '');

      const savedDoc = addUploadedDocument({
        title: file.name.replace(/\.[^.]+$/, '') || file.name,
        fileName: file.name,
        ext,
        mimeType: file.type || 'application/octet-stream',
        sizeBytes: file.size,
        source: 'roster',
        subject: currentSubject,
        folderId: 'folder-pdfs-files',
        extractedText: detectedText,
        extractedTables: tablesList,
        parsedEventsCount: eventsList.length,
        dataUrl,
      });
      registerSessionFileUrl(savedDoc.id, localUrl);
      setRecentRosterFiles(getUploadedDocuments());

      if (tablesList.length > 0) {
        setScannedTables(tablesList);
      }

      if (eventsList.length > 0) {
        onAddEvents(eventsList);
        const tasksFromRoster: StudyTask[] = eventsList.slice(0, 3).map((ev: RosterEvent) => ({
          id: `task-from-roster-${Date.now()}-${Math.random()}`,
          title: `Attend ${ev.title} (${ev.venue || 'Schedule'})`,
          subject: (ev.subject || currentSubject) as SubjectCourse,
          dueTime: ev.startTime,
          completed: false,
          highYield: ev.type === 'exam' || ev.type === 'lecture',
          tag: (ev.type || 'LECTURE').toUpperCase(),
        }));
        onAddTasks(tasksFromRoster);
      }

      if (tablesList.length > 0 && eventsList.length > 0) {
        setScanStatus(
          `✓ Extracted ${tablesList.length} table(s) & ${eventsList.length} calendar session(s) from "${file.name}". Saved to Library & Recent Files.`
        );
      } else if (tablesList.length > 0) {
        setScanStatus(
          `✓ Extracted ${tablesList.length} table(s) from "${file.name}". Single-click any file below or open Extract Table.`
        );
      } else if (eventsList.length > 0) {
        setScanStatus(
          `✓ Extracted ${eventsList.length} calendar session(s) from "${file.name}". Saved to Library & Recent Files.`
        );
      } else {
        setScanStatus(`✓ Saved "${file.name}" to Library & Recent Files. Single-click below to open it.`);
      }
    } catch (err: any) {
      console.error(err);
      const fallbackDoc = addUploadedDocument({
        title: file.name.replace(/\.[^.]+$/, '') || file.name,
        fileName: file.name,
        ext,
        mimeType: file.type || 'application/octet-stream',
        sizeBytes: file.size,
        source: 'roster',
        subject: currentSubject,
        folderId: 'folder-pdfs-files',
        extractedText: plainText,
        dataUrl,
      });
      registerSessionFileUrl(fallbackDoc.id, localUrl);
      setRecentRosterFiles(getUploadedDocuments());
      setScanStatus(`Saved "${file.name}" to Recent Files. Single-click below to open it.`);
    } finally {
      setIsScanning(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      e.target.value = '';
      void runDocumentScan(file);
    }
  };

  const handleOpenRecentRosterFile = (doc: UploadedDocumentRecord) => {
    touchUploadedDocument(doc.id);
    setRecentRosterFiles(getUploadedDocuments());
    if (doc.extractedTables && doc.extractedTables.length > 0) {
      setScannedTables(doc.extractedTables);
    }
    setViewingRosterFile(doc);
  };

  // Color picker handler
  const handleSetDateColor = (hex: string) => {
    setDateColors((prev) => {
      const next = { ...prev };
      if (hex === 'transparent') {
        delete next[selectedDate];
      } else {
        next[selectedDate] = hex;
      }
      return next;
    });
  };

  // Add Task or Reminder to Date
  const handleAddItemToDate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemTitle.trim()) return;

    const item: UserCalendarItem = {
      id: `cal-item-${Date.now()}`,
      date: selectedDate,
      title: newItemTitle.trim(),
      time: newItemTime || '09:00',
      type: newItemType,
      completed: false,
      subject: currentSubject,
    };

    setUserItems((prev) => [item, ...prev]);

    // Also sync to global study tasks
    const newTask: StudyTask = {
      id: item.id,
      title: item.title,
      subject: currentSubject,
      dueTime: item.time,
      completed: false,
      highYield: item.type === 'task',
      tag: item.type === 'reminder' ? 'REMINDER' : 'TASK',
    };
    onAddTasks([newTask]);

    setNewItemTitle('');
  };

  const handleToggleItemDone = (id: string) => {
    setUserItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, completed: !it.completed } : it))
    );
  };

  const handleDeleteItem = (id: string) => {
    setUserItems((prev) => prev.filter((it) => it.id !== id));
  };

  // Unlimited dynamic calendar computation for any past/future month & year
  const daysInViewedMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstWeekdayOffset = new Date(viewYear, viewMonth, 1).getDay();
  const monthDays = Array.from({ length: daysInViewedMonth }, (_, i) => i + 1);
  const monthPrefix = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}`;
  const viewedMonthHeading = new Date(viewYear, viewMonth, 1).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  const navigateMonth = (delta: number) => {
    const nextDate = new Date(viewYear, viewMonth + delta, 1);
    const ny = nextDate.getFullYear();
    const nm = nextDate.getMonth();
    setViewYear(ny);
    setViewMonth(nm);
    setSelectedDate(`${ny}-${String(nm + 1).padStart(2, '0')}-01`);
  };

  const jumpToMonthYear = (y: number, m: number) => {
    setViewYear(y);
    setViewMonth(m);
    setSelectedDate(`${y}-${String(m + 1).padStart(2, '0')}-01`);
    setViewMode('calendar');
    setShowArchiveDrawer(false);
  };

  const jumpToToday = () => {
    const now = new Date();
    const y = now.getFullYear();
    const m = now.getMonth();
    const d = String(now.getDate()).padStart(2, '0');
    setViewYear(y);
    setViewMonth(m);
    setSelectedDate(`${y}-${String(m + 1).padStart(2, '0')}-${d}`);
    setViewMode('calendar');
    setShowArchiveDrawer(false);
  };

  // Build list of past/archived & active months (last 18 months + any month with saved items/events/tints)
  const archiveMonthsList = (() => {
    const map = new Map<string, { year: number; month: number; count: number }>();
    const now = new Date();
    for (let i = 0; i < 18; i++) {
      const dt = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}`;
      map.set(key, { year: dt.getFullYear(), month: dt.getMonth(), count: 0 });
    }
    const tally = (dateStr?: string) => {
      if (!dateStr || dateStr.length < 7) return;
      const [yStr, mStr] = dateStr.split('-');
      const y = Number(yStr);
      const m = Number(mStr) - 1;
      if (!Number.isFinite(y) || !Number.isFinite(m) || m < 0 || m > 11) return;
      const key = `${y}-${String(m + 1).padStart(2, '0')}`;
      const prev = map.get(key) || { year: y, month: m, count: 0 };
      map.set(key, { year: y, month: m, count: prev.count + 1 });
    };
    events.forEach((ev) => tally(ev.date));
    userItems.forEach((it) => tally(it.date));
    Object.keys(dateColors).forEach((d) => tally(d));
    return Array.from(map.entries())
      .sort((a, b) => b[0].localeCompare(a[0]))
      .map(([key, val]) => ({
        key,
        ...val,
        label: new Date(val.year, val.month, 1).toLocaleDateString('en-US', {
          month: 'short',
          year: 'numeric',
        }),
      }));
  })();

  // Selected date formatted
  const formatSelectedDateHeader = (dateStr: string) => {
    try {
      const [y, m, d] = dateStr.split('-').map(Number);
      const dateObj = new Date(y, m - 1, d);
      return dateObj.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  const selectedDateEvents = events.filter((e) => e.date === selectedDate);
  const selectedDateUserItems = userItems.filter((i) => i.date === selectedDate);
  const currentColor = dateColors[selectedDate] || 'transparent';

  const mainCard = (
    <div
      className={`themed-workspace-surface bg-[#fcfbf8] dark:bg-[#140e0a] border border-stone-200/80 dark:border-[#382518] rounded-3xl shadow-xl w-full flex flex-col overflow-hidden relative transition-colors ${
        isFullView ? 'h-full flex-1' : 'max-w-5xl h-[90vh]'
      }`}
    >
      {/* Sleek Top Bar (No duplicate "My Space" button, no long banners, only right-end action buttons) */}
      <header className="themed-glass-bar bg-stone-50/90 dark:bg-[#18110c]/95 backdrop-blur-md px-5 sm:px-6 py-3 border-b border-stone-200/80 dark:border-[#382518] flex items-center justify-between z-10">
        {/* Left: Clickable Archive Icon + Month Heading with Prev/Next Unlimited Month Arrows */}
        <div className="flex items-center gap-2 relative">
          <button
            type="button"
            onClick={() => setShowArchiveDrawer((v) => !v)}
            className={`p-1.5 rounded-xl shrink-0 border transition-colors cursor-pointer ${
              showArchiveDrawer
                ? 'bg-[#A47C43] text-white border-[#A47C43]'
                : 'bg-[#A47C43]/15 hover:bg-[#A47C43]/25 text-[#A47C43] dark:text-[#c49a62] border-[#A47C43]/25'
            }`}
            title="Past & upcoming monthly calendars archive"
            aria-label="Open past calendars archive"
          >
            <CalendarIcon className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => setViewMode('calendar')}
            className="font-serif text-lg sm:text-xl font-bold text-stone-900 dark:text-stone-100 hover:text-[#A47C43] transition-colors cursor-pointer text-left min-w-[138px]"
            title="Return to calendar grid"
          >
            {viewedMonthHeading}
          </button>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => navigateMonth(-1)}
              className="p-1 rounded-lg bg-stone-200/70 hover:bg-stone-300/80 dark:bg-[#251a12] dark:hover:bg-[#352519] text-stone-700 dark:text-stone-200 transition-colors cursor-pointer"
              title="Previous month"
              aria-label="Previous month"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => navigateMonth(1)}
              className="p-1 rounded-lg bg-stone-200/70 hover:bg-stone-300/80 dark:bg-[#251a12] dark:hover:bg-[#352519] text-stone-700 dark:text-stone-200 transition-colors cursor-pointer"
              title="Next month"
              aria-label="Next month"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={jumpToToday}
              className="themed-soft-pill ml-1 px-2 py-0.5 rounded-lg text-[10px] font-mono font-semibold bg-[#A47C43]/15 hover:bg-[#A47C43]/25 text-[#735222] dark:text-[#d4aa6e] border border-[#A47C43]/30 transition-colors cursor-pointer"
              title="Jump to current month"
            >
              Today
            </button>
          </div>

          {/* Archive / Past Calendars Popover */}
          {showArchiveDrawer && (
            <div className="absolute top-full left-0 mt-2 w-72 sm:w-80 rounded-2xl bg-white dark:bg-[#1a120d] border border-stone-200 dark:border-[#3d291c] shadow-2xl p-3.5 z-50 space-y-3">
              <div className="flex items-center justify-between border-b border-stone-200/80 dark:border-[#352317] pb-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-stone-800 dark:text-stone-100">
                  <History className="w-3.5 h-3.5 text-[#A47C43]" />
                  <span>Past &amp; Upcoming Calendars</span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowArchiveDrawer(false)}
                  className="text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Quick Year Jump */}
              <div className="flex items-center justify-between px-2 py-1.5 rounded-xl bg-stone-100 dark:bg-[#120c08] border border-stone-200 dark:border-[#352317] text-xs">
                <button
                  type="button"
                  onClick={() => setViewYear((y) => y - 1)}
                  className="p-1 rounded hover:bg-stone-200 dark:hover:bg-[#251a12] cursor-pointer"
                  title="Previous year"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <span className="font-mono font-bold text-stone-800 dark:text-stone-200">{viewYear}</span>
                <button
                  type="button"
                  onClick={() => setViewYear((y) => y + 1)}
                  className="p-1 rounded hover:bg-stone-200 dark:hover:bg-[#251a12] cursor-pointer"
                  title="Next year"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* 12 Months Quick Grid for Selected Year */}
              <div className="grid grid-cols-4 gap-1.5">
                {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((mName, mIdx) => {
                  const active = viewMonth === mIdx;
                  return (
                    <button
                      key={mName}
                      type="button"
                      onClick={() => jumpToMonthYear(viewYear, mIdx)}
                      className={`py-1 rounded-lg text-[11px] font-mono transition-colors cursor-pointer ${
                        active
                          ? 'bg-[#A47C43] text-white font-bold'
                          : 'bg-stone-100/80 dark:bg-[#221710] hover:bg-[#A47C43]/20 text-stone-700 dark:text-stone-300'
                      }`}
                    >
                      {mName}
                    </button>
                  );
                })}
              </div>

              {/* Saved / Past Months History List */}
              <div>
                <div className="text-[10px] font-mono uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-1.5">
                  Recent &amp; Saved Monthly Archives
                </div>
                <div className="max-h-40 overflow-y-auto custom-scrollbar space-y-1 pr-1">
                  {archiveMonthsList.map((item) => {
                    const isViewing = item.year === viewYear && item.month === viewMonth;
                    return (
                      <button
                        key={item.key}
                        type="button"
                        onClick={() => jumpToMonthYear(item.year, item.month)}
                        className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                          isViewing
                            ? 'bg-[#A47C43]/20 text-[#735222] dark:text-[#e5ce95] font-bold border border-[#A47C43]/40'
                            : 'hover:bg-stone-100 dark:hover:bg-[#251a12] text-stone-700 dark:text-stone-300'
                        }`}
                      >
                        <span className="font-serif">{item.label}</span>
                        {item.count > 0 && (
                          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-amber-500/15 text-[#735222] dark:text-amber-300">
                            {item.count} saved
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right End: ONLY Extract Table and Roster File AI Scan buttons */}
        <div className="flex items-center gap-2">
          {/* Extract Table Button */}
          <button
            type="button"
            onClick={() => setViewMode(viewMode === 'table' ? 'calendar' : 'table')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer border ${
              viewMode === 'table'
                ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 border-transparent shadow-xs'
                : 'bg-white dark:bg-[#1a120d] text-stone-700 dark:text-stone-300 border-stone-200/90 dark:border-[#382518] hover:bg-stone-100 dark:hover:bg-[#251a12]'
            }`}
            title="View extracted tabular schedule"
          >
            <FileText className="w-3.5 h-3.5 text-[#A47C43]" />
            <span>Extract Table</span>
            <span className="text-[10px] font-mono px-1 py-0.2 rounded bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
              {events.length}
            </span>
          </button>

          {/* Roster File AI Scan Button (switches to scanner view OR opens file picker when already in scanner view with uploaded files) */}
          <input
            ref={rosterFileInputRef}
            type="file"
            accept=".pdf,.doc,.docx,.xls,.xlsx,.csv,.txt,.md,.png,.jpg,.jpeg,.webp"
            onChange={handleFileUpload}
            disabled={isScanning}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => {
              if (viewMode === 'upload-pdf' && recentRosterFiles.length > 0) {
                rosterFileInputRef.current?.click();
              } else {
                setViewMode(viewMode === 'upload-pdf' ? 'calendar' : 'upload-pdf');
              }
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer border ${
              viewMode === 'upload-pdf'
                ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 border-transparent shadow-xs'
                : 'themed-soft-pill bg-[#A47C43]/15 hover:bg-[#A47C43]/25 text-[#735222] dark:text-[#d4aa6e] border-[#A47C43]/30'
            }`}
            title={
              viewMode === 'upload-pdf' && recentRosterFiles.length > 0
                ? 'Click to scan another document (PDF, Word, Excel, CSV, Image)'
                : 'Scan roster or table document with AI'
            }
          >
            {isScanning ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-500" />
            ) : (
              <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            )}
            <span>{isScanning ? 'Scanning...' : 'Roster File AI Scan'}</span>
          </button>

          {!isFullView && (
            <button
              onClick={onClose}
              className="p-1.5 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 rounded-lg hover:bg-stone-100 dark:hover:bg-[#251a12] ml-1 cursor-pointer"
              title="Close calendar"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </header>

      {/* Body Viewport */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 custom-scrollbar">
        {/* VIEW 1: Interactive Calendar & Date Task/Reminder Studio */}
        {viewMode === 'calendar' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 h-full">
            {/* Left Column: Month Calendar Grid */}
            <div className={`${studioCompact ? 'lg:col-span-9 xl:col-span-10' : 'lg:col-span-8 xl:col-span-9'} flex flex-col justify-between transition-all`}>
              <div>
                <div className="grid grid-cols-7 gap-1.5 mb-2">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
                    <div
                      key={d}
                      className="text-center font-bold text-[11px] text-stone-400 py-1 font-mono uppercase tracking-wider"
                    >
                      {d}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-1.5">
                  {Array.from({ length: firstWeekdayOffset }).map((_, emptyIdx) => (
                    <div
                      key={`empty-${emptyIdx}`}
                      className="h-[82px] sm:h-[90px] rounded-2xl border border-transparent bg-stone-100/25 dark:bg-[#110c09]/25 pointer-events-none"
                    />
                  ))}
                  {monthDays.map((dayNum) => {
                    const dateStr = `${monthPrefix}-${dayNum < 10 ? `0${dayNum}` : dayNum}`;
                    const dayEvents = events.filter((e) => e.date === dateStr);
                    const dayUserItems = userItems.filter((i) => i.date === dateStr);
                    const isSelected = selectedDate === dateStr;
                    const badgeColor = dateColors[dateStr];
                    const badgeColorObj =
                      colourCodes.find((c) => c.hex.toLowerCase() === (badgeColor || '').toLowerCase() || c.id === badgeColor) ||
                      (badgeColor && badgeColor !== 'transparent'
                        ? buildColourCodeEntry('custom', 'Custom', 'Tagged', badgeColor)
                        : undefined);

                    return (
                      <div
                        key={dayNum}
                        onClick={() => setSelectedDate(dateStr)}
                        className={`h-[82px] sm:h-[90px] p-2 rounded-2xl border transition-all cursor-pointer flex flex-col relative group overflow-hidden ${
                          isSelected
                            ? 'border-[#A47C43] ring-2 ring-[#A47C43]/50 shadow-xs'
                            : badgeColorObj && badgeColorObj.id !== 'none'
                            ? 'shadow-2xs'
                            : dayEvents.length > 0 || dayUserItems.length > 0
                            ? 'themed-glass-card border-stone-300 dark:border-[#4b3322] bg-white dark:bg-[#1a120d]'
                            : 'themed-glass-card border-stone-200/70 dark:border-[#352317] bg-stone-50/50 dark:bg-[#110c09]/60 text-stone-400'
                        }`}
                        style={
                          badgeColorObj && badgeColorObj.id !== 'none'
                            ? {
                                backgroundColor: isDarkTheme ? badgeColorObj.darkBg : badgeColorObj.lightBg,
                                borderColor: isSelected ? '#A47C43' : badgeColorObj.border,
                                borderWidth: '1.5px',
                              }
                            : undefined
                        }
                      >
                        {/* Day Number (No dots or badge pill) */}
                        <div className="flex items-center justify-between shrink-0">
                          <span
                            className={`text-xs font-bold font-mono px-1.5 py-0.5 rounded-md ${
                              isSelected
                                ? 'themed-accent-btn bg-[#A47C43] text-white'
                                : 'text-stone-700 dark:text-stone-300'
                            }`}
                          >
                            {dayNum}
                          </span>
                        </div>

                        {/* Scrollable Events / Tasks Container inside date */}
                        <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar pr-0.5 space-y-0.5 mt-1">
                          {dayEvents.map((ev) => (
                            <div
                              key={ev.id}
                              className={`text-[9px] px-1 py-0.5 rounded font-medium leading-snug break-words ${
                                ev.type === 'lecture'
                                  ? 'bg-amber-700/15 text-[#5c3c14] dark:bg-amber-500/20 dark:text-amber-300'
                                  : ev.type === 'practical'
                                  ? 'bg-[#A47C43]/15 text-[#6e4e1a] dark:text-[#d4aa6e]'
                                  : 'bg-[#7f1d1d]/12 text-[#6e1418] dark:bg-[#6e171b]/30 dark:text-[#d97074]'
                              }`}
                            >
                              {ev.title}
                            </div>
                          ))}
                          {dayUserItems.map((it) => (
                            <div
                              key={it.id}
                              className={`text-[8.5px] px-1 py-0.5 rounded font-mono leading-snug break-words ${
                                it.completed
                                  ? 'line-through opacity-50 bg-stone-100 text-stone-500 dark:bg-stone-800'
                                  : 'bg-[#A47C43]/15 text-[#6e4e1a] dark:text-[#e5ce95]'
                              }`}
                            >
                              {it.type === 'reminder' ? '🔔' : '✓'} {it.title}
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Colour Code Bar (2 default colors, translucent meaning, Add more colors + side scrollbar) */}
              <div className="mt-3 pt-2.5 border-t border-stone-200/80 dark:border-[#382518]">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="text-[11px] font-bold text-stone-800 dark:text-stone-200">
                    Colour Code
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsAddingColour((v) => !v)}
                    className="px-2.5 py-1 rounded-lg bg-[#A47C43]/15 hover:bg-[#A47C43]/25 text-[#735222] dark:text-[#d4aa6e] border border-[#A47C43]/30 text-[10.5px] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add more colors</span>
                  </button>
                </div>

                {isAddingColour && (
                  <form
                    onSubmit={handleAddMoreColour}
                    className="mb-2.5 p-2.5 rounded-xl border border-[#A47C43]/40 bg-white dark:bg-[#1a120d] space-y-2 text-xs"
                  >
                    <div className="flex items-start gap-2.5 flex-wrap">
                      <div className="p-2 rounded-xl bg-stone-100/90 dark:bg-[#120c08] border border-stone-200 dark:border-[#382518]">
                        <RoundColorColumnsPicker
                          columns={UNIFIED_COLOR_COLUMNS}
                          selectedColor={newColourHex}
                          onSelectColor={(hex) => {
                            setNewColourHex(hex);
                            if (!newColourLabel.trim()) setNewColourLabel('Custom');
                          }}
                          swatchSizeClass="w-4 h-4"
                        />
                      </div>

                      <div className="flex-1 min-w-[180px] flex flex-wrap items-center gap-2 pt-1">
                        <input
                          type="text"
                          value={newColourLabel}
                          onChange={(e) => setNewColourLabel(e.target.value)}
                          placeholder="Color name (e.g. Blue)"
                          className="w-32 px-2 py-1 rounded-lg border border-stone-300 dark:border-[#382518] bg-stone-50 dark:bg-[#120c08] text-[11px] text-stone-900 dark:text-stone-100 outline-none focus:border-[#A47C43]"
                        />
                        <input
                          type="text"
                          value={newColourMeaning}
                          onChange={(e) => setNewColourMeaning(e.target.value)}
                          placeholder="Meaning (e.g. lecture day)"
                          className="flex-1 min-w-[130px] px-2 py-1 rounded-lg border border-stone-300 dark:border-[#382518] bg-stone-50 dark:bg-[#120c08] text-[11px] text-stone-900 dark:text-stone-100 outline-none focus:border-[#A47C43]"
                        />
                        <button
                          type="submit"
                          className="px-2.5 py-1 rounded-lg bg-[#A47C43] hover:bg-[#8e6834] text-white text-[10.5px] font-bold cursor-pointer"
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsAddingColour(false)}
                          className="px-2 py-1 rounded-lg bg-stone-200 dark:bg-[#251a12] text-stone-700 dark:text-stone-300 text-[10.5px] cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </form>
                )}

                <div className="max-h-32 overflow-y-auto custom-scrollbar pr-1.5 space-y-1.5">
                  {colourCodes.map((col) => {
                    const isEditing = editingCodeId === col.id;
                    return (
                      <div
                        key={col.id}
                        className={`flex items-center gap-2 p-1.5 px-2.5 rounded-xl border transition-all group ${
                          isEditing
                            ? 'border-amber-500 bg-amber-500/10 flex-wrap'
                            : 'border-stone-200/70 dark:border-[#352317] bg-white/70 dark:bg-[#1a120d] hover:border-[#A47C43]/60 shadow-2xs'
                        }`}
                      >
                        <button
                          type="button"
                          data-swatch=""
                          className="w-4 h-4 rounded-full shrink-0 border border-black/15 shadow-2xs cursor-pointer"
                          style={{ backgroundColor: isEditing ? tempHex : col.hex }}
                          onClick={() => handleSetDateColor(col.hex)}
                          title={`Apply colour to ${selectedDate}`}
                        />

                        {isEditing ? (
                          <div className="flex flex-col gap-2 flex-1 min-w-[200px]">
                            <div className="flex items-center gap-1.5">
                              <input
                                type="text"
                                value={tempLabel}
                                onChange={(e) => setTempLabel(e.target.value)}
                                placeholder="Color name"
                                className="w-24 text-[10.5px] font-semibold px-1.5 py-0.5 rounded bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-stone-100"
                              />
                              <span className="text-stone-400">-</span>
                              <input
                                type="text"
                                value={tempMeaning}
                                onChange={(e) => setTempMeaning(e.target.value)}
                                placeholder="Meaning"
                                className="flex-1 text-[10.5px] px-1.5 py-0.5 rounded bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-200"
                              />
                              <button
                                type="button"
                                onClick={() => handleSaveCode(col.id)}
                                className="px-2 py-0.5 text-[10px] bg-amber-600 text-white rounded font-bold cursor-pointer"
                              >
                                ✓
                              </button>
                            </div>
                            <div className="p-1.5 rounded-lg bg-stone-50 dark:bg-[#120c08] border border-stone-200 dark:border-[#352317]">
                              <RoundColorColumnsPicker
                                columns={UNIFIED_COLOR_COLUMNS}
                                selectedColor={tempHex}
                                onSelectColor={(hex) => setTempHex(hex)}
                                swatchSizeClass="w-3.5 h-3.5"
                              />
                            </div>
                          </div>
                        ) : (
                          <div
                            className="flex-1 min-w-0 flex items-center gap-1.5 truncate cursor-pointer"
                            onClick={() => handleStartEditCode(col)}
                            title="Click to edit colour name, swatch or note"
                          >
                            <span className="text-[11px] font-semibold text-stone-800 dark:text-stone-200 shrink-0">
                              {col.label}
                            </span>
                            <span className="text-stone-400/70 shrink-0">-</span>
                            <span className="text-[11px] text-stone-600/55 dark:text-stone-300/45 italic truncate">
                              {col.meaning}
                            </span>
                          </div>
                        )}

                        <button
                          type="button"
                          onClick={() => handleSetDateColor(col.hex)}
                          className="p-1 rounded-md text-[#735222] dark:text-[#d4aa6e] hover:bg-[#A47C43]/15 cursor-pointer shrink-0 transition-colors"
                          title={`Fill ${selectedDate} with ${col.label}`}
                          aria-label={`Apply ${col.label} colour`}
                        >
                          <Palette className="w-3 h-3" />
                        </button>
                        {colourCodes.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleDeleteColour(col.id)}
                            className="text-stone-400 hover:text-[#7f1d1d] dark:hover:text-[#d97074] p-0.5 opacity-60 hover:opacity-100 transition-opacity cursor-pointer shrink-0"
                            title="Remove colour code"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Column: Selected Date Details (Add Task, Reminder, Date Color) */}
            <div className={`${studioCompact ? 'lg:col-span-3 xl:col-span-2 p-2.5 sm:p-3' : 'lg:col-span-4 xl:col-span-3 p-3.5 sm:p-4'} themed-glass-card bg-white/90 dark:bg-[#18110c]/95 border border-stone-200/90 dark:border-[#382518] rounded-3xl flex flex-col justify-between shadow-xs relative group transition-all`}>
              {/* Corner Size Adjusting Tool / Handle */}
              <div className="absolute top-3 right-3 flex items-center gap-1 text-stone-400">
                <button
                  type="button"
                  onClick={() => setStudioCompact((v) => !v)}
                  title={studioCompact ? 'Expand panel width' : 'Compact panel width'}
                  className="p-1 rounded-lg bg-stone-100 hover:bg-stone-200 dark:bg-[#231912] dark:hover:bg-[#2f2218] text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 transition-colors cursor-pointer"
                >
                  <Sliders className="w-3.5 h-3.5 text-amber-600" />
                </button>
              </div>

              <div className="space-y-3.5">
                {/* Date Header & Color Swatches */}
                <div className="pb-2.5 border-b border-stone-100 dark:border-[#352317]">
                  <h3 className="font-serif text-base font-bold text-stone-900 dark:text-stone-100 pr-8">
                    {formatSelectedDateHeader(selectedDate)}
                  </h3>

                  {/* Full Date Cell Fill synced with Choose Colour Round Columns */}
                  <div className="mt-3 space-y-2">
                    <label className="text-[11px] font-semibold text-stone-500 dark:text-stone-400 flex items-center gap-1.5">
                      <Palette className="w-3 h-3 text-[#A47C43]" />
                      <span>Date Color:</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowDateColorColumns((v) => !v)}
                      aria-pressed={showDateColorColumns}
                      title="Choose colour for this date"
                      className={`w-full py-2 px-4 rounded-xl text-xs font-bold border flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs ${
                        showDateColorColumns
                          ? 'bg-[#A47C43] text-white border-[#A47C43] shadow-sm'
                          : 'bg-stone-100 dark:bg-[#231912] text-stone-800 dark:text-stone-100 border-stone-200 dark:border-[#382518] hover:border-[#A47C43]'
                      }`}
                    >
                      <Palette className="w-3.5 h-3.5" />
                      <span>Choose Colour</span>
                    </button>
                    {showDateColorColumns && (
                      <div className="mt-2.5 p-2.5 rounded-xl bg-stone-50/90 dark:bg-[#110c09]/90 border border-stone-200 dark:border-[#352317]">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                            Choose Colour
                          </span>
                          <button
                            type="button"
                            onClick={() => handleSetDateColor('transparent')}
                            className="text-[10px] font-semibold text-stone-600 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100 cursor-pointer"
                          >
                            Clear
                          </button>
                        </div>
                        <RoundColorColumnsPicker
                          columns={UNIFIED_COLOR_COLUMNS}
                          selectedColor={currentColor}
                          onSelectColor={(hex) => handleSetDateColor(hex)}
                          showStandardRow
                          swatchSizeClass="w-4 h-4"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* + Add Task or Reminder Form */}
                <form onSubmit={handleAddItemToDate} className="space-y-2.5">
                  <div className="flex items-center gap-1.5 bg-stone-100 dark:bg-[#110c09] p-1 rounded-xl border border-stone-200 dark:border-[#352317]">
                    <button
                      type="button"
                      onClick={() => setNewItemType('task')}
                      className={`flex-1 py-1 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-colors cursor-pointer ${
                        newItemType === 'task'
                          ? 'bg-white dark:bg-[#231912] text-stone-900 dark:text-stone-100 shadow-2xs'
                          : 'text-stone-500 hover:text-stone-800'
                      }`}
                    >
                      <CheckSquare className="w-3.5 h-3.5 text-[#A47C43]" />
                      <span>Task</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setNewItemType('reminder')}
                      className={`flex-1 py-1 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-colors cursor-pointer ${
                        newItemType === 'reminder'
                          ? 'bg-white dark:bg-[#231912] text-stone-900 dark:text-stone-100 shadow-2xs'
                          : 'text-stone-500 hover:text-stone-800'
                      }`}
                    >
                      <Bell className="w-3.5 h-3.5 text-amber-500" />
                      <span>Reminder</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-1.5 min-w-0">
                    <input
                      type="text"
                      value={newItemTitle}
                      onChange={(e) => setNewItemTitle(e.target.value)}
                      placeholder={`Add ${newItemType} for this date…`}
                      className="flex-1 min-w-0 px-2.5 py-1.5 rounded-xl border border-stone-200 dark:border-[#382518] bg-stone-50 dark:bg-[#120c08] text-xs outline-none focus:border-[#A47C43] text-stone-900 dark:text-stone-100"
                    />
                    <input
                      type="time"
                      value={newItemTime}
                      onChange={(e) => setNewItemTime(e.target.value)}
                      className="w-[74px] shrink-0 px-1.5 py-1.5 rounded-xl border border-stone-200 dark:border-[#382518] bg-stone-50 dark:bg-[#120c08] text-[11px] font-mono outline-none focus:border-[#A47C43] text-stone-800 dark:text-stone-200"
                    />
                    <button
                      type="submit"
                      aria-label={`Add ${newItemType}`}
                      style={{ color: '#ffffff' }}
                      className="themed-accent-btn shrink-0 w-9 h-8 rounded-xl bg-[#8f5f2c] hover:bg-[#734a1f] text-white text-xs font-bold transition-colors cursor-pointer flex items-center justify-center shadow-xs"
                      title={`Add ${newItemType}`}
                    >
                      <Plus className="w-4 h-4 shrink-0 stroke-[2.75]" style={{ color: '#ffffff' }} />
                    </button>
                  </div>
                </form>

                {/* Items List for Selected Date */}
                <div className="space-y-2 max-h-[220px] overflow-y-auto custom-scrollbar pr-1">
                  {selectedDateUserItems.map((it) => (
                    <div
                      key={it.id}
                      className={`p-2.5 rounded-xl border transition-all flex items-center justify-between gap-2 text-xs ${
                        it.completed
                          ? 'bg-stone-50 dark:bg-[#110c09] border-stone-200 dark:border-[#352317] opacity-60'
                          : 'bg-white dark:bg-[#211711] border-stone-200 dark:border-[#3d291c]'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <button
                          type="button"
                          onClick={() => handleToggleItemDone(it.id)}
                          className={`w-4 h-4 rounded-md border flex items-center justify-center cursor-pointer transition-colors ${
                            it.completed
                              ? 'bg-[#A47C43] border-[#A47C43] text-white'
                              : 'border-stone-300 dark:border-stone-600 hover:border-[#A47C43]'
                          }`}
                        >
                          {it.completed && <Check className="w-3 h-3 stroke-[3]" />}
                        </button>
                        <div className="min-w-0">
                          <p
                            className={`font-medium truncate ${
                              it.completed ? 'line-through text-stone-400' : 'text-stone-800 dark:text-stone-200'
                            }`}
                          >
                            {it.title}
                          </p>
                          <span className="text-[10px] font-mono text-stone-400 flex items-center gap-1">
                            <Clock className="w-2.5 h-2.5" />
                            {it.time} · {it.type.toUpperCase()}
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleDeleteItem(it.id)}
                        className="text-[#7f1d1d]/80 hover:text-[#6e1418] dark:text-[#b0363b] dark:hover:text-[#d97074] p-1 transition-colors cursor-pointer"
                        title="Delete item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}

                  {/* Scheduled Faculty Events */}
                  {selectedDateEvents.map((ev) => (
                    <div
                      key={ev.id}
                      className="p-2.5 bg-stone-50 dark:bg-[#140e0a] rounded-xl border border-stone-200/80 dark:border-[#352317] text-xs flex items-center justify-between"
                    >
                      <div className="min-w-0">
                        <span className="font-semibold text-stone-900 dark:text-stone-100 truncate block">
                          {ev.title}
                        </span>
                        <div className="flex items-center gap-2 text-[10px] text-stone-500 mt-0.5 font-mono">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-[#A47C43]" />
                            {ev.startTime}-{ev.endTime}
                          </span>
                          <span>·</span>
                          <span className="truncate">{ev.venue}</span>
                        </div>
                      </div>
                      <span className="text-[9px] uppercase px-1.5 py-0.5 rounded font-mono font-bold bg-[#A47C43]/15 text-[#735222] dark:text-[#d4aa6e]">
                        {ev.type}
                      </span>
                    </div>
                  ))}

                  {selectedDateUserItems.length === 0 && selectedDateEvents.length === 0 && (
                    <div className="text-center py-6 text-stone-400 text-xs italic">
                      No tasks or sessions on this date. Add one above!
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: Extracted Table */}
        {viewMode === 'table' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-stone-800 dark:text-stone-200 font-serif">
                  Extracted Academic Schedule Table
                </h3>
                <p className="text-xs text-stone-500">
                  Total {events.length} {events.length === 1 ? 'session' : 'sessions'} {uploadedFileName ? `parsed from "${uploadedFileName}"` : 'currently scheduled'}.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setViewMode('upload-pdf')}
                className="px-3 py-1.5 rounded-xl bg-stone-900 hover:bg-black dark:bg-stone-100 dark:hover:bg-white text-white dark:text-stone-900 text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300 dark:text-amber-600" />
                <span>Scan New Roster</span>
              </button>
            </div>

            <div className="overflow-x-auto border border-stone-200 dark:border-[#382518] rounded-2xl shadow-xs">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-stone-100 dark:bg-[#1a120d] text-stone-700 dark:text-stone-300 font-semibold border-b border-stone-200 dark:border-[#382518]">
                  <tr>
                    <th className="p-3">Session Title</th>
                    <th className="p-3">Subject</th>
                    <th className="p-3">Type</th>
                    <th className="p-3">Date & Time</th>
                    <th className="p-3">Venue</th>
                    <th className="p-3">Instructor / Notes</th>
                  </tr>
                </thead>
              <tbody className="divide-y divide-stone-200 dark:divide-[#352317] text-stone-800 dark:text-stone-200">
                  {events.map((ev) => (
                    <tr key={ev.id} className="hover:bg-stone-50 dark:hover:bg-[#211711]">
                      <td className="p-3 font-medium">{ev.title}</td>
                      <td className="p-3 text-stone-500">{ev.subject}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
                          {ev.type}
                        </span>
                      </td>
                      <td className="p-3 font-mono text-stone-600 dark:text-stone-300 whitespace-nowrap">
                        {ev.date} · {ev.startTime}-{ev.endTime}
                      </td>
                      <td className="p-3 text-stone-600 dark:text-stone-400">{ev.venue}</td>
                      <td className="p-3 text-stone-500 text-[11px]">{ev.instructor || ev.notes || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {scannedTables.length > 0 && (
              <div className="space-y-4 pt-2">
                <div className="flex items-center gap-2">
                  <Table2 className="w-4 h-4 text-[#A47C43]" />
                  <h4 className="text-sm font-serif font-bold text-stone-800 dark:text-stone-200">
                    Scanned Document Tables ({scannedTables.length})
                  </h4>
                </div>
                {scannedTables.map((tbl) => (
                  <div
                    key={tbl.id}
                    className="overflow-x-auto border border-stone-200 dark:border-[#382518] rounded-2xl shadow-xs"
                  >
                    <div className="px-4 py-2 bg-stone-100 dark:bg-[#221811] border-b border-stone-200 dark:border-[#382518] text-xs font-bold text-stone-800 dark:text-stone-200">
                      {tbl.title}
                    </div>
                    <table className="w-full text-left text-xs border-collapse">
                      <thead className="bg-stone-50 dark:bg-[#1a120d] text-stone-700 dark:text-stone-300 font-semibold border-b border-stone-200 dark:border-[#382518]">
                        <tr>
                          {tbl.headers.map((h, hIdx) => (
                            <th key={hIdx} className="p-2.5 whitespace-nowrap">
                              {h || `Column ${hIdx + 1}`}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-200 dark:divide-[#352317] text-stone-800 dark:text-stone-200">
                        {tbl.rows.map((row, rIdx) => (
                          <tr key={rIdx} className="hover:bg-stone-50 dark:hover:bg-[#211711]">
                            {tbl.headers.map((_, cIdx) => (
                              <td key={cIdx} className="p-2.5">
                                {row[cIdx] || '—'}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* VIEW 3: Document Scanner & Recent Scanned Files (Hides big upload card once a file is uploaded, leaving only the top ribbon's Roster File AI Scan button + Recent Files below) */}
        {viewMode === 'upload-pdf' && (
          <div className="space-y-5">
            {recentRosterFiles.length === 0 && !uploadedFileName && (
              <div className="p-8 border-2 border-dashed border-stone-300 dark:border-[#382518] rounded-2xl text-center bg-stone-50 dark:bg-[#120c08]">
                <Upload className="w-8 h-8 mx-auto text-[#A47C43] mb-2.5" />
                <h4 className="text-base font-bold text-stone-800 dark:text-stone-200 font-serif mb-1">
                  Upload Roster, Timetable, Excel, Word or PDF
                </h4>
                <p className="text-xs text-stone-500 mb-4">
                  Automatically detects schedules &amp; tables across PDF, Word (.docx), Excel (.xlsx/.xls), CSV, TXT, and images.
                </p>

                <button
                  type="button"
                  onClick={() => rosterFileInputRef.current?.click()}
                  disabled={isScanning}
                  className="themed-accent-btn cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-[#A47C43] hover:bg-[#8e6834] text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
                >
                  <Upload className="w-4 h-4" />
                  <span>{isScanning ? 'Scanning...' : 'Choose File'}</span>
                </button>
              </div>
            )}

            {scanStatus && (
              <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-xl text-xs text-amber-900 dark:text-amber-200 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  {isScanning ? (
                    <RefreshCw className="w-4 h-4 animate-spin text-amber-600" />
                  ) : (
                    <Check className="w-4 h-4 text-[#A47C43]" />
                  )}
                  <span>{scanStatus}</span>
                </div>
                {!isScanning && (
                  <button
                    type="button"
                    onClick={() => setViewMode('table')}
                    className="px-2.5 py-1 rounded-lg bg-[#A47C43] text-white text-[11px] font-semibold shrink-0 cursor-pointer"
                  >
                    View Extracted Table →
                  </button>
                )}
              </div>
            )}

            {/* Recent Uploaded & Scanned Files List (Single click opens inside app) */}
            {recentRosterFiles.length > 0 && (
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-serif font-bold text-stone-800 dark:text-stone-200 flex items-center gap-2">
                    <History className="w-4 h-4 text-[#A47C43]" />
                    <span>Recent Files ({recentRosterFiles.length})</span>
                  </h4>
                  <span className="text-[11px] text-stone-500">
                    Single-click any file to view its extracted tables &amp; content · Use top ribbon&apos;s Roster File AI Scan to add more
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {recentRosterFiles.map((doc) => {
                    const extLow = doc.ext.toLowerCase();
                    const isSheet = extLow === 'xls' || extLow === 'xlsx' || extLow === 'csv';
                    const isImg = extLow === 'png' || extLow === 'jpg' || extLow === 'jpeg' || extLow === 'webp';
                    return (
                      <button
                        key={doc.id}
                        type="button"
                        onClick={() => handleOpenRecentRosterFile(doc)}
                        className="text-left p-3.5 rounded-2xl border border-stone-200 dark:border-[#382518] bg-white dark:bg-[#1a120d] hover:border-[#A47C43] shadow-2xs hover:shadow-md transition-all cursor-pointer flex items-start gap-3 group"
                      >
                        <div className="w-9 h-9 rounded-xl bg-[#A47C43]/12 border border-[#A47C43]/25 flex items-center justify-center shrink-0">
                          {isSheet ? (
                            <FileSpreadsheet className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                          ) : isImg ? (
                            <FileImage className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                          ) : (
                            <FileText className="w-4 h-4 text-[#A47C43]" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-xs font-bold text-stone-900 dark:text-stone-100 truncate group-hover:text-[#8f5f2c] dark:group-hover:text-amber-300">
                            {doc.fileName}
                          </div>
                          <div className="text-[10.5px] font-mono text-stone-500 truncate mt-0.5">
                            {doc.ext.toUpperCase()} · {doc.sizeLabel}
                          </div>
                          <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                            {(doc.extractedTables?.length || 0) > 0 && (
                              <span className="text-[9.5px] font-semibold px-1.5 py-0.5 rounded bg-emerald-500/12 text-emerald-700 dark:text-emerald-300">
                                {doc.extractedTables!.length} Table(s)
                              </span>
                            )}
                            {(doc.parsedEventsCount || 0) > 0 && (
                              <span className="text-[9.5px] font-semibold px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-800 dark:text-amber-300">
                                {doc.parsedEventsCount} Session(s)
                              </span>
                            )}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Single-Click In-App File & Table Viewer Modal */}
            {viewingRosterFile && (
              <div
                className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs"
                onClick={() => setViewingRosterFile(null)}
              >
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="w-full max-w-4xl max-h-[88vh] rounded-3xl bg-[#fcfaf7] dark:bg-[#160f0a] border border-stone-200 dark:border-[#382518] shadow-2xl flex flex-col overflow-hidden"
                >
                  <div className="px-5 py-3.5 border-b border-stone-200 dark:border-[#382518] flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="font-serif font-bold text-base text-stone-900 dark:text-stone-100 truncate">
                        {viewingRosterFile.fileName}
                      </h3>
                      <p className="text-[11px] font-mono text-stone-500">
                        {viewingRosterFile.ext.toUpperCase()} · {viewingRosterFile.sizeLabel}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setViewingRosterFile(null)}
                      className="p-1.5 rounded-lg text-stone-400 hover:text-stone-800 dark:hover:text-white cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex-1 overflow-y-auto p-5 space-y-5 custom-scrollbar">
                    {(() => {
                      const url =
                        getSessionFileUrl(viewingRosterFile.id) ||
                        viewingRosterFile.dataUrl ||
                        viewingRosterFile.pdfFileUrl;
                      if (!url) return null;
                      if (
                        viewingRosterFile.ext === 'pdf' ||
                        viewingRosterFile.mimeType === 'application/pdf'
                      ) {
                        return (
                          <div className="h-[420px] rounded-2xl overflow-hidden border border-stone-200 dark:border-[#382518]">
                            <iframe
                              src={url}
                              title={viewingRosterFile.fileName}
                              className="w-full h-full border-0"
                            />
                          </div>
                        );
                      }
                      if (viewingRosterFile.mimeType.startsWith('image/')) {
                        return (
                          <img
                            src={url}
                            alt={viewingRosterFile.fileName}
                            className="max-h-[400px] mx-auto rounded-2xl border border-stone-200 dark:border-[#382518]"
                          />
                        );
                      }
                      return null;
                    })()}

                    {viewingRosterFile.extractedTables && viewingRosterFile.extractedTables.length > 0 && (
                      <div className="space-y-4">
                        <h4 className="text-xs font-mono uppercase tracking-wider font-bold text-[#8f5f2c] dark:text-amber-300 flex items-center gap-1.5">
                          <Table2 className="w-4 h-4" />
                          <span>Extracted Tables ({viewingRosterFile.extractedTables.length})</span>
                        </h4>
                        {viewingRosterFile.extractedTables.map((tbl) => (
                          <div
                            key={tbl.id}
                            className="rounded-2xl border border-stone-200 dark:border-[#382518] overflow-hidden bg-white dark:bg-[#1c130d]"
                          >
                            <div className="px-4 py-2 bg-stone-100 dark:bg-[#241912] border-b border-stone-200 dark:border-[#382518] text-xs font-bold text-stone-800 dark:text-stone-100">
                              {tbl.title}
                            </div>
                            <div className="overflow-x-auto">
                              <table className="w-full text-left text-xs border-collapse">
                                <thead className="bg-stone-50 dark:bg-[#1a120d] text-stone-700 dark:text-stone-300 border-b border-stone-200 dark:border-[#352317]">
                                  <tr>
                                    {tbl.headers.map((h, hi) => (
                                      <th key={hi} className="px-3 py-2 font-semibold whitespace-nowrap">
                                        {h || `Column ${hi + 1}`}
                                      </th>
                                    ))}
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-stone-100 dark:divide-[#2e1e14] text-stone-800 dark:text-stone-200">
                                  {tbl.rows.map((row, ri) => (
                                    <tr key={ri}>
                                      {tbl.headers.map((_, ci) => (
                                        <td key={ci} className="px-3 py-2">
                                          {row[ci] || '—'}
                                        </td>
                                      ))}
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {viewingRosterFile.extractedText && (
                      <div className="space-y-2">
                        <h4 className="text-xs font-mono uppercase tracking-wider font-bold text-stone-500">
                          Extracted Content
                        </h4>
                        <pre className="p-4 rounded-2xl bg-stone-50 dark:bg-[#120c08] border border-stone-200 dark:border-[#382518] text-xs whitespace-pre-wrap font-sans text-stone-800 dark:text-stone-200 max-h-[300px] overflow-y-auto custom-scrollbar">
                          {viewingRosterFile.extractedText}
                        </pre>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );

  if (isFullView) {
    return mainCard;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      {mainCard}
    </div>
  );
};
export default RosterCalendarModal;
