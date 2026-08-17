# P6-PACKAGE-01 — Durable Factory and Release Infrastructure

Status: ACTIVE_PACKAGE / THIRD_SPRINT_REVIEW
Planning base: `97e13c5ef66045f5c7d7aa11f20315e7dc02bf7f` (P5 Integration & Technical Debt Review merged through PR #177)
Package plan merged: PR #178 at `5806de40087ad36d8b6556d1cd4a7446b9db13c7`.

## Package Goal

Close the durability gap exposed by P5 without broadening Runtime behavior: preserve deterministic Catalog/Assembly/Compiler/Release identities while proving restart-safe provider-backed Catalog, PublishedRelease and ArtifactPayload persistence behind replaceable interfaces.

Target growing proof:

`durable Software Catalog -> deterministic Assembly/Validation/Compiler -> durable PublishedRelease + ArtifactPayload publication -> process restart -> equivalent retrieval/verification -> existing Deploy -> autonomous Runtime`

The package attacks `TD-P4-01` and `TD-P5-04` directly. It does not authorize production Deploy, production SecretResolver, broader generated Runtime capabilities, richer Catalog constraint policy, or materializer extensibility work.

## Planning authority and boundaries

- `AGENTS.md`, `SPRINT_GENERATION_POLICY.md` and `SPRINT_MODE.md` remain controlling.
- ADR-0002: durable Factory state must not introduce Runtime dependence on Builder.
- ADR-0007: Release remains immutable; Environment/secret material remains outside Release; Deployment remains Release + Environment.
- Existing public Catalog, Assembly, Validation, Compiler, Release, ArtifactStore, Deploy and Runtime semantics remain unchanged.
- PostgreSQL remains replaceable reference infrastructure.

## Construction sequence

### 1. P6-DURABLE-CATALOG-01 — MERGED

PR #179, merge `b6b96120dbb19b00f78b6965cb9590a680f2056f`.

Proof: `normalized durable Catalog -> reconstruct -> deterministic resolution -> actual transitive AssemblyPlan`.

### 2. P6-DURABLE-RELEASE-ARTIFACT-01 — MERGED

PR #180, merge `632a3bb294de442f8b8bdea2bdc96e0d9a84955d`.

Proof: `actual Compiler ReleaseArtifact -> durable PublishedRelease + ArtifactPayload -> reconstruct -> equivalent release lifecycle + verified artifact retrieval`.

### 3. P6-DURABLE-FACTORY-E2E-01 — SPRINT REVIEW PREPARATION

Base: `632a3bb294de442f8b8bdea2bdc96e0d9a84955d`
Branch: `sprint/P6-DURABLE-FACTORY-E2E-01`
PR: #181

TASK results:
- TASK-098 — PASS / CI #294;
- TASK-099 — PASS / CI #296;
- TASK-100 — PASS / CI #297.

Achieved proof:

`durable Catalog -> deterministic Assembly/Validation/Compiler -> durable PublishedRelease + ArtifactPayload -> reconstruct Factory-side providers/process -> verified retrieval -> existing Deploy -> autonomous Runtime -> persisted state across clean redeploy`

No production source was modified. Deterministic ordering, fail-closed boundary diagnostics, tamper rejection, secret non-leakage and Builder/Factory-independent Runtime operation remain proven.

Current gate: closure-head Deterministic CI, then Ready for Sprint Review on PR #181.

### 4. P6 Integration & Technical Debt Review — FORECAST / MANDATORY / NOT_MATERIALIZED

Materialize only after all three construction Sprints pass review and merge.

Review scope remains repository-wide regression, TD-P4-01/TD-P5-04 disposition, WBS/ADR revalidation, durability/transport risks and successor readiness from then-current main. Construction findings such as PostgreSQL auth/TLS/pooling/concurrency remain review candidates; they do not alter the construction sequence automatically.

## Growing E2E proof

The three construction Sprints now prove, on the Sprint branch, the complete target chain from durable Catalog through deterministic Factory and durable Release/Artifact reconstruction to existing Deploy and autonomous persisted Runtime.

## Risks and change control

No L3/L4 change occurred in Sprint 3. Production transport hardening is not claimed. Escalate rather than broaden if future work requires public contracts, Builder/Runtime boundaries, Release/Environment/Deployment semantics, destructive migration or secret persistence changes.

## Commitment gate

No successor construction Sprint exists in this package. The mandatory Integration & Technical Debt Review remains FORECAST / NOT_MATERIALIZED until PR #181 is reviewed and merged and a new explicit instruction authorizes its promotion.
