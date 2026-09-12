---
id: TASK-534
title: Prove integrated messaging provider callback notification residual semantics
status: verification
priority: 534
milestone: G2
model_tier: architecture
risk: high
architecture_impact: true
executor_preference: any
depends_on:
  - TASK-533
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/G2-WP-08-MESSAGING-EVENTS-NOTIFICATIONS-INTEGRATION-AUTOMATION.md
  - packages/contracts/messaging/**
  - packages/contracts/finite-flow/**
allowed_paths:
  - tests/product/g2-messaging-construction-b-proof.test.ts
  - specs/tasks/TASK-534-G2-MESSAGING-CONSTRUCTION-B-PROOF.md
forbidden_paths:
  - packages/db/**
  - apps/**
  - packages/runtime-core/**
max_files: 2
validation:
  - npm run test:product
  - npm run check:tasks
  - npm run check:architecture
  - npm run typecheck
  - npm run verify
---
# Objective
Provide integrated Product Proof across TASK-531..533 without introducing new semantic ownership.

# Context
TASK-534 is the proof-only closure for Construction B after provider coexistence/substitution, callback mapping reconciliation and notification/offline residual drainage semantics integrate on top of the closed Construction A core.

# Current behavior
TASK-531..533 define bounded semantic layers independently. Construction B is not complete until one integrated Product Proof demonstrates their composition with Construction A identity/effect/replay/ordering invariants and WP-07 finite-flow evidence without inventing provider/runtime authority.

# Inputs / contracts
- integrated outputs of TASK-531, TASK-532 and TASK-533;
- Construction A TASK-527..530 identity, effect reconciliation, replay/ordering and integrated proof;
- closed WP-07 finite-flow/residual-cohort semantics.

# Outputs / contracts
Only integrated deterministic Product Proof across the Construction B predecessor contracts. TASK-534 must not create or modify semantic contracts.

# Required change
Add only integrated positive, negative, adversarial and recovery Product Proof composing provider coexistence/substitution, callbacks/integration mappings, notifications/offline buffering and residual drainage with the closed Construction A invariants.

# Acceptance criteria
Deterministic happy/negative/adversarial/recovery proof composes provider coexistence/substitution, callbacks/integration mappings, notifications/offline buffering and residual drainage with Construction A identity, ACK/effect, replay, ordering, PARTIAL/UNKNOWN and finite-flow invariants.

# Evidence expected
Integrated deterministic Product Proof must demonstrate historical lineage through provider substitution and callback replay, ACK/effect separation, reconcile-before-retry for ambiguous mutation, notification intent/delivery/effect separation, residual cohort visibility, and telemetry/currentness/population/units/time gaps preventing false drainage. Exact-head repository validation must remain green.

# Proof obligations
- provider substitution preserves historical occurrence/message/delivery lineage;
- callback/provider ACK never becomes business-effect authority;
- ambiguous callback mutation reconciles before retry;
- notification intent/delivery/effect remain distinct;
- offline/residual subscription/message/callback cohorts remain visible;
- telemetry/currentness/population/unit/time gaps prevent false drainage;
- no concrete provider/runtime/persistence behavior is introduced.

# Escalation
If proof exposes a semantic gap, route bounded retrabalho to TASK-531..533 rather than changing contracts here.

# Non-goals
New contracts, concrete providers, persistence/runtime, deployment, Construction C or Production Readiness.
