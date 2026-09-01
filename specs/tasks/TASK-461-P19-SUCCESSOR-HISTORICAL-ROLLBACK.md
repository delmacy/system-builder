---
id: TASK-461
title: Restore exact predecessor and reconstruct A/B history
status: blocked
priority: 461
milestone: M19
model_tier: architecture
risk: high
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-460
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/P19-SUCCESSOR-PROCESS-EVOLUTION-01.md
  - packages/release/**
  - packages/deploy/**
  - tests/product/**
allowed_paths:
  - tests/product/**
  - packages/release/**
  - packages/deploy/**
  - project_docs/execution_planning/P19-SUCCESSOR-PROCESS-EVOLUTION-01.md
  - specs/tasks/TASK-461-P19-SUCCESSOR-HISTORICAL-ROLLBACK.md
forbidden_paths:
  - packages/contracts/decision-boundary/**
  - packages/runtime-core/**
  - apps/**
max_files: 11
validation:
  - npm run test:product
  - npm run test:product:heavy
  - npm run check:tasks
  - npm run check:architecture
  - npm run verify
---
# Objective
Restore exact retained A after successor-revision B and prove both historical process->definition->release->deployment chains remain reconstructible.

# Required change
Rollback through existing Release/Deploy authority using retained immutable A rather than regeneration. Prove canonical historical reconstruction for A and B before/after restore and reject stale/substituted targets without disturbing last-known-good.

# Acceptance criteria
- rollback targets exact retained A release/artifact and original process revision lineage;
- restored runtime is healthy and correlates to the original A chain;
- both A and B histories remain reconstructible from canonical identifiers/hashes/refs;
- stale/substituted rollback target and incompatible environment fail closed;
- failed/repeated rollback preserves canonical active state without synthetic releases or identity drift;
- secrets/config remain external and protected;
- no new rollback/history authority is introduced.

# Non-goals
General rollback service, fleet history, artifact regeneration, WBS 19.3.3+ or new public contract.

# Evidence expected
Focused product/heavy proof of exact A restoration, A/B historical reconstruction, stale/substituted rejection and repeated-request stability plus declared gates.

# Escalation
Stop if exact reconstruction/restore requires artifact mutation, a new history store, lifecycle owner or public identity contract.
