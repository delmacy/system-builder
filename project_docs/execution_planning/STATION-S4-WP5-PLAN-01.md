# Station S4 WP5 — Structural Authoring Plan 01
Date: 2026-10-10
Base: main@a0da862000383e1ebc171c177de6b76f16c0994a (#1054)
Authority: Addendum 006; AGENTS/document authority; WBS 21.2.1/21.2.3/21.3.1/21.3.2 slices
State: bounded WP5 CLOSED effective only on validated TASK-666 closure merge; earlier checkpoints below are historical
Goal: maintainer can build/reorganize a valid installed composition through synchronized UI and retain/reopen it safely.

## Rolling wave and arrival proofs
1. Planning/TASK-662: explicit scope and schema-major compatibility; only A/TASK-663 materialized.
2. Construction A/TASK-663: bounded pure structural/history engine, source root/registry preservation, ordered projections and versioned codec; real catalog positive/negative/stale/budget/predecessor tests. COMMITTED only after planning merge.
3. Construction B FORECAST: installed palette/parent/slot, add/remove-subtree/reorder controls, selection repair and blocked pending input; actual browser/save/open/window proof plus all 29 predecessor cases.
4. Optional C FORECAST only if integrated B leaves a necessary admitted goal gap.
5. Package Integration & Review FORECAST: full regressions, declared L3/version compatibility, architecture/dependency/trust/performance/debt assessment and closure GO.
6. Documentation & Closure FORECAST: operations/contracts/reports/risks/live-pointer reconciliation; closed only on validated merge.

## Dependencies/readiness and gates
WP4 #1054 integrated, fresh main inspected; unrelated open #1027/#1015/#974/#971/#955/#832/#823 preserved. No nested AGENTS in affected paths. Connected isolated checkout permitted; owner authorizes named WP5 and prior commits/merges. No shared Windows worktree used. Product uses existing packages/graph/session APIs and installed descriptors, no package dependency change. ADR-0009 unchanged; L3 payload v2 explicitly declared in admission.
Each Sprint: one authoritative TASK commit and one PR, npm run verify and exact-head/current-base/heavy/handoff/browser checks. Construction: Station Windows/Ubuntu builds and full actual Chromium suite. Failure/cancel must retain prior graph/bytes/history. Never claim environmental local failure as a pass.

## Risks
Array order changes existing alphabetical projection behavior intentionally; retain predecessor order on installed examples. Full snapshots up to 256 nodes/50 entries require bounded measurement; no latency certification. JSON depth/byte budget may cap deep trees before node count. Old readers reject new structural payloads; unchanged topology remains v1. Non-root subtree removal explicit and reversible; pending edits block structural operations. Source labels/descriptors cannot be imported.

## Construction B checkpoint
Planning #1055 and A #1056 integrated. A seven workflows/Windows/Ubuntu and 29/29 Chromium PASS. Fresh main f54cc33c revalidated; only B/TASK-664 COMMITTED, optional C/review/closure FORECAST.

## Package Review checkpoint
B #1057 integrated at 09a8c74d227b1a19809020d806f724d0cd1b7886 after seven workflows/Windows/Ubuntu and 37/37 actual Chromium journeys. Optional C NOT PROMOTED: admitted goal delivered; bounded performance debt does not add a missing capability. Only Package Review/TASK-665 COMMITTED; Closure remains forecast.

Review TASK-665: bounded goal met; optional C not required; closure GO subject to this Sprint's successful checks and integration. Residuals WP5-L1/L2/D1 recorded in RISKS and review report.

## Documentation & Closure checkpoint
Review #1058 integrated with five passing workflows and 37 actual Chromium journeys (35.1 s). Only Closure/TASK-666 COMMITTED after fresh main revalidation; package not closed until validated closure merge.

## Final actual-versus-forecast disposition
Five Sprints delivered as forecast: Planning TASK-662/#1055, A TASK-663/#1056, B TASK-664/#1057, Review TASK-665/#1058, Closure TASK-666. Optional third Construction Sprint not required. Review merged at e5abb70ca7e81772fbb582aa4fbf3dd03f84226f after five passing workflows and 37 Chromium journeys in 35.1 s. One authoritative TASK commit per Sprint plus separate materialization/change-control where recorded. B's initial unmerged transport truncation required safe republication and fresh gates; no failed head merged.
Bounded WBS 21.2.1/21.2.3/21.3.1/21.3.2 goal met. WP5-L1/L2/D1 and inherited residuals retained. Closure reconciles twelve documentation paths, no product additions. Next package requires fresh-main planning and admitted scope; no automatic successor. Closure's exact-head full CI/37-journey checks and successful integration determine effectiveness; no resumed local test pass claimed.
