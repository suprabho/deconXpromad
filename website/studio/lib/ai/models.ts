/**
 * AI model registry — the curated lists that populate the inspector's model
 * dropdowns AND the server allow-list. Plain data only (model id strings); no
 * secrets, so this module is imported on both the client (the picker) and the
 * server (the /api/ai routes, which validate the requested id against these).
 *
 * Every id is a Vercel AI Gateway slug ("provider/model"). Requests route
 * through the gateway automatically when the AI SDK is given a plain string
 * model id; auth is the AI_GATEWAY_API_KEY env var (or Vercel OIDC in prod).
 */

export type ContentModel = { id: string; label: string };

/** Models offered for foreground-element content generation (generateObject). */
export const AI_CONTENT_MODELS: ContentModel[] = [
  { id: 'anthropic/claude-sonnet-4.6', label: 'Claude Sonnet 4.6' },
  { id: 'openai/gpt-5.1', label: 'GPT-5.1' },
];

/**
 * How an image model is driven:
 *  - 'image'      → experimental_generateImage, result.images[].base64
 *  - 'multimodal' → generateText, result.files[] (uint8Array) — e.g. Nano Banana
 * and how it accepts a frame shape:
 *  - 'aspectRatio' → pass aspectRatio: '16:9' | '4:3' | '1:1' | '3:4'
 *  - 'size'        → pass size: '1536x1024' | '1024x1024' | '1024x1536'
 */
export type ImageModel = {
  id: string;
  label: string;
  mode: 'image' | 'multimodal';
  sizing: 'aspectRatio' | 'size';
};

/** Models offered for background / mid-graphic image generation. */
export const AI_IMAGE_MODELS: ImageModel[] = [
  { id: 'google/imagen-4.0-generate-001', label: 'Google Imagen 4', mode: 'image', sizing: 'aspectRatio' },
  { id: 'bfl/flux-2-pro', label: 'FLUX.2 Pro', mode: 'image', sizing: 'aspectRatio' },
  { id: 'openai/gpt-image-1', label: 'OpenAI GPT Image 1', mode: 'image', sizing: 'size' },
  { id: 'google/gemini-3-pro-image', label: 'Nano Banana Pro', mode: 'multimodal', sizing: 'aspectRatio' },
  { id: 'bytedance/seedream-4.5', label: 'Seedream 4.5 · cheap', mode: 'image', sizing: 'aspectRatio' },
];

export const DEFAULT_CONTENT_MODEL = AI_CONTENT_MODELS[0].id;
export const DEFAULT_IMAGE_MODEL = AI_IMAGE_MODELS[0].id;

/**
 * Reference-image ("edit"/image-to-image) generation needs a multimodal model
 * that accepts an input image. We route reference-guided requests through this
 * one when the chosen model can't take a reference itself.
 */
export const REFERENCE_IMAGE_MODEL = 'google/gemini-3-pro-image';

export function isContentModel(id: string | undefined): id is string {
  return !!id && AI_CONTENT_MODELS.some((m) => m.id === id);
}

export function imageModelFor(id: string | undefined): ImageModel {
  return AI_IMAGE_MODELS.find((m) => m.id === id) ?? AI_IMAGE_MODELS[0];
}

/** Display label for an image-model id (falls back to the raw id). */
export function imageModelLabel(id: string | undefined): string {
  return AI_IMAGE_MODELS.find((m) => m.id === id)?.label ?? id ?? '';
}

/** True when the model can take a reference image (multimodal edit-capable). */
export function supportsReference(id: string | undefined): boolean {
  return imageModelFor(id).mode === 'multimodal';
}
