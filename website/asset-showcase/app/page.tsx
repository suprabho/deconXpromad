import { assetsForOption, concepts, countForOption } from '@/lib/assets';
import type { ShowcaseConcept, SvgAsset } from '@/lib/assets';

function SvgCard({ asset, animated = false }: { asset: SvgAsset; animated?: boolean }) {
  const stageClass = [
    'asset-stage',
    asset.dark ? 'is-dark' : '',
    asset.fit === 'wide' ? 'is-wide' : '',
    animated ? 'is-animated' : '',
  ]
    .filter(Boolean)
    .join(' ');
  return (
    <figure className="asset-card">
      <div className={stageClass}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={asset.src} alt={asset.name} loading="lazy" />
      </div>
      <figcaption>
        <div className="asset-cap-head">
          <b className="mono">{asset.name}</b>
          <span className="asset-where">{asset.usedIn}</span>
        </div>
        <p>{asset.note}</p>
      </figcaption>
    </figure>
  );
}

/** A labelled block of one asset kind inside a concept section. */
function AssetGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="asset-group">
      <h4 className="asset-group-head">{label}</h4>
      {children}
    </div>
  );
}

function ConceptSection({ concept }: { concept: ShowcaseConcept }) {
  const { aura, images, logos, icons, illustrations, inline } = assetsForOption(concept.option);
  const count = countForOption(concept.option);

  return (
    <section className="doc-sec concept-sec" id={concept.slug}>
      <h3>
        <span className="idx">Option {concept.option}</span> {concept.name}
      </h3>
      <p className="concept-tagline">{concept.tagline}</p>
      <p className="concept-count mono">
        {count === 0 ? 'No exported assets' : `${count} asset${count === 1 ? '' : 's'}`}
      </p>

      {count === 0 && (
        <p className="concept-empty">
          Command is fully generated at runtime — the dot-matrix map, scan sweep, and chain-of-custody
          board are drawn in canvas and CSS, so it ships no exported image, icon, or vector files.
        </p>
      )}

      {aura.length > 0 && (
        <AssetGroup label="Aura ambient embeds">
          <div className="aura-grid">
            {aura.map((e) => (
              <figure className="aura-card" key={e.slug}>
                <div className="aura-stage">
                  <iframe src={e.url} title={e.title} loading="lazy" aria-hidden="true" tabIndex={-1} />
                </div>
                <figcaption>
                  <div className="asset-cap-head">
                    <b>{e.title}</b>
                    <span className="asset-where">{e.usedIn}</span>
                  </div>
                  <p className="asset-url mono">/embed/{e.slug}</p>
                  <p>{e.note}</p>
                </figcaption>
              </figure>
            ))}
          </div>
        </AssetGroup>
      )}

      {images.length > 0 && (
        <AssetGroup label="Image files">
          <div className="img-grid">
            {images.map((img) => (
              <figure className="asset-card" key={img.name}>
                <div className={`asset-stage img-stage${img.dark ? ' is-dark' : ''}`}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img.src} alt={img.name} loading="lazy" />
                </div>
                <figcaption>
                  <div className="asset-cap-head">
                    <b className="mono">{img.name}</b>
                    <span className="asset-tag">
                      {img.kind} · {img.weight}
                    </span>
                  </div>
                  <span className="asset-where">{img.usedIn}</span>
                  <p>{img.note}</p>
                </figcaption>
              </figure>
            ))}
          </div>
        </AssetGroup>
      )}

      {logos.length > 0 && (
        <AssetGroup label="Brand marks — static SVG">
          <div className="logo-grid">
            {logos.map((a) => (
              <SvgCard asset={a} key={a.name} />
            ))}
          </div>
        </AssetGroup>
      )}

      {icons.length > 0 && (
        <AssetGroup label="Capability icons — static SVG">
          <div className="icon-grid">
            {icons.map((a) => (
              <SvgCard asset={a} key={a.name} />
            ))}
          </div>
        </AssetGroup>
      )}

      {illustrations.length > 0 && (
        <AssetGroup label="Living illustration — animated SVG">
          {illustrations.map((a) => (
            <SvgCard asset={a} animated key={a.name} />
          ))}
        </AssetGroup>
      )}

      {inline.length > 0 && (
        <AssetGroup label={`In-prototype inline SVG — ${inline.length} extracted`}>
          <div className="inline-grid">
            {inline.map((a) => (
              <SvgCard asset={a} key={a.name} />
            ))}
          </div>
        </AssetGroup>
      )}
    </section>
  );
}

export default function Home() {
  return (
    <main className="container">
      <header className="detail-head">
        <div>
          <span className="eyebrow">Asset Library</span>
          <h1>
            Assets by <em>Option</em>
          </h1>
          <p className="tagline">
            Every embed, image, and vector created for the Deconflict homepage exploration, gathered
            on one page and sorted by the design option that consumes it — Option A (The Dossier),
            Option B (Signal Path), and Option C (Command).
          </p>
        </div>
      </header>

      <div className="facts">
        {concepts.map((c) => (
          <div className="fact" key={c.option}>
            <span className="label">
              Option {c.option} · {c.name}
            </span>
            <b>
              {countForOption(c.option)} asset{countForOption(c.option) === 1 ? '' : 's'}
            </b>
            <p>{c.tagline}</p>
          </div>
        ))}
      </div>

      {concepts.map((c) => (
        <ConceptSection concept={c} key={c.option} />
      ))}
    </main>
  );
}
