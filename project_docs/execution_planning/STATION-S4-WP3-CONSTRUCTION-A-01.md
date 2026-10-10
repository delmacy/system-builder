# Station S4 WP3 — Construction A 01

Date: 2026-10-10
Sprint ID: STATION-S4-WP3-CONSTRUCTION-A-01
State: COMMITTED on validated readiness-resolution PR integration; no implementation yet
Branch: sprint/station-s4-wp3-construction-a
Intended base: fresh main after readiness-resolution integration
Committed TASK set: TASK-653 only; depends on completed TASK-652 readiness
Scope: Addendum 004 and RESOLUTION-01; WBS item 2 of WP3 planning baseline

## Goal and predecessor gate
Implement the pure public-envelope composition codec after TASK-652 inventory and contract compatibility resolution integrate. Re-read fresh main, NEXT_WORK, contract, TASK context_paths, open PRs and applicable worker locks before writing. Preserve other workers and shared Windows worktree.

## Integrated exit proof
Real installed catalog -> initialized editor -> valid span mutation -> explicit-metadata public envelope encode/decode -> fresh initialized editor. Both examples, strict negative inputs, budget boundaries, inert metadata preservation, deterministic re-emission and zero partial mutation. Preserve WP1/WP2 browser regression. No durable Save/Open claim.

## TASK boundary
TASK-653 declares exact seven allowed files and forbidden shared contracts/settings/composition/workflows/provider/runtime/deploy paths. Confirm them and dependencies before product writes. One authoritative TASK commit; do not modify outside this boundary.

## Validation and review
Final repository validation: npm run verify. Also npm run station:build and npx playwright test --config tests/browser/station-editor.playwright.config.ts. Require exact-head/current-base merge candidate, heavy/handoff and triggered Windows/Ubuntu Station builds/browser checks. Record actual commands/workflow IDs/artifacts in the allowed Sprint report. One branch/PR; preserve the TASK commit on merge. Connected execution uses observed Actions as evidence.

## Stop conditions and forecast
Stop for conflicting authority, worker collision, forbidden path, undeclared schema/ADR/dependency change or failing proof requiring scope relaxation. Construction B stays FORECAST until A integrates and fresh readiness materializes explicit file UI/dirty-state transitions and storage provider decisions. Optional C only from observed unmet bounded goal; then Package Review and Documentation & Closure.
