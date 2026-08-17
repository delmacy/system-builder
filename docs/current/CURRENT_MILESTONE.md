# Current Execution Milestone — M7 P6 Durable Release/Artifact Sprint Review

## Goal

Close the second P6 construction Sprint after proving restart-safe durable PublishedRelease and ArtifactPayload providers without changing current Release, ArtifactStore, Deploy or Runtime semantics.

## Integrated baseline

P6-DURABLE-CATALOG-01 merged through PR #179 at:

`b6b96120dbb19b00f78b6965cb9590a680f2056f`

Predecessor proof:

`normalized Catalog registration -> durable PostgreSQL persistence -> provider/process reconstruction -> equivalent deterministic Catalog resolution -> actual transitive AssemblyPlan`

## Active Sprint

`P6-DURABLE-RELEASE-ARTIFACT-01 — Durable Release and Artifact Providers`

Branch: `sprint/P6-DURABLE-RELEASE-ARTIFACT-01`

PR: #180

Status: `SPRINT_REVIEW_PREPARATION / IMPLEMENTATION_CI_PASS`.

Completed order:
1. TASK-094 — PASS / CI #289;
2. TASK-095 — PASS / CI #290;
3. TASK-096 — PASS / CI #291;
4. TASK-097 — PASS / CI #292.

## Achieved growing proof

`durable Catalog predecessor -> actual Compiler ReleaseArtifact -> durable PublishedRelease + ArtifactPayload -> reconstruct providers/process -> equivalent release retrieval/lifecycle + verified ArtifactPayload retrieval`

## Architecture constraints preserved

- `PublishedRelease` shape and ReleaseRegistry observable semantics unchanged;
- release identity, duplicate rejection, lifecycle transitions and immutable snapshots unchanged;
- ArtifactPayloadRepository interfaces and publication/idempotence/conflict semantics unchanged;
- per-file, manifest and aggregate hash verification behavior unchanged;
- secrets and environment values remain outside Release and Artifact payload metadata;
- PostgreSQL remains replaceable Factory-side implementation detail;
- no Deploy, Runtime, Compiler, Catalog, Assembly or canonical-contract source change;
- ADR-0002 and ADR-0007 remain controlling and unchanged.

## Current gate

Run final closure-head Deterministic CI after the administrative closure commit. If PASS, mark the existing PR #180 Ready for Sprint Review and stop.

`P6-DURABLE-FACTORY-E2E-01` and the package Integration & Technical Debt Review remain FORECAST / NOT_MATERIALIZED.
