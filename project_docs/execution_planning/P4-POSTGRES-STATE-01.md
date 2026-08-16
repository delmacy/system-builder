# P4-POSTGRES-STATE-01 — PostgreSQL Durable Runtime State

Status: ACTIVE / COMMITTED
Package: `P4-PACKAGE-01 — Durable Stateful Runtime and Capability Materialization`
Base: `b0b3e4c9fcbb21e0fc944a12ca16636b0dd82ae2` (P4-MIGRATION-STATE-01 merged through PR #168)
Branch: `sprint/P4-POSTGRES-STATE-01`

## Sprint Goal

Implement the first bounded PostgreSQL-backed Runtime state path, apply verified Compiler-generated migrations before Runtime activation, and prove state survives a clean Runtime restart/redeploy using actual PostgreSQL in deterministic CI.

Target proof:

`verified ArtifactPayload -> migration preflight -> SecretResolver -> PostgreSQL migration apply -> persistent autonomous Runtime -> counter state -> clean shutdown -> redeploy -> prior state retained`

## Revalidation result

The merged predecessor proves deterministic migration assets and fail-closed Deploy preflight but does not execute SQL or open PostgreSQL. WBS 10.2.1/10.2.2 and 13.1.1/13.1.3 support migration preparation/application and externally configured Runtime state. ADR-0002 and ADR-0007 remain sufficient; no L4 change or new ADR is required.

The bounded Runtime implementation must remain self-contained after materialization and may depend only on the declared PostgreSQL Environment binding. It must not import Builder modules or require Builder/Observe availability at ordinary Runtime execution.

## Committed TASK order

1. `TASK-076` — bounded PostgreSQL Runtime state adapter;
2. `TASK-077` — verified/idempotent Deploy migration application;
3. `TASK-078` — actual PostgreSQL restart/redeploy persistence E2E in Deterministic CI.

Dependency chain:

`TASK-075 -> TASK-076 -> TASK-077 -> TASK-078`

## Scope freeze

### TASK-076

Purpose: make the generated Runtime use a bounded PostgreSQL state adapter when a `RuntimeStateRequirement` is present, while preserving predecessor behavior when no state requirement exists.

Allowed product areas: Runtime Core renderer + Compiler handoff only. No Deploy, canonical contracts, Release, ArtifactStore or CI changes.

### TASK-077

Purpose: apply the already verified/preflighted migration payload in deterministic order after secret resolution and before materialization/Runtime activation, with idempotent migration evidence and fail-closed behavior.

Allowed product area: Deploy only. No Runtime Core, Compiler, canonical contracts, Release or ArtifactStore changes.

### TASK-078

Purpose: prove the actual integrated path against an ephemeral PostgreSQL service in Deterministic CI, including persistence across two clean deployments and negative migration evidence.

Allowed areas: product E2E test + CI service configuration only. No product implementation changes.

## Architecture constraints

- ADR-0002 Builder/Runtime separation remains mandatory;
- ADR-0007 Release/Environment/Deployment separation remains mandatory;
- `RuntimeStateRequirement` remains the already accepted bounded state/migration contract;
- database connection material is supplied externally through the symbolic `secret-reference` binding and resolved only at Deploy/Runtime execution;
- generated Runtime must remain autonomous from Builder and Observe;
- no resolved secret may enter ReleaseArtifact, migration manifest, DeploymentRecord, health/state response or logs/evidence;
- PostgreSQL is a replaceable initial provider, not a new canonical shared-contract policy;
- no database provisioning, HA, backup/restore, production supervisor or traffic/rollback implementation;
- any required canonical public schema or L4 architecture change stops the Sprint for ADR.

## Validation strategy

Every TASK must run:

- `npm run test:product`
- `npm run verify`

TASK-078 additionally requires GitHub Deterministic CI with an actual ephemeral PostgreSQL service and must not claim a PostgreSQL E2E PASS from a skipped local test.

## Exit criteria

- Compiler-generated state requirement results in an autonomous generated Runtime that persists counter state in PostgreSQL rather than process memory;
- Deploy applies verified migration content before Runtime activation and skips an already-applied migration with the same identity/hash;
- an applied migration identity with a different hash fails before activation;
- two clean deployments using the same PostgreSQL database observe monotonic state across restart/redeploy;
- unresolved/malformed database connectivity fails without resolved-secret leakage;
- predecessor no-state and health-only paths remain green;
- repository-wide Deterministic CI passes on the final Sprint head;
- one distinct implementation commit exists per TASK;
- Sprint Report is committed and PR stops at Sprint Review.

## Explicit non-goals

- `P4-CAPABILITY-RUNTIME-01` / TASK-079..081;
- general generated CRUD/entities/workflows/auth/UI;
- durable Catalog/Release/Artifact provider adapters;
- dependency graph/semver/conflict solving;
- production SecretResolver providers/rotation;
- production PostgreSQL provisioning/HA/backup;
- Docker/Vercel/on-prem supervisor/traffic/TLS/rollback;
- Observe/Support implementation.

## Successor gate

Stop after this Sprint reaches `READY_FOR_SPRINT_REVIEW`. `P4-CAPABILITY-RUNTIME-01` remains forecast and must not start without this Sprint merge plus a new explicit instruction and repository revalidation.
