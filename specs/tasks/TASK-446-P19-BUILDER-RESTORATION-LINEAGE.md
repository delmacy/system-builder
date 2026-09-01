---
id: TASK-446
title: Prove Builder restoration from immutable runtime lineage
status: blocked
priority: 446
milestone: M19
risk: medium
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-445
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/P19-AUTONOMOUS-RUNTIME-CONTINUITY-01.md
  - project_docs/execution_planning/P19-RUNTIME-MATERIALIZATION-HANDOFF-01.md
  - project_docs/execution_planning/P13-RUNTIME-UPGRADE-ROLLBACK-CONTINUITY-01.md
  - packages/release/**
  - packages/deploy/**
  - packages/observe/**
  - tests/product/**
allowed_paths:
  - scripts/**
  - tests/product/**
  - docs/operations/**
  - specs/tasks/TASK-446-P19-BUILDER-RESTORATION-LINEAGE.md
forbidden_paths:
  - packages/runtime-core/**
  - packages/contracts/decision-boundary/**
  - apps/**
max_files: 9
validation:
  - npm run test:product
  - npm run test:product:heavy
  - npm run check:tasks
  - npm run check:architecture
  - npm run verify
---
# Objective
Prove Builder-side capability can be restored after an autonomous-runtime interval by reconstructing canonical lineage from immutable Release/Deployment evidence without disturbing the running runtime or creating reverse runtime dependence.

# Required change
Using the exact active release/artifact/deployment identities from TASK-444/445, restore the supported Builder-side factory/bootstrap context and prove it can validate/reconstruct the predecessor lineage solely from canonical persisted/immutable evidence. The active runtime must keep operating throughout restoration and must not register/rebind to Builder as an ordinary runtime prerequisite.

# Acceptance criteria
- restoration starts from exact immutable release/artifact/deployment evidence;
- active runtime behavior/health remains unchanged during Builder restoration;
- stale/substituted/mismatched lineage is rejected before successor preparation;
- Builder progress/diagnostics are not accepted as predecessor authority;
- no Runtime->Builder dependency or registration handshake is introduced;
- external EnvironmentProfile/secrets remain outside release artifacts;
- declared validations pass.

# Non-goals
Preparing release B, activating a successor, rollback, dogfood, new persistence/control plane or topology changes.

# Escalation
Stop if restoration requires a new canonical contract, control plane or runtime registration authority.
