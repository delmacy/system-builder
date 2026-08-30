# TASK-418 — Lineage integration growing proof

Status: COMMITTED / MATERIALIZED / NOT EXECUTED
Sprint: `P18-PROCESS-SYSTEM-LINEAGE-INTEGRATION-01`
Depends on: TASK-417
Level: L2 verification/documentation.

## Goal
Close Construction B with an integrated product proof across WBS 18.1 -> 18.2 -> 18.3 and a Sprint Report grounded in actual Release/Deploy consumer APIs.

## Allowed paths
- `tooling/product-tests/**`
- `project_docs/execution_planning/P18-PROCESS-SYSTEM-LINEAGE-INTEGRATION-01.report.md`
- this TASK spec
- bounded Release/Deploy test-support adjustments only when necessary to prove already-built behavior

## Forbidden paths
- `packages/contracts/process-versioning/**`
- new product capability outside Construction B Goal
- Runtime/Compiler/Decision Boundary/storage migrations

Max files: 8.

## Requirements
Prove valid full lineage plus rejection of forged cross-artifact links, missing/reversed hops, conflicting duplicates, unknown revisions and Git/PR/model/classifier authority substitution. Record exact TASK commits and validation evidence in the Sprint Report.

## Validation
Run focused product tests, then repository-wide `npm run verify`; exact-head Deterministic CI and Heavy Product Tests are Sprint Review gates.