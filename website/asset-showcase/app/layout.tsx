import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Deconflict — Visual Asset Showcase',
  description:
    'A standalone reference for every visual asset created for the Deconflict homepage exploration: the Aura ambient embeds, raster background images, and the static and animated SVG set.',
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
            <span className="brand">
              <Mark />
              DECONFLICT <span className="sep">/</span> <span className="ctx">Asset Showcase</span>
            </span>
            <div className="topbar-links">
              <a href="#aura">Embeds</a>
              <a href="#images">Images</a>
              <a href="#logos">Marks</a>
              <a href="#icons">Icons</a>
              <a href="#illustration">Illustration</a>
            </div>
          </div>
        </nav>
        {children}
        <footer className="site-footer">
          <div className="container">
            <span className="mono">Prepared by Promad · June 2026</span>
            <span>Deconflict homepage — visual asset library</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
