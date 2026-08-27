---
id: TASK-343
title: Prove fail-closed governed invocation and predecessor compatibility
status: completed
priority: 343
milestone: M16
model_tier: architecture
risk: medium
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-342
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/P16-PACKAGE-02.md
  - project_docs/execution_planning/P16-AI-EXECUTION-GOVERNANCE-INTEGRATION-01.md
  - packages/contracts/ai-gateway/**
allowed_paths:
  - tests/product/**
  - specs/tasks/TASK-343-P16-GOVERNED-INVOCATION-FAIL-CLOSED-PROOF.md
forbidden_paths:
  - packages/runtime/**
  - packages/compiler/**
max_files: 6
validation:
  - npm run test:product
  - npm run check:tasks
  - npm run check:architecture
  - npm run verify
---
# Objective
Prove the real provider-neutral governed invocation path fails closed for governance/schema/metadata violations while preserving WBS 16.1 compatibility.

# Context
TASK-340..342 integrate the WBS 16.2 boundary. This TASK is proof-only and must exercise those actual APIs rather than duplicate logic in tests.

# Current behavior
Individual contracts have focused tests; the complete governed invocation path requires integrated negative and predecessor proof.

# Inputs / contracts
- governed invocation/evaluation APIs from TASK-340..342;
- existing `ModelProviderAdapter`, request/response and capability contracts.

# Outputs / contracts
Product evidence only.

# Required change
Add representative tests proving missing capability, over-limit usage, schema-invalid/invalid output, forbidden/malformed metadata and request/response mismatch fail explicitly at the correct boundary. Prove the legacy provider-neutral `invokeModelProvider` behavior remains usable and unaffected.

# Acceptance criteria
- negative cases exercise actual implementation APIs;
- adapter is not called when pre-invocation governance fails;
- invalid structured output is not reported as valid;
- forbidden metadata is not leaked/synthesized;
- predecessor invocation remains backward-compatible;
- no provider/network/secret/storage dependency is introduced;
- declared validations pass.

# Non-goals
No product implementation, provider registry, real provider call, telemetry/storage, WBS 16.3 or conformance/TD absorption.

# Evidence expected
Integrated product tests with deterministic in-memory adapter doubles and explicit invocation counters/results.

# Escalation
Stop if proof exposes a missing product capability that cannot be corrected within TASK-340..342 materialized scope/change control.
