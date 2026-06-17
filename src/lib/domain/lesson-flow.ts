// Helpers ported from app_providers.dart: spaced-repetition attempt logging
// and the lesson -> badge mapping.
import type { StorageService } from './storage';
import type { AttemptLog } from './models';

function clamp(v: number, lo: number, hi: number) {
  return Math.min(Math.max(v, lo), hi);
}

export async function recordQuestionAttempt(
  storage: StorageService,
  args: { lessonId: string; questionId: string; isCorrect: boolean },
): Promise<void> {
  const now = new Date();
  const previous = storage.getAttemptsForQuestion(args.questionId);
  const latest = previous.length === 0 ? null : previous[0];
  const intervalDays = args.isCorrect
    ? latest && latest.isCorrect
      ? clamp(latest.spacedRepetitionInterval * 2, 1, 14)
      : 1
    : 0;

  const attempt: AttemptLog = {
    id: `${args.questionId}_${now.getTime() * 1000}`,
    questionId: args.questionId,
    lessonId: args.lessonId,
    isCorrect: args.isCorrect,
    responseTimeMs: args.isCorrect ? 4000 : 6000,
    attemptedAt: now,
    spacedRepetitionInterval: intervalDays,
    nextReviewDate: args.isCorrect
      ? new Date(now.getTime() + intervalDays * 86_400_000)
      : now,
  };
  try {
    await storage.logAttempt(attempt);
  } catch {
    // Attempt logging must never block the learning flow.
  }
}

export function badgeForLesson(lessonId: string): string | null {
  switch (lessonId) {
    case 'U01_L01':
      return 'BADGE_INNER_MASTERY_STARTER';
    case 'U01_L02':
      return 'BADGE_LIFE_OBSERVER';
    case 'U01_L03':
      return 'BADGE_SOUL_EXPLORER';
    case 'U01_L04':
      return 'BADGE_KARMA_BASICS';
    case 'U01_L05':
      return 'BADGE_TIRTHANKARA_GUIDE';
    case 'U01_MASTER_TEST':
      return 'BADGE_UNIT_MASTER';
    case 'U02_L01':
      return 'BADGE_THREE_JEWELS';
    case 'U02_L02':
      return 'BADGE_VOW_KEEPER';
    case 'U02_L04':
      return 'BADGE_KARMA_DEPTH';
    case 'U02_L06':
      return 'BADGE_MANY_SIDED';
    case 'U02_L10':
      return 'BADGE_FORGIVENESS';
    case 'U02_MASTER_TEST':
      return 'BADGE_PATH_WALKER';
    case 'U03_L01':
      return 'BADGE_SOUL_SEEKER';
    case 'U03_L02':
      return 'BADGE_NINE_TRUTHS';
    case 'U03_L04':
      return 'BADGE_KARMA_SCHOLAR';
    case 'U03_L07':
      return 'BADGE_INNER_CLIMBER';
    case 'U03_L09':
      return 'BADGE_COSMIC_VIEW';
    case 'U03_MASTER_TEST':
      return 'BADGE_LIBERATION';
    default:
      return null;
  }
}
