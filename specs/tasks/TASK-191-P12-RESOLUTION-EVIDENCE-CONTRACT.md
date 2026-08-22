---
id: TASK-191
title: Define cause resolution and evidence record
status: ready
priority: 546
milestone: M12
model_tier: architecture
risk: medium
architecture_impact: true
executor_preference: any
depends_on: [TASK-190]
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/P12-SUPPORT-RESOLUTION-01.md
  - project_docs/12-support-evolution/WBS.md
  - packages/support-evolution/case.ts
  - packages/support-evolution/problem.ts
  - packages/support-evolution/correction.ts
  - packages/support-evolution/index.ts
allowed_paths:
  - packages/support-evolution/resolution.ts
  - packages/support-evolution/index.ts
  - tests/product/support-resolution-contract.test.ts
  - specs/tasks/TASK-191-P12-RESOLUTION-EVIDENCE-CONTRACT.md
forbidden_paths:
  - packages/contracts/**
  - packages/observe/**
  - packages/deploy/**
  - packages/runtime-core/**
  - .github/**
  - tooling/**
max_files: 4
validation:
  - npm run test:product
  - npm run check:tasks
  - npm run verify
---
# Objective
Implement WBS 12.2.3 by recording explicit cause, resolution and evidence references for a support case or maintenance problem.
# Context
Case/problem/correction evidence is available from TASK-185..190.
# Current behavior
No durable resolution evidence links operational records to explicit cause/resolution/evidence.
# Required change
Create immutable content-addressed `ResolutionEvidence` referencing exactly one supported operational subject, with explicit causeRef, resolutionRef, evidenceRefs and actor/time provenance. For a problem with correction evidence, link by reference; do not execute the correction.
# Inputs / contracts
`SupportCaseRecord`, `ProblemRecord`, optional `PermittedCorrectionEvidence`, WBS 12.2.3.
# Outputs / contracts
Additive Support/Evolution-local resolution evidence API.
# Acceptance criteria
Cause/resolution/evidence are explicit references, deterministic and traceable; invalid mixed/missing subjects fail closed.
# Non-goals
Root-cause inference, auto-resolution, remediation, production mutation or Evolution execution.
# Evidence expected
Contract implementation and focused product tests.
# Escalation
Stop if shared contracts or lifecycle architecture changes are required.
