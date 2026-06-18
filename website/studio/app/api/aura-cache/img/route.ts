import { readLocalAura } from '@/lib/composition/aura-cache';

export const runtime = 'nodejs';

/**
 * Serves a locally-cached aura still. Dev-only backend for the aura cache: when
 * not on Vercel, `putCachedAura` writes the PNG to a temp dir and returns
 * `/api/aura-cache/img?key=…`, which the headless /render surface (same origin)
 * <img>-loads. On Vercel stills come from Supabase public URLs instead, so this
 * route just 404s there.
 *
 *   GET /api/aura-cache/img?key=slug__sizeId → image/png
 */
export async function GET(req: Request) {
  const key = new URL(req.url).searchParams.get('key') ?? '';
  const png = key ? await readLocalAura(key) : null;
  if (!png) return new Response('Not found', { status: 404 });
  return new Response(new Uint8Array(png), {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}
