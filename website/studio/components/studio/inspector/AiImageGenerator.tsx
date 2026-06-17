'use client';

import { useRef, useState } from 'react';
import { fileToImageSrc } from '@/lib/composition/upload';
import { REFERENCE_IMAGE_MODEL, imageModelLabel, supportsReference } from '@/lib/ai/models';
import { inputCls } from './controls';

/** mediaType + file extension from a data: URL (e.g. "data:image/webp;base64,…"). */
function dataUrlMeta(src: string): { mediaType: string; ext: string } {
  const mediaType = src.match(/^data:([^;,]+)[;,]/)?.[1] ?? 'image/png';
  return { mediaType, ext: mediaType.split('/')[1] || 'png' };
}

/**
 * AI image generation for a background or mid-graphic. Posts the prompt + chosen
 * model + canvas size (so the frame matches) + an optional reference image to
 * /api/ai/image, which returns a full-res data URL. We re-encode it through
 * fileToImageSrc — the same downscale/WebP path uploads use — before handing it
 * to `onGenerated`, and keep the full-res original for the Download button.
 */
export function AiImageGenerator({
  model,
  sizeId,
  onGenerated,
}: {
  model: string;
  sizeId: string;
  onGenerated: (src: string) => void;
}) {
  const [prompt, setPrompt] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refImage, setRefImage] = useState<string | null>(null);
  const [refBusy, setRefBusy] = useState(false);
  const [result, setResult] = useState<{ src: string; model: string } | null>(null);
  const refInput = useRef<HTMLInputElement>(null);

  // Reference images need an edit-capable model; if the chosen one can't take
  // one, the server routes through REFERENCE_IMAGE_MODEL — flag that here.
  const refFallback = !!refImage && !supportsReference(model);

  const pickRef = async (file: File | undefined) => {
    if (!file) return;
    setRefBusy(true);
    setError(null);
    try {
      setRefImage(await fileToImageSrc(file));
    } catch {
      setError('Could not read that reference image.');
    } finally {
      setRefBusy(false);
    }
  };

  const generate = async () => {
    if (!prompt.trim() || busy) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch('/api/ai/image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, model, sizeId, referenceImage: refImage ?? undefined }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Image generation failed');
      setResult({ src: data.src as string, model: data.model as string });
      // Re-encode the returned data URL through the upload pipeline (downscale + WebP).
      const blob = await (await fetch(data.src as string)).blob();
      const file = new File([blob], 'ai-image', { type: blob.type || 'image/png' });
      onGenerated(await fileToImageSrc(file));
    } catch (e) {
      setError((e as Error).message || 'Image generation failed');
    } finally {
      setBusy(false);
    }
  };

  const download = () => {
    if (!result) return;
    const { ext } = dataUrlMeta(result.src);
    const a = document.createElement('a');
    a.href = result.src;
    a.download = `deconflict-ai-${sizeId}.${ext}`;
    a.click();
  };

  return (
    <div className="space-y-2 rounded-md border border-cobalt/30 bg-cobalt/5 p-2">
      <span className="flex items-center gap-1 text-xs font-semibold text-cobalt">✦ Generate image with AI</span>
      <textarea
        className={`${inputCls} resize-none`}
        rows={2}
        value={prompt}
        placeholder='Describe the image… e.g. "abstract deep-navy data network, soft blue glow"'
        onChange={(e) => setPrompt(e.target.value)}
        onKeyDown={(e) => {
          if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') void generate();
        }}
      />

      {/* Reference image */}
      <div className="flex items-center gap-2">
        {refImage && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={refImage} alt="" aria-hidden className="h-9 w-9 shrink-0 rounded border border-hair object-cover" />
        )}
        <button
          type="button"
          onClick={() => refInput.current?.click()}
          disabled={refBusy}
          className="flex-1 rounded-md border border-dashed border-hair px-2.5 py-1.5 text-xs font-medium text-cobalt transition hover:bg-cobalt/5 disabled:opacity-60"
        >
          {refBusy ? 'Reading…' : refImage ? 'Replace reference' : '+ Reference image (optional)'}
        </button>
        {refImage && (
          <button
            type="button"
            onClick={() => setRefImage(null)}
            aria-label="Remove reference image"
            className="shrink-0 rounded border border-hair px-2 py-1.5 text-xs text-muted hover:text-risk-text"
          >
            ✕
          </button>
        )}
        <input
          ref={refInput}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            void pickRef(e.target.files?.[0]);
            e.target.value = '';
          }}
        />
      </div>
      {refFallback && (
        <p className="text-[11px] text-muted/80">↳ Reference edits run on {imageModelLabel(REFERENCE_IMAGE_MODEL)}.</p>
      )}

      <div className="flex items-center justify-between gap-2">
        <span className="text-[11px] text-muted/80">Matches canvas frame · ⌘↵</span>
        <button
          type="button"
          onClick={() => void generate()}
          disabled={busy || !prompt.trim()}
          className="rounded-md bg-cobalt px-2.5 py-1 text-xs font-semibold text-white transition hover:bg-cobalt/90 disabled:opacity-50"
        >
          {busy ? 'Generating…' : 'Generate'}
        </button>
      </div>

      {error && <p className="text-[11px] text-risk-text">{error}</p>}

      {/* Result preview + download */}
      {result && (
        <div className="flex items-center gap-2 rounded-md border border-hair bg-white p-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={result.src} alt="Generated" className="h-12 w-12 shrink-0 rounded border border-hair object-cover" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-[11px] text-muted">Applied · {imageModelLabel(result.model)}</p>
          </div>
          <button
            type="button"
            onClick={download}
            className="shrink-0 rounded-md border border-hair px-2.5 py-1 text-xs font-medium text-ink hover:bg-frost"
          >
            Download
          </button>
        </div>
      )}
    </div>
  );
}
