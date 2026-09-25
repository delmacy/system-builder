# STATION Composition Construction C — Graph, validation and draft transaction foundation

Sprint ID: `STATION-COMPOSITION-CONSTRUCTION-C-01`
Status: COMMITTED / READY TO CONSTRUCT
Materialization base: `main@6c3e13f868854f041a25da9185a479c540cb003c`
Predecessor: `STATION-COMPOSITION-CONSTRUCTION-B-01` / PR #917 integrated
Planning authority: `STATION-COMPONENT-COMPOSITION-PLAN-01.md`, ADR-0017, `STATION_FRONTEND_FOUNDATION.md`

## Goal
Materialize the next dependency-safe M2 slice exactly as forecast: a declarative Composition Graph, deterministic validation, and local draft/transaction/preview semantics sufficient to prepare the shared Composition Editor Engine without introducing Core/business authority or persistence runtime.

## Dependency rationale
Canonical succession remains `composition contracts -> collections/selection -> Inspector/Layers -> Composition Graph + validation + draft transaction semantics -> shared Composition Editor Engine -> Component Editor specialization`.

## TASK chain
`TASK-615 -> TASK-616 -> TASK-617 -> TASK-618`

- `TASK-615`: declarative Composition Graph contracts and stable node/slot references.
- `TASK-616`: deterministic Composition Graph validator over ComponentRegistry composition contracts, discrete grid/span and named-slot/nesting rules.
- `TASK-617`: local composition draft transaction model with explicit base/draft state, bounded mutations, discard/reset and preview projection; no remote persistence/publish authority.
- `TASK-618`: Component Lab cumulative proof connecting Layers/selection + Inspector to a validated draft graph and preview, with invalid-state evidence.

## Product rules
- `ComponentRegistry != AppManifest`.
- `WindowGeometry != view composition grid`.
- Station remains presentation/composition-only.
- canonical theme and typography remain authoritative.
- grid/span/slots remain discrete; no arbitrary canonical pixel geometry or XS/S/M/L sizing contract.
- graph identity is semantic/stable and independent from DOM position.
- draft transactions mutate composition presentation state only and cannot infer or mutate Core/business truth.

## Allowed scope
- `packages/station-composition/**` for graph, validation and local draft transaction contracts;
- `packages/station-interaction/**` only for bounded integration with existing selection contracts;
- `packages/ui-core/**` only for a reusable primitive gap proven necessary by TASK-618;
- `apps/station/web/app/station-foundation-client.tsx` only for Component Lab proof in TASK-618;
- bounded product/unit tests;
- TASK/spec/current-work documentation.

## Forbidden scope
- Component Editor application or Launcher/AppManifest entry;
- Window/View Editor application;
- remote persistence, publish/deploy/provider runtime or compiler authority;
- File Manager or semantic Artifact Repository;
- Workflow Studio;
- Canvas/3D;
- Core/business/domain authority;
- arbitrary CSS/HTML authoring or arbitrary pixel geometry.

## Exit proof
Construction C exits only when a declarative graph can be built with stable refs, validated deterministically against registry/layout contracts, edited through an explicit local draft transaction, projected to preview without persistence authority, and visibly proven in Component Lab while invalid states fail safely and exact-head gates are green.
