---
id: TASK-138
title: Derive DeploymentOperationMetadata deterministically from execution context
status: ready
priority: 460
milestone: M11
model_tier: cheap
risk: medium
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-137
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
  - specs/tasks/TASK-137-P11-OBSERVE-OPERATIONAL-METADATA-CONTRACT.md
  - specs/tasks/TASK-138-P11-OBSERVE-OPERATIONAL-DERIVATION.md
allowed_paths:
  - packages/observe/metadata.ts
  - packages/observe/index.ts
  - tests/product/observe-operational-derivation.test.ts
  - specs/tasks/TASK-138-P11-OBSERVE-OPERATIONAL-DERIVATION.md
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
  - npm run verify
---

# Objective

Derive a deterministic `DeploymentOperationMetadata` from the execution context and the durable `DeploymentRecord` correlation fields, so two identical executions produce identical operational metadata (including the content-addressed `operationId`).

# Context

TASK-137 defined the provider-neutral `DeploymentOperationMetadata` contract. This TASK supplies the factory that constructs it from the actual execution context (executor reference, source/trigger, mode, optional runtime/process/session refs) correlated with the deployment's release/environment identity — the remaining `TD-P4-08` operational metadata gap (WBS 10.3.1, 11.1.2).

# Current behavior

`DeploymentOperationMetadata` exists as a contract type only; there is no deterministic factory from execution context, and no `operationId` derivation.

# Required change

Add a `DeploymentOperationMetadata.fromExecutionContext` (or equivalent) factory in `packages/observe/metadata.ts`:

- accepts a bounded execution-context input (executor ref, source, mode, optional correlation refs) and the correlated deployment fields (release ref, environment ref, deploymentId);
- derives a deterministic content-addressed `operationId` (e.g. `sha256Canonical`) over the correlated payload;
- normalizes inputs deterministically (e.g. stable ordering, canonical formatting) so repeated derivation from equal inputs yields equal metadata;
- rejects inputs that would carry a resolved secret/credential/CA value (ADR-0007) deterministically.

# Inputs / contracts

`DeploymentOperationMetadata` type (TASK-137), `sha256Canonical` from `@system-builder/deterministic`, `DeploymentRecord` correlation fields, ADR-0002/0007/0009.

# Outputs / contracts

A deterministic `fromExecutionContext` factory with content-addressed identity. No canonical `DeploymentRecord` change. No new ADR.

# Acceptance criteria

- factory derives operational metadata deterministically from equal inputs (identity + all fields stable);
- `operationId` is content-addressed and stable;
- inputs are normalized (ordering/formatting) deterministically;
- attempts to embed a resolved secret/credential/CA value are rejected deterministically;
- product tests prove determinism, normalization and rejection;
- declared validations pass.

# Non-goals

Validation beyond derivation-time rejection of value leakage (TASK-139), serialization (TASK-140), correlation with runtime/process/session context (TASK-141), enrichment (TASK-142), publication fail-open (TASK-143), full no-leak proof (TASK-144), canonical contract changes, external dependencies.

# Evidence expected

`fromExecutionContext` in `packages/observe/metadata.ts` + `tests/product/observe-operational-derivation.test.ts`, plus GitHub Deterministic CI.

# Implementation evidence

To be implemented on `sprint/P11-OBSERVE-OPERATIONAL-METADATA-01` as the second TASK. CI validation required before Sprint Review.

# Escalation

Stop if implementation requires changing the canonical `DeploymentRecord` schema/identity, another package boundary, canonical contracts, or any L3/L4 boundary without escalation.
