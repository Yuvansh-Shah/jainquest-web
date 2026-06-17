'use client';

import { useRouter } from 'next/navigation';
import { useApp } from '@/state/app-context';
import { units, allLessons } from '@/lib/domain/content/curriculum';
import {
  isLessonCompleted,
  isLessonUnlocked,
  completedLessonsOn,
} from '@/lib/domain/models';
import { MagicCard } from '@/components/magic-card';
import { useT } from '@/state/language';

export default function HomePage() {
  const { user, progress } = useApp();
  const router = useRouter();
  const t = useT();
  if (!user || !progress) return null;

  const lessons = allLessons;
  const accessible = (i: number): boolean => {
    const l = lessons[i];
    if (isLessonUnlocked(progress, l.lessonId)) return true;
    if (isLessonCompleted(progress, l.lessonId)) return true;
    if (i === 0) return true;
    return isLessonCompleted(progress, lessons[i - 1].lessonId);
  };

  const currentIndex = (() => {
    const idx = lessons.findIndex(
      (l, i) => accessible(i) && !isLessonCompleted(progress, l.lessonId),
    );
    return idx >= 0 ? idx : 0;
  })();

  const doneToday = completedLessonsOn(progress, new Date());
  const dailyGoal = Math.min(doneToday, 3);

  function open(i: number) {
    if (!accessible(i)) return;
    if (user!.hearts <= 0 && !isLessonCompleted(progress!, lessons[i].lessonId))
      return;
    router.push(`/lesson/${lessons[i].lessonId}`);
  }

  function renderLesson(
    lesson: (typeof lessons)[number],
    i: number,
    displayNum: number,
  ) {
    const done = isLessonCompleted(progress!, lesson.lessonId);
    const canOpen = accessible(i);
    const isCurrent = i === currentIndex && !done;
    const blocked = !canOpen || (user!.hearts <= 0 && !done);
    return (
      <li key={lesson.lessonId}>
        <MagicCard
          className="block rounded-2xl"
          enableStars={!blocked}
          enableMagnetism={!blocked}
          clickEffect={!blocked}
        >
          <button
            type="button"
            onClick={() => open(i)}
            disabled={blocked}
            className={`flex w-full items-center gap-4 rounded-2xl border px-5 py-4 text-left transition ${
              isCurrent
                ? 'border-primary bg-primary/10'
                : done
                  ? 'border-success/40 bg-success/5'
                  : 'border-border bg-surface'
            } ${
              blocked
                ? 'cursor-not-allowed opacity-55'
                : 'hover:border-primary'
            }`}
          >
            <span
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-extrabold ${
                done
                  ? 'bg-success text-white'
                  : isCurrent
                    ? 'bg-primary text-white'
                    : 'bg-surface-2 text-muted'
              }`}
            >
              {done ? (
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden
                >
                  <path d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                displayNum
              )}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate font-bold">
                {lesson.title}
              </span>
              <span className="block truncate text-xs text-muted">
                {lesson.learningObjectives[0]}
              </span>
            </span>
            <span className="shrink-0 text-xs font-bold text-muted">
              {done
                ? t('home.review')
                : canOpen
                  ? isCurrent
                    ? t('home.start')
                    : t('home.openLesson')
                  : t('home.locked')}
            </span>
          </button>
        </MagicCard>
      </li>
    );
  }

  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-3xl font-extrabold">
          {t('home.welcome', {
            name: user.displayName ?? t('common.explorer'),
          })}
        </h1>
        <p className="mt-1 text-muted">
          {units.map((u) => u.title).join(' · ')}
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        <Card
          label={t('home.dailyGoal')}
          value={`${dailyGoal}/3`}
          hint={t('home.lessonsToday')}
        />
        <Card
          label={t('home.completed')}
          value={`${progress.completedLessons.length}`}
          hint={t('home.ofLessons', { n: lessons.length })}
        />
        <Card
          label={t('home.hearts')}
          value={`${user.hearts}/5`}
          hint={t('home.energy')}
        />
      </section>

      {user.hearts <= 0 && (
        <div className="rounded-xl border border-danger/40 bg-danger/10 px-4 py-3 text-sm font-semibold text-danger">
          {t('home.outOfHearts')}
        </div>
      )}

      <section className="space-y-8">
        <h2 className="text-xl font-extrabold">{t('home.lessonPath')}</h2>
        {units.map((unit, ui) => {
          const offset = units
            .slice(0, ui)
            .reduce((n, u) => n + u.lessons.length, 0);
          return (
            <div key={unit.id}>
              <h3 className="font-display text-lg font-semibold">
                {unit.title}
              </h3>
              <p className="mb-4 text-xs font-bold uppercase tracking-wide text-muted">
                {unit.level}
              </p>
              <ol className="space-y-3">
                {unit.lessons.map((lesson, li) =>
                  renderLesson(lesson, offset + li, li + 1),
                )}
              </ol>
            </div>
          );
        })}
      </section>
    </div>
  );
}

function Card({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <MagicCard
      className="card p-5"
      enableStars={false}
      enableMagnetism={false}
      clickEffect={false}
    >
      <p className="text-xs font-bold uppercase tracking-wide text-muted">
        {label}
      </p>
      <p className="mt-1 text-2xl font-extrabold">{value}</p>
      <p className="text-xs text-muted">{hint}</p>
    </MagicCard>
  );
}
