---
id: TASK-312
title: Prove decision-boundary verification and critical audit foundation
status: committed
priority: 312
milestone: M15
model_tier: architecture
risk: high
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-311
context_paths:
  - project_docs/execution_planning/P15-DECISION-BOUNDARY-VERIFICATION-01.md
  - packages/contracts/decision-boundary/index.ts
  - docs/adr/ADR-0010-durable-human-approval.md
allowed_paths:
  - tests/product/**
  - tooling/agent-harness/tests/**
  - project_docs/execution_planning/P15-DECISION-BOUNDARY-VERIFICATION-01.report.md
  - specs/tasks/TASK-312-P15-VERIFICATION-AUDIT-GROWING-PROOF.md
forbidden_paths:
  - docs/adr/**
  - tooling/agent-harness/policies/**
max_files: 7
validation:
  - npm run test:unit
  - npm run test:product
  - npm run check:tasks
  - npm run check:architecture
  - npm run verify
---
# Objective
Certify Construction A as one growing proof over decision-boundary verification, architecture checks and critical-decision audit projection.

# Context
TASK-309..311 provide the reusable verification and audit foundation required before the Package can exercise provider-unavailability/fallback paths in Construction B.

# Current behavior
Individual predecessor pieces are materialized separately; no integrated Construction A proof yet certifies them together.

# Required change
Add integrated tests over the real exported APIs and architecture checks, then record Sprint closure evidence and residual disposition for fresh-main Construction B promotion.

# Inputs / contracts
TASK-309..311 outputs, canonical P15 contracts, ADR-0010 and current architecture gates.

# Outputs / contracts
Integrated deterministic proof and Sprint Report for WBS 15.3.1 plus the audit foundation slice of 15.3.3.

# Acceptance criteria
- all three decision categories verify deterministically;
- invalid/authority-confusing cases fail closed;
- critical decisions project auditable references without secret/provider payload capture;
- no verification/audit result creates human or execution authority;
- Sprint Report records commits, validations, deviations and residual WBS 15.3.2/15.3.3 disposition;
- declared validations pass.

# Non-goals
No provider invocation, no Construction B implementation, no storage topology, Runtime Audit Trail replacement or L4 change.

# Evidence expected
Integrated product/unit proof, exact-head repository gates and Sprint report supporting fresh-main change control.

# Escalation
Stop if the proof exposes a capability gap requiring scope outside P15-PACKAGE-02 or an undeclared architecture change.