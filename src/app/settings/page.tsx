'use client';

import { useState } from 'react';
import { useApp } from '@/state/app-context';
import { useLang } from '@/state/language';
import { LANGS, type Lang } from '@/lib/i18n';
import { MagicCard } from '@/components/magic-card';

export default function SettingsPage() {
  const { user, storage, saveProfile, signOut } = useApp();
  const { t, lang, setLang } = useLang();
  const [dark, setDark] = useState(() => storage?.getThemeMode() === 'dark');
  const [savingLang, setSavingLang] = useState(false);

  if (!user || !storage) return null;

  async function toggleTheme() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle('light', !next);
    await storage!.saveThemeMode(next ? 'dark' : 'light');
  }

  async function changeLang(code: Lang) {
    setLang(code); // instant UI switch
    setSavingLang(true);
    try {
      await saveProfile({ ...user!, preferredLanguageCode: code });
    } finally {
      setSavingLang(false);
    }
  }

  return (
    <div className="max-w-xl space-y-6">
      <h1 className="text-3xl font-extrabold">{t('set.title')}</h1>

      <div className="card divide-y divide-border">
        <Row title={t('set.dark')} desc={t('set.darkDesc')}>
          <button
            type="button"
            onClick={toggleTheme}
            className={`relative h-7 w-12 rounded-full transition ${
              dark ? 'bg-primary' : 'bg-surface-2'
            }`}
            aria-pressed={dark}
          >
            <span
              className={`absolute top-1 h-5 w-5 rounded-full bg-white transition-all ${
                dark ? 'left-6' : 'left-1'
              }`}
            />
          </button>
        </Row>

        <Row title={t('set.lang')} desc={t('set.langDesc')}>
          <select
            value={lang}
            disabled={savingLang}
            onChange={(e) => changeLang(e.target.value as Lang)}
            className="rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm outline-none focus:border-primary"
          >
            {LANGS.map((l) => (
              <option key={l.code} value={l.code}>
                {l.name}
              </option>
            ))}
          </select>
        </Row>

        <Row title={t('set.account')} desc={user.email ?? t('set.signedIn')}>
          <MagicCard className="rounded-full" enableStars={false} enableTilt={false} enableMagnetism>
            <button
              type="button"
              onClick={() => void signOut()}
              className="rounded-full border border-danger px-4 py-2 text-sm font-bold text-danger transition hover:bg-danger hover:text-white"
            >
              {t('set.signOut')}
            </button>
          </MagicCard>
        </Row>
      </div>

      <p className="text-center text-xs text-muted">{t('set.footer')}</p>
    </div>
  );
}

function Row({
  title,
  desc,
  children,
}: {
  title: string;
  desc: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-4 p-5">
      <div className="flex-1">
        <p className="font-bold">{title}</p>
        <p className="text-sm text-muted">{desc}</p>
      </div>
      {children}
    </div>
  );
}
