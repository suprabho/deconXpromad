import type { ReactNode } from 'react';
import clsx from 'clsx';
import { CaretRightIcon } from '@phosphor-icons/react/dist/ssr';

/* -------------------------------------------------------------------------- *
 * SearchResultRow — one hit in the command palette (Screen 2): a leading badge/
 * avatar, a title + truncated subtitle, a right-aligned count, and a drill
 * chevron. Highlighted rows get the frosted active well (keyboard cursor).
 * Server-renderable.
 * -------------------------------------------------------------------------- */

export function SearchResultRow({
  icon,
  title,
  subtitle,
  meta,
  active = false,
  onClick,
}: {
  /** Leading glyph / Avatar / badge node. */
  icon?: ReactNode;
  title: ReactNode;
  subtitle?: ReactNode;
  /** Right-aligned trailing text (e.g. "15 entries"). */
  meta?: ReactNode;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        'group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors',
        active ? 'bg-white shadow-glass-sm' : 'hover:bg-white/70'
      )}
    >
      {icon && (
        <span className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-white/60 bg-frost text-muted shadow-glass-chip">
          {icon}
        </span>
      )}
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-semibold text-ink">{title}</span>
        {subtitle && <span className="mt-0.5 block truncate text-xs text-muted">{subtitle}</span>}
      </span>
      {meta && <span className="shrink-0 text-xs font-medium text-muted">{meta}</span>}
      <CaretRightIcon
        weight="bold"
        className={clsx(
          'h-4 w-4 shrink-0 text-muted/50 transition-transform',
          active ? 'translate-x-0 text-fi' : 'group-hover:translate-x-0.5'
        )}
        aria-hidden
      />
    </button>
  );
}
