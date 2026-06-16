import type { ReactNode } from 'react';
import clsx from 'clsx';
import { ProgressBar, type ProgressTone } from '../primitives/ProgressBar';

/* -------------------------------------------------------------------------- *
 * RankList — an ordered leaderboard (top exposures, busiest connectors). Each
 * row carries a rank chip, a label (+ optional sub-line and leading glyph), a
 * formatted figure, and an inline meter scaled to the largest `value`. Reuses
 * <ProgressBar>; server-renderable.
 * -------------------------------------------------------------------------- */

export type RankItem = {
  label: ReactNode;
  /** Numeric magnitude → bar width, relative to the largest item. */
  value: number;
  /** Formatted figure shown on the right; defaults to `value`. */
  display?: ReactNode;
  sub?: ReactNode;
  tone?: ProgressTone;
  leading?: ReactNode;
};

export function RankList({
  items,
  tone = 'fi',
  showRank = true,
  showBar = true,
  className,
}: {
  items: RankItem[];
  tone?: ProgressTone;
  showRank?: boolean;
  showBar?: boolean;
  className?: string;
}) {
  const max = Math.max(...items.map((i) => i.value), 1);

  return (
    <ol className={clsx('space-y-3.5', className)}>
      {items.map((item, i) => (
        <li key={i} className="flex items-center gap-3">
          {showRank && (
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-ink/5 text-xs font-bold tabular-nums text-muted">
              {i + 1}
            </span>
          )}
          {item.leading}
          <div className="min-w-0 flex-1">
            <div className="flex items-baseline justify-between gap-2">
              <span className="min-w-0 truncate text-sm font-medium text-ink">{item.label}</span>
              <span className="shrink-0 text-sm font-semibold tabular-nums text-ink">
                {item.display ?? item.value}
              </span>
            </div>
            {item.sub && <p className="truncate text-xs text-muted">{item.sub}</p>}
            {showBar && (
              <ProgressBar
                value={(item.value / max) * 100}
                tone={item.tone ?? tone}
                size="sm"
                className="mt-1.5"
                label={typeof item.label === 'string' ? item.label : undefined}
              />
            )}
          </div>
        </li>
      ))}
    </ol>
  );
}
