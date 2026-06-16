'use client';

import { useCallback, useEffect, useState } from 'react';
import { optionRows, unifiedRows } from '@/lib/assets';
import type { ConceptOption, ImageRow, SectionRows } from '@/lib/assets';

/* ============ VIEWS — unified Website 2.0, then one per option ============ */

type View = {
  slug: string;
  name: string;
  desc: string;
  unified: boolean;
  option?: ConceptOption;
};

const VIEWS: View[] = [
  {
    slug: 'website-2',
    name: 'Website 2.0',
    desc: 'Each section background with the Option A and Option B overlays shown together — where the two collide they sit side by side to compare and unify.',
    unified: true,
  },
  {
    slug: 'concept-a',
    name: 'Option A · The Dossier',
    desc: 'The engraving product panels, trust marks, lifecycle, contrast, and pillar imagery.',
    unified: false,
    option: 'A',
  },
  {
    slug: 'concept-b',
    name: 'Option B · Signal Path',
    desc: 'Platform imagery, capability cards, feature / workflow icons, signal diagrams, and resource covers.',
    unified: false,
    option: 'B',
  },
  {
    slug: 'concept-c',
    name: 'Option C · Command',
    desc: 'Generated at runtime (canvas + CSS) — ships no exported image, icon, or vector files.',
    unified: false,
    option: 'C',
  },
];

const rowsForView = (v: View): SectionRows[] =>
  v.unified ? unifiedRows() : optionRows(v.option as ConceptOption);

const typeClass = (t: ImageRow['type']) => `t-${t.replace(/[^A-Za-z]+/g, '')}`;

/* ============ IMAGE — the actual rendering (reused in cell + panel) ============ */

function RowImage({ row }: { row: ImageRow }) {
  if (row.type === 'BG + SVG') {
    return (
      <div className="tbl-stage is-composite" style={{ backgroundImage: `url(${row.bgSrc})` }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={row.svgSrc} alt={row.name} loading="lazy" />
      </div>
    );
  }
  if (row.type === 'Background' || row.type === 'Raster') {
    return (
      <div
        className={`tbl-stage is-cover${row.dark ? ' is-dark' : ''}`}
        style={{ backgroundImage: `url(${row.bgSrc})` }}
        role="img"
        aria-label={row.name}
      />
    );
  }
  // SVG only
  return (
    <div className={`tbl-stage${row.dark ? ' is-dark' : ''}${row.fit === 'wide' ? ' is-wide' : ''}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={row.svgSrc} alt={row.name} loading="lazy" />
    </div>
  );
}

/* ============ DETAIL PANEL — opens on the right when an image is clicked ============ */

type Selection = { row: ImageRow; group: SectionRows };

function DetailPanel({
  selection,
  unified,
  onClose,
}: {
  selection: Selection | null;
  unified: boolean;
  onClose: () => void;
}) {
  const open = selection !== null;
  return (
    <>
      <div
        className={`panel-backdrop${open ? ' is-open' : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <aside className={`detail-panel${open ? ' is-open' : ''}`} aria-hidden={!open} aria-label="Image detail">
        {selection && (
          <>
            <div className="panel-head">
              <span className="mono">
                {selection.group.section.id} · {selection.group.section.title}
              </span>
              <button className="panel-close" onClick={onClose} aria-label="Close panel">
                ×
              </button>
            </div>

            <div className="panel-figure">
              <RowImage row={selection.row} />
            </div>

            <div className="panel-body">
              <div className="panel-title-row">
                {unified && (
                  <span
                    className={`concept-badge ${selection.row.concept ? `c-${selection.row.concept}` : 'c-bg'}`}
                  >
                    {selection.row.concept ?? 'BG'}
                  </span>
                )}
                <h3 className="mono">{selection.row.name}</h3>
              </div>

              <span className={`type-tag ${typeClass(selection.row.type)}`}>{selection.row.type}</span>

              {selection.row.note && <p className="panel-note">{selection.row.note}</p>}

              <dl className="panel-meta">
                <dt>Section</dt>
                <dd>{selection.group.content.heading}</dd>
                {selection.group.content.cta && (
                  <>
                    <dt>CTA</dt>
                    <dd>{selection.group.content.cta}</dd>
                  </>
                )}
                <dt>Concept</dt>
                <dd>{selection.row.concept ? `Option ${selection.row.concept}` : 'Website 2.0 background'}</dd>
                <dt>Type</dt>
                <dd>{selection.row.type}</dd>
                <dt>{selection.row.paths.length > 1 ? 'Files' : 'File'}</dt>
                <dd>
                  {selection.row.paths.map((p) => (
                    <a key={p} href={p} target="_blank" rel="noreferrer">
                      {p}
                    </a>
                  ))}
                </dd>
              </dl>
            </div>
          </>
        )}
      </aside>
    </>
  );
}

/* ============ THE TABLE ============ */

function MapTable({
  groups,
  unified,
  onSelect,
  activeKey,
}: {
  groups: SectionRows[];
  unified: boolean;
  onSelect: (group: SectionRows, row: ImageRow) => void;
  activeKey?: string;
}) {
  return (
    <div className="map-wrap">
      <table className="map-table">
        <thead>
          <tr>
            <th className="col-sec">Section</th>
            <th className="col-text">Text</th>
            <th className="col-cta">CTA</th>
            <th className="col-img">Image</th>
            <th className="col-name">{unified ? 'Asset · Concept' : 'Asset'}</th>
            <th className="col-type">Type</th>
            <th className="col-path">Path</th>
          </tr>
        </thead>
        <tbody>
          {groups.map((g) =>
            g.rows.map((row, i) => (
              <tr key={row.key} className={i === 0 ? 'sec-start' : ''}>
                {i === 0 && (
                  <>
                    <th scope="rowgroup" rowSpan={g.rows.length} className="cell-sec">
                      <span className="sec-id mono">{g.section.id}</span>
                      <span className="sec-title">{g.section.title}</span>
                    </th>
                    <td rowSpan={g.rows.length} className="cell-text">
                      <p className="cell-heading">{g.content.heading}</p>
                      {g.content.text && <p className="cell-body">{g.content.text}</p>}
                    </td>
                    <td rowSpan={g.rows.length} className="cell-cta">
                      {g.content.cta ? (
                        <span className="cta-chip">{g.content.cta}</span>
                      ) : (
                        <span className="cta-none mono">none</span>
                      )}
                    </td>
                  </>
                )}
                <td className="cell-img">
                  <button
                    type="button"
                    className={`img-btn${activeKey === row.key ? ' is-active' : ''}`}
                    onClick={() => onSelect(g, row)}
                    aria-label={`Open details for ${row.name}`}
                  >
                    <RowImage row={row} />
                  </button>
                </td>
                <td className="cell-name">
                  {unified && (
                    <span className={`concept-badge ${row.concept ? `c-${row.concept}` : 'c-bg'}`}>
                      {row.concept ?? 'BG'}
                    </span>
                  )}
                  <b className="mono">{row.name}</b>
                  {row.note && <span className="cell-note">{row.note}</span>}
                </td>
                <td className="cell-type">
                  <span className={`type-tag ${typeClass(row.type)}`}>{row.type}</span>
                </td>
                <td className="cell-path">
                  {row.paths.map((p) => (
                    <code key={p}>{p}</code>
                  ))}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

/* ============ PAGE ============ */

export default function Home() {
  const [activeSlug, setActiveSlug] = useState<string>(VIEWS[0].slug);
  const [selection, setSelection] = useState<Selection | null>(null);

  const closePanel = useCallback(() => setSelection(null), []);

  // Keep the active view in sync with the URL hash so each table is deep-linkable.
  useEffect(() => {
    const apply = () => {
      const slug = window.location.hash.replace('#', '');
      if (VIEWS.some((v) => v.slug === slug)) setActiveSlug(slug);
    };
    apply();
    window.addEventListener('hashchange', apply);
    return () => window.removeEventListener('hashchange', apply);
  }, []);

  // Close the panel on Escape.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closePanel();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [closePanel]);

  const select = (slug: string) => {
    setActiveSlug(slug);
    setSelection(null);
    if (window.location.hash !== `#${slug}`) window.history.replaceState(null, '', `#${slug}`);
  };

  const active = VIEWS.find((v) => v.slug === activeSlug) ?? VIEWS[0];
  const groups = rowsForView(active);
  const imageCount = groups.reduce((n, g) => n + g.rows.length, 0);

  return (
    <>
      {/* Editorial hero */}
      <header className="show-hero">
        <div className="container">
          <span className="eyebrow">Homepage · Financial Institutions</span>
          <h1>
            Section <em>Image</em> Map
          </h1>
          <p className="tagline">
            The Website 2.0 home page as a table — each section&apos;s copy and CTA next to the
            actual rendered imagery that fills its Image cell. Click any image to open its full
            preview and details. Every image is flagged by how it&apos;s built: a section
            background, a background-plus-SVG composite, a standalone SVG, or a raster.
          </p>
          <div className="hero-meta mono">
            <span>{VIEWS.length} views</span>
            <span className="sep">—</span>
            <span>Section · Text · CTA · Image</span>
          </div>
        </div>
      </header>

      {/* View switcher */}
      <div className="show-tabs">
        <div className="container show-tabs-inner" role="tablist" aria-label="Table views">
          {VIEWS.map((v, i) => {
            const isActive = v.slug === active.slug;
            const count = rowsForView(v).reduce((n, g) => n + g.rows.length, 0);
            return (
              <button
                key={v.slug}
                role="tab"
                aria-selected={isActive}
                onClick={() => select(v.slug)}
                className={`tab${isActive ? ' is-active' : ''}`}
              >
                <span className="tab-num mono">{String(i).padStart(2, '0')}</span>
                <span className="tab-body">
                  <span className="tab-name">{v.name}</span>
                  <span className="tab-count mono">
                    {count === 0 ? 'No assets' : `${count} image${count === 1 ? '' : 's'}`}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active table */}
      <div className="container show-panel" role="tabpanel">
        <p className="view-desc">{active.desc}</p>
        {imageCount === 0 ? (
          <p className="concept-empty">
            Option C — Command is generated entirely at runtime (canvas + CSS), so there are no
            exported image, icon, or vector files to render here.
          </p>
        ) : (
          <MapTable
            groups={groups}
            unified={active.unified}
            onSelect={(group, row) => setSelection({ group, row })}
            activeKey={selection?.row.key}
          />
        )}
      </div>

      <DetailPanel selection={selection} unified={active.unified} onClose={closePanel} />
    </>
  );
}
