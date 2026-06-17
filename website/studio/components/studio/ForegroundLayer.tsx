import type { CSSProperties } from 'react';
import {
  composeDropShadow,
  composeTransform,
  glassVars,
  type ForegroundContent,
  type ForegroundElement,
} from '@/lib/composition/types';
import { CaseCard } from '@/components/deconflict/CaseCard';
import { OverlapAlert } from '@/components/deconflict/OverlapAlert';
import { RiskPill } from '@/components/deconflict/RiskPill';
import { ConnectorNode } from '@/components/deconflict/ConnectorNode';
import { ActivityTimeline } from '@/components/deconflict/ActivityTimeline';
import { DeconflictBanner } from '@/components/deconflict/DeconflictBanner';
import { FeatureModalForeground } from '@/components/deconflict/FeatureModal';
import { CodeWindow } from '@/components/app/code/CodeWindow';
import { EntityGraph } from '@/components/app/shell/EntityGraph';
import { Panel } from '@/components/app/shell/Panel';
import { DonutChart } from '@/components/app/analytics/DonutChart';
import { GaugeArc } from '@/components/app/analytics/GaugeArc';
import { SecureChat } from '@/components/app/messaging/SecureChat';
import type { ChatItem } from '@/components/app/messaging/SecureChat';
// icon-free app plates — render directly (no APP_ICONS across the render boundary)
import { ActivityFeed } from '@/components/app/analytics/ActivityFeed';
import { AreaChart } from '@/components/app/analytics/AreaChart';
import { BarChart } from '@/components/app/analytics/BarChart';
import { DistributionBar } from '@/components/app/analytics/DistributionBar';
import { Heatmap } from '@/components/app/analytics/Heatmap';
import { KpiTile } from '@/components/app/analytics/KpiTile';
import { RankList } from '@/components/app/analytics/RankList';
import { Sparkline } from '@/components/app/analytics/Sparkline';
import { Delta } from '@/components/app/analytics/Delta';
import { MetricPanel, MetricFigure } from '@/components/app/analytics/MetricPanel';
import { DataTable, type Column } from '@/components/app/analytics/DataTable';
import { Breadcrumb } from '@/components/app/board/Breadcrumb';
import { PageHeader } from '@/components/app/board/PageHeader';
import { EntityList } from '@/components/app/shell/EntityList';
import { Avatar } from '@/components/app/primitives/Avatar';
import { PageDots } from '@/components/app/primitives/Pagination';
import { ProgressBar } from '@/components/app/primitives/ProgressBar';
import { SearchInput, Kbd } from '@/components/app/primitives/SearchInput';
import { SegmentedControl } from '@/components/app/primitives/SegmentedControl';
import { StatusBadge } from '@/components/app/primitives/StatusBadge';
import { StatusDot } from '@/components/app/primitives/StatusDot';
import { Tabs } from '@/components/app/primitives/Tabs';
import { WindowChrome } from '@/components/app/primitives/WindowChrome';
import { Button } from '@/components/app/primitives/Button';
import {
  AppHeaderForeground,
  BadgeForeground,
  BoardForeground,
  ButtonForeground,
  CommandPaletteForeground,
  ConnectorCardForeground,
  IconButtonForeground,
  KanbanCardForeground,
  NavTreeForeground,
  PanelForeground,
  SelectForeground,
  SidebarForeground,
  StatCardForeground,
  ToolbarForeground,
  WorkspaceLayoutForeground,
} from '@/components/app/foreground/adapters';

function renderContent(content: ForegroundContent) {
  switch (content.type) {
    case 'none':
      return null;
    case 'CaseCard':
      return <CaseCard data={content.data} reveal={content.reveal} />;
    case 'OverlapAlert':
      return (
        <OverlapAlert status={content.status} detail={content.detail} timestamp={content.timestamp} />
      );
    case 'RiskPill':
      return <RiskPill tier={content.tier} />;
    case 'ConnectorNode':
      return <ConnectorNode matches={content.matches} />;
    case 'ActivityTimeline':
      return (
        <ActivityTimeline tracks={content.tracks} overlaps={content.overlaps} ticks={content.ticks} />
      );
    case 'DeconflictBanner': {
      const { leftCase, rightCase, leftReveal, rightReveal, matches, alert, timeline } = content;
      return (
        <DeconflictBanner
          leftCase={leftCase}
          rightCase={rightCase}
          leftReveal={leftReveal}
          rightReveal={rightReveal}
          matches={matches}
          alert={alert}
          timeline={timeline}
        />
      );
    }
    case 'FeatureModal':
      return <FeatureModalForeground data={content} />;
    case 'CodeWindow':
      return (
        <CodeWindow
          code={content.code}
          title={content.title}
          language={content.language}
          highlightLines={content.highlightLines}
        />
      );
    case 'EntityGraph':
      return <EntityGraph nodes={content.nodes} hubLabel={content.hubLabel} frame />;
    case 'StatCard':
      return <StatCardForeground data={content} />;
    case 'KanbanCard':
      return <KanbanCardForeground data={content} />;
    case 'CommandPalette':
      return <CommandPaletteForeground data={content} />;
    case 'DonutChart':
      return (
        <Panel title={content.title}>
          <DonutChart
            segments={content.segments}
            centerValue={content.centerValue}
            centerLabel={content.centerLabel}
            gap={3}
          />
        </Panel>
      );
    case 'GaugeArc':
      return (
        <Panel title={content.title}>
          <div className="flex justify-center py-2">
            <GaugeArc
              value={content.value}
              min={content.min}
              max={content.max}
              unit={content.unit}
              label={content.label}
              caption={content.caption}
              tone={content.useThresholds ? undefined : content.tone}
              thresholds={
                content.useThresholds
                  ? { warn: content.thresholdWarn, alert: content.thresholdAlert }
                  : undefined
              }
            />
          </div>
        </Panel>
      );
    case 'SecureChat': {
      // Map the serialisable items to the component's ChatItem (status 'none' → omitted).
      const items: ChatItem[] = content.items.map((it) =>
        it.kind === 'message'
          ? {
              kind: 'message' as const,
              id: it.id,
              authorId: it.authorId,
              body: it.body,
              time: it.time,
              status: it.status === 'none' ? undefined : it.status,
              attachments: it.attachments,
            }
          : it
      );
      return (
        <SecureChat
          title={content.title}
          subtitle={content.subtitle}
          participants={content.participants}
          items={items}
          composer={content.composer}
        />
      );
    }

    /* ----------------------------- analytics ----------------------------- */
    case 'ActivityFeed':
      return (
        <Panel title={content.title}>
          <ActivityFeed
            items={content.items.map((it) => ({
              id: it.id,
              tone: it.tone,
              title: it.title,
              description: it.description || undefined,
              time: it.time || undefined,
              pulse: it.pulse,
            }))}
          />
        </Panel>
      );
    case 'AreaChart':
      return (
        <Panel title={content.title}>
          <AreaChart
            data={content.data}
            compare={content.compare.length ? content.compare : undefined}
            tone={content.tone}
            ticks={content.ticks.length ? content.ticks : undefined}
            smooth={content.smooth}
          />
        </Panel>
      );
    case 'BarChart':
      return (
        <Panel title={content.title}>
          <BarChart
            data={content.bars}
            tone={content.tone}
            highlightTone={content.highlightTone}
            showLabels={content.showLabels}
          />
        </Panel>
      );
    case 'DistributionBar':
      return (
        <Panel title={content.title}>
          <DistributionBar segments={content.segments} showPercent={content.showPercent} legend={content.legend} />
        </Panel>
      );
    case 'Heatmap':
      return (
        <Panel title={content.title}>
          <Heatmap
            values={content.values}
            columns={content.columns}
            rows={content.rows}
            tone={content.tone}
            rowLabels={content.rowLabels.length ? content.rowLabels : undefined}
            legend={content.legend}
          />
        </Panel>
      );
    case 'KpiTile':
      return <KpiTile label={content.label} value={content.value} hint={content.hint || undefined} tone={content.tone} />;
    case 'RankList':
      return (
        <Panel title={content.title}>
          <RankList
            items={content.items.map((it) => ({
              label: it.label,
              value: it.value,
              display: it.display || undefined,
              sub: it.sub || undefined,
              tone: it.tone,
            }))}
            tone={content.tone}
            showRank={content.showRank}
            showBar={content.showBar}
          />
        </Panel>
      );
    case 'Sparkline':
      return (
        <Panel title={content.title}>
          <Sparkline data={content.data} tone={content.tone} smooth={content.smooth} endDot={content.endDot} />
        </Panel>
      );
    case 'Delta':
      return <Delta value={content.value} suffix={content.suffix} invert={content.invert} tone={content.tone} />;
    case 'MetricPanel':
      return (
        <MetricPanel title={content.title}>
          <div className="space-y-4">
            <MetricFigure value={content.figureValue} caption={content.figureCaption} />
            <Sparkline data={content.spark} tone="white" />
            <BarChart data={content.bars} tone="white" />
          </div>
        </MetricPanel>
      );
    case 'DataTable': {
      const columns: Column<string[]>[] = content.columns.map((col, ci) => ({
        key: col.key,
        header: col.header,
        align: col.align,
        render: (row: string[]) => row[ci] ?? '',
      }));
      return (
        <Panel title={content.title}>
          <DataTable columns={columns} rows={content.rows} rowKey={(_, i) => String(i)} zebra={content.zebra} />
        </Panel>
      );
    }

    /* ------------------------------- board ------------------------------- */
    case 'Board':
      return <BoardForeground data={content} />;
    case 'Breadcrumb':
      return (
        <Breadcrumb
          items={content.items.map((c) => ({ label: c.label, href: c.href || undefined }))}
          showBack={content.showBack}
        />
      );
    case 'ConnectorCard':
      return <ConnectorCardForeground data={content} />;
    case 'PageHeader':
      return (
        <PageHeader
          eyebrow={content.eyebrow || undefined}
          title={content.title}
          description={content.description || undefined}
          tabs={
            content.tabs.length ? (
              <Tabs
                tabs={content.tabs.map((t) => ({ value: t.value, label: t.label, count: t.count >= 0 ? t.count : undefined }))}
                value={content.activeTab}
              />
            ) : undefined
          }
          actions={content.primaryAction ? <Button variant="primary">{content.primaryAction}</Button> : undefined}
        />
      );

    /* ------------------------------- shell ------------------------------- */
    case 'NavTree':
      return <NavTreeForeground data={content} />;
    case 'EntityList':
      return (
        <Panel title={content.title}>
          <EntityList
            items={content.items.map((it) => ({
              id: it.id,
              label: it.label,
              tone: it.tone,
              score: it.score,
              meta: it.meta || undefined,
            }))}
            selectedId={content.selectedId || undefined}
            numbered={content.numbered}
          />
        </Panel>
      );
    case 'Sidebar':
      return <SidebarForeground data={content} />;
    case 'AppHeader':
      return <AppHeaderForeground data={content} />;
    case 'Toolbar':
      return <ToolbarForeground data={content} />;
    case 'Panel':
      return <PanelForeground data={content} />;
    case 'WorkspaceLayout':
      return <WorkspaceLayoutForeground data={content} />;

    /* ---------------------------- primitives ----------------------------- */
    case 'Avatar':
      return (
        <Avatar
          name={content.name}
          src={content.src || undefined}
          size={content.size}
          presence={content.presence === 'none' ? undefined : content.presence}
        />
      );
    case 'Badge':
      return <BadgeForeground data={content} />;
    case 'Button':
      return <ButtonForeground data={content} />;
    case 'IconButton':
      return <IconButtonForeground data={content} />;
    case 'PageDots':
      return <PageDots count={content.count} active={content.active} />;
    case 'ProgressBar':
      return (
        <ProgressBar
          value={content.value}
          tone={content.tone}
          size={content.size}
          showValue={content.showValue}
          label={content.label || undefined}
        />
      );
    case 'SearchInput':
      return (
        <SearchInput
          placeholder={content.placeholder}
          defaultValue={content.value}
          size={content.size}
          readOnly
          trailing={content.kbdHint ? <Kbd>{content.kbdHint}</Kbd> : undefined}
        />
      );
    case 'SegmentedControl':
      return <SegmentedControl segments={content.segments} value={content.value} size={content.size} />;
    case 'Select':
      return <SelectForeground data={content} />;
    case 'StatusBadge':
      return <StatusBadge label={content.label} tone={content.tone} caret={content.caret} pulse={content.pulse} />;
    case 'StatusDot':
      return <StatusDot tone={content.tone} size={content.size} pulse={content.pulse} label={content.label || undefined} />;
    case 'Tabs':
      return (
        <Tabs
          tabs={content.tabs.map((t) => ({ value: t.value, label: t.label, count: t.count >= 0 ? t.count : undefined }))}
          value={content.value}
        />
      );
    case 'WindowChrome':
      return (
        <div
          className={
            content.tone === 'dark'
              ? 'overflow-hidden rounded-2xl bg-[#0c1322] shadow-glass'
              : 'overflow-hidden rounded-2xl border border-white/60 bg-white/70 shadow-glass'
          }
        >
          <WindowChrome title={content.title || undefined} tone={content.tone} />
        </div>
      );
  }
}

/** z-3 — the freely-placed foreground Deconflict UI elements (array order = z). */
export function ForegroundLayer({
  elements,
  width,
}: {
  elements: ForegroundElement[];
  width: number;
}) {
  if (!elements.length) return null;
  return (
    <div className="absolute inset-0 z-[3]" style={{ pointerEvents: 'none' }}>
      {elements.map((el, i) => {
        const inner = renderContent(el.content);
        if (!inner) return null;
        const t = el.transform;
        // Shadows are applied (via the `.fg-item > *` rule) to the element's own
        // root node — the SAME node that carries a glass backdrop-filter — NOT to
        // this transformed wrapper. A `filter` on an ancestor silently kills a
        // descendant's backdrop-filter, so a wrapper drop-shadow would break the
        // card's glass blur; on the one node both coexist.
        const shadow = composeDropShadow(el.shadows);
        return (
          <div
            key={el.id}
            className="fg-item"
            style={{
              position: 'absolute',
              left: `${t.x}%`,
              top: `${t.y}%`,
              width: Math.round(t.width * width),
              transform: composeTransform(t),
              transformOrigin: 'center center',
              zIndex: i,
              ...(shadow ? { '--fg-shadow': shadow } : {}),
              ...glassVars(el.glass),
            } as CSSProperties}
          >
            {inner}
          </div>
        );
      })}
    </div>
  );
}
