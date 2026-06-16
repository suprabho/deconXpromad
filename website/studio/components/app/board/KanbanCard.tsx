import type { ReactNode } from 'react';
import clsx from 'clsx';
import { WarningCircleIcon } from '@phosphor-icons/react/dist/ssr';
import { StatusBadge } from '../primitives/StatusBadge';
import type { StatusTone } from '../primitives/StatusDot';

/* -------------------------------------------------------------------------- *
 * KanbanCard — a single board card from Screen 4: a title (optionally flagged
 * with an alert glyph), a subtitle line, and a footer status badge with a
 * dropdown caret. A left accent stripe colour-codes the lane. Server-renderable.
 * -------------------------------------------------------------------------- */

const ACCENTS: Record<StatusTone, string> = {
  ok: 'before:bg-emerald-500',
  info: 'before:bg-fi',
  warn: 'before:bg-amber-500',
  alert: 'before:bg-risk-text',
  idle: 'before:bg-muted/40',
};

export function KanbanCard({
  title,
  subtitle,
  leading,
  flagged = false,
  status,
  statusTone = 'ok',
  accent,
  footer,
  onClick,
  className,
}: {
  title: ReactNode;
  subtitle?: ReactNode;
  /** Leading icon badge. */
  leading?: ReactNode;
  /** Show the amber alert glyph beside the title. */
  flagged?: boolean;
  /** Footer status badge label; omit to hide the badge. */
  status?: string;
  statusTone?: StatusTone;
  /** Left accent stripe tone; omit for none. */
  accent?: StatusTone;
  /** Extra footer content (right of the badge). */
  footer?: ReactNode;
  onClick?: () => void;
  className?: string;
}) {
  const Wrapper = onClick ? 'button' : 'div';
  return (
    <Wrapper
      type={onClick ? 'button' : undefined}
      onClick={onClick}
      className={clsx(
        'glass-surface glass-tint [--glass-tint-base:0.8] [--glass-blur-base:12px] relative block w-full overflow-hidden rounded-xl border border-white/60 p-3.5 text-left shadow-glass-sm transition-shadow',
        onClick && 'hover:shadow-glass',
        accent &&
          clsx('before:absolute before:inset-y-0 before:left-0 before:w-1', ACCENTS[accent]),
        accent && 'pl-4',
        className
      )}
    >
      <div className="flex items-start gap-2.5">
        {leading && (
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/60 bg-frost text-fi shadow-glass-chip">
            {leading}
          </span>
        )}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <h4 className="truncate text-sm font-bold text-ink">{title}</h4>
            {flagged && (
              <WarningCircleIcon weight="fill" className="h-3.5 w-3.5 shrink-0 text-amber-500" aria-label="needs attention" />
            )}
          </div>
          {subtitle && <p className="mt-0.5 truncate text-xs text-muted">{subtitle}</p>}
        </div>
      </div>

      {(status || footer) && (
        <div className="mt-3 flex items-center justify-between gap-2">
          {status && <StatusBadge label={status} tone={statusTone} caret />}
          {footer}
        </div>
      )}
    </Wrapper>
  );
}
