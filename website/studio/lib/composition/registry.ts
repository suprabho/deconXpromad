/**
 * Pick-lists that drive the inspector, derived from the shared asset catalogue.
 * The catalogue `src` values are root-relative; the components resolve them with
 * assetUrl() at render time, so we keep raw `src` here.
 */
import {
  auraEmbeds,
  iconAssets,
  illustrationAssets,
  imageAssets,
  inlineSvgAssets,
  sectionBackgrounds,
} from '@/lib/assets/catalog';
import type { ForegroundType, PatternMotif } from './types';

/**
 * The category a foreground component belongs to, used to cluster the inspector's
 * quick-add buttons. Rendered in this order; `none` carries no group (it isn't a
 * thing you "add", only a state you switch an element to via the Component dropdown).
 */
export const FOREGROUND_GROUP_ORDER = ['Scene', 'Patterns', 'Analytics', 'Board', 'Shell', 'Primitives'] as const;
export type ForegroundGroup = (typeof FOREGROUND_GROUP_ORDER)[number];

/**
 * The foreground "Component" pick-list. Most entries map 1:1 to a
 * {@link ForegroundType}; the Pattern entries additionally carry a `motif` so the
 * picker can offer the security-print generators (Guilloché / Intaglio) as
 * first-class options — both add a `type:'Pattern'` element pre-set to that
 * motif (the inner Motif dropdown can still switch to any other motif after).
 * `group` clusters them into the inspector's quick-add toolbar.
 */
export const FOREGROUND_OPTIONS: { type: ForegroundType; label: string; motif?: PatternMotif; group?: ForegroundGroup }[] = [
  { type: 'none', label: 'None' },
  { type: 'CaseCard', label: 'Case Card', group: 'Scene' },
  { type: 'OverlapAlert', label: 'Overlap Alert', group: 'Scene' },
  { type: 'RiskPill', label: 'Risk Pill', group: 'Scene' },
  { type: 'ConnectorNode', label: 'Connector Node', group: 'Scene' },
  { type: 'ActivityTimeline', label: 'Activity Timeline', group: 'Scene' },
  { type: 'DeconflictBanner', label: 'Deconflict Banner (full)', group: 'Scene' },
  { type: 'Pattern', label: 'Guilloché', motif: 'rosette', group: 'Patterns' },
  { type: 'Pattern', label: 'Intaglio', motif: 'intaglio', group: 'Patterns' },
  { type: 'Pattern', label: 'Case overlap', motif: 'case-overlap', group: 'Patterns' },
  { type: 'Pattern', label: 'Secure exchange', motif: 'secure-exchange', group: 'Patterns' },
  { type: 'Pattern', label: 'Global coverage', motif: 'global-coverage', group: 'Patterns' },
  { type: 'Pattern', label: 'Audit trail', motif: 'audit-trail', group: 'Patterns' },
  { type: 'FeatureModal', label: 'Feature Modal', group: 'Scene' },
  { type: 'CommandPalette', label: 'Command Palette', group: 'Scene' },
  { type: 'EntityGraph', label: 'Entity Graph', group: 'Scene' },
  { type: 'StatCard', label: 'Stat Card', group: 'Scene' },
  { type: 'KanbanCard', label: 'Kanban Card', group: 'Scene' },
  { type: 'CodeWindow', label: 'Code Window', group: 'Scene' },
  { type: 'DonutChart', label: 'Donut Chart', group: 'Scene' },
  { type: 'GaugeArc', label: 'Risk Gauge', group: 'Scene' },
  { type: 'SecureChat', label: 'Secure Chat', group: 'Scene' },
  // analytics
  { type: 'ActivityFeed', label: 'Activity Feed', group: 'Analytics' },
  { type: 'AreaChart', label: 'Area Chart', group: 'Analytics' },
  { type: 'BarChart', label: 'Bar Chart', group: 'Analytics' },
  { type: 'DistributionBar', label: 'Distribution Bar', group: 'Analytics' },
  { type: 'Heatmap', label: 'Heatmap', group: 'Analytics' },
  { type: 'KpiTile', label: 'KPI Tile', group: 'Analytics' },
  { type: 'RankList', label: 'Rank List', group: 'Analytics' },
  { type: 'Sparkline', label: 'Sparkline', group: 'Analytics' },
  { type: 'Delta', label: 'Delta', group: 'Analytics' },
  { type: 'MetricPanel', label: 'Metric Panel', group: 'Analytics' },
  { type: 'DataTable', label: 'Data Table', group: 'Analytics' },
  // board
  { type: 'Board', label: 'Board (Kanban)', group: 'Board' },
  { type: 'Breadcrumb', label: 'Breadcrumb', group: 'Board' },
  { type: 'ConnectorCard', label: 'Connector Card', group: 'Board' },
  { type: 'PageHeader', label: 'Page Header', group: 'Board' },
  // shell
  { type: 'NavTree', label: 'Nav Tree', group: 'Shell' },
  { type: 'EntityList', label: 'Entity List', group: 'Shell' },
  { type: 'Sidebar', label: 'Sidebar', group: 'Shell' },
  { type: 'AppHeader', label: 'App Header', group: 'Shell' },
  { type: 'Toolbar', label: 'Toolbar', group: 'Shell' },
  { type: 'Panel', label: 'Panel', group: 'Shell' },
  { type: 'WorkspaceLayout', label: 'Workspace Layout (full)', group: 'Shell' },
  // primitives
  { type: 'Avatar', label: 'Avatar', group: 'Primitives' },
  { type: 'Badge', label: 'Badge', group: 'Primitives' },
  { type: 'Button', label: 'Button', group: 'Primitives' },
  { type: 'IconButton', label: 'Icon Button', group: 'Primitives' },
  { type: 'PageDots', label: 'Page Dots', group: 'Primitives' },
  { type: 'ProgressBar', label: 'Progress Bar', group: 'Primitives' },
  { type: 'SearchInput', label: 'Search Input', group: 'Primitives' },
  { type: 'SegmentedControl', label: 'Segmented Control', group: 'Primitives' },
  { type: 'Select', label: 'Select', group: 'Primitives' },
  { type: 'StatusBadge', label: 'Status Badge', group: 'Primitives' },
  { type: 'StatusDot', label: 'Status Dot', group: 'Primitives' },
  { type: 'Tabs', label: 'Tabs', group: 'Primitives' },
  { type: 'WindowChrome', label: 'Window Chrome', group: 'Primitives' },
];

/**
 * The picker `value` for a foreground option/element. The Pattern motif presets
 * all share `type:'Pattern'`, so they're keyed `Pattern:<motif>` to stay
 * distinguishable in the <select>; everything else is keyed by its bare type.
 */
export function foregroundOptionKey(type: ForegroundType, motif?: PatternMotif): string {
  if (type !== 'Pattern') return type;
  return `Pattern:${motif ?? 'rosette'}`;
}

/**
 * The foreground options clustered into the inspector's quick-add toolbar: each
 * group is a labelled row of "add this component" buttons. Keyed by the same
 * composite value the Component dropdown uses (see {@link foregroundOptionKey}),
 * so a click can reuse the existing content-for-key builder. `none` is skipped —
 * it has no group and isn't something you add.
 */
export function foregroundAddGroups(): { group: ForegroundGroup; options: { key: string; label: string }[] }[] {
  return FOREGROUND_GROUP_ORDER.map((group) => ({
    group,
    options: FOREGROUND_OPTIONS.filter((o) => o.group === group).map((o) => ({
      key: foregroundOptionKey(o.type, o.motif),
      label: o.label,
    })),
  })).filter((g) => g.options.length > 0);
}

export type AssetOption = { src: string; label: string; group: string };
export type AuraOption = { slug: string; label: string };

/** Aura backgrounds catalogued for the project (custom slugs still allowed). */
export const AURA_OPTIONS: AuraOption[] = auraEmbeds.map((a) => ({
  slug: a.slug,
  label: a.title,
}));

/** Raster + section-render backgrounds, for the "image" background kind. */
export const BACKGROUND_IMAGE_OPTIONS: AssetOption[] = [
  ...sectionBackgrounds.map((b) => ({
    src: b.src,
    label: `${b.title} (section)`,
    group: 'Section backdrops',
  })),
  ...imageAssets.map((a) => ({
    src: a.src,
    label: a.name,
    group: 'Raster plates',
  })),
];

/** SVGs + images selectable as mid-ground graphics. */
export const MID_GRAPHIC_OPTIONS: AssetOption[] = [
  ...iconAssets.map((a) => ({ src: a.src, label: a.name, group: 'Capability icons' })),
  ...illustrationAssets.map((a) => ({ src: a.src, label: a.name, group: 'Illustrations' })),
  ...inlineSvgAssets.map((a) => ({ src: a.src, label: a.name, group: 'Inline SVG' })),
  ...imageAssets.map((a) => ({ src: a.src, label: a.name, group: 'Raster plates' })),
];

/** Group an AssetOption[] by its `group` field into {value,label}[] for a sectioned <select>. */
export function groupOptions(options: AssetOption[]): Record<string, { value: string; label: string }[]> {
  return options.reduce<Record<string, { value: string; label: string }[]>>((acc, o) => {
    (acc[o.group] ??= []).push({ value: o.src, label: o.label });
    return acc;
  }, {});
}
