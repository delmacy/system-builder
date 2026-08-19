---
id: TASK-139
title: Validate DeploymentOperationMetadata fail-closed with deterministic diagnostics
status: verification
priority: 461
milestone: M11
model_tier: cheap
risk: medium
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-138
context_paths:
  - AGENTS.md
  - docs/current/PROJECT_STATE.md
  - docs/current/CURRENT_MILESTONE.md
  - project_docs/schedule/SPRINT_MODE.md
  - project_docs/execution_planning/P11-PACKAGE-01.md
  - project_docs/execution_planning/P11-OBSERVE-OPERATIONAL-METADATA-01.md
  - project_docs/10-deploy/WBS.md
  - project_docs/11-observe/WBS.md
  - docs/adr/ADR-0002-autonomous-runtime.md
  - docs/adr/ADR-0007-release-environment-deployment.md
  - docs/adr/ADR-0009-public-artifact-envelope.md
  - packages/observe/index.ts
  - packages/observe/metadata.ts
  - specs/tasks/TASK-137-P11-OBSERVE-OPERATIONAL-METADATA-CONTRACT.md
  - specs/tasks/TASK-138-P11-OBSERVE-OPERATIONAL-DERIVATION.md
  - specs/tasks/TASK-139-P11-OBSERVE-OPERATIONAL-VALIDATION.md
allowed_paths:
  - packages/observe/metadata.ts
  - packages/observe/index.ts
  - tests/product/observe-operational-validation.test.ts
  - specs/tasks/TASK-139-P11-OBSERVE-OPERATIONAL-VALIDATION.md
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

Validate `DeploymentOperationMetadata` **fail-closed** with deterministic diagnostics: malformed, unknown, conflicting or value-leaking operational metadata is rejected explicitly (never silently accepted), matching the fail-closed discipline of the Sprint 1 observation contract (`OBSERVE_INVALID_*`).

# Context

TASK-137/138 define the contract and the deterministic factory. Consumers (enrichment TASK-142, publication TASK-143) must be able to trust the metadata shape. WBS 10.3.1/11.1.2 require executor registration and correlation; a malformed or conflicting executor/source must not silently produce a wrong operational record.

# Current behavior

There is no independent validation surface for `DeploymentOperationMetadata` beyond derivation-time value-leakage rejection. Malformed/unknown/conflicting metadata has no deterministic diagnostic contract.

# Required change

Add a validation entry point for `DeploymentOperationMetadata` (e.g. `validateDeploymentOperationMetadata` or a `fromJson`/parse that validates):

- reject unknown fields deterministically (`UNKNOWN_FIELD`), consistent with the Sprint 1 `parseCorrelation` discipline;
- reject missing/empty required fields deterministically (`MALFORMED:<field>`);
- reject unsupported source/trigger/mode enum values deterministically;
- reject conflicting or non-deterministic identity (`OPERATION_ID`) when identity is recomputed;
- reject any resolved secret/credential/CA value (ADR-0007) with a deterministic diagnostic (no value echoed back);
- diagnostics are stable, deterministic and never echo a secret value.

# Inputs / contracts

`DeploymentOperationMetadata` (TASK-137), factory (TASK-138), the Sprint 1 `OBSERVE_INVALID_DEPLOYMENT_RECORD:*` diagnostic style, ADR-0007.

# Outputs / contracts

A fail-closed validation surface with deterministic diagnostics. No canonical `DeploymentRecord` change. No new ADR.

# Acceptance criteria

- malformed/unknown/conflicting metadata is rejected deterministically;
- unsupported enum values are rejected deterministically;
- identity recomputation mismatch is rejected deterministically;
- resolved secret/credential/CA value in metadata is rejected without echoing the value;
- positive metadata passes validation;
- product tests cover positive and negative cases;
- declared validations pass.

# Non-goals

Serialization/round-trip beyond what validation needs (TASK-140), runtime/process/session correlation (TASK-141), enrichment (TASK-142), publication fail-open (TASK-143), full no-leak proof (TASK-144), canonical contract changes, external dependencies.

# Evidence expected

Validation surface in `packages/observe/metadata.ts` + `tests/product/observe-operational-validation.test.ts`, plus GitHub Deterministic CI.

# Implementation evidence

Implemented on `sprint/P11-OBSERVE-OPERATIONAL-METADATA-01` as the third TASK of Sprint 2: `DeploymentOperationMetadata.validate` in `packages/observe/metadata.ts` — fail-closed validation with deterministic diagnostics (`UNKNOWN_FIELD:<key>`, `KIND`, `MALFORMED:<field>`, `UNSUPPORTED_SOURCE/MODE`, `RESOLVED_VALUE:<field>` never echoing the value, `OPERATION_ID` on tampered identity). The metadata document now carries the deployment correlation fields (self-describing), so identity is recomputable. `tests/product/observe-operational-validation.test.ts` proves 7 cases (accept valid, unknown field, wrong kind, tampered identity, unsupported enums, secret without echo, create-only without correlation). Local: lint PASS, typecheck PASS, focused test 7/7 PASS, `npm run test:product` core 132 tests/131 pass/0 fail. CI validation required before Sprint Review.

# Escalation

Stop if implementation requires changing the canonical `DeploymentRecord` schema/identity, another package boundary, canonical contracts, or any L3/L4 boundary without escalation.
