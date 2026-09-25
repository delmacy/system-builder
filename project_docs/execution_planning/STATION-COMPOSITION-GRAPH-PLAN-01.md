# STATION Composition Graph Plan 01

Date: 2026-09-25
Base: `main@6c3e13f868854f041a25da9185a479c540cb003c`
Milestone: M2 — Station Component Composition/Editor
Status: MATERIALIZED
Predecessor: `STATION-COMPOSITION-CONSTRUCTION-B-01` / TASK-611..614 integrated through PR #917.
Authority: ADR-0017, `STATION_FRONTEND_FOUNDATION.md`, `STATION-COMPONENT-COMPOSITION-PLAN-01.md`.

## Purpose
Materialize only the next dependency-safe M2 slice required by the forecast: a declarative Composition Graph, deterministic validation, and working/draft/preview transaction semantics. This package establishes editor state authority without yet creating the Component Editor application.

## Invariants
- `ComponentRegistry != AppManifest`.
- `WindowGeometry != composition grid`.
- Station remains presentation/composition-only; no Core/business authority.
- Composition uses registry-backed component identities, named slots, discrete grid/span constraints and component-owned nested layouts.
- Canonical theme/typography only; no XS/S/M/L sizing contract and no arbitrary canonical pixel geometry.
- Save means normalize + validate + canonical draft definition; publish remains separate.

## Explicit non-goals
No Component Editor application/Launcher entry yet; no Window/View Editor; no File Manager; no Workflow Studio; no Canvas/3D; no semantic Artifact Repository; no deploy/provider runtime; no business bindings/authority.

## Dependency-safe DAG

```text
TASK-615  Composition Graph contracts + canonical normalization
   ↓
TASK-616  Deterministic graph validator
   ↓
TASK-617  Working transaction/history + dirty/undo/redo
   ↓
TASK-618  Save-to-draft + isolated preview semantics/proof
```

### TASK-615 — Composition Graph contracts + canonical normalization
Status: READY
Depends on: TASK-614 integrated
Allowed: `packages/station-interaction/**`, `packages/ui-core/**`, tests, TASK spec/docs for this slice.
Forbidden: app/runtime manifests, window geometry ownership, persistence adapters, editor application wiring, Core/business packages.
max_files: 8
Acceptance: represent a declarative component tree with stable semantic node identity, registry component key, named slot placement, discrete row/column spans and nested child ownership; canonical normalization is deterministic and rejects/does not encode arbitrary pixel geometry.

### TASK-616 — Deterministic graph validator
Status: BLOCKED
Depends on: TASK-615
Allowed: same composition-contract package surface, tests, TASK spec/docs.
Forbidden: runtime/business authority and application wiring.
max_files: 8
Acceptance: deterministic validation reports unknown component keys, incompatible/missing slots, invalid spans, duplicate semantic node identities and invalid child ownership without mutating the graph.

### TASK-617 — Working transaction/history + dirty/undo/redo
Status: BLOCKED
Depends on: TASK-616
Allowed: `packages/station-interaction/**`, tests, TASK spec/docs.
Forbidden: persistence implementation, app wiring, business authority.
max_files: 8
Acceptance: working graph transaction state has deterministic apply/undo/redo, dirty state relative to a canonical baseline, and rejects invalid transitions through the validator boundary.

### TASK-618 — Save-to-draft + isolated preview semantics/proof
Status: BLOCKED
Depends on: TASK-617
Allowed: composition/interaction contracts, bounded Component Lab proof if required, tests, TASK spec/docs.
Forbidden: semantic Artifact Repository, publication authority, Component Editor application, Window/View Editor.
max_files: 9
Acceptance: `Save Changes` normalizes + validates the working graph into an immutable/canonical Draft Revision value; preview consumes an isolated snapshot and cannot mutate working/draft state; publication remains explicitly separate and unimplemented.

## Exit gate
All TASK-615..618 exact-head gates green, cumulative deterministic proof present, current docs reconciled, and package integrated from fresh main. Only then may M2 materialize the shared Composition Editor Engine slice.
