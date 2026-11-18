/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, Suspense, lazy } from 'react';
import { AuthPortal } from './components/auth/AuthPortal';
import { AchievBrand } from './components/common/AchievBrand';
import { useAuth } from './contexts/AuthContext';

const AuthenticatedWorkspace = lazy(() =>
  import('./components/workspace/AuthenticatedWorkspace').then((m) => ({
    default: m.AuthenticatedWorkspace,
  }))
);
const PrivacyPolicyModal = lazy(() =>
  import('./components/common/PrivacyPolicyModal').then((m) => ({
    default: m.PrivacyPolicyModal,
  }))
);

export default function App() {
  const {
    user,
    googleUser,
    phoneUser,
    isLoading: authLoading,
    isGuestMode,
    enterGuestMode,
  } = useAuth();

  const [isPrivacyPolicyOpen, setIsPrivacyPolicyOpen] = useState<boolean>(false);
  const isInsideDashboard = Boolean(user || googleUser || phoneUser || isGuestMode) && !authLoading;

  useEffect(() => {
    if (isInsideDashboard) return;
    const root = document.documentElement;
    root.classList.add('dark');
    root.setAttribute('data-theme', 'dark');
    root.setAttribute('data-design', '1');
    root.setAttribute('data-edition', '1');
    root.classList.add('theme-1-dark');
  }, [isInsideDashboard]);

  useEffect(() => {
    const handleOpenPrivacy = () => setIsPrivacyPolicyOpen(true);
    const handleSkipOnLogin = () => {
      if (isInsideDashboard) return;
      try {
        localStorage.setItem('achiev_pending_guest_new_note_v1', '1');
      } catch {}
      enterGuestMode();
    };

    window.addEventListener('achiev_open_privacy_policy', handleOpenPrivacy);
    window.addEventListener('achiev_skip_create_note', handleSkipOnLogin);
    return () => {
      window.removeEventListener('achiev_open_privacy_policy', handleOpenPrivacy);
      window.removeEventListener('achiev_skip_create_note', handleSkipOnLogin);
    };
  }, [enterGuestMode, isInsideDashboard]);

  if (authLoading) {
    return (
      <div
        className="min-h-screen w-screen flex flex-col items-center justify-center gap-4 px-4"
        style={{
          background:
            'radial-gradient(ellipse 85% 78% at 50% 50%, #1c0c05 0%, #100502 50%, #090301 100%)',
          color: '#efe4d4',
        }}
      >
        <div
          className="animate-pulse max-w-full flex items-center justify-center"
          style={{
            filter: 'drop-shadow(0 14px 36px rgba(10, 4, 1, 0.38))',
          }}
        >
          <AchievBrand variant="lockup" />
        </div>
        <p className="text-xs font-mono opacity-75">Initializing Achiev Cloud Workspace...</p>
      </div>
    );
  }

  return (
    <>
      {!isInsideDashboard ? (
        <AuthPortal isDarkMode={true} />
      ) : (
        <Suspense
          fallback={
            <div className="min-h-screen w-screen flex items-center justify-center text-xs font-mono opacity-70">
              Loading Ach1ev Workspace...
            </div>
          }
        >
          <AuthenticatedWorkspace />
        </Suspense>
      )}

      {isPrivacyPolicyOpen && (
        <Suspense fallback={null}>
          <PrivacyPolicyModal
            isOpen={isPrivacyPolicyOpen}
            onClose={() => setIsPrivacyPolicyOpen(false)}
          />
        </Suspense>
      )}
    </>
  );
}
