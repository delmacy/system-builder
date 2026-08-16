# P5-CATALOG-CONSTRAINTS-01 — Structured Dependency and Version Constraints

Status: REVIEW_PREPARATION / IMPLEMENTATION_CI_PASS
Package: `P5-PACKAGE-01`
Base SHA: `e1a1cfa00ae64180746c07a8b2e304f4d2990db9` (PR #173 merged)
Branch: `sprint/P5-CATALOG-CONSTRAINTS-01`
PR: #174

## Goal

Evolve Catalog dependency metadata and candidate-resolution semantics so dependencies are explicit, deterministic and able to express the bounded version/compatibility constraints needed by the next Assembly graph Sprint, while preserving predecessor exact-resolution behavior and without introducing transitive graph solving or durable persistence.

## Authority

`P5-PACKAGE-01` is merged and selects Factory composition hardening before durable provider infrastructure. WBS 5.2.2/5.2.3 and 6.1.2 authorize bounded dependency/version semantics. This Sprint explicitly authorizes L3 changes to the internal Catalog API needed for structured dependency requirements and bounded constraint matching. It does not authorize canonical `packages/contracts/**` changes or any L4 architecture change.

ADR-0002 and ADR-0007 remain controlling and unchanged.

## TASK results

1. `TASK-082` — PASS at `210af0a4d8241d264a4291a0111d66b68ca0d438`; CI #253 PASS.
2. `TASK-083` — PASS at `1ea98f091f28110080b971f00ea3a1b6de136402`; CI #254 PASS.
3. `TASK-084` — PASS at `3e73f5e1a8306553e1074ef2f33eb1925b6d40b9`; CI #255 PASS.

Dependency order preserved:

`TASK-082 -> TASK-083 -> TASK-084`

## Achieved proof

`Catalog records -> structured dependency requirements -> deterministic constrained candidates / explicit unsatisfied diagnostic`

Evidence:

- structured dependency requirements normalize capability, bounded version constraint and compatibility metadata deterministically;
- current legacy `dependencies` remains intact for Assembly predecessor compatibility;
- `exact` and `minimum` constraints use bounded `major.minor.patch` matching;
- malformed constraint/candidate versions fail explicitly when constraint matching is exercised;
- unsatisfied constraints return reproducible diagnostics;
- registration order does not alter candidate results;
- current Assembly implementation remains unchanged and does not traverse structured requirements.

## Validation

- TASK-082: Deterministic CI #253 PASS.
- TASK-083: Deterministic CI #254 PASS.
- TASK-084: Deterministic CI #255 PASS.
- CI #255 repository verification: 309 unit PASS / 0 skipped; 101 product PASS / 0 skipped; P4 PostgreSQL predecessor proofs PASS; task catalog/architecture/build PASS.
- final closure-head Deterministic CI is required before Sprint Review readiness.
- local execution is not claimed.

## Architecture disposition

No new ADR required. No canonical contract, Assembly implementation, Compiler/materializer, Release/Environment/Deployment or Builder/Runtime boundary was changed.

## Review boundary

After closure-head Deterministic CI PASS, mark PR #174 ready for Sprint Review and stop. `P5-ASSEMBLY-GRAPH-01` remains FORECAST and must not be materialized or executed without a new explicit instruction after this Sprint merges and `main` is reconstructed.
