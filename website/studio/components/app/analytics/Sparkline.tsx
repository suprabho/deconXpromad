import clsx from 'clsx';
import { toPoints, linePath } from './geometry';

/* -------------------------------------------------------------------------- *
 * Sparkline — a compact, label-free trend line for stat cards and table cells.
 * Optional end-cap dot marks the latest value. Pure SVG, server-renderable.
 * -------------------------------------------------------------------------- */

const STROKES = {
  fi: '#2563EB',
  match: '#E8941F',
  ok: '#10B981',
  alert: '#C0392B',
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
    <svg
      viewBox="0 0 100 32"
      preserveAspectRatio="none"
      className={clsx('h-8 w-full', className)}
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
      {endDot && last && (
        <circle cx={last.x} cy={last.y} r="2" fill={stroke} stroke="#fff" strokeWidth="1" />
      )}
    </svg>
  );
}
