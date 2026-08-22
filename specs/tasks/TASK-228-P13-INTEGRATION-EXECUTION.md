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

# Required change
For integration descriptors with explicit HTTP method/relative path and `bindingRef`, require a matching EnvironmentProfile binding classified `external-service`. Resolve the referenced base URL only at activation, combine it with the declared relative path, and expose a generated invocation route for declared integrations only. Forward explicit request payload where the declared method permits it. Reject unknown integrations, non-relative paths, missing/incompatible bindings and non-successful invocation states with deterministic diagnostics that do not leak resolved values.

# Acceptance criteria
- representative HTTP integration reaches a controlled test service using the resolved external binding;
- method/path come only from the explicit descriptor;
- missing/incompatible binding and invalid path fail closed;
- resolved base URL/credentials are absent from immutable/durable evidence and asserted diagnostics;
- no provider-specific integration framework or topology is introduced.

# Escalation
Stop if the goal requires a new connector bounded context, provider-specific runtime, credential embedding, topology expansion or L4 change.
