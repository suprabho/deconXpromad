'use client';

import { useState } from 'react';
import type { ForegroundElement } from '@/lib/composition/types';
import { inputCls } from './controls';

/**
 * AI fill for a whole scene. Sends one brief to /api/ai/scene, which plans a
 * stack of complementary components (each with its own placement) and returns
 * ready-to-use ForegroundElements the parent appends to the foreground. Unlike
 * AiContentGenerator (one element's content), this adds multiple elements at once.
 */
export function AiSceneGenerator({
  model,
  onGenerated,
}: {
  model: string;
  onGenerated: (elements: ForegroundElement[]) => void;
}) {
  const [prompt, setPrompt] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generate = async () => {
    if (!prompt.trim() || busy) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch('/api/ai/scene', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, model }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Generation failed');
      const elements = (data.elements ?? []) as ForegroundElement[];
      if (!elements.length) throw new Error('No elements returned');
      onGenerated(elements);
      setPrompt('');
    } catch (e) {
      setError((e as Error).message || 'Generation failed');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-2 rounded-md border border-cobalt/30 bg-cobalt/5 p-2">
      <span className="flex items-center gap-1 text-xs font-semibold text-cobalt">✦ Generate a scene with AI</span>
      <textarea
        className={`${inputCls} resize-none`}
        rows={2}
        value={prompt}
        placeholder={'Describe the whole scene… e.g. "a case-overlap dashboard: a case card, a risk gauge and a live activity feed"'}
        onChange={(e) => setPrompt(e.target.value)}
        onKeyDown={(e) => {
          if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') void generate();
        }}
      />
      <div className="flex items-center justify-between gap-2">
        <span className="text-[11px] text-muted/80">Adds several elements · ⌘↵</span>
        <button
          type="button"
          onClick={() => void generate()}
          disabled={busy || !prompt.trim()}
          className="rounded-md bg-cobalt px-2.5 py-1 text-xs font-semibold text-white transition hover:bg-cobalt/90 disabled:opacity-50"
        >
          {busy ? 'Composing…' : 'Generate scene'}
        </button>
      </div>
      {error && <p className="text-[11px] text-risk-text">{error}</p>}
    </div>
  );
}
