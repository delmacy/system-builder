---
id: TASK-616
title: STATION S3 C02 Canonical Revision and Projection Currentness
status: verification
priority: 616
milestone: STATION-S3-COMPONENT-GRAMMAR
model_tier: architecture
risk: medium
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-615
context_paths:
  - docs/DOCUMENT_AUTHORITY.md
  - docs/contracts/001-station-component-grammar/ADDENDUM.md
  - docs/current/NEXT_WORK.md
  - project_docs/execution_planning/STATION-S3-SCOPE-WBS-WP1-PLAN-01.md
  - packages/station-composition/draft-transaction.ts
  - packages/station-composition/graph.ts
  - packages/station-composition/index.ts
  - tests/product/station-composition.test.ts
allowed_paths:
  - packages/station-composition/**
  - tests/product/station-composition.test.ts
  - tests/product/station-composition-canonical-revision.test.ts
  - specs/tasks/TASK-616-STATION-S3-C02-CANONICAL-REVISION-PROJECTIONS.md
  - docs/current/NEXT_WORK.md
forbidden_paths:
  - packages/runtime-core/**
  - packages/deploy/**
  - packages/compiler/**
  - packages/station-app-runtime/**
  - packages/ui-core/**
  - apps/station/**
max_files: 6
validation:
  - npm run lint
  - npm run typecheck
  - npm run test:product
  - npm run check:architecture
  - npm run verify
---

# TASK-616 — STATION S3 C02 Canonical Revision & Projection Currentness

## Objective

Establish the smallest Station-local C02 contract in which one canonical composition revision owns mutation currentness and Inspector/Layers/Graph/source-YAML/Preview remain immutable projections that can deterministically report current or stale state without acquiring mutation or business authority.

## Context

TASK-615/C01 is CLOSED / PROVEN. Fresh-main census at `main@2921ecb1836da44f50f9cbf7982837cf10e72a9a` shows `packages/station-composition/draft-transaction.ts` already owns immutable base/draft mutation and preview snapshots, but it has no canonical revision token or projection-currentness contract. `PropertyInspector` and Station Tree/preview surfaces remain presentation consumers and must not become independent authorities.

This is the smallest dependency-safe C02 lot. It preserves `ComponentRegistry != AppManifest`, identity != placement != presentation != action, semantic patterns above primitives, span/discrete composition, Station presentation/composition-only, and no Core/business authority. C03+ and C10 remain out of scope.

## Current behavior

A valid `CompositionDraftMutation` returns a new immutable transaction; invalid mutation returns the original transaction. `projectCompositionPreview` snapshots the draft. There is no Station-owned monotonically advancing canonical revision and no generic projection snapshot that can say whether it is current against that owner revision.

## Required change

1. Add a bounded Station composition revision owner around the existing validated draft transaction.
2. A successful admitted mutation that changes canonical draft state advances exactly one revision; rejection or semantic no-op does not advance it.
3. Expose a generic immutable projection snapshot carrying the owner revision from which it was derived.
4. Expose deterministic current/stale classification by comparing a projection revision to the current canonical revision.
5. A stale expected revision must reject before mutation so it cannot silently overwrite newer canonical state.
6. Do not encode Inspector/Layers/Graph/YAML/Preview as authorities; they are projection labels/consumers only.

## Inputs / contracts

Existing `CompositionDraftTransaction`, `CompositionDraftMutation`, registry validation, graph snapshots, and C01 admission/schema proofs. C01 proofs are inherited because this task does not change admission contracts.

## Outputs / contracts

A Station-local canonical revision state plus generic projection snapshot/currentness helpers. The canonical owner remains the only revision authority in this lot; projection snapshots are immutable derived values.

## Acceptance criteria

- Canonical state starts at an explicit revision and exposes its validated transaction.
- One state-changing admitted mutation advances exactly one canonical revision.
- Invalid mutation preserves canonical object/revision and returns existing validation findings.
- Semantic no-op preserves canonical revision.
- Projection snapshot records the canonical revision used to derive it and does not mutate owner state.
- Projection is current only when its revision equals the canonical revision; an older projection reports stale.
- Mutation carrying stale expected revision rejects before mutation and cannot overwrite newer state.
- No projection label (`inspector`, `layers`, `graph`, `source-yaml`, `preview`) acquires mutation/authority semantics.
- No forbidden path, C03+ semantics, AppManifest, Core/business authority, provider/runtime/deploy or C10/Studio scope is introduced.

## Evidence expected

Focused product tests prove revision advance, invalid/no-op non-advance, immutable projection derivation, current/stale classification, stale-write rejection, and convergence of multiple projection labels to the same canonical revision. Inherited C01 admission proofs are not duplicated unless their preconditions change.

## Test Review / Hardening gate

Before closure inspect off-by-one revision changes, rejected/no-op mutation increments, stale-write escape, projection snapshots that accidentally alias mutable owner state, false-positive currentness, and accidental authority encoded in projection labels. Classify findings `proven | failed | unproven-gap | not-applicable`.

## QA Coverage / Evidence gate

Closure requires SHA-scoped focused evidence plus declared repository gates. Missing evidence remains `unproven-gap`; human acceptance remains separate from machine conformance.

## Non-goals

C03 command/effect/retry/compensation semantics; UI wiring; AppManifest/runtime/deploy/provider expansion; Core/business contracts; C10/Studio; AI/MCP; broad source-YAML authoring; re-opening C01 without regression evidence.

## Escalation

Stop/rematerialize if the implementation requires more than 6 changed files, a forbidden path, UI/runtime/Core authority, or semantics beyond revision ownership/projection currentness.
