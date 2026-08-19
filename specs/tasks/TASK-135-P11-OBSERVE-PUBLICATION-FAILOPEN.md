---
id: TASK-135
title: Publish observations through a fail-open Observe/operations channel
status: verification
priority: 457
milestone: M11
model_tier: cheap
risk: high
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-134
context_paths:
  - AGENTS.md
  - docs/current/PROJECT_STATE.md
  - docs/current/CURRENT_MILESTONE.md
  - project_docs/schedule/SPRINT_MODE.md
  - project_docs/execution_planning/P11-PACKAGE-01.md
  - project_docs/execution_planning/P11-OBSERVE-DEPLOYMENT-OBSERVATION-01.md
  - project_docs/10-deploy/WBS.md
  - project_docs/11-observe/WBS.md
  - docs/adr/ADR-0002-autonomous-runtime.md
  - docs/adr/ADR-0003-open-modular-suite.md
  - docs/adr/ADR-0007-release-environment-deployment.md
  - docs/adr/ADR-0009-public-artifact-envelope.md
  - docs/architecture/MASTER_BLUEPRINT.md
  - docs/architecture/PIPELINE_AND_CONTRACTS.md
  - packages/observe/index.ts
  - packages/deploy/index.ts
  - specs/tasks/TASK-134-P11-OBSERVE-DEPLOYMENT-OBSERVATION-CONTRACT.md
  - specs/tasks/TASK-135-P11-OBSERVE-PUBLICATION-FAILOPEN.md
allowed_paths:
  - packages/observe/publish.ts
  - packages/observe/index.ts
  - tests/product/observe-publication-failopen.test.ts
  - specs/tasks/TASK-135-P11-OBSERVE-PUBLICATION-FAILOPEN.md
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

Add a **fail-open** publication path that emits `DeploymentObservation`s to Observe/operations when configured, and proves that Deploy and the autonomous Runtime continue unchanged when Observe is unavailable or not configured (ADR-0002).

# Context

`TASK-134` defines the provider-neutral `DeploymentObservation`. `TD-P7-03` requires the actual publication to Observe/operations (WBS 10.3.3). ADR-0002 states "Telemetry may flow to Builder/Observe, but runtime cannot require Observe availability." ADR-0007 forbids resolved secret values in durable evidence. The pipeline contract map declares `Deploy -> ArtifactEnvelope<DeploymentRecord> -> Observe/operations`.

# Current behavior

No publication path exists. The `DeploymentObservation` from TASK-134 is a pure contract with no emission mechanism.

# Required change

Add `packages/observe/publish.ts` with an injectable, provider-neutral publication function:

- a `PublishObserver`/`publish` boundary with an injected channel (callback/receiver) so no provider SDK is required (ADR-0009 provider independence);
- **fail-open** semantics: when no channel is configured, publish returns a deterministic `not-configured` result and Deploy/Runtime behavior is unchanged; when the channel is unavailable/throws, publish records the failure (deterministic diagnostic) and does not propagate it as a Deploy/Runtime failure;
- emission carries the deterministic `DeploymentObservation` (from TASK-134) and never any resolved secret/credential/CA value;
- positive, negative and fail-open cases proven with tests.

# Inputs / contracts

`DeploymentObservation` from TASK-134, ADR-0002 fail-open/optionality, ADR-0007 no-value-leakage, ADR-0009 provider-neutral injectable channel, WBS 10.3.3.

# Outputs / contracts

A fail-open, provider-neutral publication boundary in `packages/observe/publish.ts`. No canonical `DeploymentRecord` change. No new ADR. No external dependency.

# Acceptance criteria

- publish returns a deterministic result when no channel is configured, without affecting Deploy/Runtime;
- publish does not propagate channel failure to Deploy/Runtime (fail-open), recording a deterministic diagnostic instead;
- when a channel is provided, the emitted payload is the deterministic `DeploymentObservation` and contains no resolved secret/credential/CA value;
- positive, negative and fail-open cases are tested;
- Runtime autonomy (Observe unavailable) preserved;
- declared validations pass.

# Non-goals

E2E integration (TASK-136), telemetry/metrics/traces ingestion, canonical `DeploymentRecord` change, external provider SDKs, CI/tooling changes.

# Evidence expected

`packages/observe/publish.ts` and `tests/product/observe-publication-failopen.test.ts`, plus GitHub Deterministic CI.

# Implementation evidence

To be implemented on `sprint/P11-OBSERVE-DEPLOYMENT-OBSERVATION-01` after TASK-134. CI validation required before Sprint Review.

# Escalation

Stop if implementation requires changing the canonical `DeploymentRecord` schema/identity, another package boundary, canonical contracts, or any L3/L4 boundary without escalation. Stop before adding an external provider SDK or a `.github/**` / `tooling/**` change.