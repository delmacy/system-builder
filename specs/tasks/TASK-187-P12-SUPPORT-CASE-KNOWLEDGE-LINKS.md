---
id: TASK-187
title: Add explicit knowledge links to support cases
status: verification
priority: 542
milestone: M12
model_tier: cheap
risk: low
architecture_impact: false
executor_preference: any
depends_on: [TASK-186]
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/P12-SUPPORT-RESOLUTION-01.md
  - project_docs/12-support-evolution/WBS.md
  - packages/support-evolution/case.ts
allowed_paths:
  - packages/support-evolution/case.ts
  - tests/product/support-case-knowledge-links.test.ts
  - specs/tasks/TASK-187-P12-SUPPORT-CASE-KNOWLEDGE-LINKS.md
forbidden_paths:
  - packages/contracts/**
  - packages/observe/**
  - packages/deploy/**
  - .github/**
  - tooling/**
max_files: 3
validation:
  - npm run test:product
  - npm run check:tasks
  - npm run verify
---
# Objective
Implement WBS 12.2.1 knowledge links as explicit stable references on support cases.
# Context
Support case identity/validation is available from TASK-185/186.
# Current behavior
Cases cannot record related knowledge references.
# Required change
Add non-empty canonical knowledge reference collection with deterministic ordering/deduplication and reference-only semantics.
# Inputs / contracts
`SupportCaseRecord`, WBS 12.2.1.
# Outputs / contracts
Case records can carry explicit knowledge links without embedding knowledge internals.
# Acceptance criteria
Equivalent reference sets produce stable identity; empty/malformed/resolved-value inputs fail according to Support/Evolution conventions.
# Non-goals
Knowledge search/ranking, recommendation engines or automatic case resolution.
# Evidence expected
Focused deterministic tests and CI.
# Escalation
Stop if Knowledge Plane internals must be imported.
