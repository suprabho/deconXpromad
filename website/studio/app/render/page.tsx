import { CompositionStage } from '@/components/studio/CompositionStage';
import { getConfig } from '@/lib/composition/store';
import { DEFAULT_COMPOSITION } from '@/lib/composition/defaults';

// Always run fresh on the server (it reads the in-process handoff store) and on
// the Node runtime so it shares that store with the export route.
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * Chrome-less render surface. Playwright navigates here and screenshots #stage.
 * The id resolves to a stashed config; if it's missing/expired we render the
 * default so the page never errors blank (mirrors header-studio's resilience).
 */
export default async function RenderRoute({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const { id } = await searchParams;
  const config = (id && getConfig(id)) || DEFAULT_COMPOSITION;
  return <CompositionStage config={config} />;
}
