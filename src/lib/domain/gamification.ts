// TypeScript port of gamification_rules.dart, gamification_constants.dart
// (HeartsSystem) and gamification_service.dart. Logic is replicated exactly so
// XP, levels, hearts and streak math match the mobile app bit-for-bit.
import type { UserProfile } from './models';

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export const XpRewards = {
  warmup: 2,
  quiz: 3,
  perfect: 5,
  firstCompletion: 5,
  streakBonus: 10,
  practice: 2,
} as const;

export const LevelSystem = {
  xpGates: [0, 50, 150, 300, 500, 750, 1000, 1500, 2000, 3000] as number[],
  levelTitles: [
    'Beginner',
    'Explorer',
    'Seeker',
    'Student',
    'Learner',
    'Practitioner',
    'Scholar',
    'Master',
    'Sage',
    'Jina',
  ] as string[],

  getLevelFromXp(totalXp: number): number {
    for (let i = this.xpGates.length - 1; i >= 0; i--) {
      if (totalXp >= this.xpGates[i]) return i + 1;
    }
    return 1;
  },

  getXpForLevel(level: number): number {
    if (level <= 1) return 0;
    if (level > this.xpGates.length) return this.xpGates[this.xpGates.length - 1];
    return this.xpGates[level - 1];
  },

  getXpNeededForNextLevel(currentLevel: number, totalXp: number): number {
    if (currentLevel >= this.xpGates.length) return 0;
    const nextLevelXp = this.xpGates[currentLevel];
    return Math.max(0, nextLevelXp - totalXp);
  },

  getLevelTitle(level: number): string {
    if (level < 1 || level > this.levelTitles.length) return this.levelTitles[0];
    return this.levelTitles[level - 1];
  },

  getLevelProgress(currentLevel: number, totalXp: number): number {
    if (currentLevel < 1) return 0;
    if (currentLevel >= this.xpGates.length) return 1;
    const currentLevelXp = this.xpGates[currentLevel - 1];
    const nextLevelXp = this.xpGates[currentLevel];
    const xpNeeded = nextLevelXp - currentLevelXp;
    if (xpNeeded <= 0) return 0;
    const xpInLevel = totalXp - currentLevelXp;
    return clamp(xpInLevel / xpNeeded, 0, 1);
  },
};

export const HeartsSystem = {
  maxHearts: 5,
  heartRegenMinutes: 30,
  practiceHeartReward: 1,
  readingPagesPerHeart: 5,
  dailyReadingPagesForHeart: 10,

  calculateHeartsRegenerated(lastActivityDate: Date | null): number {
    if (lastActivityDate == null) return 0;
    const minutesPassed =
      (Date.now() - lastActivityDate.getTime()) / 60_000;
    return clamp(
      Math.floor(minutesPassed / this.heartRegenMinutes),
      0,
      this.maxHearts,
    );
  },
};

const REGEN_MS = HeartsSystem.heartRegenMinutes * 60_000;

function copy(u: UserProfile, patch: Partial<UserProfile>): UserProfile {
  return { ...u, ...patch };
}

function timestampsMatch(a: Date[], b: Date[]): boolean {
  if (a === b) return true;
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i].getTime() !== b[i].getTime()) return false;
  }
  return true;
}

export const GamificationService = {
  applyXp(user: UserProfile, xp: number): UserProfile {
    const updatedTotalXp = Math.max(0, user.totalXp + xp);
    return copy(user, {
      totalXp: updatedTotalXp,
      level: LevelSystem.getLevelFromXp(updatedTotalXp),
    });
  },

  syncHearts(user: UserProfile, now: Date = new Date()): UserProfile {
    const effectiveHeartLosses =
      user.heartLossTimestamps.length === 0 &&
      user.hearts < HeartsSystem.maxHearts
        ? Array.from(
            { length: HeartsSystem.maxHearts - user.hearts },
            () => now,
          )
        : user.heartLossTimestamps;
    const activeHeartLosses = effectiveHeartLosses
      .filter((lostAt) => now.getTime() < lostAt.getTime() + REGEN_MS)
      .sort((a, b) => a.getTime() - b.getTime());

    const updatedHearts = clamp(
      HeartsSystem.maxHearts - activeHeartLosses.length,
      0,
      HeartsSystem.maxHearts,
    );

    if (
      updatedHearts === user.hearts &&
      timestampsMatch(activeHeartLosses, user.heartLossTimestamps)
    ) {
      return user;
    }
    return copy(user, {
      hearts: updatedHearts,
      heartLossTimestamps: activeHeartLosses,
    });
  },

  applyHeartDelta(
    user: UserProfile,
    delta: number,
    now: Date = new Date(),
  ): UserProfile {
    const syncedUser = this.syncHearts(user, now);
    const updatedHeartLosses = [...syncedUser.heartLossTimestamps].sort(
      (a, b) => a.getTime() - b.getTime(),
    );

    if (delta < 0) {
      const heartsToLose = clamp(-delta, 0, HeartsSystem.maxHearts);
      for (let i = 0; i < heartsToLose; i++) {
        if (updatedHeartLosses.length >= HeartsSystem.maxHearts) break;
        updatedHeartLosses.push(now);
      }
      updatedHeartLosses.sort((a, b) => a.getTime() - b.getTime());
    } else if (delta > 0) {
      const heartsToRefill = clamp(delta, 0, HeartsSystem.maxHearts);
      for (let i = 0; i < heartsToRefill; i++) {
        if (updatedHeartLosses.length === 0) break;
        updatedHeartLosses.pop();
      }
    }

    return copy(syncedUser, {
      hearts: HeartsSystem.maxHearts - updatedHeartLosses.length,
      heartLossTimestamps: updatedHeartLosses,
    });
  },
};

export interface LessonCompletionSummary {
  answerXp: number;
  perfectBonusXp: number;
  firstCompletionBonusXp: number;
  bonusXp: number;
  totalXp: number;
  awardedPerfectBonus: boolean;
  awardedFirstCompletionBonus: boolean;
}

export function buildLessonCompletionSummary(args: {
  answerXp: number;
  isPerfectQuiz: boolean;
  isFirstCompletion: boolean;
}): LessonCompletionSummary {
  const perfectBonusXp = args.isPerfectQuiz ? XpRewards.perfect : 0;
  const firstCompletionBonusXp = args.isFirstCompletion
    ? XpRewards.firstCompletion
    : 0;
  const bonusXp = perfectBonusXp + firstCompletionBonusXp;
  return {
    answerXp: args.answerXp,
    perfectBonusXp,
    firstCompletionBonusXp,
    bonusXp,
    totalXp: args.answerXp + bonusXp,
    awardedPerfectBonus: perfectBonusXp > 0,
    awardedFirstCompletionBonus: firstCompletionBonusXp > 0,
  };
}

export interface PracticeCompletionSummary {
  answerXp: number;
  heartsBefore: number;
  heartsAfter: number;
  heartRefilled: boolean;
}

export function buildPracticeCompletionSummary(args: {
  answerXp: number;
  heartsBefore: number;
  heartsAfter: number;
}): PracticeCompletionSummary {
  return {
    ...args,
    heartRefilled: args.heartsAfter > args.heartsBefore,
  };
}
