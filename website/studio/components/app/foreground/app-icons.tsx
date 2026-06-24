import type { ReactNode } from 'react';
import {
  BankIcon,
  BinocularsIcon,
  BriefcaseIcon,
  BuildingsIcon,
  ChartLineUpIcon,
  CurrencyDollarIcon,
  DetectiveIcon,
  FingerprintIcon,
  FlagIcon,
  GavelIcon,
  GraphIcon,
  IdentificationBadgeIcon,
  LinkSimpleIcon,
  MagnifyingGlassIcon,
  PoliceCarIcon,
  ScalesIcon,
  ShareNetworkIcon,
  ShieldCheckIcon,
  ShieldStarIcon,
  SirenIcon,
  UserIcon,
  WalletIcon,
} from '@phosphor-icons/react/dist/ssr';
import type { AppIconKey } from '@/lib/composition/types';

/* -------------------------------------------------------------------------- *
 * Serialisable AppIconKey → rendered icon node. The composition stores icon
 * KEYS (strings); this is the single place that turns them into Phosphor glyphs
 * or logo bitmaps. Kept server-safe (NO 'use client') on purpose: both the
 * client foreground adapters AND server-rendered components (CaseCard, the
 * /render route) import this one registry, so the command-palette icon set and
 * every card draw from the same source of truth.
 *
 * Phosphor `dist/ssr` glyphs render in both server and client components, so
 * the shared module can never hand a server route a client-reference proxy.
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
  // Law-enforcement glyphs — badge, courts, forensics, patrol.
  'shield-star': <ShieldStarIcon weight="duotone" className="h-5 w-5" />,
  gavel: <GavelIcon weight="duotone" className="h-5 w-5" />,
  detective: <DetectiveIcon weight="duotone" className="h-5 w-5" />,
  fingerprint: <FingerprintIcon weight="duotone" className="h-5 w-5" />,
  siren: <SirenIcon weight="duotone" className="h-5 w-5" />,
  'police-car': <PoliceCarIcon weight="duotone" className="h-5 w-5" />,
  'id-badge': <IdentificationBadgeIcon weight="duotone" className="h-5 w-5" />,
  // Real-org logo marks — fill the host badge (h-9/h-8 chip) rather than the
  // fixed glyph box, so they read as brand badges.
  'logo-fbi': <img src="/assets/logos/fbi.png" alt="" className="h-full w-full object-contain" />,
  'logo-interpol': <img src="/assets/logos/interpol.png" alt="" className="h-full w-full object-contain" />,
  'logo-hsbc': <img src="/assets/logos/hsbc.png" alt="" className="h-full w-full object-contain" />,
  'logo-chainalysis': <img src="/assets/logos/chainalysis.png" alt="" className="h-full w-full object-contain" />,
};
