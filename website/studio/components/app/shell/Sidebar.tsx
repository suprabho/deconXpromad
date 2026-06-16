import type { ReactNode } from 'react';
import clsx from 'clsx';
import { CaretRightIcon } from '@phosphor-icons/react/dist/ssr';

/* -------------------------------------------------------------------------- *
 * Sidebar + SidebarItem — the primary left rail of the workspace (Screen 1):
 * a frosted glass column of icon+label nav rows with an active highlight and a
 * trailing caret. Sections are separated by a hairline. Server-renderable.
 * -------------------------------------------------------------------------- */

export function SidebarItem({
  icon,
  label,
  active = false,
  caret = true,
  href,
  onClick,
}: {
  icon: ReactNode;
  label: string;
  active?: boolean;
  /** Trailing chevron (drill-in affordance). */
  caret?: boolean;
  href?: string;
  onClick?: () => void;
}) {
  const inner = (
    <>
      <span
        className={clsx(
          'flex h-7 w-7 shrink-0 items-center justify-center rounded-md transition-colors',
          active ? 'text-fi' : 'text-muted group-hover:text-ink'
        )}
      >
        {icon}
      </span>
      <span className="flex-1 truncate text-sm font-medium">{label}</span>
      {caret && (
        <CaretRightIcon
          weight="bold"
          className={clsx('h-3.5 w-3.5 shrink-0', active ? 'text-fi/70' : 'text-muted/50')}
          aria-hidden
        />
      )}
    </>
  );

  const className = clsx(
    'group flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left transition-colors',
    active
      ? 'bg-fi/10 text-ink shadow-pill-inset'
      : 'text-ink/80 hover:bg-white/70'
  );

  if (href) {
    return (
      <a href={href} aria-current={active ? 'page' : undefined} className={className}>
        {inner}
      </a>
    );
  }
  return (
    <button type="button" aria-current={active ? 'page' : undefined} onClick={onClick} className={className}>
      {inner}
    </button>
  );
}

export function Sidebar({
  header,
  footer,
  children,
  className,
}: {
  header?: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <nav
      aria-label="Primary"
      className={clsx(
        'flex h-full w-64 flex-col rounded-2xl border border-white/60 bg-white/70 shadow-glass backdrop-blur-xl',
        className
      )}
    >
      {header && <div className="border-b border-hair/60 px-4 py-4">{header}</div>}
      <div className="flex-1 space-y-1 overflow-y-auto p-3">{children}</div>
      {footer && <div className="border-t border-hair/60 px-4 py-4">{footer}</div>}
    </nav>
  );
}

/** A faint label that splits the sidebar into sections. */
export function SidebarSection({ label }: { label: string }) {
  return (
    <p className="px-2.5 pb-1 pt-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted/70">
      {label}
    </p>
  );
}
