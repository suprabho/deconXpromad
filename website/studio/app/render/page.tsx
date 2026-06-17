import { CompositionStage } from '@/components/studio/CompositionStage';
import { getHandoff } from '@/lib/composition/handoff';
import { DEFAULT_COMPOSITION } from '@/lib/composition/defaults';

// Always run fresh on the server (it resolves the handoff config) and on the
// Node runtime (the handoff store / in-process fallback needs Node).
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * Chrome-less render surface. Playwright navigates here and screenshots #stage.
 * `id` resolves to the config the export route stashed (via Supabase on
 * serverless, or the in-process store locally). If it's missing/expired we
 * render the default so the page never errors blank.
 */
export default async function RenderRoute({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const { id } = await searchParams;
  const config = (id && (await getHandoff(id))) || DEFAULT_COMPOSITION;
  return <CompositionStage config={config} />;
}
