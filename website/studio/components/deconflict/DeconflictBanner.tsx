import type {
  AlertData,
  CaseData,
  CaseReveal,
  TimelineData,
} from '@/lib/composition/types';
import { ActivityTimeline } from './ActivityTimeline';
import { CaseCard } from './CaseCard';
import { ConnectorNode } from './ConnectorNode';
import { OverlapAlert } from './OverlapAlert';

export function DeconflictBanner({
  leftCase,
  rightCase,
  leftReveal,
  rightReveal,
  matches,
  alert,
  timeline,
}: {
  leftCase: CaseData;
  rightCase: CaseData;
  leftReveal: CaseReveal;
  rightReveal: CaseReveal;
  matches: number;
  alert: AlertData;
  timeline: TimelineData;
}) {
  return (
    <section className="mx-auto max-w-6xl space-y-5 p-6">
      <OverlapAlert {...alert} />

      <div className="grid items-center gap-4 md:grid-cols-[1fr_auto_1fr]">
        <CaseCard data={leftCase} reveal={leftReveal} />
        <div className="hidden md:block w-32">
          <ConnectorNode matches={matches} />
        </div>
        <CaseCard data={rightCase} reveal={rightReveal} />
      </div>

      <ActivityTimeline {...timeline} />
    </section>
  );
}
