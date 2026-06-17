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

/** Aspect ratio + fixed size that best match a canvas size preset's orientation. */
export function frameForCanvas(sizeId: string): { aspectRatio: '16:9' | '1:1' | '3:4'; size: '1536x1024' | '1024x1024' | '1024x1536' } {
  const { width, height } = sizeFor(sizeId);
  const ratio = width / height;
  if (ratio >= 1.2) return { aspectRatio: '16:9', size: '1536x1024' }; // landscape
  if (ratio <= 0.83) return { aspectRatio: '3:4', size: '1024x1536' }; // portrait
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
