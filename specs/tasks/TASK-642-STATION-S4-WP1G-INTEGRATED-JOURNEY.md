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

## Current state and dependencies
WP1-A–F are integrated. WP1-F/TASK-641 was squash-merged as PR #1028 at `e42b8e882f08153a30571c7fdd7b300c32cc987d`. The live NEXT_WORK pointer was not yet reconciled after that merge. WP1-G is the next dependency-safe task. All implementation here remains local-first on the shared Station S4 serial worktree.

## Required work
1. Create one executable integrated-journey test that exercises existing public exports of `packages/station-editor` without reaching into private module state.
2. Cover positive edit → Layers/Inspector/Preview convergence → save → edit → discard, including exact revision behavior and preservation of external base revision.
3. Cover negative/adversarial stale/unknown/incompatible or malformed inputs, rejection without partial mutation, and recovery with a valid operation.
4. Verify selection/focus/active/expansion remain orthogonal and no Core/business/persistence authority is inferred.
5. Explicitly classify keyboard/focus/accessibility: N/A only if no DOM/UI is introduced by this TASK; UI journey remains UNPROVEN and must not be represented as a working visual interface.
6. Run focused tests and `npm run verify`; record exact HEAD and evidence. Never claim PROVEN until executable results exist.

## Acceptance
- Integrated journey uses one Station-owned session/draft and public projections.
- Positive, negative, adversarial, recovery and predecessor integration cases are executable and passing.
- Invalid or stale edits fail closed without changing session or external canonical base.
- Changed save/discard increment local draft revision safely; unchanged operations preserve identity.
- No introduced DOM/UI, specialized Studio, C10, persistence, provider/runtime/deploy, arbitrary HTML/CSS or pixel editor.
- Remaining actual visual workbench and a11y/keyboard proof gaps are explicitly reported, not silently promoted.

## Execution constraints
Only three allowlisted files, one authoritative TASK commit after tests. WP1-H hardening/closure cannot start before WP1-G evidence is PROVEN and integrated under repository governance. Local commits are checkpoints; GitHub integration is periodic and separately gated.
