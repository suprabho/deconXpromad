import clsx from 'clsx';
import { toPoints, linePath } from './geometry';

/* -------------------------------------------------------------------------- *
 * Sparkline — a compact, label-free trend line for stat cards and table cells.
 * Optional end-cap dot marks the latest value. Pure SVG, server-renderable.
 * -------------------------------------------------------------------------- */

const STROKES = {
  fi: '#1A56DB', // cobalt
  match: '#2F8F5C', // verified green
  ok: '#2F8F5C', // verified green
  alert: '#B91C1C', // alert red
  white: '#FFFFFF',
} as const;

export function Sparkline({
  data,
  tone = 'fi',
  smooth = true,
  endDot = true,
  strokeWidth = 1.6,
  className,
}: {
  data: number[];
  tone?: keyof typeof STROKES;
  smooth?: boolean;
  endDot?: boolean;
  strokeWidth?: number;
  className?: string;
}) {
  const pts = toPoints(data, 100, 32, 3);
  const last = pts[pts.length - 1];
  const stroke = STROKES[tone];

  return (
    <span className={clsx('relative block h-8 w-full', className)}>
      <svg
        viewBox="0 0 100 32"
        preserveAspectRatio="none"
        className="h-full w-full"
        role="img"
        aria-label="trend sparkline"
      >
        <path
          d={linePath(pts, smooth)}
          fill="none"
          stroke={stroke}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      {/* The dot lives outside the stretched SVG so it stays a circle at any width. */}
      {endDot && last && (
        <span
          className="absolute h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full ring-1 ring-white"
          style={{ left: `${last.x}%`, top: `${(last.y / 32) * 100}%`, backgroundColor: stroke }}
        />
      )}
    </span>
  );
}
