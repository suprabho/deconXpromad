import type { RiskTier } from '@/lib/composition/types';

export function RiskPill({ tier }: { tier: RiskTier }) {
  const map = {
    High: 'bg-risk-bg text-risk-text',
    Medium: 'bg-amber-50 text-amber-700',
    Low: 'bg-emerald-50 text-emerald-700',
  } as const;
  return (
    <span className={`rounded-md px-2.5 py-1 text-xs font-medium ${map[tier]}`}>
      {tier}
    </span>
  );
}
