# P6-PACKAGE-01 — Durable Factory and Release Infrastructure

Status: ACTIVE_PACKAGE / SECOND_SPRINT_REVIEW
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

### 2. P6-DURABLE-RELEASE-ARTIFACT-01 — SPRINT REVIEW PREPARATION

Base: `b6b96120dbb19b00f78b6965cb9590a680f2056f`

Branch: `sprint/P6-DURABLE-RELEASE-ARTIFACT-01`

PR: #180

TASK results:
- TASK-094 — PASS / CI #289;
- TASK-095 — PASS / CI #290;
- TASK-096 — PASS / CI #291;
- TASK-097 — PASS / CI #292.

Achieved proof:

`actual Compiler ReleaseArtifact -> durable PublishedRelease + ArtifactPayload -> reconstruct providers/process -> equivalent release retrieval/lifecycle -> verified artifact retrieval with unchanged integrity checks`

Constraints preserved:
- no PublishedRelease public-shape or lifecycle-policy change;
- no ArtifactPayloadRepository interface/verification semantic change;
- no Compiler, Deploy, Runtime, Catalog, Assembly or canonical-contract source change;
- no secrets/environment values embedded into Release or artifact metadata;
- PostgreSQL remains a bounded Factory-side reference implementation;
- production database auth/pooling/TLS/concurrency remain non-goals of this construction Sprint.

Current gate: final closure-head Deterministic CI, then Ready for Sprint Review on the existing PR #180.

### 3. P6-DURABLE-FACTORY-E2E-01 — FORECAST / NOT_MATERIALIZED

Dependency: P6-DURABLE-RELEASE-ARTIFACT-01 merged and revalidated.

Objective remains proving the complete deterministic Factory chain across persistence/restart boundaries without changing product semantics.

No Sprint manifest or TASK spec is materialized.

### 4. P6 Integration & Technical Debt Review — FORECAST / MANDATORY / NOT_MATERIALIZED

Materialize only after all three construction Sprints merge.

Review scope remains repository-wide regression, TD-P4-01/TD-P5-04 disposition, WBS/ADR revalidation, durability risks and successor readiness from then-current main.

Construction findings that are not required to satisfy the current Sprint Goal remain review candidates until this mandatory package review; they do not alter the committed/forecast sequence automatically.

## Growing E2E proof

Integrated predecessor on main:

`durable Catalog -> deterministic Assembly/Validation/Compiler -> ReleaseArtifact -> process-local PublishedRelease + verified ArtifactPayload -> Deploy -> autonomous Runtime`

Second-Sprint branch proof:

`durable Catalog predecessor -> deterministic Compiler artifact -> durable PublishedRelease + ArtifactPayload -> provider reconstruction -> equivalent release retrieval/verification`

The full durable Factory-to-Deploy E2E remains the forecast third Sprint.

## Risks and change control

High:
- preserving immutable release/artifact identity and integrity across persistence/reconstruction;
- lifecycle persistence without enabling overwrite or invalid transition.

Medium-High:
- using PostgreSQL as reference storage without making it part of Release/Artifact consumer contracts;
- bounded schema/transport implementation without falsely claiming production database lifecycle completeness.

Escalate rather than broaden if implementation requires canonical contract changes, Compiler/Deploy/Runtime source changes, Release/Environment/Deployment boundary changes, secret persistence, destructive migration, or altered public identity/lifecycle/verification semantics.

## Commitment gate

No successor Sprint is committed by this closure. `P6-DURABLE-FACTORY-E2E-01` and the Integration & Technical Debt Review remain FORECAST / NOT_MATERIALIZED and require the already-defined predecessor gates plus explicit authorization before promotion.
