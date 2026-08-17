# P5-MATERIALIZER-REGISTRY-01 — Deterministic Compiler Materializer Registry

Status: REVIEW_PREPARATION / IMPLEMENTATION_CI_PASS
Package: `P5-PACKAGE-01`
Base SHA: `c6858ed95faa48cc60361a5a86ddcc57d2b56ced` (PR #175 merged)
Branch: `sprint/P5-MATERIALIZER-REGISTRY-01`
PR: #176

## Goal

Replace the narrow Compiler-local single-provider materialization switch with a bounded deterministic materializer registration/lookup boundary keyed by exact capability/provider/version identity, preserving the existing `state.counter / system-builder.postgres-counter / 1.0.0` behavior, release reproducibility, secret boundaries and autonomous Runtime proof.

## Predecessor gate

PASS:

- P5-CATALOG-CONSTRAINTS-01 is merged through PR #174;
- P5-ASSEMBLY-GRAPH-01 is merged through PR #175 at `c6858ed95faa48cc60361a5a86ddcc57d2b56ced`;
- integrated Assembly emits deterministic transitive BOM components with exact capability/provider/version identity and fail-closed graph diagnostics;
- closure-head CI #263 for P5-ASSEMBLY-GRAPH-01 passed repository-wide verification;
- P4 capability-driven PostgreSQL autonomous-runtime/redeploy proof remains a required regression.

## Authority

WBS 8.1.1/8.1.2 authorize deterministic migration and derived Runtime materialization. The Master Blueprint requires deterministic Compiler behavior and replaceable provider implementations. P4 debt item TD-P4-07 identified the previous Compiler-local `state.counter` switch as MEDIUM-HIGH debt before additional Runtime capabilities.

This Sprint authorized a bounded internal Compiler materializer registration/lookup API. It did not authorize canonical `packages/contracts/**` changes, Catalog/Assembly semantic changes, a second production Runtime capability, or any L4 architecture change.

ADR-0002 and ADR-0007 remain controlling and unchanged.

## TASK results

1. `TASK-088` — PASS at `22384590bcc0858a0fc63531dc2f00188d86d8e4`; CI #264 PASS.
2. `TASK-089` — PASS at `1f818bfc10d57ff23f7d6fc03fcb49e650998b81`; CI #266 PASS.
3. `TASK-090` — PASS at `0222ca0d1c89c865eb591b574ad7764bf878e09d`; CI #268 PASS.

Dependency order preserved:

`TASK-088 -> TASK-089 -> TASK-090`

## Achieved proof

`SystemDefinition capability -> Catalog constrained provider -> transitive AssemblyPlan BOM -> ValidationEvidence -> exact materializer registry lookup -> existing state.counter materialization -> deterministic migration/runtime assets -> ReleaseArtifact`

Evidence:

- exact capability/provider/version registration and lookup are deterministic;
- equivalent registration ordering produces equivalent registry ordering/lookup behavior;
- duplicate exact materializer identities fail explicitly and unknown exact identities produce scoped no-match evidence;
- the existing state.counter reference provider resolves through the registry;
- generated `DATABASE_URL` binding remains symbolic and migration `migrations/001-state-counter.sql` content remains unchanged;
- unrelated capabilities still produce no Runtime state materialization;
- unsupported selected state.counter provider identity fails explicitly;
- actual Catalog registrations and transitive Assembly resolution feed the selected exact identity through Validation into Compiler;
- equivalent safe ordering preserves AssemblyPlan, ValidationEvidence and ReleaseArtifact identity;
- actual transitive unsupported-materializer selection fails without false successful compilation evidence;
- P4 PostgreSQL clean-redeploy and predecessor migration/state persistence regressions remain green.

## Validation

- TASK-088: Deterministic CI #264 PASS.
- TASK-089: Deterministic CI #266 PASS.
- TASK-090: Deterministic CI #268 PASS.
- CI #268 repository verification: PostgreSQL 17.6 healthy; 309 unit PASS / 0 skipped; 112 product PASS / 0 skipped; 91 task specs validated; architecture gates/build PASS; capability-driven PostgreSQL clean-redeploy and predecessor migration/state redeploy PASS.
- final closure-head Deterministic CI is required before Sprint Review readiness.
- local execution is not claimed.

## Architecture disposition

No new ADR required. No Catalog/Assembly semantics, canonical contract, Release/ArtifactStore, Runtime-core, Deploy, Release/Environment/Deployment or Builder/Runtime boundary was changed. No second production Runtime capability was added. Resolved secrets remain outside immutable Compiler/Release evidence.

## Review boundary

After closure-head Deterministic CI PASS, mark PR #176 ready for Sprint Review and stop.

The mandatory `P5-PACKAGE-01` Integration & Technical Debt Review remains FORECAST / MANDATORY and must not be materialized or executed without a new explicit instruction after this Sprint merges and `main` is reconstructed.
