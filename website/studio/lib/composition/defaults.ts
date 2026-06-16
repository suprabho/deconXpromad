/**
 * Default content for a fresh composition, plus per-foreground-type default
 * content used when the inspector switches the foreground component.
 *
 * Sample case / timeline data mirrors the worked example in deconflict-ui-guide.md.
 */
import type {
  AlertData,
  CaseData,
  CaseReveal,
  CompositionConfig,
  ForegroundContent,
  ForegroundType,
  TimelineData,
} from './types';
import { DEFAULT_SIZE_ID } from './types';

export const SAMPLE_LEFT_CASE: CaseData = {
  title: 'LAW ENFORCEMENT CASE',
  subtitle: 'FBI · Field Office 14 · Case #LE-2024-08821',
  subjectName: 'Jonathan A. Reyes',
  walletAddress: 'bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq',
  transactionId: 'TX-8842-0091-4471',
  dateOpened: 'April 5, 2024',
  riskTier: 'High',
};

export const SAMPLE_RIGHT_CASE: CaseData = {
  title: 'FINANCIAL INSTITUTION CASE',
  subtitle: 'Meridian Bank · AML Unit · Case #FI-2024-3390',
  subjectName: 'Acct. holder — withheld',
  walletAddress: 'bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq',
  transactionId: 'TX-8842-0091-4471',
  dateOpened: 'April 12, 2024',
  riskTier: 'Medium',
};

/** Subject masked, the matched wallet revealed, the txn id partially shown. */
export const SAMPLE_REVEAL: CaseReveal = {
  subjectName: 'masked',
  walletAddress: 'revealed',
  transactionId: 'partial',
};

export const SAMPLE_ALERT: AlertData = {
  status: 'ACTIVE OVERLAP',
  detail: 'Case Overlap Detected',
  timestamp: 'May 14, 2025 · 10:24 AM EDT',
};

export const SAMPLE_TIMELINE: TimelineData = {
  tracks: [
    {
      label: 'Law Enforcement Case',
      color: '#1A2332',
      segments: [
        { from: '2024-04-05', to: '2024-06-10' },
        { from: '2024-05-01', to: '2024-05-25', faded: true },
      ],
    },
    {
      label: 'Financial Institution Case',
      color: '#2563EB',
      segments: [
        { from: '2024-04-01', to: '2024-04-12', faded: true },
        { from: '2024-04-12', to: '2024-06-20' },
      ],
    },
  ],
  overlaps: ['2024-05-01', '2024-05-12', '2024-06-01'],
  ticks: [
    { date: '2024-04-01', label: 'Apr 1' },
    { date: '2024-04-15', label: 'Apr 15' },
    { date: '2024-05-01', label: 'May 1' },
    { date: '2024-05-12', label: 'May 12' },
    { date: '2024-06-01', label: 'Jun 1' },
    { date: '2024-06-15', label: 'Jun 15' },
    { date: '2024-07-01', label: 'Jul 1' },
  ],
};

/** Default editable content for each foreground component type. */
export function defaultForegroundContent(type: ForegroundType): ForegroundContent {
  switch (type) {
    case 'none':
      return { type: 'none' };
    case 'OverlapAlert':
      return { type: 'OverlapAlert', ...SAMPLE_ALERT };
    case 'RiskPill':
      return { type: 'RiskPill', tier: 'High' };
    case 'CaseCard':
      return { type: 'CaseCard', data: { ...SAMPLE_LEFT_CASE }, reveal: { ...SAMPLE_REVEAL } };
    case 'ConnectorNode':
      return { type: 'ConnectorNode', matches: 3 };
    case 'ActivityTimeline':
      return { type: 'ActivityTimeline', ...structuredClone(SAMPLE_TIMELINE) };
    case 'DeconflictBanner':
      return {
        type: 'DeconflictBanner',
        leftCase: { ...SAMPLE_LEFT_CASE },
        rightCase: { ...SAMPLE_RIGHT_CASE },
        leftReveal: { ...SAMPLE_REVEAL },
        rightReveal: { ...SAMPLE_REVEAL },
        matches: 3,
        alert: { ...SAMPLE_ALERT },
        timeline: structuredClone(SAMPLE_TIMELINE),
      };
  }
}

export const DEFAULT_COMPOSITION: CompositionConfig = {
  version: 1,
  sizeId: DEFAULT_SIZE_ID,
  background: {
    kind: 'aura',
    auraSlug: 'blue-background-images-ethereal-color-blends-for-design',
    imageFit: 'cover',
    color: '#0D1B3E',
  },
  scrim: { amount: 0.4, direction: 'left', color: '#0D1B3E' },
  midGraphics: [],
  foreground: {
    content: { type: 'CaseCard', data: { ...SAMPLE_LEFT_CASE }, reveal: { ...SAMPLE_REVEAL } },
    position: 'right',
    size: 'M',
    card: false,
  },
  overlay: {
    badge: 'DECONFLICT',
    title: 'Two cases, one wallet.',
    subtitle: 'The overlap, surfaced before jurisdictions collide.',
    position: 'left',
    align: 'left',
    textColor: '#FFFFFF',
    accent: '#9DBDFF',
    maxWidthScale: 'S',
  },
};
