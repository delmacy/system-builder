---
id: TASK-267
title: Define additive evidence provenance extension contract
status: ready
priority: 267
milestone: M14
model_tier: architecture
risk: high
architecture_impact: false
executor_preference: any
depends_on: []
context_paths:
  - project_docs/execution_planning/P14-EVIDENCE-PROVENANCE-CONTRACT-01.md
  - project_docs/execution_planning/P14-PACKAGE-01.md
  - project_docs/14-evidence-provenance/WBS.md
  - project_docs/14-evidence-provenance/scope/README.md
  - docs/adr/ADR-0009-public-artifact-envelope.md
  - specs/contracts/artifact-envelope/artifact-envelope.schema.json
allowed_paths:
  - packages/contracts/**
  - specs/contracts/**
  - tests/product/**
  - specs/tasks/TASK-267-P14-EVIDENCE-PROVENANCE-EXTENSION-CONTRACT.md
forbidden_paths:
  - .github/**
  - packages/runtime-core/**
  - packages/builder/**
max_files: 10
validation:
  - npm run test:product
  - npm run check:tasks
  - npm run check:architecture
  - npm run verify
---
# Objective
Define the minimum additive provider-neutral evidence-provenance extension contract needed for WBS 14.1-14.2 without changing ADR-0009 core envelope semantics.

# Context
ADR-0009 already requires artifact identity, createdAt, producer and input artifact references and explicitly allows portable provenance metadata plus namespaced extensions. M14 must standardize the missing evidence semantics rather than redesign the envelope.

# Current behavior
The public envelope accepts extension/provenance additions, but there is no bounded reusable contract for non-artifact source references, classification/confidence and transformation descriptors.

# Inputs / contracts
ADR-0009; artifact-envelope 1.0.0; P14 package gap matrix.

# Outputs / contracts
An additive namespaced evidence-provenance extension schema/types with stable versioned semantics that historical envelope documents need not populate.

# Required change
Introduce only the minimum contract surface required to carry source references, optional classification/confidence, transformation descriptor and lineage metadata while preserving existing producer/input fields as authoritative predecessor semantics.

# Acceptance criteria
- additive/backward-compatible contract;
- no reinterpretation of core artifact envelope fields;
- no mandatory secrets, credentials, provider resource IDs or storage locators;
- provenance is explicitly evidence, not execution authority;
- deterministic schema fixtures cover valid/invalid examples.

# Non-goals
Query/index implementation, Runtime Audit Trail, authorization, provider topology or WBS 14.3.

# Evidence expected
Focused contract/product tests and repository verification.

# Escalation
Stop if a core-envelope semantic change or L4 boundary is required.
