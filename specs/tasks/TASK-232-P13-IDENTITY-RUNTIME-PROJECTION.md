---
id: TASK-232
title: Project identity authentication and session declarations into Compiler Runtime input
status: ready
priority: 232
milestone: M13
model_tier: architecture
risk: high
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-231
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/P13-RUNTIME-IDENTITY-SESSION-01.md
  - packages/contracts/system-definition/system-definition.schema.json
  - packages/compiler/runtime-projection.ts
allowed_paths:
  - packages/compiler/runtime-projection.ts
  - tests/product/compiler-runtime*.test.ts
  - specs/tasks/TASK-232-P13-IDENTITY-RUNTIME-PROJECTION.md
forbidden_paths:
  - .github/**
  - packages/contracts/**
  - packages/deploy/**
max_files: 8
validation:
  - npm run test:product
  - npm run check:tasks
  - npm run verify
---

# Objective
Extend the deterministic Compiler SystemDefinition Runtime projection to carry the explicit identity/authentication/session descriptors introduced by TASK-231.

# Context
Construction A closes WBS 13.2.1 only and must preserve the P13-01 Compiler/Runtime pipeline. Permission, policy and view execution belongs to Construction B.

# Current behavior
The Runtime projection carries entities, actions, processes, environment requirements, jobs, events, files and integrations. It omits identity/auth/session and also omits the existing declarative permissions, policies and views.

# Required change
Add identity/authentication/session projection fields and normalize them deterministically. Validate explicit cross-references, duplicate identifiers, declared provider-binding references and bounded session metadata without resolving provider values. Preserve stable ordering and backward compatibility when declarations are absent.

# Inputs / contracts
TASK-231 SystemDefinition semantics; canonical SystemDefinition schema; existing compiler runtime projection; P13-RUNTIME-IDENTITY-SESSION-01.

# Outputs / contracts
Normalized Compiler Runtime identity/auth/session projection and focused tests. No public-contract mutation in this task.

# Acceptance criteria
- deterministic normalization independent of input order;
- duplicate/unknown identity/provider references fail closed;
- binding references are validated against declared SystemDefinition environment requirements using existing compatible kinds when sufficient;
- no resolved binding/provider/credential values enter projection;
- permissions/policies/views remain unprojected in this task;
- existing P13-01 projection tests remain green.

# Non-goals
RuntimeModel execution; provider calls; session issuance; authorization; UI rendering; new EnvironmentProfile kinds/contracts.

# Evidence expected
Focused compiler projection tests for positive ordering, absent optional descriptors, duplicate/unknown references and no-value behavior.

# Escalation
Stop if projection requires changing a second public contract family or adding authorization/UI semantics.