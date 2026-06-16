import { placementStyle, SCALE_FRACTION, type OverlayTextConfig } from '@/lib/composition/types';

/** z-4 — badge / title / subtitle, preset-placed, sized relative to the canvas. */
export function OverlayTextLayer({ overlay, width }: { overlay: OverlayTextConfig; width: number }) {
  if (overlay.hidden) return null;
  if (!overlay.badge && !overlay.title && !overlay.subtitle) return null;

  const gap = Math.round(width * 0.05);
  const maxWidth = Math.round(SCALE_FRACTION[overlay.maxWidthScale] * width);
  const titleSize = Math.round(width * 0.046);
  const subSize = Math.round(width * 0.0185);
  const badgeSize = Math.round(width * 0.0115);

  return (
    <div
      className="z-[4]"
      style={{
        ...placementStyle(overlay.position, gap),
        maxWidth,
        textAlign: overlay.align,
        color: overlay.textColor,
      }}
    >
      {overlay.badge && (
        <div
          className="font-semibold uppercase"
          style={{
            fontSize: badgeSize,
            letterSpacing: '0.2em',
            color: overlay.accent,
            marginBottom: Math.round(width * 0.014),
          }}
        >
          {overlay.badge}
        </div>
      )}
      {overlay.title && (
        <h1 className="font-sans font-semibold" style={{ fontSize: titleSize, lineHeight: 1.05, letterSpacing: '-0.01em' }}>
          {overlay.title}
        </h1>
      )}
      {overlay.subtitle && (
        <p
          className="font-sans"
          style={{ fontSize: subSize, lineHeight: 1.45, marginTop: Math.round(width * 0.018), opacity: 0.92 }}
        >
          {overlay.subtitle}
        </p>
      )}
    </div>
  );
}
