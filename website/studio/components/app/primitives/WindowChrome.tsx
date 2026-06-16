import type { ReactNode } from 'react';
import clsx from 'clsx';

/* -------------------------------------------------------------------------- *
 * WindowChrome — the macOS-style title bar: three traffic-light dots, an
 * optional centred title, and a right-aligned action slot. Shared by the code
 * window (Screen 5) and any framed "app preview" panel.
 *
 * `tone="dark"` for the code editor; `tone="light"` for frosted-glass panels.
 * -------------------------------------------------------------------------- */

const TONES = {
  light: { bar: 'border-hair/70 bg-white/60', title: 'text-muted' },
  dark: { bar: 'border-white/10 bg-white/[0.04]', title: 'text-white/60' },
} as const;

const LIGHTS = ['bg-[#ff5f57]', 'bg-[#febc2e]', 'bg-[#28c840]'];

export function WindowChrome({
  title,
  tone = 'light',
  actions,
  className,
}: {
  title?: ReactNode;
  tone?: keyof typeof TONES;
  actions?: ReactNode;
  className?: string;
}) {
  const t = TONES[tone];
  return (
    <div className={clsx('flex items-center gap-2 border-b px-4 py-3', t.bar, className)}>
      <div className="flex items-center gap-2" aria-hidden>
        {LIGHTS.map((c) => (
          <span key={c} className={clsx('h-3 w-3 rounded-full', c)} />
        ))}
      </div>
      {title && (
        <span className={clsx('ml-2 text-xs font-semibold tracking-wide', t.title)}>{title}</span>
      )}
      {actions && <div className="ml-auto flex items-center gap-1">{actions}</div>}
    </div>
  );
}
