import {
  ACHIEV_GUIDE_DOC_ID,
  ACHIEV_FEATURES_GUIDE_PAGES,
  LECTURE_SCHEDULE_DOC_ID,
  LECTURE_SCHEDULE_SAMPLE_ROWS,
  buildAchievGuideDataUrl,
  buildLectureScheduleDataUrl,
} from '../data/achievSampleDocs';

export interface ExtractedTableData {
  id: string;
  title: string;
  headers: string[];
  rows: string[][];
}

export interface UploadedDocumentRecord {
  id: string;
  title: string;
  fileName: string;
  ext: string;
  mimeType: string;
  sizeBytes: number;
  sizeLabel: string;
  source: 'read' | 'roster' | 'library';
  subject: string;
  folderId: string;
  uploadedAt: string;
  lastOpenedAt: string;
  extractedText?: string;
  extractedTables?: ExtractedTableData[];
  parsedEventsCount?: number;
  dataUrl?: string;
  driveFileId?: string;
  pdfFileUrl?: string;
}

export interface LibraryFolderItem {
  id: string;
  name: string;
  color: string;
  kind: 'notes' | 'files';
  createdAt: string;
}

export interface RecentOpenedFileRecord {
  id: string;
  refId: string;
  kind: 'book' | 'uploaded-doc' | 'note';
  title: string;
  subtitle?: string;
  ext?: string;
  openedAt: string;
  source?: string;
}

const LS_UPLOADED_FILES = 'achiev_uploaded_files_v1';
const LS_RECENT_OPENED = 'achiev_recent_opened_files_v1';
const LS_LIBRARY_FOLDERS = 'achiev_library_folders_v1';
const LS_NOTEBOOK_FOLDER_MAP = 'achiev_notebook_folder_map_v1';
const LS_SEEDED_V2 = 'achiev_files_seeded_v2';

export const DEFAULT_FILES_FOLDER_ID = 'folder-pdfs-files';
export const DEFAULT_NOTES_FOLDER_ID = 'folder-general-notes';

const sessionObjectUrls = new Map<string, string>();

const IDB_DB_NAME = 'achiev_local_files_db';
const IDB_STORE_NAME = 'file_blobs';

function openFilesIdb(): Promise<IDBDatabase | null> {
  if (typeof window === 'undefined' || !('indexedDB' in window)) {
    return Promise.resolve(null);
  }
  return new Promise((resolve) => {
    try {
      const req = window.indexedDB.open(IDB_DB_NAME, 1);
      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains(IDB_STORE_NAME)) {
          db.createObjectStore(IDB_STORE_NAME);
        }
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => resolve(null);
    } catch {
      resolve(null);
    }
  });
}

export async function saveFileBlobToIdb(fileId: string, blob: Blob): Promise<void> {
  const db = await openFilesIdb();
  if (!db) return;
  await new Promise<void>((resolve) => {
    try {
      const tx = db.transaction(IDB_STORE_NAME, 'readwrite');
      tx.objectStore(IDB_STORE_NAME).put(blob, fileId);
      tx.oncomplete = () => resolve();
      tx.onerror = () => resolve();
    } catch {
      resolve();
    }
  });
}

export async function getFileBlobFromIdb(fileId: string): Promise<string | undefined> {
  const existing = sessionObjectUrls.get(fileId);
  if (existing) return existing;
  const db = await openFilesIdb();
  if (!db) return undefined;
  return new Promise((resolve) => {
    try {
      const tx = db.transaction(IDB_STORE_NAME, 'readonly');
      const req = tx.objectStore(IDB_STORE_NAME).get(fileId);
      req.onsuccess = () => {
        const blob = req.result as Blob | undefined;
        if (blob instanceof Blob) {
          const url = URL.createObjectURL(blob);
          sessionObjectUrls.set(fileId, url);
          resolve(url);
        } else {
          resolve(undefined);
        }
      };
      req.onerror = () => resolve(undefined);
    } catch {
      resolve(undefined);
    }
  });
}

export async function deleteFileBlobFromIdb(fileId: string): Promise<void> {
  const db = await openFilesIdb();
  if (!db) return;
  await new Promise<void>((resolve) => {
    try {
      const tx = db.transaction(IDB_STORE_NAME, 'readwrite');
      tx.objectStore(IDB_STORE_NAME).delete(fileId);
      tx.oncomplete = () => resolve();
      tx.onerror = () => resolve();
    } catch {
      resolve();
    }
  });
}

export function registerSessionFileUrl(fileId: string, url: string, blob?: Blob) {
  sessionObjectUrls.set(fileId, url);
  if (blob) {
    void saveFileBlobToIdb(fileId, blob);
  }
}

export function getSessionFileUrl(fileId: string): string | undefined {
  return sessionObjectUrls.get(fileId);
}

export function formatFileSize(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) return 'Document';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = () => reject(reader.error || new Error('Could not read file'));
    reader.readAsDataURL(file);
  });
}

function buildDefaultSeedDocuments(): UploadedDocumentRecord[] {
  const now = new Date().toISOString();
  const lectureScheduleDoc: UploadedDocumentRecord = {
    id: LECTURE_SCHEDULE_DOC_ID,
    title: 'Lecture schedule',
    fileName: 'Lecture schedule.pdf',
    ext: 'pdf',
    mimeType: 'text/html',
    sizeBytes: 48_200,
    sizeLabel: '48.2 KB · Sample Roster',
    source: 'roster',
    subject: 'Pharmacology',
    folderId: DEFAULT_FILES_FOLDER_ID,
    uploadedAt: now,
    lastOpenedAt: now,
    parsedEventsCount: LECTURE_SCHEDULE_SAMPLE_ROWS.length,
    extractedText: LECTURE_SCHEDULE_SAMPLE_ROWS.map(
      (r) => `${r.day} (${r.time}) — ${r.subject}: ${r.topic} @ ${r.room} [${r.faculty}]`
    ).join('\n'),
    extractedTables: [
      {
        id: 'tbl-lecture-schedule-sample',
        title: 'Weekly Academic Lecture & Lab Schedule',
        headers: ['Day', 'Time', 'Subject', 'Session Topic', 'Venue', 'Faculty'],
        rows: LECTURE_SCHEDULE_SAMPLE_ROWS.map((r) => [
          r.day,
          r.time,
          r.subject,
          r.topic,
          r.room,
          r.faculty,
        ]),
      },
    ],
    dataUrl: buildLectureScheduleDataUrl(),
  };

  const achievGuideDoc: UploadedDocumentRecord = {
    id: ACHIEV_GUIDE_DOC_ID,
    title: 'Achiev Features & Subscription Guide',
    fileName: 'Achiev Features & Subscription Guide.pdf',
    ext: 'pdf',
    mimeType: 'text/html',
    sizeBytes: 86_400,
    sizeLabel: '3 Pages · PDF Guide',
    source: 'library',
    subject: 'Study Guide',
    folderId: DEFAULT_FILES_FOLDER_ID,
    uploadedAt: now,
    lastOpenedAt: now,
    extractedText: ACHIEV_FEATURES_GUIDE_PAGES.map(
      (p) => `${p.heading} (${p.subtitle})\n${p.highlight || p.sections.map((s) => s.body).join(' ')}`
    ).join('\n\n'),
    dataUrl: buildAchievGuideDataUrl(),
  };

  return [lectureScheduleDoc, achievGuideDoc];
}

export function getUploadedDocuments(): UploadedDocumentRecord[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(LS_UPLOADED_FILES);
    const parsed: UploadedDocumentRecord[] = raw ? JSON.parse(raw) : [];
    const list = Array.isArray(parsed) ? parsed : [];
    if (localStorage.getItem(LS_SEEDED_V2) !== '1') {
      const seeds = buildDefaultSeedDocuments();
      const existingIds = new Set(list.map((d) => d.id));
      const merged = [
        ...seeds.filter((s) => !existingIds.has(s.id)),
        ...list,
      ];
      localStorage.setItem(LS_SEEDED_V2, '1');
      localStorage.setItem(LS_UPLOADED_FILES, JSON.stringify(merged.slice(0, 60)));
      return merged;
    }
    return list;
  } catch {
    return [];
  }
}

export function saveUploadedDocuments(list: UploadedDocumentRecord[]): void {
  if (typeof window === 'undefined') return;
  const trimmed = list.slice(0, 60);
  try {
    localStorage.setItem(LS_UPLOADED_FILES, JSON.stringify(trimmed));
  } catch {
    // Strip heavy inline dataUrls from older entries if storage quota is tight
    const compact = trimmed.map((doc, idx) =>
      idx > 4 && doc.dataUrl && doc.dataUrl.length > 80_000 ? { ...doc, dataUrl: undefined } : doc
    );
    try {
      localStorage.setItem(LS_UPLOADED_FILES, JSON.stringify(compact));
    } catch {
      const bare = trimmed.map((doc) => ({ ...doc, dataUrl: undefined }));
      try {
        localStorage.setItem(LS_UPLOADED_FILES, JSON.stringify(bare));
      } catch {}
    }
  }
  window.dispatchEvent(new CustomEvent('achiev_uploaded_files_changed'));
}

export function addUploadedDocument(
  record: Omit<UploadedDocumentRecord, 'id' | 'uploadedAt' | 'lastOpenedAt' | 'sizeLabel'> & {
    id?: string;
    uploadedAt?: string;
    lastOpenedAt?: string;
    sizeLabel?: string;
  }
): UploadedDocumentRecord {
  const now = new Date().toISOString();
  const id = record.id || `doc-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  const sizeLabel = record.sizeLabel || formatFileSize(record.sizeBytes);
  // Keep dataUrl in persistence only when reasonably sized (< 1.8MB encoded) so localStorage remains reliable
  const safeDataUrl =
    record.dataUrl && record.dataUrl.length <= 2_400_000 ? record.dataUrl : undefined;

  const entry: UploadedDocumentRecord = {
    ...record,
    id,
    sizeLabel,
    folderId: record.folderId || DEFAULT_FILES_FOLDER_ID,
    uploadedAt: record.uploadedAt || now,
    lastOpenedAt: record.lastOpenedAt || now,
    dataUrl: safeDataUrl,
  };

  const existing = getUploadedDocuments();
  const next = [entry, ...existing.filter((item) => item.id !== id)];
  saveUploadedDocuments(next);

  recordRecentOpenedFile({
    refId: id,
    kind: 'uploaded-doc',
    title: entry.title || entry.fileName,
    subtitle: `${entry.ext.toUpperCase()} · ${entry.sizeLabel}`,
    ext: entry.ext,
    source: entry.source,
  });

  return entry;
}

export function updateUploadedDocumentFolder(docId: string, folderId: string): void {
  const list = getUploadedDocuments();
  saveUploadedDocuments(list.map((d) => (d.id === docId ? { ...d, folderId } : d)));
}

export function deleteUploadedDocument(docId: string): void {
  const list = getUploadedDocuments();
  saveUploadedDocuments(list.filter((d) => d.id !== docId));
  sessionObjectUrls.delete(docId);
  void deleteFileBlobFromIdb(docId);
}

export function touchUploadedDocument(docId: string): void {
  const now = new Date().toISOString();
  const list = getUploadedDocuments();
  const target = list.find((d) => d.id === docId);
  if (target) {
    saveUploadedDocuments([
      { ...target, lastOpenedAt: now },
      ...list.filter((d) => d.id !== docId),
    ]);
    recordRecentOpenedFile({
      refId: target.id,
      kind: 'uploaded-doc',
      title: target.title || target.fileName,
      subtitle: `${target.ext.toUpperCase()} · ${target.sizeLabel}`,
      ext: target.ext,
      source: target.source,
    });
  }
}

export function getRecentOpenedFiles(): RecentOpenedFileRecord[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(LS_RECENT_OPENED);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function recordRecentOpenedFile(
  item: Omit<RecentOpenedFileRecord, 'id' | 'openedAt'>
): RecentOpenedFileRecord[] {
  if (typeof window === 'undefined') return [];
  const now = new Date().toISOString();
  const current = getRecentOpenedFiles();
  const entry: RecentOpenedFileRecord = {
    ...item,
    id: `recent-${item.kind}-${item.refId}`,
    openedAt: now,
  };
  const next = [entry, ...current.filter((r) => !(r.kind === item.kind && r.refId === item.refId))].slice(0, 30);
  try {
    localStorage.setItem(LS_RECENT_OPENED, JSON.stringify(next));
  } catch {}
  window.dispatchEvent(new CustomEvent('achiev_recent_files_changed'));
  return next;
}

export function getLibraryFolders(): LibraryFolderItem[] {
  const defaults: LibraryFolderItem[] = [
    {
      id: DEFAULT_NOTES_FOLDER_ID,
      name: 'All Notes',
      color: '#A47C43',
      kind: 'notes',
      createdAt: new Date(0).toISOString(),
    },
    {
      id: DEFAULT_FILES_FOLDER_ID,
      name: 'Recent Files',
      color: '#7c4521',
      kind: 'files',
      createdAt: new Date(0).toISOString(),
    },
  ];
  if (typeof window === 'undefined') return defaults;
  try {
    const raw = localStorage.getItem(LS_LIBRARY_FOLDERS);
    if (!raw) return defaults;
    const parsed = JSON.parse(raw) as LibraryFolderItem[];
    if (!Array.isArray(parsed)) return defaults;
    const byId = new Map(
      parsed.map((f) => [
        f.id,
        f.id === DEFAULT_FILES_FOLDER_ID ? { ...f, name: 'Recent Files' } : f,
      ])
    );
    defaults.forEach((d) => {
      if (!byId.has(d.id)) byId.set(d.id, d);
    });
    return Array.from(byId.values());
  } catch {
    return defaults;
  }
}

export function saveLibraryFolders(folders: LibraryFolderItem[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LS_LIBRARY_FOLDERS, JSON.stringify(folders));
  } catch {}
  window.dispatchEvent(new CustomEvent('achiev_uploaded_files_changed'));
}

export function getNotebookFolderMap(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(LS_NOTEBOOK_FOLDER_MAP);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function setNotebookFolder(notebookId: string, folderId: string): void {
  if (typeof window === 'undefined') return;
  const map = getNotebookFolderMap();
  if (!folderId || folderId === DEFAULT_NOTES_FOLDER_ID) {
    delete map[notebookId];
  } else {
    map[notebookId] = folderId;
  }
  try {
    localStorage.setItem(LS_NOTEBOOK_FOLDER_MAP, JSON.stringify(map));
  } catch {}
  window.dispatchEvent(new CustomEvent('achiev_uploaded_files_changed'));
}
