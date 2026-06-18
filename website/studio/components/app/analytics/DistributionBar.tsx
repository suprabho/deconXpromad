import clsx from 'clsx';

/* -------------------------------------------------------------------------- *
 * DistributionBar — a single horizontal stacked bar for a status / category
 * mix (pipeline stages, risk tiers), with a swatch legend underneath. Flex'd
 * <div> segments in a recessed track, so the rounded ends stay crisp at any
 * width. Server-renderable.
 * -------------------------------------------------------------------------- */

const SEG_FILL = {
  fi: 'bg-fi',
  match: 'bg-match',
  ok: 'bg-success',
  warn: 'bg-caution',
  alert: 'bg-risk-text',
  navy: 'bg-navy',
  ink: 'bg-ink',
  muted: 'bg-muted/50',
} as const;

export type DistTone = keyof typeof SEG_FILL;
export type DistSegment = { label: string; value: number; tone?: DistTone };

export function DistributionBar({
  segments,
  height = 12,
  legend = true,
  showPercent = true,
  className,
  ariaLabel = 'distribution',
}: {
  segments: DistSegment[];
  height?: number;
  legend?: boolean;
  /** Legend shows the share as a percent (default) or the raw value. */
  showPercent?: boolean;
  className?: string;
  ariaLabel?: string;
}) {
  const total = segments.reduce((s, x) => s + Math.max(0, x.value), 0) || 1;

  return (
    <div className={clsx('space-y-3', className)}>
      <div
        className="flex w-full overflow-hidden rounded-full bg-ink/5 shadow-field-inset"
        style={{ height }}
        role="img"
        aria-label={ariaLabel}
      >
        {segments.map((seg, i) => {
          const pct = (Math.max(0, seg.value) / total) * 100;
          if (pct <= 0) return null;
          return (
            <div
              key={i}
              className={clsx('h-full first:rounded-l-full last:rounded-r-full', SEG_FILL[seg.tone ?? 'fi'])}
              style={{ width: `${pct}%` }}
              title={`${seg.label}: ${seg.value}`}
            />
          );
        })}
      </div>
      {legend && (
        <ul className="flex flex-wrap gap-x-5 gap-y-1.5">
          {segments.map((seg, i) => {
            const pct = Math.round((Math.max(0, seg.value) / total) * 100);
            return (
              <li key={i} className="flex items-center gap-1.5 text-xs">
                <span className={clsx('h-2 w-2 rounded-full', SEG_FILL[seg.tone ?? 'fi'])} />
                <span className="text-ink">{seg.label}</span>
                <span className="font-semibold tabular-nums text-muted">
                  {showPercent ? `${pct}%` : seg.value}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
