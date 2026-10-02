---
id: TASK-618
title: Station S3 C04 responsive structural and accessibility preservation
status: ready
depends_on:
  - TASK-617
max_files: 6
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
---

# TASK-618 — Station S3 C04 Responsive Structural / Accessibility Preservation

## Truth base

Materialized from fresh `main@4825395e661b4ec5042a179c4b3a662260b9f53a` after C03 closure reconciliation was integrated. Governing authority is `docs/contracts/001-station-component-grammar/ADDENDUM.md`, `project_docs/execution_planning/STATION-S3-CONSTRUCTION-MATERIALIZATION-01.md`, `project_docs/execution_planning/STATION-S3-QA-GATES-PLAN-01.md`, and the live `docs/current/NEXT_WORK.md`.

## Owner / reuse census

Fresh main already owns canonical composition identity and discrete placement in `packages/station-composition/graph.ts`: `CompositionNode.ref`/`componentRef` are independent from `CompositionNodePlacement`, while placement owns `parentRef`, `slotRef`, `columnSpan`, and `rowSpan`. Graph validation already checks placement through the registry. Existing Station primitives/focus behavior remain owned by their lower layers and are inherited only where preconditions do not change.

C04 therefore must add only a bounded Station-local responsive structural projection/selection over canonical composition placement. It must not create a second composition authority, encode breakpoint/layout state into semantic identity, reorder canonical nodes merely to achieve visual layout, or move keyboard/focus authority into composition.

## Required behavior

Implement the smallest owner-qualified responsive structural contract that:

1. keeps canonical node identity and component identity unchanged across responsive projection;
2. selects explicit responsive placement/span overrides by presentation condition/breakpoint without mutating canonical placement;
3. falls back deterministically to canonical placement when no applicable override exists;
4. preserves canonical/semantic order independently from visual placement;
5. rejects malformed/ambiguous responsive definitions fail-closed rather than silently inventing layout;
6. exposes enough structural metadata for a renderer to preserve semantic/reading order while changing visual spans;
7. remains Station presentation/composition-only and contains no Core/business authority, AppManifest lifecycle, provider/runtime/deploy semantics, or C05+ behavior.

Do not implement a universal CSS/breakpoint engine. Prefer a small pure contract/projection in the existing composition owner.

## Smallest adequate proof

Add focused product proof in the same TASK for:

- identity preserved while responsive placement changes;
- canonical placement remains unchanged after projection;
- deterministic fallback when no override applies;
- semantic node order remains stable while visual placement/span differs;
- malformed/duplicate/ambiguous responsive condition is rejected fail-closed;
- responsive projection does not derive or mutate focus/selection/command/business authority.

Reuse existing composition admission/placement proofs only when their preconditions remain unchanged.

## Test Review / Hardening

Before closure, explicitly review:

- visual reorder accidentally becoming semantic/DOM reorder;
- breakpoint boundary ambiguity and two simultaneously applicable overrides;
- invalid span/slot bypassing existing placement validation;
- responsive projection mutating canonical graph/revision;
- identity regenerated because placement changed;
- hidden/collapsed presentation accidentally changing focus/command target semantics;
- tests that assert only pixels/rendering without structural semantics.

Every uncovered obligation remains `unproven-gap` until executable evidence exists.

## QA Coverage / Evidence Review

Coverage vocabulary is `proven | failed | unproven-gap | not-applicable`. Construction must record inherited proof references, unchanged preconditions, the C04 delta proof, exact-head evidence freshness and any explicit gap. Human acceptance remains separate from machine conformance.

At materialization time all new C04 obligations are `unproven-gap`. C03 and earlier proofs remain inherited only where their owners/contracts are unchanged.

## Validation

Run the focused Station composition/product tests covering this delta, affected package type/lint checks where available, then repository deterministic verification on the final exact head. Required repository/product/frontend gates must be green before closure. Do not claim local execution unless observed.

## Boundaries / non-goals

`ComponentRegistry != AppManifest`; identity != placement != presentation != action; semantic patterns remain above generic primitives; discrete/span composition remains distinct from WindowGeometry; Station remains presentation-only. C05+, AppManifest/C06, provider/runtime/deploy, Core/business authority and C10/Studio are forbidden/deferred.

## Handoff expectation

Construction may begin only after this materialization is integrated into fresh main. Execute this TASK alone, behavior + smallest adequate proof, within `max_files: 6`; leave exact branch/PR/head, files, gates, blockers, proof status and next eligible work in `docs/current/NEXT_WORK.md`.