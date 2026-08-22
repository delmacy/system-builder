---
id: TASK-228
title: Execute declared HTTP integration invocation through external service binding
status: ready
priority: 228
milestone: M13
model_tier: code
risk: high
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-227
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/P13-RUNTIME-SERVICES-BINDINGS-01.md
  - packages/contracts/environment-profile/environment-profile.schema.json
  - packages/deploy/local-process.ts
  - packages/runtime-core/index.ts
allowed_paths:
  - packages/runtime-core/integration-execution.ts
  - packages/runtime-core/index.ts
  - packages/compiler/runtime-model.ts
  - packages/deploy/local-process.ts
  - tests/product/p13-runtime-services*.test.ts
  - specs/tasks/TASK-228-P13-INTEGRATION-EXECUTION.md
forbidden_paths:
  - .github/**
  - packages/contracts/**
max_files: 10
validation:
  - npm run test:product
  - npm run check:tasks
  - npm run verify
---

# Objective
Execute one representative declared HTTP integration through an explicit classified external-service binding, preserving activation-time endpoint resolution and Runtime autonomy.

# Context
TASK-221/222 define explicit integration invocation and reference-only binding classification. The existing Deploy path owns activation-time resolution, while Runtime must execute only the declared method/path without importing Builder or provider-specific infrastructure.

# Current behavior
Integration entries contain identity/contract/direction but no generated execution surface. The Runtime has no authorized external-service binding invocation behavior.

# Required change
For integration descriptors with explicit HTTP method/relative path and `bindingRef`, require a matching EnvironmentProfile binding classified `external-service`. Resolve the referenced base URL only at activation, combine it with the declared relative path, and expose a generated invocation route for declared integrations only. Forward explicit request payload where the declared method permits it. Reject unknown integrations, non-relative paths, missing/incompatible bindings and non-successful invocation states with deterministic diagnostics that do not leak resolved values.

# Inputs / contracts
TASK-221 integration descriptors; TASK-222 binding classification; TASK-224 Runtime model; existing Deploy external binding resolution path.

# Outputs / contracts
Bounded generated HTTP integration executor, activation-time external-service handoff and focused product tests. No provider-specific connector framework.

# Acceptance criteria
- representative HTTP integration reaches a controlled test service using the resolved external binding;
- method/path come only from the explicit descriptor;
- missing/incompatible binding and invalid path fail closed;
- resolved base URL/credentials are absent from immutable/durable evidence and asserted diagnostics;
- no provider-specific integration framework or topology is introduced.

# Non-goals
Provider SDKs; connector bounded contexts; credential embedding; topology expansion; arbitrary protocols.

# Evidence expected
Product tests proving positive invocation against a controlled service, invalid/unknown integration failure, missing/incompatible binding rejection and no-value-leak diagnostics; declared validations green.

# Escalation
Stop if the goal requires a new connector bounded context, provider-specific runtime, credential embedding, topology expansion or L4 change.
