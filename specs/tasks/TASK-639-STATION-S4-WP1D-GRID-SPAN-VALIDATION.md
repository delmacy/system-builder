---
id: TASK-639
title: STATION S4 WP1-D Grid/Span Edit and Fail-Closed Validation
status: ready
priority: 639
milestone: STATION-S4-VISUAL-FACTORY-WP1
model_tier: architecture
risk: medium
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-638
context_paths:
  - docs/DOCUMENT_AUTHORITY.md
  - docs/contracts/002-station-visual-factory/ADDENDUM.md
  - docs/current/NEXT_WORK.md
  - project_docs/execution_planning/STATION-S4-VISUAL-FACTORY-WP1-PLAN-01.md
  - packages/station-editor/**
  - packages/station-composition/**
allowed_paths:
  - packages/station-editor/edit.ts
  - packages/station-editor/index.ts
  - tests/product/station-editor-grid-span-validation.test.ts
  - specs/tasks/TASK-639-STATION-S4-WP1D-GRID-SPAN-VALIDATION.md
  - docs/current/NEXT_WORK.md
forbidden_paths:
  - apps/**
  - packages/core/**
  - packages/station-composition/**
  - provider/**
  - runtime/**
  - deploy/**
max_files: 5
validation:
  - npm run verify
---

# TASK-639 — Grid/Span Edit and Fail-Closed Validation

## Objective

Consume typed Inspector structural edit intents and apply one validated discrete grid/span edit to the **same** Station-owned editor draft. Return explicit accepted/rejected evidence and an immutable new session on change; an intent proposal is never already-applied mutation.

## Context

WP1-D follows integrated WP1-C/TASK-638 at main@60b93c4d5e2d390e7ea251d68347c779d9a8e219 (revalidate fresh main). This TASK is bounded by the accepted Station S4 Addendum and WP1 plan. Implement only after this planning materialization integrates. Do not reopen TASK-636/637/638 absent regression.

## Current behavior

WP1-A provides a Station-owned editor session, draft revision and mutation boundary. WP1-B provides deterministic Layers and explicit selection. WP1-C provides read-only Inspector and typed set-span/set-placement **proposals**, but no validated application of those intents.

## Inputs / contracts

- `EditorStructuralEditIntent`, `LayersSelection`, `projectEditorInspector` and `projectEditorLayers` from station-editor.
- `EditorSession` and `applyEditorSessionMutation` for Station draft/revision updates.
- `ComponentRegistry` and existing composition graph placement, slot, family and span validation.
- The draft root, node identities and componentRefs are preserved.

## Outputs / contracts

- Pure `applyEditorStructuralEditIntent(session, selection, intent, registry)` API exported by station-editor.
- Discriminated immutable result: accepted/changed/session or rejected/reason/original-session.
- Only an accepted changed edit creates a new draft and increments its revision once; the base revision is unchanged.
- No alternate draft store, no Core/business/persistence/command authority.

## Required change

1. Add `packages/station-editor/edit.ts` and export its entry point from `index.ts`.
2. Recheck session/currentness, graph hierarchy, explicit selection, session/composition/node identity and exact draft revision **at application time**. Forged or runtime-malformed intents must reject rather than throw.
3. `set-span` retains parent/slot and replaces only two positive safe-integer spans. `set-placement` replaces only parent/slot/spans. Reject root, unknown parent, self/descendant cycles, invalid slot, unknown/incompatible components and out-of-bounds spans.
4. Route edits through the existing Station draft mutation/validation boundary. Validate the resulting hierarchy, including cycles and disconnected nodes, before acceptance. Rejection preserves the same original session object, selection and graph.
5. Identical edits are accepted no-ops without revision increment. Changed edits increment draft revision exactly once and leave base revision unchanged.
6. Keep the change within five allowed files; no UI, Preview, save/discard, persistence, Core/business, provider/runtime/deploy, arbitrary CSS/pixels or C10.

## Acceptance criteria

1. **Positive:** valid span and placement edits update exactly one node; Layers and Inspector converge on the accepted draft and revision.
2. **Negative:** stale revision, wrong session/composition/selection/node, empty/root/unknown selection, invalid parent/slot, incompatible registry placement and out-of-range/fractional/zero/unsafe spans reject with zero mutation.
3. **Adversarial:** forged objects, unknown intent type, NaN/Infinity, unknown component, cycle/descendant placement and invalid preexisting hierarchy fail closed without exception or partial mutation.
4. **Recovery:** a valid intent after rejection succeeds against unchanged draft; replay of old changed intent is stale; equivalent no-op is deterministic.
5. **Orthogonality:** identity != placement != presentation != action; selection != focus != active != expansion; ComponentRegistry != AppManifest. No implicit selection or UI focus changes.
6. **UI evidence:** keyboard/focus/accessibility N/A for this contract-only tranche, mandatory when UI introduced.

## Non-goals

No DOM/UI, Preview, save/discard, C10/Studio, Core/business/command authority, persistence, provider/runtime/deploy/secrets, arbitrary HTML/CSS or pixel placement. No composition package refactor or architectural expansion.

## Evidence expected

Focused: `npx tsx --test tests/product/station-editor-grid-span-validation.test.ts`.
Full: `npm run verify` on the exact implementation HEAD, followed by current merge-candidate CI and semantic/architecture review before integration. One authoritative TASK-639 implementation commit. IMPLEMENTED != PROVEN != INTEGRATED.

## Escalation

If correctness requires modifying station-composition validation, public contracts or architecture outside the allowlist, record the specific proof gap and seek a separately authorized bounded change. After TASK-639 integration, materialize WP1-E Preview Convergence from fresh main.
