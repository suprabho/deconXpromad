import type { ReactNode } from 'react';
import clsx from 'clsx';

/* -------------------------------------------------------------------------- *
 * DonutChart — a segmented ring for part-to-whole figures (case-status mix,
 * portfolio composition). Each segment is one <circle> with a dash gap, offset
 * by the running total, so the whole thing is pure deterministic SVG — no refs,
 * no client JS. Optional centre figure and a swatch legend to the side.
 * Server-renderable.
 * -------------------------------------------------------------------------- */

export const DONUT_FILL = {
  fi: '#2563EB',
  match: '#E8941F',
  ok: '#10B981',
  alert: '#C0392B',
  navy: '#0D1B3E',
  ink: '#1A2332',
  muted: '#94A3B8',
} as const;

export type DonutTone = keyof typeof DONUT_FILL;
export type DonutSegment = { label: string; value: number; tone?: DonutTone };

export function DonutChart({
  segments,
  size = 140,
  thickness = 16,
  gap = 0,
  centerValue,
  centerLabel,
  legend = true,
  className,
  ariaLabel = 'donut chart',
}: {
  segments: DonutSegment[];
  size?: number;
  thickness?: number;
  /** Degrees of blank space between segments (rounded caps when > 0). */
  gap?: number;
  centerValue?: ReactNode;
  centerLabel?: ReactNode;
  legend?: boolean;
  className?: string;
  ariaLabel?: string;
}) {
  const total = segments.reduce((s, seg) => s + Math.max(0, seg.value), 0) || 1;
  const r = (size - thickness) / 2;
  const C = 2 * Math.PI * r;
  const gapLen = (gap / 360) * C;

  let acc = 0;
  const arcs = segments.map((seg) => {
    const len = (Math.max(0, seg.value) / total) * C;
    const arc = { seg, len, offset: acc };
    acc += len;
    return arc;
  });

  const ring = (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} role="img" aria-label={ariaLabel}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#E5E7EB" strokeWidth={thickness} />
        {arcs.map(({ seg, len, offset }, i) => {
          const visible = Math.max(0, len - gapLen);
          return (
            <circle
              key={i}
              cx={size / 2}
              cy={size / 2}
              r={r}
              fill="none"
              stroke={DONUT_FILL[seg.tone ?? 'fi']}
              strokeWidth={thickness}
              strokeDasharray={`${visible} ${C - visible}`}
              strokeDashoffset={-offset}
              strokeLinecap={gap > 0 ? 'round' : 'butt'}
              transform={`rotate(-90 ${size / 2} ${size / 2})`}
            />
          );
        })}
      </svg>
      {(centerValue != null || centerLabel != null) && (
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
          {centerValue != null && (
            <span className="text-2xl font-bold tabular-nums tracking-tight text-ink">{centerValue}</span>
          )}
          {centerLabel != null && (
            <span className="mt-0.5 text-[11px] font-medium uppercase tracking-wide text-muted">{centerLabel}</span>
          )}
        </div>
      )}
    </div>
  );

  if (!legend) return <div className={clsx('inline-flex', className)}>{ring}</div>;

  return (
    <div className={clsx('flex items-center gap-5', className)}>
      {ring}
      <ul className="min-w-0 flex-1 space-y-2">
        {segments.map((seg, i) => {
          const pct = Math.round((Math.max(0, seg.value) / total) * 100);
          return (
            <li key={i} className="flex items-center gap-2 text-sm">
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ background: DONUT_FILL[seg.tone ?? 'fi'] }}
              />
              <span className="min-w-0 flex-1 truncate text-ink">{seg.label}</span>
              <span className="shrink-0 font-semibold tabular-nums text-muted">{pct}%</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
