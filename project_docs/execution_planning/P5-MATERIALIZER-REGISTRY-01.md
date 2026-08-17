# P5-MATERIALIZER-REGISTRY-01 — Deterministic Compiler Materializer Registry

Status: COMMITTED / NOT_STARTED
Package: `P5-PACKAGE-01`
Base SHA: `c6858ed95faa48cc60361a5a86ddcc57d2b56ced` (PR #175 merged)
Branch: `sprint/P5-MATERIALIZER-REGISTRY-01`

## Goal

Replace the narrow Compiler-local single-provider materialization switch with a bounded deterministic materializer registration/lookup boundary keyed by exact capability/provider/version identity, preserving the existing `state.counter / system-builder.postgres-counter / 1.0.0` behavior, release reproducibility, secret boundaries and autonomous Runtime proof.

## Predecessor gate

PASS:

- P5-CATALOG-CONSTRAINTS-01 is merged through PR #174;
- P5-ASSEMBLY-GRAPH-01 is merged through PR #175 at `c6858ed95faa48cc60361a5a86ddcc57d2b56ced`;
- integrated Assembly now emits deterministic transitive BOM components with exact capability/provider/version identity and fail-closed graph diagnostics;
- closure-head CI #263 for P5-ASSEMBLY-GRAPH-01 passed repository-wide verification;
- P4 capability-driven PostgreSQL autonomous-runtime/redeploy proof remains a required regression.

## Authority

WBS 8.1.1/8.1.2 authorize deterministic migration and derived Runtime materialization. The Master Blueprint requires deterministic Compiler behavior and replaceable provider implementations. P4 debt item TD-P4-07 identified the existing Compiler-local `state.counter` switch as MEDIUM-HIGH debt before additional Runtime capabilities.

This Sprint authorizes a bounded internal Compiler materializer registration/lookup API. It does not authorize canonical `packages/contracts/**` changes, Catalog/Assembly semantic changes, a second production Runtime capability, or any L4 architecture change.

ADR-0002 and ADR-0007 remain controlling and unchanged.

## Committed TASKs

1. `TASK-088` — establish deterministic exact-identity materializer registry/lookup behavior inside Compiler;
2. `TASK-089` — route the existing `state.counter` reference provider through the registry while preserving current generated assets and failure behavior;
3. `TASK-090` — prove the real transitive Factory path reaches Compiler materialization deterministically and preserves P4 PostgreSQL/autonomous-runtime regressions.

Dependency order:

`TASK-088 -> TASK-089 -> TASK-090`

## Expected exit proof

`SystemDefinition capability -> Catalog constrained provider -> transitive AssemblyPlan BOM -> ValidationEvidence -> exact materializer registry lookup -> existing state.counter materialization -> deterministic migration/runtime assets -> ReleaseArtifact`

The existing P4 clean-redeploy PostgreSQL proof remains mandatory under repository-wide `npm run verify`.

## Boundaries

In scope:

- deterministic materializer registration keyed by capability/provider/version;
- registration-order-independent exact lookup;
- duplicate materializer identity rejection;
- explicit unsupported selected identity behavior;
- preservation of current `state.counter` RuntimeStateRequirement, symbolic `DATABASE_URL`, migration identity/content and Compiler output;
- integration evidence from the actual Catalog/Assembly/Validation predecessor path;
- repository-wide regression.

Out of scope:

- a second production Runtime capability or new business semantics;
- Catalog or Assembly resolution changes;
- canonical public contracts;
- durable Catalog/Release/Artifact providers;
- production SecretResolver, PostgreSQL auth/TLS, migration coordination or Runtime supervision;
- package Integration & Technical Debt Review materialization/execution;
- Builder/Runtime boundary changes.

## Final validation

`npm run verify`

## Stop / escalation

Stop if:

- registry semantics require a canonical `packages/contracts/**` change;
- the work requires changing Catalog/Assembly selection semantics;
- preserving deterministic ReleaseArtifact behavior requires an L4 architecture change;
- resolved secret values would enter immutable Compiler/Release evidence;
- a required path is forbidden by a TASK contract;
- P4 autonomous-runtime/redeploy behavior regresses.

## Successor boundary

After TASK-090 and Sprint Review/merge, stop. The mandatory `P5-PACKAGE-01` Integration & Technical Debt Review remains FORECAST / MANDATORY and must not be materialized or executed without a new explicit instruction after this Sprint merges and `main` is reconstructed.
