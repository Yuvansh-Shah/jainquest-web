'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/state/app-context';
import { useT } from '@/state/language';
import {
  buildFundJainReader,
  type FundJainReaderEntry,
  type FundJainQuizDefinition,
} from '@/lib/domain/content/fundjain';

const BOOK_ID = 'fundjain';

export default function ReaderPage() {
  const { storage, refresh } = useApp();
  const t = useT();
  const [entries, setEntries] = useState<FundJainReaderEntry[] | null>(null);
  const [index, setIndex] = useState(0);
  const [bookmarks, setBookmarks] = useState<number[]>([]);
  const [heartToast, setHeartToast] = useState<number | null>(null);
  const loadedRef = useRef(false);
  const registeredRef = useRef<Set<number>>(new Set());
  const refreshRef = useRef(refresh);
  refreshRef.current = refresh;

  useEffect(() => {
    if (loadedRef.current) return;
    loadedRef.current = true;
    (async () => {
      const res = await fetch('/fundjain.txt');
      const text = await res.text();
      setEntries(buildFundJainReader(text).entries);
      if (storage) setBookmarks(storage.getReadingBookmarks(BOOK_ID));
    })();
  }, [storage]);

  // Register a reading visit when a text page is shown (mirrors the app).
  useEffect(() => {
    if (!entries || !storage) return;
    const entry = entries[index];
    if (!entry || entry.kind !== 'text') return;
    if (registeredRef.current.has(index)) return;
    registeredRef.current.add(index);
    let active = true;
    (async () => {
      const result = await storage.registerReadingPage(BOOK_ID, index);
      if (!active) return;
      if (result.heartsEarned > 0) {
        setHeartToast(result.heartsEarned);
        refreshRef.current();
        setTimeout(() => {
          if (active) setHeartToast(null);
        }, 4000);
      }
    })();
    return () => {
      active = false;
    };
  }, [entries, index, storage]);

  if (!entries) {
    return <p className="text-muted">{t('reader.loading')}</p>;
  }

  const entry = entries[index];
  const isBookmarked = bookmarks.includes(index);

  async function toggleBookmark() {
    if (!storage) return;
    await storage.toggleReadingBookmark(BOOK_ID, index);
    setBookmarks(storage.getReadingBookmarks(BOOK_ID));
  }

  async function completeQuiz(quiz: FundJainQuizDefinition) {
    if (!storage) return;
    await storage.markReadingQuizCompleted(quiz.id);
    refresh();
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-5 flex items-center gap-4">
        <Link href="/resources" className="text-sm font-bold text-primary">
          ← {t('reader.back')}
        </Link>
        <div className="ml-auto text-xs font-bold text-muted">
          {index + 1} / {entries.length}
        </div>
        <button
          type="button"
          onClick={toggleBookmark}
          className={`rounded-full border px-3 py-1 text-xs font-bold transition ${
            isBookmarked
              ? 'border-primary text-primary'
              : 'border-border text-muted hover:text-foreground'
          }`}
          title={t('reader.bookmark')}
          aria-pressed={isBookmarked}
        >
          {isBookmarked ? t('reader.bookmarked') : t('reader.bookmark')}
        </button>
      </div>

      {heartToast != null && (
        <div className="mb-4 rounded-xl border border-success/40 bg-success/10 px-4 py-2 text-sm font-bold text-success">
          {t('reader.heart', { n: heartToast })}
        </div>
      )}

      {entry.kind === 'text' ? (
        <article className="card p-8">
          <p className="mb-1 text-xs font-bold uppercase tracking-wide text-primary">
            {entry.title}
          </p>
          <p className="mb-5 text-xs text-muted">
            {entry.isFrontMatter
              ? t('reader.frontMatter')
              : t('reader.chapter')}{' '}
            ·{' '}
            {t('reader.pageOf', {
              p: entry.pageNumber,
              t: entry.totalChapterPages,
            })}
          </p>
          <div className="whitespace-pre-line leading-relaxed text-foreground/90">
            {entry.body}
          </div>
        </article>
      ) : (
        <QuizBlock
          quiz={entry.quiz}
          alreadyDone={storage?.isReadingQuizCompleted(entry.quiz.id) ?? false}
          onComplete={() => completeQuiz(entry.quiz)}
        />
      )}

      <div className="mt-6 flex items-center justify-between">
        <button
          type="button"
          disabled={index === 0}
          onClick={() => setIndex((i) => Math.max(0, i - 1))}
          className="rounded-full border border-border px-6 py-2.5 font-bold transition enabled:hover:border-primary disabled:opacity-40"
        >
          ← {t('reader.previous')}
        </button>
        <button
          type="button"
          disabled={index >= entries.length - 1}
          onClick={() =>
            setIndex((i) => Math.min(entries.length - 1, i + 1))
          }
          className="rounded-full bg-primary px-6 py-2.5 font-bold text-white transition hover:bg-primary-strong disabled:opacity-40"
        >
          {t('reader.next')} →
        </button>
      </div>
    </div>
  );
}

function QuizBlock({
  quiz,
  alreadyDone,
  onComplete,
}: {
  quiz: FundJainQuizDefinition;
  alreadyDone: boolean;
  onComplete: () => void;
}) {
  const [qi, setQi] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [show, setShow] = useState(false);
  const [done, setDone] = useState(false);

  const q = quiz.questions[qi];
  const choices =
    q.format === 'trueFalse'
      ? [
          { choiceId: 'true', label: 'True' },
          { choiceId: 'false', label: 'False' },
        ]
      : (q.choices ?? []).map((c) => ({ choiceId: c.choiceId, label: c.label }));
  const isCorrect = (id: string) =>
    q.format === 'trueFalse'
      ? id === q.answerKey
      : !!q.choices?.find((c) => c.choiceId === id)?.isCorrect;

  if (done || alreadyDone) {
    return (
      <div className="card p-8 text-center">
        <h2 className="text-xl font-extrabold">{quiz.title}</h2>
        <p className="mt-1 text-sm text-muted">
          {alreadyDone
            ? 'You already completed this quiz.'
            : 'Quiz complete — nicely done.'}
        </p>
      </div>
    );
  }

  function next() {
    if (qi < quiz.questions.length - 1) {
      setQi((n) => n + 1);
      setSelected(null);
      setShow(false);
    } else {
      setDone(true);
      onComplete();
    }
  }

  return (
    <div className="card p-7">
      <p className="mb-1 text-xs font-bold uppercase tracking-wide text-primary">
        {quiz.title}
      </p>
      <p className="mb-5 text-sm text-muted">{quiz.description}</p>
      <p className="mb-3 text-xs font-bold text-muted">
        Question {qi + 1} of {quiz.questions.length}
      </p>
      <h3 className="text-lg font-extrabold leading-snug">{q.prompt}</h3>
      <div className="mt-5 space-y-3">
        {choices.map((c) => {
          const correct = isCorrect(c.choiceId);
          let cls = 'border-border bg-surface hover:border-primary';
          if (show) {
            if (correct) cls = 'border-success bg-success/10';
            else if (c.choiceId === selected) cls = 'border-danger bg-danger/10';
            else cls = 'border-border opacity-60';
          } else if (c.choiceId === selected) {
            cls = 'border-primary bg-primary/10';
          }
          return (
            <button
              key={c.choiceId}
              type="button"
              disabled={show}
              onClick={() => setSelected(c.choiceId)}
              className={`w-full rounded-xl border-2 px-4 py-3 text-left font-semibold transition ${cls}`}
            >
              {c.label}
            </button>
          );
        })}
      </div>
      {!show ? (
        <button
          type="button"
          disabled={selected == null}
          onClick={() => setShow(true)}
          className="mt-6 w-full rounded-full bg-primary py-3 font-bold text-white hover:bg-primary-strong disabled:opacity-50"
        >
          Check answer
        </button>
      ) : (
        <button
          type="button"
          onClick={next}
          className="mt-6 w-full rounded-full bg-primary py-3 font-bold text-white hover:bg-primary-strong"
        >
          {qi < quiz.questions.length - 1 ? 'Next question' : 'Finish quiz'}
        </button>
      )}
    </div>
  );
}
