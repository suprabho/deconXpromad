import type { ReactNode } from 'react';
import clsx from 'clsx';

/* -------------------------------------------------------------------------- *
 * Tabs — an underline tab bar (the "Columns" header tab on Screen 4). The
 * active tab carries a fi-blue underline + ink label; the rest are muted. An
 * optional `count` badge trails the label. Presentational.
 * -------------------------------------------------------------------------- */

export type Tab = { value: string; label: string; icon?: ReactNode; count?: number };

export function Tabs({
  tabs,
  value,
  onSelect,
  className,
}: {
  tabs: Tab[];
  value: string;
  onSelect?: (value: string) => void;
  className?: string;
}) {
  return (
    <div role="tablist" className={clsx('flex items-center gap-6 border-b border-hair/70', className)}>
      {tabs.map((tab) => {
        const selected = tab.value === value;
        return (
          <button
            key={tab.value}
            type="button"
            role="tab"
            aria-selected={selected}
            onClick={onSelect ? () => onSelect(tab.value) : undefined}
            className={clsx(
              '-mb-px flex items-center gap-2 border-b-2 pb-3 pt-1 text-sm font-semibold tracking-wide transition-colors',
              selected
                ? 'border-fi text-ink'
                : 'border-transparent text-muted hover:border-hair hover:text-ink'
            )}
          >
            {tab.icon && <span className="shrink-0">{tab.icon}</span>}
            {tab.label}
            {tab.count != null && (
              <span
                className={clsx(
                  'rounded-full px-1.5 py-0.5 text-[10px] font-bold leading-none',
                  selected ? 'bg-fi/10 text-fi' : 'bg-ink/5 text-muted'
                )}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
