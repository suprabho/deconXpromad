'use client';

import type {
  AlertData,
  AppGraphTone,
  AppIconKey,
  AppStatusTone,
  CaseData,
  CaseReveal,
  CodeWindowData,
  CommandPaletteData,
  EntityGraphData,
  FeatureIconKey,
  FeatureModalData,
  FeatureTone,
  ForegroundContent,
  KanbanCardData,
  Reveal,
  RiskTier,
  Segment,
  StatCardData,
  Tick,
  TimelineData,
  Track,
} from '@/lib/composition/types';
import { APP_ICON_KEYS, FEATURE_ICON_KEYS } from '@/lib/composition/types';
import {
  ColorField,
  Field,
  NumberField,
  Segmented,
  SelectField,
  TextArea,
  TextField,
  Toggle,
  inputCls,
} from './controls';

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
        <NumberField
          label="Match count"
          value={content.matches}
          min={0}
          onChange={(matches) => onChange({ type: 'ConnectorNode', matches })}
        />
      );

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
  }
}
