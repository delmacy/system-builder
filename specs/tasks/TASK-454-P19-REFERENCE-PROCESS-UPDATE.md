---
id: TASK-454
title: Activate compatible same-host reference successor
status: blocked
priority: 454
milestone: M19
model_tier: architecture
risk: high
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-453
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/P19-REFERENCE-PRODUCT-PROCESS-01.md
  - packages/compiler/**
  - packages/release/**
  - packages/deploy/**
  - scripts/**
  - tests/product/**
allowed_paths:
  - scripts/**
  - tests/product/**
  - packages/release/**
  - packages/deploy/**
  - project_docs/execution_planning/P19-REFERENCE-PRODUCT-PROCESS-01.md
  - specs/tasks/TASK-454-P19-REFERENCE-PROCESS-UPDATE.md
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
Prepare and activate one compatible successor of the representative reference process through existing same-host factory/Release/Deploy authority.

# Required change
Use the integrated successor preparation and active-runtime orchestration primitives. Preserve predecessor provenance and exact immutable A/B identities; do not create a second update owner or hide lineage behind convenience aliases.

# Acceptance criteria
- B is prepared only from canonical successor/predecessor lineage and verified artifacts;
- same-host activation uses existing Deploy/Release orchestration and external environment/secrets;
- successful B becomes healthy/observable with correlated canonical identities;
- stale/substituted/incompatible B, environment mismatch and migration/secret/startup/health failure stop before unsafe promotion;
- rejected candidates preserve the exact last-known-good A under existing semantics;
- repeated equivalent update attempts are deterministic/idempotent where existing APIs promise it.

# Non-goals
Fleet rollout, remote orchestration, generalized migrations, new update authority, new identity/public contract or WBS 19.3.2+.
