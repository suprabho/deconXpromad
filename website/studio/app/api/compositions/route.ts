import { REMOTE_ENABLED } from '@/lib/composition/supabase-server';
import { createComposition, listCompositions } from '@/lib/composition/library';
import { DEFAULT_COMPOSITION } from '@/lib/composition/defaults';
import type { CompositionConfig } from '@/lib/composition/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const NOT_CONFIGURED = 'Saving is unavailable — the database is not configured.';

/** GET /api/compositions — list saved compositions (metadata only). */
export async function GET() {
  if (!REMOTE_ENABLED) return new Response(NOT_CONFIGURED, { status: 503 });
  try {
    return Response.json(await listCompositions());
  } catch (e) {
    return new Response((e as Error).message ?? 'List failed', { status: 500 });
  }
}

/** POST /api/compositions — save the current composition as a new row. */
export async function POST(req: Request) {
  if (!REMOTE_ENABLED) return new Response(NOT_CONFIGURED, { status: 503 });

  let name: string;
  let config: CompositionConfig;
  try {
    const body = await req.json();
    name = String(body?.name ?? '').trim();
    if (!name) return new Response('A name is required', { status: 400 });
    if (!body?.config || typeof body.config !== 'object') {
      return new Response('A config is required', { status: 400 });
    }
    // Backfill any missing top-level keys, matching the export route's guard.
    config = { ...DEFAULT_COMPOSITION, ...body.config };
  } catch {
    return new Response('Invalid JSON body', { status: 400 });
  }

  try {
    return Response.json(await createComposition(name, config), { status: 201 });
  } catch (e) {
    return new Response((e as Error).message ?? 'Save failed', { status: 500 });
  }
}
