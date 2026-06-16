import type { ReactNode } from 'react';
import clsx from 'clsx';
import { StatusDot, type StatusTone } from '../primitives/StatusDot';

/* -------------------------------------------------------------------------- *
 * ActivityFeed — a vertical event stream (alerts cleared, matches found, syncs)
 * with a connecting rail down the markers. Each item gets a status dot (or a
 * custom glyph), a title, an optional description and a right-aligned timestamp.
 * The dark counterpart to Screen 4's board; server-renderable.
 *
 * Distinct from deconflict/ActivityTimeline, which is a horizontal Gantt of
 * overlapping date ranges — this is a chronological list.
 * -------------------------------------------------------------------------- */

export type FeedItem = {
  id: string;
  tone?: StatusTone;
  title: ReactNode;
  description?: ReactNode;
  time?: ReactNode;
  /** Replaces the default status dot (e.g. a Phosphor icon). */
  icon?: ReactNode;
  pulse?: boolean;
};

export function ActivityFeed({
  items,
  className,
}: {
  items: FeedItem[];
  className?: string;
}) {
  return (
    <ul className={clsx('relative', className)}>
      {items.map((item, i) => {
        const last = i === items.length - 1;
        return (
          <li key={item.id} className="relative flex gap-3 pb-5 last:pb-0">
            {!last && (
              <span aria-hidden className="absolute bottom-0 left-[5px] top-4 w-px bg-hair" />
            )}
            <span className="relative z-10 mt-1 flex h-3 w-3 items-center justify-center">
              {item.icon ?? <StatusDot tone={item.tone ?? 'idle'} size="md" pulse={item.pulse} />}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline justify-between gap-2">
                <p className="min-w-0 text-sm font-medium text-ink">{item.title}</p>
                {item.time && (
                  <span className="shrink-0 text-[11px] tabular-nums text-muted">{item.time}</span>
                )}
              </div>
              {item.description && <p className="mt-0.5 text-xs text-muted">{item.description}</p>}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
