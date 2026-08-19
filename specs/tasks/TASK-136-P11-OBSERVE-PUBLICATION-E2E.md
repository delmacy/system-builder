---
id: TASK-136
title: Prove Observe/operations publication E2E with Runtime autonomy
status: ready
priority: 458
milestone: M11
model_tier: cheap
risk: high
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-135
context_paths:
  - AGENTS.md
  - docs/current/PROJECT_STATE.md
  - docs/current/CURRENT_MILESTONE.md
  - project_docs/schedule/SPRINT_MODE.md
  - project_docs/execution_planning/P11-PACKAGE-01.md
  - project_docs/execution_planning/P11-OBSERVE-DEPLOYMENT-OBSERVATION-01.md
  - project_docs/10-deploy/WBS.md
  - project_docs/11-observe/WBS.md
  - project_docs/11-observe/scope/README.md
  - docs/adr/ADR-0002-autonomous-runtime.md
  - docs/adr/ADR-0003-open-modular-suite.md
  - docs/adr/ADR-0007-release-environment-deployment.md
  - docs/adr/ADR-0009-public-artifact-envelope.md
  - docs/architecture/MASTER_BLUEPRINT.md
  - docs/architecture/PIPELINE_AND_CONTRACTS.md
  - packages/observe/index.ts
  - packages/observe/publish.ts
  - packages/deploy/index.ts
  - packages/deploy/storage.ts
  - specs/tasks/TASK-134-P11-OBSERVE-DEPLOYMENT-OBSERVATION-CONTRACT.md
  - specs/tasks/TASK-135-P11-OBSERVE-PUBLICATION-FAILOPEN.md
  - specs/tasks/TASK-136-P11-OBSERVE-PUBLICATION-E2E.md
allowed_paths:
  - packages/observe/index.ts
  - packages/observe/publish.ts
  - tests/product/observe-publication-e2e.test.ts
  - specs/tasks/TASK-136-P11-OBSERVE-PUBLICATION-E2E.md
forbidden_paths:
  - apps/**
  - packages/contracts/**
  - packages/deploy/**
  - packages/runtime-core/**
  - packages/release/**
  - packages/artifact-store/**
  - packages/compiler/**
  - packages/postgres/**
  - docs/adr/**
  - .github/**
  - tooling/**
  - package.json
  - package-lock.json
max_files: 4
validation:
  - npm run test:product
  - npm run verify
---

# Objective

Prove the growing package integration E2E: a durable `DeploymentRecord` becomes a provider-neutral `DeploymentObservation` that Observe/operations receives when configured, while the autonomous Runtime continues operating with Observe unavailable — closing `TD-P7-03` and partially `TD-P4-08` under ADR-0002/0007.

# Context

`TASK-134`/`TASK-135` provide the observation contract and the fail-open publication path. The remaining package proof is the integrated chain: durable DeploymentRecord -> DeploymentObservation -> Observe receives it when configured, with Runtime autonomy intact (Observe unavailable never breaks Deploy or Runtime).

# Current behavior

The observation contract and fail-open publish exist as separate units; no product E2E proves the integrated chain or the Runtime-autonomy invariant end to end.

# Required change

Add a product E2E test that invokes the actual modules:

- produce a durable `DeploymentRecord` through the actual Deploy path (e.g. `dryRunDeploy`/`DeploymentRegistry` or `executeLocalDeployment`);
- derive and publish its `DeploymentObservation` through the fail-open publish path into an injected Observe receiver;
- assert the receiver got the deterministic observation with the correct release/environment/status/health correlation and no resolved secret value;
- assert that with Observe unavailable/not configured, Deploy and Runtime continuity are unchanged (Runtime keeps operating; publish returns fail-open, not a Deploy failure).

# Inputs / contracts

`DeploymentObservation` (TASK-134), fail-open publish (TASK-135), durable `DeploymentRecord`/Deploy modules, ADR-0002/0007, WBS 10.3.3 / 11.1.

# Outputs / contracts

Extends the growing integrated proof. No canonical `DeploymentRecord` change. No new ADR.

# Acceptance criteria

- durable DeploymentRecord -> DeploymentObservation -> Observe receiver is proven end to end;
- observation correlation fields match the source release/environment/status/health;
- no resolved secret/credential/CA value in any emitted observation;
- Runtime continuity with Observe unavailable/not configured is proven (Deploy and Runtime unchanged);
- positive, negative and fail-open cases are tested;
- declared validations pass.

# Non-goals

Telemetry/metrics/traces ingestion beyond the deployment observation, canonical contract changes, external provider SDKs, CI/tooling changes, Sprints 2/3 or the package review.

# Evidence expected

`tests/product/observe-publication-e2e.test.ts` extends the package E2E chain, plus GitHub Deterministic CI.

# Implementation evidence

To be implemented on `sprint/P11-OBSERVE-DEPLOYMENT-OBSERVATION-01` as the Sprint-closing TASK. CI validation required before Sprint Review.

# Escalation

Stop if implementation requires changing the canonical `DeploymentRecord` schema/identity, another package boundary, canonical contracts, Runtime behavior, or any L3/L4 boundary without escalation.