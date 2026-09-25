---
id: TASK-612
title: STATION generic Tree navigation surface
status: ready
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

## Context
Construction B needs a reusable hierarchical navigation primitive before Layers Tree can be assembled. TASK-611 supplies stable semantic collection identity and deterministic single-selection semantics; this task consumes those contracts without introducing editor or domain authority.

## Current behavior
The Station UI substrate has generic composition primitives but no reusable Tree/TreeItem surface with deterministic expansion, keyboard navigation and selection bound to stable semantic item references.

## Required change
Add the minimal domain-neutral Tree/TreeItem navigation surface. Nodes must preserve stable semantic identity independent of DOM/array position, expansion must be deterministic, keyboard navigation and selection must be accessible, and empty or unknown references must fail safely. Consume TASK-611 selection contracts rather than creating a parallel selection authority.

## Inputs / contracts
- TASK-611 generic collection item and deterministic single-selection contracts.
- Existing `packages/ui-core/**` primitives and canonical Station theme/typography behavior.
- Domain-neutral hierarchical node descriptors supplied by presentation/editor consumers.

## Outputs / contracts
- Reusable domain-neutral Tree/TreeItem presentation primitives or equivalent bounded surface.
- Deterministic expansion/navigation behavior over stable semantic node references.
- Keyboard-accessible selection integrated with TASK-611 contracts.
- Product regression evidence for identity stability, expansion/navigation, empty/unknown handling and domain neutrality.

## Acceptance criteria
1. Tree nodes retain stable semantic identity independent of render/array position.
2. Expansion and collapse are deterministic and do not invent domain state.
3. Keyboard navigation and selection are accessible and use TASK-611 selection contracts.
4. Empty selection and unknown references have explicit safe outcomes.
5. Rendering remains domain-neutral and does not acquire editor, file, workflow or Core/business authority.
6. Repository checks relevant to changed files pass.

## Non-goals
- Layers Tree application assembly or Property Inspector wiring.
- Component Editor or Window/View Editor.
- Composition Graph persistence/save/draft/publish.
- File Manager, Workflow Studio or semantic Artifact Repository.
- Core/business/domain authority.
- Arbitrary pixel geometry or a bespoke theme/type system.

## Evidence expected
Happy, negative, keyboard-accessibility and identity-stability product regression coverage plus successful declared validation commands on the exact implementation head. Preserve one authoritative implementation commit for TASK-612 when applicable.

## Escalation
Escalate instead of broadening scope if Tree behavior cannot be expressed through `ui-core` plus TASK-611 domain-neutral interaction contracts, or if satisfying it would require editor-app wiring, persistence, domain semantics, Core/business authority, arbitrary geometry, or ownership changes to ComponentRegistry/window focus.
