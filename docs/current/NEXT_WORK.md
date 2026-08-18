# Next Work — P9 Sprint 2

The repository is authoritative. Do not use chat history as technical authority.

## Active Sprint

`P9-ACTIVE-RUNTIME-PROMOTION-01`

Base: `cea8f09ccb99b2bf5bed27e9f01782db1520bb67`
Branch: `sprint/P9-ACTIVE-RUNTIME-PROMOTION-01`
Status: `COMMITTED / PRE_CODE`.

## Required action

1. Run pre-code Deterministic CI on the materialized Sprint head.
2. If green, execute TASK-122, then TASK-123, then TASK-124 in dependency order.
3. Run each declared validation before advancing.
4. Run final repository-wide verification, generate Sprint Report, promote one PR and stop at human Sprint Review.

## Boundary

Keep the implementation Deploy-owned and single-host. Do not introduce load balancer, DNS/reverse proxy, Kubernetes/container scheduler, fleet/cloud topology, canonical infrastructure contract or Builder/Runtime L4 changes.

Do not materialize or execute `P9-RUNTIME-RECONCILIATION-E2E-01` or the P9 Integration & Technical Debt Review.
