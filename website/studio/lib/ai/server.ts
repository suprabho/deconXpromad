/**
 * Server-only AI helpers — model resolution, canvas→frame mapping, the brand
 * system prompt and an auth presence check. Imported only by the /api/ai routes
 * (never the client), so it may read env. No secrets are exported.
 *
 * (No `server-only` guard import — pnpm doesn't hoist that package here — but
 * nothing outside the /api/ai route handlers imports this module.)
 */
import { sizeFor } from '@/lib/composition/types';
import { AI_CONTENT_MODELS, DEFAULT_CONTENT_MODEL, DEFAULT_IMAGE_MODEL, imageModelFor, type ImageModel } from './models';

/** Resolve the content model: requested (if allow-listed) → env → registry default. */
export function resolveContentModel(requested?: string): string {
  if (requested && AI_CONTENT_MODELS.some((m) => m.id === requested)) return requested;
  const envModel = process.env.AI_CONTENT_MODEL?.trim();
  if (envModel) return envModel;
  return DEFAULT_CONTENT_MODEL;
}

/** Resolve the image model meta: requested (if allow-listed) → env → registry default. */
export function resolveImageModel(requested?: string): ImageModel {
  if (requested && AI_IMAGE_ALLOWED(requested)) return imageModelFor(requested);
  const envModel = process.env.AI_IMAGE_MODEL?.trim();
  if (envModel && AI_IMAGE_ALLOWED(envModel)) return imageModelFor(envModel);
  return imageModelFor(DEFAULT_IMAGE_MODEL);
}

function AI_IMAGE_ALLOWED(id: string): boolean {
  return imageModelFor(id).id === id; // imageModelFor falls back to [0]; equal id ⇒ it was found
}

/** Aspect ratio + fixed size that best match a canvas size preset's orientation.
 *  `size` (for size-only models like gpt-image) snaps to the nearest of the three
 *  supported buckets; `aspectRatio` carries the finer 4:3 / 3:4 distinction. */
export function frameForCanvas(
  sizeId: string,
): { aspectRatio: '16:9' | '4:3' | '1:1' | '3:4'; size: '1536x1024' | '1024x1024' | '1024x1536' } {
  const { width, height } = sizeFor(sizeId);
  const ratio = width / height;
  if (ratio >= 1.5) return { aspectRatio: '16:9', size: '1536x1024' }; // wide landscape
  if (ratio >= 1.15) return { aspectRatio: '4:3', size: '1536x1024' }; // landscape
  if (ratio <= 0.85) return { aspectRatio: '3:4', size: '1024x1536' }; // portrait
  return { aspectRatio: '1:1', size: '1024x1024' }; // square-ish
}

/** True when the gateway has *some* credential available (key, or Vercel OIDC). */
export function hasGatewayAuth(): boolean {
  return !!(process.env.AI_GATEWAY_API_KEY?.trim() || process.env.VERCEL_OIDC_TOKEN?.trim());
}

export const MISSING_AUTH_HINT =
  'No AI Gateway credential found. Add AI_GATEWAY_API_KEY to website/studio/.env.local (get one at vercel.com → AI Gateway → API keys), then restart the dev server.';

/**
 * System prompt for foreground content generation. Deconflict is a case-overlap
 * ("deconfliction") platform between law-enforcement and financial-institution
 * investigations — crypto wallets, AML alerts, redacted cross-agency sharing.
 */
export const CONTENT_SYSTEM = [
  'You generate placeholder content for marketing visuals of "Deconflict" — a platform that securely surfaces',
  'overlaps between law-enforcement and financial-institution investigations (case deconfliction): shared crypto',
  'wallets, AML alerts, redacted cross-agency case sharing.',
  'Produce realistic but clearly FICTIONAL sample data — never real people, real wallet addresses, or real case',
  'numbers. Keep copy concise, professional and confident, in the product\'s investigative tone.',
  'Fill EVERY field of the provided schema with coherent, mutually-consistent values (names, dates, ids and',
  'figures should line up across fields). Respect the user\'s brief.',
].join(' ');

/**
 * System prompt for the multi-element scene planner. Given one brief it lays out
 * a small stack of complementary foreground components for a marketing visual —
 * choosing each component's type, a focused per-element brief, and a 3-D
 * placement so the pieces read as one composition rather than a pile.
 */
export const SCENE_SYSTEM = [
  'You compose a marketing "hero" visual for "Deconflict" by arranging a small stack of UI components.',
  'Pick 2–4 COMPLEMENTARY components from the allowed palette that together tell one coherent story about the',
  'brief — e.g. a primary card or modal as the focal point, supported by a stat, chart, chat or alert.',
  'Avoid duplicating the same component type unless the brief truly calls for it.',
  'Lay them out so they read as one composition, not a pile: give the focal element the largest width near the',
  'centre, then place the supporting elements around it (offset x/y, smaller width) with gentle overlap and a few',
  'degrees of rotation for depth. x/y are the element CENTRE as a % of the canvas (50/50 = centre); width is a',
  'fraction of canvas width; scale ~1; keep rotateZ small (±15°). Order the array back-to-front (last sits on top).',
  'Write each element\'s brief as a single focused sentence the content generator will expand.',
].join(' ');
