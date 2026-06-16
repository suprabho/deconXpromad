import type { CaseData, CaseReveal } from '@/lib/composition/types';
import { FieldRow } from './FieldRow';
import { RedactedValue } from './RedactedValue';
import { RiskPill } from './RiskPill';

export function CaseCard({ data, reveal }: { data: CaseData; reveal: CaseReveal }) {
  return (
    <article className="overflow-hidden rounded-xl border border-hair bg-white">
      <header className="px-5 pt-5 pb-4">
        <h3 className="text-base font-bold tracking-wide text-ink">{data.title}</h3>
        <p className="mt-1 text-sm text-muted">{data.subtitle}</p>
      </header>

      <FieldRow label="Subject Name" highlighted>
        <RedactedValue value={data.subjectName} reveal={reveal.subjectName} />
      </FieldRow>

      <FieldRow label="Wallet Address" highlighted>
        <RedactedValue value={data.walletAddress} reveal={reveal.walletAddress} />
      </FieldRow>

      <FieldRow label="Transaction ID" highlighted>
        <RedactedValue
          value={data.transactionId}
          reveal={reveal.transactionId}
          prefix="TX-"
        />
      </FieldRow>

      <FieldRow label="Date Opened">
        <span className="text-ink">{data.dateOpened}</span>
      </FieldRow>

      <FieldRow label="Risk Tier">
        <RiskPill tier={data.riskTier} />
      </FieldRow>
    </article>
  );
}
