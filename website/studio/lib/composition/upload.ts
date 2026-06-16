/**
 * Turn an uploaded image File into a `src` usable everywhere a catalogue src is.
 *
 * The whole pipeline already accepts `data:` URLs: assetUrl() passes them
 * through, the export route carries the entire config object to /render via the
 * in-process store (so the screenshot sees them), and persistence saves them in
 * the composition JSON. So an upload is just "produce a data URL, store it in
 * the existing imageSrc / MidGraphic.src field" — no schema or render changes.
 *
 * SVGs are embedded verbatim (vector, never rasterised). Large rasters are
 * downscaled to MAX_EDGE and re-encoded to WebP so the data URL stays small
 * enough for the localStorage autosave and a fast export.
 */

/** Largest edge we keep an uploaded raster at — matches the 2× export ceiling
 *  (a 1200×630 OG card renders at 2400×1260). */
const MAX_EDGE = 2400;

/** Re-encode rasters larger than this (bytes) even when they don't need resizing. */
const REENCODE_BYTES = 700_000;

function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const fr = new FileReader();
    fr.onload = () => resolve(fr.result as string);
    fr.onerror = () => reject(fr.error ?? new Error('Could not read file'));
    fr.readAsDataURL(file);
  });
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Could not decode image'));
    img.src = src;
  });
}

export async function fileToImageSrc(file: File): Promise<string> {
  const raw = await readAsDataUrl(file);

  // SVG: keep the vector source untouched.
  if (file.type === 'image/svg+xml' || raw.startsWith('data:image/svg')) return raw;

  const img = await loadImage(raw).catch(() => null);
  if (!img) return raw; // undecodable raster (e.g. animated gif) — store as-is

  const longest = Math.max(img.naturalWidth, img.naturalHeight);
  const oversized = longest > MAX_EDGE;
  if (!oversized && file.size < REENCODE_BYTES) return raw; // already small enough

  const scale = oversized ? MAX_EDGE / longest : 1;
  const w = Math.max(1, Math.round(img.naturalWidth * scale));
  const h = Math.max(1, Math.round(img.naturalHeight * scale));

  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  if (!ctx) return raw;
  ctx.drawImage(img, 0, 0, w, h);

  // WebP keeps alpha and compresses photos far better than PNG. If the browser
  // didn't honour the format (or it failed to shrink the payload) keep the raw
  // data URL — preview + export still work, only the autosave may be skipped.
  const out = canvas.toDataURL('image/webp', 0.9);
  if (!out.startsWith('data:image/webp') || out.length >= raw.length) return raw;
  return out;
}
