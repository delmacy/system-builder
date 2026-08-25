---
id: TASK-268
title: Add deterministic evidence provenance validation and normalization
status: ready
priority: 268
milestone: M14
model_tier: architecture
risk: medium
architecture_impact: false
executor_preference: any
depends_on: [TASK-267]
context_paths:
  - project_docs/execution_planning/P14-EVIDENCE-PROVENANCE-CONTRACT-01.md
  - specs/tasks/TASK-267-P14-EVIDENCE-PROVENANCE-EXTENSION-CONTRACT.md
allowed_paths:
  - packages/contracts/**
  - tests/product/**
  - specs/tasks/TASK-268-P14-EVIDENCE-PROVENANCE-NORMALIZATION.md
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
Provide deterministic validation and canonical normalization for the evidence-provenance extension introduced by TASK-267.

# Context
The contract must be portable across producers and serializers; equivalent valid inputs must yield stable normalized evidence without provider-specific ordering or implicit defaults that change meaning.

# Current behavior
No shared deterministic normalizer exists for the new extension.

# Required change
Add bounded contract-level helpers/validation that sort or canonicalize only where semantics permit and fail explicitly on malformed/ambiguous data.

# Acceptance criteria
- deterministic normalized output for equivalent input;
- explicit rejection of malformed identifiers, unsupported versions and duplicate ambiguous entries;
- no secret/provider lookup;
- historical envelopes without the extension remain unaffected.

# Non-goals
Persistence, indexing, query APIs or producer wiring.

# Evidence expected
Positive/negative deterministic product tests.

# Escalation
Stop if normalization would reinterpret ADR-0009 core fields.
