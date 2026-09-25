# TASK-615 — Declarative Composition Graph contracts

Status: ready
Sprint: `STATION-COMPOSITION-CONSTRUCTION-C-01`
Depends on: TASK-614 integrated

## Goal
Define the minimal declarative Composition Graph contracts using stable semantic node/slot references, preserving the existing ComponentRegistry boundary and discrete composition model.

## Allowed
- `packages/station-composition/**`
- bounded tests for these contracts
- this TASK spec

## Forbidden
- `apps/station/web/**`
- AppManifest/Launcher changes
- WindowGeometry/window runtime changes
- persistence/save/publish/deploy/provider/compiler
- Component Editor or Window/View Editor application
- Core/business/domain authority
- arbitrary pixel geometry or XS/S/M/L sizing contract

## max_files
8

## Acceptance
- graph/node identity is stable and semantic;
- nodes reference component definitions without becoming the ComponentRegistry;
- parent/child and named-slot placement are explicit;
- layout uses existing discrete grid/span composition contracts rather than WindowGeometry;
- malformed duplicate/dangling structural references can be represented for validator rejection rather than silently normalized;
- deterministic unit evidence is added.
