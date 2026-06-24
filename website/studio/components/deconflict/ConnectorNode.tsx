import { LinkSimpleIcon } from '@phosphor-icons/react/dist/ssr';

// anchorsFor: evenly distributed fractions (0-1) of the SVG height where the
// fan lines attach on one side. Centered on 0.5 and capped to a [0.1, 0.9] band
// so the lines never run off the banner. Hardcoded layout (no measurement /
// refs). count of 3 reproduces the original [0.3, 0.5, 0.7] anchors.
function anchorsFor(count: number): number[] {
  if (count <= 0) return [];
  if (count === 1) return [0.5];
  const spacing = Math.min(0.2, 0.8 / (count - 1));
  const start = 0.5 - (spacing * (count - 1)) / 2;
  return Array.from({ length: count }, (_, i) => start + i * spacing);
}

export function ConnectorNode({
  matches,
  leftConnections = 3,
  rightConnections = 3,
}: {
  matches: number;
  leftConnections?: number;
  rightConnections?: number;
}) {
  const leftAnchors = anchorsFor(leftConnections);
  const rightAnchors = anchorsFor(rightConnections);
  return (
    <div className="relative flex items-center justify-center">
      {/* fan lines behind the chip */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden
      >
        <g stroke="#E8941F" strokeWidth="0.8" fill="none">
          {/* left cards -> node */}
          {leftAnchors.map((y, i) => (
            <path key={`l${i}`} d={`M0 ${y * 100} C 30 ${y * 100}, 35 50, 50 50`} />
          ))}
          {/* node -> right cards */}
          {rightAnchors.map((y, i) => (
            <path key={`r${i}`} d={`M50 50 C 65 50, 70 ${y * 100}, 100 ${y * 100}`} />
          ))}
        </g>
      </svg>

      {/* the chip */}
      <div
        className="glass-surface glass-tint [--glass-blur-base:12px] relative z-10 flex h-20 w-20 flex-col items-center justify-center
                   rounded-full border border-white/60 shadow-glass"
      >
        <LinkSimpleIcon weight="bold" className="h-5 w-5 text-match" />
        <span className="mt-0.5 text-xs font-semibold text-ink">
          {matches} {matches === 1 ? 'Match' : 'Matches'}
        </span>
      </div>
    </div>
  );
}
