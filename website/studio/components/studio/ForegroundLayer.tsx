import {
  placementStyle,
  SCALE_FRACTION,
  type ForegroundConfig,
  type ForegroundContent,
} from '@/lib/composition/types';
import { CaseCard } from '@/components/deconflict/CaseCard';
import { OverlapAlert } from '@/components/deconflict/OverlapAlert';
import { RiskPill } from '@/components/deconflict/RiskPill';
import { ConnectorNode } from '@/components/deconflict/ConnectorNode';
import { ActivityTimeline } from '@/components/deconflict/ActivityTimeline';
import { DeconflictBanner } from '@/components/deconflict/DeconflictBanner';

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
  }
}

/** z-3 — the single foreground Deconflict component, preset-placed and sized. */
export function ForegroundLayer({
  foreground,
  width,
}: {
  foreground: ForegroundConfig;
  width: number;
}) {
  const inner = renderContent(foreground.content);
  if (!inner) return null;
  const gap = Math.round(width * 0.045);
  return (
    <div
      className="z-[3]"
      style={{ ...placementStyle(foreground.position, gap), width: Math.round(SCALE_FRACTION[foreground.size] * width) }}
    >
      {foreground.card ? (
        <div className="rounded-2xl bg-white/80 p-5 shadow-2xl ring-1 ring-black/5 backdrop-blur-md">
          {inner}
        </div>
      ) : (
        inner
      )}
    </div>
  );
}
