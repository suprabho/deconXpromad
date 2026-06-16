import { placementStyle, SCALE_FRACTION, type MidGraphic } from '@/lib/composition/types';
import { assetUrl } from '@/lib/assets/catalog';

/** z-2 — preset-placed SVG / image graphics between background and foreground. */
export function MidGraphicsLayer({ items, width }: { items: MidGraphic[]; width: number }) {
  if (!items.length) return null;
  const gap = Math.round(width * 0.045);
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
            ...placementStyle(g.position, gap),
            width: Math.round(SCALE_FRACTION[g.size] * width),
            height: 'auto',
            opacity: g.opacity,
          }}
        />
      ))}
    </div>
  );
}
