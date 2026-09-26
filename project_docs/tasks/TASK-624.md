# TASK-624 — Component Editor Station surface

Status: blocked
Depends on: TASK-623

## Allowed
- `apps/station/web/**`
- `packages/ui-core/**` only when strictly required by the reusable surface
- associated Component Editor tests
- this TASK spec

## Forbidden
Launcher/AppManifest registration; Window/View Editor; persistence/publish/deploy/provider runtime; Template Manager; File Manager; Workflow Studio; Core/business authority; arbitrary pixel geometry; duplicated EditorShell/CompositionEditorEngine.

## max_files
10

## Acceptance
- expose a testable Component Editor surface in Station using the existing EditorShell and Component Editor specialization adapter;
- visibly provide palette/work-area/layers/inspector/toolbar/status composition appropriate to reusable component authoring;
- selection and keyboard/focus behavior remain accessible;
- canonical Station theme/typography are preserved;
- no application/runtime authority is introduced;
- applicable exact-head gates pass.
