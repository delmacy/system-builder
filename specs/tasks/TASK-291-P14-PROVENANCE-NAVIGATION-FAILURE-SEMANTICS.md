---
id: TASK-291
title: Enforce provenance navigation failure semantics
status: ready
priority: 291
milestone: M14
model_tier: architecture
risk: high
architecture_impact: false
executor_preference: any
depends_on: [TASK-289, TASK-290]
context_paths:
  - project_docs/execution_planning/P14-EVIDENCE-PROVENANCE-NAVIGATION-01.md
  - specs/tasks/TASK-289-P14-SOURCE-TO-EVIDENCE-NAVIGATION.md
  - specs/tasks/TASK-290-P14-EVIDENCE-TO-SOURCE-NAVIGATION.md
allowed_paths:
  - packages/contracts/evidence-provenance/**
  - tests/product/**
  - specs/tasks/TASK-291-P14-PROVENANCE-NAVIGATION-FAILURE-SEMANTICS.md
forbidden_paths:
  - .github/**
  - docs/adr/**
max_files: 8
validation:
  - npm run test:product
  - npm run check:tasks
  - npm run check:architecture
  - npm run verify
---
# Objective
Make navigation failure/ambiguity behavior explicit and deterministic.
# Context
Bidirectional navigation must not silently infer, collapse or fabricate provenance identities.
# Current behavior
TASK-289/290 provide bounded query directions but require consolidated negative semantics for malformed, missing and conflicting relations.
# Required change
Add fail-closed validation/query behavior for malformed identifiers, duplicate/conflicting evidence identity, ambiguous explicit relations where unsafe, and deterministic empty/not-found outcomes where absence is valid.
# Inputs / contracts
TASK-289 and TASK-290 query surfaces plus normalized provenance identities.
# Outputs / contracts
Stable deterministic diagnostics/results; no permissive inference.
# Acceptance criteria
Malformed identity fails explicitly; conflicting duplicate evidence fails explicitly; valid one-to-many source relations remain supported and canonically ordered; missing relations never fabricate data; diagnostics contain no secret/provider/storage resolved values.
# Non-goals
No authorization, fuzzy matching, provider resolution, graph consistency service or migration engine.
# Evidence expected
Negative/failure product tests and repository verification.
# Escalation
Stop if required semantics conflict with accepted provenance identity authority.
