'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { useApp } from '@/state/app-context';
import { useLang } from '@/state/language';
import { Login } from '@/components/login';
import { Landing } from '@/components/landing';
import { AppShell } from '@/components/app-shell';
import type { Lang } from '@/lib/i18n';

export function AuthGate({ children }: { children: ReactNode }) {
  const { status, storage, user } = useApp();
  const { t, setLang } = useLang();
  // `entering` must survive route changes and reloads — the site is a static
  // export where each route is its own document, so ephemeral state would
  // bounce the user back to the landing page on every navigation. It is
  // persisted per browser session (a fresh session still starts at landing).
  const [entering, setEntering] = useState(false);

  useEffect(() => {
    try {
      if (sessionStorage.getItem('jq_entered') === '1') setEntering(true);
    } catch {
      // sessionStorage unavailable (private mode, etc.) — fall back to
      // in-memory only.
    }
  }, []);

  const enterApp = () => {
    try {
      sessionStorage.setItem('jq_entered', '1');
    } catch {
      // ignore — still works in memory for this view
    }
    setEntering(true);
  };

  // Dark is the default (matches the landing aesthetic); light mode adds a
  // `.light` class. Theme is shared with the mobile app via Firestore.
  useEffect(() => {
    if (status !== 'ready' || !storage) return;
    const light = storage.getThemeMode() === 'light';
    document.documentElement.classList.toggle('light', light);
  }, [status, storage]);

  // Adopt the signed-in user's saved language.
  const profileLang = user?.preferredLanguageCode;
  useEffect(() => {
    if (status !== 'ready' || !profileLang) return;
    if (profileLang === 'en' || profileLang === 'hi' || profileLang === 'gu') {
      setLang(profileLang as Lang);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, profileLang]);

  // Back to the landing page after signing out.
  useEffect(() => {
    if (status === 'unauthed') {
      try {
        sessionStorage.removeItem('jq_entered');
      } catch {
        // ignore
      }
      setEntering(false);
    }
  }, [status]);

  if (status === 'loading') {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-border border-t-primary" />
          <p className="text-muted">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  // The landing page is always the entry point — even for returning,
  // already-signed-in users — until they choose to continue.
  if (!entering) {
    return (
      <Landing
        authed={status === 'ready'}
        displayName={user?.displayName ?? null}
        onEnter={enterApp}
      />
    );
  }

  if (status === 'ready') return <AppShell>{children}</AppShell>;

  return <Login />;
}
