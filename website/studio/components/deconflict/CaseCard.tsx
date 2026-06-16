import {
  CalendarBlankIcon,
  FolderOpenIcon,
  HashIcon,
  ShieldWarningIcon,
  UserIcon,
  WalletIcon,
} from '@phosphor-icons/react/dist/ssr';
import type { CaseData, CaseReveal } from '@/lib/composition/types';
import { FieldRow } from './FieldRow';
import { RedactedValue } from './RedactedValue';
import { RiskPill } from './RiskPill';

export function CaseCard({ data, reveal }: { data: CaseData; reveal: CaseReveal }) {
  return (
    <article className="overflow-hidden rounded-xl border border-white/60 bg-white/70 shadow-glass backdrop-blur-xl">
      <header className="flex items-start gap-3 px-5 pt-5 pb-4">
        <span
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg
                     border border-white/60 bg-white/50 text-ink shadow-glass-chip backdrop-blur-sm"
        >
          <FolderOpenIcon weight="duotone" className="h-5 w-5" />
        </span>
        <div>
          <h3 className="text-base font-bold tracking-wide text-ink">{data.title}</h3>
          <p className="mt-1 text-sm text-muted">{data.subtitle}</p>
        </div>
      </header>

      <FieldRow
        label="Subject Name"
        icon={<UserIcon weight="bold" className="h-4 w-4" />}
        highlighted
      >
        <RedactedValue value={data.subjectName} reveal={reveal.subjectName} />
      </FieldRow>

      <FieldRow
        label="Wallet Address"
        icon={<WalletIcon weight="bold" className="h-4 w-4" />}
        highlighted
      >
        <RedactedValue value={data.walletAddress} reveal={reveal.walletAddress} />
      </FieldRow>

      <FieldRow
        label="Transaction ID"
        icon={<HashIcon weight="bold" className="h-4 w-4" />}
        highlighted
      >
        <RedactedValue
          value={data.transactionId}
          reveal={reveal.transactionId}
          prefix="TX-"
        />
      </FieldRow>

      <FieldRow
        label="Date Opened"
        icon={<CalendarBlankIcon weight="bold" className="h-4 w-4" />}
      >
        <span className="text-ink">{data.dateOpened}</span>
      </FieldRow>

      <FieldRow
        label="Risk Tier"
        icon={<ShieldWarningIcon weight="bold" className="h-4 w-4" />}
      >
        <RiskPill tier={data.riskTier} />
      </FieldRow>
    </article>
  );
}
