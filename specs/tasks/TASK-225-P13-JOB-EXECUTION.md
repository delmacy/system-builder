---
id: TASK-225
title: Execute declared interval jobs inside the generated autonomous Runtime
status: ready
priority: 225
milestone: M13
model_tier: code
risk: high
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-224
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/P13-RUNTIME-SERVICES-BINDINGS-01.md
  - packages/compiler/runtime-model.ts
  - packages/runtime-core/action-execution.ts
  - packages/runtime-core/index.ts
allowed_paths:
  - packages/runtime-core/job-execution.ts
  - packages/runtime-core/index.ts
  - packages/compiler/runtime-model.ts
  - tests/product/p13-runtime-services*.test.ts
  - specs/tasks/TASK-225-P13-JOB-EXECUTION.md
forbidden_paths:
  - .github/**
  - packages/contracts/**
  - packages/deploy/**
max_files: 8
validation:
  - npm run test:product
  - npm run check:tasks
  - npm run verify
---

# Objective
Execute the explicit interval-job semantics committed by TASK-221 in the same generated Runtime process, invoking only the declared action target and recordId.

# Required change
Add a bounded single-process interval scheduler/executor for generated jobs. It must use the declared positive interval and explicit action target; unknown/unsupported targets fail closed. Runtime shutdown must clear timers. No distributed, exactly-once or multi-worker guarantee is introduced.

# Acceptance criteria
- representative interval job invokes its declared action target;
- invalid/unknown targets fail deterministically;
- no behavior is inferred from job name/order;
- no Builder/Observe call is required;
- existing action/entity/workflow regressions remain green.

# Escalation
Stop if the goal requires distributed scheduling, a broker/worker topology, provider-specific scheduler or any L4 boundary.
