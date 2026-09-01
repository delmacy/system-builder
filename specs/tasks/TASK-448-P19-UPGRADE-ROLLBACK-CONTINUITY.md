---
id: TASK-448
title: Prove compatible upgrade and rollback through existing Deploy authority
status: blocked
priority: 448
milestone: M19
risk: high
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-447
context_paths:
  - AGENTS.md
  - project_docs/execution_planning/P19-AUTONOMOUS-RUNTIME-CONTINUITY-01.md
  - project_docs/execution_planning/P13-RUNTIME-UPGRADE-ROLLBACK-CONTINUITY-01.md
  - specs/tasks/TASK-264-P13-RUNTIME-ROLLBACK-RECONSTRUCTION-PROOF.md
  - packages/release/**
  - packages/deploy/**
  - packages/runtime-core/**
  - tests/product/**
allowed_paths:
  - scripts/**
  - tests/product/**
  - docs/operations/**
  - specs/tasks/TASK-448-P19-UPGRADE-ROLLBACK-CONTINUITY.md
forbidden_paths:
  - packages/contracts/decision-boundary/**
  - apps/**
max_files: 12
validation:
  - npm run test:product
  - npm run test:product:heavy
  - npm run check:tasks
  - npm run check:architecture
  - npm run verify
---
# Objective
Exercise existing Release/Deploy continuity to move from active release A to compatible B and then restore A, preserving exact lineage, external environment/secrets and last-known-good behavior.

# Required change
Reuse existing P13/P7 activation, retention, rollback/reconstruction and local-process Deploy semantics on the current P19-supported artifacts. Activate compatible B only after TASK-447 evidence validates, prove B operates, restore/reconstruct A through existing authority, and prove A operates again. Adversarial candidates must not displace the last-known-good runtime when existing authority promises retention.

# Acceptance criteria
- A -> B -> A uses existing Release/Deploy owners only;
- exact release/artifact/deployment/runtime/environment identities are traceable across every transition;
- external EnvironmentProfile/secrets remain external and protected;
- incompatible, stale, migration/secret/startup/health-failed B cannot become accepted active success;
- rollback/reconstruction restores exact A lineage rather than a hand-authored equivalent;
- retries/repeated failures remain bounded/idempotent where existing contracts require it;
- no partial-success continuity evidence is emitted;
- declared validations pass.

# Non-goals
New deployment topology, production traffic/fleet orchestration, generic migrations, business process evolution, dogfood, new rollback authority or L4 changes.

# Escalation
Stop if existing Deploy/Release semantics cannot prove required continuity without changing public authority or topology.
