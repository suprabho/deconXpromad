import { experimental_generateImage as generateImage, generateText, gateway } from 'ai';
import { imageModelFor, REFERENCE_IMAGE_MODEL } from '@/lib/ai/models';
import { MISSING_AUTH_HINT, frameForCanvas, hasGatewayAuth, resolveImageModel } from '@/lib/ai/server';

export const runtime = 'nodejs';
export const maxDuration = 120; // image gen can be slow on first call

const fail = (error: string, status = 400) => Response.json({ error }, { status });

/**
 * Generate an image through the AI Gateway and return it as a data URL — a
 * drop-in for any catalogue `src` (background imageSrc / mid-graphic src). The
 * client re-encodes it to a downscaled WebP (lib/composition/upload.ts) before
 * storing, so the data URL here can be the model's full-resolution output.
 *
 * Three paths:
 *  - text → image (image-only model): experimental_generateImage.
 *  - text → image (multimodal LLM, e.g. Nano Banana): generateText, image in files.
 *  - reference + text → image (image-to-image / edit): generateText with the
 *    reference attached as an image content-part. Requires a multimodal model;
 *    if the chosen one can't take a reference we fall back to REFERENCE_IMAGE_MODEL
 *    and report the model actually used in the response.
 */
export async function POST(req: Request) {
  let body: { prompt?: string; model?: string; sizeId?: string; referenceImage?: string };
  try {
    body = await req.json();
  } catch {
    return fail('Invalid JSON body');
  }

  const prompt = typeof body.prompt === 'string' ? body.prompt.trim() : '';
  if (!prompt) return fail('Describe the image to generate.');
  if (!hasGatewayAuth()) return fail(MISSING_AUTH_HINT);

  const referenceImage =
    typeof body.referenceImage === 'string' && body.referenceImage.startsWith('data:')
      ? body.referenceImage
      : undefined;

  let meta = resolveImageModel(body.model);
  // A reference image needs an edit-capable (multimodal) model.
  if (referenceImage && meta.mode !== 'multimodal') meta = imageModelFor(REFERENCE_IMAGE_MODEL);

  const frame = frameForCanvas(body.sizeId ?? 'og');
  const orient =
    frame.aspectRatio === '16:9' ? 'wide landscape' : frame.aspectRatio === '3:4' ? 'tall portrait' : 'square';

  try {
    let base64: string;
    let mediaType: string;

    if (meta.mode === 'multimodal') {
      const instruction = referenceImage
        ? `${prompt}\n\nUse the provided reference image as the basis. Keep a single ${orient} (${frame.aspectRatio}) image. Output only the image.`
        : `${prompt}\n\nRender a single ${orient} (${frame.aspectRatio}) image. Output only the image.`;
      const content: Array<{ type: 'text'; text: string } | { type: 'image'; image: string }> = [];
      if (referenceImage) content.push({ type: 'image', image: referenceImage });
      content.push({ type: 'text', text: instruction });

      const result = await generateText({ model: meta.id, messages: [{ role: 'user', content }] });
      const file = result.files.find((f) => f.mediaType?.startsWith('image/'));
      if (!file) return fail('The model returned no image. Try a different prompt or model.', 502);
      base64 = file.base64 ?? Buffer.from(file.uint8Array).toString('base64');
      mediaType = file.mediaType ?? 'image/png';
    } else {
      // Image-only model. gpt-image uses fixed `size`; others use `aspectRatio`.
      const result = await generateImage({
        model: gateway.imageModel(meta.id),
        prompt,
        ...(meta.sizing === 'size' ? { size: frame.size } : { aspectRatio: frame.aspectRatio }),
      });
      const img = result.images[0];
      if (!img) return fail('The model returned no image. Try a different prompt or model.', 502);
      base64 = img.base64;
      mediaType = img.mediaType ?? 'image/png';
    }

    return Response.json({ src: `data:${mediaType};base64,${base64}`, model: meta.id });
  } catch (e) {
    return fail(`Image generation failed: ${(e as Error).message ?? 'unknown error'}`, 502);
  }
}
