# TASK-625 — Component contract/slot/variant editing proof

Status: blocked
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
