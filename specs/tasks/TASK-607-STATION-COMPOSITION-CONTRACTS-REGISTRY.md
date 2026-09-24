---
id: TASK-607
title: Implement Station composition contracts and component registry
status: ready
priority: 607
milestone: STATION-COMPOSITION-A
model_tier: architecture
risk: high
architecture_impact: true
executor_preference: any
depends_on:
  - TASK-606
context_paths:
  - project_docs/execution_planning/STATION-COMPONENT-COMPOSITION-PLAN-01.md
  - project_docs/execution_planning/STATION-COMPOSITION-CONSTRUCTION-A-01.md
allowed_paths:
  - packages/station-composition/**
  - packages/ui-core/**
  - tests/product/**
  - specs/tasks/TASK-607-STATION-COMPOSITION-CONTRACTS-REGISTRY.md
forbidden_paths:
  - apps/station-gateway/**
  - packages/runtime-core/**
  - packages/deploy/**
  - packages/compiler/**
max_files: 14
validation:
  - npm run lint
  - npm run typecheck
  - npm run test:product
  - npm run check:architecture
---

# Objective
Create executable source-owned contracts for LEGO-style composition and a deterministic Component Registry.

# Current behavior
Component capabilities are implicit in React APIs and package ownership. No canonical contract tells editors/AI which parents, slots, child policies or spans are valid.

# Required change
Introduce a bounded `station-composition` package owning ComponentDescriptor/Slot/Layout/ChildPolicy/Constraints and a deterministic registry. Registry data must be serializable, stable-id based and independent of editor UI.

# Acceptance criteria
Registry supports register/get/list; duplicate IDs fail deterministically; contracts represent atomic/collection/composite/layout families; tests prove validation of required fields and deterministic ordering.

# Non-goals
No editor, persistence, bindings, business commands or dynamic plugin loading.


# Context
TASK-606 established the taxonomy and identified station-composition as the bounded owner for reusable composition metadata.

# Inputs / contracts
TASK-606 inventory, ADR-0017, Station frontend foundation, and the Construction A composition plan.

# Outputs / contracts
Serializable ComponentDescriptor/Slot/Layout/ChildPolicy/Constraints contracts and a deterministic stable-id ComponentRegistry independent of AppManifest and editor UI.

# Evidence expected
Product tests prove required-field validation, register/get/list behavior, duplicate rejection, family representation, and deterministic ordering.

# Escalation
Stop if the registry needs Core/business authority, dynamic plugin loading, arbitrary pixel geometry, or application/editor-specific state.
