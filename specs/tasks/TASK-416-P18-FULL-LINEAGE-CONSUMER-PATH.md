# TASK-416 — Full lineage consumer path

Status: COMMITTED / MATERIALIZED / NOT EXECUTED
Sprint: `P18-PROCESS-SYSTEM-LINEAGE-INTEGRATION-01`
Depends on: TASK-415
Level: L2 integration.

## Goal
Compose one representative real repository path from process revision -> analysis -> SystemDefinition -> Release -> Deployment using public predecessor APIs and the additive seams from TASK-414/415.

## Allowed paths
- `packages/release/**`
- `packages/deploy/**`
- `tooling/product-tests/**`
- this TASK spec and Sprint report

## Forbidden paths
- `packages/contracts/process-versioning/**`
- BusinessRecipe/SystemAnalysis/SystemDefinition contract mutation
- Runtime/Compiler/Decision Boundary/storage migrations

Max files: 7.

## Requirements
Use canonical lineage endpoints rather than duplicate identity fields. Fail closed on cross-artifact, reversed, missing or conflicting linkage. Preserve existing consumers when lineage integration is not invoked.

## Validation
Focused positive and negative product tests proving actual predecessor API composition and identity mismatch rejection; `npm run typecheck`; applicable lint/tests.