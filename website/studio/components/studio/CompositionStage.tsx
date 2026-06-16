import { sizeFor, type CompositionConfig } from '@/lib/composition/types';
import { BackgroundLayer } from './BackgroundLayer';
import { ScrimLayer } from './ScrimLayer';
import { MidGraphicsLayer } from './MidGraphicsLayer';
import { ForegroundLayer } from './ForegroundLayer';
import { OverlayTextLayer } from './OverlayTextLayer';

/**
 * The single source of truth for what a composition looks like. Rendered at
 * EXACT pixel size (never responsive) so the three surfaces that mount it —
 * the editor preview (scaled via CSS transform), the chrome-less /render route,
 * and the Playwright screenshot — are pixel-identical.
 *
 * Layer order (z): background → scrim → mid graphics → foreground → overlay text.
 */
export function CompositionStage({ config }: { config: CompositionConfig }) {
  const size = sizeFor(config.sizeId);
  return (
    <div
      id="stage"
      className="relative overflow-hidden font-sans text-ink"
      style={{
        width: size.width,
        height: size.height,
        background: config.background.color ?? '#0D1B3E',
        isolation: 'isolate',
      }}
    >
      <BackgroundLayer background={config.background} />
      <ScrimLayer scrim={config.scrim} />
      <MidGraphicsLayer items={config.midGraphics} width={size.width} />
      <ForegroundLayer foreground={config.foreground} width={size.width} />
      <OverlayTextLayer overlay={config.overlay} width={size.width} />
    </div>
  );
}
