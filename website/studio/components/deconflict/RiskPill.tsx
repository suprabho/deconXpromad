import {
  ShieldCheckIcon,
  WarningIcon,
  WarningOctagonIcon,
} from '@phosphor-icons/react/dist/ssr';
import type { RiskTier } from '@/lib/composition/types';

const TIERS = {
  High: { className: 'border-risk-text/15 bg-risk-bg/80 text-risk-text', Icon: WarningOctagonIcon },
  Medium: { className: 'border-amber-600/15 bg-amber-50/80 text-amber-700', Icon: WarningIcon },
  Low: { className: 'border-emerald-600/15 bg-emerald-50/80 text-emerald-700', Icon: ShieldCheckIcon },
} as const;

export function RiskPill({ tier }: { tier: RiskTier }) {
  const { className, Icon } = TIERS[tier];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-medium shadow-pill-inset backdrop-blur-sm ${className}`}
    >
      <Icon weight="fill" className="h-3.5 w-3.5" aria-hidden />
      {tier}
    </span>
  );
}
