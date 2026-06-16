import type { ButtonHTMLAttributes, ReactNode } from 'react';
import clsx from 'clsx';
import { CaretDownIcon } from '@phosphor-icons/react/dist/ssr';

/* -------------------------------------------------------------------------- *
 * Select — a frosted dropdown trigger (label + caret). Presentational: it is a
 * styled button, not a native <select>, so it reads identically across the
 * toolbar filters (Screen 1) and the table/metric controls (Screen 3). Wire it
 * to a real menu/listbox at the call site, or use it as a static facsimile.
 * -------------------------------------------------------------------------- */

const SIZES = { sm: 'h-8 px-2.5 text-xs', md: 'h-10 px-3 text-sm' } as const;

export function Select({
  value,
  placeholder = 'Select',
  leftIcon,
  size = 'md',
  active = false,
  className,
  ...rest
}: {
  /** Current value label; when empty the placeholder shows muted. */
  value?: string;
  placeholder?: string;
  leftIcon?: ReactNode;
  size?: keyof typeof SIZES;
  active?: boolean;
  className?: string;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'value'>) {
  return (
    <button
      type="button"
      className={clsx(
        'inline-flex items-center justify-between gap-2 rounded-lg border bg-white/70 font-medium shadow-glass-chip backdrop-blur-sm transition-colors',
        active ? 'border-fi/40 text-ink' : 'border-white/60 text-ink hover:bg-white',
        SIZES[size],
        className
      )}
      {...rest}
    >
      <span className="flex items-center gap-2 truncate">
        {leftIcon && <span className="shrink-0 text-muted">{leftIcon}</span>}
        <span className={clsx('truncate', !value && 'text-muted')}>{value || placeholder}</span>
      </span>
      <CaretDownIcon weight="bold" className="h-3.5 w-3.5 shrink-0 text-muted" aria-hidden />
    </button>
  );
}
