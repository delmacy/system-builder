# TASK-626 — Component Editor cumulative integration + closure

Status: blocked
Depends on: TASK-625

## Allowed
- `apps/station/web/**`
- `packages/station-composition/**`
- associated tests
- `docs/current/**`
- this TASK spec

## Forbidden
Launcher/AppManifest registration unless separately materialized; Window/View Editor implementation; remote persistence/publish/deploy/provider runtime; Template Manager implementation; File Manager; Workflow Studio; Core/business authority; arbitrary pixel geometry.

## max_files
10

## Acceptance
- cumulative Component Editor specialization is visibly testable in Station from component selection through contract/slot/variant edit, validation, draft/dirty state, discard/reset and preview;
- accessibility/keyboard/focus and adversarial invalid-input regressions remain green;
- architectural invariants are explicitly reverified;
- Construction E documentation is reconciled against fresh main;
- lint, typecheck, product/architecture verification, Station Next.js CI and applicable exact-head gates pass;
- no successor scope is implemented before Construction E closure.
