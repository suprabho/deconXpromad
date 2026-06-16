import {
  composeTransform,
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
      return <EntityGraph nodes={content.nodes} hubLabel={content.hubLabel} />;
    case 'StatCard':
      return <StatCardForeground data={content} />;
    case 'KanbanCard':
      return <KanbanCardForeground data={content} />;
    case 'CommandPalette':
      return <CommandPaletteForeground data={content} />;
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
        return (
          <div
            key={el.id}
            style={{
              position: 'absolute',
              left: `${t.x}%`,
              top: `${t.y}%`,
              width: Math.round(t.scale * width),
              transform: composeTransform(t),
              transformOrigin: 'center center',
              zIndex: i,
            }}
          >
            {inner}
          </div>
        );
      })}
    </div>
  );
}
