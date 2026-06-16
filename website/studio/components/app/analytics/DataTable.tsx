import type { ReactNode } from 'react';
import clsx from 'clsx';

/* -------------------------------------------------------------------------- *
 * DataTable — the records grid from Screen 3. Column-driven and generic over
 * the row type: each column supplies a header and a cell renderer, so risk
 * pills, mono ids, and sparklines all live in one table. Optional zebra rows,
 * a selectable active row, and a click handler. Server-renderable.
 * -------------------------------------------------------------------------- */

export type Column<T> = {
  key: string;
  header: ReactNode;
  align?: 'left' | 'right' | 'center';
  /** Cell renderer; receives the row and its index. */
  render: (row: T, index: number) => ReactNode;
  className?: string;
  /** Tailwind width hint, e.g. 'w-24'. */
  width?: string;
};

const ALIGN = { left: 'text-left', right: 'text-right', center: 'text-center' } as const;

export function DataTable<T>({
  columns,
  rows,
  rowKey,
  selectedKey,
  onRowClick,
  zebra = false,
  className,
}: {
  columns: Column<T>[];
  rows: T[];
  /** Stable key per row. */
  rowKey: (row: T, index: number) => string;
  selectedKey?: string;
  onRowClick?: (row: T) => void;
  zebra?: boolean;
  className?: string;
}) {
  return (
    <div className={clsx('overflow-x-auto', className)}>
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-hair/70">
            {columns.map((col) => (
              <th
                key={col.key}
                scope="col"
                className={clsx(
                  'px-3 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-muted',
                  ALIGN[col.align ?? 'left'],
                  col.width
                )}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => {
            const key = rowKey(row, i);
            const selected = key === selectedKey;
            return (
              <tr
                key={key}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
                className={clsx(
                  'border-b border-hair/40 transition-colors last:border-0',
                  onRowClick && 'cursor-pointer',
                  selected ? 'bg-fi/5' : zebra && i % 2 === 1 ? 'bg-white/40' : 'hover:bg-white/60'
                )}
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={clsx('px-3 py-3 text-ink', ALIGN[col.align ?? 'left'], col.className)}
                  >
                    {col.render(row, i)}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
