// TypeScript port of lesson_models.dart.
export type QuestionFormat =
  | 'multipleChoice'
  | 'trueFalse'
  | 'matchPairs'
  | 'reorder';

export interface Choice {
  choiceId: string;
  label: string;
  isCorrect: boolean;
  feedbackCorrect: string;
  feedbackWrong: string;
}

export function choiceFeedback(c: Choice): string {
  return c.isCorrect ? c.feedbackCorrect : c.feedbackWrong;
}

export interface QuestionIntroScreen {
  title: string;
  prompt: string;
  choices: Choice[];
}

export interface TextCard {
  title: string;
  body: string;
}

export interface ShortTextScreen {
  cards: TextCard[];
}

export interface YoutubeVideoScreen {
  title: string;
  note: string;
  searchKeywords: string[];
  videoAsset?: string | null;
  clipStartSeconds?: number | null;
  clipEndSeconds?: number | null;
}

export interface ExplanationSection {
  title: string;
  body: string;
  scientificConnection?: string | null;
  realLifeAnalogy?: string | null;
}

export interface ExplanationScreen {
  sections: ExplanationSection[];
}

export interface QuizQuestion {
  questionId: string;
  format: QuestionFormat;
  prompt: string;
  choices?: Choice[] | null;
  answerKey?: string | null;
}

export interface QuizScreen {
  questions: QuizQuestion[];
}

export interface LessonCompleteScreen {
  title: string;
  rewardText: string;
  nextLessonId?: string | null;
}

export interface LessonScreens {
  questionIntro: QuestionIntroScreen;
  shortText: ShortTextScreen;
  youtubeVideo: YoutubeVideoScreen;
  explanation: ExplanationScreen;
  quiz: QuizScreen;
  lessonComplete: LessonCompleteScreen;
}

export interface Lesson {
  lessonId: string;
  title: string;
  learningObjectives: string[];
  screens: LessonScreens;
}

export interface Unit {
  id: string;
  title: string;
  level: string;
  lessons: Lesson[];
}
