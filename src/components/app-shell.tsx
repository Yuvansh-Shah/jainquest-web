'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState, type ReactNode } from 'react';
import { useApp } from '@/state/app-context';
import { useT } from '@/state/language';
import { isProfileComplete } from '@/lib/domain/models';
import { HeartsSystem, LevelSystem } from '@/lib/domain/gamification';
import { ProfileSetup } from '@/components/profile-setup';
import { MagicCard, SpotlightLayer } from '@/components/magic-card';

const NAV = [
  { href: '/', key: 'nav.home' },
  { href: '/resources', key: 'nav.resources' },
  { href: '/practice', key: 'nav.practice' },
  { href: '/guru', key: 'nav.guru' },
  { href: '/forum', key: 'nav.community' },
  { href: '/leaderboard', key: 'nav.leaderboard' },
  { href: '/profile', key: 'nav.profile' },
  { href: '/settings', key: 'nav.settings' },
];

export function AppShell({ children }: { children: ReactNode }) {
  const { user, signOut } = useApp();
  const pathname = usePathname();
  const t = useT();

  if (user && !isProfileComplete(user)) {
    return <ProfileSetup />;
  }

  return (
    <div className="flex min-h-screen text-foreground">
      <SpotlightLayer spotlightRadius={280} />
      <aside className="glass sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-border px-4 py-6 md:flex">
        <Link
          href="/"
          className="font-display mb-8 px-3 text-2xl font-semibold tracking-tight"
        >
          Jain<span className="text-primary">Quest</span>
        </Link>
        <nav className="flex flex-1 flex-col gap-1">
          {NAV.map((item) => {
            const active =
              item.href === '/'
                ? pathname === '/'
                : pathname.startsWith(item.href);
            return (
              <MagicCard
                key={item.href}
                className="rounded-xl"
                enableStars={false}
                enableTilt={false}
                enableMagnetism
              >
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold transition ${
                    active
                      ? 'bg-primary/15 text-primary'
                      : 'text-muted hover:bg-surface-2 hover:text-foreground'
                  }`}
                >
                  {t(item.key)}
                </Link>
              </MagicCard>
            );
          })}
        </nav>
        <MagicCard
          className="mt-4 rounded-xl"
          enableStars={false}
          enableTilt={false}
          enableMagnetism
        >
          <button
            type="button"
            onClick={() => void signOut()}
            className="w-full rounded-xl px-3 py-2.5 text-left text-sm font-bold text-muted transition hover:bg-surface-2 hover:text-danger"
          >
            {t('nav.signOut')}
          </button>
        </MagicCard>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar />
        <main className="mx-auto w-full max-w-5xl flex-1 px-5 py-8">
          {children}
        </main>
      </div>
    </div>
  );
}

const REGEN_MS = HeartsSystem.heartRegenMinutes * 60_000;

function formatDuration(ms: number): string {
  const mins = Math.max(1, Math.ceil(ms / 60_000));
  if (mins < 60) return `${mins}m`;
  return `${Math.floor(mins / 60)}h ${mins % 60}m`;
}

function TopBar() {
  const { user } = useApp();
  const t = useT();
  // Live ticker so the heart-regen countdown stays current between the
  // app-context's 60s heart sync.
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 30_000);
    return () => window.clearInterval(id);
  }, []);

  if (!user) return null;

  const level = user.level;
  const title = LevelSystem.getLevelTitle(level);
  const progress = LevelSystem.getLevelProgress(level, user.totalXp);
  const isMaxLevel = level >= LevelSystem.xpGates.length;
  const xpToNext = LevelSystem.getXpNeededForNextLevel(level, user.totalXp);

  // Next heart regenerates REGEN_MS after the earliest still-active loss.
  const nextHeartLabel = (() => {
    if (user.hearts >= HeartsSystem.maxHearts) return null;
    const upcoming = user.heartLossTimestamps
      .map((d) => d.getTime())
      .filter((ms) => now < ms + REGEN_MS)
      .sort((a, b) => a - b);
    if (upcoming.length === 0) return null;
    return t('topbar.nextHeart', {
      t: formatDuration(upcoming[0] + REGEN_MS - now),
    });
  })();

  return (
    <header className="glass sticky top-0 z-10 flex items-center gap-3 border-b border-border px-4 py-2.5 sm:gap-4 sm:px-5 sm:py-3">
      <div className="min-w-0">
        <p className="truncate text-sm font-bold">
          {user.displayName ?? t('common.explorer')}
        </p>
        <p className="truncate text-xs text-muted">
          {t('common.level', { n: level })} · {title}
        </p>
      </div>

      <div className="ml-auto flex items-center gap-2 sm:gap-3">
        <Pill
          icon="🔥"
          value={user.currentStreak}
          title={t('topbar.streakAria', { n: user.currentStreak })}
        />
        <Pill
          icon="❤️"
          value={`${user.hearts}/${HeartsSystem.maxHearts}`}
          sub={nextHeartLabel}
          title={nextHeartLabel ?? t('topbar.heartFull')}
        />
      </div>

      <div className="hidden min-w-[9rem] sm:block">
        <div className="mb-1 flex items-center justify-between gap-2 text-[0.65rem] font-bold uppercase tracking-wide text-muted">
          <span className="truncate">
            {isMaxLevel
              ? t('topbar.maxLevel')
              : t('topbar.toNext', { n: xpToNext, l: level + 1 })}
          </span>
          <span className="shrink-0 tabular-nums">{user.totalXp} XP</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-surface-2">
          <div
            className="h-full rounded-full bg-primary transition-all"
            style={{ width: `${Math.round(progress * 100)}%` }}
          />
        </div>
      </div>
    </header>
  );
}

function Pill({
  icon,
  value,
  sub,
  title,
}: {
  icon: string;
  value: string | number;
  sub?: string | null;
  title?: string;
}) {
  return (
    <span
      title={title}
      className="flex items-center gap-1.5 rounded-full border border-border bg-surface-2 px-3 py-1.5 text-sm font-bold"
    >
      <span aria-hidden className="text-base leading-none">
        {icon}
      </span>
      <span className="tabular-nums">{value}</span>
      {sub && (
        <span className="hidden text-[0.65rem] font-semibold text-muted sm:inline">
          {sub}
        </span>
      )}
    </span>
  );
}
