---
id: TASK-612
title: STATION generic Tree navigation surface
status: blocked
priority: 612
milestone: STATION-COMPOSITION-B
model_tier: architecture
risk: medium
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-611
context_paths:
  - project_docs/execution_planning/STATION-COMPONENT-COMPOSITION-PLAN-01.md
  - project_docs/execution_planning/STATION-COMPOSITION-CONSTRUCTION-B-01.md
  - packages/station-interaction/**
  - packages/ui-core/**
allowed_paths:
  - packages/ui-core/**
  - packages/station-interaction/**
  - tests/product/**
  - specs/tasks/TASK-612-STATION-GENERIC-TREE-NAVIGATION.md
forbidden_paths:
  - packages/runtime-core/**
  - packages/deploy/**
  - packages/compiler/**
  - apps/station/web/**
max_files: 8
validation:
  - npm run lint
  - npm run typecheck
  - npm run test:product
  - npm run check:architecture
  - npm run verify
---

# TASK-612 — STATION generic Tree navigation surface

## Objective
Build reusable domain-neutral Tree/TreeItem navigation using the generic selection contracts from TASK-611.

## Allowed
- `packages/ui-core/**`
- `packages/station-interaction/**` only for generic navigation integration required by the Tree
- bounded product tests
- this TASK spec

## Forbidden
Editor applications, domain/file/workflow semantics, Core authority, persistence/save/draft/publish, arbitrary pixel geometry, bespoke theme/type systems.

## max_files
7 implementation/test files excluding this TASK spec.

## Acceptance
Stable node identity, deterministic expansion/navigation, keyboard-accessible selection, explicit empty/unknown handling and domain-neutral rendering are regression-proven.
