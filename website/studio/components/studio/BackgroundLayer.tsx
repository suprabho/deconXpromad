import { auraEmbedUrl, type BackgroundConfig } from '@/lib/composition/types';
import { assetUrl } from '@/lib/assets/catalog';

/**
 * z-0 background. An aura is a cross-origin iframe (the reason export must be a
 * real browser screenshot — it can't be canvas-captured). Image / solid are local.
 */
export function BackgroundLayer({ background }: { background: BackgroundConfig }) {
  if (background.kind === 'aura' && background.auraSlug) {
    return (
      <iframe
        title="Aura background"
        src={auraEmbedUrl(background.auraSlug)}
        className="absolute inset-0 z-0 h-full w-full border-0"
        style={{ pointerEvents: 'none' }}
        sandbox="allow-scripts allow-same-origin"
        loading="eager"
      />
    );
  }

  if (background.kind === 'image' && background.imageSrc) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={assetUrl(background.imageSrc)}
        alt=""
        aria-hidden
        className="absolute inset-0 z-0 h-full w-full"
        style={{ objectFit: background.imageFit ?? 'cover' }}
      />
    );
  }

  return (
    <div className="absolute inset-0 z-0" style={{ background: background.color ?? '#0D1B3E' }} />
  );
}
