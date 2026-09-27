# TASK-625 — Component contract/slot/variant editing proof

Status: completed
Historical status note: normalized after Station M2 closure. `docs/current/NEXT_WORK.md` records TASK-623..626 plus cumulative proof integrated and final M2 closure through PR #952 / merge `04394f17497c13e572b487e6192edf7c7ae9c026`. This file is not an operational pointer; see `docs/current/NEXT_WORK.md`.
Depends on: TASK-624

## Allowed
- `apps/station/web/**`
- `packages/station-composition/**`
- associated tests
- this TASK spec

## Forbidden
Launcher/AppManifest registration; Window/View Editor; remote persistence/publish/deploy/provider runtime; Template Manager; File Manager; Workflow Studio; Core/business authority; arbitrary HTML/CSS; arbitrary pixel geometry.

## max_files
10

## Acceptance
- make named-slot, child-policy, variant and discrete span/constraint editing visibly testable through the Component Editor;
- bounded edits flow through canonical draft/validation/preview semantics;
- invalid slot/reference/span edits are visibly rejected without corrupting base/draft;
- ComponentRegistry identity remains independent from AppManifest;
- no WindowGeometry ownership leaks into component composition;
- regression/product tests prove the editing vertical slice;
- applicable exact-head gates pass.
