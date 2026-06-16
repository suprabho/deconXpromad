import clsx from 'clsx';

/* -------------------------------------------------------------------------- *
 * PageDots — the carousel dot indicator from the bottom-right of Screen 1. A
 * row of dots with the active page elongated into a pill. Presentational.
 * -------------------------------------------------------------------------- */

export function PageDots({
  count,
  active,
  onSelect,
  className,
}: {
  count: number;
  /** Zero-based active index. */
  active: number;
  onSelect?: (index: number) => void;
  className?: string;
}) {
  return (
    <div className={clsx('flex items-center gap-1.5', className)} role="tablist" aria-label="Pages">
      {Array.from({ length: count }, (_, i) => {
        const selected = i === active;
        return (
          <button
            key={i}
            type="button"
            role="tab"
            aria-selected={selected}
            aria-label={`Page ${i + 1}`}
            onClick={onSelect ? () => onSelect(i) : undefined}
            className={clsx(
              'h-1.5 rounded-full transition-all',
              selected ? 'w-4 bg-fi' : 'w-1.5 bg-ink/20 hover:bg-ink/40'
            )}
          />
        );
      })}
    </div>
  );
}
