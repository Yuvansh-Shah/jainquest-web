// Single source of truth for all course content. New units are added here so
// the home path, lesson runner, practice and badges all pick them up.
import type { Lesson, Unit } from '../lessonModels';
import type { BadgeDefinition } from '../models';
import { unit1, unit1Badges } from './unit1';
import { unit2, unit2Badges } from './unit2';
import { unit3, unit3Badges } from './unit3';

export const units: Unit[] = [unit1, unit2, unit3];

// Flat, ordered list of every lesson across units. Order defines the linear
// path and the cross-unit unlock gating on the home screen.
export const allLessons: Lesson[] = units.flatMap((u) => u.lessons);

export const allBadges: BadgeDefinition[] = [
  ...unit1Badges,
  ...unit2Badges,
  ...unit3Badges,
];

export function lessonById(id: string): Lesson | undefined {
  return allLessons.find((l) => l.lessonId === id);
}
