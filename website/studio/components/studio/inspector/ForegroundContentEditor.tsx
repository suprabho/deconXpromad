'use client';

import type {
  AlertData,
  AppDonutTone,
  AppGaugeTone,
  AppGraphTone,
  AppIconKey,
  AppStatusTone,
  CaseData,
  CaseReveal,
  ChatCipherState,
  ChatFileKind,
  ChatItemData,
  ChatSideKey,
  ChatTrackKey,
  CodeWindowData,
  CommandPaletteData,
  DeliveryKey,
  DonutChartData,
  EntityGraphData,
  FeatureIconKey,
  FeatureModalData,
  FeatureTone,
  FingerprintConfig,
  ForegroundContent,
  GaugeArcData,
  KanbanCardData,
  Reveal,
  RiskTier,
  SecureChatData,
  Segment,
  StatCardData,
  Tick,
  TimelineData,
  Track,
} from '@/lib/composition/types';
import type {
  ActivityFeedData,
  AppAreaTone,
  AppAvatarSize,
  AppBadgeTone,
  AppBarTone,
  AppButtonSize,
  AppButtonVariant,
  AppDistTone,
  AppHeaderData,
  AppHeatTone,
  AppIconButtonVariant,
  AppKpiTone,
  AppProgressTone,
  AppSparkTone,
  AppWindowTone,
  AreaChartData,
  AvatarData,
  BadgeData,
  BarChartData,
  BoardData,
  BreadcrumbData,
  ButtonData,
  ConnectorCardData,
  DataTableData,
  DeltaData,
  DistributionBarData,
  EntityListData,
  HeatmapData,
  IconButtonData,
  KpiTileData,
  MetricPanelData,
  NavNodeData,
  NavTreeData,
  PageDotsData,
  PageHeaderData,
  PanelData,
  ProgressBarData,
  RankListData,
  SearchInputData,
  SegmentedControlData,
  SelectData,
  SidebarData,
  SparklineData,
  StatusBadgeData,
  StatusDotData,
  TabItemData,
  TabsData,
  ToolbarData,
  WindowChromeData,
  WorkspaceLayoutData,
} from '@/lib/composition/types';
import { APP_ICON_KEYS, FEATURE_ICON_KEYS, FINGERPRINT_PATTERN_OPTIONS } from '@/lib/composition/types';
import {
  ColorField,
  Field,
  NumberField,
  Scrubber,
  Segmented,
  SelectField,
  TextArea,
  TextField,
  Toggle,
  inputCls,
} from './controls';
import { PatternControls } from './PatternControls';

/* ---------------------- option lists for the new plates --------------------- */

const PROGRESS_TONE_OPTS: { value: AppProgressTone; label: string }[] = [
  { value: 'fi', label: 'Blue' },
  { value: 'match', label: 'Orange' },
  { value: 'ok', label: 'Green' },
  { value: 'alert', label: 'Red' },
  { value: 'ink', label: 'Ink' },
];
const BADGE_TONE_OPTS: { value: AppBadgeTone; label: string }[] = [
  { value: 'neutral', label: 'Neutral' },
  { value: 'info', label: 'Blue' },
  { value: 'ok', label: 'Green' },
  { value: 'warn', label: 'Amber' },
  { value: 'alert', label: 'Red' },
  { value: 'match', label: 'Orange' },
];
const DIST_TONE_OPTS: { value: AppDistTone; label: string }[] = [
  { value: 'fi', label: 'Blue' },
  { value: 'match', label: 'Orange' },
  { value: 'ok', label: 'Green' },
  { value: 'warn', label: 'Amber' },
  { value: 'alert', label: 'Red' },
  { value: 'navy', label: 'Navy' },
  { value: 'ink', label: 'Ink' },
  { value: 'muted', label: 'Grey' },
];
const HEAT_TONE_OPTS: { value: AppHeatTone; label: string }[] = [
  { value: 'fi', label: 'Blue' },
  { value: 'match', label: 'Orange' },
  { value: 'ok', label: 'Green' },
  { value: 'alert', label: 'Red' },
];
const SPARK_TONE_OPTS: { value: AppSparkTone; label: string }[] = [
  { value: 'fi', label: 'Blue' },
  { value: 'match', label: 'Orange' },
  { value: 'ok', label: 'Green' },
  { value: 'alert', label: 'Red' },
  { value: 'white', label: 'White' },
];
const AREA_TONE_OPTS: { value: AppAreaTone; label: string }[] = [
  { value: 'fi', label: 'Blue' },
  { value: 'match', label: 'Orange' },
  { value: 'ok', label: 'Green' },
];
const BAR_TONE_OPTS: { value: AppBarTone; label: string }[] = [
  { value: 'fi', label: 'Blue' },
  { value: 'match', label: 'Orange' },
  { value: 'ok', label: 'Green' },
  { value: 'white', label: 'White' },
  { value: 'ink', label: 'Ink' },
];
const KPI_TONE_OPTS: { value: AppKpiTone; label: string }[] = [
  { value: 'solid', label: 'Blue' },
  { value: 'navy', label: 'Navy' },
  { value: 'frost', label: 'Frost' },
];
const BUTTON_VARIANT_OPTS: { value: AppButtonVariant; label: string }[] = [
  { value: 'primary', label: 'Primary' },
  { value: 'secondary', label: 'Secondary' },
  { value: 'ghost', label: 'Ghost' },
  { value: 'link', label: 'Link' },
  { value: 'danger', label: 'Danger' },
];
const BUTTON_SIZE_OPTS: { value: AppButtonSize; label: string }[] = [
  { value: 'sm', label: 'S' },
  { value: 'md', label: 'M' },
  { value: 'lg', label: 'L' },
];
const AVATAR_SIZE_OPTS: { value: AppAvatarSize; label: string }[] = [
  { value: 'xs', label: 'XS' },
  { value: 'sm', label: 'S' },
  { value: 'md', label: 'M' },
  { value: 'lg', label: 'L' },
];
const ICONBTN_VARIANT_OPTS: { value: AppIconButtonVariant; label: string }[] = [
  { value: 'ghost', label: 'Ghost' },
  { value: 'frost', label: 'Frost' },
  { value: 'solid', label: 'Solid' },
];
const WINDOW_TONE_OPTS: { value: AppWindowTone; label: string }[] = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
];
const DELTA_TONE_OPTS: { value: DeltaData['tone']; label: string }[] = [
  { value: 'auto', label: 'Auto' },
  { value: 'on-dark', label: 'On dark' },
];
const DOT_SIZE_OPTS = [
  { value: 'sm' as const, label: 'S' },
  { value: 'md' as const, label: 'M' },
  { value: 'lg' as const, label: 'L' },
];
const SM_MD_OPTS = [
  { value: 'sm' as const, label: 'S' },
  { value: 'md' as const, label: 'M' },
];
const MD_LG_OPTS = [
  { value: 'md' as const, label: 'M' },
  { value: 'lg' as const, label: 'L' },
];
const ALIGN_OPTS = [
  { value: 'left' as const, label: 'Left' },
  { value: 'center' as const, label: 'Centre' },
  { value: 'right' as const, label: 'Right' },
];
const BADGE_VARIANT_OPTS = [
  { value: 'soft' as const, label: 'Soft' },
  { value: 'solid' as const, label: 'Solid' },
];

/** ", "-joined string list ↔ string[] for comma-separated text inputs. */
const strList = (arr: string[]) => arr.join(', ');
const parseStrList = (s: string) => s.split(',').map((x) => x.trim()).filter(Boolean);
const rid = () => crypto.randomUUID().slice(0, 6);

const REVEAL_OPTS: { value: Reveal; label: string }[] = [
  { value: 'masked', label: 'Masked' },
  { value: 'partial', label: 'Partial' },
  { value: 'revealed', label: 'Revealed' },
];
const TIER_OPTS: { value: RiskTier; label: string }[] = [
  { value: 'High', label: 'High' },
  { value: 'Medium', label: 'Medium' },
  { value: 'Low', label: 'Low' },
];
const FEATURE_TONE_OPTS: { value: FeatureTone; label: string }[] = [
  { value: 'glass', label: 'Glass · on colour' },
  { value: 'frost', label: 'Frost · on light' },
];
const FEATURE_ICON_LABELS: Record<FeatureIconKey, string> = {
  'shield-check': 'Shield check',
  gear: 'Gear',
  handshake: 'Handshake',
  'currency-dollar': 'Dollar',
  lock: 'Lock',
  fingerprint: 'Fingerprint',
  link: 'Link',
  pulse: 'Pulse',
  eye: 'Eye',
  lightning: 'Lightning',
  chart: 'Chart',
};
const FEATURE_ICON_OPTS = FEATURE_ICON_KEYS.map((k) => ({ value: k, label: FEATURE_ICON_LABELS[k] }));

/* ----------------------- app-screen foreground options ---------------------- */

const APP_ICON_LABELS: Record<AppIconKey, string> = {
  'shield-check': 'Shield',
  bank: 'Bank',
  buildings: 'Buildings',
  user: 'User',
  wallet: 'Wallet',
  briefcase: 'Briefcase',
  flag: 'Flag',
  'magnifying-glass': 'Search',
  graph: 'Graph',
  chart: 'Chart',
  'currency-dollar': 'Dollar',
  scales: 'Scales',
  link: 'Link',
  binoculars: 'Binoculars',
  share: 'Share',
  'shield-star': 'Police badge',
  gavel: 'Gavel',
  detective: 'Detective',
  fingerprint: 'Fingerprint',
  siren: 'Siren',
  'police-car': 'Police car',
  'id-badge': 'ID badge',
  'logo-fbi': 'FBI (logo)',
  'logo-interpol': 'INTERPOL (logo)',
  'logo-dea': 'DEA (logo)',
  'logo-fincen': 'FinCEN (logo)',
  'logo-hsbc': 'HSBC (logo)',
  'logo-chainalysis': 'Chainalysis (logo)',
};
const APP_ICON_OPTS = APP_ICON_KEYS.map((k) => ({ value: k, label: APP_ICON_LABELS[k] }));
const APP_ICON_OPTS_OPTIONAL: { value: AppIconKey | 'none'; label: string }[] = [
  { value: 'none', label: 'None' },
  ...APP_ICON_OPTS,
];

const STAT_TONE_OPTS: { value: StatCardData['tone']; label: string }[] = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
];
const STATUS_TONE_OPTS: { value: AppStatusTone; label: string }[] = [
  { value: 'ok', label: 'OK' },
  { value: 'info', label: 'Info' },
  { value: 'warn', label: 'Warn' },
  { value: 'alert', label: 'Alert' },
  { value: 'idle', label: 'Idle' },
];
const ACCENT_OPTS: { value: AppStatusTone | 'none'; label: string }[] = [
  { value: 'none', label: 'None' },
  ...STATUS_TONE_OPTS,
];
const GRAPH_TONE_OPTS: { value: AppGraphTone; label: string }[] = [
  { value: 'hub', label: 'Hub' },
  { value: 'active', label: 'Active' },
  { value: 'match', label: 'Match' },
  { value: 'alert', label: 'Alert' },
  { value: 'idle', label: 'Idle' },
];
const DONUT_TONE_OPTS: { value: AppDonutTone; label: string }[] = [
  { value: 'fi', label: 'Blue' },
  { value: 'ok', label: 'Green' },
  { value: 'match', label: 'Orange' },
  { value: 'alert', label: 'Red' },
  { value: 'navy', label: 'Navy' },
  { value: 'ink', label: 'Ink' },
  { value: 'muted', label: 'Grey' },
];
const GAUGE_TONE_OPTS: { value: AppGaugeTone; label: string }[] = [
  { value: 'fi', label: 'Blue' },
  { value: 'ok', label: 'Green' },
  { value: 'warn', label: 'Amber' },
  { value: 'match', label: 'Orange' },
  { value: 'alert', label: 'Red' },
];
const CHAT_SIDE_OPTS: { value: ChatSideKey; label: string }[] = [
  { value: 'self', label: 'Self · right' },
  { value: 'peer', label: 'Peer · left' },
];
const CHAT_TRACK_OPTS: { value: ChatTrackKey; label: string }[] = [
  { value: 'fi', label: 'FI · blue' },
  { value: 'le', label: 'LE · navy' },
];
const CHAT_STATUS_OPTS: { value: DeliveryKey | 'none'; label: string }[] = [
  { value: 'none', label: 'None' },
  { value: 'sent', label: 'Sent' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'read', label: 'Read' },
];
const CHAT_KIND_OPTS: { value: ChatItemData['kind']; label: string }[] = [
  { value: 'message', label: 'Message' },
  { value: 'system', label: 'System note' },
  { value: 'day', label: 'Day divider' },
];
const FILE_KIND_OPTS: { value: ChatFileKind; label: string }[] = [
  { value: 'pdf', label: 'PDF' },
  { value: 'doc', label: 'Doc' },
  { value: 'sheet', label: 'Sheet' },
  { value: 'image', label: 'Image' },
  { value: 'archive', label: 'Archive' },
  { value: 'data', label: 'Data' },
];
const CIPHER_OPTS: { value: ChatCipherState; label: string }[] = [
  { value: 'encrypted', label: 'Encrypted' },
  { value: 'verifying', label: 'Decrypting' },
  { value: 'decrypted', label: 'Verified' },
];

/** "4, 6, 5" ↔ number[] for comma-separated numeric inputs. */
const numList = (arr: number[]) => arr.join(', ');
const parseNumList = (s: string) =>
  s
    .split(',')
    .map((x) => Number(x.trim()))
    .filter((n) => Number.isFinite(n));

/* --------------------------- reusable sub-editors --------------------------- */

function CaseDataFields({
  data,
  reveal,
  onData,
  onReveal,
}: {
  data: CaseData;
  reveal: CaseReveal;
  onData: (d: CaseData) => void;
  onReveal: (r: CaseReveal) => void;
}) {
  const set = (k: keyof CaseData, v: string) => onData({ ...data, [k]: v });
  return (
    <div className="space-y-3">
      <TextField label="Card title" value={data.title} onChange={(v) => set('title', v)} />
      <TextField label="Subtitle" value={data.subtitle} onChange={(v) => set('subtitle', v)} />
      <SelectField
        label="Header icon"
        value={data.icon}
        onChange={(icon) => onData({ ...data, icon })}
        options={APP_ICON_OPTS}
      />
      <TextField label="Subject name" value={data.subjectName} onChange={(v) => set('subjectName', v)} />
      <Segmented
        label="↳ Subject reveal"
        value={reveal.subjectName}
        onChange={(v) => onReveal({ ...reveal, subjectName: v })}
        options={REVEAL_OPTS}
      />
      <TextField label="Wallet address" value={data.walletAddress} mono onChange={(v) => set('walletAddress', v)} />
      <Segmented
        label="↳ Wallet reveal"
        value={reveal.walletAddress}
        onChange={(v) => onReveal({ ...reveal, walletAddress: v })}
        options={REVEAL_OPTS}
      />
      <TextField label="Transaction ID" value={data.transactionId} mono onChange={(v) => set('transactionId', v)} />
      <Segmented
        label="↳ Transaction reveal"
        value={reveal.transactionId}
        onChange={(v) => onReveal({ ...reveal, transactionId: v })}
        options={REVEAL_OPTS}
      />
      <TextField label="Date opened" value={data.dateOpened} onChange={(v) => set('dateOpened', v)} />
      <Segmented
        label="Risk tier"
        value={data.riskTier}
        onChange={(v) => onData({ ...data, riskTier: v })}
        options={TIER_OPTS}
      />
    </div>
  );
}

function AlertFields({ alert, onChange }: { alert: AlertData; onChange: (a: AlertData) => void }) {
  return (
    <div className="space-y-3">
      <TextField label="Status" value={alert.status} onChange={(v) => onChange({ ...alert, status: v })} />
      <TextField label="Detail" value={alert.detail} onChange={(v) => onChange({ ...alert, detail: v })} />
      <TextField label="Timestamp" value={alert.timestamp} onChange={(v) => onChange({ ...alert, timestamp: v })} />
    </div>
  );
}

function ListHeader({ title, onAdd }: { title: string; onAdd: () => void }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs font-semibold text-ink">{title}</span>
      <button
        type="button"
        onClick={onAdd}
        className="rounded border border-hair px-2 py-0.5 text-xs text-cobalt hover:bg-cobalt/5"
      >
        + Add
      </button>
    </div>
  );
}

function RemoveBtn({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="shrink-0 rounded border border-hair px-2 text-xs text-muted hover:text-risk-text"
      aria-label="Remove"
    >
      ✕
    </button>
  );
}

function TimelineFields({ timeline, onChange }: { timeline: TimelineData; onChange: (t: TimelineData) => void }) {
  const setTrack = (i: number, t: Track) => {
    const tracks = timeline.tracks.slice();
    tracks[i] = t;
    onChange({ ...timeline, tracks });
  };
  const setSegment = (ti: number, si: number, s: Segment) => {
    const track = timeline.tracks[ti];
    const segments = track.segments.slice();
    segments[si] = s;
    setTrack(ti, { ...track, segments });
  };

  return (
    <div className="space-y-4">
      {timeline.tracks.map((track, ti) => (
        <div key={ti} className="space-y-2 rounded-md border border-hair p-2.5">
          <TextField label={`Track ${ti + 1} label`} value={track.label} onChange={(v) => setTrack(ti, { ...track, label: v })} />
          <ColorField label="Track colour" value={track.color} onChange={(v) => setTrack(ti, { ...track, color: v })} />
          <ListHeader
            title="Segments"
            onAdd={() => setTrack(ti, { ...track, segments: [...track.segments, { from: '2024-04-01', to: '2024-05-01' }] })}
          />
          {track.segments.map((seg, si) => (
            <div key={si} className="flex items-center gap-1.5">
              <input
                type="date"
                className={inputCls}
                value={seg.from}
                onChange={(e) => setSegment(ti, si, { ...seg, from: e.target.value })}
              />
              <input
                type="date"
                className={inputCls}
                value={seg.to}
                onChange={(e) => setSegment(ti, si, { ...seg, to: e.target.value })}
              />
              <button
                type="button"
                title="Toggle faded"
                onClick={() => setSegment(ti, si, { ...seg, faded: !seg.faded })}
                className={`shrink-0 rounded border px-2 text-xs ${seg.faded ? 'border-hair text-muted' : 'border-cobalt text-cobalt'}`}
              >
                {seg.faded ? 'faded' : 'solid'}
              </button>
              <RemoveBtn
                onClick={() =>
                  setTrack(ti, { ...track, segments: track.segments.filter((_, j) => j !== si) })
                }
              />
            </div>
          ))}
        </div>
      ))}

      <div className="space-y-2">
        <ListHeader title="Overlap markers" onAdd={() => onChange({ ...timeline, overlaps: [...timeline.overlaps, '2024-05-15'] })} />
        {timeline.overlaps.map((d, i) => (
          <div key={i} className="flex items-center gap-1.5">
            <input
              type="date"
              className={inputCls}
              value={d}
              onChange={(e) => {
                const overlaps = timeline.overlaps.slice();
                overlaps[i] = e.target.value;
                onChange({ ...timeline, overlaps });
              }}
            />
            <RemoveBtn onClick={() => onChange({ ...timeline, overlaps: timeline.overlaps.filter((_, j) => j !== i) })} />
          </div>
        ))}
      </div>

      <div className="space-y-2">
        <ListHeader title="Axis ticks" onAdd={() => onChange({ ...timeline, ticks: [...timeline.ticks, { date: '2024-05-01', label: 'May 1' }] })} />
        {timeline.ticks.map((tick, i) => {
          const setTick = (t: Tick) => {
            const ticks = timeline.ticks.slice();
            ticks[i] = t;
            onChange({ ...timeline, ticks });
          };
          return (
            <div key={i} className="flex items-center gap-1.5">
              <input type="date" className={inputCls} value={tick.date} onChange={(e) => setTick({ ...tick, date: e.target.value })} />
              <input className={inputCls} value={tick.label} placeholder="Label" onChange={(e) => setTick({ ...tick, label: e.target.value })} />
              <RemoveBtn onClick={() => onChange({ ...timeline, ticks: timeline.ticks.filter((_, j) => j !== i) })} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

function FeatureModalFields({
  data,
  onChange,
}: {
  data: FeatureModalData;
  onChange: (d: FeatureModalData) => void;
}) {
  const setItem = (i: number, it: FeatureModalData['items'][number]) => {
    const items = data.items.slice();
    items[i] = it;
    onChange({ ...data, items });
  };
  return (
    <div className="space-y-3">
      <Segmented label="Tone" value={data.tone} onChange={(tone) => onChange({ ...data, tone })} options={FEATURE_TONE_OPTS} />
      <Toggle label="Window chrome (dots)" checked={data.chrome} onChange={(chrome) => onChange({ ...data, chrome })} />
      <TextField label="Eyebrow" value={data.eyebrow} onChange={(eyebrow) => onChange({ ...data, eyebrow })} />
      <TextField label="Heading" value={data.heading} onChange={(heading) => onChange({ ...data, heading })} />
      <TextArea label="Description" value={data.description} onChange={(description) => onChange({ ...data, description })} />

      <ListHeader
        title="Features"
        onAdd={() =>
          onChange({
            ...data,
            items: [...data.items, { icon: 'shield-check', title: 'New feature', description: '' }],
          })
        }
      />
      {data.items.map((it, i) => (
        <div key={i} className="space-y-2 rounded-md border border-hair p-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-ink">Feature {i + 1}</span>
            <RemoveBtn onClick={() => onChange({ ...data, items: data.items.filter((_, j) => j !== i) })} />
          </div>
          <SelectField
            label="Icon"
            value={it.icon}
            onChange={(icon: FeatureIconKey) => setItem(i, { ...it, icon })}
            options={FEATURE_ICON_OPTS}
          />
          <TextField label="Title" value={it.title} onChange={(title) => setItem(i, { ...it, title })} />
          <TextField label="Description" value={it.description} onChange={(description) => setItem(i, { ...it, description })} />
        </div>
      ))}
    </div>
  );
}

function CodeWindowFields({ data, onChange }: { data: CodeWindowData; onChange: (d: CodeWindowData) => void }) {
  return (
    <div className="space-y-3">
      <TextField label="Window title" value={data.title} onChange={(title) => onChange({ ...data, title })} />
      <TextField label="Language tag" value={data.language} onChange={(language) => onChange({ ...data, language })} />
      <TextArea label="Code" value={data.code} rows={10} onChange={(code) => onChange({ ...data, code })} />
      <TextField
        label="Highlight lines"
        value={numList(data.highlightLines)}
        placeholder="e.g. 11, 12, 13"
        hint="Comma-separated 1-based line numbers."
        onChange={(v) => onChange({ ...data, highlightLines: parseNumList(v) })}
      />
    </div>
  );
}

function EntityGraphFields({ data, onChange }: { data: EntityGraphData; onChange: (d: EntityGraphData) => void }) {
  const setNode = (i: number, n: EntityGraphData['nodes'][number]) => {
    const nodes = data.nodes.slice();
    nodes[i] = n;
    onChange({ ...data, nodes });
  };
  return (
    <div className="space-y-3">
      <TextField label="Hub label" value={data.hubLabel} onChange={(hubLabel) => onChange({ ...data, hubLabel })} />
      <ListHeader
        title="Nodes"
        onAdd={() =>
          onChange({ ...data, nodes: [...data.nodes, { id: crypto.randomUUID().slice(0, 6), ring: 1, tone: 'idle' }] })
        }
      />
      {data.nodes.map((node, i) => (
        <div key={node.id} className="space-y-2 rounded-md border border-hair p-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-ink">Node {i + 1}</span>
            <RemoveBtn onClick={() => onChange({ ...data, nodes: data.nodes.filter((_, j) => j !== i) })} />
          </div>
          <Segmented
            label="Ring"
            value={String(node.ring)}
            onChange={(v) => setNode(i, { ...node, ring: v === '2' ? 2 : 1 })}
            options={[
              { value: '1', label: 'Inner' },
              { value: '2', label: 'Outer' },
            ]}
          />
          <SelectField label="Tone" value={node.tone} onChange={(tone) => setNode(i, { ...node, tone })} options={GRAPH_TONE_OPTS} />
        </div>
      ))}
    </div>
  );
}

function StatCardFields({ data, onChange }: { data: StatCardData; onChange: (d: StatCardData) => void }) {
  return (
    <div className="space-y-3">
      <TextField label="Label" value={data.label} onChange={(label) => onChange({ ...data, label })} />
      <TextField label="Value" value={data.value} onChange={(value) => onChange({ ...data, value })} />
      <NumberField label="Delta (%)" value={data.delta} onChange={(delta) => onChange({ ...data, delta })} />
      <Toggle label="Invert delta colours" checked={data.deltaInvert} onChange={(deltaInvert) => onChange({ ...data, deltaInvert })} />
      <Segmented label="Tone" value={data.tone} onChange={(tone) => onChange({ ...data, tone })} options={STAT_TONE_OPTS} />
      <SelectField label="Icon" value={data.icon} onChange={(icon) => onChange({ ...data, icon })} options={APP_ICON_OPTS_OPTIONAL} />
      <TextField
        label="Sparkline values"
        value={numList(data.spark)}
        placeholder="e.g. 4, 6, 5, 9, 7"
        onChange={(v) => onChange({ ...data, spark: parseNumList(v) })}
      />
    </div>
  );
}

function KanbanCardFields({ data, onChange }: { data: KanbanCardData; onChange: (d: KanbanCardData) => void }) {
  return (
    <div className="space-y-3">
      <TextField label="Title" value={data.title} onChange={(title) => onChange({ ...data, title })} />
      <TextField label="Subtitle" value={data.subtitle} onChange={(subtitle) => onChange({ ...data, subtitle })} />
      <TextField label="Status label" value={data.status} onChange={(status) => onChange({ ...data, status })} />
      <Segmented label="Status tone" value={data.statusTone} onChange={(statusTone) => onChange({ ...data, statusTone })} options={STATUS_TONE_OPTS} />
      <SelectField label="Accent stripe" value={data.accent} onChange={(accent) => onChange({ ...data, accent })} options={ACCENT_OPTS} />
      <SelectField label="Leading icon" value={data.leading} onChange={(leading) => onChange({ ...data, leading })} options={APP_ICON_OPTS_OPTIONAL} />
      <Toggle label="Flagged (alert glyph)" checked={data.flagged} onChange={(flagged) => onChange({ ...data, flagged })} />
    </div>
  );
}

function CommandPaletteFields({ data, onChange }: { data: CommandPaletteData; onChange: (d: CommandPaletteData) => void }) {
  const setRow = (i: number, r: CommandPaletteData['rows'][number]) => {
    const rows = data.rows.slice();
    rows[i] = r;
    onChange({ ...data, rows });
  };
  return (
    <div className="space-y-3">
      <TextField label="Query" value={data.query} onChange={(query) => onChange({ ...data, query })} />
      <TextField label="Group label" value={data.groupLabel} onChange={(groupLabel) => onChange({ ...data, groupLabel })} />
      <ListHeader
        title="Result rows"
        onAdd={() =>
          onChange({ ...data, rows: [...data.rows, { icon: 'shield-check', title: 'New result', subtitle: '', meta: '' }] })
        }
      />
      {data.rows.map((row, i) => (
        <div key={i} className="space-y-2 rounded-md border border-hair p-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-ink">Row {i + 1}</span>
            <RemoveBtn onClick={() => onChange({ ...data, rows: data.rows.filter((_, j) => j !== i) })} />
          </div>
          <SelectField label="Icon" value={row.icon} onChange={(icon) => setRow(i, { ...row, icon })} options={APP_ICON_OPTS} />
          <TextField label="Title" value={row.title} onChange={(title) => setRow(i, { ...row, title })} />
          <TextField label="Subtitle" value={row.subtitle} onChange={(subtitle) => setRow(i, { ...row, subtitle })} />
          <TextField label="Meta" value={row.meta} placeholder="e.g. 15 entries" onChange={(meta) => setRow(i, { ...row, meta })} />
        </div>
      ))}
    </div>
  );
}

function DonutChartFields({ data, onChange }: { data: DonutChartData; onChange: (d: DonutChartData) => void }) {
  const setSeg = (i: number, s: DonutChartData['segments'][number]) => {
    const segments = data.segments.slice();
    segments[i] = s;
    onChange({ ...data, segments });
  };
  return (
    <div className="space-y-3">
      <TextField label="Panel title" value={data.title} onChange={(title) => onChange({ ...data, title })} />
      <div className="grid grid-cols-2 gap-2">
        <TextField label="Centre value" value={data.centerValue} onChange={(centerValue) => onChange({ ...data, centerValue })} />
        <TextField label="Centre label" value={data.centerLabel} onChange={(centerLabel) => onChange({ ...data, centerLabel })} />
      </div>
      <ListHeader
        title="Segments"
        onAdd={() => onChange({ ...data, segments: [...data.segments, { label: 'New', value: 10, tone: 'fi' }] })}
      />
      {data.segments.map((seg, i) => (
        <div key={i} className="space-y-2 rounded-md border border-hair p-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-ink">Segment {i + 1}</span>
            <RemoveBtn onClick={() => onChange({ ...data, segments: data.segments.filter((_, j) => j !== i) })} />
          </div>
          <TextField label="Label" value={seg.label} onChange={(label) => setSeg(i, { ...seg, label })} />
          <div className="grid grid-cols-2 gap-2">
            <NumberField label="Value" value={seg.value} min={0} onChange={(value) => setSeg(i, { ...seg, value })} />
            <SelectField label="Colour" value={seg.tone} onChange={(tone) => setSeg(i, { ...seg, tone })} options={DONUT_TONE_OPTS} />
          </div>
        </div>
      ))}
    </div>
  );
}

function GaugeArcFields({ data, onChange }: { data: GaugeArcData; onChange: (d: GaugeArcData) => void }) {
  return (
    <div className="space-y-3">
      <TextField label="Panel title" value={data.title} onChange={(title) => onChange({ ...data, title })} />
      <NumberField label="Value" value={data.value} onChange={(value) => onChange({ ...data, value })} />
      <div className="grid grid-cols-2 gap-2">
        <NumberField label="Min" value={data.min} onChange={(min) => onChange({ ...data, min })} />
        <NumberField label="Max" value={data.max} onChange={(max) => onChange({ ...data, max })} />
      </div>
      <TextField label="Unit suffix" value={data.unit} placeholder="e.g. % (or blank)" onChange={(unit) => onChange({ ...data, unit })} />
      <TextField label="Dial label" value={data.label} onChange={(label) => onChange({ ...data, label })} />
      <TextField label="Caption" value={data.caption} onChange={(caption) => onChange({ ...data, caption })} />
      <Toggle label="Auto-colour by thresholds" checked={data.useThresholds} onChange={(useThresholds) => onChange({ ...data, useThresholds })} />
      {data.useThresholds ? (
        <div className="grid grid-cols-2 gap-2">
          <NumberField label="Warn at (0–1)" value={data.thresholdWarn} min={0} max={1} onChange={(thresholdWarn) => onChange({ ...data, thresholdWarn })} />
          <NumberField label="Alert at (0–1)" value={data.thresholdAlert} min={0} max={1} onChange={(thresholdAlert) => onChange({ ...data, thresholdAlert })} />
        </div>
      ) : (
        <SelectField label="Arc colour" value={data.tone} onChange={(tone) => onChange({ ...data, tone })} options={GAUGE_TONE_OPTS} />
      )}
    </div>
  );
}

function SecureChatFields({ data, onChange }: { data: SecureChatData; onChange: (d: SecureChatData) => void }) {
  const participantOpts = data.participants.map((p) => ({
    value: p.id,
    label: `${p.name}${p.side === 'self' ? ' (self)' : ''}`,
  }));
  const setParticipant = (i: number, p: SecureChatData['participants'][number]) => {
    const participants = data.participants.slice();
    participants[i] = p;
    onChange({ ...data, participants });
  };
  const setItem = (i: number, it: ChatItemData) => {
    const items = data.items.slice();
    items[i] = it;
    onChange({ ...data, items });
  };
  return (
    <div className="space-y-3">
      <TextField label="Title" value={data.title} onChange={(title) => onChange({ ...data, title })} />
      <TextField label="Subtitle" value={data.subtitle} onChange={(subtitle) => onChange({ ...data, subtitle })} />
      <Toggle label="Show composer" checked={data.composer} onChange={(composer) => onChange({ ...data, composer })} />

      <ListHeader
        title="Participants"
        onAdd={() =>
          onChange({
            ...data,
            participants: [
              ...data.participants,
              { id: crypto.randomUUID().slice(0, 4), name: 'New party', org: '', side: 'peer', track: 'le', online: true },
            ],
          })
        }
      />
      {data.participants.map((p, i) => (
        <div key={p.id} className="space-y-2 rounded-md border border-hair p-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-ink">
              Party {i + 1} · <code className="text-[11px] text-muted">{p.id}</code>
            </span>
            <RemoveBtn onClick={() => onChange({ ...data, participants: data.participants.filter((_, j) => j !== i) })} />
          </div>
          <TextField label="Name" value={p.name} onChange={(name) => setParticipant(i, { ...p, name })} />
          <TextField label="Org line" value={p.org} onChange={(org) => setParticipant(i, { ...p, org })} />
          <Segmented label="Side" value={p.side} onChange={(side) => setParticipant(i, { ...p, side })} options={CHAT_SIDE_OPTS} />
          <Segmented label="Track tint" value={p.track} onChange={(track) => setParticipant(i, { ...p, track })} options={CHAT_TRACK_OPTS} />
          <Toggle label="Online" checked={p.online} onChange={(online) => setParticipant(i, { ...p, online })} />
        </div>
      ))}

      <ListHeader
        title="Thread items"
        onAdd={() =>
          onChange({
            ...data,
            items: [
              ...data.items,
              {
                kind: 'message',
                id: crypto.randomUUID().slice(0, 6),
                authorId: data.participants[0]?.id ?? '',
                body: 'New message',
                time: '',
                status: 'none',
                attachments: [],
              },
            ],
          })
        }
      />
      {data.items.map((it, i) => (
        <div key={it.id} className="space-y-2 rounded-md border border-hair p-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-ink">Item {i + 1}</span>
            <RemoveBtn onClick={() => onChange({ ...data, items: data.items.filter((_, j) => j !== i) })} />
          </div>
          <SelectField
            label="Kind"
            value={it.kind}
            onChange={(kind) =>
              setItem(
                i,
                kind === 'message'
                  ? {
                      kind: 'message',
                      id: it.id,
                      authorId: data.participants[0]?.id ?? '',
                      body: '',
                      time: '',
                      status: 'none',
                      attachments: [],
                    }
                  : { kind, id: it.id, label: kind === 'day' ? 'Today' : 'Secure note' }
              )
            }
            options={CHAT_KIND_OPTS}
          />
          {it.kind === 'message' ? (
            <>
              <SelectField
                label="Author"
                value={it.authorId}
                onChange={(authorId) => setItem(i, { ...it, authorId })}
                options={participantOpts.length ? participantOpts : [{ value: '', label: '—' }]}
              />
              <TextArea label="Body" value={it.body} onChange={(body) => setItem(i, { ...it, body })} />
              <div className="grid grid-cols-2 gap-2">
                <TextField label="Time" value={it.time} placeholder="10:21" onChange={(time) => setItem(i, { ...it, time })} />
                <SelectField label="Receipt" value={it.status} onChange={(status) => setItem(i, { ...it, status })} options={CHAT_STATUS_OPTS} />
              </div>
              <ListHeader
                title="Attachments"
                onAdd={() =>
                  setItem(i, {
                    ...it,
                    attachments: [
                      ...it.attachments,
                      { id: crypto.randomUUID().slice(0, 6), name: 'file.pdf', size: '1.0 MB', kind: 'pdf', state: 'encrypted', meta: '' },
                    ],
                  })
                }
              />
              {it.attachments.map((a, ai) => {
                const setAtt = (att: typeof a) => {
                  const attachments = it.attachments.slice();
                  attachments[ai] = att;
                  setItem(i, { ...it, attachments });
                };
                return (
                  <div key={a.id} className="space-y-2 rounded-md border border-hair/70 bg-frost/40 p-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-semibold text-muted">File {ai + 1}</span>
                      <RemoveBtn onClick={() => setItem(i, { ...it, attachments: it.attachments.filter((_, j) => j !== ai) })} />
                    </div>
                    <TextField label="Name" value={a.name} onChange={(name) => setAtt({ ...a, name })} />
                    <div className="grid grid-cols-2 gap-2">
                      <TextField label="Size" value={a.size} onChange={(size) => setAtt({ ...a, size })} />
                      <TextField label="Meta" value={a.meta} placeholder="AES-256-GCM" onChange={(meta) => setAtt({ ...a, meta })} />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <SelectField label="Kind" value={a.kind} onChange={(kind) => setAtt({ ...a, kind })} options={FILE_KIND_OPTS} />
                      <SelectField label="State" value={a.state} onChange={(state) => setAtt({ ...a, state })} options={CIPHER_OPTS} />
                    </div>
                  </div>
                );
              })}
            </>
          ) : (
            <TextField label="Label" value={it.label} onChange={(label) => setItem(i, { ...it, label })} />
          )}
        </div>
      ))}
    </div>
  );
}

/* -------------------- sub-editors for the remaining plates ------------------ */

function ActivityFeedFields({ data, onChange }: { data: ActivityFeedData; onChange: (d: ActivityFeedData) => void }) {
  const set = (i: number, it: ActivityFeedData['items'][number]) => {
    const items = data.items.slice();
    items[i] = it;
    onChange({ ...data, items });
  };
  return (
    <div className="space-y-3">
      <TextField label="Panel title" value={data.title} onChange={(title) => onChange({ ...data, title })} />
      <ListHeader
        title="Items"
        onAdd={() => onChange({ ...data, items: [...data.items, { id: rid(), tone: 'info', title: 'New event', description: '', time: '', pulse: false }] })}
      />
      {data.items.map((it, i) => (
        <div key={it.id} className="space-y-2 rounded-md border border-hair p-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-ink">Item {i + 1}</span>
            <RemoveBtn onClick={() => onChange({ ...data, items: data.items.filter((_, j) => j !== i) })} />
          </div>
          <TextField label="Title" value={it.title} onChange={(title) => set(i, { ...it, title })} />
          <TextField label="Description" value={it.description} onChange={(description) => set(i, { ...it, description })} />
          <div className="grid grid-cols-2 gap-2">
            <TextField label="Time" value={it.time} placeholder="2m" onChange={(time) => set(i, { ...it, time })} />
            <SelectField label="Dot tone" value={it.tone} onChange={(tone) => set(i, { ...it, tone })} options={STATUS_TONE_OPTS} />
          </div>
          <Toggle label="Pulse" checked={it.pulse} onChange={(pulse) => set(i, { ...it, pulse })} />
        </div>
      ))}
    </div>
  );
}

function AreaChartFields({ data, onChange }: { data: AreaChartData; onChange: (d: AreaChartData) => void }) {
  return (
    <div className="space-y-3">
      <TextField label="Panel title" value={data.title} onChange={(title) => onChange({ ...data, title })} />
      <TextField label="Series" value={numList(data.data)} placeholder="12, 18, 15…" onChange={(v) => onChange({ ...data, data: parseNumList(v) })} />
      <TextField label="Compare series" value={numList(data.compare)} hint="Dashed faded line; blank = none." onChange={(v) => onChange({ ...data, compare: parseNumList(v) })} />
      <TextField label="X-axis ticks" value={strList(data.ticks)} placeholder="Apr, May, Jun…" onChange={(v) => onChange({ ...data, ticks: parseStrList(v) })} />
      <Segmented label="Tone" value={data.tone} onChange={(tone) => onChange({ ...data, tone })} options={AREA_TONE_OPTS} />
      <Toggle label="Smooth curve" checked={data.smooth} onChange={(smooth) => onChange({ ...data, smooth })} />
    </div>
  );
}

function BarChartFields({ data, onChange }: { data: BarChartData; onChange: (d: BarChartData) => void }) {
  const set = (i: number, b: BarChartData['bars'][number]) => {
    const bars = data.bars.slice();
    bars[i] = b;
    onChange({ ...data, bars });
  };
  return (
    <div className="space-y-3">
      <TextField label="Panel title" value={data.title} onChange={(title) => onChange({ ...data, title })} />
      <div className="grid grid-cols-2 gap-2">
        <Segmented label="Tone" value={data.tone} onChange={(tone) => onChange({ ...data, tone })} options={BAR_TONE_OPTS} />
        <Segmented label="Highlight" value={data.highlightTone} onChange={(highlightTone) => onChange({ ...data, highlightTone })} options={BAR_TONE_OPTS} />
      </div>
      <Toggle label="Show labels" checked={data.showLabels} onChange={(showLabels) => onChange({ ...data, showLabels })} />
      <ListHeader title="Bars" onAdd={() => onChange({ ...data, bars: [...data.bars, { value: 10, label: '', highlight: false }] })} />
      {data.bars.map((b, i) => (
        <div key={i} className="space-y-2 rounded-md border border-hair p-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-ink">Bar {i + 1}</span>
            <RemoveBtn onClick={() => onChange({ ...data, bars: data.bars.filter((_, j) => j !== i) })} />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <NumberField label="Value" value={b.value} onChange={(value) => set(i, { ...b, value })} />
            <TextField label="Label" value={b.label} onChange={(label) => set(i, { ...b, label })} />
          </div>
          <Toggle label="Highlight" checked={b.highlight} onChange={(highlight) => set(i, { ...b, highlight })} />
        </div>
      ))}
    </div>
  );
}

function DistributionBarFields({ data, onChange }: { data: DistributionBarData; onChange: (d: DistributionBarData) => void }) {
  const set = (i: number, s: DistributionBarData['segments'][number]) => {
    const segments = data.segments.slice();
    segments[i] = s;
    onChange({ ...data, segments });
  };
  return (
    <div className="space-y-3">
      <TextField label="Panel title" value={data.title} onChange={(title) => onChange({ ...data, title })} />
      <Toggle label="Show percent" checked={data.showPercent} onChange={(showPercent) => onChange({ ...data, showPercent })} />
      <Toggle label="Legend" checked={data.legend} onChange={(legend) => onChange({ ...data, legend })} />
      <ListHeader title="Segments" onAdd={() => onChange({ ...data, segments: [...data.segments, { label: 'New', value: 10, tone: 'fi' }] })} />
      {data.segments.map((s, i) => (
        <div key={i} className="space-y-2 rounded-md border border-hair p-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-ink">Segment {i + 1}</span>
            <RemoveBtn onClick={() => onChange({ ...data, segments: data.segments.filter((_, j) => j !== i) })} />
          </div>
          <TextField label="Label" value={s.label} onChange={(label) => set(i, { ...s, label })} />
          <div className="grid grid-cols-2 gap-2">
            <NumberField label="Value" value={s.value} min={0} onChange={(value) => set(i, { ...s, value })} />
            <SelectField label="Colour" value={s.tone} onChange={(tone) => set(i, { ...s, tone })} options={DIST_TONE_OPTS} />
          </div>
        </div>
      ))}
    </div>
  );
}

function HeatmapFields({ data, onChange }: { data: HeatmapData; onChange: (d: HeatmapData) => void }) {
  return (
    <div className="space-y-3">
      <TextField label="Panel title" value={data.title} onChange={(title) => onChange({ ...data, title })} />
      <div className="grid grid-cols-2 gap-2">
        <NumberField label="Columns" value={data.columns} min={1} onChange={(columns) => onChange({ ...data, columns })} />
        <NumberField label="Rows" value={data.rows} min={1} onChange={(rows) => onChange({ ...data, rows })} />
      </div>
      <Segmented label="Tone" value={data.tone} onChange={(tone) => onChange({ ...data, tone })} options={HEAT_TONE_OPTS} />
      <TextField label="Values" value={numList(data.values)} hint="Column-major: index = col × rows + row." onChange={(v) => onChange({ ...data, values: parseNumList(v) })} />
      <TextField label="Row labels" value={strList(data.rowLabels)} placeholder="M, , W, , F, , S" onChange={(v) => onChange({ ...data, rowLabels: v.split(',').map((x) => x.trim()) })} />
      <Toggle label="Legend" checked={data.legend} onChange={(legend) => onChange({ ...data, legend })} />
    </div>
  );
}

function KpiTileFields({ data, onChange }: { data: KpiTileData; onChange: (d: KpiTileData) => void }) {
  return (
    <div className="space-y-3">
      <TextField label="Label" value={data.label} onChange={(label) => onChange({ ...data, label })} />
      <TextField label="Value" value={data.value} onChange={(value) => onChange({ ...data, value })} />
      <TextField label="Hint" value={data.hint} onChange={(hint) => onChange({ ...data, hint })} />
      <Segmented label="Tone" value={data.tone} onChange={(tone) => onChange({ ...data, tone })} options={KPI_TONE_OPTS} />
    </div>
  );
}

function RankListFields({ data, onChange }: { data: RankListData; onChange: (d: RankListData) => void }) {
  const set = (i: number, it: RankListData['items'][number]) => {
    const items = data.items.slice();
    items[i] = it;
    onChange({ ...data, items });
  };
  return (
    <div className="space-y-3">
      <TextField label="Panel title" value={data.title} onChange={(title) => onChange({ ...data, title })} />
      <div className="grid grid-cols-2 gap-2">
        <Toggle label="Rank chips" checked={data.showRank} onChange={(showRank) => onChange({ ...data, showRank })} />
        <Toggle label="Meters" checked={data.showBar} onChange={(showBar) => onChange({ ...data, showBar })} />
      </div>
      <Segmented label="Default tone" value={data.tone} onChange={(tone) => onChange({ ...data, tone })} options={PROGRESS_TONE_OPTS} />
      <ListHeader title="Items" onAdd={() => onChange({ ...data, items: [...data.items, { label: 'New', value: 50, display: '', sub: '', tone: 'fi' }] })} />
      {data.items.map((it, i) => (
        <div key={i} className="space-y-2 rounded-md border border-hair p-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-ink">Item {i + 1}</span>
            <RemoveBtn onClick={() => onChange({ ...data, items: data.items.filter((_, j) => j !== i) })} />
          </div>
          <TextField label="Label" value={it.label} onChange={(label) => set(i, { ...it, label })} />
          <div className="grid grid-cols-2 gap-2">
            <NumberField label="Value" value={it.value} onChange={(value) => set(i, { ...it, value })} />
            <TextField label="Display" value={it.display} placeholder="$4.2M" onChange={(display) => set(i, { ...it, display })} />
          </div>
          <TextField label="Sub-line" value={it.sub} onChange={(sub) => set(i, { ...it, sub })} />
          <SelectField label="Tone" value={it.tone} onChange={(tone) => set(i, { ...it, tone })} options={PROGRESS_TONE_OPTS} />
        </div>
      ))}
    </div>
  );
}

function SparklineFields({ data, onChange }: { data: SparklineData; onChange: (d: SparklineData) => void }) {
  return (
    <div className="space-y-3">
      <TextField label="Panel title" value={data.title} onChange={(title) => onChange({ ...data, title })} />
      <TextField label="Series" value={numList(data.data)} placeholder="4, 6, 5, 9…" onChange={(v) => onChange({ ...data, data: parseNumList(v) })} />
      <Segmented label="Tone" value={data.tone} onChange={(tone) => onChange({ ...data, tone })} options={SPARK_TONE_OPTS} />
      <div className="grid grid-cols-2 gap-2">
        <Toggle label="Smooth" checked={data.smooth} onChange={(smooth) => onChange({ ...data, smooth })} />
        <Toggle label="End dot" checked={data.endDot} onChange={(endDot) => onChange({ ...data, endDot })} />
      </div>
    </div>
  );
}

function DeltaFields({ data, onChange }: { data: DeltaData; onChange: (d: DeltaData) => void }) {
  return (
    <div className="space-y-3">
      <NumberField label="Value" value={data.value} onChange={(value) => onChange({ ...data, value })} />
      <TextField label="Suffix" value={data.suffix} placeholder="%" onChange={(suffix) => onChange({ ...data, suffix })} />
      <Toggle label="Invert (down is good)" checked={data.invert} onChange={(invert) => onChange({ ...data, invert })} />
      <Segmented label="Tone" value={data.tone} onChange={(tone) => onChange({ ...data, tone })} options={DELTA_TONE_OPTS} />
    </div>
  );
}

function MetricPanelFields({ data, onChange }: { data: MetricPanelData; onChange: (d: MetricPanelData) => void }) {
  return (
    <div className="space-y-3">
      <TextField label="Panel title" value={data.title} onChange={(title) => onChange({ ...data, title })} />
      <TextField label="Figure" value={data.figureValue} onChange={(figureValue) => onChange({ ...data, figureValue })} />
      <TextField label="Caption" value={data.figureCaption} onChange={(figureCaption) => onChange({ ...data, figureCaption })} />
      <TextField label="Sparkline values" value={numList(data.spark)} onChange={(v) => onChange({ ...data, spark: parseNumList(v) })} />
      <TextField label="Bar values" value={numList(data.bars)} onChange={(v) => onChange({ ...data, bars: parseNumList(v) })} />
    </div>
  );
}

function DataTableFields({ data, onChange }: { data: DataTableData; onChange: (d: DataTableData) => void }) {
  const setCol = (i: number, c: DataTableData['columns'][number]) => {
    const columns = data.columns.slice();
    columns[i] = c;
    onChange({ ...data, columns });
  };
  const rowsText = data.rows.map((r) => r.join(', ')).join('\n');
  return (
    <div className="space-y-3">
      <TextField label="Panel title" value={data.title} onChange={(title) => onChange({ ...data, title })} />
      <Toggle label="Zebra rows" checked={data.zebra} onChange={(zebra) => onChange({ ...data, zebra })} />
      <ListHeader title="Columns" onAdd={() => onChange({ ...data, columns: [...data.columns, { key: rid(), header: 'Column', align: 'left' }] })} />
      {data.columns.map((col, i) => (
        <div key={i} className="space-y-2 rounded-md border border-hair p-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-ink">Column {i + 1}</span>
            <RemoveBtn onClick={() => onChange({ ...data, columns: data.columns.filter((_, j) => j !== i) })} />
          </div>
          <TextField label="Header" value={col.header} onChange={(header) => setCol(i, { ...col, header })} />
          <Segmented label="Align" value={col.align} onChange={(align) => setCol(i, { ...col, align })} options={ALIGN_OPTS} />
        </div>
      ))}
      <TextArea
        label="Rows (one per line, cells comma-separated)"
        rows={6}
        value={rowsText}
        onChange={(v) => onChange({ ...data, rows: v.split('\n').filter((l) => l.trim()).map((l) => l.split(',').map((c) => c.trim())) })}
      />
    </div>
  );
}

function BoardFields({ data, onChange }: { data: BoardData; onChange: (d: BoardData) => void }) {
  const setCol = (i: number, c: BoardData['columns'][number]) => {
    const columns = data.columns.slice();
    columns[i] = c;
    onChange({ ...data, columns });
  };
  return (
    <div className="space-y-3">
      <ListHeader title="Columns" onAdd={() => onChange({ ...data, columns: [...data.columns, { id: rid(), title: 'New lane', count: 0, tone: 'idle', cards: [] }] })} />
      {data.columns.map((col, ci) => {
        const setCard = (k: number, card: BoardData['columns'][number]['cards'][number]) => {
          const cards = col.cards.slice();
          cards[k] = card;
          setCol(ci, { ...col, cards });
        };
        return (
          <div key={col.id} className="space-y-2 rounded-md border border-hair p-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-ink">Lane {ci + 1}</span>
              <RemoveBtn onClick={() => onChange({ ...data, columns: data.columns.filter((_, j) => j !== ci) })} />
            </div>
            <TextField label="Title" value={col.title} onChange={(title) => setCol(ci, { ...col, title })} />
            <div className="grid grid-cols-2 gap-2">
              <NumberField label="Count" value={col.count} onChange={(count) => setCol(ci, { ...col, count })} />
              <SelectField label="Lane dot" value={col.tone} onChange={(tone) => setCol(ci, { ...col, tone })} options={STATUS_TONE_OPTS} />
            </div>
            <ListHeader
              title="Cards"
              onAdd={() => setCol(ci, { ...col, cards: [...col.cards, { title: 'New card', subtitle: '', status: 'Active', statusTone: 'ok', accent: 'none', flagged: false, leading: 'none' }] })}
            />
            {col.cards.map((card, k) => (
              <details key={k} className="rounded-md border border-hair/70 p-2">
                <summary className="cursor-pointer text-[11px] font-semibold text-muted">Card {k + 1} · {card.title}</summary>
                <div className="mt-2 space-y-2">
                  <KanbanCardFields data={card} onChange={(c) => setCard(k, c)} />
                  <RemoveBtn onClick={() => setCol(ci, { ...col, cards: col.cards.filter((_, j) => j !== k) })} />
                </div>
              </details>
            ))}
          </div>
        );
      })}
    </div>
  );
}

function BreadcrumbFields({ data, onChange }: { data: BreadcrumbData; onChange: (d: BreadcrumbData) => void }) {
  const set = (i: number, c: BreadcrumbData['items'][number]) => {
    const items = data.items.slice();
    items[i] = c;
    onChange({ ...data, items });
  };
  return (
    <div className="space-y-3">
      <Toggle label="Back caret" checked={data.showBack} onChange={(showBack) => onChange({ ...data, showBack })} />
      <ListHeader title="Crumbs" onAdd={() => onChange({ ...data, items: [...data.items, { label: 'New', href: '' }] })} />
      {data.items.map((c, i) => (
        <div key={i} className="space-y-2 rounded-md border border-hair p-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-ink">Crumb {i + 1}</span>
            <RemoveBtn onClick={() => onChange({ ...data, items: data.items.filter((_, j) => j !== i) })} />
          </div>
          <TextField label="Label" value={c.label} onChange={(label) => set(i, { ...c, label })} />
          <TextField label="Href (blank = current)" value={c.href} onChange={(href) => set(i, { ...c, href })} />
        </div>
      ))}
    </div>
  );
}

function ConnectorCardFields({ data, onChange }: { data: ConnectorCardData; onChange: (d: ConnectorCardData) => void }) {
  return (
    <div className="space-y-3">
      <TextField label="Name" value={data.name} onChange={(name) => onChange({ ...data, name })} />
      <TextField label="Descriptor" value={data.descriptor} onChange={(descriptor) => onChange({ ...data, descriptor })} />
      <SelectField label="Icon" value={data.icon} onChange={(icon) => onChange({ ...data, icon })} options={APP_ICON_OPTS_OPTIONAL} />
      <TextField label="Status" value={data.status} onChange={(status) => onChange({ ...data, status })} />
      <Segmented label="Status tone" value={data.statusTone} onChange={(statusTone) => onChange({ ...data, statusTone })} options={STATUS_TONE_OPTS} />
      <Toggle label="Pulse (live)" checked={data.pulse} onChange={(pulse) => onChange({ ...data, pulse })} />
    </div>
  );
}

function TabsListEditor({ tabs, onChange }: { tabs: TabItemData[]; onChange: (t: TabItemData[]) => void }) {
  const set = (i: number, t: TabItemData) => {
    const next = tabs.slice();
    next[i] = t;
    onChange(next);
  };
  return (
    <div className="space-y-2">
      <ListHeader title="Tabs" onAdd={() => onChange([...tabs, { value: rid(), label: 'New', count: -1 }])} />
      {tabs.map((t, i) => (
        <div key={i} className="space-y-2 rounded-md border border-hair p-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-ink">Tab {i + 1}</span>
            <RemoveBtn onClick={() => onChange(tabs.filter((_, j) => j !== i))} />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <TextField label="Value (id)" value={t.value} onChange={(value) => set(i, { ...t, value })} />
            <NumberField label="Count (−1 hides)" value={t.count} onChange={(count) => set(i, { ...t, count })} />
          </div>
          <TextField label="Label" value={t.label} onChange={(label) => set(i, { ...t, label })} />
        </div>
      ))}
    </div>
  );
}

function PageHeaderFields({ data, onChange }: { data: PageHeaderData; onChange: (d: PageHeaderData) => void }) {
  return (
    <div className="space-y-3">
      <TextField label="Eyebrow" value={data.eyebrow} onChange={(eyebrow) => onChange({ ...data, eyebrow })} />
      <TextField label="Title" value={data.title} onChange={(title) => onChange({ ...data, title })} />
      <TextField label="Description" value={data.description} onChange={(description) => onChange({ ...data, description })} />
      <TextField label="Primary action (blank = none)" value={data.primaryAction} onChange={(primaryAction) => onChange({ ...data, primaryAction })} />
      <TextField label="Active tab (value)" value={data.activeTab} onChange={(activeTab) => onChange({ ...data, activeTab })} />
      <TabsListEditor tabs={data.tabs} onChange={(tabs) => onChange({ ...data, tabs })} />
    </div>
  );
}

function NavNodesEditor({ nodes, depth = 0, onChange }: { nodes: NavNodeData[]; depth?: number; onChange: (n: NavNodeData[]) => void }) {
  const set = (i: number, n: NavNodeData) => {
    const next = nodes.slice();
    next[i] = n;
    onChange(next);
  };
  return (
    <div className="space-y-2">
      <ListHeader
        title={depth === 0 ? 'Nodes' : 'Children'}
        onAdd={() => onChange([...nodes, { id: rid(), label: 'New node', icon: 'none', done: false, children: [] }])}
      />
      {nodes.map((n, i) => (
        <div key={n.id} className="space-y-2 rounded-md border border-hair p-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-ink">
              Node · <code className="text-[11px] text-muted">{n.id}</code>
            </span>
            <RemoveBtn onClick={() => onChange(nodes.filter((_, j) => j !== i))} />
          </div>
          <TextField label="Label" value={n.label} onChange={(label) => set(i, { ...n, label })} />
          <div className="grid grid-cols-2 gap-2">
            <SelectField label="Icon (leaf)" value={n.icon} onChange={(icon) => set(i, { ...n, icon })} options={APP_ICON_OPTS_OPTIONAL} />
            <Toggle label="Done" checked={n.done} onChange={(done) => set(i, { ...n, done })} />
          </div>
          {depth < 1 && (
            <details className="rounded-md border border-hair/70 p-2">
              <summary className="cursor-pointer text-[11px] font-semibold text-muted">Children ({n.children.length})</summary>
              <div className="mt-2">
                <NavNodesEditor nodes={n.children} depth={depth + 1} onChange={(children) => set(i, { ...n, children })} />
              </div>
            </details>
          )}
        </div>
      ))}
    </div>
  );
}

function NavTreeFields({ data, onChange }: { data: NavTreeData; onChange: (d: NavTreeData) => void }) {
  return (
    <div className="space-y-3">
      <TextField label="Title" value={data.title} onChange={(title) => onChange({ ...data, title })} />
      <div className="grid grid-cols-2 gap-2">
        <TextField label="Active node id" value={data.activeId} onChange={(activeId) => onChange({ ...data, activeId })} />
        <TextField label="Expanded ids" value={strList(data.expandedIds)} onChange={(v) => onChange({ ...data, expandedIds: parseStrList(v) })} />
      </div>
      <NavNodesEditor nodes={data.nodes} onChange={(nodes) => onChange({ ...data, nodes })} />
    </div>
  );
}

function EntityListFields({ data, onChange }: { data: EntityListData; onChange: (d: EntityListData) => void }) {
  const set = (i: number, it: EntityListData['items'][number]) => {
    const items = data.items.slice();
    items[i] = it;
    onChange({ ...data, items });
  };
  return (
    <div className="space-y-3">
      <TextField label="Panel title" value={data.title} onChange={(title) => onChange({ ...data, title })} />
      <div className="grid grid-cols-2 gap-2">
        <TextField label="Selected id" value={data.selectedId} onChange={(selectedId) => onChange({ ...data, selectedId })} />
        <Toggle label="Numbered" checked={data.numbered} onChange={(numbered) => onChange({ ...data, numbered })} />
      </div>
      <ListHeader title="Entities" onAdd={() => onChange({ ...data, items: [...data.items, { id: rid(), label: 'New entity', tone: 'info', score: 50, meta: '' }] })} />
      {data.items.map((it, i) => (
        <div key={it.id} className="space-y-2 rounded-md border border-hair p-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-ink">Entity {i + 1}</span>
            <RemoveBtn onClick={() => onChange({ ...data, items: data.items.filter((_, j) => j !== i) })} />
          </div>
          <TextField label="Label" value={it.label} onChange={(label) => set(i, { ...it, label })} />
          <div className="grid grid-cols-2 gap-2">
            <SelectField label="Tone" value={it.tone} onChange={(tone) => set(i, { ...it, tone })} options={STATUS_TONE_OPTS} />
            <NumberField label="Score" value={it.score} min={0} max={100} onChange={(score) => set(i, { ...it, score })} />
          </div>
          <TextField label="Meta" value={it.meta} onChange={(meta) => set(i, { ...it, meta })} />
        </div>
      ))}
    </div>
  );
}

function SidebarFields({ data, onChange }: { data: SidebarData; onChange: (d: SidebarData) => void }) {
  const set = (i: number, it: SidebarData['items'][number]) => {
    const items = data.items.slice();
    items[i] = it;
    onChange({ ...data, items });
  };
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2">
        <TextField label="Brand name" value={data.brandName} onChange={(brandName) => onChange({ ...data, brandName })} />
        <SelectField label="Brand mark" value={data.brandMark} onChange={(brandMark) => onChange({ ...data, brandMark })} options={APP_ICON_OPTS_OPTIONAL} />
      </div>
      <ListHeader title="Items" onAdd={() => onChange({ ...data, items: [...data.items, { id: rid(), label: 'New', icon: 'shield-check', active: false, section: '' }] })} />
      {data.items.map((it, i) => (
        <div key={it.id} className="space-y-2 rounded-md border border-hair p-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-ink">Item {i + 1}</span>
            <RemoveBtn onClick={() => onChange({ ...data, items: data.items.filter((_, j) => j !== i) })} />
          </div>
          <TextField label="Label" value={it.label} onChange={(label) => set(i, { ...it, label })} />
          <div className="grid grid-cols-2 gap-2">
            <SelectField label="Icon" value={it.icon} onChange={(icon) => set(i, { ...it, icon })} options={APP_ICON_OPTS} />
            <Toggle label="Active" checked={it.active} onChange={(active) => set(i, { ...it, active })} />
          </div>
          <TextField label="Section heading (blank = none)" value={it.section} onChange={(section) => set(i, { ...it, section })} />
        </div>
      ))}
    </div>
  );
}

function AppHeaderFields({ data, onChange }: { data: AppHeaderData; onChange: (d: AppHeaderData) => void }) {
  const setAction = (i: number, v: AppHeaderData['actions'][number]) => {
    const actions = data.actions.slice();
    actions[i] = v;
    onChange({ ...data, actions });
  };
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2">
        <TextField label="Brand name" value={data.brandName} onChange={(brandName) => onChange({ ...data, brandName })} />
        <SelectField label="Brand mark" value={data.brandMark} onChange={(brandMark) => onChange({ ...data, brandMark })} options={APP_ICON_OPTS_OPTIONAL} />
      </div>
      <TextField label="Search placeholder (blank = none)" value={data.searchPlaceholder} onChange={(searchPlaceholder) => onChange({ ...data, searchPlaceholder })} />
      <TextField label="Avatar name (blank = none)" value={data.avatarName} onChange={(avatarName) => onChange({ ...data, avatarName })} />
      <ListHeader title="Action glyphs" onAdd={() => onChange({ ...data, actions: [...data.actions, 'share'] })} />
      {data.actions.map((a, i) => (
        <div key={i} className="flex items-end gap-2">
          <div className="flex-1">
            <SelectField label={`Action ${i + 1}`} value={a} onChange={(v) => setAction(i, v)} options={APP_ICON_OPTS} />
          </div>
          <RemoveBtn onClick={() => onChange({ ...data, actions: data.actions.filter((_, j) => j !== i) })} />
        </div>
      ))}
    </div>
  );
}

function ToolbarFields({ data, onChange }: { data: ToolbarData; onChange: (d: ToolbarData) => void }) {
  const setSel = (i: number, s: ToolbarData['selects'][number]) => {
    const selects = data.selects.slice();
    selects[i] = s;
    onChange({ ...data, selects });
  };
  const setBtn = (i: number, b: ToolbarData['buttons'][number]) => {
    const buttons = data.buttons.slice();
    buttons[i] = b;
    onChange({ ...data, buttons });
  };
  return (
    <div className="space-y-3">
      <TextField label="Search placeholder (blank = none)" value={data.searchPlaceholder} onChange={(searchPlaceholder) => onChange({ ...data, searchPlaceholder })} />
      <ListHeader title="Selects" onAdd={() => onChange({ ...data, selects: [...data.selects, { value: 'Filter', icon: 'none' }] })} />
      {data.selects.map((s, i) => (
        <div key={i} className="space-y-2 rounded-md border border-hair p-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-ink">Select {i + 1}</span>
            <RemoveBtn onClick={() => onChange({ ...data, selects: data.selects.filter((_, j) => j !== i) })} />
          </div>
          <TextField label="Value" value={s.value} onChange={(value) => setSel(i, { ...s, value })} />
          <SelectField label="Icon" value={s.icon} onChange={(icon) => setSel(i, { ...s, icon })} options={APP_ICON_OPTS_OPTIONAL} />
        </div>
      ))}
      <ListHeader title="Buttons" onAdd={() => onChange({ ...data, buttons: [...data.buttons, { label: 'Action', variant: 'secondary', icon: 'none' }] })} />
      {data.buttons.map((b, i) => (
        <div key={i} className="space-y-2 rounded-md border border-hair p-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-ink">Button {i + 1}</span>
            <RemoveBtn onClick={() => onChange({ ...data, buttons: data.buttons.filter((_, j) => j !== i) })} />
          </div>
          <TextField label="Label" value={b.label} onChange={(label) => setBtn(i, { ...b, label })} />
          <div className="grid grid-cols-2 gap-2">
            <SelectField label="Variant" value={b.variant} onChange={(variant) => setBtn(i, { ...b, variant })} options={BUTTON_VARIANT_OPTS} />
            <SelectField label="Icon" value={b.icon} onChange={(icon) => setBtn(i, { ...b, icon })} options={APP_ICON_OPTS_OPTIONAL} />
          </div>
        </div>
      ))}
    </div>
  );
}

function PanelFields({ data, onChange }: { data: PanelData; onChange: (d: PanelData) => void }) {
  return (
    <div className="space-y-3">
      <TextField label="Title" value={data.title} onChange={(title) => onChange({ ...data, title })} />
      <SelectField label="Header icon" value={data.icon} onChange={(icon) => onChange({ ...data, icon })} options={APP_ICON_OPTS_OPTIONAL} />
      <TextArea label="Body" value={data.body} rows={4} onChange={(body) => onChange({ ...data, body })} />
      <TextField label="Footer (blank = none)" value={data.footer} onChange={(footer) => onChange({ ...data, footer })} />
    </div>
  );
}

function WorkspaceLayoutFields({ data, onChange }: { data: WorkspaceLayoutData; onChange: (d: WorkspaceLayoutData) => void }) {
  return (
    <div className="space-y-3">
      <details open className="rounded-md border border-hair p-2.5">
        <summary className="cursor-pointer text-xs font-semibold text-ink">Header</summary>
        <div className="mt-2">
          <AppHeaderFields data={data.header} onChange={(header) => onChange({ ...data, header })} />
        </div>
      </details>
      <details className="rounded-md border border-hair p-2.5">
        <summary className="cursor-pointer text-xs font-semibold text-ink">Sidebar (rail)</summary>
        <div className="mt-2">
          <SidebarFields data={data.rail} onChange={(rail) => onChange({ ...data, rail })} />
        </div>
      </details>
      <details className="rounded-md border border-hair p-2.5">
        <summary className="cursor-pointer text-xs font-semibold text-ink">Nav tree</summary>
        <div className="mt-2">
          <NavTreeFields data={data.nav} onChange={(nav) => onChange({ ...data, nav })} />
        </div>
      </details>
      <details className="rounded-md border border-hair p-2.5">
        <summary className="cursor-pointer text-xs font-semibold text-ink">Main panel</summary>
        <div className="mt-2">
          <PanelFields data={data.panel} onChange={(panel) => onChange({ ...data, panel })} />
        </div>
      </details>
    </div>
  );
}

function AvatarFields({ data, onChange }: { data: AvatarData; onChange: (d: AvatarData) => void }) {
  const presenceOpts: { value: AvatarData['presence']; label: string }[] = [
    { value: 'none', label: 'None' },
    ...STATUS_TONE_OPTS,
  ];
  return (
    <div className="space-y-3">
      <TextField label="Name (initials fallback)" value={data.name} onChange={(name) => onChange({ ...data, name })} />
      <TextField label="Image URL (blank = initials)" value={data.src} onChange={(src) => onChange({ ...data, src })} />
      <Segmented label="Size" value={data.size} onChange={(size) => onChange({ ...data, size })} options={AVATAR_SIZE_OPTS} />
      <SelectField label="Presence dot" value={data.presence} onChange={(presence) => onChange({ ...data, presence })} options={presenceOpts} />
    </div>
  );
}

function BadgeFields({ data, onChange }: { data: BadgeData; onChange: (d: BadgeData) => void }) {
  return (
    <div className="space-y-3">
      <TextField label="Text" value={data.text} onChange={(text) => onChange({ ...data, text })} />
      <Segmented label="Variant" value={data.variant} onChange={(variant) => onChange({ ...data, variant })} options={BADGE_VARIANT_OPTS} />
      <SelectField label="Tone" value={data.tone} onChange={(tone) => onChange({ ...data, tone })} options={BADGE_TONE_OPTS} />
      <SelectField label="Icon" value={data.icon} onChange={(icon) => onChange({ ...data, icon })} options={APP_ICON_OPTS_OPTIONAL} />
    </div>
  );
}

function ButtonFields({ data, onChange }: { data: ButtonData; onChange: (d: ButtonData) => void }) {
  return (
    <div className="space-y-3">
      <TextField label="Label" value={data.label} onChange={(label) => onChange({ ...data, label })} />
      <div className="grid grid-cols-2 gap-2">
        <SelectField label="Variant" value={data.variant} onChange={(variant) => onChange({ ...data, variant })} options={BUTTON_VARIANT_OPTS} />
        <Segmented label="Size" value={data.size} onChange={(size) => onChange({ ...data, size })} options={BUTTON_SIZE_OPTS} />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <SelectField label="Left icon" value={data.leftIcon} onChange={(leftIcon) => onChange({ ...data, leftIcon })} options={APP_ICON_OPTS_OPTIONAL} />
        <SelectField label="Right icon" value={data.rightIcon} onChange={(rightIcon) => onChange({ ...data, rightIcon })} options={APP_ICON_OPTS_OPTIONAL} />
      </div>
      <Toggle label="Full width" checked={data.fullWidth} onChange={(fullWidth) => onChange({ ...data, fullWidth })} />
    </div>
  );
}

function IconButtonFields({ data, onChange }: { data: IconButtonData; onChange: (d: IconButtonData) => void }) {
  return (
    <div className="space-y-3">
      <SelectField label="Icon" value={data.icon} onChange={(icon) => onChange({ ...data, icon })} options={APP_ICON_OPTS} />
      <TextField label="Accessible label" value={data.label} onChange={(label) => onChange({ ...data, label })} />
      <div className="grid grid-cols-2 gap-2">
        <Segmented label="Size" value={data.size} onChange={(size) => onChange({ ...data, size })} options={DOT_SIZE_OPTS} />
        <SelectField label="Variant" value={data.variant} onChange={(variant) => onChange({ ...data, variant })} options={ICONBTN_VARIANT_OPTS} />
      </div>
      <NumberField label="Badge count (−1 hides)" value={data.badge} onChange={(badge) => onChange({ ...data, badge })} />
      <Toggle label="Active" checked={data.active} onChange={(active) => onChange({ ...data, active })} />
    </div>
  );
}

function PageDotsFields({ data, onChange }: { data: PageDotsData; onChange: (d: PageDotsData) => void }) {
  return (
    <div className="grid grid-cols-2 gap-2">
      <NumberField label="Count" value={data.count} min={1} onChange={(count) => onChange({ ...data, count })} />
      <NumberField label="Active (0-based)" value={data.active} min={0} onChange={(active) => onChange({ ...data, active })} />
    </div>
  );
}

function ProgressBarFields({ data, onChange }: { data: ProgressBarData; onChange: (d: ProgressBarData) => void }) {
  return (
    <div className="space-y-3">
      <NumberField label="Value (0–100)" value={data.value} min={0} max={100} onChange={(value) => onChange({ ...data, value })} />
      <div className="grid grid-cols-2 gap-2">
        <SelectField label="Tone" value={data.tone} onChange={(tone) => onChange({ ...data, tone })} options={PROGRESS_TONE_OPTS} />
        <Segmented label="Size" value={data.size} onChange={(size) => onChange({ ...data, size })} options={SM_MD_OPTS} />
      </div>
      <TextField label="Accessible label" value={data.label} onChange={(label) => onChange({ ...data, label })} />
      <Toggle label="Show value" checked={data.showValue} onChange={(showValue) => onChange({ ...data, showValue })} />
    </div>
  );
}

function SearchInputFields({ data, onChange }: { data: SearchInputData; onChange: (d: SearchInputData) => void }) {
  return (
    <div className="space-y-3">
      <TextField label="Placeholder" value={data.placeholder} onChange={(placeholder) => onChange({ ...data, placeholder })} />
      <TextField label="Value (filled text)" value={data.value} onChange={(value) => onChange({ ...data, value })} />
      <div className="grid grid-cols-2 gap-2">
        <Segmented label="Size" value={data.size} onChange={(size) => onChange({ ...data, size })} options={MD_LG_OPTS} />
        <TextField label="Kbd hint" value={data.kbdHint} placeholder="⌘K" onChange={(kbdHint) => onChange({ ...data, kbdHint })} />
      </div>
    </div>
  );
}

function SegmentedControlFields({ data, onChange }: { data: SegmentedControlData; onChange: (d: SegmentedControlData) => void }) {
  const set = (i: number, s: SegmentedControlData['segments'][number]) => {
    const segments = data.segments.slice();
    segments[i] = s;
    onChange({ ...data, segments });
  };
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2">
        <TextField label="Active value" value={data.value} onChange={(value) => onChange({ ...data, value })} />
        <Segmented label="Size" value={data.size} onChange={(size) => onChange({ ...data, size })} options={SM_MD_OPTS} />
      </div>
      <ListHeader title="Segments" onAdd={() => onChange({ ...data, segments: [...data.segments, { value: rid(), label: 'New' }] })} />
      {data.segments.map((s, i) => (
        <div key={i} className="flex items-end gap-2 rounded-md border border-hair p-2.5">
          <div className="flex-1 space-y-2">
            <TextField label="Value" value={s.value} onChange={(value) => set(i, { ...s, value })} />
            <TextField label="Label" value={s.label} onChange={(label) => set(i, { ...s, label })} />
          </div>
          <RemoveBtn onClick={() => onChange({ ...data, segments: data.segments.filter((_, j) => j !== i) })} />
        </div>
      ))}
    </div>
  );
}

function SelectFields({ data, onChange }: { data: SelectData; onChange: (d: SelectData) => void }) {
  return (
    <div className="space-y-3">
      <TextField label="Value (blank = placeholder)" value={data.value} onChange={(value) => onChange({ ...data, value })} />
      <TextField label="Placeholder" value={data.placeholder} onChange={(placeholder) => onChange({ ...data, placeholder })} />
      <SelectField label="Left icon" value={data.leftIcon} onChange={(leftIcon) => onChange({ ...data, leftIcon })} options={APP_ICON_OPTS_OPTIONAL} />
      <div className="grid grid-cols-2 gap-2">
        <Segmented label="Size" value={data.size} onChange={(size) => onChange({ ...data, size })} options={SM_MD_OPTS} />
        <Toggle label="Active" checked={data.active} onChange={(active) => onChange({ ...data, active })} />
      </div>
    </div>
  );
}

function StatusBadgeFields({ data, onChange }: { data: StatusBadgeData; onChange: (d: StatusBadgeData) => void }) {
  return (
    <div className="space-y-3">
      <TextField label="Label" value={data.label} onChange={(label) => onChange({ ...data, label })} />
      <Segmented label="Tone" value={data.tone} onChange={(tone) => onChange({ ...data, tone })} options={STATUS_TONE_OPTS} />
      <div className="grid grid-cols-2 gap-2">
        <Toggle label="Caret" checked={data.caret} onChange={(caret) => onChange({ ...data, caret })} />
        <Toggle label="Pulse" checked={data.pulse} onChange={(pulse) => onChange({ ...data, pulse })} />
      </div>
    </div>
  );
}

function StatusDotFields({ data, onChange }: { data: StatusDotData; onChange: (d: StatusDotData) => void }) {
  return (
    <div className="space-y-3">
      <Segmented label="Tone" value={data.tone} onChange={(tone) => onChange({ ...data, tone })} options={STATUS_TONE_OPTS} />
      <div className="grid grid-cols-2 gap-2">
        <Segmented label="Size" value={data.size} onChange={(size) => onChange({ ...data, size })} options={DOT_SIZE_OPTS} />
        <Toggle label="Pulse" checked={data.pulse} onChange={(pulse) => onChange({ ...data, pulse })} />
      </div>
      <TextField label="Accessible label" value={data.label} onChange={(label) => onChange({ ...data, label })} />
    </div>
  );
}

function TabsFields({ data, onChange }: { data: TabsData; onChange: (d: TabsData) => void }) {
  return (
    <div className="space-y-3">
      <TextField label="Active value" value={data.value} onChange={(value) => onChange({ ...data, value })} />
      <TabsListEditor tabs={data.tabs} onChange={(tabs) => onChange({ ...data, tabs })} />
    </div>
  );
}

function WindowChromeFields({ data, onChange }: { data: WindowChromeData; onChange: (d: WindowChromeData) => void }) {
  return (
    <div className="space-y-3">
      <TextField label="Title" value={data.title} onChange={(title) => onChange({ ...data, title })} />
      <Segmented label="Tone" value={data.tone} onChange={(tone) => onChange({ ...data, tone })} options={WINDOW_TONE_OPTS} />
    </div>
  );
}

function FingerprintFields({
  value,
  onChange,
}: {
  value: FingerprintConfig;
  onChange: (c: FingerprintConfig) => void;
}) {
  const set = <K extends keyof FingerprintConfig>(key: K, v: FingerprintConfig[K]) =>
    onChange({ ...value, [key]: v });
  return (
    <div className="space-y-3">
      <TextField
        label="Seed"
        value={value.seed}
        mono
        onChange={(seed) => set('seed', seed)}
        hint="Any string — the same seed always paints the same print."
      />
      <button
        type="button"
        onClick={() => set('seed', Math.random().toString(36).slice(2, 10))}
        className="w-full rounded-md border border-dashed border-hair px-2.5 py-1.5 text-xs font-medium text-cobalt transition hover:bg-cobalt/5"
      >
        Randomise seed
      </button>
      <Segmented
        label="Pattern"
        value={value.pattern}
        onChange={(pattern) => set('pattern', pattern)}
        options={FINGERPRINT_PATTERN_OPTIONS}
      />
      <Scrubber
        label="Density"
        value={value.density}
        min={0}
        max={1}
        step={0.01}
        unit="%"
        displayScale={100}
        onChange={(density) => set('density', density)}
      />
      <Scrubber
        label="Ridge weight"
        value={value.weight}
        min={0}
        max={1}
        step={0.01}
        unit="%"
        displayScale={100}
        onChange={(weight) => set('weight', weight)}
      />
      <Scrubber
        label="Bridges"
        value={value.bridges}
        min={0}
        max={6}
        step={1}
        onChange={(bridges) => set('bridges', bridges)}
      />
      <Scrubber
        label="Edge padding"
        value={value.padding}
        min={0}
        max={0.3}
        step={0.01}
        unit="%"
        displayScale={100}
        onChange={(padding) => set('padding', padding)}
      />
      <ColorField label="Ridge colour" value={value.color} onChange={(color) => set('color', color)} />
      <Toggle
        label="Round ridge caps"
        checked={value.roundCaps}
        onChange={(roundCaps) => set('roundCaps', roundCaps)}
      />
      <Toggle
        label="Solid background"
        checked={value.background != null}
        onChange={(on) => set('background', on ? '#0D1B3E' : null)}
      />
      {value.background != null && (
        <ColorField
          label="Background"
          value={value.background}
          onChange={(bg) => set('background', bg)}
        />
      )}
    </div>
  );
}

/* ------------------------------ main switch ------------------------------ */

export function ForegroundContentEditor({
  content,
  onChange,
}: {
  content: ForegroundContent;
  onChange: (c: ForegroundContent) => void;
}) {
  switch (content.type) {
    case 'none':
      return <p className="text-xs text-muted">No foreground component. Pick one above to add and edit content.</p>;

    case 'OverlapAlert':
      return <AlertFields alert={content} onChange={(a) => onChange({ type: 'OverlapAlert', ...a })} />;

    case 'RiskPill':
      return (
        <Segmented
          label="Tier"
          value={content.tier}
          onChange={(tier) => onChange({ type: 'RiskPill', tier })}
          options={TIER_OPTS}
        />
      );

    case 'ConnectorNode':
      return (
        <div className="space-y-3">
          <NumberField
            label="Match count"
            value={content.matches}
            min={0}
            onChange={(matches) => onChange({ ...content, type: 'ConnectorNode', matches })}
          />
          <div className="grid grid-cols-2 gap-2">
            <NumberField
              label="Left connections"
              value={content.leftConnections ?? 3}
              min={0}
              max={8}
              onChange={(leftConnections) => onChange({ ...content, type: 'ConnectorNode', leftConnections })}
            />
            <NumberField
              label="Right connections"
              value={content.rightConnections ?? 3}
              min={0}
              max={8}
              onChange={(rightConnections) => onChange({ ...content, type: 'ConnectorNode', rightConnections })}
            />
          </div>
        </div>
      );

    case 'Pattern':
      return <PatternControls value={content} onChange={(p) => onChange({ type: 'Pattern', ...p })} />;

    case 'Fingerprint':
      return <FingerprintFields value={content} onChange={(c) => onChange({ type: 'Fingerprint', ...c })} />;

    case 'CaseCard':
      return (
        <CaseDataFields
          data={content.data}
          reveal={content.reveal}
          onData={(data) => onChange({ ...content, data })}
          onReveal={(reveal) => onChange({ ...content, reveal })}
        />
      );

    case 'ActivityTimeline':
      return (
        <TimelineFields
          timeline={content}
          onChange={(t) => onChange({ type: 'ActivityTimeline', ...t })}
        />
      );

    case 'FeatureModal':
      return <FeatureModalFields data={content} onChange={(d) => onChange({ type: 'FeatureModal', ...d })} />;

    case 'CodeWindow':
      return <CodeWindowFields data={content} onChange={(d) => onChange({ type: 'CodeWindow', ...d })} />;

    case 'EntityGraph':
      return <EntityGraphFields data={content} onChange={(d) => onChange({ type: 'EntityGraph', ...d })} />;

    case 'StatCard':
      return <StatCardFields data={content} onChange={(d) => onChange({ type: 'StatCard', ...d })} />;

    case 'KanbanCard':
      return <KanbanCardFields data={content} onChange={(d) => onChange({ type: 'KanbanCard', ...d })} />;

    case 'CommandPalette':
      return <CommandPaletteFields data={content} onChange={(d) => onChange({ type: 'CommandPalette', ...d })} />;

    case 'DonutChart':
      return <DonutChartFields data={content} onChange={(d) => onChange({ type: 'DonutChart', ...d })} />;

    case 'GaugeArc':
      return <GaugeArcFields data={content} onChange={(d) => onChange({ type: 'GaugeArc', ...d })} />;

    case 'SecureChat':
      return <SecureChatFields data={content} onChange={(d) => onChange({ type: 'SecureChat', ...d })} />;

    case 'DeconflictBanner':
      return (
        <div className="space-y-4">
          <NumberField label="Match count" value={content.matches} min={0} onChange={(matches) => onChange({ ...content, matches })} />
          <details open className="rounded-md border border-hair p-2.5">
            <summary className="cursor-pointer text-xs font-semibold text-ink">Alert</summary>
            <div className="mt-2">
              <AlertFields alert={content.alert} onChange={(alert) => onChange({ ...content, alert })} />
            </div>
          </details>
          <details className="rounded-md border border-hair p-2.5">
            <summary className="cursor-pointer text-xs font-semibold text-ink">Left case</summary>
            <div className="mt-2">
              <CaseDataFields
                data={content.leftCase}
                reveal={content.leftReveal}
                onData={(leftCase) => onChange({ ...content, leftCase })}
                onReveal={(leftReveal) => onChange({ ...content, leftReveal })}
              />
            </div>
          </details>
          <details className="rounded-md border border-hair p-2.5">
            <summary className="cursor-pointer text-xs font-semibold text-ink">Right case</summary>
            <div className="mt-2">
              <CaseDataFields
                data={content.rightCase}
                reveal={content.rightReveal}
                onData={(rightCase) => onChange({ ...content, rightCase })}
                onReveal={(rightReveal) => onChange({ ...content, rightReveal })}
              />
            </div>
          </details>
          <details className="rounded-md border border-hair p-2.5">
            <summary className="cursor-pointer text-xs font-semibold text-ink">Timeline</summary>
            <div className="mt-2">
              <TimelineFields timeline={content.timeline} onChange={(timeline) => onChange({ ...content, timeline })} />
            </div>
          </details>
        </div>
      );

    /* ----------------------------- analytics ----------------------------- */
    case 'ActivityFeed':
      return <ActivityFeedFields data={content} onChange={(d) => onChange({ type: 'ActivityFeed', ...d })} />;
    case 'AreaChart':
      return <AreaChartFields data={content} onChange={(d) => onChange({ type: 'AreaChart', ...d })} />;
    case 'BarChart':
      return <BarChartFields data={content} onChange={(d) => onChange({ type: 'BarChart', ...d })} />;
    case 'DistributionBar':
      return <DistributionBarFields data={content} onChange={(d) => onChange({ type: 'DistributionBar', ...d })} />;
    case 'Heatmap':
      return <HeatmapFields data={content} onChange={(d) => onChange({ type: 'Heatmap', ...d })} />;
    case 'KpiTile':
      return <KpiTileFields data={content} onChange={(d) => onChange({ type: 'KpiTile', ...d })} />;
    case 'RankList':
      return <RankListFields data={content} onChange={(d) => onChange({ type: 'RankList', ...d })} />;
    case 'Sparkline':
      return <SparklineFields data={content} onChange={(d) => onChange({ type: 'Sparkline', ...d })} />;
    case 'Delta':
      return <DeltaFields data={content} onChange={(d) => onChange({ type: 'Delta', ...d })} />;
    case 'MetricPanel':
      return <MetricPanelFields data={content} onChange={(d) => onChange({ type: 'MetricPanel', ...d })} />;
    case 'DataTable':
      return <DataTableFields data={content} onChange={(d) => onChange({ type: 'DataTable', ...d })} />;

    /* ------------------------------- board ------------------------------- */
    case 'Board':
      return <BoardFields data={content} onChange={(d) => onChange({ type: 'Board', ...d })} />;
    case 'Breadcrumb':
      return <BreadcrumbFields data={content} onChange={(d) => onChange({ type: 'Breadcrumb', ...d })} />;
    case 'ConnectorCard':
      return <ConnectorCardFields data={content} onChange={(d) => onChange({ type: 'ConnectorCard', ...d })} />;
    case 'PageHeader':
      return <PageHeaderFields data={content} onChange={(d) => onChange({ type: 'PageHeader', ...d })} />;

    /* ------------------------------- shell ------------------------------- */
    case 'NavTree':
      return <NavTreeFields data={content} onChange={(d) => onChange({ type: 'NavTree', ...d })} />;
    case 'EntityList':
      return <EntityListFields data={content} onChange={(d) => onChange({ type: 'EntityList', ...d })} />;
    case 'Sidebar':
      return <SidebarFields data={content} onChange={(d) => onChange({ type: 'Sidebar', ...d })} />;
    case 'AppHeader':
      return <AppHeaderFields data={content} onChange={(d) => onChange({ type: 'AppHeader', ...d })} />;
    case 'Toolbar':
      return <ToolbarFields data={content} onChange={(d) => onChange({ type: 'Toolbar', ...d })} />;
    case 'Panel':
      return <PanelFields data={content} onChange={(d) => onChange({ type: 'Panel', ...d })} />;
    case 'WorkspaceLayout':
      return <WorkspaceLayoutFields data={content} onChange={(d) => onChange({ type: 'WorkspaceLayout', ...d })} />;

    /* ---------------------------- primitives ----------------------------- */
    case 'Avatar':
      return <AvatarFields data={content} onChange={(d) => onChange({ type: 'Avatar', ...d })} />;
    case 'Badge':
      return <BadgeFields data={content} onChange={(d) => onChange({ type: 'Badge', ...d })} />;
    case 'Button':
      return <ButtonFields data={content} onChange={(d) => onChange({ type: 'Button', ...d })} />;
    case 'IconButton':
      return <IconButtonFields data={content} onChange={(d) => onChange({ type: 'IconButton', ...d })} />;
    case 'PageDots':
      return <PageDotsFields data={content} onChange={(d) => onChange({ type: 'PageDots', ...d })} />;
    case 'ProgressBar':
      return <ProgressBarFields data={content} onChange={(d) => onChange({ type: 'ProgressBar', ...d })} />;
    case 'SearchInput':
      return <SearchInputFields data={content} onChange={(d) => onChange({ type: 'SearchInput', ...d })} />;
    case 'SegmentedControl':
      return <SegmentedControlFields data={content} onChange={(d) => onChange({ type: 'SegmentedControl', ...d })} />;
    case 'Select':
      return <SelectFields data={content} onChange={(d) => onChange({ type: 'Select', ...d })} />;
    case 'StatusBadge':
      return <StatusBadgeFields data={content} onChange={(d) => onChange({ type: 'StatusBadge', ...d })} />;
    case 'StatusDot':
      return <StatusDotFields data={content} onChange={(d) => onChange({ type: 'StatusDot', ...d })} />;
    case 'Tabs':
      return <TabsFields data={content} onChange={(d) => onChange({ type: 'Tabs', ...d })} />;
    case 'WindowChrome':
      return <WindowChromeFields data={content} onChange={(d) => onChange({ type: 'WindowChrome', ...d })} />;
  }
}
