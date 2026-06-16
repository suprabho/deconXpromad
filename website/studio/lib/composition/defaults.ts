/**
 * Default content for a fresh composition, plus per-foreground-type default
 * content used when the inspector switches the foreground component.
 *
 * Sample case / timeline data mirrors the worked example in deconflict-ui-guide.md.
 */
import type {
  AlertData,
  CaseData,
  CaseReveal,
  CommandRowData,
  CompositionConfig,
  DonutChartData,
  FeatureItemData,
  ForegroundContent,
  ForegroundElement,
  ForegroundType,
  GaugeArcData,
  GraphNodeData,
  SecureChatData,
  TimelineData,
} from './types';
import { DEFAULT_SIZE_ID, DEFAULT_TRANSFORM } from './types';

export const SAMPLE_LEFT_CASE: CaseData = {
  title: 'LAW ENFORCEMENT CASE',
  subtitle: 'FBI · Field Office 14 · Case #LE-2024-08821',
  subjectName: 'Jonathan A. Reyes',
  walletAddress: 'bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq',
  transactionId: 'TX-8842-0091-4471',
  dateOpened: 'April 5, 2024',
  riskTier: 'High',
};

export const SAMPLE_RIGHT_CASE: CaseData = {
  title: 'FINANCIAL INSTITUTION CASE',
  subtitle: 'Meridian Bank · AML Unit · Case #FI-2024-3390',
  subjectName: 'Acct. holder — withheld',
  walletAddress: 'bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq',
  transactionId: 'TX-8842-0091-4471',
  dateOpened: 'April 12, 2024',
  riskTier: 'Medium',
};

/** Subject masked, the matched wallet revealed, the txn id partially shown. */
export const SAMPLE_REVEAL: CaseReveal = {
  subjectName: 'masked',
  walletAddress: 'revealed',
  transactionId: 'partial',
};

export const SAMPLE_ALERT: AlertData = {
  status: 'ACTIVE OVERLAP',
  detail: 'Case Overlap Detected',
  timestamp: 'May 14, 2025 · 10:24 AM EDT',
};

export const SAMPLE_TIMELINE: TimelineData = {
  tracks: [
    {
      label: 'Law Enforcement Case',
      color: '#1A2332',
      segments: [
        { from: '2024-04-05', to: '2024-06-10' },
        { from: '2024-05-01', to: '2024-05-25', faded: true },
      ],
    },
    {
      label: 'Financial Institution Case',
      color: '#2563EB',
      segments: [
        { from: '2024-04-01', to: '2024-04-12', faded: true },
        { from: '2024-04-12', to: '2024-06-20' },
      ],
    },
  ],
  overlaps: ['2024-05-01', '2024-05-12', '2024-06-01'],
  ticks: [
    { date: '2024-04-01', label: 'Apr 1' },
    { date: '2024-04-15', label: 'Apr 15' },
    { date: '2024-05-01', label: 'May 1' },
    { date: '2024-05-12', label: 'May 12' },
    { date: '2024-06-01', label: 'Jun 1' },
    { date: '2024-06-15', label: 'Jun 15' },
    { date: '2024-07-01', label: 'Jul 1' },
  ],
};

/** The four reference capabilities, as serialisable feature items. */
export const SAMPLE_FEATURES: FeatureItemData[] = [
  {
    icon: 'shield-check',
    title: 'Verified',
    description: 'Every match is cryptographically confirmed before it surfaces.',
  },
  {
    icon: 'gear',
    title: 'Automated',
    description: 'Overlap detection runs continuously — no manual cross-checks.',
  },
  {
    icon: 'handshake',
    title: 'Trusted',
    description: 'Agencies stay in control of what each side can reveal.',
  },
  {
    icon: 'currency-dollar',
    title: 'Settled',
    description: 'Financial trails reconcile the moment both records align.',
  },
];

/* ---------------------- app-screen foreground samples --------------------- */

export const SAMPLE_CODE = `// api/deconflict.ts — overlap detection endpoint
import { matchEntities } from "@/lib/match";

export async function POST(req: Request) {
  const { caseId, entities } = await req.json();
  const overlaps = await matchEntities(entities, {
    threshold: 0.82,
    redact: true,
  });

  if (overlaps.length === 0) {
    return Response.json({ status: "clear" });
  }

  return Response.json({
    status: "overlap",
    matches: overlaps.length,
    confidence: overlaps[0].score,
  });
}`;

/** A radial graph: one inner ring (a couple flagged) + a sparse outer ring. */
export const SAMPLE_GRAPH_NODES: GraphNodeData[] = [
  { id: 'a', ring: 1, tone: 'match' },
  { id: 'b', ring: 1, tone: 'idle' },
  { id: 'c', ring: 1, tone: 'idle' },
  { id: 'd', ring: 1, tone: 'alert' },
  { id: 'e', ring: 1, tone: 'idle' },
  { id: 'f', ring: 1, tone: 'active' },
  { id: 'g', ring: 1, tone: 'idle' },
  { id: 'h', ring: 1, tone: 'idle' },
  { id: 'i', ring: 1, tone: 'match' },
  { id: 'j', ring: 1, tone: 'idle' },
  { id: 'r1', ring: 2, tone: 'idle' },
  { id: 'r2', ring: 2, tone: 'idle' },
  { id: 'r3', ring: 2, tone: 'idle' },
  { id: 'r4', ring: 2, tone: 'idle' },
  { id: 'r5', ring: 2, tone: 'idle' },
  { id: 'r6', ring: 2, tone: 'idle' },
];

export const SAMPLE_COMMAND_ROWS: CommandRowData[] = [
  { icon: 'shield-check', title: 'John Doe — wire fraud', subtitle: 'Subject in active investigation', meta: '15 entries' },
  { icon: 'buildings', title: 'FBI · Field Office 14', subtitle: 'Originating agency · #LE-2024-08821', meta: '18 entries' },
  { icon: 'user', title: 'John Doe', subtitle: 'wallet 0x7a3f…c10b · 3 linked accounts', meta: '23 entries' },
  { icon: 'bank', title: 'Meridian Bank', subtitle: 'Financial institution · AML alert linked', meta: '15 entries' },
];

export const SAMPLE_DONUT: DonutChartData = {
  title: 'Case Composition',
  centerValue: '312',
  centerLabel: 'cases',
  segments: [
    { label: 'Cleared', value: 184, tone: 'ok' },
    { label: 'Investigating', value: 72, tone: 'fi' },
    { label: 'Triage', value: 38, tone: 'match' },
    { label: 'Escalated', value: 18, tone: 'alert' },
  ],
};

export const SAMPLE_GAUGE: GaugeArcData = {
  title: 'Composite Risk',
  value: 68,
  min: 0,
  max: 100,
  unit: '',
  label: 'risk index',
  caption: 'Elevated — 9 cases above threshold',
  useThresholds: true,
  thresholdWarn: 0.5,
  thresholdAlert: 0.75,
  tone: 'fi',
};

export const SAMPLE_SECURE_CHAT: SecureChatData = {
  title: 'Cross-institution coordination',
  subtitle: 'Meridian Bank  ⇄  FBI · Field Office 14',
  composer: true,
  participants: [
    { id: 'fi', name: 'Dana Okafor', org: 'Meridian Bank · AML', side: 'self', track: 'fi', online: true },
    { id: 'le', name: 'Agent R. Castillo', org: 'FBI · Field Office 14', side: 'peer', track: 'le', online: true },
  ],
  items: [
    { kind: 'day', id: 'd1', label: 'Today' },
    { kind: 'system', id: 's1', label: 'Secure channel established · keys verified' },
    {
      kind: 'message',
      id: 'm1',
      authorId: 'le',
      body: 'We have an overlap on case LE-08821 — shared wallet with one of your AML alerts.',
      time: '10:18',
      status: 'none',
      attachments: [],
    },
    {
      kind: 'message',
      id: 'm2',
      authorId: 'le',
      body: 'Sending the redacted subject brief for cross-check.',
      time: '10:18',
      status: 'none',
      attachments: [
        { id: 'f1', name: 'subject-brief.pdf', size: '2.4 MB', kind: 'pdf', state: 'encrypted', meta: 'AES-256-GCM' },
      ],
    },
    {
      kind: 'message',
      id: 'm3',
      authorId: 'fi',
      body: 'Confirmed match on our side. Decrypting now.',
      time: '10:21',
      status: 'read',
      attachments: [],
    },
    {
      kind: 'message',
      id: 'm4',
      authorId: 'fi',
      body: 'Reconciliation export attached — 312 rows aligned.',
      time: '10:22',
      status: 'delivered',
      attachments: [
        { id: 'f2', name: 'reconciliation.xlsx', size: '184 KB', kind: 'sheet', state: 'decrypted', meta: '312 rows' },
      ],
    },
  ],
};

/** Default editable content for each foreground component type. */
export function defaultForegroundContent(type: ForegroundType): ForegroundContent {
  switch (type) {
    case 'none':
      return { type: 'none' };
    case 'OverlapAlert':
      return { type: 'OverlapAlert', ...SAMPLE_ALERT };
    case 'RiskPill':
      return { type: 'RiskPill', tier: 'High' };
    case 'CaseCard':
      return { type: 'CaseCard', data: { ...SAMPLE_LEFT_CASE }, reveal: { ...SAMPLE_REVEAL } };
    case 'ConnectorNode':
      return { type: 'ConnectorNode', matches: 3 };
    case 'ActivityTimeline':
      return { type: 'ActivityTimeline', ...structuredClone(SAMPLE_TIMELINE) };
    case 'DeconflictBanner':
      return {
        type: 'DeconflictBanner',
        leftCase: { ...SAMPLE_LEFT_CASE },
        rightCase: { ...SAMPLE_RIGHT_CASE },
        leftReveal: { ...SAMPLE_REVEAL },
        rightReveal: { ...SAMPLE_REVEAL },
        matches: 3,
        alert: { ...SAMPLE_ALERT },
        timeline: structuredClone(SAMPLE_TIMELINE),
      };
    case 'FeatureModal':
      return {
        type: 'FeatureModal',
        tone: 'glass',
        chrome: true,
        eyebrow: 'Why Deconflict',
        heading: 'One signal, four guarantees',
        description:
          'Each case overlap is verified, automated, governed, and reconciled — end to end.',
        items: structuredClone(SAMPLE_FEATURES),
      };
    case 'CodeWindow':
      return {
        type: 'CodeWindow',
        title: 'api/deconflict.ts',
        language: 'ts',
        code: SAMPLE_CODE,
        highlightLines: [11, 12, 13],
      };
    case 'EntityGraph':
      return { type: 'EntityGraph', hubLabel: 'J. Doe', nodes: structuredClone(SAMPLE_GRAPH_NODES) };
    case 'StatCard':
      return {
        type: 'StatCard',
        label: 'Active matches',
        value: '312',
        delta: 8,
        deltaInvert: false,
        tone: 'dark',
        icon: 'share',
        spark: [4, 6, 5, 9, 7, 12, 14],
      };
    case 'KanbanCard':
      return {
        type: 'KanbanCard',
        title: 'Apex Holdings',
        subtitle: 'Verifying processing',
        status: 'In review',
        statusTone: 'warn',
        accent: 'warn',
        flagged: true,
        leading: 'briefcase',
      };
    case 'CommandPalette':
      return {
        type: 'CommandPalette',
        query: 'John Doe · wire fraud',
        groupLabel: 'Cases',
        rows: structuredClone(SAMPLE_COMMAND_ROWS),
      };
    case 'DonutChart':
      return { type: 'DonutChart', ...structuredClone(SAMPLE_DONUT) };
    case 'GaugeArc':
      return { type: 'GaugeArc', ...structuredClone(SAMPLE_GAUGE) };
    case 'SecureChat':
      return { type: 'SecureChat', ...structuredClone(SAMPLE_SECURE_CHAT) };
  }
}

/** A fresh foreground element (new id, default transform) for the inspector's "add". */
export function defaultForegroundElement(type: ForegroundType = 'CaseCard'): ForegroundElement {
  return {
    id: crypto.randomUUID(),
    content: defaultForegroundContent(type),
    transform: { ...DEFAULT_TRANSFORM },
  };
}

export const DEFAULT_COMPOSITION: CompositionConfig = {
  version: 1,
  sizeId: DEFAULT_SIZE_ID,
  background: {
    kind: 'aura',
    auraSlug: 'blue-background-images-ethereal-color-blends-for-design',
    imageFit: 'cover',
    color: '#0D1B3E',
  },
  scrim: { amount: 0.4, direction: 'left', color: '#0D1B3E' },
  midGraphics: [],
  foreground: [
    {
      id: 'fg-default-case',
      content: { type: 'CaseCard', data: { ...SAMPLE_LEFT_CASE }, reveal: { ...SAMPLE_REVEAL } },
      transform: { ...DEFAULT_TRANSFORM, x: 72, y: 50, width: 0.5 },
    },
  ],
  overlay: {
    badge: 'DECONFLICT',
    title: 'Two cases, one wallet.',
    subtitle: 'The overlap, surfaced before jurisdictions collide.',
    position: 'left',
    align: 'left',
    textColor: '#FFFFFF',
    accent: '#9DBDFF',
    maxWidthScale: 'S',
  },
};
