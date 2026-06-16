import type { ReactNode } from 'react';
import clsx from 'clsx';

/* -------------------------------------------------------------------------- *
 * MetricPanel — the dark navy analytics surface from the right of Screen 3.
 * A header row (title + optional action) over a body that hosts big figures, a
 * sparkline and a bar chart. The dark counterpart to <Panel>; pass dark-tone
 * children (StatCard tone="dark", Sparkline tone="white", BarChart). SSR-safe.
 * -------------------------------------------------------------------------- */

export function MetricPanel({
  title,
  action,
  children,
  className,
}: {
  title?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={clsx(
        'overflow-hidden rounded-2xl border border-white/10 bg-navy text-white shadow-glass',
        className
      )}
    >
      {(title || action) && (
        <header className="flex items-center gap-3 border-b border-white/10 px-5 py-3.5">
          {title && <h2 className="text-sm font-bold tracking-wide text-white">{title}</h2>}
          {action && <div className="ml-auto">{action}</div>}
        </header>
      )}
      <div className="p-5">{children}</div>
    </section>
  );
}

/** A large figure + caption pair, on the dark panel. */
export function MetricFigure({
  value,
  caption,
  className,
}: {
  value: ReactNode;
  caption: ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <p className="text-3xl font-bold tracking-tight tabular-nums text-white">{value}</p>
      <p className="mt-1 text-xs text-white/60">{caption}</p>
    </div>
  );
}
