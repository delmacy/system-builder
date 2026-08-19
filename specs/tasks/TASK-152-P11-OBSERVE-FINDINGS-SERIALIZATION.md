---
id: TASK-152
title: Provide lossless deterministic JSON round-trip for DeploymentFinding
status: ready
priority: 474
milestone: M11
model_tier: cheap
risk: low
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-151
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
  - specs/tasks/TASK-151-P11-OBSERVE-FINDINGS-VALIDATION.md
  - specs/tasks/TASK-152-P11-OBSERVE-FINDINGS-SERIALIZATION.md
allowed_paths:
  - packages/observe/findings.ts
  - tests/product/observe-findings-serialization.test.ts
  - specs/tasks/TASK-152-P11-OBSERVE-FINDINGS-SERIALIZATION.md
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

Provide a **lossless deterministic JSON round-trip** for `DeploymentFinding` (and its derived correlation/linkage documents) that preserves identity and every field, following the Sprint 1/2 `toJson`/`fromJson` pattern so that findings survive durable storage and transport unchanged.

# Context

The `DeploymentFinding` contract (TASK-149), derivation (TASK-150) and validation (TASK-151) exist. Findings will be correlated (TASK-153), linked (TASK-154) and published (TASK-155); a lossless serialization boundary is required so the content-addressed identity survives the round-trip exactly.

# Current behavior

No `DeploymentFinding` serialization exists: findings are in-memory objects only.

# Required change

Add `DeploymentFinding.toJson(finding)` / `DeploymentFinding.fromJson(serialized)` (or equivalent) in `packages/observe/findings.ts`:

- JSON.stringify/parse must preserve every field exactly (lossless), including optional correlation refs;
- `fromJson` must validate the parsed value via the TASK-151 validator and recompute/verify the deterministic `findingId`;
- a malformed serialized finding is rejected deterministically (`OBSERVE_INVALID_FINDING:JSON`).

# Inputs / contracts

`DeploymentFinding` (TASK-149), validation (TASK-151), the `metadata.ts`/`index.ts` `toJson`/`fromJson` pattern, ADR-0002/0007/0009.

# Outputs / contracts

Lossless `toJson`/`fromJson` for `DeploymentFinding` in `packages/observe/findings.ts`. No canonical contract change. No new ADR.

# Acceptance criteria

- round-trip preserves identity and every field losslessly;
- malformed serialized findings are rejected deterministically;
- positive and negative cases are covered by product tests;
- declared validations pass.

# Non-goals

Changing the canonical `DeploymentRecord` schema/identity or the Sprint 1/2 identities, correlation (TASK-153), linkage (TASK-154), publication fail-open (TASK-155), external dependencies, CI/tooling changes.

# Evidence expected

`packages/observe/findings.ts` + `tests/product/observe-findings-serialization.test.ts`, plus GitHub Deterministic CI.

# Implementation evidence

To be implemented on `sprint/P11-OBSERVE-INTEGRATION-E2E-01` as the fourth TASK of Sprint 3. CI validation required before Sprint Review.

# Escalation

Stop if implementation requires changing the canonical `DeploymentRecord` schema/identity, another package boundary, canonical contracts, or any L3/L4 boundary without escalation.