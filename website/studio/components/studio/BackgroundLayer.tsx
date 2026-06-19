import type { CSSProperties } from 'react';
import {
  auraEmbedUrl,
  backgroundImageFilter,
  objectPositionFor,
  type BackgroundConfig,
} from '@/lib/composition/types';
import { assetUrl } from '@/lib/assets/catalog';
import { PatternScene } from '@/components/patterns/PatternScene';

/**
 * z-0 background. An aura is a cross-origin WebGL iframe in the editor (it can't
 * be canvas-captured here). For the headless export it's swapped for a static
 * still — see `staticAuraUrl`. Image / solid are local.
 *
 * `staticAuraUrl` selects the aura render mode (tri-state):
 *   - undefined  → editor: render the live, animated iframe.
 *   - string     → export: render the cached still as an <img>.
 *   - null       → export, but the still isn't cached (or Supabase is off):
 *                  render the background colour so the headless browser never
 *                  loads the WebGL iframe (which has no GPU and would hang).
 *
 * `opacity` and `blur` are whole-layer knobs that apply to every kind. A blurred
 * layer is overscanned (scaled up a touch) so the soft fringe a `blur()` leaves
 * around the edges is pushed past the frame instead of showing as a translucent
 * border — the stage clips it (CompositionStage is `overflow-hidden`).
 */
export function BackgroundLayer({
  background,
  staticAuraUrl,
}: {
  background: BackgroundConfig;
  staticAuraUrl?: string | null;
}) {
  const opacity = background.opacity ?? 1;
  const blur = background.blur ?? 0;
  const blurCss = blur > 0 ? `blur(${blur}px)` : '';
  // Overscan ~ enough to swallow the blur radius at any frame size; cheap + clipped.
  const overscan: CSSProperties = blur > 0 ? { transform: `scale(${1 + Math.min(blur, 60) / 200})` } : {};

  if (background.kind === 'aura' && background.auraSlug) {
    // Export surface: use the cached still (or the background colour if absent).
    if (staticAuraUrl !== undefined) {
      if (staticAuraUrl) {
        return (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={staticAuraUrl}
            alt=""
            aria-hidden
            className="absolute inset-0 z-0 h-full w-full"
            style={{ objectFit: 'cover', opacity, filter: blurCss || undefined, ...overscan }}
          />
        );
      }
      return (
        <div
          className="absolute inset-0 z-0"
          style={{ background: background.color ?? '#0D1B3E', opacity, filter: blurCss || undefined, ...overscan }}
        />
      );
    }
    // Editor: the live, animated scene.
    return (
      <iframe
        title="Aura background"
        src={auraEmbedUrl(background.auraSlug)}
        className="absolute inset-0 z-0 h-full w-full border-0"
        style={{ pointerEvents: 'none', opacity, filter: blurCss || undefined, ...overscan }}
        sandbox="allow-scripts allow-same-origin"
        loading="eager"
      />
    );
  }

  if (background.kind === 'pattern' && background.pattern) {
    // A deterministic SVG motif, sized to the frame. opacity / blur / overscan
    // apply on the wrapper exactly like the other kinds.
    return (
      <div
        className="absolute inset-0 z-0"
        style={{ opacity, filter: blurCss || undefined, ...overscan }}
      >
        <PatternScene config={background.pattern} />
      </div>
    );
  }

  if (background.kind === 'image' && background.imageSrc) {
    const imageFilter = [blurCss, backgroundImageFilter(background)].filter(Boolean).join(' ') || undefined;
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={assetUrl(background.imageSrc)}
        alt=""
        aria-hidden
        className="absolute inset-0 z-0 h-full w-full"
        style={{
          objectFit: background.imageFit ?? 'cover',
          objectPosition: objectPositionFor(background.imageFocus ?? 'center'),
          opacity,
          filter: imageFilter,
          ...overscan,
        }}
      />
    );
  }

  return (
    <div
      className="absolute inset-0 z-0"
      style={{ background: background.color ?? '#0D1B3E', opacity, filter: blurCss || undefined, ...overscan }}
    />
  );
}
