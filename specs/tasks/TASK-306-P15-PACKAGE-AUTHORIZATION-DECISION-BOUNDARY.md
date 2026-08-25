---
id: TASK-306
title: Project package authorization into decision boundary
status: ready
priority: 306
milestone: M15
model_tier: architecture
risk: high
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-305
context_paths:
  - project_docs/execution_planning/P15-DECISION-BOUNDARY-ENFORCEMENT-01.md
  - packages/contracts/decision-boundary/index.ts
  - tooling/agent-harness/src/package-authorization.ts
  - tooling/agent-harness/src/human-approval.ts
  - docs/adr/ADR-0010-durable-human-approval.md
allowed_paths:
  - tooling/agent-harness/src/package-authorization.ts
  - tooling/agent-harness/tests/**
  - tests/product/**
  - specs/tasks/TASK-306-P15-PACKAGE-AUTHORIZATION-DECISION-BOUNDARY.md
forbidden_paths:
  - docs/adr/**
  - packages/contracts/decision-boundary/**
  - tooling/agent-harness/policies/**
max_files: 6
validation:
  - npm run test:product
  - npm run check:tasks
  - npm run check:architecture
  - npm run verify
---
# Objective
Expose an additive canonical decision-boundary projection for real package-owner authorization decisions while preserving package authorization as its existing human-governed authority mechanism.

# Acceptance criteria
- existing package authorization evaluation/receipt/conformance behavior remains unchanged;
- package-owner approval is explicitly classifiable as human-reserved with stable authorityRef semantics;
- probabilistic or deterministic classification cannot substitute for package-owner authority;
- decision-boundary projection does not create VALID authorization or bypass conformance/checks;
- malformed projection inputs fail explicitly;
- declared validations pass.

# Non-goals
No authorization-plan redesign, receipt/signature changes, package policy weakening, remote inference, provider integration, WBS 15.3 or L4 architecture.

# Escalation
Stop for any required reinterpretation of package-owner authority, signatures, revocation, budgets, conformance or policy semantics.
