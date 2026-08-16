# Current Execution Milestone — M6 P5 Assembly Graph Committed

## Goal

Execute the committed `P5-ASSEMBLY-GRAPH-01` only when separately instructed, consuming the integrated Catalog structured dependency requirements to produce deterministic transitive AssemblyPlan BOM semantics and reproducible graph diagnostics.

## Integrated baseline

PR #174 merged at `9a6f2df82d1ffbc1c9c25f67d819e666e718d832`.

Integrated predecessor proof:

`Catalog records -> structured dependency requirements -> deterministic exact/minimum constrained candidates / explicit unsatisfied diagnostic`

## Active Sprint

`P5-ASSEMBLY-GRAPH-01 — Deterministic Transitive Assembly Graph`

Branch: `sprint/P5-ASSEMBLY-GRAPH-01`

Status: COMMITTED / NOT_STARTED

TASK order:
1. TASK-085 — positive bounded transitive closure and deterministic BOM;
2. TASK-086 — cycle/conflict/incompatible requirement diagnostics;
3. TASK-087 — real Catalog->Assembly->Validation->Compiler integration evidence.

## Architecture constraints

- Assembly may consume the integrated Catalog structured requirement shape through its bounded internal API;
- no canonical `packages/contracts/**` change;
- no new version-range kinds beyond exact/minimum;
- no Compiler materializer registry;
- ADR-0002 and ADR-0007 remain controlling;
- P4 PostgreSQL/autonomous-runtime proof remains a mandatory regression.

## Current gate

Sprint is materialized and COMMITTED but implementation has not started. Await explicit execution instruction.

`P5-MATERIALIZER-REGISTRY-01` remains FORECAST and has not been materialized or executed.
