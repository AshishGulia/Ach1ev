import React, { useEffect, useState } from 'react';
import { SUBSCRIPTION_TIERS } from '../../data/subscriptionData';
import { SubscriptionTier, UserProfile, UserSubscriptionRecord } from '../../types';
import {
  Check,
  X,
  Zap,
  CheckCircle2,
  Crown,
  Smartphone,
  CreditCard,
  Landmark,
  ShieldCheck,
  ArrowLeft,
  Lock,
  UserCheck,
  CalendarClock,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { getSupabaseConfig } from '../../lib/supabaseClient';
import { persistSubscriptionToAuthProfile } from '../../services/supabaseSyncService';
import {
  buildSubscriptionRecord,
  getActivePlanId,
  getOwnerSubscriptionRecord,
  getStoredSubscription,
  isCurrentUserOwner,
  saveUserSubscription,
  UpgradeBannerDetail,
} from '../../utils/subscriptionLimits';
import {
  calculateDiscountedPrice,
  getSavedDiscountCode,
  saveDiscountCode,
  validateDiscountCode,
  type DiscountCodeResult,
} from '../../utils/discountCodes';

const INDIAN_BANKS = [
  'State Bank of India (SBI)',
  'HDFC Bank',
  'ICICI Bank',
  'Axis Bank',
  'Kotak Mahindra Bank',
  'Punjab National Bank',
  'Bank of Baroda',
  'Yes Bank',
];

const RAZORPAY_KEY_ID =
  ((import.meta as any).env?.VITE_RAZORPAY_KEY_ID as string | undefined)?.trim() ||
  'rzp_live_U0sX2QgzwryN0q';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTierId?: string;
  onUpgradeTier?: (tierId: string) => void;
  upgradeBanner?: UpgradeBannerDetail | null;
  userProfile?: UserProfile;
}

export const SubscriptionModal: React.FC<SubscriptionModalProps> = ({
  isOpen,
  onClose,
  currentTierId = 'free',
  onUpgradeTier,
  upgradeBanner = null,
  userProfile,
}) => {
  const { user, googleUser, phoneUser } = useAuth();

  const resolvedAuthEmail =
    user?.email || googleUser?.email || userProfile?.email || '';
  const resolvedAuthName =
    (user?.user_metadata?.full_name as string | undefined) ||
    googleUser?.name ||
    phoneUser?.displayName ||
    (userProfile?.name && userProfile.name !== 'User' ? userProfile.name : '') ||
    '';
  const resolvedAuthPhone =
    user?.phone || phoneUser?.phone || userProfile?.phone || '';

  const isOwner = isCurrentUserOwner(resolvedAuthEmail);

  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');
  const [activeTier, setActiveTier] = useState<string>(() => getActivePlanId(resolvedAuthEmail) || currentTierId);
  const [activeSubRecord, setActiveSubRecord] = useState<UserSubscriptionRecord | null>(() =>
    userProfile?.subscription || getStoredSubscription()
  );
  const [upgradedFeedback, setUpgradedFeedback] = useState<string | null>(null);
  const [bannerDetail, setBannerDetail] = useState<UpgradeBannerDetail | null>(upgradeBanner);
  const [discountInput, setDiscountInput] = useState<string>(() => getSavedDiscountCode()?.code || '');
  const [appliedDiscount, setAppliedDiscount] = useState<DiscountCodeResult | null>(() => getSavedDiscountCode());
  const [discountError, setDiscountError] = useState<string | null>(null);

  // Sender details (payer / account holder only — zero sample/creator fields)
  const [senderName, setSenderName] = useState<string>(resolvedAuthName);
  const [senderEmail, setSenderEmail] = useState<string>(resolvedAuthEmail);
  const [senderPhone, setSenderPhone] = useState<string>(resolvedAuthPhone);
  const [senderUpiId, setSenderUpiId] = useState<string>('');

  // Checkout state
  const [checkoutTier, setCheckoutTier] = useState<SubscriptionTier | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [utrRef, setUtrRef] = useState('');
  const [cardHolder, setCardHolder] = useState(resolvedAuthName);
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [selectedBank, setSelectedBank] = useState(INDIAN_BANKS[0]);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [isProcessingRazorpay, setIsProcessingRazorpay] = useState(false);
  const [receiptInfo, setReceiptInfo] = useState<{
    tierName: string;
    planType: string;
    durationLabel: string;
    expiresAt: string | null;
    amountInr: number;
    methodLabel: string;
    txnId: string;
    attachedEmail: string;
  } | null>(null);

  useEffect(() => {
    setSenderName((prev) => prev || resolvedAuthName);
    setSenderEmail((prev) => prev || resolvedAuthEmail);
    setSenderPhone((prev) => prev || resolvedAuthPhone);
    setCardHolder((prev) => prev || resolvedAuthName);
  }, [resolvedAuthName, resolvedAuthEmail, resolvedAuthPhone]);

  useEffect(() => {
    if (!isOpen) return;
    setActiveTier(getActivePlanId(resolvedAuthEmail));
    setActiveSubRecord(
      isOwner
        ? getOwnerSubscriptionRecord(resolvedAuthEmail || undefined)
        : userProfile?.subscription || getStoredSubscription()
    );
  }, [isOpen, isOwner, resolvedAuthEmail, userProfile?.subscription]);

  useEffect(() => {
    if (upgradeBanner) {
      setBannerDetail(upgradeBanner);
      return;
    }
    if (isOpen) {
      try {
        const raw = sessionStorage.getItem('achiev_upgrade_banner_v1');
        if (raw) {
          setBannerDetail(JSON.parse(raw));
          sessionStorage.removeItem('achiev_upgrade_banner_v1');
        }
      } catch {}
    }
  }, [isOpen, upgradeBanner]);

  useEffect(() => {
    if (!isOpen) return;
    const saved = getSavedDiscountCode();
    if (saved) {
      setAppliedDiscount(saved);
      setDiscountInput(saved.code);
      setDiscountError(null);
    }
  }, [isOpen]);

  const getDiscountedAmount = (basePrice: number) =>
    appliedDiscount ? calculateDiscountedPrice(basePrice, appliedDiscount.percentOff) : basePrice;

  const checkoutAmount = checkoutTier
    ? getDiscountedAmount(billingCycle === 'annual' ? checkoutTier.priceAnnual : checkoutTier.priceMonthly)
    : 0;

  if (!isOpen) return null;

  const formatDateDisplay = (iso?: string | null) => {
    if (!iso) return 'Lifetime / No Expiry';
    try {
      return new Date(iso).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return iso;
    }
  };

  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if ((window as any).Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => resolve(Boolean((window as any).Razorpay));
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const finalizeUpgrade = (tier: SubscriptionTier, methodLabel: string, txnRef?: string) => {
    const txnId = txnRef || `ACH-${Date.now().toString().slice(-8)}`;
    const baseInr = billingCycle === 'annual' ? tier.priceAnnual : tier.priceMonthly;
    const amountInr = getDiscountedAmount(baseInr);
    const cycle: 'monthly' | 'annual' | 'free' =
      amountInr <= 0 || tier.id === 'free' ? 'free' : billingCycle;
    const attachedEmail = senderEmail.trim() || resolvedAuthEmail;
    const attachedName = senderName.trim() || resolvedAuthName;

    const record = buildSubscriptionRecord({
      planId: tier.id,
      planName: tier.name,
      badge: tier.badge,
      billingCycle: cycle,
      amountInr,
      paymentMethod: methodLabel,
      transactionId: txnId,
      attachedEmail,
      attachedName,
    });

    saveUserSubscription(record);
    void persistSubscriptionToAuthProfile(record);

    setActiveTier(tier.id);
    setActiveSubRecord(record);
    onUpgradeTier?.(tier.id);

    const planType =
      cycle === 'annual' ? 'Annual Plan' : cycle === 'monthly' ? 'Monthly Plan' : 'Free Plan';
    const durationLabel =
      record.durationDays === 365
        ? '365 Days (12 Months)'
        : record.durationDays === 30
        ? '30 Days (1 Month)'
        : 'Unlimited Free Tier';

    setReceiptInfo({
      tierName: tier.name,
      planType,
      durationLabel,
      expiresAt: record.expiresAt,
      amountInr,
      methodLabel,
      txnId,
      attachedEmail: attachedEmail || attachedName || 'Current Profile',
    });
    setCheckoutTier(null);
    setCheckoutError(null);
    setBannerDetail(null);
    setUpgradedFeedback(`${tier.name} (${planType})`);
    setTimeout(() => setUpgradedFeedback(null), 5000);
  };

  const launchRazorpayCheckout = async (tier: SubscriptionTier) => {
    const baseInr = billingCycle === 'annual' ? tier.priceAnnual : tier.priceMonthly;
    const amountInr = getDiscountedAmount(baseInr);
    if (amountInr <= 0) return;

    const cleanSenderEmail = senderEmail.trim() || resolvedAuthEmail;
    const cleanSenderName = senderName.trim() || resolvedAuthName;
    const cleanSenderPhone = senderPhone.trim() || resolvedAuthPhone;

    if (!cleanSenderName && !cleanSenderEmail && !cleanSenderPhone) {
      setCheckoutError('Please enter your Sender Name, Email, or Contact Number before continuing.');
      return;
    }

    setCheckoutError(null);
    setIsProcessingRazorpay(true);

    try {
      const sdkReady = await loadRazorpayScript();
      if (!sdkReady || !(window as any).Razorpay) {
        setCheckoutError('Unable to load Razorpay Checkout SDK. Check your internet connection or use UPI/Card below.');
        setIsProcessingRazorpay(false);
        return;
      }

      // Create Razorpay order on Express/Vercel backend
      let orderId: string | undefined;
      try {
        const orderRes = await fetch('/api/razorpay/create-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amountInr,
            planId: tier.id,
            billingCycle,
            userEmail: cleanSenderEmail,
          }),
        });
        if (orderRes.ok) {
          const orderData = await orderRes.json();
          if (orderData?.orderId) {
            orderId = orderData.orderId;
          }
        }
      } catch {
        // Fallback: open checkout without pre-created orderId if offline
      }

      const prefill: Record<string, string> = {};
      if (cleanSenderName) prefill.name = cleanSenderName;
      if (cleanSenderEmail) prefill.email = cleanSenderEmail;
      if (cleanSenderPhone) prefill.contact = cleanSenderPhone;

      const options: Record<string, any> = {
        key: RAZORPAY_KEY_ID,
        amount: amountInr * 100,
        currency: 'INR',
        name: 'Achiev',
        description: `${tier.name} (${billingCycle === 'annual' ? 'Annual · 365 Days' : 'Monthly · 30 Days'})`,
        image: `${window.location.origin}/assets/aistudio/Final_Logo_webp_1000_x_350_e6e85d30.PNG`,
        ...(orderId ? { order_id: orderId } : {}),
        prefill,
        notes: {
          plan_id: tier.id,
          billing_cycle: billingCycle,
          sender_email: cleanSenderEmail,
          sender_name: cleanSenderName,
        },
        theme: {
          color: '#6f3d1d',
        },
        modal: {
          ondismiss: () => {
            setIsProcessingRazorpay(false);
          },
        },
        handler: async (rzpResponse: {
          razorpay_payment_id: string;
          razorpay_order_id?: string;
          razorpay_signature?: string;
        }) => {
          try {
            const payload = {
              razorpay_order_id: rzpResponse.razorpay_order_id || orderId || '',
              razorpay_payment_id: rzpResponse.razorpay_payment_id,
              razorpay_signature: rzpResponse.razorpay_signature || '',
              planId: tier.id,
              billingCycle,
              amountInr,
              userEmail: cleanSenderEmail,
              userId: user?.id || null,
            };

            let verified = false;
            let verifyError = '';

            // 1. Verify via Express / Vercel backend route
            try {
              const verifyRes = await fetch('/api/razorpay/verify-payment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
              });
              const verifyJson = await verifyRes.json();
              if (verifyRes.ok && verifyJson?.verified) {
                verified = true;
              } else if (verifyJson?.error) {
                verifyError = verifyJson.error;
              }
            } catch {}

            // 2. Fallback: verify via deployed Supabase Edge Function directly
            if (!verified) {
              const sbCfg = getSupabaseConfig();
              if (sbCfg.url && sbCfg.anonKey) {
                try {
                  const fnRes = await fetch(
                    `${sbCfg.url.replace(/\/$/, '')}/functions/v1/verify-razorpay-payment`,
                    {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                        apikey: sbCfg.anonKey,
                        Authorization: `Bearer ${sbCfg.anonKey}`,
                      },
                      body: JSON.stringify(payload),
                    }
                  );
                  const fnJson = await fnRes.json();
                  if (fnRes.ok && fnJson?.verified) {
                    verified = true;
                  } else if (fnJson?.error && !verifyError) {
                    verifyError = fnJson.error;
                  }
                } catch {}
              }
            }

            if (!verified) {
              setCheckoutError(
                verifyError ||
                  `Payment ${rzpResponse.razorpay_payment_id} captured, but server/Supabase signature verification failed (check RAZORPAY_KEY_SECRET).`
              );
              setIsProcessingRazorpay(false);
              return;
            }

            setIsProcessingRazorpay(false);
            finalizeUpgrade(
              tier,
              'Razorpay Verified Checkout',
              rzpResponse.razorpay_payment_id
            );
          } catch (err: any) {
            setIsProcessingRazorpay(false);
            setCheckoutError(err?.message || 'Razorpay signature verification failed.');
          }
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', (failure: any) => {
        setIsProcessingRazorpay(false);
        setCheckoutError(
          failure?.error?.description || 'Razorpay payment failed or was cancelled.'
        );
      });
      rzp.open();
    } catch (err: any) {
      setIsProcessingRazorpay(false);
      setCheckoutError(err?.message || 'Unable to launch Razorpay checkout.');
    }
  };

  const handleSelectTier = (tier: SubscriptionTier) => {
    const price = billingCycle === 'annual' ? tier.priceAnnual : tier.priceMonthly;
    setReceiptInfo(null);
    setCheckoutError(null);
    if (price === 0) {
      const freeRecord = buildSubscriptionRecord({
        planId: tier.id,
        planName: tier.name,
        badge: tier.badge,
        billingCycle: 'free',
        amountInr: 0,
        paymentMethod: 'Free Plan',
        transactionId: `FREE-${Date.now().toString().slice(-6)}`,
        attachedEmail: senderEmail.trim() || resolvedAuthEmail,
        attachedName: senderName.trim() || resolvedAuthName,
      });
      saveUserSubscription(freeRecord);
      void persistSubscriptionToAuthProfile(freeRecord);
      setActiveTier(tier.id);
      setActiveSubRecord(freeRecord);
      onUpgradeTier?.(tier.id);
      setUpgradedFeedback(tier.name);
      setTimeout(() => setUpgradedFeedback(null), 3000);
      return;
    }
    setCheckoutTier(tier);
  };

  const handleConfirmUpi = (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkoutTier) return;
    if (!senderName.trim() && !senderEmail.trim()) {
      setCheckoutError('Please confirm your Sender Name or Email in Sender Details.');
      return;
    }
    if (!senderUpiId.trim() || !senderUpiId.includes('@')) {
      setCheckoutError('Please enter your valid Sender UPI ID (for example yourname@bank).');
      return;
    }
    if (!utrRef.trim() || utrRef.trim().length < 6) {
      setCheckoutError('Please enter a valid 6+ character UTR / UPI Transaction Reference Number.');
      return;
    }
    finalizeUpgrade(
      checkoutTier,
      `Sender UPI (${senderUpiId.trim()})`,
      utrRef.trim()
    );
  };

  const handleConfirmCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkoutTier) return;
    const digits = cardNumber.replace(/\D/g, '');
    if (!cardHolder.trim() || digits.length < 12 || cardExpiry.trim().length < 4 || cardCvv.trim().length < 3) {
      setCheckoutError('Please complete valid Cardholder Name, 12–16 digit Card Number, MM/YY expiry, and CVV.');
      return;
    }
    finalizeUpgrade(
      checkoutTier,
      `Card •••• ${digits.slice(-4)}`,
      `CARD-${Date.now().toString().slice(-8)}`
    );
  };

  const handleConfirmNetBanking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkoutTier) return;
    if (!senderName.trim() && !senderEmail.trim()) {
      setCheckoutError('Please confirm your Sender Name or Email in Sender Details.');
      return;
    }
    finalizeUpgrade(
      checkoutTier,
      `Net Banking (${selectedBank})`,
      `NB-${Date.now().toString().slice(-8)}`
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl max-h-[92vh] flex flex-col rounded-2xl bg-[#fdfcfa] dark:bg-[#140e0a] border border-amber-900/20 dark:border-amber-500/25 shadow-2xl overflow-hidden text-stone-800 dark:text-stone-100">
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-200 dark:border-[#382518] flex items-center justify-between bg-stone-50/80 dark:bg-[#18110c]/95">
          <div className="flex items-center gap-2.5">
            {checkoutTier && (
              <button
                type="button"
                onClick={() => {
                  setCheckoutTier(null);
                  setCheckoutError(null);
                }}
                className="p-1.5 rounded-xl bg-stone-200/70 dark:bg-[#251a12] hover:bg-stone-300 dark:hover:bg-[#322318] transition-colors cursor-pointer"
                title="Back to Plans"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <span className="p-1.5 rounded-lg bg-amber-500/20 text-amber-700 dark:text-amber-300">
              <Crown className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-base font-bold text-stone-900 dark:text-stone-50">
                {checkoutTier ? `Checkout · ${checkoutTier.name}` : 'Achiev Academic Membership'}
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                {checkoutTier
                  ? 'Enter your sender details and complete payment to attach this plan to your profile'
                  : 'Transparent student pricing · Free (₹0), Scholar Pro (₹100/mo), and Master Ultimate (₹300/mo)'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-200/50 dark:hover:bg-[#251a12] transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!isOwner && bannerDetail && (
          <div className="mx-6 mt-4 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/35 text-rose-900 dark:text-rose-200 text-xs flex items-start justify-between gap-3">
            <div>
              <div className="font-bold text-sm">{bannerDetail.title}</div>
              <p className="mt-0.5 opacity-90">{bannerDetail.message}</p>
            </div>
            <button
              type="button"
              onClick={() => setBannerDetail(null)}
              className="p-1 rounded-lg hover:bg-black/10 cursor-pointer shrink-0"
              aria-label="Dismiss notice"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Billing Toggle, Discount Code & Current Attached Plan Summary */}
        {!checkoutTier && (
          <div className="px-6 py-3.5 space-y-3 border-b border-stone-200/60 dark:border-[#352317] bg-[#f9f8f4] dark:bg-[#160f0b]">
            <div className="flex flex-wrap items-center justify-between gap-3">
              {upgradedFeedback ? (
                <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-200 text-xs flex items-center gap-2 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-[#8f5f2c] dark:text-amber-400 shrink-0" />
                  <span>
                    Subscription updated to <strong>{upgradedFeedback}</strong> and attached to your profile!
                  </span>
                </div>
              ) : activeSubRecord ? (
                <div className="flex items-center gap-2 text-xs text-stone-700 dark:text-stone-300">
                  <CalendarClock className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                  <span>
                    Profile Plan: <strong>{activeSubRecord.planName}</strong>
                    {activeSubRecord.durationDays ? ` (${activeSubRecord.durationDays} Days · Valid until ${formatDateDisplay(activeSubRecord.expiresAt)})` : ''}
                  </span>
                </div>
              ) : null}

              <div className="flex items-center gap-2 ml-auto">
                <span className="text-xs font-semibold text-stone-600 dark:text-stone-400">Billing Interval:</span>
                <div className="flex items-center p-1 rounded-xl bg-stone-200/80 dark:bg-[#231912]">
                  <button
                    type="button"
                    onClick={() => setBillingCycle('monthly')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      billingCycle === 'monthly'
                        ? 'bg-white dark:bg-[#140e0a] text-stone-900 dark:text-stone-100 shadow-xs'
                        : 'text-stone-600 dark:text-stone-400'
                    }`}
                  >
                    Monthly (30 Days)
                  </button>
                  <button
                    type="button"
                    onClick={() => setBillingCycle('annual')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      billingCycle === 'annual'
                        ? 'bg-amber-600 text-white shadow-xs'
                        : 'text-stone-600 dark:text-stone-400'
                    }`}
                  >
                    <span>Annual</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-200 text-amber-950 font-mono">
                      365 Days
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* Discount Code Column */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-stone-200/70 dark:border-[#2c1e14]">
              <div className="flex items-center gap-2 flex-1 min-w-[230px]">
                <label htmlFor="sub-modal-discount" className="text-xs font-bold text-stone-700 dark:text-stone-300 shrink-0">
                  Discount Code:
                </label>
                <input
                  id="sub-modal-discount"
                  type="text"
                  value={discountInput}
                  onChange={(e) => {
                    setDiscountInput(e.target.value.toUpperCase());
                    if (discountError) setDiscountError(null);
                  }}
                  placeholder="Enter code (e.g. ACHIEV20)"
                  className="flex-1 max-w-[220px] px-3 py-1.5 rounded-lg border border-stone-200 dark:border-[#382518] bg-white dark:bg-[#120c08] text-xs font-mono uppercase outline-none focus:border-amber-500"
                />
                <button
                  type="button"
                  onClick={() => {
                    const match = validateDiscountCode(discountInput);
                    if (!match) {
                      setDiscountError('Invalid code. Try ACHIEV20, STUDENT25, or SCHOLAR50.');
                      return;
                    }
                    setAppliedDiscount(match);
                    saveDiscountCode(match.code);
                    setDiscountError(null);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold cursor-pointer"
                >
                  Apply
                </button>
                {appliedDiscount && (
                  <button
                    type="button"
                    onClick={() => {
                      setAppliedDiscount(null);
                      setDiscountInput('');
                      saveDiscountCode(null);
                    }}
                    className="px-2.5 py-1.5 rounded-lg bg-stone-200 dark:bg-[#251a12] text-stone-700 dark:text-stone-300 text-xs font-semibold cursor-pointer"
                  >
                    Remove
                  </button>
                )}
              </div>
              {appliedDiscount ? (
                <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">
                  Applied {appliedDiscount.code} ({appliedDiscount.percentOff}% off) — discounted prices shown below
                </span>
              ) : discountError ? (
                <span className="text-xs font-semibold text-rose-600 dark:text-rose-400">{discountError}</span>
              ) : (
                <span className="text-[11px] text-stone-500 dark:text-stone-400">
                  Apply a student or promo code to preview discounted plan rates
                </span>
              )}
            </div>
          </div>
        )}

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
          {receiptInfo && (
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/35 text-emerald-900 dark:text-emerald-200 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <div className="text-xs space-y-0.5">
                  <div className="font-bold text-sm">Payment Confirmed &amp; Attached to Profile</div>
                  <div>
                    Plan: <strong>{receiptInfo.tierName}</strong> ({receiptInfo.planType}) ·{' '}
                    Duration: <strong>{receiptInfo.durationLabel}</strong>
                    {receiptInfo.expiresAt ? ` · Valid Until ${formatDateDisplay(receiptInfo.expiresAt)}` : ''}
                  </div>
                  <div>
                    Paid <strong>₹{receiptInfo.amountInr.toLocaleString('en-IN')}</strong> via {receiptInfo.methodLabel} · Attached to <strong>{receiptInfo.attachedEmail}</strong>
                  </div>
                  <div className="font-mono text-[11px] opacity-80">Transaction Ref: {receiptInfo.txnId}</div>
                </div>
              </div>
            </div>
          )}

          {checkoutTier ? (
            /* ═══════════════ PAYMENT CHECKOUT VIEW (SENDER DETAILS ONLY + RAZORPAY) ═══════════════ */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left 5 Cols: Order Summary & Sender Details Only */}
              <div className="lg:col-span-5 rounded-2xl border border-stone-200 dark:border-[#382518] bg-stone-50/70 dark:bg-[#1a120d] p-5 space-y-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                    Order &amp; Duration Summary
                  </span>
                  <h4 className="text-lg font-bold text-stone-900 dark:text-stone-50 mt-0.5">{checkoutTier.name}</h4>
                  <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">{checkoutTier.description}</p>
                </div>

                <div className="p-3.5 rounded-xl bg-white dark:bg-[#120c08] border border-stone-200 dark:border-[#352317] space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-stone-600 dark:text-stone-300">
                      Total Payable ({billingCycle === 'annual' ? 'Annual' : 'Monthly'})
                    </span>
                    <span className="text-2xl font-black text-stone-900 dark:text-stone-50 font-mono">
                      ₹{checkoutAmount.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="text-[11px] text-stone-500 dark:text-stone-400 flex items-center justify-between pt-1 border-t border-stone-200/70 dark:border-[#352317]">
                    <span>Validity Duration</span>
                    <strong className="text-stone-800 dark:text-stone-200">
                      {billingCycle === 'annual' ? '365 Days (1 Year)' : '30 Days (1 Month)'}
                    </strong>
                  </div>
                </div>

                {/* Sender Details Card (No Creator / Sample Info) */}
                <div className="p-3.5 rounded-xl bg-white dark:bg-[#120c08] border border-stone-200 dark:border-[#352317] space-y-2.5 text-xs">
                  <div className="font-bold text-stone-800 dark:text-stone-200 flex items-center gap-1.5">
                    <UserCheck className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    <span>Sender Details (Attached to Your Profile)</span>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <label className="text-[11px] font-semibold text-stone-600 dark:text-stone-300 block mb-1">
                        Sender Name
                      </label>
                      <input
                        type="text"
                        placeholder="Enter your full name"
                        value={senderName}
                        onChange={(e) => setSenderName(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-stone-200 dark:border-[#382518] bg-stone-50 dark:bg-[#1a120d] text-xs outline-none focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-stone-600 dark:text-stone-300 block mb-1">
                        Sender Email
                      </label>
                      <input
                        type="email"
                        placeholder="Enter your account email"
                        value={senderEmail}
                        onChange={(e) => setSenderEmail(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-stone-200 dark:border-[#382518] bg-stone-50 dark:bg-[#1a120d] text-xs outline-none focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-stone-600 dark:text-stone-300 block mb-1">
                        Sender Mobile Number
                      </label>
                      <input
                        type="tel"
                        placeholder="Enter your mobile number"
                        value={senderPhone}
                        onChange={(e) => setSenderPhone(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-stone-200 dark:border-[#382518] bg-stone-50 dark:bg-[#1a120d] text-xs outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>
                  <p className="text-[10.5px] text-stone-500 dark:text-stone-400 leading-relaxed">
                    Once payment completes, your membership type and validity dates are stored directly on your profile.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-2.5 text-xs">
                  <div className="font-bold text-amber-900 dark:text-amber-200 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    <span>Razorpay Live Checkout</span>
                  </div>
                  <p className="text-[11px] text-stone-700 dark:text-stone-300 leading-relaxed">
                    Pay instantly via UPI QR, Debit/Credit Card, or Net Banking with cryptographic verification.
                  </p>
                  <button
                    type="button"
                    disabled={isProcessingRazorpay}
                    onClick={() => launchRazorpayCheckout(checkoutTier)}
                    className="themed-accent-btn w-full py-2.5 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow disabled:opacity-60"
                  >
                    <Zap className="w-4 h-4" />
                    <span>
                      {isProcessingRazorpay
                        ? 'Opening Razorpay Checkout...'
                        : `Pay ₹${checkoutAmount.toLocaleString('en-IN')} with Razorpay`}
                    </span>
                  </button>
                </div>
              </div>

              {/* Right 7 Cols: Payment Method Tabs (Sender Input Only, Zero Sample Data) */}
              <div className="lg:col-span-7 rounded-2xl border border-stone-200 dark:border-[#382518] bg-white dark:bg-[#1a120d] p-5 space-y-5">
                <div className="grid grid-cols-3 gap-2 p-1 rounded-xl bg-stone-100 dark:bg-[#120c08]">
                  {(
                    [
                      { id: 'upi', label: 'UPI', icon: Smartphone },
                      { id: 'card', label: 'Card Payment', icon: CreditCard },
                      { id: 'netbanking', label: 'Net Banking', icon: Landmark },
                    ] as const
                  ).map((m) => {
                    const MIcon = m.icon;
                    const active = paymentMethod === m.id;
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => {
                          setPaymentMethod(m.id);
                          setCheckoutError(null);
                        }}
                        className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                          active
                            ? 'bg-amber-600 text-white shadow-xs'
                            : 'text-stone-600 dark:text-stone-300 hover:bg-stone-200/70 dark:hover:bg-[#251a12]'
                        }`}
                      >
                        <MIcon className="w-3.5 h-3.5 shrink-0" />
                        <span>{m.label}</span>
                      </button>
                    );
                  })}
                </div>

                {checkoutError && (
                  <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/35 text-xs text-red-700 dark:text-red-300 font-medium">
                    {checkoutError}
                  </div>
                )}

                {paymentMethod === 'upi' && (
                  <form onSubmit={handleConfirmUpi} className="space-y-4">
                    <div className="p-4 rounded-2xl bg-stone-50 dark:bg-[#120c08] border border-stone-200 dark:border-[#352317] space-y-3">
                      <div className="text-xs font-bold text-stone-900 dark:text-stone-100">
                        Sender UPI Payment Details
                      </div>
                      <p className="text-[11px] text-stone-500 dark:text-stone-400 leading-relaxed">
                        Pay securely via Razorpay UPI or enter your own UPI ID and UTR reference after completing your payment for <strong>₹{checkoutAmount.toLocaleString('en-IN')}</strong>.
                      </p>
                      <button
                        type="button"
                        disabled={isProcessingRazorpay}
                        onClick={() => launchRazorpayCheckout(checkoutTier)}
                        className="px-4 py-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/35 text-amber-800 dark:text-amber-300 text-xs font-bold cursor-pointer"
                      >
                        Launch Razorpay UPI QR / Apps
                      </button>
                    </div>

                    <div>
                      <label className="text-xs font-semibold block mb-1 text-stone-700 dark:text-stone-300">
                        Your Sender UPI ID
                      </label>
                      <input
                        type="text"
                        placeholder="Enter your UPI ID (name@bank)"
                        value={senderUpiId}
                        onChange={(e) => setSenderUpiId(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-[#382518] bg-stone-50 dark:bg-[#120c08] text-xs font-mono outline-none focus:border-amber-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold block mb-1 text-stone-700 dark:text-stone-300">
                        UTR / UPI Transaction Reference Number
                      </label>
                      <input
                        type="text"
                        placeholder="Enter your 12-digit UTR / reference number"
                        value={utrRef}
                        onChange={(e) => setUtrRef(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-[#382518] bg-stone-50 dark:bg-[#120c08] text-xs font-mono outline-none focus:border-amber-500"
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      className="themed-accent-btn w-full py-2.5 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Confirm Payment &amp; Attach {checkoutTier.name}</span>
                    </button>
                  </form>
                )}

                {paymentMethod === 'card' && (
                  <form onSubmit={handleConfirmCard} className="space-y-3.5">
                    <div>
                      <label className="text-xs font-semibold block mb-1 text-stone-700 dark:text-stone-300">
                        Cardholder Name (Sender)
                      </label>
                      <input
                        type="text"
                        placeholder="Enter name printed on your card"
                        value={cardHolder}
                        onChange={(e) => setCardHolder(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-[#382518] bg-stone-50 dark:bg-[#120c08] text-xs outline-none focus:border-amber-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold block mb-1 text-stone-700 dark:text-stone-300">
                        Debit / Credit Card Number
                      </label>
                      <input
                        type="text"
                        inputMode="numeric"
                        maxLength={19}
                        placeholder="XXXX XXXX XXXX XXXX"
                        value={cardNumber}
                        onChange={(e) => {
                          const raw = e.target.value.replace(/\D/g, '').slice(0, 16);
                          const formatted = raw.replace(/(\d{4})(?=\d)/g, '$1 ');
                          setCardNumber(formatted);
                        }}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-[#382518] bg-stone-50 dark:bg-[#120c08] text-xs font-mono outline-none focus:border-amber-500"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-semibold block mb-1 text-stone-700 dark:text-stone-300">
                          Expiry (MM/YY)
                        </label>
                        <input
                          type="text"
                          inputMode="numeric"
                          maxLength={5}
                          placeholder="MM/YY"
                          value={cardExpiry}
                          onChange={(e) => {
                            const raw = e.target.value.replace(/\D/g, '').slice(0, 4);
                            setCardExpiry(raw.length > 2 ? `${raw.slice(0, 2)}/${raw.slice(2)}` : raw);
                          }}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-[#382518] bg-stone-50 dark:bg-[#120c08] text-xs font-mono outline-none focus:border-amber-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold block mb-1 text-stone-700 dark:text-stone-300">
                          CVV
                        </label>
                        <input
                          type="password"
                          inputMode="numeric"
                          maxLength={4}
                          placeholder="CVV"
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-[#382518] bg-stone-50 dark:bg-[#120c08] text-xs font-mono outline-none focus:border-amber-500"
                          required
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="themed-accent-btn w-full py-2.5 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow"
                    >
                      <Lock className="w-3.5 h-3.5" />
                      <span>Pay ₹{checkoutAmount.toLocaleString('en-IN')} via Card</span>
                    </button>
                  </form>
                )}

                {paymentMethod === 'netbanking' && (
                  <form onSubmit={handleConfirmNetBanking} className="space-y-4">
                    <div>
                      <label className="text-xs font-semibold block mb-1.5 text-stone-700 dark:text-stone-300">
                        Choose Your Bank (Sender Bank)
                      </label>
                      <select
                        value={selectedBank}
                        onChange={(e) => setSelectedBank(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-[#382518] bg-stone-50 dark:bg-[#120c08] text-xs font-semibold outline-none focus:border-amber-500 cursor-pointer"
                      >
                        {INDIAN_BANKS.map((bank) => (
                          <option key={bank} value={bank}>
                            {bank}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-[#120c08] border border-stone-200 dark:border-[#352317] text-xs space-y-1">
                      <div className="font-bold text-stone-800 dark:text-stone-200">
                        Sender Billing Summary
                      </div>
                      <div className="text-[11px] text-stone-600 dark:text-stone-400">
                        Account Holder: <strong className="text-stone-900 dark:text-stone-100">{senderName || senderEmail || 'Enter Sender Details'}</strong>
                      </div>
                      <div className="text-[11px] text-stone-600 dark:text-stone-400">
                        Selected Bank: <strong>{selectedBank}</strong> · Duration: <strong>{billingCycle === 'annual' ? '365 Days' : '30 Days'}</strong>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="themed-accent-btn w-full py-2.5 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow"
                    >
                      <Landmark className="w-4 h-4" />
                      <span>Authorize ₹{checkoutAmount.toLocaleString('en-IN')} Net Banking Payment</span>
                    </button>
                  </form>
                )}
              </div>
            </div>
          ) : (
            /* ═══════════════ 3 EXPERT PLANS GRID ═══════════════ */
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {SUBSCRIPTION_TIERS.map((tier) => {
                const isCurrent = activeTier === tier.id;
                const basePrice = billingCycle === 'annual' ? tier.priceAnnual : tier.priceMonthly;
                const price = getDiscountedAmount(basePrice);
                const hasDiscount = appliedDiscount && basePrice > 0 && price < basePrice;
                const unit = billingCycle === 'annual' ? '/ year' : '/ month';

                return (
                  <div
                    key={tier.id}
                    className={`flex flex-col justify-between p-5 rounded-2xl border transition-all ${
                      tier.highlight
                        ? 'border-amber-500 bg-amber-50/40 dark:bg-amber-950/20 shadow-md ring-2 ring-amber-500/20'
                        : 'border-stone-200 dark:border-[#382518] bg-white dark:bg-[#1a120d]'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-1 mb-2">
                        <span
                          className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                            tier.highlight
                              ? 'bg-amber-500/20 text-amber-900 dark:text-amber-200 border border-amber-500/40'
                              : 'bg-stone-100 dark:bg-[#251a12] text-stone-700 dark:text-stone-300'
                          }`}
                        >
                          {tier.badge}
                        </span>
                        {isCurrent && (
                          <span className="text-[10px] font-bold text-[#8f5f2c] dark:text-amber-400 flex items-center gap-1">
                            <Check className="w-3 h-3 stroke-[3]" /> Active
                          </span>
                        )}
                      </div>

                      <h4 className="text-sm font-bold text-stone-900 dark:text-stone-50">{tier.name}</h4>
                      <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-1 min-h-[34px] leading-tight">
                        {tier.description}
                      </p>

                      <div className="my-4 pb-3 border-b border-stone-200 dark:border-[#352317]">
                        <div className="flex items-baseline gap-2 flex-wrap">
                          {hasDiscount && (
                            <span className="text-sm line-through text-stone-400 font-mono">
                              ₹{basePrice.toLocaleString('en-IN')}
                            </span>
                          )}
                          <span className="text-2xl font-black text-stone-900 dark:text-stone-50 font-mono">
                            {price === 0 ? 'Free' : `₹${price.toLocaleString('en-IN')}`}
                          </span>
                          {price > 0 && (
                            <span className="text-xs text-stone-500 dark:text-stone-400">{unit}</span>
                          )}
                          {hasDiscount && (
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-700 dark:text-emerald-300">
                              {appliedDiscount.percentOff}% OFF
                            </span>
                          )}
                        </div>
                        {billingCycle === 'annual' && price > 0 && (
                          <span className="text-[10px] text-amber-700 dark:text-amber-400 font-semibold block mt-0.5">
                            Only ₹{Math.round(price / 12)} / month · 365 days pass
                          </span>
                        )}
                      </div>

                      <ul className="space-y-2 text-xs">
                        {tier.features.map((feat, fIdx) => (
                          <li key={fIdx} className="flex items-start gap-2 text-[11px] leading-snug">
                            <Check className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                            <span className="text-stone-700 dark:text-stone-300">{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-5 pt-3 border-t border-stone-100 dark:border-[#352317]">
                      <button
                        type="button"
                        disabled={isCurrent}
                        onClick={() => handleSelectTier(tier)}
                        className={`w-full py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                          isCurrent
                            ? 'bg-amber-600/15 text-amber-900 dark:text-amber-300 border border-amber-500/30 cursor-default'
                            : tier.highlight
                            ? 'themed-accent-btn bg-amber-600 hover:bg-amber-700 text-white shadow-xs'
                            : 'bg-stone-200 dark:bg-[#251a12] hover:bg-stone-300 dark:hover:bg-[#322318] text-stone-800 dark:text-stone-200'
                        }`}
                      >
                        {isCurrent ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Current Active Plan</span>
                          </>
                        ) : (
                          <>
                            <Zap className="w-3.5 h-3.5" />
                            <span>{price === 0 ? 'Switch to Free' : `Pay ₹${price.toLocaleString('en-IN')} · Upgrade`}</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubscriptionModal;

