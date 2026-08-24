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

# Context
Construction B is bounded by the integrated P13-PACKAGE-02 L3 change-control decision and WBS 13.2.2-13.2.3.

# Current behavior
The existing shared contract lacks the minimum explicit executable linkage and generated-interaction bindings required by Construction B.

# Required change
Extend only the existing SystemDefinition authority/view descriptors with optional additive semantics explicitly authorized by the bounded L3 decision.

# Inputs / contracts
Use AGENTS.md, the active Package/Sprint plans, WBS 27 authority, the accepted Construction B L3 change-control record, and the current SystemDefinition schema.

# Outputs / contracts
A backward-compatible SystemDefinition contract capable of expressing explicit membership/role linkage, bounded structured policy context where required, and explicit generated view/form bindings.

# Acceptance criteria
- historical fixtures remain valid;
- linkage and bindings are explicit references, never inferred;
- free-text policy statement remains non-executable;
- optional structured policy is bounded/data-only if required;
- no secrets/resolved runtime values or L4 boundary changes.

# Non-goals
Do not add a new contract family, provider-specific IAM, executable free-text policy, UI framework dependency, credential material, or L4 topology/ownership change.

# Evidence expected
Product contract tests plus repository task/verification gates demonstrate backward compatibility, determinism, explicit references and fail-closed validation.

# Escalation
Stop if a second contract family, ownership/topology change or unbounded policy DSL is required.
