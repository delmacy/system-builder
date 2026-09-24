---
id: TASK-610
title: Prove LEGO composition foundation in Component Lab
status: blocked
priority: 610
milestone: STATION-COMPOSITION-A
model_tier: implementation
risk: medium
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-609
allowed_paths:
  - apps/station/web/**
  - packages/station-composition/**
  - packages/ui-core/**
  - packages/ui-icons/**
  - tests/product/**
  - tests/e2e/**
  - project_docs/execution_planning/**
  - docs/current/NEXT_WORK.md
  - specs/tasks/TASK-610-STATION-COMPOSITION-LAB-PROOF.md
forbidden_paths:
  - packages/runtime-core/**
  - packages/deploy/**
  - packages/compiler/**
max_files: 18
validation:
  - npm run lint
  - npm run typecheck
  - npm run test:product
  - npm run check:architecture
  - npm run verify
---

# Objective
Close Construction A with a visible, executable proof of constrained composition.

# Current behavior
Component Lab demonstrates ui-core primitives and semantic icons, but not registry-driven composition contracts or nested grid/slot behavior.

# Required change
Extend Component Lab with a bounded composition proof: registered components, proportional span examples, ButtonGroup with five icon buttons, and visible valid/invalid constraint outcomes suitable for deterministic/browser qualification.

# Acceptance criteria
The proof uses real package APIs, not mock-only local types; one canonical theme/font remains in force; sizing is expressed as spans/tokens; relevant CI/browser checks pass.

# Non-goals
No Component Editor, Window/View Editor, persistence or AI generation.
