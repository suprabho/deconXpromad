import type { CSSProperties } from 'react';
import {
  composeDropShadow,
  composeTransform,
  glassVars,
  type ForegroundContent,
  type ForegroundElement,
} from '@/lib/composition/types';
import { CaseCard } from '@/components/deconflict/CaseCard';
import { OverlapAlert } from '@/components/deconflict/OverlapAlert';
import { RiskPill } from '@/components/deconflict/RiskPill';
import { ConnectorNode } from '@/components/deconflict/ConnectorNode';
import { ActivityTimeline } from '@/components/deconflict/ActivityTimeline';
import { DeconflictBanner } from '@/components/deconflict/DeconflictBanner';
import { FeatureModalForeground } from '@/components/deconflict/FeatureModal';
import { CodeWindow } from '@/components/app/code/CodeWindow';
import { EntityGraph } from '@/components/app/shell/EntityGraph';
import { Panel } from '@/components/app/shell/Panel';
import { DonutChart } from '@/components/app/analytics/DonutChart';
import { GaugeArc } from '@/components/app/analytics/GaugeArc';
import { SecureChat } from '@/components/app/messaging/SecureChat';
import type { ChatItem } from '@/components/app/messaging/SecureChat';
import {
  CommandPaletteForeground,
  KanbanCardForeground,
  StatCardForeground,
} from '@/components/app/foreground/adapters';

function renderContent(content: ForegroundContent) {
  switch (content.type) {
    case 'none':
      return null;
    case 'CaseCard':
      return <CaseCard data={content.data} reveal={content.reveal} />;
    case 'OverlapAlert':
      return (
        <OverlapAlert status={content.status} detail={content.detail} timestamp={content.timestamp} />
      );
    case 'RiskPill':
      return <RiskPill tier={content.tier} />;
    case 'ConnectorNode':
      return <ConnectorNode matches={content.matches} />;
    case 'ActivityTimeline':
      return (
        <ActivityTimeline tracks={content.tracks} overlaps={content.overlaps} ticks={content.ticks} />
      );
    case 'DeconflictBanner': {
      const { leftCase, rightCase, leftReveal, rightReveal, matches, alert, timeline } = content;
      return (
        <DeconflictBanner
          leftCase={leftCase}
          rightCase={rightCase}
          leftReveal={leftReveal}
          rightReveal={rightReveal}
          matches={matches}
          alert={alert}
          timeline={timeline}
        />
      );
    }
    case 'FeatureModal':
      return <FeatureModalForeground data={content} />;
    case 'CodeWindow':
      return (
        <CodeWindow
          code={content.code}
          title={content.title}
          language={content.language}
          highlightLines={content.highlightLines}
        />
      );
    case 'EntityGraph':
      return <EntityGraph nodes={content.nodes} hubLabel={content.hubLabel} frame />;
    case 'StatCard':
      return <StatCardForeground data={content} />;
    case 'KanbanCard':
      return <KanbanCardForeground data={content} />;
    case 'CommandPalette':
      return <CommandPaletteForeground data={content} />;
    case 'DonutChart':
      return (
        <Panel title={content.title}>
          <DonutChart
            segments={content.segments}
            centerValue={content.centerValue}
            centerLabel={content.centerLabel}
            gap={3}
          />
        </Panel>
      );
    case 'GaugeArc':
      return (
        <Panel title={content.title}>
          <div className="flex justify-center py-2">
            <GaugeArc
              value={content.value}
              min={content.min}
              max={content.max}
              unit={content.unit}
              label={content.label}
              caption={content.caption}
              tone={content.useThresholds ? undefined : content.tone}
              thresholds={
                content.useThresholds
                  ? { warn: content.thresholdWarn, alert: content.thresholdAlert }
                  : undefined
              }
            />
          </div>
        </Panel>
      );
    case 'SecureChat': {
      // Map the serialisable items to the component's ChatItem (status 'none' → omitted).
      const items: ChatItem[] = content.items.map((it) =>
        it.kind === 'message'
          ? {
              kind: 'message' as const,
              id: it.id,
              authorId: it.authorId,
              body: it.body,
              time: it.time,
              status: it.status === 'none' ? undefined : it.status,
              attachments: it.attachments,
            }
          : it
      );
      return (
        <SecureChat
          title={content.title}
          subtitle={content.subtitle}
          participants={content.participants}
          items={items}
          composer={content.composer}
        />
      );
    }
  }
}

/** z-3 — the freely-placed foreground Deconflict UI elements (array order = z). */
export function ForegroundLayer({
  elements,
  width,
}: {
  elements: ForegroundElement[];
  width: number;
}) {
  if (!elements.length) return null;
  return (
    <div className="absolute inset-0 z-[3]" style={{ pointerEvents: 'none' }}>
      {elements.map((el, i) => {
        const inner = renderContent(el.content);
        if (!inner) return null;
        const t = el.transform;
        // Shadows are applied (via the `.fg-item > *` rule) to the element's own
        // root node — the SAME node that carries a glass backdrop-filter — NOT to
        // this transformed wrapper. A `filter` on an ancestor silently kills a
        // descendant's backdrop-filter, so a wrapper drop-shadow would break the
        // card's glass blur; on the one node both coexist.
        const shadow = composeDropShadow(el.shadows);
        return (
          <div
            key={el.id}
            className="fg-item"
            style={{
              position: 'absolute',
              left: `${t.x}%`,
              top: `${t.y}%`,
              width: Math.round(t.width * width),
              transform: composeTransform(t),
              transformOrigin: 'center center',
              zIndex: i,
              ...(shadow ? { '--fg-shadow': shadow } : {}),
              ...glassVars(el.glass),
            } as CSSProperties}
          >
            {inner}
          </div>
        );
      })}
    </div>
  );
}
