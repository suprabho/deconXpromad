/**
 * Catalogue of the visual assets created for the Deconflict homepage exploration —
 * the ambient Aura embeds, raster background images, and the static / animated
 * SVG set. Consumed by app/page.tsx to render this standalone showcase.
 *
 * Assets are organised by the design *option* (concept) that consumes them:
 * A — The Dossier, B — Signal Path, C — Command. Every asset carries an
 * `option` tag so the showcase can be sectioned per concept.
 *
 * This app is fully self-contained: every asset has a local copy under
 * /public/{logos,icons,illustrations,images}/ and is referenced from there.
 */

/** The three design directions presented in the proposal. */
export type ConceptOption = 'A' | 'B' | 'C';

export type ShowcaseConcept = {
  option: ConceptOption;
  slug: string;
  name: string;
  tagline: string;
};

export type AuraEmbed = {
  option: ConceptOption;
  slug: string;
  title: string;
  url: string;
  usedIn: string;
  note: string;
};

export type ImageAsset = {
  option: ConceptOption;
  name: string;
  src: string;
  kind: string; // PNG / JPG
  weight: string; // approx file size
  usedIn: string;
  note: string;
  dark?: boolean; // preview needs a dark mat
};

export type SvgAsset = {
  option: ConceptOption;
  name: string;
  src: string;
  usedIn: string;
  note: string;
  dark?: boolean; // artwork is light-on-dark — preview on navy
  fit?: 'contain' | 'wide'; // wide = full-bleed illustration
};

/** The design options, in presentation order. */
export const concepts: ShowcaseConcept[] = [
  {
    option: 'A',
    slug: 'concept-a',
    name: 'The Dossier',
    tagline: 'Investigative gravitas in an editorial, security-print register.',
  },
  {
    option: 'B',
    slug: 'concept-b',
    name: 'Signal Path',
    tagline: 'A living network — modern SaaS warmth with the platform as the diagram.',
  },
  {
    option: 'C',
    slug: 'concept-c',
    name: 'Command',
    tagline: 'A command-center register — condensed, uppercase, operational.',
  },
];

/** Ambient iframe backgrounds embedded from aura.promad.design. */
export const auraEmbeds: AuraEmbed[] = [
  {
    option: 'B',
    slug: 'blue-background-images-ethereal-color-blends-for-design',
    title: 'Ethereal colour blends',
    url: 'https://aura.promad.design/embed/blue-background-images-ethereal-color-blends-for-design',
    usedIn: 'Concept B · S1 Hero',
    note: 'Soft drifting cobalt wash behind the hero network canvas — adds depth without competing with the packet simulation in front of it.',
  },
  {
    option: 'B',
    slug: 'blue-light-backgrounds-clean-professional-web-backdrops',
    title: 'Clean professional backdrop',
    url: 'https://aura.promad.design/embed/blue-light-backgrounds-clean-professional-web-backdrops',
    usedIn: 'Concept B · S2 Platform map',
    note: 'Lighter, calmer field behind the hub-and-spoke platform map so the hairline connectors and capability chips stay legible.',
  },
  {
    option: 'B',
    slug: 'blue-abstract-background-modern-soundwave-visuals',
    title: 'Modern soundwave visuals',
    url: 'https://aura.promad.design/embed/blue-abstract-background-modern-soundwave-visuals',
    usedIn: 'Concept B · Workflow strip + S6 Close',
    note: 'Reused twice — behind the full-width workflow section and again, dimmed, behind the closing CTA panel — to bracket the page with the same motion.',
  },
];

/** Raster background images shipped with the prototypes. */
export const imageAssets: ImageAsset[] = [
  {
    option: 'A',
    name: 'nexus-bg.png',
    src: '/images/nexus-bg.png',
    kind: 'PNG',
    weight: '~384 KB',
    usedIn: 'Concept A · NEXUS product panel',
    note: 'Textured engraving field behind the NEXUS half of the dossier diptych.',
    dark: true,
  },
  {
    option: 'A',
    name: 'signal-bg.png',
    src: '/images/signal-bg.png',
    kind: 'PNG',
    weight: '~464 KB',
    usedIn: 'Concept A · SIGNAL product panel',
    note: 'Companion field behind the SIGNAL half of the diptych.',
    dark: true,
  },
  {
    option: 'A',
    name: 's3-bg.jpg',
    src: '/images/s3-bg.jpg',
    kind: 'JPG',
    weight: '~258 KB',
    usedIn: 'Concept A · S3 “Why Deconflict” band',
    note: 'Photographic backdrop tinted into the frost band behind the lifecycle story.',
    dark: true,
  },
  {
    option: 'B',
    name: 'nexus.png',
    src: '/images/nexus.png',
    kind: 'PNG',
    weight: '~797 KB',
    usedIn: 'Concept B · Platform / NEXUS imagery',
    note: 'High-resolution NEXUS coordination render used in the Signal Path platform section.',
    dark: true,
  },
  {
    option: 'B',
    name: '1.png',
    src: '/images/1.png',
    kind: 'PNG',
    weight: '~1.05 MB',
    usedIn: 'Concept B · supporting imagery',
    note: 'Large supporting plate carried with the Signal Path prototype.',
    dark: true,
  },
];

/** Brand marks — static, presentation-ready logo lockups. */
export const logoAssets: SvgAsset[] = [
  {
    option: 'B',
    name: 'deconflict-blue.svg',
    src: '/logos/deconflict-blue.svg',
    usedIn: 'Concept B · nav header',
    note: 'The compact header lockup used in the Signal Path top bar.',
  },
];

/** Capability icons — static line-art glyphs (light-on-dark). */
export const iconAssets: SvgAsset[] = [
  { option: 'B', name: 'centralized.svg', src: '/icons/centralized.svg', usedIn: 'Capability · Centralised coordination', note: 'Converging-nodes glyph.', dark: true },
  { option: 'B', name: 'enhanced.svg', src: '/icons/enhanced.svg', usedIn: 'Capability · Enhanced visibility', note: 'Layered-bars glyph.', dark: true },
  { option: 'B', name: 'faster-escalation.svg', src: '/icons/faster-escalation.svg', usedIn: 'Capability · Faster escalation', note: 'Signal-burst glyph.', dark: true },
  { option: 'B', name: 'improved-sar.svg', src: '/icons/improved-sar.svg', usedIn: 'Capability · Improved SAR quality', note: 'Report-lines glyph.', dark: true },
  { option: 'B', name: 'real-time-operational.svg', src: '/icons/real-time-operational.svg', usedIn: 'Capability · Real-time operations', note: 'Live-pulse glyph.', dark: true },
  { option: 'B', name: 'reduced-investigation.svg', src: '/icons/reduced-investigation.svg', usedIn: 'Capability · Reduced investigation time', note: 'Compressed-timeline glyph.', dark: true },
  { option: 'B', name: 'secure-coordination.svg', src: '/icons/secure-coordination.svg', usedIn: 'Capability · Secure coordination', note: 'Shielded-orbit glyph.', dark: true },
];

/** Living illustrations — vector artwork animated in-context inside the prototype. */
export const illustrationAssets: SvgAsset[] = [
  {
    option: 'B',
    name: 'alerts-to-context.svg',
    src: '/illustrations/alerts-to-context.svg',
    usedIn: 'Concept B · S3 narrative',
    note: 'The alerts→context “living illustration”. Scattered flickering alerts converge through a deconfliction lens and emerge as a connected, verified constellation. Exported here as a static vector; in the prototype a packet travels the full path every 5.5s and the alert nodes flicker (both idle out under prefers-reduced-motion).',
    dark: true,
    fit: 'wide',
  },
];

/**
 * SVGs that were authored inline inside the prototype HTML (not as separate
 * files) — product glyphs, the guilloché rosette, trust marks, the feature /
 * workflow / capability icon sets, signal-card diagrams, resource covers, and
 * the nav lockups. Each was lifted out verbatim into /public/inline/<concept>/.
 */
export const inlineSvgAssets: SvgAsset[] = [
  { option: 'A', name: 'logo-lockup.svg', src: '/inline/concept-a/logo-lockup.svg', usedIn: 'Nav logo lockup', note: 'Extracted from the Concept A prototype HTML.' },
  { option: 'A', name: 'glyph-nexus-lines.svg', src: '/inline/concept-a/glyph-nexus-lines.svg', usedIn: 'Diptych glyph · NEXUS node network', note: 'Extracted from the Concept A prototype HTML.' },
  { option: 'A', name: 'glyph-signal-rings.svg', src: '/inline/concept-a/glyph-signal-rings.svg', usedIn: 'Diptych glyph · SIGNAL pulse rings', note: 'Extracted from the Concept A prototype HTML.' },
  { option: 'A', name: 'guilloche-rosette.svg', src: '/inline/concept-a/guilloche-rosette.svg', usedIn: 'S6 close · guilloché rosette', note: 'Extracted from the Concept A prototype HTML.', dark: true },
  { option: 'A', name: 'trust-soc2.svg', src: '/inline/concept-a/trust-soc2.svg', usedIn: 'Trust marker · SOC 2 Type II', note: 'Extracted from the Concept A prototype HTML.' },
  { option: 'A', name: 'trust-gdpr.svg', src: '/inline/concept-a/trust-gdpr.svg', usedIn: 'Trust marker · GDPR', note: 'Extracted from the Concept A prototype HTML.' },
  { option: 'A', name: 'trust-hashed-exchange.svg', src: '/inline/concept-a/trust-hashed-exchange.svg', usedIn: 'Trust marker · Hashed exchange', note: 'Extracted from the Concept A prototype HTML.' },
  { option: 'A', name: 'contrast-icon-1.svg', src: '/inline/concept-a/contrast-icon-1.svg', usedIn: 'Contrast table · row 1 legacy', note: 'Extracted from the Concept A prototype HTML.' },
  { option: 'A', name: 'contrast-icon-2.svg', src: '/inline/concept-a/contrast-icon-2.svg', usedIn: 'Contrast table · row 1 Deconflict', note: 'Extracted from the Concept A prototype HTML.' },
  { option: 'A', name: 'contrast-icon-3.svg', src: '/inline/concept-a/contrast-icon-3.svg', usedIn: 'Contrast table · row 2 legacy', note: 'Extracted from the Concept A prototype HTML.' },
  { option: 'A', name: 'contrast-icon-4.svg', src: '/inline/concept-a/contrast-icon-4.svg', usedIn: 'Contrast table · row 2 Deconflict', note: 'Extracted from the Concept A prototype HTML.' },
  { option: 'A', name: 'contrast-icon-5.svg', src: '/inline/concept-a/contrast-icon-5.svg', usedIn: 'Contrast table · row 3 legacy', note: 'Extracted from the Concept A prototype HTML.' },
  { option: 'A', name: 'contrast-icon-6.svg', src: '/inline/concept-a/contrast-icon-6.svg', usedIn: 'Contrast table · row 3 Deconflict', note: 'Extracted from the Concept A prototype HTML.' },
  { option: 'A', name: 'lifecycle-01-onboarding.svg', src: '/inline/concept-a/lifecycle-01-onboarding.svg', usedIn: 'Lifecycle · 01 Onboarding', note: 'Extracted from the Concept A prototype HTML.' },
  { option: 'A', name: 'lifecycle-02-monitoring.svg', src: '/inline/concept-a/lifecycle-02-monitoring.svg', usedIn: 'Lifecycle · 02 Monitoring', note: 'Extracted from the Concept A prototype HTML.' },
  { option: 'A', name: 'lifecycle-03-escalation.svg', src: '/inline/concept-a/lifecycle-03-escalation.svg', usedIn: 'Lifecycle · 03 Escalation', note: 'Extracted from the Concept A prototype HTML.' },
  { option: 'A', name: 'lifecycle-04-reporting.svg', src: '/inline/concept-a/lifecycle-04-reporting.svg', usedIn: 'Lifecycle · 04 Reporting', note: 'Extracted from the Concept A prototype HTML.' },
  { option: 'A', name: 'scale-note.svg', src: '/inline/concept-a/scale-note.svg', usedIn: 'Built-for-scale note icon', note: 'Extracted from the Concept A prototype HTML.' },
  { option: 'A', name: 'pillar-a-source.svg', src: '/inline/concept-a/pillar-a-source.svg', usedIn: 'Pillar A · Source', note: 'Extracted from the Concept A prototype HTML.' },
  { option: 'A', name: 'pillar-b-scrutiny.svg', src: '/inline/concept-a/pillar-b-scrutiny.svg', usedIn: 'Pillar B · Scrutiny', note: 'Extracted from the Concept A prototype HTML.' },
  { option: 'A', name: 'pillar-c-speed.svg', src: '/inline/concept-a/pillar-c-speed.svg', usedIn: 'Pillar C · Speed', note: 'Extracted from the Concept A prototype HTML.' },
  { option: 'B', name: 'feature-secure-coordination.svg', src: '/inline/concept-b/feature-secure-coordination.svg', usedIn: 'Feature grid · Secure coordination', note: 'Extracted from the Concept B prototype HTML.' },
  { option: 'B', name: 'feature-faster-escalation.svg', src: '/inline/concept-b/feature-faster-escalation.svg', usedIn: 'Feature grid · Faster escalation', note: 'Extracted from the Concept B prototype HTML.' },
  { option: 'B', name: 'feature-improved-sar.svg', src: '/inline/concept-b/feature-improved-sar.svg', usedIn: 'Feature grid · Improved SAR', note: 'Extracted from the Concept B prototype HTML.' },
  { option: 'B', name: 'feature-real-time-operational.svg', src: '/inline/concept-b/feature-real-time-operational.svg', usedIn: 'Feature grid · Real-time operational', note: 'Extracted from the Concept B prototype HTML.' },
  { option: 'B', name: 'feature-reduced-investigation.svg', src: '/inline/concept-b/feature-reduced-investigation.svg', usedIn: 'Feature grid · Reduced investigation', note: 'Extracted from the Concept B prototype HTML.' },
  { option: 'B', name: 'feature-centralized.svg', src: '/inline/concept-b/feature-centralized.svg', usedIn: 'Feature grid · Centralized infrastructure', note: 'Extracted from the Concept B prototype HTML.' },
  { option: 'B', name: 'feature-enhanced.svg', src: '/inline/concept-b/feature-enhanced.svg', usedIn: 'Feature grid · Enhanced decision-making', note: 'Extracted from the Concept B prototype HTML.' },
  { option: 'B', name: 'workflow-onboarding.svg', src: '/inline/concept-b/workflow-onboarding.svg', usedIn: 'Workflow · Onboarding', note: 'Extracted from the Concept B prototype HTML.' },
  { option: 'B', name: 'workflow-monitoring.svg', src: '/inline/concept-b/workflow-monitoring.svg', usedIn: 'Workflow · Monitoring', note: 'Extracted from the Concept B prototype HTML.' },
  { option: 'B', name: 'workflow-escalation.svg', src: '/inline/concept-b/workflow-escalation.svg', usedIn: 'Workflow · Escalation', note: 'Extracted from the Concept B prototype HTML.', dark: true },
  { option: 'B', name: 'workflow-reporting.svg', src: '/inline/concept-b/workflow-reporting.svg', usedIn: 'Workflow · Reporting', note: 'Extracted from the Concept B prototype HTML.', dark: true },
  { option: 'B', name: 'workflow-decision-making.svg', src: '/inline/concept-b/workflow-decision-making.svg', usedIn: 'Workflow · Decision-Making', note: 'Extracted from the Concept B prototype HTML.', dark: true },
  { option: 'B', name: 'capability-law-enforcement.svg', src: '/inline/concept-b/capability-law-enforcement.svg', usedIn: 'Capability card · Law Enforcement', note: 'Extracted from the Concept B prototype HTML.', dark: true },
  { option: 'B', name: 'capability-examiner-ready.svg', src: '/inline/concept-b/capability-examiner-ready.svg', usedIn: 'Capability card · Examiner-Ready', note: 'Extracted from the Concept B prototype HTML.', dark: true },
  { option: 'B', name: 'capability-integration-speed.svg', src: '/inline/concept-b/capability-integration-speed.svg', usedIn: 'Capability card · Integration & Speed', note: 'Extracted from the Concept B prototype HTML.', dark: true },
  { option: 'B', name: 'overlap-detection-diagram.svg', src: '/inline/concept-b/overlap-detection-diagram.svg', usedIn: 'Signal card · overlap-detection diagram', note: 'Extracted from the Concept B prototype HTML.', fit: 'wide' },
  { option: 'B', name: 'signal-connector-lines.svg', src: '/inline/concept-b/signal-connector-lines.svg', usedIn: 'Platform map · connector lines', note: 'Extracted from the Concept B prototype HTML.' },
  { option: 'B', name: 'signal-icon-overlap.svg', src: '/inline/concept-b/signal-icon-overlap.svg', usedIn: 'Signal card · overlap icon', note: 'Extracted from the Concept B prototype HTML.' },
  { option: 'B', name: 'signal-icon-verified.svg', src: '/inline/concept-b/signal-icon-verified.svg', usedIn: 'Signal card · verified icon', note: 'Extracted from the Concept B prototype HTML.' },
  { option: 'B', name: 'signal-icon-matches.svg', src: '/inline/concept-b/signal-icon-matches.svg', usedIn: 'Signal card · matches icon', note: 'Extracted from the Concept B prototype HTML.' },
  { option: 'B', name: 'signal-tag-exact.svg', src: '/inline/concept-b/signal-tag-exact.svg', usedIn: 'Signal card · exact-match tag', note: 'Extracted from the Concept B prototype HTML.' },
  { option: 'B', name: 'resource-cover-1.svg', src: '/inline/concept-b/resource-cover-1.svg', usedIn: 'Resource cover · Bitcoin seizure', note: 'Extracted from the Concept B prototype HTML.' },
  { option: 'B', name: 'resource-cover-2.svg', src: '/inline/concept-b/resource-cover-2.svg', usedIn: 'Resource cover · FCA order', note: 'Extracted from the Concept B prototype HTML.' },
  { option: 'B', name: 'resource-cover-3.svg', src: '/inline/concept-b/resource-cover-3.svg', usedIn: 'Resource cover · Policy briefing', note: 'Extracted from the Concept B prototype HTML.' },
  { option: 'C', name: 'logo-lockup.svg', src: '/inline/concept-c/logo-lockup.svg', usedIn: 'Nav logo lockup (Command)', note: 'Extracted from the Concept C prototype HTML.', dark: true },
];

/** All assets for a given option, grouped by kind. Empty groups are omitted at render. */
export function assetsForOption(option: ConceptOption) {
  return {
    aura: auraEmbeds.filter((a) => a.option === option),
    images: imageAssets.filter((a) => a.option === option),
    logos: logoAssets.filter((a) => a.option === option),
    icons: iconAssets.filter((a) => a.option === option),
    illustrations: illustrationAssets.filter((a) => a.option === option),
    inline: inlineSvgAssets.filter((a) => a.option === option),
  };
}

/** Total asset count for an option (used for the per-option fact strip). */
export function countForOption(option: ConceptOption): number {
  const g = assetsForOption(option);
  return (
    g.aura.length +
    g.images.length +
    g.logos.length +
    g.icons.length +
    g.illustrations.length +
    g.inline.length
  );
}
