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
import type { ForegroundType } from './types';

export const FOREGROUND_OPTIONS: { type: ForegroundType; label: string }[] = [
  { type: 'none', label: 'None' },
  { type: 'CaseCard', label: 'Case Card' },
  { type: 'OverlapAlert', label: 'Overlap Alert' },
  { type: 'RiskPill', label: 'Risk Pill' },
  { type: 'ConnectorNode', label: 'Connector Node' },
  { type: 'ActivityTimeline', label: 'Activity Timeline' },
  { type: 'DeconflictBanner', label: 'Deconflict Banner (full)' },
  { type: 'Pattern', label: 'Pattern Motif' },
  { type: 'FeatureModal', label: 'Feature Modal' },
  { type: 'CommandPalette', label: 'Command Palette' },
  { type: 'EntityGraph', label: 'Entity Graph' },
  { type: 'StatCard', label: 'Stat Card' },
  { type: 'KanbanCard', label: 'Kanban Card' },
  { type: 'CodeWindow', label: 'Code Window' },
  { type: 'DonutChart', label: 'Donut Chart' },
  { type: 'GaugeArc', label: 'Risk Gauge' },
  { type: 'SecureChat', label: 'Secure Chat' },
  // analytics
  { type: 'ActivityFeed', label: 'Activity Feed' },
  { type: 'AreaChart', label: 'Area Chart' },
  { type: 'BarChart', label: 'Bar Chart' },
  { type: 'DistributionBar', label: 'Distribution Bar' },
  { type: 'Heatmap', label: 'Heatmap' },
  { type: 'KpiTile', label: 'KPI Tile' },
  { type: 'RankList', label: 'Rank List' },
  { type: 'Sparkline', label: 'Sparkline' },
  { type: 'Delta', label: 'Delta' },
  { type: 'MetricPanel', label: 'Metric Panel' },
  { type: 'DataTable', label: 'Data Table' },
  // board
  { type: 'Board', label: 'Board (Kanban)' },
  { type: 'Breadcrumb', label: 'Breadcrumb' },
  { type: 'ConnectorCard', label: 'Connector Card' },
  { type: 'PageHeader', label: 'Page Header' },
  // shell
  { type: 'NavTree', label: 'Nav Tree' },
  { type: 'EntityList', label: 'Entity List' },
  { type: 'Sidebar', label: 'Sidebar' },
  { type: 'AppHeader', label: 'App Header' },
  { type: 'Toolbar', label: 'Toolbar' },
  { type: 'Panel', label: 'Panel' },
  { type: 'WorkspaceLayout', label: 'Workspace Layout (full)' },
  // primitives
  { type: 'Avatar', label: 'Avatar' },
  { type: 'Badge', label: 'Badge' },
  { type: 'Button', label: 'Button' },
  { type: 'IconButton', label: 'Icon Button' },
  { type: 'PageDots', label: 'Page Dots' },
  { type: 'ProgressBar', label: 'Progress Bar' },
  { type: 'SearchInput', label: 'Search Input' },
  { type: 'SegmentedControl', label: 'Segmented Control' },
  { type: 'Select', label: 'Select' },
  { type: 'StatusBadge', label: 'Status Badge' },
  { type: 'StatusDot', label: 'Status Dot' },
  { type: 'Tabs', label: 'Tabs' },
  { type: 'WindowChrome', label: 'Window Chrome' },
];

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
