---
id: TASK-636
title: STATION S4 WP1-A Editor Session & Projection Contract
status: planned
priority: 636
milestone: STATION-S4-VISUAL-FACTORY-WP1
model_tier: architecture
risk: medium
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-635
context_paths:
  - docs/DOCUMENT_AUTHORITY.md
  - docs/contracts/002-station-visual-factory/ADDENDUM.md
  - docs/current/NEXT_WORK.md
  - project_docs/execution_planning/STATION-S4-VISUAL-FACTORY-WP1-PLAN-01.md
allowed_paths:
  - packages/station-composition/**
  - packages/station-editor/**
  - specs/tasks/TASK-636-STATION-S4-WP1A-EDITOR-SESSION-PROJECTION.md
  - project_docs/execution_planning/STATION-S4-**
  - docs/current/NEXT_WORK.md
forbidden_paths:
  - apps/**
  - packages/core/**
  - provider/**
  - runtime/**
  - deploy/**
max_files: 8
validation:
  - npm run verify
---

# TASK-636 — Station S4 WP1-A Editor Session & Projection Contract

Status: PLANNED / AUTHORIZED AFTER MATERIALIZATION MERGE
Date: 2026-10-04

## Objective

Materialize the smallest shared editor foundation contract: a Station-owned editor session/projection over an admitted C0→C9 composition, with explicit base/draft revision and currentness semantics, before any visual editor surface is built.

## Required behavior

- stable editor-session identity distinct from component/composition/application identity;
- explicit base composition reference/revision and Station-owned draft revision/currentness;
- deterministic/idempotent session initialization for equivalent valid input;
- projection of existing composition state without copying Core/business authority;
- bounded draft mutation surface for admitted composition fields only;
- stale, unknown, malformed, duplicate or incompatible base refs rejected before draft mutation;
- rejection leaves zero partial draft/canonical mutation;
- result envelope makes accepted/rejected/currentness explicit and does not strengthen unknown/partial state.

## Proof obligations

Focused executable proof must cover valid initialization, idempotence, identity separation, revision/currentness, malformed/stale/unknown/incompatible inputs, zero-mutation rejection and absence of business/command/persistence authority. Accessibility is N/A because this tranche introduces no DOM/UI/focus/keyboard surface.

## Non-goals

No Layers UI, Inspector UI, Preview UI, grid editor, drag/drop, save persistence, specialized Studio, C10, provider/runtime/deploy/secrets, Core/business/command authority, AI/MCP or arbitrary HTML/CSS.

## Closure rule

Do not begin WP1-B until TASK-636 is integrated on fresh main with its exact-head proof current and repository memory reconciled.
