import type { ReactNode } from 'react';
import clsx from 'clsx';

/* -------------------------------------------------------------------------- *
 * Toolbar + ToolbarGroup — the action strip under the panel header on Screen 1
 * (selects · search · "AI Search" · presentation buttons). A flex row that
 * wraps, with groups separated by a thin divider. Server-renderable.
 * -------------------------------------------------------------------------- */

export function Toolbar({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={clsx('flex flex-wrap items-center gap-2', className)} role="toolbar">
      {children}
    </div>
  );
}

export function ToolbarGroup({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={clsx('flex items-center gap-2', className)}>{children}</div>;
}

/** A vertical hairline that separates toolbar groups. */
export function ToolbarDivider() {
  return <span aria-hidden className="mx-1 h-6 w-px bg-hair" />;
}

/** Pushes everything after it to the right edge of the toolbar. */
export function ToolbarSpacer() {
  return <span className="flex-1" aria-hidden />;
}
