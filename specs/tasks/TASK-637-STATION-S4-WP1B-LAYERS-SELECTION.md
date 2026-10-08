---
id: TASK-637
title: STATION S4 WP1-B Layers Projection & Selection Contract
status: ready
priority: 637
milestone: STATION-S4-VISUAL-FACTORY-WP1
model_tier: architecture
risk: medium
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-636
context_paths:
  - docs/DOCUMENT_AUTHORITY.md
  - docs/contracts/002-station-visual-factory/ADDENDUM.md
  - docs/current/NEXT_WORK.md
  - project_docs/execution_planning/STATION-S4-VISUAL-FACTORY-WP1-PLAN-01.md
  - packages/station-editor/**
  - packages/station-interaction/**
allowed_paths:
  - packages/station-editor/**
  - packages/station-interaction/**
  - tests/product/station-editor-layers-selection.test.ts
  - specs/tasks/TASK-637-STATION-S4-WP1B-LAYERS-SELECTION.md
  - docs/current/NEXT_WORK.md
forbidden_paths:
  - apps/**
  - packages/core/**
  - provider/**
  - runtime/**
  - deploy/**
max_files: 7
validation:
  - npm run verify
---

# TASK-637 — Station S4 WP1-B Layers Projection & Selection Contract

Status: READY / AUTHORIZED AFTER TASK-636 INTEGRATION
Date: 2026-10-07

## Objective

Materialize the next dependency-safe WP1 slice: derive a deterministic Layers hierarchy from the shared Station editor-session draft and bind explicit single-selection state to stable composition-node references without coupling selection to focus, active context, expansion state, ComponentRegistry identity or AppManifest identity.

## Context

Station S4 WP1-B builds on the integrated WP1-A editor session and its Station-owned draft. The Layers contract must read that same draft and cannot create a second canonical composition store.

## Current behavior

WP1-A exposes a validated editor session and a composition draft transaction. Before WP1-B there is no public deterministic Layers projection or explicit Layers selection contract.

## Inputs / contracts

- An existing `EditorSession` with its current `transaction.draft` composition graph.
- Stable composition-node refs, placement parent refs and component refs from the draft.
- A previous Layers selection and a requested node ref or `null` to clear it.
- No Core, AppManifest, DOM focus, active context or expansion authority.

## Outputs / contracts

- Deterministic rooted Layers hierarchy and stable node-ref index, or a fail-closed invalid-hierarchy result.
- Immutable empty/single selection and accepted/rejected selection results.
- Unknown refs preserve prior selection; neither projection nor selection mutates the editor draft.
- Selection does not imply focus, active context, expansion, persistence or business authority.

## Required change

- project the current editor-session draft into one deterministic Layers hierarchy rooted at the composition root;
- preserve stable composition-node refs independent of array/DOM position;
- expose explicit empty/single selection over known node refs and safe rejection for unknown refs;
- selection changes must not mutate the editor draft or imply focus/active/expansion state;
- malformed graphs (missing root, duplicate/orphan/cyclic or otherwise invalid hierarchy) fail closed rather than inventing tree truth;
- keep this tranche contract-only: no DOM/UI surface yet.

## Acceptance criteria

1. Equivalent valid editor sessions produce the same hierarchy and stable refs.
2. Parent/child relationships are derived from the same draft projection used by the editor session, with no parallel canonical store.
3. Empty/select/clear/query behavior is deterministic; unknown refs fail safely and preserve prior selection.
4. Selection remains orthogonal to focus, active context and expansion; no such state is invented by this contract.
5. Layers projection and selection introduce no business/command/persistence authority and do not mutate the editor draft.
6. Focused executable proof covers happy, malformed/unknown/adversarial and zero-mutation cases.

Accessibility/keyboard is N/A for this contract-only tranche because it introduces no DOM/focus surface. It becomes mandatory when the first Layers UI surface is materialized.

## Non-goals

No Layers DOM/UI, Inspector, Preview, grid/span edit UI, save/discard persistence, C10/Studio, Core/business/command authority, provider/runtime/deploy/secrets, arbitrary HTML/CSS/pixel positioning, or coupling selection to window focus.

## Evidence expected

Focused product proof at `tests/product/station-editor-layers-selection.test.ts` plus `npm run verify` on the exact implementation head. Integration additionally requires the current merge-candidate gate.

## Escalation

Stop rather than widening scope if Layers requires a second composition store, business authority, durable persistence, C10 promotion, or coupling selection to focus/active/expansion.

## Closure rule

Do not begin WP1-C until TASK-637 is implemented, proven, integrated on fresh main, and repository memory is reconciled.
