import type { ReactNode } from 'react';
import clsx from 'clsx';

/* -------------------------------------------------------------------------- *
 * AppHeader — the top bar of the workspace (Screen 1): a product wordmark on
 * the left and a cluster of toolbar actions + account avatar on the right. The
 * centre slot can host a global search. Frosted glass; server-renderable.
 * -------------------------------------------------------------------------- */

export function AppHeader({
  brand,
  center,
  actions,
  className,
}: {
  /** Wordmark / logo node. */
  brand: ReactNode;
  /** Optional centre slot (global search). */
  center?: ReactNode;
  /** Right cluster — IconButtons + Avatar. */
  actions?: ReactNode;
  className?: string;
}) {
  return (
    <header
      className={clsx(
        'flex h-16 items-center gap-4 rounded-2xl border border-white/60 bg-white/70 px-5 shadow-glass backdrop-blur-xl',
        className
      )}
    >
      <div className="flex shrink-0 items-center gap-2">{brand}</div>
      {center && <div className="mx-auto hidden max-w-md flex-1 md:block">{center}</div>}
      {actions && <div className="ml-auto flex items-center gap-1.5">{actions}</div>}
    </header>
  );
}

/** A gradient wordmark lockup for the header's brand slot. */
export function Brand({ name, mark }: { name: string; mark?: ReactNode }) {
  return (
    <span className="flex items-center gap-2">
      {mark && (
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-cobalt text-white shadow-glass-chip">
          {mark}
        </span>
      )}
      <span className="font-serif text-lg font-semibold tracking-tight text-navy">
        {name}
      </span>
    </span>
  );
}
