---
id: TASK-056
title: Define canonical EnvironmentProfile contract and bind Deploy to it
status: completed
priority: 320
milestone: M3
model_tier: architecture
risk: high
architecture_impact: true
executor_preference: any
depends_on:
  - TASK-055
context_paths:
  - AGENTS.md
  - docs/current/PROJECT_STATE.md
  - docs/current/CURRENT_MILESTONE.md
  - project_docs/schedule/SPRINT_MODE.md
  - project_docs/execution_planning/P2-PACKAGE-01.md
  - project_docs/execution_planning/P2-BOUNDARY-01.md
  - project_docs/execution_planning/P1-PACKAGE-01.integration-debt-review.md
  - docs/adr/ADR-0007-release-environment-deployment.md
  - project_docs/10-deploy/WBS.md
  - packages/contracts/factory-boundary/**
  - packages/deploy/index.ts
  - tests/product/deploy.test.ts
  - tests/product/full-vertical-e2e.test.ts
  - tests/product/factory-boundary-schema-conformance.test.ts
  - tsconfig.json
  - specs/tasks/TASK-056-CANONICAL-ENVIRONMENT-PROFILE.md
allowed_paths:
  - packages/contracts/environment-profile/**
  - packages/deploy/index.ts
  - tests/product/deploy.test.ts
  - tests/product/full-vertical-e2e.test.ts
  - tests/product/factory-boundary-schema-conformance.test.ts
  - tsconfig.json
  - specs/tasks/TASK-056-CANONICAL-ENVIRONMENT-PROFILE.md
forbidden_paths:
  - apps/**
  - packages/contracts/factory-boundary/**
  - packages/compiler/**
  - packages/release/**
  - tooling/agent-harness/**
max_files: 8
validation:
  - npm run test:product
  - npm run verify
---

# Objective

Create the canonical shared EnvironmentProfile/environment-binding contract required before real Deploy adapters and make Deploy consume that public boundary instead of owning a private profile shape.

# Authority

This is bounded L3 contract work explicitly authorized by the committed `P2-BOUNDARY-01` Sprint manifest. It does not authorize an L4 change to `Release + Environment = Deployment` or Builder/Runtime boundaries.

After CI exposed the repository architecture rule requiring public package imports, human scope authority explicitly expanded this TASK only enough to configure TypeScript resolution for the canonical public EnvironmentProfile import. This amendment does not authorize broader package-resolution, architecture or module-boundary changes.

# Context

ADR-0007 defines Environment as the external infrastructure/runtime configuration and secret-reference side of Deployment. P1 TD-P1-06 found that EnvironmentProfile currently exists only as an internal Deploy TypeScript type, which risks incompatible adapter-specific shapes.

# Current behavior

Deploy accepts `{ environmentRef, runtimeVersions, bindings }` through module-local types. Secret values are not allowed, but there is no canonical shared schema/export.

# Required change

Define a versioned JSON Schema plus public TypeScript export for EnvironmentProfile and EnvironmentBinding. The canonical profile must carry explicit kind/identity, compatible runtime versions and symbolic config/secret-reference bindings with additional fields rejected by schema. Update Deploy and product tests to consume the canonical type/shape and extend conformance testing to EnvironmentProfile.

Configure the minimum repository TypeScript path resolution necessary for Deploy to consume `@system-builder/contracts/environment-profile` as a public package import rather than using a relative cross-package import.

Secret values must remain structurally outside the canonical contract; bindings contain references, not resolved values.

# Inputs / contracts

ADR-0007, Deploy WBS 10.1, current Deploy behavior and factory Release/Deployment contracts.

# Outputs / contracts

Canonical EnvironmentProfile schema/export consumed by Deploy through a public package import.

# Acceptance criteria

- canonical EnvironmentProfile schema/export exists under `packages/contracts/environment-profile/`;
- contract distinguishes config from secret-reference bindings and exposes references only;
- contract rejects extra value-bearing properties through closed object shapes;
- Deploy imports/consumes the shared EnvironmentProfile type through the public `@system-builder/contracts/environment-profile` path rather than declaring its own competing profile/binding types or using a relative cross-package import;
- compatible environment still produces deterministic deployment success;
- incompatible runtime/missing binding/attempted secret value remain explicit failures;
- actual EnvironmentProfile used by the vertical proof validates against its canonical schema;
- existing ReleaseArtifact/PublishedRelease remain free of environment secret references/values;
- product tests, architecture gate and repository-wide verification pass.

# Non-goals

Secret resolution, infrastructure provisioning, environment persistence, provider-specific adapters, changes to Release or DeploymentRecord semantics, Runtime implementation, or generalized package-resolution redesign beyond the exact EnvironmentProfile public import required by this TASK.

# Evidence expected

Canonical schema/export, public import resolution, Deploy integration tests, conformance test and GitHub Deterministic CI.

# Escalation

Stop if defining EnvironmentProfile or its minimum public-import resolution requires changing Release/Environment/Deployment separation, changing immutable release semantics, or any other L4 boundary decision.
