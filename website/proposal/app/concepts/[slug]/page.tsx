import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { CSSProperties } from 'react';
import PreviewFrame from '@/components/PreviewFrame';
import { conceptPalettes, concepts, getConcept, sharedPalette, typeScales } from '@/lib/concepts';

export function generateStaticParams() {
  return concepts.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const concept = getConcept(slug);
  if (!concept) return {};
  return {
    title: `Concept ${concept.letter} · ${concept.name} — Deconflict Design Proposal`,
    description: concept.tagline,
  };
}

export default async function ConceptPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const concept = getConcept(slug);
  if (!concept) notFound();

  const index = concepts.findIndex((c) => c.slug === concept.slug);
  const prev = concepts[index - 1];
  const next = concepts[index + 1];

  return (
    <main className="container">
      <div className="crumbs">
        <Link href="/">Proposal</Link> <span>/</span>
        <span>
          Concept {concept.letter} · {concept.name}
        </span>
      </div>

      <header className="detail-head">
        <div>
          <span className="eyebrow">Concept {concept.letter}</span>
          <h1>{concept.name}</h1>
          <p className="tagline">{concept.tagline}</p>
          <p className="detail-meta">
            Metaphor — <b>{concept.metaphor}</b>
          </p>
        </div>
        <a className="btn" href={concept.file} target="_blank" rel="noopener">
          Open prototype full screen ↗
        </a>
      </header>

      {/* live preview */}
      <PreviewFrame src={concept.file} title={`${concept.name} live preview`} />

      {/* at a glance */}
      <div className="facts">
        {concept.typefaces.map((t) => (
          <div className="fact" key={t.role}>
            <span className="label">{t.role}</span>
            <b>{t.family}</b>
            <p>{t.usage}</p>
          </div>
        ))}
      </div>

      <section className="doc-sec">
        <h3>
          <span className="idx">01</span> Design rationale
        </h3>
        <div className="prose">
          <p>{concept.summary}</p>
          {concept.rationale.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </section>

      <section className="doc-sec">
        <h3>
          <span className="idx">02</span> Signature elements
        </h3>
        <div className="sig-list">
          {concept.signatureElements.map((el) => (
            <div className="sig-row" key={el.name}>
              <b>{el.name}</b>
              <p>{el.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="doc-sec">
        <h3>
          <span className="idx">03</span> Section anatomy
        </h3>
        <table className="type-table">
          <thead>
            <tr>
              <th>Section</th>
              <th>Role</th>
              <th>Treatment in this concept</th>
            </tr>
          </thead>
          <tbody>
            {concept.anatomy.map((s) => (
              <tr key={s.id}>
                <td>{s.id}</td>
                <td>{s.title}</td>
                <td>{s.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="doc-sec">
        <h3>
          <span className="idx">04</span> Type in use
        </h3>
        <div className="spec-block">
          {typeScales[concept.slug].map((row) => (
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
        <p style={{ marginTop: 16 }}>
          Full specimens for all seven families, plus the contrast audit, live in the{' '}
          <Link href="/foundations/" style={{ color: 'var(--cobalt)', fontWeight: 600 }}>
            Color &amp; Typography documentation
          </Link>
          .
        </p>
      </section>

      <section className="doc-sec">
        <h3>
          <span className="idx">05</span> Color
        </h3>
        <p style={{ marginBottom: 24 }}>{concept.colorNotes}</p>
        <div className="tokens-grid">
          {[...sharedPalette.map((s) => ({ token: s.token, value: s.hex, role: s.role })), ...conceptPalettes[concept.slug]].map(
            (t) => (
              <div className="token-card" key={t.token}>
                <div className="field" style={{ background: t.value }} />
                <div className="info">
                  <b>{t.token}</b>
                  <span className="hex">{t.value}</span>
                  <span>{t.role}</span>
                </div>
              </div>
            ),
          )}
        </div>
      </section>

      <section className="doc-sec">
        <h3>
          <span className="idx">06</span> Motion &amp; accessibility
        </h3>
        <div className="prose">
          <p>{concept.motion}</p>
        </div>
        <div style={{ height: 18 }} />
        <div className="note-band">
          <span className="mono">Accessibility</span>
          <p>{concept.accessibility}</p>
        </div>
      </section>

      <section className="doc-sec">
        <h3>
          <span className="idx">07</span> When to choose this direction
        </h3>
        <div className="verdict">
          <div className="pro">
            <span className="label">Best for</span>
            <p>{concept.bestFor}</p>
          </div>
          <div className="con">
            <span className="label">Trade-offs</span>
            <p>{concept.tradeoffs}</p>
          </div>
        </div>
      </section>

      <nav className="pager">
        {prev ? (
          <Link href={`/concepts/${prev.slug}/`}>
            <span className="dir">← Previous</span>
            <b>
              Concept {prev.letter} · {prev.name}
            </b>
          </Link>
        ) : (
          <span className="empty" />
        )}
        {next ? (
          <Link className="next" href={`/concepts/${next.slug}/`}>
            <span className="dir">Next →</span>
            <b>
              Concept {next.letter} · {next.name}
            </b>
          </Link>
        ) : (
          <span className="empty" />
        )}
      </nav>
    </main>
  );
}
