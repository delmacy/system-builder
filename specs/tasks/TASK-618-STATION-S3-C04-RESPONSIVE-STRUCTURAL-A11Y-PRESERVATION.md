---
id: TASK-618
title: STATION S3 C04 Responsive Structural and Accessibility Preservation
status: completed
priority: 618
milestone: STATION-S3-COMPONENT-GRAMMAR
model_tier: architecture
risk: medium
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-617
context_paths:
  - docs/DOCUMENT_AUTHORITY.md
  - docs/contracts/001-station-component-grammar/ADDENDUM.md
  - docs/current/NEXT_WORK.md
  - project_docs/execution_planning/STATION-S3-CONSTRUCTION-MATERIALIZATION-01.md
  - project_docs/execution_planning/STATION-S3-QA-GATES-PLAN-01.md
  - packages/station-composition/graph.ts
  - tests/product/station-composition*.test.ts
  - tests/product/station-s3*.test.ts
allowed_paths:
  - packages/station-composition/**
  - tests/product/station-composition*.test.ts
  - tests/product/station-s3*.test.ts
  - specs/tasks/TASK-618-STATION-S3-C04-RESPONSIVE-STRUCTURAL-A11Y-PRESERVATION.md
  - docs/current/NEXT_WORK.md
forbidden_paths:
  - packages/core/**
  - packages/station-app-runtime/**
  - apps/station/**
  - packages/station-interaction/**
  - packages/station-shell/**
  - provider/**
  - runtime/**
  - deploy/**
max_files: 6
validation:
  - npm run lint
  - npm run typecheck
  - npm run test:product
  - npm run check:architecture
  - npm run verify
---

# TASK-618 — STATION S3 C04 Responsive Structural / Accessibility Preservation

## Objective

Implement the smallest owner-qualified responsive structural projection over canonical Station composition placement while preserving canonical identity, semantic/reading order, accessibility-relevant structure, deterministic fallback, and the existing separation of identity, placement, presentation and action.

## Context

Materialized from fresh `main@4825395e661b4ec5042a179c4b3a662260b9f53a` after C03 closure reconciliation was integrated. Governing authority is `docs/contracts/001-station-component-grammar/ADDENDUM.md`, `project_docs/execution_planning/STATION-S3-CONSTRUCTION-MATERIALIZATION-01.md`, `project_docs/execution_planning/STATION-S3-QA-GATES-PLAN-01.md`, and the live `docs/current/NEXT_WORK.md`. Research is input only and gains no authority unless explicitly materialized here.

## Current behavior

Fresh main already owns canonical composition identity and discrete placement in `packages/station-composition/graph.ts`: `CompositionNode.ref`/`componentRef` are independent from `CompositionNodePlacement`, while placement owns `parentRef`, `slotRef`, `columnSpan`, and `rowSpan`. Graph validation already checks placement through the registry. Existing Station primitives, focus, selection and command behavior remain owned by their lower layers and are inherited only where preconditions do not change. No bounded C04 responsive structural projection is yet authoritative.

## Required change

1. Keep canonical node identity and component identity unchanged across responsive projection.
2. Select explicit responsive placement/span overrides by presentation condition/breakpoint without mutating canonical placement.
3. Fall back deterministically to canonical placement when no applicable override exists.
4. Preserve canonical/semantic order independently from visual placement and expose enough structural metadata for a renderer to preserve semantic/reading order while visual spans change.
5. Reject malformed, duplicate or ambiguous responsive definitions fail-closed rather than silently inventing layout.
6. Reuse existing composition admission/placement validation so responsive slot/span data cannot bypass owner validation.
7. Remain Station presentation/composition-only: do not derive or mutate focus, selection, command target, Core/business authority, AppManifest lifecycle, provider/runtime/deploy semantics, or C05+ behavior.
8. Do not implement a universal CSS/breakpoint engine; prefer a small pure contract/projection in the existing composition owner.

## Inputs / contracts

Inputs are the existing canonical composition graph, `CompositionNode` identity/component references, `CompositionNodePlacement` discrete placement/span contract, component-registry placement validation, and inherited lower-layer semantic/focus/interaction contracts whose preconditions remain unchanged. Responsive presentation conditions are projection inputs only; they do not become semantic identity or business authority.

## Outputs / contracts

The output is a bounded Station-local responsive structural projection/selection contract that returns owner-validated projected placement/span plus stable semantic-order metadata and deterministic canonical fallback. Canonical graph/revision/identity/placement remain unchanged. No second composition authority, WindowGeometry coupling, Core/business authority, AppManifest authority, or universal breakpoint engine is created.

## Acceptance criteria

- Canonical node identity and component identity are invariant while responsive placement/span changes.
- Canonical placement and graph/revision remain unchanged after projection.
- No matching override deterministically returns canonical placement.
- Semantic/reading node order remains stable even when visual placement/span differs.
- Malformed, duplicate, ambiguous, boundary-overlapping, invalid-span or invalid-slot responsive definitions fail closed through owner-qualified validation.
- Responsive projection does not derive or mutate focus, selection, command target or business authority.
- `ComponentRegistry != AppManifest`; identity != placement != presentation != action; semantic patterns remain above generic primitives; discrete/span composition remains distinct from WindowGeometry.
- No C05+, AppManifest/C06, provider/runtime/deploy, Core/business authority or C10/Studio scope is introduced.

## Evidence expected

Focused product proof for identity preservation under responsive placement changes, canonical-placement immutability, deterministic fallback, stable semantic order despite visual relocation/span changes, fail-closed malformed/duplicate/ambiguous conditions and invalid slot/span admission, and absence of focus/selection/command/business-authority derivation. Reuse existing composition admission/placement proofs only where their implementation and preconditions remain unchanged. Required exact-head repository/product gates must be fresh on the final SHA.

## Test Review / Hardening

Before closure explicitly challenge visual reorder accidentally becoming semantic/DOM reorder; breakpoint-boundary ambiguity and two simultaneously applicable overrides; invalid span/slot bypassing existing placement validation; responsive projection mutating canonical graph/revision; identity regeneration because placement changed; hidden/collapsed presentation changing focus/command target semantics; and pixel-only tests that do not prove structural semantics. Classify every obligation `proven | failed | unproven-gap | not-applicable`; uncovered obligations remain `unproven-gap`.

## QA Coverage / Evidence Review

Construction must record inherited proof references and unchanged preconditions, focused C04 delta proof, exact-head evidence freshness, and every explicit gap. At materialization time all new C04 obligations are `unproven-gap`; C03 and earlier evidence is inherited only where owners/contracts and preconditions are unchanged. Human product acceptance remains separate from machine conformance. Run focused Station composition/product tests, affected package type/lint checks where available, and deterministic repository verification on the final exact head; do not claim local execution unless observed.

## Non-goals

Universal CSS/breakpoint engine; second composition authority; canonical graph/order mutation for visual layout; WindowGeometry coupling; keyboard/focus/selection/command ownership in composition; Core/business authorization; AppManifest/C06; C05+ behavior; provider/runtime/deploy; C10/Studio.

## Escalation

Stop and rematerialize if implementation needs more than 6 files, any forbidden path, a second composition authority, semantic identity derived from responsive placement, canonical graph/order mutation, lower-layer focus/interaction ownership, Core/business authority, or scope beyond bounded C04 responsive structural/accessibility preservation. Construction may begin only after this materialization is integrated into fresh main.
