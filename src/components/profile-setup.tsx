'use client';

import { useState } from 'react';
import { useApp } from '@/state/app-context';
import { useLang } from '@/state/language';
import { LANGS, type Lang } from '@/lib/i18n';
import { AvatarPicker } from '@/components/avatar-picker';

export function ProfileSetup() {
  const { user, authUser, saveProfile } = useApp();
  const { t, lang, setLang } = useLang();
  const [name, setName] = useState(user?.displayName ?? '');
  const [age, setAge] = useState(user?.age ? String(user.age) : '');
  const [avatarEmoji, setAvatarEmoji] = useState<string | null>(
    user?.avatarEmoji ?? null,
  );
  const [busy, setBusy] = useState(false);
  const [errorKey, setErrorKey] = useState<string | null>(null);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setErrorKey(null);
    if (!name.trim()) return setErrorKey('setup.errName');
    const ageNum = Number.parseInt(age, 10);
    if (!Number.isFinite(ageNum) || ageNum <= 0)
      return setErrorKey('setup.errAge');
    if (!user) return;
    setBusy(true);
    try {
      await saveProfile({
        ...user,
        displayName: name.trim(),
        age: ageNum,
        avatarEmoji,
        email: user.email ?? authUser?.email ?? null,
        preferredLanguageCode: lang,
      });
    } catch {
      setErrorKey('setup.errSave');
      setBusy(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <form onSubmit={save} className="card w-full max-w-md p-8">
        <h1 className="font-display text-2xl font-semibold">
          {t('setup.title')}
        </h1>
        <p className="mt-1 mb-6 text-sm text-muted">
          {t('setup.personalize')}
        </p>

        <label className="mb-1 block text-sm font-bold">
          {t('setup.nameQ')}
        </label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={t('setup.namePh')}
          className="mb-4 w-full rounded-xl border border-border bg-surface-2 px-4 py-3 outline-none focus:border-primary"
        />

        <label className="mb-1 block text-sm font-bold">
          {t('setup.ageQ')}
        </label>
        <input
          value={age}
          onChange={(e) => setAge(e.target.value.replace(/[^0-9]/g, ''))}
          inputMode="numeric"
          placeholder={t('setup.agePh')}
          className="mb-4 w-full rounded-xl border border-border bg-surface-2 px-4 py-3 outline-none focus:border-primary"
        />

        <label className="mb-1 block text-sm font-bold">
          {t('setup.lang')}
        </label>
        <select
          value={lang}
          onChange={(e) => setLang(e.target.value as Lang)}
          className="mb-6 w-full rounded-xl border border-border bg-surface-2 px-4 py-3 outline-none focus:border-primary"
        >
          {LANGS.map((l) => (
            <option key={l.code} value={l.code}>
              {l.name}
            </option>
          ))}
        </select>

        <label className="mb-2 block text-sm font-bold">
          {t('setup.avatarQ')}
        </label>
        <div className="mb-6">
          <AvatarPicker
            value={avatarEmoji}
            fallback={name.trim()?.[0]?.toUpperCase() || '?'}
            onSelect={setAvatarEmoji}
          />
        </div>

        {errorKey && (
          <p className="mb-4 text-sm font-semibold text-danger">
            {t(errorKey)}
          </p>
        )}
        <button
          type="submit"
          disabled={busy}
          className="w-full rounded-full bg-primary py-3 font-bold text-white transition hover:bg-primary-strong disabled:opacity-60"
        >
          {busy ? t('setup.saving') : t('setup.getStarted')}
        </button>
      </form>
    </div>
  );
}
