import { createClient, type SupabaseClient } from '@supabase/supabase-js';

/**
 * The single server-only Supabase client, shared by every backend feature that
 * needs durable storage: the export→render `handoff` and the saved-composition
 * `library`.
 *
 * The service-role key bypasses Row Level Security and must NEVER reach the
 * client — so this module is imported only from route handlers / server modules,
 * never from a `'use client'` component.
 *
 * Required env: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY. When they are absent
 * (e.g. a local checkout with no `.env.local`) `REMOTE_ENABLED` is false and the
 * features that can fall back (the in-memory handoff) do so; the ones that can't
 * (the library) report that saving is unavailable.
 */
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const REMOTE_ENABLED = !!(SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY);

let client: SupabaseClient | null = null;

/** The shared service-role client. Throws if the env vars aren't set — callers
 *  that have a fallback should check {@link REMOTE_ENABLED} first. */
export function supabase(): SupabaseClient {
  if (!REMOTE_ENABLED) {
    throw new Error('Supabase is not configured (set SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY).');
  }
  if (!client) {
    client = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return client;
}
