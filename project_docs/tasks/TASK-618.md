# TASK-618 — Component Lab validated draft graph proof

Status: ready
Sprint: `STATION-COMPOSITION-CONSTRUCTION-C-01`
Depends on: TASK-617

## Goal
Visibly prove the validated Composition Graph and local draft/preview transaction in Component Lab, reusing Layers selection and Property Inspector from Construction B.

## Allowed
- `apps/station/web/app/station-foundation-client.tsx`
- `packages/station-composition/**` only for bounded integration gaps
- bounded Station/product tests
- this TASK spec

## Forbidden
- Component Editor application or Launcher/AppManifest entry
- Window/View Editor application
- remote persistence/save/publish/deploy/provider runtime
- File Manager, Workflow Studio, Canvas/3D
- Core/business/domain authority
- arbitrary pixel geometry

## max_files
8

## Acceptance
Component Lab visibly shows a declarative graph, stable Layers selection, Inspector projection, deterministic validation status, a bounded local draft change, discard/reset and preview projection; an invalid graph state is demonstrated safely without corrupting base state.
