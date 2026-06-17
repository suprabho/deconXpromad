import { getCachedAuraUrl, putCachedAura } from '@/lib/composition/aura-cache';

export const runtime = 'nodejs';

/** Cache check: GET /api/aura-cache?key=slug__sizeId → { url: string | null }. */
export async function GET(req: Request) {
  const key = new URL(req.url).searchParams.get('key') ?? '';
  if (!key) return Response.json({ url: null });
  const url = await getCachedAuraUrl(key).catch(() => null);
  return Response.json({ url });
}

/** Cache store: POST { key, dataUrl } (a data:image/png;base64,… still) → { url }. */
export async function POST(req: Request) {
  let key: string;
  let dataUrl: string;
  try {
    const body = await req.json();
    key = String(body?.key ?? '');
    dataUrl = String(body?.dataUrl ?? '');
  } catch {
    return new Response('Invalid JSON body', { status: 400 });
  }
  if (!key || !dataUrl.startsWith('data:image/')) {
    return new Response('Expected { key, dataUrl: data:image/… }', { status: 400 });
  }

  const png = Buffer.from(dataUrl.slice(dataUrl.indexOf(',') + 1), 'base64');
  try {
    const url = await putCachedAura(key, png);
    return Response.json({ url });
  } catch (e) {
    return new Response((e as Error).message ?? 'Aura cache write failed', { status: 500 });
  }
}
