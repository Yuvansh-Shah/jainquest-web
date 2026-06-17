'use client';

import { useState } from 'react';
import { useApp } from '@/state/app-context';
import { allLessons } from '@/lib/domain/content/curriculum';
import { isLessonCompleted } from '@/lib/domain/models';
import { XpRewards, HeartsSystem } from '@/lib/domain/gamification';
import { recordQuestionAttempt } from '@/lib/domain/lesson-flow';
import { MagicCard } from '@/components/magic-card';
import type { QuizQuestion } from '@/lib/domain/lessonModels';
import type { AttemptLog } from '@/lib/domain/models';
import { useT } from '@/state/language';

type Mode = 'review' | 'weak';

export default function PracticePage() {
  const { progress, storage, addXp, refillHeart, updateStreak, user } = useApp();
  const t = useT();
  const [questions, setQuestions] = useState<QuizQuestion[] | null>(null);
  const [mode, setMode] = useState<Mode>('review');
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [earnedXp, setEarnedXp] = useState(0);
  const [done, setDone] = useState<{ hearts: boolean } | null>(null);
  const [busy, setBusy] = useState(false);

  if (!progress || !storage || !user) return null;

  const completedLessons = allLessons.filter((l) =>
    isLessonCompleted(progress, l.lessonId),
  );
  const allQuestions = completedLessons.flatMap((l) => l.screens.quiz.questions);

  function start(m: Mode) {
    if (allQuestions.length === 0) return;
    const picked =
      m === 'review'
        ? shuffle([...allQuestions]).slice(0, 8)
        : weakSpotQuestions();
    setMode(m);
    setQuestions(picked);
    setIndex(0);
    setSelected(null);
    setShowFeedback(false);
    setCorrectCount(0);
    setEarnedXp(0);
    setDone(null);
  }

  function weakSpotQuestions(): QuizQuestion[] {
    if (allQuestions.length === 0) return [];
    const now = Date.now();
    const lessonByQ = new Map<string, string>();
    for (const l of completedLessons)
      for (const q of l.screens.quiz.questions)
        lessonByQ.set(q.questionId, l.lessonId);

    const attemptsByQ = new Map<string, AttemptLog[]>();
    for (const a of storage!.getAttemptLogs()) {
      if (!lessonByQ.has(a.questionId)) continue;
      const arr = attemptsByQ.get(a.questionId) ?? [];
      arr.push(a);
      attemptsByQ.set(a.questionId, arr);
    }
    for (const arr of attemptsByQ.values())
      arr.sort((a, b) => b.attemptedAt.getTime() - a.attemptedAt.getTime());

    const lowScoreLessons = new Set(
      completedLessons
        .filter(
          (l) => (progress!.lessonProgress[l.lessonId]?.bestScore ?? 100) < 100,
        )
        .map((l) => l.lessonId),
    );

    const priority = (q: QuizQuestion): number => {
      const attempts = attemptsByQ.get(q.questionId) ?? [];
      const hasIncorrect = attempts.some((a) => !a.isCorrect);
      const hasDue = attempts.some(
        (a) => a.nextReviewDate != null && a.nextReviewDate.getTime() <= now,
      );
      const fromLow = lowScoreLessons.has(lessonByQ.get(q.questionId) ?? '');
      if (hasIncorrect && hasDue) return 0;
      if (hasIncorrect) return 1;
      if (fromLow) return 2;
      if (hasDue) return 3;
      return 4;
    };

    const ranked = [...allQuestions].sort(
      (a, b) => priority(a) - priority(b),
    );
    const focused = ranked.filter((q) => priority(q) < 4).slice(0, 8);
    if (focused.length > 0) return focused;
    return shuffle([...allQuestions]).slice(0, 8);
  }

  async function answer(choiceId: string) {
    if (showFeedback || busy || !questions) return;
    setSelected(choiceId);
    const q = questions[index];
    const correct =
      q.format === 'trueFalse'
        ? choiceId === q.answerKey
        : !!q.choices?.find((c) => c.choiceId === choiceId)?.isCorrect;
    setShowFeedback(true);
    setBusy(true);
    try {
      const xp = correct ? XpRewards.practice : 0;
      setCorrectCount((n) => n + (correct ? 1 : 0));
      setEarnedXp((x) => x + xp);
      await recordQuestionAttempt(storage!, {
        lessonId: '',
        questionId: q.questionId,
        isCorrect: correct,
      });
      if (correct) await addXp(xp);
    } finally {
      setBusy(false);
    }
  }

  async function next() {
    if (!questions) return;
    if (index < questions.length - 1) {
      setIndex((i) => i + 1);
      setSelected(null);
      setShowFeedback(false);
      return;
    }
    setBusy(true);
    try {
      const before = user!.hearts;
      const updated = await refillHeartReturn();
      await updateStreak();
      setDone({ hearts: updated > before });
      setQuestions(null);
    } finally {
      setBusy(false);
    }
  }

  async function refillHeartReturn(): Promise<number> {
    await refillHeart(HeartsSystem.practiceHeartReward);
    // user state updates async; read from storage for the post-refill value.
    return storage!.getUserProfile().hearts;
  }

  if (allQuestions.length === 0 && !questions && !done) {
    return (
      <Empty title={t('practice.title')}>{t('practice.empty')}</Empty>
    );
  }

  if (done) {
    return (
      <div className="card mx-auto max-w-md p-8 text-center">
        <h2 className="text-2xl font-extrabold">{t('practice.complete')}</h2>
        <p className="mt-1 text-muted">
          {t('practice.result', { c: correctCount, x: earnedXp })}
        </p>
        {done.hearts && (
          <p className="mt-2 font-bold text-success">{t('practice.heart')}</p>
        )}
        <button
          type="button"
          onClick={() => setDone(null)}
          className="mt-8 rounded-full bg-primary px-8 py-3 font-bold text-white hover:bg-primary-strong"
        >
          {t('practice.back')}
        </button>
      </div>
    );
  }

  if (!questions) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-extrabold">{t('practice.title')}</h1>
        <p className="text-muted">{t('practice.intro')}</p>
        <div className="grid gap-4 sm:grid-cols-2">
          <ModeCard
            title={t('practice.review')}
            desc={t('practice.reviewDesc')}
            onClick={() => start('review')}
          />
          <ModeCard
            title={t('practice.weak')}
            desc={t('practice.weakDesc')}
            onClick={() => start('weak')}
          />
        </div>
      </div>
    );
  }

  const q = questions[index];
  const choices =
    q.format === 'trueFalse'
      ? [
          { choiceId: 'true', label: 'True' },
          { choiceId: 'false', label: 'False' },
        ]
      : (q.choices ?? []).map((c) => ({ choiceId: c.choiceId, label: c.label }));
  const isCorrectChoice = (id: string) =>
    q.format === 'trueFalse'
      ? id === q.answerKey
      : !!q.choices?.find((c) => c.choiceId === id)?.isCorrect;

  return (
    <div className="mx-auto max-w-2xl">
      <p className="mb-4 text-sm font-bold text-muted">
        {mode === 'review' ? t('practice.review') : t('practice.weak')} ·{' '}
        {index + 1}/{questions.length}
      </p>
      <div className="card p-7">
        <h2 className="text-xl font-extrabold leading-snug">{q.prompt}</h2>
        <div className="mt-6 space-y-3">
          {choices.map((c) => {
            const correct = isCorrectChoice(c.choiceId);
            let cls = 'border-border bg-surface hover:border-primary';
            if (showFeedback) {
              if (correct) cls = 'border-success bg-success/10';
              else if (c.choiceId === selected)
                cls = 'border-danger bg-danger/10';
              else cls = 'border-border opacity-60';
            } else if (c.choiceId === selected) {
              cls = 'border-primary bg-primary/10';
            }
            return (
              <button
                key={c.choiceId}
                type="button"
                disabled={showFeedback}
                onClick={() => answer(c.choiceId)}
                className={`w-full rounded-xl border-2 px-4 py-3 text-left font-semibold transition ${cls}`}
              >
                {c.label}
              </button>
            );
          })}
        </div>
        {showFeedback && (
          <button
            type="button"
            disabled={busy}
            onClick={next}
            className="mt-7 w-full rounded-full bg-primary py-3 font-bold text-white hover:bg-primary-strong disabled:opacity-50"
          >
            {index < questions.length - 1
              ? t('practice.next')
              : t('practice.finish')}
          </button>
        )}
      </div>
    </div>
  );
}

function shuffle<T>(arr: T[]): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function ModeCard({
  title,
  desc,
  onClick,
}: {
  title: string;
  desc: string;
  onClick: () => void;
}) {
  return (
    <MagicCard className="block rounded-[1.25rem]" particleCount={14}>
      <button
        type="button"
        onClick={onClick}
        className="card w-full p-6 text-left transition hover:border-primary"
      >
        <h3 className="text-lg font-extrabold">{title}</h3>
        <p className="mt-1 text-sm text-muted">{desc}</p>
      </button>
    </MagicCard>
  );
}

function Empty({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-extrabold">{title}</h1>
      <p className="text-muted">{children}</p>
    </div>
  );
}
