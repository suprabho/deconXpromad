import clsx from 'clsx';

/* -------------------------------------------------------------------------- *
 * StatusDot — a small coloured state indicator. The atom behind entity-list
 * rows, board-card health badges, and presence markers across the app screens.
 *
 * `pulse` adds a soft expanding ring (live / active). Server-renderable.
 * -------------------------------------------------------------------------- */

export type StatusTone = 'ok' | 'info' | 'warn' | 'alert' | 'idle';

const TONES: Record<StatusTone, { dot: string; ring: string }> = {
  ok: { dot: 'bg-emerald-500', ring: 'bg-emerald-500/30' },
  info: { dot: 'bg-fi', ring: 'bg-fi/30' },
  warn: { dot: 'bg-amber-500', ring: 'bg-amber-500/30' },
  alert: { dot: 'bg-risk-text', ring: 'bg-risk-text/30' },
  idle: { dot: 'bg-muted/50', ring: 'bg-muted/20' },
};

const SIZES = { sm: 'h-1.5 w-1.5', md: 'h-2.5 w-2.5', lg: 'h-3 w-3' } as const;

export function StatusDot({
  tone = 'idle',
  size = 'md',
  pulse = false,
  className,
  label,
}: {
  tone?: StatusTone;
  size?: keyof typeof SIZES;
  pulse?: boolean;
  className?: string;
  /** Accessible name; falls back to the tone keyword. */
  label?: string;
}) {
  const t = TONES[tone];
  return (
    <span
      role="img"
      aria-label={label ?? `${tone} status`}
      className={clsx('relative inline-flex shrink-0', SIZES[size], className)}
    >
      {pulse && (
        <span
          aria-hidden
          className={clsx('absolute inset-0 rounded-full motion-safe:animate-ping', t.ring)}
        />
      )}
      <span
        aria-hidden
        className={clsx(
          'relative inline-block h-full w-full rounded-full ring-2 ring-white/70',
          t.dot
        )}
      />
    </span>
  );
}
