import clsx from 'clsx';

/* -------------------------------------------------------------------------- *
 * Heatmap — a calendar-style intensity grid (weeks × days) for activity volume
 * over time, à la a contribution graph. Values are bucketed into four opacity
 * steps of the tone; zero reads as an empty well. Pure <div> grid with optional
 * row / column labels and a Less→More legend. Deterministic, server-renderable.
 * -------------------------------------------------------------------------- */

const HEAT_RGB = {
  fi: '37, 99, 235',
  match: '232, 148, 31',
  ok: '16, 185, 129',
  alert: '192, 57, 43',
} as const;

export type HeatTone = keyof typeof HEAT_RGB;

/** Opacity for the empty cell and the four intensity buckets. */
const BUCKET_ALPHA = [0.16, 0.4, 0.62, 0.84, 1] as const;

export function Heatmap({
  values,
  columns,
  rows = 7,
  tone = 'fi',
  rowLabels,
  colLabels,
  gap = 3,
  legend = true,
  className,
  ariaLabel = 'activity heatmap',
}: {
  /** Flat series, column-major: index = col * rows + row. */
  values: number[];
  columns: number;
  rows?: number;
  tone?: HeatTone;
  /** One entry per row (e.g. weekday initials); blanks render nothing. */
  rowLabels?: (string | undefined)[];
  /** Sparse column headers, e.g. month markers. */
  colLabels?: { col: number; label: string }[];
  gap?: number;
  legend?: boolean;
  className?: string;
  ariaLabel?: string;
}) {
  const max = Math.max(...values, 1);
  const rgb = HEAT_RGB[tone];
  const gutter = rowLabels ? 26 : 0;

  /** Empty → faint ink well; otherwise an increasing-opacity tone fill. */
  const cellStyle = (v: number) => {
    if (v <= 0) return { backgroundColor: `rgba(${rgb}, ${BUCKET_ALPHA[0]})` };
    const bucket = Math.min(4, Math.ceil((v / max) * 4)); // 1..4
    return { backgroundColor: `rgba(${rgb}, ${BUCKET_ALPHA[bucket]})` };
  };

  return (
    <div className={clsx('w-full', className)} role="img" aria-label={ariaLabel}>
      {colLabels && (
        <div className="relative mb-1.5 h-3 text-[10px] text-muted" style={{ marginLeft: gutter }}>
          {colLabels.map(({ col, label }) => (
            <span
              key={`${col}-${label}`}
              className="absolute -translate-x-1/2 whitespace-nowrap"
              style={{ left: `${((col + 0.5) / columns) * 100}%` }}
            >
              {label}
            </span>
          ))}
        </div>
      )}

      <div className="flex" style={{ gap }}>
        {rowLabels && (
          <div className="flex flex-col text-[10px] leading-none text-muted" style={{ width: gutter, gap }}>
            {Array.from({ length: rows }).map((_, r) => (
              <span key={r} className="flex flex-1 items-center justify-end pr-1">
                {rowLabels[r] ?? ''}
              </span>
            ))}
          </div>
        )}

        <div className="flex flex-1" style={{ gap }}>
          {Array.from({ length: columns }).map((_, c) => (
            <div key={c} className="flex flex-1 flex-col" style={{ gap }}>
              {Array.from({ length: rows }).map((_, r) => {
                const v = values[c * rows + r] ?? 0;
                return (
                  <div
                    key={r}
                    className="aspect-square w-full rounded-[3px]"
                    style={cellStyle(v)}
                    title={`${v}`}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {legend && (
        <div className="mt-3 flex items-center justify-end gap-1.5 text-[10px] text-muted">
          <span>Less</span>
          {BUCKET_ALPHA.map((a, i) => (
            <span
              key={i}
              className="h-2.5 w-2.5 rounded-[3px]"
              style={{ backgroundColor: `rgba(${rgb}, ${a})` }}
            />
          ))}
          <span>More</span>
        </div>
      )}
    </div>
  );
}
