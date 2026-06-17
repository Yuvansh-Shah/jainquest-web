import type { Metadata } from 'next';
import { Fraunces, IBM_Plex_Sans } from 'next/font/google';
import './globals.css';
import { AppProvider } from '@/state/app-context';
import { LanguageProvider } from '@/state/language';
import { AuthGate } from '@/components/auth-gate';
import Aurora from '@/components/aurora';

const fraunces = Fraunces({
  variable: '--font-fraunces',
  subsets: ['latin'],
  weight: ['400', '500', '600'],
});

const plex = IBM_Plex_Sans({
  variable: '--font-plex',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'JainQuest — Calm, modern Jain learning',
  description:
    'Gamified Jain learning for teens: focused lessons, guided reflection, and thoughtful practice.',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${plex.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      {/* Browser extensions (e.g. Bitdefender TrafficLight) inject attributes
          like `bis_register`/`__processed_*` onto <body> before React
          hydrates. suppressHydrationWarning silences that one-level,
          unavoidable attribute mismatch without hiding real ones. */}
      <body className="min-h-full" suppressHydrationWarning>
        <div
          aria-hidden
          className="app-aurora pointer-events-none fixed inset-0 z-0"
        >
          <Aurora
            colorStops={['#d48943', '#df9b5f', '#3a2b5f']}
            blend={0.55}
            amplitude={1.0}
            speed={0.4}
          />
        </div>
        <div className="relative z-10 min-h-screen">
          <LanguageProvider>
            <AppProvider>
              <AuthGate>{children}</AuthGate>
            </AppProvider>
          </LanguageProvider>
        </div>
      </body>
    </html>
  );
}
