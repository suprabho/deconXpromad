# Homepage (Financial Institutions) — Section Background Mapping

Static raster **backgrounds** for every section of the first-page table in
*Deconflict Website 2.0*. Each section gets one full-bleed ambient render that
sits **behind** the copy — these are backgrounds, not standalone assets, and
they replace the live Aura iframes and the per-item SVG sets.

- All renders are `2400 × 1350` PNG (16:9), brand palette (`navy #0d1b3e`,
  `cobalt #1a56db`), authored as SVG and rasterized with sharp.
- Paths are relative to `website/asset-showcase/public/`.
- Source / regen: `website/scripts/render-section-backgrounds.mjs`
  (`node scripts/render-section-backgrounds.mjs`).

| Section | Doc placeholder | Background render | Path | Motif (sits behind the copy) |
|---|---|---|---|---|
| **S1 — Banner**<br>"Investigative Intelligence for Compliance and Risk Teams" | (hero / Note for Supro) | Ethereal cobalt wash | `images/sections/s1-bg.png` | Drifting cobalt colour blends over deep navy — static replacement for the *Ethereal colour blends* Aura embed. |
| **S2 — Connected intelligence…**<br>"CTA: Half image link to respective product pages" | `image1` | Signal × Nexus diptych | `images/sections/s2-bg.png` | Left half = Signal concentric rings; right half = Nexus node mesh; joined by a luminous centre seam — the two-product split as one backdrop. |
| **S3 — Compliance Teams Need More Than Monitoring** | `Image?` | Alerts → constellation | `images/sections/s3-bg.png` | Scattered loose alerts (left) converge into a verified hex constellation (right) — "visibility across the lifecycle." |
| **S4 — Verified Intelligence for Faster Decisions**<br>Law Enforcement Intelligence · Examiner-Ready Compliance · Seamless Integration & Speed | "Look for design template" | Signal path / momentum | `images/sections/s4-bg.png` | Accelerating signal streaks sweep L→R into a verified ✓ hex node — speed + verification behind the three capability items. |
| **S5 — Latest Resources & News** | "Pulls from Blogs section" | Editorial cover stack | `images/sections/s5-bg.png` | LIGHT frost wash with a fanned stack of cover planes — keeps resource copy/cards readable on top. |
| **S6 — Built for Institutions Managing Digital Asset Risk**<br>"CTA: Schedule a Demo" | (closing CTA panel) | Modern soundwave | `images/sections/s6-bg.png` | Dimmed equalizer waveform over navy — static replacement for the *Modern soundwave visuals* Aura embed; brackets the page with S1. |

## Notes
- **Backgrounds, not assets.** Every render is full-bleed and tuned to sit
  under text. S1–S4 and S6 are dark navy (white copy on top); **S5 is light**
  (dark copy on top) so the resources list/cards stay legible.
- **Bookends.** S1 (ethereal blend) and S6 (soundwave) are the static stand-ins
  for the two Aura iframes — same motion language, now baked to PNG so there's
  no runtime `aura.promad.design` dependency.
- **S2** keeps the "half image link to respective product pages" split as a
  single diptych backdrop: Signal rings on the left, Nexus mesh on the right.
  Overlay the two product links on each half.
- **Reproducible.** Scatter is seeded (no `Math.random`), so re-running the
  script reproduces the exact same renders. Edit palette/motifs in
  `scripts/render-section-backgrounds.mjs` and re-run to regenerate.
- The earlier standalone SVGs (capability cards, resource covers, glyphs) still
  live under `inline/` if you want to overlay them on top of these backgrounds.
