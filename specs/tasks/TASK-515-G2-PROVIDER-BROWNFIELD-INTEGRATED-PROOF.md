---
id: TASK-515
title: Prove integrated provider Brownfield locality and bounded peripheral semantics
status: blocked
priority: 515
milestone: G2
model_tier: architecture
risk: high
architecture_impact: true
executor_preference: any
depends_on:
  - TASK-514
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/G2-WP-06-PROVIDER-BROWNFIELD-PHYSICAL-PERIPHERAL.md
  - packages/contracts/**
allowed_paths:
  - tests/product/g2-provider*.test.ts
  - tests/product/g2-brownfield*.test.ts
  - tests/product/g2-locality*.test.ts
  - tests/product/g2-physical-peripheral*.test.ts
  - specs/tasks/TASK-515-G2-PROVIDER-BROWNFIELD-INTEGRATED-PROOF.md
forbidden_paths:
  - packages/db/**
  - apps/**
  - packages/runtime-core/**
max_files: 5
validation:
  - npm run test:product
  - npm run test:product:heavy
  - npm run check:tasks
  - npm run check:architecture
  - npm run typecheck
  - npm run verify
---
# Objective
Close Construction A with integrated Product Proof across TASK-510..514 without new semantic ownership.

# Context
TASK-515 is the Construction A proof gate after TASK-510..514 and must integrate their already-owned semantics without adding product or Production Readiness scope.

# Current behavior
The individual contracts are planned, but Construction A requires one integrated proof across qualification, Brownfield assimilation, identity/coexistence, locality and bounded physical/peripheral governance.

# Inputs / contracts
The exact integrated contracts and Product Proof surfaces produced by TASK-510..514 plus pinned G2 authority and predecessor evidence/currentness/source-of-truth semantics.

# Outputs / contracts
Integrated positive, negative, adversarial and recovery Product Proof only; no new semantic ownership or production-readiness claim.

# Required change
Prove positive, negative, adversarial and recovery paths across provider qualification, Brownfield evidence, external identity reuse/rebinding, coexistence/source-of-truth, locality/currentness, local/Station/Fleet reconciliation and bounded Physical/Peripheral governance.

# Acceptance criteria
- feature/API parity never proves provider support;
- AI/discovery evidence never becomes authority implicitly;
- PARTIAL/UNKNOWN/currentness/locality remain conservative;
- external ID reuse cannot silently change canonical identity or resurrect fenced authority;
- coexistence preserves single canonical truth and residual visibility;
- local/Station/Fleet truth cannot silently become global truth;
- physical integration cannot imply generic actuation authority or confirmed effect;
- Product Proof is not labeled Production Readiness.

# Negative/adversarial proof
Exercise parity=>support, inference=>authority, stale=>current, ID reuse=>same entity, dual truth, hidden residuals, local=>global, connected=>authorized and accepted-command=>effect.

# Evidence expected
Integrated product and heavy Product Proof demonstrate happy, negative, adversarial and recovery behavior across TASK-510..514; task/architecture/typecheck/verify gates pass on the exact head.

# Escalation
Escalate any discovered requirement for new semantic ownership, concrete adapters/devices, deployment, Production Readiness or WP-07+ work rather than absorbing it into this proof TASK.

# Non-goals
Production Readiness, concrete vendor/device adapters, deployment or WP-07+ work.