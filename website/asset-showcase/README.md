# Deconflict — Visual Asset Showcase

A standalone Next.js app that catalogues every visual asset created for the
Deconflict homepage exploration — the ambient Aura embeds, the raster background
images, and the static and animated SVG set. It is fully self-contained and
independent of the prototype/proposal app.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
```

## Publish it

Configured for static export (`output: 'export'`):

```bash
npm run build      # emits a fully static site in ./out
```

Deploy `out/` to any static host. On **Vercel**, import the repo and set the
**Root Directory** to `website/asset-showcase` — the framework preset and
build command are auto-detected.

## Structure

```
asset-showcase/
├── app/
│   ├── page.tsx        # The showcase itself (single page, anchored sections)
│   ├── layout.tsx      # Shell: top bar + anchor nav, footer
│   └── globals.css     # Self-contained design system (Deconflict tokens)
├── lib/
│   └── assets.ts       # All asset metadata (embeds, images, SVGs)
└── public/
    ├── logos/          # Brand marks (static SVG)
    ├── icons/          # Capability icons (static SVG)
    ├── illustrations/  # Living illustration (animated-in-context SVG)
    └── images/         # Raster background plates (PNG / JPG)
```

The Aura backdrops load live from `aura.promad.design` at runtime (no build-time
dependency). Every other asset is bundled locally under `public/`.
