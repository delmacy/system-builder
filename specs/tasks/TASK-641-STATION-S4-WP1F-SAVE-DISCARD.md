---
id: TASK-641
title: STATION S4 WP1-F Save/Discard Station Draft Boundary
status: ready
priority: 641
milestone: STATION-S4-VISUAL-FACTORY-WP1
model_tier: architecture
risk: medium
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
  - packages/station-composition/**
allowed_paths:
  - packages/station-editor/draft-boundary.ts
  - packages/station-editor/index.ts
  - tests/product/station-editor-draft-boundary.test.ts
  - specs/tasks/TASK-641-STATION-S4-WP1F-SAVE-DISCARD.md
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
  - npx tsx --test tests/product/station-editor-draft-boundary.test.ts
  - npm run verify
---

# TASK-641 — Save/Discard Station Draft Boundary

## Objective

Add explicit, pure Station-owned save/accept and discard operations over the one editor session/draft. Save returns an immutable accepted composition snapshot and a clean Station-owned session; discard restores the session's prior Station-owned draft baseline deterministically. Neither action persists data, issues a business command, changes external canonical revision, or claims rollback/compensation.

## Context

WP1-A/B/C/D/E are integrated. WP1-E planning PR #1024 and construction PR #1025 were squash-integrated on 2026-10-09, the latter at `e92d612e0e804ecb004c5d01e33728de0fb2dd6f`. Revalidate fresh main before construction. This is the next dependency-safe tranche of accepted Contract Addendum 002 and WP1 plan. WP1-G UI journey and WP1-H hardening are successors, not scope for this TASK.

## Current behavior

EditorSession owns a base reference and immutable draft transaction. WP1-D applies validated structural changes and increments draft revision once per changed edit. WP1-E projects Preview from the same draft. CompositionDraftTransaction has a Station-local base, draft, findings and dirty flag, but no explicit editor-level save/accept or discard boundary.

## Inputs / contracts

- Current `EditorSession`, exact expected draft revision and `ComponentRegistry`; existing composition draft transaction, validators and projections.
- Preserve `session.base` application/composition identity, canonical revision and currentness; do not invent external persistence or change Core/business state.
- No DOM/UI, remote storage, command execution, durable persistence or provider integration.

## Outputs / contracts

- Pure `acceptEditorDraft(...)` and `discardEditorDraft(...)` APIs exported from station-editor, each with discriminated accepted/rejected immutable results and explicit `changed`.
- Save returns a separately frozen Station-owned accepted composition snapshot (not a persistence receipt) and clean session whose local transaction baseline equals the accepted draft. Discard returns a clean session with draft restored from its local baseline.
- Both changed operations invalidate stale edit intents through exactly one safe local draft-revision increment; unchanged operations are deterministic no-ops preserving the session object. External `session.base.revision` never changes.
- Rejected operations return the exact original session and no accepted composition, without partial mutation.

## Required change

1. Add `packages/station-editor/draft-boundary.ts` and export its entry points from `index.ts`; reuse existing Station composition transaction APIs without changing station-composition.
2. Validate session identity/currentness, base and draft graph hierarchy, registry compatibility, findings, dirty consistency and exact safe expected draft revision at action time. Runtime-malformed or forged input must reject without throwing.
3. Save: when dirty, capture a deep immutable Station-owned composition snapshot, produce a new clean session with its local transaction baseline/draft set to that accepted graph, and increment local draft revision once. Return the accepted composition explicitly, without claiming external canonical persistence or changing base revision.
4. Discard: when dirty, restore a deep immutable draft snapshot from the Station-local transaction baseline, produce a new clean session, increment local draft revision once, and preserve external base identity/revision/currentness. Discard is not a business rollback.
5. Unchanged save/discard are accepted no-ops; malformed, stale, incompatible or unsafe-revision actions fail closed and preserve the same input object.
6. Prove Layers/Inspector/Preview convergence after changed save and discard, including rejection recovery and stale-intent replay. No competing store, implicit selection/focus/active/expansion coupling or C10 promotion.
7. Limit to five allowlisted files and one authoritative implementation commit; no UI, Core/business/persistence, provider/runtime/deploy or arbitrary HTML/CSS/pixels.

## Acceptance criteria

1. **Positive:** changed save returns an explicit accepted Station composition, clean session and unchanged external base revision; changed discard restores prior local baseline and all projections converge.
2. **Negative:** wrong/stale/unsafe revision, stale/unknown currentness, invalid identity/registry, incompatible draft/base and dirty mismatch reject with zero mutation.
3. **Adversarial:** forged/malformed graph, duplicate/cyclic/disconnected nodes, invalid spans, unexpected fields and overflow fail closed without exception or partial acceptance.
4. **Recovery:** after rejection a valid save/discard succeeds; old structural intents become stale after changed boundary operation; no-op repeats are deterministic and retain session identity.
5. **Orthogonality:** identity != placement != presentation != action; ComponentRegistry != AppManifest; selection != focus != active != expansion; C0-C9 preserved, C10 DEFERRED. No Core/business authority or external persistence claim.
6. **Accessibility:** N/A for contract-only tranche without DOM. Keyboard/focus/a11y evidence mandatory when a UI surface is introduced later.

## Non-goals

No DOM/UI, remote save endpoint, durable storage, external canonical revision update, business command, compensation/rollback, C10/Studio, provider/runtime/deploy/secrets, arbitrary HTML/CSS/pixel authoring, or station-composition refactor.

## Evidence expected

Run focused positive/negative/adversarial/recovery and predecessor-integration tests, then `npm run verify` on exact implementation HEAD. Require current exact-head and merge-candidate CI, semantic/architecture review, one commit and file allowlist before integration. IMPLEMENTED != PROVEN != INTEGRATED. Only after TASK-641 integration may WP1-G be materialized.

## Escalation

If the distinction between Station-local accepted baseline and external canonical revision cannot be implemented without changing accepted contracts or modifying station-composition outside the allowlist, record the exact gap and seek separately authorized scope instead of inventing persistence or business authority.
