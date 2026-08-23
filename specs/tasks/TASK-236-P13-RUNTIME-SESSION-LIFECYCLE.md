---
id: TASK-236
title: Issue validate and expire bounded Runtime sessions
status: ready
priority: 236
milestone: M13
model_tier: architecture
risk: high
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-231
  - TASK-235
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/P13-RUNTIME-IDENTITY-SESSION-01.md
  - packages/compiler/runtime-model.ts
allowed_paths:
  - packages/compiler/runtime-model.ts
  - tests/product/p13-runtime-identity*.test.ts
  - specs/tasks/TASK-236-P13-RUNTIME-SESSION-LIFECYCLE.md
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
Generate bounded session issuance, validation and expiry for identities successfully authenticated by TASK-235.

# Context
Construction A needs a local autonomous session path after authentication and before actor context propagation. Session integrity and expiry are security-sensitive, but authorization remains Construction B scope.

# Current behavior
Generated Runtime has no session issuance, session validation, expiry or identity restoration path. Authentication established by TASK-235 would otherwise have no bounded persistent request context.

# Required change
Use the explicit session policy from TASK-231 to create Runtime-local session state/token semantics carrying only minimum identity/session claims. Session validity must include explicit expiry and integrity/unknown-state rejection. Any secret material needed for session integrity must be activation-time only and reuse existing external binding rules when available; it must never be embedded in immutable artifacts.

# Inputs / contracts
TASK-231 session policy; TASK-235 authenticated identity result; existing generated Runtime support and external binding/no-value-leak boundaries.

# Outputs / contracts
Generated Runtime bounded session issuance/validation/expiry plus positive and negative tests. No public-contract change.

# Acceptance criteria
- successful authentication can establish a session for the declared identity;
- valid session resolves the same identity deterministically;
- malformed, expired, unknown or tampered session fails closed;
- disabled identity cannot obtain a valid new session;
- session values/signing material are absent from durable factory/release/deploy evidence and controlled diagnostics;
- no role/permission is implied by session validity;
- existing Runtime core behavior remains green.

# Non-goals
Authorization policy; role claims; refresh-token/federation ecosystem; fleet session replication; production IAM topology; UI.

# Evidence expected
Positive and negative generated Runtime session tests with controllable expiry behavior and no-value assertions.

# Escalation
Stop if secure bounded session validity requires a new public contract family, production topology or L4 ownership decision.