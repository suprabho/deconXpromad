import { composeMidTransform, type MidGraphic } from '@/lib/composition/types';
import { assetUrl } from '@/lib/assets/catalog';

/** z-2 — freely placed (2-D) SVG / image graphics between background and foreground. */
export function MidGraphicsLayer({ items, width }: { items: MidGraphic[]; width: number }) {
  if (!items.length) return null;
  return (
    <div className="absolute inset-0 z-[2]" style={{ pointerEvents: 'none' }}>
      {items.map((g) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={g.id}
          src={assetUrl(g.src)}
          alt=""
          aria-hidden
          style={{
            position: 'absolute',
            left: `${g.transform.x}%`,
            top: `${g.transform.y}%`,
            width: Math.round(g.transform.width * width),
            height: 'auto',
            // Opt out of Tailwind Preflight's `img { max-width: 100% }`, which
            // would otherwise clamp the graphic to the canvas width (≤ 100%).
            maxWidth: 'none',
            transform: composeMidTransform(g.transform),
            opacity: g.opacity,
          }}
        />
      ))}
    </div>
  );
}
