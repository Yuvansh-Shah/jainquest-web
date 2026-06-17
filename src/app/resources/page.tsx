'use client';

import Link from 'next/link';
import { resourceSections } from '@/lib/domain/content/resources';
import { MagicCard } from '@/components/magic-card';
import { useT } from '@/state/language';

export default function ResourcesPage() {
  const t = useT();
  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-3xl font-extrabold">{t('res.title')}</h1>
        <p className="mt-1 text-muted">{t('res.subtitle')}</p>
      </section>

      <MagicCard className="block rounded-[1.25rem]" particleCount={14}>
        <Link
          href="/resources/read"
          className="card flex items-center gap-5 p-6 transition hover:border-primary"
        >
          <div className="flex-1">
            <p className="text-lg font-extrabold">Fundamentals of Jainism</p>
            <p className="text-sm text-muted">{t('res.readerDesc')}</p>
          </div>
          <span className="font-bold text-primary">{t('res.read')} →</span>
        </Link>
      </MagicCard>

      {resourceSections.map((section) => (
        <section key={section.title}>
          <h2 className="text-xl font-extrabold">{section.title}</h2>
          <p className="mb-4 mt-1 text-sm text-muted">
            {section.description}
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {section.items.map((item) => (
              <MagicCard
                key={item.url}
                className="rounded-xl"
                enableStars={false}
                enableMagnetism={false}
              >
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-full flex-col gap-2 rounded-xl border border-border bg-surface p-4 transition hover:border-primary"
                >
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-surface-2 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-muted">
                      {item.kind === 'video'
                        ? t('res.video')
                        : t('res.website')}
                    </span>
                    <span className="text-xs text-muted">{item.source}</span>
                  </div>
                  <p className="font-bold leading-snug">{item.title}</p>
                  <p className="text-sm text-muted">{item.blurb}</p>
                  <span className="mt-auto pt-1 text-xs font-bold text-primary">
                    {t('common.open')} →
                  </span>
                </a>
              </MagicCard>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
