---
id: TASK-146
title: Prove operational metadata negative and fail-open paths with product tests
status: verification
priority: 468
milestone: M11
model_tier: cheap
risk: low
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-145
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
  - packages/observe/publish.ts
  - specs/tasks/TASK-139-P11-OBSERVE-OPERATIONAL-VALIDATION.md
  - specs/tasks/TASK-143-P11-OBSERVE-OPERATIONAL-FAILOPEN.md
  - specs/tasks/TASK-145-P11-OBSERVE-OPERATIONAL-POSITIVE-TEST.md
  - specs/tasks/TASK-146-P11-OBSERVE-OPERATIONAL-NEGATIVE-TEST.md
allowed_paths:
  - packages/observe/index.ts
  - packages/observe/metadata.ts
  - packages/observe/publish.ts
  - tests/product/observe-operational-negative.test.ts
  - specs/tasks/TASK-146-P11-OBSERVE-OPERATIONAL-NEGATIVE-TEST.md
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
max_files: 5
validation:
  - npm run test:product
  - npm run verify
---

# Objective

Add a dedicated product test suite proving the **negative and fail-open operational-metadata paths**: malformed/unknown/conflicting metadata is rejected deterministically, value leakage never surfaces, and publication stays fail-open (not-configured/channel-failed/metadata-failure) so Deploy and Runtime continuity are never broken (ADR-0002/0007).

# Context

TASK-139/143 proved these behaviors unit-wise; the product suite must prove them together against the real modules: validation rejects, enrichment is additive, publication is fail-open, and no diagnostic echoes a secret/credential/CA value.

# Current behavior

Unit tests cover individual validation/fail-open cases; no product suite proves the combined negative + fail-open matrix on the real path.

# Required change

Add `tests/product/observe-operational-negative.test.ts` proving the negative matrix:

- malformed/unknown/conflicting operational metadata is rejected deterministically (validation TASK-139);
- a resolved secret/credential/CA value in metadata is rejected and never echoed (TASK-138/144);
- enrichment with invalid metadata fails safe: either deterministic rejection or unchanged base observation, never a corrupt payload;
- publication fail-open matrix: not-configured, channel-failed (async and sync throw), metadata-production failure — Deploy/Runtime unchanged (TASK-143);
- diagnostics are stable, deterministic, reference-free.

# Inputs / contracts

Operational metadata contract + validation (TASK-137/139), derivation (TASK-138), enrichment (TASK-142), fail-open publish (TASK-143), no-leak (TASK-144), ADR-0002/0007.

# Outputs / contracts

Negative + fail-open product proof for operational metadata. No canonical `DeploymentRecord` change. No new ADR.

# Acceptance criteria

- malformed/unknown/conflicting metadata rejected deterministically;
- value leakage rejected and never echoed;
- enrichment invalid-metadata behavior is fail-safe;
- fail-open publication matrix proven (not-configured, channel-failed, metadata-failure);
- Deploy/Runtime continuity preserved in every case;
- product tests pass;
- declared validations pass.

# Non-goals

Integrated E2E with Runtime autonomy (TASK-147), growing package proof (TASK-148), canonical contract changes, external dependencies.

# Evidence expected

`tests/product/observe-operational-negative.test.ts` plus GitHub Deterministic CI.

# Implementation evidence

Implemented on `sprint/P11-OBSERVE-OPERATIONAL-METADATA-01` as the ninth TASK of Sprint 2: `tests/product/observe-operational-negative.test.ts` proves the combined negative + fail-open matrix on the real path — malformed/unknown/conflicting metadata rejected deterministically (MALFORMED/UNSUPPORTED_SOURCE/UNSUPPORTED_MODE/UNKNOWN_FIELD/OPERATION_ID/NOT_OBJECT), resolved value rejected and never echoed, enrichment fail-safe, and the fail-open publication matrix (not-configured, channel-failed async + sync throw, metadata-production failure) with stable deterministic reference-free diagnostics. Local: lint PASS, typecheck PASS, suite 8/8 PASS, `npm run test:product` core 177 tests/176 pass/0 fail. CI validation required before Sprint Review.

# Escalation

Stop if implementation requires changing the canonical `DeploymentRecord` schema/identity, another package boundary, canonical contracts, or any L3/L4 boundary without escalation.