/* -------------------------------------------------------------------------- *
 * Lightweight, dependency-free syntax tokeniser for the CodeWindow (Screen 5).
 * Line-oriented and deliberately small: it recognises line comments, strings,
 * numbers, keywords, and call expressions — enough to render a convincing dark
 * code panel without pulling in a full highlighter. Multiline strings / block
 * comments that span lines are out of scope (each line is tokenised alone).
 *
 * For full control, skip the tokeniser and pass pre-built Token[][] to CodeWindow.
 * -------------------------------------------------------------------------- */

export type TokenType =
  | 'comment'
  | 'keyword'
  | 'string'
  | 'number'
  | 'function'
  | 'boolean'
  | 'operator'
  | 'plain';

export type Token = { type: TokenType; value: string };

/** Dark-theme colour per token type (Tailwind text classes). */
export const TOKEN_CLASS: Record<TokenType, string> = {
  comment: 'text-slate-500 italic',
  keyword: 'text-violet-300',
  string: 'text-emerald-300',
  number: 'text-orange-300',
  function: 'text-sky-300',
  boolean: 'text-orange-300',
  operator: 'text-slate-400',
  plain: 'text-slate-200',
};

const KEYWORDS = new Set([
  'const', 'let', 'var', 'function', 'return', 'if', 'else', 'for', 'while', 'await',
  'async', 'import', 'export', 'from', 'default', 'class', 'extends', 'new', 'try',
  'catch', 'finally', 'throw', 'typeof', 'instanceof', 'in', 'of', 'this', 'super',
  'yield', 'static', 'get', 'set', 'public', 'private', 'interface', 'type', 'enum',
  'def', 'self', 'None', 'True', 'False', 'lambda', 'with', 'as', 'pass', 'raise',
]);
const BOOLEANS = new Set(['true', 'false', 'null', 'undefined', 'NaN']);

const MASTER = /(\/\/.*$|#.*$)|(`[^`]*`|"[^"]*"|'[^']*')|(\b\d[\w.]*)|([A-Za-z_$][\w$]*)|(\s+)|([^\s\w])/g;

/** Tokenise a single line of source into typed runs. */
export function tokenizeLine(line: string): Token[] {
  const tokens: Token[] = [];
  let m: RegExpExecArray | null;
  MASTER.lastIndex = 0;

  while ((m = MASTER.exec(line)) !== null) {
    const [full, comment, str, num, ident, space] = m;
    if (comment != null) {
      tokens.push({ type: 'comment', value: full });
    } else if (str != null) {
      tokens.push({ type: 'string', value: full });
    } else if (num != null) {
      tokens.push({ type: 'number', value: full });
    } else if (ident != null) {
      // peek past whitespace for a '(' → call expression
      let j = MASTER.lastIndex;
      while (j < line.length && /\s/.test(line[j])) j++;
      const isCall = line[j] === '(';
      const type: TokenType = KEYWORDS.has(ident)
        ? 'keyword'
        : BOOLEANS.has(ident)
          ? 'boolean'
          : isCall
            ? 'function'
            : 'plain';
      tokens.push({ type, value: ident });
    } else if (space != null) {
      tokens.push({ type: 'plain', value: space });
    } else {
      tokens.push({ type: 'operator', value: full });
    }
  }
  return tokens;
}

/** Tokenise a whole snippet into an array of lines of tokens. */
export function tokenize(code: string): Token[][] {
  return code.replace(/\r\n/g, '\n').split('\n').map(tokenizeLine);
}
