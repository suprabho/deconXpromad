import clsx from 'clsx';
import { TOKEN_CLASS, type Token } from './highlight';

/* -------------------------------------------------------------------------- *
 * CodeLine — one row of the code window: a right-aligned line-number gutter and
 * the syntax-coloured token run. `highlight` tints the whole row (the active /
 * changed line). Server-renderable.
 * -------------------------------------------------------------------------- */

export function CodeLine({
  number,
  tokens,
  highlight = false,
  gutterWidth = 2,
}: {
  number: number;
  tokens: Token[];
  highlight?: boolean;
  /** Digit count for the gutter, for consistent alignment. */
  gutterWidth?: number;
}) {
  return (
    <div className={clsx('flex px-4 leading-6', highlight && 'bg-sky-400/10')}>
      <span
        aria-hidden
        className="mr-4 inline-block shrink-0 select-none text-right text-slate-600 tabular-nums"
        style={{ width: `${gutterWidth + 0.5}ch` }}
      >
        {number}
      </span>
      <code className="whitespace-pre">
        {tokens.length === 0 ? (
          ' '
        ) : (
          tokens.map((tok, i) => (
            <span key={i} className={TOKEN_CLASS[tok.type]}>
              {tok.value}
            </span>
          ))
        )}
      </code>
    </div>
  );
}
