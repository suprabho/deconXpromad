'use client';

import { useCallback, useEffect, useState } from 'react';
import clsx from 'clsx';
import { PencilSimpleIcon, TrashIcon, XIcon } from '@phosphor-icons/react/dist/ssr';
import { inputCls } from '@/components/studio/inspector/controls';
import { sizeFor, type CompositionConfig } from '@/lib/composition/types';
import {
  createComposition,
  deleteComposition,
  fetchComposition,
  fetchCompositions,
  updateComposition,
  type SavedComposition,
  type SavedCompositionMeta,
} from '@/lib/composition/library-client';

type Props = {
  open: boolean;
  onClose: () => void;
  /** The live working composition — what "Save" persists. */
  config: CompositionConfig;
  /** The saved row the draft is tracking (so Save can update in place), or null. */
  currentId: string | null;
  currentName: string;
  /** After a create/update of the CURRENT draft (config persisted) — parent adopts
   *  the row's id/name and resets its dirty baseline to `savedConfig`. */
  onSaved: (meta: SavedCompositionMeta, savedConfig: CompositionConfig) => void;
  /** After renaming the tracked row (name only, config not re-persisted). */
  onRenamed: (meta: SavedCompositionMeta) => void;
  /** When the user opens a saved composition. */
  onLoad: (doc: SavedComposition) => void;
  /** When a saved composition is deleted (parent clears its pointer if it matches). */
  onDeleted: (id: string) => void;
};

function relativeTime(iso: string): string {
  const min = Math.round((Date.now() - new Date(iso).getTime()) / 60_000);
  if (min < 1) return 'just now';
  if (min < 60) return `${min}m ago`;
  const hr = Math.round(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const day = Math.round(hr / 24);
  if (day < 7) return `${day}d ago`;
  return new Date(iso).toLocaleDateString();
}

export function LibraryDialog({
  open,
  onClose,
  config,
  currentId,
  currentName,
  onSaved,
  onRenamed,
  onLoad,
  onDeleted,
}: Props) {
  const [list, setList] = useState<SavedCompositionMeta[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  /** A label for the action in flight (disables the relevant controls). */
  const [busy, setBusy] = useState<string | null>(null);
  const [name, setName] = useState(currentName);
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameDraft, setRenameDraft] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setList(await fetchCompositions());
    } catch (e) {
      setError((e as Error).message || 'Could not load the library.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Reset the name field + (re)load the list each time the dialog opens.
  useEffect(() => {
    if (!open) return;
    setName(currentName);
    setRenamingId(null);
    setConfirmDeleteId(null);
    void refresh();
  }, [open, currentName, refresh]);

  // Close on Escape.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  const trimmed = name.trim();

  const doCreate = async () => {
    if (!trimmed) return;
    setBusy('create');
    setError(null);
    try {
      const meta = await createComposition(trimmed, config);
      onSaved(meta, config);
      await refresh();
    } catch (e) {
      setError((e as Error).message || 'Save failed.');
    } finally {
      setBusy(null);
    }
  };

  const doUpdate = async () => {
    if (!currentId || !trimmed) return;
    setBusy('update');
    setError(null);
    try {
      const meta = await updateComposition(currentId, { name: trimmed, config });
      onSaved(meta, config);
      await refresh();
    } catch (e) {
      setError((e as Error).message || 'Update failed.');
    } finally {
      setBusy(null);
    }
  };

  const doOpen = async (id: string) => {
    setBusy(`open:${id}`);
    setError(null);
    try {
      const doc = await fetchComposition(id);
      onLoad(doc);
      onClose();
    } catch (e) {
      setError((e as Error).message || 'Could not open that composition.');
      setBusy(null);
    }
  };

  const doRename = async (id: string) => {
    const next = renameDraft.trim();
    if (!next) return;
    setBusy(`rename:${id}`);
    setError(null);
    try {
      const meta = await updateComposition(id, { name: next });
      if (id === currentId) onRenamed(meta);
      setRenamingId(null);
      await refresh();
    } catch (e) {
      setError((e as Error).message || 'Rename failed.');
    } finally {
      setBusy(null);
    }
  };

  const doDelete = async (id: string) => {
    setBusy(`delete:${id}`);
    setError(null);
    try {
      await deleteComposition(id);
      onDeleted(id);
      setConfirmDeleteId(null);
      await refresh();
    } catch (e) {
      setError((e as Error).message || 'Delete failed.');
    } finally {
      setBusy(null);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-navy/40 p-4 motion-safe:animate-fade-in"
      onMouseDown={onClose}
    >
      <div
        className="flex max-h-[80vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-hair bg-white shadow-glass motion-safe:animate-pop-in"
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-hair px-5 py-3.5">
          <div>
            <h2 className="text-sm font-semibold text-ink">Composition library</h2>
            <p className="text-xs text-muted">Saved to the database — open from anywhere.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid h-7 w-7 place-items-center rounded-md text-muted transition hover:bg-frost hover:text-ink"
            aria-label="Close"
          >
            <XIcon size={16} weight="bold" />
          </button>
        </div>

        {/* Save current */}
        <div className="shrink-0 border-b border-hair bg-frost px-5 py-3.5">
          <span className="mb-1 block text-xs font-medium text-muted">
            {currentId ? 'Update or save a copy' : 'Save the current composition'}
          </span>
          <div className="flex items-center gap-2">
            <input
              className={inputCls}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Composition name"
              onKeyDown={(e) => {
                if (e.key === 'Enter') void (currentId ? doUpdate() : doCreate());
              }}
            />
            {currentId ? (
              <>
                <button
                  type="button"
                  onClick={doUpdate}
                  disabled={!trimmed || !!busy}
                  className="shrink-0 rounded-md bg-cobalt px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-cobalt/90 disabled:opacity-50"
                >
                  {busy === 'update' ? 'Saving…' : 'Update'}
                </button>
                <button
                  type="button"
                  onClick={doCreate}
                  disabled={!trimmed || !!busy}
                  className="shrink-0 rounded-md border border-hair bg-white px-3 py-1.5 text-xs font-medium text-ink transition hover:bg-frost disabled:opacity-50"
                >
                  {busy === 'create' ? 'Saving…' : 'Save copy'}
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={doCreate}
                disabled={!trimmed || !!busy}
                className="shrink-0 rounded-md bg-cobalt px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-cobalt/90 disabled:opacity-50"
              >
                {busy === 'create' ? 'Saving…' : 'Save'}
              </button>
            )}
          </div>
        </div>

        {error && (
          <div className="shrink-0 border-b border-risk-bg bg-risk-bg px-5 py-2 text-xs text-risk-text">{error}</div>
        )}

        {/* List */}
        <div className="min-h-0 flex-1 overflow-auto px-2 py-2">
          {loading ? (
            <p className="px-3 py-6 text-center text-xs text-muted">Loading…</p>
          ) : list.length === 0 ? (
            <p className="px-3 py-6 text-center text-xs text-muted">
              No saved compositions yet. Name one above and hit Save.
            </p>
          ) : (
            <ul className="space-y-1">
              {list.map((c) => {
                const isCurrent = c.id === currentId;
                const isRenaming = renamingId === c.id;
                const isConfirming = confirmDeleteId === c.id;
                return (
                  <li
                    key={c.id}
                    className={clsx(
                      'group flex items-center gap-2 rounded-lg px-3 py-2 transition',
                      isCurrent ? 'bg-cobalt/5 ring-1 ring-inset ring-cobalt/20' : 'hover:bg-frost',
                    )}
                  >
                    {isRenaming ? (
                      <input
                        autoFocus
                        className={clsx(inputCls, 'py-1')}
                        value={renameDraft}
                        onChange={(e) => setRenameDraft(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') void doRename(c.id);
                          if (e.key === 'Escape') setRenamingId(null);
                        }}
                      />
                    ) : (
                      <button
                        type="button"
                        onClick={() => doOpen(c.id)}
                        disabled={!!busy}
                        className="flex min-w-0 flex-1 items-baseline gap-2 text-left disabled:opacity-50"
                        title="Open this composition"
                      >
                        <span className="truncate text-sm font-medium text-ink">{c.name}</span>
                        {isCurrent && <span className="shrink-0 text-[10px] font-semibold uppercase text-cobalt">current</span>}
                      </button>
                    )}

                    {isRenaming ? (
                      <>
                        <button
                          type="button"
                          onClick={() => doRename(c.id)}
                          disabled={!!busy}
                          className="shrink-0 rounded-md bg-cobalt px-2 py-1 text-[11px] font-semibold text-white hover:bg-cobalt/90 disabled:opacity-50"
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          onClick={() => setRenamingId(null)}
                          className="shrink-0 rounded-md px-2 py-1 text-[11px] text-muted hover:text-ink"
                        >
                          Cancel
                        </button>
                      </>
                    ) : isConfirming ? (
                      <>
                        <span className="shrink-0 text-[11px] text-muted">Delete?</span>
                        <button
                          type="button"
                          onClick={() => doDelete(c.id)}
                          disabled={!!busy}
                          className="shrink-0 rounded-md bg-risk-text px-2 py-1 text-[11px] font-semibold text-white hover:opacity-90 disabled:opacity-50"
                        >
                          {busy === `delete:${c.id}` ? '…' : 'Yes'}
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmDeleteId(null)}
                          className="shrink-0 rounded-md px-2 py-1 text-[11px] text-muted hover:text-ink"
                        >
                          No
                        </button>
                      </>
                    ) : (
                      <>
                        <span className="shrink-0 rounded bg-frost px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-muted">
                          {sizeFor(c.sizeId).id}
                        </span>
                        <span className="shrink-0 text-[11px] text-muted">{relativeTime(c.updatedAt)}</span>
                        <div className="flex shrink-0 items-center gap-0.5 opacity-0 transition group-hover:opacity-100">
                          <button
                            type="button"
                            onClick={() => {
                              setRenamingId(c.id);
                              setRenameDraft(c.name);
                            }}
                            className="grid h-6 w-6 place-items-center rounded text-muted hover:bg-white hover:text-ink"
                            title="Rename"
                            aria-label="Rename"
                          >
                            <PencilSimpleIcon size={14} />
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirmDeleteId(c.id)}
                            className="grid h-6 w-6 place-items-center rounded text-muted hover:bg-white hover:text-risk-text"
                            title="Delete"
                            aria-label="Delete"
                          >
                            <TrashIcon size={14} />
                          </button>
                        </div>
                      </>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
