# Station S4 WP2 Construction A 01

Date: 2026-10-10
Sprint ID: STATION-S4-WP2-CONSTRUCTION-A-01
Status: COMMITTED ON PLANNING INTEGRATION
Branch: sprint/station-s4-wp2-construction-a
Known predecessor base: 1c2625acacf2e161e388b031026da3766a84902d; execute from actual planning merge after revalidation
Authority: docs/contracts/003-station-editor-operational-journey/ADDENDUM.md
TASK set/order: TASK-646 -> TASK-647
Dependencies: TASK-645 integrated; this planning PR must integrate first.

## Goal and growing proof

Source-owned composition catalog and validated session initialization; generalize the actual workbench to descriptor-aware hierarchy/constraints and safe switching. Preserve the seven WP1 browser journeys; extend actual route with second admitted ButtonGroup composition, cancel/discard switching, descriptor bounds, truthful selection/Preview, edit/save/discard and keyboard/focus.

## File and commit boundary

TASK-646 permits five paths (catalog adapter, pure product test, TASK, Sprint report, live pointer). TASK-647 permits five paths (workbench, browser tests, TASK, shared Sprint report, live pointer). Existing public packages, legacy labs, desktop client and workflows are forbidden in A. Two authoritative TASK commits on one branch; final integration must preserve both commits (ordinary merge), with a complete Sprint report.

## Exit / stops

npm run verify; npm run station:build; npx playwright test --config tests/browser/station-editor.playwright.config.ts. Require all triggered final-head/current-base CI and retained browser artifacts. Stop for unknown input requiring external parser, unavailable public capability, forbidden-path change, scope/contract/architecture drift, failing proof or conflicting writer. No B desktop wiring is hidden in A.

## Forecast

B is launcher/window construction and remains unmaterialized until A integrates and fresh-main revalidation. Package review/closure remain forecast.
