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
Add the minimal domain-neutral collection item and deterministic single-selection contracts required by Layers Tree while keeping selection independent from window focus, ComponentRegistry and domain authority.

## Context
Construction A established the constrained component-composition substrate. Layers Tree and later generic editor surfaces now need reusable item identity, collection lookup and selection semantics before any editor application is introduced.

## Current behavior
Station interaction owns focus/selection context for presentation commands, but there is no generic collection contract that binds stable semantic item references to deterministic single-selection behavior for tree/editor surfaces.

## Required change
Add the minimal domain-neutral collection item and selection contracts needed by Layers Tree: stable semantic item identity independent of array/DOM position, explicit empty selection, deterministic select/clear/query behavior, and safe handling of unknown references. Keep the contract generic over payload/domain and separate from window focus/z-order and ComponentRegistry.

## Inputs / contracts
- Existing `packages/station-interaction/**` interaction/selection primitives.
- Construction A composition boundaries and ADR-0017.
- Stable semantic item references supplied by presentation/editor consumers.

## Outputs / contracts
- Generic collection item descriptor/normalization or equivalent bounded contract.
- Deterministic single-selection state operations for known stable item references.
- Explicit safe outcome for unknown item references; no invented selection truth.
- Product regression evidence covering identity stability and separation from window focus.

## Acceptance criteria
1. Generic collection item descriptors can be normalized and queried deterministically.
2. Selection state can select and clear a known stable item reference with explicit empty selection.
3. An unknown item reference is rejected or produces an explicit safe no-op/result, never an invented selected item.
4. Tests prove deterministic behavior, stable identity independent of position and separation from Station window focus.
5. Repository checks relevant to changed files pass.

## Non-goals
- Station app/launcher wiring.
- Component Editor or Window/View Editor.
- Composition Graph persistence/save/draft/publish.
- File Manager, Workflow Studio or semantic Artifact Repository.
- Core/business/domain authority.
- Arbitrary pixel geometry or a local theme/type system.

## Evidence expected
Happy, negative and identity-stability product regression coverage plus successful declared validation commands on the exact implementation head. Preserve one authoritative implementation commit for TASK-611 when applicable.

## Escalation
Escalate instead of broadening scope if the required behavior cannot be expressed within `station-interaction` plus an unavoidable domain-neutral `ui-core` primitive, or if satisfying it would require editor-app wiring, Core/business semantics, composition persistence, arbitrary geometry, or ownership changes to ComponentRegistry/window focus.
