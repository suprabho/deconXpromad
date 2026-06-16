import { Warning } from '@phosphor-icons/react/dist/ssr';
import type { AlertData } from '@/lib/composition/types';

export function OverlapAlert({ status, detail, timestamp }: AlertData) {
  return (
    <div
      role="status"
      className="flex items-center gap-3 rounded-xl border border-alert-border
                 bg-alert-bg px-5 py-3.5 text-ink"
    >
      <Warning weight="fill" className="h-5 w-5 shrink-0 text-alert-icon" />
      <p className="text-sm font-semibold tracking-wide">
        {status} <span className="font-medium opacity-80">&mdash; {detail}</span>
      </p>
      <time className="ml-auto text-xs font-medium text-ink/70">{timestamp}</time>
    </div>
  );
}
