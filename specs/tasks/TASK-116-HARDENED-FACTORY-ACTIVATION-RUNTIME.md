---
id: TASK-116
title: Prove hardened Factory activation A reaches autonomous Runtime
status: ready
priority: 394
milestone: M9
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
  - project_docs/execution_planning/P8-PACKAGE-01.md
  - project_docs/execution_planning/P8-HARDENED-ACTIVATION-E2E-01.md
  - project_docs/10-deploy/WBS.md
  - project_docs/13-autonomous-runtime/WBS.md
  - tests/product/p7-durable-deployment-e2e.test.ts
  - tests/product/p8-atomic-deployment-authority.test.ts
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
  - packages/deploy/secret-resolver.ts
  - docs/adr/ADR-0002-autonomous-runtime.md
  - docs/adr/ADR-0007-release-environment-deployment.md
  - specs/tasks/TASK-116-HARDENED-FACTORY-ACTIVATION-RUNTIME.md
allowed_paths:
  - tests/product/p8-hardened-activation-e2e.test.ts
  - specs/tasks/TASK-116-HARDENED-FACTORY-ACTIVATION-RUNTIME.md
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

Prove that actual durable Factory output can be reconstructed and activated as deployment A through the authenticated PostgreSQL atomic Deploy boundary, then execute autonomously while Builder/Observe endpoints are unavailable.

# Context

P8 Sprint 1 hardened the Deploy PostgreSQL transport and P8 Sprint 2 integrated atomic activation authority. P7 already proves the Factory/Runtime path using executable APIs. This TASK joins those integrated predecessors without modifying product code.

# Current behavior

Factory reconstruction, authenticated Deploy state, atomic activation and autonomous Runtime are separately proven. The P8 package lacks one proof joining them.

# Required change

Create the focused P8 E2E evidence file. Produce Factory output via actual Catalog/Assembly/Validation/Compiler APIs, persist/reconstruct Release and Artifact through existing PostgreSQL providers, execute Runtime with unavailable Builder/Observe URLs, and atomically activate successful A through `PostgresDeploymentRecordStorage` opened against the authenticated PostgreSQL fixture with `expectedActiveDeploymentId = null`.

# Inputs / contracts

Existing executable Factory/Release/Artifact/Deploy/Runtime APIs, PostgreSQL CI fixtures, ADR-0002 and ADR-0007.

# Outputs / contracts

Test evidence only. No product, provider, contract, ADR or workflow source change.

# Acceptance criteria

- positive: downstream Factory artifacts are produced by actual executable APIs, not hand-authored replacements;
- positive: Release and Artifact are reconstructed durably before Deploy;
- positive: authenticated Deploy provider atomically activates A from no prior active deployment;
- positive: fresh Deploy reconstruction observes A as authoritative;
- positive/predecessor: verified artifact executes through existing Runtime while Builder/Observe URLs are intentionally unavailable;
- negative: serialized evidence contains no PostgreSQL URL, username, password or resolved secret;
- negative: no product/provider source changes occur;
- predecessor integration: P8 authenticated transport and atomic activation semantics are exercised in the same proof;
- declared validations pass.

# Non-goals

Successful B upgrade, stale contender, failed contender, traffic switching, production orchestration or schema changes.

# Evidence expected

One authenticated PostgreSQL-backed P8 E2E test establishing Factory -> A -> autonomous Runtime plus repository verification.

# Escalation

Stop if this proof requires any forbidden path, canonical contract/ADR change, product/provider modification or CI workflow change.
