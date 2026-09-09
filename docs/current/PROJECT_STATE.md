# Project State

Date: 2026-09-09

## Generation 2 — EXECUTION AUTHORIZED / G2-WP-04 PLANNING MATERIALIZED
`G2-WP-01`, `G2-WP-02` and `G2-WP-03` are CANONICALLY CLOSED.

Fresh `main@358b5b61616ab72d556505d330c1c9552bdb7d6b` includes PR #610 canonical-closure reconciliation for WP-03. Its exact head `2fca14f761aa5a07181888c57737943ba88203e0` passed Deterministic CI #1516, Heavy Product Tests #1045 and Automation Handoff before merge.

Pinned Generation 2 authority remains `research/g2-capability-pipeline@2ef10187d691666b45cba5978671570f0ff90c2a`.

DAG revalidation selected `G2-WP-04 — Identity, Authorization, Trust, Secrets & Recovery` as the first dependency-safe designed successor. Its typed prerequisites are WP-01 semantic/revision/locality and WP-02 evidence/authority discovery; both are closed. WP-03 is not a prerequisite.

Planning & Materialization has committed Construction A `G2-IDENTITY-AUTHORITY-FOUNDATION-01` as `TASK-495 -> TASK-496 -> TASK-497 -> TASK-498 -> TASK-499`, NOT EXECUTED. Construction B remains FORECAST for trust/PKI/secrets/config/recovery qualification and rotation/recovery; Construction C remains OPTIONAL / FORECAST.

## Invariants
Preserve `authentication != authorization`, exact identity/authority revisions, evidence/currentness/locality, no delegation/break-glass/provider authority amplification, explicit UNKNOWN/PARTIAL, residual session/token/cache/offline cohorts, and `acknowledgement != convergence`. WBS-03 remains owner of authorization semantics; WBS-04 trust realization cannot acquire that ownership.

## Current gate
Planning & Materialization exact-head CI/review and merge. Do not execute TASK-495 until the planning branch integrates and fresh main is reconstructed.