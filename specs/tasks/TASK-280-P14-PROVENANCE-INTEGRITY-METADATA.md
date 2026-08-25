---
id: TASK-280
title: Define additive provenance integrity metadata
status: ready
priority: 280
milestone: M14
model_tier: architecture
risk: high
architecture_impact: false
executor_preference: any
depends_on: []
context_paths:
  - project_docs/execution_planning/P14-EVIDENCE-INTEGRITY-FOUNDATION-01.md
  - packages/contracts/evidence-provenance/index.ts
  - docs/adr/ADR-0009-public-artifact-envelope.md
allowed_paths:
  - packages/contracts/evidence-provenance/**
  - specs/contracts/**
  - tests/product/**
  - specs/tasks/TASK-280-P14-PROVENANCE-INTEGRITY-METADATA.md
forbidden_paths:
  - .github/**
  - docs/adr/**
max_files: 8
validation:
  - npm run test:product
  - npm run check:tasks
  - npm run check:architecture
  - npm run verify
---
# Objective
Define the minimum additive provider-neutral integrity metadata for evidence provenance.
# Context
P14-PACKAGE-01 made provenance portable; WBS 14.3.1 now requires bounded integrity metadata.
# Current behavior
Provenance has stable references and transformation lineage but no dedicated reusable integrity descriptor.
# Required change
Add optional integrity metadata using explicit algorithm/digest semantics compatible with existing deterministic hashing and ADR-0009.
# Inputs / contracts
Existing evidence-provenance contract, deterministic digest conventions, ADR-0009.
# Outputs / contracts
Backward-compatible optional integrity descriptor with strict validation.
# Acceptance criteria
Optional metadata validates deterministically; malformed/unknown required values fail explicitly; absence remains valid; no secret/provider/storage locator or authorization meaning is introduced.
# Non-goals
No query index, graph store, migration engine, Runtime Audit Trail or provider topology.
# Evidence expected
Contract fixtures and focused product tests plus repository verification.
# Escalation
Stop only if satisfying the task requires changing ADR-0009 core meaning or an unmaterialized L4 topology.