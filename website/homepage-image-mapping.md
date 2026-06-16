# Homepage (Financial Institutions) — Section · Text · CTA · Image Map

This mirrors the home-page table in the **Deconflict Website 2.0** doc
(*Section → Text → CTA → Image*) and **fills in the Image column** for the
client. In the source doc those cells were left as placeholders — `Image`,
`Image?`, `Look for design template`, or blank — so this is the "what actually
goes there" view of the showcase that we maintain ourselves.

Each section's **Image** is built from up to two layers:

1. **Background render** — one full-bleed ambient PNG per section that sits
   *behind* the copy. These were done in the previous pass (see
   [§2 Section backgrounds](#2-section-backgrounds--the-base-layer)).
2. **Foreground content imagery** — what sits *on top* of the background. This
   is the part that was missing. Every foreground asset is one of three types:
   - **BG + SVG** — a background image with an SVG drawn on top (a composite).
   - **SVG only** — a standalone vector with no background plate.
   - **Background only** — the section is just its background render, no
     foreground asset.

> **Paths** are relative to `website/asset-showcase/public/`.
> **Backgrounds** regen: `website/scripts/render-section-backgrounds.mjs`.
> **SVGs / rasters** live under `inline/`, `icons/`, `illustrations/`, `images/`.

---

## 1. Master table (mirrors the Website 2.0 doc)

| Section | Text | CTA | Image — placeholder → what now fills it |
|---|---|---|---|
| **S1 · Banner** | **Investigative Intelligence for Compliance and Risk Teams** — *Go beyond standard transaction monitoring with direct, secure access to intelligence sourced straight from credentialed law enforcement.* | Schedule a Demo | `Image` → **BG + SVG.** Ethereal cobalt background + product-showcase signal cards and the SOC 2 / GDPR / hashed-exchange trust marks (SVG) on top. |
| **S2 · Connected Intelligence** | **Connected intelligence that goes beyond basic risk scoring** | Half-image link to respective product pages | *(blank)* → **BG + SVG ×2.** A Signal × Nexus diptych background; each half is a product panel = raster plate + product glyph (SVG), wired as the half-image links. |
| **S3 · Why Deconflict** | **Compliance Teams Need More Than Monitoring** — *Traditional blockchain analytics platforms generate alerts. Deconflict provides investigative context… Built for scale: banks, exchanges, fintechs, and regulated institutions.* | — | `Image?` → **BG + SVG.** Alerts→constellation background + the alerts-to-context living illustration and the lifecycle / contrast / workflow SVGs. |
| **S4 · Verified Intelligence** | **Verified Intelligence for Faster Decisions** — *Law Enforcement Intelligence · Examiner-Ready Compliance · Seamless Integration & Speed.* | — | `Look for design template` → **BG + SVG.** Signal-path background + the three capability-pillar cards, the feature grid, and the capability icons (SVG). |
| **S5 · Resources & News** | **Latest Resources & News** — *Pulls from Blogs section.* | — | *(blank)* → **BG + SVG.** Light editorial cover-stack background + the three resource-cover cards (SVG). |
| **S6 · Close** | **Built for Institutions Managing Digital Asset Risk** — *Deconflict helps compliance and investigative teams operate with greater confidence in fast-moving digital asset environments.* | Schedule a Demo | *(blank)* → **Background only.** Dimmed soundwave render; no foreground asset — brackets the page with S1. |

---

## 2. Section backgrounds — the base layer

The full-bleed render that sits **behind** the copy in every section. All are
`2400 × 1350` PNG (16:9), brand palette (`navy #0d1b3e`, `cobalt #1a56db`),
authored as SVG and rasterized with sharp. S1–S4 and S6 are dark (white copy on
top); **S5 is light** (dark copy on top).

| Section | Background render | Path | Motif (sits behind the copy) |
|---|---|---|---|
| **S1 · Banner** | Ethereal cobalt wash | `images/sections/s1-bg.png` | Drifting cobalt colour blends over deep navy — static replacement for the *Ethereal colour blends* Aura embed. |
| **S2 · Connected Intelligence** | Signal × Nexus diptych | `images/sections/s2-bg.png` | Left half = Signal concentric rings; right half = Nexus node mesh; joined by a luminous centre seam. |
| **S3 · Why Deconflict** | Alerts → constellation | `images/sections/s3-bg.png` | Scattered loose alerts (left) converge into a verified hex constellation (right). |
| **S4 · Verified Intelligence** | Signal path / momentum | `images/sections/s4-bg.png` | Accelerating signal streaks sweep L→R into a verified ✓ hex node. |
| **S5 · Resources & News** | Editorial cover stack *(light)* | `images/sections/s5-bg.png` | Light frost wash with a fanned stack of cover planes — keeps resource copy legible. |
| **S6 · Close** | Modern soundwave | `images/sections/s6-bg.png` | Dimmed equalizer waveform over navy — static replacement for the *Modern soundwave* Aura embed. |

---

## 3. Foreground content imagery — *background + SVG, or just SVG*

The part that was missing. For each section, every foreground image and whether
it is a **BG + SVG** composite or **SVG only**. SVG paths use the concept folder
the artwork was lifted from (`concept-a` / `concept-b`); for the Website 2.0
build they're overlaid on the section background above.

### S1 · Banner — *background + SVG*

| Image | Type | Background | SVG overlay | Note |
|---|---|---|---|---|
| Banner field | BG + SVG | `images/sections/s1-bg.png` | *(see rows below)* | Trust strip + product showcase sit on the cobalt wash. |
| Trust marks (×3) | SVG only | — | `inline/concept-a/trust-soc2.svg`, `trust-gdpr.svg`, `trust-hashed-exchange.svg` | SOC 2 Type II · GDPR · Hashed exchange, in the credibility strip. |
| Signal-card icons (×4) | SVG only | — | `inline/concept-b/signal-icon-overlap.svg`, `signal-icon-verified.svg`, `signal-icon-matches.svg`, `signal-tag-exact.svg` | Product-showcase chips framing the hero. |
| Overlap-detection diagram | SVG only *(wide)* | — | `inline/concept-b/overlap-detection-diagram.svg` | Full-width product-showcase diagram. |

### S2 · Connected Intelligence — *background + SVG (two product panels)*

| Image | Type | Background | SVG overlay | Note |
|---|---|---|---|---|
| Section backdrop | BG only | `images/sections/s2-bg.png` | — | Signal × Nexus diptych behind the two half-image links. |
| **Signal** product panel | BG + SVG | `images/signal-bg.png` | `inline/concept-a/glyph-signal-rings.svg` | Left half-image link → Signal product page. |
| **Nexus** product panel | BG + SVG | `images/nexus-bg.png` | `inline/concept-a/glyph-nexus-lines.svg` | Right half-image link → Nexus product page. |
| Platform render | Background | `images/nexus.png` *(also `images/1.png`)* | — | High-res coordination plate / supporting imagery. |
| Connector lines | SVG only | — | `inline/concept-b/signal-connector-lines.svg` | Hairline links across the platform map. |

### S3 · Why Deconflict — *background + SVG*

| Image | Type | Background | SVG overlay | Note |
|---|---|---|---|---|
| Why-Deconflict band | BG + SVG | `images/sections/s3-bg.png` *(also `images/s3-bg.jpg`)* | *(see rows below)* | Lifecycle story over the alerts→constellation field. |
| Alerts → context illustration | SVG only *(wide, animated)* | — | `illustrations/alerts-to-context.svg` | The "living illustration": alerts converge through a deconfliction lens into a verified constellation. |
| Compliance lifecycle (×4) | SVG only | — | `inline/concept-a/lifecycle-01-onboarding.svg` … `lifecycle-04-reporting.svg` | Onboarding → Monitoring → Escalation → Reporting. |
| Workflow steps (×5) | SVG only | — | `inline/concept-b/workflow-onboarding.svg` … `workflow-decision-making.svg` | Concept-B equivalent of the lifecycle strip. |
| Legacy-vs-Deconflict contrast (×6) | SVG only | — | `inline/concept-a/contrast-icon-1.svg` … `contrast-icon-6.svg` | Three rows, legacy vs Deconflict. |
| Built-for-scale note | SVG only | — | `inline/concept-a/scale-note.svg` | Icon for the "Built for scale" proof line. |

### S4 · Verified Intelligence — *background + SVG*

| Image | Type | Background | SVG overlay | Note |
|---|---|---|---|---|
| Capability band | BG + SVG | `images/sections/s4-bg.png` | *(see rows below)* | Three capability pillars over the signal-path field. |
| Capability cards (×3) | SVG only | — | `inline/concept-b/capability-law-enforcement.svg`, `capability-examiner-ready.svg`, `capability-integration-speed.svg` | Law Enforcement Intelligence · Examiner-Ready Compliance · Integration & Speed. |
| Pillars A/B/C (×3) | SVG only | — | `inline/concept-a/pillar-a-source.svg`, `pillar-b-scrutiny.svg`, `pillar-c-speed.svg` | Concept-A pillar set (Source · Scrutiny · Speed). |
| Feature grid (×7) | SVG only | — | `inline/concept-b/feature-*.svg` | Secure coordination, faster escalation, improved SAR, real-time, reduced investigation, centralized, enhanced. |
| Capability icons (×7) | SVG only | — | `icons/*.svg` | Standalone line-art glyph set (light-on-dark). |

### S5 · Resources & News — *light background + SVG*

| Image | Type | Background | SVG overlay | Note |
|---|---|---|---|---|
| Resources band | BG only | `images/sections/s5-bg.png` | — | Light frost wash; keeps cards/copy legible. |
| Resource covers (×3) | SVG only | — | `inline/concept-b/resource-cover-1.svg`, `resource-cover-2.svg`, `resource-cover-3.svg` | Bitcoin seizure · FCA order · Policy briefing card art. |

### S6 · Close — *background only*

| Image | Type | Background | SVG overlay | Note |
|---|---|---|---|---|
| Closing CTA panel | Background only | `images/sections/s6-bg.png` | — | Dimmed soundwave; the Schedule-a-Demo CTA sits on top as type, no foreground asset. |

---

## Notes

- **Two layers per Image cell.** Read the master table top-down for the
  client view; read §3 when you need to know exactly which background and which
  SVG(s) compose a given cell.
- **BG + SVG vs SVG only.** "BG + SVG" means a raster/render plate with vector
  artwork on top (e.g. the S2 product panels = `signal-bg.png` + the signal-rings
  glyph). "SVG only" means the vector carries the whole image with no plate
  behind it (e.g. trust marks, lifecycle, resource covers).
- **S6 is the only background-only section** — its Image is purely the soundwave
  render with the CTA set in type over it.
- **Concept folders.** Foreground SVGs are tagged with the concept they were
  lifted from (`concept-a` / `concept-b`); on the Website 2.0 build they overlay
  the unified section backgrounds in §2.
- **Reproducible backgrounds.** Scatter is seeded (no `Math.random`), so
  re-running `scripts/render-section-backgrounds.mjs` reproduces the same
  renders. Edit palette/motifs there and re-run to regenerate.
</content>
</invoke>
