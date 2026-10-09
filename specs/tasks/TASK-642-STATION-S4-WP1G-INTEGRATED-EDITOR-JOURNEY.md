---
id: TASK-642
title: STATION S4 WP1-G Integrated Editor Journey
status: ready
priority: 642
milestone: STATION-S4-VISUAL-FACTORY-WP1
model_tier: architecture
risk: medium
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-641
context_paths:
  - AGENTS.md
  - docs/DOCUMENT_AUTHORITY.md
  - docs/contracts/002-station-visual-factory/ADDENDUM.md
  - docs/current/NEXT_WORK.md
  - project_docs/execution_planning/STATION-S4-VISUAL-FACTORY-WP1-PLAN-01.md
  - packages/station-editor/**
  - packages/station-composition/**
  - packages/ui-core/tree.tsx
  - packages/ui-core/editor-shell.tsx
  - apps/station/web/app/component-lab-editor-proof.tsx
allowed_paths:
  - apps/station/web/app/station-editor-journey.tsx
  - apps/station/web/app/editor/page.tsx
  - packages/ui-core/tree.tsx
  - tests/product/station-editor-integrated-journey.test.ts
  - tests/product/station-editor-keyboard-a11y.test.ts
  - specs/tasks/TASK-642-STATION-S4-WP1G-INTEGRATED-EDITOR-JOURNEY.md
  - docs/current/NEXT_WORK.md
forbidden_paths:
  - packages/core/**
  - packages/station-composition/**
  - packages/station-editor/**
  - packages/station-app-runtime/**
  - provider/**
  - runtime/**
  - deploy/**
max_files: 7
validation:
  - npx tsx --test tests/product/station-editor-integrated-journey.test.ts tests/product/station-editor-keyboard-a11y.test.ts
  - npm run verify
  - npm run station:build
---

# TASK-642 — Integrated Editor Journey

## Objective

Deliver a bounded Station-local UI at /editor that loads an admitted composition, selects a layer, inspects its properties, applies discrete grid/span edits, projects the same change in Preview, and explicitly accepts or discards the local draft. This is not a specialized Studio or a new composition authority.

## Context

WP1-A/B/C/D/E/F are integrated; TASK-641 PR #1028 was squash-merged on 2026-10-09 at main e42b8e882f08153a30571c7fdd7b300c32cc987d. PR #1027 is superseded and must not be merged. Revalidate main, PRs and CI before construction. WP1-H is a successor.

## Current behavior

packages/station-editor exports one session, Layers/selection, Inspector/typed intents, validated grid/span edits, Preview and local save/discard. EditorShell, Tree and PropertyInspector exist in ui-core. The older component-lab uses different legacy editor state; do not replace or silently reuse its authority. The Tree keyboard handler selects a neighbor but may not move DOM focus: prove or fix only within the allowlist.

## Inputs / contracts

- One admitted local CompositionGraph and explicit ComponentRegistry; session, application and composition identity distinct, canonical/base revision and currentness explicit.
- One React-owned EditorSession; selection, expansion and DOM focus independent. Layers, Inspector and Preview read only the same draft/revision.
- Reuse EditorShell and UI primitives. A Tree keyboard correction, if needed, must preserve existing callers and be covered by tests.

## Outputs / contracts

- A reachable /editor page with Layers, Inspector, structural Preview, typed span edit, local Accept and Discard, validation/currentness feedback and accessible keyboard interaction.
- Changed edits increment draft revision exactly once; all projections converge. Rejected operations preserve input; save returns only a Station-local accepted snapshot, discard restores local baseline. External base revision never changes.
- Focused integrated and accessibility evidence. Browser interaction evidence is required before claiming keyboard/focus PROVEN; static rendering alone is insufficient.

## Required change

1. Add isolated apps/station/web/app/editor/page.tsx and station-editor-journey.tsx, without modifying the older component lab or app manifests.
2. Initialize exactly one EditorSession with admitted registry/graph. Track selection, expansion and focus separately; no competing projection stores.
3. Use projectEditorLayers/selectEditorLayer, projectEditorInspector, projectEditorPreview, typed WP1-C/D intents and applyEditorStructuralEditIntent for all UI operations.
4. Use acceptEditorDraft/discardEditorDraft with exact draft revision. Surface accepted/rejected, changed/no-op and local-only status, never remote persistence or business rollback.
5. Ensure accessible names, visible focus, keyboard-selectable hierarchy, reachable controls and status announcements. If Tree roving focus fails, repair only packages/ui-core/tree.tsx with regression proof.
6. Test positive, negative, adversarial, recovery, stale-intent replay and predecessor integration via real module APIs, not hand-authored downstream snapshots.
7. Preserve one authoritative implementation commit, seven-file allowlist and forbidden paths. New dependencies or cross-boundary changes require explicit escalation.

## Acceptance criteria

1. **Positive:** open/select/inspect/edit discrete span/preview/save/discard via integrated APIs; Layers, Inspector and Preview share draft revision.
2. **Negative:** stale/unknown base, wrong revision, incompatible registry, unknown selection and invalid span reject without partial mutation.
3. **Adversarial:** malformed, forged, duplicate, disconnected or cyclic graph and unexpected fields cannot be accepted or projected as valid.
4. **Recovery:** rejection preserves session; valid follow-up succeeds; replayed intent stale after changed edit/save/discard; no-op preserves identity.
5. **Accessibility:** keyboard-only navigation and activation; ArrowUp/Down/Home/End and expand/collapse, roving focus, visible focus, accessible names and status feedback proven in browser. Static SSR does not prove focus movement.
6. **Boundaries:** identity != placement != presentation != action; ComponentRegistry != AppManifest; selection != focus != active != expansion; C0-C9 preserved, C10 DEFERRED; Station without Core/business/persistence.

## Non-goals

No free-drag/pixel authoring, arbitrary HTML/CSS, specialized Studio, provider/runtime/deploy/secrets, external storage or canonical revision update, Core/business command, C10 promotion or architecture change.

## Evidence expected

Focused integrated and keyboard tests, browser focus/a11y proof, npm run verify and npm run station:build on exact HEAD, fresh exact-head and merge-candidate CI, semantic review, one commit and allowlist. If browser evidence is missing mark accessibility UNPROVEN and leave PR Draft. IMPLEMENTED != PROVEN != INTEGRATED. Materialize WP1-H only after WP1-G integration.

## Escalation

If the journey requires forbidden files, new public contracts, persistence, Core authority, C10 or additional dependencies, record the gap and seek explicit change control.
