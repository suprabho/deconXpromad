import type { ReactNode } from 'react';
import clsx from 'clsx';
import { StatusDot, type StatusTone } from '../primitives/StatusDot';
import { ProgressBar, type ProgressTone } from '../primitives/ProgressBar';

/* -------------------------------------------------------------------------- *
 * EntityList + EntityRow — the selectable result rows beside the entity graph
 * (Screen 1). Each row is a status dot + label, optionally numbered, with a
 * trailing score meter. The active row gets a frosted selected well.
 * Server-renderable.
 * -------------------------------------------------------------------------- */

export type EntityRowData = {
  id: string;
  label: string;
  tone?: StatusTone;
  /** 0–100 confidence/match score → trailing meter. */
  score?: number;
  meta?: ReactNode;
};

export function EntityRow({
  index,
  label,
  tone = 'info',
  score,
  meta,
  selected = false,
  scoreTone = 'fi',
  onClick,
}: {
  index?: number;
  label: string;
  tone?: StatusTone;
  score?: number;
  meta?: ReactNode;
  selected?: boolean;
  scoreTone?: ProgressTone;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      aria-current={selected ? 'true' : undefined}
      onClick={onClick}
      className={clsx(
        'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors',
        selected ? 'bg-white shadow-glass-sm' : 'hover:bg-white/70'
      )}
    >
      {index != null && (
        <span className="w-4 shrink-0 text-right text-xs font-semibold tabular-nums text-muted/70">
          {index}
        </span>
      )}
      <StatusDot tone={tone} size="md" label={`${label} status`} />
      <span className="flex-1 truncate text-sm font-medium text-ink">{label}</span>
      {score != null && (
        <ProgressBar value={score} tone={scoreTone} size="sm" className="w-20" label={`${label} score`} />
      )}
      {meta}
    </button>
  );
}

export function EntityList({
  items,
  selectedId,
  onSelect,
  numbered = true,
  className,
}: {
  items: EntityRowData[];
  selectedId?: string;
  onSelect?: (id: string) => void;
  /** Prefix each row with its 1-based index. */
  numbered?: boolean;
  className?: string;
}) {
  return (
    <ul className={clsx('space-y-0.5', className)}>
      {items.map((item, i) => (
        <li key={item.id}>
          <EntityRow
            index={numbered ? i + 1 : undefined}
            label={item.label}
            tone={item.tone}
            score={item.score}
            meta={item.meta}
            selected={item.id === selectedId}
            onClick={onSelect ? () => onSelect(item.id) : undefined}
          />
        </li>
      ))}
    </ul>
  );
}
