'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { CompositionStage } from '@/components/studio/CompositionStage';
import { Inspector } from '@/components/studio/inspector/Inspector';
import { LibraryDialog } from '@/components/studio/LibraryDialog';
import { sizeFor, type CompositionConfig } from '@/lib/composition/types';
import { DEFAULT_COMPOSITION } from '@/lib/composition/defaults';
import {
  exportJson,
  importJson,
  loadComposition,
  loadDocPointer,
  mergeComposition,
  saveComposition,
  saveDocPointer,
} from '@/lib/composition/persistence';
import {
  updateComposition,
  type SavedComposition,
  type SavedCompositionMeta,
} from '@/lib/composition/library-client';

type ImageFormat = 'png' | 'webp';

export default function StudioEditor() {
  const [config, setConfig] = useState<CompositionConfig>(DEFAULT_COMPOSITION);
  const [format, setFormat] = useState<ImageFormat>('png');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  // Saved-library state: which DB row the working draft tracks, and whether it
  // has unsaved edits since the last save/open.
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [currentName, setCurrentName] = useState('Untitled');
  const [dirty, setDirty] = useState(false);
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  // JSON of the last saved / opened composition; the draft is "dirty" when it
  // diverges. A value compare (recomputed on the autosave debounce) rather than an
  // edit counter, so it stays correct across React Strict Mode's double-invoked
  // effects. Null until the first hydrate, when no comparison is meaningful.
  const baselineRef = useRef<string | null>(null);

  // Hydrate from localStorage AFTER mount (first render matches the server's
  // DEFAULT_COMPOSITION, so there is no hydration mismatch). Restore the saved-row
  // pointer too, so "Save" knows whether to update an existing row or create one.
  useEffect(() => {
    const pointer = loadDocPointer();
    if (pointer) {
      setCurrentId(pointer.id);
      setCurrentName(pointer.name);
    }
    const loaded = loadComposition();
    baselineRef.current = JSON.stringify(loaded);
    setConfig(loaded);
  }, []);

  // Debounced autosave of the working draft + dirty recompute against the baseline.
  useEffect(() => {
    const t = setTimeout(() => {
      saveComposition(config);
      if (baselineRef.current !== null) setDirty(JSON.stringify(config) !== baselineRef.current);
    }, 500);
    return () => clearTimeout(t);
  }, [config]);

  const size = sizeFor(config.sizeId);

  // Measure the preview column to scale the exact-pixel stage to fit.
  const previewRef = useRef<HTMLDivElement>(null);
  const [previewW, setPreviewW] = useState(0);
  useEffect(() => {
    const el = previewRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => setPreviewW(entries[0].contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const scale = previewW > 0 ? Math.min(previewW / size.width, 1) : 0;

  const download = useCallback(async () => {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch('/api/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ config, format }),
      });
      if (!res.ok) throw new Error(await res.text());
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `deconflict-${config.sizeId}.${format}`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      setError((e as Error).message || 'Export failed');
    } finally {
      setBusy(false);
    }
  }, [config, format]);

  const onImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const imported = await importJson(file);
      baselineRef.current = JSON.stringify(imported);
      setConfig(imported);
      // An imported file is an untracked draft until it's saved.
      setCurrentId(null);
      setCurrentName(file.name.replace(/\.json$/i, '') || 'Untitled');
      saveDocPointer(null);
      setDirty(false);
      setError(null);
    } catch {
      setError('Could not read that JSON file.');
    } finally {
      e.target.value = '';
    }
  };

  // A create/update of the CURRENT draft persisted `savedConfig` — adopt the row
  // as the draft's identity and reset the dirty baseline to what's now stored.
  const handleSaved = useCallback((meta: SavedCompositionMeta, savedConfig: CompositionConfig) => {
    setCurrentId(meta.id);
    setCurrentName(meta.name);
    saveDocPointer({ id: meta.id, name: meta.name });
    baselineRef.current = JSON.stringify(savedConfig);
    setDirty(false);
  }, []);

  // A rename of the tracked row — name only, the config wasn't re-persisted, so
  // the dirty state is left untouched.
  const handleRenamed = useCallback((meta: SavedCompositionMeta) => {
    setCurrentName(meta.name);
    saveDocPointer({ id: meta.id, name: meta.name });
  }, []);

  // Load a saved composition into the editor.
  const handleLoad = useCallback((doc: SavedComposition) => {
    const merged = mergeComposition(doc.config);
    baselineRef.current = JSON.stringify(merged);
    setConfig(merged);
    setCurrentId(doc.id);
    setCurrentName(doc.name);
    saveDocPointer({ id: doc.id, name: doc.name });
    setDirty(false);
    setError(null);
  }, []);

  // If the row the draft tracks gets deleted, detach (the draft lives on locally,
  // now as unsaved work).
  const handleDeleted = useCallback(
    (id: string) => {
      if (id === currentId) {
        setCurrentId(null);
        saveDocPointer(null);
        setDirty(true);
      }
    },
    [currentId],
  );

  // Header "Save": update the tracked row in place, or open the library to name a
  // brand-new composition.
  const quickSave = useCallback(async () => {
    if (!currentId) {
      setLibraryOpen(true);
      return;
    }
    const sent = config;
    setSaving(true);
    setError(null);
    try {
      const meta = await updateComposition(currentId, { name: currentName, config: sent });
      handleSaved(meta, sent);
    } catch (e) {
      setError((e as Error).message || 'Save failed');
    } finally {
      setSaving(false);
    }
  }, [currentId, currentName, config, handleSaved]);

  return (
    <div className="flex h-screen flex-col bg-frost text-ink">
      {/* Top bar */}
      <header className="flex shrink-0 items-center gap-3 border-b border-hair bg-white px-4 py-2.5">
        <div className="flex items-center gap-2 font-semibold">
          <span className="grid h-6 w-6 place-items-center rounded bg-navy text-[11px] font-bold text-white">D</span>
          <span className="text-sm">Deconflict Visual Studio</span>
        </div>
        <span className="rounded bg-frost px-2 py-0.5 text-xs text-muted">{size.width} × {size.height}</span>
        <span
          className="flex items-center gap-1 text-xs text-muted"
          title={currentId ? 'Saved to the library' : 'Not yet saved to the library'}
        >
          <span className="max-w-[160px] truncate">{currentName}</span>
          {dirty && <span className="text-match" title="Unsaved changes">•</span>}
        </span>

        <div className="ml-auto flex items-center gap-2">
          <input ref={fileInput} type="file" accept="application/json" className="hidden" onChange={onImport} />
          <button
            type="button"
            onClick={() => fileInput.current?.click()}
            className="rounded-md border border-hair px-2.5 py-1.5 text-xs font-medium text-ink hover:bg-frost"
          >
            Import JSON
          </button>
          <button
            type="button"
            onClick={() => exportJson(config)}
            className="rounded-md border border-hair px-2.5 py-1.5 text-xs font-medium text-ink hover:bg-frost"
          >
            Export JSON
          </button>

          <span className="mx-1 h-5 w-px bg-hair" />

          <button
            type="button"
            onClick={() => setLibraryOpen(true)}
            className="rounded-md border border-hair px-2.5 py-1.5 text-xs font-medium text-ink hover:bg-frost"
          >
            Library
          </button>
          <button
            type="button"
            onClick={quickSave}
            disabled={saving}
            className="rounded-md border border-cobalt/30 bg-cobalt/5 px-2.5 py-1.5 text-xs font-semibold text-cobalt transition hover:bg-cobalt/10 disabled:opacity-60"
          >
            {saving ? 'Saving…' : currentId ? 'Save' : 'Save…'}
          </button>

          <span className="mx-1 h-5 w-px bg-hair" />

          <div className="flex overflow-hidden rounded-md border border-hair text-xs font-medium">
            {(['png', 'webp'] as ImageFormat[]).map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFormat(f)}
                className={format === f ? 'bg-ink px-2.5 py-1.5 uppercase text-white' : 'px-2.5 py-1.5 uppercase text-muted hover:bg-frost'}
              >
                {f}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={download}
            disabled={busy}
            className="rounded-md bg-cobalt px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-cobalt/90 disabled:opacity-60"
          >
            {busy ? 'Rendering…' : `Download ${format.toUpperCase()}`}
          </button>
        </div>
      </header>

      {error && (
        <div className="shrink-0 border-b border-risk-bg bg-risk-bg px-4 py-1.5 text-xs text-risk-text">{error}</div>
      )}

      {/* Body: inspector + preview */}
      <div className="flex min-h-0 flex-1">
        <aside className="flex w-[380px] shrink-0 border-r border-hair bg-frost">
          <Inspector config={config} onChange={setConfig} />
        </aside>

        <main className="flex min-w-0 flex-1 items-center justify-center overflow-auto p-8">
          <div ref={previewRef} className="w-full max-w-[1100px]">
            <div
              className="mx-auto overflow-hidden rounded-xl border border-hair shadow-2xl"
              style={{ width: previewW > 0 ? size.width * scale : '100%', height: previewW > 0 ? size.height * scale : 'auto' }}
            >
              <div style={{ width: size.width, height: size.height, transform: `scale(${scale})`, transformOrigin: 'top left' }}>
                <CompositionStage config={config} />
              </div>
            </div>
            <p className="mt-3 text-center text-xs text-muted">
              Live preview · {Math.round(scale * 100)}% · the download renders this at 2× through a headless browser.
            </p>
          </div>
        </main>
      </div>

      <LibraryDialog
        open={libraryOpen}
        onClose={() => setLibraryOpen(false)}
        config={config}
        currentId={currentId}
        currentName={currentName}
        onSaved={handleSaved}
        onRenamed={handleRenamed}
        onLoad={handleLoad}
        onDeleted={handleDeleted}
      />
    </div>
  );
}
