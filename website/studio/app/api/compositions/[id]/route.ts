import { REMOTE_ENABLED } from '@/lib/composition/supabase-server';
import { deleteComposition, getComposition, updateComposition } from '@/lib/composition/library';
import { DEFAULT_COMPOSITION } from '@/lib/composition/defaults';
import type { CompositionConfig } from '@/lib/composition/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const NOT_CONFIGURED = 'Saving is unavailable — the database is not configured.';

type Ctx = { params: Promise<{ id: string }> };

/** GET /api/compositions/[id] — one composition with its full config. */
export async function GET(_req: Request, { params }: Ctx) {
  if (!REMOTE_ENABLED) return new Response(NOT_CONFIGURED, { status: 503 });
  const { id } = await params;
  try {
    const found = await getComposition(id);
    if (!found) return new Response('Not found', { status: 404 });
    return Response.json(found);
  } catch (e) {
    return new Response((e as Error).message ?? 'Load failed', { status: 500 });
  }
}

/** PUT /api/compositions/[id] — update name and/or config. */
export async function PUT(req: Request, { params }: Ctx) {
  if (!REMOTE_ENABLED) return new Response(NOT_CONFIGURED, { status: 503 });
  const { id } = await params;

  const patch: { name?: string; config?: CompositionConfig } = {};
  try {
    const body = await req.json();
    if (typeof body?.name === 'string') patch.name = body.name.trim();
    if (body?.config && typeof body.config === 'object') {
      patch.config = { ...DEFAULT_COMPOSITION, ...body.config };
    }
  } catch {
    return new Response('Invalid JSON body', { status: 400 });
  }
  if (patch.name === undefined && patch.config === undefined) {
    return new Response('Nothing to update', { status: 400 });
  }
  if (patch.name !== undefined && !patch.name) {
    return new Response('Name cannot be empty', { status: 400 });
  }

  try {
    return Response.json(await updateComposition(id, patch));
  } catch (e) {
    const msg = (e as Error).message ?? 'Update failed';
    return new Response(msg, { status: /not found/i.test(msg) ? 404 : 500 });
  }
}

/** DELETE /api/compositions/[id] — remove a saved composition. */
export async function DELETE(_req: Request, { params }: Ctx) {
  if (!REMOTE_ENABLED) return new Response(NOT_CONFIGURED, { status: 503 });
  const { id } = await params;
  try {
    await deleteComposition(id);
    return new Response(null, { status: 204 });
  } catch (e) {
    return new Response((e as Error).message ?? 'Delete failed', { status: 500 });
  }
}
