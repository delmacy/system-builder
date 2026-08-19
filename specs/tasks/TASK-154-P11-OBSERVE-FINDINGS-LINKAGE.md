---
id: TASK-154
title: Link findings to deployment/observation evidence additively
status: ready
priority: 476
milestone: M11
model_tier: cheap
risk: medium
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-153
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
  - specs/tasks/TASK-153-P11-OBSERVE-FINDINGS-CORRELATION.md
  - specs/tasks/TASK-154-P11-OBSERVE-FINDINGS-LINKAGE.md
allowed_paths:
  - packages/observe/index.ts
  - packages/observe/findings.ts
  - tests/product/observe-findings-linkage.test.ts
  - specs/tasks/TASK-154-P11-OBSERVE-FINDINGS-LINKAGE.md
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

Link `DeploymentFinding` instances to the deployment/observation evidence **additively with context and confidence** (WBS 11.3.2), producing a linkage document that connects the finding, its observation and the deployment evidence without altering any existing identity — following the Sprint 2 additive-enrichment discipline (`enrichObservation`).

# Context

Findings can be derived (TASK-150) and correlated (TASK-153). WBS 11.3.2 requires findings to carry **context and confidence** and be linkable to the evidence that produced them. Sprint 2 established the additive pattern: `enrichObservation` returns an enriched observation while preserving the base observation identity when metadata is absent.

# Current behavior

No linkage document exists: findings, observations and correlations are separate objects with no shared linkage document tying them together for Observe/operations consumption.

# Required change

Add an additive linkage document (e.g. `linkFinding(finding, observation, correlation?)` -> `DeploymentFindingLinkage`) in `packages/observe/findings.ts` and export it from `index.ts`:

- the linkage document carries `kind`, a content-addressed `linkageId`, the finding ref, the observation ref and the deployment correlation refs, plus optional runtime/process/session refs;
- context and confidence from the finding are carried through;
- the linkage is additive: it never alters the `DeploymentFinding`, the observation, the metadata or the canonical `DeploymentRecord` identity;
- the linkage never carries a resolved secret/credential/CA value (ADR-0007).

# Inputs / contracts

`DeploymentFinding` (TASK-149), derivation (TASK-150), correlation (TASK-153), `enrichObservation` additive discipline (index.ts), ADR-0002/0007/0009, WBS 11.3.2 / 11.1.2.

# Outputs / contracts

Deterministic `DeploymentFindingLinkage` (or equivalent) in `packages/observe/findings.ts` exported from `index.ts`. No canonical contract change. No new ADR.

# Acceptance criteria

- findings link additively to observation and deployment evidence with context and confidence;
- no existing identity is altered;
- linkage identity is content-addressed and deterministic;
- no resolved value can be expressed in the linkage;
- positive and negative cases are covered by product tests;
- declared validations pass.

# Non-goals

Changing the canonical `DeploymentRecord` schema/identity or the Sprint 1/2 identities, publication fail-open (TASK-155), forwarding evidence to Support/Evolution (WBS 11.3.3 — out of scope), external dependencies, CI/tooling changes.

# Evidence expected

`packages/observe/findings.ts` + `packages/observe/index.ts` exports + `tests/product/observe-findings-linkage.test.ts`, plus GitHub Deterministic CI.

# Implementation evidence

To be implemented on `sprint/P11-OBSERVE-INTEGRATION-E2E-01` as the sixth TASK of Sprint 3. CI validation required before Sprint Review.

# Escalation

Stop if implementation requires changing the canonical `DeploymentRecord` schema/identity, another package boundary, canonical contracts, or any L3/L4 boundary without escalation.