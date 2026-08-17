---
id: TASK-119
title: Add Deploy-owned managed local Runtime lifecycle
status: ready
priority: 420
milestone: M10
model_tier: cheap
risk: medium
architecture_impact: false
executor_preference: any
depends_on: []
context_paths:
  - AGENTS.md
  - docs/current/PROJECT_STATE.md
  - docs/current/CURRENT_MILESTONE.md
  - project_docs/schedule/SPRINT_MODE.md
  - project_docs/execution_planning/P9-PACKAGE-01.md
  - project_docs/execution_planning/P9-MANAGED-RUNTIME-PROCESS-01.md
  - project_docs/10-deploy/WBS.md
  - project_docs/13-autonomous-runtime/WBS.md
  - packages/deploy/local-process.ts
  - tests/product/local-process-deploy.test.ts
  - docs/adr/ADR-0002-autonomous-runtime.md
  - docs/adr/ADR-0007-release-environment-deployment.md
  - specs/tasks/TASK-119-MANAGED-LOCAL-RUNTIME-LIFECYCLE.md
allowed_paths:
  - packages/deploy/managed-process.ts
  - tests/product/managed-runtime-process.test.ts
  - specs/tasks/TASK-119-MANAGED-LOCAL-RUNTIME-LIFECYCLE.md
forbidden_paths:
  - packages/contracts/**
  - packages/runtime-core/**
  - packages/deploy/local-process.ts
  - packages/deploy/postgres-state.ts
  - apps/**
  - tooling/**
  - docs/adr/**
  - .github/**
  - package.json
  - package-lock.json
max_files: 3
validation:
  - npm run test:product
  - npm run verify
---

# Objective

Add an additive Deploy-owned single-host managed process API that starts an accepted generated Runtime, verifies health, leaves it alive and queryable, and exposes explicit bounded stop semantics.

# Context

P8 established durable authenticated deployment authority, while the existing Deploy local-process reference path starts a Runtime only long enough to perform acceptance checks before terminating it. P9 Sprint 1 must retain an accepted process without introducing external orchestration topology.

# Current behavior

`runLocalProcessDeployment` verifies artifact/environment inputs, applies migrations, resolves runtime-only secrets, starts the generated Runtime, checks health/state as applicable, then terminates the child and removes materialization before returning.

# Required change

Add a separate Deploy-local managed process implementation that can start the same generated Runtime inputs, verify health, retain the accepted process, expose a secret-free lifecycle snapshot and explicitly stop the process. Existing one-shot behavior must remain unchanged.

# Inputs / contracts

Existing `DeployPublishedRelease`, local verifiable ReleaseArtifact shape, verified artifact payload reader, canonical `EnvironmentProfile`, optional `SecretResolver`, optional local migration applier, ADR-0002 and ADR-0007. No canonical contract change.

# Outputs / contracts

An additive Deploy-module managed-process API and lifecycle handle/state that does not expose the raw child process or resolved secret values.

# Acceptance criteria

- actual verified artifact payload and EnvironmentProfile inputs are consumed;
- accepted child remains alive after health PASS;
- caller can inspect a deterministic secret-free running snapshot;
- caller can explicitly stop the process;
- Release/Artifact inputs remain immutable;
- incompatible artifact/environment fails before a managed process exists;
- existing `runLocalProcessDeployment` semantics are untouched;
- positive, negative and predecessor-integration evidence exists;
- declared validations pass.

# Non-goals

Atomic deployment promotion, durable active authority binding, restart reconciliation, external traffic switching, fleet/cloud scheduling, canonical contracts, Runtime feature changes.

# Evidence expected

Focused product tests using actual compiler/release/artifact APIs proving start -> health -> retained/queryable -> explicit stop and an incompatible-input failure.

# Escalation

Stop if this requires canonical contracts, Runtime changes, external traffic/fleet topology, or modification/removal of predecessor API semantics.
