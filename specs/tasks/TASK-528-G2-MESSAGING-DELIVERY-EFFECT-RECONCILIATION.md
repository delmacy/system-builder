---
id: TASK-528
title: Separate delivery attempts and provider acknowledgements from business effects
status: verification
priority: 528
milestone: G2
model_tier: architecture
risk: high
architecture_impact: true
executor_preference: any
depends_on:
  - TASK-527
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/G2-WP-08-MESSAGING-EVENTS-NOTIFICATIONS-INTEGRATION-AUTOMATION.md
  - packages/contracts/messaging/**
  - packages/contracts/workflow/**
allowed_paths:
  - packages/contracts/messaging/**
  - tests/product/g2-messaging-delivery*.test.ts
  - specs/tasks/TASK-528-G2-MESSAGING-DELIVERY-EFFECT-RECONCILIATION.md
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
Define delivery/attempt acknowledgement and business-effect reconciliation semantics on TASK-527 identity lineage.

# Context
TASK-528 consumes TASK-527 canonical occurrence/message/subscription lineage together with closed WP-07 durable external-effect reconciliation/idempotency semantics and WP-06 provider qualification/currentness semantics.

# Current behavior
No bounded messaging contract currently separates delivery attempts and provider acknowledgements from business-effect truth while preserving unsafe ambiguous outcomes as UNKNOWN and requiring reconciliation before unsafe retry.

# Inputs / contracts
- TASK-527 event occurrence, message, subscription and producing-revision lineage;
- closed WP-07 external-effect reconciliation, idempotency scope/horizon and reconcile-before-retry semantics;
- closed WP-06 provider qualification and currentness semantics.

# Outputs / contracts
Provider-neutral messaging delivery/attempt and acknowledgement/effect reconciliation contracts plus Product Proof, without concrete broker, runtime or persistence realization.

# Required change
Define delivery-attempt and acknowledgement evidence so transport/provider success remains distinct from business-effect truth, while ambiguous mutating outcomes preserve UNKNOWN and require reconciliation before any unsafe retry.

# Acceptance criteria
- delivery and attempt identities remain distinct from occurrence/message/effect identity;
- provider ACK never proves business effect or convergence;
- ambiguous mutating outcome preserves UNKNOWN and requires reconcile-before-retry where replay is unsafe;
- idempotency/effect evidence remains authority/scope/payload/horizon qualified;
- provider qualification/currentness is explicit and non-authoritative for business truth.

# Negative/adversarial proof
Reject ACK=>effect, timeout=>safe retry, duplicate transport attempt=>duplicate business occurrence, stale provider evidence=>current effect.

# Evidence expected
Deterministic Product Proof must cover successful delivery evidence without effect strengthening, ACK/effect separation, ambiguous timeout/UNKNOWN reconcile-before-retry, duplicate attempt lineage, stale provider currentness and invalid or incomplete idempotency qualification.

# Escalation
Stop and return bounded findings to the owning predecessor/package gate if correctness requires changing TASK-527 identity semantics, concrete provider adapters, persistence/runtime realization, or ordering/replay/DLQ concerns reserved to TASK-529.

# Non-goals
Ordering/DLQ policy, concrete provider adapter, persistence, callback implementation, deployment or Production Readiness.
