---
id: TASK-275
title: Preserve evidence provenance through Release publication
status: ready
priority: 275
milestone: M14
model_tier: architecture
risk: high
architecture_impact: false
executor_preference: any
depends_on: [TASK-274]
context_paths:
  - project_docs/execution_planning/P14-EVIDENCE-PROVENANCE-PROPAGATION-01.md
  - packages/contracts/evidence-provenance/index.ts
  - packages/compiler/index.ts
  - packages/release/index.ts
  - docs/adr/ADR-0009-public-artifact-envelope.md
allowed_paths:
  - packages/release/**
  - tests/product/**
  - specs/tasks/TASK-275-P14-RELEASE-PROVENANCE-PROPAGATION.md
forbidden_paths:
  - .github/**
  - docs/adr/**
  - packages/contracts/artifact-envelope/**
max_files: 8
validation:
  - npm run test:product
  - npm run check:tasks
  - npm run check:architecture
  - npm run verify
---
# Objective
Preserve explicit normalized evidence provenance from ReleaseArtifact input through the actual Release publication API.

# Context
TASK-274 gives Compiler output an optional provenance surface. Release must preserve that evidence when transforming ReleaseArtifact into PublishedRelease.

# Current behavior
`ReleaseRegistry.publish` preserves artifact identity/hash and validation evidence but has no provenance propagation surface.

# Inputs / contracts
TASK-274 output, integrated evidence-provenance contract, existing Release publication/storage semantics and ADR-0009.

# Outputs / contracts
Optional additive provenance on PublishedRelease, preserved deterministically through publish/get/transition behavior without changing status-transition semantics.

# Required change
Carry supplied ReleaseArtifact evidence provenance into PublishedRelease using the integrated normalizer. Preserve it across ReleaseRegistry storage and status transitions. Absence remains backward compatible.

# Acceptance criteria
- actual ReleaseRegistry publication preserves normalized provenance from its artifact input;
- get/transition preserve the same provenance without mutation;
- malformed supplied provenance fails explicitly before publication;
- no-provenance historical behavior remains valid;
- no secret/provider/storage coupling is introduced;
- declared validations pass.

# Non-goals
No Deploy/Observe propagation, no release-provider work, no core envelope redesign, no WBS 14.3.

# Evidence expected
Focused Release tests using actual registry APIs plus repository verification.

# Escalation
Stop if preservation requires L4 topology change or reinterpreting ADR-0009 core provenance fields.