import type { Reveal } from '@/lib/composition/types';

function Dots({ count = 7 }: { count?: number }) {
  return (
    <span aria-hidden className="tracking-[0.25em] text-ink/80">
      {'•'.repeat(count)}
    </span>
  );
}

/** Derive a sensible prefix for the "partial" state when none is supplied. */
function derivePrefix(value: string): string {
  if (!value) return '';
  const dashIndex = value.indexOf('-');
  if (dashIndex > 0) return value.slice(0, dashIndex + 1);
  return value.slice(0, 3);
}

export function RedactedValue({
  value,
  reveal,
  prefix,
  groups = [7, 7],
}: {
  value: string;
  reveal: Reveal;
  prefix?: string;
  groups?: number[];
}) {
  if (reveal === 'revealed') {
    return <span className="font-mono text-ink">{value}</span>;
  }

  if (reveal === 'partial') {
    const shown = prefix ?? derivePrefix(value);
    return (
      <span className="font-mono text-ink" aria-label="partially redacted value">
        {shown}
        <Dots count={8} />
      </span>
    );
  }

  // masked
  return (
    <span className="flex items-center gap-2" aria-label="redacted value">
      {groups.map((g, i) => (
        <Dots key={i} count={g} />
      ))}
    </span>
  );
}
