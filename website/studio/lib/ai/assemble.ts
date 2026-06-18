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

/* eslint-disable @typescript-eslint/no-explicit-any */

// Re-attach the ids the schemas omit for the shell/board/feed plates. The model
// only supplies the visible fields; ids (and the id-referencing selection state)
// are minted here so they stay internally consistent.
const withIds = (arr: any[], p: string) => (arr ?? []).map((x, i) => ({ id: `${p}${i}`, ...x }));

const mintNav = (nodes: any[], prefix: string): any[] =>
  (nodes ?? []).map((n, i) => {
    const id = `${prefix}${i}`;
    return { id, label: n.label, icon: n.icon, done: n.done, children: mintNav(n.children, `${id}_`) };
  });

const navExpanded = (nodes: any[], acc: string[]): string[] => {
  for (const n of nodes) if (n.children.length) { acc.push(n.id); navExpanded(n.children, acc); }
  return acc;
};

const navFirstLeaf = (nodes: any[]): string => {
  for (const n of nodes) {
    if (!n.children.length) return n.id;
    const deep = navFirstLeaf(n.children);
    if (deep) return deep;
  }
  return nodes[0]?.id ?? '';
};

function assembleNavTree(gen: any) {
  const nodes = mintNav(gen.nodes, 'n');
  return { title: gen.title, activeId: navFirstLeaf(nodes), expandedIds: navExpanded(nodes, []), nodes };
}

function assembleSidebar(gen: any) {
  return { brandName: gen.brandName, brandMark: gen.brandMark, items: withIds(gen.items, 's') };
}

// `gen` is the zod-validated payload for `type` (see schemaFor); its shape is
// guaranteed by the route before this runs, so per-branch casts are safe.
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

    /* ----------------------------- analytics ----------------------------- */
    case 'ActivityFeed':
      return { type, title: gen.title, items: withIds(gen.items, 'a') };

    case 'AreaChart':
    case 'BarChart':
    case 'DistributionBar':
    case 'Heatmap':
    case 'KpiTile':
    case 'RankList':
    case 'Sparkline':
    case 'Delta':
    case 'MetricPanel':
    case 'DataTable':
      return { type, ...gen };

    /* ------------------------------- board ------------------------------- */
    case 'Board':
      return { type, columns: gen.columns.map((c: any, i: number) => ({ id: `c${i}`, title: c.title, count: c.count, tone: c.tone, cards: c.cards })) };

    case 'Breadcrumb':
    case 'ConnectorCard':
    case 'PageHeader':
      return { type, ...gen };

    /* ------------------------------- shell ------------------------------- */
    case 'NavTree':
      return { type, ...assembleNavTree(gen) };

    case 'EntityList': {
      const items = withIds(gen.items, 'e');
      return { type, title: gen.title, items, selectedId: items[0]?.id ?? '', numbered: gen.numbered };
    }

    case 'Sidebar':
      return { type, ...assembleSidebar(gen) };

    case 'AppHeader':
    case 'Toolbar':
    case 'Panel':
      return { type, ...gen };

    case 'WorkspaceLayout':
      return { type, rail: assembleSidebar(gen.rail), nav: assembleNavTree(gen.nav), header: gen.header, panel: gen.panel };

    /* ---------------------------- primitives ----------------------------- */
    case 'Avatar':
    case 'Badge':
    case 'Button':
    case 'IconButton':
    case 'PageDots':
    case 'ProgressBar':
    case 'SearchInput':
    case 'SegmentedControl':
    case 'Select':
    case 'StatusBadge':
    case 'StatusDot':
    case 'Tabs':
    case 'WindowChrome':
      return { type, ...gen };

    default:
      // 'none' and any unschemaed type — nothing to assemble.
      return { type: 'none' };
  }
}
