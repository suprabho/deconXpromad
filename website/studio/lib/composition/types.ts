/**
 * The composition schema — a "structured layers" data model (NOT a freeform
 * canvas). A composition is a fixed stack:
 *
 *   background  →  scrim  →  mid graphics  →  one foreground UI component  →  overlay text
 *
 * Placement is preset-driven (position + size buckets), never freeform drag/resize.
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

/** A SizeScale as a fraction of the canvas width (used by mid + foreground). */
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

/* -------------------------------------------------------------------------- *
 * Background layer
 * -------------------------------------------------------------------------- */
export type BackgroundKind = 'aura' | 'image' | 'solid';

export type BackgroundConfig = {
  kind: BackgroundKind;
  /** Aura slug OR a full aura.promad.design URL. */
  auraSlug?: string;
  /** Catalogue src ("/images/…", resolve with assetUrl) or absolute/data URL. */
  imageSrc?: string;
  imageFit?: 'cover' | 'contain';
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
 * Foreground — exactly ONE Deconflict UI component (or none).
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

export type ForegroundType =
  | 'none'
  | 'OverlapAlert'
  | 'RiskPill'
  | 'CaseCard'
  | 'ConnectorNode'
  | 'ActivityTimeline'
  | 'DeconflictBanner';

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
    };

export type ForegroundConfig = {
  content: ForegroundContent;
  position: PositionPreset;
  size: SizeScale;
  /** Frosted panel behind the component for legibility over busy backgrounds. */
  card?: boolean;
};

/* -------------------------------------------------------------------------- *
 * Overlay text + theme
 * -------------------------------------------------------------------------- */
export type OverlayTextConfig = {
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
  foreground: ForegroundConfig;
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
