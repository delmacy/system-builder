# Next Work — G2-WP-05 Planning & Materialization

Generation 2 execution remains rolling-wave and dependency-safe.

## Canonically closed predecessors
G2-WP-01, G2-WP-02, G2-WP-03 and G2-WP-04 are CANONICALLY CLOSED. G2-WP-04 Construction A TASK-495..499 and Construction B TASK-500..504 are integrated and Sprint Review PASS; Construction C remains `OPTIONAL / NOT REQUIRED / NOT MATERIALIZED`.

Documentation & Closure PR #635 exact head `3e25d061c6c87342c83ab7114e5c17b1f372eef7` passed Deterministic CI #1567, Heavy Product Tests #1118 and Automation Handoff and merged with expected-head protection by squash to fresh `main@0cb92f73569dae3c611f25fd1d24ce305178d5f7`.

## Next mandatory gate
Revalidate fresh main plus pinned Generation 2 authority and perform only Planning & Materialization for `G2-WP-05 — Canonical Data, Schema & Source-of-Truth Migration` / `G2-WBS-05`.

The exact package design requires WP-01 `[SEMANTIC_PREREQUISITE, REVISION_PREREQUISITE, DATA_PREREQUISITE]`, WP-02 `[EVIDENCE_PREREQUISITE]`, WP-03 `[SEMANTIC_PREREQUISITE]`, and WP-04 `[AUTHORITY_PREREQUISITE, TRUST_PREREQUISITE]` where applicable; these predecessor packages are canonically closed.

Materialization must preserve directional schema compatibility, historical/current populations, reader/writer coexistence, source-of-truth fencing, lineage-preserving backfill/CDC/dual-write semantics, units/precision/presence semantics, `ABSENT != NULL != DEFAULT != DELETE`, `migration success != convergence`, and explicit residual-cohort visibility.

No product TASK may execute until G2-WP-05 Planning & Materialization passes exact-head gates and integrates. Do not absorb WP-06+ implementation, Production Readiness, or unrelated DEFER/DO_NOT_BUILD findings.