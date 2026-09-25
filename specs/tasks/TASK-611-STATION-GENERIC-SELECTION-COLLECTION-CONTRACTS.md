---
id: TASK-611
title: STATION generic selection and collection contracts
status: ready
priority: 611
milestone: STATION-COMPOSITION-B
model_tier: architecture
risk: medium
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-610
context_paths:
  - project_docs/execution_planning/STATION-COMPONENT-COMPOSITION-PLAN-01.md
  - project_docs/execution_planning/STATION-COMPOSITION-CONSTRUCTION-B-01.md
  - packages/station-interaction/**
allowed_paths:
  - packages/station-interaction/**
  - packages/ui-core/**
  - tests/product/**
  - specs/tasks/TASK-611-STATION-GENERIC-SELECTION-COLLECTION-CONTRACTS.md
forbidden_paths:
  - packages/runtime-core/**
  - packages/deploy/**
  - packages/compiler/**
  - apps/station/web/**
max_files: 7
validation:
  - npm run lint
  - npm run typecheck
  - npm run test:product
  - npm run check:architecture
  - npm run verify
---

# TASK-611 — STATION generic selection + collection contracts

## Objective
Establish the minimal reusable selection/collection contracts required by Layers Tree and later generic editor surfaces, without introducing editor-application or domain semantics.

## Allowed
- `packages/station-interaction/**`
- `packages/ui-core/**` only when a domain-neutral primitive gap is strictly required
- `tests/product/**` bounded regression for this TASK
- this TASK spec

## Forbidden
- Station app/launcher wiring
- Component Editor / Window/View Editor
- Composition Graph persistence/save/draft/publish
- File Manager / Workflow Studio / semantic Artifact Repository
- Core/business/domain authority
- arbitrary pixel geometry or local theme/type system

## max_files
6 implementation/test files excluding this TASK spec.

## Required behavior
- stable semantic item identity independent of array/DOM position;
- single-selection baseline with explicit empty selection;
- deterministic select/clear/query behavior;
- unknown item references fail safely and cannot silently become selection truth;
- contracts remain generic over item payload/domain;
- no ownership overlap with window focus/z-order or ComponentRegistry.

## Acceptance
1. generic collection item descriptors can be normalized/queried deterministically;
2. selection state can select and clear a known stable item reference;
3. an unknown item reference is rejected or produces an explicit safe no-op/result, never an invented selected item;
4. tests prove deterministic behavior and separation from Station window focus;
5. repository checks relevant to changed files pass.

## Proof
Provide happy, negative and identity-stability regression coverage. One authoritative implementation commit for TASK-611 when applicable.
