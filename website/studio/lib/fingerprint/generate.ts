/* -------------------------------------------------------------------------- *
 * Unique fingerprint generator.
 *
 * Turns any seed string into a one-of-a-kind, biometric-looking fingerprint
 * rendered as crisp SVG ridge strokes. The same seed always yields the same
 * print (great for avatars / identity marks keyed off an email, case id, etc.),
 * while different seeds diverge into visibly distinct prints.
 *
 * The look is built from concentric "ridge" contours sampled in polar space and
 * perturbed by a small shared harmonic field, so neighbouring ridges stay
 * roughly parallel — the defining quality of a real fingerprint. Three pattern
 * families mirror the dermatoglyphic classics: whorl, loop and arch. Ridges are
 * randomly broken to suggest minutiae (ridge endings / bifurcations).
 *
 * Output is dependency-free: a standalone <svg> string plus the raw ridge path
 * data, so it can render server-side, inline in React, or export to a file.
 * -------------------------------------------------------------------------- */

import { makeRng, type Rng } from './prng';

export type FingerprintPattern = 'whorl' | 'loop' | 'arch';

export interface FingerprintOptions {
  /** Square viewBox + intrinsic size in px. Default 256. */
  size?: number;
  /** Ridge colour (any CSS colour). Default '#F35B22'. */
  color?: string;
  /** Background fill, or null for transparent. Default null. */
  background?: string | null;
  /** Pattern family, or 'auto' to derive from the seed. Default 'auto'. */
  pattern?: FingerprintPattern | 'auto';
  /** Ridge density 0..1, or undefined to derive from the seed. */
  density?: number;
  /**
   * Ridge weight 0..1 — how bold the bends read. 0 = fine biometric hairlines
   * (many breaks); 1 = bold logo-style ridges (thick, ~filling the ridge gap,
   * clean rounded-capsule ends, few breaks). Default 0.5.
   */
  weight?: number;
  /** Base ridge stroke width in px. Overrides `weight`'s thickness when set. */
  strokeWidth?: number;
  /**
   * Number of bridge minutiae — smooth S-connectors that flow out of one ridge,
   * thread through a gap in the ridge between, and merge into the ridge two over
   * (a real fingerprint feature). Default: 0–2 derived from the seed.
   */
  bridges?: number;
  /** Fraction of the canvas kept clear at the edges. Default 0.1. */
  padding?: number;
  /** Round ridge caps (vs. butt). Default true. */
  roundCaps?: boolean;
}

export interface RidgePath {
  d: string;
  width: number;
}

export interface FingerprintResult {
  seed: string;
  size: number;
  viewBox: string;
  color: string;
  background: string | null;
  pattern: FingerprintPattern;
  paths: RidgePath[];
  /** Fully-assembled, standalone SVG markup. */
  svg: string;
  meta: { ridgeCount: number; strokeWidth: number; segmentCount: number };
}

type Pt = [number, number];
interface Harmonic {
  k: number;
  amp: number;
  phase: number;
}

const TAU = Math.PI * 2;
const HALF_PI = Math.PI / 2;

const round = (n: number) => Math.round(n * 100) / 100;
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n);

/* ----------------------------- curve smoothing ---------------------------- */

/** Catmull-Rom spline through `points` rendered as cubic béziers. */
function smooth(points: Pt[], closed = false): string {
  const n = points.length;
  if (n < 2) return '';
  const at = (i: number): Pt =>
    closed ? points[((i % n) + n) % n] : points[Math.max(0, Math.min(n - 1, i))];

  let d = `M${round(points[0][0])} ${round(points[0][1])}`;
  const segments = closed ? n : n - 1;
  for (let i = 0; i < segments; i++) {
    const p0 = at(i - 1);
    const p1 = at(i);
    const p2 = at(i + 1);
    const p3 = at(i + 2);
    const c1x = p1[0] + (p2[0] - p0[0]) / 6;
    const c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6;
    const c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += `C${round(c1x)} ${round(c1y)} ${round(c2x)} ${round(c2y)} ${round(p2[0])} ${round(p2[1])}`;
  }
  if (closed) d += 'Z';
  return d;
}

/* --------------------------- minutiae (ridge gaps) ------------------------ */

/** Split a ridge into open segments separated by small gaps. */
function breakRidge(points: Pt[], rng: Rng, breakChance: number): Pt[][] {
  if (points.length < 8 || !rng.chance(breakChance)) return [points];
  const breaks = rng.int(1, 2);
  const cuts: number[] = [];
  for (let i = 0; i < breaks; i++) {
    cuts.push(rng.int(Math.floor(points.length * 0.18), Math.floor(points.length * 0.82)));
  }
  cuts.sort((a, b) => a - b);

  const segs: Pt[][] = [];
  let start = 0;
  const gap = rng.int(2, 4);
  for (const c of cuts) {
    if (c - start >= 3) segs.push(points.slice(start, c));
    start = c + gap;
  }
  if (points.length - start >= 3) segs.push(points.slice(start));
  return segs.length ? segs : [points];
}

/* ----------------------------- bridge minutiae ---------------------------- */

/** One broken stroke segment, tagged with the ridge it came from. */
interface RidgeSeg {
  pts: Pt[];
  ring: number;
}

/** A stroke terminal: its point, the ridge it belongs to, and the inward tangent. */
interface Endpoint {
  p: Pt;
  ring: number;
  /** Unit vector from the terminal toward the stroke's interior. */
  inward: Pt;
}

/** Unit vector from `b` toward `a`. */
function unit(a: Pt, b: Pt): Pt {
  const dx = a[0] - b[0];
  const dy = a[1] - b[1];
  const len = Math.hypot(dx, dy) || 1;
  return [dx / len, dy / len];
}

/** Both terminals of every stroke segment, with their inward tangents. */
function collectEndpoints(segments: RidgeSeg[]): Endpoint[] {
  const eps: Endpoint[] = [];
  for (const s of segments) {
    const n = s.pts.length;
    if (n < 3) continue;
    eps.push({ p: s.pts[0], ring: s.ring, inward: unit(s.pts[1], s.pts[0]) });
    eps.push({ p: s.pts[n - 1], ring: s.ring, inward: unit(s.pts[n - 2], s.pts[n - 1]) });
  }
  return eps;
}

/** A disc on a specific ridge whose points are removed (the in-between recess). */
interface ClearZone {
  c: Pt;
  r: number;
  ring: number;
}

interface BridgeResult {
  connectors: string[];
  clears: ClearZone[];
}

/**
 * U-recurve connectors that join two stroke ENDS — never mid-ridge. A connector
 * links a terminal A to the nearest free terminal B exactly TWO ridges away (so
 * there is one ridge genuinely between them) whose end sits near A's, so the
 * hairpin is symmetric. Each stroke is extended straight past its end (handles
 * along −inward) and hooked into a U. The ridge in between is recessed with a
 * clear disc at the span's midpoint, so the bend never overlaps it.
 */
function buildBridges(segments: RidgeSeg[], count: number, rng: Rng, spacing: number): BridgeResult {
  const connectors: string[] = [];
  const clears: ClearZone[] = [];
  if (count <= 0) return { connectors, clears };
  const eps = collectEndpoints(segments);
  if (eps.length < 2) return { connectors, clears };

  // Ends two ridges apart sit ≈ 2·spacing apart radially; this window keeps the
  // pair near-aligned so the U stays uniform (not a long lopsided sweep).
  const minD = spacing * 1.4;
  const maxD = spacing * 3.0;
  const used = new Array<boolean>(eps.length).fill(false);

  // Deterministic shuffle so the recurves spread across the print, not cluster.
  const order = eps.map((_, i) => i);
  for (let i = order.length - 1; i > 0; i--) {
    const j = rng.int(0, i);
    const tmp = order[i];
    order[i] = order[j];
    order[j] = tmp;
  }

  let made = 0;
  for (const ai of order) {
    if (made >= count) break;
    if (used[ai]) continue;
    const A = eps[ai];
    // Nearest free terminal exactly two ridges away (one ridge in between).
    let bi = -1;
    let bd = Infinity;
    for (let k = 0; k < eps.length; k++) {
      if (used[k] || k === ai || Math.abs(eps[k].ring - A.ring) !== 2) continue;
      const d = Math.hypot(eps[k].p[0] - A.p[0], eps[k].p[1] - A.p[1]);
      if (d >= minD && d <= maxD && d < bd) {
        bd = d;
        bi = k;
      }
    }
    if (bi < 0) continue;
    const B = eps[bi];

    const k = bd * rng.range(0.6, 0.85);
    const c1: Pt = [A.p[0] - A.inward[0] * k, A.p[1] - A.inward[1] * k];
    const c2: Pt = [B.p[0] - B.inward[0] * k, B.p[1] - B.inward[1] * k];
    connectors.push(
      `M${round(A.p[0])} ${round(A.p[1])}` +
        `C${round(c1[0])} ${round(c1[1])} ${round(c2[0])} ${round(c2[1])} ${round(B.p[0])} ${round(B.p[1])}`,
    );

    // Recess the ridge in between so the U has clearance — remove its points
    // around the span's midpoint.
    clears.push({
      c: [(A.p[0] + B.p[0]) / 2, (A.p[1] + B.p[1]) / 2],
      r: spacing * 0.95,
      ring: (A.ring + B.ring) / 2,
    });
    used[ai] = true;
    used[bi] = true;
    made++;
  }
  return { connectors, clears };
}

/** Split a segment around any clear disc on its ridge, dropping points inside. */
function applyClears(pts: Pt[], ring: number, clears: ClearZone[]): Pt[][] {
  const zones = clears.filter((z) => z.ring === ring);
  if (!zones.length) return [pts];
  const out: Pt[][] = [];
  let cur: Pt[] = [];
  for (const p of pts) {
    const inside = zones.some((z) => (p[0] - z.c[0]) ** 2 + (p[1] - z.c[1]) ** 2 < z.r * z.r);
    if (inside) {
      if (cur.length >= 3) out.push(cur);
      cur = [];
    } else {
      cur.push(p);
    }
  }
  if (cur.length >= 3) out.push(cur);
  return out;
}

/* ------------------------------ ridge samplers ---------------------------- */

interface RingSpec {
  cx: number;
  cy: number;
  radius: number;
  aspectX: number;
  aspectY: number;
  rot: number;
  a0: number;
  a1: number;
  field: Harmonic[];
  ridgePhase: number;
  samples: number;
}

/** Sample one ridge contour in polar space with the shared harmonic wobble. */
function sampleRing(s: RingSpec): Pt[] {
  const pts: Pt[] = [];
  const cosR = Math.cos(s.rot);
  const sinR = Math.sin(s.rot);
  for (let i = 0; i <= s.samples; i++) {
    const theta = lerp(s.a0, s.a1, i / s.samples);
    let pert = 0;
    for (const h of s.field) pert += h.amp * Math.sin(h.k * theta + h.phase + s.ridgePhase);
    const r = s.radius * (1 + pert);
    const x = r * Math.cos(theta) * s.aspectX;
    const y = r * Math.sin(theta) * s.aspectY;
    pts.push([s.cx + x * cosR - y * sinR, s.cy + x * sinR + y * cosR]);
  }
  return pts;
}

/* -------------------------------- patterns -------------------------------- */

interface BuildCtx {
  rng: Rng;
  size: number;
  outerR: number;
  coreR: number;
  ridgeCount: number;
  field: Harmonic[];
  aspectX: number;
  aspectY: number;
  rot: number;
  breakChance: number;
}

function buildWhorl(ctx: BuildCtx): Pt[][] {
  const { rng, size } = ctx;
  const cx = size / 2 + rng.range(-size * 0.03, size * 0.03);
  const cy = size / 2 + rng.range(-size * 0.03, size * 0.03);
  const baseGap = rng.range(0.22, 0.5); // base angular opening (radians)
  const gapStart = rng.range(0, TAU);
  // A strong, signed per-ridge drift winds the opening all the way around the
  // print, so the ridge ENDPOINTS never stack on one radius (which reads as an
  // unnatural straight seam). Per-ridge jitter + gap-width variation scatter the
  // ends further, like the minutiae of a real fingerprint.
  const spiral = rng.range(0.45, 0.95) * (rng.chance(0.5) ? 1 : -1);
  const twist = rng.range(-0.05, 0.05);

  const ridges: Pt[][] = [];
  for (let i = 0; i < ctx.ridgeCount; i++) {
    const t = i / (ctx.ridgeCount - 1);
    const gap = baseGap * rng.range(0.7, 1.3);
    const center = gapStart + i * spiral + rng.range(-0.4, 0.4);
    const a0 = center + gap / 2;
    const a1 = a0 + (TAU - gap);
    const ring = sampleRing({
      cx,
      cy,
      radius: lerp(ctx.coreR, ctx.outerR, t),
      aspectX: ctx.aspectX,
      aspectY: ctx.aspectY,
      rot: ctx.rot + i * twist,
      a0,
      a1,
      field: ctx.field,
      ridgePhase: i * rng.range(0.02, 0.09),
      samples: 70,
    });
    ridges.push(ring);
  }
  return ridges;
}

function buildLoop(ctx: BuildCtx): Pt[][] {
  const { rng, size } = ctx;
  const cx = size / 2 + rng.range(-size * 0.02, size * 0.02);
  const cy = size * rng.range(0.4, 0.46); // core sits high; legs hang down
  const baseGap = rng.range(0.6, 1.0); // opening at the bottom
  const lean = rng.range(-0.25, 0.25); // loop tilts left/right
  const legStretch = rng.range(1.15, 1.4);
  // The opening stays roughly downward (so it still reads as a loop), but its
  // centre WANDERS smoothly per ridge — so the leg endpoints scatter along the
  // base instead of lining up into a single straight vertical seam.
  const wanderAmp = rng.range(0.3, 0.7);
  const wanderFreq = rng.range(0.55, 1.05);
  const wanderPhase = rng.range(0, TAU);

  const ridges: Pt[][] = [];
  for (let i = 0; i < ctx.ridgeCount; i++) {
    const t = i / (ctx.ridgeCount - 1);
    const gap = baseGap * rng.range(0.8, 1.25);
    const center =
      HALF_PI + lean + wanderAmp * Math.sin(i * wanderFreq + wanderPhase) + rng.range(-0.18, 0.18);
    const a0 = center + gap / 2;
    const a1 = a0 + (TAU - gap);
    const ring = sampleRing({
      cx,
      cy,
      radius: lerp(ctx.coreR, ctx.outerR, t),
      aspectX: ctx.aspectX * lerp(1, 1.05, t),
      aspectY: ctx.aspectY * legStretch,
      rot: ctx.rot * 0.4,
      a0,
      a1,
      field: ctx.field,
      ridgePhase: i * rng.range(0.02, 0.07),
      samples: 72,
    });
    ridges.push(ring);
  }
  return ridges;
}

function buildArch(ctx: BuildCtx): Pt[][] {
  const { rng, size } = ctx;
  const cx = size / 2;
  const half = (ctx.outerR * ctx.aspectX) / 1; // horizontal half-extent
  const left = cx - half;
  const right = cx + half;
  const spread = half * rng.range(0.42, 0.62);
  const tented = rng.chance(0.4);
  const humpBase = ctx.outerR * rng.range(0.55, 0.85) * (tented ? 1.25 : 1);
  const topY = size / 2 - ctx.outerR * 0.55;
  const step = (ctx.outerR * 1.5) / (ctx.ridgeCount - 1);
  const samples = 56;

  const ridges: Pt[][] = [];
  for (let i = 0; i < ctx.ridgeCount; i++) {
    const baseY = topY + i * step;
    const hump = humpBase * lerp(1, 0.55, i / (ctx.ridgeCount - 1));
    const pts: Pt[] = [];
    for (let s = 0; s <= samples; s++) {
      const x = lerp(left, right, s / samples);
      const dx = (x - cx) / spread;
      const bump = tented
        ? Math.exp(-Math.abs(dx) * 1.4) // sharper peak for a tented arch
        : Math.exp(-dx * dx); // gaussian dome
      let wobble = 0;
      for (const h of ctx.field) wobble += h.amp * Math.sin(h.k * dx + h.phase + i * 0.05);
      const y = baseY - hump * bump + ctx.outerR * wobble * 0.4;
      pts.push([x, y]);
    }
    ridges.push(pts);
  }
  return ridges;
}

/* -------------------------------- assembly -------------------------------- */

function buildField(rng: Rng): { field: Harmonic[]; maxPert: number } {
  const count = rng.int(2, 3);
  const field: Harmonic[] = [];
  let maxPert = 0;
  for (let i = 0; i < count; i++) {
    const amp = rng.range(0.02, 0.06);
    field.push({ k: rng.int(2, 5), amp, phase: rng.range(0, TAU) });
    maxPert += amp;
  }
  return { field, maxPert };
}

export function generateFingerprint(
  seed: string,
  options: FingerprintOptions = {},
): FingerprintResult {
  const size = options.size ?? 256;
  const color = options.color ?? '#F35B22';
  const background = options.background ?? null;
  const padding = options.padding ?? 0.1;
  const roundCaps = options.roundCaps ?? true;

  const rng = makeRng(seed);

  const pattern: FingerprintPattern =
    !options.pattern || options.pattern === 'auto'
      ? rng.next() < 0.5
        ? 'whorl'
        : rng.next() < 0.7
          ? 'loop'
          : 'arch'
      : options.pattern;

  const density = options.density != null ? clamp01(options.density) : rng.range(0.4, 0.78);
  const weight = options.weight != null ? clamp01(options.weight) : 0.5;
  // Floor of 5 ridges so a low density can reach the bold, minimal logo look;
  // 20 at the top stays a dense biometric scan.
  const ridgeCount = Math.round(lerp(5, 20, density));

  const { field, maxPert } = buildField(rng);
  const aspect = rng.range(1, 1.45);
  const aspectX = 1 / Math.sqrt(aspect);
  const aspectY = Math.sqrt(aspect);
  const rot = rng.range(-0.5, 0.5);

  // Fit the largest ridge (plus wobble + aspect) inside the padded canvas.
  const usable = (size / 2) * (1 - padding);
  const maxExtent = (1 + maxPert) * Math.max(aspectX, aspectY * (pattern === 'loop' ? 1.4 : 1));
  const outerR = usable / maxExtent;
  const coreR = outerR * rng.range(0.1, 0.2);

  // Bolder ridges read cleaner — taper off the minutiae breaks as weight rises.
  // Arches carry slightly fewer breaks than the curved patterns.
  const breakChance =
    rng.range(0.25, 0.55) * lerp(1.1, 0.3, weight) * (pattern === 'arch' ? 0.7 : 1);

  const ctx: BuildCtx = {
    rng,
    size,
    outerR,
    coreR,
    ridgeCount,
    field,
    aspectX,
    aspectY,
    rot,
    breakChance,
  };

  const rings =
    pattern === 'whorl' ? buildWhorl(ctx) : pattern === 'loop' ? buildLoop(ctx) : buildArch(ctx);

  // Ridge thickness is set as a fraction of the ridge SPACING, driven by weight:
  // fine hairlines (~0.34 of the gap) → bold logo ridges (~0.78, nearly filling
  // it so the round caps read as fat capsule ends). Always capped below the
  // spacing so neighbours never merge into a blob.
  const spacing = (outerR - coreR) / Math.max(1, ridgeCount - 1);
  const strokeRatio = lerp(0.34, 0.78, weight);
  const maxStroke = Math.max(1, spacing * 0.86);
  const baseWidth = Math.min(options.strokeWidth ?? spacing * strokeRatio, maxStroke);
  // Bold ridges hold a steadier width; fine ones vary more for an etched feel.
  const widthJitter = lerp(0.14, 0.05, weight);
  const strokeOf = () =>
    round(Math.max(0.75, Math.min(maxStroke, baseWidth * rng.range(1 - widthJitter, 1 + widthJitter))));

  // Break the rings into their final stroke segments (minutiae + ridge openings).
  const segments: RidgeSeg[] = [];
  for (let ri = 0; ri < rings.length; ri++) {
    for (const seg of breakRidge(rings[ri], rng, ctx.breakChance)) {
      if (seg.length >= 3) segments.push({ pts: seg, ring: ri });
    }
  }

  // U-recurve connectors hook stroke ENDS together (computed from the broken
  // segments, so the bend always lands at a terminal — never mid-ridge), and
  // recess the ridge in between so the bend doesn't overlap it.
  const bridgeCount =
    options.bridges != null ? Math.max(0, Math.round(options.bridges)) : rng.int(0, 2);
  const { connectors, clears } = buildBridges(segments, bridgeCount, rng, spacing);

  const paths: RidgePath[] = [];
  for (const s of segments) {
    for (const piece of applyClears(s.pts, s.ring, clears)) {
      const d = smooth(piece, false);
      if (d) paths.push({ d, width: strokeOf() });
    }
  }
  for (const d of connectors) paths.push({ d, width: strokeOf() });

  const cap = roundCaps ? 'round' : 'butt';
  const bg = background ? `<rect width="${size}" height="${size}" fill="${background}"/>` : '';
  const body = paths
    .map((p) => `<path d="${p.d}" stroke-width="${p.width}"/>`)
    .join('');
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" ` +
    `viewBox="0 0 ${size} ${size}" fill="none" stroke="${color}" ` +
    `stroke-linecap="${cap}" stroke-linejoin="round">${bg}${body}</svg>`;

  return {
    seed,
    size,
    viewBox: `0 0 ${size} ${size}`,
    color,
    background,
    pattern,
    paths,
    svg,
    meta: { ridgeCount, strokeWidth: round(baseWidth), segmentCount: paths.length },
  };
}
