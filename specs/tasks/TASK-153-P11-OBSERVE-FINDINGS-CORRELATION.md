---
id: TASK-153
title: Correlate DeploymentFinding with release/environment/runtime context
status: verification
priority: 475
milestone: M11
model_tier: cheap
risk: medium
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-152
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
  - specs/tasks/TASK-152-P11-OBSERVE-FINDINGS-SERIALIZATION.md
  - specs/tasks/TASK-153-P11-OBSERVE-FINDINGS-CORRELATION.md
allowed_paths:
  - packages/observe/findings.ts
  - tests/product/observe-findings-correlation.test.ts
  - specs/tasks/TASK-153-P11-OBSERVE-FINDINGS-CORRELATION.md
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

Correlate `DeploymentFinding` instances with the **release/environment/runtime context** (WBS 11.1.2) provider-neutrally and deterministically, producing a correlation document that links the finding to its deployment, observation and (when available) runtime/process/session refs — following the Sprint 2 `correlateOperation` -> `DeploymentOperationCorrelation` pattern.

# Context

The `DeploymentFinding` contract (TASK-149) already carries correlation refs (`observationId`, `deploymentId`, `publishedReleaseRef`, `environmentRef`, `releaseHash`, optional operation/runtime/process/session refs). WBS 11.1.2 requires telemetry to be correlated with deployment/release/runtime context. The Sprint 2 `metadata.ts` established the correlation-document pattern (`DeploymentOperationCorrelation` with content-addressed `correlationId`).

# Current behavior

Findings carry refs but there is no dedicated correlation document: no deterministic `correlationId`, no runtime/process/session resolution, no rejection of missing deployment correlation.

# Required change

Add deterministic correlation (e.g. `correlateFinding(finding, runtime?)` -> `DeploymentFindingCorrelation`) in `packages/observe/findings.ts`:

- the correlation document carries `kind`, a content-addressed `correlationId`, the finding refs and optional runtime/process/session refs;
- requires the deployment correlation to be present (`CORRELATION_REQUIRES_DEPLOYMENT` otherwise);
- rejects resolved-value leakage in any runtime/process/session ref (`RESOLVED_VALUE:<field>`);
- must not alter the `DeploymentFinding` identity or the canonical `DeploymentRecord`.

# Inputs / contracts

`DeploymentFinding` (TASK-149), validation (TASK-151), `correlateOperation` pattern (metadata.ts), ADR-0002/0007/0009, WBS 11.1.2 / 11.3.2.

# Outputs / contracts

Deterministic `DeploymentFindingCorrelation` (or equivalent) in `packages/observe/findings.ts`. No canonical contract change. No new ADR.

# Acceptance criteria

- findings correlate deterministically to release/environment/runtime context;
- correlation requires deployment correlation and rejects resolved values;
- correlation identity is content-addressed and stable;
- positive and negative cases are covered by product tests;
- declared validations pass.

# Non-goals

Changing the canonical `DeploymentRecord` schema/identity or the Sprint 1/2 identities, linkage to evidence (TASK-154), publication fail-open (TASK-155), sophisticated correlation algorithms, external dependencies, CI/tooling changes.

# Evidence expected

`packages/observe/findings.ts` + `tests/product/observe-findings-correlation.test.ts`, plus GitHub Deterministic CI.

# Implementation evidence

Implemented on `sprint/P11-OBSERVE-INTEGRATION-E2E-01` as the fifth TASK of Sprint 3: `packages/observe/findings.ts` exports `DeploymentFindingCorrelation` and `correlateFinding(finding, runtime?)`, producing a deterministic content-addressed `correlationId` that binds the finding to its observation/deployment/release/environment/hash refs and optional operation/runtime/process/session refs (from the finding, overridable by the runtime argument), requiring the deployment correlation (`CORRELATION_REQUIRES_DEPLOYMENT`) and rejecting resolved-value leakage in any runtime/process/session ref (`RESOLVED_VALUE:<field>`), without altering the `DeploymentFinding` identity or the canonical `DeploymentRecord`. `tests/product/observe-findings-correlation.test.ts` proves 8 cases (deterministic context binding, runtime/process/session refs, enriched ref reuse, determinism, content-addressing, deployment-correlation requirement, resolved-value rejection, no-value-leak). Local validations pending before commit.

# Escalation

Stop if implementation requires changing the canonical `DeploymentRecord` schema/identity, another package boundary, canonical contracts, or any L3/L4 boundary without escalation.