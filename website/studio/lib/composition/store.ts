import type { CompositionConfig } from './types';

/**
 * A short-lived, process-memory handoff for the export pipeline — the LOCAL /
 * single-process path only. The export route stashes a config and hands /render
 * a tiny id (URLs have size limits — a DeconflictBanner config with two cases +
 * a timeline, let alone an uploaded image data URL, is too big for the query
 * string). This works because local dev / `next start` runs export and render in
 * the SAME process, so a `globalThis`-backed Map is shared between them (and
 * survives dev HMR reloads). On serverless the two run in separate invocations
 * with no shared memory — see `blob-handoff.ts` for that path.
 */
type Entry = { config: CompositionConfig; expires: number };

const g = globalThis as unknown as { __composeStore?: Map<string, Entry> };
const store: Map<string, Entry> = (g.__composeStore ??= new Map());

function sweep() {
  const now = Date.now();
  for (const [id, e] of store) if (e.expires < now) store.delete(id);
}

export function putConfig(config: CompositionConfig, ttlMs = 60_000): string {
  sweep();
  const id = crypto.randomUUID();
  store.set(id, { config, expires: Date.now() + ttlMs });
  return id;
}

export function getConfig(id: string): CompositionConfig | null {
  const e = store.get(id);
  if (!e) return null;
  if (e.expires < Date.now()) {
    store.delete(id);
    return null;
  }
  return e.config;
}
