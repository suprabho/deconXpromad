import { REMOTE_ENABLED, supabase } from './supabase-server';
import { promises as fs } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

/**
 * Cache of aura stills, keyed by `${slug}__${sizeId}`.
 *
 * The aura is a WebGL scene only the user's browser can rasterize (see
 * aura-capture.ts). Snapshotting it on every export would be slow and flaky, so
 * the first export of a given aura+size uploads the still here and every later
 * export — for any user — reuses it. The headless /render surface <img>-loads it.
 *
 * Two backends, chosen by where we run:
 *   - On Vercel, export and /render are SEPARATE serverless invocations with no
 *     shared, writable disk, so stills go through a PUBLIC Supabase Storage
 *     bucket named `aura-cache` (create once: Storage → New bucket → Public).
 *   - Locally, everything runs in ONE process against a real disk, so we cache
 *     to a temp dir and serve it from `/api/aura-cache/img` — NO bucket needed.
 *
 * Either backend falling through to "no cache" is fine: the export then renders
 * the background colour instead of the aura (never hangs).
 */
const BUCKET = 'aura-cache';

// Supabase is only the right backend on Vercel (ephemeral, multi-invocation FS).
// Anywhere else — local `next dev`, a long-running host — use the local disk so
// no storage bucket is required to export auras.
const USE_SUPABASE = !!process.env.VERCEL_ENV && REMOTE_ENABLED;
const LOCAL_DIR = join(tmpdir(), 'deconflict-aura-cache');

/** A safe object name for an arbitrary slug/URL key. */
function objectPath(key: string): string {
  const safe = key
    .replace(/[^a-zA-Z0-9_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 200);
  return `${safe}.png`;
}

/** Relative URL the /render surface (same origin) loads a local still from. */
function localUrl(key: string): string {
  return `/api/aura-cache/img?key=${encodeURIComponent(key)}`;
}

/** Public/served URL of a cached aura still, or null if it isn't cached yet. */
export async function getCachedAuraUrl(key: string): Promise<string | null> {
  const path = objectPath(key);
  if (USE_SUPABASE) {
    const supa = supabase();
    const { data, error } = await supa.storage.from(BUCKET).list('', { search: path, limit: 1 });
    if (error || !data?.some((o) => o.name === path)) return null;
    return supa.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
  }
  try {
    await fs.access(join(LOCAL_DIR, path));
    return localUrl(key);
  } catch {
    return null;
  }
}

/** Store an aura still and return its served URL. */
export async function putCachedAura(key: string, png: Uint8Array): Promise<string> {
  const path = objectPath(key);
  if (USE_SUPABASE) {
    const supa = supabase();
    const { error } = await supa.storage.from(BUCKET).upload(path, png, {
      contentType: 'image/png',
      upsert: true,
      cacheControl: '31536000',
    });
    if (error) throw new Error(`Aura cache write failed: ${error.message}`);
    return supa.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
  }
  await fs.mkdir(LOCAL_DIR, { recursive: true });
  await fs.writeFile(join(LOCAL_DIR, path), png);
  return localUrl(key);
}

/** Read a locally-cached still as raw PNG bytes (serves /api/aura-cache/img). */
export async function readLocalAura(key: string): Promise<Uint8Array | null> {
  try {
    return await fs.readFile(join(LOCAL_DIR, objectPath(key)));
  } catch {
    return null;
  }
}
