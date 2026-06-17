// Port of fundjain_book_data.dart: chapter definitions (markers + quizzes),
// the final quiz, and the reader builder that splits the raw book text
// (public/fundjain.txt) into paginated entries interleaved with quizzes.
import type { QuizQuestion } from '../lessonModels';

export interface FundJainQuizDefinition {
  id: string;
  title: string;
  description: string;
  questions: QuizQuestion[];
  isFinalQuiz?: boolean;
}

export interface FundJainChapterDefinition {
  id: string;
  title: string;
  marker: string;
  quiz: FundJainQuizDefinition;
}

export interface FundJainTextEntry {
  kind: 'text';
  id: string;
  title: string;
  body: string;
  chapterId: string;
  pageNumber: number;
  totalChapterPages: number;
  isFrontMatter: boolean;
}

export interface FundJainQuizEntry {
  kind: 'quiz';
  id: string;
  title: string;
  quiz: FundJainQuizDefinition;
}

export type FundJainReaderEntry = FundJainTextEntry | FundJainQuizEntry;

export interface FundJainReaderBuildResult {
  entries: FundJainReaderEntry[];
  textPageCount: number;
}

const PAGE_SIZE = 1200;

function mc(
  questionId: string,
  prompt: string,
  choices: [string, boolean, string, string][],
): QuizQuestion {
  return {
    questionId,
    format: 'multipleChoice',
    prompt,
    choices: choices.map(([label, isCorrect, fc, fw], i) => ({
      choiceId: ['a', 'b', 'c', 'd'][i],
      label,
      isCorrect,
      feedbackCorrect: fc,
      feedbackWrong: fw,
    })),
  };
}

function tf(questionId: string, prompt: string, answer: 'true' | 'false'): QuizQuestion {
  return { questionId, format: 'trueFalse', prompt, answerKey: answer };
}

export const fundJainChapters: FundJainChapterDefinition[] = [
  {
    id: 'introduction',
    title: 'Introduction',
    marker: 'Introduction\nTHE METHOD OF PHILOSOPHY (ANEKANTVAD)',
    quiz: {
      id: 'quiz_introduction',
      title: 'Chapter Quiz: Introduction',
      description:
        'Review the three jewels and the logic of standpoints before moving on.',
      questions: [
        mc('intro_q1', 'Which three elements does the book describe as the path of salvation?', [
          ['Right Belief, Right Knowledge, and Right Conduct', true, 'Yes. The introduction presents these as the three jewels that guide liberation.', 'Not quite. The chapter centers the path on Right Belief, Right Knowledge, and Right Conduct.'],
          ['Faith, ritual, and austerity', false, '', 'The opening chapter is more precise: it names the three jewels, not a general trio of practices.'],
          ['Knowledge, charity, and devotion', false, '', 'Charity and devotion matter, but the chapter specifically names the three jewels instead.'],
          ['Meditation, silence, and study', false, '', 'Those are useful disciplines, but they are not the three jewels named in the introduction.'],
        ]),
        tf('intro_q2', 'The Saptabhangi system teaches that a statement should be treated as coming from a particular standpoint.', 'true'),
      ],
    },
  },
  {
    id: 'tattvas',
    title: 'The Tattvas',
    marker: 'THE TATTVAS',
    quiz: {
      id: 'quiz_tattvas',
      title: 'Chapter Quiz: The Tattvas',
      description:
        'Check your grasp of the basic substances and what makes Jiva unique.',
      questions: [
        mc('tattvas_q1', 'According to this chapter, what distinguishes Jiva from Ajiva?', [
          ['Jiva is endowed with intelligence', true, 'Correct. The chapter says intelligence is what separates Jiva from the other substances.', 'Look for the quality unique to living substance: the text identifies intelligence as the key distinction.'],
          ['Jiva exists only in human form', false, '', 'The book treats Jiva as soul, not something limited to human birth.'],
          ['Jiva is made of the finest atoms', false, '', 'That describes matter more than soul. The chapter separates Jiva from material substance.'],
          ['Jiva cannot change form', false, '', 'The book does not use fixed physical form as the defining trait of Jiva.'],
        ]),
        tf('tattvas_q2', 'Dharma and Adharma are described here as substances that help motion and rest.', 'true'),
      ],
    },
  },
  {
    id: 'karma',
    title: 'The Nature of Karma',
    marker: 'THE NATURE OF KARMA (Karma ka swroop)',
    quiz: {
      id: 'quiz_karma',
      title: 'Chapter Quiz: The Nature of Karma',
      description:
        'Test the chapter’s explanation of bondage, transmigration, and karmic matter.',
      questions: [
        mc('karma_q1', 'How does the book describe the bondage of sin or karma?', [
          ['As a subtle material bondage affecting the soul', true, 'Right. The chapter argues that bondage must involve a real, subtle material force.', 'The text pushes beyond metaphor and describes karmic bondage as a subtle material reality.'],
          ['As only a social label created by religion', false, '', 'The chapter does the opposite: it insists bondage is real, not just a social label.'],
          ['As something removed automatically at death', false, '', 'Death is not presented as a shortcut to freedom in this chapter.'],
          ['As a punishment assigned by chance', false, '', 'The argument here rejects chance as the basis of liberation or bondage.'],
        ]),
        tf('karma_q2', 'The Karman sharira is described as staying with the soul until Moksha is attained.', 'true'),
      ],
    },
  },
  {
    id: 'asrava',
    title: 'Asrava',
    marker: 'ASRAVA',
    quiz: {
      id: 'quiz_asrava',
      title: 'Chapter Quiz: Asrava',
      description:
        'Make sure the causes of karmic influx are clear before you continue.',
      questions: [
        mc('asrava_q1', 'What does Asrava mean in this chapter?', [
          ['The influx of karmic matter into the soul', true, 'Exactly. Asrava is the inflow of matter into the soul’s constitution.', 'The chapter defines Asrava specifically as the inflow of karmic matter.'],
          ['The final destruction of all karmas', false, '', 'That belongs to later stages like Nirjara and Moksha, not Asrava.'],
          ['A temporary state of heavenly pleasure', false, '', 'This chapter is about karmic inflow, not heavenly enjoyment.'],
          ['The fixed destiny of a soul at birth', false, '', 'The book treats Asrava as an active inflow process, not a fixed birth destiny.'],
        ]),
        tf('asrava_q2', 'The chapter lists passions, negligence, wrong belief, moral failing, and yoga among the causes of Asrava.', 'true'),
      ],
    },
  },
  {
    id: 'bandha',
    title: 'Bandha',
    marker: 'BANDHA',
    quiz: {
      id: 'quiz_bandha',
      title: 'Chapter Quiz: Bandha',
      description:
        'Review how karmic bondage forms and how the major karma groups are organized.',
      questions: [
        mc('bandha_q1', 'In the context of this chapter, what is Bandha?', [
          ['The binding of karmic matter to the soul', true, 'Yes. Bandha is the soul’s bondage through karmic matter.', 'Bandha here is about karmic binding, not merely a mental mood or social bond.'],
          ['The stopping of karmic inflow', false, '', 'Stopping inflow belongs to Samvara, which comes after this chapter.'],
          ['The ordinary fading of karmas over time', false, '', 'That is closer to savipaka nirjara, not Bandha.'],
          ['The final ascent of the liberated soul', false, '', 'Liberated ascent belongs with Moksha, not Bandha.'],
        ]),
        tf('bandha_q2', 'The chapter classifies karma into eight main groups.', 'true'),
      ],
    },
  },
  {
    id: 'samvara',
    title: 'Samvara',
    marker: 'SAMVARA',
    quiz: {
      id: 'quiz_samvara',
      title: 'Chapter Quiz: Samvara',
      description:
        'Pause here to check the practices used to stop fresh karmic inflow.',
      questions: [
        mc('samvara_q1', 'What is the basic aim of Samvara in this chapter?', [
          ['To stop fresh karmic matter from flowing in', true, 'Correct. Samvara is the checking of fresh inflow through disciplined control.', 'Samvara is defined here as stopping further karmic inflow.'],
          ['To classify karmas into many subtypes', false, '', 'That detailed classification belongs more to the Bandha discussion.'],
          ['To describe the heavens in detail', false, '', 'The chapter mentions cosmic reflection, but its main aim is stopping karmic inflow.'],
          ['To prove that actions have no karmic effect', false, '', 'The text assumes actions do have karmic effect, which is why Samvara matters.'],
        ]),
        tf('samvara_q2', 'The chapter says control of mind, speech, and body is central to Samvara.', 'true'),
      ],
    },
  },
  {
    id: 'nirjara',
    title: 'Nirjara',
    marker: 'NIRJARA',
    quiz: {
      id: 'quiz_nirjara',
      title: 'Chapter Quiz: Nirjara',
      description:
        'Check the distinction between ordinary karmic falling away and deliberate austerity.',
      questions: [
        mc('nirjara_q1', 'Which form of Nirjara does the chapter call the direct cause of Moksha?', [
          ['Avipaka Nirjara', true, 'Right. The chapter distinguishes avipaka nirjara as removal through deliberate exertion.', 'The chapter contrasts ordinary karmic fading with avipaka nirjara, and names the latter as the direct path to release.'],
          ['Savipaka Nirjara', false, '', 'Savipaka nirjara is described as the ordinary mechanical falling away of karmas.'],
          ['Mithyatva Nirjara', false, '', 'That term is not the chapter’s twofold division of Nirjara.'],
          ['Bhoga Nirjara', false, '', 'The chapter instead divides Nirjara into savipaka and avipaka.'],
        ]),
        tf('nirjara_q2', 'The chapter divides Tapa into external austerity and internal austerity.', 'true'),
      ],
    },
  },
  {
    id: 'moksha',
    title: 'Moksha',
    marker: 'MOKSHA',
    quiz: {
      id: 'quiz_moksha',
      title: 'Chapter Quiz: Moksha',
      description:
        'Confirm the book’s picture of liberation, concentration, and the perfected soul.',
      questions: [
        mc('moksha_q1', 'How is Moksha presented in this chapter?', [
          ['As complete freedom from karmic bondage and matter', true, 'Yes. The chapter treats Moksha as complete liberation from karmic bondage.', 'The book presents Moksha as total freedom from karmic bondage, not a temporary mood or place.'],
          ['As a reward granted only by outside intervention', false, '', 'This chapter strongly emphasizes self-conquest and right contemplation, not outside rescue.'],
          ['As the extinction of all individuality', false, '', 'The discussion argues that liberated souls share a status of perfection while retaining individuality.'],
          ['As a temporary stay in a higher heaven', false, '', 'The text treats Moksha as final liberation, not a temporary heavenly residence.'],
        ]),
        tf('moksha_q2', 'The chapter presents Dhyana, or concentrated contemplation, as the direct means to Moksha.', 'true'),
      ],
    },
  },
  {
    id: 'stages',
    title: 'Stages on the Path',
    marker: 'STAGES ON THE PATH',
    quiz: {
      id: 'quiz_stages',
      title: 'Chapter Quiz: Stages on the Path',
      description:
        'Review the structure of the fourteen Gunasthanas before advancing.',
      questions: [
        mc('stages_q1', 'Into how many stages does the book divide the path to Nirvana?', [
          ['Fourteen stages', true, 'Correct. The Gunasthana system is presented as fourteen stages.', 'This chapter gives a fourteen-stage ladder of development called the Gunasthanas.'],
          ['Seven stages', false, '', 'Seven appears elsewhere in the book, but not as the count of Gunasthanas.'],
          ['Ten stages', false, '', 'The path here is longer and more detailed than ten steps.'],
          ['Twenty-one stages', false, '', 'The chapter is explicit: there are fourteen stages on the path.'],
        ]),
        tf('stages_q2', 'The thirteenth stage, Sayoga Kevali, is associated with omniscience while bodily association still remains.', 'true'),
      ],
    },
  },
  {
    id: 'dharma_practice',
    title: 'Dharma in Practice',
    marker: 'DHARMA IN PRACTICE',
    quiz: {
      id: 'quiz_dharma_practice',
      title: 'Chapter Quiz: Dharma in Practice',
      description:
        'Close the final chapter by checking the vows and householder-to-ascetic progression.',
      questions: [
        mc('practice_q1', 'How many primary vows does the chapter assign to the layperson?', [
          ['Twelve vows', true, 'Right. The layperson is guided through twelve vows in this chapter.', 'This chapter lays out twelve primary vows for the householder.'],
          ['Five vows', false, '', 'Five great vows are central for the ascetic, but the householder chapter expands beyond that.'],
          ['Eight vows', false, '', 'The chapter is more expansive than eight and explicitly names twelve.'],
          ['Fourteen vows', false, '', 'Fourteen belongs to the Gunasthanas, not the lay vows.'],
        ]),
        tf('practice_q2', 'The chapter presents the monk’s five great vows as stricter versions of the layperson’s vows.', 'true'),
      ],
    },
  },
];

export const fundJainFinalQuiz: FundJainQuizDefinition = {
  id: 'quiz_final_book',
  title: 'Final Book Quiz',
  description:
    'One last review across the whole book before you close the reader.',
  isFinalQuiz: true,
  questions: [
    mc('final_q1', 'Which chapter explains the stopping of fresh karmic inflow?', [
      ['Samvara', true, 'Correct. Samvara is the chapter on stopping fresh karmic inflow.', 'The book reserves Samvara for the checking of new karmic influx.'],
      ['Bandha', false, '', 'Bandha focuses on karmic binding rather than stopping new influx.'],
      ['Moksha', false, '', 'Moksha is the culmination, but Samvara is the stage that stops fresh inflow.'],
      ['The Tattvas', false, '', 'That chapter lays foundations, but Samvara is the one about stopping inflow.'],
    ]),
    tf('final_q2', 'The book treats right faith, right knowledge, and right conduct as recurring foundations across the path.', 'true'),
    mc('final_q3', 'Which pair best matches the book’s explanation of Nirjara?', [
      ['Savipaka is ordinary karmic fading; Avipaka is deliberate shedding through exertion', true, 'Exactly. The final review should bring back that twofold description of Nirjara.', 'The book contrasts ordinary karmic fading with deliberate shedding through austerity and effort.'],
      ['Savipaka is liberation; Avipaka is heavenly rebirth', false, '', 'Neither term is defined that way in the Nirjara chapter.'],
      ['Savipaka concerns belief; Avipaka concerns speech', false, '', 'Those are not the categories used for Nirjara in the book.'],
      ['Savipaka and Avipaka are both names for the same process', false, '', 'The chapter clearly distinguishes the two kinds.'],
    ]),
    tf('final_q4', 'The Gunasthana chapter describes fourteen stages of spiritual development.', 'true'),
    mc('final_q5', 'What recurring message ties the practical chapters together near the end of the book?', [
      ['Self-discipline, meditation, and right conduct transform the soul', true, 'Yes. The closing chapters keep returning to self-discipline, contemplation, and right conduct.', 'The later chapters repeatedly stress disciplined conduct and contemplation as the working path.'],
      ['Liberation comes mainly through external rescue', false, '', 'The book consistently emphasizes self-effort, not passive rescue.'],
      ['Ritual alone is enough without understanding', false, '', 'The book keeps linking understanding with belief and conduct.'],
      ['Worldly success is the true sign of liberation', false, '', 'Worldly success is not presented as the aim; liberation and purity are.'],
    ]),
  ],
};

function prepareReaderText(rawText: string): string {
  const cleaned = rawText
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
  const sections = cleaned.split('\n\n');
  return sections.length > 1
    ? sections.slice(1).join('\n\n').trim()
    : cleaned;
}

function paginate(text: string): string[] {
  if (!text.trim()) return [];
  const words = text.split(/\s+/);
  const pages: string[] = [];
  let buffer = '';
  for (const word of words) {
    if (buffer.length + word.length + 1 > PAGE_SIZE) {
      pages.push(buffer.trim());
      buffer = '';
    }
    buffer += word + ' ';
  }
  if (buffer.length > 0) pages.push(buffer.trim());
  return pages;
}

interface Slice {
  chapter: FundJainChapterDefinition;
  start: number;
  end: number;
}

function buildChapterSlices(text: string): Slice[] {
  const slices: Slice[] = [];
  let searchFrom = 0;
  for (const chapter of fundJainChapters) {
    const start = text.indexOf(chapter.marker, searchFrom);
    if (start === -1) continue; // robustness: skip a marker not found
    if (slices.length > 0) {
      const prev = slices[slices.length - 1];
      prev.end = start;
    }
    slices.push({ chapter, start, end: text.length });
    searchFrom = start + chapter.marker.length;
  }
  return slices;
}

export function buildFundJainReader(rawText: string): FundJainReaderBuildResult {
  const prepared = prepareReaderText(rawText);
  const slices = buildChapterSlices(prepared);
  const entries: FundJainReaderEntry[] = [];
  let textPageCount = 0;

  if (slices.length > 0) {
    const frontMatter = prepared.substring(0, slices[0].start).trim();
    if (frontMatter) {
      const pages = paginate(frontMatter);
      pages.forEach((body, index) => {
        textPageCount += 1;
        entries.push({
          kind: 'text',
          id: `front-matter-${index}`,
          title: 'Preface & Forward',
          body,
          chapterId: 'front_matter',
          pageNumber: index + 1,
          totalChapterPages: pages.length,
          isFrontMatter: true,
        });
      });
    }
  }

  for (const slice of slices) {
    const sectionText = prepared.substring(slice.start, slice.end).trim();
    const pages = paginate(sectionText);
    pages.forEach((body, pageIndex) => {
      textPageCount += 1;
      entries.push({
        kind: 'text',
        id: `${slice.chapter.id}-page-${pageIndex}`,
        title: slice.chapter.title,
        body,
        chapterId: slice.chapter.id,
        pageNumber: pageIndex + 1,
        totalChapterPages: pages.length,
        isFrontMatter: false,
      });
    });
    entries.push({
      kind: 'quiz',
      id: `quiz-entry-${slice.chapter.quiz.id}`,
      title: slice.chapter.quiz.title,
      quiz: slice.chapter.quiz,
    });
  }

  entries.push({
    kind: 'quiz',
    id: `quiz-entry-${fundJainFinalQuiz.id}`,
    title: fundJainFinalQuiz.title,
    quiz: fundJainFinalQuiz,
  });

  return { entries, textPageCount };
}
