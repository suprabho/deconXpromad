import Link from 'next/link';
import type { CSSProperties } from 'react';
import {
  concepts,
  conceptPalettes,
  contrastTable,
  families,
  sharedPalette,
  typeScales,
  usageRules,
} from '@/lib/concepts';

export const metadata = {
  title: 'Color & Typography — Deconflict Design Proposal',
  description:
    'Full color and typography documentation for the three Deconflict homepage concepts: typeface specimens, type scales, color tokens, contrast audit, and usage rules.',
};

const gradeClass: Record<string, string> = {
  AAA: 'aaa',
  AA: 'aa',
  'AA Large': 'aa-large',
  Decorative: 'deco',
};

export default function FoundationsPage() {
  return (
    <main className="container">
      <div className="crumbs">
        <Link href="/">Proposal</Link> <span>/</span> <span>Color &amp; Typography</span>
      </div>

      <header className="detail-head">
        <div>
          <span className="eyebrow">Foundations</span>
          <h1>
            Color &amp; <em>Typography</em>
          </h1>
          <p className="tagline">
            The complete visual vocabulary behind the three concepts — seven typefaces, eight shared
            color tokens, and the measured contrast figures that make the system examiner-ready.
          </p>
        </div>
      </header>

      {/* ---------- 01 typefaces ---------- */}
      <section className="doc-sec">
        <h3>
          <span className="idx">01</span> Typefaces
        </h3>
        <p style={{ marginBottom: 28 }}>
          Seven families appear across the set, but each concept commits to exactly three roles —
          one display, one body, one mono. All are Google Fonts, loaded with two to four weights.
        </p>
        <div className="family-grid">
          {families.map((f) => (
            <div className="family-card" key={f.name}>
              <span className="aa" style={{ fontFamily: f.css } as CSSProperties}>
                Aa
              </span>
              <span className="name">{f.name}</span>
              <span className="meta">
                {f.classification} · {f.role}
              </span>
              <span className="weights">Weights {f.weights}</span>
              <p className="alphabet" style={{ fontFamily: f.css } as CSSProperties}>
                ABCDEFGHIJKLMNOPQRSTUVWXYZ abcdefghijklmnopqrstuvwxyz 0123456789
              </p>
              <p className="note">{f.note}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- 02 type scales ---------- */}
      <section className="doc-sec">
        <h3>
          <span className="idx">02</span> Type scales — live specimens
        </h3>
        <p style={{ marginBottom: 28 }}>
          Each row renders in the real webfont at (or proportionally near) production size; the spec
          column records the exact values used in the prototypes, including the responsive clamp()
          ranges.
        </p>
        {concepts.map((c) => (
          <div className="spec-block" key={c.slug}>
            <div className="spec-block-head">
              <b>
                Concept {c.letter} · {c.name}
              </b>
              <span className="stack">
                {c.typefaces.map((t) => t.family.split(' (')[0].replace(/ \d.*$/, '')).join(' + ')}
              </span>
            </div>
            {typeScales[c.slug].map((row) => (
              <div className="spec-row" key={row.label}>
                <div className="spec-meta">
                  <b>{row.label}</b>
                  <p>{row.spec}</p>
                </div>
                <div className="sample" style={row.style as CSSProperties}>
                  {row.sample}
                </div>
              </div>
            ))}
          </div>
        ))}
      </section>

      {/* ---------- 03 color tokens ---------- */}
      <section className="doc-sec">
        <h3>
          <span className="idx">03</span> Color tokens
        </h3>
        <p style={{ marginBottom: 28 }}>
          Eight shared tokens form the base system — every concept ships on the same palette, so
          directions can be swapped (or hybridised) without re-tokenising. Concepts then extend the
          base with a small number of purpose-built values.
        </p>
        <div className="tokens-grid">
          {sharedPalette.map((s) => (
            <div className="token-card" key={s.token}>
              <div className="field" style={{ background: s.hex }} />
              <div className="info">
                <b>{s.token}</b>
                <span className="hex">{s.hex}</span>
                <span>{s.role}</span>
              </div>
            </div>
          ))}
        </div>

        {concepts.map((c) => (
          <div className="ext-block" key={c.slug}>
            <h4>
              <span className="mono">Concept {c.letter}</span>
              {c.name} — extensions &amp; deployment
            </h4>
            <div className="tokens-grid">
              {conceptPalettes[c.slug].map((t) => (
                <div className="token-card" key={t.token}>
                  <div className="field" style={{ background: t.value }} />
                  <div className="info">
                    <b>{t.token}</b>
                    <span className="hex">{t.value}</span>
                    <span>{t.role}</span>
                  </div>
                </div>
              ))}
            </div>
            <p style={{ marginTop: 16, fontSize: 13.5, color: 'var(--muted)', lineHeight: 1.7, maxWidth: 760 }}>
              {c.colorNotes}
            </p>
          </div>
        ))}
      </section>

      {/* ---------- 04 contrast ---------- */}
      <section className="doc-sec">
        <h3>
          <span className="idx">04</span> Contrast audit
        </h3>
        <p style={{ marginBottom: 28 }}>
          Measured WCAG 2.1 ratios for every text pairing the prototypes use. Thresholds: 7&nbsp;:&nbsp;1
          AAA, 4.5&nbsp;:&nbsp;1 AA, 3&nbsp;:&nbsp;1 AA for large text (≥18px or 14px bold).
        </p>
        <table className="contrast-table">
          <thead>
            <tr>
              <th>Pairing</th>
              <th>Ratio</th>
              <th>Grade</th>
              <th>Used for</th>
            </tr>
          </thead>
          <tbody>
            {contrastTable.map((row) => (
              <tr key={row.pair}>
                <td>
                  <span className="pair-cell">
                    <span className="pair-chip" style={{ background: row.bg, color: row.fg }}>
                      Aa
                    </span>
                    {row.pair}
                  </span>
                </td>
                <td className="ratio">{row.ratio}</td>
                <td>
                  <span className={`grade ${gradeClass[row.grade]}`}>{row.grade}</span>
                </td>
                <td className="usage">{row.usage}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ height: 20 }} />
        <div className="note-band">
          <span className="mono">Refinement note</span>
          <p>
            Muted (#6B7A99) measures 4.31&nbsp;:&nbsp;1 — fine for large text but a hair under the
            4.5&nbsp;:&nbsp;1 bar at body sizes. If strict AA at 14–16px is a launch requirement,
            darken it to ≈#62718F (4.5+) — visually indistinguishable. Subtle (#B0B8CC) is
            decorative only (hairline art, guilloché) and intentionally never carries copy.
          </p>
        </div>
      </section>

      {/* ---------- 05 usage rules ---------- */}
      <section className="doc-sec">
        <h3>
          <span className="idx">05</span> Usage rules
        </h3>
        <div className="rules-grid">
          <div className="rules-col">
            <span className="label">Color</span>
            <ul>
              {usageRules.color.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          </div>
          <div className="rules-col">
            <span className="label">Typography</span>
            <ul>
              {usageRules.type.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <nav className="pager">
        <Link href="/">
          <span className="dir">← Back</span>
          <b>Proposal overview</b>
        </Link>
        <Link className="next" href={`/concepts/${concepts[0].slug}/`}>
          <span className="dir">Concepts →</span>
          <b>
            Concept {concepts[0].letter} · {concepts[0].name}
          </b>
        </Link>
      </nav>
    </main>
  );
}
