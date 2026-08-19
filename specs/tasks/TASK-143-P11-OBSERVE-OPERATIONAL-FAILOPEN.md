---
id: TASK-143
title: Keep publication fail-open with operational metadata
status: ready
priority: 465
milestone: M11
model_tier: cheap
risk: medium
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-142
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
  - docs/architecture/PIPELINE_AND_CONTRACTS.md
  - packages/observe/index.ts
  - packages/observe/metadata.ts
  - packages/observe/publish.ts
  - specs/tasks/TASK-142-P11-OBSERVE-OPERATIONAL-ENRICHMENT.md
  - specs/tasks/TASK-143-P11-OBSERVE-OPERATIONAL-FAILOPEN.md
allowed_paths:
  - packages/observe/index.ts
  - packages/observe/metadata.ts
  - packages/observe/publish.ts
  - tests/product/observe-operational-failopen.test.ts
  - specs/tasks/TASK-143-P11-OBSERVE-OPERATIONAL-FAILOPEN.md
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

Guarantee the enrichment + publication path is **fail-open** end to end (ADR-0002): when Observe/operations is not configured, unavailable, or the operational metadata cannot be produced/attached, Deploy and Runtime continue unchanged — publication returns a deterministic fail-open result, never a failure that propagates into the deployment chain.

# Context

Sprint 1 proved fail-open publication for the plain observation (`not-configured`, `channel-failed`, `delivered`). Sprint 2 adds operational metadata (WBS 10.3.1/11.1.2). The fail-open invariant must extend to the enriched path: metadata production failure or an unavailable Observe channel must not break Deploy/Runtime.

# Current behavior

Fail-open publish exists for the plain observation. The enriched observation path (TASK-142) does not yet prove its own fail-open behavior for metadata production failures or channel unavailability.

# Required change

Extend the publication surface in `packages/observe/publish.ts` (or an additive function) to accept the enriched observation and prove fail-open semantics:

- Observe not configured -> deterministic `not-configured` result; Deploy/Runtime unchanged;
- channel unavailable or throwing -> deterministic `channel-failed` diagnostic, never propagated to Deploy/Runtime;
- operational metadata production/validation failure -> deterministic diagnostic that does not fail the deployment chain (metadata is enrichment, not a Deploy gate);
- the fail-open result never echoes a secret/credential/CA value.

# Inputs / contracts

`publish` (Sprint 1), enriched observation (TASK-142), ADR-0002/0007.

# Outputs / contracts

Fail-open enrichment + publication for the operational-metadata path. No canonical `DeploymentRecord` change. No new ADR.

# Acceptance criteria

- not-configured, channel-failed and delivered outcomes hold for enriched observations;
- metadata production/validation failure yields a deterministic diagnostic without failing Deploy/Runtime;
- no resolved secret/credential/CA value appears in any fail-open result;
- product tests cover the fail-open matrix (configured/unavailable/metadata-failure);
- declared validations pass.

# Non-goals

Full no-leak proof (TASK-144), positive/negative product suites (TASK-145/146), integrated E2E (TASK-147), growing proof (TASK-148), canonical contract changes, external dependencies.

# Evidence expected

Fail-open extension in `packages/observe/publish.ts` + `tests/product/observe-operational-failopen.test.ts`, plus GitHub Deterministic CI.

# Implementation evidence

To be implemented on `sprint/P11-OBSERVE-OPERATIONAL-METADATA-01` as the seventh TASK. CI validation required before Sprint Review.

# Escalation

Stop if implementation requires changing the canonical `DeploymentRecord` schema/identity, another package boundary, canonical contracts, Runtime behavior, or any L3/L4 boundary without escalation.