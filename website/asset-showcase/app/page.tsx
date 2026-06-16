'use client';

import { useCallback, useEffect, useState } from 'react';
import { homepageRows } from '@/lib/assets';
import type { ImageRow, SectionRows } from '@/lib/assets';

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

/** Empty placeholder shown until a section's Image cell is filled. */
function EmptyImage() {
  return (
    <div className="img-empty">
      <span className="mono">Add image</span>
    </div>
  );
}

/* ============ DETAIL PANEL — opens when a filled image is clicked ============ */

type Selection = { row: ImageRow; group: SectionRows };

function DetailPanel({ selection, onClose }: { selection: Selection | null; onClose: () => void }) {
  const open = selection !== null;
  return (
    <>
      <div className={`panel-backdrop${open ? ' is-open' : ''}`} onClick={onClose} aria-hidden="true" />
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
  onSelect,
  activeKey,
}: {
  groups: SectionRows[];
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
          </tr>
        </thead>
        <tbody>
          {groups.map((g) => {
            const display: (ImageRow | null)[] = g.rows.length ? g.rows : [null];
            return display.map((row, i) => (
              <tr key={row ? row.key : g.section.id} className={i === 0 ? 'sec-start' : ''}>
                {i === 0 && (
                  <>
                    <th scope="rowgroup" rowSpan={display.length} className="cell-sec">
                      <span className="sec-id mono">{g.section.id}</span>
                      <span className="sec-title">{g.section.title}</span>
                    </th>
                    <td rowSpan={display.length} className="cell-text">
                      <p className="cell-heading">{g.content.heading}</p>
                      {g.content.text && <p className="cell-body">{g.content.text}</p>}
                    </td>
                    <td rowSpan={display.length} className="cell-cta">
                      {g.content.cta ? (
                        <span className="cta-chip">{g.content.cta}</span>
                      ) : (
                        <span className="cta-none mono">none</span>
                      )}
                    </td>
                  </>
                )}
                <td className="cell-img">
                  {row ? (
                    <button
                      type="button"
                      className={`img-btn${activeKey === row.key ? ' is-active' : ''}`}
                      onClick={() => onSelect(g, row)}
                      aria-label={`Open details for ${row.name}`}
                    >
                      <RowImage row={row} />
                    </button>
                  ) : (
                    <EmptyImage />
                  )}
                </td>
              </tr>
            ));
          })}
        </tbody>
      </table>
    </div>
  );
}

/* ============ PAGE ============ */

export default function Home() {
  const [selection, setSelection] = useState<Selection | null>(null);
  const closePanel = useCallback(() => setSelection(null), []);

  // Close the panel on Escape.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closePanel();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [closePanel]);

  const groups = homepageRows();

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
            The Website 2.0 home page as a fill-in template — each section&apos;s copy and CTA next to
            an empty Image slot. Drop in the artwork for each section to build up the page&apos;s
            imagery; once filled, click any image for a full preview and its details.
          </p>
          <div className="hero-meta mono">
            <span>{groups.length} sections</span>
            <span className="sep">—</span>
            <span>Section · Text · CTA · Image</span>
          </div>
        </div>
      </header>

      {/* Template table */}
      <div className="container show-panel" role="region" aria-label="Homepage image map">
        <MapTable
          groups={groups}
          onSelect={(group, row) => setSelection({ group, row })}
          activeKey={selection?.row.key}
        />
      </div>

      <DetailPanel selection={selection} onClose={closePanel} />
    </>
  );
}
