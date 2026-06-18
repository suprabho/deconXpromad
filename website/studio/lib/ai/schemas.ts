/**
 * Per-foreground-type Zod schemas — the "fixed schema" the AI generation is
 * constrained to. Each schema mirrors the matching arm of the ForegroundContent
 * union in lib/composition/types.ts: every presentational enum (tones, icons,
 * tiers) is locked to the component's own union so the model can only emit valid
 * values, and the structural shape (tracks/segments, rows, items…) matches what
 * the renderer expects.
 *
 * Schemas describe only the *generatable* payload. Identity / display-state
 * fields the model should NOT invent — element ids, per-field reveal toggles,
 * the transform — are filled in lib/ai/assemble.ts, not here.
 */
import { z } from 'zod';
import { APP_ICON_KEYS, FEATURE_ICON_KEYS, type ForegroundType } from '@/lib/composition/types';

/* ------------------------------- enum helpers ------------------------------ */
const tuple = (a: readonly string[]) => a as unknown as [string, ...string[]];

const riskTier = z.enum(['High', 'Medium', 'Low']);
const appIcon = z.enum(tuple(APP_ICON_KEYS));
const appIconOpt = z.enum(tuple([...APP_ICON_KEYS, 'none']));
const featureIcon = z.enum(tuple(FEATURE_ICON_KEYS));
const statTone = z.enum(['light', 'dark']);
const statusTone = z.enum(['ok', 'info', 'warn', 'alert', 'idle']);
const accentTone = z.enum(['ok', 'info', 'warn', 'alert', 'idle', 'none']);
const graphTone = z.enum(['hub', 'active', 'match', 'alert', 'idle']);
const donutTone = z.enum(['fi', 'match', 'ok', 'alert', 'navy', 'ink', 'muted']);
const gaugeTone = z.enum(['fi', 'match', 'ok', 'warn', 'alert']);
const featureTone = z.enum(['glass', 'frost']);
const chatSide = z.enum(['self', 'peer']);
const chatTrack = z.enum(['fi', 'le']);
const delivery = z.enum(['none', 'sent', 'delivered', 'read']);
const progressTone = z.enum(['fi', 'match', 'ok', 'alert', 'ink']);
const badgeTone = z.enum(['neutral', 'info', 'ok', 'warn', 'alert', 'match']);
const distTone = z.enum(['fi', 'match', 'ok', 'warn', 'alert', 'navy', 'ink', 'muted']);
const heatTone = z.enum(['fi', 'match', 'ok', 'alert']);
const sparkTone = z.enum(['fi', 'match', 'ok', 'alert', 'white']);
const areaTone = z.enum(['fi', 'match', 'ok']);
const barTone = z.enum(['fi', 'match', 'ok', 'white', 'ink']);
const kpiTone = z.enum(['solid', 'navy', 'frost']);
const buttonVariant = z.enum(['primary', 'secondary', 'ghost', 'link', 'danger']);
const buttonSize = z.enum(['sm', 'md', 'lg']);
const avatarSize = z.enum(['xs', 'sm', 'md', 'lg']);
const iconButtonVariant = z.enum(['ghost', 'frost', 'solid']);
const smMd = z.enum(['sm', 'md']);
const cellAlign = z.enum(['left', 'right', 'center']);

/* ----------------------------- reusable shapes ----------------------------- */
const caseData = z.object({
  title: z.string().describe('Short ALL-CAPS case label, e.g. "LAW ENFORCEMENT CASE"'),
  subtitle: z.string().describe('Agency / unit / case-number line, e.g. "FBI · Field Office 14 · Case #LE-2024-08821"'),
  subjectName: z.string().describe('Person or account-holder name (or "withheld")'),
  walletAddress: z.string().describe('A crypto wallet address (bc1… or 0x…)'),
  transactionId: z.string().describe('A transaction id, e.g. "TX-8842-0091-4471"'),
  dateOpened: z.string().describe('Human-readable date, e.g. "April 5, 2024"'),
  riskTier,
});

const alert = z.object({
  status: z.string().describe('Short ALL-CAPS status, e.g. "ACTIVE OVERLAP"'),
  detail: z.string().describe('One-line description of the alert'),
  timestamp: z.string().describe('Human timestamp, e.g. "May 14, 2025 · 10:24 AM EDT"'),
});

const timeline = z.object({
  tracks: z
    .array(
      z.object({
        label: z.string(),
        color: z.string().describe('Hex colour, e.g. "#2563EB"'),
        segments: z.array(
          z.object({
            from: z.string().describe('ISO date YYYY-MM-DD'),
            to: z.string().describe('ISO date YYYY-MM-DD'),
            faded: z.boolean().optional().describe('Render this span muted'),
          }),
        ),
      }),
    )
    .describe('1–3 horizontal tracks (e.g. one per agency)'),
  overlaps: z.array(z.string().describe('ISO date YYYY-MM-DD')).describe('Dates to mark as overlaps'),
  ticks: z.array(z.object({ date: z.string().describe('ISO date YYYY-MM-DD'), label: z.string() })),
});

const kanbanCard = z.object({
  title: z.string(),
  subtitle: z.string(),
  status: z.string().describe('Short status label, e.g. "In review"'),
  statusTone,
  accent: accentTone.describe('Left accent-stripe tone, or "none"'),
  flagged: z.boolean(),
  leading: appIconOpt,
});

const tabItem = z.object({
  value: z.string(),
  label: z.string(),
  count: z.number().int().describe('Count chip; use -1 to omit the count'),
});

// Nav nodes, bounded to two levels (kept non-recursive so the structured-output
// JSON schema has no self-reference). Ids are minted server-side (assemble.ts),
// so the model only supplies the labels / icons / nesting.
const navLeaf = z.object({
  label: z.string(),
  icon: appIconOpt,
  done: z.boolean().describe('Render as a completed/checked step'),
});
const navNode = navLeaf.extend({
  children: z.array(navLeaf).describe('Sub-items; empty array for a leaf'),
});

const sidebar = z.object({
  brandName: z.string(),
  brandMark: appIconOpt,
  items: z
    .array(z.object({ label: z.string(), icon: appIcon, active: z.boolean(), section: z.string().describe('Section heading shown above this item; blank for none') }))
    .describe('4–7 rail items; exactly one active'),
});

const navTree = z.object({
  title: z.string(),
  nodes: z.array(navNode).describe('Top-level nav nodes; nest children 1–2 levels deep'),
});

const appHeader = z.object({
  brandName: z.string(),
  brandMark: appIconOpt,
  searchPlaceholder: z.string(),
  actions: z.array(appIcon).describe('2–4 right-cluster icon-button glyphs'),
  avatarName: z.string(),
});

const panelShape = z.object({
  title: z.string(),
  icon: appIconOpt,
  body: z.string().describe('A sentence or two of body copy'),
  footer: z.string().describe('Footer meta line, e.g. "16 entities · 3 flagged"'),
});

/* --------------------------- per-type generatable -------------------------- */
const SCHEMAS: Partial<Record<ForegroundType, z.ZodTypeAny>> = {
  OverlapAlert: alert,
  RiskPill: z.object({ tier: riskTier }),
  CaseCard: caseData,
  ConnectorNode: z.object({ matches: z.number().int().min(0).describe('Number of matched entities') }),
  ActivityTimeline: timeline,
  DeconflictBanner: z.object({
    leftCase: caseData,
    rightCase: caseData,
    matches: z.number().int().min(0),
    alert,
    timeline,
  }),
  FeatureModal: z.object({
    tone: featureTone.describe('"glass" for a dark/colour bg, "frost" for ink on light'),
    chrome: z.boolean().describe('Show the macOS title-bar dots'),
    eyebrow: z.string(),
    heading: z.string(),
    description: z.string(),
    items: z
      .array(z.object({ icon: featureIcon, title: z.string(), description: z.string() }))
      .describe('3–4 feature items'),
  }),
  CodeWindow: z.object({
    title: z.string().describe('Window/file title, e.g. "api/deconflict.ts"'),
    language: z.string().describe('Short language tag, e.g. "ts"'),
    code: z.string().describe('The full source to display'),
    highlightLines: z.array(z.number().int()).describe('1-based line numbers to tint'),
  }),
  EntityGraph: z.object({
    hubLabel: z.string().describe('Short centre-node label, e.g. "J. Doe"'),
    nodes: z
      .array(z.object({ ring: z.number().int().describe('1 = inner ring, 2 = outer ring'), tone: graphTone }))
      .describe('8–18 surrounding nodes'),
  }),
  StatCard: z.object({
    label: z.string(),
    value: z.string().describe('The headline figure as a string, e.g. "312"'),
    delta: z.number().describe('Percent change, can be negative'),
    deltaInvert: z.boolean().describe('When true, a positive delta is treated as bad (red)'),
    tone: statTone,
    icon: appIconOpt,
    spark: z.array(z.number()).describe('5–8 sparkline values'),
  }),
  KanbanCard: kanbanCard,
  CommandPalette: z.object({
    query: z.string().describe('The typed search query'),
    groupLabel: z.string().describe('Result group heading, e.g. "Cases"'),
    rows: z
      .array(z.object({ icon: appIcon, title: z.string(), subtitle: z.string(), meta: z.string().describe('Right-aligned meta, e.g. "15 entries"') }))
      .describe('3–5 result rows'),
  }),
  DonutChart: z.object({
    title: z.string(),
    centerValue: z.string(),
    centerLabel: z.string(),
    segments: z.array(z.object({ label: z.string(), value: z.number(), tone: donutTone })).describe('3–5 segments'),
  }),
  GaugeArc: z.object({
    title: z.string(),
    value: z.number(),
    min: z.number(),
    max: z.number(),
    unit: z.string().describe('Suffix on the figure, e.g. "%" or ""'),
    label: z.string(),
    caption: z.string(),
    useThresholds: z.boolean(),
    thresholdWarn: z.number().min(0).max(1).describe('Fraction of the range'),
    thresholdAlert: z.number().min(0).max(1).describe('Fraction of the range'),
    tone: gaugeTone,
  }),
  SecureChat: z.object({
    title: z.string(),
    subtitle: z.string().describe('e.g. "Meridian Bank  ⇄  FBI · Field Office 14"'),
    composer: z.boolean().describe('Show the message-composer bar'),
    participants: z
      .array(z.object({ name: z.string(), org: z.string(), side: chatSide, track: chatTrack, online: z.boolean() }))
      .describe('Exactly two parties: one side "self", one side "peer"'),
    items: z
      .array(
        z.object({
          kind: z.enum(['message', 'system', 'day']),
          authorSide: chatSide.optional().describe('For kind="message": which party sent it'),
          body: z.string().optional().describe('For kind="message": the message text'),
          time: z.string().optional().describe('For kind="message": e.g. "10:21"'),
          status: delivery.optional().describe('For kind="message" from self: delivery receipt'),
          label: z.string().optional().describe('For kind="system"/"day": the divider/notice text'),
        }),
      )
      .describe('Conversation in order; open with a "day" then a "system" notice'),
  }),

  /* ----------------------------- analytics ----------------------------- */
  ActivityFeed: z.object({
    title: z.string(),
    items: z
      .array(
        z.object({
          tone: statusTone,
          title: z.string(),
          description: z.string(),
          time: z.string().describe('Relative time, e.g. "2m", "1h", "3d"'),
          pulse: z.boolean().describe('Live pulse dot — true for the newest/active item only'),
        }),
      )
      .describe('3–5 feed entries, newest first'),
  }),
  AreaChart: z.object({
    title: z.string(),
    data: z.array(z.number()).describe('6–10 series values'),
    compare: z.array(z.number()).describe('Faded comparison series of the SAME length as data; empty array for none'),
    tone: areaTone,
    ticks: z.array(z.string()).describe('One x-axis label per data point, e.g. month abbreviations'),
    smooth: z.boolean(),
  }),
  BarChart: z.object({
    title: z.string(),
    bars: z.array(z.object({ value: z.number(), label: z.string(), highlight: z.boolean() })).describe('4–6 bars; highlight at most one'),
    tone: barTone,
    highlightTone: barTone,
    showLabels: z.boolean(),
  }),
  DistributionBar: z.object({
    title: z.string(),
    segments: z.array(z.object({ label: z.string(), value: z.number(), tone: distTone })).describe('3–5 segments'),
    showPercent: z.boolean(),
    legend: z.boolean(),
  }),
  Heatmap: z.object({
    title: z.string(),
    columns: z.number().int().min(3).max(12).describe('Number of columns'),
    rows: z.number().int().min(3).max(10).describe('Number of rows'),
    values: z.array(z.number().min(0).max(4)).describe('Column-major flat series of length columns×rows; each cell 0–4 intensity'),
    tone: heatTone,
    rowLabels: z.array(z.string()).describe('One short label per row (may be blank)'),
    legend: z.boolean(),
  }),
  KpiTile: z.object({
    label: z.string(),
    value: z.string().describe('Headline figure as a string, e.g. "312"'),
    hint: z.string().describe('Sub-line, e.g. "+8% vs last week"'),
    tone: kpiTone,
  }),
  RankList: z.object({
    title: z.string(),
    items: z
      .array(
        z.object({
          label: z.string(),
          value: z.number().min(0).max(100).describe('0–100 magnitude that drives the bar length'),
          display: z.string().describe('Formatted figure on the right, e.g. "$4.2M"; blank to show the raw value'),
          sub: z.string(),
          tone: progressTone,
        }),
      )
      .describe('3–5 items, highest first'),
    tone: progressTone,
    showRank: z.boolean(),
    showBar: z.boolean(),
  }),
  Sparkline: z.object({
    title: z.string(),
    data: z.array(z.number()).describe('6–10 values'),
    tone: sparkTone,
    smooth: z.boolean(),
    endDot: z.boolean(),
  }),
  Delta: z.object({
    value: z.number().describe('Percent change, may be negative'),
    suffix: z.string().describe('Unit suffix, e.g. "%"'),
    invert: z.boolean().describe('When true a positive value is treated as bad (red)'),
    tone: z.enum(['auto', 'on-dark']),
  }),
  MetricPanel: z.object({
    title: z.string(),
    figureValue: z.string().describe('Headline figure, e.g. "94.2%"'),
    figureCaption: z.string(),
    spark: z.array(z.number()).describe('6–10 sparkline values'),
    bars: z.array(z.number()).describe('5–8 mini-bar values'),
  }),
  DataTable: z.object({
    title: z.string(),
    columns: z.array(z.object({ key: z.string(), header: z.string(), align: cellAlign })).describe('3–5 columns'),
    rows: z.array(z.array(z.string())).describe('Row-major cells; each row has EXACTLY one string per column, in column order'),
    zebra: z.boolean(),
  }),

  /* ------------------------------- board ------------------------------- */
  Board: z.object({
    columns: z
      .array(z.object({ title: z.string(), count: z.number().int().min(0), tone: statusTone, cards: z.array(kanbanCard).describe('1–3 cards') }))
      .describe('2–4 columns'),
  }),
  Breadcrumb: z.object({
    items: z.array(z.object({ label: z.string(), href: z.string().describe('"#" for a link, "" for the current page') })).describe('2–4 crumbs; the last is the current page'),
    showBack: z.boolean(),
  }),
  ConnectorCard: z.object({
    name: z.string().describe('Connector / integration name, e.g. "HSBC"'),
    descriptor: z.string(),
    icon: appIconOpt,
    status: z.string().describe('Short status, e.g. "Synced"'),
    statusTone,
    pulse: z.boolean(),
  }),
  PageHeader: z.object({
    eyebrow: z.string(),
    title: z.string(),
    description: z.string(),
    tabs: z.array(tabItem).describe('2–4 tabs'),
    activeTab: z.string().describe('Must equal one of the tab values'),
    primaryAction: z.string().describe('Primary button label; blank for no action'),
  }),

  /* ------------------------------- shell ------------------------------- */
  NavTree: navTree,
  EntityList: z.object({
    title: z.string(),
    items: z
      .array(z.object({ label: z.string(), tone: statusTone, score: z.number().int().min(0).max(100), meta: z.string().describe('Right-aligned meta; blank for none') }))
      .describe('3–6 items, highest score first'),
    numbered: z.boolean(),
  }),
  Sidebar: sidebar,
  AppHeader: appHeader,
  Toolbar: z.object({
    selects: z.array(z.object({ value: z.string(), icon: appIconOpt })).describe('1–3 filter selects'),
    searchPlaceholder: z.string(),
    buttons: z.array(z.object({ label: z.string(), variant: buttonVariant, icon: appIconOpt })).describe('1–3 buttons; the last is usually the primary'),
  }),
  Panel: panelShape,
  WorkspaceLayout: z.object({
    rail: sidebar,
    nav: navTree,
    header: appHeader,
    panel: panelShape,
  }),

  /* ---------------------------- primitives ----------------------------- */
  Avatar: z.object({
    name: z.string(),
    src: z.string().describe('Leave blank to render the initials'),
    size: avatarSize,
    presence: accentTone.describe('Presence dot tone, or "none"'),
  }),
  Badge: z.object({ text: z.string(), tone: badgeTone, variant: z.enum(['soft', 'solid']), icon: appIconOpt }),
  Button: z.object({
    label: z.string(),
    variant: buttonVariant,
    size: buttonSize,
    leftIcon: appIconOpt,
    rightIcon: appIconOpt,
    fullWidth: z.boolean(),
  }),
  IconButton: z.object({
    icon: appIcon,
    label: z.string().describe('Accessible label / tooltip'),
    size: buttonSize,
    variant: iconButtonVariant,
    badge: z.number().int().describe('Notification count; -1 to omit the badge'),
    active: z.boolean(),
  }),
  PageDots: z.object({ count: z.number().int().min(1).max(12), active: z.number().int().min(0).describe('0-based index of the active dot') }),
  ProgressBar: z.object({
    value: z.number().min(0).max(100),
    tone: progressTone,
    size: smMd,
    showValue: z.boolean(),
    label: z.string(),
  }),
  SearchInput: z.object({
    placeholder: z.string(),
    value: z.string().describe('Pre-filled query; blank for empty'),
    size: z.enum(['md', 'lg']),
    kbdHint: z.string().describe('Keyboard hint, e.g. "⌘K"'),
  }),
  SegmentedControl: z.object({
    segments: z.array(z.object({ value: z.string(), label: z.string() })).describe('2–4 segments'),
    value: z.string().describe('Must equal one of the segment values'),
    size: smMd,
  }),
  Select: z.object({
    value: z.string().describe('Current selection label'),
    placeholder: z.string(),
    leftIcon: appIconOpt,
    size: smMd,
    active: z.boolean(),
  }),
  StatusBadge: z.object({ label: z.string(), tone: statusTone, caret: z.boolean(), pulse: z.boolean() }),
  StatusDot: z.object({ tone: statusTone, size: buttonSize, pulse: z.boolean(), label: z.string().describe('Accessible label') }),
  Tabs: z.object({ tabs: z.array(tabItem).describe('2–4 tabs'), value: z.string().describe('Must equal one of the tab values') }),
  WindowChrome: z.object({ title: z.string(), tone: z.enum(['light', 'dark']) }),
};

export function schemaFor(type: ForegroundType): z.ZodTypeAny | null {
  return SCHEMAS[type] ?? null;
}

/** Every foreground type the AI can generate content for (the scene planner's palette). */
export const GENERATABLE_TYPES = Object.keys(SCHEMAS) as ForegroundType[];

/** Foreground types that support AI content generation. */
export function canGenerate(type: ForegroundType): boolean {
  return type in SCHEMAS;
}
