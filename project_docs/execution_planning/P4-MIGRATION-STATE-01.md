# P4-MIGRATION-STATE-01 — Deterministic State and Migration Materialization

Status: REVIEW_PREPARATION / IMPLEMENTATION_CI_PASS
Package: `P4-PACKAGE-01`
Base SHA: `5f628b7c72f9e9fc0db799e0bd97b2d1997b1572` (PR #167 merged)
Branch: `sprint/P4-MIGRATION-STATE-01`
PR: #168

## Goal

Establish a bounded provider-neutral Runtime state/migration convention, make actual Compiler output carry deterministic migration assets for one narrow stateful capability, and extend verified Deploy preflight through migration discovery/integrity/ordering without applying database infrastructure yet.

## Authority

`P4-PACKAGE-01` authorized this first construction Sprint after package-plan merge and repository revalidation. WBS 8.1.1/8.1.2 authorize deterministic schema/migration/code materialization; WBS 10.2.1 authorizes migration preparation before deployment; WBS 13.1.1/13.1.3 authorize materialized Runtime actions and external configuration. ADR-0002 and ADR-0007 remain unchanged.

This Sprint explicitly authorized the bounded L3 shared metadata needed for `RuntimeStateRequirement` and migration descriptors between Runtime Core, Compiler and Deploy. It did not authorize canonical `packages/contracts/**` changes or any L4 Builder/Runtime or Release/Environment/Deployment redesign.

## TASK results

1. `TASK-073` — completed at `88bc3d4dc38d84ab516c0e08c519bd61768ab55b`; CI #232 PASS.
2. `TASK-074` — completed at `3cfa5073b2d565e1a517442b435993b0601bdb52`; CI #233 PASS.
3. `TASK-075` — completed at `c90f755c5def49ce1968b5c7f1ac6d36264b0d55`; CI #235 PASS.

Dependency order preserved:

`TASK-072 -> TASK-073 -> TASK-074 -> TASK-075`

## Achieved proof

`AssemblyPlan bounded capability -> Compiler -> migration/runtime assets -> ReleaseArtifact -> verified ArtifactPayload -> Deploy migration preflight`

Evidence:

- state requirement uses only symbolic secret-binding metadata;
- invalid/duplicate/traversal migration descriptors fail closed;
- Compiler emits deterministic migration files and migration manifest covered by ReleaseArtifact integrity;
- state binding must be a required secret-reference environment requirement;
- Deploy preflight runs after verified ArtifactPayload retrieval and before secret resolution/materialization;
- malformed/missing/hash-mismatched migration evidence fails before activation;
- predecessor artifacts without migrations return an empty successful preflight;
- migration content is never executed and no PostgreSQL connection is opened.

## Validation

- TASK-073: Deterministic CI #232 PASS.
- TASK-074: Deterministic CI #233 PASS.
- TASK-075 implementation head: Deterministic CI #235 PASS.
- final closure-head repository verification: required before Sprint Review readiness.
- local execution is not claimed.

Detailed validation history and bounded correction attempts are recorded in `P4-MIGRATION-STATE-01.report.md`.

## Architecture disposition

No new ADR required. ADR-0002 and ADR-0007 are preserved; canonical ReleaseArtifact, EnvironmentProfile and DeploymentRecord contracts were not broadened.

## Review boundary

After closure-head Deterministic CI PASS, mark PR #168 ready for Sprint Review and stop. Do not create, materialize or execute `P4-POSTGRES-STATE-01` without a new explicit instruction after this Sprint merges.
