---
id: TASK-238
title: Prove identity session fail-closed behavior and no-value leakage
status: ready
priority: 238
milestone: M13
model_tier: architecture
risk: high
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-234
  - TASK-235
  - TASK-236
  - TASK-237
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/P13-RUNTIME-IDENTITY-SESSION-01.md
  - packages/contracts/system-definition/system-definition.schema.json
  - packages/contracts/environment-profile/environment-profile.schema.json
  - packages/compiler/runtime-model.ts
  - packages/deploy/local-process.ts
allowed_paths:
  - tests/product/p13-runtime-identity-trust-regression.test.ts
  - packages/compiler/runtime-model.ts
  - packages/deploy/local-process.ts
  - specs/tasks/TASK-238-P13-IDENTITY-SESSION-TRUST-REGRESSION.md
forbidden_paths:
  - .github/**
  - packages/contracts/**
max_files: 8
validation:
  - npm run test:product
  - npm run check:tasks
  - npm run verify
---

# Objective
Extend the repository trust/no-value-leak proof to the identity/authentication/session surfaces introduced by Construction A.

# Required change
Add regressions covering missing/incompatible authentication bindings, malformed credentials request, invalid provider mapping, disabled identity, missing/tampered/expired session and unauthenticated actor-required request. Assert that resolved provider endpoints, credentials, session tokens, signing/integrity secrets and equivalent runtime values are absent from SystemDefinition, generated immutable files, ReleaseArtifact, PublishedRelease, durable deployment evidence and asserted diagnostics.

Bounded redaction/fail-closed corrections are allowed only inside existing Construction A Runtime/deploy paths; no public-contract change.

# Acceptance criteria
- every listed negative path fails closed with controlled diagnostic classification;
- no permissive fallback to anonymous privileged execution exists;
- diagnostics expose identifiers/reference names only when useful, never secret/token values;
- Builder/Observe remain unavailable/irrelevant;
- P13-01 no-value regressions remain green;
- no authorization/UI semantics are added.

# Non-goals
Role/policy evaluation, audit subsystem expansion, generic secret-redaction refactor, TD-P13-01..04 remediation.

# Evidence expected
Focused trust regression plus durable snapshot/diagnostic assertions and declared validations green.

# Escalation
Stop if trust proof requires weakening failure behavior, embedding values, changing Release/Environment ownership or any L4 boundary.