import { REMOTE_ENABLED, supabase } from './supabase-server';

/**
 * Cache of aura stills, keyed by `${slug}__${sizeId}`.
 *
 * The aura is a WebGL scene only the user's browser can rasterize (see
 * aura-capture.ts). Snapshotting it on every export would be slow and flaky, so
 * the first export of a given aura+size uploads the still here and every later
 * export — for any user — reuses it. Stored in Supabase Storage so the still is
 * served by a plain public URL the headless /render surface can <img>-load.
 *
 * Setup (run once): create a PUBLIC bucket named `aura-cache` in the Supabase
 * dashboard (Storage → New bucket → Public). Falls back to "no cache" when
 * Supabase isn't configured ({@link REMOTE_ENABLED} is false) — the export then
 * renders the background colour instead of the aura.
 */
const BUCKET = 'aura-cache';

/** A safe object name for an arbitrary slug/URL key. */
function objectPath(key: string): string {
  const safe = key
    .replace(/[^a-zA-Z0-9_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 200);
  return `${safe}.png`;
}

/** Public URL of a cached aura still, or null if it isn't cached yet. */
export async function getCachedAuraUrl(key: string): Promise<string | null> {
  if (!REMOTE_ENABLED) return null;
  const path = objectPath(key);
  const supa = supabase();
  const { data, error } = await supa.storage.from(BUCKET).list('', { search: path, limit: 1 });
  if (error || !data?.some((o) => o.name === path)) return null;
  return supa.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
}

/** Store an aura still and return its public URL. */
export async function putCachedAura(key: string, png: Uint8Array): Promise<string> {
  if (!REMOTE_ENABLED) throw new Error('Aura cache unavailable (Supabase not configured).');
  const path = objectPath(key);
  const supa = supabase();
  const { error } = await supa.storage.from(BUCKET).upload(path, png, {
    contentType: 'image/png',
    upsert: true,
    cacheControl: '31536000',
  });
  if (error) throw new Error(`Aura cache write failed: ${error.message}`);
  return supa.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
}
