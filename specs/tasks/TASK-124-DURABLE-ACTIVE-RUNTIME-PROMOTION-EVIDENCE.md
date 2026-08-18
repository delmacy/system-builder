---
id: TASK-124
title: Prove durable active Runtime promotion against authenticated authority
status: completed
priority: 428
milestone: M10
model_tier: free
risk: low
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-123
context_paths:
  - AGENTS.md
  - docs/current/PROJECT_STATE.md
  - docs/current/CURRENT_MILESTONE.md
  - project_docs/schedule/SPRINT_MODE.md
  - project_docs/execution_planning/P9-PACKAGE-01.md
  - project_docs/execution_planning/P9-ACTIVE-RUNTIME-PROMOTION-01.md
  - project_docs/10-deploy/WBS.md
  - project_docs/13-autonomous-runtime/WBS.md
  - packages/deploy/active-runtime.ts
  - packages/deploy/postgres-state.ts
  - tests/product/p8-hardened-activation-e2e.test.ts
  - tests/product/active-runtime-promotion.test.ts
  - docs/adr/ADR-0002-autonomous-runtime.md
  - docs/adr/ADR-0007-release-environment-deployment.md
  - specs/tasks/TASK-124-DURABLE-ACTIVE-RUNTIME-PROMOTION-EVIDENCE.md
allowed_paths:
  - tests/product/p9-active-runtime-promotion-e2e.test.ts
  - specs/tasks/TASK-124-DURABLE-ACTIVE-RUNTIME-PROMOTION-EVIDENCE.md
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

Close the Sprint with authenticated PostgreSQL evidence that live single-host managed process promotion follows the durable P8 authority and preserves the last-known-good process across stale/failed contenders.

# Context

TASK-122/123 establish Deploy-local orchestration semantics. This evidence-only TASK must prove them against the real authenticated PostgreSQL deployment authority rather than only an in-memory provider.

# Current behavior

P8 separately proves durable atomic authority and P9 Sprint 1 proves managed process lifecycle. After TASK-123 the live-process transition can be exercised with the same `DeploymentRegistry` backed by `PostgresDeploymentRecordStorage`.

# Required change

Add E2E evidence using actual compiler/release/artifact APIs, authenticated PostgreSQL Deploy authority and the active-runtime orchestrator. Prove A activation, B promotion, stale C rejection and a failed contender while Builder/Observe are unavailable.

# Inputs / contracts

Existing Factory/compiler/release/artifact APIs, authenticated PostgreSQL Deploy provider, TASK-123 active-runtime orchestration, ADR-0002 and ADR-0007.

# Outputs / contracts

No product changes. Deterministic E2E evidence only.

# Acceptance criteria

- actual executable Factory/compiler/release/artifact inputs are used;
- authenticated PostgreSQL authority activates A and promotes B;
- B is durable active authority after promotion;
- stale successful C is rejected/cleaned and cannot terminate B;
- failed contender cannot alter authority or terminate B;
- reconstructed PostgreSQL authority reports B while B remains health-queryable;
- Builder/Observe may be unavailable;
- no credentials/secrets appear in serialized evidence;
- no `packages/**` changes are required;
- declared validations pass.

# Non-goals

Restart reconciliation of a fresh process manager, process discovery after restart, external traffic/fleet topology, canonical contracts, package review.

# Evidence expected

One focused package-growing E2E test using the authenticated CI PostgreSQL fixture and actual upstream module APIs.

# Escalation

Evidence-only TASK. If the proof requires product/contract/topology changes, stop and escalate rather than editing `packages/**`.

# Implementation evidence

Added evidence-only product E2E coverage using real Catalog/Assembly/Validation/Compiler/Release/Artifact APIs, the authenticated PostgreSQL Deploy authority and the TASK-123 orchestrator. The proof covers A activation, B promotion, stale C cleanup, failed contender retention, fresh durable-authority reconstruction and live B health while Builder/Observe are unavailable, with credential-leak assertions.
