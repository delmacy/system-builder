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

# Context
TASK-231..234 establish declarative identity/auth/session semantics, deterministic RuntimeModel projection and activation-time provider binding. This task is the first authentication execution step and remains strictly inside WBS 13.2.1.

# Current behavior
Generated Runtime has entity/action/workflow/service execution but no authentication route or provider interaction and no mapping from provider authentication result to a declared identity.

# Required change
Implement one provider-replaceable reference authentication path sufficient for WBS 13.2.1. Provider interaction must be driven by explicit durable descriptors from TASK-231 and resolved binding input from TASK-234; Runtime must not infer provider identity from names or call Builder/Observe. Authentication result must map to a declared active identity before success. Credential material is ephemeral and must not be echoed or persisted.

# Inputs / contracts
TASK-231 SystemDefinition semantics; TASK-233 RuntimeModel; TASK-234 activation-time binding delivery; existing generated Runtime request support.

# Outputs / contracts
Generated Runtime authentication execution plus focused positive/negative tests. No new public contract.

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