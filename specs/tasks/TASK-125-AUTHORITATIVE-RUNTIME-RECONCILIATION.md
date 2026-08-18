---
id: TASK-125
title: Reconcile durable active authority into managed Runtime
status: verification
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

Introduce a new Deploy-local reconciliation API that reads current active authority, validates reconstructed release/artifact/environment identity, starts the existing managed Runtime only after those checks pass, and never mutates deployment authority merely to recover process state.

# Inputs / contracts

Existing `DeploymentRegistry.getActive`, `startManagedLocalRuntime`, PublishedRelease, ReleaseArtifact, verified payload reader and EnvironmentProfile. ADR-0002/ADR-0007 remain unchanged.

# Outputs / contracts

Additive `SingleHostRuntimeReconciler` with secret-free active snapshot, health, controlled shutdown and reconciliation result. No canonical contract change.

# Acceptance criteria

- fresh reconciler with durable active B and matching reconstructed B release/artifact/environment starts B and reports deployment id B;
- Runtime health is UP;
- no new activation decision or authority mutation occurs during reconciliation;
- mismatch between authority and supplied release/artifact/environment fails before process start;
- no raw child process or resolved secret is exposed;
- positive, negative and predecessor-integration tests exist;
- declared validations pass.

# Non-goals

Generic process discovery, unmanaged-process adoption, manager daemonization, external traffic switching, fleet/cloud topology, durable process descriptor contract, canonical contracts, Runtime changes.

# Evidence expected

`tests/product/runtime-reconciliation.test.ts` proves A -> B promotion through the predecessor orchestrator, controlled B shutdown, fresh reconciler rematerialization of authoritative B, health UP and unchanged durable authority, plus pre-start rejection of a non-authoritative release.

# Implementation evidence

Implemented on Sprint branch in `packages/deploy/runtime-reconciliation.ts` and focused product tests. CI validation is required before TASK-126 becomes eligible.

# Escalation

Stop if implementation requires any forbidden predecessor edit, generic process discovery, external process manager, canonical infrastructure contract or L4 topology decision.
