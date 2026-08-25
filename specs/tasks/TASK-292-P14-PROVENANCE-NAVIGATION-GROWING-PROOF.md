---
id: TASK-292
title: Prove bidirectional provenance navigation end to end
status: ready
priority: 292
milestone: M14
model_tier: architecture
risk: high
architecture_impact: false
executor_preference: any
depends_on: [TASK-291]
context_paths:
  - project_docs/execution_planning/P14-EVIDENCE-PROVENANCE-NAVIGATION-01.md
  - project_docs/execution_planning/P14-EVIDENCE-INTEGRITY-FOUNDATION-01.report.md
  - tests/product/p14-provenance-multistage-growing-proof.test.ts
  - packages/contracts/evidence-provenance/**
allowed_paths:
  - packages/contracts/evidence-provenance/**
  - tests/product/**
  - project_docs/execution_planning/P14-EVIDENCE-PROVENANCE-NAVIGATION-01.report.md
  - specs/tasks/TASK-292-P14-PROVENANCE-NAVIGATION-GROWING-PROOF.md
forbidden_paths:
  - .github/**
  - docs/adr/**
  - packages/runtime-core/**
max_files: 12
validation:
  - npm run test:product
  - npm run check:tasks
  - npm run check:architecture
  - npm run verify
---
# Objective
Certify WBS 14.3.2 with a composed bidirectional provenance-navigation proof.
# Context
TASK-287..291 establish the bounded deterministic navigation surface over explicit provenance identities.
# Current behavior
The repository proves propagation, lineage and integrity but not composed navigation in both directions over representative multi-stage provenance.
# Required change
Extend the growing P14 proof using real normalized provenance fixtures/lineage to build the deterministic projection and exercise source→evidence and evidence→source navigation, including negative behavior and repeatability.
# Inputs / contracts
Integrated P14 provenance/integrity foundation and TASK-287..291 outputs.
# Outputs / contracts
Evidence-only certification and Sprint report; no new topology or authority semantics.
# Acceptance criteria
Representative multi-stage lineage is navigable in both directions; results remain deterministic across reordered equivalent input; missing/conflicting cases follow TASK-291 semantics; integrity metadata remains compatible; serialization-safe identifiers survive the proof; no secrets/provider/storage resolved values or authorization decisions enter outputs.
# Non-goals
No migration engine, Construction C work, graph database, Runtime Audit Trail replacement, provider registry or UI.
# Evidence expected
Composed product proof, Sprint report and repository-wide verification.
# Escalation
Stop if proof reveals a remaining WBS 14.3.2 gap requiring scope outside this materialized Sprint or any L4 change.
