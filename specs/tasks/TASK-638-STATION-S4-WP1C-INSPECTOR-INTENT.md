---
id: TASK-638
title: STATION S4 WP1-C Inspector Projection and Edit Intent
status: ready
priority: 638
milestone: STATION-S4-VISUAL-FACTORY-WP1
model_tier: architecture
risk: medium
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-637
context_paths:
  - docs/DOCUMENT_AUTHORITY.md
  - docs/contracts/002-station-visual-factory/ADDENDUM.md
  - docs/current/NEXT_WORK.md
  - project_docs/execution_planning/STATION-S4-VISUAL-FACTORY-WP1-PLAN-01.md
  - packages/station-editor/**
  - packages/station-composition/**
allowed_paths:
  - packages/station-editor/**
  - tests/product/station-editor-inspector-intent.test.ts
  - specs/tasks/TASK-638-STATION-S4-WP1C-INSPECTOR-INTENT.md
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

# TASK-638 — Inspector Projection and Structural Edit Intent

## Objective

Expose selected-node Inspector properties from the existing Station editor draft, and typed structural edit intents for later validation. Inspector never applies edits.

## Context

WP1-A integrated a draft editor session. WP1-B integrated deterministic Layers and explicit single selection. WP1-C builds on both without another composition store.

## Current behavior

The editor session exposes a validated draft and revision. Layers exposes stable node refs and selection. Inspector and typed edit intents do not yet exist.

## Inputs / contracts

- Current editor session, draft graph and revision.
- Current Layers projection and explicit selection.
- Typed span or placement requests for a selected non-root node.
- No DOM, Core, business commands, persistence or arbitrary pixel/CSS authoring.

## Outputs / contracts

- Immutable selected-node Inspector snapshot of identity, component, placement and discrete spans; explicit empty state.
- Fail-closed rejection for unknown selection, invalid hierarchy or stale revision.
- Typed set-span and set-placement intents bound to selected node and draft revision, without applying mutation.
- No focus, active or expansion state invented.

## Required change

1. Implement read-only Inspector projection in packages/station-editor/inspector.ts.
2. Implement pure typed structural edit-intent constructors, validating shape, identity, revision and discrete positive safe-integer spans.
3. Export from packages/station-editor/index.ts.
4. Add focused product tests covering positive, negative, adversarial and recovery cases with zero draft mutation.
5. Do not add DOM/UI in this tranche.

## Acceptance criteria

1. Inspector reads exclusively from the existing draft, independent of graph array order.
2. Empty selection never implicitly selects root; unknown refs and invalid hierarchy reject.
3. Intents bind exact selected node and expected draft revision; root, stale, malformed and non-discrete spans reject.
4. Neither Inspector nor intent construction mutates session, selection, draft or caller input.
5. Intents are proposals only; WP1-D owns registry compatibility and actual validated mutation.
6. Selection remains independent of focus, active and expansion.
7. Tests cover WP1-A/B integration, invalid state and valid recovery after rejection.

Keyboard/focus/accessibility proof is N/A for contract-only work; mandatory once a UI surface is introduced.

## Non-goals

No grid mutation, Preview, save/discard, DOM, C10/Studio, Core authority, persistence, provider/runtime/deploy/secrets, HTML/CSS or pixel placement.

## Evidence expected

Run npm run verify at exact implementation HEAD and current merge-candidate CI; review product diff before integration.

## Escalation

Stop if implementation requires competing canonical state, new business authority or unauthorized public architecture changes.

## Closure rule

Only after TASK-638 is IMPLEMENTED, PROVEN and INTEGRATED may WP1-D proceed.
