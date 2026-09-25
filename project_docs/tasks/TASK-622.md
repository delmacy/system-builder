# TASK-622 — Component Lab shared editor engine proof

Status: blocked
Depends on: TASK-621

## Allowed
- `apps/station/web/**`
- tests associated with Station Component Lab
- this TASK spec

## Forbidden
Component Editor application/Launcher/AppManifest entry; Window/View Editor; remote persistence/save/publish/deploy/provider runtime; File Manager; Workflow Studio; Canvas/3D; semantic Artifact Repository; Core/business authority; arbitrary pixel geometry.

## max_files
8

## Acceptance
- Component Lab visibly composes EditorShell + shared CompositionEditorEngine with Layers, stable selection and Property Inspector;
- validation status, bounded local edit, discard/reset and preview are visibly testable;
- invalid edit/reference evidence is visible without corrupting base/draft;
- keyboard/focus behavior remains usable and accessible;
- Station remains presentation/composition-only and registry/grid invariants remain intact;
- regression/product tests prove the cumulative vertical slice;
- lint, typecheck, product/architecture verification, Station Next.js CI and applicable exact-head gates pass.
