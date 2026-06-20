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
  /** Base ridge stroke width in px. Default derived from size. */
  strokeWidth?: number;
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
  const gap = rng.range(0.25, 0.7); // angular opening (radians)
  const gapStart = rng.range(0, TAU);
  const spiral = rng.range(-0.18, 0.18); // gap drift per ridge → whorl swirl
  const twist = rng.range(-0.05, 0.05);

  const ridges: Pt[][] = [];
  for (let i = 0; i < ctx.ridgeCount; i++) {
    const t = i / (ctx.ridgeCount - 1);
    const a0 = gapStart + gap / 2 + i * spiral;
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
    for (const seg of breakRidge(ring, rng, ctx.breakChance)) ridges.push(seg);
  }
  return ridges;
}

function buildLoop(ctx: BuildCtx): Pt[][] {
  const { rng, size } = ctx;
  const cx = size / 2 + rng.range(-size * 0.02, size * 0.02);
  const cy = size * rng.range(0.4, 0.46); // core sits high; legs hang down
  const gap = rng.range(0.7, 1.15); // wide opening at the bottom
  const lean = rng.range(-0.25, 0.25); // loop tilts left/right
  const legStretch = rng.range(1.15, 1.4);

  const ridges: Pt[][] = [];
  for (let i = 0; i < ctx.ridgeCount; i++) {
    const t = i / (ctx.ridgeCount - 1);
    const a0 = HALF_PI + gap / 2 + lean;
    const a1 = HALF_PI + TAU - gap / 2 + lean;
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
    for (const seg of breakRidge(ring, rng, ctx.breakChance)) ridges.push(seg);
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
    for (const seg of breakRidge(pts, rng, ctx.breakChance * 0.7)) ridges.push(seg);
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
  const ridgeCount = Math.round(lerp(7, 20, density));

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

  const breakChance = rng.range(0.25, 0.55);

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

  const contours =
    pattern === 'whorl' ? buildWhorl(ctx) : pattern === 'loop' ? buildLoop(ctx) : buildArch(ctx);

  // Keep ridges visually separate: cap the stroke below the ridge spacing so
  // adjacent ridges never merge into a solid blob, even at high density.
  const spacing = (outerR - coreR) / Math.max(1, ridgeCount - 1);
  const maxStroke = Math.max(1, spacing * 0.5);
  const baseWidth = Math.min(
    options.strokeWidth ?? size * lerp(0.018, 0.01, density),
    maxStroke,
  );

  const paths: RidgePath[] = [];
  for (const contour of contours) {
    const d = smooth(contour, false);
    if (!d) continue;
    const width = Math.min(maxStroke, baseWidth * rng.range(0.85, 1.12));
    paths.push({ d, width: round(Math.max(0.75, width)) });
  }

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
