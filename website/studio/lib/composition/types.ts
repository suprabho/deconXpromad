/**
 * The composition schema — a "structured layers" data model (NOT a freeform
 * canvas). A composition is a fixed stack:
 *
 *   background  →  scrim  →  mid graphics  →  foreground UI elements  →  overlay text
 *
 * Background and overlay text are preset-placed (position + size buckets). Mid
 * graphics are freely placed, scaled and rotated in 2-D (an absolute, flat
 * MidTransform). The foreground holds 0..n UI elements, each freely placed,
 * scaled and rotated in 3-D via an absolute Transform (% of canvas,
 * resolution-free).
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
  /** Whole-layer opacity, 0–1 (default 1). Applies to every kind (aura / image / solid). */
  opacity?: number;
  /** Whole-layer gaussian blur in px (default 0). Applies to every kind. */
  blur?: number;
  /** Image-only · `saturate()` multiplier, 1 = unchanged (default 1). */
  imageSaturation?: number;
  /** Image-only · `brightness()` multiplier, 1 = unchanged (default 1). */
  imageBrightness?: number;
  /** Image-only · `contrast()` multiplier, 1 = unchanged (default 1). */
  imageContrast?: number;
  /** Solid fill, and the <body> fallback colour behind a loading aura. */
  color?: string;
};

/**
 * The CSS `filter` for an image background, built from the saturation /
 * brightness / contrast adjustments. Only non-default (≠ 1) terms are emitted,
 * so an untouched image carries no filter at all. Returns undefined when none
 * apply. Shared so the editor preview and the screenshot export stay identical.
 */
export function backgroundImageFilter(bg: BackgroundConfig): string | undefined {
  const parts: string[] = [];
  if (bg.imageSaturation != null && bg.imageSaturation !== 1) parts.push(`saturate(${bg.imageSaturation})`);
  if (bg.imageBrightness != null && bg.imageBrightness !== 1) parts.push(`brightness(${bg.imageBrightness})`);
  if (bg.imageContrast != null && bg.imageContrast !== 1) parts.push(`contrast(${bg.imageContrast})`);
  return parts.length ? parts.join(' ') : undefined;
}

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
 * Mid-ground graphics — 0..n SVG / image asset refs, freely placed in 2-D.
 * -------------------------------------------------------------------------- */

/**
 * A flat (2-D only) transform for a mid-ground graphic: centre position, size
 * and in-plane rotation. Resolution-independent — x/y are % of the canvas and
 * width is a fraction of canvas width — so a graphic reads identically at any
 * export size. Deliberately has NO out-of-plane tilt or perspective: mid
 * graphics stay flat, unlike the foreground's 3-D {@link Transform}.
 */
export type MidTransform = {
  /** Element CENTRE X, as a % of canvas width (0 = left edge, 50 = centre, 100 = right). */
  x: number;
  /** Element CENTRE Y, as a % of canvas height. */
  y: number;
  /** Display width as a fraction of canvas width; height follows the asset's aspect. */
  width: number;
  /** In-plane rotation in degrees. */
  rotation: number;
};

export const DEFAULT_MID_TRANSFORM: MidTransform = {
  x: 50,
  y: 50,
  width: 0.5,
  rotation: 0,
};

/**
 * Build the CSS `transform` for a mid-ground graphic. `translate(-50%, -50%)`
 * centres the box on (x, y); `rotate()` (emitted only when ≠ 0) then spins it in
 * plane. Shared so the editor preview and the screenshot export stay identical.
 */
export function composeMidTransform(t: MidTransform): string {
  const parts = ['translate(-50%, -50%)'];
  if (t.rotation !== 0) parts.push(`rotate(${t.rotation}deg)`);
  return parts.join(' ');
}

export type MidGraphic = {
  id: string;
  /** Catalogue src or absolute/data URL. */
  src: string;
  transform: MidTransform;
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

/** DonutChart plate — a segmented ring; tones are string keys (mirror DonutTone). */
export type AppDonutTone = 'fi' | 'match' | 'ok' | 'alert' | 'navy' | 'ink' | 'muted';
export type DonutSegmentData = { label: string; value: number; tone: AppDonutTone };
export type DonutChartData = {
  /** Header on the wrapping panel. */
  title: string;
  centerValue: string;
  centerLabel: string;
  segments: DonutSegmentData[];
};

/** GaugeArc plate — a single bounded score on a 180° arc (mirror GaugeTone). */
export type AppGaugeTone = 'fi' | 'match' | 'ok' | 'warn' | 'alert';
export type GaugeArcData = {
  title: string;
  value: number;
  min: number;
  max: number;
  /** Suffix on the figure + end labels (e.g. "%" or ""). */
  unit: string;
  label: string;
  caption: string;
  /** When true the arc auto-colours from the thresholds; else it uses `tone`. */
  useThresholds: boolean;
  thresholdWarn: number; // fraction 0..1 of the range
  thresholdAlert: number; // fraction 0..1 of the range
  tone: AppGaugeTone;
};

/**
 * SecureChat plate — a threaded secure-messaging panel. Every node-bearing field
 * (bubble bodies, notice labels, file kinds) is a plain string / string key so
 * the composition stays JSON; ForegroundLayer maps `status: 'none'` → undefined.
 * Keys mirror the messaging component unions (a drift surfaces as a type error
 * in ForegroundLayer's renderContent, where these flow into <SecureChat/>).
 */
export type ChatSideKey = 'self' | 'peer';
export type ChatTrackKey = 'fi' | 'le';
export type DeliveryKey = 'sent' | 'delivered' | 'read';
export type ChatFileKind = 'pdf' | 'doc' | 'sheet' | 'image' | 'archive' | 'data';
export type ChatCipherState = 'encrypted' | 'verifying' | 'decrypted';

export type ChatParticipantData = {
  id: string;
  name: string;
  org: string;
  side: ChatSideKey;
  track: ChatTrackKey;
  online: boolean;
};
export type ChatAttachmentData = {
  id: string;
  name: string;
  size: string;
  kind: ChatFileKind;
  state: ChatCipherState;
  meta: string;
};
export type ChatItemData =
  | {
      kind: 'message';
      id: string;
      authorId: string;
      body: string;
      time: string;
      /** Delivery receipt for self-authored turns; 'none' to omit. */
      status: DeliveryKey | 'none';
      attachments: ChatAttachmentData[];
    }
  | { kind: 'system'; id: string; label: string }
  | { kind: 'day'; id: string; label: string };
export type SecureChatData = {
  title: string;
  subtitle: string;
  composer: boolean;
  participants: ChatParticipantData[];
  items: ChatItemData[];
};

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
  | 'CommandPalette'
  | 'DonutChart'
  | 'GaugeArc'
  | 'SecureChat';

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
  | ({ type: 'CommandPalette' } & CommandPaletteData)
  | ({ type: 'DonutChart' } & DonutChartData)
  | ({ type: 'GaugeArc' } & GaugeArcData)
  | ({ type: 'SecureChat' } & SecureChatData);

/* -------------------------------------------------------------------------- *
 * Freeform transform — absolute placement + sizing + 3-axis rotation for a
 * foreground element. Resolution-independent: x/y are % of the canvas and width
 * is a fraction of canvas width, so a composition reads identically at any size.
 * -------------------------------------------------------------------------- */
export type Transform = {
  /** Element CENTRE X, as a % of canvas width (0 = left edge, 50 = centre, 100 = right). */
  x: number;
  /** Element CENTRE Y, as a % of canvas height. */
  y: number;
  /**
   * Element box width as a fraction of canvas width. This drives layout: the
   * element reflows to fit the chosen width (text wraps, content reflows).
   */
  width: number;
  /**
   * Uniform CSS `scale()` multiplier applied on top of the laid-out box (1 = no
   * scaling). Unlike `width`, this does NOT reflow content — it scales the whole
   * element, pixels and all, like zooming.
   */
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
  width: 0.5,
  scale: 1,
  rotateX: 0,
  rotateY: 0,
  rotateZ: 0,
  perspective: 1200,
};

/**
 * Build the CSS `transform` for a foreground element. `translate(-50%, -50%)`
 * centres the box on (x, y); `scale()` (emitted only when ≠ 1) then zooms the
 * box about its centre; `perspective()` precedes the rotates — emitted only when
 * a 3-D tilt is set — so the tilt reads correctly.
 */
export function composeTransform(t: Transform): string {
  const parts = ['translate(-50%, -50%)'];
  if (t.scale !== 1) parts.push(`scale(${t.scale})`);
  if (t.perspective > 0 && (t.rotateX !== 0 || t.rotateY !== 0)) {
    parts.push(`perspective(${t.perspective}px)`);
  }
  if (t.rotateX !== 0) parts.push(`rotateX(${t.rotateX}deg)`);
  if (t.rotateY !== 0) parts.push(`rotateY(${t.rotateY}deg)`);
  if (t.rotateZ !== 0) parts.push(`rotateZ(${t.rotateZ}deg)`);
  return parts.join(' ');
}

/* -------------------------------------------------------------------------- *
 * Foreground element shadows — 0..n stacked drop-shadows.
 *
 * Rendered with CSS `filter: drop-shadow()` (not `box-shadow`) so each shadow
 * follows the element's actual silhouette — rounded corners, notches and
 * transparent cut-outs — instead of a rectangle around its bounding box. The
 * wrapper has no background of its own, so a box-shadow would float a stray
 * rectangle behind the card; drop-shadow tracks the rendered pixels. drop-shadow
 * has no spread/inset, which is why those knobs are absent.
 * -------------------------------------------------------------------------- */
export type ElementShadow = {
  /** Horizontal offset in px (positive = right). */
  x: number;
  /** Vertical offset in px (positive = down). */
  y: number;
  /** Blur radius in px (0 = hard edge). */
  blur: number;
  /** Shadow colour as a hex string; `opacity` sets its alpha. */
  color: string;
  /** 0–1 alpha applied to `color`. */
  opacity: number;
};

export const DEFAULT_SHADOW: ElementShadow = {
  x: 0,
  y: 18,
  blur: 40,
  color: '#0D1B3E',
  opacity: 0.35,
};

/** A hex colour (#rgb or #rrggbb) + 0–1 alpha → an `rgba(...)` string. */
export function hexToRgba(hex: string, alpha: number): string {
  const h = hex.replace('#', '').trim();
  const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h.padEnd(6, '0').slice(0, 6);
  const n = Number.parseInt(full, 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  const a = Math.max(0, Math.min(1, alpha));
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

/**
 * Build the CSS `filter` for a stack of element shadows — one chained
 * `drop-shadow()` per entry, in array order. Returns undefined when there are
 * none, so an element with no shadows carries no filter. Shared so the editor
 * preview and the screenshot export render identical shadows.
 */
export function composeDropShadow(shadows: ElementShadow[] | undefined): string | undefined {
  if (!shadows || shadows.length === 0) return undefined;
  return shadows
    .map((s) => `drop-shadow(${s.x}px ${s.y}px ${Math.max(0, s.blur)}px ${hexToRgba(s.color, s.opacity)})`)
    .join(' ');
}

/** One freely-placed foreground UI element. Array order is z-order (last = top). */
export type ForegroundElement = {
  id: string;
  content: ForegroundContent;
  transform: Transform;
  /**
   * Glassmorphism overrides for the element's frosted surface. Threaded to the
   * component as the `--glass-tint` / `--glass-blur` CSS custom properties (see
   * the `.glass-tint` / `.glass-surface` classes in globals.css); when a field is
   * undefined the surface keeps its own built-in value.
   */
  glass?: GlassConfig;
  /** 0..n stacked drop-shadows behind the element (default none). */
  shadows?: ElementShadow[];
};

/** Per-element glassmorphism overrides for the frosted surface. */
export type GlassConfig = {
  /** White-fill alpha of the surface, 0–1 (undefined = the component's own tint). */
  tint?: number;
  /** Backdrop blur in px (undefined = the component's own blur). */
  blur?: number;
};

/**
 * The CSS custom properties that carry a GlassConfig down to the frosted
 * surface. Set on the foreground wrapper and inherited by the component, where
 * the `.glass-tint` / `.glass-surface` classes consume them (each with a
 * per-component base fallback). Only defined fields are emitted, so an
 * untouched element inherits nothing and renders with its built-in glass.
 */
export function glassVars(glass: GlassConfig | undefined): Record<string, string> {
  const vars: Record<string, string> = {};
  if (glass?.tint != null) vars['--glass-tint'] = String(glass.tint);
  if (glass?.blur != null) vars['--glass-blur'] = `${glass.blur}px`;
  return vars;
}

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
