'use client';

import { useState } from 'react';
import { useLang } from '@/state/language';
import { LANGS } from '@/lib/i18n';
import DecryptedText from '@/components/decrypted-text';
import ScrollStack, { ScrollStackItem } from '@/components/scroll-stack';
import { MagicCard, SpotlightLayer } from '@/components/magic-card';

export function Landing({
  onEnter,
  authed,
  displayName,
}: {
  onEnter: () => void;
  authed: boolean;
  displayName?: string | null;
}) {
  const { t, lang, setLang } = useLang();

  return (
    <div className="mx-auto flex min-h-screen max-w-5xl flex-col px-6 py-6">
      <SpotlightLayer spotlightRadius={280} />
      <header className="flex items-center justify-between">
        <span className="font-display text-2xl font-semibold tracking-tight">
          Jain<span className="text-primary">Quest</span>
        </span>
        <MagicCard className="rounded-full border border-border bg-surface p-1" enableStars={false} enableTilt={false} enableMagnetism>
          <div className="flex gap-1">
            {LANGS.map((l) => (
              <button
                key={l.code}
                type="button"
                onClick={() => setLang(l.code)}
                className={`rounded-full px-3 py-1 text-xs font-bold transition ${
                  lang === l.code
                    ? 'bg-primary text-white'
                    : 'text-muted hover:text-foreground'
                }`}
              >
                {l.code.toUpperCase()}
              </button>
            ))}
          </div>
        </MagicCard>
      </header>

      <main className="flex flex-1 flex-col py-16">
        <HeroTitle />
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">
          {authed
            ? t('landing.welcomeBack', {
                name: displayName ? `, ${displayName}` : '',
              })
            : t('landing.subtitle')}
        </p>
        <div className="mt-9 flex flex-wrap items-center gap-4">
          {authed ? (
            <MagicCard className="rounded-full" enableTilt={false} enableMagnetism>
              <button
                type="button"
                onClick={onEnter}
                className="rounded-full bg-primary px-8 py-3.5 font-bold text-white transition hover:bg-primary-strong"
              >
                {t('landing.continue')}
              </button>
            </MagicCard>
          ) : (
            <>
              <MagicCard className="rounded-full" enableTilt={false} enableMagnetism>
                <button
                  type="button"
                  onClick={onEnter}
                  className="rounded-full bg-primary px-8 py-3.5 font-bold text-white transition hover:bg-primary-strong"
                >
                  {t('landing.cta')}
                </button>
              </MagicCard>
              <MagicCard className="rounded-full" enableTilt={false} enableMagnetism>
                <button
                  type="button"
                  onClick={onEnter}
                  className="rounded-full border border-border px-6 py-3.5 font-bold text-foreground transition hover:border-primary"
                >
                  {t('landing.login')}
                </button>
              </MagicCard>
            </>
          )}
        </div>

        <JainTimeline />
      </main>

      <footer className="py-4 text-xs text-muted">
        {t('auth.syncNote')}
      </footer>
    </div>
  );
}

// Hero shows "Ahimsa" at rest; hovering scrambles/decrypts it into the
// phrase "the belief in non-violence" (re-mounts DecryptedText so its
// in-view decrypt animation replays on every hover).
function HeroTitle() {
  const { t } = useLang();
  const [hover, setHover] = useState(false);
  const [interacted, setInteracted] = useState(false);
  const word = t('hero.word');
  const phrase = t('hero.phrase');

  const decrypt = (
    size: string,
    value: string,
    k: string,
    dir: 'start' | 'end',
  ) => (
    <span className={size}>
      <DecryptedText
        key={k}
        text={value}
        animateOn="view"
        sequential
        speed={42}
        revealDirection={dir}
        useOriginalCharsOnly
        parentClassName="inline-block"
        className="text-foreground"
        encryptedClassName="text-primary/70"
      />
    </span>
  );

  return (
    <h1
      onMouseEnter={() => {
        setHover(true);
        setInteracted(true);
      }}
      onMouseLeave={() => setHover(false)}
      className="mt-4 flex min-h-[3.75rem] max-w-3xl cursor-default items-center font-display font-semibold leading-none sm:min-h-[4.5rem]"
    >
      {hover
        ? // Ahimsa -> phrase: reveal left-to-right
          decrypt('text-2xl sm:text-3xl', phrase, `p:${phrase}`, 'start')
        : interacted
          ? // phrase -> Ahimsa: reveal right-to-left (longer to shorter)
            decrypt('text-5xl sm:text-6xl', word, `w:${word}`, 'end')
          : <span className="text-5xl sm:text-6xl">{word}</span>}
    </h1>
  );
}

// Content stays in English (history, like lesson content). Earlier dates are
// the traditional ones; only Parshvanatha and Mahavira are historically
// datable.
const TIMELINE: { year: string; title: string; text: string }[] = [
  {
    year: 'Prehistory',
    title: 'Rishabhanatha (Adinatha)',
    text: 'The first of the 24 Tirthankaras. Jain tradition regards him as the one who established dharma in the present cosmic cycle.',
  },
  {
    year: 'Cosmic history',
    title: 'The 24 Tirthankaras',
    text: '"Ford-makers" who each rediscover and reveal the path to liberation. Twenty-two belong to traditional history before the historical era.',
  },
  {
    year: 'c. 9th–8th century BCE',
    title: 'Parshvanatha · 23rd Tirthankara',
    text: 'Widely regarded by historians as a real person (traditionally 877–777 BCE). Taught a fourfold restraint that Mahavira later expanded.',
  },
  {
    year: '599 BCE',
    title: 'Mahavira is born',
    text: 'Vardhamana, the 24th and final Tirthankara of this cycle, is born into a Kshatriya family in present-day Bihar.',
  },
  {
    year: 'c. 569 BCE',
    title: 'The Great Renunciation',
    text: 'At about thirty, Mahavira gives up his princely life to become a wandering ascetic.',
  },
  {
    year: 'c. 557 BCE',
    title: 'Enlightenment (Kevala Jnana)',
    text: 'After roughly twelve years of meditation and austerity he attains omniscience and becomes a Jina — a conqueror of the inner self.',
  },
  {
    year: '527 BCE',
    title: 'Nirvana at Pavapuri',
    text: "Mahavira's liberation. Year zero of the Vira Nirvana Samvat, the traditional Jain calendar era.",
  },
  {
    year: 'c. 300 BCE',
    title: 'Preserving the teachings',
    text: 'A council at Pataliputra under Sthulabhadra works to preserve the Agamas; Acharya Bhadrabahu leads a migration south (with, by Digambara tradition, Emperor Chandragupta Maurya).',
  },
  {
    year: '1st–2nd century CE',
    title: 'Two great traditions',
    text: 'The Digambara and Svetambara branches take distinct form. Acharya Kundakunda composes foundational Digambara texts.',
  },
  {
    year: '453 / 466 CE',
    title: 'The canon is written down',
    text: 'The Council of Valabhi commits the Svetambara Agamas to writing, securing the scriptures.',
  },
  {
    year: '11th–13th century CE',
    title: 'A golden age of art',
    text: 'Marble masterpieces such as the Dilwara and Ranakpur temples are built; Acharya Hemachandra (1089–1172) shapes Jain scholarship in Gujarat.',
  },
  {
    year: 'Today',
    title: 'A living tradition',
    text: 'Several million Jains worldwide continue Ahimsa, Anekantavada and Aparigraha — principles that also shaped Mahatma Gandhi.',
  },
];

function JainTimeline() {
  const { t } = useLang();
  return (
    <section className="mt-20">
      <h2 className="font-display text-3xl font-semibold">
        {t('landing.timelineTitle')}
      </h2>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
        {t('landing.timelineNote')}
      </p>
      <div className="mt-8">
        <ScrollStack useWindowScroll>
          {TIMELINE.map((e) => (
            <ScrollStackItem
              key={e.title}
              itemClassName="border border-border bg-surface backdrop-blur-xl"
            >
              <MagicCard
                className="flex flex-col justify-center min-h-[14rem] p-8 w-full rounded-3xl"
                enableTilt={false}
                enableMagnetism
              >
                <p className="text-sm font-bold uppercase tracking-[0.16em] text-primary">
                  {e.year}
                </p>
                <p className="mt-3 font-display text-3xl font-semibold leading-tight">
                  {e.title}
                </p>
                <p className="mt-3 max-w-2xl leading-relaxed text-muted">
                  {e.text}
                </p>
              </MagicCard>
            </ScrollStackItem>
          ))}
        </ScrollStack>
      </div>
    </section>
  );
}
