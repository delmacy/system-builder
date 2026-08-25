---
id: TASK-287
title: Define bounded provenance navigation projection
status: ready
priority: 287
milestone: M14
model_tier: architecture
risk: high
architecture_impact: false
executor_preference: any
depends_on: []
context_paths:
  - project_docs/execution_planning/P14-EVIDENCE-PROVENANCE-NAVIGATION-01.md
  - project_docs/execution_planning/P14-PACKAGE-02.post-construction-a-revalidation.md
  - packages/contracts/evidence-provenance/index.ts
  - docs/adr/ADR-0009-public-artifact-envelope.md
allowed_paths:
  - packages/contracts/evidence-provenance/**
  - specs/contracts/**
  - tests/product/**
  - specs/tasks/TASK-287-P14-PROVENANCE-NAVIGATION-PROJECTION.md
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
Define the minimum additive provider-neutral projection types for deterministic provenance navigation.
# Context
Construction A proves integrity. WBS 14.3.2 still lacks explicit bidirectional navigation over existing `evidenceId` and `sources[].sourceId` references.
# Current behavior
Normalized provenance carries explicit source and lineage references but exposes no reusable navigation projection/query model.
# Required change
Add bounded navigation projection types and normalization semantics using only explicit portable provenance identifiers. Keep the representation in-memory/provider-neutral and deterministic.
# Inputs / contracts
`EvidenceProvenanceExtension`, `EvidenceSourceReference`, ADR-0009 and integrated Construction A integrity semantics.
# Outputs / contracts
Backward-compatible navigation projection types sufficient for source→evidence and evidence→source queries.
# Acceptance criteria
Projection identity is explicit and deterministic; malformed identifiers fail explicitly; no storage/provider locator, graph topology, secret, authorization or Runtime Audit Trail semantics are introduced; existing provenance remains backward compatible.
# Non-goals
No persistence engine, graph database, provider registry, migration engine or UI.
# Evidence expected
Focused contract tests plus repository verification.
# Escalation
Stop if the task requires ADR-0009 reinterpretation or L4 topology.
