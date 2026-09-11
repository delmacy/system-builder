# Current Execution Milestone — Generation 2 / G2-WP-07 Construction A

## Milestone state
`G2-WP-01..G2-WP-06` are canonically CLOSED. G2-WP-07 Planning & Materialization is integrated on fresh `main@909544a300417f65168d6f137dd104001b52be1d` by PR #679 after exact-head `c9efc923c4dd69fcd8aead84cd6aa19b7b0bd34a` passed Deterministic CI and Heavy Product Tests. Pinned planning authority remains `research/g2-capability-pipeline@2ef10187d691666b45cba5978671570f0ff90c2a`, with `RESEARCH_PIPELINE_STATE.json` at `READY_FOR_WORKER_HANDOFF` and the WBS/dependency graph, Work Package Design and handoff artifacts remaining authoritative.

G2-WP-07 owns `G2-WBS-06`, `G2-WBS-08`, `G2-WBS-11`. Construction A `G2-DURABLE-EXECUTION-FOUNDATION-01` is materialized as `TASK-519 -> TASK-520 -> TASK-521 -> TASK-522`. TASK-519 is integrated on fresh `main@6a3d342847dc2e4160f52e2103c7f873e5c4b89f` by PR #682 after exact-head `f720c8682347b17556f20657697c32948caf8af3` passed Deterministic CI #1662, Heavy Product Tests #1247 and Automation Handoff. TASK-520 is READY; TASK-521..522 remain predecessor-gated.

## Current gate
Execute only TASK-520 from fresh `main@6a3d342847dc2e4160f52e2103c7f873e5c4b89f`, preserving its materialized scope, allowed/forbidden paths and proof obligations. Do not start TASK-521 before TASK-520 is integrated and repository memory is reconciled.

## Forecast boundary
Construction B — storage/document/media identity plus provider-copy lifecycle integrated with finite-flow constraints — remains FORECAST / NOT MATERIALIZED. Optional Construction C is promoted only by fresh evidence after Construction B. Package Integration & Review and Documentation & Closure remain NOT MATERIALIZED.

## Package proof boundary
Construction A must prove revision-pinned durable execution, external-effect identity distinct from attempt/delivery, authoritative reconcile-before-retry for unsafe UNKNOWN, qualified idempotency, units/population-qualified capacity/backpressure and finite residual drainage. Storage canonical identity is reserved for Construction B.

No concrete queue/storage vendor adapter, messaging/notification semantics owned by WP-08, DB migration execution, deployment, Production Readiness or DEFER/DO_NOT_BUILD work is authorized by this materialization.
