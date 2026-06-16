import type { ButtonHTMLAttributes, ReactNode } from 'react';
import clsx from 'clsx';
import { CountBadge, type BadgeTone } from './Badge';

/* -------------------------------------------------------------------------- *
 * IconButton — a square, glyph-only action. The top-bar toolbar of Screen 1 is
 * a row of these (settings, share, menu, cart-with-badge, account). An optional
 * `badge` count renders the red notification dot in the corner.
 * -------------------------------------------------------------------------- */

const SIZES = { sm: 'h-8 w-8', md: 'h-9 w-9', lg: 'h-10 w-10' } as const;

const VARIANTS = {
  ghost: 'text-muted hover:bg-ink/5 hover:text-ink',
  frost: 'border border-white/60 bg-white/70 text-ink shadow-glass-chip backdrop-blur-sm hover:bg-white',
  solid: 'bg-ink text-white shadow-glass-sm hover:bg-navy',
} as const;

export function IconButton({
  icon,
  label,
  size = 'md',
  variant = 'ghost',
  badge,
  badgeTone = 'alert',
  active = false,
  className,
  ...rest
}: {
  icon: ReactNode;
  /** Required accessible name (button has no text). */
  label: string;
  size?: keyof typeof SIZES;
  variant?: keyof typeof VARIANTS;
  badge?: number;
  badgeTone?: BadgeTone;
  active?: boolean;
  className?: string;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'>) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={active || undefined}
      className={clsx(
        'relative inline-flex items-center justify-center rounded-lg transition-colors',
        SIZES[size],
        VARIANTS[variant],
        active && 'bg-fi/10 text-fi',
        className
      )}
      {...rest}
    >
      {icon}
      {badge != null && (
        <CountBadge count={badge} tone={badgeTone} className="absolute -right-1 -top-1" />
      )}
    </button>
  );
}
