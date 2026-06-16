import { renderComposition, type ImageFormat } from '@/lib/composition/screenshot';
import { putConfig } from '@/lib/composition/store';
import { DEFAULT_COMPOSITION } from '@/lib/composition/defaults';
import type { CompositionConfig } from '@/lib/composition/types';

export const runtime = 'nodejs'; // Playwright + sharp need Node, not Edge.
export const maxDuration = 60;

export async function POST(req: Request) {
  let config: CompositionConfig;
  let format: ImageFormat = 'png';
  try {
    const body = await req.json();
    config = { ...DEFAULT_COMPOSITION, ...(body?.config ?? {}) };
    if (body?.format === 'webp') format = 'webp';
  } catch {
    return new Response('Invalid JSON body', { status: 400 });
  }

  try {
    const origin = new URL(req.url).origin;
    const id = putConfig(config);
    const renderUrl = `${origin}/render?id=${id}`;
    const buf = await renderComposition(renderUrl, config, { scale: 2, format });

    return new Response(new Uint8Array(buf), {
      status: 200,
      headers: {
        'Content-Type': format === 'webp' ? 'image/webp' : 'image/png',
        'Content-Disposition': `inline; filename="composition-${config.sizeId}.${format}"`,
        'Cache-Control': 'no-store',
      },
    });
  } catch (e) {
    const msg = (e as Error).message ?? 'render failed';
    const hint = /Executable doesn't exist|launch|browserType/i.test(msg)
      ? ' — run `pnpm exec playwright install chromium` in website/studio.'
      : '';
    return new Response(`Export failed: ${msg}${hint}`, { status: 500 });
  }
}
