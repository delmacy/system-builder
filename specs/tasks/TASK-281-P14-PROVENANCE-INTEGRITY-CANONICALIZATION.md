---
id: TASK-281
title: Canonicalize provenance integrity input deterministically
status: ready
priority: 281
milestone: M14
model_tier: architecture
risk: medium
architecture_impact: false
executor_preference: any
depends_on: [TASK-280]
context_paths:
  - project_docs/execution_planning/P14-EVIDENCE-INTEGRITY-FOUNDATION-01.md
  - packages/contracts/evidence-provenance/index.ts
allowed_paths:
  - packages/contracts/evidence-provenance/**
  - packages/deterministic/**
  - tests/product/**
  - specs/tasks/TASK-281-P14-PROVENANCE-INTEGRITY-CANONICALIZATION.md
forbidden_paths:
  - .github/**
  - docs/adr/**
max_files: 8
validation: [npm run test:product, npm run check:tasks, npm run check:architecture, npm run verify]
---
# Objective
Define deterministic canonical bytes/value projection for integrity computation.
# Context
Integrity verification must not depend on object insertion order or ambient serialization behavior.
# Current behavior
Deterministic utilities exist, but provenance integrity has no explicit canonicalization path.
# Required change
Reuse existing deterministic primitives to canonicalize only the bounded provenance material covered by TASK-280.
# Inputs / contracts
TASK-280 integrity descriptor and existing deterministic utilities.
# Outputs / contracts
Stable canonical representation suitable for digest computation.
# Acceptance criteria
Equivalent semantic input canonicalizes identically; meaningful changes differ; unsupported/non-finite values fail explicitly; no ambient/provider state participates.
# Non-goals
No digest policy expansion, query index, migration engine or provider coupling.
# Evidence expected
Focused deterministic product tests and repository verification.
# Escalation
Stop if a new global canonicalization architecture or L4 boundary is required.