import React from 'react';
import { X, Shield, Lock, Database, CreditCard, Mail, FileDown } from 'lucide-react';

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[150] flex items-center justify-center p-3 sm:p-5 bg-black/65 backdrop-blur-sm animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="achiev-privacy-title"
    >
      <div className="relative w-full max-w-3xl max-h-[88vh] flex flex-col rounded-2xl bg-[#fbf5ea] dark:bg-[#1a110b] border border-[#b98c5b]/45 dark:border-[#4b3120] shadow-2xl overflow-hidden text-[#3b1e0d] dark:text-[#efe4d4]">
        <div className="px-6 py-4 border-b border-[#d9c1a0] dark:border-[#382518] flex items-center justify-between bg-[#f4e7d2] dark:bg-[#140c08]">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-[#4a2511] text-[#f6ebd8]">
              <Shield className="w-4 h-4" />
            </span>
            <div>
              <h2 id="achiev-privacy-title" className="text-base sm:text-lg font-bold tracking-tight">
                Achiev Privacy Policy &amp; Data Protection
              </h2>
              <p className="text-[11px] opacity-75">Last updated: April 2026 · Applicable to achiev.com &amp; Vercel/Supabase deployments</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl border border-[#c7a982] dark:border-[#4b3120] hover:bg-[#ead8bd] dark:hover:bg-[#2a1a11] transition-colors cursor-pointer"
            aria-label="Close Privacy Policy"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 text-xs sm:text-[13px] leading-relaxed">
          <section className="space-y-1.5">
            <h3 className="font-bold text-sm flex items-center gap-2">
              <Lock className="w-4 h-4 text-[#8c5220]" />
              <span>1. What Data We Collect</span>
            </h3>
            <p className="opacity-90">
              When you sign in to Achiev, we collect only your account identifier (email address or Google/OAuth profile ID, and optional display name) along with the notes, syllabus schedules, trackers, bookshelves, and study documents you explicitly choose to create or sync.
            </p>
          </section>

          <section className="space-y-1.5">
            <h3 className="font-bold text-sm flex items-center gap-2">
              <Database className="w-4 h-4 text-[#8c5220]" />
              <span>2. Local Storage, Supabase &amp; Optional Google Drive Sync</span>
            </h3>
            <p className="opacity-90">
              Your notes and workspace preferences are stored locally in your browser so you can work offline anytime. When signed in with Supabase cloud sync enabled, records synchronize securely over HTTPS with row-level access controls (RLS) so only your authenticated account can read or modify your study workspace. Large PDF/DOCX uploads can optionally be offloaded directly to your own personal Google Drive via Google OAuth 2.0.
            </p>
          </section>

          <section className="space-y-1.5">
            <h3 className="font-bold text-sm flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-[#8c5220]" />
              <span>3. Razorpay Payments &amp; Subscription Verification</span>
            </h3>
            <p className="opacity-90">
              Paid upgrades (Clinical Scholar Pro ₹100/mo and Chief Fellow Master ₹300/mo) are processed through Razorpay’s PCI-DSS compliant checkout. Achiev never stores your full card number, CVV, UPI PIN, or net-banking credentials. Only verified Razorpay payment/order identifiers and HMAC-SHA256 verification status are saved in Supabase to unlock your chosen plan.
            </p>
          </section>

          <section className="space-y-1.5">
            <h3 className="font-bold text-sm">4. AI Features &amp; Document Handling</h3>
            <p className="opacity-90">
              Gemini AI study tools (Master Ultimate plan) process only the specific query, snippet, or image you submit for synthesis, mnemonic creation, or table extraction. Uploaded study files are never sold, rented, or used for third-party advertising.
            </p>
          </section>

          <section className="space-y-1.5">
            <h3 className="font-bold text-sm flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#8c5220]" />
              <span>5. Your Rights, Export &amp; Deletion</span>
            </h3>
            <p className="opacity-90">
              You may export your workspace backup JSON anytime from Settings or clear local workspace data and request permanent cloud record deletion via Settings &gt; Support / Talk to Developer or by emailing privacy@achiev.com.
            </p>
          </section>
        </div>

        <div className="px-6 py-3.5 border-t border-[#d9c1a0] dark:border-[#382518] bg-[#f4e7d2] dark:bg-[#140c08] flex flex-wrap items-center justify-between gap-2">
          <span className="text-[11px] opacity-75">Achiev — Settle Ideas</span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => window.print()}
              className="px-3 py-1.5 rounded-xl border border-[#c7a982] dark:border-[#4b3120] hover:bg-[#ead8bd] dark:hover:bg-[#2a1a11] text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
            >
              <FileDown className="w-3.5 h-3.5" />
              <span>Save / View PDF</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 rounded-xl bg-[#4a2511] hover:bg-[#381b0b] text-[#f6ebd8] text-xs font-semibold transition-colors cursor-pointer"
            >
              Close Policy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
