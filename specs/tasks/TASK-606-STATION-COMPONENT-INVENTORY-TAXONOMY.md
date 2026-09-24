---
id: TASK-606
title: Inventory and classify Station composable components
status: completed
priority: 606
milestone: STATION-COMPOSITION-A
model_tier: architecture
risk: medium
architecture_impact: true
executor_preference: any
depends_on: []
context_paths:
  - project_docs/execution_planning/STATION-COMPONENT-COMPOSITION-PLAN-01.md
  - packages/ui-core/**
  - packages/ui-icons/**
  - packages/station-shell/**
  - packages/station-windowing/**
  - packages/station-interaction/**
  - packages/station-app-runtime/**
allowed_paths:
  - docs/architecture/**
  - project_docs/execution_planning/**
  - specs/tasks/TASK-606-STATION-COMPONENT-INVENTORY-TAXONOMY.md
forbidden_paths:
  - packages/runtime-core/**
  - packages/deploy/**
  - packages/compiler/**
max_files: 6
validation:
  - npm run check:architecture
---

# Objective
Create the authoritative inventory/taxonomy that Construction A will implement against.

# Current behavior
Station M1 has reusable packages and primitives, but no repository-owned composability inventory classifying atomic primitives, collections, local semantic composites and layout containers.

# Required change
Document existing components, identify duplicates/gaps, assign composition family, and define the minimum dependency closure for TASK-607..610. Keep the inventory descriptive; do not implement editor/application behavior.

# Acceptance criteria
The inventory identifies existing primitives, candidate missing primitives, composition families, ownership package and whether each item is immediately required, deferred or already sufficient.

# Non-goals
No runtime code or editor UI.

# Closure
Completed on branch `sprint/STATION-COMPOSITION-CONSTRUCTION-A-01` with `STATION-COMPONENT-INVENTORY-01.md`. The inventory confirms a new bounded `station-composition` ownership layer and the minimum executable chain taxonomy → registry/contracts → grid/slot validation → ButtonGroup → Component Lab proof.
