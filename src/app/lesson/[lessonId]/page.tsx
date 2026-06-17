// Server shell for the lesson route. The interactive lesson UI is a client
// component (lesson-client.tsx); this file only enumerates the static lesson
// paths so the app can be exported as a fully static site (no SSR / no Cloud
// Function), which lets it deploy to Firebase Hosting on the free plan.
import { allLessons } from '@/lib/domain/content/curriculum';
import LessonClient from './lesson-client';

export function generateStaticParams() {
  return allLessons.map((l) => ({ lessonId: l.lessonId }));
}

// Required for `output: 'export'`: only the params above are valid routes.
export const dynamicParams = false;

export default function LessonPage() {
  return <LessonClient />;
}
