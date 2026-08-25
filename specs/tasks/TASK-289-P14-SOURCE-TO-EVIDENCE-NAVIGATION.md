---
id: TASK-289
title: Query source to evidence provenance navigation
status: ready
priority: 289
milestone: M14
model_tier: architecture
risk: medium
architecture_impact: false
executor_preference: any
depends_on: [TASK-288]
context_paths:
  - project_docs/execution_planning/P14-EVIDENCE-PROVENANCE-NAVIGATION-01.md
  - specs/tasks/TASK-288-P14-PROVENANCE-NAVIGATION-INDEX.md
  - packages/contracts/evidence-provenance/**
allowed_paths:
  - packages/contracts/evidence-provenance/**
  - tests/product/**
  - specs/tasks/TASK-289-P14-SOURCE-TO-EVIDENCE-NAVIGATION.md
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
Provide deterministic source→evidence navigation over the projection built from explicit provenance.
# Context
TASK-288 creates the deterministic relation projection required by WBS 14.3.2.
# Current behavior
Consumers cannot ask which evidence/artifacts explicitly reference a given source without ad hoc scanning.
# Required change
Add a pure query that accepts an explicit source identifier and returns canonically ordered evidence identities from the navigation projection.
# Inputs / contracts
TASK-288 projection and explicit source identifiers.
# Outputs / contracts
Provider-neutral deterministic query result with explicit empty/not-found semantics.
# Acceptance criteria
Multiple matching evidence identities are returned in canonical order; input order does not affect output; absent source is explicit and non-fabricating; no provider/storage lookup or authorization decision occurs.
# Non-goals
No ranking, fuzzy search, graph traversal service, persistence or UI.
# Evidence expected
Focused source→evidence query tests plus repository verification.
# Escalation
Stop if lookup requires undeclared external topology.
