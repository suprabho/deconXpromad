import clsx from 'clsx';
import { WindowChrome } from '../primitives/WindowChrome';

/* -------------------------------------------------------------------------- *
 * EntityGraph — the radial node-link diagram at the centre of Screen 1: one
 * highlighted hub with spokes fanning out to satellite entities arranged in
 * concentric rings. Layout is computed deterministically from the data (even
 * angular distribution per ring), so it renders identically on the server —
 * no refs, no measurement, no client JS.
 *
 * Tones colour both the node fill and let you flag matched / alerting entities.
 *
 * Set `frame` to drop the graph inside a macOS-style dialog-box panel (the same
 * WindowChrome the code window uses), so it reads as a standalone window when
 * floated on the studio stage.
 * -------------------------------------------------------------------------- */

export type GraphTone = 'hub' | 'active' | 'match' | 'alert' | 'idle';

export type GraphNode = {
  id: string;
  label?: string;
  /** Which concentric ring (1 = inner, 2 = outer). Defaults to 1. */
  ring?: 1 | 2;
  tone?: GraphTone;
};

const NODE_FILL: Record<GraphTone, string> = {
  hub: '#2563EB', // fi
  active: '#2563EB',
  match: '#E8941F', // match orange
  alert: '#C0392B', // risk
  idle: '#FFFFFF',
};
const NODE_STROKE: Record<GraphTone, string> = {
  hub: '#1A56DB',
  active: '#1A56DB',
  match: '#E8941F',
  alert: '#C0392B',
  idle: '#CBD5E1',
};

const RING_RADIUS = { 1: 26, 2: 40 } as const;
const RING_NODE_R = { 1: 2.6, 2: 2.1 } as const;
// Phase-offset each ring so inner and outer nodes don't line up on one spoke.
const RING_PHASE = { 1: -Math.PI / 2, 2: -Math.PI / 2 + Math.PI / 7 } as const;

export function EntityGraph({
  nodes,
  hubLabel = 'Subject',
  className,
  ariaLabel = 'Entity relationship graph',
  frame = false,
  frameTitle = 'Entity Graph',
}: {
  nodes: GraphNode[];
  hubLabel?: string;
  className?: string;
  ariaLabel?: string;
  /** Wrap the graph in a macOS-style dialog-box panel. */
  frame?: boolean;
  /** Title shown in the frame's chrome (only when `frame`). */
  frameTitle?: string;
}) {
  const byRing = {
    1: nodes.filter((n) => (n.ring ?? 1) === 1),
    2: nodes.filter((n) => n.ring === 2),
  };

  const placed = (Object.keys(byRing) as unknown as (1 | 2)[]).flatMap((ring) => {
    const list = byRing[ring];
    const radius = RING_RADIUS[ring];
    const phase = RING_PHASE[ring];
    return list.map((node, i) => {
      const theta = phase + (i / Math.max(1, list.length)) * Math.PI * 2;
      return {
        node,
        x: 50 + radius * Math.cos(theta),
        y: 50 + radius * Math.sin(theta),
        r: RING_NODE_R[ring],
      };
    });
  });

  const graph = (
    <div className={clsx('relative aspect-square w-full', !frame && className)}>
      <svg viewBox="0 0 100 100" className="h-full w-full" role="img" aria-label={ariaLabel}>
        {/* faint concentric guide rings */}
        {[RING_RADIUS[1], RING_RADIUS[2]].map((r) => (
          <circle key={r} cx="50" cy="50" r={r} fill="none" stroke="#E5E7EB" strokeWidth="0.3" strokeDasharray="0.6 1.4" />
        ))}

        {/* spokes hub → satellite */}
        {placed.map(({ node, x, y }) => (
          <line
            key={`edge-${node.id}`}
            x1="50"
            y1="50"
            x2={x}
            y2={y}
            stroke={node.tone === 'match' || node.tone === 'alert' ? NODE_STROKE[node.tone] : '#CBD5E1'}
            strokeWidth={node.tone === 'match' || node.tone === 'alert' ? 0.6 : 0.4}
            opacity={node.tone === 'idle' || !node.tone ? 0.7 : 1}
          />
        ))}

        {/* satellites */}
        {placed.map(({ node, x, y, r }) => {
          const tone = node.tone ?? 'idle';
          return (
            <circle
              key={`node-${node.id}`}
              cx={x}
              cy={y}
              r={r}
              fill={NODE_FILL[tone]}
              stroke={NODE_STROKE[tone]}
              strokeWidth="0.6"
            />
          );
        })}

        {/* hub: soft halo + filled core */}
        <circle cx="50" cy="50" r="7.5" fill="#2563EB" opacity="0.12" />
        <circle cx="50" cy="50" r="4.6" fill={NODE_FILL.hub} stroke={NODE_STROKE.hub} strokeWidth="0.8" />
      </svg>

      {/* hub label rendered as HTML so it keeps its real font size */}
      <span className="pointer-events-none absolute left-1/2 top-[58%] -translate-x-1/2 whitespace-nowrap text-[11px] font-semibold text-ink">
        {hubLabel}
      </span>
    </div>
  );

  if (!frame) return graph;

  // Dialog-box frame: a frosted panel with macOS window chrome behind the graph.
  return (
    <div
      className={clsx(
        'glass-surface glass-tint [--glass-tint-base:0.8] overflow-hidden rounded-2xl border border-hair/70 shadow-glass',
        className
      )}
    >
      <WindowChrome tone="light" title={frameTitle} />
      <div className="p-4">{graph}</div>
    </div>
  );
}
