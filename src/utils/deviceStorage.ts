export type DevicePlatformKind = 'windows' | 'macos' | 'android' | 'ios' | 'linux';

const IDB_NAME = 'achiev_device_storage_v1';
const IDB_STORE = 'handles';
const IDB_KEY = 'destination_dir';
const LS_DEST_LABEL = 'achiev_device_dest_label_v1';
const LS_DEST_CUSTOM = 'achiev_device_dest_custom_v1';

export function detectDevicePlatform(): DevicePlatformKind {
  if (typeof navigator === 'undefined') return 'windows';
  const ua = (navigator.userAgent || '').toLowerCase();
  const plat = ((navigator as any).userAgentData?.platform || navigator.platform || '').toLowerCase();
  if (/iphone|ipad|ipod/.test(ua) || (plat === 'macintel' && (navigator.maxTouchPoints || 0) > 1)) {
    return 'ios';
  }
  if (/android/.test(ua)) return 'android';
  if (/mac/.test(plat) || /macintosh|mac os x/.test(ua)) return 'macos';
  if (/win/.test(plat) || /windows/.test(ua)) return 'windows';
  return 'linux';
}

export function getDefaultAch1evPathLabel(platform: DevicePlatformKind = detectDevicePlatform()): string {
  switch (platform) {
    case 'windows':
      return 'Documents\\Ach1ev\\Documents';
    case 'macos':
      return 'Documents/Ach1ev/Documents';
    case 'android':
      return 'Files/Ach1ev/Documents';
    case 'ios':
      return 'Files/Ach1ev/Documents';
    default:
      return 'Documents/Ach1ev/Documents';
  }
}

export function getSavedDestinationLabel(): string {
  if (typeof window === 'undefined') return 'Ach1ev/Documents';
  try {
    const custom = localStorage.getItem(LS_DEST_LABEL);
    if (custom && custom.trim()) return custom.trim();
  } catch {}
  return getDefaultAch1evPathLabel();
}

export function isCustomDestinationSet(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return localStorage.getItem(LS_DEST_CUSTOM) === '1';
  } catch {
    return false;
  }
}

function openHandlesDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      reject(new Error('IndexedDB unavailable'));
      return;
    }
    const req = indexedDB.open(IDB_NAME, 1);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(IDB_STORE)) {
        db.createObjectStore(IDB_STORE);
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error || new Error('Failed to open handle DB'));
  });
}

async function storeDirectoryHandle(handle: any): Promise<void> {
  const db = await openHandlesDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(IDB_STORE, 'readwrite');
    tx.objectStore(IDB_STORE).put(handle, IDB_KEY);
    tx.oncomplete = () => {
      db.close();
      resolve();
    };
    tx.onerror = () => {
      db.close();
      reject(tx.error);
    };
  });
}

export async function getStoredDirectoryHandle(): Promise<any | null> {
  try {
    const db = await openHandlesDb();
    return await new Promise((resolve) => {
      const tx = db.transaction(IDB_STORE, 'readonly');
      const req = tx.objectStore(IDB_STORE).get(IDB_KEY);
      req.onsuccess = () => {
        db.close();
        resolve(req.result || null);
      };
      req.onerror = () => {
        db.close();
        resolve(null);
      };
    });
  } catch {
    return null;
  }
}

export async function clearStoredDirectoryHandle(): Promise<void> {
  try {
    const db = await openHandlesDb();
    await new Promise<void>((resolve) => {
      const tx = db.transaction(IDB_STORE, 'readwrite');
      tx.objectStore(IDB_STORE).delete(IDB_KEY);
      tx.oncomplete = () => {
        db.close();
        resolve();
      };
      tx.onerror = () => {
        db.close();
        resolve();
      };
    });
  } catch {}
  try {
    localStorage.removeItem(LS_DEST_LABEL);
    localStorage.removeItem(LS_DEST_CUSTOM);
    window.dispatchEvent(new CustomEvent('achiev_destination_changed'));
  } catch {}
}

async function verifyWritePermission(handle: any, interactive: boolean): Promise<boolean> {
  if (!handle) return false;
  try {
    if (typeof handle.queryPermission === 'function') {
      const current = await handle.queryPermission({ mode: 'readwrite' });
      if (current === 'granted') return true;
    }
    if (interactive && typeof handle.requestPermission === 'function') {
      const requested = await handle.requestPermission({ mode: 'readwrite' });
      return requested === 'granted';
    }
  } catch {}
  return false;
}

export interface PickDestinationResult {
  ok: boolean;
  label: string;
  usedNativePicker: boolean;
  cancelled?: boolean;
}

export async function chooseDeviceDestinationFolder(customFolderInput?: string): Promise<PickDestinationResult> {
  if (typeof window !== 'undefined' && typeof (window as any).showDirectoryPicker === 'function') {
    try {
      const handle = await (window as any).showDirectoryPicker({
        id: 'achiev-documents-dest',
        mode: 'readwrite',
        startIn: 'documents',
      });
      await storeDirectoryHandle(handle);
      const label = `${handle.name}/Ach1ev/Documents`;
      try {
        localStorage.setItem(LS_DEST_LABEL, label);
        localStorage.setItem(LS_DEST_CUSTOM, '1');
        window.dispatchEvent(new CustomEvent('achiev_destination_changed'));
      } catch {}
      return { ok: true, label, usedNativePicker: true };
    } catch (err: any) {
      if (err?.name === 'AbortError') {
        return { ok: false, label: getSavedDestinationLabel(), usedNativePicker: true, cancelled: true };
      }
    }
  }

  const nextLabel = (customFolderInput || '').trim() || getDefaultAch1evPathLabel();
  try {
    localStorage.setItem(LS_DEST_LABEL, nextLabel);
    localStorage.setItem(LS_DEST_CUSTOM, customFolderInput?.trim() ? '1' : '0');
    window.dispatchEvent(new CustomEvent('achiev_destination_changed'));
  } catch {}
  return { ok: true, label: nextLabel, usedNativePicker: false };
}

async function ensureAch1evDocumentsSubdir(rootHandle: any): Promise<any> {
  if (!rootHandle || typeof rootHandle.getDirectoryHandle !== 'function') return rootHandle;
  const rootName = String(rootHandle.name || '').toLowerCase();
  if (rootName === 'documents') {
    // Could be OS Documents root or Ach1ev/Documents directly
    const achievDir = await rootHandle.getDirectoryHandle('Ach1ev', { create: true });
    return await achievDir.getDirectoryHandle('Documents', { create: true });
  }
  if (rootName === 'ach1ev' || rootName === 'achiev') {
    return await rootHandle.getDirectoryHandle('Documents', { create: true });
  }
  const achievDir = await rootHandle.getDirectoryHandle('Ach1ev', { create: true });
  return await achievDir.getDirectoryHandle('Documents', { create: true });
}

export async function urlOrDataToBlob(source: string | Blob, fallbackMime = 'application/pdf'): Promise<Blob> {
  if (source instanceof Blob) return source;
  const res = await fetch(source);
  const blob = await res.blob();
  if (!blob.type && fallbackMime) {
    return new Blob([blob], { type: fallbackMime });
  }
  return blob;
}

export interface DeviceSaveResult {
  saved: boolean;
  method: 'fs-handle' | 'share-sheet' | 'download';
  destinationLabel: string;
  fileName: string;
}

/**
 * Cross-platform save to Ach1ev/Documents (or user's chosen destination folder):
 * 1. If a File System Access directory handle is already authorized (or user picks Documents/folder on desktop/Android), writes into <dir>/Ach1ev/Documents/<fileName>.
 * 2. Otherwise triggers clean device download/save with filename metadata for Windows, macOS, Android & iOS Files.
 */
export async function saveFileToAch1evDeviceFolder(
  fileName: string,
  payload: Blob | string,
  options?: { promptFolderIfMissing?: boolean; mimeType?: string }
): Promise<DeviceSaveResult> {
  const safeName = fileName.replace(/[\\/:*?"<>|]+/g, '_');
  const blob = await urlOrDataToBlob(payload, options?.mimeType || 'application/pdf');
  let dirHandle = await getStoredDirectoryHandle();

  if (!dirHandle && options?.promptFolderIfMissing && typeof (window as any).showDirectoryPicker === 'function') {
    try {
      dirHandle = await (window as any).showDirectoryPicker({
        id: 'achiev-documents-dest',
        mode: 'readwrite',
        startIn: 'documents',
      });
      await storeDirectoryHandle(dirHandle);
      const label = `${dirHandle.name}/Ach1ev/Documents`;
      localStorage.setItem(LS_DEST_LABEL, label);
      localStorage.setItem(LS_DEST_CUSTOM, '1');
      window.dispatchEvent(new CustomEvent('achiev_destination_changed'));
    } catch {
      dirHandle = null;
    }
  }

  if (dirHandle) {
    const granted = await verifyWritePermission(dirHandle, true);
    if (granted) {
      try {
        const targetDir = await ensureAch1evDocumentsSubdir(dirHandle);
        const fileHandle = await targetDir.getFileHandle(safeName, { create: true });
        const writable = await fileHandle.createWritable();
        await writable.write(blob);
        await writable.close();
        return {
          saved: true,
          method: 'fs-handle',
          destinationLabel: getSavedDestinationLabel(),
          fileName: safeName,
        };
      } catch {
        // Fall through to standard device download
      }
    }
  }

  // Fallback for iOS Safari / Firefox / restricted iframes
  const objectUrl = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = objectUrl;
  a.download = safeName;
  a.style.display = 'none';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.setTimeout(() => URL.revokeObjectURL(objectUrl), 4000);

  return {
    saved: true,
    method: 'download',
    destinationLabel: getSavedDestinationLabel(),
    fileName: safeName,
  };
}
