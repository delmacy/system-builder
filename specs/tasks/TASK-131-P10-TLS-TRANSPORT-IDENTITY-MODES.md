---
id: TASK-131
title: Add positive TLS server-identity verification modes to the Postgres transport
status: verification
priority: 453
milestone: M10
model_tier: cheap
risk: high
architecture_impact: false
executor_preference: any
depends_on: []
context_paths:
  - AGENTS.md
  - docs/current/PROJECT_STATE.md
  - docs/current/CURRENT_MILESTONE.md
  - project_docs/schedule/SPRINT_MODE.md
  - project_docs/execution_planning/P10-PACKAGE-01.md
  - project_docs/execution_planning/P10-TLS-SERVER-IDENTITY-01.md
  - docs/adr/ADR-0015-tls-server-identity-verification.md
  - packages/postgres/index.ts
  - tests/product/deploy-postgres.test.ts
  - specs/tasks/TASK-110-DEPLOY-POSTGRES-AUTH-TRANSPORT.md
  - specs/tasks/TASK-131-P10-TLS-TRANSPORT-IDENTITY-MODES.md
allowed_paths:
  - packages/postgres/index.ts
  - tests/product/postgres-tls.test.ts
  - tests/product/deploy-postgres.test.ts
  - specs/tasks/TASK-131-P10-TLS-TRANSPORT-IDENTITY-MODES.md
forbidden_paths:
  - apps/**
  - packages/contracts/**
  - packages/runtime-core/**
  - packages/deploy/**
  - packages/release/**
  - packages/artifact-store/**
  - packages/compiler/**
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

Extend the shared PostgreSQL transport (`packages/postgres`) with positive server-identity verification modes `verify-ca` and `verify-full`, deterministic CA-source parsing and fail-closed verification diagnostics, per ADR-0015.

# Context

`TD-P8-02` was escalated to an ADR because positive TLS identity verification is an L3/L4-adjacent security-policy change. ADR-0015 is now accepted by a human and scopes this Sprint to the PostgreSQL transport and its rendered Runtime counterpart and their tests/docs. The transport currently negotiates TLS with `rejectUnauthorized: false` and supports only `sslmode=disable|prefer|require`; `verify-full` is rejected as `SSLMODE_INVALID`.

# Current behavior

`packages/postgres/index.ts` `parsePostgresConnection` accepts only `disable | prefer | require` and throws `POSTGRES_SSLMODE_INVALID` for `verify-full`/`verify-ca`. `connectPostgres` creates the TLS session with `rejectUnauthorized: false`, so the server identity is never positively verified.

# Required change

Add `verify-ca` and `verify-full` to the transport:

1. parse and validate the positive modes deterministically and reject unknown/malformed positive modes with a stable diagnostic;
2. accept a trusted-CA source through the standard connection parameter and fail closed with an explicit diagnostic when a positive mode is requested without one;
3. verify chain trust and, for `verify-full`, hostname binding against the target server;
4. never fall back to a lenient session when verification cannot be satisfied.

# Inputs / contracts

`packages/postgres/index.ts`, ADR-0015 (Decision + Scope + Backward compatibility), WBS 10.1.3/10.2.2, ADR-0007 no-embedding invariant.

# Outputs / contracts

Positive-identity verification modes on the shared transport. The `disable | prefer | require` contract is unchanged. No canonical contract or cross-package change.

# Acceptance criteria

- `sslmode=verify-ca` and `sslmode=verify-full` are accepted and positively verified;
- unknown/malformed positive modes are rejected deterministically (`SSLMODE_INVALID` or equivalent stable code);
- a positive mode without a trusted-CA source fails closed with an explicit diagnostic;
- chain-trust failure and (for `verify-full`) hostname mismatch fail closed with a deterministic diagnostic;
- no silent downgrade to a lenient session;
- connection strings/credentials never enter errors or durable evidence;
- declared validations pass.

# Non-goals

Rendering into the autonomous Runtime entrypoint (TASK-133), changing the `disable | prefer | require` semantics, canonical contract changes, SecretResolver changes, external npm dependencies, CI/tooling changes.

# Evidence expected

Focused product tests in `tests/product/postgres-tls.test.ts` covering positive, negative and identity-mismatch cases, plus updating the existing `verify-full` rejection assertion in `tests/product/deploy-postgres.test.ts`, plus GitHub Deterministic CI.

# Implementation evidence

To be implemented on `sprint/P10-TLS-SERVER-IDENTITY-01`. CI validation required before TASK-132 is eligible.

# Escalation

Stop if implementation requires changing canonical contracts, the Runtime entrypoint, another package boundary, or the existing `sslmode` parsing contract without escalation.
