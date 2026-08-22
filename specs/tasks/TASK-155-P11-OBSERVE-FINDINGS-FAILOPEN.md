---
id: TASK-155
title: Keep findings publication fail-open end to end
status: verification
priority: 477
milestone: M11
model_tier: cheap
risk: medium
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-154
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
  - packages/observe/publish.ts
  - packages/observe/findings.ts
  - specs/tasks/TASK-149-P11-OBSERVE-FINDINGS-CONTRACT.md
  - specs/tasks/TASK-154-P11-OBSERVE-FINDINGS-LINKAGE.md
  - specs/tasks/TASK-155-P11-OBSERVE-FINDINGS-FAILOPEN.md
allowed_paths:
  - packages/observe/index.ts
  - packages/observe/publish.ts
  - packages/observe/findings.ts
  - tests/product/observe-findings-failopen.test.ts
  - specs/tasks/TASK-155-P11-OBSERVE-FINDINGS-FAILOPEN.md
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

Keep the findings publication path **fail-open end to end** (ADR-0002): a deployment finding — or its derivation, correlation, linkage or channel delivery — failing must never break Deploy or the autonomous Runtime. Follows the Sprint 1/2 fail-open `publish`/`publishEnriched` discipline.

# Context

Sprint 1 established fail-open publication (`OBSERVE_CHANNEL_FAILED`), Sprint 2 extended it (`OBSERVE_METADATA_FAILED`, `publishEnriched`/`EnrichedPublishObserver`). Findings (TASK-149..154) add a new payload kind that must be published through the same fail-open contract: `not-configured` / `delivered` / `channel-failed`, plus a findings-specific failure outcome when derivation/linkage fails, never propagating to Deploy or Runtime and never echoing a resolved secret/credential/CA value.

# Current behavior

`packages/observe/publish.ts` publishes observations and enriched observations fail-open. Findings and their linkage documents exist but have no dedicated fail-open publication function.

# Required change

Add a fail-open publication for findings (e.g. `publishFindings(findings, linkage?, observer?)`) in `packages/observe/publish.ts` (and/or `findings.ts`), exported from `index.ts`:

- fail-open matrix: `not-configured` / `delivered` / `channel-failed` (`OBSERVE_CHANNEL_FAILED`) / `findings-failed` (`OBSERVE_FINDINGS_FAILED`) — never propagated to Deploy or Runtime;
- the observer accepts findings/linkage documents (extend `PublishObserver` additively without breaking the existing observation contracts);
- when findings are unavailable or malformed, publication fails open and the deployment outcome is unchanged;
- the diagnostic detail never echoes a resolved secret/credential/CA value (ADR-0007).

# Inputs / contracts

`DeploymentFinding` (TASK-149), correlation/linkage (TASK-153/154), `publish`/`publishEnriched` fail-open discipline (publish.ts), ADR-0002/0007/0009.

# Outputs / contracts

Fail-open `publishFindings` (or equivalent) exported from `packages/observe/index.ts`. No canonical contract change. No new ADR.

# Acceptance criteria

- findings publication is fail-open across `not-configured`/`delivered`/`channel-failed`/`findings-failed`;
- a failing findings pipeline never breaks Deploy or the autonomous Runtime;
- diagnostics never echo a resolved secret/credential/CA value;
- positive and negative cases are covered by product tests;
- declared validations pass.

# Non-goals

Changing the canonical `DeploymentRecord` schema/identity or the Sprint 1/2 identities, no-leak proof (TASK-156), forwarding evidence to Support/Evolution (WBS 11.3.3 — out of scope), external dependencies, CI/tooling changes.

# Evidence expected

`packages/observe/publish.ts` + `packages/observe/index.ts` + `tests/product/observe-findings-failopen.test.ts`, plus GitHub Deterministic CI.

# Implementation evidence

Implemented on `sprint/P11-OBSERVE-INTEGRATION-E2E-01` as the seventh TASK of Sprint 3: `packages/observe/publish.ts` exports `publishFindings(findings, linkage?, observer?)` with a fail-open matrix of `not-configured` / `delivered` / `channel-failed` (`OBSERVE_CHANNEL_FAILED`) / `findings-failed` (`OBSERVE_FINDINGS_FAILED`), validating each finding (and any linkage binding) and never propagating a failure to Deploy or Runtime, plus the `DeploymentFindingsPublication` payload and `FindingsPublishObserver`/`FindingsPublishResult` types, re-exported from `packages/observe/index.ts`. `tests/product/observe-findings-failopen.test.ts` proves 12 cases (delivery with/without linkage, not-configured, async/sync channel fail-open without propagation, malformed-findings fail-open, foreign-linkage fail-open, determinism, no-value-leak in the delivered payload, and Deploy/Runtime continuity). CI validation required before Sprint Review.

# Escalation

Stop if implementation requires changing the canonical `DeploymentRecord` schema/identity, another package boundary, canonical contracts, Runtime behavior, or any L3/L4 boundary without escalation.