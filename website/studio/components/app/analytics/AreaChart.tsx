'use client';

import { useId } from 'react';
import clsx from 'clsx';
import { linePath, areaPath, type Point } from './geometry';

/* -------------------------------------------------------------------------- *
 * AreaChart — the filled trend chart from Screen 3: a smooth line over a soft
 * gradient fill, with an optional second (comparison) series and x-axis ticks.
 * Both series share one y-scale so they read as honestly comparable. Pure SVG;
 * the gradient id is hashed via useId so multiple charts coexist on a page.
 * -------------------------------------------------------------------------- */

const TONES = {
  fi: { stroke: '#2563EB', fill: '#2563EB' },
  match: { stroke: '#E8941F', fill: '#E8941F' },
  ok: { stroke: '#10B981', fill: '#10B981' },
} as const;

export function AreaChart({
  data,
  compare,
  tone = 'fi',
  ticks,
  height = 160,
  smooth = true,
  className,
  ariaLabel = 'area chart',
}: {
  data: number[];
  /** Optional faded comparison series, drawn dashed behind the main line. */
  compare?: number[];
  tone?: keyof typeof TONES;
  /** X-axis labels rendered as HTML under the plot. */
  ticks?: string[];
  height?: number;
  smooth?: boolean;
  className?: string;
  ariaLabel?: string;
}) {
  const id = useId().replace(/:/g, '');
  const t = TONES[tone];

  const all = compare ? [...data, ...compare] : data;
  const min = Math.min(...all);
  const max = Math.max(...all);
  const span = max - min || 1;

  // Shared scale across both series into the 100×32 viewBox.
  const scale = (vals: number[]): Point[] => {
    const innerH = 32 - 6;
    const step = vals.length > 1 ? 100 / (vals.length - 1) : 0;
    return vals.map((v, i) => ({ x: i * step, y: 3 + innerH - ((v - min) / span) * innerH }));
  };
  const mainPts = scale(data);
  const cmpPts = compare ? scale(compare) : null;

  return (
    <div className={clsx('w-full', className)}>
      <svg
        viewBox="0 0 100 32"
        preserveAspectRatio="none"
        style={{ height }}
        className="w-full"
        role="img"
        aria-label={ariaLabel}
      >
        <defs>
          <linearGradient id={`area-${id}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={t.fill} stopOpacity="0.28" />
            <stop offset="100%" stopColor={t.fill} stopOpacity="0" />
          </linearGradient>
        </defs>

        {[8, 16, 24].map((y) => (
          <line key={y} x1="0" y1={y} x2="100" y2={y} stroke="#E5E7EB" strokeWidth="0.3" />
        ))}

        {cmpPts && (
          <path
            d={linePath(cmpPts, smooth)}
            fill="none"
            stroke="#94A3B8"
            strokeWidth="1.2"
            strokeDasharray="2 2"
            vectorEffect="non-scaling-stroke"
          />
        )}

        <path d={areaPath(mainPts, 32, smooth)} fill={`url(#area-${id})`} stroke="none" />
        <path
          d={linePath(mainPts, smooth)}
          fill="none"
          stroke={t.stroke}
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      {ticks && (
        <div className="mt-2 flex justify-between px-0.5 text-[11px] text-muted">
          {ticks.map((tk, i) => (
            <span key={`${tk}-${i}`}>{tk}</span>
          ))}
        </div>
      )}
    </div>
  );
}
