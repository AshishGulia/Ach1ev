import React, { useEffect, useState } from 'react';
import { ExternalLink, HardDrive, Loader2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import {
  extractDriveFileId,
  fetchDriveFileBlobUrl,
  getDrivePreviewUrl,
} from '../../services/googleDriveService';
import {
  getFileBlobFromIdb,
  getSessionFileUrl,
} from '../../services/uploadedFilesStore';

interface SmartDocumentFrameProps {
  docId?: string;
  driveFileId?: string;
  srcUrl?: string;
  title: string;
  className?: string;
  allow?: string;
}

export const SmartDocumentFrame: React.FC<SmartDocumentFrameProps> = ({
  docId,
  driveFileId,
  srcUrl,
  title,
  className = 'w-full h-full border-0',
  allow = 'autoplay',
}) => {
  const { user, driveAccount, connectGoogleDrive } = useAuth();
  const [resolvedUrl, setResolvedUrl] = useState<string | null>(() => {
    const sess = docId ? getSessionFileUrl(docId) : undefined;
    if (sess) return sess;
    if (srcUrl && (srcUrl.startsWith('data:') || srcUrl.startsWith('/'))) return srcUrl;
    if (srcUrl && srcUrl.startsWith('blob:')) return srcUrl;
    return null;
  });
  const [isResolving, setIsResolving] = useState<boolean>(false);
  const [driveReconnectBusy, setDriveReconnectBusy] = useState<boolean>(false);

  const detectedDriveId = extractDriveFileId(driveFileId || srcUrl || '');

  useEffect(() => {
    let cancelled = false;
    const resolve = async () => {
      const sess = docId ? getSessionFileUrl(docId) : undefined;
      if (sess) {
        if (!cancelled) setResolvedUrl(sess);
        return;
      }

      if (docId) {
        setIsResolving(true);
        const idbUrl = await getFileBlobFromIdb(docId);
        if (idbUrl) {
          if (!cancelled) {
            setResolvedUrl(idbUrl);
            setIsResolving(false);
          }
          return;
        }
      }

      if (srcUrl && (srcUrl.startsWith('data:') || srcUrl.startsWith('/'))) {
        if (!cancelled) {
          setResolvedUrl(srcUrl);
          setIsResolving(false);
        }
        return;
      }

      if (detectedDriveId) {
        setIsResolving(true);
        const blobUrl = await fetchDriveFileBlobUrl(detectedDriveId, user?.id);
        if (!cancelled) {
          setResolvedUrl(blobUrl || getDrivePreviewUrl(detectedDriveId));
          setIsResolving(false);
        }
        return;
      }

      if (srcUrl) {
        if (!cancelled) {
          setResolvedUrl(getDrivePreviewUrl(srcUrl) || srcUrl);
          setIsResolving(false);
        }
        return;
      }

      if (!cancelled) {
        setResolvedUrl(null);
        setIsResolving(false);
      }
    };

    void resolve();
    return () => {
      cancelled = true;
    };
  }, [docId, driveFileId, srcUrl, detectedDriveId, user?.id, driveAccount.connected]);

  const isExternalDrivePreview =
    Boolean(detectedDriveId) &&
    Boolean(resolvedUrl && resolvedUrl.includes('drive.google.com'));

  const handleReconnectDrive = async () => {
    setDriveReconnectBusy(true);
    try {
      await connectGoogleDrive();
      if (detectedDriveId) {
        const blobUrl = await fetchDriveFileBlobUrl(detectedDriveId, user?.id);
        if (blobUrl) setResolvedUrl(blobUrl);
      }
    } catch {
      // ignore cancelled
    } finally {
      setDriveReconnectBusy(false);
    }
  };

  if (isResolving && !resolvedUrl) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-xs text-stone-400 bg-stone-950/60 p-6">
        <Loader2 className="w-5 h-5 animate-spin text-amber-400" />
        <span>Loading document...</span>
      </div>
    );
  }

  if (!resolvedUrl) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-xs text-stone-400 bg-stone-900/40 p-6 text-center">
        <span>Document stream ready locally — select Re-upload or Open Original if saved externally.</span>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      {isExternalDrivePreview && (
        <div className="absolute top-2.5 right-3 z-10 flex items-center gap-1.5 bg-stone-950/85 backdrop-blur-md border border-amber-500/35 rounded-lg px-2.5 py-1 shadow-lg">
          {!driveAccount.connected && (
            <button
              type="button"
              disabled={driveReconnectBusy}
              onClick={() => void handleReconnectDrive()}
              className="text-[11px] font-semibold text-amber-300 hover:text-amber-200 flex items-center gap-1 cursor-pointer"
            >
              <HardDrive className="w-3 h-3" />
              <span>{driveReconnectBusy ? 'Connecting...' : 'Authorize Drive Preview'}</span>
            </button>
          )}
          <a
            href={`https://drive.google.com/file/d/${detectedDriveId}/view`}
            target="_blank"
            rel="noreferrer"
            className="text-[11px] font-semibold text-stone-200 hover:text-white flex items-center gap-1 pl-1.5 border-l border-white/15"
          >
            <ExternalLink className="w-3 h-3" />
            <span>Open in Drive</span>
          </a>
        </div>
      )}
      <iframe
        src={resolvedUrl}
        title={title}
        className={className}
        allow={allow}
      />
    </div>
  );
};

export default SmartDocumentFrame;
