import type {
  CompositionConfig,
  ForegroundContent,
  ForegroundElement,
  MidGraphic,
  MidTransform,
  PositionPreset,
  SizeScale,
  Transform,
} from './types';
import { DEFAULT_MID_TRANSFORM, DEFAULT_TRANSFORM, SCALE_FRACTION } from './types';
import { DEFAULT_COMPOSITION } from './defaults';

const KEY = 'deconflict-studio:v1';

/** Centre (x%, y%) approximating a legacy PositionPreset, for one-time migration. */
const PRESET_XY: Record<PositionPreset, { x: number; y: number }> = {
  center: { x: 50, y: 50 },
  top: { x: 50, y: 18 },
  bottom: { x: 50, y: 82 },
  left: { x: 28, y: 50 },
  right: { x: 72, y: 50 },
  'top-left': { x: 28, y: 18 },
  'top-right': { x: 72, y: 18 },
  'bottom-left': { x: 28, y: 82 },
  'bottom-right': { x: 72, y: 82 },
};

/**
 * Backfill a saved transform into the current shape. `scale` used to be the
 * box-width fraction (there was no `width`); it has since split into `width`
 * (layout box) + `scale` (CSS zoom). A transform that predates the split has a
 * `scale` but no `width`, so the old `scale` IS the width and the CSS scale
 * resets to 1.
 */
function migrateTransform(raw: Partial<Transform> | undefined): Transform {
  const t = { ...DEFAULT_TRANSFORM, ...raw };
  if (raw && raw.width === undefined && typeof raw.scale === 'number') {
    t.width = raw.scale;
    t.scale = 1;
  }
  return t;
}

/**
 * Coerce any saved foreground into the current ForegroundElement[] shape:
 *  - an array → backfill missing transform fields + ids;
 *  - a legacy single { content, position, size } → wrap + map preset → transform;
 *  - anything else → a fresh clone of the default.
 */
function migrateForeground(raw: unknown): ForegroundElement[] {
  if (Array.isArray(raw)) {
    return raw
      .filter((el): el is Partial<ForegroundElement> => !!el && typeof el === 'object')
      .map((el, i) => ({
        id: typeof el.id === 'string' ? el.id : `fg-${i}`,
        content: (el.content as ForegroundContent | undefined) ?? { type: 'none' },
        transform: migrateTransform(el.transform as Partial<Transform> | undefined),
        ...(el.glass && typeof el.glass === 'object' ? { glass: el.glass } : {}),
        ...(Array.isArray(el.shadows) ? { shadows: el.shadows } : {}),
      }));
  }
  if (raw && typeof raw === 'object' && 'content' in raw) {
    const legacy = raw as { content?: ForegroundContent; position?: PositionPreset; size?: SizeScale };
    const xy = PRESET_XY[legacy.position ?? 'center'] ?? PRESET_XY.center;
    const width = SCALE_FRACTION[legacy.size ?? 'M'] ?? SCALE_FRACTION.M;
    return [
      {
        id: 'fg-migrated',
        content: legacy.content ?? { type: 'none' },
        transform: { ...DEFAULT_TRANSFORM, x: xy.x, y: xy.y, width },
      },
    ];
  }
  return DEFAULT_COMPOSITION.foreground.map((el) => ({ ...el, transform: { ...el.transform } }));
}

/**
 * Coerce any saved mid graphics into the current MidGraphic[] shape. Mid
 * graphics used to be preset-placed ({ position, size }); a saved graphic that
 * predates the 2-D transform is mapped preset → centre (x, y) and size bucket →
 * width fraction, so it keeps its look. A graphic already carrying a `transform`
 * just backfills any missing fields.
 */
function migrateMidGraphics(raw: unknown): MidGraphic[] {
  if (!Array.isArray(raw)) return DEFAULT_COMPOSITION.midGraphics.map((g) => ({ ...g }));
  return raw
    .filter((g): g is Partial<MidGraphic> & Record<string, unknown> => !!g && typeof g === 'object')
    .map((g, i) => {
      const legacy = g as { position?: PositionPreset; size?: SizeScale; transform?: Partial<MidTransform> };
      const xy = PRESET_XY[legacy.position ?? 'center'] ?? PRESET_XY.center;
      const legacyWidth = SCALE_FRACTION[legacy.size ?? 'M'] ?? SCALE_FRACTION.M;
      const transform: MidTransform = legacy.transform
        ? { ...DEFAULT_MID_TRANSFORM, ...legacy.transform }
        : { ...DEFAULT_MID_TRANSFORM, x: xy.x, y: xy.y, width: legacyWidth };
      return {
        id: typeof g.id === 'string' ? g.id : `mid-${i}`,
        src: typeof g.src === 'string' ? g.src : '',
        transform,
        opacity: typeof g.opacity === 'number' ? g.opacity : 1,
      };
    });
}

/** Merge a partial/loaded config over the defaults so new fields always backfill. */
export function mergeComposition(saved: Partial<CompositionConfig> | null | undefined): CompositionConfig {
  if (!saved || typeof saved !== 'object') return DEFAULT_COMPOSITION;
  return {
    ...DEFAULT_COMPOSITION,
    ...saved,
    version: 1,
    background: { ...DEFAULT_COMPOSITION.background, ...saved.background },
    scrim: { ...DEFAULT_COMPOSITION.scrim, ...saved.scrim },
    midGraphics: migrateMidGraphics(saved.midGraphics),
    foreground: migrateForeground(saved.foreground),
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
