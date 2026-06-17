'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import { translate, type Lang } from '@/lib/i18n';

const STORAGE_KEY = 'jq_lang';

interface LanguageState {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: string, vars?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageState | null>(null);

function isLang(v: unknown): v is Lang {
  return v === 'en' || v === 'hi' || v === 'gu';
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  // Start as 'en' on both server and first client render (no hydration
  // mismatch); adopt the stored preference right after mount.
  const [lang, setLangState] = useState<Lang>('en');

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (isLang(stored) && stored !== lang) setLangState(stored);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setLang = (next: Lang) => {
    setLangState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // ignore storage failures (private mode, etc.)
    }
  };

  const value: LanguageState = {
    lang,
    setLang,
    t: (key, vars) => translate(lang, key, vars),
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang(): LanguageState {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLang must be used within LanguageProvider');
  return ctx;
}

/** Convenience: just the translate function bound to the current language. */
export function useT() {
  return useLang().t;
}
