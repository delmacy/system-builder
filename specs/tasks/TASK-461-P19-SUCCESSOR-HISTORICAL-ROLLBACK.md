---
id: TASK-461
title: Restore exact predecessor and reconstruct A/B history
status: completed
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

# Context
TASK-460 activates B while preserving retained A. The rollback proof must demonstrate that process-revision evolution does not erase either historical chain and that restore targets immutable retained A rather than regenerating or synthesizing predecessor state.

# Current behavior
Existing P19 Release/Deploy owners can restore an exact retained predecessor release, and TASK-458 establishes historical A reconstruction. Construction 8 still needs the combined A/B historical reconstruction and exact restore proof after B originated from a successor approved process revision.

# Required change
Rollback through existing Release/Deploy authority using retained immutable A rather than regeneration. Prove canonical historical reconstruction for A and B before/after restore and reject stale/substituted targets without disturbing last-known-good.

# Inputs / contracts
Canonical historical A from TASK-458, deployed B from TASK-460, retained immutable Release/artifact identities, existing rollback/activation validation and environment compatibility contracts.

# Outputs / contracts
A healthy restored deployment of exact retained A plus deterministic reconstructible A/B histories using canonical refs/hashes, without artifact mutation, synthetic release or new history authority.

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

# Execution evidence
- Added `tests/product/p19-successor-historical-rollback.test.ts` over the existing Release registry, Deployment registry and `SingleHostActiveRuntimeOrchestrator`; no product owner or public contract changed.
- The proof publishes A and B once, activates A then B, and restores A by reusing A's retained immutable `PublishedRelease`, verified artifact payload and original process->definition->release lineage rather than recompiling or synthesizing a replacement release.
- Original A, successor B and restored-A Deployment records remain queryable while A/B Release records and canonical process revision/definition identities remain stable; no synthetic `0.0.3` release appears.
- Adversarial coverage rejects stale expected-active state, runtime-incompatible environment and a substituted release/artifact rollback target while exact active B remains healthy; repeating the already-consumed restore request remains stale/idempotent and preserves restored A.
- Evidence carries no EnvironmentProfile object or protected value, and Runtime-core, applications, Decision Boundary, lifecycle topology and WBS 19.3.3+ remain untouched.

# Escalation
Stop if exact reconstruction/restore requires artifact mutation, a new history store, lifecycle owner or public identity contract.
