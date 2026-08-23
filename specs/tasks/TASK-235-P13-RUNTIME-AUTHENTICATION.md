---
id: TASK-235
title: Execute explicit replaceable authentication in generated Runtime
status: ready
priority: 235
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
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/P13-RUNTIME-IDENTITY-SESSION-01.md
  - packages/compiler/runtime-model.ts
  - packages/deploy/local-process.ts
allowed_paths:
  - packages/compiler/runtime-model.ts
  - tests/product/p13-runtime-identity*.test.ts
  - specs/tasks/TASK-235-P13-RUNTIME-AUTHENTICATION.md
forbidden_paths:
  - .github/**
  - packages/contracts/**
  - packages/deploy/secret-resolver.ts
max_files: 8
validation:
  - npm run test:product
  - npm run check:tasks
  - npm run verify
---

# Objective
Generate a bounded authentication path that uses only explicitly declared identity/provider semantics and activation-time binding values, then maps successful authentication to a declared active identity.

# Required change
Implement one provider-replaceable reference authentication path sufficient for WBS 13.2.1. Provider interaction must be driven by explicit durable descriptors from TASK-231 and resolved binding input from TASK-234; Runtime must not infer a provider from naming or call Builder/Observe. Authentication result must map to a declared active identity before success.

Credential material received in an authentication request is ephemeral. It must not be echoed into diagnostics or persisted in RuntimeModel, ReleaseArtifact, generated files or deployment evidence.

# Acceptance criteria
- representative declared provider authentication succeeds and maps to the intended active identity;
- invalid provider response, unknown/unmapped identity and disabled identity fail closed;
- malformed auth request fails deterministically;
- authentication does not grant roles/permissions by itself;
- Builder/Observe unavailability does not affect authentication;
- credentials/provider values are absent from durable evidence/diagnostics.

# Non-goals
Enterprise SSO/federation; provider SDK selection; authorization evaluation; roles; policies; UI; session implementation beyond returning authenticated identity context to TASK-236.

# Evidence expected
Generated Runtime authentication tests with real process/provider boundary for success and negative mappings, plus no-value assertions.

# Escalation
Stop if provider-replaceable execution requires a mandatory provider-specific framework, new bounded context or additional public contract change.