---
id: TASK-141
title: Correlate operational metadata with release/environment/runtime context
status: verification
priority: 463
milestone: M11
model_tier: cheap
risk: medium
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-140
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
  - docs/adr/ADR-0007-release-environment-deployment.md
  - docs/adr/ADR-0009-public-artifact-envelope.md
  - docs/architecture/MASTER_BLUEPRINT.md
  - docs/architecture/PIPELINE_AND_CONTRACTS.md
  - packages/observe/index.ts
  - packages/observe/metadata.ts
  - packages/deploy/index.ts
  - specs/tasks/TASK-137-P11-OBSERVE-OPERATIONAL-METADATA-CONTRACT.md
  - specs/tasks/TASK-140-P11-OBSERVE-OPERATIONAL-SERIALIZATION.md
  - specs/tasks/TASK-141-P11-OBSERVE-OPERATIONAL-CORRELATION.md
allowed_paths:
  - packages/observe/metadata.ts
  - packages/observe/index.ts
  - tests/product/observe-operational-correlation.test.ts
  - specs/tasks/TASK-141-P11-OBSERVE-OPERATIONAL-CORRELATION.md
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

Correlate `DeploymentOperationMetadata` with the **release/environment/runtime context** so an emitted observation can be linked to the exact release, environment and executing runtime/process/session — WBS 11.1.2 (correlate telemetry with deployment/release/runtime) — provider-neutrally and deterministically, without depending on any provider-specific identity.

# Context

The deployment observation already carries `publishedReleaseRef`/`environmentRef`/`releaseHash`. The operational metadata (TASK-137/138) carries executor/source/mode plus optional runtime/process/session refs. This TASK defines the deterministic correlation that binds them into one operational context, closing the `TD-P4-08` operational-metadata remainder (WBS 10.3.1, 11.1.2).

# Current behavior

Operational metadata and observation correlation fields exist but are not bound into a single deterministic correlation contract; runtime/process/session references are optional and uncorrelated.

# Required change

Add a correlation function/type in `packages/observe/metadata.ts` (e.g. `correlateOperation(deployment, operation)` or a `DeploymentOperationCorrelation`):

- binds deployment correlation (deploymentId, publishedReleaseRef, environmentRef, releaseHash) with operational metadata (executor, source, mode, runtime/process/session refs) into one deterministic correlation document;
- derives a deterministic correlation identity (content-addressed);
- validates that provided runtime/process/session refs are provider-neutral references (ADR-0009), never provider-specific identifiers required for operation;
- is additive and fail-safe: absence of runtime/process/session refs still yields a valid correlation.

# Inputs / contracts

`DeploymentObservation` (Sprint 1), `DeploymentOperationMetadata` (TASK-137), factory (TASK-138), validation (TASK-139), ADR-0002/0007/0009, WBS 11.1.2.

# Outputs / contracts

A deterministic correlation contract binding observation + operational metadata into one operational context. No canonical `DeploymentRecord` change. No new ADR.

# Acceptance criteria

- correlation binds deployment + operational metadata deterministically;
- correlation identity is content-addressed and stable;
- runtime/process/session refs are optional and provider-neutral (never required for operation);
- no resolved secret/credential/CA value in the correlation document;
- product tests cover positive and fail-safe (absent refs) cases;
- declared validations pass.

# Non-goals

Enrichment of the observation document (TASK-142), publication fail-open (TASK-143), no-leak proof (TASK-144), integrated E2E (TASK-147), canonical contract changes, external dependencies, telemetry ingestion beyond deployment observations.

# Evidence expected

Correlation function/type in `packages/observe/metadata.ts` + `tests/product/observe-operational-correlation.test.ts`, plus GitHub Deterministic CI.

# Implementation evidence

Implemented on `sprint/P11-OBSERVE-OPERATIONAL-METADATA-01` as the fifth TASK of Sprint 2: `correlateOperation` in `packages/observe/metadata.ts` producing `DeploymentOperationCorrelation` (content-addressed `correlationId` over deployment + operation + optional runtime/process/session refs), exported from `packages/observe/index.ts`. Fail-safe when runtime refs are absent; rejects metadata without deployment correlation (`CORRELATION_REQUIRES_DEPLOYMENT`) and resolved secret values (`RESOLVED_VALUE:<field>`). `tests/product/observe-operational-correlation.test.ts` proves 7 cases (binding, provider-neutral refs, determinism, content-addressing, fail-safe absence, resolved-value rejection, missing-correlation rejection). Local: lint PASS, typecheck PASS, focused test 7/7 PASS, `npm run test:product` core 146 tests/145 pass/0 fail. CI validation required before Sprint Review.

# Escalation

Stop if implementation requires changing the canonical `DeploymentRecord` schema/identity, another package boundary, canonical contracts, or any L3/L4 boundary without escalation.
