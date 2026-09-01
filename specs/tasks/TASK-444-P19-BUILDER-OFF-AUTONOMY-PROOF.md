---
id: TASK-444
title: Prove Builder-off autonomy from supported runtime handoff
status: ready
priority: 444
milestone: M19
model_tier: architecture
risk: medium
architecture_impact: false
executor_preference: any
depends_on: []
context_paths:
  - AGENTS.md
  - docs/current/PROJECT_STATE.md
  - docs/current/CURRENT_MILESTONE.md
  - docs/current/NEXT_WORK.md
  - project_docs/execution_planning/P19-AUTONOMOUS-RUNTIME-CONTINUITY-01.md
  - project_docs/execution_planning/P19-RUNTIME-MATERIALIZATION-HANDOFF-01.md
  - project_docs/execution_planning/P13-RUNTIME-OFFLINE-AUTONOMY-01.md
  - docs/adr/ADR-0002-autonomous-runtime.md
  - docs/adr/ADR-0007-release-environment-deployment.md
  - scripts/runtime-materialization-handoff.ts
  - packages/deploy/**
  - packages/runtime-core/**
  - packages/compiler/**
  - tests/product/**
allowed_paths:
  - scripts/**
  - tests/product/**
  - docs/operations/**
  - specs/tasks/TASK-444-P19-BUILDER-OFF-AUTONOMY-PROOF.md
forbidden_paths:
  - packages/contracts/decision-boundary/**
  - apps/**
  - tooling/agent-harness/**
max_files: 10
validation:
  - npm run test:product
  - npm run test:product:heavy
  - npm run check:tasks
  - npm run check:architecture
  - npm run verify
---
# Objective
Prove that the actual generated runtime launched through the supported P19 runtime-materialization handoff continues operating when Builder-side bootstrap/factory dependencies are unavailable.

# Context
WBS 19.2.2 is integrated and launches the actual Compiler-produced runtime through existing local-process Deploy. P13 already proved offline autonomy, but P19 must prove the same invariant from the current supported operator/factory handoff rather than from a historical standalone fixture.

# Current behavior
The runtime handoff proves startup/health while Builder-side factory/bootstrap capability is available. The current P19 proof does not yet keep that exact runtime alive while Builder-side capability becomes unavailable.

# Required change
Extend the existing growing product proof without introducing a new runtime path. Launch the exact verified published artifact through the supported handoff, make Builder-side invocation/services unavailable after activation, and prove runtime health/functional behavior continues from release-local/runtime-local inputs only.

# Inputs / contracts
Supported P19 runtime-materialization handoff, actual Compiler payload, PublishedRelease/ReleaseArtifact/DeploymentRecord identities, EnvironmentProfile and ADR-0002/0007.

# Outputs / contracts
Test evidence only: exact active lineage plus Builder-off runtime health/behavior. No new public contract.

# Acceptance criteria
- actual Compiler-produced runtime is launched through the existing local-process Deploy path;
- exact release/artifact/deployment/runtime/environment lineage is captured before Builder unavailability;
- Builder/bootstrap/factory unavailability after activation does not break runtime health or supported behavior;
- no Runtime->Builder request/import/callback or hidden mutable dependency is required for ordinary operation;
- protected environment/secrets remain external and no Builder progress/diagnostic state becomes runtime authority;
- stale/substituted runtime evidence fails closed;
- equivalent clean runs are repeatable in deterministic portions;
- declared validations pass.

# Non-goals
New runtime features, new topology, production supervision, persistence redesign, successor release preparation, upgrade/rollback, dogfood or WBS 19.3.1+.

# Evidence expected
Focused heavy/product proof using the supported materialization entrypoint, plus exact-head repository verification.

# Escalation
Stop if proving autonomy requires a new Runtime->Builder dependency or other L4 boundary change.
