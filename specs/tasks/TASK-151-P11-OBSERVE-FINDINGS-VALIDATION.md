---
id: TASK-151
title: Validate DeploymentFinding fail-closed with deterministic diagnostics
status: verification
priority: 473
milestone: M11
model_tier: cheap
risk: medium
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-150
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
  - specs/tasks/TASK-151-P11-OBSERVE-FINDINGS-VALIDATION.md
allowed_paths:
  - packages/observe/findings.ts
  - tests/product/observe-findings-validation.test.ts
  - specs/tasks/TASK-151-P11-OBSERVE-FINDINGS-VALIDATION.md
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

Validate `DeploymentFinding` instances **fail-closed with deterministic diagnostics** so that a malformed, unknown or conflicting finding is rejected deterministically, never published as-is and never leaks a resolved value (ADR-0007). Follows the Sprint 2 operational-metadata validation pattern (`DeploymentOperationMetadata.validate`).

# Context

The `DeploymentFinding` contract (TASK-149) and its derivation (TASK-150) exist. Validation is the defensive boundary: any finding that reaches serialization, correlation, linkage or publication must already be canonical. The Sprint 2 `metadata.ts` established the deterministic `OBSERVE_INVALID_OPERATION_METADATA:*` diagnostic convention; findings should follow the same convention (`OBSERVE_INVALID_FINDING:*`).

# Current behavior

No `DeploymentFinding` validation exists: a malformed or value-tainted finding would flow unchecked through derivation, correlation and publication.

# Required change

Add fail-closed validation (e.g. `DeploymentFinding.validate(value)`) in `packages/observe/findings.ts`:

- reject non-object, wrong `kind`, unknown fields (`UNKNOWN_FIELD:<key>`), malformed required fields (`MALFORMED:<field>`), unsupported severity/confidence (`UNSUPPORTED_SEVERITY`/`UNSUPPORTED_CONFIDENCE`), missing/conflicting correlation refs (`MISSING_CORRELATION`/`CONFLICTING_CORRELATION`);
- reject resolved-value leakage markers in any string field (`RESOLVED_VALUE:<field>`) — never echoing the value;
- recompute and verify the deterministic `findingId` (`FINDING_ID`);
- the validation must be deterministic and not depend on wall-clock or environment.

# Inputs / contracts

`DeploymentFinding` (TASK-149), derivation (TASK-150), the `metadata.ts` validation pattern, ADR-0002/0007/0009, WBS 11.3.2.

# Outputs / contracts

Fail-closed `DeploymentFinding.validate` in `packages/observe/findings.ts`. No canonical contract change. No new ADR.

# Acceptance criteria

- malformed/unknown/conflicting findings are rejected with deterministic `OBSERVE_INVALID_FINDING:*` diagnostics;
- `RESOLVED_VALUE:<field>` is detected on any string field without echoing the value;
- `findingId` is verified deterministically;
- positive and negative cases are covered by product tests;
- declared validations pass.

# Non-goals

Changing the canonical `DeploymentRecord` schema/identity or the Sprint 1/2 identities, serialization (TASK-152), correlation (TASK-153), linkage (TASK-154), publication fail-open (TASK-155), external dependencies, CI/tooling changes.

# Evidence expected

`packages/observe/findings.ts` + `tests/product/observe-findings-validation.test.ts`, plus GitHub Deterministic CI.

# Implementation evidence

Implemented and merged with Sprint 3 through PR #223. `DeploymentFinding.validate` now rejects non-object/wrong-kind/unknown/malformed/unsupported/conflicting inputs with deterministic `OBSERVE_INVALID_FINDING:*` diagnostics, verifies the content-addressed `findingId`, and rejects resolved-value markers without echoing the value. `tests/product/observe-findings-validation.test.ts` exercises the validation boundary. Deterministic CI #424 (run `32545758969`) passed on the Sprint Review merge ref, including 309/309 unit tests, 298/298 core product tests, 161 task specs, architecture gates and build.

# Escalation

Stop if implementation requires changing the canonical `DeploymentRecord` schema/identity, another package boundary, canonical contracts, or any L3/L4 boundary without escalation.