# P5-ASSEMBLY-GRAPH-01 — Deterministic Transitive Assembly Graph

Status: COMMITTED / NOT_STARTED
Package: `P5-PACKAGE-01`
Base SHA: `9a6f2df82d1ffbc1c9c25f67d819e666e718d832` (PR #174 merged)
Branch: `sprint/P5-ASSEMBLY-GRAPH-01`

## Goal

Consume the structured Catalog dependency requirements integrated by P5-CATALOG-CONSTRAINTS-01 and evolve Assembly from root-only selection into bounded deterministic transitive dependency resolution with reproducible conflict/cycle/incompatible-requirement diagnostics and a deterministic AssemblyPlan BOM.

## Predecessor gate

PASS:

- PR #174 merged at `9a6f2df82d1ffbc1c9c25f67d819e666e718d832`;
- Catalog exposes normalized `dependencyRequirements` carrying capability + optional exact/minimum version constraint + compatibility;
- bounded Catalog candidate filtering and explicit unsatisfied diagnostics are integrated;
- legacy Catalog->Assembly and P4 PostgreSQL/autonomous-runtime regressions passed Sprint CI;
- current Assembly remains root-only, so no hidden predecessor graph behavior must be preserved.

## Authority

WBS 6.1.2 and 6.2.1-6.2.3 authorize transitive dependency resolution, conflict/cycle detection, deterministic selection and reproducible diagnostics. WBS 6.3 authorizes AssemblyPlan BOM/identity output.

This Sprint may change the internal Assembly API/behavior required to consume Catalog-side structured requirements. It does not authorize canonical `packages/contracts/**` changes or any L4 architecture change.

ADR-0002, ADR-0007 and the Master Blueprint remain controlling and unchanged.

## Committed TASKs

1. `TASK-085` — resolve bounded acyclic transitive dependency closure into deterministic AssemblyPlan components;
2. `TASK-086` — detect cycles, incompatible multi-path requirements and deterministic graph conflicts;
3. `TASK-087` — prove order-independent graph resolution through the real Catalog->Assembly->Validation->Compiler predecessor path and repository-wide regression.

Dependency order:

`TASK-085 -> TASK-086 -> TASK-087`

## Expected exit proof

`SystemDefinition root capability -> constrained Catalog candidate -> structured dependency requirements -> transitive dependency closure -> deterministic conflict/cycle validation -> deterministic AssemblyPlan BOM -> ValidationEvidence -> Compiler predecessor path`

The existing P4 capability-driven PostgreSQL autonomous-runtime/redeploy E2E remains a mandatory regression under repository-wide `npm run verify`.

## Boundaries

In scope:

- Assembly consumption of structured Catalog dependency requirements;
- bounded transitive closure;
- exact/minimum/compatibility requirement propagation through the existing Catalog resolver contract shape;
- deterministic duplicate/coalesced dependency handling;
- reproducible cycle, unresolved dependency and incompatible multi-path requirement diagnostics;
- deterministic AssemblyPlan component/BOM output;
- predecessor Factory E2E regression.

Out of scope:

- Compiler materializer registry;
- `P5-MATERIALIZER-REGISTRY-01` materialization or execution;
- durable Catalog/Release/Artifact providers;
- new canonical public contracts;
- new version-range kinds beyond Catalog exact/minimum;
- production deployment/runtime/provider work;
- Builder/Runtime boundary changes.

## Final validation

`npm run verify`

## Stop / escalation

Stop if:

- graph semantics require a canonical `packages/contracts/**` change;
- a new version-range policy beyond exact/minimum becomes necessary;
- preserving deterministic composition requires a new L4 architecture decision;
- implementation requires Compiler/materializer-registry work;
- a required path is forbidden by a TASK contract;
- P4 autonomous-runtime or secret/release invariants regress.

## Successor boundary

After TASK-087 and Sprint Review/merge, stop. `P5-MATERIALIZER-REGISTRY-01` remains FORECAST and requires a new explicit instruction plus `main` reconstruction before any promotion, materialization or execution.
