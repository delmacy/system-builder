---
id: TASK-145
title: Prove operational metadata positive path with product tests
status: ready
priority: 467
milestone: M11
model_tier: cheap
risk: low
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-144
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
  - specs/tasks/TASK-137-P11-OBSERVE-OPERATIONAL-METADATA-CONTRACT.md
  - specs/tasks/TASK-144-P11-OBSERVE-OPERATIONAL-NOLEAK.md
  - specs/tasks/TASK-145-P11-OBSERVE-OPERATIONAL-POSITIVE-TEST.md
allowed_paths:
  - packages/observe/index.ts
  - packages/observe/metadata.ts
  - packages/observe/publish.ts
  - tests/product/observe-operational-positive.test.ts
  - specs/tasks/TASK-145-P11-OBSERVE-OPERATIONAL-POSITIVE-TEST.md
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

Add a dedicated product test suite proving the **positive operational-metadata path** end to end within `packages/observe`: a real `DeploymentRecord` from the Deploy slice becomes a `DeploymentObservation`, is correlated and enriched with valid operational metadata (executor/source/mode/runtime correlation), and is published to an injected Observe receiver with the correct deterministic identity and correlation — closing the `TD-P4-08` operational-metadata remainder (WBS 10.3.1/11.1.2).

# Context

TASK-137..144 built the operational-metadata contract, derivation, validation, serialization, correlation, enrichment, fail-open and no-leak proof. This TASK assembles the positive integrated product proof: valid operational metadata flows from the real Deploy `DeploymentRecord` through observe to a receiver, with stable identity and correct correlation.

# Current behavior

Operational metadata is proven unit-wise; no positive product suite drives the real Deploy `DeploymentRecord` through the full observe enrichment + publish chain.

# Required change

Add `tests/product/observe-operational-positive.test.ts` proving the positive path:

- derive a durable `DeploymentRecord` through the real Deploy path (e.g. `dryRunDeploy`/`DeploymentRegistry`);
- derive its `DeploymentObservation` (Sprint 1) and enrich it with valid operational metadata;
- publish to an injected Observe receiver and assert the receiver got the enriched observation with the correct correlation (release/environment/status/health) and operational context (executor/source/mode);
- assert deterministic identity stability for equal inputs;
- assert no resolved secret/credential/CA value is present.

# Inputs / contracts

`DeploymentRecord`/Deploy modules, `DeploymentObservation` (Sprint 1), operational metadata + enrichment + publish (TASK-137..143), ADR-0002/0007.

# Outputs / contracts

Positive integrated product proof for operational metadata. No canonical `DeploymentRecord` change. No new ADR.

# Acceptance criteria

- real `DeploymentRecord` -> observation -> enriched -> published to receiver is proven;
- correlation fields and operational context match the source;
- deterministic identity is stable;
- no resolved secret/credential/CA value appears;
- product tests pass;
- declared validations pass.

# Non-goals

Negative/fail-open product suite (TASK-146), integrated E2E with Runtime autonomy (TASK-147), growing package proof (TASK-148), canonical contract changes, external dependencies.

# Evidence expected

`tests/product/observe-operational-positive.test.ts` plus GitHub Deterministic CI.

# Implementation evidence

To be implemented on `sprint/P11-OBSERVE-OPERATIONAL-METADATA-01` as the ninth TASK. CI validation required before Sprint Review.

# Escalation

Stop if implementation requires changing the canonical `DeploymentRecord` schema/identity, another package boundary, canonical contracts, or any L3/L4 boundary without escalation.