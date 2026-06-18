import type { Metadata } from 'next';
import { Inter, IBM_Plex_Mono, Source_Serif_4 } from 'next/font/google';
import './globals.css';

// --font-serif / --font-sans / --font-mono back the Tailwind `font-serif` /
// `font-sans` / `font-mono` families. Loading them here means both the editor
// preview and the headless /render route resolve `document.fonts.ready` before
// a screenshot is taken.
const sans = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans',
  display: 'swap',
});

// Institutional serif for display headings and the wordmark (per the brand guide).
const serif = Source_Serif_4({
  subsets: ['latin'],
  weight: ['400', '600'],
  variable: '--font-serif',
  display: 'swap',
});

const mono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Deconflict — Visual Studio',
  description:
    'Compose visuals from Aura backgrounds, images, SVGs and Deconflict UI components, then export a PNG/WebP.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable} ${mono.variable}`}>
      <body className="font-sans text-ink antialiased">{children}</body>
    </html>
  );
}
