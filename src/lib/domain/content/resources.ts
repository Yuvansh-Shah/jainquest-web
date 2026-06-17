// Hand-curated learning resources. Every link was web-verified to be a real,
// working page (videos checked via YouTube's oEmbed API for channel + title;
// sites fetched to confirm they load). No search-result links, no
// AI-narrated/low-quality channels. Coverage is intentionally selective:
// only genuinely good material is listed.

export interface Resource {
  kind: 'video' | 'site';
  title: string;
  source: string;
  url: string;
  blurb: string;
}

export interface ResourceSection {
  title: string;
  description: string;
  items: Resource[];
}

export const resourceSections: ResourceSection[] = [
  {
    title: 'Watch',
    description:
      'Vetted talks and documentaries from real, reputable channels.',
    items: [
      {
        kind: 'video',
        title: 'What is Jainism?',
        source: 'Let’s Talk Religion',
        url: 'https://www.youtube.com/watch?v=c33XPyljUiw',
        blurb:
          'A clear, scholarly deep-dive that covers Ahimsa, Anekantavada, Aparigraha, karma and the Tirthankaras in one place. The best single overview.',
      },
      {
        kind: 'video',
        title: 'Introduction to Jainism — Belief',
        source: 'OWN (Oprah Winfrey Network)',
        url: 'https://www.youtube.com/watch?v=h_VA7mWWn58',
        blurb:
          'A short, beautifully filmed documentary segment showing Jain non-violence as it is actually lived day to day.',
      },
    ],
  },
  {
    title: 'Read & explore',
    description:
      'Authoritative references for going deeper on any lesson.',
    items: [
      {
        kind: 'site',
        title: 'Jaina Philosophy',
        source: 'Stanford Encyclopedia of Philosophy',
        url: 'https://plato.stanford.edu/entries/jaina-philosophy/',
        blurb:
          'Rigorous academic treatment of Jain metaphysics, epistemology and ethics. Dense but excellent.',
      },
      {
        kind: 'site',
        title: 'Jainism',
        source: 'Encyclopaedia Britannica',
        url: 'https://www.britannica.com/topic/Jainism',
        blurb:
          'A reliable, readable encyclopedic introduction to beliefs, history and practice.',
      },
      {
        kind: 'site',
        title: 'Jainism',
        source: 'World History Encyclopedia',
        url: 'https://www.worldhistory.org/jainism/',
        blurb:
          'Approachable history of origins, core beliefs, scriptures and sects.',
      },
      {
        kind: 'site',
        title: 'Jainism',
        source: 'National Geographic Education',
        url: 'https://education.nationalgeographic.org/resource/jainism/',
        blurb:
          'Concise, classroom-friendly overview of the religion and its principles.',
      },
      {
        kind: 'site',
        title: 'Lord Mahavir and His Teachings',
        source: 'JAINA (Federation of Jain Associations)',
        url: 'https://www.jaina.org/page/Mahavir',
        blurb:
          'A community source on Mahavir’s life and the five great vows.',
      },
      {
        kind: 'site',
        title: 'Ahimsa in Jainism',
        source: 'Wikipedia',
        url: 'https://en.wikipedia.org/wiki/Ahimsa_in_Jainism',
        blurb:
          'Well-cited explanation of non-violence across thought, speech, action and lifestyle.',
      },
      {
        kind: 'site',
        title: 'Anekantavada',
        source: 'Wikipedia',
        url: 'https://en.wikipedia.org/wiki/Anekantavada',
        blurb:
          'The doctrine of many-sidedness, including the blind-men-and-the-elephant analogy.',
      },
      {
        kind: 'site',
        title: 'Jainism & Ecology',
        source: 'Yale Forum on Religion and Ecology',
        url: 'https://fore.yale.edu/World-Religions/Jainism',
        blurb:
          'Essays connecting Jain non-violence to environmental responsibility.',
      },
      {
        kind: 'site',
        title: 'Jain video library',
        source: 'JAINA',
        url: 'https://www.jaina.org/page/Religiousvideos',
        blurb:
          'A curated collection of Jain documentaries, talks and animated stories.',
      },
    ],
  },
];
