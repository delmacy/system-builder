---
id: TASK-110
title: Harden Deploy PostgreSQL authentication transport
status: completed
priority: 400
milestone: M9
model_tier: cheap
risk: medium
architecture_impact: false
executor_preference: any
depends_on: []
context_paths:
  - AGENTS.md
  - docs/current/PROJECT_STATE.md
  - docs/current/CURRENT_MILESTONE.md
  - project_docs/schedule/SPRINT_MODE.md
  - project_docs/execution_planning/P8-PACKAGE-01.md
  - project_docs/execution_planning/P8-DEPLOY-POSTGRES-TRANSPORT-01.md
  - project_docs/10-deploy/WBS.md
  - packages/deploy/postgres-state.ts
  - packages/deploy/storage.ts
  - tests/product/deploy-postgres.test.ts
  - .github/workflows/ci.yml
  - docs/adr/ADR-0002-autonomous-runtime.md
  - docs/adr/ADR-0007-release-environment-deployment.md
  - specs/tasks/TASK-102-POSTGRES-DEPLOYMENT-STATE.md
  - specs/tasks/TASK-110-DEPLOY-POSTGRES-AUTH-TRANSPORT.md
allowed_paths:
  - packages/deploy/postgres-state.ts
  - tests/product/deploy-postgres.test.ts
  - .github/workflows/ci.yml
  - specs/tasks/TASK-110-DEPLOY-POSTGRES-AUTH-TRANSPORT.md
forbidden_paths:
  - packages/contracts/**
  - packages/catalog/**
  - packages/assembly/**
  - packages/compiler/**
  - packages/release/**
  - packages/artifact-store/**
  - packages/runtime-core/**
  - packages/deploy/index.ts
  - packages/deploy/storage.ts
  - packages/deploy/local-deployment.ts
  - packages/deploy/local-process.ts
  - apps/**
  - tooling/**
  - docs/adr/**
  - package.json
  - package-lock.json
max_files: 4
validation:
  - npm run test:product
  - npm run verify
---

# Objective

Replace the Deploy PostgreSQL provider's trust-only authentication limitation with bounded authenticated transport support while keeping the existing provider boundary and sanitized diagnostics.

# Context

P7 proved durable Deploy reconstruction but `PostgresDeploymentRecordStorage` still implements the PostgreSQL wire protocol directly over `node:net` and rejects every authentication mode except AuthenticationOk. P8 selects Deploy transport hardening as the first successor because durable activation authority now depends on this proof-grade transport.

# Current behavior

Before this TASK, `postgres-state.ts` parsed no password, supported no SCRAM/cleartext password exchange, had no configurable SSL negotiation and failed authenticated PostgreSQL with `DEPLOY_POSTGRES_AUTH_UNSUPPORTED`.

# Required change

Within the Deploy-owned provider only, add password-aware PostgreSQL startup/authentication handling sufficient for PostgreSQL 17 SCRAM-SHA-256 and bounded cleartext/MD5 password compatibility, plus explicit `sslmode=disable|prefer|require` negotiation. Preserve hard-coded/sanitized error categories so connection strings, usernames and passwords never enter errors or persisted evidence.

Add an independent authenticated PostgreSQL 17.6 CI service on a different host port and expose its test URL only as CI fixture input, leaving the predecessor trust-auth service unchanged for other bounded contexts.

# Inputs / contracts

Existing `DeploymentRecordStorage`, `PostgresDeploymentRecordStorage`, PostgreSQL protocol semantics, P8 package authority, WBS 10.3 and ADR-0002/0007.

# Outputs / contracts

Deploy-internal authenticated transport capability plus focused product tests. No canonical contract or cross-context provider change.

# Acceptance criteria

- existing trust-auth PostgreSQL behavior remains green;
- an actual PostgreSQL 17.6 service requiring password/SCRAM authentication is accepted by the Deploy provider;
- invalid credentials fail closed with a stable sanitized error that contains no connection/user/password material;
- connection-string parsing accepts password only as runtime transport material and never persists/serializes it;
- `sslmode=disable`, `prefer` and `require` are parsed deterministically; required TLS fails closed when unavailable;
- no external npm dependency is introduced;
- existing DeploymentRecord storage semantics remain unchanged;
- positive, negative and predecessor regression evidence pass;
- declared validations pass.

# Non-goals

Pooling, transaction semantics, atomic active-pointer updates, shared PostgreSQL transport extraction, production certificate policy, traffic/fleet orchestration or canonical contract changes.

# Evidence expected

Focused product tests against both the existing trust-auth PostgreSQL service and a new authenticated PostgreSQL 17.6 CI service, plus negative invalid-credential/diagnostic assertions and repository verification.

# Escalation

Stop if authentication support requires changing another bounded context, adding an external dependency, changing a canonical contract, or weakening CI/security policy.
