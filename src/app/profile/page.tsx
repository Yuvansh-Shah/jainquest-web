'use client';

import { useState } from 'react';
import { useApp } from '@/state/app-context';
import { allBadges } from '@/lib/domain/content/curriculum';
import { LevelSystem } from '@/lib/domain/gamification';
import { MagicCard } from '@/components/magic-card';
import { AvatarPicker } from '@/components/avatar-picker';
import { useT } from '@/state/language';

// Mirrors the mobile app's derived-achievement fix: these IDs are never
// written to earnedBadges, so their state is derived from real progress.
const DERIVED = [
  { id: 'first_steps', name: 'First Steps', description: 'Complete your first lesson' },
  { id: 'week_warrior', name: 'Week Warrior', description: 'Maintain a 7-day streak' },
  { id: 'perfect_score', name: 'Perfect Score', description: 'Get 100% on a quiz' },
  { id: 'unit_master', name: 'Unit Master', description: 'Complete an entire unit' },
  { id: 'streak_legend', name: 'Streak Legend', description: 'Maintain a 30-day streak' },
];

export default function ProfilePage() {
  const { user, progress, saveProfile } = useApp();
  const t = useT();
  const [picking, setPicking] = useState(false);
  if (!user || !progress) return null;

  const initial = user.displayName?.trim()?.[0]?.toUpperCase() ?? '?';

  async function chooseAvatar(emoji: string | null) {
    setPicking(false);
    if (!user || emoji === (user.avatarEmoji ?? null)) return;
    await saveProfile({ ...user, avatarEmoji: emoji });
  }

  const title = LevelSystem.getLevelTitle(user.level);
  const derivedEarned = (id: string): boolean => {
    switch (id) {
      case 'first_steps':
        return progress.completedLessons.length > 0;
      case 'week_warrior':
        return user.longestStreak >= 7;
      case 'perfect_score':
        return Object.values(progress.lessonProgress).some(
          (p) => p.bestScore >= 100,
        );
      case 'unit_master':
        return progress.earnedBadges.includes('BADGE_UNIT_MASTER');
      case 'streak_legend':
        return user.longestStreak >= 30;
      default:
        return false;
    }
  };

  const badges = [
    ...allBadges.map((b) => ({
      id: b.id,
      name: b.name,
      description: b.description,
      earned: progress.earnedBadges.includes(b.id),
    })),
    ...DERIVED.map((b) => ({
      id: b.id,
      name: b.name,
      description: b.description,
      earned: derivedEarned(b.id),
    })),
  ];
  const earnedCount = badges.filter((b) => b.earned).length;

  const avatar = user.avatarEmoji?.trim() || initial;

  return (
    <div className="space-y-8">
      <MagicCard
        className="card flex items-center gap-5 p-6"
        enableStars={false}
        enableMagnetism={false}
        clickEffect={false}
      >
        <button
          type="button"
          onClick={() => setPicking((p) => !p)}
          title={t('profile.changeAvatar')}
          aria-label={t('profile.changeAvatar')}
          aria-expanded={picking}
          className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-primary/15 text-3xl font-extrabold text-primary transition hover:ring-2 hover:ring-primary"
        >
          {avatar}
        </button>
        <div>
          <h1 className="text-2xl font-extrabold">
            {user.displayName ?? t('common.explorer')}
          </h1>
          <p className="text-muted">
            {t('common.level', { n: user.level })} · {title}
          </p>
          {user.email && (
            <p className="text-xs text-muted">{user.email}</p>
          )}
          <button
            type="button"
            onClick={() => setPicking((p) => !p)}
            className="mt-1 text-xs font-bold text-primary hover:underline"
          >
            {t('profile.changeAvatar')}
          </button>
        </div>
      </MagicCard>

      {picking && (
        <MagicCard
          className="card p-5"
          enableStars={false}
          enableMagnetism={false}
          clickEffect={false}
        >
          <AvatarPicker
            value={user.avatarEmoji ?? null}
            fallback={initial}
            onSelect={chooseAvatar}
          />
        </MagicCard>
      )}

      <section className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Stat label={t('profile.totalXp')} value={user.totalXp} />
        <Stat label={t('profile.currentStreak')} value={user.currentStreak} />
        <Stat label={t('profile.longestStreak')} value={user.longestStreak} />
        <Stat
          label={t('profile.lessonsDone')}
          value={progress.completedLessons.length}
        />
      </section>

      <section>
        <div className="mb-4 flex items-baseline justify-between">
          <h2 className="text-xl font-extrabold">{t('profile.badges')}</h2>
          <span className="text-sm text-muted">
            {t('profile.earnedOf', { e: earnedCount, t: badges.length })}
          </span>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {badges.map((b) => (
            <MagicCard
              key={b.id}
              className={`card p-4 ${b.earned ? '' : 'opacity-55'}`}
              enableStars={b.earned}
              enableMagnetism={false}
              clickEffect={false}
              particleCount={8}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-bold">{b.name}</p>
                  <p className="text-xs text-muted">{b.description}</p>
                </div>
                <span
                  className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                    b.earned
                      ? 'bg-primary/20 text-primary'
                      : 'bg-surface-2 text-muted'
                  }`}
                >
                  {b.earned ? t('profile.earned') : t('profile.lockedBadge')}
                </span>
              </div>
            </MagicCard>
          ))}
        </div>
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <MagicCard
      className="card p-5 text-center"
      enableStars={false}
      enableMagnetism={false}
      clickEffect={false}
    >
      <p className="text-2xl font-extrabold">{value}</p>
      <p className="text-xs text-muted">{label}</p>
    </MagicCard>
  );
}
