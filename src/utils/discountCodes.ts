export interface DiscountCodeResult {
  code: string;
  percentOff: number;
  label: string;
}

const VALID_DISCOUNT_CODES: Record<string, DiscountCodeResult> = {
  ACHIEV10: { code: 'ACHIEV10', percentOff: 10, label: '10% Scholar Discount' },
  ACHIEV20: { code: 'ACHIEV20', percentOff: 20, label: '20% Launch Offer' },
  ACHIEV25: { code: 'ACHIEV25', percentOff: 25, label: '25% Student Pass' },
  ACHIEV30: { code: 'ACHIEV30', percentOff: 30, label: '30% Founder Privilege' },
  ACHIEV50: { code: 'ACHIEV50', percentOff: 50, label: '50% Merit Scholarship' },
  SCHOLAR50: { code: 'SCHOLAR50', percentOff: 50, label: '50% Scholar Grant' },
  STUDENT25: { code: 'STUDENT25', percentOff: 25, label: '25% Student Discount' },
  WELCOME15: { code: 'WELCOME15', percentOff: 15, label: '15% Welcome Credit' },
  MED10: { code: 'MED10', percentOff: 10, label: '10% Study Circle' },
};

const STORAGE_KEY = 'achiev_discount_code_v1';

export function validateDiscountCode(rawCode: string): DiscountCodeResult | null {
  const clean = String(rawCode || '').trim().toUpperCase();
  if (!clean) return null;
  return VALID_DISCOUNT_CODES[clean] || null;
}

export function getSavedDiscountCode(): DiscountCodeResult | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY) || localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return validateDiscountCode(raw);
  } catch {
    return null;
  }
}

export function saveDiscountCode(code: string | null): void {
  if (typeof window === 'undefined') return;
  try {
    const clean = String(code || '').trim().toUpperCase();
    if (!clean) {
      sessionStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(STORAGE_KEY);
    } else {
      sessionStorage.setItem(STORAGE_KEY, clean);
      localStorage.setItem(STORAGE_KEY, clean);
    }
  } catch {}
}

export function calculateDiscountedPrice(basePrice: number, percentOff: number): number {
  if (!Number.isFinite(basePrice) || basePrice <= 0) return 0;
  if (!Number.isFinite(percentOff) || percentOff <= 0) return basePrice;
  return Math.max(1, Math.round(basePrice * (1 - percentOff / 100)));
}
