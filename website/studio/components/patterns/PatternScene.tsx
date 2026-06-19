import { Fragment } from 'react';
import type { PatternConfig } from '@/lib/composition/types';

/**
 * Parametric motif scenes for the Deconflict studio. Rendered as a single SVG in
 * a fixed 1200×750 reference frame and scaled with `preserveAspectRatio="xMidYMid
 * slice"`, so the SAME scene covers a full-bleed background (any canvas aspect)
 * AND a foreground tile without distorting (it crops, never stretches).
 *
 * Hard rule: this component is PURE and DETERMINISTIC — geometry comes from a
 * seeded LCG, never `Math.random()` or the clock — so it is server-renderable and
 * the editor preview, the chrome-less /render route and the Playwright screenshot
 * stay pixel-identical. No `'use client'`, no hooks, no animation.
 *
 * Four motifs, each reading the same {@link PatternConfig}: density → element
 * count, scale → feature size, glow → ambient lift, lineWidth → stroke weight,
 * vignette → edge falloff, and the base/accent/node colours.
 */

const W = 1200;
const H = 750;
const CX = W / 2;
const CY = H / 2;

/** Deterministic 0..1 generator (same seed → same sequence). */
function lcg(seed: number) {
  let s = (Math.floor(Math.abs(seed)) >>> 0) || 1;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
}

/** Scale a hex colour's RGB by `f` (<1 darken, >1 lighten); returns a hex string. */
function shade(hex: string, f: number): string {
  const h = hex.replace('#', '').trim();
  const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h.padEnd(6, '0').slice(0, 6);
  const n = Number.parseInt(full, 16);
  const clamp = (v: number) => Math.max(0, Math.min(255, Math.round(v)));
  const r = clamp(((n >> 16) & 255) * f);
  const g = clamp(((n >> 8) & 255) * f);
  const b = clamp((n & 255) * f);
  return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`;
}

/** Stable short id from the config, so multiple PatternScenes on one page never
 *  share gradient ids (which would cross-wire their fills via `url(#…)`). */
function uidFor(cfg: PatternConfig): string {
  const s = JSON.stringify(cfg);
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return `pat${(h >>> 0).toString(36)}`;
}

/** Six points of a flat-top→pointy hexagon centred at (cx,cy). */
function hexPoints(cx: number, cy: number, r: number): string {
  const pts: string[] = [];
  for (let i = 0; i < 6; i++) {
    const a = (Math.PI / 180) * (60 * i - 90);
    pts.push(`${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`);
  }
  return pts.join(' ');
}

type MotifProps = { cfg: PatternConfig; uid: string; rnd: () => number };

/* The shared <defs>: an edge vignette and a central halo, keyed off the uid. */
function defs(uid: string, cfg: PatternConfig) {
  const deep = shade(cfg.baseColor, 0.5);
  return (
    <defs>
      <radialGradient id={`${uid}-vig`} cx="50%" cy="44%" r="75%">
        <stop offset="52%" stopColor={deep} stopOpacity={0} />
        <stop offset="100%" stopColor={deep} stopOpacity={cfg.vignette} />
      </radialGradient>
      <radialGradient id={`${uid}-halo`}>
        <stop offset="0%" stopColor={cfg.accent} stopOpacity={0.1 + cfg.glow * 0.34} />
        <stop offset="55%" stopColor={cfg.accent} stopOpacity={cfg.glow * 0.12} />
        <stop offset="100%" stopColor={cfg.accent} stopOpacity={0} />
      </radialGradient>
      <radialGradient id={`${uid}-core`}>
        <stop offset="0%" stopColor={shade(cfg.accent, 1.3)} stopOpacity={0.95} />
        <stop offset="100%" stopColor={cfg.accent} stopOpacity={0.15} />
      </radialGradient>
    </defs>
  );
}

const Vignette = ({ uid }: { uid: string }) => (
  <rect width={W} height={H} fill={`url(#${uid}-vig)`} />
);

const Halo = ({ uid, cx, cy, rx, ry }: { uid: string; cx: number; cy: number; rx: number; ry: number }) => (
  <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={`url(#${uid}-halo)`} />
);

/* ─────────────────────────────────────────────────────────────────────────
 * S — Case overlap. Two case orbits intersect; loose case dots in each fan
 * toward a shared verified hex node in the overlap lens (the Deconflict idea).
 * ───────────────────────────────────────────────────────────────────────── */
function CaseOverlap({ cfg, uid, rnd }: MotifProps) {
  const R = 170 + cfg.scale * 150;
  const sep = R * 0.78; // centre offset from the middle → guarantees a lens overlap
  const left = { x: CX - sep, y: CY };
  const right = { x: CX + sep, y: CY };
  const hub = { x: CX, y: CY };
  const sw = cfg.lineWidth;
  const perOrbit = Math.round(7 + cfg.density * 20);

  const orbitDots = (c: { x: number; y: number }, key: string) => {
    const out: React.ReactNode[] = [];
    for (let i = 0; i < perOrbit; i++) {
      const a = rnd() * Math.PI * 2;
      const rr = R * (0.25 + rnd() * 0.7);
      const x = c.x + Math.cos(a) * rr;
      const y = c.y + Math.sin(a) * rr * 0.92;
      const near = Math.hypot(x - hub.x, y - hub.y) < R * 0.55;
      out.push(
        <circle
          key={`${key}-${i}`}
          cx={x.toFixed(1)}
          cy={y.toFixed(1)}
          r={(2.5 + rnd() * 4.5).toFixed(1)}
          fill={near ? cfg.nodeColor : cfg.accent}
          opacity={near ? 0.85 : (0.2 + rnd() * 0.4).toFixed(3)}
        />,
      );
      if (near && rnd() > 0.45) {
        out.push(
          <path
            key={`${key}-l-${i}`}
            d={`M${x.toFixed(1)} ${y.toFixed(1)} Q ${((x + hub.x) / 2).toFixed(1)} ${((y + hub.y) / 2 - 30).toFixed(1)} ${hub.x} ${hub.y}`}
            fill="none"
            stroke={cfg.nodeColor}
            strokeWidth={0.8 * sw}
            opacity={0.25}
          />,
        );
      }
    }
    return out;
  };

  const rings = (c: { x: number; y: number }) =>
    [1, 0.74, 0.48].map((f, i) => (
      <ellipse
        key={`${c.x}-${i}`}
        cx={c.x}
        cy={c.y}
        rx={R * f}
        ry={R * f * 0.92}
        fill="none"
        stroke={cfg.accent}
        strokeWidth={(1.6 - i * 0.3) * sw}
        opacity={0.4 - i * 0.08}
      />
    ));

  const hexR = 30 + cfg.scale * 26;
  return (
    <>
      {defs(uid, cfg)}
      <rect width={W} height={H} fill={cfg.baseColor} />
      <Halo uid={uid} cx={hub.x} cy={hub.y} rx={R * 1.2} ry={R} />
      {rings(left)}
      {rings(right)}
      {orbitDots(left, 'L')}
      {orbitDots(right, 'R')}
      {/* shared verified node */}
      <polygon points={hexPoints(hub.x, hub.y, hexR * 1.5)} fill="none" stroke={cfg.accent} strokeWidth={1.6 * sw} opacity={0.45} />
      <polygon points={hexPoints(hub.x, hub.y, hexR)} fill={`url(#${uid}-core)`} stroke={cfg.nodeColor} strokeWidth={2.2 * sw} opacity={0.95} />
      <path
        d={`M ${hub.x - hexR * 0.45} ${hub.y + hexR * 0.04} l ${hexR * 0.28} ${hexR * 0.34} l ${hexR * 0.6} ${-hexR * 0.7}`}
        fill="none"
        stroke="#ffffff"
        strokeWidth={3.4 * sw}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={0.95}
      />
      <Vignette uid={uid} />
    </>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
 * S — Secure exchange. A hashed lattice of cells; some cells locked
 * (encrypted), a brighter secure channel runs end-to-end with key-glints.
 * ───────────────────────────────────────────────────────────────────────── */
function SecureExchange({ cfg, uid, rnd }: MotifProps) {
  const sw = cfg.lineWidth;
  const cols = Math.round(8 + cfg.density * 10);
  const cell = W / cols;
  const rows = Math.ceil(H / cell) + 1;

  const grid: React.ReactNode[] = [];
  for (let c = 0; c <= cols; c++) {
    grid.push(
      <line key={`v${c}`} x1={c * cell} y1={0} x2={c * cell} y2={H} stroke={cfg.accent} strokeWidth={0.6 * sw} opacity={0.12} />,
    );
  }
  for (let r = 0; r <= rows; r++) {
    grid.push(
      <line key={`h${r}`} x1={0} y1={r * cell} x2={W} y2={r * cell} stroke={cfg.accent} strokeWidth={0.6 * sw} opacity={0.12} />,
    );
  }

  // Lock glyphs at a seeded subset of cells.
  const lockSize = (cell * (0.18 + cfg.scale * 0.16));
  const locks: React.ReactNode[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (rnd() > 0.18 + cfg.density * 0.22) continue;
      const x = (c + 0.5) * cell;
      const y = (r + 0.5) * cell;
      const s = lockSize;
      const on = rnd() > 0.5;
      locks.push(
        <g key={`lk-${r}-${c}`} opacity={on ? 0.7 : 0.32}>
          <rect x={x - s * 0.5} y={y} width={s} height={s * 0.78} rx={s * 0.16} fill={on ? cfg.accent : 'none'} stroke={on ? cfg.nodeColor : cfg.accent} strokeWidth={1 * sw} />
          <path d={`M ${x - s * 0.3} ${y} v ${-s * 0.28} a ${s * 0.3} ${s * 0.3} 0 0 1 ${s * 0.6} 0 v ${s * 0.28}`} fill="none" stroke={on ? cfg.nodeColor : cfg.accent} strokeWidth={1 * sw} />
        </g>,
      );
    }
  }

  // Secure channel: a polyline routed across the lattice, with glints.
  const midRow = Math.round(rows * 0.5);
  const chPts: [number, number][] = [];
  for (let c = 0; c <= cols; c++) {
    const jitter = (rnd() - 0.5) * cell * 0.9;
    chPts.push([c * cell, (midRow + 0.5) * cell + jitter]);
  }
  const channel = chPts.map(([x, y], i) => `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`).join(' ');
  const glints = chPts
    .filter((_, i) => i % 2 === 0)
    .map(([x, y], i) => (
      <g key={`g${i}`} stroke={cfg.nodeColor} strokeWidth={1.4 * sw} opacity={0.9}>
        <line x1={x - 6} y1={y} x2={x + 6} y2={y} />
        <line x1={x} y1={y - 6} x2={x} y2={y + 6} />
      </g>
    ));

  return (
    <>
      {defs(uid, cfg)}
      <rect width={W} height={H} fill={cfg.baseColor} />
      <Halo uid={uid} cx={CX} cy={CY} rx={W * 0.5} ry={H * 0.5} />
      {grid}
      {locks}
      <path d={channel} fill="none" stroke={cfg.accent} strokeWidth={3 * sw} opacity={0.55} />
      <path d={channel} fill="none" stroke={cfg.nodeColor} strokeWidth={1.2 * sw} opacity={0.8} strokeDasharray="2 6" />
      {glints}
      {/* endpoints */}
      <circle cx={0} cy={(midRow + 0.5) * cell} r={10 + cfg.scale * 6} fill={`url(#${uid}-core)`} stroke={cfg.nodeColor} strokeWidth={2 * sw} />
      <circle cx={W} cy={chPts[chPts.length - 1][1]} r={10 + cfg.scale * 6} fill={`url(#${uid}-core)`} stroke={cfg.nodeColor} strokeWidth={2 * sw} />
      <Vignette uid={uid} />
    </>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
 * S — Global coverage. A wireframe-globe graticule with lit intelligence
 * nodes and great-circle arcs between a few of them.
 * ───────────────────────────────────────────────────────────────────────── */
function GlobalCoverage({ cfg, uid, rnd }: MotifProps) {
  const sw = cfg.lineWidth;
  const R = 230 + cfg.scale * 130;
  const lat = 6;
  const lon = 8;

  const graticule: React.ReactNode[] = [];
  graticule.push(<circle key="rim" cx={CX} cy={CY} r={R} fill="none" stroke={cfg.accent} strokeWidth={1.2 * sw} opacity={0.4} />);
  for (let i = 1; i < lat; i++) {
    const ry = R * Math.cos((i / lat) * (Math.PI / 2));
    const off = R * (i / lat);
    graticule.push(
      <Fragment key={`lat${i}`}>
        <ellipse cx={CX} cy={CY - (R - ry) * 0} rx={R} ry={ry} fill="none" stroke={cfg.accent} strokeWidth={0.7 * sw} opacity={0.2} transform={`translate(0 ${-off * 0})`} />
      </Fragment>,
    );
  }
  // latitude lines as horizontal chords
  for (let i = 1; i < lat; i++) {
    const y = CY + (i / lat) * R * 0.96;
    const y2 = CY - (i / lat) * R * 0.96;
    const half = Math.sqrt(Math.max(0, R * R - (y - CY) * (y - CY)));
    graticule.push(<line key={`la+${i}`} x1={CX - half} y1={y} x2={CX + half} y2={y} stroke={cfg.accent} strokeWidth={0.7 * sw} opacity={0.18} />);
    graticule.push(<line key={`la-${i}`} x1={CX - half} y1={y2} x2={CX + half} y2={y2} stroke={cfg.accent} strokeWidth={0.7 * sw} opacity={0.18} />);
  }
  // meridians as vertical ellipses
  for (let i = 0; i < lon; i++) {
    const rx = R * Math.cos((i / lon) * Math.PI - Math.PI / 2);
    graticule.push(<ellipse key={`lon${i}`} cx={CX} cy={CY} rx={Math.abs(rx)} ry={R} fill="none" stroke={cfg.accent} strokeWidth={0.7 * sw} opacity={0.18} />);
  }

  // Lit nodes on the disc.
  const count = Math.round(10 + cfg.density * 28);
  const nodes: [number, number][] = [];
  const nodeEls: React.ReactNode[] = [];
  for (let i = 0; i < count; i++) {
    const a = rnd() * Math.PI * 2;
    const rr = Math.sqrt(rnd()) * R * 0.96;
    const x = CX + Math.cos(a) * rr;
    const y = CY + Math.sin(a) * rr;
    nodes.push([x, y]);
    nodeEls.push(<circle key={`n${i}`} cx={x.toFixed(1)} cy={y.toFixed(1)} r={(2 + rnd() * 4).toFixed(1)} fill={cfg.nodeColor} opacity={(0.5 + rnd() * 0.5).toFixed(3)} />);
  }
  // Arcs between a few node pairs.
  const arcs: React.ReactNode[] = [];
  for (let i = 0; i < Math.min(nodes.length - 1, 6); i++) {
    const [x1, y1] = nodes[i];
    const [x2, y2] = nodes[(i * 3 + 2) % nodes.length];
    const mx = (x1 + x2) / 2 + (y2 - y1) * 0.18;
    const my = (y1 + y2) / 2 - Math.abs(x2 - x1) * 0.18;
    arcs.push(<path key={`arc${i}`} d={`M ${x1.toFixed(1)} ${y1.toFixed(1)} Q ${mx.toFixed(1)} ${my.toFixed(1)} ${x2.toFixed(1)} ${y2.toFixed(1)}`} fill="none" stroke={cfg.nodeColor} strokeWidth={1 * sw} opacity={0.28} />);
  }

  return (
    <>
      {defs(uid, cfg)}
      <rect width={W} height={H} fill={cfg.baseColor} />
      <Halo uid={uid} cx={CX} cy={CY} rx={R * 1.25} ry={R * 1.25} />
      <circle cx={CX} cy={CY} r={R} fill={`url(#${uid}-halo)`} opacity={0.5} />
      {graticule}
      {arcs}
      {nodeEls}
      <Vignette uid={uid} />
    </>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
 * S — Audit trail. Horizontal activity lanes with event nodes and dashed
 * vertical overlap markers sweeping across the frame (provenance / chronology).
 * ───────────────────────────────────────────────────────────────────────── */
function AuditTrail({ cfg, uid, rnd }: MotifProps) {
  const sw = cfg.lineWidth;
  const lanes = 4;
  const laneGap = H / (lanes + 1);
  const laneW = (3 + cfg.scale * 5) * sw;
  const beats = Math.round(6 + cfg.density * 16);

  const laneEls: React.ReactNode[] = [];
  const nodeEls: React.ReactNode[] = [];
  for (let l = 0; l < lanes; l++) {
    const y = laneGap * (l + 1);
    const x0 = 40 + rnd() * 120;
    const x1 = W - 40 - rnd() * 120;
    const tone = l % 2 === 0 ? cfg.accent : cfg.nodeColor;
    laneEls.push(<line key={`lane${l}`} x1={x0} y1={y} x2={x1} y2={y} stroke={tone} strokeWidth={laneW} strokeLinecap="round" opacity={0.32} />);
    // active sub-segment
    const sa = x0 + (x1 - x0) * (0.15 + rnd() * 0.3);
    const sb = sa + (x1 - x0) * (0.25 + rnd() * 0.35);
    laneEls.push(<line key={`laneA${l}`} x1={sa} y1={y} x2={sb} y2={y} stroke={tone} strokeWidth={laneW} strokeLinecap="round" opacity={0.9} />);
    const per = Math.round(beats * (0.5 + rnd() * 0.6));
    for (let i = 0; i < per; i++) {
      const x = x0 + (x1 - x0) * rnd();
      nodeEls.push(<circle key={`ev${l}-${i}`} cx={x.toFixed(1)} cy={y} r={(2 + rnd() * 3).toFixed(1)} fill={cfg.nodeColor} opacity={(0.4 + rnd() * 0.5).toFixed(3)} />);
    }
  }

  // Vertical overlap markers — where lanes coincide.
  const markers: React.ReactNode[] = [];
  const markCount = Math.max(2, Math.round(cfg.density * 6));
  for (let i = 0; i < markCount; i++) {
    const x = W * (0.12 + (i / Math.max(1, markCount - 1)) * 0.76) + (rnd() - 0.5) * 40;
    markers.push(<line key={`mk${i}`} x1={x.toFixed(1)} y1={laneGap * 0.4} x2={x.toFixed(1)} y2={H - laneGap * 0.4} stroke={cfg.accent} strokeWidth={1.1 * sw} strokeDasharray="3 5" opacity={0.45} />);
    markers.push(<circle key={`mkd${i}`} cx={x.toFixed(1)} cy={laneGap} r={3} fill={cfg.accent} opacity={0.8} />);
  }

  return (
    <>
      {defs(uid, cfg)}
      <rect width={W} height={H} fill={cfg.baseColor} />
      <Halo uid={uid} cx={CX} cy={CY} rx={W * 0.55} ry={H * 0.5} />
      {markers}
      {laneEls}
      {nodeEls}
      <Vignette uid={uid} />
    </>
  );
}

const MOTIFS: Record<PatternConfig['motif'], (p: MotifProps) => React.ReactNode> = {
  'case-overlap': CaseOverlap,
  'secure-exchange': SecureExchange,
  'global-coverage': GlobalCoverage,
  'audit-trail': AuditTrail,
};

/**
 * The pattern renderer. Fills its container (`h-full w-full`), so the caller
 * sizes the box — a full-bleed background div or a fixed-aspect foreground tile.
 */
export function PatternScene({ config, className }: { config: PatternConfig; className?: string }) {
  const uid = uidFor(config);
  const rnd = lcg(config.seed);
  const Motif = MOTIFS[config.motif] ?? CaseOverlap;
  return (
    <svg
      className={className ?? 'h-full w-full'}
      width="100%"
      height="100%"
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
      role="presentation"
    >
      {Motif({ cfg: config, uid, rnd })}
    </svg>
  );
}
