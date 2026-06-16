# Deconflict App UI

A granular, glassmorphic component library reconstructed from the five product
reference screens. Same design language as `components/deconflict/`: named
Tailwind tokens (`ink`, `fi`, `match`, `risk`, `muted`, `hair`, `frost`, `navy`,
`cobalt`), named shadows (`shadow-glass`, `shadow-glass-chip`, `field-inset`,
`pill-inset`), Phosphor `/dist/ssr` icons, and `clsx`.

Everything is **server-renderable** unless noted. Import from `@/components/app`.

Live gallery: **`/components`** (all five screens composed end to end).

```tsx
import { Sidebar, NavTree, EntityGraph, StatCard, KanbanCard } from '@/components/app';
```

## Layout

| Folder        | Screen | Components |
| ------------- | ------ | ---------- |
| `primitives/` | shared | `StatusDot` · `Avatar` · `Badge` / `CountBadge` · `StatusBadge` · `Button` · `IconButton` · `SearchInput` / `Kbd` · `Select` · `ProgressBar` · `SegmentedControl` · `Tabs` · `PageDots` · `WindowChrome` |
| `shell/`      | 1 — Workspace | `WorkspaceLayout` · `Sidebar` / `SidebarItem` / `SidebarSection` · `NavTree` · `AppHeader` / `Brand` · `Toolbar` (+ `ToolbarGroup` / `ToolbarDivider` / `ToolbarSpacer`) · `Panel` · `EntityList` / `EntityRow` · `EntityGraph` |
| `search/`     | 2 — Command palette | `CommandPalettePanel` · `CommandPalette` (dialog, client) · `SearchResultRow` · `ResultGroup` |
| `analytics/`  | 3 — Dashboard | `StatCard` · `KpiTile` · `MetricPanel` / `MetricFigure` · `DataTable` · `AreaChart` (client) · `BarChart` · `Sparkline` · `Delta` · `geometry` helpers |
| `board/`      | 4 — Workflow board | `Board` / `BoardColumn` · `KanbanCard` · `ConnectorCard` · `Breadcrumb` · `PageHeader` |
| `code/`       | 5 — Code window | `CodeWindow` · `CodeLine` · `tokenize` / `tokenizeLine` highlighter |

## Conventions

- **Data, not pixels.** Trees (`NavTree`), graphs (`EntityGraph`), charts and the
  board are driven by small data objects with deterministic layout — no refs, no
  measurement — so they render identically on the server.
- **Presentational by default.** Selection / expansion / active state are props
  (`activeId`, `selectedKey`, `value`) with optional callbacks (`onSelect`). Wire
  them to state at the call site.
- **Client components** (`'use client'`): `CommandPalette` (dialog overlay,
  Escape/scroll-lock) and `AreaChart` (uses `useId` for a unique gradient id).
  Both still SSR fine inside a server tree.
- **Accessibility.** Icon-only controls take a required `label`; status uses text
  + colour, not colour alone; meters/graphs carry `role` + `aria-label`.

## Generic `DataTable`

```tsx
const columns: Column<Row>[] = [
  { key: 'id', header: 'Case', render: (r) => <span className="font-mono">{r.id}</span> },
  { key: 'risk', header: 'Risk', render: (r) => <RiskPill tier={r.risk} /> },
];
<DataTable columns={columns} rows={rows} rowKey={(r) => r.id} zebra />
```

## Studio foregrounds

Five of these are registered as composable foreground plates in the visual
studio (pick them from the foreground type dropdown in the inspector):
**Command Palette · Entity Graph · Stat Card · Kanban Card · Code Window**.

Each one touches five spots — the pattern for adding more:

1. `lib/composition/types.ts` — a serialisable `…Data` type + entries in the
   `ForegroundType` and `ForegroundContent` unions. Icons are stored as string
   keys (`AppIconKey`), never React nodes, so the composition stays JSON.
2. `lib/composition/defaults.ts` — sample data + a `defaultForegroundContent` case.
3. `components/studio/ForegroundLayer.tsx` — a `renderContent` case. Icon-bearing
   plates render via a `*Foreground` adapter in `foreground/adapters.tsx` (client
   module) that maps `AppIconKey` → node; icon-free plates (CodeWindow,
   EntityGraph) render their component directly.
4. `lib/composition/registry.ts` — a `{ type, label }` in `FOREGROUND_OPTIONS`.
5. `components/studio/inspector/ForegroundContentEditor.tsx` — an editor sub-form
   + a switch case.

Persistence is generic — `content` is stored/loaded as-is, no per-type code.

## Syntax highlighter

`code/highlight.ts` is a small, dependency-free, line-oriented tokeniser
(comments, strings, numbers, keywords, calls). Pass raw `code` to `CodeWindow`,
or pre-built `Token[][]` via `lines` for full control. Block comments / strings
that span multiple lines are out of scope.
