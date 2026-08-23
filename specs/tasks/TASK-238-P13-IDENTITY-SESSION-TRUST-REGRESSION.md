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
Extend repository trust/no-value-leak proof to the identity/authentication/session surfaces introduced by Construction A.

# Context
P13-01 established fail-closed external bindings and no-value leakage. Identity/session introduces credentials, provider responses, session tokens and integrity material that must obey the same trust boundary.

# Current behavior
Existing trust regressions cover Runtime configuration, storage and integration bindings, but they do not cover authentication provider mapping, disabled identities, session expiry/tampering or actor-required unauthenticated requests.

# Required change
Add regressions covering missing/incompatible authentication bindings, malformed credential requests, invalid provider mapping, disabled identity, missing/tampered/expired session and unauthenticated actor-required request. Assert resolved provider endpoints, credentials, session tokens, signing/integrity secrets and equivalent runtime values are absent from durable artifacts/evidence and asserted diagnostics. Bounded redaction/fail-closed corrections are allowed only inside Construction A Runtime/deploy paths.

# Inputs / contracts
TASK-234..237 execution surfaces; SystemDefinition and EnvironmentProfile contracts; RuntimeModel/local Deploy; P13-01 no-value-leak evidence.

# Outputs / contracts
Identity/session trust regression evidence and only bounded redaction/fail-closed corrections if required. No public-contract change.

# Acceptance criteria
- every listed negative path fails closed with controlled diagnostic classification;
- no permissive fallback to anonymous privileged execution exists;
- diagnostics expose identifiers/reference names only when useful, never secret/token values;
- Builder/Observe remain unavailable/irrelevant;
- P13-01 no-value regressions remain green;
- no authorization/UI semantics are added.

# Non-goals
Role/policy evaluation; audit subsystem expansion; generic secret-redaction refactor; TD-P13-01..04 remediation.

# Evidence expected
Focused trust regression plus durable snapshot/diagnostic assertions and declared validations green.

# Escalation
Stop if trust proof requires weakening failure behavior, embedding values, changing Release/Environment ownership or any L4 boundary.