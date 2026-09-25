# TASK-619 — Generic EditorShell surface

Status: ready
Depends on: TASK-618 (integrated by PR #923)

## Allowed
- `packages/ui-core/**`
- tests colocated with the allowed package
- this TASK spec

## Forbidden
Station app wiring; AppManifest/Launcher; Component Editor specialization; Window/View Editor; persistence/publish/deploy/provider runtime; Core/business authority; arbitrary pixel geometry.

## max_files
8

## Acceptance
- export a reusable EditorShell/chrome surface with explicit palette, work-area, layers, inspector, toolbar/commands and status slots;
- shell remains domain-neutral and contains no persistence/business authority;
- keyboard/focus semantics are explicit and accessible where interactive chrome is introduced;
- no hidden ownership of Composition Graph or WindowGeometry;
- tests include empty/partial slot composition and accessibility-safe rendering;
- lint, typecheck, product/architecture verification and applicable exact-head gates pass.
