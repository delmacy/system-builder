---
id: TASK-527
title: Define event, message and subscription identity with occurrence lineage
status: ready
priority: 527
milestone: G2
model_tier: architecture
risk: high
architecture_impact: true
executor_preference: any
depends_on: []
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/G2-WP-08-MESSAGING-EVENTS-NOTIFICATIONS-INTEGRATION-AUTOMATION.md
  - packages/contracts/**
allowed_paths:
  - packages/contracts/messaging/**
  - tests/product/g2-messaging-identity*.test.ts
  - specs/tasks/TASK-527-G2-MESSAGING-EVENT-MESSAGE-IDENTITY.md
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
Define provider-neutral event occurrence, message and subscription identity with explicit producing-revision and occurrence lineage.

# Required change
Represent producer/source/subject, occurrence identity, message identity, subscription identity and lineage without allowing provider IDs, transport envelopes or redelivery to become canonical occurrence identity.

# Acceptance criteria
- `event occurrence != message != delivery attempt != business effect` is representable;
- producing semantic revision and occurrence lineage survive message creation/redelivery;
- subscription identity/revision is explicit and historically addressable;
- provider/external IDs cannot reconnect or merge unrelated history;
- PARTIAL/UNKNOWN evidence cannot strengthen occurrence or subscription currentness.

# Negative/adversarial proof
Reject provider-message-ID equality=>same canonical occurrence, redelivery=>new business occurrence, latest revision=>historical reinterpretation and missing lineage=>authoritative currentness.

# Non-goals
Delivery retry/effect reconciliation, ordering/replay/DLQ, concrete brokers, persistence, notifications realization, deployment or Production Readiness.