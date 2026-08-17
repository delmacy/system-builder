# P6-PACKAGE-01 — Durable Factory and Release Infrastructure

Status: ACTIVE_PACKAGE / SECOND_SPRINT_COMMITTED
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
- WBS 09.1/09.2/09.3 authorize preserved release identity/lifecycle plus abstract registry/storage distribution.
- Existing `ArtifactPayloadRepository` interfaces remain the provider-neutral storage contract for artifact payload behavior.
- No L4 architecture change is planned. Any canonical shared-contract or Release/Environment/Deployment boundary change requires escalation.

## Construction sequence

### 1. P6-DURABLE-CATALOG-01 — MERGED

Merged through PR #179 at `b6b96120dbb19b00f78b6965cb9590a680f2056f`.

Achieved proof:

`register normalized catalog records -> persist in PostgreSQL -> reconstruct provider/process -> deterministic list/resolution equivalent -> actual Assembly transitive proof equivalent`

Public Catalog and Assembly semantics remained unchanged.

### 2. P6-DURABLE-RELEASE-ARTIFACT-01 — COMMITTED / NOT_STARTED

Base: `b6b96120dbb19b00f78b6965cb9590a680f2056f`

Branch: `sprint/P6-DURABLE-RELEASE-ARTIFACT-01`

Objective: introduce replaceable durable persistence for PublishedRelease and ArtifactPayload while preserving exact current identity, provenance, lifecycle, immutable publication, idempotence/conflict and verification semantics.

Materialized TASKs:
- TASK-094 — define internal Release persistence boundary around current ReleaseRegistry semantics;
- TASK-095 — implement PostgreSQL reference durable Release provider;
- TASK-096 — implement PostgreSQL reference durable ArtifactPayloadRepository;
- TASK-097 — prove restart-safe durable Release + Artifact retrieval/verification integration.

Dependency order:

`TASK-094 -> TASK-095 -> TASK-096 -> TASK-097`

Expected exit proof:

`publish deterministic ReleaseArtifact -> durable PublishedRelease + ArtifactPayload -> reconstruct providers/process -> equivalent release retrieval/lifecycle -> verified artifact retrieval with unchanged integrity checks`

Constraints:
- no PublishedRelease public-shape or lifecycle-policy change;
- no ArtifactPayloadRepository interface/verification semantic change;
- no Compiler, Deploy, Runtime, Catalog, Assembly or canonical-contract source change;
- no secrets/environment values embedded into Release or artifact metadata;
- PostgreSQL remains a bounded Factory-side reference implementation;
- production database auth/pooling/TLS/concurrency are non-goals unless separately authorized.

### 3. P6-DURABLE-FACTORY-E2E-01 — FORECAST / NOT_MATERIALIZED

Dependency: P6-DURABLE-RELEASE-ARTIFACT-01 merged and revalidated.

Objective remains proving the complete deterministic Factory chain across persistence/restart boundaries without changing product semantics.

No Sprint manifest or TASK spec is materialized.

### 4. P6 Integration & Technical Debt Review — FORECAST / MANDATORY / NOT_MATERIALIZED

Materialize only after all three construction Sprints merge.

Review scope remains repository-wide regression, TD-P4-01/TD-P5-04 disposition, WBS/ADR revalidation, durability risks and successor readiness from then-current main.

## Growing E2E proof

Current integrated predecessor:

`durable Catalog -> deterministic Assembly/Validation/Compiler -> ReleaseArtifact -> process-local PublishedRelease + verified ArtifactPayload -> Deploy -> autonomous Runtime`

The active Sprint is committed only to make PublishedRelease and ArtifactPayload durable across provider/process reconstruction. The full durable Factory-to-Deploy E2E remains the forecast third Sprint.

## Risks and change control

High:
- preserving immutable release/artifact identity and integrity across persistence/reconstruction;
- lifecycle persistence without enabling overwrite or invalid transition.

Medium-High:
- using PostgreSQL as reference storage without making it part of Release/Artifact consumer contracts;
- bounded schema/transport implementation without falsely claiming production database lifecycle completeness.

Escalate rather than broaden if implementation requires canonical contract changes, Compiler/Deploy/Runtime source changes, Release/Environment/Deployment boundary changes, secret persistence, destructive migration, or altered public identity/lifecycle/verification semantics.

## Commitment gate

Only `P6-DURABLE-RELEASE-ARTIFACT-01` is COMMITTED. TASK-094/095/096/097 are materialized but NOT_STARTED.

`P6-DURABLE-FACTORY-E2E-01` and the Integration & Technical Debt Review remain FORECAST / NOT_MATERIALIZED and require fresh predecessor revalidation plus explicit authorization before promotion.
