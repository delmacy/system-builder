# P6-PACKAGE-01 — Durable Factory and Release Infrastructure

Status: ACTIVE_PACKAGE / FIRST_SPRINT_COMMITTED
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
- No L4 architecture change is planned. Any canonical shared-contract extraction or boundary change discovered later requires explicit L3/L4 authority as applicable.

## Construction sequence

### 1. P6-DURABLE-CATALOG-01 — COMMITTED / NOT_STARTED

Base: `5806de40087ad36d8b6556d1cd4a7446b9db13c7`

Branch: `sprint/P6-DURABLE-CATALOG-01`

Objective: introduce a replaceable durable Software Catalog storage boundary and one reference durable provider while preserving the exact current normalized record, duplicate identity, deterministic list and provider-neutral resolution semantics.

Materialized TASKs:
- TASK-091 — define internal Catalog repository/provider boundary around current record semantics;
- TASK-092 — implement reference PostgreSQL-backed durable Catalog provider with deterministic persistence/reload behavior;
- TASK-093 — prove restart-safe Catalog resolution and P5 Assembly predecessor integration.

Dependency order:

`TASK-091 -> TASK-092 -> TASK-093`

Expected exit proof:

`register normalized catalog records -> persist -> reconstruct provider/process -> deterministic list/resolution identical -> actual Assembly transitive proof remains green`

Constraints:
- no richer version ranges/provider scoring;
- no change to Assembly semantics or source;
- no Runtime, Deploy, Release or ArtifactStore changes;
- provider-specific transport stays behind Catalog boundary;
- no canonical shared-contract change.

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

P6 first Sprint grows this by proving Catalog survives provider/process reconstruction without resolution or Assembly drift. Later package stages remain forecast.

## Risks and change control

High:
- restart-safe identity/idempotence and persistence schema evolution without redefining Catalog semantics.

Medium-High:
- choosing PostgreSQL as a reference implementation without creating public provider lock-in;
- concurrency semantics beyond the bounded Sprint proof remain debt unless explicitly required by the committed goal.

Escalate rather than broaden the active Sprint if implementation requires:
- canonical contract changes across bounded contexts;
- Assembly semantic/source changes;
- Builder/Runtime or Release/Environment/Deployment boundary changes;
- production traffic/supervision/secrets scope;
- replacement of deterministic identity/resolution semantics.

## Commitment gate

Only `P6-DURABLE-CATALOG-01` is COMMITTED. Its TASK-091/092/093 specs are materialized but not executed.

All successor construction Sprints and the Integration & Technical Debt Review remain FORECAST / NOT_MATERIALIZED and require fresh predecessor revalidation plus explicit authorization before promotion.
