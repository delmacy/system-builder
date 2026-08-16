# Current Execution Milestone — M5 Durable Stateful Runtime Package Planning

## Goal

Create the next rolling-wave Sprint Package from the merged P3 Integration & Technical Debt Review, prioritizing durable Runtime state/database + migrations and the first capability-driven generated Runtime slice.

## Integrated baseline

P3 construction and package review are merged through PR #166 at `18b9617f15c5a0329977c5470ba0c8bd054ef5e1`.

Integrated proof:

`SystemDefinition -> Catalog -> AssemblyPlan -> ValidationEvidence -> ReleaseArtifact -> PublishedRelease -> verified ArtifactPayload -> EnvironmentProfile secret refs -> external SecretResolver -> local Deploy -> persistent Runtime -> HTTP RuntimeHealth -> counter.increment (1 -> 2) -> clean shutdown -> DeploymentRecord`

## Proposed package

`P4-PACKAGE-01 — Durable Stateful Runtime and Capability Materialization`

Forecast sequence:

1. `P4-MIGRATION-STATE-01` — deterministic state/migration materialization;
2. `P4-POSTGRES-STATE-01` — PostgreSQL durable Runtime state and restart persistence;
3. `P4-CAPABILITY-RUNTIME-01` — capability-driven durable Runtime action;
4. Integration & Technical Debt Review.

Candidate TASKs: TASK-073..081, forecast only.

## Architecture constraints

- ADR-0002 Builder/Runtime separation remains mandatory;
- ADR-0007 Release/Environment/Deployment separation remains mandatory;
- resolved secret values must remain outside immutable artifact/release/deployment evidence;
- migrations/runtime behavior must be deterministic products of accepted inputs;
- PostgreSQL is the initial target topology, not a reason to embed provider-specific policy into shared contracts;
- L4 discoveries require ADR rather than silent architecture change.

## Successor gate

Stop at the P4 package-plan PR after Deterministic CI. No P4 construction Sprint is authorized until the package plan merges and a new explicit instruction re-reads repository authority.
