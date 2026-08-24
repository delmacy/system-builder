---
id: TASK-252
title: Connect rendered generated actions to existing authority-gated interaction
status: ready
priority: 252
milestone: M13
model_tier: cheap
risk: medium
architecture_impact: false
executor_preference: any
depends_on: [TASK-250, TASK-251]
context_paths:
  - project_docs/execution_planning/P13-RUNTIME-GENERATED-EXPERIENCE-RENDERING-01.md
  - packages/runtime-core/authority-gated-interaction.ts
  - packages/runtime-core/generated-view-bindings.ts
allowed_paths:
  - packages/runtime-core/**
  - tests/product/**
  - specs/tasks/TASK-252-P13-RENDERED-AUTHORITY-INTERACTION.md
forbidden_paths:
  - .github/**
  - packages/contracts/**
  - packages/compiler/**
max_files: 10
validation:
  - npm run test:product
  - npm run check:tasks
  - npm run check:architecture
  - npm run verify
---
# Objective
Connect actions exposed by a generated render document to the existing Construction B authority-gated generated interaction path without creating a second authorization model.

# Current behavior
Construction B already provides the shared authority-gated generated interaction path, but rendered/generated action references are not yet connected to that path through the Construction C render document.

# Inputs / contracts
- Explicit rendered/generated action references originating from the renderer-agnostic generated view/form document.
- Existing generated view binding metadata and the integrated `authorizeRuntimeGeneratedInteraction` shared authority gate.
- Existing authenticated actor/role/permission/policy context only; authentication alone is not authorization.

# Outputs / contracts
- A Runtime integration result that first verifies the rendered action is explicitly bound and then delegates to the existing shared authority decision.
- Allowed/denied results preserve the existing authority decision semantics and deterministic evidence shape.
- No new authorization contract, policy evaluator, role inference or public schema is introduced.

# Required change
Add a Runtime integration path that accepts an explicitly rendered/generated action reference, verifies it belongs to the render document/binding, and delegates authorization to the existing `authorizeRuntimeGeneratedInteraction`/shared authority gate.

# Acceptance criteria
- Rendered action not explicitly bound fails closed before execution authorization.
- Allowed/denied outcomes match the existing shared authority decision exactly.
- Authentication alone never grants an action.
- No role, policy, resource or action inference is introduced.
- No free-text policy evaluation is introduced.
- Evidence remains deterministic, auditable and secret/resolved-value free.
- Product tests prove allowed and denied rendered interactions reuse the same gate.

# Evidence expected
Product tests and repository verification prove rendered actions cannot bypass explicit binding, allowed/denied outcomes reuse the same Construction B authority gate, authentication alone grants nothing, and deterministic evidence contains no sensitive resolved values.

# Non-goals
Do not add action business semantics, persistence mutation, new permission/policy rules, public contracts, UI framework behavior or P13-PACKAGE-03 scope.

# Escalation
Stop if the existing authority gate is insufficient without widening authorization semantics or changing architecture.