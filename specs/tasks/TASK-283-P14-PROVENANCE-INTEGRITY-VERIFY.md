---
id: TASK-283
title: Verify provenance integrity deterministically
status: ready
priority: 283
milestone: M14
model_tier: architecture
risk: high
architecture_impact: false
executor_preference: any
depends_on: [TASK-282]
context_paths:
  - project_docs/execution_planning/P14-EVIDENCE-INTEGRITY-FOUNDATION-01.md
allowed_paths:
  - packages/contracts/evidence-provenance/**
  - packages/deterministic/**
  - tests/product/**
  - specs/tasks/TASK-283-P14-PROVENANCE-INTEGRITY-VERIFY.md
forbidden_paths: [.github/**, docs/adr/**]
max_files: 8
validation: [npm run test:product, npm run check:tasks, npm run check:architecture, npm run verify]
---
# Objective
Provide deterministic verification for supplied provenance integrity metadata.
# Context
Integrity metadata must make mismatches and malformed descriptors explicit.
# Current behavior
No bounded provenance integrity verifier exists.
# Required change
Compare canonical input with explicit integrity metadata and return an auditable deterministic result without granting authority.
# Inputs / contracts
TASK-280..282 outputs.
# Outputs / contracts
Explicit verified, mismatch, or invalid result with non-sensitive evidence.
# Acceptance criteria
Valid digest verifies; mutations mismatch; malformed or unsupported metadata returns invalid; absence is distinguishable from verified; verification never implies authorization.
# Non-goals
No policy decision, signature trust, Runtime Audit Trail or provider lookup.
# Evidence expected
Positive and negative product tests plus repository verification.
# Escalation
Stop if verification requires external trust infrastructure or new L4 topology.