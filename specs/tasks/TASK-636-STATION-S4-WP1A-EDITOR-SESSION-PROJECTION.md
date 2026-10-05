---
id: TASK-636
title: STATION S4 WP1-A Editor Session & Projection Contract
status: ready
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
  - tests/product/station-editor-session.test.ts
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

Status: READY / AUTHORIZED AFTER MATERIALIZATION MERGE
Date: 2026-10-04

## Objective

Materialize the smallest shared editor foundation contract: a Station-owned editor session/projection over an admitted C0→C9 composition, with explicit base/draft revision and currentness semantics, before any visual editor surface is built.

## Context

Station S3 closed the reusable C0→C9 grammar. Addendum 002 admits the shared visual-factory foundation while keeping C10 deferred. This first tranche establishes the editor-session boundary that later Layers, Inspector, grid/span and Preview projections must share.

## Current behavior

The repository has admitted composition/application/Tool identity and projection contracts, but no shared Station editor-session contract that owns a bounded draft projection with explicit base revision, draft revision and currentness.

## Required change

- stable editor-session identity distinct from component/composition/application identity;
- explicit base composition reference/revision and Station-owned draft revision/currentness;
- deterministic/idempotent session initialization for equivalent valid input;
- projection of existing composition state without copying Core/business authority;
- bounded draft mutation surface for admitted composition fields only;
- stale, unknown, malformed, duplicate or incompatible base refs rejected before draft mutation;
- rejection leaves zero partial draft/canonical mutation;
- result envelope makes accepted/rejected/currentness explicit and does not strengthen unknown/partial state.

## Inputs / contracts

Reuse admitted C0→C9 composition identity/revision/currentness and Station projection concepts. Inputs must carry enough identity, revision and currentness information to reject malformed, stale, unknown, duplicate or incompatible base references before any draft mutation.

## Outputs / contracts

Produce a shared Station-owned editor-session/projection contract and focused executable proof. Any result envelope must expose acceptance/rejection/currentness without claiming Core/business/command/persistence authority.

## Acceptance criteria

- valid initialization is deterministic and idempotent;
- editor-session identity is distinct from composition/component/application identity;
- base and draft revision/currentness are explicit;
- malformed/stale/unknown/duplicate/incompatible inputs fail closed before mutation;
- rejected operations leave zero partial draft or canonical mutation;
- no business/command/persistence authority is introduced;
- focused executable proof covers the required negative/adversarial cases.

Accessibility is N/A because this tranche introduces no DOM/UI/focus/keyboard surface.

## Non-goals

No Layers UI, Inspector UI, Preview UI, grid editor, drag/drop, save persistence, specialized Studio, C10, provider/runtime/deploy/secrets, Core/business/command authority, AI/MCP or arbitrary HTML/CSS.

## Evidence expected

Focused executable proof must cover valid initialization, idempotence, identity separation, revision/currentness, malformed/stale/unknown/duplicate/incompatible inputs, zero-mutation rejection and absence of business/command/persistence authority. The focused proof is materialized at `tests/product/station-editor-session.test.ts`, matching the repository's executable product-test harness. `npm run verify` must pass on the exact task head; integration additionally requires the current merge-candidate gate.

## Conformance handoff — 2026-10-05

Fresh-main revalidation at `a1b05fc39ea7f74b9bf7d430d59284f7fa2497c0` found the TASK proof obligation inconsistent with its allowed paths: `scripts/run-product-tests.mjs` executes product proof only from `tests/product/*.test.ts`, while TASK-636 previously allowed no `tests/product/**` path. Full Product Tests run `37303257376` is GREEN on that exact fresh-main head, so this is a materialization/conformance blocker rather than a product failure. This bounded correction admits exactly one focused proof file and does not widen product semantics, max-files, architecture, or WP authority. Product implementation remains blocked until this correction is integrated with current exact-head/merge-candidate gates. Next eligible work after integration remains TASK-636 only; WP1-B remains forecast.

## Escalation

Stop and mark the tranche BLOCKED/UNPROVEN rather than widening scope if the contract cannot be expressed through the admitted C0→C9 composition/projection boundaries, if implementation would require Core/business authority or durable persistence, or if a new reusable species would be needed. Do not promote C10 implicitly.

## Closure rule

Do not begin WP1-B until TASK-636 is integrated on fresh main with its exact-head proof current and repository memory reconciled.
