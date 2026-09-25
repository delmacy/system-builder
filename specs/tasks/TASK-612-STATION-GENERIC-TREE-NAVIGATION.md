# TASK-612 — STATION generic Tree navigation surface

Status: BLOCKED_BY_DEPENDENCY
Sprint: `STATION-COMPOSITION-CONSTRUCTION-B-01`
Depends on: `TASK-611`

## Objective
Build reusable domain-neutral Tree/TreeItem navigation using the generic selection contracts from TASK-611.

## Allowed
- `packages/ui-core/**`
- `packages/station-interaction/**` only for generic navigation integration required by the Tree
- bounded product tests
- this TASK spec

## Forbidden
Editor applications, domain/file/workflow semantics, Core authority, persistence/save/draft/publish, arbitrary pixel geometry, bespoke theme/type systems.

## max_files
7 implementation/test files excluding this TASK spec.

## Acceptance
Stable node identity, deterministic expansion/navigation, keyboard-accessible selection, explicit empty/unknown handling and domain-neutral rendering are regression-proven.
