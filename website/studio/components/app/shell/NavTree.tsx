import type { ReactNode } from 'react';
import clsx from 'clsx';
import { CaretDownIcon, CaretRightIcon, CheckIcon } from '@phosphor-icons/react/dist/ssr';

/* -------------------------------------------------------------------------- *
 * NavTree — the blue secondary navigation column of Screen 1: a nested,
 * collapsible outline where the active leaf is pulled out into a white "pill"
 * row that sits proud of the blue panel. Drives Entity Graph › Watch Lists ›
 * Field Mapping style hierarchies.
 *
 * Each node is a NavNode; expansion + selection are data, so the whole tree is
 * a deterministic render of props (no internal state). Server-renderable.
 * -------------------------------------------------------------------------- */

export type NavNode = {
  id: string;
  label: string;
  icon?: ReactNode;
  /** Render a checkmark instead of a caret (completed step). */
  done?: boolean;
  children?: NavNode[];
};

function NavRow({
  node,
  depth,
  activeId,
  expandedIds,
  onSelect,
  onToggle,
}: {
  node: NavNode;
  depth: number;
  activeId?: string;
  expandedIds: Set<string>;
  onSelect?: (id: string) => void;
  onToggle?: (id: string) => void;
}) {
  const hasChildren = !!node.children?.length;
  const expanded = expandedIds.has(node.id);
  const active = node.id === activeId;

  return (
    <li>
      <button
        type="button"
        aria-current={active ? 'true' : undefined}
        aria-expanded={hasChildren ? expanded : undefined}
        onClick={() => (hasChildren ? onToggle?.(node.id) : onSelect?.(node.id))}
        style={{ paddingLeft: `${0.75 + depth * 0.9}rem` }}
        className={clsx(
          'flex w-full items-center gap-2 rounded-lg py-2 pr-3 text-left text-sm transition-colors',
          active
            ? 'bg-white font-semibold text-ink shadow-glass-sm'
            : 'font-medium text-white/85 hover:bg-white/15'
        )}
      >
        <span className={clsx('flex h-4 w-4 shrink-0 items-center justify-center', active ? 'text-fi' : 'text-white/70')}>
          {node.done ? (
            <CheckIcon weight="bold" className="h-3.5 w-3.5" />
          ) : hasChildren ? (
            expanded ? (
              <CaretDownIcon weight="bold" className="h-3 w-3" />
            ) : (
              <CaretRightIcon weight="bold" className="h-3 w-3" />
            )
          ) : node.icon ? (
            node.icon
          ) : (
            <span className="h-1 w-1 rounded-full bg-current opacity-60" />
          )}
        </span>
        <span className="flex-1 truncate">{node.label}</span>
        {!hasChildren && active && (
          <CaretRightIcon weight="bold" className="h-3.5 w-3.5 shrink-0 text-fi/70" aria-hidden />
        )}
      </button>

      {hasChildren && expanded && (
        <ul className="mt-0.5 space-y-0.5">
          {node.children!.map((child) => (
            <NavRow
              key={child.id}
              node={child}
              depth={depth + 1}
              activeId={activeId}
              expandedIds={expandedIds}
              onSelect={onSelect}
              onToggle={onToggle}
            />
          ))}
        </ul>
      )}
    </li>
  );
}

export function NavTree({
  nodes,
  activeId,
  expandedIds = [],
  onSelect,
  onToggle,
  title,
  className,
}: {
  nodes: NavNode[];
  activeId?: string;
  /** Ids of expanded branches. */
  expandedIds?: string[];
  onSelect?: (id: string) => void;
  onToggle?: (id: string) => void;
  title?: string;
  className?: string;
}) {
  const expanded = new Set(expandedIds);
  return (
    <nav
      aria-label={title ?? 'Secondary'}
      className={clsx('w-60 rounded-2xl bg-fi p-3 text-white shadow-glass', className)}
    >
      {title && (
        <p className="px-3 pb-2 pt-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/60">
          {title}
        </p>
      )}
      <ul className="space-y-0.5">
        {nodes.map((node) => (
          <NavRow
            key={node.id}
            node={node}
            depth={0}
            activeId={activeId}
            expandedIds={expanded}
            onSelect={onSelect}
            onToggle={onToggle}
          />
        ))}
      </ul>
    </nav>
  );
}
