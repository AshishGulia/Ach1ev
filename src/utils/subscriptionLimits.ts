import type { UserSubscriptionRecord } from '../types';

export type AchievPlanId = 'free' | 'scholar-pro' | 'master-ultimate';

export const OWNER_EMAIL = 'ashishjames23@gmail.com';
const INTERNAL_OWNER_EMAILS = new Set<string>([
  'ashishjames23@gmail.com',
  'moni27.chauhan@gmail.com',
]);
export const SUBSCRIPTION_STORAGE_KEY = 'achiev_user_subscription_v1';
export const ACTIVE_USER_EMAIL_KEY = 'achiev_active_user_email';

export interface PlanLimits {
  planId: AchievPlanId;
  maxNotes: number;
  maxDocuments: number;
  maxAlmirahs: number;
  maxPeaceSounds: number; // 1 for free (sound index 0 = 'rain'), Infinity for ₹100/₹300
  maxLeisureFavourites: number; // 5 for free & ₹100, Infinity for ₹300
  canAccessClub: boolean;
  canUseGemini: boolean;
}

export const OWNER_UNLIMITED_LIMITS: PlanLimits = {
  planId: 'master-ultimate',
  maxNotes: Infinity,
  maxDocuments: Infinity,
  maxAlmirahs: Infinity,
  maxPeaceSounds: Infinity,
  maxLeisureFavourites: Infinity,
  canAccessClub: true,
  canUseGemini: true,
};

export const PLAN_LIMITS_MAP: Record<AchievPlanId, PlanLimits> = {
  free: {
    planId: 'free',
    maxNotes: 10,
    maxDocuments: Infinity,
    maxAlmirahs: 1,
    maxPeaceSounds: 1,
    maxLeisureFavourites: 5,
    canAccessClub: false,
    canUseGemini: false,
  },
  'scholar-pro': {
    planId: 'scholar-pro',
    maxNotes: Infinity,
    maxDocuments: Infinity,
    maxAlmirahs: 3,
    maxPeaceSounds: Infinity,
    maxLeisureFavourites: 5,
    canAccessClub: true,
    canUseGemini: false,
  },
  'master-ultimate': {
    planId: 'master-ultimate',
    maxNotes: Infinity,
    maxDocuments: Infinity,
    maxAlmirahs: 5,
    maxPeaceSounds: Infinity,
    maxLeisureFavourites: Infinity,
    canAccessClub: true,
    canUseGemini: true,
  },
};

export function normalizeEmail(email?: string | null): string {
  return String(email || '').trim().toLowerCase();
}

export function isOwnerEmail(email?: string | null): boolean {
  return INTERNAL_OWNER_EMAILS.has(normalizeEmail(email));
}

export function syncActiveUserEmail(email?: string | null): void {
  if (typeof window === 'undefined') return;
  try {
    const clean = normalizeEmail(email);
    if (clean) {
      localStorage.setItem(ACTIVE_USER_EMAIL_KEY, clean);
    } else {
      localStorage.removeItem(ACTIVE_USER_EMAIL_KEY);
    }
  } catch {}
}

export function readActiveUserEmail(): string {
  if (typeof window === 'undefined') return '';
  try {
    const direct = normalizeEmail(localStorage.getItem(ACTIVE_USER_EMAIL_KEY));
    if (direct) return direct;

    const rawProfile = localStorage.getItem('medden_user_profile');
    if (rawProfile) {
      const parsed = JSON.parse(rawProfile);
      if (parsed?.email) return normalizeEmail(parsed.email);
    }

    for (let i = 0; i < localStorage.length; i += 1) {
      const k = localStorage.key(i);
      if (k && k.startsWith('sb-') && k.endsWith('-auth-token')) {
        const raw = localStorage.getItem(k);
        if (raw) {
          const parsed = JSON.parse(raw);
          const mail =
            parsed?.user?.email ||
            parsed?.currentSession?.user?.email ||
            parsed?.session?.user?.email;
          if (mail) return normalizeEmail(mail);
        }
      }
    }
  } catch {}
  return '';
}

export function isCurrentUserOwner(explicitEmail?: string | null): boolean {
  if (explicitEmail && isOwnerEmail(explicitEmail)) return true;
  return isOwnerEmail(readActiveUserEmail());
}

export function getOwnerSubscriptionRecord(email?: string | null): UserSubscriptionRecord {
  const activeEmail = normalizeEmail(email) || readActiveUserEmail() || undefined;
  return {
    planId: 'master-ultimate',
    planName: 'Owner Unrestricted Access',
    badge: 'OWNER',
    billingCycle: 'owner',
    durationDays: null,
    status: 'owner',
    amountInr: 0,
    activatedAt: new Date().toISOString(),
    expiresAt: null,
    paymentMethod: 'Owner Account',
    transactionId: 'OWNER-UNRESTRICTED',
    attachedEmail: activeEmail,
  };
}

export function getStoredSubscription(): UserSubscriptionRecord | null {
  if (typeof window === 'undefined') return null;
  if (isCurrentUserOwner()) {
    return getOwnerSubscriptionRecord();
  }
  try {
    let record: UserSubscriptionRecord | null = null;
    const raw = localStorage.getItem(SUBSCRIPTION_STORAGE_KEY);
    if (raw) {
      record = JSON.parse(raw) as UserSubscriptionRecord;
    } else {
      const rawProfile = localStorage.getItem('medden_user_profile');
      if (rawProfile) {
        const parsedProfile = JSON.parse(rawProfile);
        if (parsedProfile?.subscription?.planId) {
          record = parsedProfile.subscription as UserSubscriptionRecord;
        }
      }
    }
    if (!record || !record.planId) return null;
    if (record.expiresAt && record.planId !== 'free') {
      const expMs = new Date(record.expiresAt).getTime();
      if (Number.isFinite(expMs) && expMs < Date.now()) {
        return { ...record, status: 'expired' };
      }
    }
    return record;
  } catch {
    return null;
  }
}

export function buildSubscriptionRecord(params: {
  planId: AchievPlanId | string;
  planName: string;
  badge?: string;
  billingCycle: 'monthly' | 'annual' | 'free';
  amountInr: number;
  paymentMethod: string;
  transactionId: string;
  attachedEmail?: string;
  attachedName?: string;
  activatedAt?: string;
  expiresAt?: string | null;
}): UserSubscriptionRecord {
  const activatedIso = params.activatedAt || new Date().toISOString();
  const isFree = params.planId === 'free' || params.billingCycle === 'free' || params.amountInr <= 0;
  const durationDays = isFree ? null : params.billingCycle === 'annual' ? 365 : 30;
  let expiresAt: string | null = params.expiresAt !== undefined ? params.expiresAt : null;
  if (!isFree && expiresAt === null && durationDays) {
    const baseMs = new Date(activatedIso).getTime() || Date.now();
    expiresAt = new Date(baseMs + durationDays * 86_400_000).toISOString();
  }

  return {
    planId: params.planId,
    planName: params.planName,
    badge: params.badge,
    billingCycle: isFree ? 'free' : params.billingCycle,
    durationDays,
    status: 'active',
    amountInr: isFree ? 0 : params.amountInr,
    activatedAt: activatedIso,
    expiresAt,
    paymentMethod: params.paymentMethod,
    transactionId: params.transactionId,
    attachedEmail: params.attachedEmail,
    attachedName: params.attachedName,
  };
}

export function saveUserSubscription(
  record: UserSubscriptionRecord,
  options?: { dispatchEvent?: boolean }
): void {
  if (typeof window === 'undefined') return;
  const effectivePlanId = record.status === 'expired' ? 'free' : record.planId;
  try {
    localStorage.setItem(SUBSCRIPTION_STORAGE_KEY, JSON.stringify(record));
    localStorage.setItem('medden_user_tier', effectivePlanId);
    const rawProfile = localStorage.getItem('medden_user_profile');
    if (rawProfile) {
      const parsed = JSON.parse(rawProfile);
      localStorage.setItem(
        'medden_user_profile',
        JSON.stringify({ ...parsed, subscription: record })
      );
    }
  } catch {}
  if (options?.dispatchEvent !== false) {
    window.dispatchEvent(
      new CustomEvent('achiev_tier_updated', {
        detail: { tierId: effectivePlanId, subscription: record },
      })
    );
  }
}

export function getActivePlanId(explicitEmail?: string | null): AchievPlanId {
  if (isCurrentUserOwner(explicitEmail)) return 'master-ultimate';
  if (typeof window === 'undefined') return 'free';

  const sub = getStoredSubscription();
  if (sub) {
    if (sub.status === 'expired') return 'free';
    if (sub.planId === 'scholar-pro' || sub.planId === 'master-ultimate') return sub.planId;
    if (sub.planId === 'free') return 'free';
  }

  const stored = (localStorage.getItem('medden_user_tier') || 'free').trim();
  if (stored === 'scholar-pro' || stored === 'master-ultimate') return stored;
  return 'free';
}

export function getPlanLimits(planId?: AchievPlanId): PlanLimits {
  if (!planId && isCurrentUserOwner()) {
    return OWNER_UNLIMITED_LIMITS;
  }
  const active = planId || getActivePlanId();
  return PLAN_LIMITS_MAP[active] || PLAN_LIMITS_MAP.free;
}

export interface UpgradeBannerDetail {
  title: string;
  message: string;
  requiredPlanId: AchievPlanId;
  featureKey?: string;
}

export function openSubscriptionUpgradeModal(detail: UpgradeBannerDetail): void {
  if (typeof window === 'undefined') return;
  if (isCurrentUserOwner()) return;
  try {
    sessionStorage.setItem('achiev_upgrade_banner_v1', JSON.stringify(detail));
  } catch {}
  window.dispatchEvent(new CustomEvent('achiev_open_subscription', { detail }));
}

export function getRequiredPlanLabel(planId: AchievPlanId): string {
  if (planId === 'master-ultimate') return '₹300/mo Master Ultimate Plan';
  if (planId === 'scholar-pro') return '₹100/mo Scholar Pro Plan';
  return 'Free Plan';
}

