import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { SUBSCRIPTION_TIERS } from '../../data/subscriptionData';
import { SubscriptionTier } from '../../types';
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
  Copy,
  ArrowLeft,
  Lock,
} from 'lucide-react';

interface MerchantPayoutConfig {
  accountName: string;
  upiId: string;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
}

const DEFAULT_PAYOUT_CONFIG: MerchantPayoutConfig = {
  accountName: 'Ach1ev Official Study Platform',
  upiId: 'achiev@okicici',
  bankName: 'ICICI Bank Ltd.',
  accountNumber: '004201528491',
  ifscCode: 'ICIC0000042',
};

function readMerchantPayout(): MerchantPayoutConfig {
  try {
    const raw = localStorage.getItem('achiev_merchant_payout_v1');
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        accountName: parsed.accountName || DEFAULT_PAYOUT_CONFIG.accountName,
        upiId: parsed.upiId || DEFAULT_PAYOUT_CONFIG.upiId,
        bankName: parsed.bankName || DEFAULT_PAYOUT_CONFIG.bankName,
        accountNumber: parsed.accountNumber || DEFAULT_PAYOUT_CONFIG.accountNumber,
        ifscCode: parsed.ifscCode || DEFAULT_PAYOUT_CONFIG.ifscCode,
      };
    }
  } catch {}
  return DEFAULT_PAYOUT_CONFIG;
}

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

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTierId?: string;
  onUpgradeTier?: (tierId: string) => void;
}

export const SubscriptionModal: React.FC<SubscriptionModalProps> = ({
  isOpen,
  onClose,
  currentTierId = 'free',
  onUpgradeTier,
}) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');
  const [activeTier, setActiveTier] = useState<string>(() => {
    return localStorage.getItem('medden_user_tier') || currentTierId;
  });
  const [upgradedFeedback, setUpgradedFeedback] = useState<string | null>(null);
  const [payoutConfig, setPayoutConfig] = useState<MerchantPayoutConfig>(() => readMerchantPayout());

  // Checkout state
  const [checkoutTier, setCheckoutTier] = useState<SubscriptionTier | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [utrRef, setUtrRef] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [selectedBank, setSelectedBank] = useState(INDIAN_BANKS[0]);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [receiptInfo, setReceiptInfo] = useState<{
    tierName: string;
    amountInr: number;
    methodLabel: string;
    txnId: string;
  } | null>(null);

  useEffect(() => {
    const syncPayout = () => setPayoutConfig(readMerchantPayout());
    window.addEventListener('achiev_payout_updated', syncPayout);
    window.addEventListener('storage', syncPayout);
    return () => {
      window.removeEventListener('achiev_payout_updated', syncPayout);
      window.removeEventListener('storage', syncPayout);
    };
  }, []);

  const checkoutAmount = checkoutTier
    ? billingCycle === 'annual'
      ? checkoutTier.priceAnnual
      : checkoutTier.priceMonthly
    : 0;

  const upiUri = checkoutTier
    ? `upi://pay?pa=${encodeURIComponent(payoutConfig.upiId)}&pn=${encodeURIComponent(
        payoutConfig.accountName
      )}&am=${checkoutAmount}&cu=INR&tn=${encodeURIComponent(`Ach1ev ${checkoutTier.name} (${billingCycle})`)}`
    : '';

  useEffect(() => {
    if (!isOpen || !checkoutTier || checkoutAmount <= 0 || !upiUri) {
      setQrDataUrl('');
      return;
    }
    let cancelled = false;
    QRCode.toDataURL(upiUri, {
      width: 240,
      margin: 2,
      errorCorrectionLevel: 'H',
      color: {
        dark: '#1a0e07',
        light: '#ffffff',
      },
    })
      .then((url) => {
        if (!cancelled) setQrDataUrl(url);
      })
      .catch(() => {
        if (!cancelled) setQrDataUrl('');
      });
    return () => {
      cancelled = true;
    };
  }, [isOpen, checkoutTier, checkoutAmount, upiUri]);

  if (!isOpen) return null;

  const finalizeUpgrade = (tier: SubscriptionTier, methodLabel: string, txnRef?: string) => {
    const txnId = txnRef || `ACH-${Date.now().toString().slice(-8)}`;
    setActiveTier(tier.id);
    localStorage.setItem('medden_user_tier', tier.id);
    onUpgradeTier?.(tier.id);
    setReceiptInfo({
      tierName: tier.name,
      amountInr: billingCycle === 'annual' ? tier.priceAnnual : tier.priceMonthly,
      methodLabel,
      txnId,
    });
    setCheckoutTier(null);
    setCheckoutError(null);
    setUpgradedFeedback(tier.name);
    setTimeout(() => setUpgradedFeedback(null), 4000);
  };

  const handleSelectTier = (tier: SubscriptionTier) => {
    const price = billingCycle === 'annual' ? tier.priceAnnual : tier.priceMonthly;
    setReceiptInfo(null);
    setCheckoutError(null);
    if (price === 0) {
      setActiveTier(tier.id);
      localStorage.setItem('medden_user_tier', tier.id);
      onUpgradeTier?.(tier.id);
      setUpgradedFeedback(tier.name);
      setTimeout(() => setUpgradedFeedback(null), 3000);
      return;
    }
    setCheckoutTier(tier);
  };

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(payoutConfig.upiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const handleConfirmUpi = (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkoutTier) return;
    if (utrRef.trim() && utrRef.trim().length < 6) {
      setCheckoutError('Please enter a valid 6+ character UTR / UPI Transaction ID or leave blank after completing UPI confirmation.');
      return;
    }
    finalizeUpgrade(
      checkoutTier,
      `UPI (${payoutConfig.upiId})`,
      utrRef.trim() || `UPI-${Date.now().toString().slice(-8)}`
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
      `Card •••• ${digits.slice(-4)} → ${payoutConfig.accountName}`,
      `CARD-${Date.now().toString().slice(-8)}`
    );
  };

  const handleConfirmNetBanking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkoutTier) return;
    finalizeUpgrade(
      checkoutTier,
      `Net Banking (${selectedBank}) → ${payoutConfig.bankName}`,
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
                {checkoutTier ? `Checkout · ${checkoutTier.name}` : 'Ach1ev Academic Membership'}
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                {checkoutTier
                  ? `Direct settlement to ${payoutConfig.accountName} (${payoutConfig.bankName})`
                  : 'Transparent student pricing · Free, ₹1,200/yr (₹100/mo), and ₹3,600/yr (₹300/mo)'}
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

        {/* Billing Toggle & Feedback */}
        {!checkoutTier && (
          <div className="px-6 py-3.5 flex flex-wrap items-center justify-between gap-3 border-b border-stone-200/60 dark:border-[#352317] bg-[#f9f8f4] dark:bg-[#160f0b]">
            {upgradedFeedback && (
              <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-200 text-xs flex items-center gap-2 font-medium">
                <CheckCircle2 className="w-4 h-4 text-[#8f5f2c] dark:text-amber-400 shrink-0" />
                <span>
                  Subscription updated to <strong>{upgradedFeedback}</strong>! All features unlocked.
                </span>
              </div>
            )}

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
                  Monthly
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
                    12-Mo Pass
                  </span>
                </button>
              </div>
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
                  <div className="font-bold text-sm">Payment Authorized &amp; Plan Activated</div>
                  <div>
                    Plan: <strong>{receiptInfo.tierName}</strong> · Paid{' '}
                    <strong>₹{receiptInfo.amountInr.toLocaleString('en-IN')}</strong> via {receiptInfo.methodLabel}
                  </div>
                  <div className="font-mono text-[11px] opacity-80">Transaction Ref: {receiptInfo.txnId}</div>
                </div>
              </div>
            </div>
          )}

          {checkoutTier ? (
            /* ═══════════════ PAYMENT CHECKOUT VIEW (UPI + LOGO QR, CARD, NET BANKING) ═══════════════ */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left 5 Cols: Order & Beneficiary Account Summary */}
              <div className="lg:col-span-5 rounded-2xl border border-stone-200 dark:border-[#382518] bg-stone-50/70 dark:bg-[#1a120d] p-5 space-y-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                    Order Summary
                  </span>
                  <h4 className="text-lg font-bold text-stone-900 dark:text-stone-50 mt-0.5">{checkoutTier.name}</h4>
                  <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">{checkoutTier.description}</p>
                </div>

                <div className="p-3.5 rounded-xl bg-white dark:bg-[#120c08] border border-stone-200 dark:border-[#352317] flex items-center justify-between">
                  <span className="text-xs font-semibold text-stone-600 dark:text-stone-300">
                    Total Payable ({billingCycle === 'annual' ? 'Annual' : 'Monthly'})
                  </span>
                  <span className="text-2xl font-black text-stone-900 dark:text-stone-50 font-mono">
                    ₹{checkoutAmount.toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-1.5 text-xs">
                  <div className="font-bold text-amber-900 dark:text-amber-200 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    <span>Direct Settlement Account</span>
                  </div>
                  <div className="text-[11px] text-stone-700 dark:text-stone-300 space-y-0.5">
                    <div>
                      Payee: <strong>{payoutConfig.accountName}</strong>
                    </div>
                    <div>
                      UPI ID: <strong className="font-mono">{payoutConfig.upiId}</strong>
                    </div>
                    <div>
                      Bank: <strong>{payoutConfig.bankName}</strong> ({payoutConfig.ifscCode})
                    </div>
                  </div>
                </div>
              </div>

              {/* Right 7 Cols: Method Tabs + Payment Form */}
              <div className="lg:col-span-7 rounded-2xl border border-stone-200 dark:border-[#382518] bg-white dark:bg-[#1a120d] p-5 space-y-5">
                <div className="grid grid-cols-3 gap-2 p-1 rounded-xl bg-stone-100 dark:bg-[#120c08]">
                  {(
                    [
                      { id: 'upi', label: 'UPI & QR', icon: Smartphone },
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
                    <div className="flex flex-col sm:flex-row items-center gap-5 p-4 rounded-2xl bg-stone-50 dark:bg-[#120c08] border border-stone-200 dark:border-[#352317]">
                      {/* QR CODE WITH CENTERED ACH1EV LOGO */}
                      <div className="relative inline-flex items-center justify-center p-2.5 rounded-2xl bg-white border border-stone-200 shadow-sm shrink-0">
                        {qrDataUrl ? (
                          <img
                            src={qrDataUrl}
                            alt={`UPI Payment QR for ${payoutConfig.upiId}`}
                            className="w-44 h-44 object-contain"
                          />
                        ) : (
                          <div className="w-44 h-44 bg-stone-100 rounded-xl animate-pulse" />
                        )}
                        {/* Centered Ach1ev Logo Badge inside High-ECC QR Code */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <div className="w-11 h-11 rounded-full bg-white p-1.5 shadow-md border border-amber-500/40 flex items-center justify-center">
                            <img
                              src="./android-chrome-192x192.png"
                              alt="Ach1ev Logo"
                              className="w-full h-full object-contain rounded-full"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex-1 space-y-2.5 text-center sm:text-left">
                        <div className="text-xs font-bold text-stone-900 dark:text-stone-100">
                          Scan with GPay, PhonePe, Paytm or BHIM
                        </div>
                        <p className="text-[11px] text-stone-500 dark:text-stone-400 leading-relaxed">
                          This QR encodes <strong>₹{checkoutAmount}</strong> directly to{' '}
                          <span className="font-mono font-bold text-stone-800 dark:text-stone-200">
                            {payoutConfig.upiId}
                          </span>
                          .
                        </p>
                        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                          <button
                            type="button"
                            onClick={handleCopyUpi}
                            className="px-3 py-1.5 rounded-xl bg-stone-200 dark:bg-[#251a12] hover:bg-stone-300 dark:hover:bg-[#322318] text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                          >
                            <Copy className="w-3.5 h-3.5" />
                            <span>{copiedUpi ? 'Copied UPI ID!' : 'Copy UPI ID'}</span>
                          </button>
                          <a
                            href={upiUri}
                            className="px-3 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/35 text-amber-800 dark:text-amber-300 text-xs font-bold"
                          >
                            Open UPI App
                          </a>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-semibold block mb-1 text-stone-700 dark:text-stone-300">
                        UTR / UPI Reference Number (Optional after scan)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 418923749102"
                        value={utrRef}
                        onChange={(e) => setUtrRef(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-[#382518] bg-stone-50 dark:bg-[#120c08] text-xs font-mono outline-none focus:border-amber-500"
                      />
                    </div>

                    <button
                      type="submit"
                      className="themed-accent-btn w-full py-2.5 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Verify UPI Payment &amp; Activate {checkoutTier.name}</span>
                    </button>
                  </form>
                )}

                {paymentMethod === 'card' && (
                  <form onSubmit={handleConfirmCard} className="space-y-3.5">
                    <div>
                      <label className="text-xs font-semibold block mb-1 text-stone-700 dark:text-stone-300">
                        Cardholder Name
                      </label>
                      <input
                        type="text"
                        placeholder="Dr. Aarav Sharma"
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
                        placeholder="4532 8910 2234 5678"
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
                          placeholder="08/28"
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
                          placeholder="•••"
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
                        Choose Your Bank
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
                        Beneficiary Settlement Account
                      </div>
                      <div className="text-[11px] text-stone-600 dark:text-stone-400">
                        Account Name: <strong className="text-stone-900 dark:text-stone-100">{payoutConfig.accountName}</strong>
                      </div>
                      <div className="text-[11px] text-stone-600 dark:text-stone-400">
                        Bank &amp; Branch: <strong>{payoutConfig.bankName}</strong> · IFSC:{' '}
                        <span className="font-mono font-bold">{payoutConfig.ifscCode}</span>
                      </div>
                      <div className="text-[11px] text-stone-600 dark:text-stone-400">
                        Account No.: <span className="font-mono font-bold">{payoutConfig.accountNumber}</span>
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
                const price = billingCycle === 'annual' ? tier.priceAnnual : tier.priceMonthly;
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
                        <div className="flex items-baseline gap-1">
                          <span className="text-2xl font-black text-stone-900 dark:text-stone-50 font-mono">
                            {price === 0 ? 'Free' : `₹${price.toLocaleString('en-IN')}`}
                          </span>
                          {price > 0 && (
                            <span className="text-xs text-stone-500 dark:text-stone-400">{unit}</span>
                          )}
                        </div>
                        {billingCycle === 'annual' && price > 0 && (
                          <span className="text-[10px] text-amber-700 dark:text-amber-400 font-semibold block mt-0.5">
                            Only ₹{Math.round(price / 12)} / month billed annually
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
