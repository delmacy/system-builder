# P6-PACKAGE-01 — Durable Factory and Release Infrastructure

Status: ACTIVE_PACKAGE / THIRD_SPRINT_COMMITTED
Planning base: `97e13c5ef66045f5c7d7aa11f20315e7dc02bf7f` (P5 Integration & Technical Debt Review merged through PR #177)
Package plan merged: PR #178 at `5806de40087ad36d8b6556d1cd4a7446b9db13c7`.

## Package Goal

Close the durability gap exposed by P5 without broadening Runtime behavior: preserve deterministic Catalog/Assembly/Compiler/Release identities while proving restart-safe provider-backed Catalog, PublishedRelease and ArtifactPayload persistence behind replaceable interfaces.

Target growing proof:

`durable Software Catalog -> deterministic Assembly/Validation/Compiler -> durable PublishedRelease + ArtifactPayload publication -> process restart -> equivalent retrieval/verification -> existing Deploy -> autonomous Runtime`

The package attacks `TD-P4-01` and `TD-P5-04` directly. It does not authorize production Deploy, production SecretResolver, broader generated Runtime capabilities, richer Catalog constraint policy, or materializer extensibility work.

## Planning authority and boundaries

- `AGENTS.md`, `SPRINT_GENERATION_POLICY.md` and `SPRINT_MODE.md` remain controlling.
- ADR-0002 remains controlling: durable Factory state must not introduce Runtime dependence on Builder.
- ADR-0007 remains controlling: Release remains immutable; Environment/secret material remains outside Release; Deployment remains the binding of Release + Environment.
- Existing public Catalog, Assembly, Validation, Compiler, Release, ArtifactStore, Deploy and Runtime semantics are frozen for the third construction Sprint.
- PostgreSQL remains a replaceable reference implementation detail.
- No L4 architecture change is planned. Any public contract or Builder/Runtime boundary change requires escalation.

## Construction sequence

### 1. P6-DURABLE-CATALOG-01 — MERGED

Merged through PR #179 at `b6b96120dbb19b00f78b6965cb9590a680f2056f`.

Achieved proof:

`register normalized catalog records -> persist in PostgreSQL -> reconstruct provider/process -> deterministic list/resolution equivalent -> actual Assembly transitive proof equivalent`

### 2. P6-DURABLE-RELEASE-ARTIFACT-01 — MERGED

Merged through PR #180 at `632a3bb294de442f8b8bdea2bdc96e0d9a84955d`.

Achieved proof:

`actual Compiler ReleaseArtifact -> durable PublishedRelease + ArtifactPayload -> reconstruct providers/process -> equivalent release retrieval/lifecycle -> verified artifact retrieval with unchanged integrity checks`

### 3. P6-DURABLE-FACTORY-E2E-01 — COMMITTED / NOT_STARTED

Base: `632a3bb294de442f8b8bdea2bdc96e0d9a84955d`

Branch: `sprint/P6-DURABLE-FACTORY-E2E-01`

Objective: combine the two already-integrated durability boundaries with the existing deterministic Factory, Deploy and autonomous Runtime in one restart-safe growing E2E proof without changing product semantics.

Materialized TASKs:
- TASK-098 — durable Catalog through Assembly/Validation/Compiler and reconstructed durable Release/Artifact into existing Deploy;
- TASK-099 — reconstructed durable Factory output through existing local Deployment into autonomous persisted Runtime;
- TASK-100 — deterministic/failure/autonomy regression closure of the P6 growing proof.

Dependency order:

`TASK-098 -> TASK-099 -> TASK-100`

Expected exit proof:

`durable Catalog -> deterministic Assembly/Validation/Compiler -> durable PublishedRelease + ArtifactPayload -> reconstruct Factory-side providers/process -> verified retrieval -> existing Deploy -> autonomous Runtime -> persisted state across redeploy`

Constraints:
- no public contract/source semantic redesign;
- use actual module APIs, not hand-authored downstream artifacts when executable modules exist;
- Release/Artifact remain secret-free;
- Environment/secret references remain outside Release;
- Runtime must keep operating independently of Builder/Factory provider instances;
- PostgreSQL transport hardening remains technical-debt review scope, not construction expansion.

### 4. P6 Integration & Technical Debt Review — FORECAST / MANDATORY / NOT_MATERIALIZED

Materialize only after all three construction Sprints merge.

Review scope remains repository-wide regression, TD-P4-01/TD-P5-04 disposition, WBS/ADR revalidation, durability/transport risks and successor readiness from then-current main.

## Growing E2E proof

Integrated main before Sprint 3:

`durable Catalog -> deterministic Assembly/Validation/Compiler -> durable PublishedRelease + verified ArtifactPayload -> existing Deploy -> autonomous Runtime`, with Catalog and Release/Artifact restart safety proven separately.

Sprint 3 must join those proofs across a common restart/reconstruction boundary and extend them through the existing Deploy/Runtime path.

## Risks and change control

High:
- accidentally proving a parallel synthetic path instead of the actual integrated modules;
- leaking provider/connection/secret details into Release or runtime artifacts;
- coupling Runtime execution to live Builder/Factory objects.

Medium:
- test lifecycle complexity across Catalog/Release/Artifact persistence plus Runtime PostgreSQL state;
- keeping evidence deterministic while processes/providers are reconstructed.

Escalate rather than broaden if the proof requires public API changes, canonical contract changes, Deploy/Runtime semantic changes, destructive migrations, secret persistence, CI workflow changes, or a new architecture boundary.

## Commitment gate

Only `P6-DURABLE-FACTORY-E2E-01` is COMMITTED. TASK-098/099/100 are materialized but NOT_STARTED.

The P6 Integration & Technical Debt Review remains FORECAST / NOT_MATERIALIZED and requires this Sprint to pass review and merge before promotion.
