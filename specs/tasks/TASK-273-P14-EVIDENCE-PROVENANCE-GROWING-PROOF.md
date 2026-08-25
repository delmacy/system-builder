---
id: TASK-273
title: Certify evidence provenance contract growing proof
status: ready
priority: 273
milestone: M14
model_tier: architecture
risk: medium
architecture_impact: false
executor_preference: any
depends_on: [TASK-272]
context_paths:
  - project_docs/execution_planning/P14-EVIDENCE-PROVENANCE-CONTRACT-01.md
  - project_docs/execution_planning/P14-PACKAGE-01.md
  - specs/contracts/artifact-envelope/artifact-envelope.schema.json
allowed_paths:
  - tests/product/**
  - specs/tasks/TASK-273-P14-EVIDENCE-PROVENANCE-GROWING-PROOF.md
  - project_docs/execution_planning/P14-EVIDENCE-PROVENANCE-CONTRACT-01.report.md
forbidden_paths:
  - .github/**
  - packages/runtime-core/**
  - packages/builder/**
max_files: 6
validation:
  - npm run test:product
  - npm run check:tasks
  - npm run check:architecture
  - npm run verify
---
# Objective
Certify the integrated Construction A evidence-provenance contract as a coherent growing proof before Sprint Review.

# Context
TASK-267..272 establish the additive contract, deterministic normalization, source references, classification/confidence, transformation descriptors and compatible lineage preservation. This TASK composes those outputs without adding new semantics.

# Current behavior
Construction A outputs are validated individually but require one bounded composed proof before Sprint Review.

# Required change
Add one bounded integrated proof and Sprint evidence showing deterministic round-trip behavior, historical compatibility, explicit failure cases and no-leak/provider-neutral boundaries.

# Inputs / contracts
Integrated TASK-267..272 outputs, ADR-0009 and artifact-envelope 1.0.0 fixtures/validation.

# Outputs / contracts
A growing-proof product test plus Sprint report evidence only; no new product semantics.

# Acceptance criteria
- representative artifact envelope carries the complete optional M14 provenance extension and round-trips deterministically;
- input artifact references and non-artifact source references remain distinct and stable;
- absent classification/confidence remains valid;
- malformed/ambiguous/unsupported-required-extension cases fail explicitly;
- no secret, credential, mandatory provider resource ID or storage locator is required or leaked;
- historical artifact-envelope 1.0.0 fixture remains valid;
- no product semantics beyond TASK-267..272 are introduced.

# Non-goals
Producer propagation, query navigation, migration framework, Runtime Audit Trail or WBS 14.3.

# Evidence expected
Integrated product proof plus Sprint report inputs.

# Escalation
Stop if certification exposes a missing capability that requires scope beyond Construction A; record it for Construction B/change control.
