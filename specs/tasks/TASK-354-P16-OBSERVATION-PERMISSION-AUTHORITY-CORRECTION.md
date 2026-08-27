---
id: TASK-354
title: Correct observation permission authority and semantic CI gate
status: verification
priority: 354
milestone: M16
model_tier: architecture
risk: high
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-353
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/P16-PACKAGE-03.md
  - project_docs/16-ai-gateway/WBS.md
  - packages/contracts/ai-gateway/**
  - tooling/agent-harness/src/architecture.ts
allowed_paths:
  - packages/contracts/ai-gateway/**
  - tests/product/**
  - tooling/agent-harness/src/architecture.ts
  - tooling/agent-harness/tests/architecture.test.ts
  - project_docs/16-ai-gateway/WBS.md
  - docs/current/NEXT_WORK.md
  - specs/tasks/TASK-354-P16-OBSERVATION-PERMISSION-AUTHORITY-CORRECTION.md
forbidden_paths:
  - packages/runtime-core/**
  - packages/compiler/**
  - packages/observe/**
max_files: 10
validation:
  - npm run test:product
  - npm run test:unit
  - npm run check:tasks
  - npm run check:architecture
  - npm run verify
---
# Objective
Correct the bounded post-Construction-B conformance discrepancy where usage-observation permission was inferred from `budgetQuotas[].metric` names rather than an explicit governance permission rule.

# Authority
User has permanently authorized bounded conformance repairs that remain inside existing change control and must be resolved before the next handoff. This correction remains within P16-PACKAGE-03 / WBS 16.3.3 and is additive/backward-compatible.

# Required change
- add an optional explicit observation-permission rule to the existing execution-governance rule set; absence means no observation measurements are permitted;
- make execution-governance evaluation produce the canonical permitted-observation-measurement decision;
- make governed invocation consume only that evaluated decision and never infer authority from budget/quota metric names;
- prove a `budgetQuotas` metric named `failure`, `quality` or `cost` grants no observation permission by itself;
- extend semantic architecture CI to reject observation authority inferred from budget/quota metrics;
- reconcile WBS/NEXT_WORK so no handoff is READY while this correction remains unmerged or unvalidated.

# Acceptance criteria
- predecessor policies without `observationPermissions` normalize and execute compatibly with an empty permission set;
- explicit observation permissions normalize deterministically and fail closed for unsupported measurements;
- evaluator emits canonical permission decision tied to the evaluated `policyId`;
- governed invocation uses the evaluator decision only;
- budget/quota metrics remain budget/quota semantics only;
- product and unit tests cover the original anti-pattern and corrected path;
- `npm run verify`, Deterministic CI and Heavy Product Tests pass on the exact corrective head;
- repository memory is reconciled before handoff.

# Non-goals
No telemetry backend, billing authority, provider registry/topology, credential lifecycle, Runtime Audit Trail replacement, Knowledge Boundary taxonomy ownership, TD absorption or WBS expansion.

# Handoff gate
`CORRECTION_PENDING` until the corrective PR is merged with exact-head gates PASS and fresh-main revalidation confirms the repaired authority chain.
