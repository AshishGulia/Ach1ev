import React, { useState, useEffect, useRef } from 'react';
import { MedicalBook, Notebook, SubjectCourse } from '../../types';
import {
  DEFAULT_FILES_FOLDER_ID,
  DEFAULT_NOTES_FOLDER_ID,
  LibraryFolderItem,
  UploadedDocumentRecord,
  addUploadedDocument,
  deleteUploadedDocument,
  getFileBlobFromIdb,
  getLibraryFolders,
  getNotebookFolderMap,
  getRecentOpenedFiles,
  getSessionFileUrl,
  getUploadedDocuments,
  readFileAsDataUrl,
  registerSessionFileUrl,
  saveLibraryFolders,
  setNotebookFolder,
  touchUploadedDocument,
  updateUploadedDocumentFolder,
} from '../../services/uploadedFilesStore';
import {
  Folder,
  FolderPlus,
  FileText,
  FileSpreadsheet,
  FileImage,
  BookOpen,
  UploadCloud,
  Search,
  Plus,
  Trash2,
  X,
  ExternalLink,
  Table2,
  StickyNote,
  Loader2,
  FolderOpen,
  MoreVertical,
  FolderInput,
  Eye,
  Share2,
  Download,
  CheckSquare,
  Square,
  MinusSquare,
  HardDrive,
  Clock,
} from 'lucide-react';
import { WebViewDocumentModal, WebViewDocPayload } from '../common/WebViewDocumentModal';
import { CloudDriveSaveModal, CloudDriveTargetFile } from '../common/CloudDriveSaveModal';
import { getPlanLimits, openSubscriptionUpgradeModal } from '../../utils/subscriptionLimits';
import {
  chooseDeviceDestinationFolder,
  getSavedDestinationLabel,
  saveFileToAch1evDeviceFolder,
} from '../../utils/deviceStorage';
import ShelfRoom from './ShelfRoom';

interface LibraryWorkspaceViewProps {
  notebooks: Notebook[];
  books: MedicalBook[];
  currentSubject: SubjectCourse;
  onOpenNotebook: (nb: Notebook) => void;
  onCreateBlankNote: () => void;
  onAddNotebook?: (nb: Notebook) => void;
  onDeleteNotebook?: (notebookId: string) => void;
  onAddBook?: (book: MedicalBook) => void;
  onOpenInRead?: (doc: UploadedDocumentRecord) => void;
}

const FOLDER_PALETTE = ['#A47C43', '#7c4521', '#2e5f5a', '#4f46e5', '#9333ea', '#b45309'];

const stripHtmlPreview = (html?: string): string => {
  if (!html) return '';
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/\s+/g, ' ')
    .trim();
};

const formatExplorerDate = (iso?: string): string => {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
};

export const LibraryWorkspaceView: React.FC<LibraryWorkspaceViewProps> = ({
  notebooks,
  books,
  currentSubject,
  onOpenNotebook,
  onCreateBlankNote,
  onAddNotebook,
  onDeleteNotebook,
  onAddBook,
  onOpenInRead,
}) => {
  const [activeTab, setActiveTab] = useState<'notes' | 'files'>('notes');
  const [folders, setFolders] = useState<LibraryFolderItem[]>(() => getLibraryFolders());
  const [uploadedDocs, setUploadedDocs] = useState<UploadedDocumentRecord[]>(() =>
    getUploadedDocuments()
  );
  const [notebookFolderMap, setNotebookFolderMapState] = useState<Record<string, string>>(() =>
    getNotebookFolderMap()
  );
  const [selectedNotesFolderId, setSelectedNotesFolderId] = useState<string>(DEFAULT_NOTES_FOLDER_ID);
  const [selectedFilesFolderId, setSelectedFilesFolderId] = useState<string>(DEFAULT_FILES_FOLDER_ID);
  const [searchQuery, setSearchQuery] = useState('');

  // Windows File Explorer Multi-Select State
  const [selectedNoteIds, setSelectedNoteIds] = useState<string[]>([]);
  const [selectedFileIds, setSelectedFileIds] = useState<string[]>([]);

  // Create folder dialog state
  const [isNewFolderOpen, setIsNewFolderOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [newFolderColor, setNewFolderColor] = useState(FOLDER_PALETTE[0]);

  // Upload & preview state
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [statusBanner, setStatusBanner] = useState<string | null>(null);
  const [previewDoc, setPreviewDoc] = useState<UploadedDocumentRecord | null>(null);
  const [openMenuDocId, setOpenMenuDocId] = useState<string | null>(null);
  const [movingDocId, setMovingDocId] = useState<string | null>(null);
  const [destLabel, setDestLabel] = useState<string>(() => getSavedDestinationLabel());
  const [isDestModalOpen, setIsDestModalOpen] = useState(false);
  const [destInputDraft, setDestInputDraft] = useState<string>(() => getSavedDestinationLabel());
  const [cloudDriveFile, setCloudDriveFile] = useState<CloudDriveTargetFile | null>(null);

  // Add Note Modal State (From Shelf vs Recent Files)
  const [isAddNoteModalOpen, setIsAddNoteModalOpen] = useState(false);
  const [addNoteTab, setAddNoteTab] = useState<'shelf' | 'recent'>('shelf');
  const [addNoteFilter, setAddNoteFilter] = useState('');

  const flashBanner = (msg: string) => {
    setStatusBanner(msg);
    window.setTimeout(() => {
      setStatusBanner((prev) => (prev === msg ? null : prev));
    }, 3600);
  };

  useEffect(() => {
    const syncAll = () => {
      setFolders(getLibraryFolders());
      setUploadedDocs(getUploadedDocuments());
      setNotebookFolderMapState(getNotebookFolderMap());
      setDestLabel(getSavedDestinationLabel());
    };
    window.addEventListener('achiev_uploaded_files_changed', syncAll);
    window.addEventListener('achiev_recent_files_changed', syncAll);
    window.addEventListener('achiev_destination_changed', syncAll);
    window.addEventListener('storage', syncAll);
    return () => {
      window.removeEventListener('achiev_uploaded_files_changed', syncAll);
      window.removeEventListener('achiev_recent_files_changed', syncAll);
      window.removeEventListener('achiev_destination_changed', syncAll);
      window.removeEventListener('storage', syncAll);
    };
  }, []);

  const notesFolders = folders.filter((f) => f.kind === 'notes');
  const fileFolders = folders.filter((f) => f.kind === 'files');

  // Helper to collect all shelf items across 5 Almirahs & Books
  const getShelfItems = () => {
    interface ShelfPickItem {
      id: string;
      title: string;
      source: 'shelf-book' | 'notebook';
      location: string;
      coverColor?: string;
      author?: string;
    }
    const list: ShelfPickItem[] = [];
    const seenTitles = new Set<string>();

    try {
      const raw = localStorage.getItem('medden_shelf_room_v6');
      if (raw) {
        const almirahs = JSON.parse(raw);
        if (Array.isArray(almirahs)) {
          for (const alm of almirahs) {
            const almTitle = alm.name || alm.design || 'Almirah';
            if (Array.isArray(alm.shelves)) {
              for (const shelf of alm.shelves) {
                const shelfTitle = shelf.name || 'Shelf';
                if (Array.isArray(shelf.books)) {
                  for (const b of shelf.books) {
                    const t = String(b?.title || '').trim();
                    if (t && !seenTitles.has(t.toLowerCase())) {
                      seenTitles.add(t.toLowerCase());
                      list.push({
                        id: b.id || `shelf-${t}`,
                        title: t,
                        source: 'shelf-book',
                        location: `${almTitle} · ${shelfTitle}`,
                        coverColor: b.cover || '#8f5f2c',
                        author: b.author || 'Shelf Book',
                      });
                    }
                  }
                }
                if (Array.isArray(shelf.folders)) {
                  for (const fld of shelf.folders) {
                    if (Array.isArray(fld.books)) {
                      for (const b of fld.books) {
                        const t = String(b?.title || '').trim();
                        if (t && !seenTitles.has(t.toLowerCase())) {
                          seenTitles.add(t.toLowerCase());
                          list.push({
                            id: b.id || `shelf-fld-${t}`,
                            title: t,
                            source: 'shelf-book',
                            location: `${almTitle} · ${fld.name || 'Folder'}`,
                            coverColor: fld.color || '#8f5f2c',
                            author: b.author || 'Folder Book',
                          });
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    } catch {}

    if (list.length === 0 && Array.isArray(books)) {
      for (const b of books) {
        const t = b.title.trim();
        if (t && !seenTitles.has(t.toLowerCase())) {
          seenTitles.add(t.toLowerCase());
          list.push({
            id: b.id,
            title: t,
            source: 'shelf-book',
            location: 'Medical Shelf',
            coverColor: b.coverColor || '#8f5f2c',
            author: b.author || 'Medical Textbook',
          });
        }
      }
    }

    if (Array.isArray(notebooks)) {
      for (const nb of notebooks) {
        const assigned = notebookFolderMap[nb.id] || DEFAULT_NOTES_FOLDER_ID;
        if (assigned !== selectedNotesFolderId) {
          list.push({
            id: nb.id,
            title: nb.title,
            source: 'notebook',
            location: assigned === DEFAULT_NOTES_FOLDER_ID ? 'All Notes' : 'Other Folder',
            coverColor: nb.coverColor || '#A47C43',
            author: `${nb.pages?.length || 1} pages`,
          });
        }
      }
    }

    return list;
  };

  // Helper to collect recent files
  const getRecentItems = () => {
    interface RecentPickItem {
      id: string;
      refId: string;
      title: string;
      kind: 'uploaded-doc' | 'book' | 'note';
      ext?: string;
      subtitle?: string;
      openedAt?: string;
    }
    const map = new Map<string, RecentPickItem>();

    const recentOpened = getRecentOpenedFiles();
    for (const r of recentOpened) {
      if (!r.title) continue;
      map.set(r.refId || r.id, {
        id: r.id,
        refId: r.refId || r.id,
        title: r.title,
        kind: r.kind || 'uploaded-doc',
        ext: r.ext || (r.kind === 'note' ? 'note' : 'pdf'),
        subtitle: r.subtitle || (r.source ? `Source: ${r.source}` : 'Recently opened'),
        openedAt: r.openedAt,
      });
    }

    for (const doc of uploadedDocs) {
      if (!map.has(doc.id)) {
        map.set(doc.id, {
          id: doc.id,
          refId: doc.id,
          title: doc.title || doc.fileName,
          kind: 'uploaded-doc',
          ext: doc.ext || 'doc',
          subtitle: `${(doc.ext || 'FILE').toUpperCase()} · ${doc.sizeLabel || ''}`,
          openedAt: doc.uploadedAt,
        });
      }
    }

    for (const nb of notebooks) {
      if (!map.has(nb.id)) {
        map.set(nb.id, {
          id: nb.id,
          refId: nb.id,
          title: nb.title,
          kind: 'note',
          ext: 'note',
          subtitle: `${nb.subject} · ${nb.pages?.length || 1} pages`,
          openedAt: nb.updatedAt,
        });
      }
    }

    return Array.from(map.values());
  };

  const handleAddNoteToFolder = (item: {
    id: string;
    refId?: string;
    title: string;
    source?: string;
    kind?: string;
    coverColor?: string;
  }) => {
    const currentFolder = notesFolders.find((f) => f.id === selectedNotesFolderId);
    const folderName = currentFolder ? currentFolder.name : 'Notes Folder';

    // 1. If it matches an existing notebook, assign/move it into this folder
    const targetId = item.refId || item.id;
    const existingNb = notebooks.find((n) => n.id === targetId || n.id === item.id);
    if (existingNb) {
      setNotebookFolder(existingNb.id, selectedNotesFolderId);
      setNotebookFolderMapState(getNotebookFolderMap());
      flashBanner(`Added "${existingNb.title}" to ${folderName}`);
      setIsAddNoteModalOpen(false);
      return;
    }

    // 2. Otherwise create a new notebook linked to this shelf book / recent file
    const today = new Date().toISOString().split('T')[0];
    const nowIso = new Date().toISOString();
    const newNb: Notebook = {
      id: `nb-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      title: item.title,
      subject: currentSubject,
      coverTheme: 'botany',
      coverTitle: item.title.toUpperCase().slice(0, 24),
      coverSubtitle: item.source === 'shelf-book' ? 'Added from Shelf' : 'Added from Recent Files',
      coverColor: item.coverColor || '#A47C43',
      paperType: 'ruled-thin',
      paperColor: 'beige',
      activePageIndex: 0,
      createdAt: today,
      updatedAt: nowIso,
      pages: [
        {
          id: `p-${Date.now()}`,
          title: item.title,
          contentHtml: `<h2>${item.title}</h2><p>Notes added from ${
            item.source === 'shelf-book' ? '3D Shelf' : 'Recent Files'
          }.</p>`,
          inkStrokes: [],
          screenshots: [],
          date: today,
          updatedAt: nowIso,
        },
      ],
    };

    if (onAddNotebook) {
      onAddNotebook(newNb);
    } else {
      try {
        const raw = localStorage.getItem('medden_notebooks');
        const existing = raw ? JSON.parse(raw) : [];
        const updated = [newNb, ...existing];
        localStorage.setItem('medden_notebooks', JSON.stringify(updated));
        window.dispatchEvent(new CustomEvent('medden_notebooks_updated'));
      } catch {}
    }

    setNotebookFolder(newNb.id, selectedNotesFolderId);
    setNotebookFolderMapState(getNotebookFolderMap());
    flashBanner(`Added "${newNb.title}" to ${folderName}`);
    setIsAddNoteModalOpen(false);
  };

  const handleCreateFolder = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newFolderName.trim();
    if (!trimmed) return;
    const item: LibraryFolderItem = {
      id: `folder-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      name: trimmed,
      color: newFolderColor,
      kind: activeTab === 'notes' ? 'notes' : 'files',
      createdAt: new Date().toISOString(),
    };
    const next = [...folders, item];
    setFolders(next);
    saveLibraryFolders(next);
    if (activeTab === 'notes') {
      setSelectedNotesFolderId(item.id);
    } else {
      setSelectedFilesFolderId(item.id);
    }
    setNewFolderName('');
    setIsNewFolderOpen(false);
  };

  const handleDeleteCustomFolder = (folderId: string) => {
    if (folderId === DEFAULT_NOTES_FOLDER_ID || folderId === DEFAULT_FILES_FOLDER_ID) return;
    const next = folders.filter((f) => f.id !== folderId);
    setFolders(next);
    saveLibraryFolders(next);
    if (selectedNotesFolderId === folderId) setSelectedNotesFolderId(DEFAULT_NOTES_FOLDER_ID);
    if (selectedFilesFolderId === folderId) setSelectedFilesFolderId(DEFAULT_FILES_FOLDER_ID);
  };

  const handleUploadLibraryFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    const limits = getPlanLimits();
    const userDocsCount = uploadedDocs.filter(
      (d) => !d.id.startsWith('doc-sample-')
    ).length;
    if (userDocsCount >= limits.maxDocuments) {
      openSubscriptionUpgradeModal({
        title: `Document Upload Limit (${limits.maxDocuments} Files)`,
        message:
          limits.planId === 'free'
            ? 'Free plan supports up to 5 uploaded documents. Upgrade to ₹100/mo Scholar Pro for 50 documents.'
            : 'Scholar Pro plan supports up to 50 documents. Upgrade to ₹300/mo Master Ultimate for unlimited uploads.',
        requiredPlanId: limits.planId === 'free' ? 'scholar-pro' : 'master-ultimate',
      });
      return;
    }

    setIsUploading(true);
    setStatusBanner(`Processing "${file.name}"...`);

    const ext = file.name.split('.').pop()?.toLowerCase() || 'file';
    const localUrl = URL.createObjectURL(file);
    let dataUrl = '';
    try {
      dataUrl = await readFileAsDataUrl(file);
    } catch {}
    const base64Data = dataUrl.includes(',') ? dataUrl.split(',')[1] : '';

    let extractedText = '';
    let extractedTables: any[] = [];
    let parsedEventsCount = 0;

    try {
      if (ext === 'txt' || ext === 'md' || ext === 'csv') {
        try {
          extractedText = await file.text();
        } catch {}
      }
      const res = await fetch('/api/gemini/scan-document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filename: file.name,
          mimeType: file.type,
          base64Data,
          extractedText,
        }),
      });
      if (res.ok) {
        const scanned = await res.json();
        if (scanned.extractedText) extractedText = scanned.extractedText;
        if (Array.isArray(scanned.tables)) extractedTables = scanned.tables;
        if (Array.isArray(scanned.events)) parsedEventsCount = scanned.events.length;
      }
    } catch {
      // Fallback to local document metadata when scan is skipped
    }

    const record = addUploadedDocument({
      title: file.name.replace(/\.[^.]+$/, '') || file.name,
      fileName: file.name,
      ext,
      mimeType: file.type || 'application/octet-stream',
      sizeBytes: file.size,
      source: 'library',
      subject: currentSubject,
      folderId: selectedFilesFolderId || DEFAULT_FILES_FOLDER_ID,
      extractedText,
      extractedTables,
      parsedEventsCount,
      dataUrl,
    });
    registerSessionFileUrl(record.id, localUrl, file);

    if (ext === 'pdf' && onAddBook) {
      onAddBook({
        id: `book-lib-${record.id}`,
        title: record.title,
        subject: currentSubject,
        author: 'Uploaded Library Document',
        edition: record.sizeLabel,
        coverColor: '#7c4521',
        pdfFileUrl: localUrl,
        fileSizeBytes: file.size,
        mimeType: file.type || 'application/pdf',
        storageProvider: 'local',
        isUserUploaded: true,
        bookmarks: [1],
        pages: [
          {
            pageNumber: 1,
            title: record.title,
            keyTopic: `${currentSubject} · Uploaded PDF`,
            summaryPearl: extractedText ? extractedText.slice(0, 220) : 'Uploaded to Library PDFs & Files.',
            contentHtml: extractedText
              ? `<pre style="white-space:pre-wrap;font-family:inherit;">${extractedText}</pre>`
              : `<p><strong>${file.name}</strong> stored in Library → PDFs &amp; Files.</p>`,
          },
        ],
        updatedAt: new Date().toISOString(),
      });
    }

    setUploadedDocs(getUploadedDocuments());
    flashBanner(
      extractedTables.length > 0
        ? `Saved "${file.name}" (${extractedTables.length} table(s) extracted).`
        : `Saved "${file.name}" to Recent Files.`
    );
    setIsUploading(false);
  };

  const handleSingleClickDoc = (doc: UploadedDocumentRecord) => {
    touchUploadedDocument(doc.id);
    setUploadedDocs(getUploadedDocuments());
    setPreviewDoc(doc);
  };

  const resolveDocPayload = async (doc: UploadedDocumentRecord): Promise<{ url?: string; blob?: Blob; fallbackText: string }> => {
    const idbUrl = !getSessionFileUrl(doc.id) && !doc.pdfFileUrl && !doc.dataUrl
      ? await getFileBlobFromIdb(doc.id)
      : undefined;
    const url = getSessionFileUrl(doc.id) || idbUrl || doc.pdfFileUrl || doc.dataUrl;
    const fallbackText = doc.extractedText || `${doc.title}\nSubject: ${doc.subject}\nFile: ${doc.fileName}`;
    return { url, fallbackText };
  };

  // Explorer Save to Device (Ach1ev/Documents) / Upload to Drive / Share / Delete Helpers
  const triggerDownloadFile = async (doc: UploadedDocumentRecord) => {
    const { url, fallbackText } = await resolveDocPayload(doc);
    const fileName = doc.fileName || `${(doc.title || 'document').replace(/[^\w\s.-]/g, '_')}.${doc.ext || 'pdf'}`;
    const payload = url || new Blob([fallbackText], { type: 'text/plain;charset=utf-8' });
    const res = await saveFileToAch1evDeviceFolder(fileName, payload, {
      mimeType: doc.mimeType || 'application/pdf',
    });
    flashBanner(`Saved "${res.fileName}" to ${res.destinationLabel}`);
  };

  const triggerOpenDriveUpload = async (doc: UploadedDocumentRecord) => {
    const { url, fallbackText } = await resolveDocPayload(doc);
    setCloudDriveFile({
      title: doc.title || doc.fileName,
      fileName: doc.fileName || `${doc.title || 'document'}.${doc.ext || 'pdf'}`,
      mimeType: doc.mimeType || 'application/pdf',
      sourceUrl: url,
      fallbackText,
    });
  };

  const handleChangeDestinationClick = async () => {
    const res = await chooseDeviceDestinationFolder();
    if (res.cancelled) return;
    if (res.usedNativePicker && res.ok) {
      setDestLabel(res.label);
      flashBanner(`Device save destination set to "${res.label}"`);
      return;
    }
    setDestInputDraft(destLabel);
    setIsDestModalOpen(true);
  };

  const triggerDownloadNote = (nb: Notebook) => {
    const pagesHtml = (nb.pages || [])
      .map(
        (p, idx) =>
          `<section style="margin-bottom:24px;"><h2>${p.title || `Page ${idx + 1}`}</h2>${
            p.contentHtml || ''
          }</section>`
      )
      .join('\n<hr/>\n');
    const docHtml = `<!doctype html><html><head><meta charset="utf-8"><title>${nb.title}</title><style>body{font-family:'Libre Baskerville',Georgia,serif;max-width:820px;margin:40px auto;padding:0 24px;line-height:1.7;color:#1e140c;background:#fcfaf6;}h1{border-bottom:1px solid #d8c8b0;padding-bottom:8px;}</style></head><body><h1>${nb.title}</h1><p style="color:#6b5340;font-size:13px;">Subject: ${nb.subject}</p>${pagesHtml}</body></html>`;
    const blob = new Blob([docHtml], { type: 'text/html;charset=utf-8' });
    const blobUrl = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = `${(nb.title || 'note').replace(/[^\w\s.-]/g, '_')}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.setTimeout(() => URL.revokeObjectURL(blobUrl), 2500);
    flashBanner(`Downloaded note "${nb.title}"`);
  };

  const triggerShareText = async (title: string, text: string) => {
    if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
      try {
        await navigator.share({ title, text });
        flashBanner(`Shared "${title}"`);
        return;
      } catch (err: any) {
        if (err?.name === 'AbortError') return;
      }
    }
    try {
      await navigator.clipboard.writeText(`${title}\n\n${text}`);
      flashBanner(`Copied "${title}" details to clipboard for sharing.`);
    } catch {
      flashBanner(`Ready to share: ${title}`);
    }
  };

  const filteredNotebooks = notebooks.filter((nb) => {
    const assignedFolder = notebookFolderMap[nb.id] || DEFAULT_NOTES_FOLDER_ID;
    const matchesFolder =
      selectedNotesFolderId === DEFAULT_NOTES_FOLDER_ID || assignedFolder === selectedNotesFolderId;
    const q = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !q ||
      nb.title.toLowerCase().includes(q) ||
      nb.subject.toLowerCase().includes(q) ||
      nb.pages.some((p) => (p.title || '').toLowerCase().includes(q));
    return matchesFolder && matchesSearch;
  });

  const filteredDocs = uploadedDocs.filter((doc) => {
    const assignedFolder = doc.folderId || DEFAULT_FILES_FOLDER_ID;
    const matchesFolder =
      selectedFilesFolderId === DEFAULT_FILES_FOLDER_ID || assignedFolder === selectedFilesFolderId;
    const q = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !q ||
      doc.title.toLowerCase().includes(q) ||
      doc.fileName.toLowerCase().includes(q) ||
      doc.ext.toLowerCase().includes(q) ||
      doc.subject.toLowerCase().includes(q);
    return matchesFolder && matchesSearch;
  });

  const uploadedWorkspaceBooks = books.filter((b) => b.isUserUploaded || b.pdfFileUrl || b.driveFileId);

  const visibleNoteIds = filteredNotebooks.map((n) => n.id);
  const allNotesSelected =
    visibleNoteIds.length > 0 && visibleNoteIds.every((id) => selectedNoteIds.includes(id));
  const someNotesSelected =
    visibleNoteIds.some((id) => selectedNoteIds.includes(id)) && !allNotesSelected;

  const visibleFileIds = filteredDocs.map((d) => d.id);
  const allFilesSelected =
    visibleFileIds.length > 0 && visibleFileIds.every((id) => selectedFileIds.includes(id));
  const someFilesSelected =
    visibleFileIds.some((id) => selectedFileIds.includes(id)) && !allFilesSelected;

  const toggleSelectNote = (id: string) => {
    setSelectedNoteIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const toggleSelectAllNotes = () => {
    if (allNotesSelected) {
      setSelectedNoteIds((prev) => prev.filter((id) => !visibleNoteIds.includes(id)));
    } else {
      setSelectedNoteIds((prev) => Array.from(new Set([...prev, ...visibleNoteIds])));
    }
  };

  const toggleSelectFile = (id: string) => {
    setSelectedFileIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const toggleSelectAllFiles = () => {
    if (allFilesSelected) {
      setSelectedFileIds((prev) => prev.filter((id) => !visibleFileIds.includes(id)));
    } else {
      setSelectedFileIds((prev) => Array.from(new Set([...prev, ...visibleFileIds])));
    }
  };

  // Bulk Actions for Selected Notes
  const handleBulkShareNotes = () => {
    const items = notebooks.filter((n) => selectedNoteIds.includes(n.id));
    if (items.length === 0) return;
    const summary = items
      .map((n) => `• ${n.title} (${n.subject}): ${stripHtmlPreview(n.pages?.[0]?.contentHtml).slice(0, 140)}`)
      .join('\n');
    void triggerShareText(`${items.length} Study Note(s) from Ach1ev`, summary);
  };

  const handleBulkDownloadNotes = () => {
    const items = notebooks.filter((n) => selectedNoteIds.includes(n.id));
    items.forEach((n, idx) => {
      window.setTimeout(() => triggerDownloadNote(n), idx * 140);
    });
  };

  const handleBulkDeleteNotes = () => {
    if (!onDeleteNotebook) {
      flashBanner('Delete notes from Note Shelf when bulk removal is unavailable.');
      return;
    }
    const items = [...selectedNoteIds];
    items.forEach((id) => onDeleteNotebook(id));
    setSelectedNoteIds([]);
    flashBanner(`Moved ${items.length} note(s) to Recycle Bin.`);
  };

  // Bulk Actions for Selected Files
  const handleBulkShareFiles = () => {
    const items = uploadedDocs.filter((d) => selectedFileIds.includes(d.id));
    if (items.length === 0) return;
    const summary = items
      .map((d) => `• ${d.fileName || d.title} (${d.ext.toUpperCase()} · ${d.sizeLabel})`)
      .join('\n');
    void triggerShareText(`${items.length} Study File(s) from Ach1ev`, summary);
  };

  const handleBulkDownloadFiles = () => {
    const items = uploadedDocs.filter((d) => selectedFileIds.includes(d.id));
    items.forEach((d, idx) => {
      window.setTimeout(() => triggerDownloadFile(d), idx * 160);
    });
  };

  const handleBulkDeleteFiles = () => {
    const items = [...selectedFileIds];
    items.forEach((id) => deleteUploadedDocument(id));
    setUploadedDocs(getUploadedDocuments());
    setSelectedFileIds([]);
    flashBanner(`Deleted ${items.length} file(s).`);
  };

  const renderFileIcon = (ext: string) => {
    const low = ext.toLowerCase();
    if (low === 'xls' || low === 'xlsx' || low === 'csv') {
      return <FileSpreadsheet className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />;
    }
    if (low === 'png' || low === 'jpg' || low === 'jpeg' || low === 'webp') {
      return <FileImage className="w-5 h-5 text-sky-700 dark:text-sky-400" />;
    }
    return <FileText className="w-5 h-5 text-[#9c622d] dark:text-amber-400" />;
  };

  const activeSelectionCount =
    activeTab === 'notes' ? selectedNoteIds.length : selectedFileIds.length;

  return (
    <div className="themed-workspace-surface flex-1 h-[calc(100dvh-44px)] max-h-full w-full overflow-hidden flex flex-col bg-transparent">
      {/* Top Library Header & Switcher */}
      <header className="themed-glass-bar shrink-0 px-4 sm:px-6 py-3 border-b border-stone-200/80 dark:border-[#382518] bg-white/75 dark:bg-[#160f0a]/85 backdrop-blur-md flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#A47C43]/15 border border-[#A47C43]/30 flex items-center justify-center text-[#7c5321] dark:text-amber-300">
            <FolderOpen className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-serif font-bold text-base sm:text-lg text-stone-900 dark:text-[#efe4d4] leading-tight">
              Library Explorer
            </h1>
            <p className="text-[11px] text-stone-500 dark:text-[#b29980]">
              Detail File &amp; Note List · Multi-Select, Share, Download, Move &amp; Delete
            </p>
          </div>
        </div>

        {/* Category Switcher + Search + Quick Actions */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center p-1 rounded-xl bg-stone-100 dark:bg-[#231912] border border-stone-200 dark:border-[#3a281b]">
            <button
              type="button"
              onClick={() => setActiveTab('notes')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'notes'
                  ? 'themed-accent-btn bg-[#8f5f2c] text-white shadow-xs'
                  : 'text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white'
              }`}
            >
              <StickyNote className="w-3.5 h-3.5" />
              <span>Notes ({notebooks.length})</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('files')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'files'
                  ? 'themed-accent-btn bg-[#8f5f2c] text-white shadow-xs'
                  : 'text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Recent Files ({uploadedDocs.length + uploadedWorkspaceBooks.length})</span>
            </button>
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={activeTab === 'notes' ? 'Search notes...' : 'Search files...'}
              className="pl-8 pr-3 py-1.5 rounded-xl border border-stone-200 dark:border-[#382518] bg-white/90 dark:bg-[#1a120d] text-xs text-stone-800 dark:text-stone-100 outline-none focus:border-[#A47C43] w-40 sm:w-52"
            />
          </div>

          <button
            type="button"
            onClick={handleChangeDestinationClick}
            title={`Current device save folder: ${destLabel}. Click to change destination folder.`}
            className="themed-soft-pill px-3 py-1.5 rounded-xl border border-stone-300 dark:border-[#3d291c] bg-white/80 dark:bg-[#1f150f] hover:border-[#A47C43] text-stone-700 dark:text-[#e6d6c3] text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
          >
            <HardDrive className="w-3.5 h-3.5 text-[#A47C43]" />
            <span className="hidden sm:inline max-w-[160px] truncate">{destLabel}</span>
            <span className="text-[#8f5f2c] dark:text-amber-300 font-bold">· Change Destination</span>
          </button>

          <button
            type="button"
            onClick={() => setIsNewFolderOpen(true)}
            className="themed-soft-pill px-3 py-1.5 rounded-xl border border-[#A47C43]/35 bg-[#A47C43]/12 hover:bg-[#A47C43]/22 text-[#735222] dark:text-[#e6c38d] text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
          >
            <FolderPlus className="w-3.5 h-3.5" />
            <span>New Folder</span>
          </button>

          {activeTab === 'notes' ? (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setAddNoteTab('shelf');
                  setIsAddNoteModalOpen(true);
                }}
                className="themed-soft-pill px-3 py-1.5 rounded-xl border border-[#A47C43]/35 bg-[#A47C43]/12 hover:bg-[#A47C43]/22 text-[#735222] dark:text-[#e6c38d] text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs"
                title="Add note from 3D Shelf or Recent Files into this folder"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Note</span>
              </button>
              <button
                type="button"
                onClick={onCreateBlankNote}
                className="themed-accent-btn px-3 py-1.5 rounded-xl bg-[#8f5f2c] hover:bg-[#734a1f] text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Note</span>
              </button>
            </div>
          ) : (
            <>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx,.xls,.xlsx,.csv,.txt,.md,.png,.jpg,.jpeg,.webp"
                className="hidden"
                onChange={handleUploadLibraryFiles}
              />
              <button
                type="button"
                disabled={isUploading}
                onClick={() => fileInputRef.current?.click()}
                className="themed-accent-btn px-3 py-1.5 rounded-xl bg-[#8f5f2c] hover:bg-[#734a1f] text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs cursor-pointer disabled:opacity-60"
              >
                {isUploading ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <UploadCloud className="w-3.5 h-3.5" />
                )}
                <span>{isUploading ? 'Scanning...' : 'Upload PDF / File'}</span>
              </button>
            </>
          )}
        </div>
      </header>

      {statusBanner && (
        <div className="shrink-0 mx-4 sm:mx-6 mt-2.5 px-3.5 py-2 rounded-xl bg-amber-50 dark:bg-amber-950/45 border border-amber-300/60 dark:border-amber-700/50 text-xs text-amber-900 dark:text-amber-200 flex items-center justify-between">
          <span>{statusBanner}</span>
          <button
            type="button"
            onClick={() => setStatusBanner(null)}
            className="p-0.5 opacity-70 hover:opacity-100 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Windows Explorer Multi-Select Bulk Action Bar */}
      {activeSelectionCount > 0 && (
        <div className="shrink-0 mx-4 sm:mx-6 mt-2.5 px-3.5 py-2 rounded-xl bg-[#fff7ea] dark:bg-[#24160d] border border-[#A47C43]/45 flex flex-wrap items-center justify-between gap-2 text-xs shadow-xs">
          <span className="font-semibold text-stone-900 dark:text-[#f5e6cf] tabular-nums">
            {activeSelectionCount} {activeTab === 'notes' ? 'note(s)' : 'file(s)'} selected
          </span>
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={activeTab === 'notes' ? handleBulkShareNotes : handleBulkShareFiles}
              className="px-2.5 py-1 rounded-lg bg-white dark:bg-[#1a110b] border border-stone-200 dark:border-[#3d281b] hover:border-[#A47C43] font-semibold flex items-center gap-1.5 text-stone-800 dark:text-stone-100 cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5 text-[#A47C43]" />
              <span>Share</span>
            </button>
            <button
              type="button"
              onClick={activeTab === 'notes' ? handleBulkDownloadNotes : handleBulkDownloadFiles}
              className="px-2.5 py-1 rounded-lg bg-white dark:bg-[#1a110b] border border-stone-200 dark:border-[#3d281b] hover:border-[#A47C43] font-semibold flex items-center gap-1.5 text-stone-800 dark:text-stone-100 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-[#A47C43]" />
              <span>Download</span>
            </button>
            <button
              type="button"
              onClick={activeTab === 'notes' ? handleBulkDeleteNotes : handleBulkDeleteFiles}
              className="px-2.5 py-1 rounded-lg bg-red-600/10 border border-red-500/30 hover:bg-red-600/20 font-semibold flex items-center gap-1.5 text-red-700 dark:text-red-300 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete</span>
            </button>
            <button
              type="button"
              onClick={() =>
                activeTab === 'notes' ? setSelectedNoteIds([]) : setSelectedFileIds([])
              }
              className="px-2 py-1 rounded-lg text-stone-500 hover:text-stone-900 dark:hover:text-white cursor-pointer"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {/* Main Split Explorer Workspace: Left Folders Rail + Device-Height Scrollable Details List */}
      <div className="flex-1 min-h-0 flex flex-col md:flex-row overflow-hidden">
        {/* Folders Column */}
        <aside className="md:w-56 lg:w-60 shrink-0 max-h-40 md:max-h-none border-b md:border-b-0 md:border-r border-stone-200/80 dark:border-[#382518] bg-white/45 dark:bg-[#140d09]/65 p-3 overflow-y-auto custom-scrollbar space-y-1.5">
          <div className="flex items-center justify-between px-1.5 pb-1">
            <span className="text-[10.5px] font-mono uppercase tracking-wider font-bold text-stone-500 dark:text-[#a69079]">
              {activeTab === 'notes' ? 'Notes Folders' : 'File Folders'}
            </span>
          </div>

          {(activeTab === 'notes' ? notesFolders : fileFolders).map((folder) => {
            const isSelected =
              activeTab === 'notes'
                ? selectedNotesFolderId === folder.id
                : selectedFilesFolderId === folder.id;
            const isDefault =
              folder.id === DEFAULT_NOTES_FOLDER_ID || folder.id === DEFAULT_FILES_FOLDER_ID;
            const itemCount =
              activeTab === 'notes'
                ? folder.id === DEFAULT_NOTES_FOLDER_ID
                  ? notebooks.length
                  : notebooks.filter((n) => notebookFolderMap[n.id] === folder.id).length
                : folder.id === DEFAULT_FILES_FOLDER_ID
                ? uploadedDocs.length
                : uploadedDocs.filter((d) => d.folderId === folder.id).length;

            return (
              <div
                key={folder.id}
                onClick={() =>
                  activeTab === 'notes'
                    ? setSelectedNotesFolderId(folder.id)
                    : setSelectedFilesFolderId(folder.id)
                }
                className={`group flex items-center justify-between gap-2 px-3 py-2 rounded-xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-[#A47C43]/16 border-[#A47C43]/50 text-stone-900 dark:text-[#f6e8d4] font-semibold shadow-2xs'
                    : 'bg-white/60 dark:bg-[#1c140e]/60 border-stone-200/70 dark:border-[#352317] text-stone-700 dark:text-[#cbb9a3] hover:border-[#A47C43]/35'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <Folder
                    className="w-4 h-4 shrink-0"
                    style={{ color: folder.color, fill: `${folder.color}33` }}
                  />
                  <span className="text-xs truncate">{folder.name}</span>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="text-[10px] font-mono opacity-75 tabular-nums">{itemCount}</span>
                  {!isDefault && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteCustomFolder(folder.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-0.5 text-stone-400 hover:text-red-500 cursor-pointer"
                      title="Delete folder"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </aside>

        {/* Scrollable Viewport-Fitted Explorer Detail List */}
        <div className="flex-1 min-w-0 min-h-0 flex flex-col p-3 sm:p-5 overflow-hidden">
          {activeTab === 'notes' ? (
            filteredNotebooks.length === 0 ? (
              <div className="themed-glass-card max-w-md mx-auto my-auto p-8 rounded-3xl border border-stone-200 dark:border-[#382518] bg-white/80 dark:bg-[#1a120d]/90 text-center space-y-4 shadow-sm">
                <StickyNote className="w-10 h-10 mx-auto text-[#A47C43]" />
                <div className="space-y-1">
                  <h3 className="font-serif font-bold text-base text-stone-900 dark:text-stone-100">
                    No notes in {notesFolders.find((f) => f.id === selectedNotesFolderId)?.name || 'this folder'} yet
                  </h3>
                  <p className="text-xs text-stone-500 dark:text-stone-400">
                    Add notes into this folder from your 3D shelf or recent study files.
                  </p>
                </div>

                {/* Add Note Options: From Shelf or Recent Files */}
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      setAddNoteTab('shelf');
                      setIsAddNoteModalOpen(true);
                    }}
                    className="w-full sm:w-auto themed-accent-btn px-4 py-2.5 rounded-xl bg-[#8f5f2c] hover:bg-[#734a1f] text-white text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer shadow-sm transition-all"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>Add Note (From Shelf)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAddNoteTab('recent');
                      setIsAddNoteModalOpen(true);
                    }}
                    className="w-full sm:w-auto themed-soft-pill px-4 py-2.5 rounded-xl border border-[#A47C43]/40 bg-[#A47C43]/15 hover:bg-[#A47C43]/25 text-[#735222] dark:text-[#e6c38d] text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-all"
                  >
                    <Clock className="w-4 h-4" />
                    <span>Add Note (Recent Files)</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="themed-glass-card flex-1 min-h-0 flex flex-col rounded-2xl border border-stone-200/90 dark:border-[#382518] bg-white/88 dark:bg-[#17100b]/92 overflow-hidden shadow-xs">
                {/* Sticky Explorer Column Header */}
                <div className="shrink-0 grid grid-cols-[36px_minmax(0,1fr)_96px_150px] md:grid-cols-[40px_minmax(220px,2.2fr)_90px_145px_110px_138px] items-center gap-2 px-3 sm:px-4 py-2.5 border-b border-stone-200/90 dark:border-[#362417] bg-stone-100/80 dark:bg-[#22160f]/95 text-[11px] font-mono uppercase tracking-wider font-bold text-stone-600 dark:text-[#b79a79]">
                  <div className="flex items-center justify-center">
                    <button
                      type="button"
                      onClick={toggleSelectAllNotes}
                      aria-label={allNotesSelected ? 'Deselect all notes' : 'Select all notes'}
                      className="p-1 rounded hover:bg-black/5 dark:hover:bg-white/10 cursor-pointer text-[#8f5f2c] dark:text-amber-300"
                    >
                      {allNotesSelected ? (
                        <CheckSquare className="w-4 h-4" />
                      ) : someNotesSelected ? (
                        <MinusSquare className="w-4 h-4" />
                      ) : (
                        <Square className="w-4 h-4 opacity-70" />
                      )}
                    </button>
                  </div>
                  <div>Name &amp; Inner Text</div>
                  <div className="hidden md:block">Type</div>
                  <div className="hidden sm:block">Folder</div>
                  <div className="hidden md:block">Modified</div>
                  <div className="text-right pr-1">Actions</div>
                </div>

                {/* Device-Sized Scrollable Note Detail Rows */}
                <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar divide-y divide-stone-200/75 dark:divide-[#2e1e13]">
                  {filteredNotebooks.map((nb) => {
                    const currentFolderId = notebookFolderMap[nb.id] || DEFAULT_NOTES_FOLDER_ID;
                    const firstPage = nb.pages?.[0];
                    const plainSnippet = stripHtmlPreview(firstPage?.contentHtml);
                    const isChecked = selectedNoteIds.includes(nb.id);

                    return (
                      <div
                        key={nb.id}
                        onClick={() => onOpenNotebook(nb)}
                        className={`grid grid-cols-[36px_minmax(0,1fr)_96px_150px] md:grid-cols-[40px_minmax(220px,2.2fr)_90px_145px_110px_138px] items-center gap-2 px-3 sm:px-4 py-3.5 min-h-[78px] cursor-pointer transition-colors ${
                          isChecked
                            ? 'bg-[#A47C43]/14 dark:bg-[#A47C43]/16'
                            : 'hover:bg-stone-100/70 dark:hover:bg-[#231810]/85'
                        }`}
                      >
                        {/* Tickbox */}
                        <div
                          className="flex items-center justify-center"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            type="button"
                            onClick={() => toggleSelectNote(nb.id)}
                            aria-label={`Select note ${nb.title}`}
                            className="p-1 rounded hover:bg-black/5 dark:hover:bg-white/10 cursor-pointer text-[#8f5f2c] dark:text-amber-300"
                          >
                            {isChecked ? (
                              <CheckSquare className="w-4 h-4" />
                            ) : (
                              <Square className="w-4 h-4 opacity-55" />
                            )}
                          </button>
                        </div>

                        {/* Name + Visible Multi-Line Content Preview */}
                        <div className="flex items-start gap-3 min-w-0">
                          <div
                            className="w-9 h-9 rounded-xl shrink-0 mt-0.5 flex items-center justify-center text-white font-serif font-bold text-sm shadow-2xs"
                            style={{ backgroundColor: nb.coverColor || '#8f5f2c' }}
                          >
                            {(nb.title || 'N').charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0 space-y-0.5">
                            <h3 className="font-serif font-bold text-sm text-stone-900 dark:text-[#f2e6d5] leading-snug">
                              {nb.title}
                            </h3>
                            <p className="text-[11px] font-mono text-stone-500 dark:text-[#a69079]">
                              {nb.subject} · {nb.pages?.length || 1} page(s)
                            </p>
                            {(firstPage?.title || plainSnippet) && (
                              <p className="text-xs text-stone-700 dark:text-[#d5c3ac] line-clamp-2 leading-relaxed">
                                {plainSnippet || firstPage?.title}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Type */}
                        <div className="hidden md:block text-xs font-mono text-stone-600 dark:text-[#bca58b]">
                          Note Sheet
                        </div>

                        {/* Folder Picker */}
                        <div className="hidden sm:block" onClick={(e) => e.stopPropagation()}>
                          <select
                            value={currentFolderId}
                            onChange={(e) => {
                              setNotebookFolder(nb.id, e.target.value);
                              setNotebookFolderMapState(getNotebookFolderMap());
                            }}
                            className="w-full text-[11px] px-2 py-1 rounded-lg bg-stone-100 dark:bg-[#271b13] border border-stone-200 dark:border-[#3b2719] text-stone-700 dark:text-stone-200 outline-none cursor-pointer"
                            title="Move note to folder"
                          >
                            {notesFolders.map((f) => (
                              <option key={f.id} value={f.id}>
                                {f.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Modified */}
                        <div className="hidden md:block text-[11px] font-mono text-stone-500 dark:text-[#a69079] tabular-nums">
                          {formatExplorerDate(nb.updatedAt)}
                        </div>

                        {/* Actions: Share, Download, Delete */}
                        <div
                          className="flex items-center justify-end gap-1"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            type="button"
                            onClick={() =>
                              void triggerShareText(
                                nb.title,
                                `${nb.subject} (${nb.pages?.length || 1} page(s))\n\n${plainSnippet.slice(0, 400)}`
                              )
                            }
                            className="p-1.5 rounded-lg text-stone-600 dark:text-stone-300 hover:text-[#8f5f2c] dark:hover:text-amber-300 hover:bg-stone-200/70 dark:hover:bg-[#2a1c13] cursor-pointer transition-colors"
                            title="Share note"
                            aria-label={`Share ${nb.title}`}
                          >
                            <Share2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => triggerDownloadNote(nb)}
                            className="p-1.5 rounded-lg text-stone-600 dark:text-stone-300 hover:text-[#8f5f2c] dark:hover:text-amber-300 hover:bg-stone-200/70 dark:hover:bg-[#2a1c13] cursor-pointer transition-colors"
                            title="Download note"
                            aria-label={`Download ${nb.title}`}
                          >
                            <Download className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (onDeleteNotebook) {
                                onDeleteNotebook(nb.id);
                                setSelectedNoteIds((prev) => prev.filter((x) => x !== nb.id));
                                flashBanner(`Moved "${nb.title}" to Recycle Bin.`);
                              } else {
                                flashBanner('Open Note Shelf to delete this notebook.');
                              }
                            }}
                            className="p-1.5 rounded-lg text-stone-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-500/10 cursor-pointer transition-colors"
                            title="Delete note"
                            aria-label={`Delete ${nb.title}`}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )
          ) : (
            <div className="flex-1 min-h-0 flex flex-col space-y-4 overflow-hidden">
              {filteredDocs.length === 0 && uploadedWorkspaceBooks.length === 0 ? (
                <div className="themed-glass-card max-w-md mx-auto my-auto p-8 rounded-3xl border border-stone-200 dark:border-[#382518] bg-white/80 dark:bg-[#1a120d]/90 text-center space-y-3">
                  <UploadCloud className="w-10 h-10 mx-auto text-[#A47C43]" />
                  <h3 className="font-serif font-bold text-base text-stone-900 dark:text-stone-100">
                    No PDFs or files uploaded yet
                  </h3>
                  <p className="text-xs text-stone-500 dark:text-stone-400">
                    All PDFs, Word docs, Excel sheets, CSVs, and images uploaded across Read Studio,
                    Calendar Roster Scanner, and Library are stored right here.
                  </p>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="themed-accent-btn px-4 py-2 rounded-xl bg-[#8f5f2c] text-white text-xs font-semibold cursor-pointer"
                  >
                    + Upload PDF / File
                  </button>
                </div>
              ) : (
                <div className="themed-glass-card flex-1 min-h-0 flex flex-col rounded-2xl border border-stone-200/90 dark:border-[#382518] bg-white/88 dark:bg-[#17100b]/92 overflow-hidden shadow-xs">
                  {/* Sticky File Explorer Column Header */}
                  <div className="shrink-0 grid grid-cols-[36px_minmax(0,1fr)_148px] md:grid-cols-[40px_minmax(220px,2.2fr)_80px_135px_125px_156px] items-center gap-2 px-3 sm:px-4 py-2.5 border-b border-stone-200/90 dark:border-[#362417] bg-stone-100/80 dark:bg-[#22160f]/95 text-[11px] font-mono uppercase tracking-wider font-bold text-stone-600 dark:text-[#b79a79]">
                    <div className="flex items-center justify-center">
                      <button
                        type="button"
                        onClick={toggleSelectAllFiles}
                        aria-label={allFilesSelected ? 'Deselect all files' : 'Select all files'}
                        className="p-1 rounded hover:bg-black/5 dark:hover:bg-white/10 cursor-pointer text-[#8f5f2c] dark:text-amber-300"
                      >
                        {allFilesSelected ? (
                          <CheckSquare className="w-4 h-4" />
                        ) : someFilesSelected ? (
                          <MinusSquare className="w-4 h-4" />
                        ) : (
                          <Square className="w-4 h-4 opacity-70" />
                        )}
                      </button>
                    </div>
                    <div>File Name &amp; Details</div>
                    <div className="hidden md:block">Type</div>
                    <div className="hidden md:block">Folder</div>
                    <div className="hidden md:block">Size · Date</div>
                    <div className="text-right pr-1">Actions</div>
                  </div>

                  {/* Viewport-Fitted Scrollable Explorer List */}
                  <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar divide-y divide-stone-200/75 dark:divide-[#2e1e13]">
                    {filteredDocs.map((doc) => {
                      const currentFolder = fileFolders.find(
                        (f) => f.id === (doc.folderId || DEFAULT_FILES_FOLDER_ID)
                      );
                      const isMenuOpen = openMenuDocId === doc.id;
                      const isMoving = movingDocId === doc.id;
                      const isChecked = selectedFileIds.includes(doc.id);

                      return (
                        <div
                          key={doc.id}
                          onClick={() => {
                            setOpenMenuDocId(null);
                            handleSingleClickDoc(doc);
                          }}
                          className={`relative grid grid-cols-[36px_minmax(0,1fr)_148px] md:grid-cols-[40px_minmax(220px,2.2fr)_80px_135px_125px_156px] items-center gap-2 px-3 sm:px-4 py-3 min-h-[68px] cursor-pointer transition-colors ${
                            isChecked
                              ? 'bg-[#A47C43]/14 dark:bg-[#A47C43]/16'
                              : 'hover:bg-stone-100/70 dark:hover:bg-[#231810]/85'
                          }`}
                        >
                          {/* Multi-Select Checkbox */}
                          <div
                            className="flex items-center justify-center"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button
                              type="button"
                              onClick={() => toggleSelectFile(doc.id)}
                              aria-label={`Select file ${doc.title || doc.fileName}`}
                              className="p-1 rounded hover:bg-black/5 dark:hover:bg-white/10 cursor-pointer text-[#8f5f2c] dark:text-amber-300"
                            >
                              {isChecked ? (
                                <CheckSquare className="w-4 h-4" />
                              ) : (
                                <Square className="w-4 h-4 opacity-55" />
                              )}
                            </button>
                          </div>

                          {/* Icon + Detail Name + Preview */}
                          <div className="flex items-start gap-3 min-w-0">
                            <div className="w-9 h-9 rounded-xl bg-amber-500/12 border border-amber-500/25 flex items-center justify-center shrink-0 mt-0.5">
                              {renderFileIcon(doc.ext)}
                            </div>
                            <div className="min-w-0 space-y-0.5">
                              <h3 className="font-serif font-bold text-sm text-stone-900 dark:text-[#f2e6d5] truncate">
                                {doc.title || doc.fileName}
                              </h3>
                              <p className="text-[11px] font-mono text-stone-500 dark:text-[#a69079] truncate">
                                {doc.fileName} · {doc.subject}
                              </p>
                              {(doc.extractedTables?.length || 0) > 0 && (
                                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-500/12 px-1.5 py-0.5 rounded">
                                  <Table2 className="w-3 h-3" />
                                  {doc.extractedTables!.length} Table(s)
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Type */}
                          <div className="hidden md:block text-xs font-mono font-semibold text-stone-600 dark:text-[#cbb9a3]">
                            {doc.ext.toUpperCase()}
                          </div>

                          {/* Folder */}
                          <div className="hidden md:flex items-center gap-1.5 text-xs text-stone-700 dark:text-[#cbb9a3] min-w-0">
                            <Folder className="w-3.5 h-3.5 shrink-0 text-[#A47C43]" />
                            <span className="truncate">{currentFolder?.name || 'Recent Files'}</span>
                          </div>

                          {/* Size & Date */}
                          <div className="hidden md:block text-[11px] font-mono text-stone-500 dark:text-[#a69079] tabular-nums">
                            <div>{doc.sizeLabel}</div>
                            <div className="text-[10px] opacity-80">{formatExplorerDate(doc.uploadedAt)}</div>
                          </div>

                          {/* Row Actions: Share, Download, Delete & 3-Dots Move Menu */}
                          <div
                            className="flex items-center justify-end gap-1 relative"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button
                              type="button"
                              onClick={() =>
                                void triggerShareText(
                                  doc.title || doc.fileName,
                                  `File: ${doc.fileName} (${doc.ext.toUpperCase()} · ${doc.sizeLabel})\nSubject: ${doc.subject}\n\n${(
                                    doc.extractedText || ''
                                  ).slice(0, 300)}`
                                )
                              }
                              className="p-1.5 rounded-lg text-stone-600 dark:text-stone-300 hover:text-[#8f5f2c] dark:hover:text-amber-300 hover:bg-stone-200/70 dark:hover:bg-[#2a1c13] cursor-pointer"
                              title="Share file"
                              aria-label={`Share ${doc.title}`}
                            >
                              <Share2 className="w-3.5 h-3.5" />
                            </button>

                            <button
                              type="button"
                              onClick={() => triggerDownloadFile(doc)}
                              className="p-1.5 rounded-lg text-stone-600 dark:text-stone-300 hover:text-[#8f5f2c] dark:hover:text-amber-300 hover:bg-stone-200/70 dark:hover:bg-[#2a1c13] cursor-pointer"
                              title={`Save to Device (${destLabel})`}
                              aria-label={`Save ${doc.title} to device`}
                            >
                              <Download className="w-3.5 h-3.5" />
                            </button>

                            <button
                              type="button"
                              onClick={() => void triggerOpenDriveUpload(doc)}
                              className="p-1.5 rounded-lg text-stone-600 dark:text-stone-300 hover:text-[#8f5f2c] dark:hover:text-amber-300 hover:bg-stone-200/70 dark:hover:bg-[#2a1c13] cursor-pointer"
                              title="Upload to Cloud Drive"
                              aria-label={`Upload ${doc.title} to Drive`}
                            >
                              <UploadCloud className="w-3.5 h-3.5" />
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                deleteUploadedDocument(doc.id);
                                setUploadedDocs(getUploadedDocuments());
                                setSelectedFileIds((prev) => prev.filter((x) => x !== doc.id));
                                flashBanner(`Deleted "${doc.title || doc.fileName}".`);
                              }}
                              className="p-1.5 rounded-lg text-stone-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-500/10 cursor-pointer"
                              title="Delete file"
                              aria-label={`Delete ${doc.title}`}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>

                            <div className="relative">
                              <button
                                type="button"
                                onClick={() => {
                                  setMovingDocId(null);
                                  setOpenMenuDocId(isMenuOpen ? null : doc.id);
                                }}
                                className="p-1.5 rounded-lg text-stone-500 hover:text-stone-900 dark:text-stone-300 dark:hover:text-white hover:bg-stone-200/70 dark:hover:bg-[#2b1d14] cursor-pointer transition-colors"
                                title="Open or Move to Folder"
                                aria-label="More options"
                              >
                                <MoreVertical className="w-3.5 h-3.5" />
                              </button>

                              {isMenuOpen && (
                                <div className="absolute right-0 top-9 z-30 w-52 rounded-xl bg-[#fcfaf7] dark:bg-[#1a120d] border border-stone-200 dark:border-[#3b281a] shadow-2xl p-1.5 space-y-0.5 text-xs">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setOpenMenuDocId(null);
                                      handleSingleClickDoc(doc);
                                    }}
                                    className="w-full px-2.5 py-1.5 rounded-lg text-left hover:bg-stone-100 dark:hover:bg-[#281b12] flex items-center gap-2 text-stone-800 dark:text-stone-100 cursor-pointer"
                                  >
                                    <Eye className="w-3.5 h-3.5 text-[#A47C43]" />
                                    <span>Open in Web View</span>
                                  </button>

                                  {onOpenInRead && (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setOpenMenuDocId(null);
                                        onOpenInRead(doc);
                                      }}
                                      className="w-full px-2.5 py-1.5 rounded-lg text-left hover:bg-stone-100 dark:hover:bg-[#281b12] flex items-center gap-2 text-stone-800 dark:text-stone-100 cursor-pointer"
                                    >
                                      <BookOpen className="w-3.5 h-3.5 text-[#A47C43]" />
                                      <span>Open in Read Studio</span>
                                    </button>
                                  )}

                                  <button
                                    type="button"
                                    onClick={() => {
                                      setOpenMenuDocId(null);
                                      void triggerDownloadFile(doc);
                                    }}
                                    className="w-full px-2.5 py-1.5 rounded-lg text-left hover:bg-stone-100 dark:hover:bg-[#281b12] flex items-center gap-2 text-stone-800 dark:text-stone-100 cursor-pointer"
                                  >
                                    <Download className="w-3.5 h-3.5 text-[#A47C43]" />
                                    <span>Save to Device</span>
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => {
                                      setOpenMenuDocId(null);
                                      void triggerOpenDriveUpload(doc);
                                    }}
                                    className="w-full px-2.5 py-1.5 rounded-lg text-left hover:bg-stone-100 dark:hover:bg-[#281b12] flex items-center gap-2 text-stone-800 dark:text-stone-100 cursor-pointer"
                                  >
                                    <UploadCloud className="w-3.5 h-3.5 text-[#A47C43]" />
                                    <span>Upload to Drive</span>
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => setMovingDocId(isMoving ? null : doc.id)}
                                    className="w-full px-2.5 py-1.5 rounded-lg text-left hover:bg-stone-100 dark:hover:bg-[#281b12] flex items-center justify-between text-stone-800 dark:text-stone-100 cursor-pointer"
                                  >
                                    <span className="flex items-center gap-2">
                                      <FolderInput className="w-3.5 h-3.5 text-[#A47C43]" />
                                      <span>Move to Folder</span>
                                    </span>
                                    <span className="text-[10px] opacity-60">▾</span>
                                  </button>

                                  {isMoving && (
                                    <div className="mx-1 my-1 p-1 rounded-lg bg-stone-100/80 dark:bg-[#120c08] border border-stone-200/80 dark:border-[#352317] space-y-0.5 max-h-36 overflow-y-auto custom-scrollbar">
                                      {fileFolders.map((f) => {
                                        const activeFolder =
                                          (doc.folderId || DEFAULT_FILES_FOLDER_ID) === f.id;
                                        return (
                                          <button
                                            key={f.id}
                                            type="button"
                                            onClick={() => {
                                              updateUploadedDocumentFolder(doc.id, f.id);
                                              setUploadedDocs(getUploadedDocuments());
                                              setMovingDocId(null);
                                              setOpenMenuDocId(null);
                                              flashBanner(`Moved "${doc.title}" to "${f.name}".`);
                                            }}
                                            className={`w-full px-2 py-1 rounded-md text-left text-[11px] flex items-center gap-1.5 cursor-pointer ${
                                              activeFolder
                                                ? 'bg-[#A47C43]/20 font-bold text-[#7c4d1e] dark:text-amber-200'
                                                : 'hover:bg-white dark:hover:bg-[#231810] text-stone-700 dark:text-stone-300'
                                            }`}
                                          >
                                            <Folder
                                              className="w-3 h-3 shrink-0"
                                              style={{ color: f.color }}
                                            />
                                            <span className="truncate">{f.name}</span>
                                          </button>
                                        );
                                      })}
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}

                    {/* Attached Shelf / Drive Textbooks Inside Scrollable Detail List */}
                    {uploadedWorkspaceBooks.length > 0 &&
                      selectedFilesFolderId === DEFAULT_FILES_FOLDER_ID && (
                        <>
                          <div className="px-4 py-2 bg-stone-100/65 dark:bg-[#20150e]/85 text-[10.5px] font-mono uppercase tracking-wider font-bold text-stone-500 dark:text-[#a69079]">
                            Drive &amp; Attached Textbooks ({uploadedWorkspaceBooks.length})
                          </div>
                          {uploadedWorkspaceBooks.map((bk) => {
                            const synth: UploadedDocumentRecord = {
                              id: bk.id,
                              title: bk.title,
                              fileName: `${bk.title}.pdf`,
                              ext: 'pdf',
                              mimeType: bk.mimeType || 'application/pdf',
                              sizeBytes: bk.fileSizeBytes || 0,
                              sizeLabel: bk.edition || 'PDF',
                              source: 'library',
                              subject: bk.subject,
                              folderId: DEFAULT_FILES_FOLDER_ID,
                              uploadedAt: bk.updatedAt || new Date().toISOString(),
                              lastOpenedAt: new Date().toISOString(),
                              pdfFileUrl: bk.pdfFileUrl,
                              driveFileId: bk.driveFileId,
                              extractedText: bk.pages
                                ?.map((p) => `${p.title}\n${p.summaryPearl}`)
                                .join('\n\n'),
                            };

                            return (
                              <div
                                key={bk.id}
                                onClick={() =>
                                  onOpenInRead ? onOpenInRead(synth) : setPreviewDoc(synth)
                                }
                                className="grid grid-cols-[36px_minmax(0,1fr)_148px] md:grid-cols-[40px_minmax(220px,2.2fr)_80px_135px_125px_156px] items-center gap-2 px-3 sm:px-4 py-3 min-h-[64px] cursor-pointer hover:bg-stone-100/70 dark:hover:bg-[#231810]/85 transition-colors"
                              >
                                <div className="flex items-center justify-center">
                                  <BookOpen className="w-4 h-4 text-[#A47C43]" />
                                </div>
                                <div className="min-w-0">
                                  <div className="font-serif text-sm font-bold text-stone-900 dark:text-stone-100 truncate">
                                    {bk.title}
                                  </div>
                                  <div className="text-[11px] font-mono text-stone-500 truncate">
                                    {bk.subject} · Attached Textbook
                                  </div>
                                </div>
                                <div className="hidden md:block text-xs font-mono text-stone-600 dark:text-[#cbb9a3]">
                                  PDF
                                </div>
                                <div className="hidden md:block text-xs text-stone-500 truncate">
                                  Shelf Vault
                                </div>
                                <div className="hidden md:block text-[11px] font-mono text-stone-500 tabular-nums">
                                  {bk.edition || 'Book'}
                                </div>
                                <div
                                  className="flex items-center justify-end gap-1"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <button
                                    type="button"
                                    onClick={() =>
                                      void triggerShareText(
                                        bk.title,
                                        `Attached Textbook: ${bk.title} (${bk.subject})`
                                      )
                                    }
                                    className="p-1.5 rounded-lg text-stone-600 dark:text-stone-300 hover:text-[#8f5f2c] hover:bg-stone-200/70 dark:hover:bg-[#2a1c13] cursor-pointer"
                                    title="Share textbook"
                                  >
                                    <Share2 className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => triggerDownloadFile(synth)}
                                    className="p-1.5 rounded-lg text-stone-600 dark:text-stone-300 hover:text-[#8f5f2c] hover:bg-stone-200/70 dark:hover:bg-[#2a1c13] cursor-pointer"
                                    title={`Save to Device (${destLabel})`}
                                  >
                                    <Download className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => void triggerOpenDriveUpload(synth)}
                                    className="p-1.5 rounded-lg text-stone-600 dark:text-stone-300 hover:text-[#8f5f2c] hover:bg-stone-200/70 dark:hover:bg-[#2a1c13] cursor-pointer"
                                    title="Upload to Drive"
                                  >
                                    <UploadCloud className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      onOpenInRead ? onOpenInRead(synth) : setPreviewDoc(synth)
                                    }
                                    className="p-1.5 rounded-lg text-stone-500 hover:text-[#8f5f2c] hover:bg-stone-200/70 dark:hover:bg-[#2a1c13] cursor-pointer"
                                    title="Open textbook"
                                  >
                                    <ExternalLink className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </>
                      )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* New Folder Modal */}
      {isNewFolderOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
          onClick={() => setIsNewFolderOpen(false)}
        >
          <form
            onSubmit={handleCreateFolder}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm rounded-2xl bg-[#faf6ee] dark:bg-[#1a120d] border border-[#d6c7b0] dark:border-[#382518] p-5 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-serif font-bold text-base text-stone-900 dark:text-stone-100">
                Create {activeTab === 'notes' ? 'Notes Folder' : 'Files Folder'}
              </h3>
              <button
                type="button"
                onClick={() => setIsNewFolderOpen(false)}
                className="p-1 text-stone-400 hover:text-stone-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                Folder Name
              </label>
              <input
                type="text"
                autoFocus
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                placeholder={activeTab === 'notes' ? 'e.g. Pharmacology Revision' : 'e.g. Ward Rosters & PDFs'}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-[#3d291c] bg-white dark:bg-[#120c08] text-xs text-stone-900 dark:text-stone-100 outline-none focus:border-[#A47C43]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
                Folder Accent
              </label>
              <div className="flex items-center gap-2">
                {FOLDER_PALETTE.map((hex) => (
                  <button
                    key={hex}
                    type="button"
                    data-swatch="true"
                    onClick={() => setNewFolderColor(hex)}
                    className={`w-6 h-6 rounded-full cursor-pointer transition-transform ${
                      newFolderColor === hex ? 'scale-115 ring-2 ring-amber-400 ring-offset-1' : ''
                    }`}
                    style={{ backgroundColor: hex }}
                  />
                ))}
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setIsNewFolderOpen(false)}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold text-stone-600 dark:text-stone-300 hover:bg-stone-200/60 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="themed-accent-btn px-4 py-1.5 rounded-xl bg-[#8f5f2c] text-white text-xs font-semibold cursor-pointer"
              >
                Create Folder
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Unified Web View Window with Top Ribbon: Share, Save to Device, Mark Favourite */}
      <WebViewDocumentModal
        doc={
          previewDoc
            ? ({
                id: previewDoc.id,
                title: previewDoc.title || previewDoc.fileName,
                fileName: previewDoc.fileName,
                ext: previewDoc.ext,
                mimeType: previewDoc.mimeType,
                subject: previewDoc.subject,
                badge: previewDoc.ext?.toUpperCase() || 'PDF',
                dataUrl: previewDoc.dataUrl,
                pdfFileUrl: previewDoc.pdfFileUrl,
                driveFileId: previewDoc.driveFileId,
                extractedText: previewDoc.extractedText,
                extractedTables: previewDoc.extractedTables,
              } as WebViewDocPayload)
            : null
        }
        onClose={() => setPreviewDoc(null)}
        onOpenInRead={
          onOpenInRead && previewDoc
            ? () => {
                onOpenInRead(previewDoc);
                setPreviewDoc(null);
              }
            : undefined
        }
      />

      {isDestModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
          onClick={() => setIsDestModalOpen(false)}
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              void chooseDeviceDestinationFolder(destInputDraft).then((res) => {
                setDestLabel(res.label);
                setIsDestModalOpen(false);
                flashBanner(`Device save destination set to "${res.label}"`);
              });
            }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-2xl bg-[#faf6ee] dark:bg-[#1a120d] border border-[#d6c7b0] dark:border-[#382518] p-5 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-serif font-bold text-base text-stone-900 dark:text-stone-100">
                Change Device Save Destination
              </h3>
              <button
                type="button"
                onClick={() => setIsDestModalOpen(false)}
                className="p-1 text-stone-400 hover:text-stone-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-stone-600 dark:text-stone-300">
              Default folder across Windows, Mac, Android &amp; iOS is <strong>Ach1ev/Documents</strong>. Enter any preferred folder path label below:
            </p>
            <input
              type="text"
              value={destInputDraft}
              onChange={(e) => setDestInputDraft(e.target.value)}
              placeholder="e.g. Documents/Ach1ev/Documents"
              className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-[#3d291c] bg-white dark:bg-[#120c08] text-xs font-mono text-stone-900 dark:text-stone-100 outline-none focus:border-[#A47C43]"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsDestModalOpen(false)}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold text-stone-600 dark:text-stone-300 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="themed-accent-btn px-4 py-1.5 rounded-xl bg-[#8f5f2c] text-white text-xs font-semibold cursor-pointer"
              >
                Save Destination
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ADD NOTE MODAL: FROM SHELF OR RECENT FILES */}
      {isAddNoteModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => setIsAddNoteModalOpen(false)}
        >
          <div
            className={`w-full ${addNoteTab === 'shelf' ? 'max-w-4xl' : 'max-w-xl'} max-h-[88vh] rounded-3xl bg-[#faf6ee] dark:bg-[#1a120d] border border-[#d6c7b0] dark:border-[#382518] p-5 sm:p-6 shadow-2xl flex flex-col space-y-4 overflow-hidden transition-all`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-[#382518] shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#A47C43]/20 text-[#8f5f2c] dark:text-amber-300 flex items-center justify-center border border-[#A47C43]/40">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base text-stone-900 dark:text-stone-100">
                    Add Note to {notesFolders.find((f) => f.id === selectedNotesFolderId)?.name || 'Folder'}
                  </h3>
                  <p className="text-xs text-stone-500 dark:text-stone-400">
                    Choose from your 3D Shelf or Recent Files to add as a note
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAddNoteModalOpen(false)}
                className="p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Segmented Option Tabs: From Shelf vs Recent Files */}
            <div className="grid grid-cols-2 gap-2 p-1 rounded-2xl bg-stone-200/60 dark:bg-[#251a14] shrink-0">
              <button
                type="button"
                onClick={() => setAddNoteTab('shelf')}
                className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  addNoteTab === 'shelf'
                    ? 'bg-white dark:bg-[#150f0c] text-[#8f5f2c] dark:text-amber-300 shadow-xs'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>From Shelf</span>
              </button>
              <button
                type="button"
                onClick={() => setAddNoteTab('recent')}
                className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  addNoteTab === 'recent'
                    ? 'bg-white dark:bg-[#150f0c] text-[#8f5f2c] dark:text-amber-300 shadow-xs'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
                }`}
              >
                <Clock className="w-4 h-4" />
                <span>Recent Files</span>
              </button>
            </div>

            {/* Filter Search Input (for Recent Files tab) */}
            {addNoteTab === 'recent' && (
              <div className="relative shrink-0">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="text"
                  placeholder="Filter recent files & documents..."
                  value={addNoteFilter}
                  onChange={(e) => setAddNoteFilter(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-stone-300 dark:border-[#382518] bg-white dark:bg-[#120c08] text-xs text-stone-900 dark:text-stone-100 outline-none focus:border-[#A47C43]"
                />
              </div>
            )}

            {/* List of Items or Day-Mode Almirahs Interface */}
            <div className="flex-1 min-h-[300px] overflow-y-auto custom-scrollbar space-y-2 pr-1">
              {addNoteTab === 'shelf' ? (
                <div className="rounded-2xl bg-[#fdfaf4] text-[#1c140e] p-2">
                  <ShelfRoom
                    almirahsOnly
                    nightMode={false}
                    notebooks={notebooks}
                    driveBooks={books}
                    onSelectBook={(b) =>
                      handleAddNoteToFolder({
                        id: `shelf-book-${b.id}`,
                        refId: b.id,
                        title: b.title,
                        source: 'shelf-book',
                        coverColor: b.thumbnail?.bgColor || '#8f5f2c',
                      })
                    }
                  />
                </div>
              ) : (
                (() => {
                  const items = getRecentItems().filter((item) =>
                    !addNoteFilter || item.title.toLowerCase().includes(addNoteFilter.toLowerCase())
                  );
                  if (items.length === 0) {
                    return (
                      <div className="py-12 text-center text-xs text-stone-500 dark:text-stone-400 space-y-2">
                        <Clock className="w-8 h-8 mx-auto opacity-40 text-[#A47C43]" />
                        <p>No matching recent study files found.</p>
                      </div>
                    );
                  }
                  return items.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => handleAddNoteToFolder(item)}
                      className="p-3 rounded-2xl border border-stone-200 dark:border-[#332216] bg-white/70 dark:bg-[#160f0b]/80 hover:bg-[#A47C43]/10 dark:hover:bg-[#A47C43]/15 transition-colors flex items-center justify-between gap-3 cursor-pointer group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-11 rounded-lg shrink-0 flex items-center justify-center bg-stone-100 dark:bg-[#251a14] border border-stone-200 dark:border-[#3d291c] text-[#8f5f2c] dark:text-amber-300">
                          {item.kind === 'note' ? <StickyNote className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-xs font-semibold text-stone-900 dark:text-stone-100 truncate group-hover:text-[#8f5f2c] dark:group-hover:text-amber-300">
                            {item.title}
                          </h4>
                          <p className="text-[11px] text-stone-500 dark:text-stone-400 truncate">
                            {item.subtitle || ''}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddNoteToFolder(item);
                        }}
                        className="shrink-0 px-3 py-1.5 rounded-xl bg-[#8f5f2c] text-white text-[11px] font-semibold cursor-pointer hover:bg-[#734a1f] transition-all flex items-center gap-1 shadow-xs"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add</span>
                      </button>
                    </div>
                  ));
                })()
              )}
            </div>

            {/* Modal Footer */}
            <div className="pt-2 border-t border-stone-200 dark:border-[#382518] flex items-center justify-between shrink-0">
              <span className="text-[11px] text-stone-500 dark:text-stone-400">
                Clicking Add immediately links the note to {notesFolders.find((f) => f.id === selectedNotesFolderId)?.name || 'this folder'}
              </span>
              <button
                type="button"
                onClick={() => setIsAddNoteModalOpen(false)}
                className="px-4 py-1.5 rounded-xl text-xs font-semibold text-stone-600 dark:text-stone-300 hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <CloudDriveSaveModal
        file={cloudDriveFile}
        onClose={() => setCloudDriveFile(null)}
        onUploaded={() => flashBanner('Uploaded to Google Drive')}
      />
    </div>
  );
};

export default LibraryWorkspaceView;
