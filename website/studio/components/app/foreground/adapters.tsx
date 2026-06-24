'use client';

import { Fragment, type ReactNode } from 'react';
import type {
  AppHeaderData,
  AppIconKey,
  BadgeData,
  BoardData,
  ButtonData,
  CommandPaletteData,
  ConnectorCardData,
  IconButtonData,
  KanbanCardData,
  NavNodeData,
  NavTreeData,
  PanelData,
  SelectData,
  SidebarData,
  StatCardData,
  ToolbarData,
  WorkspaceLayoutData,
} from '@/lib/composition/types';
import { CommandPalettePanel } from '../search/CommandPalette';
import { ResultGroup } from '../search/ResultGroup';
import { SearchResultRow } from '../search/SearchResultRow';
import { StatCard } from '../analytics/StatCard';
import { KanbanCard } from '../board/KanbanCard';
import { Board, BoardColumn } from '../board/Board';
import { ConnectorCard } from '../board/ConnectorCard';
import { NavTree, type NavNode } from '../shell/NavTree';
import { Sidebar, SidebarItem, SidebarSection } from '../shell/Sidebar';
import { AppHeader, Brand } from '../shell/AppHeader';
import { Toolbar, ToolbarGroup, ToolbarSpacer } from '../shell/Toolbar';
import { Panel } from '../shell/Panel';
import { WorkspaceLayout } from '../shell/WorkspaceLayout';
import { Badge } from '../primitives/Badge';
import { Button } from '../primitives/Button';
import { IconButton } from '../primitives/IconButton';
import { Select } from '../primitives/Select';
import { SearchInput, Kbd } from '../primitives/SearchInput';
import { Avatar } from '../primitives/Avatar';
import { APP_ICONS } from './app-icons';

/* -------------------------------------------------------------------------- *
 * Studio foreground adapters — render an app component from the serialisable
 * composition data (icon KEYS, not React nodes). The icon→node registry lives
 * in ./app-icons (server-safe), so both these client adapters and the
 * server-rendered /render route resolve keys from one source. Mirrors
 * components/deconflict/FeatureModal.
 *
 * CodeWindow + EntityGraph carry no icons, so ForegroundLayer renders those
 * components directly — they don't need an adapter here.
 * -------------------------------------------------------------------------- */

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

/* ----------------- remaining icon-bearing app plates ---------------------- */

export function ConnectorCardForeground({ data }: { data: ConnectorCardData }) {
  return (
    <ConnectorCard
      name={data.name}
      descriptor={data.descriptor}
      icon={iconNode(data.icon)}
      status={data.status}
      statusTone={data.statusTone}
      pulse={data.pulse}
    />
  );
}

export function BoardForeground({ data }: { data: BoardData }) {
  return (
    <Board>
      {data.columns.map((col) => (
        <BoardColumn key={col.id} title={col.title} count={col.count} tone={col.tone}>
          {col.cards.map((card, i) => (
            <KanbanCardForeground key={i} data={card} />
          ))}
        </BoardColumn>
      ))}
    </Board>
  );
}

/** Recursively resolve a serialisable nav tree's icon keys to nodes. */
function navNodes(nodes: NavNodeData[]): NavNode[] {
  return nodes.map((n) => ({
    id: n.id,
    label: n.label,
    icon: iconNode(n.icon),
    done: n.done,
    children: n.children.length ? navNodes(n.children) : undefined,
  }));
}

export function NavTreeForeground({ data }: { data: NavTreeData }) {
  return (
    <NavTree
      nodes={navNodes(data.nodes)}
      activeId={data.activeId}
      expandedIds={data.expandedIds}
      title={data.title || undefined}
    />
  );
}

export function SidebarForeground({ data }: { data: SidebarData }) {
  return (
    <Sidebar
      header={<Brand name={data.brandName} mark={data.brandMark === 'none' ? undefined : APP_ICONS[data.brandMark]} />}
    >
      {data.items.map((it) => (
        <Fragment key={it.id}>
          {it.section ? <SidebarSection label={it.section} /> : null}
          <SidebarItem icon={APP_ICONS[it.icon]} label={it.label} active={it.active} />
        </Fragment>
      ))}
    </Sidebar>
  );
}

export function AppHeaderForeground({ data }: { data: AppHeaderData }) {
  return (
    <AppHeader
      brand={<Brand name={data.brandName} mark={data.brandMark === 'none' ? undefined : APP_ICONS[data.brandMark]} />}
      center={
        data.searchPlaceholder ? (
          <SearchInput placeholder={data.searchPlaceholder} readOnly trailing={<Kbd>⌘K</Kbd>} />
        ) : undefined
      }
      actions={
        <>
          {data.actions.map((a, i) => (
            <IconButton key={i} icon={APP_ICONS[a]} label={a} variant="ghost" />
          ))}
          {data.avatarName && <Avatar name={data.avatarName} size="sm" presence="ok" />}
        </>
      }
    />
  );
}

export function ToolbarForeground({ data }: { data: ToolbarData }) {
  return (
    <div className="rounded-2xl border border-white/60 bg-white/70 px-3 py-2 shadow-glass backdrop-blur-xl">
      <Toolbar>
        <ToolbarGroup>
          {data.selects.map((s, i) => (
            <Select key={i} value={s.value} leftIcon={iconNode(s.icon)} />
          ))}
        </ToolbarGroup>
        <ToolbarSpacer />
        {data.searchPlaceholder && <SearchInput placeholder={data.searchPlaceholder} readOnly className="w-56" />}
        {data.buttons.map((b, i) => (
          <Button key={i} variant={b.variant} leftIcon={iconNode(b.icon)}>
            {b.label}
          </Button>
        ))}
      </Toolbar>
    </div>
  );
}

export function PanelForeground({ data }: { data: PanelData }) {
  return (
    <Panel title={data.title || undefined} icon={iconNode(data.icon)} footer={data.footer || undefined}>
      <p className="text-sm leading-relaxed text-muted">{data.body}</p>
    </Panel>
  );
}

export function WorkspaceLayoutForeground({ data }: { data: WorkspaceLayoutData }) {
  return (
    <WorkspaceLayout
      rail={<SidebarForeground data={data.rail} />}
      nav={<NavTreeForeground data={data.nav} />}
      header={<AppHeaderForeground data={data.header} />}
    >
      <PanelForeground data={data.panel} />
    </WorkspaceLayout>
  );
}

export function BadgeForeground({ data }: { data: BadgeData }) {
  return (
    <Badge tone={data.tone} variant={data.variant} icon={iconNode(data.icon)}>
      {data.text}
    </Badge>
  );
}

export function ButtonForeground({ data }: { data: ButtonData }) {
  return (
    <Button
      variant={data.variant}
      size={data.size}
      leftIcon={iconNode(data.leftIcon)}
      rightIcon={iconNode(data.rightIcon)}
      fullWidth={data.fullWidth}
    >
      {data.label}
    </Button>
  );
}

export function IconButtonForeground({ data }: { data: IconButtonData }) {
  return (
    <IconButton
      icon={APP_ICONS[data.icon]}
      label={data.label}
      size={data.size}
      variant={data.variant}
      badge={data.badge < 0 ? undefined : data.badge}
      active={data.active}
    />
  );
}

export function SelectForeground({ data }: { data: SelectData }) {
  return (
    <Select
      value={data.value || undefined}
      placeholder={data.placeholder}
      leftIcon={iconNode(data.leftIcon)}
      size={data.size}
      active={data.active}
    />
  );
}
