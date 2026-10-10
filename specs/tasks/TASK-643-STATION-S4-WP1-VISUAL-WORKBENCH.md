---
id: TASK-643
title: STATION S4 WP1 Corrective Visual Workbench
status: verification
priority: 643
milestone: STATION-S4-VISUAL-FACTORY-WP1
model_tier: architecture
risk: medium
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-642
context_paths:
  - AGENTS.md
  - docs/DOCUMENT_AUTHORITY.md
  - docs/contracts/002-station-visual-factory/ADDENDUM.md
  - docs/current/NEXT_WORK.md
  - project_docs/execution_planning/STATION-S4-WP1-VISUAL-WORKBENCH-CONSTRUCTION-01.md
  - packages/station-editor/**
  - packages/station-composition/**
  - packages/ui-core/**
  - apps/station/web/app/component-editor/page.tsx
allowed_paths:
  - apps/station/web/app/component-editor/page.tsx
  - apps/station/web/app/station-editor-workbench.tsx
  - tests/browser/station-editor-workbench.spec.ts
  - tests/browser/station-editor.playwright.config.ts
  - .github/workflows/station-editor-browser.yml
  - package.json
  - package-lock.json
  - specs/tasks/TASK-643-STATION-S4-WP1-VISUAL-WORKBENCH.md
  - project_docs/execution_planning/STATION-S4-WP1-VISUAL-WORKBENCH-01.report.md
  - docs/current/NEXT_WORK.md
forbidden_paths:
  - packages/core/**
  - packages/station-composition/**
  - packages/station-editor/**
  - packages/station-windowing/**
  - apps/station/web/app/component-lab-editor-proof.tsx
  - apps/station/web/app/station-foundation-client.tsx
  - provider/**
  - runtime/**
  - deploy/**
max_files: 10
validation:
  - npm run verify
  - npm run station:build
  - npx playwright test --config tests/browser/station-editor.playwright.config.ts
---

# TASK-643 — Corrective Visual Workbench

## Objective

Deliver the missing shared visual editor journey admitted by Addendum 002, composing the already integrated WP1-A–G APIs. This is construction before WP1-H, not a closure shortcut.

## Context

TASK-642 integrated at `d41085c6747dfceffc5b7b83d8f06cfda61dd651` with four Actions passing. The WP1 plan promises a usable visual workbench; the existing component laboratory uses different state/APIs and lacks this integrated save/discard journey. User authorized continued GitHub development and merges after gates. This TASK is executable only after its planning PR integrates.

## Current behavior

Public Station editor session, Layers, Inspector, structural edit, Preview and draft acceptance/discard APIs are proven. `/component-editor` renders ComponentLabEditorProof. That earlier component-contract laboratory must remain preserved and must not be relabeled as WP1 integration.

## Required change

1. Add StationEditorWorkbench and connect the existing component-editor route to the bounded composition editor. Preserve the earlier laboratory source unchanged.
2. Initialize one admitted representative composition/session through public APIs. Keep one EditorSession state; derive all hierarchy/properties/preview from it. Selection/expansion and actual DOM focus remain separate presentation state.
3. Provide labeled Layers, Inspector, constrained column/row span controls, synchronized visual Preview, explicit Save changes and Discard changes, clean/dirty feedback and readable validation/recovery feedback. Do not expose test-only adversarial buttons or API jargon in the user flow.
4. Dispatch typed intents and accept/discard through public APIs with exact draft revisions; rejected operations preserve the session. Use functional state updates to avoid stale handlers; derive dirty and accepted state instead of duplicating them.
5. Use existing UI primitives where appropriate; support keyboard navigation, native form labels, visible focus, status announcements, disabled/read-only cases and no focus loss after edit/save/discard.
6. Add reproducible Playwright Chromium tests and a dedicated exact-head PR Action running Station production build and browser tests. Pin and lock only the required dev test dependencies; do not change other workflows or production dependencies.
7. Prove positive edit-save-edit-discard, invalid span with unchanged draft and valid recovery, selection/preview synchronization, keyboard-only operation and focus preservation through the actual rendered route. Use the real application rather than handcrafted DOM or mocks.
8. Record exact-head/base, commands, browser results, limitations and artifact references in the bounded report. Integrate only after all required checks, including the new browser Action, pass.

## Inputs / contracts

Existing public packages/station-editor and station-composition exports; accepted composition registry/grammar; EditorSession with base/draft revisions; ui-core primitives. No private state access or new package API.

## Outputs / contracts

A usable composition editor route backed by one Station-owned session, browser integration/keyboard evidence and explicit local acceptance/discard. Save means in-memory Station-owned acceptance, not durable persistence.

## Acceptance criteria

- Layers hierarchy, selected-node Inspector and Preview consistently project the same session throughout edit/save/discard.
- Valid structural edits increment draft revision once; invalid/stale input rejects with no partial session mutation and valid recovery remains possible.
- Save establishes an accepted immutable local composition; discard restores it deterministically.
- Keyboard can reach/select a layer, edit spans and invoke save/discard; focus ownership remains stable and distinct from selection/expansion.
- Browser checks observe actual accessible labels/roles, live status and focus behavior. Any untested accessibility dimension stays explicitly UNPROVEN.
- Repository verify, Station production build, exact-head/merge-candidate/heavy/handoff and dedicated browser CI pass for the final head before integration.

## Non-goals

No Studio/C10, arbitrary CSS/HTML/pixel editing, component-contract mutations, new canonical store, durable saving, backend/business authority, changes to editor/composition/windowing packages or package closure.

## Evidence expected

Playwright positive/negative/recovery and keyboard/focus journeys, production build and CI artifact/log references. Preserve API-only predecessor proof and distinguish browser evidence from general accessibility certification. One authoritative integration commit through ordinary PR squash.

## Escalation

If existing public APIs cannot support the admitted route or shared primitives require changes outside the allowlist, record the exact gap and materialize a separately bounded correction before changing forbidden paths. Never close WP1 with static markup or API-only success.

## Construction checkpoint - 2026-10-10
PR #1031 implements the bounded route and four actual browser journeys. Initial implementation head bf25208f passed browser 4/4 and named gates recorded in the construction report. Corrected evidence output/upload paths after discovering no artifact was retained. This final checkpoint is VERIFICATION, not yet INTEGRATED; require fresh-head full checks plus retained browser artifacts before squash. No package closure claim.
