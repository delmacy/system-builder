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
