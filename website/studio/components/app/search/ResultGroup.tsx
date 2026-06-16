import type { ReactNode } from 'react';
import clsx from 'clsx';

/* -------------------------------------------------------------------------- *
 * ResultGroup — a labelled cluster of search results. The command palette
 * stacks several (e.g. "Cases", "People", "Wallets"), each with a faint section
 * header and an optional trailing action. Server-renderable.
 * -------------------------------------------------------------------------- */

export function ResultGroup({
  label,
  action,
  children,
  className,
}: {
  label: string;
  /** Right-aligned header action ("See all"). */
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={clsx('space-y-0.5', className)}>
      <div className="flex items-center justify-between px-3 pb-1 pt-2">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted/70">{label}</p>
        {action}
      </div>
      {children}
    </div>
  );
}
