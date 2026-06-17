'use client';

import { useState } from 'react';
import { fileToImageSrc } from '@/lib/composition/upload';
import { inputCls } from './controls';

/**
 * AI image generation for a background or mid-graphic. Posts the prompt + the
 * chosen model + the canvas size (so the frame matches) to /api/ai/image, which
 * returns a full-res data URL. We re-encode it through fileToImageSrc — the same
 * downscale/WebP path uploads use — so the stored src stays small enough for the
 * localStorage autosave, then hand the result back via `onGenerated`.
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

  const generate = async () => {
    if (!prompt.trim() || busy) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch('/api/ai/image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, model, sizeId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Image generation failed');
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
    </div>
  );
}
