---
id: TASK-133
title: Render positive TLS verification into the Runtime and prove authenticated positive-verification E2E
status: ready
priority: 455
milestone: M10
model_tier: cheap
risk: high
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-132
context_paths:
  - AGENTS.md
  - docs/current/PROJECT_STATE.md
  - docs/current/CURRENT_MILESTONE.md
  - project_docs/schedule/SPRINT_MODE.md
  - project_docs/execution_planning/P10-PACKAGE-01.md
  - project_docs/execution_planning/P10-TLS-SERVER-IDENTITY-01.md
  - project_docs/execution_planning/P9-RUNTIME-RECONCILIATION-E2E-01.report.md
  - project_docs/10-deploy/WBS.md
  - docs/adr/ADR-0002-autonomous-runtime.md
  - docs/adr/ADR-0007-release-environment-deployment.md
  - docs/adr/ADR-0015-tls-server-identity-verification.md
  - docs/architecture/MASTER_BLUEPRINT.md
  - packages/postgres/index.ts
  - packages/runtime-core/postgres-state.ts
  - packages/runtime-core/index.ts
  - specs/tasks/TASK-131-P10-TLS-TRANSPORT-IDENTITY-MODES.md
  - specs/tasks/TASK-132-P10-TLS-IDENTITY-FAILCLOSED-SAFETY.md
  - specs/tasks/TASK-133-P10-TLS-RUNTIME-POSITIVE-E2E.md
allowed_paths:
  - packages/runtime-core/postgres-state.ts
  - tests/product/postgres-tls-rendered-runtime-e2e.test.ts
  - specs/tasks/TASK-133-P10-TLS-RUNTIME-POSITIVE-E2E.md
forbidden_paths:
  - apps/**
  - packages/contracts/**
  - packages/postgres/**
  - packages/deploy/**
  - packages/release/**
  - packages/artifact-store/**
  - packages/compiler/**
  - docs/adr/**
  - .github/**
  - tooling/**
  - package.json
  - package-lock.json
max_files: 3
validation:
  - npm run test:product
  - npm run verify
---

# Objective

Render the same positive TLS server-identity verification into the autonomous Runtime entrypoint and prove the growing package E2E: a rendered Runtime performs `verify-ca`/`verify-full` verification against a real TLS server, including an authenticated (SCRAM) positive-verification E2E.

# Context

`TASK-131`/`TASK-132` provide and harden the transport positive modes. ADR-0015 requires the rendered Runtime entrypoint in `packages/runtime-core/postgres-state.ts` to honor the same identity mode and CA configuration so a deployed autonomous Runtime performs the same positive verification, reading configuration from its runtime environment (resolved by SecretResolver) and never embedding CA/credential material in artifacts or durable evidence.

# Current behavior

The rendered Runtime entrypoint creates its PostgreSQL TLS session with `rejectUnauthorized: false` and supports only `disable | prefer | require`; it does not verify server identity.

# Required change

Render `verify-ca`/`verify-full` (with the trusted-CA source) into the autonomous Runtime entrypoint, fail closed on verification failure, and prove with a product E2E test that the rendered Runtime positively verifies the server identity and authenticates (SCRAM) over a verified session.

# Inputs / contracts

`packages/runtime-core/postgres-state.ts` rendering, ADR-0002 Runtime autonomy, ADR-0007 no-embedding invariant, ADR-0015 Runtime rendering section, WBS 10.1.3/10.2.2.

# Outputs / contracts

Rendered Runtime honors positive identity verification. No canonical contract change; CA/credential material stays out of durable Release/Deployment evidence and rendered artifacts.

# Acceptance criteria

- rendered Runtime accepts `verify-ca`/`verify-full` and positively verifies the server;
- rendered Runtime fails closed deterministically when verification cannot be satisfied;
- an authenticated (SCRAM) positive-verification E2E proves a verified, authenticated session;
- no CA or credential material enters durable evidence or rendered artifacts;
- Runtime autonomy (Builder/Observe unavailable) preserved;
- declared validations pass.

# Non-goals

Canonical contract changes, SecretResolver changes, other package boundaries, external npm dependencies, CI/tooling changes, migration-default flips.

# Evidence expected

`tests/product/postgres-tls-rendered-runtime-e2e.test.ts` extends the package E2E chain with the rendered Runtime and an authenticated positive-verification E2E, plus GitHub Deterministic CI.

# Implementation evidence

To be implemented on `sprint/P10-TLS-SERVER-IDENTITY-01` as the Sprint-closing TASK. CI validation required before Sprint Review.

# Escalation

Stop if implementation requires changing canonical contracts, the transport, another package boundary, or any L3/L4 boundary without escalation.
