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

## Context
TASK-611..613 establish stable generic selection, accessible Tree navigation and presentation-only Property Inspector primitives. Construction B needs one cumulative visual proof that these primitives compose around the same stable selected component reference before the slice can close.

## Current behavior
Construction A exposes Component Lab and the constrained composition substrate, but it does not yet show the Construction B Layers Tree and Property Inspector working together over a declarative component hierarchy.

## Required change
Wire the source-owned generic Tree/selection and Property Inspector surfaces into Component Lab using a bounded declarative sample hierarchy. Both surfaces must share the same stable selected reference. Changing selection may change only explicitly declared presentation inspection, and invalid references must fail safely.

## Inputs / contracts
- TASK-611 generic collection and single-selection contracts.
- TASK-612 accessible generic Tree/TreeItem navigation.
- TASK-613 presentation-only Property Inspector primitives.
- Existing Component Lab surface in `apps/station/web/app/station-foundation-client.tsx`.
- Canonical Station theme, typography and Construction A composition invariants.

## Outputs / contracts
- A visually testable Component Lab proof showing Layers Tree + Property Inspector over one declarative sample component hierarchy.
- Shared stable selection identity between Tree and Inspector without coupling to window focus, AppManifest or Core/business truth.
- Deterministic product evidence for selection changes and safe invalid-reference behavior.

## Acceptance criteria
1. Component Lab visibly shows Layers Tree and Property Inspector driven by the same stable selected component reference.
2. Changing Tree selection changes only explicitly declared presentation inspection for that reference.
3. Invalid or unknown selected references fail safely and do not invent component or domain truth.
4. Keyboard/accessibility behavior inherited from the generic Tree remains usable in the integrated proof.
5. `ComponentRegistry != AppManifest`, `WindowGeometry != composition grid`, and Station remains presentation/composition-only.
6. Required exact-head product, architecture and repository checks pass within allowed paths and max-files constraints.

## Non-goals
- Component Editor or Window/View Editor application.
- Launcher editor entry.
- Composition Graph persistence/save/draft/publish.
- File Manager, Workflow Studio, Canvas/3D or semantic Artifact Repository.
- Deploy/provider runtime or Core/business authority.
- Arbitrary pixel geometry, arbitrary CSS/HTML authoring or a parallel theme/type system.

## Evidence expected
Visual Component Lab proof plus happy, negative/adversarial, invalid-reference and selection-integration product regression coverage. Exact-head lint, typecheck, product tests, architecture check and repository verification must pass. Preserve one authoritative implementation commit for TASK-614 when applicable.

## Escalation
Stop and escalate rather than broadening scope if the cumulative proof requires persistence, editor-application authority, Core/business semantics, forbidden paths, arbitrary geometry, or ownership changes to ComponentRegistry, AppManifest, WindowGeometry or composition-grid contracts.
