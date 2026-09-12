---
id: TASK-532
title: Define callback and integration mapping reconciliation semantics
status: blocked
priority: 532
milestone: G2
model_tier: architecture
risk: high
architecture_impact: true
executor_preference: any
depends_on:
  - TASK-531
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/G2-WP-08-MESSAGING-EVENTS-NOTIFICATIONS-INTEGRATION-AUTOMATION.md
  - packages/contracts/messaging/**
allowed_paths:
  - packages/contracts/messaging/**
  - tests/product/g2-messaging-callback-mapping*.test.ts
  - specs/tasks/TASK-532-G2-MESSAGING-CALLBACK-INTEGRATION-MAPPINGS.md
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
Define provider-neutral callback/integration mapping evidence and reconciliation semantics on top of the closed messaging semantic core.

# Required change
Represent callback identity, mapping revision, source/target semantic references, delivery evidence and business-effect reconciliation without equating callback transport acknowledgement with authoritative target effect.

# Acceptance criteria
- callback identity and mapping revision are explicit and historically addressable;
- provider ACK remains non-authoritative for mapped business effect;
- ambiguous mutating callbacks route UNKNOWN -> reconcile-before-retry;
- replay/redelivery preserves canonical occurrence and mapping lineage;
- stale/PARTIAL/UNKNOWN mapping evidence cannot strengthen currentness.

# Negative/adversarial proof
Reject ACK=>business effect, latest mapping=>historical reinterpretation, timeout=>blind retry and provider callback ID=>canonical business identity.

# Escalation
Stop if implementation requires concrete webhook/provider SDKs, persistence/runtime realization, or new semantic ownership outside WP-08.

# Non-goals
Concrete endpoints, credentials, DB/runtime, UI, deployment or Production Readiness.
