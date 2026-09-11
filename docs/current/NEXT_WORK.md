# Next Work — G2-WP-07 Construction A

Generation 2 execution remains rolling-wave and dependency-safe.

## Closed predecessors
`G2-WP-01..G2-WP-06` are CANONICALLY CLOSED.

## Revalidated authority
G2-WP-07 Planning & Materialization is integrated on fresh `main@909544a300417f65168d6f137dd104001b52be1d` by PR #679. Post-planning repository-memory reconciliation is integrated through `main@95ff9d26df645171f0353469c78d468f52958296`. Pinned authority remains `research/g2-capability-pipeline@2ef10187d691666b45cba5978671570f0ff90c2a`, `READY_FOR_WORKER_HANDOFF / PASS`. G2-WP-07 owns `G2-WBS-06`, `G2-WBS-08`, `G2-WBS-11` with typed prerequisites from closed WP-01/WP-03/WP-04/WP-05/WP-06.

## Materialized Construction A
`G2-DURABLE-EXECUTION-FOUNDATION-01` is materialized as:

`TASK-519 -> TASK-520 -> TASK-521 -> TASK-522`

TASK-519 is integrated on fresh `main@6a3d342847dc2e4160f52e2103c7f873e5c4b89f` by PR #682 after exact-head Deterministic CI, Heavy Product Tests and Automation Handoff all passed. TASK-520 is now READY. TASK-521..522 remain predecessor-gated.

TASK-519 establishes durable execution identity/state/journal and producing-revision pinning. TASK-520 establishes external-effect identity, qualified idempotency and reconcile-before-retry. TASK-521 establishes units/population-qualified finite-flow capacity/backpressure/drainage. TASK-522 is integrated Product Proof only.

## Next mandatory gate
Execute only TASK-520 from fresh `main@6a3d342847dc2e4160f52e2103c7f873e5c4b89f`, after this repository-memory reconciliation is integrated. Preserve effect identity != attempt/delivery identity, ACK != business effect, unsafe `UNKNOWN -> reconcile-before-retry`, qualified idempotency authority/scope/payload/horizon and stale/currentness fencing. After exact-head CI, semantic review and eligible integration, rebuild fresh main and reconcile repository memory before TASK-521 may become READY.

Construction B, optional Construction C, Package Integration & Review and Documentation & Closure remain NOT MATERIALIZED. Do not absorb storage Construction-B semantics early, concrete adapters, messaging/notification semantics owned by WP-08, DB/runtime/deployment work, Production Readiness or DEFER/DO_NOT_BUILD findings.
