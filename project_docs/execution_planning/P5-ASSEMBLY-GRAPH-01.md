# P5-ASSEMBLY-GRAPH-01 — Deterministic Transitive Assembly Graph

Status: REVIEW_PREPARATION / IMPLEMENTATION_CI_PASS
Package: `P5-PACKAGE-01`
Base SHA: `9a6f2df82d1ffbc1c9c25f67d819e666e718d832` (PR #174 merged)
Branch: `sprint/P5-ASSEMBLY-GRAPH-01`
PR: #175

## Goal

Consume the structured Catalog dependency requirements integrated by P5-CATALOG-CONSTRAINTS-01 and evolve Assembly from root-only selection into bounded deterministic transitive dependency resolution with reproducible conflict/cycle/incompatible-requirement diagnostics and a deterministic AssemblyPlan BOM.

## Predecessor gate

PASS:

- PR #174 merged at `9a6f2df82d1ffbc1c9c25f67d819e666e718d832`;
- Catalog exposes normalized `dependencyRequirements` carrying capability + optional exact/minimum version constraint + compatibility;
- bounded Catalog candidate filtering and explicit unsatisfied diagnostics are integrated;
- legacy Catalog->Assembly and P4 PostgreSQL/autonomous-runtime regressions passed Sprint CI.

## Authority

WBS 6.1.2 and 6.2.1-6.2.3 authorize transitive dependency resolution, conflict/cycle detection, deterministic selection and reproducible diagnostics. WBS 6.3 authorizes AssemblyPlan BOM/identity output.

This Sprint authorizes bounded internal Assembly API/behavior changes needed to consume Catalog structured requirements. It does not authorize canonical `packages/contracts/**` changes or L4 architecture changes.

ADR-0002, ADR-0007 and the Master Blueprint remain controlling and unchanged.

## TASK results

1. `TASK-085` — PASS at `621b6c11f90ae17145ae29ebcd041b6e93453c59`; CI #260 PASS.
2. `TASK-086` — PASS at `d38352eb4b20ae7d5a10a734a5152256247fbc4c`; CI #261 PASS.
3. `TASK-087` — PASS at `cc1f1f99fab123a44b2a75f17967282042afb531`; CI #262 PASS.

Dependency order preserved:

`TASK-085 -> TASK-086 -> TASK-087`

## Achieved proof

`SystemDefinition root capability -> constrained Catalog candidate -> structured dependency requirements -> transitive dependency closure -> deterministic conflict/cycle validation -> deterministic AssemblyPlan BOM -> ValidationEvidence -> Compiler predecessor path`

Evidence:

- Assembly recursively consumes actual Catalog structured requirements;
- exact/minimum/compatibility constraints are deterministically combined across dependency paths before provider selection;
- duplicate compatible paths coalesce;
- unresolved transitive requirements fail explicitly;
- incompatible exact/compatibility requirements fail with stable diagnostics;
- cycles fail with deterministic path evidence;
- equivalent root/dependency/registration ordering preserves plan/diagnostic identity;
- actual Factory E2E compiles from a graph-derived AssemblyPlan via Validation and Compiler APIs;
- P4 PostgreSQL/autonomous-runtime proof remains green.

## Validation

- TASK-085: Deterministic CI #260 PASS.
- TASK-086: Deterministic CI #261 PASS.
- TASK-087: Deterministic CI #262 PASS.
- CI #262 repository verification: 309 unit PASS / 0 skipped; 109 product PASS / 0 skipped; 88 task specs validated; architecture gates/build PASS; PostgreSQL 17.6 predecessor proofs PASS.
- final closure-head Deterministic CI is required before Sprint Review readiness.
- local execution is not claimed.

## Administrative deviation

Initial CI #257 exposed that the pre-materialized TASK-085/086/087 specs lacked parser-required sections. The specs were repaired administratively in commits `ba4c3434...`, `bfcd9324...`, and `81170134...` without changing scope, allowed/forbidden paths, dependencies, acceptance criteria or product behavior. CI #260 validated TASK-085 after that repair.

## Architecture disposition

No new ADR required. No Catalog semantics, canonical contract, Compiler/materializer, Release/ArtifactStore, CI workflow, Release/Environment/Deployment or Builder/Runtime boundary was changed.

## Review boundary

After closure-head Deterministic CI PASS, mark PR #175 ready for Sprint Review and stop. `P5-MATERIALIZER-REGISTRY-01` remains FORECAST and must not be materialized or executed without a new explicit instruction after this Sprint merges and `main` is reconstructed.
