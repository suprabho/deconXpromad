import { supabase } from './supabase-server';
import type { CompositionConfig } from './types';
import type { SavedComposition, SavedCompositionMeta } from './library-client';

/**
 * The saved-composition library, server side: durable CRUD against the Supabase
 * `compositions` table. Unlike the short-lived `export_handoff` rows there is no
 * TTL — these are the user's saved work. There is no auth in this tool, so the
 * library is a single shared workspace; the table has RLS on so it is reachable
 * only through these service-role calls, never the public anon key.
 *
 * Table (run once in the Supabase SQL editor):
 *   create table if not exists compositions (
 *     id uuid primary key default gen_random_uuid(),
 *     name text not null,
 *     size_id text not null default 'og',
 *     config jsonb not null,
 *     created_at timestamptz not null default now(),
 *     updated_at timestamptz not null default now()
 *   );
 *   alter table compositions enable row level security; -- service role only
 *
 * `size_id` is denormalised from `config.sizeId` so the list query can show the
 * output size without shipping every (data-URL-laden) config.
 */
const TABLE = 'compositions';

type Row = {
  id: string;
  name: string;
  size_id: string;
  config?: CompositionConfig;
  updated_at: string;
};

const toMeta = (r: Row): SavedCompositionMeta => ({
  id: r.id,
  name: r.name,
  sizeId: r.size_id,
  updatedAt: r.updated_at,
});

/** All saved compositions, newest-updated first (metadata only). */
export async function listCompositions(): Promise<SavedCompositionMeta[]> {
  const { data, error } = await supabase()
    .from(TABLE)
    .select('id, name, size_id, updated_at')
    .order('updated_at', { ascending: false });
  if (error) throw new Error(error.message);
  return (data as Row[] | null ?? []).map(toMeta);
}

/** One saved composition with its full config, or null if it doesn't exist. */
export async function getComposition(id: string): Promise<SavedComposition | null> {
  const { data, error } = await supabase()
    .from(TABLE)
    .select('id, name, size_id, config, updated_at')
    .eq('id', id)
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) return null;
  const row = data as Row;
  return { ...toMeta(row), config: row.config as CompositionConfig };
}

/** Insert a new named composition. */
export async function createComposition(name: string, config: CompositionConfig): Promise<SavedCompositionMeta> {
  const { data, error } = await supabase()
    .from(TABLE)
    .insert({ name, config, size_id: config.sizeId })
    .select('id, name, size_id, updated_at')
    .single();
  if (error) throw new Error(error.message);
  return toMeta(data as Row);
}

/** Update a row's name and/or config. `updated_at` is bumped here (Postgres
 *  doesn't touch it on UPDATE without a trigger). Throws if the row is gone. */
export async function updateComposition(
  id: string,
  patch: { name?: string; config?: CompositionConfig },
): Promise<SavedCompositionMeta> {
  const update: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (patch.name !== undefined) update.name = patch.name;
  if (patch.config !== undefined) {
    update.config = patch.config;
    update.size_id = patch.config.sizeId;
  }
  const { data, error } = await supabase()
    .from(TABLE)
    .update(update)
    .eq('id', id)
    .select('id, name, size_id, updated_at')
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) throw new Error('Composition not found');
  return toMeta(data as Row);
}

/** Delete a saved composition (no-op if it's already gone). */
export async function deleteComposition(id: string): Promise<void> {
  const { error } = await supabase().from(TABLE).delete().eq('id', id);
  if (error) throw new Error(error.message);
}
