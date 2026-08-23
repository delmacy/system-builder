---
id: TASK-237
title: Propagate authenticated actor context into representative Runtime requests
status: ready
priority: 237
milestone: M13
model_tier: cheap
risk: medium
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-231
  - TASK-235
  - TASK-236
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/P13-RUNTIME-IDENTITY-SESSION-01.md
  - packages/compiler/runtime-model.ts
allowed_paths:
  - packages/compiler/runtime-model.ts
  - tests/product/p13-runtime-identity*.test.ts
  - specs/tasks/TASK-237-P13-ACTOR-CONTEXT.md
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
Prove that a valid Runtime session resolves to explicit actor/identity context and that one representative actor-required Runtime operation consumes that context without role/permission authorization.

# Context
TASK-235 and TASK-236 establish authentication and session validity. Construction A must connect that identity to an actual existing Runtime operation while preserving the boundary between authentication and later authorization.

# Current behavior
Existing entity/action Runtime routes execute without actor context. There is no generated request path that restores a declared identity from a valid session and exposes it to an existing operation.

# Required change
Thread the authenticated identity context from TASK-236 through the generated request path. Select one representative existing Runtime operation and require valid authentication for the Construction A proof while preserving its existing business semantics. Distinguish authentication failure from later authorization decisions.

# Inputs / contracts
TASK-235 authenticated identity; TASK-236 session validation; existing generated entity/action request path; P13-RUNTIME-IDENTITY-SESSION-01.

# Outputs / contracts
Actor-context propagation into one representative Runtime operation plus focused authentication-boundary tests. No public-contract change.

# Acceptance criteria
- valid session yields explicit identity/actor context to the representative operation;
- missing/invalid session receives deterministic unauthenticated failure;
- authenticated identity is not automatically assigned a role/permission;
- existing action/entity semantics remain unchanged after authentication succeeds;
- Builder/Observe are not consulted;
- session/credential values are not emitted in durable evidence or diagnostics.

# Non-goals
Permission/policy enforcement; organization membership; UI rendering; broad conversion of every Runtime route to authorization-aware behavior.

# Evidence expected
Focused generated Runtime tests demonstrating actor context propagation, unauthenticated rejection and separation of authentication from authorization.

# Escalation
Stop if actor context propagation requires permission/policy semantics or a new cross-context ownership boundary.