# Deconflict Visual Studio

A lightweight visual composition tool. Stack a layered "hero" image from an
**Aura animated background** (or raster image / solid), optional **mid-ground
SVG/image graphics**, one **Deconflict UI component**, and **overlay text** —
edit every piece of content live, then **export a PNG/WebP**.

Modelled on `header-studio` (GreenMentor): one canonical renderer shared by the
live preview and the screenshot export, aura attached by slug, structured config.

## Run

```bash
pnpm install            # also runs `playwright install chromium` (postinstall)
pnpm dev                # http://localhost:3000  (we develop on :3317)
```

Export needs the Chromium that `pnpm install` fetched. If a download ever fails:
`pnpm exec playwright install chromium`.

## How it works

- **Structured layers, not freeform.** A composition is a fixed stack —
  background → scrim → mid graphics → one foreground component → overlay text —
  placed with position + size *presets* (no drag/resize). See
  [`lib/composition/types.ts`](lib/composition/types.ts) for the `CompositionConfig` schema.
- **One source of truth.** [`components/studio/CompositionStage.tsx`](components/studio/CompositionStage.tsx)
  renders the composition at exact pixels. The editor mounts it scaled-to-fit;
  the chrome-less [`/render`](app/render/page.tsx) route mounts it 1:1; the export
  screenshots that route — so preview and output are pixel-identical.
- **Aura by slug.** A background aura is a cross-origin `<iframe>` embed of
  `aura.promad.design/embed/{slug}`. Because it's cross-origin it can't be
  canvas-captured, so **export must be a real headless-browser screenshot** —
  that's what [`lib/composition/screenshot.ts`](lib/composition/screenshot.ts) +
  [`app/api/export/route.ts`](app/api/export/route.ts) do (Playwright → PNG, sharp → WebP).
- **Editable UI components.** The Deconflict components (CaseCard, OverlapAlert,
  ConnectorNode, ActivityTimeline, RiskPill, DeconflictBanner) live in
  [`components/deconflict/`](components/deconflict) — built per `deconflict-ui-guide.md`,
  fully props-driven. The inspector edits their content (case fields, per-field
  reveal states, timeline tracks, alert text, …).
- **Local persistence.** Autosaves to `localStorage`; Import/Export the
  composition as JSON. No backend. See [`lib/composition/persistence.ts`](lib/composition/persistence.ts).

## Assets

The pickable images / SVGs / auras come from
[`lib/assets/catalog.ts`](lib/assets/catalog.ts) (a copy of
`asset-showcase/lib/assets.ts`); the files live under `public/assets/`. Any
`aura.promad.design` slug also works via the custom-slug field.
