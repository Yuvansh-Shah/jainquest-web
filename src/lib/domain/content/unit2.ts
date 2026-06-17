// Unit 2 — "Living the Jain Path". Built with the same Seed -> Lesson shape as
// unit1.ts so the lesson runner, practice and progress logic work unchanged.
// Content covers standard, widely-agreed Jain concepts (the Three Jewels, the
// five vows, karma, Anekantvad/Syadvada, forgiveness, Samayika, Paryushana),
// kept in the same calm, practical, non-preachy register as Unit 1.
import type { Lesson, Unit } from '../lessonModels';
import type { BadgeDefinition } from '../models';

interface Seed {
  lessonId: string;
  title: string;
  objectives: string[];
  warmupPrompt: string;
  warmupCorrect: string;
  warmupWrong: string;
  coreIdea: string;
  whyItMatters: string;
  practiceTip: string;
  explanationKey: string;
  explanationPractice: string;
  quizPrompt: string;
  quizCorrect: string;
  quizWrong: string;
  nextLessonId: string;
}

const seeds: Seed[] = [
  {
    lessonId: 'U02_L01',
    title: 'The Three Jewels (Ratnatraya)',
    objectives: [
      'Name the three jewels: right faith, right knowledge, right conduct',
      'Explain why the three work only together, not in isolation',
      'Relate the three jewels to one real decision',
    ],
    warmupPrompt: 'The Jain path to liberation is summarised as:',
    warmupCorrect: 'Right faith, right knowledge, and right conduct together',
    warmupWrong: 'Ritual attendance by itself',
    coreIdea:
      'Jainism describes the path with the Ratnatraya, the Three Jewels: Samyak Darshana (right faith or clear seeing), Samyak Jnana (right knowledge), and Samyak Charitra (right conduct). Right faith is an honest, unprejudiced view of reality; right knowledge is understanding it accurately; right conduct is living in line with it. They are one path, not three separate steps.',
    whyItMatters:
      'Knowledge without conduct is empty, and conduct without clear seeing becomes blind ritual. Holding the three together keeps learning honest and action grounded, which is exactly what this curriculum is training.',
    practiceTip:
      'For one decision today, check all three: do I see this clearly, do I actually understand it, and does my action match what I know?',
    explanationKey:
      'The Three Jewels are interdependent. Liberation progresses only when seeing, knowing, and doing reinforce each other.',
    explanationPractice:
      'When advice feels off, ask which jewel is missing: unclear seeing, shallow knowledge, or inconsistent conduct.',
    quizPrompt: 'The Three Jewels of Jainism are:',
    quizCorrect: 'Right faith, right knowledge, and right conduct',
    quizWrong: 'Wealth, status, and influence',
    nextLessonId: 'U02_L02',
  },
  {
    lessonId: 'U02_L02',
    title: 'The Five Vows',
    objectives: [
      'List the five vows and state each in one plain sentence',
      'Connect each vow to a daily behaviour',
      'Explain how the vows extend the AAA framework',
    ],
    warmupPrompt: 'The five Jain vows begin with:',
    warmupCorrect: 'Ahimsa (non-violence)',
    warmupWrong: 'Accumulation of wealth',
    coreIdea:
      'The five vows are Ahimsa (non-violence), Satya (truthfulness), Asteya (not taking what is not given), Brahmacharya (restraint and fidelity), and Aparigraha (non-possessiveness). They turn the AAA values from Unit 1 into specific, checkable commitments across speech, ownership, relationships, and consumption.',
    whyItMatters:
      'Values stay vague until they become vows. Naming five concrete commitments makes it possible to notice, measure, and improve real behaviour instead of only admiring an ideal.',
    practiceTip:
      'Pick the one vow you find hardest this week and track a single concrete instance of keeping it each day.',
    explanationKey:
      'The five vows are a practical lattice: each one closes a different common route to harm and attachment.',
    explanationPractice:
      'Before speaking in a tense moment, run Satya and Ahimsa together: is it true, and is it kind enough to say this way?',
    quizPrompt: 'Which set correctly lists Jain vows?',
    quizCorrect: 'Ahimsa, Satya, Asteya, Brahmacharya, Aparigraha',
    quizWrong: 'Ambition, status, comfort, control, fame',
    nextLessonId: 'U02_L03',
  },
  {
    lessonId: 'U02_L03',
    title: 'Anuvrata and Mahavrata',
    objectives: [
      'Distinguish the householder vows from the ascetic vows',
      'Explain why graded practice prevents discouragement',
      'Choose a realistic Anuvrata-level commitment',
    ],
    warmupPrompt: 'Anuvratas are best described as:',
    warmupCorrect: 'The same vows kept at a practical householder level',
    warmupWrong: 'Vows only for festival days',
    coreIdea:
      'The same five vows are practised at two intensities. Mahavratas are the great, near-absolute vows of ascetics. Anuvratas are the "small vows": the identical principles scaled to a layperson living, working, and studying in the world. Same direction, realistic degree.',
    whyItMatters:
      'A graded path means progress is possible for everyone. You are not failing by starting at the householder level; you are practising the same value at a sustainable intensity, which is how habits actually hold.',
    practiceTip:
      'State one vow as an Anuvrata you can keep all week, not a heroic version you will abandon by Wednesday.',
    explanationKey:
      'Mahavrata and Anuvrata differ in degree, not in direction. Both move toward less harm and less attachment.',
    explanationPractice:
      'If a commitment keeps breaking, scale it down a level rather than dropping it; consistency outperforms intensity.',
    quizPrompt: 'The difference between Mahavrata and Anuvrata is mainly one of:',
    quizCorrect: 'Degree and life context, not the underlying principle',
    quizWrong: 'Completely different and unrelated rules',
    nextLessonId: 'U02_L04',
  },
  {
    lessonId: 'U02_L04',
    title: 'Karma in Depth',
    objectives: [
      'Describe karma in Jain thought as subtle matter bound to the soul',
      'Identify the passions that attract karmic bondage',
      'Explain how intention changes karmic weight',
    ],
    warmupPrompt: 'In Jain thought, karma is understood as:',
    warmupCorrect: 'Subtle matter that binds to the soul through passions',
    warmupWrong: 'Only good or bad luck',
    coreIdea:
      'Jainism treats karma as a fine material substance that adheres to the soul when actions are driven by the passions: anger, pride, deceit, and greed (kashayas). What binds is not just the act but the intensity of passion and intention behind it. Calm, aware action binds far less than the same act done in craving or rage.',
    whyItMatters:
      'This reframes self-improvement: the lever is not only what you do but the inner state you do it from. Reducing the heat of the passions is the most direct way to reduce harm and bondage.',
    practiceTip:
      'Before a charged action, name the passion present (anger, pride, deceit, greed). Naming it lowers its intensity.',
    explanationKey:
      'Karmic bondage scales with the passion behind an action, so intention is a primary, trainable variable.',
    explanationPractice:
      'When you notice a strong reaction, delay the response by one breath; the gap is where intention can change.',
    quizPrompt: 'What most increases karmic bondage in Jain thought?',
    quizCorrect: 'The intensity of passions like anger, pride, deceit, greed',
    quizWrong: 'The time of day an action happens',
    nextLessonId: 'U02_L05',
  },
  {
    lessonId: 'U02_L05',
    title: 'Samvara and Nirjara',
    objectives: [
      'Define Samvara as stopping new karmic inflow',
      'Define Nirjara as shedding existing karma',
      'Pair one Samvara habit with one Nirjara habit',
    ],
    warmupPrompt: 'Samvara refers to:',
    warmupCorrect: 'Stopping the inflow of new karma',
    warmupWrong: 'Collecting more possessions',
    coreIdea:
      'Two complementary processes free the soul. Samvara is stoppage: closing the doors through which new karma flows in, mainly by restraint, awareness, and the vows. Nirjara is shedding: wearing away karma already bound, through disciplined effort, patient endurance, and self-correction. Stop the inflow, then clear the backlog.',
    whyItMatters:
      'Effort fails when it is one-sided. Only shedding old habits while still feeding new ones is exhausting. Samvara plus Nirjara is a realistic two-part model for any genuine change.',
    practiceTip:
      'Choose one Samvara act (a restraint you will keep) and one Nirjara act (a correction of an old pattern) for the day.',
    explanationKey:
      'Liberation needs both stoppage and shedding; either alone leaves the soul still bound.',
    explanationPractice:
      'Review weekly: what new inflow did I stop, and what old pattern did I actually wear down?',
    quizPrompt: 'Samvara and Nirjara together describe:',
    quizCorrect: 'Stopping new karma and shedding existing karma',
    quizWrong: 'Two festivals in the Jain calendar',
    nextLessonId: 'U02_L06',
  },
  {
    lessonId: 'U02_L06',
    title: 'Anekantvad and Syadvada',
    objectives: [
      'Explain Anekantvad as the many-sidedness of reality',
      'Explain Syadvada as qualified, "from-one-view" statements',
      'Use a Syadvada phrasing to defuse a disagreement',
    ],
    warmupPrompt: 'Anekantvad teaches that truth is:',
    warmupCorrect: 'Many-sided, so any single view is partial',
    warmupWrong: 'Whatever the loudest person says',
    coreIdea:
      'Anekantvad is the doctrine that reality has many aspects, so no single statement captures the whole. Syadvada is its method of speech: qualifying claims with "in some respect" (syat) rather than absolute "it is only this". It is intellectual non-violence, Ahimsa applied to opinions.',
    whyItMatters:
      'Most conflict comes from treating a partial view as the total truth. Anekantvad lowers dogmatism without collapsing into "anything goes", which is vital online and in any debate.',
    practiceTip:
      'In your next disagreement, restate the other view accurately first, then add your own with "from this angle...".',
    explanationKey:
      'Anekantvad is humility about completeness; Syadvada is the careful, qualified speech that follows from it.',
    explanationPractice:
      'Replace "you are wrong" with "that holds in this respect; here is the respect it misses".',
    quizPrompt: 'Syadvada is best described as:',
    quizCorrect: 'Qualified statements that acknowledge a viewpoint is partial',
    quizWrong: 'A rule that all opinions are equally true',
    nextLessonId: 'U02_L07',
  },
  {
    lessonId: 'U02_L07',
    title: 'The Blind Men and the Elephant',
    objectives: [
      'Retell the parable and its point about partial truth',
      'Map the parable onto a modern information dispute',
      'Practise combining partial views into a fuller picture',
    ],
    warmupPrompt: 'In the elephant parable, each blind man is:',
    warmupCorrect: 'Partly right about a part, wrong about the whole',
    warmupWrong: 'Completely correct on their own',
    coreIdea:
      'In the classic parable each person touches one part of an elephant, a leg, the trunk, an ear, and confidently describes the whole from that part. None lies; each is partial. It is the standard illustration of Anekantvad: many honest, incomplete views can describe one complex reality.',
    whyItMatters:
      'It gives a memorable test for arguments: ask "which part of the elephant is each side holding?" instead of asking only who wins. This builds calm, accurate thinking under disagreement.',
    practiceTip:
      'Take one heated topic and write the strongest one-sentence version of two opposing views before judging either.',
    explanationKey:
      'The parable trains synthesis: integrate partial reports rather than crowning one as the whole truth.',
    explanationPractice:
      'When two trusted sources disagree, assume each holds a real part and look for the shape that includes both.',
    quizPrompt: 'The elephant parable mainly teaches that:',
    quizCorrect: 'Honest observers can each grasp only part of a larger truth',
    quizWrong: 'Disagreement always means someone is lying',
    nextLessonId: 'U02_L08',
  },
  {
    lessonId: 'U02_L08',
    title: 'Aparigraha and Mindful Consumption',
    objectives: [
      'Define Aparigraha as limiting attachment and accumulation',
      'Separate genuine need from craving and comparison',
      'Set one concrete limit on possession or consumption',
    ],
    warmupPrompt: 'Aparigraha primarily develops:',
    warmupCorrect: 'Contentment and freedom from compulsive accumulation',
    warmupWrong: 'Status through owning more',
    coreIdea:
      'Aparigraha is non-possessiveness: using what is genuinely useful while limiting clinging, hoarding, and the comparison that drives endless wanting. It is not forced poverty; it is conscious sufficiency, deciding "enough" on purpose rather than letting marketing decide it for you.',
    whyItMatters:
      'Modern life manufactures craving continuously. A practised sense of "enough" protects attention, money, and peace of mind, and directly reduces the harm embedded in overconsumption.',
    practiceTip:
      'Before a non-essential purchase, wait one day and ask whether it meets a real need or only soothes comparison.',
    explanationKey:
      'Aparigraha reframes freedom as not needing more, which is a trainable, measurable restraint.',
    explanationPractice:
      'Each month, remove or give away a few unused things; notice that lighter usually feels better, not worse.',
    quizPrompt: 'Aparigraha is best understood as:',
    quizCorrect: 'Conscious sufficiency and reduced attachment, not forced lack',
    quizWrong: 'Owning as little as possible to impress others',
    nextLessonId: 'U02_L09',
  },
  {
    lessonId: 'U02_L09',
    title: 'Ahimsa in Food',
    objectives: [
      'Explain why Jain dietary choices follow from Ahimsa',
      'Describe minimising harm rather than claiming zero harm',
      'Apply a harm-reduction lens to one everyday choice',
    ],
    warmupPrompt: 'Jain food choices are guided mainly by:',
    warmupCorrect: 'Minimising harm to living beings',
    warmupWrong: 'Following the latest diet trend',
    coreIdea:
      'Jain dietary practice is applied Ahimsa: choosing food that causes the least harm to living beings. This is why the tradition emphasises vegetarianism and mindful eating. The honest framing is harm-reduction, reducing avoidable harm as far as is practical, rather than a claim that any choice is perfectly harmless.',
    whyItMatters:
      'It models a mature ethic: act to lower harm meaningfully without pretending purity is total. That same realistic standard applies far beyond food.',
    practiceTip:
      'Pick one meal this week and choose the lower-harm option you can sustain, not an extreme you cannot keep.',
    explanationKey:
      'Food becomes an ethical practice when judged by harm reduced, not by ritual or trend.',
    explanationPractice:
      'Ask of one regular choice: is there a realistically lower-harm version I would actually maintain?',
    quizPrompt: 'The Jain approach to food is best summarised as:',
    quizCorrect: 'Reducing avoidable harm as far as is practical',
    quizWrong: 'Claiming a perfectly harmless diet exists',
    nextLessonId: 'U02_L10',
  },
  {
    lessonId: 'U02_L10',
    title: 'Forgiveness and Micchami Dukkadam',
    objectives: [
      'Explain Kshamapana as active, two-way forgiveness',
      'State the meaning of "Micchami Dukkadam"',
      'Practise one specific, non-defensive apology or release',
    ],
    warmupPrompt: '"Micchami Dukkadam" expresses:',
    warmupCorrect: 'Asking that any harm I caused be forgiven, and forgiving in return',
    warmupWrong: 'A demand that others apologise first',
    coreIdea:
      'Kshamapana is the Jain practice of forgiveness, asking pardon for harm caused and freely granting it. The phrase "Micchami Dukkadam" means roughly "may all the harm I have done be in vain / forgiven." It is mutual and unconditional, not a negotiation that waits for the other side to move first.',
    whyItMatters:
      'Unreleased resentment is a continuous low-grade harm to yourself and others. A regular forgiveness practice clears it deliberately instead of letting it accumulate.',
    practiceTip:
      'Identify one small grievance and either release it internally or make one specific, non-defensive apology.',
    explanationKey:
      'Forgiveness in Jain practice is active and reciprocal, a chosen release rather than a passive feeling.',
    explanationPractice:
      'End the week by naming anything you are carrying and consciously setting it down before it hardens.',
    quizPrompt: 'Kshamapana (Jain forgiveness) is:',
    quizCorrect: 'A mutual, unconditional asking and granting of pardon',
    quizWrong: 'Conditional, granted only after the other apologises',
    nextLessonId: 'U02_L11',
  },
  {
    lessonId: 'U02_L11',
    title: 'Samayika: Equanimity Practice',
    objectives: [
      'Define Samayika as a fixed period of calm equanimity',
      'Explain why a bounded practice builds steadiness',
      'Run one short Samayika-style session',
    ],
    warmupPrompt: 'Samayika is a practice of:',
    warmupCorrect: 'A set period of calm, balanced awareness',
    warmupWrong: 'Multitasking faster',
    coreIdea:
      'Samayika is a Jain practice of sitting for a fixed period in equanimity, setting aside agitation, hostility, and craving, and resting in balanced awareness. The boundary in time is the point: a defined start and end make stillness a repeatable discipline rather than a vague intention.',
    whyItMatters:
      'A short, regular equanimity practice is one of the most reliable ways to lower the passions that, as Unit lesson 4 showed, drive both harm and karmic bondage.',
    practiceTip:
      'Sit for a timed five minutes: no input, no reaction, just observing the breath and letting reactivity settle.',
    explanationKey:
      'Bounding stillness in time turns equanimity from a mood into a trainable skill.',
    explanationPractice:
      'Schedule Samayika at the same time daily; consistency of slot matters more than length of session.',
    quizPrompt: 'The defining feature of Samayika is:',
    quizCorrect: 'A bounded period of deliberate equanimity',
    quizWrong: 'Doing many tasks at once more efficiently',
    nextLessonId: 'U02_L12',
  },
  {
    lessonId: 'U02_L12',
    title: 'Paryushana and the Navkar Mantra',
    objectives: [
      'Describe Paryushana as an annual period of reflection and forgiveness',
      'Explain what the Navkar Mantra honours',
      'Plan one personal reflection-and-forgiveness review',
    ],
    warmupPrompt: 'Paryushana is mainly a time for:',
    warmupCorrect: 'Reflection, restraint, and seeking forgiveness',
    warmupWrong: 'Competitive celebration',
    coreIdea:
      'Paryushana is the major annual Jain observance: a concentrated period of self-reflection, restraint, study, and forgiveness, culminating in mutual pardon. The Navkar (Namokar) Mantra, recited across Jain practice, bows not to a single person but to qualities of awakening and spiritual virtue. Community and reflection reinforce each other.',
    whyItMatters:
      'An annual structured reset prevents drift. It is the calendar-level version of the daily and weekly reviews this curriculum keeps training.',
    practiceTip:
      'Set one yearly date for a personal review: what to forgive, what to release, what to recommit to.',
    explanationKey:
      'Paryushana institutionalises reflection and forgiveness so they do not depend on mood alone.',
    explanationPractice:
      'Borrow the structure now: a short monthly review modelled on Paryushana keeps correction continuous.',
    quizPrompt: 'Paryushana is best described as:',
    quizCorrect: 'An annual period of reflection, restraint, and forgiveness',
    quizWrong: 'A one-off ritual that completes spiritual growth',
    nextLessonId: 'U02_MASTER_TEST',
  },
];

function buildGeneratedLessons(): Lesson[] {
  return seeds.map((seed) => ({
    lessonId: seed.lessonId,
    title: seed.title,
    learningObjectives: seed.objectives,
    screens: {
      questionIntro: {
        title: 'Warm-up',
        prompt: seed.warmupPrompt,
        choices: [
          {
            choiceId: 'a',
            label: seed.warmupWrong,
            isCorrect: false,
            feedbackCorrect: 'Correct.',
            feedbackWrong: `Not quite. ${seed.warmupCorrect}.`,
          },
          {
            choiceId: 'b',
            label: seed.warmupCorrect,
            isCorrect: true,
            feedbackCorrect: 'Correct!',
            feedbackWrong: 'Incorrect.',
          },
        ],
      },
      shortText: {
        cards: [
          { title: 'Core idea', body: seed.coreIdea },
          { title: 'Why it matters', body: seed.whyItMatters },
          { title: 'Everyday practice', body: seed.practiceTip },
        ],
      },
      youtubeVideo: {
        title: 'Story clip',
        note: 'Short clip to connect the idea to daily life.',
        searchKeywords: [],
        videoAsset: 'assets/videos/youtubevideo.mp4',
        clipStartSeconds: 0,
        clipEndSeconds: 10,
      },
      explanation: {
        sections: [
          { title: 'Key concept', body: seed.explanationKey },
          { title: 'In practice', body: seed.explanationPractice },
        ],
      },
      quiz: {
        questions: [
          {
            questionId: `${seed.lessonId}_q1`,
            format: 'multipleChoice',
            prompt: seed.quizPrompt,
            choices: [
              {
                choiceId: 'a',
                label: seed.quizCorrect,
                isCorrect: true,
                feedbackCorrect: 'Correct!',
                feedbackWrong: '',
              },
              {
                choiceId: 'b',
                label: seed.quizWrong,
                isCorrect: false,
                feedbackCorrect: '',
                feedbackWrong: `Not quite. ${seed.quizCorrect}.`,
              },
            ],
          },
        ],
      },
      lessonComplete: {
        title: 'Lesson complete',
        rewardText: 'Lesson complete',
        nextLessonId: seed.nextLessonId,
      },
    },
  }));
}

const masterTest: Lesson = {
  lessonId: 'U02_MASTER_TEST',
  title: 'Unit 2 Master Test',
  learningObjectives: [
    'Review key ideas from Living the Jain Path',
    'Apply core concepts across topics',
  ],
  screens: {
    questionIntro: {
      title: 'Master Test',
      prompt: 'Ready to mix everything from Unit 2?',
      choices: [
        {
          choiceId: 'a',
          label: "Yes, let's go",
          isCorrect: true,
          feedbackCorrect: "Great! Let's start.",
          feedbackWrong: '',
        },
        {
          choiceId: 'b',
          label: 'Not yet',
          isCorrect: false,
          feedbackCorrect: '',
          feedbackWrong: 'Take a breath and try anyway.',
        },
      ],
    },
    shortText: {
      cards: [
        {
          title: 'Mixed Review',
          body:
            'This quiz reviews core ideas from Unit 2: the Three Jewels, the five vows, karma, Anekantvad, forgiveness, and reflective practice.',
        },
      ],
    },
    youtubeVideo: {
      title: 'Story clip',
      note: 'Quick recap before the master test.',
      searchKeywords: [],
      videoAsset: 'assets/videos/youtubevideo.mp4',
      clipStartSeconds: 60,
      clipEndSeconds: 70,
    },
    explanation: {
      sections: [
        {
          title: 'Focus on clarity',
          body:
            'Answer slowly and carefully. This is a summary of your Unit 2 progress.',
        },
      ],
    },
    quiz: {
      questions: [
        {
          questionId: 'U02_MT_q1',
          format: 'multipleChoice',
          prompt: 'The Three Jewels of Jainism are:',
          choices: [
            {
              choiceId: 'a',
              label: 'Right faith, right knowledge, and right conduct',
              isCorrect: true,
              feedbackCorrect:
                'Correct! The Ratnatraya works only as one integrated path.',
              feedbackWrong: '',
            },
            {
              choiceId: 'b',
              label: 'Wealth, status, and influence',
              isCorrect: false,
              feedbackCorrect: '',
              feedbackWrong:
                'Not quite. The jewels are right faith, knowledge, and conduct.',
            },
          ],
        },
        {
          questionId: 'U02_MT_q2',
          format: 'multipleChoice',
          prompt: 'What most increases karmic bondage in Jain thought?',
          choices: [
            {
              choiceId: 'a',
              label: 'The intensity of passions behind an action',
              isCorrect: true,
              feedbackCorrect:
                'Right! Intention and the passions are the key variable.',
              feedbackWrong: '',
            },
            {
              choiceId: 'b',
              label: 'The time of day the action happens',
              isCorrect: false,
              feedbackCorrect: '',
              feedbackWrong:
                'Not this. Bondage scales with passion and intention.',
            },
          ],
        },
        {
          questionId: 'U02_MT_q3',
          format: 'multipleChoice',
          prompt: 'Samvara and Nirjara together describe:',
          choices: [
            {
              choiceId: 'a',
              label: 'Stopping new karma and shedding existing karma',
              isCorrect: true,
              feedbackCorrect: 'Correct! Both are needed to free the soul.',
              feedbackWrong: '',
            },
            {
              choiceId: 'b',
              label: 'Two festivals in the Jain calendar',
              isCorrect: false,
              feedbackCorrect: '',
              feedbackWrong:
                'Not quite. They are stoppage and shedding of karma.',
            },
          ],
        },
        {
          questionId: 'U02_MT_q4',
          format: 'multipleChoice',
          prompt: 'Syadvada is best described as:',
          choices: [
            {
              choiceId: 'a',
              label: 'Qualified statements that acknowledge a view is partial',
              isCorrect: true,
              feedbackCorrect:
                'Correct! It is intellectual non-violence in speech.',
              feedbackWrong: '',
            },
            {
              choiceId: 'b',
              label: 'A rule that all opinions are equally true',
              isCorrect: false,
              feedbackCorrect: '',
              feedbackWrong:
                'Too loose. Syadvada qualifies claims, it does not flatten them.',
            },
          ],
        },
        {
          questionId: 'U02_MT_q5',
          format: 'multipleChoice',
          prompt: 'Kshamapana (Jain forgiveness) is:',
          choices: [
            {
              choiceId: 'a',
              label: 'A mutual, unconditional asking and granting of pardon',
              isCorrect: true,
              feedbackCorrect:
                'Correct! It is active and reciprocal, not conditional.',
              feedbackWrong: '',
            },
            {
              choiceId: 'b',
              label: 'Granted only after the other person apologises first',
              isCorrect: false,
              feedbackCorrect: '',
              feedbackWrong:
                'Not quite. It does not wait for the other side to move first.',
            },
          ],
        },
      ],
    },
    lessonComplete: {
      title: 'Unit 2 master test complete',
      rewardText: 'Badge unlocked: Path Walker',
      nextLessonId: null,
    },
  },
};

export const unit2: Unit = {
  id: 'UNIT_02',
  title: 'Living the Jain Path',
  level: 'Intermediate',
  lessons: [...buildGeneratedLessons(), masterTest],
};

export const unit2Badges: BadgeDefinition[] = [
  {
    id: 'BADGE_THREE_JEWELS',
    name: 'Three Jewels',
    description: 'Learned right faith, knowledge, and conduct',
    trigger: 'complete_U02_L01',
  },
  {
    id: 'BADGE_VOW_KEEPER',
    name: 'Vow Keeper',
    description: 'Studied the five Jain vows',
    trigger: 'complete_U02_L02',
  },
  {
    id: 'BADGE_KARMA_DEPTH',
    name: 'Karma in Depth',
    description: 'Understood karmic bondage and the passions',
    trigger: 'complete_U02_L04',
  },
  {
    id: 'BADGE_MANY_SIDED',
    name: 'Many-Sided Mind',
    description: 'Practised Anekantvad and Syadvada',
    trigger: 'complete_U02_L06',
  },
  {
    id: 'BADGE_FORGIVENESS',
    name: 'Open Heart',
    description: 'Practised Kshamapana and forgiveness',
    trigger: 'complete_U02_L10',
  },
  {
    id: 'BADGE_PATH_WALKER',
    name: 'Path Walker',
    description: 'Passed the Unit 2 master test',
    trigger: 'complete_U02_MASTER_TEST',
  },
];
