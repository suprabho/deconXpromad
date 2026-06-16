import clsx from 'clsx';
import { CaretDownIcon } from '@phosphor-icons/react/dist/ssr';
import { StatusDot, type StatusTone } from './StatusDot';

/* -------------------------------------------------------------------------- *
 * StatusBadge — a leading status dot + label, with an optional caret to read as
 * a dropdown trigger. This is the "● Active ⌄" chip stamped on every board card
 * (Screen 4) and connector node. `as="button"` makes it interactive.
 * -------------------------------------------------------------------------- */

export function StatusBadge({
  label,
  tone = 'ok',
  caret = false,
  pulse = false,
  className,
  as = 'span',
  onClick,
}: {
  label: string;
  tone?: StatusTone;
  /** Trailing caret — reads as a status dropdown. */
  caret?: boolean;
  pulse?: boolean;
  className?: string;
  as?: 'span' | 'button';
  onClick?: () => void;
}) {
  const inner = (
    <>
      <StatusDot tone={tone} size="sm" pulse={pulse} label={`${label} status`} />
      <span className="text-ink/80">{label}</span>
      {caret && <CaretDownIcon weight="bold" className="h-3 w-3 text-muted" aria-hidden />}
    </>
  );

  const base =
    'inline-flex items-center gap-1.5 rounded-md border border-white/60 bg-white/60 px-2 py-1 text-xs font-medium shadow-pill-inset backdrop-blur-sm';

  if (as === 'button') {
    return (
      <button
        type="button"
        onClick={onClick}
        className={clsx(base, 'transition-colors hover:bg-white/90', className)}
      >
        {inner}
      </button>
    );
  }
  return <span className={clsx(base, className)}>{inner}</span>;
}
