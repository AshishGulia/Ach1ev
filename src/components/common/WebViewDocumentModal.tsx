import React, { useState, useEffect } from 'react';
import {
  X,
  Share2,
  Download,
  Star,
  FileText,
  ExternalLink,
  Check,
  Table2,
  CalendarPlus,
  UploadCloud,
} from 'lucide-react';
import {
  UploadedDocumentRecord,
  getFileBlobFromIdb,
  getSessionFileUrl,
} from '../../services/uploadedFilesStore';
import { extractDriveFileId } from '../../services/googleDriveService';
import { getPlanLimits, openSubscriptionUpgradeModal } from '../../utils/subscriptionLimits';
import { SmartDocumentFrame } from './SmartDocumentFrame';
import { saveFileToAch1evDeviceFolder } from '../../utils/deviceStorage';
import { CloudDriveSaveModal, CloudDriveTargetFile } from './CloudDriveSaveModal';

export interface WebViewDocPayload {
  id: string;
  title: string;
  fileName?: string;
  ext?: string;
  mimeType?: string;
  subject?: string;
  badge?: string;
  dataUrl?: string;
  pdfFileUrl?: string;
  driveFileId?: string;
  extractedText?: string;
  extractedTables?: UploadedDocumentRecord['extractedTables'];
  pages?: Array<{
    pageNumber: number;
    title: string;
    keyTopic?: string;
    summaryPearl?: string;
    contentHtml: string;
  }>;
  contentHtml?: string;
}

interface WebViewDocumentModalProps {
  doc: WebViewDocPayload | null;
  onClose: () => void;
  onOpenInRead?: (doc: WebViewDocPayload) => void;
  onImportRosterTable?: (doc: WebViewDocPayload) => void;
}

const FAV_STORAGE_KEY = 'medden_cockpit_favourites_v1';

const isDocInFavourites = (docId: string, title: string): boolean => {
  try {
    const raw = localStorage.getItem(FAV_STORAGE_KEY);
    if (!raw) return false;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return false;
    const walk = (items: any[]): boolean =>
      items.some(
        (it) =>
          it?.sourceId === docId ||
          it?.id === docId ||
          (typeof it?.title === 'string' && it.title === title) ||
          (Array.isArray(it?.children) && walk(it.children))
      );
    return walk(parsed);
  } catch {
    return false;
  }
};

export const WebViewDocumentModal: React.FC<WebViewDocumentModalProps> = ({
  doc,
  onClose,
  onOpenInRead,
  onImportRosterTable,
}) => {
  const [isFav, setIsFav] = useState(false);
  const [ribbonFeedback, setRibbonFeedback] = useState<string | null>(null);
  const [idbBlobUrl, setIdbBlobUrl] = useState<string | undefined>(undefined);
  const [cloudDriveFile, setCloudDriveFile] = useState<CloudDriveTargetFile | null>(null);

  useEffect(() => {
    if (!doc) {
      setIdbBlobUrl(undefined);
      return;
    }
    setIsFav(isDocInFavourites(doc.id, doc.title));
    setRibbonFeedback(null);
    const cached = getSessionFileUrl(doc.id);
    if (cached) {
      setIdbBlobUrl(cached);
    } else {
      setIdbBlobUrl(undefined);
      void getFileBlobFromIdb(doc.id).then((url) => {
        if (url) setIdbBlobUrl(url);
      });
    }
  }, [doc]);

  if (!doc) return null;

  const mediaUrl = idbBlobUrl || getSessionFileUrl(doc.id) || doc.pdfFileUrl || doc.dataUrl || '';
  const detectedDriveId = doc.driveFileId || extractDriveFileId(doc.pdfFileUrl) || undefined;
  const lowExt = (doc.ext || doc.fileName?.split('.').pop() || 'pdf').toLowerCase();
  const isHtmlContent =
    mediaUrl.startsWith('data:text/html') || doc.mimeType?.includes('html');
  const isPdfEmbed =
    !isHtmlContent &&
    ((lowExt === 'pdf' || doc.mimeType === 'application/pdf') && (Boolean(mediaUrl) || Boolean(detectedDriveId)));
  const isImage =
    ['png', 'jpg', 'jpeg', 'webp', 'gif', 'svg'].includes(lowExt) ||
    Boolean(doc.mimeType?.startsWith('image/'));

  const showToast = (msg: string) => {
    setRibbonFeedback(msg);
    setTimeout(() => setRibbonFeedback((prev) => (prev === msg ? null : prev)), 2800);
  };

  const handleShare = async () => {
    const shareTitle = `${doc.title} · Achiev`;
    const shareText = `Check out "${doc.title}" stored in Achiev Academic Workspace.`;
    try {
      if (navigator.share) {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: window.location.href,
        });
        showToast('Shared successfully');
        return;
      }
    } catch {}
    try {
      await navigator.clipboard.writeText(`${shareTitle}\n${shareText}\n${window.location.href}`);
      showToast('Share link copied to clipboard');
    } catch {
      showToast('Ready to share from your browser bar');
    }
  };

  const resolvedFilename =
    doc.fileName ||
    `${doc.title.replace(/[^a-zA-Z0-9._-]+/g, '_')}.${isHtmlContent ? 'html' : lowExt || 'pdf'}`;

  const handleSaveToDevice = async () => {
    const downloadPayload =
      mediaUrl ||
      (doc.contentHtml
        ? new Blob([doc.contentHtml], { type: 'text/html;charset=utf-8' })
        : doc.extractedText
        ? new Blob([doc.extractedText], { type: 'text/plain;charset=utf-8' })
        : null);

    if (!downloadPayload) {
      showToast('No downloadable file stream available');
      return;
    }

    const safeFileName =
      isHtmlContent && resolvedFilename.endsWith('.pdf')
        ? resolvedFilename.replace(/\.pdf$/i, '.html')
        : resolvedFilename;

    const res = await saveFileToAch1evDeviceFolder(safeFileName, downloadPayload, {
      mimeType: doc.mimeType || 'application/pdf',
    });
    showToast(`Saved "${res.fileName}" to ${res.destinationLabel}`);
  };

  const handleOpenUploadToDrive = () => {
    setCloudDriveFile({
      title: doc.title,
      fileName: resolvedFilename,
      mimeType: doc.mimeType || 'application/pdf',
      sourceUrl: mediaUrl || undefined,
      fallbackText: doc.extractedText || doc.contentHtml || doc.title,
    });
  };

  const handleToggleFavourite = () => {
    try {
      const raw = localStorage.getItem(FAV_STORAGE_KEY);
      const list: any[] = raw ? JSON.parse(raw) : [];
      const exists = list.some(
        (it) => it?.sourceId === doc.id || it?.id === doc.id || it?.title === doc.title
      );

      let nextList: any[];
      if (exists) {
        nextList = list.filter(
          (it) => it?.sourceId !== doc.id && it?.id !== doc.id && it?.title !== doc.title
        );
        setIsFav(false);
        showToast('Removed from Favourites');
      } else {
        const limits = getPlanLimits();
        const totalTopFavs = list.length;
        if (totalTopFavs >= limits.maxLeisureFavourites && limits.planId !== 'master-ultimate') {
          openSubscriptionUpgradeModal({
            title: 'Unlock Unlimited Favourites with Master Ultimate (₹300)',
            message: `Your current plan allows up to ${limits.maxLeisureFavourites} pinned favourites. Upgrade to ₹300/mo Master Ultimate for unlimited favourites across Cockpit & Leisure.`,
            requiredPlanId: 'master-ultimate',
          });
          return;
        }
        nextList = [
          {
            id: `fav-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
            type: 'book',
            kind: 'pdf',
            sourceId: doc.id,
            title: doc.title,
            subject: doc.subject || 'Library Document',
            badge: doc.badge || (lowExt ? lowExt.toUpperCase() : 'PDF'),
            coverColor: '#7c4521',
            pdfFileUrl: mediaUrl || undefined,
            isStarred: true,
          },
          ...list,
        ];
        setIsFav(true);
        showToast('Marked as Favourite ★');
      }

      localStorage.setItem(FAV_STORAGE_KEY, JSON.stringify(nextList));
      window.dispatchEvent(new Event('achiev_favourites_updated'));
    } catch {
      showToast('Could not update favourites');
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm flex items-center justify-center p-1 sm:p-2"
      onClick={onClose}
    >
      <div
        className="w-full max-w-none h-[96vh] rounded-2xl bg-[#fdfcfa] dark:bg-[#140e0a] border border-stone-200 dark:border-[#382518] shadow-2xl flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-label={`Web View Window — ${doc.title}`}
      >
        {/* Top Web View Ribbon: Title + Share + Save to Device + Mark Favourite + Close */}
        <div className="shrink-0 px-4 py-3 border-b border-stone-200 dark:border-[#352317] bg-stone-50/95 dark:bg-[#1a120d]/95 flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-[#A47C43]/15 border border-[#A47C43]/35 flex items-center justify-center text-[#8f5f2c] dark:text-amber-300 shrink-0">
              <FileText className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-bold text-stone-900 dark:text-stone-50 truncate">
                {doc.title}
              </h3>
              <p className="text-[11px] font-mono text-stone-500 dark:text-stone-400 truncate">
                {doc.fileName || doc.subject || 'Web View Document'} · {lowExt.toUpperCase()}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {ribbonFeedback && (
              <span className="px-2.5 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/35 text-emerald-800 dark:text-emerald-200 text-[11px] font-semibold flex items-center gap-1">
                <Check className="w-3 h-3" />
                {ribbonFeedback}
              </span>
            )}

            <button
              type="button"
              onClick={handleShare}
              className="px-3 py-1.5 rounded-lg border border-stone-200 dark:border-[#3d291b] bg-white dark:bg-[#231811] hover:bg-stone-100 dark:hover:bg-[#2e2017] text-stone-800 dark:text-stone-100 text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <Share2 className="w-3.5 h-3.5 text-[#8f5f2c] dark:text-amber-400" />
              <span>Share</span>
            </button>

            <button
              type="button"
              onClick={handleSaveToDevice}
              className="px-3 py-1.5 rounded-lg border border-stone-200 dark:border-[#3d291b] bg-white dark:bg-[#231811] hover:bg-stone-100 dark:hover:bg-[#2e2017] text-stone-800 dark:text-stone-100 text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-[#8f5f2c] dark:text-amber-400" />
              <span>Save to Device</span>
            </button>

            <button
              type="button"
              onClick={handleOpenUploadToDrive}
              className="px-3 py-1.5 rounded-lg border border-stone-200 dark:border-[#3d291b] bg-white dark:bg-[#231811] hover:bg-stone-100 dark:hover:bg-[#2e2017] text-stone-800 dark:text-stone-100 text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <UploadCloud className="w-3.5 h-3.5 text-[#8f5f2c] dark:text-amber-400" />
              <span>Upload to Drive</span>
            </button>

            <button
              type="button"
              onClick={handleToggleFavourite}
              className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors ${
                isFav
                  ? 'bg-amber-500/20 border-amber-500/50 text-amber-900 dark:text-amber-200'
                  : 'border-stone-200 dark:border-[#3d291b] bg-white dark:bg-[#231811] hover:bg-stone-100 dark:hover:bg-[#2e2017] text-stone-800 dark:text-stone-100'
              }`}
            >
              <Star
                className={`w-3.5 h-3.5 ${
                  isFav ? 'fill-amber-500 text-amber-500' : 'text-amber-600 dark:text-amber-400'
                }`}
              />
              <span>{isFav ? 'Favourited' : 'Mark Favourite'}</span>
            </button>

            {onOpenInRead && (
              <button
                type="button"
                onClick={() => onOpenInRead(doc)}
                className="px-3 py-1.5 rounded-lg bg-[#8f5f2c] hover:bg-[#734a1f] text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Open Reader</span>
              </button>
            )}

            {onImportRosterTable && doc.extractedTables && doc.extractedTables.length > 0 && (
              <button
                type="button"
                onClick={() => onImportRosterTable(doc)}
                className="px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <CalendarPlus className="w-3.5 h-3.5" />
                <span>Sync Schedule</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-100 hover:bg-stone-200/60 dark:hover:bg-[#251a12] cursor-pointer"
              aria-label="Close Web View Window"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Web View Content Viewport */}
        <div className="flex-1 min-h-0 overflow-y-auto bg-stone-100/70 dark:bg-[#0e0906] p-2 sm:p-4 space-y-4 custom-scrollbar">
          {(isHtmlContent && mediaUrl) || isPdfEmbed ? (
            <div className="w-full h-[78vh] rounded-xl overflow-hidden border border-stone-200 dark:border-[#352317] bg-white dark:bg-[#140e0a] shadow-sm">
              <SmartDocumentFrame
                docId={doc.id}
                driveFileId={detectedDriveId}
                srcUrl={mediaUrl}
                title={doc.title}
                className="w-full h-full border-0"
              />
            </div>
          ) : isImage && mediaUrl ? (
            <div className="flex items-center justify-center rounded-xl bg-black/5 dark:bg-black/40 p-4 border border-stone-200 dark:border-[#352317]">
              <img
                src={mediaUrl}
                alt={doc.title}
                className="max-h-[78vh] w-auto object-contain rounded-lg shadow"
              />
            </div>
          ) : doc.pages && doc.pages.length > 0 ? (
            <div className="space-y-4 w-full max-w-none">
              {doc.pages.map((p) => (
                <div
                  key={p.pageNumber}
                  className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#1a120d] border border-stone-200 dark:border-[#352317] shadow-sm"
                >
                  <div className="text-[10px] font-mono uppercase tracking-widest text-[#8f5f2c] dark:text-amber-400 mb-1">
                    Page {p.pageNumber} {p.keyTopic ? `· ${p.keyTopic}` : ''}
                  </div>
                  <h4 className="text-base font-bold text-stone-900 dark:text-stone-100 mb-3">
                    {p.title}
                  </h4>
                  <div
                    className="prose prose-sm dark:prose-invert max-w-none text-stone-700 dark:text-stone-200"
                    dangerouslySetInnerHTML={{ __html: p.contentHtml }}
                  />
                </div>
              ))}
            </div>
          ) : doc.contentHtml ? (
            <div
              className="w-full max-w-none p-6 rounded-2xl bg-white dark:bg-[#1a120d] border border-stone-200 dark:border-[#352317] prose prose-sm dark:prose-invert"
              dangerouslySetInnerHTML={{ __html: doc.contentHtml }}
            />
          ) : null}

          {doc.extractedTables && doc.extractedTables.length > 0 && (
            <div className="w-full max-w-none space-y-3">
              {doc.extractedTables.map((tbl, tIdx) => (
                <div
                  key={tIdx}
                  className="rounded-xl border border-stone-200 dark:border-[#352317] bg-white dark:bg-[#1a120d] overflow-hidden shadow-xs"
                >
                  <div className="px-4 py-2.5 bg-stone-50 dark:bg-[#221710] border-b border-stone-200 dark:border-[#352317] text-xs font-bold text-stone-800 dark:text-stone-100 flex items-center gap-1.5">
                    <Table2 className="w-3.5 h-3.5 text-[#8f5f2c] dark:text-amber-400" />
                    <span>{tbl.title || `Schedule Table ${tIdx + 1}`}</span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-stone-100/80 dark:bg-[#281b13] text-stone-700 dark:text-stone-200">
                        <tr>
                          {(tbl.headers || []).map((h, hIdx) => (
                            <th key={hIdx} className="px-3 py-2 font-bold whitespace-nowrap">
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-100 dark:divide-[#2e2017] text-stone-700 dark:text-stone-300">
                        {(tbl.rows || []).map((row, rIdx) => (
                          <tr key={rIdx} className="hover:bg-stone-50/70 dark:hover:bg-[#1e140e]">
                            {row.map((cell, cIdx) => (
                              <td key={cIdx} className="px-3 py-2 whitespace-nowrap">
                                {cell}
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

          {!isHtmlContent && !isPdfEmbed && !isImage && !doc.pages?.length && !doc.contentHtml && (
            <div className="w-full max-w-none p-6 rounded-2xl bg-white dark:bg-[#1a120d] border border-stone-200 dark:border-[#352317] text-xs text-stone-700 dark:text-stone-300 whitespace-pre-wrap">
              {doc.extractedText || 'Document stored safely in Achiev Library. Use Save to Device or Upload to Drive from the top ribbon.'}
            </div>
          )}
        </div>
      </div>

      <CloudDriveSaveModal
        file={cloudDriveFile}
        onClose={() => setCloudDriveFile(null)}
        onUploaded={() => showToast('Uploaded to Google Drive')}
      />
    </div>
  );
};

export default WebViewDocumentModal;
