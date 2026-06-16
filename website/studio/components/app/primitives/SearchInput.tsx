import type { InputHTMLAttributes, ReactNode } from 'react';
import clsx from 'clsx';
import { MagnifyingGlassIcon } from '@phosphor-icons/react/dist/ssr';

/* -------------------------------------------------------------------------- *
 * SearchInput — a frosted text field with a leading magnifier and an optional
 * trailing slot (a submit glyph, ⌘K hint, or filter button). Drives the toolbar
 * search of Screen 1 and the big query bar of the command palette (Screen 2).
 *
 * Presentational: spread `value`/`onChange`/`placeholder` from the caller. Pass
 * standard <input> attributes through `...rest`.
 * -------------------------------------------------------------------------- */

const SIZES = {
  md: { wrap: 'h-10 text-sm', pad: 'pl-9 pr-3', icon: 'left-3 h-4 w-4' },
  lg: { wrap: 'h-14 text-base', pad: 'pl-12 pr-4', icon: 'left-4 h-5 w-5' },
} as const;

export function SearchInput({
  size = 'md',
  trailing,
  className,
  inputClassName,
  ...rest
}: {
  size?: keyof typeof SIZES;
  /** Right-aligned adornment: a submit button, kbd hint, etc. */
  trailing?: ReactNode;
  className?: string;
  inputClassName?: string;
  // `size` here is our visual scale, not the native numeric <input size> attribute.
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'size'>) {
  const s = SIZES[size];
  return (
    <div
      className={clsx(
        'relative flex items-center rounded-xl border border-white/60 bg-white/70 shadow-field-inset backdrop-blur-sm focus-within:border-fi/40',
        s.wrap,
        className
      )}
    >
      <MagnifyingGlassIcon
        weight="bold"
        className={clsx('pointer-events-none absolute text-muted', s.icon)}
        aria-hidden
      />
      <input
        type="search"
        className={clsx(
          'h-full w-full bg-transparent text-ink placeholder:text-muted/70 focus:outline-none',
          s.pad,
          trailing && 'pr-2',
          inputClassName
        )}
        {...rest}
      />
      {trailing && <div className="flex shrink-0 items-center gap-1 pr-2">{trailing}</div>}
    </div>
  );
}

/** A small keyboard hint chip — e.g. ⌘K — for the right edge of a SearchInput. */
export function Kbd({ children }: { children: ReactNode }) {
  return (
    <kbd className="rounded-md border border-hair/80 bg-white/80 px-1.5 py-0.5 font-sans text-[11px] font-semibold text-muted shadow-pill-inset">
      {children}
    </kbd>
  );
}
