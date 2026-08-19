---
id: TASK-142
title: Enrich DeploymentObservation additively with operational metadata
status: ready
priority: 464
milestone: M11
model_tier: cheap
risk: medium
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-141
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
  - docs/architecture/PIPELINE_AND_CONTRACTS.md
  - packages/observe/index.ts
  - packages/observe/metadata.ts
  - packages/observe/publish.ts
  - specs/tasks/TASK-137-P11-OBSERVE-OPERATIONAL-METADATA-CONTRACT.md
  - specs/tasks/TASK-141-P11-OBSERVE-OPERATIONAL-CORRELATION.md
  - specs/tasks/TASK-142-P11-OBSERVE-OPERATIONAL-ENRICHMENT.md
allowed_paths:
  - packages/observe/index.ts
  - packages/observe/metadata.ts
  - packages/observe/publish.ts
  - tests/product/observe-operational-enrichment.test.ts
  - specs/tasks/TASK-142-P11-OBSERVE-OPERATIONAL-ENRICHMENT.md
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

Enrich the Sprint 1 `DeploymentObservation` **additively** with the operational metadata block so an emitted observation carries the executor/source/mode and correlation context — without changing the Sprint 1 observation identity when operational metadata is absent (backward compatibility) and without altering the canonical `DeploymentRecord`.

# Context

Sprint 1 established `DeploymentObservation` and its content-addressed `observationId`. Sprint 2 adds operational metadata (WBS 10.3.1, 11.1.2). The enrichment must be additive: a `DeploymentObservation` without operational metadata keeps its exact Sprint 1 identity and shape; with operational metadata, a new deterministic enriched shape carries both.

# Current behavior

`DeploymentObservation` has a fixed correlation shape; no operational-metadata field exists.

# Required change

Add an enrichment path in `packages/observe` (e.g. `enrichObservation(observation, metadata)`):

- produces an enriched observation that includes the Sprint 1 correlation fields plus the operational metadata block (executor/source/mode + correlation);
- when metadata is absent, returns the original observation unchanged (Sprint 1 identity preserved — backward compatible);
- derives a deterministic content-addressed identity for the enriched shape that is stable for equal inputs;
- rejects a resolved secret/credential/CA value in the operational block (ADR-0007) deterministically;
- is fail-safe: a channel/delivery failure later (TASK-143) never breaks Deploy/Runtime.

# Inputs / contracts

`DeploymentObservation` (Sprint 1), `DeploymentOperationMetadata`/correlation (TASK-137/141), ADR-0002/0007/0009.

# Outputs / contracts

An additive enrichment of `DeploymentObservation` with operational metadata. No canonical `DeploymentRecord` change. No new ADR.

# Acceptance criteria

- enriched observation carries Sprint 1 correlation fields plus the operational metadata block;
- absent metadata -> unchanged Sprint 1 observation (identity preserved);
- enriched identity is deterministic and content-addressed;
- resolved secret/credential/CA value in the operational block is rejected deterministically;
- product tests cover enrichment, backward compatibility and rejection;
- declared validations pass.

# Non-goals

Publication fail-open with enrichment (TASK-143), full no-leak proof (TASK-144), positive/negative product test suites (TASK-145/146), integrated E2E (TASK-147), growing proof (TASK-148), canonical contract changes, external dependencies.

# Evidence expected

Enrichment path in `packages/observe` + `tests/product/observe-operational-enrichment.test.ts`, plus GitHub Deterministic CI.

# Implementation evidence

To be implemented on `sprint/P11-OBSERVE-OPERATIONAL-METADATA-01` as the sixth TASK. CI validation required before Sprint Review.

# Escalation

Stop if implementation requires changing the canonical `DeploymentRecord` schema/identity, another package boundary, canonical contracts, or any L3/L4 boundary without escalation.