---
id: TASK-315
title: Prove representative real-path resilience auditability
status: ready
priority: 315
milestone: M15
model_tier: architecture
risk: high
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-314
context_paths:
  - project_docs/execution_planning/P15-DECISION-BOUNDARY-RESILIENCE-AUDIT-01.md
  - specs/tasks/TASK-313-P15-PROVIDER-UNAVAILABILITY-RESULT.md
  - specs/tasks/TASK-314-P15-BOUNDED-FALLBACK-GUARD.md
  - packages/contracts/decision-boundary/index.ts
  - packages/contracts/decision-boundary/critical-decision-audit.ts
  - tests/product/p15-decision-boundary-verification-audit-growing-proof.test.ts
allowed_paths:
  - packages/contracts/decision-boundary/**
  - tests/product/**
  - tooling/agent-harness/tests/**
  - specs/tasks/TASK-315-P15-REAL-PATH-RESILIENCE-AUDIT.md
forbidden_paths:
  - docs/adr/**
  - project_docs/16-ai-gateway/**
  - tooling/agent-harness/policies/**
max_files: 8
validation:
  - npm run test:unit
  - npm run test:product
  - npm run check:tasks
  - npm run check:architecture
  - npm run verify
---
# Objective
Prove representative critical-decision auditability across available, unavailable and explicit-fallback scenarios using the integrated decision-boundary APIs and existing real decision-bearing proof surfaces.

# Context
Construction A delivered canonical verification/audit projection; TASK-313/314 add explicit provider-neutral unavailability and bounded fallback evidence. Fresh-main revalidation requires a real-path/resilience audit proof for WBS 15.3.3.

# Current behavior
Critical decision audit projection exists, and real governance paths were classified in P15-PACKAGE-01, but there is no integrated resilience proof showing how provider-unavailability/fallback outcomes remain auditable without creating authority.

# Required change
Extend focused product/harness proof, and only the minimum additive contract projection if strictly required, so representative deterministic, human-decision and probabilistic critical decisions preserve canonical category/risk/criticality/reference/context through availability/unavailability/fallback handling.

# Inputs / contracts
Integrated `DecisionBoundaryVerificationResult`, critical-decision audit projection, TASK-313 availability evidence, TASK-314 fallback evaluation, and existing representative human-approval/package-authorization/authority-closure proof surfaces where applicable.

# Outputs / contracts
Deterministic audit evidence/proof that records only canonical decision references and bounded resilience status; no provider payload, secret, approval, authorization or new storage semantics.

# Acceptance criteria
- representative probabilistic critical decision is auditable when evidence is available;
- provider-neutral unavailability is auditable as unavailable/non-authoritative evidence;
- explicit deterministic fallback remains auditable only as its existing deterministic evidence;
- explicit human-decision fallback remains human-reserved and does not become approved by fallback;
- mismatched verification/fallback/audit references fail closed;
- audit output captures no provider payload, endpoint, credential or secret;
- existing real governance authority semantics remain unchanged;
- declared validations pass.

# Non-goals
No Runtime Audit Trail replacement, durable audit storage, provider invocation, provider registry, retry orchestration, approval redesign, authorization change or L4 architecture change.

# Evidence expected
Focused product and/or existing harness tests demonstrating the representative resilience matrix against actual exported APIs, including negative cross-category/mismatch cases and repository verification.

# Escalation
Stop if proving the scenarios requires changing real authority semantics, adding persistent audit topology, introducing a concrete provider dependency, or touching forbidden paths.
