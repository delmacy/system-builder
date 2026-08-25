---
id: TASK-269
title: Define stable source reference semantics
status: ready
priority: 269
milestone: M14
model_tier: architecture
risk: medium
architecture_impact: false
executor_preference: any
depends_on: [TASK-268]
context_paths:
  - project_docs/execution_planning/P14-EVIDENCE-PROVENANCE-CONTRACT-01.md
  - docs/adr/ADR-0009-public-artifact-envelope.md
allowed_paths:
  - packages/contracts/**
  - tests/product/**
  - specs/tasks/TASK-269-P14-SOURCE-REFERENCE-SEMANTICS.md
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
Implement stable provider-neutral source-reference semantics for origins that are not themselves public artifact revisions.

# Context
ADR-0009 already covers input artifact references. WBS 14.1.1 additionally requires a source reference model; this TASK must complement, not duplicate, `provenance.inputs`.

# Required change
Add the minimum validated source-reference representation needed for portable origin identity, optional source kind/location hint and stable correlation without mandatory provider/storage identifiers.

# Acceptance criteria
- artifact inputs continue using ADR-0009 identity tuples;
- non-artifact sources have stable explicit identifiers;
- source references are deterministic and reject ambiguous duplicates;
- location/provider hints remain optional and non-authoritative;
- no secret value is required or emitted.

# Non-goals
Source resolution, fetching, indexing or query navigation.

# Evidence expected
Focused positive/negative tests and predecessor-integration proof.

# Escalation
Stop if source identity would require provider-specific core semantics.
