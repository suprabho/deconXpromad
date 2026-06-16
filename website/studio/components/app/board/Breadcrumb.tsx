import { Fragment } from 'react';
import type { ReactNode } from 'react';
import clsx from 'clsx';
import { CaretLeftIcon, CaretRightIcon } from '@phosphor-icons/react/dist/ssr';

/* -------------------------------------------------------------------------- *
 * Breadcrumb — the "‹ Field Setting" trail from Screen 4. Renders a back caret
 * plus a chevron-separated path; the last crumb is the current (non-link) page.
 * Server-renderable.
 * -------------------------------------------------------------------------- */

export type Crumb = { label: string; href?: string };

export function Breadcrumb({
  items,
  showBack = true,
  onBack,
  className,
}: {
  items: Crumb[];
  /** Leading back caret. */
  showBack?: boolean;
  onBack?: () => void;
  className?: string;
}) {
  return (
    <nav aria-label="Breadcrumb" className={clsx('flex items-center gap-2 text-sm', className)}>
      {showBack && (
        <button
          type="button"
          onClick={onBack}
          aria-label="Go back"
          className="flex h-6 w-6 items-center justify-center rounded-md text-muted transition-colors hover:bg-ink/5 hover:text-ink"
        >
          <CaretLeftIcon weight="bold" className="h-4 w-4" />
        </button>
      )}
      <ol className="flex items-center gap-1.5">
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <Fragment key={`${item.label}-${i}`}>
              <li>
                {item.href && !last ? (
                  <a href={item.href} className="font-medium text-muted transition-colors hover:text-ink">
                    {item.label}
                  </a>
                ) : (
                  <span className={clsx(last ? 'font-semibold text-ink' : 'font-medium text-muted')}>
                    {item.label}
                  </span>
                )}
              </li>
              {!last && (
                <li aria-hidden>
                  <CaretRightIcon weight="bold" className="h-3 w-3 text-muted/50" />
                </li>
              )}
            </Fragment>
          );
        })}
      </ol>
    </nav>
  );
}
