import type { ReactNode } from 'react';
import clsx from 'clsx';
import { PlusIcon } from '@phosphor-icons/react/dist/ssr';
import type { StatusTone } from '../primitives/StatusDot';
import { StatusDot } from '../primitives/StatusDot';

/* -------------------------------------------------------------------------- *
 * Board + BoardColumn — the lane layout behind Screen 4. Board is a horizontal,
 * scroll-snapping row of columns; BoardColumn is a titled lane with a count, a
 * card stack, and an optional "add" affordance. Drop <KanbanCard> children in.
 * Server-renderable.
 * -------------------------------------------------------------------------- */

export function BoardColumn({
  title,
  count,
  tone = 'idle',
  onAdd,
  children,
  className,
}: {
  title: ReactNode;
  /** Card count chip beside the title. */
  count?: number;
  /** Lane status dot tone. */
  tone?: StatusTone;
  onAdd?: () => void;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={clsx('flex w-72 shrink-0 flex-col gap-3 snap-start', className)}>
      <header className="flex items-center gap-2 px-1">
        <StatusDot tone={tone} size="sm" label={`${title} lane`} />
        <h3 className="text-sm font-bold tracking-wide text-ink">{title}</h3>
        {count != null && (
          <span className="rounded-full bg-ink/5 px-2 py-0.5 text-[11px] font-bold text-muted">
            {count}
          </span>
        )}
        {onAdd && (
          <button
            type="button"
            onClick={onAdd}
            aria-label={`Add to ${title}`}
            className="ml-auto flex h-6 w-6 items-center justify-center rounded-md text-muted transition-colors hover:bg-ink/5 hover:text-ink"
          >
            <PlusIcon weight="bold" className="h-4 w-4" />
          </button>
        )}
      </header>
      <div className="flex flex-col gap-2.5">{children}</div>
    </section>
  );
}

export function Board({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={clsx(
        'flex snap-x gap-5 overflow-x-auto pb-2 [scrollbar-width:thin]',
        className
      )}
    >
      {children}
    </div>
  );
}
