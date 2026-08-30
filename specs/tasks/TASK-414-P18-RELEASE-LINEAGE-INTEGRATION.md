# TASK-414 — Release lineage integration

Status: COMMITTED / MATERIALIZED / NOT EXECUTED
Sprint: `P18-PROCESS-SYSTEM-LINEAGE-INTEGRATION-01`
Depends on: Construction A integrated on `294c348271f3efc416c71ecef7e2329c63128d97`
Level: L2/L3 consumption only; no public lineage semantic change.

## Goal
Add an additive Release-side seam that consumes canonical `packages/contracts/process-versioning/**` definition→release lineage truth using existing Release identities and behavior.

## Allowed paths
- `packages/release/**`
- `tooling/product-tests/**` only for focused Release/lineage tests
- this TASK spec and Sprint report

## Forbidden paths
- `packages/contracts/process-versioning/**`
- `packages/deploy/**`
- Runtime/Compiler/Decision Boundary/storage migrations

Max files: 6.

## Requirements
Preserve every existing Release API/serialization path. New lineage admission/composition must fail closed on missing or mismatched SystemDefinition/release identity and must not treat Git/PR/model metadata as canonical identity or approval authority.

## Validation
Run focused product tests covering positive admission, identity mismatch, metadata-authority substitution and predecessor integration; then `npm run typecheck` and applicable lint/tests for touched paths.