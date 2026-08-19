---
id: TASK-149
title: Define the provider-neutral DeploymentFinding contract
status: ready
priority: 471
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
  - packages/observe/publish.ts
  - specs/tasks/TASK-149-P11-OBSERVE-FINDINGS-CONTRACT.md
allowed_paths:
  - packages/observe/findings.ts
  - packages/observe/index.ts
  - tests/product/observe-findings-contract.test.ts
  - specs/tasks/TASK-149-P11-OBSERVE-FINDINGS-CONTRACT.md
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
  - npm run check:tasks
  - npm run verify
---

# Objective

Define a provider-neutral `DeploymentFinding` contract in `packages/observe` that expresses an **alert/finding with context and confidence** (WBS 11.3.2) derived from a deployment observation: a deterministic severity/level, a confidence, a diagnostic code, a non-value message and correlation refs back to the deployment/release/environment/runtime context. The finding is deterministic, provider-neutral and carries references only (never resolved secret/credential/CA values, ADR-0007).

# Context

Sprint 1 (`P11-OBSERVE-DEPLOYMENT-OBSERVATION-01`, merged at `fd05da2`) established `DeploymentObservation`; Sprint 2 (`P11-OBSERVE-OPERATIONAL-METADATA-01`, merged at `1830705`) added `DeploymentOperationMetadata` and enrichment, closing `TD-P4-08`. The remaining Observe gap for this package is the **integration E2E and findings linkage**: WBS 11.1.2 requires correlating telemetry with deployment/release/runtime context (largely proven), and WBS 11.3.2 requires generating **alerts/findings with context and confidence**. Observe (SB-11, ADR-0003) must remain optional to the autonomous Runtime (ADR-0002).

# Current behavior

`packages/observe` exports `DeploymentObservation`, `EnrichedDeploymentObservation`, `enrichObservation` (Sprint 2), the operational-metadata path (`metadata.ts`) and the fail-open `publish`/`publishEnriched` (Sprint 1/2). There is no findings/alert concept: observations carry deployment correlation and operational metadata but no derived alert, severity, confidence or diagnostic code.

# Required change

Add a provider-neutral `DeploymentFinding` contract in `packages/observe` (e.g. `packages/observe/findings.ts`), exported from `index.ts`:

- `kind: "DeploymentFinding"` (or an equivalent namespaced type marker);
- deterministic content-addressed `findingId` derived from the correlated payload;
- severity/level (e.g. `"info" | "warning" | "critical"` or an equivalent stable enum);
- confidence (e.g. `"low" | "medium" | "high"` or an equivalent stable enum);
- deterministic diagnostic code (e.g. `OBSERVE_FINDING:*`) and a non-value, provider-neutral message;
- correlation refs to the source observation and the deployment/release/environment/runtime context (e.g. `observationId`, `deploymentId`, `publishedReleaseRef`, `environmentRef`, `releaseHash`, optional `operationId`/`runtimeRef`/`processRef`/`sessionRef`) that TASK-153 will correlate and TASK-154 will link;
- explicit invariant: the finding carries references and a message only, never a resolved secret/credential/CA value (enforced at validation, TASK-151).

The type must be additive and must not alter the canonical `DeploymentRecord` schema/identity, the Sprint 1 observation identity or the Sprint 2 operational-metadata identity.

# Inputs / contracts

`EnrichedDeploymentObservation`/`DeploymentObservation` and the Sprint 2 metadata from `packages/observe/index.ts` + `metadata.ts`; ADR-0002 (Observe optional), ADR-0007 (no value leakage), ADR-0009 (provider-neutral, references, not storage/provider locators); WBS 11.1.2 / 11.3.1 / 11.3.2.

# Outputs / contracts

A deterministic, provider-neutral `DeploymentFinding` contract in `packages/observe`. No canonical `DeploymentRecord` change. No new ADR. No external dependency.

# Acceptance criteria

- `packages/observe` exports `DeploymentFinding` with severity, confidence, diagnostic code, message and correlation refs;
- identity is deterministic and content-addressed;
- the contract carries references only (no secret/credential/CA value can be expressed);
- positive derivation and negative rejection cases are covered by product tests;
- declared validations pass.

# Non-goals

Changing the canonical `DeploymentRecord` schema/identity or the Sprint 1/2 observation/metadata identities, derivation from observations (TASK-150), validation (TASK-151), serialization (TASK-152), correlation (TASK-153), linkage (TASK-154), publication fail-open (TASK-155), no-leak proof (TASK-156), baselines/thresholds beyond initially simple rules (WBS 11.3.1), telemetry/metrics/traces ingestion, external dependencies, CI/tooling changes.

# Evidence expected

`packages/observe/findings.ts` + `tests/product/observe-findings-contract.test.ts`, plus GitHub Deterministic CI.

# Implementation evidence

To be implemented on `sprint/P11-OBSERVE-INTEGRATION-E2E-01` as the first TASK of Sprint 3. CI validation required before Sprint Review.

# Escalation

Stop if implementation requires changing the canonical `DeploymentRecord` schema/identity, another package boundary, canonical contracts, or any L3/L4 boundary without escalation.