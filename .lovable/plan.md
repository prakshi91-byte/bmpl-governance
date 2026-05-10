## BPML Governance Platform — Implementation Plan

A modern enterprise web app (TanStack Start + Tailwind + shadcn) for governing SAP Solution Manager BPML, capability templates, business templates, project rollout scope and deployment coverage. Visual language: Microsoft Fluent + Linear + SAP Fiori — dense, light, neutral surfaces, no dashboard overload.

### Data foundation (from `BPML_V1.xlsx`)

The Excel has 7 sheets. We'll parse the relevant ones once at build time into a typed JSON dataset shipped with the app (no backend in v1):

- **BPML TABLE** (2,902 rows) — full denormalized hierarchy: IT Domain, IT Service, Process Domain (e.g. `A2R - Accounting 2 Report`), Process Area (`A2R.00.MD - Master Data`), Process / Capability (`A2R.0000 - MD Master Data`), Template ID + Name, Template Step, Bekaert Standard (`YES/Global`, `YES/Option`, `LEG Country Specific`, `Phase Out`, `No More Used`).
- **CAPABILITY TEMPLATE TABLE** — template + step + transaction + standardization.
- **Other Master Data** — Entity list, Product Groups, Business Template Levels (L-0…L-4), Geographical Scope, IT Domains/Services, Process Domains.
- The remaining sheets (Business Template Definition, Scope, Project Scoping, Coverage Map) are empty schema templates → we generate realistic seed records that conform to those schemas.

A Node script (`scripts/build-dataset.mjs`, run once) will read the xlsx via `xlsx` package and emit `src/data/bpml.generated.ts` containing typed arrays:
`processDomains`, `processAreas`, `capabilities`, `templates`, `templateSteps`, `businessTemplates`, `businessTemplateScope`, `projects`, `projectScope`, `coverageCells`, `entities`, `productGroups`, `users`, `roles`.
Synthetic but realistic data is generated for businessTemplates / projects / coverage / users using the real master data so IDs cross-reference correctly.

### Architecture

- **Routing (TanStack Start, file-based):**
  - `__root.tsx` — 3-panel `AppShell` (left nav rail + collapsible nav, top bar with global search + user menu, main outlet, right contextual panel slot via context).
  - `index.tsx` — Home: lightweight landing (KPIs strip + recent activity + quick links — *not* a heavy dashboard).
  - `hierarchy.tsx` — Flagship Process Hierarchy Explorer.
  - `capabilities.index.tsx` + `capabilities.$capabilityId.tsx` — list & detail workspace.
  - `templates.index.tsx` + `templates.$templateId.tsx` — template workspace (tabs: Overview / Steps / Capabilities / Deployments).
  - `steps.tsx` — Template Steps grid (cross-template, sticky filters).
  - `business-templates.index.tsx` + `business-templates.$id.tsx` — packages + multi-select assignment.
  - `projects.index.tsx` + `projects.$projectId.tsx` — project scope workspace.
  - `coverage.tsx` — Coverage heatmap.
  - `admin.users.tsx`, `admin.roles.tsx`, `admin.role-assignments.tsx`, `admin.master-data.tsx`.

- **State:** Zustand store for UI (selected node, right-panel object, nav collapse, role impersonation). TanStack Query wraps in-memory dataset accessors so future API swap is trivial.

- **Security model (client-side simulation in v1):** roles `GlobalAdmin | DomainAdmin | ProjectManager | Viewer`. A `useCurrentRole()` hook + role switcher in top bar gates write actions and admin routes via a `<RequireRole>` guard. (No real auth — Cloud not enabled. Easy to upgrade to Lovable Cloud later.)

### Shared enterprise components (`src/components/enterprise/`)

- `AppShell` — 3-panel layout with collapsible left nav and slide-in right detail panel.
- `NavRail` + `NavSection` — icon + label, active state, badge counts.
- `HierarchyTree` — virtualized expandable tree with search highlight, counts, status badges.
- `DataGrid` — sticky header, dense rows, column visibility, multi-filter chips, pagination, row selection, CSV export. Built on TanStack Table.
- `FilterBar` — sticky chip-based filters (domain, area, status, standardization).
- `DetailPanel` — right-side contextual panel with metadata sections, tabs, related links.
- `WorkspaceTabs`, `MetadataList`, `StatusBadge`, `StandardizationBadge`, `Breadcrumbs`, `EmptyState`, `KPIStat` (compact), `HeatmapCell`.
- `CommandPalette` (⌘K) — global search across hierarchy/templates/capabilities.

### Screen specs

1. **Hierarchy Explorer** — left: tree (Domain → Area → Process → Capability) with counts and search; center: capabilities grid for the selected node with FilterBar + StandardizationBadge columns + template count; right: DetailPanel summarizing the selected capability (owner, IT domain/service, deployment stats stub, top templates, linked projects).
2. **Capability Detail** — workspace with breadcrumb, metadata header, tabs Overview / Templates / Relationships / History.
3. **Template Workspace** — header with Bekaert Standard badge + usage; tabs Overview / Steps / Capabilities / Deployments; Steps tab uses DataGrid (Step Seq, Step Name, SAP Transaction, Description, Standardization, Status).
4. **Template Steps** — flat searchable grid across all templates with sticky filters (template, transaction prefix, standardization).
5. **Business Templates** — list + detail with multi-select capability-template assignment dialog (transfer-list pattern), readiness indicator, scope summary.
6. **Project Scope Workspace** — project header, tabs: Business Templates assigned, Direct Templates, Coverage; assignment dialogs; rollout scope summary.
7. **Coverage Map** — sticky-header/sticky-first-column matrix: rows = process areas/capabilities, columns = business entities; cells colored Covered / Partial / Not covered / N/A with hover tooltip + click → opens right DetailPanel with assignment context.
8. **Administration** — Users, Roles, Role Assignments (matrix), Master Data (entity list, product groups, geo scope, BT levels, IT domains/services).

### Design system

- Update `src/styles.css` tokens to a Fluent/Fiori-inspired neutral palette: near-white background `oklch(0.985 0.002 250)`, panel `oklch(1 0 0)`, border `oklch(0.92 0.005 250)`, foreground `oklch(0.22 0.02 260)`, primary SAP-blue `oklch(0.52 0.15 250)`, plus semantic standardization colors (global=emerald, option=blue, legacy=amber, phase-out=orange, retired=zinc), heatmap colors. Add `--shadow-panel`, `--radius-panel`. Compact typography scale (13px base in grids, 14px body).
- Inter (already common) via `@fontsource` for body; tabular numerals on grid cells.

### Technical details

- Add deps: `xlsx` (build-time only), `@tanstack/react-table`, `@tanstack/react-virtual`, `zustand`, `@fontsource/inter`, `cmdk` (already via shadcn command), `lucide-react` (present).
- `scripts/build-dataset.mjs` — invoked manually once; output committed to `src/data/bpml.generated.ts` (no runtime xlsx).
- All grids virtualized when row count > 200 (template steps will be ~2.9k).
- Right detail panel is a context-driven slide-over on small widths, side panel on ≥1280px.
- Routing follows TanStack file-based conventions (`createFileRoute`); each route sets its own `head()` meta.
- No Lovable Cloud in v1 — data is read-only from the bundled dataset; mutations (assignments, admin edits) live in Zustand for the session and persist to `localStorage`.

### Build order

1. Tokens + AppShell + NavRail + routing skeleton + dataset script & generated types.
2. Hierarchy Explorer (tree + grid + detail panel) — flagship.
3. Capability detail + Template workspace + Steps grid.
4. Business Templates + Project Scope (with assignment dialogs).
5. Coverage Map heatmap.
6. Administration screens + role guard + role switcher.
7. Polish: command palette, empty states, keyboard nav, responsive pass.

### Out of scope for v1

Real auth/persistence (Cloud), import/export of xlsx at runtime, audit history beyond mocked entries, mobile-first layouts (desktop-first as requested).
