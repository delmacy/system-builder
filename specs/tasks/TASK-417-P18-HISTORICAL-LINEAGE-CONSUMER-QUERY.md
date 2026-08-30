# TASK-417 — Historical lineage consumer query

Status: COMMITTED / MATERIALIZED / NOT EXECUTED
Sprint: `P18-PROCESS-SYSTEM-LINEAGE-INTEGRATION-01`
Depends on: TASK-416
Level: L2 integration.

## Goal
Expose deterministic historical lookup/verification through the representative consumer path so a canonical process revision can resolve its analysis, definition, release and deployment identities without changing the canonical lineage owner.

## Allowed paths
- `packages/release/**`
- `packages/deploy/**`
- `tooling/product-tests/**`
- this TASK spec and Sprint report

## Forbidden paths
- `packages/contracts/process-versioning/**`
- persistence/storage redesign or migrations
- Runtime/Compiler/Decision Boundary

Max files: 7.

## Requirements
Consume canonical Construction A history/query APIs. Reject duplicate/conflicting/missing lineage and unknown process revisions. Existing Release/Deploy behavior remains backward compatible.

## Validation
Focused tests for complete lookup, unknown revision, conflicting duplicate and missing-hop cases; `npm run typecheck`; applicable lint/tests.