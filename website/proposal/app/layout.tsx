import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';

export const metadata: Metadata = {
  title: 'Deconflict — Homepage Design Proposal',
  description:
    'Three homepage design directions for Deconflict — The Dossier, Signal Path, and Command — published and documented as an interactive proposal.',
};

function Mark() {
  return (
    <svg width="20" height="20" viewBox="0 0 22 22" fill="none" aria-hidden="true">
      <path d="M11 1.5 20 6.7v8.6L11 20.5 2 15.3V6.7L11 1.5Z" stroke="#0D1B3E" strokeWidth="1.4" />
      <path d="M11 6 15.5 8.6v5.2L11 16.4 6.5 13.8V8.6L11 6Z" fill="#1A56DB" />
    </svg>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <nav className="topbar">
          <div className="topbar-inner">
            <Link className="brand" href="/">
              <Mark />
              DECONFLICT <span className="sep">/</span> <span className="ctx">Design Proposal</span>
            </Link>
            <div className="topbar-links">
              <Link href="/concepts/concept-a-dossier/">A · The Dossier</Link>
              <Link href="/concepts/concept-b-signal-path/">B · Signal Path</Link>
              <Link href="/concepts/concept-c-command/">C · Command</Link>
              <Link href="/foundations/">Color &amp; Type</Link>
            </div>
          </div>
        </nav>
        {children}
        <footer className="site-footer">
          <div className="container">
            <span className="mono">Prepared by Promad · June 2026</span>
            <span>Deconflict homepage — design exploration, three directions</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
