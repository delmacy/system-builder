# TASK-623 — Component Editor specialization model + adapter

Status: running
Depends on: TASK-622

## Allowed
- `packages/station-composition/**`
- colocated tests
- this TASK spec

## Forbidden
Station application wiring; Launcher/AppManifest entry; Window/View Editor; remote persistence/save/publish/deploy/provider runtime; Template Manager; File Manager; Workflow Studio; Core/business authority; arbitrary pixel geometry; parallel editor engine.

## max_files
8

## Acceptance
- define a bounded Component Editor specialization model/adapter over the existing CompositionEditorEngine;
- component identity/registry metadata remains distinct from AppManifest;
- component contract editing is limited to presentation/composition concerns such as named slots, child policy, variants and discrete layout constraints;
- reuse canonical graph validation/draft/preview semantics rather than forking them;
- invalid specialization inputs fail deterministically without corrupting editor state;
- colocated regressions prove boundaries and deterministic behavior;
- applicable exact-head gates pass.
