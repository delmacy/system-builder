---
id: TASK-654
title: Station S4 WP3 File and Local Artifact Journey
status: verification
priority: 654
milestone: STATION-S4-WP3-LOCAL-ARTIFACT
model_tier: architecture
risk: medium
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-653
context_paths:
  - AGENTS.md
  - docs/DOCUMENT_AUTHORITY.md
  - docs/current/NEXT_WORK.md
  - docs/contracts/004-station-portable-composition-artifacts/ADDENDUM.md
  - docs/contracts/004-station-portable-composition-artifacts/RESOLUTION-01.md
  - docs/contracts/004-station-portable-composition-artifacts/RESOLUTION-02.md
  - project_docs/execution_planning/STATION-S4-WP3-CONSTRUCTION-B-01.md
  - packages/station-editor/artifact-codec.ts
  - packages/station-editor/session.ts
  - packages/station-editor/draft-boundary.ts
  - apps/station/web/app/station-editor-artifact.ts
  - apps/station/web/app/station-editor-catalog.ts
  - apps/station/web/app/station-editor-workbench.tsx
  - tests/browser/station-editor-workbench.spec.ts
allowed_paths:
  - packages/station-editor/artifact-store.ts
  - packages/station-editor/index.ts
  - apps/station/web/app/station-editor-files.ts
  - apps/station/web/app/station-editor-workbench.tsx
  - tests/product/station-editor-artifact-files.test.ts
  - tests/browser/station-editor-workbench.spec.ts
  - specs/tasks/TASK-654-STATION-S4-WP3-FILE-LOCAL-JOURNEY.md
  - project_docs/execution_planning/STATION-S4-WP3-CONSTRUCTION-B-01.report.md
  - docs/current/NEXT_WORK.md
forbidden_paths:
  - docs/adr/**
  - specs/contracts/**
  - packages/contracts/**
  - packages/station-settings/**
  - packages/station-composition/**
  - packages/station-editor/artifact-codec.ts
  - .github/**
  - provider/**
  - runtime/**
  - deploy/**
max_files: 9
validation:
  - npm run verify
  - npm run station:build
  - npx playwright test --config tests/browser/station-editor.playwright.config.ts
---

# TASK-654 — Construction B file and local artifact journey

## Objective
Implement explicit Save locally/Open saved and Save As file/Open file in the existing workbench, using the proven codec and RESOLUTION-02 provider decision.

## Context
Construction B follows integrated TASK-653 and RESOLUTION-02.

## Current behavior
TASK-653 codec is integrated through #1046. Workbench still saves session-only; no file controls or artifact store exist. Ordinary Station window lifecycle remains autonomous.

## Required change
Add bounded package artifact-store interface, app-local file/workflow adapter and workbench controls/atomic replacement. Entire public document is retained separately from window preferences. All inputs pass real codec; immutable provider failure returns typed reason without cleaning/replacing draft. Expected stored text detects stale overwrite. Workflow owns caller metadata/version allocation; unchanged re-save preserves tuple and inert metadata, changed graph uses new patch and predecessor provenance, Save As uses new UUID. File reads enforce size first and ordering/session guards.

## Inputs / contracts
RESOLUTION-01/02 and actual source catalog/session/codec. Storage adapter getItem/setItem is replaceable and origin-local, not Core/filesystem authority. UI distinguishes session Save changes, origin retention and download requests. No silent autosave/load, provider migrations, executable imported data or graph-in-preferences.

## Outputs / contracts
Typed artifact retention results, explicit file/local workbench actions and growing actual-browser proof.

## Acceptance criteria
- Real edit -> Save locally -> reload -> Open saved restores spans; entries have independent keys.
- Actual browser download bytes re-open in a fresh session/context and retain metadata; malformed/unknown/stale/oversize/read failures preserve prior state.
- Dirty Open saved/Open file cancellation preserves draft/fields/selection/focus; confirmation atomically replaces a valid document/session. Out-of-order async read cannot overwrite a newer interaction/session.
- Quota/read denial and expected-text conflict preserve both prior stored bytes and editor draft; recovery remains possible.
- Re-save unchanged keeps identity/version; changed re-save advances version and source provenance while preserving optional extension metadata.
- No artifact serialized in window preferences and all twelve WP2 browser regressions pass.
- Product tests call actual codec/store/workflow/editor; Chromium journeys use actual download content, not hand-authored downstream positive fixtures.
- Declared validation and all triggered exact-head/current-base workflows, Windows/Ubuntu builds, browser evidence pass before merge.

## Non-goals
Server/Core storage, cross-device sync, automatic persistence, structural graph authoring, File Manager, .process, deployment, multi-tab transactional guarantee, disk-save receipt or codec/common-schema changes.

## Evidence expected
One authoritative TASK commit, Sprint report and one B PR, retained Chromium screenshots/download/regression evidence.

## Escalation
Stop for forbidden path, worker collision, required contract/ADR changes or failing no-data-loss guarantee. Optional C is promoted only from fresh evidence after B integrates.

## Implementation checkpoint
IMPLEMENTED_ON_SPRINT_BRANCH; focused codec/store/workflow tests passed 13/13 locally. Final exact-head Actions/build/Chromium proof and integration required.
