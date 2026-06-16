import type { ButtonHTMLAttributes, ReactNode } from 'react';
import clsx from 'clsx';

/* -------------------------------------------------------------------------- *
 * Button — the action primitive. `primary` is the cobalt pill from the board
 * header ("Connect"); `secondary` is a frosted-glass outline; `ghost` is a bare
 * text action ("Cancel"); `link` is the inline blue text trigger. Icon-only
 * actions should use <IconButton>.
 * -------------------------------------------------------------------------- */

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'link' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

const VARIANTS: Record<ButtonVariant, string> = {
  primary:
    'border border-transparent bg-fi text-white shadow-glass-sm hover:bg-cobalt active:translate-y-px',
  secondary:
    'border border-white/60 bg-white/70 text-ink shadow-glass-chip backdrop-blur-sm hover:bg-white',
  ghost: 'border border-transparent text-muted hover:bg-ink/5 hover:text-ink',
  link: 'border border-transparent px-0 text-fi hover:text-cobalt hover:underline',
  danger:
    'border border-transparent bg-risk-text text-white shadow-glass-sm hover:brightness-110 active:translate-y-px',
};

const SIZES: Record<ButtonSize, string> = {
  sm: 'h-8 gap-1.5 px-3 text-xs',
  md: 'h-10 gap-2 px-4 text-sm',
  lg: 'h-11 gap-2 px-5 text-sm',
};

export function Button({
  children,
  variant = 'secondary',
  size = 'md',
  leftIcon,
  rightIcon,
  fullWidth = false,
  className,
  ...rest
}: {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
} & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className={clsx(
        'inline-flex items-center justify-center rounded-lg font-semibold tracking-wide transition-all',
        'disabled:cursor-not-allowed disabled:opacity-50',
        VARIANTS[variant],
        variant === 'link' ? 'h-auto' : SIZES[size],
        fullWidth && 'w-full',
        className
      )}
      {...rest}
    >
      {leftIcon && <span className="shrink-0">{leftIcon}</span>}
      {children}
      {rightIcon && <span className="shrink-0">{rightIcon}</span>}
    </button>
  );
}
