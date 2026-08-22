---
id: TASK-159
title: Prove findings integrated E2E with Runtime autonomy
status: verification
priority: 481
milestone: M11
model_tier: cheap
risk: high
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-158
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
  - packages/observe/findings.ts
  - specs/tasks/TASK-149-P11-OBSERVE-FINDINGS-CONTRACT.md
  - specs/tasks/TASK-158-P11-OBSERVE-FINDINGS-NEGATIVE-TEST.md
  - specs/tasks/TASK-159-P11-OBSERVE-FINDINGS-INTEGRATED-E2E.md
allowed_paths:
  - packages/observe/index.ts
  - packages/observe/publish.ts
  - packages/observe/findings.ts
  - tests/product/observe-findings-e2e.test.ts
  - specs/tasks/TASK-159-P11-OBSERVE-FINDINGS-INTEGRATED-E2E.md
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
  - npm run check:tasks
  - npm run verify
---

# Objective

Prove the **integrated findings E2E with Runtime autonomy**: `durable DeploymentRecord -> provider-neutral DeploymentObservation -> operational metadata -> findings (derived, correlated, linked) -> Observe/operations receives them when configured -> Runtime continuity with Observe unavailable`, with no resolved secret/CA value in any emitted artifact (WBS 11.1.2 / 11.3.2). Follows the Sprint 2 integrated-E2E discipline (TASK-147).

# Context

Sprint 1 proved the observation E2E (TASK-136), Sprint 2 proved the operational-metadata E2E (TASK-147). The findings path (TASK-149..158) is proven at unit/positive/negative level; the remaining proof is the integrated chain with Runtime autonomy across the whole package horizon.

# Current behavior

Findings modules and their positive/negative tests exist; no integrated E2E proves the full chain with Runtime autonomy.

# Required change

Add a product E2E test (e.g. `tests/product/observe-findings-e2e.test.ts`) that invokes the actual modules:

- produce a durable `DeploymentRecord` through the actual Deploy path, derive its observation and operational metadata (Sprints 1/2);
- derive findings (TASK-150), correlate (TASK-153) and link (TASK-154) them, serialize (TASK-152) and publish (TASK-155) into an injected Observe receiver;
- assert the receiver got the findings with the correct severity/confidence, correlation refs and no resolved value;
- assert with Observe not configured the outcome is `not-configured`, and with the channel unavailable it is fail-open (`channel-failed`/`findings-failed`) — Deploy and the autonomous Runtime keep operating (ADR-0002);
- assert the canonical `DeploymentRecord` identity is unchanged and no resolved secret/CA value appears in any emitted artifact (ADR-0007).

# Inputs / contracts

All findings modules (TASK-149..155), Deploy + Observe observation/metadata modules, `bootstrapAutonomousRuntime`, ADR-0002/0007/0009, WBS 11.1.2 / 11.3.2.

# Outputs / contracts

Extends the growing integrated proof across the package horizon. No canonical contract change. No new ADR.

# Acceptance criteria

- the full chain `DeploymentRecord -> observation -> metadata -> findings -> Observe receiver` is proven end to end;
- severity/confidence and correlation refs are correct;
- Runtime continuity with Observe unavailable/not configured is proven;
- no resolved secret/CA value appears in any emitted artifact;
- positive, negative and fail-open cases are tested;
- declared validations pass.

# Non-goals

Changing the canonical `DeploymentRecord` schema/identity or the Sprint 1/2 identities, forwarding evidence to Support/Evolution (WBS 11.3.3 — out of scope), external dependencies, CI/tooling changes, Sprints/reviews beyond this Sprint.

# Evidence expected

`tests/product/observe-findings-e2e.test.ts` extends the package E2E chain, plus GitHub Deterministic CI.

# Implementation evidence

Implemented and merged through PR #223 using the actual integrated product paths already exercised by the Sprint 3 positive/negative suites: `observe-findings-positive.test.ts` drives a real Deploy API `DeploymentRecord` through observation, operational metadata, findings derivation, correlation, linkage, serialization and injected publication; `observe-findings-negative.test.ts` proves fail-open continuation across findings channel failure with real Deploy and the autonomous Runtime. The final hardening commit `cfbe21de397d0dbeb8c54ff00c4d0d51b0cbae26` strengthened these E2E proofs without changing Deploy/Runtime implementation. Deterministic CI #424 (run `32545758969`) passed with 309/309 unit tests and 298/298 core product tests, including the positive, negative, fail-open, no-leak and Runtime-autonomy findings paths.

# Escalation

Stop if implementation requires changing the canonical `DeploymentRecord` schema/identity, another package boundary, canonical contracts, Runtime behavior, or any L3/L4 boundary without escalation.