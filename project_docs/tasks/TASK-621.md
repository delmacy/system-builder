# TASK-621 — Composition editor accessibility and adversarial hardening

Status: completed
Depends on: TASK-620

Historical closure provenance: integrated by PR #928 / merge commit `e61ec77bbd5860dae0298890114275794a2d024a`. This task file is a historical record; `docs/current/NEXT_WORK.md` remains the sole live operational pointer.

## Allowed
- `packages/station-composition/**`
- `packages/ui-core/**`
- tests colocated with allowed packages
- this TASK spec

## Forbidden
Station application wiring; Component Editor specialization; Window/View Editor; persistence/publish/deploy/provider runtime; Core/business authority; arbitrary pixel geometry.

## max_files
10

## Acceptance
- harden focus/selection handoff between editor chrome, Layers and Inspector without inventing semantic identity;
- unknown selection and dangling/duplicate graph references fail safely;
- rejected edits cannot corrupt base/draft or preview projection;
- negative/adversarial tests cover unknown selection, invalid target, incompatible slot/span and repeated rejection;
- accessibility semantics remain keyboard-operable and deterministic;
- no registry/AppManifest or grid/WindowGeometry boundary crossing;
- lint, typecheck, product/architecture verification and applicable exact-head gates pass.
