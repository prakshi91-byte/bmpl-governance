## Goal

Replace the static `src/data/bpml.generated.ts` (≈3.5K records across 15 entities) with a real Postgres database on Lovable Cloud, gate access behind login, and add admin/viewer roles.

## Phase 1 — Backend setup

1. Enable Lovable Cloud (provisions Postgres, Auth, Storage).
2. Create schema via migration — one table per entity:
   - `process_domains`, `process_areas`, `processes`, `capabilities`
   - `templates`, `template_steps`, `capability_template_links`
   - `business_templates`, `business_template_scope`, `business_template_levels`
   - `projects`, `project_scope`, `coverage_cells`
   - `entities`, `product_groups`, `geographical_scope`
   - `profiles` (linked to `auth.users`, auto-created via trigger)
   - `user_roles` + `app_role` enum (`admin`, `viewer`) — stored in a separate table per security best practice
3. Add `has_role(uuid, app_role)` SECURITY DEFINER function.
4. RLS policies:
   - All BPML tables: SELECT for any authenticated user; INSERT/UPDATE/DELETE only for `admin`.
   - `profiles`: users read/update own row.
   - `user_roles`: users read own roles; only admins write.

## Phase 2 — Seed data

Write a one-off seed script (`scripts/seed-bpml.ts`) that reads `bpml.generated.ts` and bulk-inserts every record using the service-role client. Run it once after migration.

## Phase 3 — Auth

1. Email + Google sign-in (Lovable broker for Google).
2. `/login`, `/signup` public routes.
3. `_authenticated` layout route guarding everything else.
4. `_authenticated/_admin` nested layout for admin-only pages (Admin section, Create/Edit flows).
5. Auth state hook + `onAuthStateChange` listener at root that invalidates router + query cache.
6. Bootstrap: first signed-up user gets `admin` role; subsequent users default to `viewer`.

## Phase 4 — Data layer rewrite

Replace synchronous `repo` API with async server functions + TanStack Query:

- New `src/lib/bpml.functions.ts` exposes `createServerFn` calls: `listDomains`, `listAreasOf(domainId)`, `getCapability(id)`, `searchAll(q)`, etc. — one per current `repo.*` method.
- New `src/lib/bpml.queries.ts` wraps each in `queryOptions` for use with `useSuspenseQuery` and `ensureQueryData`.
- Mutations (`addArea`, `addProcess`, `addCapability`, `addTemplate`, `setProjectScope`) become POST server functions guarded by `requireSupabaseAuth` + admin-role check.
- Drafts store stays client-side (Zustand) — only "publish" calls the mutation.

## Phase 5 — Rewire 22 consumer files

For each route/component currently importing `repo`:

- Convert page render to use `useSuspenseQuery` (or `Route.useLoaderData` for routes with a loader under `_authenticated`).
- Replace write calls (`addAreaToRepo`, `addCapabilityToRepo`, etc.) with `useServerFn` mutations + `queryClient.invalidateQueries`.
- Add `errorComponent` + `pendingComponent` to every loader-bearing route.
- Hide admin-only UI (Create button, Admin nav, edit actions) behind `auth.hasRole('admin')`.

## Phase 6 — Cleanup

- Remove `src/data/repo.ts` mutators and the static export (or keep as a typed shape file only).
- Keep `bpml.generated.ts` checked in for the seed script, then optionally delete.
- Update `AppShell` to show user menu (avatar, sign out, current role).

## Technical notes

- Cascade deletes wired through FKs (domain → areas → processes → capabilities → template links).
- Composite PKs where natural: `capability_template_links(capability_id, template_id)`, `business_template_scope(business_template_id, template_id)`, `project_scope(project_id, business_template_id, template_id)`, `coverage_cells(process_area_id, entity_id)`.
- IDs that are strings in current data (`"A2R"`, `"A2R.00.MD"`) become PK text columns — preserved as-is so existing URLs (`/capabilities/$capabilityId`) keep working.
- Numeric template IDs stay `int` PKs.
- Search uses Postgres `ilike` across name/id columns, returned by a single `searchAll` server function.

## Delivery order (separate turns recommended)

This is large. I'd ship it in stages and let you sanity-check each:

1. Enable Cloud + create schema + auth scaffolding + login pages.
2. Seed script + `_authenticated` guard + role bootstrap.
3. Read-side rewrite: hierarchy, capabilities, processes, templates pages.
4. Read-side rewrite: business templates, projects, coverage.
5. Write-side rewrite: Create flow, admin pages, drafts publish.
6. Cleanup + polish.

Reply "go" to start with stage 1, or tell me which stages to combine / change.