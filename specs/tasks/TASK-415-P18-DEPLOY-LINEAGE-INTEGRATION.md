# TASK-415 — Deploy lineage integration

Status: COMMITTED / MATERIALIZED / NOT EXECUTED
Sprint: `P18-PROCESS-SYSTEM-LINEAGE-INTEGRATION-01`
Depends on: TASK-414
Level: L2/L3 consumption only; no public lineage semantic change.

## Goal
Add an additive Deploy-side seam that consumes canonical release→deployment lineage truth using existing deployment identities without changing execution authority or side effects.

## Allowed paths
- `packages/deploy/**`
- `tooling/product-tests/**` only for focused Deploy/lineage tests
- this TASK spec and Sprint report

## Forbidden paths
- `packages/contracts/process-versioning/**`
- Release behavior outside the seam established by TASK-414
- Runtime/Compiler/Decision Boundary/storage migrations

Max files: 6.

## Requirements
Preserve existing Deploy APIs and dry-run/real execution semantics. Reject missing/mismatched release/deployment identities and any attempt to substitute Git/PR/model metadata for canonical deployment lineage identity.

## Validation
Run focused product tests for valid consumption, mismatch/missing lineage, metadata substitution and TASK-414 integration; then `npm run typecheck` and applicable lint/tests for touched paths.