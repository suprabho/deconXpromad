import { CompositionStage } from '@/components/studio/CompositionStage';
import { getConfig } from '@/lib/composition/store';
import { fetchConfigBlob } from '@/lib/composition/blob-handoff';
import { DEFAULT_COMPOSITION } from '@/lib/composition/defaults';

// Always run fresh on the server (it reads the handoff config) and on the Node
// runtime (it may share the in-process store with the export route locally).
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * Chrome-less render surface. Playwright navigates here and screenshots #stage.
 * The config arrives one of two ways: `u` is a Vercel Blob URL (serverless, where
 * export/render are separate invocations) and `id` keys the in-process store
 * (local single-process dev). Either resolves to the stashed config; if it's
 * missing/expired we render the default so the page never errors blank.
 */
export default async function RenderRoute({
  searchParams,
}: {
  searchParams: Promise<{ id?: string; u?: string }>;
}) {
  const { id, u } = await searchParams;
  const config =
    (u && (await fetchConfigBlob(u))) || (id && getConfig(id)) || DEFAULT_COMPOSITION;
  return <CompositionStage config={config} />;
}
