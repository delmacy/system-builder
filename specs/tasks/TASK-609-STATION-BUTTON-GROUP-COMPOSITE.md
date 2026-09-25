---
id: TASK-609
title: Implement first nested-slot ButtonGroup composite
status: completed
priority: 609
milestone: STATION-COMPOSITION-A
model_tier: cheap
risk: medium
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-608
context_paths:
  - project_docs/execution_planning/STATION-COMPONENT-COMPOSITION-PLAN-01.md
  - project_docs/execution_planning/STATION-COMPOSITION-CONSTRUCTION-A-01.md
allowed_paths:
  - packages/ui-core/**
  - packages/ui-icons/**
  - packages/station-composition/**
  - tests/product/**
  - specs/tasks/TASK-609-STATION-BUTTON-GROUP-COMPOSITE.md
forbidden_paths:
  - packages/runtime-core/**
  - packages/deploy/**
max_files: 12
validation:
  - npm run lint
  - npm run typecheck
  - npm run test:product
---

# Objective
Prove nested micro-layout with a reusable ButtonGroup.

# Current behavior
Buttons exist as primitives, but related icon buttons have no source-owned semantic group/subslot component.

# Required change
Add ButtonGroup as a local semantic composite that occupies one outer composition block and manages internal ButtonSlots using standardized gap/alignment/size tokens. Keep typography/theme fixed.

# Acceptance criteria
Five icon buttons can be rendered as one group; invalid child kinds are rejected by composition validation; the group exposes deterministic internal slot semantics and no arbitrary pixel sizing.

# Non-goals
No toolbar-specific business behavior, theme controls or arbitrary styling API.

# Context
TASK-608 makes nested-slot validation executable; this task proves it with one real semantic composite built from existing UI primitives.

# Inputs / contracts
TASK-608 slot/span validation, ui-core Button/IconButton primitives, semantic ui-icons, and canonical Station theme/typography tokens.

# Outputs / contracts
A reusable ButtonGroup occupying one outer composition block while owning deterministic internal ButtonSlots and token-based micro-layout.

# Evidence expected
Tests/render proof show five semantic icon buttons in one group, deterministic slot semantics, invalid-child rejection, and no arbitrary pixel sizing API.

# Completion evidence
`ui-core` now owns a presentation-only ButtonGroup surface with canonical token classes and no sizing contract. `station-composition` owns the semantic-composite descriptor with five deterministic atomic ButtonSlots, self-owned row micro-layout, discrete spans and no raw pixel geometry. Product tests prove all five slots accept atomic buttons and reject non-atomic children.

# Escalation
Stop if the composite needs toolbar/business semantics, theme controls, unrestricted styling, or private Core/domain imports.
