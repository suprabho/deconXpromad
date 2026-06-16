'use client';

import { useEffect, useState } from 'react';
import { assetsForOption, concepts, countForOption } from '@/lib/assets';
import type { ShowcaseConcept, SvgAsset } from '@/lib/assets';

/* ============ ASSET CARDS ============ */

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

/* ============ SECTION HEADER — editorial, oversized number ============ */

function SectionHeader({
  number,
  concept,
  count,
}: {
  number: string;
  concept: ShowcaseConcept;
  count: number;
}) {
  return (
    <div className="sec-header">
      <span className="sec-ghost">{number}</span>
      <h3>
        <span className="idx mono">Option {concept.option}</span> {concept.name}
      </h3>
      <p className="concept-tagline">{concept.tagline}</p>
      <p className="concept-count mono">
        {count === 0 ? 'No exported assets' : `${count} asset${count === 1 ? '' : 's'}`}
      </p>
    </div>
  );
}

/* ============ CONCEPT (OPTION) SECTION ============ */

function ConceptSection({ concept, number }: { concept: ShowcaseConcept; number: string }) {
  const { aura, images, icons, illustrations, inline } = assetsForOption(concept.option);
  const count = countForOption(concept.option);

  return (
    <section className="concept-sec" id={concept.slug}>
      <SectionHeader number={number} concept={concept} count={count} />

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

/* ============ PAGE ============ */

const pad = (i: number) => String(i + 1).padStart(2, '0');

export default function Home() {
  const [activeSlug, setActiveSlug] = useState(concepts[0]?.slug ?? '');

  // Sync the active tab with the URL hash so the top-bar Option links work and
  // each tab is deep-linkable / shareable.
  useEffect(() => {
    const apply = () => {
      const slug = window.location.hash.replace('#', '');
      if (concepts.some((c) => c.slug === slug)) setActiveSlug(slug);
    };
    apply();
    window.addEventListener('hashchange', apply);
    return () => window.removeEventListener('hashchange', apply);
  }, []);

  const selectTab = (slug: string) => {
    setActiveSlug(slug);
    if (window.location.hash !== `#${slug}`) {
      window.history.replaceState(null, '', `#${slug}`);
    }
  };

  const activeIndex = Math.max(0, concepts.findIndex((c) => c.slug === activeSlug));
  const active = concepts[activeIndex];

  return (
    <>
      {/* Editorial hero */}
      <header className="show-hero">
        <div className="container">
          <span className="eyebrow">Asset Library</span>
          <h1>
            Assets by <em>Option</em>
          </h1>
          <p className="tagline">
            Every embed, image, and vector created for the Deconflict homepage exploration, sorted by
            the design option that consumes it — Option A (The Dossier), Option B (Signal Path), and
            Option C (Command). Brand marks are kept out: this is the supporting illustration, icon,
            and image set.
          </p>
          <div className="hero-meta mono">
            <span>{concepts.length} options</span>
            <span className="sep">—</span>
            <span>
              {concepts.reduce((n, c) => n + countForOption(c.option), 0)} assets catalogued
            </span>
          </div>
        </div>
      </header>

      {/* Tab bar — one tab per option */}
      <div className="show-tabs">
        <div className="container show-tabs-inner" role="tablist" aria-label="Design options">
          {concepts.map((c, i) => {
            const isActive = activeSlug === c.slug;
            const count = countForOption(c.option);
            return (
              <button
                key={c.slug}
                role="tab"
                aria-selected={isActive}
                onClick={() => selectTab(c.slug)}
                className={`tab${isActive ? ' is-active' : ''}`}
              >
                <span className="tab-num mono">{pad(i)}</span>
                <span className="tab-body">
                  <span className="tab-name">
                    Option {c.option} · {c.name}
                  </span>
                  <span className="tab-count mono">
                    {count === 0 ? 'Runtime-generated' : `${count} asset${count === 1 ? '' : 's'}`}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active option panel */}
      <div className="container show-panel" role="tabpanel">
        {active && <ConceptSection concept={active} number={pad(activeIndex)} key={active.option} />}
      </div>
    </>
  );
}
