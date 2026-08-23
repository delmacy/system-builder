---
id: TASK-237
title: Propagate authenticated actor context into representative Runtime requests
status: ready
priority: 237
milestone: M13
model_tier: standard
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
Prove that a valid Runtime session resolves to explicit actor/identity context and that one representative actor-required Runtime operation consumes that context without yet performing role/permission authorization.

# Required change
Thread the authenticated identity context produced by TASK-236 through the generated request path. Select a representative existing Runtime operation (entity/API/action path) and require valid authentication for the Construction A proof while preserving existing explicit semantics. The request must distinguish authentication failure from later authorization decisions.

# Acceptance criteria
- valid session yields explicit identity/actor context to the representative operation;
- missing/invalid session receives deterministic unauthenticated failure;
- authenticated identity is not automatically assigned a role/permission;
- existing action/entity semantics remain unchanged after authentication succeeds;
- Builder/Observe are not consulted;
- session/credential values are not emitted in durable evidence or diagnostics.

# Non-goals
Permission/policy enforcement, organization membership, UI rendering, broad conversion of every Runtime route to authorization-aware behavior.

# Evidence expected
Focused generated Runtime tests demonstrating actor context propagation, unauthenticated rejection and separation of authentication from authorization.

# Escalation
Stop if actor context propagation requires permission/policy semantics or a new cross-context ownership boundary.