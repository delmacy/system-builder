# Current Execution Milestone — M6 P5 Materializer Registry Committed

## Goal

Execute the committed `P5-MATERIALIZER-REGISTRY-01` only when separately instructed, replacing the narrow Compiler-local state.counter materialization switch with deterministic exact-identity materializer registration/lookup while preserving existing generated assets and P4 Runtime behavior.

## Integrated baseline

PR #175 merged at `c6858ed95faa48cc60361a5a86ddcc57d2b56ced`.

Integrated predecessor proof:

`SystemDefinition root capability -> constrained Catalog candidate -> structured dependency requirements -> deterministic transitive AssemblyPlan BOM / graph diagnostics -> ValidationEvidence -> Compiler predecessor path`

## Active Sprint

`P5-MATERIALIZER-REGISTRY-01 — Deterministic Compiler Materializer Registry`

Branch: `sprint/P5-MATERIALIZER-REGISTRY-01`

Status: COMMITTED / NOT_STARTED

TASK order:
1. TASK-088 — deterministic exact-identity materializer registry/lookup;
2. TASK-089 — migrate existing state.counter reference provider through registry with behavior preservation;
3. TASK-090 — real transitive Factory->Validation->materializer->Compiler integration evidence and P4 regression.

## Architecture constraints

- internal deterministic Compiler materializer boundary only;
- exact identity is capability/provider/version already present in AssemblyPlan;
- no Catalog or Assembly semantic changes;
- no canonical `packages/contracts/**` change;
- no second production Runtime capability;
- no resolved secret values in immutable artifacts;
- ADR-0002 and ADR-0007 remain controlling;
- P4 PostgreSQL/autonomous-runtime proof remains mandatory.

## Current gate

Sprint is materialized and COMMITTED but implementation has not started. Await explicit execution instruction.

The mandatory `P5-PACKAGE-01` Integration & Technical Debt Review remains FORECAST / MANDATORY and has not been materialized or executed.
