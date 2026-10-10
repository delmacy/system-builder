# Station S4 WP3 Construction B 01

Date: 2026-10-10
Sprint ID: STATION-S4-WP3-CONSTRUCTION-B-01
State: COMMITTED after validated #1046 integration, under owner authorization to complete WP3
Base: main@1c39ee81dfa5f46861c6239fd3b4c35a22510c7e
Branch: sprint/station-s4-wp3-construction-b
Committed TASK set: TASK-654; dependency TASK-653
Scope: Addendum 004, RESOLUTION-01/02; WP3 WBS item 3

## Goal and readiness
Integrate proven codec with explicit file download/open and a separate origin-local artifact provider, with dirty/no-partial-overwrite recovery. A #1046 passed all seven workflows: exact-head 38075361994, merge-candidate 38075361969, builds 38075361915, browser 38075361958, heavy 38075361941, frontend 38075361928 and handoff 38075361914. No competing open WP3 PR at promotion. Shared Windows worktree untouched; revalidate locks before local work.

## TASK boundary and growing proof
TASK-654 permits nine exact implementation/report/state paths; shared schemas/ADRs/settings/composition/codec/workflows/provider/runtime/deploy remain forbidden. Before code confirm paths, maximum files, contracts and validations. Preserve real catalog/session codec APIs. Extend Chromium proof through actual downloaded bytes and reload/Open saved, with negative/dirty/storage/version/metadata cases, plus full WP2 regression. One authoritative TASK commit after planning materialization; one Sprint PR preserving both commits.

## Validation, stop and successor
Run npm run verify, npm run station:build, and npx playwright test --config tests/browser/station-editor.playwright.config.ts. Require all triggered exact-head/current-base Actions and Windows/Ubuntu builds/browser artifact before merge. Observe local results accurately; no unobserved local browser/verify claim. Stop for worker collision, forbidden paths, contract/ADR drift or required scope/security weakening. After B integrates reconstruct fresh main, decide whether bounded goal needs optional C; otherwise materialize Package Review, followed by Documentation & Closure. No successor code before its committed authority.
