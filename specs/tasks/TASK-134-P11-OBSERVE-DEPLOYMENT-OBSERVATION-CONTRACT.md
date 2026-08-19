---
id: TASK-134
title: Define the provider-neutral DeploymentObservation contract
status: ready
priority: 456
milestone: M11
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
  - packages/deploy/index.ts
  - packages/deploy/storage.ts
  - specs/tasks/TASK-134-P11-OBSERVE-DEPLOYMENT-OBSERVATION-CONTRACT.md
allowed_paths:
  - packages/observe/index.ts
  - tests/product/observe-observation-contract.test.ts
  - specs/tasks/TASK-134-P11-OBSERVE-DEPLOYMENT-OBSERVATION-CONTRACT.md
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
max_files: 3
validation:
  - npm run test:product
  - npm run verify
---

# Objective

Define a provider-neutral `DeploymentObservation` contract in a new `packages/observe` module that derives a durable, deterministic, value-leak-free observation from the existing `DeploymentRecord` (WBS 10.3.3), ready to be published to Observe/operations.

# Context

Observe (SB-11) is an accepted bounded context (ADR-0003) that "receives telemetry from runtimes without becoming a runtime dependency" (MASTER_BLUEPRINT). The pipeline contract map declares `Deploy -> ArtifactEnvelope<DeploymentRecord> -> Observe/operations` (PIPELINE_AND_CONTRACTS.md). `TD-P7-03` (Deployment operational publication absent) is the carried driver. The existing `DeploymentRecord` (`packages/deploy/index.ts`) is durable and deterministic; its identity must not change.

# Current behavior

There is no Observe module and no DeploymentObservation contract. The durable `DeploymentRecord` exists (`deploymentId`, `publishedReleaseRef`, `environmentRef`, `releaseHash`, `startedAt`, `completedAt`, `status`, `healthChecks`) but is not published anywhere.

# Required change

Add `packages/observe/index.ts` exporting a provider-neutral `DeploymentObservation`:

- `kind: "DeploymentObservation"`;
- deterministic `observationId` derived (content-addressed, e.g. `sha256Canonical`) from the correlated payload;
- correlation fields derived from `DeploymentRecord`: `deploymentId`, `publishedReleaseRef`, `environmentRef`, `releaseHash`, `startedAt`, `completedAt`, `status`, `healthChecks`;
- a `DeploymentObservation.fromDeploymentRecord(record)` factory with validation (reject malformed/unknown records deterministically);
- serialization/JSON round-trip that preserves all fields losslessly;
- explicit proof that no secret/credential/CA value can enter the observation (the `DeploymentRecord` carries references, never resolved values; the observation must preserve that invariant).

# Inputs / contracts

`DeploymentRecord` type from `packages/deploy/index.ts`, ADR-0002 (Observe optional), ADR-0003 (Observe is an independent replaceable module), ADR-0007 (no value leakage), ADR-0009 (provider-neutral, namespaced artifact semantics), WBS 10.3.3 / 11.1.

# Outputs / contracts

A deterministic, provider-neutral `DeploymentObservation` contract in `packages/observe`. No canonical `DeploymentRecord` schema/identity change. No new ADR. No external dependency.

# Acceptance criteria

- `packages/observe/index.ts` exports `DeploymentObservation` and a `fromDeploymentRecord` factory;
- observation preserves every `DeploymentRecord` correlation field losslessly and is content-addressed deterministically;
- validation rejects malformed records deterministically;
- JSON round-trip is lossless;
- no resolved secret/credential/CA value can appear in an observation;
- product test proves positive derivation and negative rejection cases;
- declared validations pass.

# Non-goals

Changing the canonical `DeploymentRecord` schema/identity, publishing/emitting (TASK-135), E2E integration (TASK-136), telemetry/metrics/traces ingestion (WBS 11.1 beyond the deployment observation), canonical contract changes, external dependencies, CI/tooling changes.

# Evidence expected

`packages/observe/index.ts` and `tests/product/observe-observation-contract.test.ts`, plus GitHub Deterministic CI.

# Implementation evidence

To be implemented on `sprint/P11-OBSERVE-DEPLOYMENT-OBSERVATION-01` as the first TASK. CI validation required before Sprint Review.

# Escalation

Stop if implementation requires changing the canonical `DeploymentRecord` schema/identity, another package boundary, canonical contracts, or any L3/L4 boundary without escalation.