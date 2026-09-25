# TASK-614 — STATION Layers Tree + Inspector Component Lab proof

Status: BLOCKED_BY_DEPENDENCY
Sprint: `STATION-COMPOSITION-CONSTRUCTION-B-01`
Depends on: `TASK-613`

## Objective
Compose the real generic Tree/selection and Property Inspector surfaces in Component Lab against a declarative sample component hierarchy, proving the reusable editor substrate visually without creating an editor application.

## Allowed
- `apps/station/web/app/station-foundation-client.tsx`
- source-owned generic components created by TASK-611..613 only as needed for integration
- bounded product tests
- this TASK spec/current-work documentation

## Forbidden
Component Editor or Window/View Editor application, Launcher editor entry, persistence/save/draft/publish, File Manager, Workflow Studio, Core/business authority.

## max_files
6 implementation/test/current-work files excluding this TASK spec.

## Acceptance
Component Lab visibly shows a Layers Tree and Inspector driven by the same stable selected component reference; changing selection changes only explicitly declared presentation inspection; invalid references fail safely; deterministic/product checks prove the integration.
