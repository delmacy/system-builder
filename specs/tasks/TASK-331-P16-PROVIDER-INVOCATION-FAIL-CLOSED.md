---
id: TASK-331
title: Enforce fail-closed provider invocation response validation
status: pending
priority: 331
milestone: M16
model_tier: architecture
risk: medium
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-330
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/P16-PACKAGE-01.md
  - project_docs/execution_planning/P16-PROVIDER-ABSTRACTION-INTEGRATION-01.md
  - packages/contracts/ai-gateway/index.ts
allowed_paths:
  - packages/contracts/ai-gateway/**
  - tests/product/**
  - specs/tasks/TASK-331-P16-PROVIDER-INVOCATION-FAIL-CLOSED.md
forbidden_paths:
  - packages/runtime-core/**
  - packages/compiler/**
  - packages/observe/**
max_files: 5
validation:
  - npm run test:product
  - npm run check:tasks
  - npm run check:architecture
  - npm run verify
---
# Objective
Make the canonical invocation seam fail closed when an adapter returns malformed, mismatched or unavailable results, without fabricating fallback, approval, authorization or deterministic success.

# Context
TASK-330 introduces the representative adapter invocation seam. The Package growing proof requires provider failure behavior to remain explicit and isolated from routing/fallback governance and authority semantics.

# Current behavior
The existing adapter contract permits a Promise<ModelResponse>, but Construction A contract typing alone does not prove that runtime adapter output is normalized and correlated to the invoking request.

# Inputs / contracts
- TASK-330 canonical invocation seam;
- `normalizeModelResponse`;
- request/response requestId correlation;
- existing provider-neutral adapter contract.

# Outputs / contracts
- explicit fail-closed handling for malformed adapter responses and requestId mismatch;
- provider invocation failure remains an error/failure at this seam rather than an implicit fallback decision;
- focused negative/failure product evidence.

# Required change
Validate adapter output through the canonical response normalizer and require correlation with the invoked request. Preserve adapter errors as explicit failures; do not retry, route, choose alternate providers or synthesize a response.

# Acceptance criteria
- malformed response is rejected;
- mismatched requestId is rejected;
- adapter rejection/unavailability does not become a fabricated canonical success;
- no fallback/routing/budget policy or authority semantics are introduced;
- backward-compatible canonical response shape is preserved;
- declared validations pass.

# Non-goals
No retries, alternate-provider selection, routing, quota, cost/provenance capture, credentials, remote transport or Runtime authority changes.

# Evidence expected
Focused product tests covering malformed response, correlation mismatch and adapter failure propagation.

# Escalation
Stop if explicit provider-failure handling requires WBS 16.2 policy semantics or an undeclared architecture boundary.