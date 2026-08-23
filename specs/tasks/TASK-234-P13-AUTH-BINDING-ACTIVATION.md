---
id: TASK-234
title: Validate authentication provider bindings at Runtime activation
status: ready
priority: 234
milestone: M13
model_tier: architecture
risk: high
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-231
  - TASK-232
  - TASK-233
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/P13-RUNTIME-IDENTITY-SESSION-01.md
  - packages/contracts/environment-profile/environment-profile.schema.json
  - packages/deploy/secret-resolver.ts
  - packages/deploy/local-process.ts
  - packages/compiler/runtime-model.ts
allowed_paths:
  - packages/deploy/local-process.ts
  - packages/deploy/secret-resolver.ts
  - tests/product/p13-runtime-identity*.test.ts
  - specs/tasks/TASK-234-P13-AUTH-BINDING-ACTIVATION.md
forbidden_paths:
  - .github/**
  - packages/contracts/**
  - packages/compiler/runtime-projection.ts
max_files: 8
validation:
  - npm run test:product
  - npm run check:tasks
  - npm run verify
---

# Objective
Reuse the existing EnvironmentProfile/SecretResolver activation boundary to validate and deliver the declared authentication-provider binding to generated Runtime without persisting resolved values.

# Context
P13-01 already proves activation-time external binding handling and no-value leakage. P13-02 must reuse that boundary rather than create an identity-specific secret store or Builder lookup.

# Current behavior
Deploy/SecretResolver can resolve classified external references at activation time, but no declared authentication-provider binding is currently consumed by generated Runtime identity/session behavior.

# Required change
Add only bounded activation plumbing for TASK-231 authentication references. Missing, incompatible or unresolved required auth binding must fail closed before false-ready Runtime state. Diagnostics may name the declared reference but must not expose resolved endpoint, credential or secret values.

# Inputs / contracts
TASK-231 identity/auth descriptors; TASK-233 RuntimeModel; existing EnvironmentProfile, SecretResolver and local-process activation contracts; P13-01 no-value-leak evidence.

# Outputs / contracts
Bounded activation-time auth-binding delivery/validation and focused tests. No EnvironmentProfile schema change.

# Acceptance criteria
- compatible declared auth binding reaches Runtime only at activation/execution time;
- missing/incompatible required binding fails closed;
- no resolved authentication value appears in ReleaseArtifact, PublishedRelease, generated immutable files or durable deployment evidence;
- existing P13-01 binding behavior remains green;
- no EnvironmentProfile schema change is required.

# Non-goals
Provider authentication protocol; session issuance; authorization; UI; new secret store; provider-specific topology.

# Evidence expected
Focused activation tests covering compatible/missing/incompatible bindings and no-value diagnostics/evidence.

# Escalation
Stop if existing EnvironmentProfile binding kinds cannot faithfully represent the required auth provider without a public contract change.