---
id: TASK-157
title: Prove positive findings path end to end
status: ready
priority: 479
milestone: M11
model_tier: cheap
risk: low
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-156
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
  - specs/tasks/TASK-156-P11-OBSERVE-FINDINGS-NOLEAK.md
  - specs/tasks/TASK-157-P11-OBSERVE-FINDINGS-POSITIVE-TEST.md
allowed_paths:
  - packages/observe/findings.ts
  - tests/product/observe-findings-positive.test.ts
  - specs/tasks/TASK-157-P11-OBSERVE-FINDINGS-POSITIVE-TEST.md
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

Prove the **positive findings path** end to end: derive, validate, serialize, correlate and link findings from a real enriched deployment observation, and publish them to an injected Observe receiver — with the expected severity/confidence, stable deterministic identities and correct correlation refs (WBS 11.1.2 / 11.3.2).

# Context

Findings contract (TASK-149), derivation (TASK-150), validation (TASK-151), serialization (TASK-152), correlation (TASK-153), linkage (TASK-154) and fail-open publication (TASK-155) exist as units. This TASK adds the positive product tests that tie them together with real module APIs (not hand-authored downstream artifacts), following the Sprint 2 positive-test discipline (TASK-145).

# Current behavior

The findings modules exist but the positive integration cases are not yet proven by product tests.

# Required change

Add a product test suite (e.g. `tests/product/observe-findings-positive.test.ts`) that invokes the actual modules:

- build a durable `DeploymentRecord` via the actual Deploy path and derive its `DeploymentObservation` (Sprint 1) and operational metadata (Sprint 2);
- derive findings (TASK-150) from a failed deployment and a succeeded deployment with failed health checks;
- assert severity/confidence mapping, deterministic `findingId`, correlation (TASK-153) and linkage (TASK-154) refs are correct;
- assert `toJson`/`fromJson` (TASK-152) round-trips losslessly;
- publish via `publishFindings` (TASK-155) to an injected receiver and assert delivery with the expected documents;
- assert no resolved secret/CA value appears in any emitted artifact.

# Inputs / contracts

All findings modules (TASK-149..155), Deploy + Observe observation/metadata modules, ADR-0002/0007/0009, WBS 11.1.2 / 11.3.2.

# Outputs / contracts

Positive product tests for the findings path. No canonical contract change. No new ADR.

# Acceptance criteria

- positive derivation/correlation/linkage/publish cases pass with the expected severity/confidence and identities;
- JSON round-trip is lossless;
- no resolved value appears in emitted artifacts;
- product tests pass;
- declared validations pass.

# Non-goals

Changing the canonical `DeploymentRecord` schema/identity or the Sprint 1/2 identities, negative/fail-open cases (TASK-158), integrated E2E (TASK-159), external dependencies, CI/tooling changes.

# Evidence expected

`tests/product/observe-findings-positive.test.ts`, plus GitHub Deterministic CI.

# Implementation evidence

To be implemented on `sprint/P11-OBSERVE-INTEGRATION-E2E-01` as the ninth TASK of Sprint 3. CI validation required before Sprint Review.

# Escalation

Stop if implementation requires changing the canonical `DeploymentRecord` schema/identity, another package boundary, canonical contracts, or any L3/L4 boundary without escalation.