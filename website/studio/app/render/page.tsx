import { CompositionStage } from '@/components/studio/CompositionStage';
import { getHandoff } from '@/lib/composition/handoff';
import { getCachedAuraUrl } from '@/lib/composition/aura-cache';
import { DEFAULT_COMPOSITION } from '@/lib/composition/defaults';
import { auraCacheKey } from '@/lib/composition/types';

// Always run fresh on the server (it resolves the handoff config) and on the
// Node runtime (the handoff store / in-process fallback needs Node).
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * Chrome-less render surface. Playwright navigates here and screenshots #stage.
 * `id` resolves to the config the export route stashed (via Supabase on
 * serverless, or the in-process store locally). If it's missing/expired we
 * render the default so the page never errors blank.
 *
 * This is the export surface, so an aura background is rendered as its cached
 * still (never the live WebGL iframe — the headless browser has no GPU). The
 * export client snapshots + caches the aura before calling /api/export, so the
 * still is normally present; if it isn't, the background colour shows through.
 */
export default async function RenderRoute({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const { id } = await searchParams;
  const config = (id && (await getHandoff(id))) || DEFAULT_COMPOSITION;
  const staticAuraUrl =
    config.background.kind === 'aura' && config.background.auraSlug
      ? await getCachedAuraUrl(auraCacheKey(config.background.auraSlug, config.sizeId)).catch(() => null)
      : null;
  return <CompositionStage config={config} staticAuraUrl={staticAuraUrl} />;
}
