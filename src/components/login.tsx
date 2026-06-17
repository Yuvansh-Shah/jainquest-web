'use client';

import { useState } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
} from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';
import { useT } from '@/state/language';

type Mode = 'signin' | 'signup';

export function Login() {
  const t = useT();
  const [mode, setMode] = useState<Mode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [errorKey, setErrorKey] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErrorKey(null);
    setBusy(true);
    try {
      if (mode === 'signup') {
        await createUserWithEmailAndPassword(auth, email.trim(), password);
      } else {
        await signInWithEmailAndPassword(auth, email.trim(), password);
      }
    } catch (err) {
      setErrorKey(errorKeyFor(err));
    } finally {
      setBusy(false);
    }
  }

  async function google() {
    setErrorKey(null);
    setBusy(true);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      setErrorKey(errorKeyFor(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="font-display text-4xl font-semibold tracking-tight text-foreground">
            Jain<span className="text-primary">Quest</span>
          </h1>
          <p className="mt-2 text-muted">{t('auth.subtitle')}</p>
        </div>

        <div className="card p-8">
          <div className="mb-6 flex rounded-full bg-surface-2 p-1">
            {(['signin', 'signup'] as Mode[]).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMode(m)}
                className={`flex-1 rounded-full px-4 py-2 text-sm font-bold transition ${
                  mode === m
                    ? 'bg-primary text-white'
                    : 'text-muted hover:text-foreground'
                }`}
              >
                {m === 'signin' ? t('auth.login') : t('auth.signup')}
              </button>
            ))}
          </div>

          <form onSubmit={submit} className="space-y-4">
            <input
              type="email"
              required
              autoComplete="email"
              placeholder={t('auth.email')}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-border bg-surface-2 px-4 py-3 text-foreground outline-none focus:border-primary"
            />
            <input
              type="password"
              required
              minLength={6}
              autoComplete={
                mode === 'signup' ? 'new-password' : 'current-password'
              }
              placeholder={t('auth.password')}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-border bg-surface-2 px-4 py-3 text-foreground outline-none focus:border-primary"
            />
            {errorKey && (
              <p className="text-sm font-semibold text-danger">
                {t(errorKey)}
              </p>
            )}
            <button
              type="submit"
              disabled={busy}
              className="w-full rounded-full bg-primary py-3 font-bold text-white transition hover:bg-primary-strong disabled:opacity-60"
            >
              {busy
                ? t('auth.pleaseWait')
                : mode === 'signup'
                  ? t('auth.create')
                  : t('auth.login')}
            </button>
          </form>

          <div className="my-5 flex items-center gap-3 text-xs text-muted">
            <div className="h-px flex-1 bg-border" />
            {t('auth.or')}
            <div className="h-px flex-1 bg-border" />
          </div>

          <button
            type="button"
            onClick={google}
            disabled={busy}
            className="w-full rounded-full border border-border bg-surface py-3 font-bold text-foreground transition hover:bg-surface-2 disabled:opacity-60"
          >
            {t('auth.google')}
          </button>
        </div>

        <p className="mt-6 text-center text-xs text-muted">
          {t('auth.syncNote')}
        </p>
      </div>
    </div>
  );
}

function errorKeyFor(err: unknown): string {
  const code =
    typeof err === 'object' && err && 'code' in err
      ? String((err as { code: unknown }).code)
      : '';
  switch (code) {
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return 'auth.errCreds';
    case 'auth/email-already-in-use':
      return 'auth.errInUse';
    case 'auth/weak-password':
      return 'auth.errWeak';
    case 'auth/invalid-email':
      return 'auth.errEmail';
    case 'auth/popup-closed-by-user':
      return 'auth.errPopup';
    default:
      return 'auth.errGeneric';
  }
}
