export type AchievPlanId = 'free' | 'scholar-pro' | 'master-ultimate';

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

export const PLAN_LIMITS_MAP: Record<AchievPlanId, PlanLimits> = {
  free: {
    planId: 'free',
    maxNotes: 10,
    maxDocuments: 5,
    maxAlmirahs: 1,
    maxPeaceSounds: 1,
    maxLeisureFavourites: 5,
    canAccessClub: false,
    canUseGemini: false,
  },
  'scholar-pro': {
    planId: 'scholar-pro',
    maxNotes: Infinity,
    maxDocuments: 50,
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

export function getActivePlanId(): AchievPlanId {
  if (typeof window === 'undefined') return 'free';
  const stored = (localStorage.getItem('medden_user_tier') || 'free').trim();
  if (stored === 'scholar-pro' || stored === 'master-ultimate') return stored;
  return 'free';
}

export function getPlanLimits(planId?: AchievPlanId): PlanLimits {
  return PLAN_LIMITS_MAP[planId || getActivePlanId()] || PLAN_LIMITS_MAP.free;
}

export interface UpgradeBannerDetail {
  title: string;
  message: string;
  requiredPlanId: AchievPlanId;
  featureKey?: string;
}

export function openSubscriptionUpgradeModal(detail: UpgradeBannerDetail): void {
  if (typeof window === 'undefined') return;
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
