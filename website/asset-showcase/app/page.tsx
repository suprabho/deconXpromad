import {
  auraEmbeds,
  iconAssets,
  illustrationAssets,
  imageAssets,
  logoAssets,
} from '@/lib/assets';
import type { SvgAsset } from '@/lib/assets';

const totals = {
  aura: auraEmbeds.length,
  images: imageAssets.length,
  svg: logoAssets.length + iconAssets.length + illustrationAssets.length,
};

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

export default function Home() {
  return (
    <main className="container">
      <header className="detail-head">
        <div>
          <span className="eyebrow">Asset Library</span>
          <h1>
            Visual <em>Asset Showcase</em>
          </h1>
          <p className="tagline">
            Every embed, image, and vector created for the Deconflict homepage exploration, gathered
            on one page — a standalone library, independent of the prototypes that consume them.
            Ambient Aura backdrops, raster scene plates, brand marks, capability icons, and the
            living illustration.
          </p>
        </div>
      </header>

      <div className="facts">
        <div className="fact">
          <span className="label">Aura embeds</span>
          <b>{totals.aura} ambient backdrops</b>
          <p>Live iframe fields from aura.promad.design</p>
        </div>
        <div className="fact">
          <span className="label">Image files</span>
          <b>{totals.images} raster plates</b>
          <p>PNG / JPG scene and product backgrounds</p>
        </div>
        <div className="fact">
          <span className="label">SVG set</span>
          <b>{totals.svg} vectors</b>
          <p>Marks, capability icons, animated illustration</p>
        </div>
      </div>

      {/* ---------- 01 aura embeds ---------- */}
      <section className="doc-sec" id="aura">
        <h3>
          <span className="idx">01</span> Aura ambient embeds
        </h3>
        <p style={{ marginBottom: 28 }}>
          Three ambient backdrops are embedded live from <span className="mono">aura.promad.design</span>{' '}
          as <code>&lt;iframe&gt;</code> fields behind Concept B. They render below the foreground
          canvas and content, are marked <code>aria-hidden</code>, and stay out of the tab order.
          Previews below load the real embeds.
        </p>
        <div className="aura-grid">
          {auraEmbeds.map((e) => (
            <figure className="aura-card" key={e.slug}>
              <div className="aura-stage">
                <iframe
                  src={e.url}
                  title={e.title}
                  loading="lazy"
                  aria-hidden="true"
                  tabIndex={-1}
                />
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
      </section>

      {/* ---------- 02 images ---------- */}
      <section className="doc-sec" id="images">
        <h3>
          <span className="idx">02</span> Image files
        </h3>
        <p style={{ marginBottom: 28 }}>
          Raster plates from the prototype set — engraving fields and product renders too
          photographic for vector. Shown here at fit.
        </p>
        <div className="img-grid">
          {imageAssets.map((img) => (
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
      </section>

      {/* ---------- 03 logos ---------- */}
      <section className="doc-sec" id="logos">
        <h3>
          <span className="idx">03</span> Brand marks — static SVG
        </h3>
        <p style={{ marginBottom: 28 }}>
          The logomark and wordmark lockups in their colour variants. All resolution-independent
          vectors; the cream variant sits on a navy mat to show its reversed treatment.
        </p>
        <div className="logo-grid">
          {logoAssets.map((a) => (
            <SvgCard asset={a} key={a.name} />
          ))}
        </div>
      </section>

      {/* ---------- 04 icons ---------- */}
      <section className="doc-sec" id="icons">
        <h3>
          <span className="idx">04</span> Capability icons — static SVG
        </h3>
        <p style={{ marginBottom: 28 }}>
          Seven line-art glyphs for the capability set, drawn light-on-dark with cobalt gradient
          accents. Previewed on navy, the way they appear on the platform map.
        </p>
        <div className="icon-grid">
          {iconAssets.map((a) => (
            <SvgCard asset={a} key={a.name} />
          ))}
        </div>
      </section>

      {/* ---------- 05 illustration ---------- */}
      <section className="doc-sec" id="illustration">
        <h3>
          <span className="idx">05</span> Living illustration — animated SVG
        </h3>
        <p style={{ marginBottom: 28 }}>
          The narrative centrepiece of Concept B. Static here as a vector, but animated in the
          prototype — a packet travels the alerts→context path and the alert nodes flicker. The
          preview drifts gently to hint at that motion; it pauses under{' '}
          <span className="mono">prefers-reduced-motion</span>.
        </p>
        {illustrationAssets.map((a) => (
          <SvgCard asset={a} animated key={a.name} />
        ))}
      </section>
    </main>
  );
}
