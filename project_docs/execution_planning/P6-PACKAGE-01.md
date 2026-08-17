# P6-PACKAGE-01 — Durable Factory and Release Infrastructure

Status: ACTIVE_PACKAGE / FIRST_SPRINT_REVIEW
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
- WBS 05 authorizes durable preservation of Software Catalog registration/query semantics and catalog governance without coupling Catalog to one provider.
- WBS 09.3.1 remains forecast authority for later durable Release/Artifact work; it is not active Sprint scope.
- Existing provider-neutral ArtifactPayloadRepository semantics remain untouched in the first Sprint.

## Construction sequence

### 1. P6-DURABLE-CATALOG-01 — SPRINT_REVIEW_PREPARATION / IMPLEMENTATION_CI_PASS

Base: `5806de40087ad36d8b6556d1cd4a7446b9db13c7`

Branch: `sprint/P6-DURABLE-CATALOG-01`

PR: #179

Objective: introduce a replaceable durable Software Catalog storage boundary and one reference durable provider while preserving the exact current normalized record, duplicate identity, deterministic list and provider-neutral resolution semantics.

TASK results:
- TASK-091 — PASS at `9e04c25cf47d3a5afff56a446a96ba6ca78edcbd`; CI #281 PASS;
- TASK-092 — PASS at `09019e5f2ed050065a0f7a785f7a3204ba33ec1c`; CI #284 PASS;
- TASK-093 — PASS at `dcb19f799db131148593b75ddb893e5f4e149d0b`; CI #285 PASS.

Achieved exit proof:

`register normalized catalog records -> persist -> reconstruct provider/process -> deterministic list/resolution equivalent -> actual Assembly transitive proof equivalent`

The Sprint is not integrated until PR #179 passes closure-head CI, human Sprint Review and merge.

### 2. P6-DURABLE-RELEASE-ARTIFACT-01 — FORECAST / NOT_MATERIALIZED

Dependency: P6-DURABLE-CATALOG-01 merged and revalidated.

Objective remains durable PublishedRelease storage plus a durable ArtifactPayloadRepository implementation while preserving immutable identity, lifecycle transitions, payload integrity and secret-free Release semantics.

No Sprint manifest or TASK spec is materialized.

### 3. P6-DURABLE-FACTORY-E2E-01 — FORECAST / NOT_MATERIALIZED

Dependency: P6-DURABLE-RELEASE-ARTIFACT-01 merged and revalidated.

Objective remains proving the complete deterministic Factory chain across persistence/restart boundaries without changing product semantics.

No Sprint manifest or TASK spec is materialized.

### 4. P6 Integration & Technical Debt Review — FORECAST / MANDATORY / NOT_MATERIALIZED

Materialize only after all three construction Sprints merge.

Review scope remains repository-wide regression, TD-P4-01/TD-P5-04 disposition, WBS/ADR revalidation, durability risks and successor readiness from then-current main.

## Growing E2E proof

P5 predecessor:

`SystemDefinition -> bounded Catalog constraints/dependencies -> transitive AssemblyPlan -> ValidationEvidence -> materializer registry -> ReleaseArtifact -> PublishedRelease -> verified ArtifactPayload -> Deploy -> autonomous Runtime`

P6 first Sprint now proves durable Catalog provider/process reconstruction without resolution or Assembly drift. Later package stages remain forecast.

## Risks and change control

High:
- restart-safe identity/idempotence and persistence schema evolution without redefining Catalog semantics.

Medium-High:
- PostgreSQL is a bounded reference implementation; production auth/pooling/TLS/concurrency are not claimed by this Sprint.

Escalate rather than broaden future work if implementation requires canonical contract changes, Assembly semantic/source changes, Builder/Runtime or Release/Environment/Deployment boundary changes, or production traffic/supervision/secrets scope.

## Commitment gate

Only `P6-DURABLE-CATALOG-01` is active and is stopping at Sprint Review. All successor construction Sprints and the Integration & Technical Debt Review remain FORECAST / NOT_MATERIALIZED and require fresh predecessor revalidation plus explicit authorization before promotion.
