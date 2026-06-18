import { AURA_ORIGIN, auraEmbedUrl } from './types';

/**
 * Client-side aura snapshot.
 *
 * An aura background is a cross-origin WebGL scene served by aura.promad.design.
 * Nothing on our side can rasterize it: the serverless export browser has no GPU
 * (swiftshader hangs), and this page can't read the iframe's canvas (cross-origin
 * taint). The one place the scene renders on a real GPU is the aura embed itself,
 * running in the user's browser — and it CAN read its own canvas. So we ask it to
 * snapshot itself and post the PNG back, then cache that still for the export to
 * composite.
 *
 * ── Embed-side contract ─────────────────────────────────────────────────────────
 * The responder lives in the aura embed repo (beautiful-headers), in
 * SceneEmbedPage.jsx — it listens for `promad-aura:capture`, composites the live
 * layers with its own capture pipeline (already preserveDrawingBuffer-correct,
 * honouring pixelRatio), and posts back:
 *
 *   { type: 'promad-aura:capture-result', requestId, dataUrl }   // or { error }
 *
 * That fix must be DEPLOYED to aura.promad.design for production export to work;
 * to test locally, run the embed dev server and set NEXT_PUBLIC_AURA_ORIGIN
 * (e.g. http://localhost:5173) so this client talks to it instead of prod.
 * ───────────────────────────────────────────────────────────────────────────────
 */

const CAPTURE_REQ = 'promad-aura:capture';
const CAPTURE_RES = 'promad-aura:capture-result';

export type AuraCaptureOpts = {
  /** CSS size to render the scene at — match the composition so the frozen frame
   *  shares the editor's aspect/geometry. */
  width: number;
  height: number;
  /** Retina multiplier the embed should capture at (default 2). */
  pixelRatio?: number;
  /** Warm-up before snapshotting, so the drifting scene settles (default 2600ms). */
  settleMs?: number;
  /** Give up if the embed never answers (default 20s). */
  timeoutMs?: number;
};

/**
 * Render the aura embed off-screen, ask it to snapshot its own canvas, and return
 * the resulting PNG data URL. Throws if the embed doesn't answer (e.g. it hasn't
 * shipped the capture responder yet) within `timeoutMs`.
 */
export async function captureAura(slug: string, opts: AuraCaptureOpts): Promise<string> {
  const { width, height, pixelRatio = 2, settleMs = 2600, timeoutMs = 20_000 } = opts;

  const iframe = document.createElement('iframe');
  iframe.src = auraEmbedUrl(slug);
  // allow-same-origin keeps the embed on its real origin so its own resources
  // don't taint its canvas and postMessage round-trips normally.
  iframe.setAttribute('sandbox', 'allow-scripts allow-same-origin');
  // Render off-screen at the exact capture resolution. Not display:none /
  // visibility:hidden — a non-rendered iframe may never paint its WebGL frame.
  Object.assign(iframe.style, {
    position: 'fixed',
    left: '0',
    top: '0',
    width: `${width}px`,
    height: `${height}px`,
    border: '0',
    opacity: '0.01',
    pointerEvents: 'none',
    zIndex: '-1',
  });
  document.body.appendChild(iframe);

  const requestId = `${slug}-${Date.now()}-${Math.random().toString(36).slice(2)}`;

  try {
    await new Promise<void>((resolve) => {
      iframe.addEventListener('load', () => resolve(), { once: true });
    });
    await new Promise((r) => setTimeout(r, settleMs));

    return await new Promise<string>((resolve, reject) => {
      const timer = setTimeout(() => {
        cleanup();
        reject(new Error('Aura snapshot timed out — does the embed answer promad-aura:capture?'));
      }, timeoutMs);

      function onMessage(e: MessageEvent) {
        if (e.origin !== AURA_ORIGIN) return;
        const d = e.data;
        if (!d || d.type !== CAPTURE_RES || d.requestId !== requestId) return;
        cleanup();
        if (typeof d.dataUrl === 'string' && d.dataUrl.startsWith('data:image/')) resolve(d.dataUrl);
        else reject(new Error('Aura snapshot returned no image'));
      }
      function cleanup() {
        clearTimeout(timer);
        window.removeEventListener('message', onMessage);
      }

      window.addEventListener('message', onMessage);
      iframe.contentWindow?.postMessage(
        { type: CAPTURE_REQ, requestId, width, height, pixelRatio },
        AURA_ORIGIN,
      );
    });
  } finally {
    iframe.remove();
  }
}
