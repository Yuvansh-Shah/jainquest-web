'use client';

import { useEffect, useRef, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useLang } from '@/state/language';
import { MagicCard } from '@/components/magic-card';

interface Msg {
  text: string;
  isUser: boolean;
}

const SUGGESTIONS = [
  'What is Jainism?',
  'Explain Ahimsa simply',
  'What is karma in Jain thought?',
  'What are the five vows?',
  'What does Aparigraha mean?',
];

function languageName(code: string): string {
  return code === 'hi' ? 'Hindi' : code === 'gu' ? 'Gujarati' : 'English';
}

function offlineAnswer(text: string): string {
  const t = text.toLowerCase();
  if (t.includes('ahimsa'))
    return 'Ahimsa means reducing harm as far as possible in thought, speech, action, and lifestyle — not just "do not hit", but gentle speech, mindful choices, and everyday compassion.';
  if (t.includes('karma'))
    return 'In Jain thought, karma is a subtle material bond that sticks to the soul because of passions like anger, pride, deceit, and greed. Calm awareness and right conduct reduce it.';
  if (t.includes('vow'))
    return 'The five core Jain vows are Ahimsa (non-violence), Satya (truthfulness), Asteya (non-stealing), Brahmacharya (self-restraint), and Aparigraha (non-attachment).';
  if (t.includes('moksha'))
    return "Moksha is the soul's complete freedom from karmic bondage and the cycle of birth and death, reached by purifying conduct and growing right vision, knowledge, and character.";
  if (t.includes('aparigraha') || t.includes('attachment'))
    return 'Aparigraha means using things without letting them own your mind: keep what is useful, notice cravings before acting, and choose gratitude over constant accumulation.';
  if (t.includes('jainism') || t.includes('jain'))
    return 'Jainism is a way of life centered on non-violence, many-sided thinking (Anekantvad), and non-attachment, aiming to purify the soul through careful thought, speech, and action.';
  return 'I could not reach the live Guru, but I can help with the basics — try asking about Jainism, Ahimsa, karma, Aparigraha, Moksha, or the five vows.';
}

export default function GuruPage() {
  const { t, lang: langCode } = useLang();
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const proxyUrlRef = useRef<string | null>(null);
  const endRef = useRef<HTMLDivElement>(null);

  const lang = languageName(langCode);

  // The Guru is powered by a server-side proxy (a Cloudflare Worker) that
  // holds the NVIDIA API key. Its public URL is read from Firestore
  // (app_config/ai -> guruProxyUrl) so it can be set without redeploying.
  useEffect(() => {
    (async () => {
      try {
        const snap = await getDoc(doc(db, 'app_config', 'ai'));
        const url = snap.exists()
          ? (snap.data().guruProxyUrl as string | undefined)
          : undefined;
        if (url) proxyUrlRef.current = url;
      } catch {
        // Leave proxyUrlRef null — send() falls back to offline answers.
      }
    })();
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || sending) return;
    setInput('');
    const history: Msg[] = [...messages, { text: trimmed, isUser: true }];
    setMessages(history);
    setSending(true);
    const offline = (): Msg => ({
      text: `The live Guru is unavailable right now, so here is a quick offline answer:\n\n${offlineAnswer(trimmed)}`,
      isUser: false,
    });
    try {
      const proxyUrl = proxyUrlRef.current;
      if (!proxyUrl) {
        setMessages((m) => [...m, offline()]);
        return;
      }
      // The Guru's persona/scope is enforced server-side (the Worker prepends
      // soul.md). The app just sends the conversation turns and the language.
      const res = await fetch(proxyUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          language: lang,
          messages: history.map((m) => ({
            role: m.isUser ? 'user' : 'assistant',
            content: m.text,
          })),
        }),
      });
      const data = (await res.json()) as { reply?: string };
      const reply = res.ok ? (data.reply ?? '').trim() : '';
      setMessages((m) => [
        ...m,
        reply ? { text: reply, isUser: false } : offline(),
      ]);
    } catch {
      setMessages((m) => [...m, offline()]);
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="flex h-[calc(100vh-9rem)] flex-col">
      <h1 className="mb-4 text-2xl font-extrabold">{t('guru.title')}</h1>

      <div className="flex-1 space-y-3 overflow-y-auto pr-1">
        <div className="max-w-[80%] rounded-2xl bg-surface-2 px-4 py-3 text-sm leading-relaxed text-foreground">
          <p className="whitespace-pre-line">{t('guru.greeting')}</p>
        </div>
        {messages.map((m, i) => (
          <div
            key={i}
            className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
              m.isUser
                ? 'ml-auto bg-primary text-white'
                : 'bg-surface-2 text-foreground'
            }`}
          >
            <p className="whitespace-pre-line">{m.text}</p>
          </div>
        ))}
        {sending && (
          <div className="max-w-[80%] rounded-2xl bg-surface-2 px-4 py-3 text-sm text-muted">
            {t('guru.thinking')}
          </div>
        )}
        <div ref={endRef} />
      </div>

      {messages.length === 0 && (
        <div className="my-3 flex flex-wrap gap-2">
          {SUGGESTIONS.map((s) => (
            <MagicCard key={s} className="rounded-full" enableStars={false} enableTilt={false} enableMagnetism>
              <button
                type="button"
                onClick={() => send(s)}
                className="rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-semibold text-muted hover:border-primary hover:text-foreground"
              >
                {s}
              </button>
            </MagicCard>
          ))}
        </div>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          void send(input);
        }}
        className="mt-3 flex gap-2"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t('guru.placeholder')}
          className="flex-1 rounded-full border border-border bg-surface-2 px-4 py-3 outline-none focus:border-primary"
        />
        <MagicCard className="rounded-full" enableTilt={false} enableMagnetism>
          <button
            type="submit"
            disabled={sending || !input.trim()}
            className="rounded-full bg-primary px-6 py-3 font-bold text-white hover:bg-primary-strong disabled:opacity-50"
          >
            {t('guru.send')}
          </button>
        </MagicCard>
      </form>
    </div>
  );
}
