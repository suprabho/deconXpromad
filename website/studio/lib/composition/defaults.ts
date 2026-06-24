/**
 * Default content for a fresh composition, plus per-foreground-type default
 * content used when the inspector switches the foreground component.
 *
 * Sample case / timeline data mirrors the worked example in deconflict-ui-guide.md.
 */
import type {
  AlertData,
  AppHeaderData,
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
  NavTreeData,
  SecureChatData,
  SidebarData,
  TimelineData,
} from './types';
import { DEFAULT_FINGERPRINT, DEFAULT_PATTERN, DEFAULT_SIZE_ID, DEFAULT_TRANSFORM } from './types';

export const SAMPLE_LEFT_CASE: CaseData = {
  title: 'LAW ENFORCEMENT CASE',
  subtitle: 'FBI · Field Office 14 · Case #LE-2024-08821',
  icon: 'shield-star',
  subjectName: 'Jonathan A. Reyes',
  walletAddress: 'bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq',
  transactionId: 'TX-8842-0091-4471',
  dateOpened: 'April 5, 2024',
  riskTier: 'High',
};

export const SAMPLE_RIGHT_CASE: CaseData = {
  title: 'FINANCIAL INSTITUTION CASE',
  subtitle: 'Meridian Bank · AML Unit · Case #FI-2024-3390',
  icon: 'bank',
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
  { icon: 'logo-fbi', title: 'Federal Bureau of Investigation', subtitle: 'Originating agency · #LE-2024-08821', meta: '18 entries' },
  { icon: 'logo-interpol', title: 'INTERPOL', subtitle: 'Red Notice linked · cross-border alert', meta: '12 entries' },
  { icon: 'logo-hsbc', title: 'HSBC', subtitle: 'Financial institution · AML alert linked', meta: '15 entries' },
  { icon: 'logo-chainalysis', title: 'Chainalysis', subtitle: 'On-chain analytics · wallet cluster flagged', meta: '23 entries' },
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

/** Shared shell sample data — reused standalone AND composed inside WorkspaceLayout. */
export const SAMPLE_SIDEBAR: SidebarData = {
  brandName: 'Deconflict',
  brandMark: 'shield-check',
  items: [
    { id: 'overview', label: 'Overview', icon: 'graph', active: true, section: '' },
    { id: 'cases', label: 'Cases', icon: 'briefcase', active: false, section: '' },
    { id: 'entities', label: 'Entities', icon: 'user', active: false, section: '' },
    { id: 'wallets', label: 'Wallets', icon: 'wallet', active: false, section: 'Intelligence' },
    { id: 'connectors', label: 'Connectors', icon: 'link', active: false, section: '' },
    { id: 'watchlist', label: 'Watch lists', icon: 'binoculars', active: false, section: '' },
  ],
};

export const SAMPLE_NAV_TREE: NavTreeData = {
  title: 'Field Mapping',
  activeId: 'columns',
  expandedIds: ['entity-graph', 'watch-lists'],
  nodes: [
    {
      id: 'entity-graph',
      label: 'Entity Graph',
      icon: 'none',
      done: true,
      children: [
        { id: 'sources', label: 'Sources', icon: 'none', done: true, children: [] },
        { id: 'columns', label: 'Columns', icon: 'none', done: false, children: [] },
      ],
    },
    {
      id: 'watch-lists',
      label: 'Watch Lists',
      icon: 'none',
      done: false,
      children: [
        { id: 'field-mapping', label: 'Field Mapping', icon: 'none', done: false, children: [] },
      ],
    },
    { id: 'review', label: 'Review', icon: 'none', done: false, children: [] },
  ],
};

export const SAMPLE_APP_HEADER: AppHeaderData = {
  brandName: 'Deconflict',
  brandMark: 'shield-check',
  searchPlaceholder: 'Search cases, wallets, people…',
  actions: ['magnifying-glass', 'share', 'user'],
  avatarName: 'Dana Okafor',
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
      return { type: 'ConnectorNode', matches: 3, leftConnections: 3, rightConnections: 3 };
    case 'ActivityTimeline':
      return { type: 'ActivityTimeline', ...structuredClone(SAMPLE_TIMELINE) };
    case 'Pattern':
      return { type: 'Pattern', ...DEFAULT_PATTERN };
    case 'Fingerprint':
      return { type: 'Fingerprint', ...DEFAULT_FINGERPRINT };
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
        groupLabel: 'Linked organisations',
        rows: structuredClone(SAMPLE_COMMAND_ROWS),
      };
    case 'DonutChart':
      return { type: 'DonutChart', ...structuredClone(SAMPLE_DONUT) };
    case 'GaugeArc':
      return { type: 'GaugeArc', ...structuredClone(SAMPLE_GAUGE) };
    case 'SecureChat':
      return { type: 'SecureChat', ...structuredClone(SAMPLE_SECURE_CHAT) };

    /* ----------------------------- analytics ----------------------------- */
    case 'ActivityFeed':
      return {
        type: 'ActivityFeed',
        title: 'Recent activity',
        items: [
          { id: 'a1', tone: 'alert', title: 'Overlap detected · LE-08821', description: 'Shared wallet with AML alert FI-3390', time: '2m', pulse: true },
          { id: 'a2', tone: 'ok', title: 'Match cleared', description: 'Subject ruled out after cross-check', time: '18m', pulse: false },
          { id: 'a3', tone: 'info', title: 'Connector synced', description: 'Chainalysis · 23 new entries', time: '1h', pulse: false },
          { id: 'a4', tone: 'warn', title: 'Manual review queued', description: 'Apex Holdings flagged for triage', time: '3h', pulse: false },
        ],
      };
    case 'AreaChart':
      return {
        type: 'AreaChart',
        title: 'Match volume',
        data: [12, 18, 15, 24, 22, 30, 28, 36],
        compare: [8, 10, 12, 11, 16, 18, 17, 21],
        tone: 'fi',
        ticks: ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'],
        smooth: true,
      };
    case 'BarChart':
      return {
        type: 'BarChart',
        title: 'Cases by jurisdiction',
        bars: [
          { value: 24, label: 'US', highlight: false },
          { value: 18, label: 'EU', highlight: false },
          { value: 31, label: 'UK', highlight: true },
          { value: 12, label: 'APAC', highlight: false },
          { value: 9, label: 'LATAM', highlight: false },
        ],
        tone: 'fi',
        highlightTone: 'match',
        showLabels: true,
      };
    case 'DistributionBar':
      return {
        type: 'DistributionBar',
        title: 'Pipeline mix',
        segments: [
          { label: 'Cleared', value: 184, tone: 'ok' },
          { label: 'Investigating', value: 72, tone: 'fi' },
          { label: 'Triage', value: 38, tone: 'match' },
          { label: 'Escalated', value: 18, tone: 'alert' },
        ],
        showPercent: true,
        legend: true,
      };
    case 'Heatmap':
      return {
        type: 'Heatmap',
        title: 'Activity heatmap',
        values: [
          0, 1, 2, 0, 3, 1, 0, 2, 4, 1, 0, 3, 2, 1, 0, 1, 3, 2, 4, 0, 1, 2, 0, 1,
          3, 0, 2, 4, 1, 0, 2, 3, 1, 0, 4, 2, 1, 3, 0, 2, 1, 0, 3, 2, 1, 4, 0, 2,
        ],
        columns: 7,
        rows: 7,
        tone: 'fi',
        rowLabels: ['M', '', 'W', '', 'F', '', 'S'],
        legend: true,
      };
    case 'KpiTile':
      return { type: 'KpiTile', label: 'Active matches', value: '312', hint: '+8% vs last week', tone: 'solid' };
    case 'RankList':
      return {
        type: 'RankList',
        title: 'Top exposures',
        items: [
          { label: 'Apex Holdings', value: 92, display: '$4.2M', sub: 'Wire fraud cluster', tone: 'fi' },
          { label: 'Meridian Bank', value: 71, display: '$3.1M', sub: 'AML alerts linked', tone: 'fi' },
          { label: 'Castle Trust', value: 48, display: '$1.8M', sub: 'Pending review', tone: 'match' },
          { label: 'Vertex LLC', value: 30, display: '$0.9M', sub: 'Cleared', tone: 'ok' },
        ],
        tone: 'fi',
        showRank: true,
        showBar: true,
      };
    case 'Sparkline':
      return { type: 'Sparkline', title: 'Throughput', data: [4, 6, 5, 9, 7, 12, 10, 14], tone: 'fi', smooth: true, endDot: true };
    case 'Delta':
      return { type: 'Delta', value: 12.4, suffix: '%', invert: false, tone: 'auto' };
    case 'MetricPanel':
      return {
        type: 'MetricPanel',
        title: 'Detection rate',
        figureValue: '94.2%',
        figureCaption: 'Confirmed overlaps caught before escalation',
        spark: [60, 64, 62, 70, 74, 80, 88, 94],
        bars: [12, 18, 14, 22, 26, 30],
      };
    case 'DataTable':
      return {
        type: 'DataTable',
        title: 'Case records',
        columns: [
          { key: 'id', header: 'Case', align: 'left' },
          { key: 'subject', header: 'Subject', align: 'left' },
          { key: 'risk', header: 'Risk', align: 'left' },
          { key: 'amount', header: 'Amount', align: 'right' },
        ],
        rows: [
          ['LE-08821', 'J. Reyes', 'High', '$4.2M'],
          ['FI-3390', 'Withheld', 'Medium', '$3.1M'],
          ['LE-08824', 'A. Castro', 'Low', '$0.4M'],
          ['FI-3402', 'Apex Holdings', 'High', '$1.8M'],
        ],
        zebra: true,
      };

    /* ------------------------------- board ------------------------------- */
    case 'Board':
      return {
        type: 'Board',
        columns: [
          {
            id: 'c1',
            title: 'Triage',
            count: 2,
            tone: 'warn',
            cards: [
              { title: 'Apex Holdings', subtitle: 'Verifying processing', status: 'In review', statusTone: 'warn', accent: 'warn', flagged: true, leading: 'briefcase' },
              { title: 'Vertex LLC', subtitle: 'Awaiting KYC', status: 'Queued', statusTone: 'idle', accent: 'idle', flagged: false, leading: 'buildings' },
            ],
          },
          {
            id: 'c2',
            title: 'Investigating',
            count: 1,
            tone: 'info',
            cards: [
              { title: 'Meridian Bank', subtitle: 'AML alert linked', status: 'Active', statusTone: 'info', accent: 'info', flagged: false, leading: 'bank' },
            ],
          },
          {
            id: 'c3',
            title: 'Cleared',
            count: 1,
            tone: 'ok',
            cards: [
              { title: 'Castle Trust', subtitle: 'Ruled out', status: 'Cleared', statusTone: 'ok', accent: 'ok', flagged: false, leading: 'shield-check' },
            ],
          },
        ],
      };
    case 'Breadcrumb':
      return {
        type: 'Breadcrumb',
        items: [
          { label: 'Workspace', href: '#' },
          { label: 'Field Setting', href: '#' },
          { label: 'Columns', href: '' },
        ],
        showBack: true,
      };
    case 'ConnectorCard':
      return {
        type: 'ConnectorCard',
        name: 'HSBC',
        descriptor: 'Linked Connectivity',
        icon: 'bank',
        status: 'Synced',
        statusTone: 'ok',
        pulse: true,
      };
    case 'PageHeader':
      return {
        type: 'PageHeader',
        eyebrow: 'Workflow board',
        title: 'Field Setting',
        description: 'Map institution fields to the shared deconfliction schema.',
        tabs: [
          { value: 'columns', label: 'Columns', count: 4 },
          { value: 'rules', label: 'Rules', count: 12 },
          { value: 'history', label: 'History', count: -1 },
        ],
        activeTab: 'columns',
        primaryAction: 'Connect',
      };

    /* ------------------------------- shell ------------------------------- */
    case 'NavTree':
      return { type: 'NavTree', ...structuredClone(SAMPLE_NAV_TREE) };
    case 'EntityList':
      return {
        type: 'EntityList',
        title: 'Linked entities',
        items: [
          { id: 'e1', label: 'Jonathan A. Reyes', tone: 'alert', score: 92, meta: '' },
          { id: 'e2', label: 'Apex Holdings', tone: 'warn', score: 71, meta: '' },
          { id: 'e3', label: 'Meridian Bank', tone: 'info', score: 58, meta: '' },
          { id: 'e4', label: 'Castle Trust', tone: 'ok', score: 34, meta: '' },
        ],
        selectedId: 'e1',
        numbered: true,
      };
    case 'Sidebar':
      return { type: 'Sidebar', ...structuredClone(SAMPLE_SIDEBAR) };
    case 'AppHeader':
      return { type: 'AppHeader', ...structuredClone(SAMPLE_APP_HEADER) };
    case 'Toolbar':
      return {
        type: 'Toolbar',
        selects: [
          { value: 'All cases', icon: 'flag' },
          { value: 'High risk', icon: 'scales' },
        ],
        searchPlaceholder: 'Search entities…',
        buttons: [
          { label: 'AI Search', variant: 'secondary', icon: 'magnifying-glass' },
          { label: 'Connect', variant: 'primary', icon: 'link' },
        ],
      };
    case 'Panel':
      return {
        type: 'Panel',
        title: 'Entity Graph',
        icon: 'graph',
        body: 'A radial map of every entity linked to the active case, weighted by match confidence.',
        footer: '16 entities · 3 flagged',
      };
    case 'WorkspaceLayout':
      return {
        type: 'WorkspaceLayout',
        rail: structuredClone(SAMPLE_SIDEBAR),
        nav: structuredClone(SAMPLE_NAV_TREE),
        header: structuredClone(SAMPLE_APP_HEADER),
        panel: {
          title: 'Entity Graph',
          icon: 'graph',
          body: 'A radial map of every entity linked to the active case, weighted by match confidence.',
          footer: '16 entities · 3 flagged',
        },
      };

    /* ---------------------------- primitives ----------------------------- */
    case 'Avatar':
      return { type: 'Avatar', name: 'Dana Okafor', src: '', size: 'lg', presence: 'ok' };
    case 'Badge':
      return { type: 'Badge', text: '15 entries', tone: 'info', variant: 'soft', icon: 'none' };
    case 'Button':
      return { type: 'Button', label: 'Connect', variant: 'primary', size: 'md', leftIcon: 'link', rightIcon: 'none', fullWidth: false };
    case 'IconButton':
      return { type: 'IconButton', icon: 'share', label: 'Share', size: 'md', variant: 'frost', badge: -1, active: false };
    case 'PageDots':
      return { type: 'PageDots', count: 5, active: 1 };
    case 'ProgressBar':
      return { type: 'ProgressBar', value: 72, tone: 'fi', size: 'md', showValue: true, label: 'Match confidence' };
    case 'SearchInput':
      return { type: 'SearchInput', placeholder: 'Search cases, wallets, people…', value: '', size: 'lg', kbdHint: '⌘K' };
    case 'SegmentedControl':
      return {
        type: 'SegmentedControl',
        segments: [
          { value: 'all', label: 'All' },
          { value: 'confirmed', label: 'Confirmed' },
          { value: 'filtered', label: 'Filtered' },
        ],
        value: 'confirmed',
        size: 'md',
      };
    case 'Select':
      return { type: 'Select', value: 'High risk', placeholder: 'Filter', leftIcon: 'scales', size: 'md', active: false };
    case 'StatusBadge':
      return { type: 'StatusBadge', label: 'Active', tone: 'ok', caret: true, pulse: true };
    case 'StatusDot':
      return { type: 'StatusDot', tone: 'alert', size: 'lg', pulse: true, label: 'alert status' };
    case 'Tabs':
      return {
        type: 'Tabs',
        tabs: [
          { value: 'columns', label: 'Columns', count: 4 },
          { value: 'rules', label: 'Rules', count: 12 },
          { value: 'history', label: 'History', count: -1 },
        ],
        value: 'columns',
      };
    case 'WindowChrome':
      return { type: 'WindowChrome', title: 'api/deconflict.ts', tone: 'dark' };
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
