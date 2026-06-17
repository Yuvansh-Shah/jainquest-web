'use client';

import { useEffect, useState } from 'react';
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useApp } from '@/state/app-context';
import { useT } from '@/state/language';
import { userFromMap } from '@/lib/domain/models';
import { MagicCard } from '@/components/magic-card';

// Capped query (matches the mobile fix): never stream the whole users
// collection — that is a cost/bandwidth/privacy problem at scale.
const LIMIT = 100;

interface Entry {
  id: string;
  name: string;
  xp: number;
  level: number;
}

export default function LeaderboardPage() {
  const { user } = useApp();
  const t = useT();
  const [entries, setEntries] = useState<Entry[] | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      const snap = await getDocs(
        query(
          collection(db, 'users'),
          orderBy('totalXp', 'desc'),
          limit(LIMIT),
        ),
      );
      if (!active) return;
      const list = snap.docs.map((d) => {
        const p = userFromMap(d.data(), d.id);
        const name =
          p.displayName?.trim() ||
          p.email?.split('@')[0]?.trim() ||
          'Learner';
        return { id: p.id, name, xp: p.totalXp, level: p.level };
      });
      list.sort((a, b) => b.xp - a.xp || b.level - a.level);
      setEntries(list);
    })();
    return () => {
      active = false;
    };
  }, []);

  if (!user) return null;
  if (!entries) {
    return <p className="text-muted">{t('lb.loading')}</p>;
  }

  const myRank = entries.findIndex((e) => e.id === user.id);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-extrabold">{t('lb.title')}</h1>

      <MagicCard
        className="card flex items-center gap-4 p-5"
        enableStars={false}
        enableMagnetism={false}
        clickEffect={false}
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary font-extrabold text-white">
          {myRank >= 0 ? myRank + 1 : '–'}
        </div>
        <div>
          <p className="font-bold text-primary">{t('lb.yourRank')}</p>
          <p className="text-sm text-muted">
            {user.totalXp} XP · Level {user.level}
          </p>
        </div>
      </MagicCard>

      <ol className="space-y-2">
        {entries.map((e, i) => {
          const me = e.id === user.id;
          return (
            <li key={e.id}>
              <MagicCard
                className={`flex items-center gap-4 rounded-xl border px-4 py-3 ${
                  me
                    ? 'border-primary bg-primary/10'
                    : 'border-border bg-surface'
                }`}
                enableStars={false}
                enableMagnetism={false}
                clickEffect={false}
              >
              <span className="w-8 text-center font-extrabold text-muted">
                {i + 1}
              </span>
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-surface-2 font-bold">
                {e.name[0]?.toUpperCase() ?? '?'}
              </div>
              <span className="flex-1 truncate font-bold">
                {e.name}
                {me && (
                  <span className="ml-2 text-xs text-primary">
                    {t('lb.you')}
                  </span>
                )}
              </span>
              <span className="text-sm text-muted">{e.xp} XP</span>
              <span className="rounded-full bg-primary px-2 py-0.5 text-xs font-bold text-white">
                L{e.level}
              </span>
              </MagicCard>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
