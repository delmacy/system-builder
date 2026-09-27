# TASK-623 — Component Editor specialization model + adapter

Status: completed
Historical status note: normalized after Station M2 closure. `docs/current/NEXT_WORK.md` records TASK-623..626 plus cumulative proof integrated and final M2 closure through PR #952 / merge `04394f17497c13e572b487e6192edf7c7ae9c026`. This file is not an operational pointer; see `docs/current/NEXT_WORK.md`.
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