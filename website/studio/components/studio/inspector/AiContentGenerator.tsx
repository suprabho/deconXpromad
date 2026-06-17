'use client';

import { useState } from 'react';
import type { ForegroundContent, ForegroundType } from '@/lib/composition/types';
import { inputCls } from './controls';

/**
 * AI fill for one foreground element. Sends the element type + a free-text brief
 * to /api/ai/content, which returns a schema-valid ForegroundContent the parent
 * drops straight into the element. `current` is passed so the server can carry
 * over fields the model shouldn't touch (e.g. CaseCard reveal toggles).
 */
export function AiContentGenerator({
  type,
  current,
  model,
  onGenerated,
}: {
  type: ForegroundType;
  current: ForegroundContent;
  model: string;
  onGenerated: (content: ForegroundContent) => void;
}) {
  const [prompt, setPrompt] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (type === 'none') return null;

  const generate = async () => {
    if (!prompt.trim() || busy) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch('/api/ai/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, prompt, model, current }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Generation failed');
      onGenerated(data.content as ForegroundContent);
    } catch (e) {
      setError((e as Error).message || 'Generation failed');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-2 rounded-md border border-cobalt/30 bg-cobalt/5 p-2">
      <span className="flex items-center gap-1 text-xs font-semibold text-cobalt">✦ Generate content with AI</span>
      <textarea
        className={`${inputCls} resize-none`}
        rows={2}
        value={prompt}
        placeholder={`Describe this ${type}… e.g. "a shell-company AML case in Cyprus, high risk"`}
        onChange={(e) => setPrompt(e.target.value)}
        onKeyDown={(e) => {
          if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') void generate();
        }}
      />
      <div className="flex items-center justify-between gap-2">
        <span className="text-[11px] text-muted/80">Fills every field · ⌘↵</span>
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
