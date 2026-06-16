import type { ReactNode } from 'react';
import clsx from 'clsx';

/* -------------------------------------------------------------------------- *
 * PageHeader — the title band from Screen 4: an optional eyebrow/breadcrumb, a
 * page title (with optional avatar/icon), and a right-aligned action cluster,
 * over an optional tab row. Pure layout; pass <Tabs>, <Button>, etc. as slots.
 * Server-renderable.
 * -------------------------------------------------------------------------- */

export function PageHeader({
  eyebrow,
  title,
  leading,
  description,
  actions,
  tabs,
  className,
}: {
  /** Breadcrumb / kicker above the title. */
  eyebrow?: ReactNode;
  title: ReactNode;
  /** Leading node beside the title (avatar, icon badge). */
  leading?: ReactNode;
  description?: ReactNode;
  /** Right-aligned actions. */
  actions?: ReactNode;
  /** Tab row rendered under the title block. */
  tabs?: ReactNode;
  className?: string;
}) {
  return (
    <div className={clsx('space-y-4', className)}>
      <div className="flex flex-wrap items-start gap-4">
        <div className="flex min-w-0 items-start gap-3">
          {leading}
          <div className="min-w-0">
            {eyebrow && <div className="mb-1">{eyebrow}</div>}
            <h1 className="truncate text-xl font-bold tracking-tight text-ink">{title}</h1>
            {description && <p className="mt-1 text-sm text-muted">{description}</p>}
          </div>
        </div>
        {actions && <div className="ml-auto flex shrink-0 items-center gap-2">{actions}</div>}
      </div>
      {tabs}
    </div>
  );
}
