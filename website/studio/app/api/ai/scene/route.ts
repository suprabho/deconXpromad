import { generateObject } from 'ai';
import { z } from 'zod';
import { DEFAULT_TRANSFORM, type ForegroundElement } from '@/lib/composition/types';
import { GENERATABLE_TYPES, schemaFor } from '@/lib/ai/schemas';
import { assembleForegroundContent } from '@/lib/ai/assemble';
import { CONTENT_SYSTEM, MISSING_AUTH_HINT, SCENE_SYSTEM, hasGatewayAuth, resolveContentModel } from '@/lib/ai/server';

export const runtime = 'nodejs';
export const maxDuration = 120;

const fail = (error: string, status = 400) => Response.json({ error }, { status });

/** The planner picks types + placements; the per-element content is filled after. */
const planSchema = z.object({
  elements: z
    .array(
      z.object({
        type: z.enum(GENERATABLE_TYPES as unknown as [string, ...string[]]).describe('Component type to place'),
        brief: z.string().describe('A single focused sentence describing THIS element'),
        x: z.number().min(2).max(98).describe('Element centre X as a % of canvas width (50 = centre)'),
        y: z.number().min(2).max(98).describe('Element centre Y as a % of canvas height (50 = centre)'),
        width: z.number().min(0.12).max(0.92).describe('Box width as a fraction of canvas width'),
        scale: z.number().min(0.4).max(1.8).describe('Uniform zoom multiplier (1 = none)'),
        rotateZ: z.number().min(-15).max(15).describe('In-plane spin in degrees (keep subtle)'),
      }),
    )
    .min(1)
    .max(6)
    .describe('2–4 complementary components, ordered back-to-front (last sits on top)'),
});

/**
 * Generate a whole stack of foreground elements from one brief. The model first
 * plans the scene (which components, each with a focused brief + 3-D placement),
 * then each element's content is generated in parallel against that type's fixed
 * schema (lib/ai/schemas.ts) — the same contract the single-element route uses.
 * Returns ready-to-use ForegroundElements the inspector appends to the stack.
 */
export async function POST(req: Request) {
  let body: { prompt?: string; model?: string };
  try {
    body = await req.json();
  } catch {
    return fail('Invalid JSON body');
  }

  const prompt = typeof body.prompt === 'string' ? body.prompt.trim() : '';
  if (!prompt) return fail('Describe the scene to generate.');
  if (!hasGatewayAuth()) return fail(MISSING_AUTH_HINT);

  const model = resolveContentModel(body.model);
  try {
    const { object: plan } = await generateObject({
      model,
      schema: planSchema,
      system: SCENE_SYSTEM,
      prompt: `Scene brief: ${prompt}`,
    });

    const elements = await Promise.all(
      plan.elements.map(async (el): Promise<ForegroundElement | null> => {
        const schema = schemaFor(el.type as ForegroundElement['content']['type']);
        if (!schema) return null;
        const { object } = await generateObject({
          model,
          schema,
          system: CONTENT_SYSTEM,
          prompt: `Component type: ${el.type}.\nOverall scene: ${prompt}\nThis element: ${el.brief}`,
        });
        const content = assembleForegroundContent(el.type as ForegroundElement['content']['type'], object);
        return {
          id: crypto.randomUUID(),
          content,
          transform: { ...DEFAULT_TRANSFORM, x: el.x, y: el.y, width: el.width, scale: el.scale, rotateZ: el.rotateZ },
        };
      }),
    );

    const usable = elements.filter((e): e is ForegroundElement => e !== null);
    if (!usable.length) return fail('The model returned no usable elements. Try a more specific brief.', 502);
    return Response.json({ elements: usable, model });
  } catch (e) {
    return fail(`Generation failed: ${(e as Error).message ?? 'unknown error'}`, 502);
  }
}
