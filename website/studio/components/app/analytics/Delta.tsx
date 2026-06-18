import clsx from 'clsx';
import { TrendDownIcon, TrendUpIcon } from '@phosphor-icons/react/dist/ssr';

/* -------------------------------------------------------------------------- *
 * Delta — a signed change indicator (▲ 12.4%). Green for up, red for down,
 * muted for flat. `invert` flips the colour semantics for metrics where down is
 * good (e.g. fraud losses). Server-renderable.
 * -------------------------------------------------------------------------- */

export function Delta({
  value,
  suffix = '%',
  invert = false,
  tone = 'auto',
  className,
}: {
  /** Signed change; sign drives the arrow + colour. */
  value: number;
  suffix?: string;
  /** When true, a negative value reads as positive (down-is-good metrics). */
  invert?: boolean;
  /** Force a colour, or 'auto' to derive from sign. */
  tone?: 'auto' | 'on-dark';
  className?: string;
}) {
  const up = value >= 0;
  const good = invert ? !up : up;
  const colour =
    tone === 'on-dark'
      ? good
        ? 'text-success'
        : 'text-red-300' // lightened alert red — brand red fails contrast on navy
      : good
        ? 'text-success'
        : 'text-risk-text';

  const Icon = up ? TrendUpIcon : TrendDownIcon;

  return (
    <span className={clsx('inline-flex items-center gap-0.5 text-xs font-semibold tabular-nums', colour, className)}>
      <Icon weight="bold" className="h-3.5 w-3.5" aria-hidden />
      {up ? '+' : ''}
      {value}
      {suffix}
    </span>
  );
}
