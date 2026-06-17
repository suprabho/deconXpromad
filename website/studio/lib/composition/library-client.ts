import type { CompositionConfig } from './types';

/**
 * The saved-composition library, client side: typed `fetch` wrappers around the
 * `/api/compositions` routes plus the shape they exchange. Kept free of any
 * server-only import (no Supabase) so it is safe to pull into the editor.
 *
 * The list endpoint returns metadata only (configs carry data-URL images and can
 * be megabytes); the full config is fetched on demand when a composition is
 * opened. See `lib/composition/library.ts` for the server side.
 */
export type SavedCompositionMeta = {
  id: string;
  name: string;
  /** Output size preset id (`config.sizeId`), surfaced so the list can show it
   *  without shipping every full config. */
  sizeId: string;
  updatedAt: string;
};

export type SavedComposition = SavedCompositionMeta & { config: CompositionConfig };

async function readJson<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const msg = (await res.text().catch(() => '')).trim();
    throw new Error(msg || `Request failed (${res.status})`);
  }
  return res.json() as Promise<T>;
}

/** All saved compositions, newest first (metadata only). */
export async function fetchCompositions(): Promise<SavedCompositionMeta[]> {
  return readJson(await fetch('/api/compositions', { cache: 'no-store' }));
}

/** One saved composition with its full config. */
export async function fetchComposition(id: string): Promise<SavedComposition> {
  return readJson(await fetch(`/api/compositions/${id}`, { cache: 'no-store' }));
}

/** Save the current composition as a new named row. */
export async function createComposition(name: string, config: CompositionConfig): Promise<SavedCompositionMeta> {
  return readJson(
    await fetch('/api/compositions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, config }),
    }),
  );
}

/** Update an existing row's name and/or config. */
export async function updateComposition(
  id: string,
  patch: { name?: string; config?: CompositionConfig },
): Promise<SavedCompositionMeta> {
  return readJson(
    await fetch(`/api/compositions/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patch),
    }),
  );
}

/** Delete a saved composition. */
export async function deleteComposition(id: string): Promise<void> {
  const res = await fetch(`/api/compositions/${id}`, { method: 'DELETE' });
  if (!res.ok) {
    const msg = (await res.text().catch(() => '')).trim();
    throw new Error(msg || `Delete failed (${res.status})`);
  }
}
