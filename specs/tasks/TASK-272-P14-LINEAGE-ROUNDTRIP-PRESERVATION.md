---
id: TASK-272
title: Preserve provenance lineage through compatible round trips
status: ready
priority: 272
milestone: M14
model_tier: architecture
risk: medium
architecture_impact: false
executor_preference: any
depends_on: [TASK-271]
context_paths:
  - project_docs/execution_planning/P14-EVIDENCE-PROVENANCE-CONTRACT-01.md
  - docs/adr/ADR-0009-public-artifact-envelope.md
  - specs/contracts/artifact-envelope/artifact-envelope.schema.json
allowed_paths:
  - packages/contracts/**
  - tests/product/**
  - specs/tasks/TASK-272-P14-LINEAGE-ROUNDTRIP-PRESERVATION.md
forbidden_paths:
  - .github/**
  - packages/runtime-core/**
max_files: 8
validation:
  - npm run test:product
  - npm run check:tasks
  - npm run verify
---
# Objective
Prove lossless preservation of evidence provenance lineage through compatible serialization and re-emission.

# Context
ADR-0009 requires compatible consumers to preserve unknown optional extension data. WBS 14.2.3 requires lineage preservation through compatible extensions.

# Current behavior
The envelope defines compatibility rules, but the new M14 provenance extension has no integrated round-trip preservation proof.

# Required change
Add reusable round-trip preservation behavior/tests for the integrated provenance extension, including unknown optional sibling extensions and historical envelope documents.

# Inputs / contracts
ADR-0009 compatibility rules, artifact-envelope 1.0.0, and TASK-267..271 evidence-provenance semantics.

# Outputs / contracts
Verified lossless compatible round-trip behavior for the additive M14 extension; no new persistence/query contract.

# Acceptance criteria
- normalized provenance survives serialize/parse/re-emit without semantic loss;
- unknown optional extension values are preserved;
- unsupported required extensions fail explicitly;
- historical envelope documents without M14 metadata remain valid;
- no payload/secret material is copied into provenance implicitly.

# Non-goals
Migration framework, persistent index, query graph or provider adapter.

# Evidence expected
Round-trip, compatibility and required-extension failure tests.

# Escalation
Stop if preservation requires changing ADR-0009 compatibility rules.
