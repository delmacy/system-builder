---
id: TASK-444
title: Prove Builder-off autonomy from supported runtime handoff
status: completed
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
Prove that the actual generated runtime launched through the supported P19 runtime-materialization handoff operates correctly while Builder-side bootstrap/factory dependencies are unavailable.

# Context
WBS 19.2.2 is integrated and launches the actual Compiler-produced runtime through existing local-process Deploy. P13 already proved offline autonomy, but P19 must prove the same invariant from the current supported operator/factory handoff rather than from a historical standalone fixture.

The existing local-process Deploy owns the complete process lifecycle for this supported topology: it starts the generated runtime, probes startup/health/behavior, terminates it, and cleans the materialization directory before returning. TASK-444 must not introduce a second launcher, lifecycle callback, supervisor or test-only persistence seam merely to observe a process after Deploy has intentionally completed its lifecycle.

# Current behavior
The runtime handoff already proves startup/health from the exact Compiler payload. Existing P19 evidence does not yet make Builder/bootstrap/factory unavailability an explicit invariant of the entire supported active runtime window or prove structurally that the generated payload carries no hidden Runtime->Builder dependency.

# Required change
Extend the existing growing product proof without introducing a new runtime path. Freeze the canonical bootstrap/factory result first, then make Builder-side invocation/services unavailable before Deploy activation and keep them unavailable throughout the supported runtime startup/health/behavior window. Prove the exact verified published artifact still operates from release-local/runtime-local inputs only, while the generated payload contains no Builder callback/import authority. This is the bounded supported-lifecycle proof of the WBS autonomy invariant; do not add a second process owner to manufacture an after-return observation window.

# Inputs / contracts
Supported P19 runtime-materialization handoff, actual Compiler payload, PublishedRelease/ReleaseArtifact/DeploymentRecord identities, EnvironmentProfile and ADR-0002/0007.

# Outputs / contracts
Test evidence only: exact active lineage plus Builder-off runtime health/behavior. No new public contract.

# Acceptance criteria
- actual Compiler-produced runtime is launched through the existing local-process Deploy path;
- exact release/artifact/deployment/runtime/environment lineage is captured before Builder unavailability;
- after canonical factory output is fixed, Builder/bootstrap/factory unavailability is established before activation and remains in effect throughout startup/health/supported behavior without breaking the runtime;
- no Runtime->Builder request/import/callback or hidden mutable dependency is required for ordinary operation;
- protected environment/secrets remain external and no Builder progress/diagnostic state becomes runtime authority;
- stale/substituted runtime evidence remains fail-closed through the already integrated mandatory handoff preflight;
- equivalent clean runs are repeatable in deterministic identity/evidence portions;
- no second launcher, lifecycle owner or test-only persistent process seam is introduced;
- declared validations pass.

# Non-goals
New runtime features, new topology, production supervision, persistence redesign, successor release preparation, upgrade/rollback, dogfood or WBS 19.3.1+.

# Evidence expected
Focused heavy/product proof using the supported materialization entrypoint and exact Compiler payload, plus exact-head repository verification.

# Escalation
Stop if proving autonomy requires a new Runtime->Builder dependency, a second runtime lifecycle owner or other L4 boundary change.
