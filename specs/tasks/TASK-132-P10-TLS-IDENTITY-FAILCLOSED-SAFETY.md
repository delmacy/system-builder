---
id: TASK-132
title: Prove TLS identity verification fails closed with deterministic safety
status: verification
priority: 454
milestone: M10
model_tier: cheap
risk: high
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-131
context_paths:
  - AGENTS.md
  - docs/current/PROJECT_STATE.md
  - project_docs/schedule/SPRINT_MODE.md
  - project_docs/execution_planning/P10-PACKAGE-01.md
  - project_docs/execution_planning/P10-TLS-SERVER-IDENTITY-01.md
  - docs/adr/ADR-0015-tls-server-identity-verification.md
  - packages/postgres/index.ts
  - tests/product/postgres-tls.test.ts
  - specs/tasks/TASK-131-P10-TLS-TRANSPORT-IDENTITY-MODES.md
  - specs/tasks/TASK-132-P10-TLS-IDENTITY-FAILCLOSED-SAFETY.md
allowed_paths:
  - packages/postgres/index.ts
  - tests/product/postgres-tls.test.ts
  - specs/tasks/TASK-132-P10-TLS-IDENTITY-FAILCLOSED-SAFETY.md
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
max_files: 3
validation:
  - npm run test:product
  - npm run verify
---

# Objective

Prove that positive TLS server-identity verification never downgrades and always fails closed with deterministic diagnostics across negative cases, per ADR-0015 fail-closed requirement.

# Context

`TASK-131` adds `verify-ca`/`verify-full` to the transport. This TASK hardens and demonstrates the negative/failure behavior required by Sprint policy so the positive modes can be trusted at production runtime.

# Current behavior

Positive-verification negative behavior (untrusted CA, hostname mismatch, missing CA, malformed modes, no-silent-downgrade) is not yet asserted against a real TLS endpoint.

# Required change

Add focused product tests (and any bounded transport corrections that remain inside the ADR-0015 boundary) proving that untrusted chains, `verify-full` hostname mismatches, missing CA sources and unknown/malformed positive modes all fail closed with deterministic diagnostics and never fall back to a lenient session.

# Inputs / contracts

Transport positive modes from `TASK-131`, ADR-0015 fail-closed + diagnostic requirements, ADR-0007 no-value/credential-leakage invariant.

# Outputs / contracts

Asserted fail-closed and no-downgrade guarantees for the positive verification modes. No canonical contract change.

# Acceptance criteria

- untrusted CA fails closed with a deterministic diagnostic;
- `verify-full` hostname mismatch fails closed;
- positive mode without a CA source fails closed;
- unknown/malformed positive modes rejected deterministically;
- no lenient-session fallback is ever observed;
- diagnostics contain no connection string, credentials or CA material;
- declared validations pass.

# Non-goals

Rendered Runtime entrypoint behavior (TASK-133), canonical contract changes, external dependencies, CI/tooling changes.

# Evidence expected

Focused product tests in `tests/product/postgres-tls.test.ts` covering the negative/fail-closed matrix, plus GitHub Deterministic CI.

# Implementation evidence

To be implemented on `sprint/P10-TLS-SERVER-IDENTITY-01`. CI validation required before TASK-133 is eligible.

# Escalation

Stop if any required correction forces a canonical contract, the Runtime entrypoint, or an ADR/L4 change without escalation.
