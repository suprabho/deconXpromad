import { LinkSimple } from '@phosphor-icons/react/dist/ssr';

// yAnchors: fractions (0-1) of the SVG height where the matched rows sit.
// Hardcoded for the fixed-layout banner (no measurement / refs).
const yAnchors = [0.3, 0.5, 0.7];

export function ConnectorNode({ matches }: { matches: number }) {
  return (
    <div className="relative flex items-center justify-center">
      {/* fan lines behind the chip */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden
      >
        {yAnchors.map((y, i) => (
          <g key={i} stroke="#E8941F" strokeWidth="0.8" fill="none">
            {/* left card -> node */}
            <path d={`M0 ${y * 100} C 30 ${y * 100}, 35 50, 50 50`} />
            {/* node -> right card */}
            <path d={`M50 50 C 65 50, 70 ${y * 100}, 100 ${y * 100}`} />
          </g>
        ))}
      </svg>

      {/* the chip */}
      <div
        className="relative z-10 flex h-20 w-20 flex-col items-center justify-center
                   rounded-full border border-hair bg-white shadow-md"
      >
        <LinkSimple weight="bold" className="h-5 w-5 text-match" />
        <span className="mt-0.5 text-xs font-semibold text-ink">
          {matches} {matches === 1 ? 'Match' : 'Matches'}
        </span>
      </div>
    </div>
  );
}
