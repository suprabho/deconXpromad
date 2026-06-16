'use client';

import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import clsx from 'clsx';
import { ArrowUpIcon, MagnifyingGlassIcon } from '@phosphor-icons/react/dist/ssr';
import { SearchInput, Kbd } from '../primitives/SearchInput';

/* -------------------------------------------------------------------------- *
 * CommandPalette (Screen 2). Two pieces, mirroring FeatureModal:
 *
 *   CommandPalettePanel — the floating frosted card: a big query field, a
 *                         meta/tab row, the results body, and a hint footer.
 *                         Drop it into any layout.
 *   CommandPalette      — the panel wrapped in an accessible dialog overlay
 *                         (Escape to close, scroll lock, backdrop dismiss).
 * -------------------------------------------------------------------------- */

export function CommandPalettePanel({
  query,
  onQueryChange,
  placeholder = 'Search cases, people, wallets…',
  meta,
  children,
  footer,
  autoFocus = false,
  className,
}: {
  query?: string;
  onQueryChange?: (value: string) => void;
  placeholder?: string;
  /** Row under the input — segmented control, result count, etc. */
  meta?: ReactNode;
  /** Results body (ResultGroup / SearchResultRow stack). */
  children?: ReactNode;
  footer?: ReactNode;
  /** Focus the query field on mount — leave off for a static plate. */
  autoFocus?: boolean;
  className?: string;
}) {
  return (
    <div
      className={clsx(
        'w-full overflow-hidden rounded-2xl border border-white/60 bg-white/80 shadow-glass backdrop-blur-2xl',
        className
      )}
    >
      <div className="border-b border-hair/60 p-4">
        <SearchInput
          size="lg"
          autoFocus={autoFocus}
          readOnly={!onQueryChange}
          value={query}
          onChange={onQueryChange ? (e) => onQueryChange(e.target.value) : undefined}
          placeholder={placeholder}
          trailing={
            <button
              type="button"
              aria-label="Submit search"
              className="flex h-9 w-9 items-center justify-center rounded-lg bg-fi text-white shadow-glass-sm transition-colors hover:bg-cobalt"
            >
              <ArrowUpIcon weight="bold" className="h-4 w-4" />
            </button>
          }
        />
      </div>

      {meta && (
        <div className="flex items-center gap-3 border-b border-hair/60 px-4 py-2.5 text-xs text-muted">
          {meta}
        </div>
      )}

      <div className="max-h-[22rem] overflow-y-auto p-2">
        {children ?? (
          <div className="flex flex-col items-center gap-2 px-4 py-12 text-center text-muted">
            <MagnifyingGlassIcon weight="light" className="h-8 w-8 opacity-50" />
            <p className="text-sm">Start typing to search</p>
          </div>
        )}
      </div>

      <div className="flex items-center gap-3 border-t border-hair/60 bg-white/40 px-4 py-2.5 text-[11px] text-muted">
        {footer ?? (
          <>
            <span className="flex items-center gap-1.5">
              <Kbd>↑</Kbd>
              <Kbd>↓</Kbd> navigate
            </span>
            <span className="flex items-center gap-1.5">
              <Kbd>↵</Kbd> open
            </span>
            <span className="ml-auto flex items-center gap-1.5">
              <Kbd>esc</Kbd> close
            </span>
          </>
        )}
      </div>
    </div>
  );
}

export function CommandPalette({
  open,
  onClose,
  dismissable = true,
  autoFocus = true,
  ...panel
}: {
  open: boolean;
  onClose: () => void;
  dismissable?: boolean;
} & Parameters<typeof CommandPalettePanel>[0]) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-navy/40 p-4 pt-[12vh] backdrop-blur-sm motion-safe:animate-fade-in"
      onClick={dismissable ? onClose : undefined}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xl outline-none motion-safe:animate-pop-in"
      >
        <CommandPalettePanel {...panel} autoFocus={autoFocus} />
      </div>
    </div>
  );
}
