/**
 * Fold a schema-validated AI payload back into a complete ForegroundContent.
 *
 * The schemas in ./schemas.ts deliberately omit identity / display-state fields
 * the model should not invent — element ids, per-field reveal toggles, chat
 * author references, attachment lists. This re-attaches them: ids are minted
 * here, reveal states are carried over from the element being regenerated (so a
 * "regenerate copy" keeps the user's masking choices), and SecureChat author
 * sides are resolved to real participant ids.
 */
import type { ForegroundContent, ForegroundType } from '@/lib/composition/types';
import { SAMPLE_REVEAL } from '@/lib/composition/defaults';

const sid = () => crypto.randomUUID().slice(0, 6);

// `gen` is the zod-validated payload for `type` (see schemaFor); its shape is
// guaranteed by the route before this runs, so per-branch casts are safe.
/* eslint-disable @typescript-eslint/no-explicit-any */
export function assembleForegroundContent(
  type: ForegroundType,
  gen: any,
  current?: ForegroundContent,
): ForegroundContent {
  switch (type) {
    case 'OverlapAlert':
      return { type, status: gen.status, detail: gen.detail, timestamp: gen.timestamp };

    case 'RiskPill':
      return { type, tier: gen.tier };

    case 'ConnectorNode':
      return { type, matches: gen.matches };

    case 'CaseCard':
      return {
        type,
        data: gen,
        reveal: current?.type === 'CaseCard' ? current.reveal : { ...SAMPLE_REVEAL },
      };

    case 'ActivityTimeline':
      return { type, tracks: gen.tracks, overlaps: gen.overlaps, ticks: gen.ticks };

    case 'DeconflictBanner': {
      const c = current?.type === 'DeconflictBanner' ? current : undefined;
      return {
        type,
        leftCase: gen.leftCase,
        rightCase: gen.rightCase,
        matches: gen.matches,
        alert: gen.alert,
        timeline: gen.timeline,
        leftReveal: c?.leftReveal ?? { ...SAMPLE_REVEAL },
        rightReveal: c?.rightReveal ?? { ...SAMPLE_REVEAL },
      };
    }

    case 'FeatureModal':
      return { type, tone: gen.tone, chrome: gen.chrome, eyebrow: gen.eyebrow, heading: gen.heading, description: gen.description, items: gen.items };

    case 'CodeWindow':
      return { type, title: gen.title, language: gen.language, code: gen.code, highlightLines: gen.highlightLines };

    case 'EntityGraph':
      return {
        type,
        hubLabel: gen.hubLabel,
        nodes: gen.nodes.map((n: any) => ({ id: sid(), ring: n.ring === 2 ? 2 : 1, tone: n.tone })),
      };

    case 'StatCard':
      return { type, label: gen.label, value: gen.value, delta: gen.delta, deltaInvert: gen.deltaInvert, tone: gen.tone, icon: gen.icon, spark: gen.spark };

    case 'KanbanCard':
      return { type, title: gen.title, subtitle: gen.subtitle, status: gen.status, statusTone: gen.statusTone, accent: gen.accent, flagged: gen.flagged, leading: gen.leading };

    case 'CommandPalette':
      return { type, query: gen.query, groupLabel: gen.groupLabel, rows: gen.rows };

    case 'DonutChart':
      return { type, title: gen.title, centerValue: gen.centerValue, centerLabel: gen.centerLabel, segments: gen.segments };

    case 'GaugeArc':
      return { type, ...gen };

    case 'SecureChat': {
      const participants = gen.participants.map((p: any, i: number) => ({
        id: `p${i}`,
        name: p.name,
        org: p.org,
        side: p.side,
        track: p.track,
        online: p.online,
      }));
      const idForSide = (side: 'self' | 'peer') =>
        (participants.find((p: any) => p.side === side) ?? participants[0])?.id ?? '';
      const items = gen.items.map((it: any, i: number) =>
        it.kind === 'message'
          ? {
              kind: 'message' as const,
              id: `m${i}`,
              authorId: idForSide(it.authorSide ?? 'peer'),
              body: it.body ?? '',
              time: it.time ?? '',
              status: it.status ?? 'none',
              attachments: [],
            }
          : { kind: it.kind, id: `i${i}`, label: it.label ?? '' },
      );
      return { type, title: gen.title, subtitle: gen.subtitle, composer: gen.composer, participants, items };
    }

    default:
      // 'none' and any unschemaed type — nothing to assemble.
      return { type: 'none' };
  }
}
