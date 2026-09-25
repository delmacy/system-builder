---
id: TASK-608
title: Add discrete grid span and nested slot validation
status: completed
priority: 608
milestone: STATION-COMPOSITION-A
model_tier: architecture
risk: medium
architecture_impact: true
executor_preference: any
depends_on:
  - TASK-607
context_paths:
  - project_docs/execution_planning/STATION-COMPONENT-COMPOSITION-PLAN-01.md
  - project_docs/execution_planning/STATION-COMPOSITION-CONSTRUCTION-A-01.md
allowed_paths:
  - packages/station-composition/**
  - tests/product/**
  - specs/tasks/TASK-608-STATION-GRID-SPAN-SLOT-CONSTRAINTS.md
forbidden_paths:
  - packages/runtime-core/**
  - packages/deploy/**
  - packages/compiler/**
max_files: 10
validation:
  - npm run lint
  - npm run typecheck
  - npm run test:product
  - npm run check:architecture
---

# Objective
Make proportional grid/span and slot compatibility executable.

# Current behavior
Station supports window geometry but has no declarative component composition grid.

# Required change
Add discrete columnSpan/rowSpan constraints, allowed-parent/layout rules, named slot acceptance and explicit layout ownership. Reject out-of-range spans and incompatible child placement.

# Acceptance criteria
Tests prove valid spans, invalid spans, slot acceptance/rejection and nested layout ownership. No raw pixel size becomes canonical composition state.

# Non-goals
No responsive breakpoint editor, freeform x/y layout or drag-resize implementation.

# Context
TASK-607 provides the registry/contracts that discrete layout and slot compatibility must extend without reusing WindowGeometry as view composition state.

# Inputs / contracts
TASK-607 composition contracts and registry plus the Construction A grid/span and nested-slot rules.

# Outputs / contracts
Discrete row/column span constraints, named-slot compatibility, allowed-parent/layout validation, and explicit nested layout ownership.

# Evidence expected
Product tests prove accepted/rejected spans, accepted/rejected slot placement, and nested layout ownership with no canonical raw pixel sizing.

# Completion evidence
`station-composition` now validates integer row/column spans against descriptor constraints, named-slot family/layout compatibility, optional allowed-parent families, and explicit self-ownership for nested local layouts. Product tests cover accepted/rejected spans, incompatible placement and nested ownership without introducing raw pixel geometry or WindowGeometry coupling.

# Escalation
Stop if validation requires freeform x/y geometry, responsive editor behavior, window lifecycle authority, or Core/domain state.
