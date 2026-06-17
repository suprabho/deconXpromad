'use client';

import type { ReactNode } from 'react';
import {
  BankIcon,
  BinocularsIcon,
  BriefcaseIcon,
  BuildingsIcon,
  ChartLineUpIcon,
  CurrencyDollarIcon,
  FlagIcon,
  GraphIcon,
  LinkSimpleIcon,
  MagnifyingGlassIcon,
  ScalesIcon,
  ShareNetworkIcon,
  ShieldCheckIcon,
  UserIcon,
  WalletIcon,
} from '@phosphor-icons/react/dist/ssr';
import type {
  AppIconKey,
  CommandPaletteData,
  KanbanCardData,
  StatCardData,
} from '@/lib/composition/types';
import { CommandPalettePanel } from '../search/CommandPalette';
import { ResultGroup } from '../search/ResultGroup';
import { SearchResultRow } from '../search/SearchResultRow';
import { StatCard } from '../analytics/StatCard';
import { KanbanCard } from '../board/KanbanCard';

/* -------------------------------------------------------------------------- *
 * Studio foreground adapters — render an app component from the serialisable
 * composition data (icon KEYS, not React nodes). The icon→node resolution
 * lives HERE, in this client module, so the server-side /render route never has
 * to index APP_ICONS across the client boundary (which would hand back a
 * client-reference proxy). Mirrors components/deconflict/FeatureModal.
 *
 * CodeWindow + EntityGraph carry no icons, so ForegroundLayer renders those
 * components directly — they don't need an adapter here.
 * -------------------------------------------------------------------------- */

export const APP_ICONS: Record<AppIconKey, ReactNode> = {
  'shield-check': <ShieldCheckIcon weight="duotone" className="h-5 w-5" />,
  bank: <BankIcon weight="duotone" className="h-5 w-5" />,
  buildings: <BuildingsIcon weight="duotone" className="h-5 w-5" />,
  user: <UserIcon weight="duotone" className="h-5 w-5" />,
  wallet: <WalletIcon weight="duotone" className="h-5 w-5" />,
  briefcase: <BriefcaseIcon weight="duotone" className="h-5 w-5" />,
  flag: <FlagIcon weight="duotone" className="h-5 w-5" />,
  'magnifying-glass': <MagnifyingGlassIcon weight="duotone" className="h-5 w-5" />,
  graph: <GraphIcon weight="duotone" className="h-5 w-5" />,
  chart: <ChartLineUpIcon weight="duotone" className="h-5 w-5" />,
  'currency-dollar': <CurrencyDollarIcon weight="duotone" className="h-5 w-5" />,
  scales: <ScalesIcon weight="duotone" className="h-5 w-5" />,
  link: <LinkSimpleIcon weight="duotone" className="h-5 w-5" />,
  binoculars: <BinocularsIcon weight="duotone" className="h-5 w-5" />,
  share: <ShareNetworkIcon weight="duotone" className="h-5 w-5" />,
  // Real-org logo marks — fill the host badge (h-9/h-8 chip) rather than the
  // fixed glyph box, so they read as brand badges.
  'logo-fbi': <img src="/assets/logos/fbi.png" alt="" className="h-full w-full object-contain" />,
  'logo-interpol': <img src="/assets/logos/interpol.png" alt="" className="h-full w-full object-contain" />,
  'logo-hsbc': <img src="/assets/logos/hsbc.png" alt="" className="h-full w-full object-contain" />,
  'logo-chainalysis': <img src="/assets/logos/chainalysis.png" alt="" className="h-full w-full object-contain" />,
};

function iconNode(key: AppIconKey | 'none'): ReactNode | undefined {
  return key === 'none' ? undefined : APP_ICONS[key];
}

export function StatCardForeground({ data }: { data: StatCardData }) {
  return (
    <StatCard
      label={data.label}
      value={data.value}
      delta={data.delta}
      deltaInvert={data.deltaInvert}
      tone={data.tone}
      icon={iconNode(data.icon)}
      spark={data.spark}
    />
  );
}

export function KanbanCardForeground({ data }: { data: KanbanCardData }) {
  return (
    <KanbanCard
      title={data.title}
      subtitle={data.subtitle}
      status={data.status}
      statusTone={data.statusTone}
      accent={data.accent === 'none' ? undefined : data.accent}
      flagged={data.flagged}
      leading={iconNode(data.leading)}
    />
  );
}

export function CommandPaletteForeground({ data }: { data: CommandPaletteData }) {
  return (
    <CommandPalettePanel
      query={data.query}
      meta={<span className="ml-auto">{data.rows.length} results</span>}
    >
      <ResultGroup label={data.groupLabel}>
        {data.rows.map((row, i) => (
          <SearchResultRow
            key={i}
            icon={APP_ICONS[row.icon]}
            title={row.title}
            subtitle={row.subtitle}
            meta={row.meta}
            active={i === 0}
          />
        ))}
      </ResultGroup>
    </CommandPalettePanel>
  );
}
