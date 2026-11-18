import React, { useState } from 'react';
import {
  Cloud,
  ExternalLink,
  HardDrive,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  X,
  Download,
  Loader2,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import {
  DRIVE_APP_FOLDER_NAME,
  uploadPdfToPersonalDrive,
} from '../../services/googleDriveService';
import { saveFileToAch1evDeviceFolder, urlOrDataToBlob } from '../../utils/deviceStorage';

export interface CloudDriveTargetFile {
  title: string;
  fileName: string;
  mimeType: string;
  blob?: Blob;
  sourceUrl?: string;
  fallbackText?: string;
}

interface CloudDriveSaveModalProps {
  file: CloudDriveTargetFile | null;
  onClose: () => void;
  onUploaded?: (result: { webViewLink: string; driveFileId: string }) => void;
}

const CLOUD_DRIVE_WEBSITES = [
  {
    id: 'gdrive',
    name: 'Google Drive',
    url: 'https://drive.google.com/drive/my-drive',
    desc: 'Open Google Drive website in browser tab',
  },
  {
    id: 'onedrive',
    name: 'Microsoft OneDrive',
    url: 'https://onedrive.live.com/',
    desc: 'Save into your OneDrive cloud folder',
  },
  {
    id: 'icloud',
    name: 'Apple iCloud Drive',
    url: 'https://www.icloud.com/iclouddrive/',
    desc: 'Save into iCloud Files across iPhone, iPad & Mac',
  },
  {
    id: 'dropbox',
    name: 'Dropbox',
    url: 'https://www.dropbox.com/home',
    desc: 'Open Dropbox web storage',
  },
];

export const CloudDriveSaveModal: React.FC<CloudDriveSaveModalProps> = ({
  file,
  onClose,
  onUploaded,
}) => {
  const { driveAccount, connectGoogleDrive, getValidDriveAccessToken } = useAuth();
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState<number>(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [uploadedLink, setUploadedLink] = useState<string | null>(null);
  const [deviceStatus, setDeviceStatus] = useState<string | null>(null);

  if (!file) return null;

  const buildFileObject = async (): Promise<File> => {
    let blob: Blob;
    if (file.blob) {
      blob = file.blob;
    } else if (file.sourceUrl) {
      blob = await urlOrDataToBlob(file.sourceUrl, file.mimeType || 'application/pdf');
    } else {
      blob = new Blob([file.fallbackText || file.title], { type: 'text/plain;charset=utf-8' });
    }
    return new File([blob], file.fileName, { type: blob.type || file.mimeType || 'application/octet-stream' });
  };

  const handleDirectGoogleDriveUpload = async () => {
    setErrorMsg(null);
    setIsUploading(true);
    setProgress(5);
    try {
      let token = '';
      if (!driveAccount.connected) {
        await connectGoogleDrive();
      }
      token = await getValidDriveAccessToken();
      const targetFile = await buildFileObject();
      const res = await uploadPdfToPersonalDrive(targetFile, token, {
        folderId: driveAccount.folderId,
        makeAnyoneReader: false,
        onProgress: (pct) => setProgress(pct),
      });
      setUploadedLink(res.webViewLink);
      onUploaded?.({ webViewLink: res.webViewLink, driveFileId: res.driveFileId });
    } catch (err: any) {
      setErrorMsg(
        err?.message ||
          'Direct OAuth upload could not finish. You can save to device and drop it directly into any cloud drive website below.'
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveToDeviceClick = async () => {
    setErrorMsg(null);
    try {
      const target = await buildFileObject();
      const res = await saveFileToAch1evDeviceFolder(file.fileName, target, {
        promptFolderIfMissing: true,
        mimeType: target.type,
      });
      setDeviceStatus(`Saved "${res.fileName}" to ${res.destinationLabel}`);
    } catch (err: any) {
      setErrorMsg(err?.message || 'Could not save file to device.');
    }
  };

  return (
    <div
      className="fixed inset-0 z-[60] bg-black/65 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-2xl bg-[#fdfcfa] dark:bg-[#140e0a] border border-stone-200 dark:border-[#382518] shadow-2xl overflow-hidden text-stone-900 dark:text-stone-100"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-label="Upload to Cloud Drive or Save to Device"
      >
        <div className="px-5 py-3.5 border-b border-stone-200 dark:border-[#352317] bg-stone-50 dark:bg-[#1a120d] flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <Cloud className="w-4 h-4 text-[#A47C43] shrink-0" />
            <div className="min-w-0">
              <h3 className="text-sm font-bold truncate">Save to Cloud Drive or Device</h3>
              <p className="text-[11px] font-mono text-stone-500 dark:text-stone-400 truncate">
                {file.fileName}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/35 text-rose-800 dark:text-rose-200 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {uploadedLink && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/35 text-emerald-900 dark:text-emerald-200 text-xs space-y-2">
              <div className="flex items-center gap-2 font-bold">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Uploaded cleanly to "{DRIVE_APP_FOLDER_NAME}"</span>
              </div>
              <a
                href={uploadedLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Open File in Google Drive Web View</span>
              </a>
            </div>
          )}

          {deviceStatus && (
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/35 text-amber-900 dark:text-amber-200 text-xs flex items-center gap-2 font-semibold">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{deviceStatus}</span>
            </div>
          )}

          {/* Direct actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <button
              type="button"
              disabled={isUploading}
              onClick={handleDirectGoogleDriveUpload}
              className="px-3.5 py-2.5 rounded-xl bg-[#8f5f2c] hover:bg-[#734a1f] text-white text-xs font-bold flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 shadow-xs"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Uploading {progress}%...</span>
                </>
              ) : (
                <>
                  <UploadCloud className="w-4 h-4" />
                  <span>Upload to Google Drive</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleSaveToDeviceClick}
              className="px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-[#3d291b] bg-white dark:bg-[#1e150f] hover:bg-stone-100 dark:hover:bg-[#2a1d14] text-stone-800 dark:text-stone-100 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4 text-[#A47C43]" />
              <span>Save to Device (Ach1ev)</span>
            </button>
          </div>

          {/* Open any Cloud Drive Website */}
          <div className="space-y-2 pt-2 border-t border-stone-200/80 dark:border-[#352317]">
            <div className="text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
              Open Cloud Drive Website
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {CLOUD_DRIVE_WEBSITES.map((site) => (
                <a
                  key={site.id}
                  href={site.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl border border-stone-200 dark:border-[#382518] bg-stone-50/75 dark:bg-[#1a120d] hover:border-[#A47C43] flex items-center justify-between gap-2 transition-colors"
                >
                  <div className="min-w-0">
                    <div className="text-xs font-bold flex items-center gap-1.5">
                      <HardDrive className="w-3.5 h-3.5 text-[#A47C43] shrink-0" />
                      <span className="truncate">{site.name}</span>
                    </div>
                    <div className="text-[10px] text-stone-500 dark:text-stone-400 truncate mt-0.5">
                      {site.desc}
                    </div>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CloudDriveSaveModal;
