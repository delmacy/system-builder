---
id: TASK-525
title: Integrate storage disposition residual-copy drainage and finite-flow constraints
status: blocked
priority: 525
milestone: G2
model_tier: architecture
risk: high
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-524
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/G2-WP-07-DURABLE-EXECUTION-STORAGE-FINITE-FLOW.md
  - packages/contracts/storage/**
  - packages/contracts/finite-flow/**
allowed_paths:
  - packages/contracts/storage/**
  - packages/contracts/finite-flow/**
  - tests/product/g2-storage-disposition*.test.ts
  - specs/tasks/TASK-525-G2-STORAGE-DISPOSITION-FINITE-FLOW.md
forbidden_paths:
  - packages/db/**
  - apps/**
  - packages/runtime-core/**
max_files: 6
validation:
  - npm run test:product
  - npm run check:tasks
  - npm run check:architecture
  - npm run typecheck
  - npm run verify
---
# Objective
Compose deletion/disposition, residual provider-copy visibility and storage transfer/replay with units/population/time-qualified finite-flow semantics.

# Context
TASK-525 consumes canonical storage identity from TASK-523, qualified transfer/availability lifecycle from TASK-524, and the Construction A finite-flow contract. Its boundary is disposition and residual-copy drainage, not provider-specific deletion execution.

# Current behavior
Before this TASK, storage copies and transfer lifecycle can be represented, but there is no integrated contract proving that deletion/disposition applies to an explicit population while residual copies remain visible and drain only under qualified finite-flow assumptions.

# Required change
Add bounded disposition/drainage contracts or extensions and Product Proof showing qualified populations, residual copies and finite completion assumptions.

# Inputs / contracts
Integrated TASK-523 canonical/provider-copy identity, TASK-524 transfer/availability lifecycle, and TASK-521 finite-flow units/population/time and residual-drainage semantics.

# Outputs / contracts
Bounded provider-neutral storage disposition/drainage contract extensions plus Product Proof under the declared paths. No vendor deletion API, persistence or runtime orchestration is produced.

# Acceptance criteria
- disposition applies to an explicitly qualified population and authority scope;
- deletion ACK does not prove all residual copies drained;
- residual copies/cohorts remain visible until reconciled;
- transfer/replay capacity uses explicit units, population and time assumptions;
- UNKNOWN/PARTIAL telemetry cannot prove drainage or zero residual population;
- dedup or disposal cannot erase lifecycle/source-of-truth evidence.

# Negative/adversarial proof
Cover deletion ACK with residual copies, population or authority-scope mismatch, telemetry gaps/PARTIAL/UNKNOWN used to claim zero residuals, unbounded replay assumptions, and dedup/disposal that would erase source-of-truth or lifecycle evidence.

# Evidence expected
Product Proof demonstrating bounded disposition, residual cohorts and finite drainage under explicit assumptions plus every validation declared in this TASK on the exact implementation head.

# Escalation
If finite disposition requires a semantic capability absent from TASK-523/524 or TASK-521, stop and surface that bounded gap; do not hide residual populations, infer zero from missing telemetry, or absorb TASK-526 closure proof early.

# Non-goals
Vendor deletion APIs, persistence, messaging, deployment or Production Readiness.
