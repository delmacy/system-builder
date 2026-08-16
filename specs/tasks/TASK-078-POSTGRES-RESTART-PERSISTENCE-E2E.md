---
id: TASK-078
title: Prove PostgreSQL state persistence across Runtime redeploy
status: ready
priority: 388
milestone: M5
model_tier: cheap
risk: medium
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-077
context_paths:
  - AGENTS.md
  - docs/current/PROJECT_STATE.md
  - docs/current/CURRENT_MILESTONE.md
  - project_docs/schedule/SPRINT_MODE.md
  - project_docs/execution_planning/P4-PACKAGE-01.md
  - project_docs/execution_planning/P4-POSTGRES-STATE-01.md
  - docs/adr/ADR-0002-autonomous-runtime.md
  - docs/adr/ADR-0007-release-environment-deployment.md
  - project_docs/10-deploy/WBS.md
  - project_docs/13-autonomous-runtime/WBS.md
  - .github/workflows/ci.yml
  - packages/compiler/index.ts
  - packages/artifact-store/index.ts
  - packages/deploy/local-process.ts
  - packages/deploy/secret-resolver.ts
  - packages/release/index.ts
  - tests/product/full-autonomous-local-e2e.test.ts
  - specs/tasks/TASK-077-DEPLOY-POSTGRES-MIGRATION-APPLICATION.md
  - specs/tasks/TASK-078-POSTGRES-RESTART-PERSISTENCE-E2E.md
allowed_paths:
  - .github/workflows/ci.yml
  - tests/product/postgres-state-e2e.test.ts
  - specs/tasks/TASK-078-POSTGRES-RESTART-PERSISTENCE-E2E.md
forbidden_paths:
  - apps/**
  - packages/**
  - tooling/agent-harness/**
  - docs/adr/**
max_files: 3
validation:
  - npm run test:product
  - npm run verify
---

# Objective

Prove the real integrated P4 PostgreSQL path against an ephemeral PostgreSQL service in GitHub Deterministic CI, including migration application and state persistence across two clean Runtime deployments.

# Context

TASK-076 supplies the generated Runtime PostgreSQL state adapter and TASK-077 applies verified migrations before activation. The repository CI currently has no PostgreSQL service, so durable persistence is not yet objectively proven.

# Current behavior

Deterministic CI runs `npm run verify` on Ubuntu/Node 24 without external services. Product tests prove only in-memory state and migration preflight/application boundaries.

# Required change

Add an isolated PostgreSQL service to the existing Deterministic CI validate job and expose only a test connection URL through CI environment. Add one product E2E that skips when the explicit CI PostgreSQL URL is absent, but in CI compiles/publishes the actual stateful artifact, resolves its symbolic database secret, deploys it twice against the same database, and proves migration apply-then-skip plus persisted counter progression across restart. Add a negative changed-hash migration case that fails before activation without leaking the connection value.

# Inputs / contracts

Actual Compiler, ArtifactStore, ReleaseRegistry, SecretResolver, local Deploy and generated autonomous Runtime outputs from TASK-076/077.

# Outputs / contracts

CI evidence only; no product contract or implementation change.

# Acceptance criteria

- GitHub validate job starts a pinned PostgreSQL service with health check;
- CI provides a bounded `SYSTEM_BUILDER_TEST_POSTGRES_URL` only to tests/process environment, never generated immutable files;
- actual Compiler output and ArtifactStore verification are used;
- first deployment applies migration and reaches persisted state value 2;
- second clean deployment skips the same migration and reaches persisted state value 4, proving restart/redeploy persistence;
- Builder/Observe-unavailable addresses do not block ordinary Runtime database/state operation;
- changed migration content under the same applied identity/hash key is rejected before activation;
- connection value does not appear in ReleaseArtifact, generated migration manifest, Deployment evidence, health/state payload, stdout/stderr or failure diagnostic;
- the PostgreSQL E2E is demonstrably executed (not skipped) in the final GitHub Deterministic CI run;
- repository-wide `npm run verify` passes.

# Non-goals

Production database provisioning, HA/backup, production TLS/auth coverage, capability-driven action generation, supervisor/traffic/rollback or successor Sprint work.

# Evidence expected

GitHub Deterministic CI job log/test summary showing the PostgreSQL E2E executed and passed, plus repository-wide verification.

# Escalation

Stop if the proof requires product-code changes beyond TASK-076/077 outputs or weakens secret/autonomy boundaries.
