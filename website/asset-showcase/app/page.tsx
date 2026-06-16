'use client';

import { useEffect, useRef, useState } from 'react';
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
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveSlug(entry.target.id);
        }
      },
      { rootMargin: '-40% 0px -55% 0px' }
    );
    concepts.forEach((c) => {
      const el = document.getElementById(c.slug);
      if (el) observerRef.current?.observe(el);
    });
    return () => observerRef.current?.disconnect();
  }, []);

  const scrollTo = (slug: string) => {
    document.getElementById(slug)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

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
            Every embed, image, and vector created for the Deconflict homepage exploration, gathered
            on one page and sorted by the design option that consumes it — Option A (The Dossier),
            Option B (Signal Path), and Option C (Command). Brand marks are kept out: this is the
            supporting illustration, icon, and image set.
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

      {/* Two-column editorial body */}
      <div className="container show-body">
        {/* Numbered sidebar TOC */}
        <aside className="show-toc">
          <nav>
            {concepts.map((c, i) => {
              const isActive = activeSlug === c.slug;
              const count = countForOption(c.option);
              return (
                <button
                  key={c.slug}
                  onClick={() => scrollTo(c.slug)}
                  className={`toc-item${isActive ? ' is-active' : ''}`}
                >
                  <span className="toc-num">{pad(i)}</span>
                  <span className="toc-name">
                    Option {c.option} · {c.name}
                  </span>
                  <span className="toc-count mono">
                    {count === 0 ? 'Runtime-generated' : `${count} asset${count === 1 ? '' : 's'}`}
                  </span>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Sections */}
        <main className="show-main">
          {concepts.map((c, i) => (
            <ConceptSection concept={c} number={pad(i)} key={c.option} />
          ))}
        </main>
      </div>
    </>
  );
}
