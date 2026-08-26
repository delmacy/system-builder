---
id: TASK-322
title: Prove canonical decision verification through audit consumers
status: ready
priority: 322
milestone: PRE-M16
model_tier: architecture
risk: high
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-321
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/PRE-M16-CONFORMANCE-INTEGRATION-01.md
  - packages/contracts/decision-boundary/**
  - docs/adr/ADR-0010-durable-human-approval.md
  - tests/product/p15-critical-decision-audit-projection.test.ts
  - tests/product/p15-decision-boundary-verification-audit-growing-proof.test.ts
allowed_paths:
  - tests/product/**
  - specs/tasks/TASK-322-PRE-M16-AUDIT-CONSUMER-CONFORMANCE.md
forbidden_paths:
  - packages/contracts/decision-boundary/**
  - packages/runtime/**
  - project_docs/16-ai-gateway/**
max_files: 4
validation:
  - npm run test:product
  - npm run check:tasks
  - npm run check:architecture
  - npm run verify
---
# Objective
Prove the TASK-319 trust hardening through representative existing audit consumers without changing decision or human-authority semantics.

# Required change
Add focused product-level consumer regression that obtains legitimate results from `verifyDecisionBoundary`, projects them through `projectCriticalDecisionAuditEvidence`, proves canonical rejected results remain auditable, and proves reconstructed/forged matching results fail closed.

# Acceptance criteria
- deterministic, human-decision and probabilistic canonical results remain auditable through the real projection;
- a reconstructed or synthetic matching `valid` result is rejected as non-canonical;
- a canonically established rejected result remains auditable as rejected;
- human evidence creates no approval, authorization or execution authority;
- ADR-0010 remains unchanged;
- declared validations pass.

# Non-goals
No new verification API, persistence, remote provider, audit store, approval redesign or authorization redesign.

# Evidence expected
Product regression proof using actual decision-boundary exports and existing audit projection.

# Escalation
Stop if evidence requires weakening canonical provenance, changing ADR-0010, adding persistent trust infrastructure or changing public decision categories.
