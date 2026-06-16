import { WarningIcon } from '@phosphor-icons/react/dist/ssr';
import type { AlertData } from '@/lib/composition/types';

export function OverlapAlert({ status, detail, timestamp }: AlertData) {
  return (
    <div
      role="status"
      className="glass-surface [--glass-blur-base:12px] flex items-center gap-3 rounded-xl border border-alert-border/70
                 bg-alert-bg/80 px-5 py-3.5 text-ink shadow-glass-sm"
    >
      <span
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full
                   border border-white/50 bg-white/40 shadow-pill-inset backdrop-blur-sm"
      >
        <WarningIcon weight="fill" className="h-5 w-5 text-alert-icon" />
      </span>
      <p className="text-sm font-semibold tracking-wide">
        {status} <span className="font-medium opacity-80">&mdash; {detail}</span>
      </p>
      <time className="ml-auto text-xs font-medium text-ink/70">{timestamp}</time>
    </div>
  );
}
