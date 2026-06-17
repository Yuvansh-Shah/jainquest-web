// TypeScript port of the Flutter `user_models.dart` + badge models.
// Field names and (de)serialization mirror the Firestore schema exactly so the
// web client and the mobile app read/write the same documents losslessly.
import { Timestamp } from 'firebase/firestore';
import { HeartsSystem, LevelSystem } from './gamification';

type FirestoreLike = Record<string, unknown>;

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function readDateTime(value: unknown): Date | null {
  if (value == null) return null;
  if (value instanceof Timestamp) return value.toDate();
  if (value instanceof Date) return value;
  if (typeof value === 'string') {
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }
  if (
    typeof value === 'object' &&
    value !== null &&
    'seconds' in value &&
    typeof (value as { seconds: unknown }).seconds === 'number'
  ) {
    return new Date((value as { seconds: number }).seconds * 1000);
  }
  return null;
}

function readDateTimes(value: unknown): Date[] {
  if (!Array.isArray(value)) return [];
  return value
    .map(readDateTime)
    .filter((d): d is Date => d != null)
    .sort((a, b) => a.getTime() - b.getTime());
}

function asInt(value: unknown, fallback: number): number {
  return typeof value === 'number' && Number.isFinite(value)
    ? Math.trunc(value)
    : fallback;
}

// ===========================================================================
// UserProfile
// ===========================================================================

export interface UserProfile {
  id: string;
  displayName: string | null;
  totalXp: number;
  level: number;
  currentStreak: number;
  longestStreak: number;
  hearts: number;
  heartLossTimestamps: Date[];
  lastActivityDate: Date | null;
  streakFreezes: number;
  createdAt: Date;
  age: number | null;
  email: string | null;
  avatarEmoji: string | null;
  avatarUrl: string | null;
  showGuidedTour: boolean;
  preferredLanguageCode: string;
}

export function createUserProfile(id: string): UserProfile {
  return {
    id,
    displayName: null,
    totalXp: 0,
    level: 1,
    currentStreak: 0,
    longestStreak: 0,
    hearts: HeartsSystem.maxHearts,
    heartLossTimestamps: [],
    lastActivityDate: null,
    streakFreezes: 1,
    createdAt: new Date(),
    age: null,
    email: null,
    avatarEmoji: null,
    avatarUrl: null,
    showGuidedTour: false,
    preferredLanguageCode: 'en',
  };
}

export function userFromMap(
  data: FirestoreLike,
  fallbackId?: string,
): UserProfile {
  const storedHearts = asInt(data.hearts, HeartsSystem.maxHearts);
  const rawHeartLoss = readDateTimes(data.heartLossTimestamps);
  const hasStoredHeartLosses = 'heartLossTimestamps' in data;
  const now = new Date();
  const migratedHeartLoss =
    rawHeartLoss.length > 0 || hasStoredHeartLosses
      ? rawHeartLoss
      : Array.from(
          { length: clamp(HeartsSystem.maxHearts - storedHearts, 0, HeartsSystem.maxHearts) },
          () => now,
        );
  const normalizedHearts = clamp(
    HeartsSystem.maxHearts - migratedHeartLoss.length,
    0,
    HeartsSystem.maxHearts,
  );

  return {
    id: (data.id as string) ?? fallbackId ?? crypto.randomUUID(),
    displayName: (data.displayName as string) ?? null,
    totalXp: asInt(data.totalXp, 0),
    level: asInt(data.level, 1),
    currentStreak: asInt(data.currentStreak, 0),
    longestStreak: asInt(data.longestStreak, 0),
    hearts: normalizedHearts,
    heartLossTimestamps: migratedHeartLoss,
    lastActivityDate: readDateTime(data.lastActivityDate),
    streakFreezes: asInt(data.streakFreezes, 1),
    createdAt: readDateTime(data.createdAt) ?? new Date(),
    age: data.age == null ? null : asInt(data.age, 0),
    email: (data.email as string) ?? null,
    avatarEmoji: (data.avatarEmoji as string) ?? null,
    avatarUrl: (data.avatarUrl as string) ?? null,
    showGuidedTour: (data.showGuidedTour as boolean) ?? false,
    preferredLanguageCode: (data.preferredLanguageCode as string) ?? 'en',
  };
}

export function userToMap(u: UserProfile): FirestoreLike {
  return {
    id: u.id,
    displayName: u.displayName,
    totalXp: u.totalXp,
    level: u.level,
    currentStreak: u.currentStreak,
    longestStreak: u.longestStreak,
    hearts: u.hearts,
    heartLossTimestamps: u.heartLossTimestamps,
    lastActivityDate: u.lastActivityDate,
    streakFreezes: u.streakFreezes,
    createdAt: u.createdAt,
    age: u.age,
    email: u.email,
    avatarEmoji: u.avatarEmoji,
    avatarUrl: u.avatarUrl,
    showGuidedTour: u.showGuidedTour,
    preferredLanguageCode: u.preferredLanguageCode,
  };
}

export const MAX_HEARTS = HeartsSystem.maxHearts;

export function hasHeartsAvailable(u: UserProfile): boolean {
  return u.hearts > 0;
}

export function nextHeartAvailableAt(u: UserProfile): Date | null {
  if (u.heartLossTimestamps.length === 0) return null;
  let next: Date | null = null;
  for (const lostAt of u.heartLossTimestamps) {
    const candidate = new Date(
      lostAt.getTime() + HeartsSystem.heartRegenMinutes * 60_000,
    );
    if (next == null || candidate < next) next = candidate;
  }
  return next;
}

export function timeUntilNextHeartMs(u: UserProfile, now = new Date()): number | null {
  const at = nextHeartAvailableAt(u);
  if (at == null) return null;
  return Math.max(0, at.getTime() - now.getTime());
}

export function isProfileComplete(u: UserProfile): boolean {
  return (
    !!u.displayName?.trim() &&
    !!u.email?.trim() &&
    (u.age ?? 0) > 0
  );
}

export function levelProgress(u: UserProfile): number {
  return LevelSystem.getLevelProgress(u.level, u.totalXp);
}

// ===========================================================================
// LessonProgress
// ===========================================================================

export interface LessonProgress {
  lessonId: string;
  isCompleted: boolean;
  timesCompleted: number;
  bestScore: number;
  totalXpEarned: number;
  firstCompletedAt: Date | null;
  lastCompletedAt: Date | null;
  lastReplayBonusAt: Date | null;
}

export function canGetReplayBonus(p: LessonProgress): boolean {
  if (p.lastReplayBonusAt == null) return true;
  const hours = (Date.now() - p.lastReplayBonusAt.getTime()) / 3_600_000;
  return hours >= 12;
}

function lessonProgressFromMap(data: FirestoreLike): LessonProgress {
  return {
    lessonId: (data.lessonId as string) ?? '',
    isCompleted: (data.isCompleted as boolean) ?? false,
    timesCompleted: asInt(data.timesCompleted, 0),
    bestScore: asInt(data.bestScore, 0),
    totalXpEarned: asInt(data.totalXpEarned, 0),
    firstCompletedAt: readDateTime(data.firstCompletedAt),
    lastCompletedAt: readDateTime(data.lastCompletedAt),
    lastReplayBonusAt: readDateTime(data.lastReplayBonusAt),
  };
}

function lessonProgressToMap(p: LessonProgress): FirestoreLike {
  return {
    lessonId: p.lessonId,
    isCompleted: p.isCompleted,
    timesCompleted: p.timesCompleted,
    bestScore: p.bestScore,
    totalXpEarned: p.totalXpEarned,
    firstCompletedAt: p.firstCompletedAt,
    lastCompletedAt: p.lastCompletedAt,
    lastReplayBonusAt: p.lastReplayBonusAt,
  };
}

// ===========================================================================
// ProgressState
// ===========================================================================

export const INITIAL_UNLOCKED_LESSON_ID = 'U01_L01';

export interface ProgressState {
  lessonProgress: Record<string, LessonProgress>;
  completedLessons: string[];
  unlockedLessons: string[];
  earnedBadges: string[];
}

export function createProgressState(): ProgressState {
  return {
    lessonProgress: {},
    completedLessons: [],
    unlockedLessons: [INITIAL_UNLOCKED_LESSON_ID],
    earnedBadges: [],
  };
}

export function isLessonCompleted(s: ProgressState, lessonId: string): boolean {
  return s.completedLessons.includes(lessonId);
}

export function isLessonUnlocked(s: ProgressState, lessonId: string): boolean {
  return s.unlockedLessons.includes(lessonId);
}

export function completedLessonsOn(s: ProgressState, date: Date): number {
  let count = 0;
  for (const lp of Object.values(s.lessonProgress)) {
    const d = lp.lastCompletedAt;
    if (
      d &&
      d.getFullYear() === date.getFullYear() &&
      d.getMonth() === date.getMonth() &&
      d.getDate() === date.getDate()
    ) {
      count += 1;
    }
  }
  return count;
}

function normalizeUnlockedLessons(
  unlocked: string[],
  completed: string[],
): string[] {
  const normalized: string[] = [];
  const addAllUnique = (values: string[]) => {
    for (const v of values) {
      if (!v || normalized.includes(v)) continue;
      normalized.push(v);
    }
  };
  addAllUnique(unlocked);
  addAllUnique(completed);

  const isLegacyFreshState =
    completed.length === 0 &&
    normalized.length === 1 &&
    normalized[0] === 'U01_L05';
  if (isLegacyFreshState) return [INITIAL_UNLOCKED_LESSON_ID];
  if (normalized.length === 0) return [INITIAL_UNLOCKED_LESSON_ID];
  return normalized;
}

export function progressFromMap(data: FirestoreLike): ProgressState {
  const rawProgress = (data.lessonProgress as Record<string, unknown>) ?? {};
  const lessonProgress: Record<string, LessonProgress> = {};
  for (const [key, value] of Object.entries(rawProgress)) {
    if (value && typeof value === 'object') {
      lessonProgress[key] = lessonProgressFromMap(value as FirestoreLike);
    }
  }
  const completedLessons = Array.isArray(data.completedLessons)
    ? (data.completedLessons as unknown[]).map(String)
    : [];
  const unlockedLessons = normalizeUnlockedLessons(
    Array.isArray(data.unlockedLessons)
      ? (data.unlockedLessons as unknown[]).map(String)
      : [],
    completedLessons,
  );
  const earnedBadges = Array.isArray(data.earnedBadges)
    ? (data.earnedBadges as unknown[]).map(String)
    : [];
  return { lessonProgress, completedLessons, unlockedLessons, earnedBadges };
}

export function progressToMap(s: ProgressState): FirestoreLike {
  const progressMap: FirestoreLike = {};
  for (const [k, v] of Object.entries(s.lessonProgress)) {
    progressMap[k] = lessonProgressToMap(v);
  }
  return {
    lessonProgress: progressMap,
    completedLessons: s.completedLessons,
    unlockedLessons: s.unlockedLessons,
    earnedBadges: s.earnedBadges,
  };
}

// ===========================================================================
// AttemptLog (spaced repetition)
// ===========================================================================

export interface AttemptLog {
  id: string;
  questionId: string;
  lessonId: string;
  isCorrect: boolean;
  responseTimeMs: number;
  attemptedAt: Date;
  spacedRepetitionInterval: number;
  nextReviewDate: Date | null;
}

export function attemptFromMap(
  data: FirestoreLike,
  fallbackId?: string,
): AttemptLog {
  return {
    id: (data.id as string) ?? fallbackId ?? crypto.randomUUID(),
    questionId: (data.questionId as string) ?? '',
    lessonId: (data.lessonId as string) ?? '',
    isCorrect: (data.isCorrect as boolean) ?? false,
    responseTimeMs: asInt(data.responseTimeMs, 0),
    attemptedAt: readDateTime(data.attemptedAt) ?? new Date(),
    spacedRepetitionInterval: asInt(data.spacedRepetitionInterval, 1),
    nextReviewDate: readDateTime(data.nextReviewDate),
  };
}

export function attemptToMap(a: AttemptLog): FirestoreLike {
  return {
    id: a.id,
    questionId: a.questionId,
    lessonId: a.lessonId,
    isCorrect: a.isCorrect,
    responseTimeMs: a.responseTimeMs,
    attemptedAt: a.attemptedAt,
    spacedRepetitionInterval: a.spacedRepetitionInterval,
    nextReviewDate: a.nextReviewDate,
  };
}

// ===========================================================================
// NotificationPrefs
// ===========================================================================

export interface NotificationPrefs {
  enableNotifications: boolean;
  quietHoursStart: string;
  quietHoursEnd: string;
  reminderDays: number[];
  reminderTime: string;
  learningReminders: boolean;
  ahimsaPrompts: boolean;
  reflectionPrompts: boolean;
  streakRiskAlerts: boolean;
}

export function createNotificationPrefs(): NotificationPrefs {
  return {
    enableNotifications: true,
    quietHoursStart: '22:00',
    quietHoursEnd: '07:00',
    reminderDays: [1, 2, 3, 4, 5, 6, 7],
    reminderTime: '19:30',
    learningReminders: true,
    ahimsaPrompts: true,
    reflectionPrompts: true,
    streakRiskAlerts: true,
  };
}

export function notificationPrefsFromMap(data: FirestoreLike): NotificationPrefs {
  return {
    enableNotifications: (data.enableNotifications as boolean) ?? true,
    quietHoursStart: (data.quietHoursStart as string) ?? '22:00',
    quietHoursEnd: (data.quietHoursEnd as string) ?? '07:00',
    reminderDays: Array.isArray(data.reminderDays)
      ? (data.reminderDays as unknown[]).map((e) => asInt(e, 0))
      : [1, 2, 3, 4, 5, 6, 7],
    reminderTime: (data.reminderTime as string) ?? '19:30',
    learningReminders: (data.learningReminders as boolean) ?? true,
    ahimsaPrompts: (data.ahimsaPrompts as boolean) ?? true,
    reflectionPrompts: (data.reflectionPrompts as boolean) ?? true,
    streakRiskAlerts: (data.streakRiskAlerts as boolean) ?? true,
  };
}

export function notificationPrefsToMap(p: NotificationPrefs): FirestoreLike {
  return { ...p };
}

// ===========================================================================
// Badges
// ===========================================================================

export interface BadgeDefinition {
  id: string;
  name: string;
  description: string;
  trigger: string;
}
