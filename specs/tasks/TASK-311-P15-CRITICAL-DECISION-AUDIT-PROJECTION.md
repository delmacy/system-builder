---
id: TASK-311
title: Project critical decision audit evidence
status: ready
priority: 311
milestone: M15
model_tier: architecture
risk: high
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-310
context_paths:
  - project_docs/execution_planning/P15-DECISION-BOUNDARY-VERIFICATION-01.md
  - packages/contracts/decision-boundary/index.ts
  - docs/adr/ADR-0010-durable-human-approval.md
allowed_paths:
  - packages/contracts/decision-boundary/**
  - tests/product/**
  - specs/tasks/TASK-311-P15-CRITICAL-DECISION-AUDIT-PROJECTION.md
forbidden_paths:
  - docs/adr/**
  - tooling/agent-harness/policies/**
max_files: 5
validation:
  - npm run test:product
  - npm run check:tasks
  - npm run check:architecture
  - npm run verify
---
# Objective
Add a deterministic, provider-neutral projection for auditable critical-decision evidence using canonical category/risk/criticality/context references.

# Context
WBS 15.3.3 requires critical decisions to be auditable by category without replacing the existing Runtime Audit Trail or authorization mechanisms.

# Current behavior
Decision metadata and guards exist, but there is no canonical bounded projection that packages critical-decision evidence for audit verification.

# Required change
Add an additive projection that emits only stable references and normalized decision metadata needed to audit critical decisions; reject malformed/non-critical inputs where the audit projection is required.

# Inputs / contracts
Decision boundary descriptor, category metadata, risk/criticality and verification result from TASK-309.

# Outputs / contracts
Immutable critical-decision audit projection containing canonical references/status only, with no secrets, provider payloads or authority grant.

# Acceptance criteria
- only canonical normalized references are emitted;
- criticality/category/risk are explicit;
- probabilistic inference includes bounded model/context refs and confidence, never provider payload/credential;
- human decision audit evidence does not create approval;
- deterministic audit evidence does not bypass invariant gates;
- declared validations pass.

# Non-goals
No audit database/storage, Runtime Audit Trail replacement, provider registry or authorization engine.

# Evidence expected
Product tests for deterministic, human and probabilistic critical decision projections plus malformed/negative cases.

# Escalation
Stop if implementation requires durable storage topology, secret capture or changing authority semantics.