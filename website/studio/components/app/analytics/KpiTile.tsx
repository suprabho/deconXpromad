import type { ReactNode } from 'react';
import clsx from 'clsx';

/* -------------------------------------------------------------------------- *
 * KpiTile — the small solid "pill" stat from the header strip of Screen 3 (the
 * cobalt boxes with a label over a number). Denser than StatCard; meant to sit
 * in a tight row. `tone` switches between the frosted and solid looks.
 * Server-renderable.
 * -------------------------------------------------------------------------- */

const TONES = {
  solid: 'bg-fi text-white',
  navy: 'bg-navy text-white',
  frost: 'border border-white/60 bg-white/70 text-ink shadow-glass-chip backdrop-blur-sm',
} as const;

export function KpiTile({
  label,
  value,
  hint,
  tone = 'solid',
  className,
}: {
  label: ReactNode;
  value: ReactNode;
  hint?: ReactNode;
  tone?: keyof typeof TONES;
  className?: string;
}) {
  const onColour = tone === 'frost';
  return (
    <div className={clsx('rounded-xl px-4 py-3', TONES[tone], className)}>
      <p className={clsx('text-[11px] font-semibold uppercase tracking-wide', onColour ? 'text-muted' : 'text-white/70')}>
        {label}
      </p>
      <p className="mt-1 text-xl font-bold tabular-nums">{value}</p>
      {hint && (
        <p className={clsx('mt-0.5 text-[11px]', onColour ? 'text-muted' : 'text-white/60')}>{hint}</p>
      )}
    </div>
  );
}
