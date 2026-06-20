/* -------------------------------------------------------------------------- *
 * Deterministic, seedable PRNG.
 *
 * `xmur3` hashes a string into a 32-bit state generator; `sfc32` is a fast,
 * well-distributed PRNG seeded from four 32-bit words. Together they turn any
 * string ("hello@promad.design", a case id, a uuid…) into a repeatable stream
 * of numbers — so the same seed always paints the same fingerprint.
 * -------------------------------------------------------------------------- */

/** Hash a string into a function that emits 32-bit seed words. */
export function xmur3(str: string): () => number {
  let h = 1779033703 ^ str.length;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return () => {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    h ^= h >>> 16;
    return h >>> 0;
  };
}

/** sfc32 — returns floats in [0, 1). */
export function sfc32(a: number, b: number, c: number, d: number): () => number {
  return () => {
    a >>>= 0;
    b >>>= 0;
    c >>>= 0;
    d >>>= 0;
    let t = (a + b) | 0;
    a = b ^ (b >>> 9);
    b = (c + (c << 3)) | 0;
    c = (c << 21) | (c >>> 11);
    d = (d + 1) | 0;
    t = (t + d) | 0;
    c = (c + t) | 0;
    return (t >>> 0) / 4294967296;
  };
}

export interface Rng {
  /** Next float in [0, 1). */
  next(): number;
  /** Float in [min, max). */
  range(min: number, max: number): number;
  /** Integer in [min, max] inclusive. */
  int(min: number, max: number): number;
  /** True with probability p. */
  chance(p: number): boolean;
  /** Random element of an array. */
  pick<T>(items: readonly T[]): T;
}

/** Build a seeded Rng from a string. */
export function makeRng(seed: string): Rng {
  const h = xmur3(seed || 'seed');
  const raw = sfc32(h(), h(), h(), h());
  // Warm up — the first few outputs of sfc32 from a fresh seed are slightly
  // correlated; discarding them decorrelates similar seeds ("a" vs "b").
  for (let i = 0; i < 16; i++) raw();

  return {
    next: raw,
    range: (min, max) => min + (max - min) * raw(),
    int: (min, max) => min + Math.floor((max - min + 1) * raw()),
    chance: (p) => raw() < p,
    pick: (items) => items[Math.floor(raw() * items.length)] as never,
  };
}
