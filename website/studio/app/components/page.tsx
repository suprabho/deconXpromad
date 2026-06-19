'use client';

import { useState, type ReactNode } from 'react';
import {
  ArrowUpIcon,
  BankIcon,
  BellIcon,
  BinocularsIcon,
  BriefcaseIcon,
  BuildingsIcon,
  ChartLineUpIcon,
  ClockCounterClockwiseIcon,
  CurrencyDollarIcon,
  DotsThreeIcon,
  FileIcon,
  FlagIcon,
  FolderIcon,
  FunnelIcon,
  GearIcon,
  GraphIcon,
  ListIcon,
  MagnifyingGlassIcon,
  PresentationChartIcon,
  ScalesIcon,
  ShareNetworkIcon,
  ShieldCheckIcon,
  SlidersHorizontalIcon,
  SparkleIcon,
  UsersThreeIcon,
} from '@phosphor-icons/react/dist/ssr';

import {
  AppHeader,
  AreaChart,
  Avatar,
  Badge,
  BarChart,
  Board,
  BoardColumn,
  Breadcrumb,
  Brand,
  Button,
  CommandPalettePanel,
  ConnectorCard,
  DataTable,
  Delta,
  EntityGraph,
  EntityList,
  IconButton,
  KanbanCard,
  KpiTile,
  Kbd,
  MetricFigure,
  MetricPanel,
  NavTree,
  PageDots,
  PageHeader,
  Panel,
  ResultGroup,
  SearchInput,
  SearchResultRow,
  SecureChat,
  SegmentedControl,
  Sidebar,
  SidebarItem,
  SidebarSection,
  Sparkline,
  StatCard,
  Tabs,
  Toolbar,
  ToolbarDivider,
  ToolbarSpacer,
  WorkspaceLayout,
  CodeWindow,
  type Column,
  type GraphNode,
  type ChatItem,
  type ChatAttachment,
  type Participant,
} from '@/components/app';
import { RiskPill } from '@/components/deconflict/RiskPill';

/* -------------------------------------------------------------------------- *
 * Component gallery — the five reference screens rebuilt from the granular
 * '@/components/app' library. Route: /components.
 * -------------------------------------------------------------------------- */

function Section({
  n,
  title,
  caption,
  children,
}: {
  n: number;
  title: string;
  caption: string;
  children: ReactNode;
}) {
  return (
    <section className="space-y-4">
      <div className="flex items-baseline gap-3">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-ink text-xs font-bold text-white">
          {n}
        </span>
        <h2 className="text-lg font-bold tracking-tight text-ink">{title}</h2>
        <p className="text-sm text-muted">{caption}</p>
      </div>
      {children}
    </section>
  );
}

/* --------------------- Command Palette (Screen 2) ------------------------ *
 * Interactive demo: a "Law Enforcement" filter in the meta row scopes the
 * results to law-enforcement sources only (agencies), hiding institutions.
 * -------------------------------------------------------------------------- */

type ResultSource = 'law-enforcement' | 'institution';

type PaletteResult = {
  icon: string;
  title: string;
  subtitle: string;
  meta: string;
  source: ResultSource;
};

const PALETTE_GROUPS: { label: string; results: PaletteResult[] }[] = [
  {
    label: 'Agencies',
    results: [
      {
        icon: '/assets/logos/fbi.png',
        title: 'Federal Bureau of Investigation',
        subtitle: 'Originating agency · case #LE-2024-08821',
        meta: '18 entries',
        source: 'law-enforcement',
      },
      {
        icon: '/assets/logos/interpol.png',
        title: 'INTERPOL',
        subtitle: 'Red Notice linked · cross-border alert',
        meta: '12 entries',
        source: 'law-enforcement',
      },
    ],
  },
  {
    label: 'Institutions',
    results: [
      {
        icon: '/assets/logos/hsbc.png',
        title: 'HSBC',
        subtitle: 'Financial institution · AML alert linked',
        meta: '15 entries',
        source: 'institution',
      },
      {
        icon: '/assets/logos/chainalysis.png',
        title: 'Chainalysis',
        subtitle: 'On-chain analytics · wallet cluster flagged',
        meta: '23 entries',
        source: 'institution',
      },
    ],
  },
];

function CommandPaletteDemo() {
  const [lawEnforcementOnly, setLawEnforcementOnly] = useState(false);

  const groups = PALETTE_GROUPS.map((group) => ({
    ...group,
    results: lawEnforcementOnly
      ? group.results.filter((r) => r.source === 'law-enforcement')
      : group.results,
  })).filter((group) => group.results.length > 0);

  const matchCount = groups.reduce((n, g) => n + g.results.length, 0);

  return (
    <CommandPalettePanel
      className="max-w-xl"
      query="John Doe · wire fraud"
      onQueryChange={() => {}}
      meta={
        <>
          <SegmentedControl
            size="sm"
            value={lawEnforcementOnly ? 'law-enforcement' : 'all'}
            onSelect={(value) => setLawEnforcementOnly(value === 'law-enforcement')}
            segments={[
              { value: 'all', label: 'All sources' },
              {
                value: 'law-enforcement',
                label: 'Law Enforcement',
                icon: <ShieldCheckIcon weight="fill" className="h-3.5 w-3.5" />,
              },
            ]}
          />
          <span className="ml-auto">
            {lawEnforcementOnly
              ? `Only law enforcement · ${matchCount} results`
              : `${matchCount} matches`}
          </span>
        </>
      }
    >
      {groups.map((group, gi) => (
        <ResultGroup
          key={group.label}
          label={group.label}
          action={gi === 0 ? <Button variant="link">See all</Button> : undefined}
        >
          {group.results.map((row, ri) => (
            <SearchResultRow
              key={row.title}
              icon={<img src={row.icon} alt="" className="h-full w-full object-contain" />}
              title={row.title}
              subtitle={row.subtitle}
              meta={row.meta}
              active={gi === 0 && ri === 0}
            />
          ))}
        </ResultGroup>
      ))}
    </CommandPalettePanel>
  );
}

/* ---------------------------- demo data ---------------------------------- */

const GRAPH_NODES: GraphNode[] = [
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
  { id: 'k', ring: 1, tone: 'idle' },
  { id: 'l', ring: 1, tone: 'idle' },
  ...Array.from({ length: 7 }, (_, i) => ({ id: `r2-${i}`, ring: 2 as const, tone: 'idle' as const })),
];

const ENTITIES = [
  { id: '1', label: 'Apex Holdings LLC', tone: 'info' as const, score: 92 },
  { id: '2', label: 'J. Doe (subject)', tone: 'alert' as const, score: 78 },
  { id: '3', label: 'Wallet 0x7a3f…c10b', tone: 'info' as const, score: 64 },
  { id: '4', label: 'Meridian Bank', tone: 'ok' as const, score: 41 },
  { id: '5', label: 'Shell Corp 14', tone: 'idle' as const, score: 23 },
];

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
];

const CASE_COLUMNS: Column<CaseRow>[] = [
  { key: 'id', header: 'Case', render: (r) => <span className="font-mono text-xs text-ink">{r.id}</span>, width: 'w-24' },
  { key: 'subject', header: 'Subject', render: (r) => <span className="font-medium">{r.subject}</span> },
  { key: 'exposure', header: 'Exposure', align: 'right', render: (r) => <span className="tabular-nums">{r.exposure}</span> },
  { key: 'risk', header: 'Risk', render: (r) => <RiskPill tier={r.risk} /> },
  { key: 'trend', header: '7d', render: (r) => <Sparkline data={r.trend} className="w-20" tone="fi" /> , width: 'w-24' },
  { key: 'delta', header: 'Δ', align: 'right', render: (r) => <Delta value={r.delta} invert />, width: 'w-20' },
];

const API_CODE = `// api/deconflict.ts — overlap detection endpoint
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

const CHAT_PARTICIPANTS: Participant[] = [
  { id: 'me', name: 'Riley Chen', org: 'Meridian Bank · Financial Crime', side: 'self', track: 'fi' },
  { id: 'le', name: 'Agent D. Park', org: 'FBI · Field Office 14', side: 'peer', track: 'le', online: true },
];

const CHAT_ITEMS: ChatItem[] = [
  { kind: 'system', id: 's1', label: 'Secure channel established · participant keys verified' },
  { kind: 'day', id: 'd1', label: 'Today' },
  {
    id: 'm1',
    authorId: 'le',
    body: 'Flagging an overlap on subject J. Doe (case LE-2024-08821). Can you confirm exposure on your side?',
    time: '09:14',
  },
  {
    id: 'm2',
    authorId: 'me',
    body: 'Confirmed — three linked accounts, ~$642k moved in the last 30 days. Sending the SAR and the wire trail now.',
    time: '09:21',
    status: 'read',
  },
  {
    id: 'm3',
    authorId: 'me',
    attachments: [
      { id: 'f1', name: 'SAR-2024-0188.pdf', size: '2.4 MB', kind: 'pdf', state: 'encrypted', meta: '12 pages' },
      { id: 'f2', name: 'wire-trail-q2.xlsx', size: '486 KB', kind: 'sheet', state: 'encrypted', meta: '1,204 rows' },
    ],
    time: '09:22',
    status: 'delivered',
  },
  {
    id: 'm4',
    authorId: 'le',
    body: 'Got them — signatures check out. Decrypting the bundle on my end and adding our evidence file.',
    time: '09:24',
  },
  {
    id: 'm5',
    authorId: 'le',
    attachments: [
      { id: 'f3', name: 'evidence-bundle.zip', size: '18.1 MB', kind: 'archive', state: 'verifying', meta: 'AES-256-GCM' },
    ],
    time: '09:25',
  },
];

const CHAT_DRAFT: ChatAttachment[] = [
  { id: 'draft-1', name: 'account-freeze-order.pdf', size: '780 KB', kind: 'pdf', meta: '3 pages' },
];

/* ------------------------------- page ------------------------------------ */

export default function ComponentGalleryPage() {
  return (
    <main className="min-h-screen bg-frost px-6 py-10">
      <div className="mx-auto max-w-6xl space-y-12">
        <header className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-fi">Deconflict</p>
          <h1 className="text-3xl font-bold tracking-tight text-ink">App UI Component Gallery</h1>
          <p className="max-w-2xl text-sm text-muted">
            Granular, glassmorphic components reconstructed from the five product reference screens.
            Import any piece from <code className="rounded bg-ink/5 px-1.5 py-0.5 font-mono text-xs">@/components/app</code>.
          </p>
        </header>

        {/* ---------------------------- Screen 1 ---------------------------- */}
        <Section n={1} title="Workspace Shell" caption="Sidebar · NavTree · AppHeader · Panel · EntityGraph">
          <WorkspaceLayout
            className="shadow-glass"
            rail={
              <Sidebar header={<Brand name="Sentry" mark={<ShieldCheckIcon weight="fill" className="h-4 w-4" />} />}>
                <SidebarItem icon={<MagnifyingGlassIcon weight="duotone" className="h-5 w-5" />} label="Discovery" />
                <SidebarItem icon={<FolderIcon weight="duotone" className="h-5 w-5" />} label="Reports" active />
                <SidebarItem icon={<UsersThreeIcon weight="duotone" className="h-5 w-5" />} label="Subjects" />
                <SidebarItem icon={<FileIcon weight="duotone" className="h-5 w-5" />} label="Cases" />
                <SidebarSection label="Network" />
                <SidebarItem icon={<BankIcon weight="duotone" className="h-5 w-5" />} label="Institutions" />
                <SidebarItem icon={<ShareNetworkIcon weight="duotone" className="h-5 w-5" />} label="Connectors" caret={false} />
              </Sidebar>
            }
            header={
              <AppHeader
                brand={<Brand name="Sentry" mark={<GraphIcon weight="fill" className="h-4 w-4" />} />}
                center={<SearchInput placeholder="Search the graph…" defaultValue="" trailing={<Kbd>⌘K</Kbd>} />}
                actions={
                  <>
                    <IconButton icon={<BellIcon weight="duotone" className="h-5 w-5" />} label="Notifications" badge={3} />
                    <IconButton icon={<GearIcon weight="duotone" className="h-5 w-5" />} label="Settings" />
                    <IconButton icon={<ListIcon weight="bold" className="h-5 w-5" />} label="Menu" />
                    <Avatar name="Riley Chen" size="sm" presence="ok" className="ml-1" />
                  </>
                }
              />
            }
            nav={
              <NavTree
                title="Investigation"
                activeId="field-mapping"
                expandedIds={['entity-graph', 'watch-lists']}
                nodes={[
                  {
                    id: 'entity-graph',
                    label: 'Entity Graph',
                    children: [
                      { id: 'overview', label: 'Overview', done: true },
                      { id: 'field-mapping', label: 'Field Mapping' },
                      { id: 'view-rules', label: 'View Rules' },
                    ],
                  },
                  {
                    id: 'watch-lists',
                    label: 'Watch Lists',
                    children: [{ id: 'priority', label: 'Priority' }, { id: 'archived', label: 'Archived' }],
                  },
                  { id: 'reconciliation', label: 'Reconciliation' },
                ]}
              />
            }
          >
            <div className="space-y-4">
              <Toolbar>
                <SegmentedControl
                  value="all"
                  segments={[
                    { value: 'all', label: 'All' },
                    { value: 'matched', label: 'Matched' },
                    { value: 'cleared', label: 'Cleared' },
                  ]}
                />
                <ToolbarDivider />
                <SearchInput placeholder="Filter entities…" className="w-56" />
                <ToolbarSpacer />
                <Button variant="secondary" size="sm" leftIcon={<SparkleIcon weight="fill" className="h-4 w-4 text-match" />}>
                  AI Search
                </Button>
                <Button variant="primary" size="sm" leftIcon={<PresentationChartIcon weight="bold" className="h-4 w-4" />}>
                  Present
                </Button>
              </Toolbar>

              <Panel
                title="Entity Graph"
                icon={<GraphIcon weight="duotone" className="h-4 w-4" />}
                actions={<IconButton icon={<DotsThreeIcon weight="bold" className="h-5 w-5" />} label="Graph options" size="sm" />}
              >
                <div className="grid gap-5 md:grid-cols-[220px_1fr]">
                  <EntityList items={ENTITIES} selectedId="2" />
                  <div className="rounded-xl border border-hair/60 bg-white/40 p-4">
                    <EntityGraph nodes={GRAPH_NODES} hubLabel="J. Doe" className="mx-auto max-w-sm" />
                  </div>
                </div>
              </Panel>

              <Panel
                title="Data Devices"
                actions={
                  <>
                    <Button variant="secondary" size="sm" leftIcon={<FunnelIcon weight="bold" className="h-4 w-4" />}>Filter</Button>
                    <Button variant="secondary" size="sm" leftIcon={<SlidersHorizontalIcon weight="bold" className="h-4 w-4" />}>Fields</Button>
                  </>
                }
                footer={
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted">Showing 1–5 of 219</span>
                    <PageDots count={4} active={0} />
                  </div>
                }
              >
                <div className="flex flex-wrap gap-2">
                  {['Source', 'Region', 'Currency', 'Period', 'Confidence'].map((f) => (
                    <Badge key={f} tone="neutral">{f}</Badge>
                  ))}
                </div>
              </Panel>
            </div>
          </WorkspaceLayout>
        </Section>

        {/* ---------------------------- Screen 2 ---------------------------- */}
        <Section n={2} title="Command Palette" caption="SearchInput · SegmentedControl · ResultGroup · SearchResultRow">
          <div className="flex justify-center rounded-3xl bg-gradient-to-br from-[#1f2147] via-[#26284f] to-[#0d1b3e] p-10">
            <CommandPaletteDemo />
          </div>
        </Section>

        {/* ---------------------------- Screen 3 ---------------------------- */}
        <Section n={3} title="Analytics Dashboard" caption="KpiTile · StatCard · DataTable · AreaChart · MetricPanel · BarChart">
          <div className="space-y-4">
            <PageHeader
              title="Wealth & Risk Dashboard"
              description="Aggregate exposure across all active deconfliction cases."
              actions={
                <>
                  <SegmentedControl
                    value="all"
                    segments={[
                      { value: 'all', label: 'All' },
                      { value: 'confirmed', label: 'Confirmed' },
                      { value: 'filtered', label: 'Filtered' },
                    ]}
                  />
                  <IconButton icon={<ClockCounterClockwiseIcon weight="duotone" className="h-5 w-5" />} label="History" variant="frost" />
                  <IconButton icon={<DotsThreeIcon weight="bold" className="h-5 w-5" />} label="More" variant="frost" />
                </>
              }
            />

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <KpiTile tone="solid" label="Detections" value="3,084" hint="last 30 days" />
              <KpiTile tone="navy" label="Pending" value="489" hint="awaiting review" />
              <KpiTile tone="frost" label="Cleared" value="41,280" hint="resolved" />
              <KpiTile tone="frost" label="Exposure" value="$31.8M" hint="at risk" />
            </div>

            <div className="grid gap-4 lg:grid-cols-[1.6fr_1fr]">
              <Panel title="Case Records" actions={<Button variant="link">Export</Button>} bodyClassName="px-2 py-1">
                <DataTable columns={CASE_COLUMNS} rows={CASES} rowKey={(r) => r.id} selectedKey="LE-08821" zebra />
              </Panel>

              <MetricPanel
                title="Recovery Trend"
                action={<Badge tone="ok" variant="solid">+12.4%</Badge>}
              >
                <div className="flex items-end justify-between">
                  <MetricFigure value="$41,280" caption="Recovered this quarter" />
                  <MetricFigure value="$31,892" caption="Outstanding" className="text-right" />
                </div>
                <Sparkline data={[12, 18, 14, 22, 19, 28, 24, 33]} tone="white" className="mt-5 h-10" />
                <div className="mt-5 border-t border-white/10 pt-4">
                  <BarChart
                    height={88}
                    data={[18, 26, 14, 30, 22, 38, 28].map((v, i) => ({ value: v, highlight: i === 5 }))}
                  />
                </div>
              </MetricPanel>
            </div>

            <Panel title="Detection Volume" actions={<Badge tone="info">90 days</Badge>}>
              <AreaChart
                data={[12, 18, 9, 22, 16, 28, 19, 34, 24, 30, 22, 38]}
                compare={[8, 12, 10, 14, 11, 18, 13, 20, 16, 19, 15, 24]}
                ticks={['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']}
                height={180}
              />
            </Panel>

            <div className="grid gap-4 sm:grid-cols-3">
              <StatCard label="Avg. confidence" value="0.87" delta={3.2} icon={<ScalesIcon weight="duotone" className="h-4 w-4" />} spark={[6, 7, 6, 8, 7, 9, 8]} />
              <StatCard label="False positives" value="2.1%" delta={-1.4} deltaInvert icon={<FunnelIcon weight="duotone" className="h-4 w-4" />} spark={[9, 7, 8, 6, 5, 6, 4]} />
              <StatCard tone="dark" label="Active matches" value="312" delta={8.0} icon={<ShareNetworkIcon weight="duotone" className="h-4 w-4" />} spark={[4, 6, 5, 9, 7, 12, 14]} />
            </div>
          </div>
        </Section>

        {/* ---------------------------- Screen 4 ---------------------------- */}
        <Section n={4} title="Workflow Board" caption="PageHeader · Tabs · Breadcrumb · Board · KanbanCard · ConnectorCard">
          <Panel bodyClassName="p-6">
            <PageHeader
              eyebrow={<Breadcrumb items={[{ label: 'Workspace', href: '#' }, { label: 'Compliance' }]} showBack={false} />}
              leading={<Avatar name="Compliance Team" size="md" />}
              title="Compliance Pipeline"
              actions={
                <>
                  <Button variant="ghost">Cancel</Button>
                  <Button variant="primary" leftIcon={<ShareNetworkIcon weight="bold" className="h-4 w-4" />}>Connect</Button>
                </>
              }
              tabs={
                <Tabs
                  value="columns"
                  tabs={[
                    { value: 'columns', label: 'Columns', count: 5 },
                    { value: 'timeline', label: 'Timeline' },
                    { value: 'table', label: 'Table' },
                  ]}
                />
              }
            />

            <div className="mt-5">
              <Breadcrumb items={[{ label: 'Field Setting' }]} className="mb-4" />
              <Board>
                <BoardColumn title="Triage" count={2} tone="warn" onAdd={() => {}}>
                  <KanbanCard title="Apex Holdings" subtitle="Verifying processing" flagged accent="warn" status="In review" statusTone="warn" leading={<BriefcaseIcon weight="duotone" className="h-4 w-4" />} />
                  <KanbanCard title="Shell Corp 14" subtitle="Awaiting documents" accent="warn" status="In review" statusTone="warn" />
                </BoardColumn>
                <BoardColumn title="Investigating" count={1} tone="info">
                  <KanbanCard title="J. Doe" subtitle="Entity graph expanding" flagged accent="info" status="Active" statusTone="info" leading={<BinocularsIcon weight="duotone" className="h-4 w-4" />} />
                </BoardColumn>
                <BoardColumn title="Analysis" count={1} tone="info">
                  <KanbanCard title="Meridian Bank" subtitle="Cross-checking AML feed" accent="info" status="Active" statusTone="info" />
                </BoardColumn>
                <BoardColumn title="Escalated" count={1} tone="alert">
                  <KanbanCard title="Wire Fraud #882" subtitle="Flagged for legal" flagged accent="alert" status="Escalated" statusTone="alert" leading={<FlagIcon weight="duotone" className="h-4 w-4" />} />
                </BoardColumn>
                <BoardColumn title="Resolved" count={1} tone="ok">
                  <KanbanCard title="Case LE-08110" subtitle="Closed — reconciled" accent="ok" status="Settled" statusTone="ok" />
                </BoardColumn>
              </Board>

              <div className="mt-6 border-t border-hair/60 pt-5">
                <h3 className="mb-3 text-sm font-bold tracking-wide text-ink">Linked Connectors</h3>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  <ConnectorCard name="Meridian Bank" status="Synced" statusTone="ok" />
                  <ConnectorCard name="Companies House" descriptor="Registry feed" status="Synced" statusTone="ok" icon={<BuildingsIcon weight="duotone" className="h-5 w-5 text-fi" />} />
                  <ConnectorCard name="Chainalysis" descriptor="On-chain feed" status="Delayed" statusTone="warn" />
                  <ConnectorCard name="Interpol Notices" descriptor="Watch-list feed" status="Offline" statusTone="alert" pulse={false} icon={<FlagIcon weight="duotone" className="h-5 w-5 text-fi" />} />
                </div>
              </div>
            </div>
          </Panel>
        </Section>

        {/* ---------------------------- Screen 5 ---------------------------- */}
        <Section n={5} title="Code Window" caption="CodeWindow · CodeLine · syntax highlighter">
          <CodeWindow code={API_CODE} title="api/deconflict.ts" language="ts" highlightLines={[11, 12, 13, 14, 15]} />
        </Section>

        {/* ---------------------------- Screen 6 ---------------------------- */}
        <Section n={6} title="Secure Messaging" caption="SecureChat · ChatMessage · EncryptedFile">
          <div className="flex justify-center rounded-3xl bg-gradient-to-br from-[#1f2147] via-[#26284f] to-[#0d1b3e] p-10">
            <SecureChat
              className="h-[640px] w-full max-w-lg"
              title="Case LE-2024-08821 · J. Doe"
              subtitle="Meridian Bank ⟷ FBI · Field Office 14"
              participants={CHAT_PARTICIPANTS}
              items={CHAT_ITEMS}
              draftAttachments={CHAT_DRAFT}
            />
          </div>
        </Section>
      </div>
    </main>
  );
}
