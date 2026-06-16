import type { CompositionConfig } from './types';
import { DEFAULT_COMPOSITION } from './defaults';

const KEY = 'deconflict-studio:v1';

/** Merge a partial/loaded config over the defaults so new fields always backfill. */
export function mergeComposition(saved: Partial<CompositionConfig> | null | undefined): CompositionConfig {
  if (!saved || typeof saved !== 'object') return DEFAULT_COMPOSITION;
  return {
    ...DEFAULT_COMPOSITION,
    ...saved,
    version: 1,
    background: { ...DEFAULT_COMPOSITION.background, ...saved.background },
    scrim: { ...DEFAULT_COMPOSITION.scrim, ...saved.scrim },
    midGraphics: saved.midGraphics ?? DEFAULT_COMPOSITION.midGraphics,
    foreground: { ...DEFAULT_COMPOSITION.foreground, ...saved.foreground },
    overlay: { ...DEFAULT_COMPOSITION.overlay, ...saved.overlay },
  };
}

export function loadComposition(): CompositionConfig {
  if (typeof window === 'undefined') return DEFAULT_COMPOSITION;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return DEFAULT_COMPOSITION;
    return mergeComposition(JSON.parse(raw));
  } catch {
    return DEFAULT_COMPOSITION;
  }
}

export function saveComposition(config: CompositionConfig): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(config));
  } catch {
    /* quota / private mode — ignore */
  }
}

/** Download the composition as a .json file. */
export function exportJson(config: CompositionConfig): void {
  const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'deconflict-composition.json';
  a.click();
  URL.revokeObjectURL(url);
}

/** Parse + validate an imported JSON file into a composition. */
export async function importJson(file: File): Promise<CompositionConfig> {
  const text = await file.text();
  const parsed = JSON.parse(text);
  if (!parsed || typeof parsed !== 'object') throw new Error('Not a composition file');
  return mergeComposition(parsed as Partial<CompositionConfig>);
}
