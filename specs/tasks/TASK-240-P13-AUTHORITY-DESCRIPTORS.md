---
id: TASK-240
title: Add bounded Runtime authority and generated interaction descriptors
status: ready
priority: 240
milestone: M13
model_tier: architecture
risk: high
architecture_impact: true
executor_preference: any
depends_on: []
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/P13-PACKAGE-02.md
  - project_docs/execution_planning/P13-PACKAGE-02.construction-b-l3-change-control.md
  - project_docs/execution_planning/P13-RUNTIME-AUTHORITY-GENERATED-INTERACTION-01.md
  - project_docs/27-identity-organization-authorization/WBS.md
  - packages/contracts/system-definition/system-definition.schema.json
allowed_paths:
  - packages/contracts/system-definition/**
  - tests/product/system-definition*.test.ts
  - specs/tasks/TASK-240-P13-AUTHORITY-DESCRIPTORS.md
forbidden_paths:
  - .github/**
  - packages/contracts/environment-profile/**
  - packages/compiler/**
  - packages/runtime-core/**
max_files: 14
validation:
  - npm run test:product
  - npm run check:tasks
  - npm run verify
---
# Objective
Add only the minimum optional backward-compatible SystemDefinition semantics authorized for explicit actor/membership-to-role linkage, deterministic permission/policy context, and deterministic view/form entity/field/action bindings.

# Acceptance criteria
- historical fixtures remain valid;
- linkage and bindings are explicit references, never inferred;
- free-text policy statement remains non-executable;
- optional structured policy is bounded/data-only if required;
- no secrets/resolved runtime values or L4 boundary changes.

# Escalation
Stop if a second contract family, ownership/topology change or unbounded policy DSL is required.
