/* -------------------------------------------------------------------------- *
 * <Fingerprint /> — renders a deterministic, seed-derived fingerprint inline.
 *
 * React owns the SVG nodes (rather than dangerouslySetInnerHTML) so the ridges
 * can be styled, animated, or measured. Pure and SSR-safe: the same seed always
 * paints the same mark. See `@/lib/fingerprint/generate` for the algorithm.
 * -------------------------------------------------------------------------- */

import { generateFingerprint, type FingerprintOptions } from '@/lib/fingerprint/generate';

export interface FingerprintProps extends FingerprintOptions {
  /** Any string — an email, case id, uuid… maps 1:1 to a unique print. */
  seed: string;
  className?: string;
  /** Accessible label; omit to mark the SVG decorative. */
  title?: string;
}

export function Fingerprint({ seed, className, title, ...options }: FingerprintProps) {
  const fp = generateFingerprint(seed, options);
  const cap = options.roundCaps === false ? 'butt' : 'round';

  return (
    <svg
      className={className}
      width={fp.size}
      height={fp.size}
      viewBox={fp.viewBox}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
    >
      {title ? <title>{title}</title> : null}
      {fp.background ? <rect width={fp.size} height={fp.size} fill={fp.background} /> : null}
      <g stroke={fp.color} strokeLinecap={cap} strokeLinejoin="round">
        {fp.paths.map((p, i) => (
          <path key={i} d={p.d} strokeWidth={p.width} />
        ))}
      </g>
    </svg>
  );
}

export default Fingerprint;
