# Current Execution Milestone — M10 P9 Sprint 3 Construction

## Goal

Execute `P9-RUNTIME-RECONCILIATION-E2E-01` after the merged Sprint 2 result, proving bounded Deploy-owned restart reconciliation from durable authority into the authoritative managed Runtime.

## Integrated predecessor

`P9-ACTIVE-RUNTIME-PROMOTION-01` merged through PR #195 at `34379b744661468d8f3575facdbb6ed7140f8470`; final Sprint CI #362 PASS before merge.

## Active Sprint

`P9-RUNTIME-RECONCILIATION-E2E-01 — Runtime Restart Reconciliation`

Branch: `sprint/P9-RUNTIME-RECONCILIATION-E2E-01`
Status: `MATERIALIZED / PRE_CODE_CI_PENDING`.

Committed TASK order:
1. TASK-125 — bounded authoritative Runtime reconciliation;
2. TASK-126 — reconciliation failure/retention safety;
3. TASK-127 — durable package-level restart E2E evidence.

## Architecture boundary

The Sprint models a controlled restart of the Deploy-owned single-host process manager. The old manager shuts down its owned Runtime before restart; the fresh manager reconstructs durable Deploy authority plus durable Release/Artifact evidence and rematerializes the authoritative Runtime. No generic process discovery, PID scanning, external service manager, load balancer, DNS/reverse proxy, scheduler, Kubernetes, fleet or cloud topology is introduced.

## Current gate

Run repository-wide Deterministic CI on the pre-code materialization head. Do not edit product code until that gate is green.

Do not materialize the P9 Integration & Technical Debt Review or any successor package at this gate.
