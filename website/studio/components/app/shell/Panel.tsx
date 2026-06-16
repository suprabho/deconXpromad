import type { ReactNode } from 'react';
import clsx from 'clsx';

/* -------------------------------------------------------------------------- *
 * Panel — a framed content surface with a titled header bar and an optional
 * toolbar/actions slot. The "Entity Graph" and "Data Devices" containers of
 * Screen 1 are Panels; so is each analytics card body. Server-renderable.
 * -------------------------------------------------------------------------- */

export function Panel({
  title,
  icon,
  actions,
  children,
  footer,
  bodyClassName,
  className,
}: {
  title?: ReactNode;
  icon?: ReactNode;
  /** Right-aligned header slot (toolbar, select, collapse caret). */
  actions?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  bodyClassName?: string;
  className?: string;
}) {
  return (
    <section
      className={clsx(
        'flex flex-col overflow-hidden rounded-2xl border border-white/60 bg-white/70 shadow-glass backdrop-blur-xl',
        className
      )}
    >
      {(title || actions) && (
        <header className="flex items-center gap-3 border-b border-hair/60 px-5 py-3.5">
          {icon && <span className="text-muted">{icon}</span>}
          {title && (
            <h2 className="text-sm font-bold tracking-wide text-ink">{title}</h2>
          )}
          {actions && <div className="ml-auto flex items-center gap-2">{actions}</div>}
        </header>
      )}
      <div className={clsx('flex-1', bodyClassName ?? 'p-5')}>{children}</div>
      {footer && <footer className="border-t border-hair/60 px-5 py-3">{footer}</footer>}
    </section>
  );
}
