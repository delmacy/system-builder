---
id: TASK-613
title: STATION Property Inspector primitives
status: blocked
priority: 613
milestone: STATION-COMPOSITION-B
model_tier: architecture
risk: medium
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-612
context_paths:
  - project_docs/execution_planning/STATION-COMPONENT-COMPOSITION-PLAN-01.md
  - project_docs/execution_planning/STATION-COMPOSITION-CONSTRUCTION-B-01.md
  - packages/ui-core/**
allowed_paths:
  - packages/ui-core/**
  - packages/station-interaction/**
  - tests/product/**
  - specs/tasks/TASK-613-STATION-PROPERTY-INSPECTOR-PRIMITIVES.md
forbidden_paths:
  - packages/runtime-core/**
  - packages/deploy/**
  - packages/compiler/**
max_files: 8
validation:
  - npm run lint
  - npm run typecheck
  - npm run test:product
  - npm run check:architecture
  - npm run verify
---

# TASK-613 — STATION Property Inspector primitives

## Objective
Provide reusable `PropertyGroup`/`PropertyRow`/Property Inspector presentation surfaces over explicitly supplied schemas/properties, without inferring or owning business truth.

## Context
Construction B builds the generic editor substrate in dependency order. TASK-611 supplies stable selection/collection contracts and TASK-612 supplies domain-neutral tree navigation. This task adds only the reusable presentation primitives required to inspect explicitly declared properties for the selected reference.

## Current behavior
The Station composition substrate has registry/grid/slot primitives and, after TASK-611/612, generic selection and tree navigation, but it has no canonical Property Inspector surface for grouping and rendering declared presentation properties.

## Required change
Implement bounded, reusable Property Inspector primitives such as `PropertyGroup` and `PropertyRow` that render only caller-supplied property/schema data. Unknown or read-only fields must fail safely or render non-editably. Preserve canonical theme and typography and do not infer domain semantics or persist changes.

## Inputs / contracts
- Stable selected references and generic interaction contracts produced by TASK-611/612 when selection context is needed.
- Explicit caller-supplied property groups, rows, labels, values, editability/read-only metadata and supported presentation controls.
- Canonical Station/UI theme and typography contracts.

## Outputs / contracts
- Reusable, domain-neutral Property Inspector presentation primitives under the allowed UI/interaction packages.
- Deterministic behavior for declared editable/read-only/unknown fields.
- Bounded product evidence covering rendering and safe handling without business or persistence authority.

## Acceptance criteria
- Inspector renders deterministic declared property groups and rows.
- Only explicitly supplied presentation fields and editability metadata are exposed; no business truth is inferred.
- Unknown/read-only fields are handled safely and deterministically.
- Canonical theme/typography are preserved.
- No persistence, draft/publish, Core/business mutation or editor-application authority is introduced.
- Required validation commands pass on the exact implementation head.

## Non-goals
Component Editor/Window Editor application logic, arbitrary CSS authoring, persistence/save/draft/publish, Composition Graph ownership, File Manager, Workflow Studio, Core/business authority, deploy/provider/runtime work.

## Evidence expected
- Focused product tests proving declared groups/rows, editable versus read-only behavior and unknown-field safety.
- Exact-head lint, typecheck, product tests, architecture check and repository verification.
- Diff remains within `allowed_paths` and `max_files`.

## Escalation
Stop and escalate rather than broadening scope if the implementation requires business/domain inference, persistence authority, Composition Graph mutation, forbidden paths, or a contract change outside the materialized Construction B slice.
