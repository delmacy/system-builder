---
id: TASK-306
title: Project package authorization into decision boundary
status: completed
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

# Context
TASK-305 projects the durable human-approval path without changing authority. The package authorization path is the next real human-governed boundary identified by the post-Construction-A revalidation.

# Current behavior
Package authorization already evaluates package-owner authority, receipts and conformance, but its result does not expose the canonical decision-boundary classification established in Construction A.

# Required change
Add a backward-compatible projection that classifies the existing package-owner authorization decision as `human-decision` with a stable authority reference, without altering authorization validity, budgets, conformance, receipts or revocation.

# Inputs / contracts
The integrated decision-boundary contract, existing package-authorization API, TASK-305 projection precedent and ADR-0010 human authority boundary.

# Outputs / contracts
An additive package-authorization decision-boundary projection that remains evidence/classification only and cannot manufacture or bypass authorization.

# Acceptance criteria
- existing package authorization evaluation/receipt/conformance behavior remains unchanged;
- package-owner approval is explicitly classifiable as human-reserved with stable authorityRef semantics;
- probabilistic or deterministic classification cannot substitute for package-owner authority;
- decision-boundary projection does not create VALID authorization or bypass conformance/checks;
- malformed projection inputs fail explicitly;
- declared validations pass.

# Non-goals
No authorization-plan redesign, receipt/signature changes, package policy weakening, remote inference, provider integration, WBS 15.3 or L4 architecture.

# Evidence expected
Focused unit/product proof of package-owner human-reserved classification, negative substitution cases, malformed input rejection and unchanged authorization/conformance behavior.

# Escalation
Stop for any required reinterpretation of package-owner authority, signatures, revocation, budgets, conformance or policy semantics.
