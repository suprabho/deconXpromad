import type { ReactNode } from 'react';
import clsx from 'clsx';
import { Delta } from './Delta';
import { Sparkline } from './Sparkline';

/* -------------------------------------------------------------------------- *
 * StatCard — a single KPI tile from Screen 3: a label, a large value, an
 * optional signed delta, and an optional trailing sparkline. `tone="dark"`
 * renders the navy variant (the highlighted figure in the reference).
 * Server-renderable.
 * -------------------------------------------------------------------------- */

const TONES = {
  light: {
    card: 'glass-surface glass-tint border-white/60 text-ink shadow-glass',
    label: 'text-muted',
    value: 'text-ink',
    icon: 'border-white/60 bg-frost text-fi',
  },
  dark: {
    card: 'border-white/10 bg-navy text-white shadow-glass',
    label: 'text-white/60',
    value: 'text-white',
    icon: 'border-white/15 bg-white/10 text-sky-200',
  },
} as const;

export function StatCard({
  label,
  value,
  delta,
  deltaInvert = false,
  icon,
  spark,
  tone = 'light',
  className,
}: {
  label: ReactNode;
  value: ReactNode;
  /** Signed percentage change. */
  delta?: number;
  deltaInvert?: boolean;
  icon?: ReactNode;
  /** Trend series → trailing sparkline. */
  spark?: number[];
  tone?: keyof typeof TONES;
  className?: string;
}) {
  const t = TONES[tone];
  return (
    <div className={clsx('rounded-2xl border p-5', t.card, className)}>
      <div className="flex items-start justify-between gap-3">
        <p className={clsx('text-xs font-semibold uppercase tracking-wide', t.label)}>{label}</p>
        {icon && (
          <span className={clsx('flex h-8 w-8 items-center justify-center rounded-lg border', t.icon)}>
            {icon}
          </span>
        )}
      </div>

      <div className="mt-3 flex items-end gap-2">
        <span className={clsx('text-3xl font-bold tracking-tight tabular-nums', t.value)}>{value}</span>
        {delta != null && (
          <Delta value={delta} invert={deltaInvert} tone={tone === 'dark' ? 'on-dark' : 'auto'} className="mb-1" />
        )}
      </div>

      {spark && (
        <Sparkline
          data={spark}
          tone={tone === 'dark' ? 'white' : 'fi'}
          className="mt-3"
          endDot={false}
        />
      )}
    </div>
  );
}
