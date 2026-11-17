import React, { useState, useEffect, useRef } from 'react';
import { MedicalBook, Notebook, SubjectCourse } from '../../types';
import {
  DEFAULT_FILES_FOLDER_ID,
  DEFAULT_NOTES_FOLDER_ID,
  LibraryFolderItem,
  UploadedDocumentRecord,
  addUploadedDocument,
  deleteUploadedDocument,
  getLibraryFolders,
  getNotebookFolderMap,
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
} from 'lucide-react';
import { WebViewDocumentModal, WebViewDocPayload } from '../common/WebViewDocumentModal';
import { getPlanLimits, openSubscriptionUpgradeModal } from '../../utils/subscriptionLimits';

interface LibraryWorkspaceViewProps {
  notebooks: Notebook[];
  books: MedicalBook[];
  currentSubject: SubjectCourse;
  onOpenNotebook: (nb: Notebook) => void;
  onCreateBlankNote: () => void;
  onAddBook?: (book: MedicalBook) => void;
  onOpenInRead?: (doc: UploadedDocumentRecord) => void;
}

const FOLDER_PALETTE = ['#A47C43', '#7c4521', '#2e5f5a', '#4f46e5', '#9333ea', '#b45309'];

export const LibraryWorkspaceView: React.FC<LibraryWorkspaceViewProps> = ({
  notebooks,
  books,
  currentSubject,
  onOpenNotebook,
  onCreateBlankNote,
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

  // Create folder dialog state
  const [isNewFolderOpen, setIsNewFolderOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [newFolderColor, setNewFolderColor] = useState(FOLDER_PALETTE[0]);

  // Upload & preview state
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [previewDoc, setPreviewDoc] = useState<UploadedDocumentRecord | null>(null);
  const [openMenuDocId, setOpenMenuDocId] = useState<string | null>(null);
  const [movingDocId, setMovingDocId] = useState<string | null>(null);

  useEffect(() => {
    const syncAll = () => {
      setFolders(getLibraryFolders());
      setUploadedDocs(getUploadedDocuments());
      setNotebookFolderMapState(getNotebookFolderMap());
    };
    window.addEventListener('achiev_uploaded_files_changed', syncAll);
    window.addEventListener('achiev_recent_files_changed', syncAll);
    window.addEventListener('storage', syncAll);
    return () => {
      window.removeEventListener('achiev_uploaded_files_changed', syncAll);
      window.removeEventListener('achiev_recent_files_changed', syncAll);
      window.removeEventListener('storage', syncAll);
    };
  }, []);

  const notesFolders = folders.filter((f) => f.kind === 'notes');
  const fileFolders = folders.filter((f) => f.kind === 'files');

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
    setUploadStatus(`Processing "${file.name}"...`);

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
    } catch (err) {
      console.warn('Library file scan skipped:', err);
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
    registerSessionFileUrl(record.id, localUrl);

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
    setUploadStatus(
      extractedTables.length > 0
        ? `Saved "${file.name}" (${extractedTables.length} table(s) extracted).`
        : `Saved "${file.name}" to Recent Files.`
    );
    setIsUploading(false);
    setTimeout(() => setUploadStatus(null), 4000);
  };

  const handleSingleClickDoc = (doc: UploadedDocumentRecord) => {
    touchUploadedDocument(doc.id);
    setUploadedDocs(getUploadedDocuments());
    setPreviewDoc(doc);
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

  return (
    <div className="themed-workspace-surface flex-1 h-full w-full overflow-hidden flex flex-col bg-transparent">
      {/* Top Library Header & Switcher */}
      <header className="themed-glass-bar shrink-0 px-4 sm:px-6 py-3 border-b border-stone-200/80 dark:border-[#382518] bg-white/75 dark:bg-[#160f0a]/85 backdrop-blur-md flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#A47C43]/15 border border-[#A47C43]/30 flex items-center justify-center text-[#7c5321] dark:text-amber-300">
            <FolderOpen className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-serif font-bold text-base sm:text-lg text-stone-900 dark:text-[#efe4d4] leading-tight">
              Library
            </h1>
            <p className="text-[11px] text-stone-500 dark:text-[#b29980]">
              Organized Notes Folders · Centralized PDFs, Word, Excel &amp; Scanned Files
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
              <span>Notes Folders ({notebooks.length})</span>
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
              placeholder={activeTab === 'notes' ? 'Search notes...' : 'Search recent files...'}
              className="pl-8 pr-3 py-1.5 rounded-xl border border-stone-200 dark:border-[#382518] bg-white/90 dark:bg-[#1a120d] text-xs text-stone-800 dark:text-stone-100 outline-none focus:border-[#A47C43] w-44 sm:w-52"
            />
          </div>

          <button
            type="button"
            onClick={() => setIsNewFolderOpen(true)}
            className="themed-soft-pill px-3 py-1.5 rounded-xl border border-[#A47C43]/35 bg-[#A47C43]/12 hover:bg-[#A47C43]/22 text-[#735222] dark:text-[#e6c38d] text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
          >
            <FolderPlus className="w-3.5 h-3.5" />
            <span>New Folder</span>
          </button>

          {activeTab === 'notes' ? (
            <button
              type="button"
              onClick={onCreateBlankNote}
              className="themed-accent-btn px-3 py-1.5 rounded-xl bg-[#8f5f2c] hover:bg-[#734a1f] text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Note</span>
            </button>
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

      {uploadStatus && (
        <div className="mx-4 sm:mx-6 mt-3 px-3.5 py-2 rounded-xl bg-amber-50 dark:bg-amber-950/45 border border-amber-300/60 dark:border-amber-700/50 text-xs text-amber-900 dark:text-amber-200 flex items-center justify-between">
          <span>{uploadStatus}</span>
          <button
            type="button"
            onClick={() => setUploadStatus(null)}
            className="p-0.5 opacity-70 hover:opacity-100 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Split Workspace: Left Folder Rail + Right Cards Grid */}
      <div className="flex-1 min-h-0 flex flex-col md:flex-row overflow-hidden">
        {/* Folders Column */}
        <aside className="md:w-60 shrink-0 border-b md:border-b-0 md:border-r border-stone-200/80 dark:border-[#382518] bg-white/45 dark:bg-[#140d09]/65 p-3 overflow-y-auto custom-scrollbar space-y-2">
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
                  <span className="text-[10px] font-mono opacity-75">{itemCount}</span>
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

        {/* Main Content Grid */}
        <div className="flex-1 min-w-0 overflow-y-auto custom-scrollbar p-4 sm:p-6 space-y-6">
          {activeTab === 'notes' ? (
            filteredNotebooks.length === 0 ? (
              <div className="themed-glass-card max-w-md mx-auto mt-10 p-8 rounded-3xl border border-stone-200 dark:border-[#382518] bg-white/80 dark:bg-[#1a120d]/90 text-center space-y-3">
                <StickyNote className="w-10 h-10 mx-auto text-[#A47C43]" />
                <h3 className="font-serif font-bold text-base text-stone-900 dark:text-stone-100">
                  No notes in this folder yet
                </h3>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  Create a new note or move any saved note into this folder.
                </p>
                <button
                  type="button"
                  onClick={onCreateBlankNote}
                  className="themed-accent-btn px-4 py-2 rounded-xl bg-[#8f5f2c] text-white text-xs font-semibold cursor-pointer"
                >
                  + Create Note
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {filteredNotebooks.map((nb) => {
                  const currentFolderId = notebookFolderMap[nb.id] || DEFAULT_NOTES_FOLDER_ID;
                  const firstPage = nb.pages?.[0];
                  return (
                    <div
                      key={nb.id}
                      onClick={() => onOpenNotebook(nb)}
                      className="themed-glass-card group p-4 rounded-2xl border border-stone-200/90 dark:border-[#382518] bg-white/85 dark:bg-[#1c130d]/90 hover:border-[#A47C43] shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between gap-3"
                    >
                      <div className="flex items-start justify-between gap-2.5">
                        <div className="flex items-start gap-2.5 min-w-0">
                          <div
                            className="w-9 h-9 rounded-xl shrink-0 flex items-center justify-center text-white font-serif font-bold text-sm shadow-xs"
                            style={{ backgroundColor: nb.coverColor || '#8f5f2c' }}
                          >
                            {(nb.title || 'N').charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <h3 className="font-serif font-bold text-sm text-stone-900 dark:text-[#f2e6d5] truncate group-hover:text-[#8f5f2c] dark:group-hover:text-amber-300">
                              {nb.title}
                            </h3>
                            <p className="text-[11px] font-mono text-stone-500 dark:text-[#a69079] truncate">
                              {nb.subject} · {nb.pages?.length || 1} page(s)
                            </p>
                          </div>
                        </div>
                      </div>

                      {firstPage?.title && (
                        <p className="text-xs text-stone-600 dark:text-[#cbb9a3] line-clamp-2">
                          {firstPage.title}
                        </p>
                      )}

                      <div
                        className="pt-2 border-t border-stone-100 dark:border-[#312015] flex items-center justify-between gap-2"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <select
                          value={currentFolderId}
                          onChange={(e) => {
                            setNotebookFolder(nb.id, e.target.value);
                            setNotebookFolderMapState(getNotebookFolderMap());
                          }}
                          className="text-[10.5px] px-2 py-1 rounded-lg bg-stone-100 dark:bg-[#271b13] border border-stone-200 dark:border-[#3b2719] text-stone-700 dark:text-stone-200 outline-none cursor-pointer max-w-[140px]"
                          title="Move note to folder"
                        >
                          {notesFolders.map((f) => (
                            <option key={f.id} value={f.id}>
                              📁 {f.name}
                            </option>
                          ))}
                        </select>
                        <button
                          type="button"
                          onClick={() => onOpenNotebook(nb)}
                          className="text-[11px] font-semibold text-[#8f5f2c] dark:text-amber-300 hover:underline cursor-pointer"
                        >
                          Open Note →
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )
          ) : (
            <div className="space-y-6">
              {filteredDocs.length === 0 && uploadedWorkspaceBooks.length === 0 ? (
                <div className="themed-glass-card max-w-md mx-auto mt-10 p-8 rounded-3xl border border-stone-200 dark:border-[#382518] bg-white/80 dark:bg-[#1a120d]/90 text-center space-y-3">
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
                <>
                  {filteredDocs.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                      {filteredDocs.map((doc) => {
                        const currentFolder = fileFolders.find(
                          (f) => f.id === (doc.folderId || DEFAULT_FILES_FOLDER_ID)
                        );
                        const isMenuOpen = openMenuDocId === doc.id;
                        const isMoving = movingDocId === doc.id;
                        return (
                          <div
                            key={doc.id}
                            onClick={() => {
                              setOpenMenuDocId(null);
                              handleSingleClickDoc(doc);
                            }}
                            className="themed-glass-card group relative p-4 rounded-2xl border border-stone-200/90 dark:border-[#382518] bg-white/85 dark:bg-[#1c130d]/90 hover:border-[#A47C43] shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between gap-3"
                          >
                            <div className="flex items-start gap-3">
                              <div className="w-10 h-10 rounded-xl bg-amber-500/12 border border-amber-500/25 flex items-center justify-center shrink-0">
                                {renderFileIcon(doc.ext)}
                              </div>
                              <div className="min-w-0 flex-1">
                                <h3 className="font-serif font-bold text-sm text-stone-900 dark:text-[#f2e6d5] truncate group-hover:text-[#8f5f2c] dark:group-hover:text-amber-300">
                                  {doc.title || doc.fileName}
                                </h3>
                                <p className="text-[10.5px] font-mono text-stone-500 dark:text-[#a69079] truncate">
                                  {doc.ext.toUpperCase()} · {doc.sizeLabel} · {doc.source}
                                </p>
                                {(doc.extractedTables?.length || 0) > 0 && (
                                  <span className="mt-1 inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-500/12 px-2 py-0.5 rounded-md">
                                    <Table2 className="w-3 h-3" />
                                    {doc.extractedTables!.length} Table(s) Detected
                                  </span>
                                )}
                              </div>
                            </div>

                            <div
                              className="pt-2 border-t border-stone-100 dark:border-[#312015] flex items-center justify-between gap-2 relative"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <span className="inline-flex items-center gap-1.5 text-[10.5px] px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-[#271b13] border border-stone-200 dark:border-[#3b2719] text-stone-700 dark:text-stone-200 truncate max-w-[155px]">
                                <Folder className="w-3 h-3 shrink-0 text-[#A47C43]" />
                                <span className="truncate">{currentFolder?.name || 'Recent Files'}</span>
                              </span>

                              <div className="flex items-center gap-1">
                                {onOpenInRead && (
                                  <button
                                    type="button"
                                    onClick={() => onOpenInRead(doc)}
                                    className="text-[10.5px] font-semibold px-2 py-1 rounded-lg bg-[#A47C43]/15 hover:bg-[#A47C43]/25 text-[#7c5321] dark:text-amber-300 cursor-pointer"
                                    title="Open inside Read Studio"
                                  >
                                    Read
                                  </button>
                                )}

                                {/* 3-Dots File Action & Move Menu */}
                                <div className="relative">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setMovingDocId(null);
                                      setOpenMenuDocId(isMenuOpen ? null : doc.id);
                                    }}
                                    className="p-1.5 rounded-lg text-stone-500 hover:text-stone-900 dark:text-stone-300 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-[#2b1d14] cursor-pointer transition-colors"
                                    title="File options & Move to folder"
                                    aria-label="File options"
                                  >
                                    <MoreVertical className="w-4 h-4" />
                                  </button>

                                  {isMenuOpen && (
                                    <div className="absolute right-0 bottom-9 z-30 w-52 rounded-xl bg-[#fcfaf7] dark:bg-[#1a120d] border border-stone-200 dark:border-[#3b281a] shadow-2xl p-1.5 space-y-0.5 text-xs">
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

                                      <button
                                        type="button"
                                        onClick={() => setMovingDocId(isMoving ? null : doc.id)}
                                        className="w-full px-2.5 py-1.5 rounded-lg text-left hover:bg-stone-100 dark:hover:bg-[#281b12] flex items-center justify-between text-stone-800 dark:text-stone-100 cursor-pointer"
                                      >
                                        <span className="flex items-center gap-2">
                                          <FolderInput className="w-3.5 h-3.5 text-[#A47C43]" />
                                          <span>Move File to Folder</span>
                                        </span>
                                        <span className="text-[10px] opacity-60">▾</span>
                                      </button>

                                      {isMoving && (
                                        <div className="mx-1 my-1 p-1 rounded-lg bg-stone-100/80 dark:bg-[#120c08] border border-stone-200/80 dark:border-[#352317] space-y-0.5 max-h-36 overflow-y-auto custom-scrollbar">
                                          {fileFolders.map((f) => {
                                            const activeFolder = (doc.folderId || DEFAULT_FILES_FOLDER_ID) === f.id;
                                            return (
                                              <button
                                                key={f.id}
                                                type="button"
                                                onClick={() => {
                                                  updateUploadedDocumentFolder(doc.id, f.id);
                                                  setUploadedDocs(getUploadedDocuments());
                                                  setMovingDocId(null);
                                                  setOpenMenuDocId(null);
                                                  setUploadStatus(`Moved "${doc.title}" to "${f.name}".`);
                                                  setTimeout(() => setUploadStatus(null), 3000);
                                                }}
                                                className={`w-full px-2 py-1 rounded-md text-left text-[11px] flex items-center gap-1.5 cursor-pointer ${
                                                  activeFolder
                                                    ? 'bg-[#A47C43]/20 font-bold text-[#7c4d1e] dark:text-amber-200'
                                                    : 'hover:bg-white dark:hover:bg-[#231810] text-stone-700 dark:text-stone-300'
                                                }`}
                                              >
                                                <Folder className="w-3 h-3 shrink-0" style={{ color: f.color }} />
                                                <span className="truncate">{f.name}</span>
                                              </button>
                                            );
                                          })}
                                        </div>
                                      )}

                                      <div className="my-1 border-t border-stone-200/70 dark:border-[#352317]" />

                                      <button
                                        type="button"
                                        onClick={() => {
                                          deleteUploadedDocument(doc.id);
                                          setUploadedDocs(getUploadedDocuments());
                                          setOpenMenuDocId(null);
                                        }}
                                        className="w-full px-2.5 py-1.5 rounded-lg text-left hover:bg-red-500/10 text-red-600 dark:text-red-400 flex items-center gap-2 cursor-pointer"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                        <span>Delete File</span>
                                      </button>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {uploadedWorkspaceBooks.length > 0 && selectedFilesFolderId === DEFAULT_FILES_FOLDER_ID && (
                    <div className="space-y-2.5">
                      <h3 className="text-xs font-mono uppercase tracking-wider font-bold text-stone-500 dark:text-[#a69079]">
                        Drive &amp; Attached Textbooks ({uploadedWorkspaceBooks.length})
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {uploadedWorkspaceBooks.map((bk) => (
                          <div
                            key={bk.id}
                            onClick={() => {
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
                                extractedText: bk.pages?.map((p) => `${p.title}\n${p.summaryPearl}`).join('\n\n'),
                              };
                              onOpenInRead ? onOpenInRead(synth) : setPreviewDoc(synth);
                            }}
                            className="themed-glass-card p-3.5 rounded-2xl border border-stone-200 dark:border-[#382518] bg-white/80 dark:bg-[#1c130d]/85 hover:border-[#A47C43] cursor-pointer flex items-center gap-3"
                          >
                            <div
                              className="w-9 h-9 rounded-xl flex items-center justify-center text-white shrink-0"
                              style={{ backgroundColor: bk.coverColor || '#7c4521' }}
                            >
                              <BookOpen className="w-4 h-4" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="text-xs font-bold text-stone-900 dark:text-stone-100 truncate">
                                {bk.title}
                              </div>
                              <div className="text-[10.5px] font-mono text-stone-500 truncate">
                                {bk.subject} · {bk.edition}
                              </div>
                            </div>
                            <ExternalLink className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
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
    </div>
  );
};

export default LibraryWorkspaceView;
