---
id: TASK-147
title: Prove operational metadata integrated E2E with Runtime autonomy
status: verification
priority: 469
milestone: M11
model_tier: cheap
risk: high
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-146
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
  - docs/architecture/PIPELINE_AND_CONTRACTS.md
  - packages/observe/index.ts
  - packages/observe/metadata.ts
  - packages/observe/publish.ts
  - packages/deploy/index.ts
  - specs/tasks/TASK-136-P11-OBSERVE-PUBLICATION-E2E.md
  - specs/tasks/TASK-145-P11-OBSERVE-OPERATIONAL-POSITIVE-TEST.md
  - specs/tasks/TASK-146-P11-OBSERVE-OPERATIONAL-NEGATIVE-TEST.md
  - specs/tasks/TASK-147-P11-OBSERVE-OPERATIONAL-INTEGRATED-E2E.md
allowed_paths:
  - packages/observe/index.ts
  - packages/observe/metadata.ts
  - packages/observe/publish.ts
  - tests/product/observe-operational-e2e.test.ts
  - specs/tasks/TASK-147-P11-OBSERVE-OPERATIONAL-INTEGRATED-E2E.md
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

Prove the **integrated E2E** for operational metadata: a durable `DeploymentRecord` becomes a `DeploymentObservation`, is correlated and enriched with operational metadata (executor/source/mode + runtime correlation), and is published to an injected Observe receiver — while Runtime autonomy (Observe unavailable/not configured, ADR-0002) is proven and no resolved secret/CA value ever surfaces. This closes the remainder of `TD-P4-08` (WBS 10.3.1/11.1.2).

# Context

Sprint 1 (`TASK-136`) proved the E2E for the plain observation with Runtime autonomy. Sprint 2 adds the operational-metadata enrichment (WBS 10.3.1: register executor; WBS 11.1.2: correlate telemetry with deployment/release/runtime). The Sprint 2 E2E extends the Sprint 1 chain with the operational block while re-proving autonomy and no-leak.

# Current behavior

Sprint 1 E2E proves durable DeploymentRecord -> observation -> Observe receiver + autonomy. Operational metadata is proven unit-wise and positively (TASK-145); the full integrated E2E with the enriched observation is not yet proven.

# Required change

Add `tests/product/observe-operational-e2e.test.ts` proving the integrated chain:

- durable `DeploymentRecord` through the real Deploy path (e.g. `dryRunDeploy`/`DeploymentRegistry`/`executeLocalDeployment` if bounded);
- derive observation (Sprint 1) + correlate/enrich with operational metadata;
- publish the enriched observation to an injected Observe receiver and assert the receiver got the enriched observation with correct correlation and operational context;
- Runtime autonomy: Observe not configured / unavailable -> Deploy and Runtime continuity unchanged; publication fail-open;
- no resolved secret/credential/CA value in any emitted observation;
- observation linkable to release/environment/runtime context.

# Inputs / contracts

Deploy `DeploymentRecord` modules, `DeploymentObservation` (Sprint 1), operational metadata + correlation + enrichment + fail-open publish (TASK-137..143), no-leak (TASK-144), ADR-0002/0007/0009, WBS 10.3.1/11.1.2.

# Outputs / contracts

Extends the growing integrated proof with operational metadata. No canonical `DeploymentRecord` change. No new ADR.

# Acceptance criteria

- durable DeploymentRecord -> enriched observation -> Observe receiver proven end to end;
- correlation and operational context match the source release/environment/status/health;
- Runtime autonomy with Observe unavailable/not configured proven;
- no resolved secret/credential/CA value in any emitted observation;
- observation linkable to release/environment/runtime context;
- product tests pass;
- declared validations pass.

# Non-goals

Growing package proof (TASK-148), telemetry ingestion beyond deployment observations, canonical contract changes, external dependencies, Sprints 3 or the package review.

# Evidence expected

`tests/product/observe-operational-e2e.test.ts` plus GitHub Deterministic CI.

# Implementation evidence

Implemented on `sprint/P11-OBSERVE-OPERATIONAL-METADATA-01` as the Sprint-closing E2E TASK: `tests/product/observe-operational-e2e.test.ts` proves the integrated chain — durable `DeploymentRecord` (via `DeploymentRegistry` + `dryRunDeploy`) -> `DeploymentObservation` -> correlated/enriched with operational metadata (executor/source/mode + runtime/process/session correlation) -> published to an injected Observe receiver with correct correlation and operational context, linkable to release/environment/runtime; Runtime autonomy re-proven (Observe not configured and channel unavailable -> fail-open, Deploy/Runtime continuity unchanged); no resolved secret/credential/CA value in any emitted observation. Local: lint PASS, typecheck PASS, suite 5/5 PASS, `npm run test:product` core 182 tests/181 pass/0 fail. CI validation required before Sprint Review.

# Escalation

Stop if implementation requires changing the canonical `DeploymentRecord` schema/identity, another package boundary, canonical contracts, Runtime behavior, or any L3/L4 boundary without escalation.