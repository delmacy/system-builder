---
id: TASK-521
title: Define units-qualified finite-flow capacity backpressure and drainage
status: blocked
priority: 521
milestone: G2
model_tier: architecture
risk: high
architecture_impact: true
executor_preference: any
depends_on:
  - TASK-520
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/G2-WP-07-DURABLE-EXECUTION-STORAGE-FINITE-FLOW.md
  - packages/contracts/workflow/**
  - packages/contracts/mathematical-semantics/**
allowed_paths:
  - packages/contracts/finite-flow/**
  - packages/contracts/workflow/**
  - tests/product/g2-finite-flow*.test.ts
  - specs/tasks/TASK-521-G2-FINITE-FLOW-CAPACITY.md
forbidden_paths:
  - packages/db/**
  - apps/**
  - packages/runtime-core/**
max_files: 7
validation:
  - npm run test:product
  - npm run check:tasks
  - npm run check:architecture
  - npm run typecheck
  - npm run verify
---
# Objective
Define queue/population identity, units-qualified capacity/backpressure and finite drainage semantics that bound recovery/replay work.

# Context
G2-WBS-11 requires demonstrable finite convergence under declared assumptions rather than aggregate throughput claims.

# Current behavior
The repository lacks a G2 finite-flow contract tying capacity evidence to units, population, time horizon and explicit drainage assumptions.

# Required change
Represent queue/population identity, arrival/service units, capacity evidence, backpressure/admission state, replay/recovery horizon and residual drainage without hiding backlog or telemetry gaps.

# Inputs / contracts
Authoritative TASK-519/520 durable execution/effect semantics and existing mathematical units/evidence contracts.

# Outputs / contracts
Finite-flow constraint contract and Product Proof for bounded admission, backpressure, replay and residual drainage.

# Acceptance criteria
- capacity is units-bearing and population/time qualified;
- finite drainability is demonstrated only under declared assumptions;
- backlog/telemetry loss remains visible;
- replay/recovery cannot create unbounded duplicate work;
- UNKNOWN capacity/drainage state cannot strengthen to healthy/drained.

# Negative/adversarial proof
Reject unitless capacity, aggregate=>local capacity, missing telemetry=>zero backlog, replay=>unbounded duplicate admission and UNKNOWN=>drained strengthening.

# Evidence expected
Positive and adversarial Product Proof with explicit finite-drain assumptions plus all declared validations.

# Escalation
Escalate if satisfying the proof requires concrete broker/provider behavior or semantics owned by WP-08.

# Non-goals
Concrete queue broker, autoscaling, messaging subscriptions/DLQ, provider SDK, deployment or Production Readiness.