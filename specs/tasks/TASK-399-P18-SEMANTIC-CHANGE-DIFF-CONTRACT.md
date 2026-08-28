---
id: TASK-399
title: Define canonical semantic process change diff contract
status: verification
priority: 399
milestone: M18
model_tier: architecture
risk: high
architecture_impact: false
executor_preference: any
depends_on: []
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/P18-PACKAGE-02.md
  - project_docs/execution_planning/P18-PROCESS-SEMANTIC-CHANGE-CONTRACT-01.md
  - project_docs/18-process-versioning/WBS.md
  - project_docs/18-process-versioning/scope/README.md
  - packages/contracts/process-versioning/index.ts
  - packages/contracts/decision-boundary/index.ts
allowed_paths:
  - packages/contracts/process-change/**
  - tsconfig.json
  - tests/product/**
  - specs/tasks/TASK-399-P18-SEMANTIC-CHANGE-DIFF-CONTRACT.md
forbidden_paths:
  - packages/contracts/decision-boundary/**
  - packages/runtime-core/**
  - packages/compiler/**
  - packages/release/**
max_files: 8
validation:
  - npm run test:product
  - npm run check:tasks
  - npm run check:architecture
  - npm run verify
---
# Objective
Define the additive public WBS 18.2.1 semantic-change diff contract and deterministic calculator between two canonical WBS 18.1 process revisions.

# Context
P18-PACKAGE-01 closed WBS 18.1 with stable artifact/revision identity and immutable publication truth. WBS 18.2 now requires semantic diff without using Git as business-version authority.

# Current behavior
The repository can identify and order immutable revisions but has no canonical provider-neutral semantic-change diff representation.

# Inputs / contracts
Canonical WBS 18.1 revision/publication identities and payload-minimal semantic snapshots whose entries use stable semantic references plus deterministic content/evidence references rather than raw business payload.

# Outputs / contracts
A versioned public process-change diff descriptor/calculator that binds from/to revision references and deterministically represents added, removed and changed semantic references.

# Required change
Add `packages/contracts/process-change/**` and the minimum public alias needed for consumer imports. Validate same-artifact ordered revision endpoints through canonical WBS 18.1 normalizers. Diff calculation must be stable under input ordering and fail closed on duplicate semantic refs, forged/reversed endpoints, cross-artifact revisions, malformed references or unexpected fields.

# Acceptance criteria
- same-artifact canonical predecessor truth is required;
- semantic snapshots are payload-minimal and deterministically normalized;
- added/removed/changed references are deterministic and stably ordered;
- unchanged semantic references do not appear as change;
- raw payload/content and Git SHA fields are rejected as authority-bearing diff inputs;
- no breaking/non-breaking classification or approval is inferred;
- public surface is additive/backward-compatible;
- declared validations pass.

# Non-goals
No WBS 18.2.2 classification, WBS 18.2.3 approval, WBS 18.3 lineage, Decision Boundary change, semantic NLP/model inference, migration execution or L4.

# Evidence expected
Focused product tests for positive deterministic diff plus cross-artifact, reversed predecessor, duplicate ref, malformed field, ordering and payload/Git injection negatives.

# Escalation
Stop if semantic diff requires changing WBS 18.1 identity semantics, Decision Boundary, or introducing a business-content model not authorized by current scope.
