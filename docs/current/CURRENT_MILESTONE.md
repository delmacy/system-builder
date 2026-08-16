# Current Execution Milestone — M5 P4 PostgreSQL Durable State Sprint

## Goal

Execute `P4-POSTGRES-STATE-01` from the actual merged P4 migration/preflight baseline and prove durable PostgreSQL state across clean Runtime redeploy.

## Integrated baseline

P4-MIGRATION-STATE-01 is merged through PR #168 at `b0b3e4c9fcbb21e0fc944a12ca16636b0dd82ae2`.

Merged predecessor proof:

`AssemblyPlan bounded capability -> Compiler -> migration/runtime assets -> ReleaseArtifact -> verified ArtifactPayload -> Deploy migration preflight`

## Active Sprint

`P4-POSTGRES-STATE-01 — PostgreSQL Durable Runtime State`

Branch: `sprint/P4-POSTGRES-STATE-01`

Committed dependency order:

1. TASK-076 — bounded PostgreSQL Runtime state adapter;
2. TASK-077 — verified/idempotent Deploy migration application;
3. TASK-078 — actual PostgreSQL restart/redeploy persistence E2E.

## Architecture constraints

- ADR-0002 Builder/Runtime separation remains mandatory;
- ADR-0007 Release/Environment/Deployment separation remains mandatory;
- generated Runtime remains autonomous and self-contained apart from external Environment/runtime infrastructure;
- database secrets remain external and runtime/deploy-only;
- no canonical ReleaseArtifact/EnvironmentProfile/DeploymentRecord schema expansion;
- PostgreSQL provider behavior remains bounded, not canonical shared policy;
- any L4 discovery stops for ADR.

## Sprint gate

Complete TASK-076..078 in order with one distinct implementation commit per TASK, run repository-wide Deterministic CI, commit the Sprint Report and stop at PR Sprint Review.

`P4-CAPABILITY-RUNTIME-01` remains forecast / not authorized.
