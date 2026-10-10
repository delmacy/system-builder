# Station S4 WP2 Construction B 01

Date: 2026-10-10
Sprint ID: STATION-S4-WP2-CONSTRUCTION-B-01
Status: COMMITTED after Construction A PR #1036 integration
Base: main@399db219aad1cb1ea73312bc5bb6360554945b28
Branch: sprint/station-s4-wp2-construction-b
Scope: docs/contracts/003-station-editor-operational-journey/ADDENDUM.md
TASKs in order: TASK-648 -> TASK-649

## Goal and proof

Register a normal Station Editor app/window through the existing manifest registry. Open it from the taskbar launcher, use the same workbench/canonical catalog session, preserve a draft through minimize/restore in that one window, and start a fresh session after close/reopen. Validate separate windows do not share editor state; Station presentation layout storage must not contain graphs or drafts. Retain the Construction A route and ten Chromium regressions.

## Readiness and boundaries

Construction A merged as PR #1036 at 399db219; final exact-head verify 38061333787, merge candidate 38061333815, Station builds 38061333954 and browser 38061333870 (10/10, artifact 11672844879). Main and Windows shared worktree/locks revalidated. This Sprint uses the app-local manifest, existing StationAppRegistry, WindowDefinition, WindowFrame and editor workbench. WindowFrame may keep minimized children mounted while hidden; closed instances unmount. No public API/schema change, no persistent drafts or Core/business behavior. The separate Component Lab proof remains unchanged.

TASK-648 allows app-local manifest, product test, TASK, Sprint report and live pointer (max 5). TASK-649 allows Station foundation client, WindowFrame, actual browser spec, existing foundation product test, TASK and Sprint report (max 6). Neither permits workflows, external providers, deploy, persistence or public contracts. A package-internal rendering lifecycle correction is L2 and does not change public types.

## Exit

Per TASK and final: npm run verify; npm run station:build; npx playwright test --config tests/browser/station-editor.playwright.config.ts (existing route plus Station journey in same suite). All triggered exact-head/merge-candidate/heavy/handoff/frontend/build/browser checks, report and retained screenshots. Stop for unavailable public capability, forbidden path, L3/L4 drift, lock conflict or failing proof. Integrate ordinary PR with distinct TASK commits; then fresh-main revalidation decides optional C versus package review.
