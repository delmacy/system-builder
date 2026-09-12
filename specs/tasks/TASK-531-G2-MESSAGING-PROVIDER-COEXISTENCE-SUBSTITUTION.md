---
id: TASK-531
title: Define provider coexistence and substitution evidence semantics
status: verification
priority: 531
milestone: G2
model_tier: architecture
risk: high
architecture_impact: true
executor_preference: any
depends_on:
  - TASK-530
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/G2-WP-08-MESSAGING-EVENTS-NOTIFICATIONS-INTEGRATION-AUTOMATION.md
  - packages/contracts/messaging/**
  - packages/contracts/providers/**
allowed_paths:
  - packages/contracts/messaging/**
  - tests/product/g2-messaging-provider-coexistence*.test.ts
  - specs/tasks/TASK-531-G2-MESSAGING-PROVIDER-COEXISTENCE-SUBSTITUTION.md
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
Define provider-neutral coexistence/substitution evidence semantics for messaging without promoting provider state into business authority.

# Context
Construction A established canonical occurrence/message/subscription identity, delivery/effect reconciliation, replay/ordering and finite-flow semantics. TASK-531 consumes those closed semantics plus WP-06 provider qualification/currentness without changing provider ownership.

# Current behavior
Messaging identities and provider evidence are already distinct, but Construction B does not yet define how multiple qualified provider bindings may coexist or be substituted while preserving historical occurrence/message/delivery lineage and non-authoritative provider evidence.

# Inputs / contracts
- TASK-527 canonical event occurrence, message and subscription identity with producing-revision lineage;
- TASK-528 delivery/attempt/provider-ACK versus business-effect reconciliation;
- TASK-529 replay/ordering/batch semantics;
- closed WP-06 provider qualification, binding and currentness semantics.

# Outputs / contracts
Provider-neutral messaging coexistence/substitution evidence semantics representing simultaneously valid bindings, qualification/currentness, substitution epochs and historical binding evidence without rewriting canonical identity or prior history.

# Required change
Represent multiple simultaneously valid provider bindings, qualification/currentness, substitution epochs and historical binding evidence while preserving canonical occurrence/message/subscription identity.

# Acceptance criteria
- coexistence and substitution are qualification/currentness scoped;
- provider identifiers remain evidence only;
- substitution never rewrites prior occurrence/message/delivery history;
- stale/PARTIAL/UNKNOWN provider evidence cannot strengthen availability or currentness;
- old/new provider overlap is representable without implying duplicate business occurrence.

# Evidence expected
Deterministic Product Proof must cover qualified coexistence, bounded substitution and historical lineage preservation plus adversarial cases for provider-id equality, stale/PARTIAL/UNKNOWN qualification, historical rewrite and overlap incorrectly implying duplicate business effect. Exact-head repository validation must remain green.

# Negative/adversarial proof
Reject provider-id equality=>canonical identity, new binding=>historical rewrite, stale qualification=>current availability and overlap=>duplicate business effect.

# Escalation
Stop if satisfying this task requires a concrete broker/provider SDK, persistence/runtime realization, or changing closed WP-06 provider ownership.

# Non-goals
Concrete adapters, DB/runtime, callback/notification realization, deployment or Production Readiness.
