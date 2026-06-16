/**
 * The composition schema — a "structured layers" data model (NOT a freeform
 * canvas). A composition is a fixed stack:
 *
 *   background  →  scrim  →  mid graphics  →  foreground UI elements  →  overlay text
 *
 * Background, mid graphics and overlay text are preset-placed (position + size
 * buckets). The foreground holds 0..n UI elements, each freely placed, scaled
 * and rotated in 3-D via an absolute Transform (% of canvas, resolution-free).
 *
 * This file is the single contract shared by three surfaces that MUST render
 * identically: the editor preview, the chrome-less /render route, and the
 * Playwright screenshot export. The Deconflict UI components also import the
 * content types (CaseData, CaseReveal, Track, …) from here so there is one
 * definition of each.
 */
import type { CSSProperties } from 'react';

/* -------------------------------------------------------------------------- *
 * Output size presets — export pixels, before the 2× device-scale render.
 * -------------------------------------------------------------------------- */
export type SizePreset = { id: string; label: string; width: number; height: number };

export const SIZE_PRESETS: SizePreset[] = [
  { id: 'og', label: 'OG / LinkedIn — 1200 × 630', width: 1200, height: 630 },
  { id: 'wide', label: 'Wide banner — 1600 × 900', width: 1600, height: 900 },
  { id: 'square', label: 'Square — 1080 × 1080', width: 1080, height: 1080 },
  { id: 'story', label: 'Story / Portrait — 1080 × 1350', width: 1080, height: 1350 },
  { id: 'a-half', label: 'Half-width panel — 800 × 1000', width: 800, height: 1000 },
];

export const DEFAULT_SIZE_ID = 'og';

export function sizeFor(id: string): SizePreset {
  return SIZE_PRESETS.find((s) => s.id === id) ?? SIZE_PRESETS[0];
}

/* -------------------------------------------------------------------------- *
 * Placement presets — no freeform transforms.
 * -------------------------------------------------------------------------- */
export type PositionPreset =
  | 'center'
  | 'top'
  | 'bottom'
  | 'left'
  | 'right'
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right';

export const POSITION_PRESETS: PositionPreset[] = [
  'center',
  'top',
  'bottom',
  'left',
  'right',
  'top-left',
  'top-right',
  'bottom-left',
  'bottom-right',
];

export type SizeScale = 'S' | 'M' | 'L' | 'XL';
export const SIZE_SCALES: SizeScale[] = ['S', 'M', 'L', 'XL'];

/** A SizeScale as a fraction of the canvas width (used by mid graphics + overlay text). */
export const SCALE_FRACTION: Record<SizeScale, number> = {
  S: 0.3,
  M: 0.5,
  L: 0.72,
  XL: 0.92,
};

/**
 * Map a PositionPreset to absolute CSS for an element anchored inside the
 * stage. `gap` is the inset (in px) from the edges for non-centred anchors.
 */
export function placementStyle(pos: PositionPreset, gap = 48): CSSProperties {
  const v: CSSProperties = { position: 'absolute' };
  const top = `${gap}px`;
  const bottom = `${gap}px`;
  const left = `${gap}px`;
  const right = `${gap}px`;
  switch (pos) {
    case 'center':
      return { ...v, top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };
    case 'top':
      return { ...v, top, left: '50%', transform: 'translateX(-50%)' };
    case 'bottom':
      return { ...v, bottom, left: '50%', transform: 'translateX(-50%)' };
    case 'left':
      return { ...v, top: '50%', left, transform: 'translateY(-50%)' };
    case 'right':
      return { ...v, top: '50%', right, transform: 'translateY(-50%)' };
    case 'top-left':
      return { ...v, top, left };
    case 'top-right':
      return { ...v, top, right };
    case 'bottom-left':
      return { ...v, bottom, left };
    case 'bottom-right':
      return { ...v, bottom, right };
  }
}

/** Map a PositionPreset to a CSS `object-position` string (image focal point). */
export function objectPositionFor(pos: PositionPreset): string {
  switch (pos) {
    case 'center':
      return 'center';
    case 'top':
      return 'center top';
    case 'bottom':
      return 'center bottom';
    case 'left':
      return 'left center';
    case 'right':
      return 'right center';
    case 'top-left':
      return 'left top';
    case 'top-right':
      return 'right top';
    case 'bottom-left':
      return 'left bottom';
    case 'bottom-right':
      return 'right bottom';
  }
}

/* -------------------------------------------------------------------------- *
 * Background layer
 * -------------------------------------------------------------------------- */
export type BackgroundKind = 'aura' | 'image' | 'solid';

/** How a raster background fills the frame — the CSS `object-fit` set. */
export type ImageFit = 'cover' | 'contain' | 'fill' | 'none';
export const IMAGE_FITS: ImageFit[] = ['cover', 'contain', 'fill', 'none'];

export type BackgroundConfig = {
  kind: BackgroundKind;
  /** Aura slug OR a full aura.promad.design URL. */
  auraSlug?: string;
  /** Catalogue src ("/images/…", resolve with assetUrl) or absolute/data URL. */
  imageSrc?: string;
  imageFit?: ImageFit;
  /** Focal point (object-position) for cover/contain/none fits; default centre. */
  imageFocus?: PositionPreset;
  /** Solid fill, and the <body> fallback colour behind a loading aura. */
  color?: string;
};

/* -------------------------------------------------------------------------- *
 * Scrim — legibility wash behind the foreground / overlay text.
 * -------------------------------------------------------------------------- */
export type ScrimDirection = 'bottom' | 'top' | 'left' | 'right' | 'radial' | 'full';

export type ScrimConfig = {
  /** 0–1 darkness. 0 = off. */
  amount: number;
  direction: ScrimDirection;
  /** Wash colour (default Deconflict navy). */
  color?: string;
};

/* -------------------------------------------------------------------------- *
 * Mid-ground graphics — 0..n SVG / image asset refs, preset-placed.
 * -------------------------------------------------------------------------- */
export type MidGraphic = {
  id: string;
  /** Catalogue src or absolute/data URL. */
  src: string;
  position: PositionPreset;
  size: SizeScale;
  opacity: number; // 0–1
};

/* -------------------------------------------------------------------------- *
 * Foreground — 0..n Deconflict UI components, each freely transformed.
 * -------------------------------------------------------------------------- */
export type Reveal = 'masked' | 'partial' | 'revealed';
export type RiskTier = 'High' | 'Medium' | 'Low';

/** Mirrors the guide's CaseCard data contract. */
export type CaseData = {
  title: string;
  subtitle: string;
  subjectName: string;
  walletAddress: string;
  transactionId: string;
  dateOpened: string;
  riskTier: RiskTier;
};

/** Per-field reveal states the inspector can toggle on a CaseCard. */
export type CaseReveal = {
  subjectName: Reveal;
  walletAddress: Reveal;
  transactionId: Reveal;
};

export type Segment = { from: string; to: string; faded?: boolean };
export type Track = { label: string; color: string; segments: Segment[] };
export type Tick = { date: string; label: string };
export type TimelineData = { tracks: Track[]; overlaps: string[]; ticks: Tick[] };
export type AlertData = { status: string; detail: string; timestamp: string };

/**
 * FeatureModal content. Icons are stored as string KEYS (not React nodes) so the
 * whole composition stays JSON-serialisable for save/load and the screenshot
 * route; ForegroundLayer maps each key to a Phosphor icon via FEATURE_ICONS.
 */
export type FeatureIconKey =
  | 'shield-check'
  | 'gear'
  | 'handshake'
  | 'currency-dollar'
  | 'lock'
  | 'fingerprint'
  | 'link'
  | 'pulse'
  | 'eye'
  | 'lightning'
  | 'chart';

export const FEATURE_ICON_KEYS: FeatureIconKey[] = [
  'shield-check',
  'gear',
  'handshake',
  'currency-dollar',
  'lock',
  'fingerprint',
  'link',
  'pulse',
  'eye',
  'lightning',
  'chart',
];

export type FeatureTone = 'glass' | 'frost';

export type FeatureItemData = { icon: FeatureIconKey; title: string; description: string };

export type FeatureModalData = {
  /** "glass" = light icons for a dark/colour bg; "frost" = ink on light. */
  tone: FeatureTone;
  /** Show the macOS-style three-dot title bar. */
  chrome: boolean;
  eyebrow: string;
  heading: string;
  description: string;
  items: FeatureItemData[];
};

/* -------------------------------------------------------------------------- *
 * App-screen foregrounds (from components/app). These plates carry icons and
 * tone keys as STRINGS so the whole composition stays JSON-serialisable; the
 * foreground adapters (components/app/foreground) map each key to a node and
 * pass tones straight through — a drift from the component prop unions would
 * surface as a type error there, not silently.
 * -------------------------------------------------------------------------- */

/** Serialisable icon keys shared by the app foreground plates. */
export type AppIconKey =
  | 'shield-check'
  | 'bank'
  | 'buildings'
  | 'user'
  | 'wallet'
  | 'briefcase'
  | 'flag'
  | 'magnifying-glass'
  | 'graph'
  | 'chart'
  | 'currency-dollar'
  | 'scales'
  | 'link'
  | 'binoculars'
  | 'share';

export const APP_ICON_KEYS: AppIconKey[] = [
  'shield-check',
  'bank',
  'buildings',
  'user',
  'wallet',
  'briefcase',
  'flag',
  'magnifying-glass',
  'graph',
  'chart',
  'currency-dollar',
  'scales',
  'link',
  'binoculars',
  'share',
];

/** Mirrors StatusDot's StatusTone. */
export type AppStatusTone = 'ok' | 'info' | 'warn' | 'alert' | 'idle';
/** Mirrors EntityGraph's GraphTone. */
export type AppGraphTone = 'hub' | 'active' | 'match' | 'alert' | 'idle';

/** CodeWindow plate — raw source is highlighted at render. */
export type CodeWindowData = {
  title: string;
  language: string;
  code: string;
  /** 1-based line numbers to tint. */
  highlightLines: number[];
};

export type GraphNodeData = { id: string; ring: 1 | 2; tone: AppGraphTone };
export type EntityGraphData = { hubLabel: string; nodes: GraphNodeData[] };

export type StatCardData = {
  label: string;
  value: string;
  delta: number;
  deltaInvert: boolean;
  tone: 'light' | 'dark';
  /** Icon key, or 'none' to omit the badge. */
  icon: AppIconKey | 'none';
  /** Sparkline series. */
  spark: number[];
};

export type KanbanCardData = {
  title: string;
  subtitle: string;
  status: string;
  statusTone: AppStatusTone;
  /** Left accent stripe tone, or 'none'. */
  accent: AppStatusTone | 'none';
  flagged: boolean;
  /** Leading icon key, or 'none'. */
  leading: AppIconKey | 'none';
};

export type CommandRowData = { icon: AppIconKey; title: string; subtitle: string; meta: string };
export type CommandPaletteData = { query: string; groupLabel: string; rows: CommandRowData[] };

export type ForegroundType =
  | 'none'
  | 'OverlapAlert'
  | 'RiskPill'
  | 'CaseCard'
  | 'ConnectorNode'
  | 'ActivityTimeline'
  | 'DeconflictBanner'
  | 'FeatureModal'
  | 'CodeWindow'
  | 'EntityGraph'
  | 'StatCard'
  | 'KanbanCard'
  | 'CommandPalette';

/** Discriminated union of per-component editable content. */
export type ForegroundContent =
  | { type: 'none' }
  | ({ type: 'OverlapAlert' } & AlertData)
  | { type: 'RiskPill'; tier: RiskTier }
  | { type: 'CaseCard'; data: CaseData; reveal: CaseReveal }
  | { type: 'ConnectorNode'; matches: number }
  | ({ type: 'ActivityTimeline' } & TimelineData)
  | {
      type: 'DeconflictBanner';
      leftCase: CaseData;
      rightCase: CaseData;
      leftReveal: CaseReveal;
      rightReveal: CaseReveal;
      matches: number;
      alert: AlertData;
      timeline: TimelineData;
    }
  | ({ type: 'FeatureModal' } & FeatureModalData)
  | ({ type: 'CodeWindow' } & CodeWindowData)
  | ({ type: 'EntityGraph' } & EntityGraphData)
  | ({ type: 'StatCard' } & StatCardData)
  | ({ type: 'KanbanCard' } & KanbanCardData)
  | ({ type: 'CommandPalette' } & CommandPaletteData);

/* -------------------------------------------------------------------------- *
 * Freeform transform — absolute placement + 3-axis rotation for a foreground
 * element. Resolution-independent: x/y are % of the canvas and scale is a
 * fraction of canvas width, so a composition reads identically at any size.
 * -------------------------------------------------------------------------- */
export type Transform = {
  /** Element CENTRE X, as a % of canvas width (0 = left edge, 50 = centre, 100 = right). */
  x: number;
  /** Element CENTRE Y, as a % of canvas height. */
  y: number;
  /** Element box width as a fraction of canvas width — the size / scale knob. */
  scale: number;
  /** Out-of-plane tilt in degrees (needs perspective to read as 3-D). */
  rotateX: number;
  rotateY: number;
  /** In-plane spin in degrees. */
  rotateZ: number;
  /** Perspective distance in px for the 3-D tilts; smaller = stronger. */
  perspective: number;
};

export const DEFAULT_TRANSFORM: Transform = {
  x: 50,
  y: 50,
  scale: 0.5,
  rotateX: 0,
  rotateY: 0,
  rotateZ: 0,
  perspective: 1200,
};

/**
 * Build the CSS `transform` for a foreground element. `translate(-50%, -50%)`
 * centres the box on (x, y); `perspective()` precedes the rotates — emitted only
 * when a 3-D tilt is set — so the tilt reads correctly.
 */
export function composeTransform(t: Transform): string {
  const parts = ['translate(-50%, -50%)'];
  if (t.perspective > 0 && (t.rotateX !== 0 || t.rotateY !== 0)) {
    parts.push(`perspective(${t.perspective}px)`);
  }
  if (t.rotateX !== 0) parts.push(`rotateX(${t.rotateX}deg)`);
  if (t.rotateY !== 0) parts.push(`rotateY(${t.rotateY}deg)`);
  if (t.rotateZ !== 0) parts.push(`rotateZ(${t.rotateZ}deg)`);
  return parts.join(' ');
}

/** One freely-placed foreground UI element. Array order is z-order (last = top). */
export type ForegroundElement = {
  id: string;
  content: ForegroundContent;
  transform: Transform;
};

/* -------------------------------------------------------------------------- *
 * Overlay text + theme
 * -------------------------------------------------------------------------- */
export type OverlayTextConfig = {
  /** Hide the whole overlay text layer without clearing its content. */
  hidden?: boolean;
  badge?: string;
  title?: string;
  subtitle?: string;
  position: PositionPreset;
  align: 'left' | 'center' | 'right';
  textColor: string;
  accent: string;
  maxWidthScale: SizeScale;
};

/* -------------------------------------------------------------------------- *
 * The whole composition
 * -------------------------------------------------------------------------- */
export type CompositionConfig = {
  version: 1;
  sizeId: string;
  background: BackgroundConfig;
  scrim: ScrimConfig;
  midGraphics: MidGraphic[];
  foreground: ForegroundElement[];
  overlay: OverlayTextConfig;
};

/* -------------------------------------------------------------------------- *
 * Aura embed URL helper (ported from header-studio).
 * -------------------------------------------------------------------------- */
export function auraEmbedUrl(slug: string): string {
  const clean = slug.trim();
  const fromUrl = clean.match(/aura\.promad\.design\/(?:embed|scene|scenes)\/([^?#/]+)/);
  const finalSlug = fromUrl ? fromUrl[1] : clean.replace(/^\/+|\/+$/g, '');
  // Strip the aura's own text + chrome; disable input so it renders as a pure,
  // deterministic background (also what the screenshot needs).
  return `https://aura.promad.design/embed/${finalSlug}?hideText=true&hideIcons=true&input=off`;
}
