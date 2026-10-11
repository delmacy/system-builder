# Station S4 WP6 — History Hardening Plan 01
Date: 2026-10-11 UTC (2026-10-10 America/Sao_Paulo)
Base: main@c1a9660920f22602d125dde2a8f764c5967255da, validated WP5 closure #1059
State: Planning; A eligibility effective only on validated TASK-667 integration
Authority: existing Addendum 006 and WP5-D1; bounded maintenance, no new scope admission
Owner continuation at Planning: next planning step after WP5. Subsequent explicit owner authorization covers implementation through full WP6 closure.

## Goal and baseline
Reduce repeated validation work in existing bounded edit history while preserving exact acceptance/rejection, snapshot integrity, source/registry authority, monotonic revision, baseline dirty, selection and checkpoint semantics. This hardens bounded WBS 21.2.3/21.3.1/21.3.2 delivery; no full WBS completion or broad catalog promotion.
WP5 sampled max 256 nodes/50 snapshots: undo 132.91–151.71 ms for 255 direct children and 223.21–235.89 ms for a 255-level chain. These historical observations motivate reproducible paired measurement; they are not a reliable cross-machine baseline or latency guarantee.
Code inspection: history.valid scans every retained graph, constructs strict codec validation and calls draft acceptance on every operation. ComponentRegistry has a mutable private Map despite readonly public members. Object.freeze(registry) alone therefore cannot justify validation reuse.

## Cadence and dependency DAG
1. Planning TASK-667: authority, baseline, trust constraints, test/measurement protocol; materialize only A.
2. Construction A TASK-668: internal history validation optimization with negative/predecessor proof. Eligible only after validated Planning merge; separate Sprint execution.
3. Construction B FORECAST: checked-in reproducible benchmark and max-bound integration/recovery/adversarial proof, actual browser regression and measured comparison against pre-optimization base. No extra editor features.
4. Optional C FORECAST only if fresh integrated B leaves a necessary bounded goal gap.
5. Package Review FORECAST: independent trust/cache/context audit, contracts/dependencies/CI and reproducibility/performance/debt disposition.
6. Documentation & Closure FORECAST: operations/evidence/risks/live pointer and measured debt disposition; close only on validated merge.
Dependency chain Planning -> A -> B -> optional C if needed -> Review -> Closure. Only active Sprint is committed.

## Safe optimization requirements
Keep full validation for caller-constructed or mutated/untrusted history/snapshot/session objects. Unknown/symbol fields, mutable nested data and changed authority context must never inherit a successful verdict solely from object identity. Do not freeze caller data as an undocumented side effect.
Any reuse must establish internally owned immutable snapshot provenance and bind it to actual source/baseline/registry validation context; registry identity/freeze alone is insufficient. Changing registry descriptors/membership, source/root/composition/base revision, accepted baseline or session must invalidate or bypass reuse. Preserve zero mutation on failure, including deep snapshot tampering, context substitution and overflow.
Retain inclusive 256-node/1 MiB/depth/token caps, 50-entry combined past/future budget, v1/v2 selection, no-op/redo and checkpoint semantics. Do not loosen codec/draft checks, export cache authority, introduce a new dependency or change public object shape. If safe reuse cannot be shown within allowed paths, record a blocker and choose a bounded non-cache improvement rather than weakening admission.

## Growing proof and measurement
A: existing span/structure/history/codec/projection tests plus cache/context/mutation attacks against real catalog/session APIs; unsupported versions/root/slots/budgets remain rejected. Do not replace prior assertions with implementation-mirroring tests.
B: reproduce direct-child and deep-chain 256-node graphs and a real 50-snapshot history using actual APIs, plus installed small compositions. Measure undo/redo/changed and rejected edits/checkpoints. Same Node/runtime/machine, warmup then at least 30 samples per shape and operation; paired baseline/optimized comparisons in three batches, report median/p95, cold and warm behavior, graph/snapshot counts and memory observations where available. No timing threshold in ordinary product tests. Meaningful repeatable warm max-bound improvement is required for debt reduction; target at least 2x median undo/redo, never a public guarantee. If missed, retain debt explicitly and reassess the goal at Review.
Preserve all 37 actual Chromium predecessor journeys on every Sprint; extend only if changed behavior needs proof. Construction gates additionally include Windows/Ubuntu Station build and frontend quality when triggered. All Sprints require npm run verify, exact-head/current-base/heavy/handoff/browser gates and one authoritative TASK commit/one PR before integration.

## Readiness, boundaries and risk
WP5 #1059 closed; no active construction collision. Unrelated open #1027/#1015/#974/#971/#955/#832/#823 remain preserved. Isolated worktree protects old local modified/generated outputs. No nested AGENTS in affected paths. Existing Addendum 006 and ADR-0009 behavior unchanged; L1/L2 internal maintenance only, no 007/L3/L4 invented.
Main risk: falsely treating shallow freezing or registry identity as immutable authority. Additional risks: warm-only benchmark bias, cross-machine comparisons, unbounded cache retention or stale baseline reuse. Require private nonretaining ownership/context design, cold/failure samples and independent Review. WP5-L1/L2 and all other WP3/WP4 residuals remain.
No new properties/catalog/registry, reparenting, persistent history, File Manager/.process/Studio/Core/server/sync/deploy or full ComponentEditor claim.

## Construction A checkpoint
Planning #1060 integrated; five workflows and 37/37 Chromium passed (37.1 s). Fresh main 0fbd63a3 revalidated; only TASK-668 COMMITTED. Four exact paths; all later Sprints remain forecast.
