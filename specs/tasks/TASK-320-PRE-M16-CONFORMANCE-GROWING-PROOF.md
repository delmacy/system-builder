---
id: TASK-320
title: Prove integrated pre-M16 contract conformance hardening
status: ready
priority: 320
milestone: PRE-M16
model_tier: architecture
risk: medium
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-318
  - TASK-319
context_paths:
  - project_docs/execution_planning/PRE-M16-CONTRACT-CONFORMANCE-HARDENING-01.md
  - specs/tasks/TASK-318-SYSTEM-DEFINITION-SCHEMA-PUBLICATION-PROOF.md
  - specs/tasks/TASK-319-CRITICAL-AUDIT-VERIFICATION-TRUST.md
  - packages/contracts/system-definition/**
  - packages/contracts/decision-boundary/**
allowed_paths:
  - tests/product/**
  - tooling/agent-harness/tests/**
  - project_docs/execution_planning/**
  - specs/tasks/TASK-320-PRE-M16-CONFORMANCE-GROWING-PROOF.md
forbidden_paths:
  - project_docs/16-ai-gateway/**
  - packages/runtime/**
  - packages/compiler/**
max_files: 8
validation:
  - npm run test:unit
  - npm run test:product
  - npm run check:tasks
  - npm run check:architecture
  - npm run verify
---
# Objective
Close Construction A with an integrated regression proof that both conformance findings are actually eliminated without weakening existing architecture or authority boundaries.

# Acceptance criteria
- canonical SystemDefinition schema identity/publication/import equivalence is proven;
- representative Compiler/Runtime-compatible SystemDefinition fixtures remain valid without modifying Compiler/Runtime production code;
- canonical critical audit evidence rejects caller-forged valid-verdict trust;
- deterministic, human-decision and probabilistic categories preserve existing semantics;
- repository architecture/task checks pass;
- Sprint report records exact residual gaps and whether Construction B remains necessary.

# Non-goals
No unrelated productization, M16 implementation, M17 implementation or carried-debt absorption.