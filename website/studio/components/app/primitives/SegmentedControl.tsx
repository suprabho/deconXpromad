import type { ReactNode } from 'react';
import clsx from 'clsx';

/* -------------------------------------------------------------------------- *
 * SegmentedControl — a frosted pill group with one active segment. This is the
 * "All · Confirmed · Filtered" filter row on the analytics dashboard (Screen 3)
 * and the search-mode toggle (Screen 2). Presentational: the caller owns the
 * active `value` and the `onSelect` callback.
 * -------------------------------------------------------------------------- */

export type Segment = { value: string; label: string; icon?: ReactNode };

const SIZES = { sm: 'h-8 text-xs', md: 'h-9 text-sm' } as const;

export function SegmentedControl({
  segments,
  value,
  onSelect,
  size = 'md',
  className,
}: {
  segments: Segment[];
  value: string;
  onSelect?: (value: string) => void;
  size?: keyof typeof SIZES;
  className?: string;
}) {
  return (
    <div
      role="tablist"
      className={clsx(
        'inline-flex items-center gap-1 rounded-xl border border-white/60 bg-white/50 p-1 shadow-field-inset backdrop-blur-sm',
        className
      )}
    >
      {segments.map((seg) => {
        const selected = seg.value === value;
        return (
          <button
            key={seg.value}
            type="button"
            role="tab"
            aria-selected={selected}
            onClick={onSelect ? () => onSelect(seg.value) : undefined}
            className={clsx(
              'inline-flex items-center gap-1.5 rounded-lg px-3 font-semibold tracking-wide transition-all',
              SIZES[size],
              selected
                ? 'bg-fi text-white shadow-glass-sm'
                : 'text-muted hover:bg-white/70 hover:text-ink'
            )}
          >
            {seg.icon && <span className="shrink-0">{seg.icon}</span>}
            {seg.label}
          </button>
        );
      })}
    </div>
  );
}
