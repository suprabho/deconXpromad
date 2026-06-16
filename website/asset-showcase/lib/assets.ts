/**
 * Catalogue of the visual assets added for the Deconflict homepage exploration —
 * the ambient Aura embeds, raster background images, and the static / animated
 * SVG set. Consumed by app/page.tsx to render this standalone showcase.
 *
 * This app is fully self-contained: every asset has a local copy under
 * /public/{logos,icons,illustrations,images}/ and is referenced from there.
 */

export type AuraEmbed = {
  slug: string;
  title: string;
  url: string;
  usedIn: string;
  note: string;
};

export type ImageAsset = {
  name: string;
  src: string;
  kind: string; // PNG / JPG
  weight: string; // approx file size
  usedIn: string;
  note: string;
  dark?: boolean; // preview needs a dark mat
};

export type SvgAsset = {
  name: string;
  src: string;
  usedIn: string;
  note: string;
  dark?: boolean; // artwork is light-on-dark — preview on navy
  fit?: 'contain' | 'wide'; // wide = full-bleed illustration
};

/** Ambient iframe backgrounds embedded from aura.promad.design. */
export const auraEmbeds: AuraEmbed[] = [
  {
    slug: 'blue-background-images-ethereal-color-blends-for-design',
    title: 'Ethereal colour blends',
    url: 'https://aura.promad.design/embed/blue-background-images-ethereal-color-blends-for-design',
    usedIn: 'Concept B · S1 Hero',
    note: 'Soft drifting cobalt wash behind the hero network canvas — adds depth without competing with the packet simulation in front of it.',
  },
  {
    slug: 'blue-light-backgrounds-clean-professional-web-backdrops',
    title: 'Clean professional backdrop',
    url: 'https://aura.promad.design/embed/blue-light-backgrounds-clean-professional-web-backdrops',
    usedIn: 'Concept B · S2 Platform map',
    note: 'Lighter, calmer field behind the hub-and-spoke platform map so the hairline connectors and capability chips stay legible.',
  },
  {
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
    name: 'nexus-bg.png',
    src: '/images/nexus-bg.png',
    kind: 'PNG',
    weight: '~384 KB',
    usedIn: 'Concept A · NEXUS product panel',
    note: 'Textured engraving field behind the NEXUS half of the dossier diptych.',
    dark: true,
  },
  {
    name: 'signal-bg.png',
    src: '/images/signal-bg.png',
    kind: 'PNG',
    weight: '~464 KB',
    usedIn: 'Concept A · SIGNAL product panel',
    note: 'Companion field behind the SIGNAL half of the diptych.',
    dark: true,
  },
  {
    name: 's3-bg.jpg',
    src: '/images/s3-bg.jpg',
    kind: 'JPG',
    weight: '~258 KB',
    usedIn: 'Concept A · S3 “Why Deconflict” band',
    note: 'Photographic backdrop tinted into the frost band behind the lifecycle story.',
    dark: true,
  },
  {
    name: 'nexus.png',
    src: '/images/nexus.png',
    kind: 'PNG',
    weight: '~797 KB',
    usedIn: 'Concept B · Platform / NEXUS imagery',
    note: 'High-resolution NEXUS coordination render used in the Signal Path platform section.',
    dark: true,
  },
  {
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
    name: 'logomark.svg',
    src: '/logos/logomark.svg',
    usedIn: 'Brand · standalone mark',
    note: 'The Deconflict hexagonal logomark in navy + cobalt — favicons, app tiles, compact lockups.',
  },
  {
    name: 'wordmark-2color.svg',
    src: '/logos/wordmark-2color.svg',
    usedIn: 'Brand · primary wordmark',
    note: 'Full wordmark in the two-colour navy + cobalt treatment. Primary horizontal lockup.',
  },
  {
    name: 'wordmark-1color.svg',
    src: '/logos/wordmark-1color.svg',
    usedIn: 'Brand · mono wordmark',
    note: 'Single-colour navy wordmark for monochrome contexts and reversed-out usage.',
  },
  {
    name: 'deconflict-blue.svg',
    src: '/logos/deconflict-blue.svg',
    usedIn: 'Concept B · nav header',
    note: 'The compact header lockup used in the Signal Path top bar.',
  },
  {
    name: 'wordmark-cream.svg',
    src: '/logos/wordmark-cream.svg',
    usedIn: 'Brand · wordmark on dark',
    note: 'Cream (#F9F5EF) wordmark intended for navy and photographic dark surfaces.',
    dark: true,
  },
];

/** Capability icons — static line-art glyphs (light-on-dark). */
export const iconAssets: SvgAsset[] = [
  { name: 'centralized.svg', src: '/icons/centralized.svg', usedIn: 'Capability · Centralised coordination', note: 'Converging-nodes glyph.', dark: true },
  { name: 'enhanced.svg', src: '/icons/enhanced.svg', usedIn: 'Capability · Enhanced visibility', note: 'Layered-bars glyph.', dark: true },
  { name: 'faster-escalation.svg', src: '/icons/faster-escalation.svg', usedIn: 'Capability · Faster escalation', note: 'Signal-burst glyph.', dark: true },
  { name: 'improved-sar.svg', src: '/icons/improved-sar.svg', usedIn: 'Capability · Improved SAR quality', note: 'Report-lines glyph.', dark: true },
  { name: 'real-time-operational.svg', src: '/icons/real-time-operational.svg', usedIn: 'Capability · Real-time operations', note: 'Live-pulse glyph.', dark: true },
  { name: 'reduced-investigation.svg', src: '/icons/reduced-investigation.svg', usedIn: 'Capability · Reduced investigation time', note: 'Compressed-timeline glyph.', dark: true },
  { name: 'secure-coordination.svg', src: '/icons/secure-coordination.svg', usedIn: 'Capability · Secure coordination', note: 'Shielded-orbit glyph.', dark: true },
];

/** Living illustrations — vector artwork animated in-context inside the prototype. */
export const illustrationAssets: SvgAsset[] = [
  {
    name: 'alerts-to-context.svg',
    src: '/illustrations/alerts-to-context.svg',
    usedIn: 'Concept B · S3 narrative',
    note: 'The alerts→context “living illustration”. Scattered flickering alerts converge through a deconfliction lens and emerge as a connected, verified constellation. Exported here as a static vector; in the prototype a packet travels the full path every 5.5s and the alert nodes flicker (both idle out under prefers-reduced-motion).',
    dark: true,
    fit: 'wide',
  },
];
