# TASK-620 — Shared CompositionEditorEngine controller

Status: blocked
Depends on: TASK-619

## Allowed
- `packages/station-composition/**`
- tests colocated with the allowed package
- this TASK spec

## Forbidden
Station app wiring; AppManifest/Launcher; Component Editor-specific rules; Window/View Editor; remote persistence/save/publish/deploy/provider runtime; Core/business authority; arbitrary pixel geometry.

## max_files
10

## Acceptance
- define a domain-neutral editor state/controller over integrated Composition Graph + validator + local draft transaction semantics;
- expose stable selection, validated bounded mutation, discard/reset and preview projection;
- rejected mutations preserve previous base and draft state and return deterministic findings;
- registry/grid/named-slot invariants remain delegated to canonical composition contracts;
- no remote persistence or publication authority is implied;
- tests cover valid mutation, invalid/dangling target, discard, preview and state immutability after rejection;
- lint, typecheck, product/architecture verification and applicable exact-head gates pass.
