# P4-MIGRATION-STATE-01 — Deterministic State and Migration Materialization

Status: COMMITTED / EXECUTION_READY
Package: `P4-PACKAGE-01`
Base SHA: `5f628b7c72f9e9fc0db799e0bd97b2d1997b1572` (PR #167 merged)
Branch: `sprint/P4-MIGRATION-STATE-01`

## Goal

Establish a bounded provider-neutral Runtime state/migration convention, make actual Compiler output carry deterministic migration assets for one narrow stateful capability, and extend verified Deploy preflight through migration discovery/integrity/ordering without applying database infrastructure yet.

## Authority

`P4-PACKAGE-01` authorizes this first construction Sprint after package-plan merge and repository revalidation. WBS 8.1.1/8.1.2 authorize deterministic schema/migration/code materialization; WBS 10.2.1 authorizes migration preparation before deployment; WBS 13.1.1/13.1.3 authorize materialized Runtime actions and external configuration. ADR-0002 and ADR-0007 remain unchanged.

This Sprint explicitly authorizes the bounded L3 shared metadata needed for `RuntimeStateRequirement` and migration descriptors between Runtime Core, Compiler and Deploy. It does not authorize canonical `packages/contracts/**` changes or any L4 Builder/Runtime or Release/Environment/Deployment redesign.

## Committed TASKs

1. `TASK-073` — define bounded Runtime state/migration descriptor contract and persistence/secret boundaries;
2. `TASK-074` — make Compiler materialize deterministic migration assets and state requirements;
3. `TASK-075` — extend verified Deploy preflight through migration discovery, integrity and deterministic ordering.

Dependency order:

`TASK-072 -> TASK-073 -> TASK-074 -> TASK-075`

## Growing exit proof

`AssemblyPlan bounded capability -> Compiler -> migration/runtime assets -> ReleaseArtifact -> verified ArtifactPayload -> Deploy migration preflight`

Required evidence at Sprint exit:

- state requirement names a secret-reference binding but contains no resolved value/reference;
- deterministic migration descriptor validation rejects invalid/duplicate/traversal inputs;
- Compiler emits migration files plus deterministic migration manifest covered by ReleaseArtifact integrity;
- Compiler requires declared state connection bindings to exist as required secret-reference environment requirements;
- verified Deploy preflight occurs after ArtifactPayload verification, discovers exact migration coverage and returns deterministic order;
- malformed/missing/hash-mismatched migration evidence fails before activation/materialization;
- predecessor artifacts without migrations remain valid with an empty preflight;
- no migration is applied and no PostgreSQL connection is opened in this Sprint.

## Final validation

Each TASK declares `npm run test:product` and `npm run verify`. Sprint closure requires repository-wide `npm run verify` through GitHub Deterministic CI on the final Sprint head.

## Stop / escalation conditions

Stop immediately for:

- a required change to `packages/contracts/**`, ReleaseArtifact canonical schema or EnvironmentProfile canonical schema;
- any Builder/Runtime or Release/Environment/Deployment architecture change;
- production/destructive migration execution;
- a required path forbidden by a TASK;
- scope expansion into PostgreSQL application, durable registries, dependency solving, production secret providers or supervision.

## Review boundary

After TASK-075, Sprint report and final CI PASS, open one PR to `main` and stop at Sprint Review. Do not start `P4-POSTGRES-STATE-01` without a new explicit instruction after this Sprint merges.
