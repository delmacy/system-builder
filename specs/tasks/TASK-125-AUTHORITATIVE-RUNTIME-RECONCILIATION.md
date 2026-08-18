---
id: TASK-125
title: Reconcile durable active authority into managed Runtime
status: ready
priority: 440
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
  - project_docs/execution_planning/P9-MANAGED-RUNTIME-PROCESS-01.report.md
  - project_docs/execution_planning/P9-ACTIVE-RUNTIME-PROMOTION-01.report.md
  - project_docs/execution_planning/P9-RUNTIME-RECONCILIATION-E2E-01.md
  - project_docs/10-deploy/WBS.md
  - project_docs/13-autonomous-runtime/WBS.md
  - packages/deploy/index.ts
  - packages/deploy/managed-process.ts
  - packages/deploy/active-runtime.ts
  - packages/release/index.ts
  - packages/artifact-store/index.ts
  - docs/adr/ADR-0002-autonomous-runtime.md
  - docs/adr/ADR-0007-release-environment-deployment.md
  - docs/architecture/MASTER_BLUEPRINT.md
  - specs/tasks/TASK-125-AUTHORITATIVE-RUNTIME-RECONCILIATION.md
allowed_paths:
  - packages/deploy/runtime-reconciliation.ts
  - tests/product/runtime-reconciliation.test.ts
  - specs/tasks/TASK-125-AUTHORITATIVE-RUNTIME-RECONCILIATION.md
forbidden_paths:
  - packages/contracts/**
  - packages/runtime-core/**
  - packages/deploy/index.ts
  - packages/deploy/managed-process.ts
  - packages/deploy/active-runtime.ts
  - packages/deploy/local-process.ts
  - packages/deploy/postgres-state.ts
  - packages/release/**
  - packages/artifact-store/**
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

Add an additive Deploy-local reconciliation seam that a fresh single-host manager can use after controlled restart to reconstruct durable active authority and rematerialize exactly that authoritative Runtime from already reconstructed Release/Artifact/Environment inputs.

# Context

P8 provides durable atomic Deployment authority. P9 Sprint 1 provides managed Runtime lifecycle. P9 Sprint 2 couples live promotion to durable authority. The remaining package gap is fresh-manager reconciliation after in-memory orchestration state is lost.

# Current behavior

A fresh `SingleHostActiveRuntimeOrchestrator` has no process state even when its `DeploymentRegistry` reconstructs an active durable DeploymentRecord.

# Required change

Introduce a new Deploy-local reconciliation API/class/function that:
- reads the current active DeploymentRecord from the supplied existing DeploymentRegistry;
- verifies the supplied PublishedRelease/ReleaseArtifact/Environment correspond to that durable authority;
- starts the Runtime via the existing managed-process API only after those checks pass;
- returns a secret-free reconciliation result/handle whose deployment identity equals the durable active id;
- does not mutate deployment authority or create a new DeploymentRecord merely to recover process state.

The restart model is controlled: the prior manager has already stopped its owned process. No process discovery is required or authorized.

# Inputs / contracts

Existing `DeploymentRegistry.getActive`, `startManagedLocalRuntime`, `PublishedRelease`, `ReleaseArtifact`, verified payload reader and `EnvironmentProfile`. ADR-0002/ADR-0007 remain unchanged.

# Outputs / contracts

Additive Deploy-module reconciliation API and focused tests. No canonical contract change.

# Acceptance criteria

- fresh reconciler with durable active B and matching reconstructed B release/artifact/environment starts B and reports deployment id B;
- Runtime health is UP with Builder/Observe unavailable;
- no new activation decision or authority mutation occurs during reconciliation;
- no raw child process or resolved secret is exposed;
- mismatch between authority and supplied release/artifact/environment fails before process start;
- positive, negative and predecessor-integration tests exist;
- declared validations pass.

# Non-goals

Generic process discovery, unmanaged-process adoption, manager daemonization, external traffic switching, fleet/cloud topology, durable process descriptor contract, canonical contracts, Runtime changes.

# Evidence expected

Focused product test proving a fresh reconciliation component can rematerialize authoritative B solely from durable authority identity plus reconstructed existing release/artifact/environment inputs, without Builder/Observe.

# Escalation

Stop if implementation requires any forbidden predecessor edit, generic process discovery, external process manager, canonical infrastructure contract or L4 topology decision.
