import {
  ArrowsClockwiseIcon,
  BankIcon,
  ChartLineUpIcon,
  ClockCounterClockwiseIcon,
  DotsThreeIcon,
  ExportIcon,
  FunnelIcon,
  GavelIcon,
  ScalesIcon,
  ShareNetworkIcon,
  WarningOctagonIcon,
} from '@phosphor-icons/react/dist/ssr';

import {
  ActivityFeed,
  AreaChart,
  Avatar,
  Badge,
  BarChart,
  Button,
  DataTable,
  Delta,
  DistributionBar,
  DonutChart,
  GaugeArc,
  Heatmap,
  IconButton,
  KpiTile,
  MetricFigure,
  MetricPanel,
  PageHeader,
  Panel,
  RankList,
  SegmentedControl,
  Sparkline,
  StatCard,
  type Column,
  type FeedItem,
  type RankItem,
} from '@/components/app';
import { RiskPill } from '@/components/deconflict/RiskPill';

/* -------------------------------------------------------------------------- *
 * Consolidated dashboard — every analytics widget composed into one operational
 * "Command Dashboard" for the Deconflict wealth-&-risk domain. Route: /dashboard.
 * Pure server tree (AreaChart SSRs as a client island); all data is static.
 * -------------------------------------------------------------------------- */

type CaseRow = {
  id: string;
  subject: string;
  exposure: string;
  risk: 'High' | 'Medium' | 'Low';
  trend: number[];
  delta: number;
};

const CASES: CaseRow[] = [
  { id: 'LE-08821', subject: 'Apex Holdings', exposure: '$1,284,500', risk: 'High', trend: [4, 6, 5, 9, 7, 12, 10], delta: 18.4 },
  { id: 'LE-08822', subject: 'J. Doe', exposure: '$642,100', risk: 'High', trend: [8, 7, 9, 6, 8, 7, 9], delta: 4.1 },
  { id: 'FI-10233', subject: 'Meridian Bank', exposure: '$318,900', risk: 'Medium', trend: [3, 4, 4, 5, 4, 6, 5], delta: -2.3 },
  { id: 'FI-10234', subject: 'Shell Corp 14', exposure: '$96,400', risk: 'Low', trend: [2, 2, 3, 2, 3, 3, 4], delta: 1.2 },
  { id: 'FI-10235', subject: 'Northwind Trust', exposure: '$58,200', risk: 'Low', trend: [1, 2, 2, 3, 2, 3, 3], delta: -0.6 },
];

const CASE_COLUMNS: Column<CaseRow>[] = [
  { key: 'id', header: 'Case', render: (r) => <span className="font-mono text-xs text-ink">{r.id}</span>, width: 'w-24' },
  { key: 'subject', header: 'Subject', render: (r) => <span className="font-medium">{r.subject}</span> },
  { key: 'exposure', header: 'Exposure', align: 'right', render: (r) => <span className="tabular-nums">{r.exposure}</span> },
  { key: 'risk', header: 'Risk', render: (r) => <RiskPill tier={r.risk} /> },
  { key: 'trend', header: '7d', render: (r) => <Sparkline data={r.trend} className="w-20" tone="fi" />, width: 'w-24' },
  { key: 'delta', header: 'Δ', align: 'right', render: (r) => <Delta value={r.delta} invert />, width: 'w-20' },
];

const TOP_EXPOSURES: RankItem[] = [
  { label: 'Apex Holdings LLC', sub: 'LE-08821 · wire fraud', value: 1284, display: '$1.28M', tone: 'alert', leading: <Avatar name="Apex Holdings" size="sm" /> },
  { label: 'J. Doe', sub: 'LE-08822 · subject', value: 642, display: '$642K', tone: 'alert', leading: <Avatar name="John Doe" size="sm" /> },
  { label: 'Meridian Bank', sub: 'FI-10233 · AML alert', value: 319, display: '$319K', tone: 'match', leading: <Avatar name="Meridian Bank" size="sm" /> },
  { label: 'Shell Corp 14', sub: 'FI-10234 · registry', value: 96, display: '$96K', tone: 'fi', leading: <Avatar name="Shell Corp" size="sm" /> },
  { label: 'Northwind Trust', sub: 'FI-10235 · custody', value: 58, display: '$58K', tone: 'fi', leading: <Avatar name="Northwind Trust" size="sm" /> },
];

const ACTIVITY: FeedItem[] = [
  { id: 'a1', tone: 'alert', pulse: true, title: 'Overlap detected — Apex Holdings', description: 'Confidence 0.91 · shared beneficiary with LE-08822', time: '2m' },
  { id: 'a2', tone: 'info', title: 'J. Doe entity graph expanded', description: '3 new linked wallets surfaced', time: '21m' },
  { id: 'a3', tone: 'ok', title: 'Case LE-08110 cleared', description: 'Reconciled — no remaining exposure', time: '1h' },
  { id: 'a4', tone: 'warn', title: 'Chainalysis feed delayed', description: 'On-chain sync 14m behind', time: '2h' },
  { id: 'a5', tone: 'info', title: 'Meridian Bank connector synced', description: '1,204 records reconciled', time: '4h' },
];

/* Detection volume, deterministic 12-week × 7-day intensity grid (no randomness
 * so server and client render identically). Trends up with quieter weekends. */
const HEAT_WEEKS = 12;
const HEAT_DAYS = 7;
const HEATMAP = Array.from({ length: HEAT_WEEKS * HEAT_DAYS }, (_, i) => {
  const col = Math.floor(i / HEAT_DAYS);
  const row = i % HEAT_DAYS;
  const weekend = row >= 5 ? 0.3 : 1;
  const wave = Math.sin((col / HEAT_WEEKS) * Math.PI * 1.5) * 0.5 + 0.7;
  const jitter = ((col * 7 + row * 3) % 5) / 4;
  return Math.round(weekend * (3 + wave * 9 + jitter * 4));
});

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-frost px-6 py-10">
      <div className="mx-auto max-w-6xl space-y-5">
        <PageHeader
          eyebrow={
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-fi">Deconflict</p>
          }
          title="Command Dashboard"
          description="Live exposure, risk and detection signal across every active deconfliction case."
          actions={
            <>
              <SegmentedControl
                value="30d"
                segments={[
                  { value: '7d', label: '7d' },
                  { value: '30d', label: '30d' },
                  { value: '90d', label: '90d' },
                ]}
              />
              <Button variant="secondary" size="sm" leftIcon={<ExportIcon weight="bold" className="h-4 w-4" />}>
                Export
              </Button>
              <IconButton icon={<ClockCounterClockwiseIcon weight="duotone" className="h-5 w-5" />} label="History" variant="frost" />
              <IconButton icon={<DotsThreeIcon weight="bold" className="h-5 w-5" />} label="More" variant="frost" />
            </>
          }
        />

        {/* KPI strip ------------------------------------------------------- */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <KpiTile tone="solid" label="Active cases" value="312" hint="+18 this week" />
          <KpiTile tone="navy" label="Open alerts" value="47" hint="9 high-risk" />
          <KpiTile tone="frost" label="Cleared" value="41,280" hint="last 30 days" />
          <KpiTile tone="frost" label="Exposure" value="$31.8M" hint="at risk" />
        </div>

        {/* Trend + recovery ---------------------------------------------- */}
        <div className="grid gap-4 lg:grid-cols-[1.6fr_1fr]">
          <Panel
            title="Detection Volume"
            icon={<ChartLineUpIcon weight="duotone" className="h-4 w-4" />}
            actions={<Badge tone="info">90 days</Badge>}
          >
            <AreaChart
              data={[12, 18, 9, 22, 16, 28, 19, 34, 24, 30, 22, 38]}
              compare={[8, 12, 10, 14, 11, 18, 13, 20, 16, 19, 15, 24]}
              ticks={['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']}
              height={188}
            />
          </Panel>

          <MetricPanel title="Recovery Trend" action={<Badge tone="ok" variant="solid">+12.4%</Badge>}>
            <div className="flex items-end justify-between">
              <MetricFigure value="$41,280" caption="Recovered this quarter" />
              <MetricFigure value="$31,892" caption="Outstanding" className="text-right" />
            </div>
            <Sparkline data={[12, 18, 14, 22, 19, 28, 24, 33]} tone="white" className="mt-5 h-10" />
            <div className="mt-5 border-t border-white/10 pt-4">
              <BarChart height={84} data={[18, 26, 14, 30, 22, 38, 28].map((v, i) => ({ value: v, highlight: i === 5 }))} />
            </div>
          </MetricPanel>
        </div>

        {/* Composition · risk · pipeline --------------------------------- */}
        <div className="grid gap-4 lg:grid-cols-3">
          <Panel title="Case Composition" icon={<ShareNetworkIcon weight="duotone" className="h-4 w-4" />}>
            <DonutChart
              centerValue="312"
              centerLabel="cases"
              gap={3}
              segments={[
                { label: 'Cleared', value: 184, tone: 'ok' },
                { label: 'Investigating', value: 72, tone: 'fi' },
                { label: 'Triage', value: 38, tone: 'match' },
                { label: 'Escalated', value: 18, tone: 'alert' },
              ]}
            />
          </Panel>

          <Panel title="Composite Risk" icon={<ScalesIcon weight="duotone" className="h-4 w-4" />}>
            <div className="flex h-full items-center justify-center py-2">
              <GaugeArc
                value={68}
                label="risk index"
                thresholds={{ warn: 0.5, alert: 0.75 }}
                caption="Elevated — 9 cases above threshold"
              />
            </div>
          </Panel>

          <Panel title="Pipeline Status" icon={<FunnelIcon weight="duotone" className="h-4 w-4" />}>
            <div className="flex h-full flex-col justify-center gap-4 py-2">
              <DistributionBar
                showPercent={false}
                segments={[
                  { label: 'Triage', value: 38, tone: 'warn' },
                  { label: 'Investigating', value: 72, tone: 'fi' },
                  { label: 'Analysis', value: 44, tone: 'navy' },
                  { label: 'Escalated', value: 18, tone: 'alert' },
                  { label: 'Resolved', value: 140, tone: 'ok' },
                ]}
              />
              <p className="text-xs text-muted">
                312 cases in flight · <span className="font-semibold text-ink">56 awaiting review</span>
              </p>
            </div>
          </Panel>
        </div>

        {/* Top exposures + detection activity ---------------------------- */}
        <div className="grid gap-4 lg:grid-cols-[1fr_1.5fr]">
          <Panel title="Top Exposures" icon={<BankIcon weight="duotone" className="h-4 w-4" />} actions={<Button variant="link">View all</Button>}>
            <RankList items={TOP_EXPOSURES} />
          </Panel>

          <Panel
            title="Detection Activity"
            icon={<WarningOctagonIcon weight="duotone" className="h-4 w-4" />}
            actions={<Badge tone="neutral">12 weeks</Badge>}
          >
            <Heatmap
              values={HEATMAP}
              columns={HEAT_WEEKS}
              tone="fi"
              rowLabels={['', 'Mon', '', 'Wed', '', 'Fri', '']}
              colLabels={[{ col: 0, label: 'Apr' }, { col: 4, label: 'May' }, { col: 8, label: 'Jun' }]}
            />
          </Panel>
        </div>

        {/* Records + activity feed --------------------------------------- */}
        <div className="grid gap-4 lg:grid-cols-[1.6fr_1fr]">
          <Panel title="Case Records" icon={<GavelIcon weight="duotone" className="h-4 w-4" />} actions={<Button variant="link">Export</Button>} bodyClassName="px-2 py-1">
            <DataTable columns={CASE_COLUMNS} rows={CASES} rowKey={(r) => r.id} selectedKey="LE-08821" zebra />
          </Panel>

          <Panel
            title="Recent Activity"
            icon={<ArrowsClockwiseIcon weight="duotone" className="h-4 w-4" />}
            actions={<Badge tone="ok" icon={<span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />}>Live</Badge>}
          >
            <ActivityFeed items={ACTIVITY} />
          </Panel>
        </div>

        {/* Footer stat cards --------------------------------------------- */}
        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard label="Avg. confidence" value="0.87" delta={3.2} icon={<ScalesIcon weight="duotone" className="h-4 w-4" />} spark={[6, 7, 6, 8, 7, 9, 8]} />
          <StatCard label="False positives" value="2.1%" delta={-1.4} deltaInvert icon={<FunnelIcon weight="duotone" className="h-4 w-4" />} spark={[9, 7, 8, 6, 5, 6, 4]} />
          <StatCard tone="dark" label="Active matches" value="312" delta={8.0} icon={<ShareNetworkIcon weight="duotone" className="h-4 w-4" />} spark={[4, 6, 5, 9, 7, 12, 14]} />
        </div>
      </div>
    </main>
  );
}
