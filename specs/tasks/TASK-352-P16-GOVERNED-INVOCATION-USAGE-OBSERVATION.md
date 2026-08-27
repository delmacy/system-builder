---
id: TASK-352
title: Emit policy-derived usage observations from governed invocation
status: ready
priority: 352
milestone: M16
model_tier: architecture
risk: high
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-351
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/P16-PACKAGE-03.md
  - project_docs/execution_planning/P16-AI-SECURITY-OBSERVATION-INTEGRATION-01.md
  - packages/contracts/ai-gateway/index.ts
allowed_paths:
  - packages/contracts/ai-gateway/**
  - tests/product/**
  - specs/tasks/TASK-352-P16-GOVERNED-INVOCATION-USAGE-OBSERVATION.md
forbidden_paths:
  - packages/runtime-core/**
  - packages/compiler/**
  - packages/observe/**
max_files: 7
validation:
  - npm run test:product
  - npm run check:tasks
  - npm run check:architecture
  - npm run verify
---
# Objective
Emit the existing provider-neutral usage observation from governed invocation using permissions derived from the evaluated governance policy.

# Context
Construction A established usage-observation contracts and semantic permission hardening. Fresh-main evidence shows the real governed invocation path does not yet produce the observation.

# Current behavior
Governed invocation returns canonical execution results but does not expose a policy-derived WBS 16.3 usage observation.

# Inputs / contracts
- governed invocation from TASK-351;
- execution-governance policy evaluation and effective policy identifier;
- Construction A usage observation contract/normalizer.

# Outputs / contracts
- provider-neutral usage observation derived from the actual evaluated policy;
- explicit unavailable/omitted fields where source evidence is absent;
- observation remains evidence only and cannot grant authorization.

# Required change
Compose usage observation into the governed invocation result from evidence already available at the seam. Derive observable permissions from the evaluated policy rather than caller claims.

# Acceptance criteria
- successful and failed invocation paths produce deterministic/provider-neutral observations where applicable;
- permission-bearing observation fields are policy-derived;
- missing evidence stays explicit rather than fabricated;
- observation does not alter authorization, routing or fallback decisions;
- predecessor WBS 16.1/16.2 behavior remains compatible;
- declared validations pass.

# Non-goals
No telemetry backend, billing authority, cost settlement, provider registry, Runtime Audit Trail replacement or authorization semantics.

# Evidence expected
Product proof of policy-derived observation, unavailable evidence behavior and non-authoritative semantics.

# Escalation
Stop if completion requires telemetry/billing authority, a new module boundary or another undeclared L4 change.
