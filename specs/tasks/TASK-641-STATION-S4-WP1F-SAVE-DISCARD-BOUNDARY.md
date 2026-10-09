---
id: TASK-641
title: STATION S4 WP1-F Save/Discard Station Draft Boundary
status: ready
priority: 641
milestone: STATION-S4-VISUAL-FACTORY-WP1
model_tier: architecture
risk: high
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-640
context_paths:
  - AGENTS.md
  - docs/DOCUMENT_AUTHORITY.md
  - docs/contracts/002-station-visual-factory/ADDENDUM.md
  - docs/current/NEXT_WORK.md
  - project_docs/execution_planning/STATION-S4-VISUAL-FACTORY-WP1-PLAN-01.md
  - packages/station-editor/**
  - packages/station-composition/draft-transaction.ts
  - packages/station-composition/graph-validation.ts
allowed_paths:
  - packages/station-editor/draft-boundary.ts
  - packages/station-editor/index.ts
  - tests/product/station-editor-save-discard-boundary.test.ts
  - specs/tasks/TASK-641-STATION-S4-WP1F-SAVE-DISCARD-BOUNDARY.md
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
  - npx tsx --test tests/product/station-editor-save-discard-boundary.test.ts
  - npm run verify
---

# TASK-641 — Save/Discard Station-Owned Draft Boundary

## Goal and authority

Implement the first explicit **Station-owned** save/accept and discard boundary over the existing `EditorSession` and `CompositionDraftTransaction`. The single Station draft remains the only editable model. This is a pure contract/API tranche, **not** a durable save endpoint, UI, business rollback, compensation, Core command or publish operation. Authority: accepted Contract Addendum 002, WP1 plan, integrated predecessor TASK-640.

## Reconciled predecessor

TASK-639 PR #1023 integrated at `44f22b4d0ccfa82dc95dbe230ac3731c2e9fd015`; TASK-640 planning PR #1024 integrated at `46a9cf0e72726a4b667a096051b1cb5e0a95795d`, construction PR #1025 squash-integrated at `e92d612e0e804ecb004c5d01e33728de0fb2dd6f` (2026-10-09). Revalidate main, PRs, checks, source and this TASK before construction.

## Input/output contracts

- Input: current `EditorSession`, `ComponentRegistry`, and explicit `expectedDraftRevision` for **both** operations. Do not use implicit UI selection/focus/active/expansion as save authority.
- Output: frozen discriminated result `accepted: true/false`, with explicit `changed`, original or resulting `session`, and for successful save an immutable Station-owned accepted composition snapshot/receipt identifying session/composition, external base revision and accepted draft revision. Rejection includes a bounded reason and preserves input identity and data.
- Save/accept: validate session, transaction, graph, registry and currentness before acting. Accept the **current Station draft only** into a new local transaction baseline; return a receipt/snapshot without claiming remote/durable persistence or changing external `base.revision`/currentness. A clean/equivalent save is deterministic/idempotent; do not manufacture a revision increment.
- Discard: restore the **last locally accepted transaction base** deterministically using existing `discardCompositionDraft` semantics; a changed discard advances `draftRevision` by exactly one to invalidate stale intents; a clean discard is a no-op. Do not rewrite external `base.revision`.
- For both operations, prevent unsafe revision overflow, reject stale/forged/malformed/incompatible/unknown state fail-closed, and never mutate input/session/registry/graph on rejection or success. No alternate canonical store.
- After save or discard, Layers, Inspector and Preview must converge at the resulting draft revision. A subsequent valid WP1-D edit must still work. A stale replay of save/discard/edit must not silently succeed.
- Use existing `CompositionDraftTransaction` helpers and validation contracts. If correct implementation requires changing station-composition, public contracts, UI or files outside allowlist, record a proof gap rather than expanding this TASK.

## Bounded implementation

1. Add `packages/station-editor/draft-boundary.ts` with pure typed save/discard operations and explicit Station-only acceptance receipt. Export via `packages/station-editor/index.ts`. Keep existing `session.ts`, `edit.ts`, `preview.ts` and composition engine unchanged unless a separate scope decision is made.
2. Validate exact identity/currentness/revision, transaction consistency, registry compatibility and graph shape. Reject malformed/forged state without throwing or returning partial accepted data.
3. Save re-baselines only Station-local transaction state, not external canonical revision. Discard restores local accepted baseline, not Core/business rollback. Snapshot all output data immutably.
4. Add focused predecessor-integration QA and prove no-op/idempotence, stale replay, rejected-state preservation, revision overflow and recovery.
5. One authoritative implementation commit, at most five allowlisted files. Do not implement WP1-G/H, DOM/UI, storage, persistence, publish, providers, C10 or arbitrary CSS/pixel authoring.

## Acceptance / proof obligations

1. **Positive:** changed WP1-D edit -> synchronized Layers/Inspector/Preview -> explicit save receipt and clean Station transaction; later edit -> discard -> restore last saved composition, with convergent projections.
2. **Negative:** stale expected revision, stale/unknown base currentness, malformed refs, unknown registry and incompatible graph reject without mutation or false acceptance.
3. **Adversarial:** forged transaction/dirty flags, duplicate/cyclic/disconnected nodes, invalid/overflow revisions, malicious extra fields and foreign session identity fail closed without throwing or partial result.
4. **Recovery:** invalid attempt followed by valid save/discard succeeds; changed discard invalidates old edit intent; clean save/discard is deterministic and does not advance revision.
5. **Boundaries:** identity != placement != presentation != action; ComponentRegistry != AppManifest; selection != focus != active != expansion; discrete grid/span, C0-C9 preserved, C10 DEFERRED; no Core/business/command/durable persistence.
6. **Accessibility:** N/A for contract-only tranche (no DOM/UI). Keyboard/focus/a11y tests become mandatory if a UI surface is separately admitted.

## Gates and escalation

Run `npx tsx --test tests/product/station-editor-save-discard-boundary.test.ts` and `npm run verify` on exact implementation HEAD, then require current exact-head and merge-candidate CI, semantic review, one-commit/allowlist proof before squash integration. IMPLEMENTED != PROVEN != INTEGRATED. Only after TASK-641 integration may WP1-G Integrated Editor Journey be materialized. Any need to redefine external base/currentness, introduce persistence or change public architecture is a gap requiring explicit separate authority.
