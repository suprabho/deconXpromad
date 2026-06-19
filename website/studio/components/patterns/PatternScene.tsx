import { Fragment } from 'react';
import { DEFAULT_GUILLOCHE, DEFAULT_INTAGLIO, type PatternConfig, type RippleShapeKind } from '@/lib/composition/types';

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
 * Six motifs, each reading the same {@link PatternConfig}: density → element
 * count, scale → feature size, glow → ambient lift, lineWidth → stroke weight,
 * vignette → edge falloff, and the base/accent/node colours. Two of them —
 * `rosette` (rose-engine guilloché) and `intaglio` (engraved-banknote line-art)
 * — `rosette` (spirograph guilloché, the timestretch.com four-harmonic
 * generator) and `intaglio` (engraved-banknote line-art) — are the security-
 * print generators from deconflict-security-pattern-spec.md (Parts 2 & 1); the
 * other four are abstract Deconflict security scenes.
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
      {!cfg.transparent && <rect width={W} height={H} fill={cfg.baseColor} />}
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
      {!cfg.transparent && <Vignette uid={uid} />}
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
      {!cfg.transparent && <rect width={W} height={H} fill={cfg.baseColor} />}
      <Halo uid={uid} cx={CX} cy={CY} rx={W * 0.5} ry={H * 0.5} />
      {grid}
      {locks}
      <path d={channel} fill="none" stroke={cfg.accent} strokeWidth={3 * sw} opacity={0.55} />
      <path d={channel} fill="none" stroke={cfg.nodeColor} strokeWidth={1.2 * sw} opacity={0.8} strokeDasharray="2 6" />
      {glints}
      {/* endpoints */}
      <circle cx={0} cy={(midRow + 0.5) * cell} r={10 + cfg.scale * 6} fill={`url(#${uid}-core)`} stroke={cfg.nodeColor} strokeWidth={2 * sw} />
      <circle cx={W} cy={chPts[chPts.length - 1][1]} r={10 + cfg.scale * 6} fill={`url(#${uid}-core)`} stroke={cfg.nodeColor} strokeWidth={2 * sw} />
      {!cfg.transparent && <Vignette uid={uid} />}
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
      {!cfg.transparent && <rect width={W} height={H} fill={cfg.baseColor} />}
      <Halo uid={uid} cx={CX} cy={CY} rx={R * 1.25} ry={R * 1.25} />
      <circle cx={CX} cy={CY} r={R} fill={`url(#${uid}-halo)`} opacity={0.5} />
      {graticule}
      {arcs}
      {nodeEls}
      {!cfg.transparent && <Vignette uid={uid} />}
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
      {!cfg.transparent && <rect width={W} height={H} fill={cfg.baseColor} />}
      <Halo uid={uid} cx={CX} cy={CY} rx={W * 0.55} ry={H * 0.5} />
      {markers}
      {laneEls}
      {nodeEls}
      {!cfg.transparent && <Vignette uid={uid} />}
    </>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
 * Rosette — spirograph guilloché (timestretch.com's generator), driven by the
 * explicit GuillocheConfig fields rather than a seed. The curve is a four-stage
 * harmonic summation:
 *   x = sA·sin(aA·t) + sB·sin(aB·t+off) + sC·sin(aC·t) + (sD + p·rOff)·sin(aD·t)
 *   y = sA·cos(aA·t) + sB·cos(aB·t+off) + sC·cos(aC·t) + (sD + p·rOff)·cos(aD·t)
 * drawn once per repeat pass p ∈ [0, repeatCount); the per-pass amplitude drift
 * `repeatOffset` on the D term weaves the lacework echoes. All × scale%. Colours
 * come from the global accent (every 5th pass uses the node colour for depth).
 * ───────────────────────────────────────────────────────────────────────── */
function Rosette({ cfg, uid }: MotifProps) {
  const g = cfg.guilloche ?? DEFAULT_GUILLOCHE;
  const off = (g.offset * Math.PI) / 180; // phase on the B term (degrees → rad)
  const k = g.scale / 100; // overall scale multiplier
  const passes = Math.max(1, Math.round(g.repeatCount));
  const cx0 = CX + (g.x / 100) * W; // centre offset
  const cy0 = CY + (g.y / 100) * H;

  // One four-harmonic closed curve (repeat pass p) as an SVG path string.
  const curve = (p: number, steps = 1440) => {
    const D = g.scaleD + p * g.repeatOffset; // drifting amplitude on the D term
    let d = '';
    for (let i = 0; i <= steps; i++) {
      const t = (i / steps) * Math.PI * 2;
      const x =
        g.scaleA * Math.sin(g.angleA * t) +
        g.scaleB * Math.sin(g.angleB * t + off) +
        g.scaleC * Math.sin(g.angleC * t) +
        D * Math.sin(g.angleD * t);
      const y =
        g.scaleA * Math.cos(g.angleA * t) +
        g.scaleB * Math.cos(g.angleB * t + off) +
        g.scaleC * Math.cos(g.angleC * t) +
        D * Math.cos(g.angleD * t);
      d += `${i ? 'L' : 'M'}${(cx0 + x * k).toFixed(1)} ${(cy0 + y * k).toFixed(1)} `;
    }
    return d;
  };

  const lace: React.ReactNode[] = [];
  for (let p = 0; p < passes; p++) {
    const col = p % 5 === 0 ? cfg.nodeColor : cfg.accent;
    lace.push(<path key={`g${p}`} d={curve(p)} fill="none" stroke={col} strokeWidth={g.lineThickness} opacity={0.26} />);
  }

  // Halo / centre scaled to the figure's overall amplitude.
  const R = (Math.abs(g.scaleA) + Math.abs(g.scaleB) + Math.abs(g.scaleC) + Math.abs(g.scaleD)) * k * 0.85;
  return (
    <>
      {defs(uid, cfg)}
      {!cfg.transparent && <rect width={W} height={H} fill={cfg.baseColor} />}
      <Halo uid={uid} cx={cx0} cy={cy0} rx={Math.max(40, R)} ry={Math.max(40, R)} />
      {lace}
      {/* tiny lit centre mark */}
      <circle cx={cx0} cy={cy0} r={3.5 + k * 3} fill={`url(#${uid}-core)`} stroke={cfg.nodeColor} strokeWidth={1.4} opacity={0.95} />
      {!cfg.transparent && <Vignette uid={uid} />}
    </>
  );
}

/** Linear interpolation. */
function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

/** A regular n-gon's unit boundary point at angle `th` (circumradius 1, one
 *  vertex pointing up). Sampling by angle lets unlike shapes morph point-wise. */
function polyPoint(th: number, n: number): [number, number] {
  const seg = (Math.PI * 2) / n;
  const edgeMid = -Math.PI / 2 + seg / 2; // a vertex sits at -π/2 (top)
  const a = ((((th - edgeMid) % seg) + seg) % seg) - seg / 2; // 0 at an edge midpoint
  const r = Math.cos(seg / 2) / Math.cos(a);
  return [r * Math.cos(th), r * Math.sin(th)];
}

/** A 5-point star's unit boundary point at angle `th`. */
function starPoint(th: number): [number, number] {
  const seg = (Math.PI * 2) / 5;
  const m = ((((th + Math.PI / 2) % seg) + seg) % seg) / seg; // 0..1 along a spoke
  const v = Math.abs(m * 2 - 1); // 1 at a vertex, 0 at a notch
  const r = 0.4 + 0.6 * v;
  return [r * Math.cos(th), r * Math.sin(th)];
}

/** A ripple shape's unit boundary point at angle `th` (extent ≈ 1). */
function shapePoint(kind: RippleShapeKind, th: number): [number, number] {
  switch (kind) {
    case 'circle':
      return [Math.cos(th), Math.sin(th)];
    case 'ellipse':
      return [Math.cos(th), 0.74 * Math.sin(th)];
    case 'rectangle': {
      const c = Math.cos(th);
      const s = Math.sin(th);
      const k = 1 / Math.max(Math.abs(c), Math.abs(s) / 0.64);
      return [c * k, s * k];
    }
    case 'triangle':
      return polyPoint(th, 3);
    case 'diamond':
      return polyPoint(th, 4);
    case 'pentagon':
      return polyPoint(th, 5);
    case 'hexagon':
      return polyPoint(th, 6);
    case 'octagon':
      return polyPoint(th, 8);
    case 'star':
      return starPoint(th);
  }
}

/* ─────────────────────────────────────────────────────────────────────────
 * Intaglio — engraved-banknote line-art, built from two independently
 * controllable systems (see IntaglioConfig):
 *   1. WAVES  — a full-bleed sine-band guilloché substrate (amplitude /
 *               frequency / phase), each row carrying a near-miss twin for moiré;
 *               its colour palette cycles down the rows.
 *   2. RIPPLE — concentric rings that MORPH point-by-point from a start shape to
 *               an end shape (each with its own scale / position / rotation),
 *               interpolated over `steps`; its colour palette cycles across rings.
 * Global knobs still apply: Scale zooms the medallion, Density drives the
 * wave-row count, Line weight / Glow / Vignette as elsewhere.
 * ───────────────────────────────────────────────────────────────────────── */
function Intaglio({ cfg, uid }: MotifProps) {
  const sw = cfg.lineWidth;
  const ic = cfg.intaglio ?? DEFAULT_INTAGLIO;
  const REF = 340; // reference radius for a shape.scale of 1 (before global Scale)
  // Per-system palettes (fall back to the global accent if a list is empty).
  const waveColors = ic.waves.colors.length ? ic.waves.colors : [cfg.accent];
  const rippleColors = ic.ripple.colors.length ? ic.ripple.colors : [cfg.accent];

  /* 2. RIPPLE — sample both shapes once, then morph + transform per ring. */
  const { start, end } = ic.ripple;
  const steps = Math.max(2, Math.round(ic.ripple.steps));
  const samples = 200;
  const startUnit: [number, number][] = [];
  const endUnit: [number, number][] = [];
  for (let j = 0; j <= samples; j++) {
    const th = (j / samples) * Math.PI * 2;
    startUnit.push(shapePoint(start.kind, th));
    endUnit.push(shapePoint(end.kind, th));
  }
  const ringPath = (i: number) => {
    const t = steps === 1 ? 0 : i / (steps - 1);
    const scale = lerp(start.scale, end.scale, t) * REF * cfg.scale;
    const cx = CX + (lerp(start.x, end.x, t) / 100) * W;
    const cy = CY + (lerp(start.y, end.y, t) / 100) * H;
    const rot = (lerp(start.rotation, end.rotation, t) * Math.PI) / 180;
    const cr = Math.cos(rot);
    const sr = Math.sin(rot);
    let d = '';
    for (let j = 0; j <= samples; j++) {
      const ux = lerp(startUnit[j][0], endUnit[j][0], t);
      const uy = lerp(startUnit[j][1], endUnit[j][1], t);
      const x = cx + (ux * cr - uy * sr) * scale;
      const y = cy + (ux * sr + uy * cr) * scale;
      d += `${j ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)} `;
    }
    return `${d}Z`;
  };
  const rings: React.ReactNode[] = [];
  for (let i = 0; i < steps; i++) {
    const t = steps === 1 ? 0 : i / (steps - 1);
    rings.push(
      <path key={`rp${i}`} d={ringPath(i)} fill="none" stroke={rippleColors[i % rippleColors.length]} strokeWidth={(0.6 + (i === 0 ? 0.4 : 0)) * sw} opacity={Math.max(0.12, 0.5 - t * 0.34)} />,
    );
  }
  const cx0 = CX + (start.x / 100) * W;
  const cy0 = CY + (start.y / 100) * H;
  const startR = Math.abs(start.scale) * REF * cfg.scale;

  /* 1. WAVES — full-bleed sine-band guilloché substrate. */
  const waveRows = 9 + Math.round(cfg.density * 18);
  const waveGap = H / waveRows;
  const waveAmp = ic.waves.amplitude;
  const waveFreq = 0.011 * ic.waves.frequency;
  const waveFreq2 = 0.029 * ic.waves.frequency;
  const wavePhase = (ic.waves.phase * Math.PI) / 180;
  const waveLine = (baseY: number, fmul: number, ph: number, color: string, op: number, key: string, stepsW = 140) => {
    let d = '';
    for (let i = 0; i <= stepsW; i++) {
      const x = (i / stepsW) * W;
      const y = baseY + waveAmp * Math.sin(waveFreq * fmul * x + ph) + waveAmp * 0.42 * Math.sin(waveFreq2 * fmul * x + ph * 1.7);
      d += `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)} `;
    }
    return <path key={key} d={d} fill="none" stroke={color} strokeWidth={0.5 * sw} opacity={op} />;
  };
  const waves: React.ReactNode[] = [];
  for (let r = 0; r <= waveRows; r++) {
    const y = r * waveGap;
    const col = waveColors[r % waveColors.length]; // palette cycles down the rows
    waves.push(waveLine(y, 1, wavePhase, col, 0.1, `wv${r}`));
    waves.push(waveLine(y, 1.04, wavePhase + 0.6, col, 0.08, `wv${r}t`)); // near-miss twin
  }

  return (
    <>
      {defs(uid, cfg)}
      {!cfg.transparent && <rect width={W} height={H} fill={cfg.baseColor} />}
      {waves}
      <Halo uid={uid} cx={cx0} cy={cy0} rx={startR * 2.2} ry={startR * 1.9} />
      {/* lit focal core at the start-shape centre */}
      <circle cx={cx0} cy={cy0} r={5 + cfg.scale * 5} fill={`url(#${uid}-core)`} stroke={cfg.nodeColor} strokeWidth={1.2 * sw} opacity={0.9} />
      {rings}
      {!cfg.transparent && <Vignette uid={uid} />}
    </>
  );
}

const MOTIFS: Record<PatternConfig['motif'], (p: MotifProps) => React.ReactNode> = {
  rosette: Rosette,
  intaglio: Intaglio,
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
