---
id: TASK-640
title: STATION S4 WP1-E Preview Convergence Projection
status: ready
priority: 640
milestone: STATION-S4-VISUAL-FACTORY-WP1
model_tier: architecture
risk: medium
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-639
context_paths:
  - AGENTS.md
  - docs/DOCUMENT_AUTHORITY.md
  - docs/contracts/002-station-visual-factory/ADDENDUM.md
  - docs/current/NEXT_WORK.md
  - project_docs/execution_planning/STATION-S4-VISUAL-FACTORY-WP1-PLAN-01.md
  - packages/station-editor/**
  - packages/station-composition/**
allowed_paths:
  - packages/station-editor/preview.ts
  - packages/station-editor/index.ts
  - tests/product/station-editor-preview-convergence.test.ts
  - specs/tasks/TASK-640-STATION-S4-WP1E-PREVIEW-CONVERGENCE.md
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
  - npx tsx --test tests/product/station-editor-preview-convergence.test.ts
  - npm run verify
---

# TASK-640 — Preview Convergence Projection

## Objective

Expose a deterministic, read-only Preview projection of the **same** Station-owned editor session draft used by Layers and Inspector. An accepted WP1-D structural edit must converge across all three projections at the same draft revision. This is a contract-only projection tranche, not a new DOM/editor UI or an alternate store.

## Context

WP1-D/TASK-639 planning PR #1021 integrated at `d05454e115fb7845773950895b08e9647f360904`; its construction PR #1023 integrated by squash on 2026-10-09 at `44f22b4d0ccfa82dc95dbe230ac3731c2e9fd015`. Revalidate fresh main before construction. Scope is bounded by Contract Addendum 002 and the WP1 plan. WP1-F save/discard and WP1-G UI journey are later lots, not silently admitted here.

## Current behavior

WP1-A owns one Station editor session and immutable draft revisions; WP1-B projects deterministic Layers and explicit selection; WP1-C projects read-only Inspector and typed structural intent; WP1-D applies validated grid/span edits. No Preview projection currently binds to the same draft/revision.

## Inputs / contracts

- Inputs: `EditorSession`, optional explicit `LayersSelection` and `ComponentRegistry` for structural validation; reuse existing Station composition/graph contracts.
## Outputs / contracts

- Output: pure, immutable, discriminated `projectEditorPreview(...)` result with current session/composition identity, draft revision, deterministic structural node order, component identity, parent/slot and discrete span placement, and explicit selected-node correlation when supplied.
- Rejected result identifies fail-closed reason; no invented placeholder node, implicit root selection, alternative revision or partial projection.
- Preview has no business/action/persistence authority and does not render arbitrary HTML/CSS.

## Required change

1. Add `packages/station-editor/preview.ts` and export it from `packages/station-editor/index.ts`; do not alter the composition engine.
2. Derive Preview exclusively from `session.transaction.draft` and the current draft revision. Validate session/currentness, composition hierarchy, registry compatibility and deterministic node order using existing validators/projections.
3. Preserve exact node/component identities and placements, including root and child relationships. Avoid copying mutable input references into output. Do not reinterpret discrete grid/span as pixels.
4. When selection is provided, require explicit valid selection; selected-node correlation must agree with Layers and Inspector. Selection, focus, active and expansion remain independent.
5. An accepted WP1-D changed edit must converge across Layers, Inspector and Preview with the same revision; an accepted no-op leaves all projections identical. Rejected edits must leave original projections unchanged.
6. Reject malformed/forged/stale/unknown/disconnected/cyclic/incompatible input fail-closed, without exception or partial result; recovery on a later valid input must succeed.
7. Remain within five allowlisted files and one authoritative implementation commit. No DOM/UI, save/discard, Core/business/persistence, provider/runtime/deploy, C10 or arbitrary CSS/pixels.

## Acceptance criteria

1. **Positive:** deterministic Preview of admitted draft; after set-span and set-placement, exactly the edited node changes in Preview and agrees with Layers/Inspector.
2. **Negative:** stale/unknown base currentness, invalid selection, malformed identity, incompatible registry or hierarchy reject without mutation.
3. **Adversarial:** forged objects, duplicate/disconnected/cyclic/unknown nodes, invalid spans and unexpected revision fail closed without throwing.
4. **Recovery:** invalid input followed by valid projection succeeds; rejected WP1-D intent preserves previous Preview; replayed changed intent is stale; no-op is deterministic.
5. **Orthogonality:** identity != placement != presentation != action; ComponentRegistry != AppManifest; selection != focus != active != expansion; C0-C9 remain, C10 DEFERRED.
6. **Accessibility:** N/A for contract-only tranche without DOM. Keyboard/focus/a11y evidence is mandatory if a UI surface is introduced in a separately authorized TASK.

## Non-goals

No DOM/UI, save/discard, Core/business/command or persistence authority, provider/runtime/deploy/secrets, C10/Studio, alternative Preview store, arbitrary HTML/CSS or pixel placement. No station-composition package refactor.

## Evidence expected

Run focused positive/negative/adversarial/recovery and predecessor-integration tests, then `npm run verify` on exact HEAD. Require current exact-head and merge-candidate CI, semantic/architecture review, one commit and file allowlist before integration. IMPLEMENTED != PROVEN != INTEGRATED. Only after TASK-640 integration may WP1-F be materialized.

## Escalation

If correctness requires new public contracts, mutation of station-composition, DOM/UI or additional files outside the allowlist, record an explicit proof gap and seek separate authorization instead of expanding scope.
