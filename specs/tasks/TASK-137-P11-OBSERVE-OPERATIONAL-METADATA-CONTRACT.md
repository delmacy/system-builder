---
id: TASK-137
title: Define the provider-neutral DeploymentOperationMetadata contract
status: verification
priority: 459
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
  - project_docs/execution_planning/P11-OBSERVE-OPERATIONAL-METADATA-01.md
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
  - specs/tasks/TASK-137-P11-OBSERVE-OPERATIONAL-METADATA-CONTRACT.md
allowed_paths:
  - packages/observe/index.ts
  - packages/observe/metadata.ts
  - tests/product/observe-operational-metadata-contract.test.ts
  - specs/tasks/TASK-137-P11-OBSERVE-OPERATIONAL-METADATA-CONTRACT.md
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

Define a provider-neutral `DeploymentOperationMetadata` contract in `packages/observe` that describes **who/what executed a deployment and from which source/mode** — the operational half of WBS 10.3.1 (`Registrar release, ambiente, timestamps e executor`) — ready to be correlated to release/environment/runtime context and attached to a `DeploymentObservation`. The metadata is deterministic, provider-neutral, and carries only references (never resolved secret/credential/CA values, ADR-0007).

# Context

Sprint 1 (`P11-OBSERVE-DEPLOYMENT-OBSERVATION-01`, merged at `fd05da2`) established `DeploymentObservation` from the durable `DeploymentRecord`, closing `TD-P7-03` and partially `TD-P4-08`. The remaining `TD-P4-08` gap is the **executor/source operational metadata**: the `DeploymentRecord` records release, environment and timestamps but not who/what initiated the deployment or the operational context (mode, trigger, runtime/process/session correlation). WBS 10.3.1 requires registering the executor; WBS 11.1.2 requires correlating telemetry with deployment/release/runtime.

# Current behavior

`packages/observe` exports `DeploymentObservation` and the fail-open `publish`. There is no operational-metadata concept: the observation carries deployment correlation only (deploymentId, publishedReleaseRef, environmentRef, releaseHash, startedAt, completedAt, status, healthChecks).

# Required change

Add a provider-neutral `DeploymentOperationMetadata` contract in `packages/observe` (e.g. `packages/observe/metadata.ts`), exported from `index.ts`:

- `kind: "DeploymentOperationMetadata"` (or an equivalent namespaced type marker);
- executor identity: provider-neutral identifier/reference for who/what performed the deployment (e.g. `executorRef`, a symbolic reference — never a resolved secret/credential);
- source/trigger: e.g. `source` (`"manual" | "automation" | "pipeline" | "api"` or an equivalent stable enum) plus an optional source reference;
- operation mode: e.g. `mode` (`"dry-run" | "execute"` or the existing Deploy mode vocabulary) and optional `triggeredAt`;
- correlation refs: optional provider-neutral references to runtime/process/session context (e.g. `runtimeRef`, `processRef`, `sessionRef`) that Sprint 2 will correlate (TASK-141);
- a deterministic content-addressed identity (`operationId`) derived from the correlated payload;
- explicit invariant: the metadata carries references only, never resolved secret/credential/CA values (enforced at derivation, TASK-138, and validated at TASK-139).

The type must be additive and must not alter the canonical `DeploymentRecord` schema/identity.

# Inputs / contracts

`DeploymentObservation` and the fail-open publish from Sprint 1 (`packages/observe/index.ts`, `publish.ts`); `DeploymentRecord` correlation fields; ADR-0002 (Observe optional), ADR-0007 (no value leakage), ADR-0009 (provider-neutral, references, not storage/provider locators); WBS 10.3.1 / 11.1.2.

# Outputs / contracts

A deterministic, provider-neutral `DeploymentOperationMetadata` contract in `packages/observe`. No canonical `DeploymentRecord` change. No new ADR. No external dependency.

# Acceptance criteria

- `packages/observe` exports `DeploymentOperationMetadata` with executor, source/trigger, mode and optional correlation refs;
- identity is deterministic and content-addressed;
- the contract carries references only (no secret/credential/CA value can be expressed);
- positive derivation and negative rejection cases are covered by product tests;
- declared validations pass.

# Non-goals

Changing the canonical `DeploymentRecord` schema/identity, derivation from execution context (TASK-138), validation (TASK-139), serialization (TASK-140), correlation (TASK-141), enrichment of `DeploymentObservation` (TASK-142), publication fail-open (TASK-143), no-leak proof (TASK-144), telemetry ingestion beyond deployment observations, external dependencies, CI/tooling changes.

# Evidence expected

`packages/observe/metadata.ts` (or equivalent) + `tests/product/observe-operational-metadata-contract.test.ts`, plus GitHub Deterministic CI.

# Implementation evidence

Implemented on `sprint/P11-OBSERVE-OPERATIONAL-METADATA-01` as the first TASK of Sprint 2: `packages/observe/metadata.ts` exports `DeploymentOperationMetadata` (contract + deterministic content-addressed `operationId` via `create`), re-exported from `packages/observe/index.ts`. `tests/product/observe-operational-metadata-contract.test.ts` proves 6 cases (contract shape, determinism, content-addressing, missing-executor rejection, unsupported source/mode rejection, optional correlation refs). Local: lint PASS, typecheck PASS, focused test 6/6 PASS, `npm run test:product` core 118 tests/117 pass/0 fail. CI validation required before Sprint Review.

# Escalation

Stop if implementation requires changing the canonical `DeploymentRecord` schema/identity, another package boundary, canonical contracts, or any L3/L4 boundary without escalation.
