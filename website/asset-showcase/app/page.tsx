'use client';

import { useEffect, useState } from 'react';
import { concepts, countForOption, usageForOption, sectionBackgrounds } from '@/lib/assets';
import type { ShowcaseConcept, SvgAsset, UsageBlock } from '@/lib/assets';

/** Lead tab: the Website 2.0 section-background set (not an A/B/C concept). */
const BG_SLUG = 'section-backgrounds';

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

/* ============ USAGE BLOCK — assets grouped by where they're used ============ */

function UsageBlockView({ block }: { block: UsageBlock }) {
  const { section, aura, images, svgs } = block;
  const count = aura.length + images.length + svgs.length;

  return (
    <div className="usage-group">
      <div className="usage-head">
        <span className="usage-code mono">{section.id}</span>
        <h4>{section.title}</h4>
        <span className="usage-count mono">
          {count} asset{count === 1 ? '' : 's'}
        </span>
      </div>
      <p className="usage-summary">{section.summary}</p>

      {aura.length > 0 && (
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
      )}

      {images.length > 0 && (
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
      )}

      {svgs.length > 0 && (
        <div className="inline-grid">
          {svgs.map((a) => (
            <SvgCard asset={a} animated={a.animated} key={a.name} />
          ))}
        </div>
      )}
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
  const blocks = usageForOption(concept.option);
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

      {blocks.map((block) => (
        <UsageBlockView block={block} key={block.section.id} />
      ))}
    </section>
  );
}

/* ============ SECTION BACKGROUNDS — one full-bleed render per section ============ */

function SectionBackgroundsView() {
  return (
    <section className="concept-sec" id={BG_SLUG}>
      <div className="sec-header">
        <span className="sec-ghost">00</span>
        <h3>
          <span className="idx mono">Website 2.0</span> Section Backgrounds
        </h3>
        <p className="concept-tagline">
          One full-bleed static render per homepage section — ambient backgrounds that sit behind
          the copy, replacing the live Aura embeds and the per-item SVG sets.
        </p>
        <p className="concept-count mono">{sectionBackgrounds.length} backgrounds</p>
      </div>

      <div className="bg-bands">
        {sectionBackgrounds.map((b) => (
          <figure
            className={`bg-band ${b.dark ? 'is-dark' : 'is-light'}`}
            key={b.id}
            style={{ backgroundImage: `url(${b.src})` }}
          >
            <div className="bg-band-copy">
              <span className="bg-band-id mono">{b.id}</span>
              <h4>{b.title}</h4>
              <p>{b.motif}</p>
              <span className="bg-band-meta mono">
                {b.src} · {b.meta}
              </span>
            </div>
          </figure>
        ))}
      </div>
    </section>
  );
}

/* ============ PAGE ============ */

const pad = (i: number) => String(i + 1).padStart(2, '0');

export default function Home() {
  const [activeSlug, setActiveSlug] = useState<string>(BG_SLUG);

  // Sync the active tab with the URL hash so the top-bar Option links work and
  // each tab is deep-linkable / shareable.
  useEffect(() => {
    const apply = () => {
      const slug = window.location.hash.replace('#', '');
      if (slug === BG_SLUG || concepts.some((c) => c.slug === slug)) setActiveSlug(slug);
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

  const showBg = activeSlug === BG_SLUG;
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
            Every embed, image, and vector created for the Deconflict homepage exploration. Pick an
            option below — Option A (The Dossier), Option B (Signal Path), or Option C (Command) —
            and its assets are laid out by where they appear on the page, banner through close. Brand
            marks are kept out: this is the supporting illustration, icon, and image set.
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

      {/* Tab bar — Section Backgrounds lead tab, then one tab per option */}
      <div className="show-tabs">
        <div className="container show-tabs-inner" role="tablist" aria-label="Design options">
          <button
            role="tab"
            aria-selected={showBg}
            onClick={() => selectTab(BG_SLUG)}
            className={`tab${showBg ? ' is-active' : ''}`}
          >
            <span className="tab-num mono">00</span>
            <span className="tab-body">
              <span className="tab-name">Section Backgrounds</span>
              <span className="tab-count mono">{sectionBackgrounds.length} backgrounds</span>
            </span>
          </button>
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

      {/* Active panel */}
      <div className="container show-panel" role="tabpanel">
        {showBg ? (
          <SectionBackgroundsView />
        ) : (
          active && <ConceptSection concept={active} number={pad(activeIndex)} key={active.option} />
        )}
      </div>
    </>
  );
}
