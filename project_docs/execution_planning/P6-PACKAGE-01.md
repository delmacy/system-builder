# P6-PACKAGE-01 — Durable Factory and Release Infrastructure

Status: FORECAST_PACKAGE / NO_COMMITTED_SPRINT
Base: `97e13c5ef66045f5c7d7aa11f20315e7dc02bf7f` (P5 Integration & Technical Debt Review merged through PR #177)

## Package Goal

Close the durability gap exposed by P5 without broadening Runtime behavior: preserve deterministic Catalog/Assembly/Compiler/Release identities while proving restart-safe provider-backed Catalog, PublishedRelease and ArtifactPayload persistence behind replaceable interfaces.

Target growing proof:

`durable Software Catalog -> deterministic Assembly/Validation/Compiler -> durable PublishedRelease + ArtifactPayload publication -> process restart -> equivalent retrieval/verification -> existing Deploy -> autonomous Runtime`

The package attacks `TD-P4-01` and `TD-P5-04` directly. It does not authorize production Deploy, production SecretResolver, broader generated Runtime capabilities, richer Catalog constraint policy, or materializer extensibility work.

## Planning authority and boundaries

- `AGENTS.md` and `SPRINT_GENERATION_POLICY.md` remain controlling.
- ADR-0002 remains controlling: durable Factory state must not introduce Runtime dependence on Builder.
- ADR-0007 remains controlling: Release remains immutable; Environment/secret material remains outside Release; Deployment remains the binding of Release + Environment.
- WBS 05 authorizes durable preservation of Software Catalog registration/query semantics and catalog governance without coupling Catalog to one provider.
- WBS 09.3.1 explicitly requires publication in abstract registry/storage; 9.1/9.2 identities and lifecycle semantics must be preserved.
- Existing provider-neutral ArtifactPayloadRepository semantics are the reference contract for payload persistence.
- No L4 architecture change is planned. Any canonical shared-contract extraction or boundary change discovered later requires explicit L3/L4 authority as applicable.

## Construction sequence — all FORECAST

### 1. P6-DURABLE-CATALOG-01 — FORECAST

Objective: introduce a replaceable durable Software Catalog storage boundary and one reference durable provider while preserving the exact current normalized record, duplicate identity, deterministic list and provider-neutral resolution semantics.

Candidate TASKs (not materialized):
- TASK-091 — define internal Catalog repository/provider boundary around current record semantics;
- TASK-092 — implement reference PostgreSQL-backed durable Catalog provider with deterministic persistence/reload behavior;
- TASK-093 — prove restart-safe Catalog resolution and P5 Assembly predecessor integration.

Expected exit proof:

`register normalized catalog records -> persist -> reconstruct provider/process -> deterministic list/resolution identical -> actual Assembly transitive proof remains green`

Constraints:
- no richer version ranges/provider scoring;
- no change to Assembly semantics;
- no Runtime or Deploy changes;
- provider-specific transport stays behind Catalog boundary.

### 2. P6-DURABLE-RELEASE-ARTIFACT-01 — FORECAST

Dependency: P6-DURABLE-CATALOG-01 merged and revalidated.

Objective: add replaceable durable PublishedRelease storage and a durable ArtifactPayloadRepository implementation while preserving immutable identity, lifecycle transitions, payload idempotence/conflict rejection, verified retrieval and secret-free Release semantics.

Candidate TASKs (not materialized):
- TASK-094 — define internal Release registry persistence boundary preserving current publish/get/transition behavior;
- TASK-095 — implement reference durable PublishedRelease provider and durable ArtifactPayloadRepository provider;
- TASK-096 — prove immutable publication/retrieval across provider reconstruction and failure behavior for overwrite/corruption/missing payload.

Expected exit proof:

`ReleaseArtifact -> durable PublishedRelease + durable ArtifactPayload -> provider/process reconstruction -> verified equivalent metadata/payload -> immutable lifecycle preserved`

Constraints:
- no environment values/secrets persisted into Release or ArtifactPayload metadata;
- no production deployment orchestration;
- no mutation of released artifact identity;
- storage implementation must remain replaceable behind provider interfaces.

### 3. P6-DURABLE-FACTORY-E2E-01 — FORECAST

Dependency: P6-DURABLE-RELEASE-ARTIFACT-01 merged and revalidated.

Objective: prove the existing deterministic Factory chain survives persistence/restart boundaries without changing product semantics.

Candidate TASKs (not materialized):
- TASK-097 — build integrated durable Catalog -> Assembly -> Validation -> Compiler -> Release publication fixture using actual APIs;
- TASK-098 — prove process/provider reconstruction retrieves the same PublishedRelease and verifies the same ArtifactPayload before Deploy;
- TASK-099 — preserve PostgreSQL state-counter redeploy, Builder/Observe autonomy and secret non-leakage as package E2E regressions.

Expected exit proof:

`durable Catalog -> AssemblyPlan -> ValidationEvidence -> Compiler ReleaseArtifact -> durable PublishedRelease/ArtifactPayload -> reconstructed Factory storage -> verified retrieval -> existing Deploy -> autonomous PostgreSQL Runtime`

This Sprint must not convert local Deploy into production supervision or expand Runtime feature breadth.

### 4. P6 Integration & Technical Debt Review — FORECAST / MANDATORY

Materialize only after all three construction Sprints merge.

Review scope:
- repository-wide deterministic regression with actual PostgreSQL;
- disposition of `TD-P4-01`, `TD-P5-04` and any new durability debt;
- revalidation of WBS 05/09 plus downstream 10/13 implications;
- ADR-0002/0007 and provider replaceability review;
- restart/concurrency/transaction/operational risk update;
- successor readiness ranking from the then-integrated state.

The review must not be materialized or executed by this package-planning action.

## Growing E2E proof

P5 predecessor:

`SystemDefinition -> bounded Catalog constraints/dependencies -> transitive AssemblyPlan -> ValidationEvidence -> materializer registry -> ReleaseArtifact -> PublishedRelease -> verified ArtifactPayload -> Deploy -> autonomous Runtime`

P6 grows this by replacing process-lifetime assumptions with explicit durable boundaries:

1. Catalog survives provider/process reconstruction without resolution drift.
2. PublishedRelease and ArtifactPayload survive reconstruction without identity/lifecycle/payload drift.
3. The complete Factory output remains deployable and Runtime autonomy remains unchanged after Factory storage reconstruction.

## Risks and change control

High:
- transactional consistency between release metadata and payload publication;
- restart-safe identity/idempotence and corruption handling;
- persistence schema evolution without silently redefining existing module contracts.

Medium-High:
- choosing reference PostgreSQL persistence without turning provider choice into architecture lock-in;
- concurrency semantics not yet proven by current process-local registries.

Escalate rather than broaden a Sprint if implementation requires:
- canonical contract changes across bounded contexts;
- Builder/Runtime or Release/Environment/Deployment boundary changes;
- production traffic/supervision/secrets scope;
- replacement of deterministic identity semantics.

## Commitment gate

All three construction Sprints and the Integration & Technical Debt Review are FORECAST.

No Sprint is COMMITTED. No Sprint manifest or TASK spec is materialized. Before any Sprint is promoted, reconstruct the then-current repository and revalidate predecessor outputs, contracts, candidate TASK readiness, allowed/forbidden paths, risks and growing E2E proof according to `SPRINT_GENERATION_POLICY.md`.
