import { ChartLineUpIcon } from '@phosphor-icons/react/dist/ssr';
import type { TimelineData } from '@/lib/composition/types';

const FALLBACK_START = new Date('2024-04-01').getTime();
const FALLBACK_END = new Date('2024-07-01').getTime();

/** Parse an ISO date string to epoch ms, skipping anything unparseable. */
function parse(date: string): number | null {
  const t = new Date(date).getTime();
  return Number.isNaN(t) ? null : t;
}

/** Compute the chart's time range from every date present in the data. */
function computeRange(data: TimelineData): { start: number; end: number } {
  const stamps: number[] = [];
  for (const tk of data.ticks) {
    const t = parse(tk.date);
    if (t !== null) stamps.push(t);
  }
  for (const d of data.overlaps) {
    const t = parse(d);
    if (t !== null) stamps.push(t);
  }
  for (const track of data.tracks) {
    for (const seg of track.segments) {
      const from = parse(seg.from);
      const to = parse(seg.to);
      if (from !== null) stamps.push(from);
      if (to !== null) stamps.push(to);
    }
  }

  if (stamps.length === 0) {
    return { start: FALLBACK_START, end: FALLBACK_END };
  }

  let start = Math.min(...stamps);
  let end = Math.max(...stamps);
  // Guard against a zero-width range (all dates identical / single point).
  if (end <= start) end = start + 1;
  return { start, end };
}

export function ActivityTimeline({ tracks, overlaps, ticks }: TimelineData) {
  const { start, end } = computeRange({ tracks, overlaps, ticks });

  function frac(date: string): number {
    const t = parse(date);
    if (t === null) return 0;
    const raw = (t - start) / (end - start);
    // Clamp so edited / out-of-range dates never overflow the chart.
    return Math.max(0, Math.min(1, raw));
  }

  const H = 120;
  const rowY = (i: number) => 30 + i * 34;

  return (
    <div className="rounded-xl border border-white/60 bg-white/70 p-5 shadow-glass backdrop-blur-xl">
      <h4 className="mb-4 flex items-center gap-2 text-sm font-bold tracking-wide text-ink">
        <ChartLineUpIcon weight="bold" className="h-4 w-4 text-match" />
        CASE ACTIVITY TIMELINE
      </h4>
      <div className="flex gap-6">
        {/* legend */}
        <ul className="w-44 space-y-3 pt-3 text-sm text-muted">
          {tracks.map((t) => (
            <li key={t.label} className="flex items-center gap-2">
              <span
                className="h-1 w-6 rounded-full"
                style={{ background: t.color }}
              />
              {t.label}
            </li>
          ))}
        </ul>

        {/* chart */}
        <div className="relative flex-1">
        <svg
          viewBox={`0 0 100 ${H}`}
          preserveAspectRatio="none"
          className="h-32 w-full"
          aria-label="case activity timeline"
        >
          {/* overlap markers */}
          {overlaps.map((d) => (
            <line
              key={d}
              x1={frac(d) * 100}
              x2={frac(d) * 100}
              y1={10}
              y2={H - 24}
              stroke="#E8941F"
              strokeWidth="0.4"
              strokeDasharray="2 2"
            />
          ))}
          {/* tracks */}
          {tracks.map((t, i) =>
            t.segments.map((s, j) => (
              <line
                key={`${i}-${j}`}
                x1={frac(s.from) * 100}
                x2={frac(s.to) * 100}
                y1={rowY(i)}
                y2={rowY(i)}
                stroke={t.color}
                strokeWidth="3"
                strokeLinecap="round"
                opacity={s.faded ? 0.25 : 1}
              />
            ))
          )}
          {/* overlap dots on the first track */}
          {overlaps.map((d) => (
            <circle
              key={`dot-${d}`}
              cx={frac(d) * 100}
              cy={rowY(0)}
              r="1.6"
              fill="#E8941F"
            />
          ))}
        </svg>
        {/* axis labels — rendered as HTML, not SVG <text>, so they keep their
            real font size. The SVG above uses preserveAspectRatio="none", which
            stretches its coordinate space horizontally to fill the chart; any
            text drawn inside it gets smeared wide and collides at larger sizes. */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-4">
          {ticks.map((tk) => (
            <span
              key={tk.date}
              className="absolute -translate-x-1/2 whitespace-nowrap text-[11px] leading-none text-muted"
              style={{ left: `${frac(tk.date) * 100}%` }}
            >
              {tk.label}
            </span>
          ))}
        </div>
        </div>
      </div>
    </div>
  );
}
