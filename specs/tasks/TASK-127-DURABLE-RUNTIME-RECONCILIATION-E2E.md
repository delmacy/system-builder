---
id: TASK-127
title: Prove durable manager restart reconciliation end to end
status: verification
priority: 442
milestone: M10
model_tier: cheap
risk: medium
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-126
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
  - packages/catalog/index.ts
  - packages/catalog/postgres.ts
  - packages/assembly/index.ts
  - packages/validation/index.ts
  - packages/compiler/index.ts
  - packages/release/index.ts
  - packages/release/postgres.ts
  - packages/artifact-store/index.ts
  - packages/artifact-store/postgres.ts
  - packages/deploy/index.ts
  - packages/deploy/postgres-state.ts
  - packages/deploy/active-runtime.ts
  - packages/deploy/runtime-reconciliation.ts
  - tests/product/fixtures/factory-e2e.ts
  - docs/adr/ADR-0002-autonomous-runtime.md
  - docs/adr/ADR-0007-release-environment-deployment.md
  - docs/architecture/MASTER_BLUEPRINT.md
  - specs/tasks/TASK-127-DURABLE-RUNTIME-RECONCILIATION-E2E.md
allowed_paths:
  - tests/product/p9-runtime-reconciliation-e2e.test.ts
  - specs/tasks/TASK-127-DURABLE-RUNTIME-RECONCILIATION-E2E.md
forbidden_paths:
  - packages/**
  - apps/**
  - tooling/**
  - docs/adr/**
  - .github/**
  - package.json
  - package-lock.json
max_files: 2
validation:
  - npm run test:product
  - npm run verify
---

# Objective

Prove the full P9 growing E2E chain through a controlled Deploy manager restart using real durable Factory/Release/Artifact/Deploy repositories and the actual reconciliation API, with no hand-authored downstream artifact where an executable API exists.

# Context

P9 Sprint 1 added managed Runtime lifecycle. Sprint 2 bound live promotion/retention to authenticated atomic Deploy authority. TASK-125/126 add bounded restart reconciliation. This evidence-only TASK closes the construction package proof before the mandatory integration/debt review.

# Current behavior

The executable seams exist and TASK-125/126 are CI-proven; package-level durable restart evidence is the remaining construction proof.

# Required change

Add one E2E product test that persists/reconstructs Catalog before compilation, persists/reconstructs Release and Artifact payload, uses authenticated PostgreSQL Deploy state, activates A and promotes B, records stale C and failed D retention, explicitly shuts down old manager B while durable authority remains, reopens durable Deploy/Release/Artifact stores, reconciles only reconstructed B in a fresh manager, and proves health with Builder/Observe unavailable.

# Inputs / contracts

All existing executable package APIs plus TASK-125/126 reconciliation API. No production code edits are allowed.

# Outputs / contracts

Evidence only: one package-level E2E test and this TASK spec status/evidence update.

# Acceptance criteria

- durable Catalog is reconstructed before assembly/compiler output;
- durable Release/Artifact repositories are reconstructed before live promotion and again after manager restart;
- A -> B promotion runs against authenticated durable Deploy authority;
- stale C and failed D remain durable attempts while B remains active;
- old manager B is explicitly stopped before fresh-manager reconciliation;
- fresh manager starts only reconstructed B from durable authority/release/artifact/environment evidence;
- Builder/Observe remain unavailable while reconciled B is healthy;
- credentials/secrets are absent from serialized evidence;
- no `packages/**` changes;
- declared validations pass.

# Non-goals

Host reboot/service daemon proof, generic process discovery, external load balancer/DNS/reverse proxy, scheduler/Kubernetes, fleet/cloud, production SecretResolver/TLS hardening, package review.

# Evidence expected

`tests/product/p9-runtime-reconciliation-e2e.test.ts` deterministically executes the complete P9 durable restart/reconciliation chain against the PostgreSQL CI fixtures.

# Implementation evidence

Evidence-only implementation is committed on the Sprint branch; CI validation is required before Sprint closure.

# Escalation

If the proof cannot be achieved with existing APIs plus TASK-125/126 without product changes outside their authorized scope, stop and report the exact missing product seam instead of modifying `packages/**`.
