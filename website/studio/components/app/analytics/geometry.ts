/* -------------------------------------------------------------------------- *
 * Shared chart geometry — turns a numeric series into SVG coordinates and path
 * strings. Pure functions, no DOM, so every chart (Sparkline, AreaChart) stays
 * server-renderable and deterministic. All charts draw into a normalised
 * viewBox (default 100 × 32) and scale to the container via CSS.
 * -------------------------------------------------------------------------- */

export type Point = { x: number; y: number };

/** Map values to evenly-spaced points within [0..w] × [0..h] (y inverted). */
export function toPoints(
  values: number[],
  w = 100,
  h = 32,
  pad = 2
): Point[] {
  if (values.length === 0) return [];
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const innerH = h - pad * 2;
  const step = values.length > 1 ? w / (values.length - 1) : 0;
  return values.map((v, i) => ({
    x: values.length > 1 ? i * step : w / 2,
    y: pad + innerH - ((v - min) / span) * innerH,
  }));
}

/** A polyline path through the points. `smooth` rounds corners with a Catmull-Rom-ish curve. */
export function linePath(points: Point[], smooth = true): string {
  if (points.length === 0) return '';
  if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;
  if (!smooth) {
    return points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${r(p.x)} ${r(p.y)}`).join(' ');
  }
  let d = `M ${r(points[0].x)} ${r(points[0].y)}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[Math.max(0, i - 1)];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[Math.min(points.length - 1, i + 2)];
    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${r(cp1x)} ${r(cp1y)}, ${r(cp2x)} ${r(cp2y)}, ${r(p2.x)} ${r(p2.y)}`;
  }
  return d;
}

/** Close a line path down to the baseline to form a fillable area. */
export function areaPath(points: Point[], h = 32, smooth = true): string {
  if (points.length === 0) return '';
  const line = linePath(points, smooth);
  const last = points[points.length - 1];
  const first = points[0];
  return `${line} L ${r(last.x)} ${h} L ${r(first.x)} ${h} Z`;
}

function r(n: number): number {
  return Math.round(n * 100) / 100;
}
