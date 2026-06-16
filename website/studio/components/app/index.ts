/* -------------------------------------------------------------------------- *
 * Deconflict App UI — a granular component library reconstructed from the five
 * product reference screens. Import from '@/components/app'.
 *
 *   primitives/  shared atoms (dots, badges, buttons, inputs, tabs…)
 *   shell/       workspace chrome — sidebar, nav tree, header, panels, graph
 *   search/      command palette + result rows
 *   analytics/   stat cards, metric panel, data table, charts
 *   board/       kanban board, cards, connectors, page header
 *   code/        dark line-numbered code window + highlighter
 *   messaging/   secure chat thread, message bubbles, encrypted files
 * -------------------------------------------------------------------------- */

// primitives
export * from './primitives/StatusDot';
export * from './primitives/Avatar';
export * from './primitives/Badge';
export * from './primitives/StatusBadge';
export * from './primitives/Button';
export * from './primitives/IconButton';
export * from './primitives/SearchInput';
export * from './primitives/Select';
export * from './primitives/ProgressBar';
export * from './primitives/SegmentedControl';
export * from './primitives/Tabs';
export * from './primitives/Pagination';
export * from './primitives/WindowChrome';

// shell (Screen 1)
export * from './shell/Sidebar';
export * from './shell/NavTree';
export * from './shell/AppHeader';
export * from './shell/Toolbar';
export * from './shell/Panel';
export * from './shell/EntityList';
export * from './shell/EntityGraph';
export * from './shell/WorkspaceLayout';

// search (Screen 2)
export * from './search/SearchResultRow';
export * from './search/ResultGroup';
export * from './search/CommandPalette';

// analytics (Screen 3)
export * from './analytics/geometry';
export * from './analytics/Sparkline';
export * from './analytics/AreaChart';
export * from './analytics/BarChart';
export * from './analytics/Delta';
export * from './analytics/StatCard';
export * from './analytics/KpiTile';
export * from './analytics/MetricPanel';
export * from './analytics/DataTable';
export * from './analytics/DonutChart';
export * from './analytics/GaugeArc';
export * from './analytics/DistributionBar';
export * from './analytics/Heatmap';
export * from './analytics/RankList';
export * from './analytics/ActivityFeed';

// board (Screen 4)
export * from './board/Breadcrumb';
export * from './board/PageHeader';
export * from './board/KanbanCard';
export * from './board/ConnectorCard';
export * from './board/Board';

// code (Screen 5)
export * from './code/highlight';
export * from './code/CodeLine';
export * from './code/CodeWindow';

// messaging (Screen 6)
export * from './messaging/EncryptedFile';
export * from './messaging/ChatMessage';
export * from './messaging/SecureChat';
