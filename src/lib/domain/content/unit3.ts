// Unit 3 — "The Soul's Journey". Built with the same Seed -> Lesson shape as
// unit1.ts / unit2.ts so the lesson runner, practice and progress logic work
// unchanged. Content covers standard, widely-agreed Jain metaphysics (jiva and
// ajiva, the nine tattvas, the six dravyas, the eight karmas, leshya, the four
// gatis, the gunasthanas, the twelve bhavanas, loka, the kalachakra, and
// moksha), kept in the same calm, practical, non-preachy register as Units 1-2.
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
    lessonId: 'U03_L01',
    title: 'Jiva and Ajiva',
    objectives: [
      'Distinguish jiva (soul) from ajiva (non-soul)',
      'Recognise consciousness as the defining mark of a jiva',
      'Apply the distinction to how living beings are treated',
    ],
    warmupPrompt: 'In Jain thought, the defining mark of a jiva (soul) is:',
    warmupCorrect: 'Consciousness — the capacity to know and experience',
    warmupWrong: 'Having a large or visible body',
    coreIdea:
      'Jain metaphysics begins by dividing all of reality into two: jiva, the living and conscious, and ajiva, the non-living and unconscious. A jiva is defined by chetana — consciousness, the capacity to know and experience — not by the shape or size of its body. Souls exist across a vast range of forms, from humans and animals to subtle beings in earth, water, air and plants.',
    whyItMatters:
      'This is the root of Ahimsa. If consciousness, not appearance, defines a living being, then far more beings deserve care than we usually notice. It also reframes you: you are a jiva temporarily housed in a body, not the body itself.',
    practiceTip:
      'Once today, pause and notice the difference between you — the one observing — and the passing thoughts and sensations you observe.',
    explanationKey:
      'Jiva and ajiva are the two irreducible categories of reality; consciousness is the line between them.',
    explanationPractice:
      'When tempted to judge worth by appearance or usefulness, remember that the mark of a soul is the capacity to experience.',
    quizPrompt: 'What defines a jiva in Jain philosophy?',
    quizCorrect: 'Consciousness — the capacity to know and experience',
    quizWrong: 'The size or shape of its body',
    nextLessonId: 'U03_L02',
  },
  {
    lessonId: 'U03_L02',
    title: 'The Nine Tattvas',
    objectives: [
      'List the nine tattvas (fundamental truths)',
      'Explain how they map the soul’s bondage and liberation',
      'Locate Samvara and Nirjara within the larger map',
    ],
    warmupPrompt: 'The nine tattvas are best described as:',
    warmupCorrect:
      'The fundamental truths explaining how the soul is bound and freed',
    warmupWrong: 'A list of annual festivals',
    coreIdea:
      'The nine tattvas (nava tattva) are the fundamental truths of Jain philosophy: jiva (soul), ajiva (non-soul), punya (merit), papa (demerit), asrava (inflow of karma), bandha (bondage), samvara (stoppage of inflow), nirjara (shedding of karma) and moksha (liberation). Together they form one complete map of how a soul becomes bound and how it becomes free.',
    whyItMatters:
      'Scattered teachings turn into one system once you see the map. Every Jain practice — a vow, a reflection, an act of restraint — is doing one of two jobs: reducing inflow or increasing shedding.',
    practiceTip:
      'For one action today, ask which tattva it serves: is it inflow (asrava) or stoppage (samvara)?',
    explanationKey:
      'The nine tattvas are a cause-and-effect chart of the soul’s journey from bondage to freedom.',
    explanationPractice:
      'Use the map to locate yourself: most days run between asrava and samvara — notice which is winning.',
    quizPrompt: 'The nine tattvas together explain:',
    quizCorrect: 'How the soul becomes bound and how it becomes free',
    quizWrong: 'The correct order of daily rituals',
    nextLessonId: 'U03_L03',
  },
  {
    lessonId: 'U03_L03',
    title: 'The Six Dravyas',
    objectives: [
      'Name the six substances that compose reality',
      'Explain dharma and adharma as the media of motion and rest',
      'See why space and time count as real substances',
    ],
    warmupPrompt: 'Jainism describes reality as made of:',
    warmupCorrect: 'Six eternal substances (dravyas)',
    warmupWrong: 'A single substance that is constantly created anew',
    coreIdea:
      'Reality is built from six eternal substances, the dravyas: jiva (soul), pudgala (matter), dharma (the medium that makes motion possible), adharma (the medium that makes rest possible), akasha (space) and kala (time). Nothing is created from nothing or destroyed into nothing — substances only change their state. Note that dharma here means a medium of motion, not "righteousness".',
    whyItMatters:
      'This is a strikingly systematic view of the universe: everything fits one of six eternal categories. It teaches that change is real but loss is not — matter and souls persist, only their forms shift.',
    practiceTip:
      'When something ends — an object breaks, a phase closes — note that the substance did not vanish; it changed form.',
    explanationKey:
      'Six eternal dravyas compose all of reality; dharma and adharma uniquely make motion and rest possible.',
    explanationPractice:
      'Hold change lightly: in this view nothing is ever truly destroyed, only transformed.',
    quizPrompt: 'Dharma, considered as a dravya, is:',
    quizCorrect: 'The medium that makes motion possible',
    quizWrong: 'A set of moral commandments',
    nextLessonId: 'U03_L04',
  },
  {
    lessonId: 'U03_L04',
    title: 'The Eight Karmas',
    objectives: [
      'Name the eight types of karma',
      'Separate karmas that obscure the soul from those that shape circumstance',
      'Identify deluding karma (mohaniya) as the most decisive',
    ],
    warmupPrompt: 'Among the eight karmas, the most decisive to overcome is:',
    warmupCorrect: 'Mohaniya — the deluding karma',
    warmupWrong: 'They are all exactly equal in effect',
    coreIdea:
      'Jain thought identifies eight kinds of karma. Four obscure the soul’s natural qualities: jnanavaraniya (obscures knowledge), darshanavaraniya (obscures perception), mohaniya (deludes faith and conduct) and antaraya (obstructs energy and will). Four shape outer circumstance: vedaniya (pleasure and pain), ayushya (lifespan), nama (body and form) and gotra (social standing). Mohaniya, the deluding karma, is considered the keystone — weaken it and the others loosen.',
    whyItMatters:
      'It shows that not all conditioning is equal. The deepest leverage point is delusion — distorted seeing — rather than outer circumstance. Working on clarity of view changes everything downstream.',
    practiceTip:
      'When stuck, ask whether the real obstacle is the situation itself or a distorted way of seeing it.',
    explanationKey:
      'Eight karmas: four obscure the soul, four shape circumstance; mohaniya (delusion) is the keystone.',
    explanationPractice:
      'Spend effort on clearing delusion first; circumstance loosens once seeing is corrected.',
    quizPrompt: 'Which karma is considered the most decisive to overcome?',
    quizCorrect: 'Mohaniya — the deluding karma',
    quizWrong: 'Gotra — the status-determining karma',
    nextLessonId: 'U03_L05',
  },
  {
    lessonId: 'U03_L05',
    title: 'Leshya: Colours of the Soul',
    objectives: [
      'Explain leshya as the soul’s mental and emotional colouring',
      'Recall that the six leshyas run from darkest to brightest',
      'Use the fruit-tree parable to read one’s own intention',
    ],
    warmupPrompt: 'Leshya describes:',
    warmupCorrect: 'The mental and emotional colouring of the soul',
    warmupWrong: 'The physical colour of a person’s body',
    coreIdea:
      'Leshya is the colouring the passions give the soul — a way of describing your mental and emotional state. There are six, from the three darker (black, blue, grey), marked by cruelty, greed and recklessness, to the three brighter (red, yellow, white), marked by restraint, calm and purity. The classic parable: six travellers want fruit from a tree. One would uproot the whole tree, the next fell it, the next cut a branch, the next a twig, the next pick fruit directly, and the last gathers only fruit that has already fallen. Same goal — six leshyas.',
    whyItMatters:
      'It gives a vivid self-check. The question is not only "what do I want?" but "how dark or light is the way I am going about it?" The fruit-tree test fits almost any decision.',
    practiceTip:
      'Before acting on a want, run the tree test: am I uprooting the tree, or gathering what has already fallen?',
    explanationKey:
      'Six leshyas chart the soul from cruelty (black) to purity (white); the colour of intention matters as much as the goal.',
    explanationPractice:
      'Aim to shift one shade lighter — choose the least harmful way to meet a genuine need.',
    quizPrompt: 'The parable of six travellers and the fruit tree illustrates:',
    quizCorrect: 'The six leshyas — that intention has degrees of harm',
    quizWrong: 'That fruit should never be eaten at all',
    nextLessonId: 'U03_L06',
  },
  {
    lessonId: 'U03_L06',
    title: 'The Four Gatis',
    objectives: [
      'Name the four gatis (states of rebirth)',
      'Explain rebirth as shaped by karma, not by reward or punishment',
      'Draw a practical lesson from the rarity of a human birth',
    ],
    warmupPrompt: 'The four gatis are the four:',
    warmupCorrect: 'States of existence a soul can be reborn into',
    warmupWrong: 'Seasons of the traditional year',
    coreIdea:
      'A soul cycles through four gatis — states of existence: naraki (beings in states of intense suffering), tiryancha (animals and plants), manushya (human) and deva (heavenly beings). Where a soul is reborn follows from its karma — it is mechanism, not a court’s verdict. The human birth is held to be especially valuable, because real spiritual progress can be made only from it.',
    whyItMatters:
      'Whatever one’s view of literal rebirth, the teaching lands as urgency and gratitude: a human life with the freedom to choose and reflect is rare and not to be spent on autopilot.',
    practiceTip:
      'Treat one ordinary day as the rare opportunity the teaching says it is — spend part of it deliberately.',
    explanationKey:
      'Four gatis; rebirth follows karma mechanically; human birth is the rare window for real progress.',
    explanationPractice:
      'Let the rarity of a reflective human life convert into focus rather than anxiety.',
    quizPrompt: 'Why does Jain thought value a human birth so highly?',
    quizCorrect: 'Real spiritual progress can be made only from it',
    quizWrong: 'It is the most comfortable of all the states',
    nextLessonId: 'U03_L07',
  },
  {
    lessonId: 'U03_L07',
    title: 'The Gunasthanas',
    objectives: [
      'Explain the gunasthanas as stages of spiritual development',
      'Recognise the path as gradual, with slips possible',
      'Locate honest beginners on the early rungs',
    ],
    warmupPrompt: 'The fourteen gunasthanas describe:',
    warmupCorrect: 'Stages of the soul’s spiritual development',
    warmupWrong: 'Fourteen categories of food',
    coreIdea:
      'The gunasthanas are fourteen stages charting the soul’s ascent from deep delusion to full liberation. The early stages are about gaining and steadying right faith; the middle stages, about strengthening conduct and vows; the highest, about dissolving the subtlest passions. Progress is gradual, and a soul can slip back — the ladder is real, but climbing it is not automatic.',
    whyItMatters:
      'It is an honest model of growth: staged, non-linear, with setbacks expected. That removes both arrogance ("I have arrived") and despair ("I have failed") — a slip is a known feature of the climb.',
    practiceTip:
      'Locate yourself honestly on an early rung and aim only for the next one, not the summit.',
    explanationKey:
      'Fourteen gunasthanas map a gradual, reversible ascent from delusion to liberation.',
    explanationPractice:
      'Measure progress by the next rung, and treat a slip as information, not a verdict.',
    quizPrompt: 'The gunasthanas teach that spiritual progress is:',
    quizCorrect: 'Gradual and staged, with slips possible',
    quizWrong: 'Instant and permanent once it begins',
    nextLessonId: 'U03_L08',
  },
  {
    lessonId: 'U03_L08',
    title: 'The Twelve Bhavanas',
    objectives: [
      'Explain bhavanas as contemplations that reorient the mind',
      'Recall key reflections such as impermanence and solitariness',
      'Practise one bhavana deliberately',
    ],
    warmupPrompt: 'The twelve bhavanas are:',
    warmupCorrect: 'Reflections practised until they reshape the mind',
    warmupWrong: 'Twelve required donations',
    coreIdea:
      'The bhavanas (also called anuprekshas) are twelve contemplations meant to be turned over in the mind until they reshape it. Among them: anitya (everything changes), asharana (no external thing gives final security), ekatva (you walk the inner path alone), anyatva (you are distinct from body and possessions) and ashuchi (the body is impermanent). They are not slogans to assert but reflections to soak in.',
    whyItMatters:
      'This is structured mental training. Where modern life floods the mind with reactive content, the bhavanas are a fixed set of steadying reflections you can deliberately return to.',
    practiceTip:
      'Take one bhavana — say, impermanence — and hold it quietly for two minutes, letting it colour how you see the day.',
    explanationKey:
      'Twelve bhavanas are repeated contemplations that gradually reorient the mind toward clarity and detachment.',
    explanationPractice:
      'Rotate through the reflections; let each be a lens for a day rather than a fact to memorise.',
    quizPrompt: 'Bhavanas are best practised as:',
    quizCorrect: 'Reflections held in the mind until they reshape it',
    quizWrong: 'Facts to be memorised once and set aside',
    nextLessonId: 'U03_L09',
  },
  {
    lessonId: 'U03_L09',
    title: 'Loka: The Jain Universe',
    objectives: [
      'Describe the three broad regions of the Jain cosmos',
      'Explain that the universe is uncreated and eternal',
      'Draw a lesson about scale and humility',
    ],
    warmupPrompt: 'In Jain cosmology, the universe is:',
    warmupCorrect: 'Uncreated and eternal — not made by a creator',
    warmupWrong: 'Created recently by a single being',
    coreIdea:
      'Jain cosmology describes the loka — the inhabited universe — as vast, structured and eternal: it was not created and will not be destroyed. It is pictured in three broad regions: lower realms, a middle realm where human life and effort take place, and upper realms, with liberated souls resting at the very summit. Beyond the loka lies aloka, pure empty space.',
    whyItMatters:
      'An uncreated, self-running cosmos places responsibility squarely on the soul’s own effort — there is no external manager to appeal to. It also instils humility: human life occupies one modest band of an immense whole.',
    practiceTip:
      'Once today, widen the frame: set your immediate worry against the scale of the whole loka.',
    explanationKey:
      'The loka is an eternal, uncreated, three-tiered cosmos; liberated souls rest at its summit.',
    explanationPractice:
      'Use cosmic scale to right-size worries without dismissing real responsibilities.',
    quizPrompt: 'Jain cosmology holds that the universe is:',
    quizCorrect: 'Eternal and uncreated',
    quizWrong: 'Built once by a creator and easily ended',
    nextLessonId: 'U03_L10',
  },
  {
    lessonId: 'U03_L10',
    title: 'Kalachakra: The Wheel of Time',
    objectives: [
      'Explain time as a turning wheel of rising and falling halves',
      'Name the two half-cycles of the wheel',
      'Draw a steadying lesson from cosmic cycles',
    ],
    warmupPrompt: 'The kalachakra (wheel of time) turns through:',
    warmupCorrect: 'A rising half and a falling half, endlessly',
    warmupWrong: 'A single straight line that simply ends',
    coreIdea:
      'Jain thought pictures time as a turning wheel, the kalachakra. It moves through two great half-cycles: utsarpini, the ascending half in which wellbeing, ethics and lifespan gradually rise, and avasarpini, the descending half in which they gradually decline. Each half is divided into six aras (spokes). The wheel never stops; ages rise and fall without end.',
    whyItMatters:
      'A cyclical view steadies you against both panic and complacency: a hard age is not the final word, and a good age is not permanent. Effort is what you control within whatever age you are given.',
    practiceTip:
      'When tempted to think things are uniquely doomed or perfect, remember the wheel — then return attention to your own next action.',
    explanationKey:
      'Time is the kalachakra: endless ascending (utsarpini) and descending (avasarpini) halves of six aras each.',
    explanationPractice:
      'Hold the times lightly and the effort firmly; you steer your conduct, not the age.',
    quizPrompt: 'The two half-cycles of the kalachakra are:',
    quizCorrect: 'Utsarpini (ascending) and avasarpini (descending)',
    quizWrong: 'Summer and winter',
    nextLessonId: 'U03_L11',
  },
  {
    lessonId: 'U03_L11',
    title: 'Moksha and the Siddha',
    objectives: [
      'Define moksha as the soul freed from all karma',
      'Describe the siddha — the liberated soul',
      'Explain liberation as the soul’s own nature finally revealed',
    ],
    warmupPrompt: 'Moksha, in Jain thought, is:',
    warmupCorrect: 'The soul freed completely from all karma',
    warmupWrong: 'Gaining the greatest quantity of possessions',
    coreIdea:
      'Moksha is the goal of the whole path: the soul freed completely from karma, ending the cycle of rebirth. A liberated soul is a siddha, possessed of its natural, unobscured qualities — infinite knowledge, perception, bliss and energy. A siddha does not go anywhere or rule anything; it simply rests, fully itself, at the summit of the loka. Liberation is not an acquisition but the soul’s own nature finally uncovered.',
    whyItMatters:
      'It reframes the entire effort. You are not building something foreign; you are removing what obscures what you already are. Spiritual work is subtraction — clearing karma — not accumulation.',
    practiceTip:
      'Frame one piece of self-improvement today as removing an obstruction rather than adding an achievement.',
    explanationKey:
      'Moksha is total freedom from karma; the siddha is the soul resting in its own uncovered nature.',
    explanationPractice:
      'Treat growth as subtraction — clearing what obscures — rather than acquisition.',
    quizPrompt: 'A siddha (liberated soul) is best described as:',
    quizCorrect: 'A soul resting in its own natural, unobscured qualities',
    quizWrong: 'A ruler who controls the universe',
    nextLessonId: 'U03_L12',
  },
  {
    lessonId: 'U03_L12',
    title: 'Carrying Jain Wisdom into the Modern World',
    objectives: [
      'Connect Jain principles to contemporary issues',
      'Translate metaphysics into daily conduct',
      'Make one concrete, lasting commitment',
    ],
    warmupPrompt: 'The clearest sign of understanding Jain philosophy is:',
    warmupCorrect: 'A change in everyday conduct, not just knowledge',
    warmupWrong: 'Being able to recite every list from memory',
    coreIdea:
      'A philosophy proves itself in conduct. Jain principles map directly onto modern concerns: Ahimsa onto how we treat people, animals and ecosystems; Anekantvad onto how we hold disagreement and information; Aparigraha onto consumption, attention and sustainability. The metaphysics of the earlier lessons is not trivia — it is the reasoning that makes the conduct coherent.',
    whyItMatters:
      'Knowledge that never reaches behaviour is just decoration. The whole curriculum aims at one thing: a steadier, less harmful, more aware way of living in the actual modern world.',
    practiceTip:
      'Choose one principle and one concrete behaviour to keep beyond this course — small enough to actually sustain.',
    explanationKey:
      'Jain philosophy is validated only in conduct; its principles map cleanly onto modern ethical life.',
    explanationPractice:
      'Make one lasting, sustainable commitment now, and revisit it the way Paryushana revisits the year.',
    quizPrompt: 'Jain philosophy is ultimately validated by:',
    quizCorrect: 'A real change in everyday conduct',
    quizWrong: 'Memorising all of its terminology',
    nextLessonId: 'U03_MASTER_TEST',
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
  lessonId: 'U03_MASTER_TEST',
  title: 'Unit 3 Master Test',
  learningObjectives: [
    "Review key ideas from The Soul's Journey",
    'Apply core concepts across topics',
  ],
  screens: {
    questionIntro: {
      title: 'Master Test',
      prompt: 'Ready to mix everything from Unit 3?',
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
            'This quiz reviews core ideas from Unit 3: jiva and ajiva, the tattvas, the eight karmas, leshya, cosmic time, and moksha.',
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
            'Answer slowly and carefully. This is a summary of your Unit 3 progress.',
        },
      ],
    },
    quiz: {
      questions: [
        {
          questionId: 'U03_MT_q1',
          format: 'multipleChoice',
          prompt: 'What defines a jiva (soul) in Jain philosophy?',
          choices: [
            {
              choiceId: 'a',
              label: 'Consciousness — the capacity to know and experience',
              isCorrect: true,
              feedbackCorrect:
                'Correct! Consciousness, not the body, marks a soul.',
              feedbackWrong: '',
            },
            {
              choiceId: 'b',
              label: 'The size or shape of its body',
              isCorrect: false,
              feedbackCorrect: '',
              feedbackWrong:
                'Not quite. A jiva is defined by consciousness, not its body.',
            },
          ],
        },
        {
          questionId: 'U03_MT_q2',
          format: 'multipleChoice',
          prompt: 'Which of the eight karmas is the keystone to overcome?',
          choices: [
            {
              choiceId: 'a',
              label: 'Mohaniya — the deluding karma',
              isCorrect: true,
              feedbackCorrect:
                'Right! Clear delusion and the other karmas loosen.',
              feedbackWrong: '',
            },
            {
              choiceId: 'b',
              label: 'Gotra — the status-determining karma',
              isCorrect: false,
              feedbackCorrect: '',
              feedbackWrong: 'Not quite. The keystone is mohaniya, delusion.',
            },
          ],
        },
        {
          questionId: 'U03_MT_q3',
          format: 'multipleChoice',
          prompt: 'The parable of the fruit tree illustrates:',
          choices: [
            {
              choiceId: 'a',
              label: 'The six leshyas — that intention has degrees of harm',
              isCorrect: true,
              feedbackCorrect:
                'Correct! How you pursue a goal has its own colour.',
              feedbackWrong: '',
            },
            {
              choiceId: 'b',
              label: 'That fruit should never be eaten',
              isCorrect: false,
              feedbackCorrect: '',
              feedbackWrong:
                'Not quite. It shows the six leshyas — degrees of harm in intention.',
            },
          ],
        },
        {
          questionId: 'U03_MT_q4',
          format: 'multipleChoice',
          prompt: 'The kalachakra (wheel of time) turns through:',
          choices: [
            {
              choiceId: 'a',
              label: 'Endless ascending and descending half-cycles',
              isCorrect: true,
              feedbackCorrect:
                'Correct! Utsarpini rises and avasarpini falls, without end.',
              feedbackWrong: '',
            },
            {
              choiceId: 'b',
              label: 'A single straight line that ends',
              isCorrect: false,
              feedbackCorrect: '',
              feedbackWrong:
                'Not quite. Time is a wheel of rising and falling halves.',
            },
          ],
        },
        {
          questionId: 'U03_MT_q5',
          format: 'multipleChoice',
          prompt: 'Moksha is best described as:',
          choices: [
            {
              choiceId: 'a',
              label: 'The soul freed completely from all karma',
              isCorrect: true,
              feedbackCorrect:
                'Correct! Liberation uncovers the soul’s own nature.',
              feedbackWrong: '',
            },
            {
              choiceId: 'b',
              label: 'Gaining the greatest quantity of possessions',
              isCorrect: false,
              feedbackCorrect: '',
              feedbackWrong:
                'Not quite. Moksha is total freedom from karma, not accumulation.',
            },
          ],
        },
      ],
    },
    lessonComplete: {
      title: 'Unit 3 master test complete',
      rewardText: 'Badge unlocked: Liberation',
      nextLessonId: null,
    },
  },
};

export const unit3: Unit = {
  id: 'UNIT_03',
  title: "The Soul's Journey",
  level: 'Advanced',
  lessons: [...buildGeneratedLessons(), masterTest],
};

export const unit3Badges: BadgeDefinition[] = [
  {
    id: 'BADGE_SOUL_SEEKER',
    name: 'Soul Seeker',
    description: 'Learned the difference between jiva and ajiva',
    trigger: 'complete_U03_L01',
  },
  {
    id: 'BADGE_NINE_TRUTHS',
    name: 'Nine Truths',
    description: 'Mapped the nine tattvas',
    trigger: 'complete_U03_L02',
  },
  {
    id: 'BADGE_KARMA_SCHOLAR',
    name: 'Karma Scholar',
    description: 'Studied the eight types of karma',
    trigger: 'complete_U03_L04',
  },
  {
    id: 'BADGE_INNER_CLIMBER',
    name: 'Inner Climber',
    description: 'Learned the fourteen gunasthanas',
    trigger: 'complete_U03_L07',
  },
  {
    id: 'BADGE_COSMIC_VIEW',
    name: 'Cosmic View',
    description: 'Explored the structure of the Jain universe',
    trigger: 'complete_U03_L09',
  },
  {
    id: 'BADGE_LIBERATION',
    name: 'Liberation',
    description: 'Passed the Unit 3 master test',
    trigger: 'complete_U03_MASTER_TEST',
  },
];
