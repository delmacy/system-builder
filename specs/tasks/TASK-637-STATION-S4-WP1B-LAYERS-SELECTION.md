---
id: TASK-637
title: STATION S4 WP1-B Layers Projection & Selection Contract
status: ready
priority: 637
milestone: STATION-S4-VISUAL-FACTORY-WP1
model_tier: architecture
risk: medium
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-636
context_paths:
  - docs/DOCUMENT_AUTHORITY.md
  - docs/contracts/002-station-visual-factory/ADDENDUM.md
  - docs/current/NEXT_WORK.md
  - project_docs/execution_planning/STATION-S4-VISUAL-FACTORY-WP1-PLAN-01.md
  - packages/station-editor/**
  - packages/station-interaction/**
allowed_paths:
  - packages/station-editor/**
  - tests/product/station-editor-layers-selection.test.ts
  - specs/tasks/TASK-637-STATION-S4-WP1B-LAYERS-SELECTION.md
  - docs/current/NEXT_WORK.md
forbidden_paths:
  - apps/**
  - packages/core/**
  - provider/**
  - runtime/**
  - deploy/**
max_files: 6
validation:
  - npm run verify
---

# TASK-637 — Station S4 WP1-B Layers Projection & Selection Contract

Status: READY / AUTHORIZED AFTER MATERIALIZATION MERGE
Date: 2026-10-07

## Objective

Add the smallest deterministic Layers hierarchy projection and explicit single-selection contract over the Station-owned editor draft established by TASK-636, without introducing a competing store or coupling selection to focus, active context, or expansion.

## Required change

- derive Layers hierarchy from the editor session draft/projection only;
- expose stable node references that preserve composition identity without conflating identity with placement/presentation/action;
- provide explicit single selection with deterministic selected-node projection;
- reuse shared interaction concepts where applicable rather than creating parallel authority;
- preserve selection != focus != active != expansion;
- malformed, unknown, duplicate, stale or incompatible node references fail closed before selection mutation;
- rejected selection leaves session draft and prior valid selection unchanged;
- repeated equivalent projection/selection is deterministic/idempotent.

## Acceptance criteria

- hierarchy is deterministic for equivalent valid draft state;
- node refs are stable and map unambiguously to admitted composition nodes;
- selection is explicit, singular and independent of focus/active/expansion;
- unknown/duplicate/malformed/stale refs fail closed with zero partial mutation;
- selecting does not mutate canonical/base composition or business state;
- no Core/business/command/persistence authority is introduced;
- focused executable proof covers happy, negative, adversarial and recovery behavior.

Accessibility/keyboard/focus is N/A for this tranche because it introduces no DOM/UI/focus surface. Those obligations become mandatory when a UI surface is introduced.

## Non-goals

No Layers DOM/UI, keyboard navigation, Inspector, Preview, grid/span editing, save persistence, drag/drop, specialized Studio, C10, Core/business authority, arbitrary HTML/CSS, provider/runtime/deploy/secrets or AI/MCP.

## Evidence expected

Focused proof at `tests/product/station-editor-layers-selection.test.ts` plus `npm run verify` on the exact implementation head. Integration requires current Merge Candidate CI when applicable.

## Closure rule

Do not begin WP1-C until TASK-637 is integrated on fresh main with current exact-head proof and repository memory reconciled.
