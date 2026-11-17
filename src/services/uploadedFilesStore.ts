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

export const DEFAULT_FILES_FOLDER_ID = 'folder-pdfs-files';
export const DEFAULT_NOTES_FOLDER_ID = 'folder-general-notes';

const sessionObjectUrls = new Map<string, string>();

export function registerSessionFileUrl(fileId: string, url: string) {
  sessionObjectUrls.set(fileId, url);
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

export function getUploadedDocuments(): UploadedDocumentRecord[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(LS_UPLOADED_FILES);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
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
      name: 'PDFs & Files',
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
    const byId = new Map(parsed.map((f) => [f.id, f]));
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
