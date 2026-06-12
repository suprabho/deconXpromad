import Link from 'next/link';
import { concepts, comparison, sharedArchitecture, sharedPalette } from '@/lib/concepts';

export default function Home() {
  return (
    <main>
      {/* ---------- intro ---------- */}
      <header className="hero container">
        <span className="eyebrow">Homepage Design Proposal</span>
        <h1>
          Three directions for the <em>Deconflict</em> homepage
        </h1>
        <p className="lede">
          All three concepts carry the <b>same content architecture, copy, and palette</b> — what
          changes is the register: how much authority, warmth, and operational tension the brand
          projects. Each is a fully working, responsive, single-file prototype you can open and
          scroll right here.
        </p>
        <div className="hero-facts">
          <div>
            <b>3 working prototypes</b>Live &amp; scrollable
          </div>
          <div>
            <b>1 shared system</b>Palette · copy · sections
          </div>
          <div>
            <b>Reduced-motion safe</b>All concepts
          </div>
        </div>
      </header>

      {/* ---------- concepts ---------- */}
      <section className="sec">
        <div className="container">
          <div className="sec-head">
            <span className="sec-index">[ 01 — The Concepts ]</span>
            <h2>
              Pick a <em>register</em>, not just a layout
            </h2>
          </div>

          {concepts.map((c) => (
            <article className="concept-card" key={c.slug}>
              <a className="concept-thumb" href={c.file} target="_blank" rel="noopener">
                <iframe src={c.file} title={`${c.name} preview`} tabIndex={-1} loading="lazy" />
                <span className="open-hint">Open full screen ↗</span>
              </a>
              <div className="concept-body">
                <span className="concept-kicker">Concept {c.letter} · {c.metaphor}</span>
                <h3>{c.name}</h3>
                <p className="tag">{c.tagline}</p>
                <p className="summary">{c.summary.split('. ').slice(0, 2).join('. ') + '.'}</p>
                <div className="concept-actions">
                  <Link className="btn" href={`/concepts/${c.slug}/`}>
                    Read the documentation
                  </Link>
                  <a className="btn btn-ghost" href={c.file} target="_blank" rel="noopener">
                    Open prototype ↗
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ---------- comparison ---------- */}
      <section className="sec">
        <div className="container">
          <div className="sec-head">
            <span className="sec-index">[ 02 — Side by Side ]</span>
            <h2>
              How the three directions <em>differ</em>
            </h2>
          </div>
          <table className="matrix">
            <thead>
              <tr>
                <th></th>
                <th>A · The Dossier</th>
                <th>B · Signal Path</th>
                <th>C · Command</th>
              </tr>
            </thead>
            <tbody>
              {comparison.map((row) => (
                <tr key={row.dimension}>
                  <td>{row.dimension}</td>
                  {row.values.map((v, i) => (
                    <td key={i}>{v}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ---------- shared foundations ---------- */}
      <section className="sec">
        <div className="container">
          <div className="sec-head">
            <span className="sec-index">[ 03 — Shared Foundations ]</span>
            <h2>
              One system underneath <em>all three</em>
            </h2>
          </div>
          <div className="found-grid">
            <div>
              <p className="lede" style={{ fontSize: 14.5, marginBottom: 22 }}>
                Every concept uses the same eight design tokens, so any direction (or a hybrid) ships
                on the same palette.
              </p>
              <div className="swatches">
                {sharedPalette.map((s) => (
                  <div className="swatch" key={s.token}>
                    <span className="chip" style={{ background: s.hex }} />
                    <div>
                      <b>
                        {s.token} · {s.hex}
                      </b>
                      <span>{s.role}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="lede" style={{ fontSize: 14.5, marginBottom: 22 }}>
                The page structure is identical across concepts — six sections, same copy — so the
                comparison isolates pure art direction.
              </p>
              <div className="arch-list">
                {sharedArchitecture.map((s) => (
                  <div className="arch-row" key={s.id}>
                    <span className="id">{s.id}</span>
                    <b>{s.title}</b>
                    <p>{s.note}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
