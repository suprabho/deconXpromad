# Deconflict — Homepage Design Proposal

A mini Next.js app that publishes and documents the Deconflict homepage design
exploration: three working prototype directions, each presented with full design
documentation, side-by-side comparison, and live, scrollable previews.

| Concept | Name | Register |
| --- | --- | --- |
| A | **The Dossier** | Editorial / archival — Spectral serif, guilloché rosette, lifecycle spine |
| B | **Signal Path** | Modern SaaS — Sora, live network canvas, hub-and-spoke platform map |
| C | **Command** | Command center — Barlow Semi Condensed uppercase, dot-matrix map, scan sweep |

> Note: the source folder contained four HTML files, but `concept-b-signal-path (1).html`
> and `concept-b-signal-path (2).html` are byte-identical — there are three distinct
> designs. The app is data-driven, so a fourth drops in trivially (see below).

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
```

## Publish it

The app is configured for static export (`output: 'export'`):

```bash
npm run build      # emits a fully static site in ./out
```

Deploy `out/` to any static host — Vercel (`vercel deploy`), Netlify, GitHub Pages,
or S3/CloudFront. No server required.

## Structure

```
proposal/
├── app/
│   ├── page.tsx                  # Proposal index: concepts, comparison matrix, shared foundations
│   ├── concepts/[slug]/page.tsx  # Per-concept documentation page (statically generated)
│   ├── layout.tsx                # Shell: top bar, footer
│   └── globals.css               # Proposal design system (matches Deconflict tokens)
├── components/
│   └── PreviewFrame.tsx          # Live iframe preview with desktop/tablet/mobile toggle
├── lib/
│   └── concepts.ts               # ALL documentation content + shared palette/architecture data
└── public/concepts/              # The prototypes themselves, served verbatim
    ├── concept-a-dossier.html
    ├── concept-b-signal-path.html
    └── concept-c-command.html
```

The prototypes are intentionally untouched single-file HTML — they render
pixel-perfect inside iframes and can also be opened full screen directly
(e.g. `/concepts/concept-a-dossier.html`).

## Adding a fourth concept

1. Drop the prototype into `public/concepts/concept-d-yourname.html`.
2. Add an entry to the `concepts` array in `lib/concepts.ts` (slug, docs, anatomy…)
   and a fourth column value to each `comparison` row (widen the tuple type).
3. Add the link to the top bar in `app/layout.tsx`.

Everything else — index card, documentation page, prev/next pager, static
generation — is derived from the data.
