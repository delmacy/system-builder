---
id: TASK-239
title: Prove full autonomous identity and session chain on actual predecessor artifacts
status: ready
priority: 239
milestone: M13
model_tier: architecture
risk: high
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-231
  - TASK-232
  - TASK-233
  - TASK-234
  - TASK-235
  - TASK-236
  - TASK-237
  - TASK-238
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/P13-PACKAGE-02.md
  - project_docs/execution_planning/P13-RUNTIME-IDENTITY-SESSION-01.md
  - tests/product/p13-runtime-core-e2e.test.ts
  - tests/product/p13-runtime-services-e2e.test.ts
  - packages/compiler/runtime-model.ts
  - packages/deploy/local-process.ts
allowed_paths:
  - tests/product/p13-runtime-identity-e2e.test.ts
  - specs/tasks/TASK-239-P13-IDENTITY-SESSION-GROWING-PROOF.md
forbidden_paths:
  - .github/**
  - packages/contracts/**
  - packages/compiler/**
  - packages/deploy/**
max_files: 4
validation:
  - npm run test:product
  - npm run test:product:heavy
  - npm run check:tasks
  - npm run verify
---

# Objective
Extend the actual P13-01 growing proof through WBS 13.2.1 identity/authentication/session without hand-authoring downstream artifacts or entering authorization/UI scope.

# Context
TASK-231..238 build the bounded identity/session chain on top of the closed P13-01 Runtime Core. Sprint exit must prove that chain through actual predecessor APIs and heavy process/network boundaries.

# Current behavior
P13-01 E2E proves SystemDefinition through generated autonomous Runtime for entity/action/workflow/services, but there is no equivalent full-chain proof for authentication, session and actor context.

# Required change
Exercise the real chain: `SystemDefinition -> Catalog/Assembly -> Validation -> Compiler -> ReleaseArtifact -> verified ArtifactPayload -> PublishedRelease -> Deploy + external auth binding -> autonomous generated Runtime -> authenticate declared active identity -> establish valid session -> actor context -> representative authenticated Runtime request`. Also exercise invalid authentication, unknown/disabled identity, invalid/expired session and missing authentication binding with Builder/Observe unavailable.

# Inputs / contracts
TASK-231..238 outputs; actual P13-01 Compiler/Release/Deploy/generated Runtime predecessor APIs; existing P13 Runtime E2E tests; P13-RUNTIME-IDENTITY-SESSION-01.

# Outputs / contracts
One growing identity/session E2E proof and exact Sprint validation evidence. No product implementation beyond testing in this final task.

# Acceptance criteria
- all predecessor modules are invoked through actual executable APIs where available;
- one representative identity authenticates and establishes a valid session;
- session reaches actor context on an existing Runtime operation;
- malformed/invalid/expired/disabled/missing-binding paths fail closed;
- P13-01 entity/action/workflow/service behavior remains compatible;
- no credential/provider/session secret or token value appears in durable evidence or controlled diagnostics;
- no role/permission/policy/view behavior is claimed or implemented;
- heavy process/network boundary evidence is included where required.

# Non-goals
Construction B authorization/generated interaction; P13-PACKAGE-03; production IAM/federation; TD-P13-01..04 remediation.

# Evidence expected
One growing E2E test built on actual Compiler/Release/Deploy/generated Runtime predecessor chain, plus exact-head core/heavy Sprint validation.

# Escalation
Stop if the real chain exposes a missing capability that requires undeclared L3/L4 scope rather than a bounded Construction A correction.