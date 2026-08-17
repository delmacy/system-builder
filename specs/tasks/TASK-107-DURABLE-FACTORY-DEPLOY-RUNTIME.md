---
id: TASK-107
title: Prove durable Factory activation reaches autonomous Runtime
status: completed
priority: 403
milestone: M8
model_tier: cheap
risk: low
architecture_impact: false
executor_preference: any
depends_on: []
context_paths:
  - AGENTS.md
  - docs/current/PROJECT_STATE.md
  - docs/current/CURRENT_MILESTONE.md
  - project_docs/schedule/SPRINT_MODE.md
  - project_docs/execution_planning/P7-PACKAGE-01.md
  - project_docs/execution_planning/P7-DURABLE-DEPLOYMENT-E2E-01.md
  - project_docs/10-deploy/WBS.md
  - project_docs/13-autonomous-runtime/WBS.md
  - tests/product/durable-factory-e2e.test.ts
  - packages/catalog/index.ts
  - packages/catalog/postgres.ts
  - packages/assembly/index.ts
  - packages/validation/index.ts
  - packages/compiler/index.ts
  - packages/release/index.ts
  - packages/release/postgres.ts
  - packages/artifact-store/postgres.ts
  - packages/deploy/index.ts
  - packages/deploy/postgres-state.ts
  - packages/deploy/local-deployment.ts
  - docs/adr/ADR-0002-autonomous-runtime.md
  - docs/adr/ADR-0007-release-environment-deployment.md
  - specs/tasks/TASK-107-DURABLE-FACTORY-DEPLOY-RUNTIME.md
allowed_paths:
  - tests/product/p7-durable-deployment-e2e.test.ts
  - specs/tasks/TASK-107-DURABLE-FACTORY-DEPLOY-RUNTIME.md
forbidden_paths:
  - packages/**
  - apps/**
  - tooling/**
  - docs/adr/**
  - .github/**
  - package.json
  - package-lock.json
max_files: 2
validation:
  - npm run test:product
  - npm run verify
---

# Objective

Prove, using actual executable module APIs and PostgreSQL reference providers, that reconstructed durable Factory output can become durable active deployment A and execute in an autonomous local Runtime while Builder/Observe endpoints are unavailable.

# Context

P6 proved durable Factory reconstruction and autonomous Runtime. P7 Sprints 1/2 separately proved durable deployment authority and bounded rollback. There is not yet one package-level proof joining those authorities.

# Current behavior

Durable Factory, durable deployment state, activation decisions and local autonomous Runtime execution exist as separately proven capabilities.

# Required change

Add the first stage of a focused P7 E2E test: reconstruct Catalog and Release/Artifact through PostgreSQL, activate deployment A through `DeploymentRegistry` backed by `PostgresDeploymentRecordStorage`, flush/reconstruct deployment authority, and execute the verified artifact through existing local deployment with unavailable Builder/Observe URLs.

# Inputs / contracts

Existing executable Catalog, Assembly, Validation, Compiler, Release, Artifact Store, Deploy and Runtime APIs; PostgreSQL 17.6 CI; ADR-0002 and ADR-0007.

# Outputs / contracts

Test evidence only. No product or canonical contract source change.

# Acceptance criteria

- downstream artifacts are produced by actual executable module APIs rather than hand-authored replacements;
- Release and Artifact payload are reconstructed from PostgreSQL before Deploy;
- successful A is activated through the durable Deploy provider and remains active after provider reconstruction;
- verified artifact executes through existing local Runtime while Builder/Observe URLs are intentionally unavailable;
- activation/record/runtime evidence is immutable/deterministic where applicable;
- serialized evidence contains no PostgreSQL URL, credential or resolved secret;
- no product/provider source changes;
- declared validations pass.

# Non-goals

Upgrade B, failed candidate recovery C, product changes, traffic switching, supervisor/fleet behavior or schema changes.

# Evidence expected

One focused PostgreSQL-backed product E2E test proving Factory reconstruction -> durable activation A -> autonomous Runtime plus repository verification.

# Escalation

Stop if this proof requires any product/provider/contract/ADR/CI workflow modification.