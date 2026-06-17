// TypeScript port of storage_service.dart. Same Firestore collections,
// document ids and field shapes, so the web client and the Flutter app share
// one set of per-user documents. One instance is created per signed-in user
// (owned by the React app context).
import {
  doc,
  collection,
  getDoc,
  getDocs,
  setDoc,
  writeBatch,
  type Firestore,
  type DocumentSnapshot,
  type DocumentData,
} from 'firebase/firestore';
import {
  GamificationService,
  HeartsSystem,
} from './gamification';
import {
  attemptFromMap,
  attemptToMap,
  createNotificationPrefs,
  createProgressState,
  createUserProfile,
  notificationPrefsFromMap,
  notificationPrefsToMap,
  progressFromMap,
  progressToMap,
  userFromMap,
  userToMap,
  type AttemptLog,
  type LessonProgress,
  type NotificationPrefs,
  type ProgressState,
  type UserProfile,
} from './models';

export type ThemeMode = 'light' | 'dark';

export interface ReadingHeartRewardResult {
  user: UserProfile;
  countedPage: boolean;
  heartsEarned: number;
  pagesTowardNextHeart: number;
  dailyPagesRead: number;
  dailyHeartEarned: boolean;
}

function uniqueSortedInts(value: unknown): number[] {
  const arr = Array.isArray(value) ? value : [];
  return [
    ...new Set(
      arr
        .filter((v): v is number => typeof v === 'number')
        .map((v) => Math.trunc(v))
        .filter((v) => v >= 0),
    ),
  ].sort((a, b) => a - b);
}

function mapOfIntLists(value: unknown): Record<string, number[]> {
  const out: Record<string, number[]> = {};
  if (value && typeof value === 'object') {
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      out[k] = uniqueSortedInts(v);
    }
  }
  return out;
}

function mapOfBool(value: unknown): Record<string, boolean> {
  const out: Record<string, boolean> = {};
  if (value && typeof value === 'object') {
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      out[k] = v === true;
    }
  }
  return out;
}

export class StorageService {
  private readonly db: Firestore;
  private userId: string;
  private initialized = false;

  private _userProfile: UserProfile;
  private _progress: ProgressState = createProgressState();
  private _notificationPrefs: NotificationPrefs = createNotificationPrefs();
  private _attemptLogs: AttemptLog[] = [];
  private _themeMode: ThemeMode = 'dark';
  private _readingBookmarks: Record<string, number[]> = {};
  private _quickGuideCompletions: Record<string, boolean> = {};
  private _readingRewardPages: Record<string, number[]> = {};
  private _readingQuizCompletions: Record<string, boolean> = {};
  private _dailyReadingPages: Record<string, number[]> = {};
  private _dailyReadingHeartRewards: Record<string, boolean> = {};
  private _readingPagesTowardNextHeart = 0;

  constructor(db: Firestore, userId: string) {
    this.db = db;
    this.userId = userId;
    this._userProfile = createUserProfile(userId);
  }

  get isInitialized(): boolean {
    return this.initialized;
  }

  private userDoc() {
    return doc(this.db, 'users', this.userId);
  }
  private progressDoc() {
    return doc(this.db, 'users', this.userId, 'progress', 'state');
  }
  private notificationDoc() {
    return doc(this.db, 'users', this.userId, 'notifications', 'prefs');
  }
  private settingsDoc() {
    return doc(this.db, 'users', this.userId, 'settings', 'theme');
  }
  private readingDoc() {
    return doc(this.db, 'users', this.userId, 'settings', 'reading');
  }
  private attemptsCollection() {
    return collection(this.db, 'users', this.userId, 'attempts');
  }

  // Parallel read of every per-user doc; create missing ones in one batch.
  async init(): Promise<void> {
    const [userSnap, progressSnap, prefsSnap, themeSnap, readingSnap, attemptsSnap] =
      await Promise.all([
        getDoc(this.userDoc()),
        getDoc(this.progressDoc()),
        getDoc(this.notificationDoc()),
        getDoc(this.settingsDoc()),
        getDoc(this.readingDoc()),
        getDocs(this.attemptsCollection()),
      ]);

    const batch = writeBatch(this.db);
    let hasMissing = false;

    const readData = (s: DocumentSnapshot<DocumentData>) =>
      s.exists() ? s.data() : null;

    const userData = readData(userSnap);
    if (userData) {
      this._userProfile = userFromMap(userData, this.userId);
    } else {
      this._userProfile = {
        ...createUserProfile(this.userId),
        showGuidedTour: true,
      };
      batch.set(this.userDoc(), userToMap(this._userProfile));
      hasMissing = true;
    }

    const progressData = readData(progressSnap);
    if (progressData) {
      this._progress = progressFromMap(progressData);
    } else {
      this._progress = createProgressState();
      batch.set(this.progressDoc(), progressToMap(this._progress));
      hasMissing = true;
    }

    const prefsData = readData(prefsSnap);
    if (prefsData) {
      this._notificationPrefs = notificationPrefsFromMap(prefsData);
    } else {
      this._notificationPrefs = createNotificationPrefs();
      batch.set(
        this.notificationDoc(),
        notificationPrefsToMap(this._notificationPrefs),
      );
      hasMissing = true;
    }

    const themeData = readData(themeSnap);
    if (themeData) {
      this._themeMode = (themeData.isDarkMode ?? true) ? 'dark' : 'light';
    } else {
      this._themeMode = 'dark';
      batch.set(this.settingsDoc(), { isDarkMode: true });
      hasMissing = true;
    }

    const readingData = readData(readingSnap);
    if (readingData) {
      this._readingBookmarks = mapOfIntLists(readingData.bookmarks);
      this._quickGuideCompletions = mapOfBool(
        readingData.quickGuideCompletions,
      );
      this._readingRewardPages = mapOfIntLists(readingData.rewardPages);
      this._readingQuizCompletions = mapOfBool(readingData.quizCompletions);
      this._dailyReadingPages = mapOfIntLists(readingData.dailyPages);
      this._dailyReadingHeartRewards = mapOfBool(
        readingData.dailyHeartRewards,
      );
      this._readingPagesTowardNextHeart =
        typeof readingData.pagesTowardNextHeart === 'number'
          ? Math.trunc(readingData.pagesTowardNextHeart)
          : 0;
    }

    this._attemptLogs = attemptsSnap.docs.map((d) =>
      attemptFromMap(d.data(), d.id),
    );

    if (hasMissing) await batch.commit();
    this.initialized = true;
  }

  // ---- User profile ----

  getUserProfile(): UserProfile {
    this._userProfile = GamificationService.syncHearts(this._userProfile);
    return this._userProfile;
  }

  async saveUserProfile(profile: UserProfile): Promise<void> {
    this._userProfile = profile;
    if (!this.initialized) return;
    await setDoc(this.userDoc(), userToMap(profile), { merge: true });
  }

  async addXp(xp: number): Promise<UserProfile> {
    const user = await this.syncHearts();
    const updated = GamificationService.applyXp(user, xp);
    await this.saveUserProfile(updated);
    return updated;
  }

  async syncHearts(): Promise<UserProfile> {
    const synced = GamificationService.syncHearts(this._userProfile);
    if (synced === this._userProfile) return this._userProfile;
    await this.saveUserProfile(synced);
    return synced;
  }

  async loseHeart(): Promise<UserProfile> {
    const user = await this.syncHearts();
    if (user.hearts > 0) {
      const updated = GamificationService.applyHeartDelta(user, -1);
      await this.saveUserProfile(updated);
      return updated;
    }
    return user;
  }

  async refillHeart(amount = 1): Promise<UserProfile> {
    const user = await this.syncHearts();
    const updated = GamificationService.applyHeartDelta(user, amount);
    await this.saveUserProfile(updated);
    return updated;
  }

  async updateStreak(): Promise<UserProfile> {
    const user = await this.syncHearts();
    const now = new Date();
    const startOfDay = (d: Date) =>
      new Date(d.getFullYear(), d.getMonth(), d.getDate());
    const today = startOfDay(now);

    if (user.lastActivityDate == null) {
      const updated: UserProfile = {
        ...user,
        currentStreak: 1,
        longestStreak: 1,
        lastActivityDate: now,
      };
      await this.saveUserProfile(updated);
      return updated;
    }

    const lastDate = startOfDay(user.lastActivityDate);
    const daysDiff = Math.round(
      (today.getTime() - lastDate.getTime()) / 86_400_000,
    );

    if (daysDiff === 0) return user;

    if (daysDiff === 1) {
      const newStreak = user.currentStreak + 1;
      const updated: UserProfile = {
        ...user,
        currentStreak: newStreak,
        longestStreak:
          newStreak > user.longestStreak ? newStreak : user.longestStreak,
        lastActivityDate: now,
      };
      await this.saveUserProfile(updated);
      return updated;
    }

    if (user.streakFreezes > 0 && daysDiff <= 2) {
      const updated: UserProfile = {
        ...user,
        streakFreezes: user.streakFreezes - 1,
        lastActivityDate: now,
      };
      await this.saveUserProfile(updated);
      return updated;
    }

    const updated: UserProfile = {
      ...user,
      currentStreak: 1,
      lastActivityDate: now,
    };
    await this.saveUserProfile(updated);
    return updated;
  }

  async markGuidedTourSeen(): Promise<void> {
    await this.saveUserProfile({
      ...this._userProfile,
      showGuidedTour: false,
    });
  }

  // ---- Progress ----

  getProgressState(): ProgressState {
    return this._progress;
  }

  async saveProgressState(progress: ProgressState): Promise<void> {
    this._progress = progress;
    if (!this.initialized) return;
    await setDoc(this.progressDoc(), progressToMap(progress), { merge: true });
  }

  async completeLesson(
    lessonId: string,
    args: { score: number; xpEarned: number; nextLessonId?: string | null },
  ): Promise<ProgressState> {
    const progress = this.getProgressState();
    const now = new Date();
    const existing = progress.lessonProgress[lessonId];
    const isFirstCompletion = existing == null || !existing.isCompleted;

    const updatedLessonProgress: LessonProgress = {
      lessonId,
      isCompleted: true,
      timesCompleted: (existing?.timesCompleted ?? 0) + 1,
      bestScore:
        args.score > (existing?.bestScore ?? 0)
          ? args.score
          : existing?.bestScore ?? args.score,
      totalXpEarned: (existing?.totalXpEarned ?? 0) + args.xpEarned,
      firstCompletedAt: existing?.firstCompletedAt ?? now,
      lastCompletedAt: now,
      lastReplayBonusAt: isFirstCompletion
        ? null
        : existing
          ? existing.lastReplayBonusAt
          : null,
    };

    const newLessonProgressMap = {
      ...progress.lessonProgress,
      [lessonId]: updatedLessonProgress,
    };
    const newCompleted = progress.completedLessons.includes(lessonId)
      ? progress.completedLessons
      : [...progress.completedLessons, lessonId];
    let newUnlocked = progress.unlockedLessons;
    if (
      args.nextLessonId &&
      !progress.unlockedLessons.includes(args.nextLessonId)
    ) {
      newUnlocked = [...progress.unlockedLessons, args.nextLessonId];
    }

    const updated: ProgressState = {
      ...progress,
      lessonProgress: newLessonProgressMap,
      completedLessons: newCompleted,
      unlockedLessons: newUnlocked,
    };
    await this.saveProgressState(updated);
    return updated;
  }

  async earnBadge(badgeId: string): Promise<ProgressState> {
    const progress = this.getProgressState();
    if (!progress.earnedBadges.includes(badgeId)) {
      const updated: ProgressState = {
        ...progress,
        earnedBadges: [...progress.earnedBadges, badgeId],
      };
      await this.saveProgressState(updated);
      return updated;
    }
    return progress;
  }

  // ---- Attempt logs (spaced repetition) ----

  async logAttempt(attempt: AttemptLog): Promise<void> {
    this._attemptLogs = this._attemptLogs.filter((l) => l.id !== attempt.id);
    this._attemptLogs.push(attempt);
    await setDoc(
      doc(this.attemptsCollection(), attempt.id),
      attemptToMap(attempt),
      { merge: true },
    );
  }

  getAttemptLogs(): AttemptLog[] {
    return [...this._attemptLogs];
  }

  getAttemptsForQuestion(questionId: string): AttemptLog[] {
    return this._attemptLogs
      .filter((a) => a.questionId === questionId)
      .sort((a, b) => b.attemptedAt.getTime() - a.attemptedAt.getTime());
  }

  // ---- Notification prefs ----

  getNotificationPrefs(): NotificationPrefs {
    return this._notificationPrefs;
  }

  async saveNotificationPrefs(prefs: NotificationPrefs): Promise<void> {
    this._notificationPrefs = prefs;
    if (!this.initialized) return;
    await setDoc(this.notificationDoc(), notificationPrefsToMap(prefs), {
      merge: true,
    });
  }

  // ---- Theme ----

  getThemeMode(): ThemeMode {
    return this._themeMode;
  }

  async saveThemeMode(mode: ThemeMode): Promise<void> {
    this._themeMode = mode;
    if (!this.initialized) return;
    await setDoc(
      this.settingsDoc(),
      { isDarkMode: mode === 'dark' },
      { merge: true },
    );
  }

  // ---- Reading ----

  getReadingBookmarks(bookId: string): number[] {
    return [...(this._readingBookmarks[bookId] ?? [])].sort((a, b) => a - b);
  }

  async toggleReadingBookmark(
    bookId: string,
    pageIndex: number,
  ): Promise<boolean> {
    const pages = [...(this._readingBookmarks[bookId] ?? [])];
    const exists = pages.includes(pageIndex);
    const next = exists
      ? pages.filter((p) => p !== pageIndex)
      : [...pages, pageIndex];
    next.sort((a, b) => a - b);
    this._readingBookmarks[bookId] = next;
    if (this.initialized) {
      await setDoc(
        this.readingDoc(),
        { bookmarks: this._readingBookmarks },
        { merge: true },
      );
    }
    return !exists;
  }

  isQuickGuideCompleted(guideId: string): boolean {
    return this._quickGuideCompletions[guideId] ?? false;
  }

  isReadingQuizCompleted(quizId: string): boolean {
    return this._readingQuizCompletions[quizId] ?? false;
  }

  getReadingPagesTowardNextHeart(): number {
    return this._readingPagesTowardNextHeart;
  }

  private readingDayKey(bookId: string, date: Date): string {
    const m = `${date.getMonth() + 1}`.padStart(2, '0');
    const d = `${date.getDate()}`.padStart(2, '0');
    return `${bookId}-${date.getFullYear()}-${m}-${d}`;
  }

  async markQuickGuideCompleted(guideId: string, completed = true) {
    this._quickGuideCompletions[guideId] = completed;
    if (this.initialized) {
      await setDoc(
        this.readingDoc(),
        { quickGuideCompletions: this._quickGuideCompletions },
        { merge: true },
      );
    }
  }

  async markReadingQuizCompleted(quizId: string, completed = true) {
    this._readingQuizCompletions[quizId] = completed;
    if (this.initialized) {
      await setDoc(
        this.readingDoc(),
        { quizCompletions: this._readingQuizCompletions },
        { merge: true },
      );
    }
  }

  // Mirrors registerReadingPage: per-book reward pages accumulate toward a
  // heart (every readingPagesPerHeart), plus a daily unique-page heart bonus.
  async registerReadingPage(
    bookId: string,
    pageIndex: number,
  ): Promise<ReadingHeartRewardResult> {
    const user = await this.syncHearts();
    const rewarded = [...(this._readingRewardPages[bookId] ?? [])];
    const alreadyCounted = rewarded.includes(pageIndex);
    let heartsEarned = 0;
    let updatedUser = user;
    let persist = false;

    if (!alreadyCounted && user.hearts < HeartsSystem.maxHearts) {
      rewarded.push(pageIndex);
      rewarded.sort((a, b) => a - b);
      this._readingRewardPages[bookId] = rewarded;
      this._readingPagesTowardNextHeart += 1;
      persist = true;
      while (
        this._readingPagesTowardNextHeart >=
          HeartsSystem.readingPagesPerHeart &&
        updatedUser.hearts < HeartsSystem.maxHearts
      ) {
        this._readingPagesTowardNextHeart -= HeartsSystem.readingPagesPerHeart;
        updatedUser = GamificationService.applyHeartDelta(updatedUser, 1);
        heartsEarned += 1;
      }
    }

    const todayKey = this.readingDayKey(bookId, new Date());
    const dailyPages = [...(this._dailyReadingPages[todayKey] ?? [])];
    let dailyEarned = this._dailyReadingHeartRewards[todayKey] ?? false;
    const countedDaily = !dailyPages.includes(pageIndex);
    if (countedDaily) {
      dailyPages.push(pageIndex);
      dailyPages.sort((a, b) => a - b);
      persist = true;
    }
    const dailyPagesRead = dailyPages.length;
    if (
      !dailyEarned &&
      dailyPagesRead >= HeartsSystem.dailyReadingPagesForHeart &&
      updatedUser.hearts < HeartsSystem.maxHearts
    ) {
      dailyEarned = true;
      updatedUser = GamificationService.applyHeartDelta(updatedUser, 1);
      heartsEarned += 1;
      persist = true;
    }
    this._dailyReadingPages[todayKey] = dailyPages;
    this._dailyReadingHeartRewards[todayKey] = dailyEarned;

    if (updatedUser !== user) await this.saveUserProfile(updatedUser);

    if (persist && this.initialized) {
      await setDoc(
        this.readingDoc(),
        {
          rewardPages: this._readingRewardPages,
          pagesTowardNextHeart: this._readingPagesTowardNextHeart,
          dailyPages: this._dailyReadingPages,
          dailyHeartRewards: this._dailyReadingHeartRewards,
        },
        { merge: true },
      );
    }

    return {
      user: updatedUser,
      countedPage: !alreadyCounted && user.hearts < HeartsSystem.maxHearts,
      heartsEarned,
      pagesTowardNextHeart: this._readingPagesTowardNextHeart,
      dailyPagesRead,
      dailyHeartEarned: dailyEarned,
    };
  }
}
