'use client';

import { useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useApp } from '@/state/app-context';
import { lessonById } from '@/lib/domain/content/curriculum';
import { XpRewards, buildLessonCompletionSummary } from '@/lib/domain/gamification';
import { isLessonCompleted } from '@/lib/domain/models';
import { recordQuestionAttempt, badgeForLesson } from '@/lib/domain/lesson-flow';
import { useT } from '@/state/language';
import type { Choice, QuizQuestion } from '@/lib/domain/lessonModels';
import type { LessonCompletionSummary } from '@/lib/domain/gamification';

type Phase = 'warmup' | 'shortText' | 'explanation' | 'quiz' | 'complete';

export default function LessonPage() {
  const params = useParams<{ lessonId: string }>();
  const router = useRouter();
  const { progress, storage, addXp, loseHeart, completeLesson, earnBadge, updateStreak } =
    useApp();
  const t = useT();

  const lesson = useMemo(
    () => lessonById(params.lessonId),
    [params.lessonId],
  );

  const [phase, setPhase] = useState<Phase>('warmup');
  const [selected, setSelected] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [warmupXp, setWarmupXp] = useState(0);
  const [quizXp, setQuizXp] = useState(0);
  const [totalCorrect, setTotalCorrect] = useState(0);
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<boolean[]>([]);
  const [summary, setSummary] = useState<LessonCompletionSummary | null>(null);
  const [busy, setBusy] = useState(false);

  if (!lesson || !progress || !storage) {
    return (
      <div className="space-y-4">
        <p className="text-muted">{t('lesson.notFound')}</p>
        <Link href="/" className="font-bold text-primary">
          ← {t('lesson.backToLessons')}
        </Link>
      </div>
    );
  }

  const s = lesson.screens;
  const totalQuestions = s.quiz.questions.length + 1;
  const scorePercent =
    totalQuestions === 0
      ? 0
      : Math.round((totalCorrect / totalQuestions) * 100);

  function resetQuestionUi() {
    setSelected(null);
    setShowFeedback(false);
  }

  async function submitWarmup() {
    if (selected == null || busy) return;
    const choice = s.questionIntro.choices.find((c) => c.choiceId === selected);
    const correct = !!choice?.isCorrect;
    setShowFeedback(true);
    setBusy(true);
    try {
      const xp = correct ? XpRewards.warmup : 0;
      setWarmupXp(xp);
      setTotalCorrect((n) => n + (correct ? 1 : 0));
      await recordQuestionAttempt(storage!, {
        lessonId: lesson!.lessonId,
        questionId: `${lesson!.lessonId}_warmup`,
        isCorrect: correct,
      });
      if (correct) await addXp(xp);
      else await loseHeart();
    } finally {
      setBusy(false);
    }
  }

  function questionCorrect(q: QuizQuestion, choiceId: string): boolean {
    if (q.format === 'trueFalse') return choiceId === q.answerKey;
    const c = q.choices?.find((x) => x.choiceId === choiceId);
    return !!c?.isCorrect;
  }

  async function submitQuiz() {
    if (selected == null || busy) return;
    const q = s.quiz.questions[quizIndex];
    const correct = questionCorrect(q, selected);
    setShowFeedback(true);
    setBusy(true);
    try {
      setQuizAnswers((a) => [...a, correct]);
      setQuizXp((x) => x + (correct ? XpRewards.quiz : 0));
      setTotalCorrect((n) => n + (correct ? 1 : 0));
      await recordQuestionAttempt(storage!, {
        lessonId: lesson!.lessonId,
        questionId: q.questionId,
        isCorrect: correct,
      });
      if (correct) await addXp(XpRewards.quiz);
      else await loseHeart();
    } finally {
      setBusy(false);
    }
  }

  async function finishLesson(answers: boolean[]) {
    setBusy(true);
    try {
      const answerXp = warmupXp + quizXp;
      const isPerfect = answers.length > 0 && answers.every(Boolean);
      const isFirst = !isLessonCompleted(progress!, lesson!.lessonId);
      const sum = buildLessonCompletionSummary({
        answerXp,
        isPerfectQuiz: isPerfect,
        isFirstCompletion: isFirst,
      });
      if (sum.bonusXp > 0) await addXp(sum.bonusXp);
      await completeLesson(lesson!.lessonId, {
        score: scorePercent,
        xpEarned: sum.totalXp,
        nextLessonId: s.lessonComplete.nextLessonId,
      });
      await updateStreak();
      const badge = badgeForLesson(lesson!.lessonId);
      if (badge) await earnBadge(badge);
      setSummary(sum);
      setPhase('complete');
    } finally {
      setBusy(false);
    }
  }

  async function nextAfterQuiz() {
    if (quizIndex < s.quiz.questions.length - 1) {
      setQuizIndex((i) => i + 1);
      resetQuestionUi();
    } else {
      await finishLesson(quizAnswers);
    }
  }

  const progressPct = (() => {
    if (phase === 'warmup') return 10;
    if (phase === 'shortText') return 30;
    if (phase === 'explanation') return 50;
    if (phase === 'quiz')
      return 50 + Math.round((quizIndex / Math.max(1, s.quiz.questions.length)) * 45);
    return 100;
  })();

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6 flex items-center gap-4">
        <button
          type="button"
          onClick={() => router.push('/')}
          className="text-2xl leading-none text-muted hover:text-foreground"
          aria-label="Exit lesson"
        >
          &times;
        </button>
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-surface-2">
          <div
            className="h-full rounded-full bg-primary transition-all"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      <h1 className="mb-1 text-sm font-bold uppercase tracking-wide text-primary">
        {lesson.title}
      </h1>

      {phase === 'warmup' && (
        <ChoiceCard
          title={s.questionIntro.title}
          prompt={s.questionIntro.prompt}
          choices={s.questionIntro.choices}
          selected={selected}
          showFeedback={showFeedback}
          isCorrectChoice={(c) => c.isCorrect}
          onSelect={setSelected}
          onSubmit={submitWarmup}
          busy={busy}
          continueLabel={t('lesson.continue')}
          checkLabel={t('lesson.check')}
          correctText={t('lesson.correct')}
          wrongText={t('lesson.notQuite')}
          onContinue={() => {
            resetQuestionUi();
            setPhase('shortText');
          }}
        />
      )}

      {phase === 'shortText' && (
        <ReadingCard
          heading={t('lesson.read')}
          continueLabel={t('lesson.continue')}
          blocks={s.shortText.cards.map((c) => ({
            title: c.title,
            body: c.body,
          }))}
          onContinue={() => setPhase('explanation')}
        />
      )}

      {phase === 'explanation' && (
        <ReadingCard
          heading={t('lesson.understand')}
          continueLabel={t('lesson.continue')}
          blocks={s.explanation.sections.map((sec) => ({
            title: sec.title,
            body: [sec.body, sec.scientificConnection, sec.realLifeAnalogy]
              .filter(Boolean)
              .join('\n\n'),
          }))}
          onContinue={() => {
            resetQuestionUi();
            setPhase('quiz');
          }}
        />
      )}

      {phase === 'quiz' &&
        (() => {
          const q = s.quiz.questions[quizIndex];
          const choices: Choice[] =
            q.format === 'trueFalse'
              ? [
                  {
                    choiceId: 'true',
                    label: 'True',
                    isCorrect: q.answerKey === 'true',
                    feedbackCorrect: '',
                    feedbackWrong: '',
                  },
                  {
                    choiceId: 'false',
                    label: 'False',
                    isCorrect: q.answerKey === 'false',
                    feedbackCorrect: '',
                    feedbackWrong: '',
                  },
                ]
              : (q.choices ?? []);
          return (
            <ChoiceCard
              title={t('lesson.qOf', {
                c: quizIndex + 1,
                t: s.quiz.questions.length,
              })}
              prompt={q.prompt}
              choices={choices}
              selected={selected}
              showFeedback={showFeedback}
              isCorrectChoice={(c) => questionCorrect(q, c.choiceId)}
              onSelect={setSelected}
              onSubmit={submitQuiz}
              busy={busy}
              onContinue={nextAfterQuiz}
              checkLabel={t('lesson.check')}
              correctText={t('lesson.correct')}
              wrongText={t('lesson.notQuite')}
              continueLabel={
                quizIndex < s.quiz.questions.length - 1
                  ? t('lesson.nextQ')
                  : t('lesson.complete')
              }
            />
          );
        })()}

      {phase === 'complete' && summary && (
        <div className="card p-8 text-center">
          <h2 className="text-2xl font-extrabold">
            {s.lessonComplete.title}
          </h2>
          <p className="mt-1 text-muted">
            {t('lesson.score', { p: scorePercent })}
          </p>
          <div className="mx-auto mt-6 max-w-xs space-y-2 text-left text-sm">
            <Row label={t('lesson.answerXp')} value={`+${summary.answerXp}`} />
            {summary.awardedPerfectBonus && (
              <Row
                label={t('lesson.perfectBonus')}
                value={`+${summary.perfectBonusXp}`}
              />
            )}
            {summary.awardedFirstCompletionBonus && (
              <Row
                label={t('lesson.firstBonus')}
                value={`+${summary.firstCompletionBonusXp}`}
              />
            )}
            <div className="border-t border-border pt-2">
              <Row label={t('lesson.totalXp')} value={`+${summary.totalXp}`} bold />
            </div>
          </div>
          <button
            type="button"
            onClick={() => router.push('/')}
            className="mt-8 rounded-full bg-primary px-8 py-3 font-bold text-white hover:bg-primary-strong"
          >
            {t('lesson.continue')}
          </button>
        </div>
      )}
    </div>
  );
}

function Row({
  label,
  value,
  bold,
}: {
  label: string;
  value: string;
  bold?: boolean;
}) {
  return (
    <div
      className={`flex justify-between ${bold ? 'font-extrabold' : 'text-muted'}`}
    >
      <span>{label}</span>
      <span className={bold ? 'text-primary' : ''}>{value}</span>
    </div>
  );
}

function ReadingCard({
  heading,
  blocks,
  onContinue,
  continueLabel,
}: {
  heading: string;
  blocks: { title: string; body: string }[];
  onContinue: () => void;
  continueLabel: string;
}) {
  return (
    <div className="card p-7">
      <p className="mb-4 text-xs font-bold uppercase tracking-wide text-muted">
        {heading}
      </p>
      <div className="space-y-5">
        {blocks.map((b, i) => (
          <div key={i}>
            <h3 className="font-extrabold">{b.title}</h3>
            <p className="mt-1 whitespace-pre-line leading-relaxed text-muted">
              {b.body}
            </p>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={onContinue}
        className="mt-7 w-full rounded-full bg-primary py-3 font-bold text-white hover:bg-primary-strong"
      >
        {continueLabel}
      </button>
    </div>
  );
}

function ChoiceCard({
  title,
  prompt,
  choices,
  selected,
  showFeedback,
  isCorrectChoice,
  onSelect,
  onSubmit,
  onContinue,
  busy,
  continueLabel,
  checkLabel,
  correctText,
  wrongText,
}: {
  title: string;
  prompt: string;
  choices: Choice[];
  selected: string | null;
  showFeedback: boolean;
  isCorrectChoice: (c: Choice) => boolean;
  onSelect: (id: string) => void;
  onSubmit: () => void;
  onContinue: () => void;
  busy: boolean;
  continueLabel: string;
  checkLabel: string;
  correctText: string;
  wrongText: string;
}) {
  const chosen = choices.find((c) => c.choiceId === selected);
  const chosenCorrect = chosen ? isCorrectChoice(chosen) : false;
  return (
    <div className="card p-7">
      <p className="mb-4 text-xs font-bold uppercase tracking-wide text-muted">
        {title}
      </p>
      <h2 className="text-xl font-extrabold leading-snug">{prompt}</h2>
      <div className="mt-6 space-y-3">
        {choices.map((c) => {
          const correct = isCorrectChoice(c);
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
              onClick={() => onSelect(c.choiceId)}
              className={`w-full rounded-xl border-2 px-4 py-3 text-left font-semibold transition ${cls}`}
            >
              {c.label}
            </button>
          );
        })}
      </div>

      {showFeedback && chosen && (
        <div
          className={`mt-5 rounded-xl px-4 py-3 text-sm font-semibold ${
            chosenCorrect
              ? 'bg-success/10 text-success'
              : 'bg-danger/10 text-danger'
          }`}
        >
          {chosenCorrect
            ? chosen.feedbackCorrect || correctText
            : chosen.feedbackWrong || wrongText}
        </div>
      )}

      {!showFeedback ? (
        <button
          type="button"
          disabled={selected == null || busy}
          onClick={onSubmit}
          className="mt-7 w-full rounded-full bg-primary py-3 font-bold text-white hover:bg-primary-strong disabled:opacity-50"
        >
          {checkLabel}
        </button>
      ) : (
        <button
          type="button"
          disabled={busy}
          onClick={onContinue}
          className="mt-7 w-full rounded-full bg-primary py-3 font-bold text-white hover:bg-primary-strong disabled:opacity-50"
        >
          {continueLabel}
        </button>
      )}
    </div>
  );
}
