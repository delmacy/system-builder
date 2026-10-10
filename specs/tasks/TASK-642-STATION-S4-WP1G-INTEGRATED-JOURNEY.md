---
id: TASK-642
title: STATION S4 WP1-G Integrated Editor Journey
status: completed
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
allowed_paths:
  - tests/product/station-editor-integrated-journey.test.ts
  - specs/tasks/TASK-642-STATION-S4-WP1G-INTEGRATED-JOURNEY.md
  - docs/current/NEXT_WORK.md
forbidden_paths:
  - apps/**
  - packages/core/**
  - packages/station-composition/**
  - provider/**
  - runtime/**
  - deploy/**
max_files: 3
validation:
  - npx tsx --test tests/product/station-editor-integrated-journey.test.ts
  - npm run verify
---

# TASK-642 — WP1-G Integrated Editor Journey

## Objective
Prove one representative Station-owned editor journey across the already integrated WP1-A–F APIs: session initialization, Layers selection, Inspector projection, constrained grid/span edit, Preview convergence, explicit accept/save, further edit and discard. Do not create a second canonical state or introduce UI beyond the accepted WP1 boundary.

## Context

WP1-A–F are integrated. WP1-F/TASK-641 was squash-merged in PR #1028 at `e42b8e882f08153a30571c7fdd7b300c32cc987d`. WP1-G is the next dependency-safe task admitted by Addendum 002 and the WP1 plan. Revalidate main before integration.

## Current behavior

The Station editor already exposes public session, Layers selection, Inspector, grid/span structural intents, Preview, and pure accept/save/discard APIs. These were tested in separate predecessor TASKs, but a single public-API end-to-end journey across all boundaries has not yet been proven by TASK-642. No DOM editor workbench is introduced in this task.

## Inputs / contracts

- One admitted composition, `ComponentRegistry`, Station-owned editor session and exact draft revision.
- Existing public exports of `packages/station-editor` and `packages/station-composition`; do not reach into private module state.
- Preserve base identity, base revision/currentness, one local draft and discrete grid/span rules. `ComponentRegistry != AppManifest`; `selection != focus != active != expansion`.

## Outputs / contracts

- Executable integration test proving the one-session sequence: initialize → Layers selection → Inspector/Preview → constrained span edit → save → further edit → discard.
- Fail-closed negative/adversarial tests and successful recovery, with explicit revision and immutable session assertions.
- Honest evidence accounting: API journey may be proven without claiming DOM/UI, keyboard or accessibility proof for a visual workbench.

## Required change

1. Exercise existing public APIs in `tests/product/station-editor-integrated-journey.test.ts`; do not add another canonical store or expand package APIs.
2. Verify positive edit → Layers/Inspector/Preview convergence → save → edit → discard, including exact local draft revision increments and unchanged external base revision.
3. Exercise stale/unknown/incompatible/malformed or forged inputs; reject atomically with the same original session and recover with a valid operation.
4. Assert selection/focus/active/expansion remain orthogonal and clean save/discard are deterministic no-ops.
5. Classify keyboard/focus/accessibility N/A only for this no-DOM increment; the actual visual workbench remains UNPROVEN.
6. Run `npx tsx --test tests/product/station-editor-integrated-journey.test.ts` and `npm run verify` and record exact-HEAD evidence. One authoritative TASK commit is required for integration; local checkpoints are not integration.

## Acceptance criteria

1. Positive: public-API journey converges across Layers, Inspector and Preview before and after save/discard using one Station-owned draft.
2. Negative/adversarial: stale/unknown/malformed/forged/incompatible edits reject with zero partial mutation; the external base revision stays unchanged.
3. Recovery: valid edit or save succeeds after rejection; changed operations increment local draft revision once, unchanged operations preserve session identity.
4. Orthogonality: identity/placement/presentation/action remain distinct; `ComponentRegistry != AppManifest`; selection/focus/active/expansion remain separate; C0–C9 preserved and C10 DEFERRED.
5. Accessibility: N/A for TASK-642's contract/API-only increment with no DOM/UI; the future visual workbench and keyboard/a11y evidence are UNPROVEN, not implicitly accepted.

## Non-goals

No new DOM/UI, specialized Studio, Core/business/command authority, persistence, provider/runtime/deploy/secrets, arbitrary HTML/CSS/pixels, station-composition modifications, or C10 promotion.

## Evidence expected

Focused positive, negative, adversarial, recovery and predecessor-integration tests, `npm run verify`, clean diff, file allowlist/max_files compliance, and one authoritative TASK commit at integration. GitHub exact-head CI and merge-candidate CI are separate required gates; local QA is not integration. Report IMPLEMENTED / PROVEN / INTEGRATED separately.

## Escalation

If the public APIs cannot prove the admitted integrated journey without new package behavior or changing forbidden paths, record the exact gap and seek separately authorized scope. Do not invent visual-workbench, business, persistence, keyboard or accessibility authority.

## Execution evidence - 2026-10-10
Manual shared-worktree checkpoint: focused journey 6/6 and predecessor journey 38/38 PASS; malformed spans, foreign identities, injected fields and recovery covered. Harness 333/333, handoff 11/11, task catalog 635, architecture, docs and build PASS. npm run verify exit 1 at Windows product-runner command-length limit; full product proof UNPROVEN. PR #1029 old HEAD exact-head/merge-candidate failed required task sections, corrected in this local spec. IMPLEMENTED API proof, partially PROVEN local gates, NOT INTEGRATED. No DOM/keyboard/a11y proof; C10 DEFERRED. See live handoff for log paths and next gate.

## Integrated disposition - 2026-10-10
IMPLEMENTED / PROVEN / INTEGRATED for the bounded API tranche. PR #1029 squash merge `d41085c6747dfceffc5b7b83d8f06cfda61dd651`; tested head `53d6df8972f007390916168072df85ba4d7cf797`. Full repository verify passed in exact-head run 38049443498 and merge-candidate run 38049443470; heavy 38049443490 and handoff 38049443502 also passed. Earlier local failure remains historical Windows environment evidence. This does not close WP1 or prove DOM, keyboard or visual accessibility.
