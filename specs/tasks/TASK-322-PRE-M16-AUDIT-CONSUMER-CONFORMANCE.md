---
id: TASK-322
title: Prove canonical decision verification through audit consumers
status: completed
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

# Context
Construction A hardened canonical decision-boundary verification trust before M16. Construction B must prove that representative audit consumers accept only results established by the official verification boundary while preserving the existing deterministic, human-reserved and probabilistic categories.

# Current behavior
`verifyDecisionBoundary` establishes canonical verification results, and `projectCriticalDecisionAuditEvidence` consumes those results for audit projection. Existing semantics keep human evidence non-authoritative and permit rejected canonical results to remain auditable; reconstructed or synthetic matching results must not acquire canonical trust.

# Inputs / contracts
- canonical decision-boundary exports from `packages/contracts/decision-boundary/**`;
- ADR-0010 durable human approval constraints;
- existing critical-decision audit projection and growing-proof product tests;
- the official `verifyDecisionBoundary` result as the only trusted verification source for this proof.

# Outputs / contracts
- product regression evidence proving canonical verification trust survives through real audit projection consumers;
- explicit fail-closed evidence for reconstructed or synthetic matching verification results;
- no new verification API, persistence mechanism, approval authority, authorization semantic or provider behavior.

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
