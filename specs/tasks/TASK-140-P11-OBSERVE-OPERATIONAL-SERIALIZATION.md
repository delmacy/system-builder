---
id: TASK-140
title: Lossless JSON serialization round-trip for DeploymentOperationMetadata
status: verification
priority: 462
milestone: M11
model_tier: cheap
risk: low
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-139
context_paths:
  - AGENTS.md
  - docs/current/PROJECT_STATE.md
  - docs/current/CURRENT_MILESTONE.md
  - project_docs/schedule/SPRINT_MODE.md
  - project_docs/execution_planning/P11-PACKAGE-01.md
  - project_docs/execution_planning/P11-OBSERVE-OPERATIONAL-METADATA-01.md
  - docs/adr/ADR-0007-release-environment-deployment.md
  - docs/adr/ADR-0009-public-artifact-envelope.md
  - docs/architecture/PIPELINE_AND_CONTRACTS.md
  - packages/observe/index.ts
  - packages/observe/metadata.ts
  - specs/tasks/TASK-137-P11-OBSERVE-OPERATIONAL-METADATA-CONTRACT.md
  - specs/tasks/TASK-139-P11-OBSERVE-OPERATIONAL-VALIDATION.md
  - specs/tasks/TASK-140-P11-OBSERVE-OPERATIONAL-SERIALIZATION.md
allowed_paths:
  - packages/observe/metadata.ts
  - packages/observe/index.ts
  - tests/product/observe-operational-serialization.test.ts
  - specs/tasks/TASK-140-P11-OBSERVE-OPERATIONAL-SERIALIZATION.md
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

Provide a **lossless JSON round-trip** for `DeploymentOperationMetadata`: serializing and re-parsing must preserve every field and the deterministic `operationId` exactly (ADR-0009 interchange discipline), and reject tampered/non-matching documents deterministically.

# Context

Operational metadata must survive transport to Observe/operations (WBS 10.3.3/11.1.2). ADR-0009 requires portable, deterministic interchange; the Sprint 1 observation already implements `toJson`/`fromJson` with identity verification. Operational metadata must match that discipline so enrichment (TASK-142) can round-trip the full observation.

# Current behavior

`DeploymentOperationMetadata` has a contract and validation but no serialization surface.

# Required change

Add `DeploymentOperationMetadata.toJson`/`fromJson` (or equivalent) in `packages/observe/metadata.ts`:

- `toJson` serializes deterministically (stable field order);
- `fromJson` parses, validates (reusing TASK-139), recomputes the `operationId` and rejects a mismatched identity deterministically (`OPERATION_ID`);
- round-trip `fromJson(toJson(metadata))` reproduces identical metadata including identity;
- tampered or non-canonical documents are rejected deterministically without echoing secret-like values.

# Inputs / contracts

`DeploymentOperationMetadata` (TASK-137), validation (TASK-139), ADR-0009 interchange discipline, Sprint 1 `DeploymentObservation.toJson/fromJson` pattern.

# Outputs / contracts

Lossless deterministic serialization/deserialization for operational metadata. No canonical `DeploymentRecord` change. No new ADR.

# Acceptance criteria

- `toJson` is deterministic (stable ordering);
- `fromJson` validates and rejects tampered identity deterministically;
- round-trip preserves every field and the `operationId`;
- product tests prove round-trip, determinism and tamper rejection;
- declared validations pass.

# Non-goals

Runtime/process/session correlation (TASK-141), enrichment (TASK-142), publication fail-open (TASK-143), no-leak proof (TASK-144), integrated E2E (TASK-147), canonical contract changes, external dependencies.

# Evidence expected

Serialization surface in `packages/observe/metadata.ts` + `tests/product/observe-operational-serialization.test.ts`, plus GitHub Deterministic CI.

# Implementation evidence

Implemented on `sprint/P11-OBSERVE-OPERATIONAL-METADATA-01` as the fourth TASK of Sprint 2: `DeploymentOperationMetadata.toJson`/`fromJson` in `packages/observe/metadata.ts` — deterministic serialization, lossless round-trip, `fromJson` validates via `validate` and rejects malformed JSON (`JSON`), tampered identity or tampered fields (`OPERATION_ID`). `tests/product/observe-operational-serialization.test.ts` proves 7 cases (lossless round-trip with identity, deterministic serialization, every correlation field preserved, malformed JSON, tampered identity, tampered field, create-only round-trip). Local: lint PASS, typecheck PASS, focused test 7/7 PASS, `npm run test:product` core 139 tests/138 pass/0 fail. CI validation required before Sprint Review.

# Escalation

Stop if implementation requires changing the canonical `DeploymentRecord` schema/identity, another package boundary, canonical contracts, or any L3/L4 boundary without escalation.
