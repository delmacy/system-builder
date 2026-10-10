# Station S4 WP1 Visual Workbench Construction 01

Date: 2026-10-10
Status: MATERIALIZED / CONSTRUCTION AFTER PLANNING INTEGRATION
Sprint ID: STATION-S4-WP1-VISUAL-WORKBENCH-01
Base: `d41085c6747dfceffc5b7b83d8f06cfda61dd651`
Branch: `sprint/station-s4-wp1-visual-workbench`
Scope: `docs/contracts/002-station-visual-factory/ADDENDUM.md`
Committed TASK set: TASK-643 only
Dependency: TASK-642 integrated in PR #1029; this planning PR must integrate first.

## Goal and change control

Correct the missing usable visual editor already required by the WP1 baseline. Fresh review found integrated APIs but no actual WP1 session-driven route. Per Sprint Generation Policy, missing product capability returns to explicit construction, not WP1-H review/closure. Existing A–G history is preserved; no new scope family or architectural authority is admitted.

## Growing proof and exit

Use the real WP1-A–G public APIs in a browser route: load -> Layers selection -> Inspector -> constrained span edit -> visual Preview -> accept/save -> further edit -> discard. Add rejection/recovery and keyboard/focus evidence from the same application. Exact-head browser Action, `npm run verify`, `npm run station:build`, and current merge-candidate CI must pass. No accessible-workbench claim before actual browser proof.

## Execution boundary

TASK-643 allowlist is ten files: route, new workbench, two browser test/config files, dedicated browser workflow, package/lock dev-test dependencies, TASK, report and live pointer. Existing laboratory and editor/composition packages stay unchanged. Owner-approved direct GitHub execution uses serial commits and one PR; final squash preserves one authoritative TASK commit. Local worktrees and historical branches remain preserved.

## Stops and forecast

Stop for unavailable public capability, forbidden-path requirement, unproven browser gate, contract/architecture drift or conflicting writers. WP1-H remains forecast after corrective construction integration; package closure still requires whole-outcome review and honest residual accessibility classification. Do not forecast another product package as committed.
