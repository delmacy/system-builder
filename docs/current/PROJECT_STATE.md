# Project State

Date: 2026-09-11

## Generation 2 — EXECUTION AUTHORIZED / G2-WP-07 CONSTRUCTION A MATERIALIZED
`G2-WP-01..G2-WP-06` are CANONICALLY CLOSED on fresh `main@a711231373c98b35b0338f70c20b99105ec30025`. Pinned research/planning authority remains `research/g2-capability-pipeline@2ef10187d691666b45cba5978671570f0ff90c2a`, whose research state, WBS decomposition/dependency graph, Work Package Design and Ready for Worker Handoff remain `READY_FOR_WORKER_HANDOFF / PASS`.

## G2-WP-07
G2-WP-07 owns `G2-WBS-06`, `G2-WBS-08`, `G2-WBS-11` and consumes WP-01 semantic/revision identity, WP-03 semantic boundaries, WP-04 authority/trust, WP-05 data/coexistence semantics and WP-06 provider qualification only for provider-backed storage.

Planning & Materialization is integrated on fresh `main@909544a300417f65168d6f137dd104001b52be1d`; post-planning repository-memory reconciliation is integrated on `main@6893dc449849653cfdea3e099d59f795eefb4437`. TASK-519 is integrated by PR #682 on fresh `main@6a3d342847dc2e4160f52e2103c7f873e5c4b89f`; exact-head `f720c8682347b17556f20657697c32948caf8af3` passed Deterministic CI #1662, Heavy Product Tests #1247 and Automation Handoff. Construction A `G2-DURABLE-EXECUTION-FOUNDATION-01` remains materialized as `TASK-519 -> TASK-520 -> TASK-521 -> TASK-522`; TASK-520 is READY and TASK-521..522 remain predecessor-gated. Construction B storage/finite-flow integration is FORECAST / NOT MATERIALIZED. Optional Construction C, Package Integration & Review and Documentation & Closure are NOT MATERIALIZED.

Package invariants: in-flight work retains producing revision; `accepted != processed != converged`; effect identity != attempt/delivery identity; unsafe `UNKNOWN -> reconcile-before-retry`; idempotency scope/horizon is explicit; canonical document/object identity does not collapse to provider key/hash; queue capacity is units/population qualified and finite drainage must be demonstrated under declared assumptions.

## Current gate
Execute only TASK-520 from fresh `main@6a3d342847dc2e4160f52e2103c7f873e5c4b89f`. TASK-521..522 remain predecessor-gated. Before any successor mutation, preserve exact-head validation, one authoritative commit per TASK when required, and blocker-first handling of CI/review/proof/memory drift.

Concrete queue/storage vendor adapters, DB migration execution, messaging/notification semantics owned by WP-08, deployment, Production Readiness and DEFER/DO_NOT_BUILD findings remain excluded unless separately materialized and authorized.
