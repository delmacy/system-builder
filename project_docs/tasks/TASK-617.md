# TASK-617 — Local composition draft transaction model

Status: blocked
Sprint: `STATION-COMPOSITION-CONSTRUCTION-C-01`
Depends on: TASK-616

## Goal
Provide explicit local base/draft composition state and bounded presentation/composition mutations with discard/reset and preview projection.

## Allowed
- `packages/station-composition/**`
- bounded tests
- this TASK spec

## Forbidden
- remote/database persistence
- publish/deploy/provider/compiler authority
- Component Editor application
- Core/business/domain mutations
- WindowGeometry mutation

## max_files
10

## Acceptance
Transactions preserve immutable base truth, produce explicit draft state, validate bounded graph mutations, support discard/reset, and expose a preview projection without claiming persistence or publish authority.
