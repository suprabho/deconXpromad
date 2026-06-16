import clsx from 'clsx';

/* -------------------------------------------------------------------------- *
 * BarChart — the column chart from Screen 3's dark metric panel. Renders with
 * flex'd <div> bars (not SVG) so the rounded caps and gaps stay crisp at any
 * width and the bars can carry hover/labels later. Server-renderable.
 * -------------------------------------------------------------------------- */

const FILLS = {
  fi: 'bg-fi',
  match: 'bg-match',
  ok: 'bg-emerald-500',
  white: 'bg-white/80',
  ink: 'bg-ink',
} as const;

export type Bar = { value: number; label?: string; highlight?: boolean };

export function BarChart({
  data,
  tone = 'fi',
  highlightTone = 'match',
  height = 120,
  showLabels = false,
  className,
  ariaLabel = 'bar chart',
}: {
  data: (number | Bar)[];
  tone?: keyof typeof FILLS;
  /** Fill used for bars flagged `highlight`. */
  highlightTone?: keyof typeof FILLS;
  height?: number;
  showLabels?: boolean;
  className?: string;
  ariaLabel?: string;
}) {
  const bars: Bar[] = data.map((d) => (typeof d === 'number' ? { value: d } : d));
  const max = Math.max(...bars.map((b) => b.value), 1);

  return (
    <div className={clsx('w-full', className)} role="img" aria-label={ariaLabel}>
      <div className="flex items-end justify-between gap-1.5" style={{ height }}>
        {bars.map((bar, i) => (
          <div
            key={i}
            className={clsx(
              'w-full rounded-t-md transition-[height]',
              bar.highlight ? FILLS[highlightTone] : FILLS[tone]
            )}
            style={{ height: `${(bar.value / max) * 100}%` }}
            title={bar.label ? `${bar.label}: ${bar.value}` : String(bar.value)}
          />
        ))}
      </div>
      {showLabels && (
        <div className="mt-2 flex justify-between gap-1.5 text-[11px] text-muted">
          {bars.map((bar, i) => (
            <span key={i} className="w-full truncate text-center">
              {bar.label}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
