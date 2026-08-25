---
id: TASK-284
title: Wire provenance integrity compatibly into artifact extensions
status: ready
priority: 284
milestone: M14
model_tier: architecture
risk: high
architecture_impact: false
executor_preference: any
depends_on: [TASK-283]
context_paths:
  - docs/adr/ADR-0009-public-artifact-envelope.md
  - packages/contracts/evidence-provenance/index.ts
allowed_paths:
  - packages/contracts/evidence-provenance/**
  - packages/contracts/artifact-envelope/**
  - tests/product/**
  - specs/tasks/TASK-284-P14-ARTIFACT-PROVENANCE-INTEGRITY-WIRING.md
forbidden_paths: [.github/**, docs/adr/**]
max_files: 8
validation: [npm run test:product, npm run check:tasks, npm run check:architecture, npm run verify]
---
# Objective
Wire optional provenance integrity metadata through the existing compatible artifact-extension boundary.
# Context
ADR-0009 permits compatible extensions while preserving core envelope meaning.
# Current behavior
Evidence provenance is portable but its new integrity descriptor is not yet proven through the public artifact extension boundary.
# Required change
Use existing extension semantics to preserve normalized integrity metadata without changing core required fields or historical artifacts.
# Inputs / contracts
TASK-280..283 and ADR-0009.
# Outputs / contracts
Backward-compatible artifact extension representation.
# Acceptance criteria
Historical artifacts remain valid; integrity metadata round-trips when present; malformed metadata is rejected by the owning contract; core envelope meaning and identity rules remain unchanged.
# Non-goals
No envelope redesign, mandatory integrity, provider/storage fields or authorization semantics.
# Evidence expected
Compatibility fixtures/product tests and repository verification.
# Escalation
Stop if ADR-0009 core fields must be reinterpreted or a new L4 contract boundary is required.