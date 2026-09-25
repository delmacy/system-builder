# TASK-613 — STATION Property Inspector primitives

Status: BLOCKED_BY_DEPENDENCY
Sprint: `STATION-COMPOSITION-CONSTRUCTION-B-01`
Depends on: `TASK-612`

## Objective
Provide reusable `PropertyGroup`/`PropertyRow`/Property Inspector presentation surfaces over explicitly supplied schemas/properties, without inferring or owning business truth.

## Allowed
- `packages/ui-core/**`
- narrowly scoped generic Station editor-surface package if necessary
- bounded product tests
- this TASK spec

## Forbidden
Core/business mutation, arbitrary CSS authoring, Component Editor/Window Editor application logic, persistence/save/draft/publish, File Manager, Workflow Studio.

## max_files
7 implementation/test files excluding this TASK spec.

## Acceptance
Inspector renders deterministic declared property groups/rows, exposes only supplied editable presentation fields, handles unknown/read-only fields safely and preserves canonical theme/typography.
