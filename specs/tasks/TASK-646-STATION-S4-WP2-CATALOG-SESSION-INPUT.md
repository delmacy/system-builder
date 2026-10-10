---
id: TASK-646
title: Station S4 WP2 Catalog Session Input
status: verification
priority: 646
milestone: STATION-S4-WP2-EDITOR-OPERATIONAL
model_tier: architecture
risk: medium
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-645
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
  - apps/station/web/app/station-editor-catalog.ts
  - tests/product/station-editor-catalog.test.ts
  - specs/tasks/TASK-646-STATION-S4-WP2-CATALOG-SESSION-INPUT.md
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
---

# TASK-646 — Station S4 WP2 Catalog Session Input

## Objective

Station S4 WP2 Catalog Session Input. Execute only after the planning increment integrates and the predecessor is satisfied.

## Context

WP1 is closed at 1c2625acacf2e161e388b031026da3766a84902d. WP2 source-owned catalog/Station journey is admitted by Addendum 003. Construction A owns app-local catalog and reusable workbench only; desktop integration remains forecast B.

## Current behavior

The actual workbench embeds one fixed grid/two-button graph and hardcoded labels/span limits. Public editor/composition APIs and seven Chromium journeys are integrated. Station's ButtonGroup descriptor/graph exists but its display-only Layers fixture is not canonical graph data.

## Required change

Create a pure app-local catalog adapter using existing public normalized descriptors and graph validation. Preserve the WP1 example definition as the default and add an admitted Station ButtonGroup composition using BUTTON_GROUP_DESCRIPTOR and actual typed slots; do not use the separate lab Layers fixture. Export immutable reference/title/node-label/registry/graph information and a validated catalog lookup/session initializer; initialize only known, compatible definitions with distinct session/application/composition identities and current known revisions. Unknown/blank refs and malformed/incompatible catalog definitions reject before replacement; no silent fallback to the example. Do not expose raw arbitrary JSON import. Do not modify the existing packages or lab.

Pure product tests must cover both real definitions, graph validity, deterministic session initialization, unknown ref rejection with prior session untouched, distinct identities, descriptor/slot compatibility and labels that correspond to actual graph refs. Use real predecessor initializeEditorSession/validation, no handcrafted output session.

## Inputs / contracts

Existing public station-editor and station-composition APIs; admitted normalized descriptors/graphs; app-local catalog references. No private APIs or arbitrary external JSON.

## Outputs / contracts

One Station-owned session at a time with canonical projections and honest in-memory acceptance/discard. Catalog definition does not imply business or persistence authority.

## Acceptance criteria

- Both admitted definitions initialize through public APIs and retain source graph immutability.
- Source ButtonGroup graph uses its actual descriptor slot policy.
- Unknown/invalid refs never create a success session or replace a prior session.
- No UI behavior or public package contract change in this TASK.
- Full verify and Station build pass; report exact evidence.

## Non-goals

No external files/JSON/provider input, durable saving, Core/business authority, desktop launcher construction, C10/Studio, public package/schema changes, new dependencies/workflows or hidden pixel authoring.

## Evidence expected

Positive, negative and predecessor-integration evidence; exact-head/base and CI/artifact references in the Sprint report, with separate IMPLEMENTED/PROVEN/INTEGRATED state. One authoritative TASK commit, preserved at Sprint integration.

## Escalation

Stop for missing public capability, forbidden-path requirement, undeclared L3/L4 or scope drift. Record the precise correction; do not expand this TASK silently.

## Implementation checkpoint — 2026-10-10
App-local source catalog and focused tests committed on Construction A branch; proof and integration pending final Actions. No WP2 UI or Station launcher claim.
