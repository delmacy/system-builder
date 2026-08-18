# Next Work — P9 Sprint 3 Construction

The repository is authoritative. Do not use chat history as technical authority.

## Active Sprint

`P9-RUNTIME-RECONCILIATION-E2E-01`

Branch: `sprint/P9-RUNTIME-RECONCILIATION-E2E-01`
Status: `MATERIALIZED / PRE_CODE_CI_PENDING`.

## Required action

1. Run repository-wide Deterministic CI on the materialization head.
2. If green, execute TASK-125 -> TASK-126 -> TASK-127 in dependency order.
3. Run each TASK validation before advancing.
4. After TASK-127, produce the Sprint Report, run final repository verification, promote one Sprint PR and stop at human Sprint Review.

## Boundary

Reconciliation is bounded to controlled restart of the Deploy-owned single-host manager. The old manager explicitly stops its owned process; the fresh manager reconstructs durable authority and rematerializes the authoritative Runtime from durable Release/Artifact state.

Do not introduce generic process discovery, PID scanning, external service managers, load balancer, DNS/reverse proxy, Kubernetes/container scheduler, fleet/cloud topology, canonical infrastructure contracts or Builder/Runtime L4 changes.

Do not materialize or execute the P9 Integration & Technical Debt Review or any successor package.
