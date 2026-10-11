# Station S4 WP5 — Structural Authoring Plan 01
Date: 2026-10-10
Base: main@a0da862000383e1ebc171c177de6b76f16c0994a (#1054)
Authority: Addendum 006; AGENTS/document authority; WBS 21.2.1/21.2.3/21.3.1/21.3.2 slices
State: PLANNING; construction effective only after validated planning merge
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
