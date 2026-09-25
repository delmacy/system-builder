---
id: TASK-614
title: STATION Layers Tree and Inspector Component Lab proof
status: blocked
priority: 614
milestone: STATION-COMPOSITION-B
model_tier: architecture
risk: medium
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-613
context_paths:
  - project_docs/execution_planning/STATION-COMPONENT-COMPOSITION-PLAN-01.md
  - project_docs/execution_planning/STATION-COMPOSITION-CONSTRUCTION-B-01.md
  - apps/station/web/app/station-foundation-client.tsx
allowed_paths:
  - apps/station/web/app/station-foundation-client.tsx
  - packages/station-interaction/**
  - packages/ui-core/**
  - tests/product/**
  - docs/current/NEXT_WORK.md
  - specs/tasks/TASK-614-STATION-LAYERS-INSPECTOR-LAB-PROOF.md
forbidden_paths:
  - packages/runtime-core/**
  - packages/deploy/**
  - packages/compiler/**
max_files: 7
validation:
  - npm run lint
  - npm run typecheck
  - npm run test:product
  - npm run check:architecture
  - npm run verify
---

# TASK-614 — STATION Layers Tree + Inspector Component Lab proof

## Objective
Compose the real generic Tree/selection and Property Inspector surfaces in Component Lab against a declarative sample component hierarchy, proving the reusable editor substrate visually without creating an editor application.

## Allowed
- `apps/station/web/app/station-foundation-client.tsx`
- source-owned generic components created by TASK-611..613 only as needed for integration
- bounded product tests
- this TASK spec/current-work documentation

## Forbidden
Component Editor or Window/View Editor application, Launcher editor entry, persistence/save/draft/publish, File Manager, Workflow Studio, Core/business authority.

## max_files
6 implementation/test/current-work files excluding this TASK spec.

## Acceptance
Component Lab visibly shows a Layers Tree and Inspector driven by the same stable selected component reference; changing selection changes only explicitly declared presentation inspection; invalid references fail safely; deterministic/product checks prove the integration.
