---
id: TASK-608
title: Add discrete grid span and nested slot validation
status: blocked
priority: 608
milestone: STATION-COMPOSITION-A
model_tier: architecture
risk: medium
architecture_impact: true
executor_preference: any
depends_on:
  - TASK-607
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
