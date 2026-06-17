import { put, del } from '@vercel/blob';
import type { CompositionConfig } from './types';

/**
 * Durable, cross-invocation handoff for the export pipeline on serverless.
 *
 * On Vercel, `/api/export` and `/render` run in SEPARATE function invocations
 * that do not share process memory, so the in-process Map in `store.ts` cannot
 * carry the config between them. Instead the export route stashes the full
 * config (which may be multi-MB — uploaded image data URLs ride along) in a
 * short-lived blob and hands /render the blob URL. /render fetches it, renders,
 * and the export route deletes the blob once the screenshot is taken.
 *
 * Enabled whenever a Blob token is configured; otherwise the pipeline falls
 * back to the in-process store (fine for a single local dev/`next start`).
 */
export const BLOB_ENABLED = !!process.env.BLOB_READ_WRITE_TOKEN;

/** Vercel Blob's public host. We only ever fetch handoff URLs from here so a
 *  crafted `?u=` on /render can't turn the server into an SSRF proxy. */
const BLOB_HOST_SUFFIX = '.blob.vercel-storage.com';

export async function putConfigBlob(config: CompositionConfig): Promise<string> {
  const { url } = await put(`compose-handoff/${crypto.randomUUID()}.json`, JSON.stringify(config), {
    access: 'public',
    contentType: 'application/json',
    addRandomSuffix: true,
  });
  return url;
}

export async function delConfigBlob(url: string): Promise<void> {
  try {
    await del(url);
  } catch {
    // Best-effort: a leaked handoff blob is small and unguessable; never fail
    // the export over cleanup.
  }
}

/** Fetch a handoff config by blob URL, rejecting anything not on the Blob host. */
export async function fetchConfigBlob(rawUrl: string): Promise<CompositionConfig | null> {
  let url: URL;
  try {
    url = new URL(rawUrl);
  } catch {
    return null;
  }
  if (url.protocol !== 'https:' || !url.hostname.endsWith(BLOB_HOST_SUFFIX)) return null;
  try {
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) return null;
    return (await res.json()) as CompositionConfig;
  } catch {
    return null;
  }
}
