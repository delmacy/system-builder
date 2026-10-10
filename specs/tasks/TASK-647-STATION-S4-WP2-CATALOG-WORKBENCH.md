---
id: TASK-647
title: Station S4 WP2 Catalog Workbench and Safe Switching
status: ready
priority: 647
milestone: STATION-S4-WP2-EDITOR-OPERATIONAL
model_tier: architecture
risk: medium
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-646
context_paths:
  - AGENTS.md
  - docs/DOCUMENT_AUTHORITY.md
  - docs/contracts/CONTRACT_INDEX.md
  - docs/contracts/003-station-editor-operational-journey/ADDENDUM.md
  - docs/current/NEXT_WORK.md
  - project_docs/execution_planning/STATION-S4-WP2-EDITOR-OPERATIONAL-PLAN-01.md
  - project_docs/execution_planning/STATION-S4-WP2-CONSTRUCTION-A-01.md
  - packages/station-editor/**
  - packages/station-composition/**
  - apps/station/web/app/station-editor-workbench.tsx
allowed_paths:
  - apps/station/web/app/station-editor-workbench.tsx
  - tests/browser/station-editor-workbench.spec.ts
  - specs/tasks/TASK-647-STATION-S4-WP2-CATALOG-WORKBENCH.md
  - project_docs/execution_planning/STATION-S4-WP2-CONSTRUCTION-A-01.report.md
  - docs/current/NEXT_WORK.md
forbidden_paths:
  - packages/**
  - .github/**
  - apps/station/web/app/station-foundation-client.tsx
  - apps/station/web/app/component-lab-editor-proof.tsx
  - provider/**
  - runtime/**
  - deploy/**
max_files: 5
validation:
  - npm run verify
  - npm run station:build
  - npx playwright test --config tests/browser/station-editor.playwright.config.ts
---

# TASK-647 — Station S4 WP2 Catalog Workbench and Safe Switching

## Objective

Station S4 WP2 Catalog Workbench and Safe Switching. Execute only after the planning increment integrates and the predecessor is satisfied.

## Context

WP1 is closed at 1c2625acacf2e161e388b031026da3766a84902d. WP2 source-owned catalog/Station journey is admitted by Addendum 003. Construction A owns app-local catalog and reusable workbench only; desktop integration remains forecast B.

## Current behavior

The actual workbench embeds one fixed grid/two-button graph and hardcoded labels/span limits. Public editor/composition APIs and seven Chromium journeys are integrated. Station's ButtonGroup descriptor/graph exists but its display-only Layers fixture is not canonical graph data.

## Required change

Use TASK-646's actual adapter in the workbench; remove inline fixed registry/graph authority. Keep the existing default example and seven browser journeys intact. Offer labeled catalog selection; clean switching starts a fresh source-owned session. Dirty switching shows accessible explicit Cancel and Discard-and-open actions; Cancel preserves fields, session/revision/selection and restores initiating focus; no automatic save/discard. Explain that switching/reload does not durably retain accepted changes.

Allow an app-local initialCompositionRef for later Station wiring; invalid initial refs show safe unavailable state rather than initialize another composition. Derive node labels/hierarchy and Inspector min/max from admitted descriptors; do not reuse 1–4/1–2 help for incompatible ButtonGroup limits. Render actual admitted graph hierarchy/Preview placement using existing grammar; no fabricated layer nodes or flattening that lies about parentage. Preserve orthogonal focus/selection/expansion and one EditorSession. No desktop client edits.

Extend actual browser route tests: select the second catalog composition, edit within its constraints and save/discard, reject outside bounds without mutation then recover; dirty switch cancellation and explicit discard; clean switch/session reset; native labels/status/keyboard/focus and all original seven regressions.

## Inputs / contracts

Existing public station-editor and station-composition APIs; admitted normalized descriptors/graphs; app-local catalog references. No private APIs or arbitrary external JSON.

## Outputs / contracts

One Station-owned session at a time with canonical projections and honest in-memory acceptance/discard. Catalog definition does not imply business or persistence authority.

## Acceptance criteria

- Both source-owned compositions are usable through the same workbench and canonical session APIs.
- Dirty switching never silently replaces state; cancel and explicit discard are proven.
- Registry-derived limits and actual hierarchy/Preview agree for each composition.
- Default WP1 seven-test regression stays passing.
- Final full verify/build/browser and all triggered CI pass; actual browser report/screenshot artifact retained.
- Desktop launcher and per-window lifetime are not claimed before Construction B.

## Non-goals

No external files/JSON/provider input, durable saving, Core/business authority, desktop launcher construction, C10/Studio, public package/schema changes, new dependencies/workflows or hidden pixel authoring.

## Evidence expected

Positive, negative and predecessor-integration evidence; exact-head/base and CI/artifact references in the Sprint report, with separate IMPLEMENTED/PROVEN/INTEGRATED state. One authoritative TASK commit, preserved at Sprint integration.

## Escalation

Stop for missing public capability, forbidden-path requirement, undeclared L3/L4 or scope drift. Record the precise correction; do not expand this TASK silently.
