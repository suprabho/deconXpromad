import type { ReactNode } from 'react';
import clsx from 'clsx';
import { BankIcon } from '@phosphor-icons/react/dist/ssr';
import { StatusBadge } from '../primitives/StatusBadge';
import type { StatusTone } from '../primitives/StatusDot';

/* -------------------------------------------------------------------------- *
 * ConnectorCard — the integration / data-source node from the lower row of
 * Screen 4: an institution glyph, a name, a "Linked Connectivity" descriptor,
 * and a live status badge. Used to represent a connected bank, registry, or
 * feed. Server-renderable.
 * -------------------------------------------------------------------------- */

export function ConnectorCard({
  name,
  descriptor = 'Linked Connectivity',
  icon,
  status = 'Synced',
  statusTone = 'ok',
  pulse = true,
  onClick,
  className,
}: {
  name: ReactNode;
  descriptor?: ReactNode;
  /** Leading institution glyph; defaults to a bank. */
  icon?: ReactNode;
  status?: string;
  statusTone?: StatusTone;
  /** Pulse the status dot (live connection). */
  pulse?: boolean;
  onClick?: () => void;
  className?: string;
}) {
  const Wrapper = onClick ? 'button' : 'div';
  return (
    <Wrapper
      type={onClick ? 'button' : undefined}
      onClick={onClick}
      className={clsx(
        'block w-full rounded-xl border border-white/60 bg-white/80 p-3.5 text-left shadow-glass-sm backdrop-blur-md transition-shadow',
        onClick && 'hover:shadow-glass',
        className
      )}
    >
      <div className="flex items-center gap-2.5">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/60 bg-frost text-ink shadow-glass-chip">
          {icon ?? <BankIcon weight="duotone" className="h-5 w-5 text-fi" />}
        </span>
        <div className="min-w-0 flex-1">
          <h4 className="truncate text-sm font-bold text-ink">{name}</h4>
          <p className="truncate text-xs text-muted">{descriptor}</p>
        </div>
      </div>
      <div className="mt-3">
        <StatusBadge label={status} tone={statusTone} pulse={pulse} caret />
      </div>
    </Wrapper>
  );
}
