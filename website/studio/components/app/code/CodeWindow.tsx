import clsx from 'clsx';
import { WindowChrome } from '../primitives/WindowChrome';
import { CodeLine } from './CodeLine';
import { tokenize, type Token } from './highlight';

/* -------------------------------------------------------------------------- *
 * CodeWindow — the dark, line-numbered editor panel from Screen 5. Pass raw
 * `code` (it tokenises with the built-in highlighter) or pre-built `lines`
 * (Token[][]) for full control. macOS window chrome on top, a language tag on
 * the right. Server-renderable.
 * -------------------------------------------------------------------------- */

export function CodeWindow({
  code,
  lines,
  title = 'api.ts',
  language,
  startLine = 1,
  highlightLines = [],
  className,
}: {
  /** Raw source — tokenised by the built-in highlighter. */
  code?: string;
  /** Pre-tokenised lines; takes precedence over `code`. */
  lines?: Token[][];
  title?: string;
  /** Language tag shown on the right of the title bar. */
  language?: string;
  startLine?: number;
  /** 1-based line numbers to tint. */
  highlightLines?: number[];
  className?: string;
}) {
  const tokenLines = lines ?? (code != null ? tokenize(code) : []);
  const highlight = new Set(highlightLines);
  const lastNumber = startLine + tokenLines.length - 1;
  const gutterWidth = String(lastNumber).length;

  return (
    <div
      className={clsx(
        'overflow-hidden rounded-2xl border border-white/10 bg-navy shadow-glass',
        className
      )}
    >
      <WindowChrome
        tone="dark"
        title={title}
        actions={
          language ? (
            <span className="rounded-md bg-white/5 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-white/50">
              {language}
            </span>
          ) : undefined
        }
      />
      <pre className="overflow-x-auto py-4 font-mono text-[13px]">
        {tokenLines.map((tokens, i) => {
          const number = startLine + i;
          return (
            <CodeLine
              key={i}
              number={number}
              tokens={tokens}
              highlight={highlight.has(number)}
              gutterWidth={gutterWidth}
            />
          );
        })}
      </pre>
    </div>
  );
}
