# STATION Composition Construction B — Inspector and Layers foundation

Sprint ID: `STATION-COMPOSITION-CONSTRUCTION-B-01`
Status: COMMITTED / READY TO CONSTRUCT
Materialization base: `main@880953ecc04fe4e0a08146d44fa7b12dec7e356d`
Execution branch: `planning/STATION-COMPOSITION-CONSTRUCTION-B-01`
Predecessor: `STATION-COMPOSITION-CONSTRUCTION-A-01` / PR #912 integrated
Planning authority: `STATION-COMPONENT-COMPOSITION-PLAN-01.md`, ADR-0017, `STATION_FRONTEND_FOUNDATION.md`

## Goal
Materialize the smallest dependency-safe post-Construction-A slice: reusable collection/selection/navigation primitives sufficient to prove generic Layers Tree and Property Inspector surfaces without introducing the Composition Editor application yet.

## Dependency rationale
The canonical succession is `Composition contracts + grid/slot rules -> Collections + selection/navigation -> Inspector + Layers Tree + generic editor surfaces -> Composition Graph + validation/save -> Composition Editor Engine -> Component Editor`.

Construction B therefore stops at generic Inspector/Layers proof. It must not skip directly to a Component Editor or Window/View Editor.

## TASK chain
`TASK-611 -> TASK-612 -> TASK-613 -> TASK-614`

- `TASK-611`: generic SelectionModel + collection contracts.
- `TASK-612`: reusable Tree/TreeItem navigation surface over generic data.
- `TASK-613`: schema/presentation-only PropertyInspector primitives (`PropertyGroup`, `PropertyRow`) without domain authority.
- `TASK-614`: Component Lab cumulative proof composing Layers Tree + Property Inspector against a declarative sample composition, with deterministic/product regression evidence.

## Product rules
- `ComponentRegistry != AppManifest`.
- `WindowGeometry != view composition grid`.
- Station remains presentation/composition-only.
- one canonical theme and typography remain authoritative.
- no arbitrary canonical pixel geometry and no XS/S/M/L sizing contract.
- collections own item rendering/selection semantics generically; they do not know files, workflows, entities or business domains.
- Inspector edits only explicitly supplied presentation/composition properties; it cannot infer or mutate Core/business truth.
- selection identity is semantic/stable and independent from DOM position.

## Allowed scope
- `packages/ui-core/**` only for reusable primitive gaps proven necessary by these TASKs;
- `packages/station-interaction/**` for generic selection/navigation contracts;
- a narrowly scoped generic collection/editor-surface package if repository structure requires it;
- `apps/station/web/app/station-foundation-client.tsx` only for Component Lab proof;
- bounded product tests for this slice;
- TASK/spec/current-work documentation.

## Forbidden scope
- Component Editor application;
- Window/View Editor application;
- Composition Graph persistence/save/draft/publish;
- File Manager or semantic Artifact Repository;
- Workflow Studio;
- Canvas/3D;
- deploy/provider runtime;
- Core/business/domain authority;
- arbitrary CSS/HTML authoring.

## Exit proof
Construction B exits only when:
1. generic selection works independently from domain data;
2. a reusable Tree renders/navigates stable generic nodes;
3. reusable Property Inspector surfaces render explicitly declared presentation properties;
4. Component Lab visibly proves Layers Tree + Inspector composition over a sample declarative component hierarchy;
5. invalid/unknown selection/property targets fail safely;
6. deterministic/product/architecture gates are green on the exact head.

## Succession
If Construction B closes green, the next dependency-safe slice may materialize Composition Graph + validator + transaction/save/draft/preview semantics, followed by the shared Composition Editor Engine and then the Component Editor specialization. Do not jump directly to Window/View Editor or File Manager.
