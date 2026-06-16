'use client';

import type {
  AlertData,
  CaseData,
  CaseReveal,
  ForegroundContent,
  Reveal,
  RiskTier,
  Segment,
  Tick,
  TimelineData,
  Track,
} from '@/lib/composition/types';
import { ColorField, Field, NumberField, Segmented, TextField, Toggle, inputCls } from './controls';

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
