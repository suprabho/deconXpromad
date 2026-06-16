import type { ReactNode } from 'react';
import clsx from 'clsx';

/* -------------------------------------------------------------------------- *
 * Badge — a small inline label pill. The generic count / category chip used in
 * search-result rows ("15 entries"), table cells, and toolbar counters. For a
 * status badge with a leading dot + caret, use <StatusBadge> instead.
 *
 * Tones share the frosted recessed look (`shadow-pill-inset`). Solid variant
 * for the small red notification counter on toolbar icons.
 * -------------------------------------------------------------------------- */

export type BadgeTone = 'neutral' | 'info' | 'ok' | 'warn' | 'alert' | 'match';

const SOFT: Record<BadgeTone, string> = {
  neutral: 'border-hair/70 bg-white/70 text-muted',
  info: 'border-fi/15 bg-fi/10 text-fi',
  ok: 'border-emerald-600/15 bg-emerald-50/80 text-emerald-700',
  warn: 'border-amber-600/15 bg-amber-50/80 text-amber-700',
  alert: 'border-risk-text/15 bg-risk-bg/80 text-risk-text',
  match: 'border-match/20 bg-match/10 text-match',
};

const SOLID: Record<BadgeTone, string> = {
  neutral: 'bg-muted text-white',
  info: 'bg-fi text-white',
  ok: 'bg-emerald-500 text-white',
  warn: 'bg-amber-500 text-white',
  alert: 'bg-risk-text text-white',
  match: 'bg-match text-white',
};

export function Badge({
  children,
  tone = 'neutral',
  variant = 'soft',
  icon,
  className,
}: {
  children: ReactNode;
  tone?: BadgeTone;
  variant?: 'soft' | 'solid';
  icon?: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium',
        variant === 'soft'
          ? clsx('border shadow-pill-inset backdrop-blur-sm', SOFT[tone])
          : SOLID[tone],
        className
      )}
    >
      {icon && <span className="-ml-0.5 shrink-0">{icon}</span>}
      {children}
    </span>
  );
}

/** A tiny circular count badge — the red "1" on a toolbar bell, etc. */
export function CountBadge({
  count,
  tone = 'alert',
  className,
}: {
  count: number;
  tone?: BadgeTone;
  className?: string;
}) {
  return (
    <span
      className={clsx(
        'inline-flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-bold leading-none ring-2 ring-white',
        SOLID[tone],
        className
      )}
    >
      {count > 99 ? '99+' : count}
    </span>
  );
}
