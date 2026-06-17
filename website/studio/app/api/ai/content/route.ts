import { generateObject } from 'ai';
import type { ForegroundType } from '@/lib/composition/types';
import { schemaFor } from '@/lib/ai/schemas';
import { assembleForegroundContent } from '@/lib/ai/assemble';
import { CONTENT_SYSTEM, MISSING_AUTH_HINT, hasGatewayAuth, resolveContentModel } from '@/lib/ai/server';

export const runtime = 'nodejs';
export const maxDuration = 60;

const fail = (error: string, status = 400) => Response.json({ error }, { status });

/**
 * Generate the structured content for one foreground element, constrained to
 * that element type's fixed schema (lib/ai/schemas.ts). Returns a ready-to-use
 * ForegroundContent the inspector drops straight into the element.
 */
export async function POST(req: Request) {
  let body: { type?: ForegroundType; prompt?: string; model?: string; current?: unknown };
  try {
    body = await req.json();
  } catch {
    return fail('Invalid JSON body');
  }

  const type = body.type;
  const prompt = typeof body.prompt === 'string' ? body.prompt.trim() : '';
  const schema = type ? schemaFor(type) : null;

  if (!type || !schema) return fail(`No content schema for component "${type ?? 'none'}".`);
  if (!prompt) return fail('Describe what to generate.');
  if (!hasGatewayAuth()) return fail(MISSING_AUTH_HINT);

  const model = resolveContentModel(body.model);
  try {
    const { object } = await generateObject({
      model,
      schema,
      system: CONTENT_SYSTEM,
      prompt: `Component type: ${type}.\nBrief: ${prompt}`,
    });
    const content = assembleForegroundContent(type, object, body.current as never);
    return Response.json({ content, model });
  } catch (e) {
    return fail(`Generation failed: ${(e as Error).message ?? 'unknown error'}`, 502);
  }
}
