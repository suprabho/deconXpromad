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
  KanbanCard: z.object({
    title: z.string(),
    subtitle: z.string(),
    status: z.string().describe('Short status label, e.g. "In review"'),
    statusTone,
    accent: accentTone.describe('Left accent-stripe tone, or "none"'),
    flagged: z.boolean(),
    leading: appIconOpt,
  }),
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
};

export function schemaFor(type: ForegroundType): z.ZodTypeAny | null {
  return SCHEMAS[type] ?? null;
}

/** Foreground types that support AI content generation. */
export function canGenerate(type: ForegroundType): boolean {
  return type in SCHEMAS;
}
