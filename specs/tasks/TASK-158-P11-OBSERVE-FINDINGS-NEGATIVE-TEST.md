---
id: TASK-158
title: Prove negative and fail-open findings paths
status: ready
priority: 480
milestone: M11
model_tier: cheap
risk: low
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-157
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
  - specs/tasks/TASK-157-P11-OBSERVE-FINDINGS-POSITIVE-TEST.md
  - specs/tasks/TASK-158-P11-OBSERVE-FINDINGS-NEGATIVE-TEST.md
allowed_paths:
  - packages/observe/findings.ts
  - packages/observe/publish.ts
  - tests/product/observe-findings-negative.test.ts
  - specs/tasks/TASK-158-P11-OBSERVE-FINDINGS-NEGATIVE-TEST.md
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

Prove the **negative and fail-open findings paths**: malformed/unknown/conflicting/leaky findings are rejected deterministically, correlation and linkage reject missing deployment context, and a failing findings pipeline never breaks Deploy or the autonomous Runtime (ADR-0002) nor echoes a resolved value (ADR-0007). Follows the Sprint 2 negative-test discipline (TASK-146).

# Context

Positive findings path is proven (TASK-157). The negative/fail-open cases remain to be proven: validation (TASK-151) fail-closed diagnostics, correlation/linkage (TASK-153/154) rejection of missing context, and publication fail-open (TASK-155) across `not-configured`/`channel-failed`/`findings-failed`.

# Current behavior

Negative/fail-open findings cases are not yet covered by product tests.

# Required change

Add a product test suite (e.g. `tests/product/observe-findings-negative.test.ts`) that invokes the actual modules:

- reject unknown fields, wrong kind, malformed required fields, unsupported severity/confidence, missing/conflicting correlation, wrong `findingId` and value-tainted findings with deterministic `OBSERVE_INVALID_FINDING:*` diagnostics that never echo the value;
- reject correlation/linkage without deployment context (`CORRELATION_REQUIRES_DEPLOYMENT`);
- assert `publishFindings` returns fail-open outcomes when the channel is unavailable (`channel-failed`), when findings are unavailable/malformed (`findings-failed`) and `not-configured` when no observer is set — and that Deploy and the autonomous Runtime keep operating;
- assert no resolved secret/credential/CA value appears in any diagnostic detail.

# Inputs / contracts

Findings validation/correlation/linkage/publication (TASK-149..155), Deploy + Runtime modules, ADR-0002/0007/0009, WBS 11.1.2 / 11.3.2.

# Outputs / contracts

Negative/fail-open product tests for the findings path. No canonical contract change. No new ADR.

# Acceptance criteria

- negative validation/correlation/linkage cases are rejected deterministically;
- fail-open publication matrix is proven end to end;
- no resolved value appears in any diagnostic;
- Deploy and Runtime continuity are unchanged;
- product tests pass;
- declared validations pass.

# Non-goals

Changing the canonical `DeploymentRecord` schema/identity or the Sprint 1/2 identities, integrated E2E (TASK-159), external dependencies, CI/tooling changes.

# Evidence expected

`tests/product/observe-findings-negative.test.ts`, plus GitHub Deterministic CI.

# Implementation evidence

To be implemented on `sprint/P11-OBSERVE-INTEGRATION-E2E-01` as the tenth TASK of Sprint 3. CI validation required before Sprint Review.

# Escalation

Stop if implementation requires changing the canonical `DeploymentRecord` schema/identity, another package boundary, canonical contracts, Runtime behavior, or any L3/L4 boundary without escalation.