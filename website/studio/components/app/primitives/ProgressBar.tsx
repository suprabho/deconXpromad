import clsx from 'clsx';

/* -------------------------------------------------------------------------- *
 * ProgressBar — a thin recessed track + fill. Powers the inline confidence /
 * score meters beside graph entities (Screen 1) and the dark metric panel
 * gauges (Screen 3). Clamps value to 0–100. Server-renderable.
 * -------------------------------------------------------------------------- */

export type ProgressTone = 'fi' | 'match' | 'ok' | 'alert' | 'ink';

const FILLS: Record<ProgressTone, string> = {
  fi: 'bg-fi',
  match: 'bg-match',
  ok: 'bg-success',
  alert: 'bg-risk-text',
  ink: 'bg-ink',
};

export function ProgressBar({
  value,
  tone = 'fi',
  size = 'md',
  showValue = false,
  label,
  className,
}: {
  value: number;
  tone?: ProgressTone;
  size?: 'sm' | 'md';
  /** Render the numeric percent to the right of the track. */
  showValue?: boolean;
  /** Accessible name for the meter. */
  label?: string;
  className?: string;
}) {
  const pct = Math.max(0, Math.min(100, Math.round(value)));
  return (
    <div className={clsx('flex items-center gap-2', className)}>
      <div
        role="meter"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label}
        className={clsx(
          'relative w-full overflow-hidden rounded-full bg-ink/10 shadow-field-inset',
          size === 'sm' ? 'h-1.5' : 'h-2'
        )}
      >
        <div
          className={clsx('h-full rounded-full transition-[width]', FILLS[tone])}
          style={{ width: `${pct}%` }}
        />
      </div>
      {showValue && (
        <span className="w-9 shrink-0 text-right text-xs font-semibold tabular-nums text-muted">
          {pct}%
        </span>
      )}
    </div>
  );
}
