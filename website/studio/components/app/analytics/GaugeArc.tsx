import type { ReactNode } from 'react';
import clsx from 'clsx';

/* -------------------------------------------------------------------------- *
 * GaugeArc — a 180° semicircular gauge for a single bounded score (composite
 * risk, confidence, capacity). A grey track arc with a coloured value arc over
 * it and a dot at the tip; the figure sits in the bowl. `thresholds` auto-tints
 * the arc ok → warn → alert. Pure SVG arcs, server-renderable.
 * -------------------------------------------------------------------------- */

const GAUGE_STROKE = {
  fi: '#1A56DB', // cobalt
  match: '#2F8F5C', // verified green
  ok: '#2F8F5C', // verified green
  warn: '#A66A00', // caution amber
  alert: '#B91C1C', // alert red
} as const;

export type GaugeTone = keyof typeof GAUGE_STROKE;

/** Point on the arc at `pct` (0..1) across the sweep from 180° (left) to 0° (right). */
function polar(cx: number, cy: number, r: number, pct: number) {
  const a = Math.PI - pct * Math.PI;
  return { x: cx + r * Math.cos(a), y: cy - r * Math.sin(a) };
}

export function GaugeArc({
  value,
  min = 0,
  max = 100,
  tone,
  thresholds,
  label,
  caption,
  unit = '',
  size = 200,
  thickness = 11,
  showRange = true,
  className,
  ariaLabel = 'gauge',
}: {
  value: number;
  min?: number;
  max?: number;
  /** Force a colour; otherwise derived from `thresholds`, else `fi`. */
  tone?: GaugeTone;
  /** Auto-colour breakpoints as fractions 0..1 of the range. */
  thresholds?: { warn: number; alert: number };
  label?: ReactNode;
  caption?: ReactNode;
  unit?: string;
  size?: number;
  thickness?: number;
  /** Show the min / max end labels under the arc. */
  showRange?: boolean;
  className?: string;
  ariaLabel?: string;
}) {
  const span = max - min || 1;
  const pct = Math.max(0, Math.min(1, (value - min) / span));

  const derived: GaugeTone =
    tone ??
    (thresholds
      ? pct >= thresholds.alert
        ? 'alert'
        : pct >= thresholds.warn
          ? 'warn'
          : 'ok'
      : 'fi');

  const cx = 50;
  const cy = 50;
  const r = 44;
  const pad = (50 - r) + thickness / 2; // keep the round caps inside the viewBox
  const rr = r - thickness / 2;

  const start = polar(cx, cy, rr, 0);
  const end = polar(cx, cy, rr, 1);
  const tip = polar(cx, cy, rr, pct);

  const track = `M ${start.x} ${start.y} A ${rr} ${rr} 0 0 1 ${end.x} ${end.y}`;
  const fill = `M ${start.x} ${start.y} A ${rr} ${rr} 0 0 1 ${tip.x} ${tip.y}`;

  return (
    <div className={clsx('flex flex-col items-center', className)}>
      <div className="relative w-full" style={{ maxWidth: size }}>
        <svg viewBox={`0 0 100 ${cy + pad}`} className="w-full" role="img" aria-label={ariaLabel}>
          <path d={track} fill="none" stroke="#D6DCE8" strokeWidth={thickness} strokeLinecap="round" />
          <path d={fill} fill="none" stroke={GAUGE_STROKE[derived]} strokeWidth={thickness} strokeLinecap="round" />
          <circle cx={tip.x} cy={tip.y} r={thickness / 2.6} fill="#fff" stroke={GAUGE_STROKE[derived]} strokeWidth="1.6" />
        </svg>
        <div className="absolute inset-x-0 bottom-0 flex flex-col items-center">
          <span className="text-3xl font-bold tabular-nums tracking-tight text-ink">
            {Math.round(value)}
            {unit}
          </span>
          {label && (
            <span className="text-[11px] font-semibold uppercase tracking-wide text-muted">{label}</span>
          )}
        </div>
      </div>
      {showRange && (
        <div className="flex w-full justify-between text-[11px] tabular-nums text-muted" style={{ maxWidth: size }}>
          <span>{min}{unit}</span>
          <span>{max}{unit}</span>
        </div>
      )}
      {caption && <p className="mt-1 text-center text-xs text-muted">{caption}</p>}
    </div>
  );
}
