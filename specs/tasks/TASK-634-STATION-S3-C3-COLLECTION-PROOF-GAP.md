---
id: TASK-634
title: STATION S3 C3 Collection Proof Gap
status: ready
priority: 634
milestone: STATION-S3-COMPONENT-GRAMMAR
model_tier: architecture
risk: medium
architecture_impact: false
executor_preference: any
depends_on:
  - TASK-633
context_paths:
  - docs/DOCUMENT_AUTHORITY.md
  - docs/contracts/001-station-component-grammar/ADDENDUM.md
  - docs/current/NEXT_WORK.md
  - project_docs/execution_planning/STATION-S3-QA-GATES-PLAN-01.md
  - project_docs/execution_planning/STATION-S3-TASK-633-GATE-B-COVERAGE-REVIEW-01.md
allowed_paths:
  - packages/station-composition/**
  - tests/product/station-s3-c03*.test.ts
  - specs/tasks/TASK-634-STATION-S3-C3-COLLECTION-PROOF-GAP.md
  - docs/current/NEXT_WORK.md
forbidden_paths:
  - packages/core/**
  - packages/station-application/**
  - packages/station-tool/**
  - packages/station-provider-boundary/**
  - apps/station/**
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

# TASK-634 — Station S3 C3 Collection Proof Gap

Status: MATERIALIZED / CONSTRUCTION NOT YET ADMITTED
Date: 2026-10-04
Predecessor: TASK-633 Gate B integrated with C3 Collection / Ticketing `unproven-gap`
Truth base: `main@9bdcc9b65ec718f38e77cf9a1d5368856e3b7977`

## Objective
Close only the C3 Collection proof gap identified by Gate B: prove keyed membership/topology/order and the distinction `visual order != semantic order` with the smallest executable Station-owned evidence.

## Context
Gate B found no representative executable proof for the C3 Collection obligation required by the S3 QA plan. Existing C04 responsive semantic-order preservation does not prove keyed Collection reorder semantics. This follow-up is proof-driven and does not authorize a Ticketing product or a generic drag/drop/reparent system.

## Current behavior
Integrated S3 slices prove adjacent admission/currentness and responsive projection obligations, but C3 Collection remains `unproven-gap` because representative executable keyed membership/topology/order plus reorder-distinction evidence is absent.

## Required change
Add only the smallest in-memory Collection contract/behavior necessary to represent stable keyed membership, deterministic topology/order and an explicit semantic order distinct from a visual projection/order. Reorder/projection operations must preserve semantic identity and fail closed on malformed, unknown, duplicate, stale or ambiguous references before canonical mutation. Reuse C02 currentness only where its preconditions remain unchanged.

## Inputs / contracts
- Accepted S3 identity/composition boundaries and C02 currentness under unchanged preconditions.
- Stable collection/member keys that do not encode placement or presentation.
- Canonical semantic membership/topology/order plus a distinct visual projection/order.
- Adversarial malformed/unknown/duplicate/stale/ambiguous references for fail-closed proof.

## Outputs / contracts
- Deterministic in-memory Collection state with stable keyed membership and canonical semantic order.
- A visual-order projection/reorder result demonstrably distinct from canonical semantic order unless an explicit semantic reorder operation is admitted by this bounded contract.
- Deterministic rejection before canonical mutation with zero partial mutation.
- No business/Core/command authority, generic DnD/reparent engine, UI/DOM ownership, persistence, provider/runtime/deploy/secrets, Tool/Application mutation, C10/Studio or AI/MCP authority.

## Acceptance criteria
1. Stable member identity is independent of placement, presentation and action.
2. Keyed membership/topology/order is deterministic and rejects duplicate or unknown members fail-closed.
3. Visual projection/reorder can differ from canonical semantic order without silently mutating semantic order.
4. Any explicitly admitted semantic reorder is deterministic, preserves keyed membership/topology invariants and is distinguishable from visual-only order.
5. Malformed, stale or ambiguous reorder/reference input fails before canonical mutation with zero partial mutation.
6. Existing C02 currentness may be inherited only under unchanged preconditions; this TASK does not strengthen its authority.
7. Focused executable evidence covers positive membership/order, visual-vs-semantic distinction, deterministic semantic reorder if present, and adversarial rejection/zero-mutation cases.
8. Test Review/Hardening finds no false-positive proof based only on rendered/pixel order and no authority expansion.
9. QA Coverage/Evidence Review can map the resulting exact evidence to C3 Collection and the Ticketing pressure-case obligation without claiming a Ticketing product.
10. Exact-head repository verification and a distinct current merge-candidate must be GREEN before closure/merge.

## Non-goals
Ticketing product construction; generic drag/drop/reparent engine; arbitrary tree editing; UI/DOM/accessibility changes; durable persistence/storage; provider/runtime/deploy/secrets; command/business/Core authority; Tool/Application mutation; C07B/C08; C10/Studio; AI/MCP.

## Evidence expected
- Focused C3 executable proof for keyed membership/topology/order.
- Explicit executable proof that visual order and semantic order are separate authorities.
- Adversarial duplicate/unknown/malformed/stale/ambiguous reference proof with zero canonical mutation.
- Regression evidence preserving existing Station composition/currentness boundaries under unchanged preconditions.
- Current exact-head repository verification plus distinct merge-candidate GREEN on the final evidence identity.

## Test Review / Hardening
Challenge the focused proof for accidental coupling of identity to index/placement, tests that assert only rendered order, silent semantic mutation through visual reorder, duplicate-key acceptance, stale/ambiguous reorder references and partial mutation on rejection. Any uncovered obligation remains `unproven-gap` rather than PASS.

## QA Coverage / Evidence Review
Coverage must explicitly account for C3 keyed membership/topology/order and `visual order != semantic order`, identify inherited C02 proof/preconditions, record the new exact evidence identity, and state whether the Ticketing representative pressure-case obligation is now proven or still has a bounded gap. This TASK cannot promote unrelated C0-C10 levels.

## Escalation
STOP and rematerialize if the proof requires more than six files, crosses a forbidden owner, needs UI/DnD/reparent behavior, changes a public shared contract beyond this bounded Collection owner, or introduces Core/business/command/provider/runtime/persistence authority.

## Construction admission
Construction is NOT authorized merely by this file. First obtain current materialization exact-head repository verification plus a distinct current Merge Candidate CI, integrate this materialization, reconcile `docs/current/NEXT_WORK.md` on fresh main, and only then execute the smallest TASK-634 behavior + proof delta.
