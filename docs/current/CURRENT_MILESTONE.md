# Current Execution Milestone — M9 P8 Hardened Activation E2E Sprint

## Goal

Complete the third P8 construction Sprint by proving one joined executable path from durable Factory output through authenticated, atomic Deploy authority to autonomous Runtime continuity across successful upgrade, stale contender and failed contender behavior.

## Integrated baseline

- `P8-DEPLOY-POSTGRES-TRANSPORT-01` merged through PR #189 at `209e192ec56599a05f6972e347f5b70989165c54`, final CI #333 PASS.
- `P8-ATOMIC-DEPLOYMENT-AUTHORITY-01` merged through PR #190 at `98a8e674d72e1ad00d5eb5850ae4e71ac3f6a56c`, pre-merge final CI #340 PASS.

## Active Sprint

`P8-HARDENED-ACTIVATION-E2E-01`

Branch: `sprint/P8-HARDENED-ACTIVATION-E2E-01`
Status: `MATERIALIZED / PRE-CODE CI PENDING`.

Committed dependency order:
1. TASK-116 — Factory -> authenticated atomic A -> autonomous Runtime;
2. TASK-117 — B promotion -> stale contender rejection -> Runtime continuity;
3. TASK-118 — failed contender retention -> fresh authority reconstruction -> Runtime continuity.

## Target proof

`durable Factory output -> authenticated durable Deploy -> activate A -> autonomous Runtime -> promote B -> stale/failed contender cannot replace B -> reconstruct deployment authority -> B remains authoritative + Runtime continuity`

## Architecture disposition

- evidence-only construction;
- existing executable Factory/Release/Artifact/Deploy/Runtime APIs are sufficient;
- no product/provider source, canonical contract, ADR or workflow modification is authorized;
- ADR-0002 and ADR-0007 boundaries remain mandatory;
- no production traffic/process rollback or full production-readiness claim.

## Current gate

Run Deterministic CI on the pre-code materialization. Start TASK-116 only if that objective gate passes.

The P8 Integration & Technical Debt Review remains mandatory after all three construction Sprints are merged, but is not authorized at this gate.
