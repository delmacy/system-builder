---
id: TASK-528
title: Separate delivery attempts and provider acknowledgements from business effects
status: blocked
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

# Acceptance criteria
- delivery and attempt identities remain distinct from occurrence/message/effect identity;
- provider ACK never proves business effect or convergence;
- ambiguous mutating outcome preserves UNKNOWN and requires reconcile-before-retry where replay is unsafe;
- idempotency/effect evidence remains authority/scope/payload/horizon qualified;
- provider qualification/currentness is explicit and non-authoritative for business truth.

# Negative/adversarial proof
Reject ACK=>effect, timeout=>safe retry, duplicate transport attempt=>duplicate business occurrence, stale provider evidence=>current effect.

# Non-goals
Ordering/DLQ policy, concrete provider adapter, persistence, callback implementation, deployment or Production Readiness.