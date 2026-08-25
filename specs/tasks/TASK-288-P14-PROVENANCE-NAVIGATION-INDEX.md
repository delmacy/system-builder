---
id: TASK-288
title: Build deterministic provenance navigation projection
status: ready
priority: 288
milestone: M14
model_tier: architecture
risk: high
architecture_impact: false
executor_preference: any
depends_on: [TASK-287]
context_paths:
  - project_docs/execution_planning/P14-EVIDENCE-PROVENANCE-NAVIGATION-01.md
  - packages/contracts/evidence-provenance/index.ts
  - specs/tasks/TASK-287-P14-PROVENANCE-NAVIGATION-PROJECTION.md
allowed_paths:
  - packages/contracts/evidence-provenance/**
  - tests/product/**
  - specs/tasks/TASK-288-P14-PROVENANCE-NAVIGATION-INDEX.md
forbidden_paths:
  - .github/**
  - docs/adr/**
  - packages/runtime-core/**
max_files: 8
validation:
  - npm run test:product
  - npm run check:tasks
  - npm run check:architecture
  - npm run verify
---
# Objective
Build a deterministic in-memory navigation projection from normalized provenance records.
# Context
TASK-287 defines the projection semantics. Construction B requires provider-neutral navigation without persistence topology.
# Current behavior
No reusable deterministic projection exists across a collection of explicit provenance records.
# Required change
Create a pure projection builder that consumes normalized provenance extensions and derives stable evidence/source relations with canonical ordering independent of input order.
# Inputs / contracts
TASK-287 projection types and normalized `EvidenceProvenanceExtension` values.
# Outputs / contracts
Deterministic in-memory projection only; no durable store or provider coupling.
# Acceptance criteria
Equivalent inputs in different orders produce equivalent projection; duplicate evidence identity or conflicting explicit relation fails explicitly; source/evidence identifiers are never inferred; output contains no secret/provider/storage resolution.
# Non-goals
No graph database, cache service, storage adapter or network lookup.
# Evidence expected
Positive, ordering and conflicting-input product tests plus repository verification.
# Escalation
Stop if a persistence/provider topology is required.
