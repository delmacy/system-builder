# Project State

Date: 2026-09-13

## Generation 2 — EXECUTION AUTHORIZED / G2-WP-09 CONSTRUCTION C ACTIVE
G2-WP-01..G2-WP-08 are CANONICALLY CLOSED. Pinned authority remains `research/g2-capability-pipeline@2ef10187d691666b45cba5978671570f0ff90c2a`, READY_FOR_WORKER_HANDOFF / PASS.

## G2-WP-09
G2-WP-09 owns G2-WBS-12, G2-WBS-13 and G2-WBS-14. Construction A / G2-WBS-12 is integrated and PASS. Construction B / G2-WBS-13 is integrated as TASK-539..542 and fresh-main Sprint Review PR #752 decided `PASS / CONSTRUCTION C REQUIRED` with no bounded Construction B rework.

Construction C first G2-WBS-14 Sprint is materialized as `TASK-543 -> TASK-544 -> TASK-545 -> TASK-546`. TASK-543 is integrated by PR #754 after bounded semantic repair separating observed and effective currentness. TASK-544 is integrated by PR #758 after bounded semantic hardening preventing obsolete-generation replay while preserving independently qualified observed/effective currentness. TASK-545 is READY; TASK-546 remains predecessor-gated.

## Preserved truth
Declared/resolved/fetched dependencies remain distinct; build success != reproducibility; build output != canonical artifact != release != deployment != observed runtime != effective/converged runtime. Signature != trust/admission; provider acknowledgement != authority/currentness/effective truth. Canonical identity, revision, provenance, desired/observed/effective generation, locality/currentness and source-of-truth remain explicit. PARTIAL/UNKNOWN/INCONCLUSIVE remain non-strengthening; unsafe mutating UNKNOWN routes to reconcile-before-retry where applicable. Coexistence and residual release/runtime cohorts remain visible until qualified drainage/disposition. Product Proof remains distinct from Production Readiness.

## CI evidence truth
Deterministic CI and Heavy Product Tests prove the exact PR head. Merge Candidate CI separately proves the current GitHub synthetic merge revision against current main. Evidence is not interchangeable; a main advance stales the previous merge-candidate proof. Workflow changes require Workflow Lint, and `npm run verify` includes lifecycle/current-authority documentation validation through `check:docs`.

## Not materialized
Concrete Kubernetes/cloud/serverless providers, generalized distributed topology/traffic/scaling infrastructure, hierarchical deployment authority, DB/runtime-core rewrites, apps/UI, Production Readiness, WP-10+ ownership and DEFER/DO_NOT_BUILD findings remain excluded.
