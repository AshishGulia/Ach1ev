import { createClient, SupabaseClient } from '@supabase/supabase-js';

export interface SupabaseRuntimeConfig {
  url: string;
  anonKey: string;
  source: 'env' | 'local' | 'none';
}

const DEFAULT_SUPABASE_URL = 'https://koghxdkvdrsfszeykdok.supabase.co';
const DEFAULT_SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_rzt6vajMvhi7amv47VBY8Q_-eBSeXhN';
const LS_SUPABASE_URL = 'medden_supabase_url';
const LS_SUPABASE_KEY = 'medden_supabase_anon_key';

function isValidHttpUrl(val: string): boolean {
  return /^https?:\/\/[a-z0-9.-]+/i.test(val) && !val.includes('YOUR_PROJECT_ID') && !val.includes('YOUR_SUPABASE');
}

function isValidSupabaseKey(val: string): boolean {
  if (!val) return false;
  if (val === 'VITE_SUPABASE_ANON_KEY' || val === 'SUPABASE_ANON_KEY' || val === 'NEXT_PUBLIC_SUPABASE_ANON_KEY') {
    return false;
  }
  if (val.includes('YOUR_SUPABASE')) return false;
  return val.length >= 20;
}

let runtimeServerUrl = '';
let runtimeServerKey = '';

export function getSupabaseConfig(): SupabaseRuntimeConfig {
  const envUrlRaw = (import.meta.env?.VITE_SUPABASE_URL as string | undefined)?.trim() || '';
  const envUrl = isValidHttpUrl(envUrlRaw) ? envUrlRaw : DEFAULT_SUPABASE_URL;
  const envKeyRaw = (import.meta.env?.VITE_SUPABASE_ANON_KEY as string | undefined)?.trim() || '';

  if (envUrl && isValidSupabaseKey(envKeyRaw)) {
    return { url: envUrl, anonKey: envKeyRaw, source: 'env' };
  }

  if (isValidHttpUrl(runtimeServerUrl) && isValidSupabaseKey(runtimeServerKey)) {
    return { url: runtimeServerUrl, anonKey: runtimeServerKey, source: 'env' };
  }

  if (typeof window !== 'undefined') {
    const localUrlRaw = localStorage.getItem(LS_SUPABASE_URL)?.trim() || '';
    const localUrl = isValidHttpUrl(localUrlRaw) ? localUrlRaw : DEFAULT_SUPABASE_URL;
    const localKey = localStorage.getItem(LS_SUPABASE_KEY)?.trim() || '';
    if (localUrl && isValidSupabaseKey(localKey)) {
      return { url: localUrl, anonKey: localKey, source: 'local' };
    }
  }

  return {
    url: DEFAULT_SUPABASE_URL,
    anonKey: DEFAULT_SUPABASE_PUBLISHABLE_KEY,
    source: 'env',
  };
}

export async function hydrateSupabaseConfigFromServer(): Promise<boolean> {
  const current = getSupabaseConfig();
  if (current.url && current.anonKey) return false;
  try {
    const res = await fetch('/api/supabase/config');
    if (!res.ok) return false;
    const data = await res.json();
    const url = String(data?.url || '').trim();
    const anonKey = String(data?.anonKey || '').trim();
    if (isValidHttpUrl(url) && isValidSupabaseKey(anonKey)) {
      runtimeServerUrl = url;
      runtimeServerKey = anonKey;
      cachedClient = null;
      cachedSignature = '';
      return true;
    }
  } catch {
    // Ignore offline error
  }
  return false;
}

let cachedClient: SupabaseClient | null = null;
let cachedSignature = '';

export function isSupabaseConfigured(): boolean {
  const cfg = getSupabaseConfig();
  return Boolean(isValidHttpUrl(cfg.url) && isValidSupabaseKey(cfg.anonKey));
}

export function getSupabaseClient(): SupabaseClient | null {
  const cfg = getSupabaseConfig();
  if (!isValidHttpUrl(cfg.url) || !isValidSupabaseKey(cfg.anonKey)) {
    return null;
  }

  const sig = `${cfg.url}|${cfg.anonKey}`;
  if (cachedClient && cachedSignature === sig) {
    return cachedClient;
  }

  cachedClient = createClient(cfg.url, cfg.anonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storageKey: 'medden-supabase-auth',
    },
    realtime: {
      params: {
        eventsPerSecond: 10,
      },
    },
  });
  cachedSignature = sig;
  return cachedClient;
}

export function saveRuntimeSupabaseConfig(url: string, anonKey: string): void {
  if (typeof window === 'undefined') return;
  if (url.trim() && anonKey.trim()) {
    localStorage.setItem(LS_SUPABASE_URL, url.trim());
    localStorage.setItem(LS_SUPABASE_KEY, anonKey.trim());
  } else {
    localStorage.removeItem(LS_SUPABASE_URL);
    localStorage.removeItem(LS_SUPABASE_KEY);
  }
  cachedClient = null;
  cachedSignature = '';
}
