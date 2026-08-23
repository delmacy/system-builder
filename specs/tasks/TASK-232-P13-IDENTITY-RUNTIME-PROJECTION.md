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
Extend the existing deterministic Compiler SystemDefinition Runtime projection to carry the explicit identity/authentication/session descriptors introduced by TASK-231.

# Context
The current Runtime projection includes entities/actions/processes/environment requirements/jobs/events/files/integrations but omits identity and also omits existing permission/policy/view declarations. Construction A is identity/session only; permission/policy/view projection remains Construction B scope.

# Required change
Add identity/authentication/session projection fields and normalize them deterministically. Validate explicit cross-references, duplicate identifiers, declared provider-binding references and bounded session metadata without resolving provider values. Reject unknown/ambiguous references. Preserve stable ordering and backward compatibility when identity/session declarations are absent.

# Acceptance criteria
- deterministic normalization independent of input order;
- duplicate/unknown identity/provider references fail closed;
- binding references are validated against declared SystemDefinition environment requirements using existing compatible binding kinds when sufficient;
- no resolved binding/provider/credential values enter projection;
- permissions/policies/views remain unprojected in this task;
- existing P13-01 projection tests remain green.

# Non-goals
RuntimeModel execution, provider calls, sessions, authorization, UI rendering, new EnvironmentProfile kinds/contracts.

# Evidence expected
Focused compiler projection tests for positive ordering, absent optional descriptors, duplicate/unknown references and no-value behavior.

# Escalation
Stop if projection requires changing a second public contract family or adding authorization/UI semantics.