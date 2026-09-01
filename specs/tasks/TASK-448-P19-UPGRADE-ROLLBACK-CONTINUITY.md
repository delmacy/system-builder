---
id: TASK-448
title: Prove compatible upgrade and rollback through existing Deploy authority
status: completed
priority: 448
milestone: M19
model_tier: architecture
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
Exercise existing Release/Deploy continuity to move from active release A to compatible B and then restore A, preserving exact lineage, external environment configuration and last-known-good behavior.

# Context
TASK-447 prepares canonical B from restored A lineage. P13/P7 already own activation, retention, rollback/reconstruction semantics; this TASK proves those owners work with the current P19 factory-produced Compiler artifacts. TASK-444/445 already prove protected runtime configuration remains externally resolved and non-disclosed, so this TASK composes that predecessor evidence rather than duplicating secret-handling authority.

# Current behavior
P19 now connects the current canonical factory/Compiler lineage to an actual A -> B -> A sequence through the existing single-host Deploy authority.

# Required change
Reuse existing activation, retention, rollback/reconstruction and local-process Deploy semantics. Activate A from the P19 factory-produced Compiler artifact, reject a stale B promotion without displacing A, activate the exact compatible B artifact, then restore the exact retained A release through existing Release/Deploy authority. Do not add a second launcher, rollback controller or mutable continuity registry.

# Inputs / contracts
TASK-447 A/B factory and Compiler evidence, existing Release/Deploy/local-process contracts, EnvironmentProfile and historical P13/P7 continuity semantics.

# Outputs / contracts
Auditable A -> B -> A deployment/runtime evidence using existing owners; no new public contract.

# Acceptance criteria
- A -> B -> A uses existing Release/Deploy owners only;
- exact factory-produced release/artifact/deployment/runtime/environment identities are traceable across every transition;
- external EnvironmentProfile remains outside release artifacts, while TASK-444/445 cumulative evidence continues to cover protected secret externalization/redaction;
- stale predecessor B cannot displace last-known-good A;
- rollback/reconstruction restores the exact retained A Release/Artifact identity rather than a hand-authored equivalent;
- A remains healthy after rejected B, B becomes healthy only through accepted Deploy promotion, and restored A is healthy again;
- deployment history retains rejected candidate and accepted A/B/A evidence without partial-success promotion;
- no Runtime->Builder dependency, new topology, second launcher or new rollback authority is introduced;
- declared validations pass.

# Negative/adversarial cases
- B submitted against a stale expected-active deployment id;
- Builder/factory/bootstrap/Observe endpoints unavailable throughout process activation;
- exact retained A identity checked before rollback;
- rejected B remains history only and cannot become active authority.

# Non-goals
New deployment topology, production traffic/fleet orchestration, generic migrations, business process evolution, dogfood, new rollback authority or L4 changes.

# Evidence expected
Focused PostgreSQL-backed real-process product/heavy proof composing P19 factory/Compiler artifacts with the existing `SingleHostActiveRuntimeOrchestrator`, plus exact-head repository verification.

# Escalation
Stop if existing Deploy/Release semantics cannot prove required continuity without changing public authority or topology.
