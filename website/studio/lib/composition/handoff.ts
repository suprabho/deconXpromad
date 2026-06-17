import type { CompositionConfig } from './types';
import { REMOTE_ENABLED, supabase } from './supabase-server';
import { putConfig as putMemory, getConfig as getMemory } from './store';

/**
 * Config handoff between the export route and the chrome-less /render route.
 *
 * The two run in the SAME process locally (so the in-memory `store.ts` Map is
 * enough) but in SEPARATE invocations on Vercel serverless (so a durable store
 * both can reach is required). When Supabase env vars are present we stash the
 * config in a short-lived `export_handoff` row keyed by an opaque id and hand
 * /render that id; otherwise we fall back to the in-memory Map. Either way the
 * handoff is addressed by a single `?id=` — render never touches a raw URL, so
 * there is no public blob and no SSRF surface.
 *
 * Uses the shared service-role client in `supabase-server.ts` (env + RLS notes
 * there).
 *
 * Table (run once in the Supabase SQL editor):
 *   create table if not exists export_handoff (
 *     id uuid primary key,
 *     config jsonb not null,
 *     created_at timestamptz not null default now()
 *   );
 *   alter table export_handoff enable row level security; -- service role only
 */
const TABLE = 'export_handoff';
const TTL_MS = 5 * 60_000; // orphaned rows (export errored before delete) age out.

/** Stash a config, return the id /render should be pointed at. */
export async function putHandoff(config: CompositionConfig): Promise<string> {
  if (!REMOTE_ENABLED) return putMemory(config);
  const id = crypto.randomUUID();
  const supa = supabase();
  // Best-effort sweep of stale rows so a failed export never leaks storage.
  await supa
    .from(TABLE)
    .delete()
    .lt('created_at', new Date(Date.now() - TTL_MS).toISOString())
    .then(undefined, () => {});
  const { error } = await supa.from(TABLE).insert({ id, config });
  if (error) throw new Error(`handoff store failed: ${error.message}`);
  return id;
}

/** Resolve a handoff id back to its config, or null if missing/expired. */
export async function getHandoff(id: string): Promise<CompositionConfig | null> {
  if (!REMOTE_ENABLED) return getMemory(id);
  const { data, error } = await supabase()
    .from(TABLE)
    .select('config, created_at')
    .eq('id', id)
    .maybeSingle();
  if (error || !data) return null;
  if (new Date(data.created_at as string).getTime() < Date.now() - TTL_MS) return null;
  return data.config as CompositionConfig;
}

/** Drop a handoff row once the screenshot is taken (no-op for the in-memory path). */
export async function delHandoff(id: string): Promise<void> {
  if (!REMOTE_ENABLED) return; // in-memory entries expire via store.ts TTL sweep.
  await supabase()
    .from(TABLE)
    .delete()
    .eq('id', id)
    .then(undefined, () => {});
}
