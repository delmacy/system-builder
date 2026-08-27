---
id: TASK-351
title: Carry provider secret references through governed invocation
status: completed
priority: 351
milestone: M16
model_tier: architecture
risk: high
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-350
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/P16-PACKAGE-03.md
  - project_docs/execution_planning/P16-AI-SECURITY-OBSERVATION-INTEGRATION-01.md
  - packages/contracts/ai-gateway/index.ts
allowed_paths:
  - packages/contracts/ai-gateway/**
  - tests/product/**
  - specs/tasks/TASK-351-P16-GOVERNED-INVOCATION-SECRET-REFERENCE.md
forbidden_paths:
  - packages/runtime-core/**
  - packages/compiler/**
  - packages/observe/**
max_files: 6
validation:
  - npm run test:product
  - npm run check:tasks
  - npm run check:architecture
  - npm run verify
---
# Objective
Integrate the existing provider secret-reference contract into governed invocation while preserving the rule that portable artifacts carry references only, never secret material.

# Context
Construction A defined a provider-neutral reference-only secret descriptor. Construction B must prove the real invocation seam can accept and propagate that reference without credential lifecycle or secret-value semantics.

# Current behavior
Governed invocation now accepts an optional provider secret-reference descriptor, normalizes it fail-closed before invocation, and passes only that normalized reference through an invocation context to the adapter seam. The canonical ModelRequest/ModelResponse contracts remain unchanged and contain no secret material.

# Inputs / contracts
- governed invocation from TASK-350;
- Construction A provider secret reference descriptor;
- predecessor provider adapter/invocation contracts.

# Outputs / contracts
- optional reference-form secret input accepted by governed invocation;
- no secret value persisted or added to canonical portable request/response contracts;
- explicit failure for malformed references.

# Required change
Compose the existing secret-reference descriptor into the invocation input/context without resolving, issuing, rotating or revoking credentials.

# Acceptance criteria
- valid reference passes to the invocation seam without secret material;
- malformed/reference-shape violations fail closed;
- canonical portable artifacts remain free of secret values;
- predecessor invocation behavior remains compatible;
- declared validations pass.

# Non-goals
No credential resolution, issuance, rotation, revocation, provider registry, endpoint topology, secret storage or billing authority.

# Evidence expected
Product tests proving reference-only carriage and rejection of secret material/malformed references.

# Escalation
Stop if completion requires credential lifecycle or another undeclared L4 change.
