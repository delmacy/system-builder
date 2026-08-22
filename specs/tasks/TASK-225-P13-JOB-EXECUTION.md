---
id: TASK-225
title: Execute declared interval jobs inside the generated autonomous Runtime
status: ready
priority: 225
milestone: M13
model_tier: cheap
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

# Context
Construction B deliberately avoids distributed scheduling. TASK-224 will place explicit job descriptors in the generated Runtime model and Construction A already provides bounded action execution inside the autonomous Runtime.

# Current behavior
The generated Runtime has no job scheduler/executor surface. There is no authorized behavior for deriving schedules or targets from names or ordering.

# Required change
Add a bounded single-process interval scheduler/executor for generated jobs. It must use the declared positive interval and explicit action target; unknown/unsupported targets fail closed. Runtime shutdown must clear timers. No distributed, exactly-once or multi-worker guarantee is introduced.

# Inputs / contracts
TASK-221 job descriptors; TASK-224 generated Runtime model; Construction A action executor; current Runtime lifecycle/shutdown behavior.

# Outputs / contracts
Generated single-process job execution surface and focused tests for declared execution, failure paths and lifecycle cleanup. No public-contract changes.

# Acceptance criteria
- representative interval job invokes its declared action target;
- invalid/unknown targets fail deterministically;
- no behavior is inferred from job name/order;
- no Builder/Observe call is required;
- existing action/entity/workflow regressions remain green.

# Non-goals
Distributed scheduling; exactly-once guarantees; worker fleets; broker/provider selection; contract changes.

# Evidence expected
Product tests covering positive interval invocation, invalid target failure, deterministic declared scheduling inputs, shutdown cleanup and Construction A regression compatibility; declared validations green.

# Escalation
Stop if the goal requires distributed scheduling, a broker/worker topology, provider-specific scheduler or any L4 boundary.
