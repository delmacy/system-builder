---
id: TASK-150
title: Derive DeploymentFinding deterministically from an enriched observation
status: verification
priority: 472
milestone: M11
model_tier: cheap
risk: medium
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-149
context_paths:
  - AGENTS.md
  - docs/current/PROJECT_STATE.md
  - docs/current/CURRENT_MILESTONE.md
  - project_docs/schedule/SPRINT_MODE.md
  - project_docs/execution_planning/P11-PACKAGE-01.md
  - project_docs/execution_planning/P11-OBSERVE-INTEGRATION-E2E-01.md
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
  - packages/observe/metadata.ts
  - packages/observe/findings.ts
  - specs/tasks/TASK-149-P11-OBSERVE-FINDINGS-CONTRACT.md
  - specs/tasks/TASK-150-P11-OBSERVE-FINDINGS-DERIVATION.md
allowed_paths:
  - packages/observe/findings.ts
  - tests/product/observe-findings-derivation.test.ts
  - specs/tasks/TASK-150-P11-OBSERVE-FINDINGS-DERIVATION.md
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
  - npm run check:tasks
  - npm run verify
---

# Objective

Derive `DeploymentFinding` instances **deterministically** from an enriched deployment observation using **initially simple baselines/thresholds** (WBS 11.3.1), so that the same observation always produces the same finding set with deterministic severity and confidence (WBS 11.3.2), ready for correlation (TASK-153) and linkage (TASK-154).

# Context

The `DeploymentFinding` contract exists from TASK-149. The derivation input is the enriched observation (`EnrichedDeploymentObservation` from Sprint 2) or the base `DeploymentObservation` when metadata is absent. WBS 11.3.1 requires "baseline/thresholds inicialmente simples"; WBS 11.3.2 requires "alertas/findings com contexto e confiança". The derivation must be provider-neutral, deterministic and value-leak-free (ADR-0002/0007/0009).

# Current behavior

The `DeploymentFinding` contract exists but there is no derivation function: observations carry status and health checks but no derived finding, severity or confidence.

# Required change

Add a deterministic derivation (e.g. `deriveFindings(observation)` returning a `DeploymentFinding` or a small ordered list) in `packages/observe/findings.ts` that maps observable evidence to findings:

- failed deployment status -> critical finding (deterministic code/message/severity);
- failed health check -> warning finding, one per failing check (deterministic);
- succeeded deployment with all health checks PASS -> info/no-op finding only when the baseline declares it (initially simple);
- confidence is derived deterministically from the evidence (e.g. status evidence = high, single health-check evidence = medium);
- every finding carries the source observation correlation refs (observationId/deploymentId/release/environment/releaseHash and optional operation metadata refs) so correlation is a pure derivation of the finding contract;
- the derivation never echoes a resolved secret/credential/CA value and never changes the canonical `DeploymentRecord`, observation or metadata identities.

# Inputs / contracts

`DeploymentFinding` (TASK-149), `EnrichedDeploymentObservation`/`DeploymentObservation` (Sprints 1/2), simple baseline/threshold rules, ADR-0002/0007/0009, WBS 11.3.1/11.3.2.

# Outputs / contracts

Deterministic `deriveFindings` (or equivalent) in `packages/observe/findings.ts`. No canonical contract change. No new ADR.

# Acceptance criteria

- same observation always produces the same finding set (deterministic identity);
- failed status/health-check evidence maps to the declared severity and confidence;
- findings carry the source correlation refs;
- no resolved secret/credential/CA value can be expressed in any derived finding;
- positive and negative derivation cases are covered by product tests;
- declared validations pass.

# Non-goals

Changing the canonical `DeploymentRecord` schema/identity or the Sprint 1/2 identities, validation (TASK-151), serialization (TASK-152), correlation (TASK-153), linkage (TASK-154), publication fail-open (TASK-155), sophisticated thresholds/machine-learning baselines, telemetry ingestion beyond deployment observations, external dependencies, CI/tooling changes.

# Evidence expected

`packages/observe/findings.ts` + `tests/product/observe-findings-derivation.test.ts`, plus GitHub Deterministic CI.

# Implementation evidence

Implemented on `sprint/P11-OBSERVE-INTEGRATION-E2E-01` as the second TASK of Sprint 3: `deriveFindings` in `packages/observe/findings.ts` derives a deterministic ordered `DeploymentFinding` set from a `DeploymentObservation`/`EnrichedDeploymentObservation` source using initially simple rules (failed status -> critical/high `OBSERVE_FINDING:DEPLOYMENT_FAILED`; each failing health check -> warning/medium `OBSERVE_FINDING:HEALTH_CHECK_FAILED`; clean success -> info/high `OBSERVE_FINDING:DEPLOYMENT_SUCCEEDED` only when the baseline declares `emitInfoOnCleanSuccess`), carrying the source correlation refs (observationId/deploymentId/release/environment/releaseHash plus optional operation/runtime/process/session refs) onto every finding, with reference-only enforcement (rejects resolved secret/CA/credential markers) and deterministic fail-closed rejection of malformed sources. `tests/product/observe-findings-derivation.test.ts` proves 12 cases (failed->critical, per-check warnings, determinism, content-addressing, no-op clean success, baseline info finding, correlation refs, enriched operation refs, resolved-value rejection, malformed-source rejection, no-leak serialization, ordering). Local: focused test 12/12 PASS. CI validation required before Sprint Review.

# Escalation

Stop if implementation requires changing the canonical `DeploymentRecord` schema/identity, another package boundary, canonical contracts, or any L3/L4 boundary without escalation.