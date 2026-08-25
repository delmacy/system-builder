---
id: TASK-290
title: Query evidence to source provenance navigation
status: ready
priority: 290
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
  - specs/tasks/TASK-290-P14-EVIDENCE-TO-SOURCE-NAVIGATION.md
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
Provide deterministic evidence→source navigation over the projection built from explicit provenance.
# Context
WBS 14.3.2 requires the reverse direction in addition to source→evidence.
# Current behavior
Consumers can inspect one extension manually but there is no reusable normalized query surface for reverse navigation.
# Required change
Add a pure query that accepts an explicit evidence identifier and returns canonically ordered source references from the navigation projection.
# Inputs / contracts
TASK-288 projection and explicit evidence identifiers.
# Outputs / contracts
Provider-neutral deterministic evidence→source query result with explicit empty/not-found semantics.
# Acceptance criteria
Source references are returned without inference and in canonical order; absent evidence is explicit; duplicate/conflicting identities are not silently collapsed; no provider/storage lookup or authorization semantics are introduced.
# Non-goals
No graph traversal service, persistence, Runtime Audit Trail or UI.
# Evidence expected
Focused evidence→source query tests plus repository verification.
# Escalation
Stop if lookup requires undeclared external topology.
